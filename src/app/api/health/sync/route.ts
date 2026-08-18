import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const healthSampleSchema = z.object({
  Type: z.string().optional(),
  type: z.string().optional(),
  SampleType: z.string().optional(),
  sampleType: z.string().optional(),
  Name: z.string().optional(),
  name: z.string().optional(),
  Qty: z.union([z.number(), z.string()]).optional(),
  qty: z.union([z.number(), z.string()]).optional(),
  Value: z.union([z.number(), z.string()]).optional(),
  value: z.union([z.number(), z.string()]).optional(),
  Date: z.string().optional(),
  date: z.string().optional(),
  StartDate: z.string().optional(),
  startDate: z.string().optional()
}).passthrough()

const payloadSchema = z.union([
  z.array(z.union([z.number(), z.string(), healthSampleSchema])),
  z.object({ data: z.array(z.union([z.number(), z.string(), healthSampleSchema])) }).passthrough(),
  healthSampleSchema,
  z.record(z.string(), z.any())
])

async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(key)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { error: 'Method Not Allowed. Health synchronization requires authenticated POST requests with header-based credentials.' },
    { status: 405 }
  )
}

export async function POST(req: NextRequest) {
  const requestTime = new Date().toISOString()
  let syncKeyId: string | null = null
  let authenticatedUserId: string | null = null
  let syncStatus = 'failed'
  let errorCode: string | null = null
  let acceptedRecords = 0
  let rejectedRecords = 0

  // 1. Initialize Supabase Admin Client (Service Role for isolated verification)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Service Unavailable' }, { status: 503 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const logSync = async () => {
    try {
      await supabase.from('sync_logs').insert({
        sync_key_id: syncKeyId,
        user_id: authenticatedUserId,
        request_time: requestTime,
        completion_time: new Date().toISOString(),
        status: syncStatus,
        accepted_records: acceptedRecords,
        rejected_records: rejectedRecords,
        source: req.headers.get('user-agent') || 'Apple-Shortcuts',
        error_code: errorCode
      })
    } catch (e) {
      console.error('Failed to write sync_log', e)
    }
  }

  const generic401 = async (code: string = 'unauthorized') => {
    syncStatus = 'failed'
    errorCode = code
    await logSync()
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 2. Reject URL Secrets or Query Parameters (Zero-Trust Rule: No secrets in URLs)
    const url = new URL(req.url)
    if (url.searchParams.has('key') || url.searchParams.has('token') || url.searchParams.has('weight') || url.searchParams.has('secret')) {
      return generic401('url_secrets_rejected')
    }

    // 3. Payload size check (Max 5MB)
    const contentLength = Number(req.headers.get('content-length') || 0)
    if (contentLength > 5 * 1024 * 1024) {
      syncStatus = 'failed'
      errorCode = 'payload_too_large'
      await logSync()
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
    }

    // 4. Header-Based Authentication Only (X-Nexora-Sync-Key or Authorization Bearer)
    let syncKey = req.headers.get('X-Nexora-Sync-Key')
    if (!syncKey) {
      const authHeader = req.headers.get('Authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        syncKey = authHeader.substring(7)
      }
    }

    if (!syncKey || syncKey.trim().length < 16) {
      return generic401('missing_or_invalid_key_header')
    }

    const keyHash = await hashKey(syncKey)
    const keyPrefix = syncKey.substring(0, 8)

    const { data: keyRecord, error: keyError } = await supabase
      .from('sync_keys')
      .select('id, user_id, active, expires_at, revoked_at, failed_attempts')
      .eq('key_prefix', keyPrefix)
      .eq('key_hash', keyHash)
      .single()

    if (keyError || !keyRecord) {
      return generic401('key_lookup_failed')
    }

    if (!keyRecord.active) {
      return generic401('key_inactive')
    }

    // Check expiration or revocation
    if (
      keyRecord.revoked_at ||
      (keyRecord.expires_at && new Date(keyRecord.expires_at) < new Date())
    ) {
      await supabase.from('sync_keys').update({
        failed_attempts: (keyRecord.failed_attempts || 0) + 1
      }).eq('id', keyRecord.id)
      return generic401('key_revoked_or_expired')
    }

    // Authenticated User Derived ONLY from the validated key record (Zero hardcoded fallback)
    syncKeyId = keyRecord.id
    authenticatedUserId = keyRecord.user_id

    await supabase.from('sync_keys').update({ last_used_at: new Date().toISOString() }).eq('id', syncKeyId)

    // 5. Parse & Validate Payload
    const textBody = await req.text()
    let rawBody: unknown = null
    try {
      rawBody = JSON.parse(textBody)
    } catch {
      rawBody = textBody
    }

    const parseResult = payloadSchema.safeParse(rawBody)
    if (!parseResult.success) {
      syncStatus = 'failed'
      errorCode = 'malformed_payload'
      await logSync()
      return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
    }

    const body = parseResult.data
    let rawItems: unknown[] = []

    if (Array.isArray(body)) {
      rawItems = body
    } else if (typeof body === 'object' && body !== null) {
      if ('data' in body && Array.isArray((body as any).data)) {
        rawItems = (body as any).data
      } else {
        rawItems = Object.values(body).flat()
      }
    } else if (body !== undefined && body !== null) {
      rawItems = [body]
    }

    if (rawItems.length > 500) {
      syncStatus = 'failed'
      errorCode = 'too_many_samples'
      await logSync()
      return NextResponse.json({ error: 'Too many samples (max 500)' }, { status: 400 })
    }

    const healthLogsToInsert: Record<string, unknown>[] = []
    const bodyMeasurementsToInsert: Record<string, unknown>[] = []

    if (rawItems.length > 0) {
      rawItems.forEach((item: unknown) => {
        let numVal: number | null = null
        let rawType = 'steps'
        let date = new Date().toISOString()

        if (typeof item === 'number' || (typeof item === 'string' && !isNaN(Number(item)))) {
          numVal = Number(item)
          rawType = (numVal >= 40 && numVal <= 200) ? 'weight' : 'steps'
        } 
        else if (typeof item === 'object' && item !== null) {
          const typedItem = item as Record<string, unknown>
          const val = typedItem.Qty ?? typedItem.qty ?? typedItem.Value ?? typedItem.value ?? typedItem.avg ?? typedItem.Count ?? typedItem.count ?? typedItem.Quantity ?? typedItem.quantity ?? typedItem.Amount ?? typedItem.amount ?? typedItem.val ?? typedItem.num ?? typedItem.weight ?? typedItem.Weight ?? typedItem.energy ?? typedItem.calories ?? typedItem.steps
          rawType = (typedItem.Type || typedItem.type || typedItem.SampleType || typedItem.sampleType || typedItem.Name || typedItem.name || typedItem['Health Sample Type'] || 'steps').toString().toLowerCase()
          const itemDate = typedItem.Date || typedItem.date || typedItem.StartDate || typedItem.startDate
          date = typeof itemDate === 'string' ? itemDate : new Date().toISOString()
          if (val !== undefined && val !== null && !isNaN(Number(val))) {
            numVal = Number(val)
          }
        }

        if (numVal !== null && !isNaN(numVal)) {
          acceptedRecords++
          // Strictly stamp with authenticatedUserId — ignore any user_id injected into the payload!
          if (rawType.includes('weight') || rawType.includes('mass') || rawType.includes('body_weight')) {
            bodyMeasurementsToInsert.push({
              user_id: authenticatedUserId,
              date: date.split('T')[0],
              weight_kg: numVal,
              notes: 'Secure Apple Health Sync'
            })
            healthLogsToInsert.push({
              user_id: authenticatedUserId,
              log_type: 'weight',
              log_date: date,
              value_numeric: numVal,
              notes: 'Secure Apple Health Sync'
            })
          }
          else if (rawType.includes('fat')) {
            healthLogsToInsert.push({
              user_id: authenticatedUserId,
              log_type: 'body_fat',
              log_date: date,
              value_numeric: numVal,
              notes: 'Secure Apple Health Sync'
            })
            bodyMeasurementsToInsert.push({
              user_id: authenticatedUserId,
              date: date.split('T')[0],
              body_fat_percentage: numVal,
              notes: 'Secure Apple Health Sync'
            })
          }
          else {
            healthLogsToInsert.push({
              user_id: authenticatedUserId,
              log_type: rawType.includes('step') ? 'steps' : rawType.includes('energy') || rawType.includes('calorie') || rawType.includes('active') ? 'active_calories' : 'heart_rate',
              log_date: date,
              value_numeric: numVal,
              notes: 'Secure Apple Health Sync'
            })
          }
        } else {
          rejectedRecords++
        }
      })
    }

    if (healthLogsToInsert.length > 0) {
      await supabase.from('health_logs').insert(healthLogsToInsert)
    }
    if (bodyMeasurementsToInsert.length > 0) {
      await supabase.from('body_measurements').insert(bodyMeasurementsToInsert)
    }

    syncStatus = 'success'
    errorCode = null
    await logSync()
    
    return NextResponse.json({
      success: true,
      message: 'Apple Health data synced securely to NEXORA FIT!',
      syncedRecords: acceptedRecords
    }, { status: 200 })

  } catch (err: unknown) {
    console.error('Health sync internal error:', err)
    syncStatus = 'failed'
    errorCode = 'internal_error'
    await logSync()
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

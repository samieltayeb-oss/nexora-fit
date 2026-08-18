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
    interface ParsedSample {
      type: string
      value: number
      date: string
      unit?: string
    }

    const parsedSamples: ParsedSample[] = []

    const processItem = (keyHint: string, item: unknown) => {
      if (item === null || item === undefined) return

      let numVal: number | null = null
      let rawType = keyHint ? keyHint.toLowerCase() : 'steps'
      let date = new Date().toISOString()
      let unit = ''

      if (typeof item === 'number' || (typeof item === 'string' && !isNaN(Number(item)))) {
        numVal = Number(item)
        if (!keyHint || keyHint === 'data' || keyHint === 'items') {
          rawType = (numVal >= 35 && numVal <= 250) ? 'weight' : 'steps'
        }
      } else if (typeof item === 'object' && item !== null) {
        const obj = item as Record<string, unknown>
        const val = obj.Value ?? obj.value ?? obj.Qty ?? obj.qty ?? obj.avg ?? obj.Count ?? obj.count ?? obj.Quantity ?? obj.quantity ?? obj.Amount ?? obj.amount ?? obj.val ?? obj.num ?? obj.weight ?? obj.Weight ?? obj.energy ?? obj.calories ?? obj.steps
        const t = obj.Type || obj.type || obj.SampleType || obj.sampleType || obj.Name || obj.name || obj['Health Sample Type'] || keyHint || 'steps'
        rawType = t.toString().toLowerCase()
        const itemDate = obj.Date || obj.date || obj.StartDate || obj.startDate || obj.EndDate || obj.endDate
        date = typeof itemDate === 'string' ? itemDate : new Date().toISOString()
        unit = (obj.Unit || obj.unit || '').toString().toLowerCase()

        if (val !== undefined && val !== null && !isNaN(Number(val))) {
          numVal = Number(val)
        }
      }

      if (numVal !== null && !isNaN(numVal)) {
        // Handle lbs to kg conversion if unit is lb or lbs
        if ((unit.includes('lb') || unit.includes('pound')) && numVal > 70) {
          numVal = Number((numVal * 0.45359237).toFixed(2))
        }

        parsedSamples.push({
          type: rawType,
          value: numVal,
          date,
          unit
        })
      }
    }

    if (Array.isArray(body)) {
      body.forEach((item) => processItem('', item))
    } else if (typeof body === 'object' && body !== null) {
      const objBody = body as Record<string, unknown>
      if ('data' in objBody && Array.isArray(objBody.data)) {
        objBody.data.forEach((item) => processItem('', item))
      } else {
        // Iterate every key-value pair in the object
        for (const [key, value] of Object.entries(objBody)) {
          if (Array.isArray(value)) {
            value.forEach((v) => processItem(key, v))
          } else {
            processItem(key, value)
          }
        }
      }
    } else if (body !== undefined && body !== null) {
      processItem('', body)
    }

    if (parsedSamples.length > 500) {
      syncStatus = 'failed'
      errorCode = 'too_many_samples'
      await logSync()
      return NextResponse.json({ error: 'Too many samples (max 500)' }, { status: 400 })
    }

    const healthLogsToInsert: Record<string, unknown>[] = []
    const bodyMeasurementsToInsert: Record<string, unknown>[] = []

    parsedSamples.forEach((sample) => {
      acceptedRecords++
      const rawType = sample.type
      const numVal = sample.value
      const date = sample.date

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
      } else if (rawType.includes('fat')) {
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
      } else if (rawType.includes('glucose') || rawType.includes('sugar')) {
        healthLogsToInsert.push({
          user_id: authenticatedUserId,
          log_type: 'blood_glucose',
          log_date: date,
          value_numeric: numVal,
          notes: 'Secure Apple Health Sync'
        })
      } else if (rawType.includes('energy') || rawType.includes('calorie') || rawType.includes('active') || rawType.includes('burn')) {
        healthLogsToInsert.push({
          user_id: authenticatedUserId,
          log_type: 'active_calories',
          log_date: date,
          value_numeric: numVal,
          notes: 'Secure Apple Health Sync'
        })
      } else {
        healthLogsToInsert.push({
          user_id: authenticatedUserId,
          log_type: rawType.includes('step') ? 'steps' : 'heart_rate',
          log_date: date,
          value_numeric: numVal,
          notes: 'Secure Apple Health Sync'
        })
      }
    })

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

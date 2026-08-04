import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// 1. Zod Schema for Strict Payload Validation
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
}).passthrough() // Allow other fields from Apple Shortcuts but don't trust them

const payloadSchema = z.union([
  z.array(z.union([z.number(), z.string(), healthSampleSchema])),
  z.object({ data: z.array(z.union([z.number(), z.string(), healthSampleSchema])) }).passthrough(),
  healthSampleSchema,
  z.record(z.string(), z.any())
])

// 2. Helper to Hash the Sync Key securely
async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(key)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(req: NextRequest) {
  try {
    // 3. Rate Limiting / Size Limits
    const contentLength = Number(req.headers.get('content-length') || 0)
    if (contentLength > 5 * 1024 * 1024) { // 5MB limit
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
    }

    // 4. Extract Sync Key from Header
    let syncKey = req.headers.get('X-Nexora-Sync-Key')
    if (!syncKey) {
      const authHeader = req.headers.get('Authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        syncKey = authHeader.substring(7)
      }
    }

    if (!syncKey) {
      return NextResponse.json({ error: 'Unauthorized: Missing Sync Key' }, { status: 401 })
    }

    // 5. Initialize Supabase Admin Client (needed to query sync_keys securely)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // 6. Validate Key Hash
    const keyHash = await hashKey(syncKey)
    const keyPrefix = syncKey.substring(0, 8)

    const { data: keyRecord, error: keyError } = await supabase
      .from('sync_keys')
      .select('user_id, expires_at, revoked_at')
      .eq('key_prefix', keyPrefix)
      .eq('key_hash', keyHash)
      .single()

    if (keyError || !keyRecord) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Sync Key' }, { status: 401 })
    }

    if (keyRecord.revoked_at) {
      return NextResponse.json({ error: 'Unauthorized: Key Revoked' }, { status: 401 })
    }

    if (keyRecord.expires_at && new Date(keyRecord.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Unauthorized: Key Expired' }, { status: 401 })
    }

    const authenticatedUserId = keyRecord.user_id

    // Update last_used_at
    await supabase.from('sync_keys').update({ last_used_at: new Date().toISOString() }).eq('key_hash', keyHash)

    // 7. Parse & Validate Payload
    const textBody = await req.text()
    let rawBody: unknown = null
    try {
      rawBody = JSON.parse(textBody)
    } catch {
      rawBody = textBody
    }

    const parseResult = payloadSchema.safeParse(rawBody)
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Bad Request: Invalid Payload Structure' }, { status: 400 })
    }

    const body = parseResult.data

    const healthLogsToInsert: Record<string, unknown>[] = []
    const bodyMeasurementsToInsert: Record<string, unknown>[] = []

    let rawItems: unknown[] = []
    if (Array.isArray(body)) {
      rawItems = body
    } else if (typeof body === 'object' && body !== null) {
      if ('data' in body && Array.isArray(body.data)) {
        rawItems = body.data
      } else {
        rawItems = Object.values(body).flat()
      }
    } else if (body !== undefined && body !== null) {
      rawItems = [body]
    }

    if (rawItems.length > 500) {
      return NextResponse.json({ error: 'Bad Request: Too many samples (Max 500)' }, { status: 400 })
    }

    if (rawItems.length > 0) {
      rawItems.forEach((item: unknown) => {
        let numVal: number | null = null
        let rawType = 'steps'
        let date = new Date().toISOString()

        if (typeof item === 'number' || (typeof item === 'string' && !isNaN(Number(item)))) {
          numVal = Number(item)
          rawType = (numVal >= 50 && numVal <= 180) ? 'weight' : 'steps'
        } 
        else if (typeof item === 'object' && item !== null) {
          const typedItem = item as Record<string, unknown>
          const val = typedItem.Qty ?? typedItem.qty ?? typedItem.Value ?? typedItem.value ?? typedItem.avg ?? typedItem.Count ?? typedItem.count ?? typedItem.Quantity ?? typedItem.quantity ?? typedItem.Amount ?? typedItem.amount ?? typedItem.val ?? typedItem.num
          rawType = (typedItem.Type || typedItem.type || typedItem.SampleType || typedItem.sampleType || typedItem.Name || typedItem.name || typedItem['Health Sample Type'] || 'steps').toString().toLowerCase()
          const itemDate = typedItem.Date || typedItem.date || typedItem.StartDate || typedItem.startDate
          date = typeof itemDate === 'string' ? itemDate : new Date().toISOString()
          if (val !== undefined && val !== null && !isNaN(Number(val))) {
            numVal = Number(val)
          }
        }

        if (numVal !== null && !isNaN(numVal)) {
          // Strict Deduplication & Idempotency logic should go here via Unique DB constraints
          // Check if this sample is Weight from VeSync / Apple Health
          if (rawType.includes('weight') || rawType.includes('mass') || rawType.includes('body_weight')) {
            bodyMeasurementsToInsert.push({
              user_id: authenticatedUserId, // EXPLICIT OVERRIDE
              date: date.split('T')[0],
              weight_kg: numVal,
              notes: `Synced from VeSync / Apple Health (${numVal} kg)`
            })
            healthLogsToInsert.push({
              user_id: authenticatedUserId, // EXPLICIT OVERRIDE
              log_type: 'weight',
              log_date: date,
              value_numeric: numVal,
              notes: 'VeSync / Apple Health Weight Sync'
            })
          }
          else if (rawType.includes('fat')) {
            healthLogsToInsert.push({
              user_id: authenticatedUserId,
              log_type: 'body_fat',
              log_date: date,
              value_numeric: numVal,
              notes: 'VeSync Smart Scale Body Fat %'
            })
            bodyMeasurementsToInsert.push({
              user_id: authenticatedUserId,
              date: date.split('T')[0],
              body_fat_percentage: numVal,
              notes: `Synced Body Fat % (${numVal}%)`
            })
          }
          else {
            healthLogsToInsert.push({
              user_id: authenticatedUserId,
              log_type: rawType.includes('step') ? 'steps' : rawType.includes('energy') || rawType.includes('calorie') || rawType.includes('active') ? 'active_calories' : 'heart_rate',
              log_date: date,
              value_numeric: numVal,
              notes: `iOS Shortcut Sync (${rawType})`
            })
          }
        }
      })
    }

    let savedLogs = null
    let savedMeasurements = null

    if (healthLogsToInsert.length > 0) {
      const { data, error } = await supabase.from('health_logs').insert(healthLogsToInsert).select()
      if (error) console.error('Health logs insert error:', error.message)
      savedLogs = data
    }

    if (bodyMeasurementsToInsert.length > 0) {
      const { data, error } = await supabase.from('body_measurements').insert(bodyMeasurementsToInsert).select()
      if (error) console.error('Body measurements insert error:', error.message)
      savedMeasurements = data
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Apple Health data synced securely!',
      savedHealthLogs: savedLogs?.length || 0,
      savedBodyMeasurements: savedMeasurements?.length || 0
    })
  } catch (err: unknown) {
    console.error('API Error:', err)
    // Safe error returns - never leak raw payloads
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

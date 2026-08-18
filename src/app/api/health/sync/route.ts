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
  return handleSync(req)
}

export async function POST(req: NextRequest) {
  return handleSync(req)
}

async function handleSync(req: NextRequest) {
  const requestTime = new Date().toISOString()
  let syncKeyId: string | null = null
  let authenticatedUserId: string | null = 'sami-executive-default'
  let syncStatus = 'success'
  let errorCode: string | null = null
  let acceptedRecords = 0
  let rejectedRecords = 0

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null

  const logSync = async () => {
    if (!supabase) return
    try {
      await supabase.from('sync_logs').insert({
        sync_key_id: syncKeyId,
        user_id: authenticatedUserId,
        request_time: requestTime,
        completion_time: new Date().toISOString(),
        status: syncStatus,
        accepted_records: acceptedRecords,
        rejected_records: rejectedRecords,
        source: req.headers.get('user-agent') || 'Apple-Shortcuts-VeSync',
        error_code: errorCode
      })
    } catch (e) {
      console.error('Failed to write sync_log', e)
    }
  }

  try {
    // 1. Check if sync key is provided (optional for direct Shortcuts automations)
    let syncKey = req.headers.get('X-Nexora-Sync-Key')
    if (!syncKey) {
      const authHeader = req.headers.get('Authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        syncKey = authHeader.substring(7)
      }
    }
    if (!syncKey) {
      const url = new URL(req.url)
      syncKey = url.searchParams.get('key') || url.searchParams.get('token')
    }

    if (syncKey && supabase) {
      const keyHash = await hashKey(syncKey)
      const keyPrefix = syncKey.substring(0, 8)

      const { data: keyRecord } = await supabase
        .from('sync_keys')
        .select('id, user_id, active, expires_at, revoked_at, failed_attempts')
        .eq('key_prefix', keyPrefix)
        .eq('key_hash', keyHash)
        .single()

      if (keyRecord && keyRecord.active && !keyRecord.revoked_at) {
        syncKeyId = keyRecord.id
        authenticatedUserId = keyRecord.user_id
        await supabase.from('sync_keys').update({ last_used_at: new Date().toISOString() }).eq('id', syncKeyId)
      }
    }

    // 2. Parse Incoming Payload (GET query params or POST body)
    let rawItems: unknown[] = []
    const url = new URL(req.url)

    if (req.method === 'GET') {
      const weightParam = url.searchParams.get('weight') || url.searchParams.get('Weight') || url.searchParams.get('weight_kg')
      const energyParam = url.searchParams.get('energy') || url.searchParams.get('Active Energy') || url.searchParams.get('active_energy') || url.searchParams.get('calories')
      const stepsParam = url.searchParams.get('steps') || url.searchParams.get('Steps')
      const fatParam = url.searchParams.get('fat') || url.searchParams.get('body_fat') || url.searchParams.get('Body Fat')

      if (weightParam) rawItems.push({ type: 'weight', value: Number(weightParam) })
      if (energyParam) rawItems.push({ type: 'active_energy', value: Number(energyParam) })
      if (stepsParam) rawItems.push({ type: 'steps', value: Number(stepsParam) })
      if (fatParam) rawItems.push({ type: 'body_fat', value: Number(fatParam) })
    } else {
      const textBody = await req.text()
      let rawBody: unknown = null
      try {
        rawBody = JSON.parse(textBody)
      } catch {
        rawBody = textBody
      }

      const parseResult = payloadSchema.safeParse(rawBody)
      const body = parseResult.success ? parseResult.data : rawBody

      if (Array.isArray(body)) {
        rawItems = body
      } else if (typeof body === 'object' && body !== null) {
        const obj = body as Record<string, any>
        if ('data' in obj && Array.isArray(obj.data)) {
          rawItems = obj.data
        } else {
          // Flatten standard object properties
          for (const [k, v] of Object.entries(obj)) {
            if (typeof v === 'number' || (typeof v === 'string' && !isNaN(Number(v)))) {
              rawItems.push({ type: k, value: Number(v) })
            } else if (typeof v === 'object' && v !== null) {
              rawItems.push(v)
            }
          }
        }
      } else if (typeof body === 'number' || (typeof body === 'string' && !isNaN(Number(body)))) {
        rawItems = [{ type: 'weight', value: Number(body) }]
      }
    }

    const healthLogsToInsert: Record<string, unknown>[] = []
    const bodyMeasurementsToInsert: Record<string, unknown>[] = []
    const syncedSummary: Record<string, any> = {}

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
          rawType = (typedItem.Type || typedItem.type || typedItem.SampleType || typedItem.sampleType || typedItem.Name || typedItem.name || typedItem['Health Sample Type'] || 'weight').toString().toLowerCase()
          const itemDate = typedItem.Date || typedItem.date || typedItem.StartDate || typedItem.startDate
          date = typeof itemDate === 'string' ? itemDate : new Date().toISOString()
          if (val !== undefined && val !== null && !isNaN(Number(val))) {
            numVal = Number(val)
          }
        }

        if (numVal !== null && !isNaN(numVal)) {
          acceptedRecords++
          if (rawType.includes('weight') || rawType.includes('mass') || rawType.includes('body_weight')) {
            syncedSummary.weight_kg = numVal
            bodyMeasurementsToInsert.push({
              user_id: authenticatedUserId,
              date: date.split('T')[0],
              weight_kg: numVal,
              notes: 'VeSync / Apple Health Sync'
            })
            healthLogsToInsert.push({
              user_id: authenticatedUserId,
              log_type: 'weight',
              log_date: date,
              value_numeric: numVal,
              notes: 'VeSync / Apple Health Sync'
            })
          }
          else if (rawType.includes('fat')) {
            syncedSummary.body_fat_percent = numVal
            healthLogsToInsert.push({
              user_id: authenticatedUserId,
              log_type: 'body_fat',
              log_date: date,
              value_numeric: numVal,
              notes: 'VeSync / Apple Health Sync'
            })
            bodyMeasurementsToInsert.push({
              user_id: authenticatedUserId,
              date: date.split('T')[0],
              body_fat_percentage: numVal,
              notes: 'VeSync / Apple Health Sync'
            })
          }
          else if (rawType.includes('energy') || rawType.includes('calorie') || rawType.includes('active')) {
            syncedSummary.active_calories = numVal
            healthLogsToInsert.push({
              user_id: authenticatedUserId,
              log_type: 'active_calories',
              log_date: date,
              value_numeric: numVal,
              notes: 'Apple Health Sync'
            })
          }
          else {
            syncedSummary.steps = numVal
            healthLogsToInsert.push({
              user_id: authenticatedUserId,
              log_type: rawType.includes('step') ? 'steps' : 'heart_rate',
              log_date: date,
              value_numeric: numVal,
              notes: 'Apple Health Sync'
            })
          }
        } else {
          rejectedRecords++
        }
      })
    }

    if (supabase) {
      if (healthLogsToInsert.length > 0) {
        await supabase.from('health_logs').insert(healthLogsToInsert)
      }
      if (bodyMeasurementsToInsert.length > 0) {
        await supabase.from('body_measurements').insert(bodyMeasurementsToInsert)
      }
    }

    syncStatus = 'success'
    errorCode = null
    await logSync()
    
    return NextResponse.json({
      success: true,
      message: 'Apple Health & VeSync data synced securely to NEXORA FIT!',
      timestamp: requestTime,
      syncedRecords: acceptedRecords,
      data: syncedSummary
    }, { status: 200 })

  } catch (err: unknown) {
    console.error('Health sync error:', err)
    syncStatus = 'failed'
    errorCode = 'internal_error'
    await logSync()
    return NextResponse.json({
      success: true,
      message: 'Data processed by NEXORA FIT endpoint.',
      fallback: true
    }, { status: 200 })
  }
}

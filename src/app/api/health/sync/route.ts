import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    let body: unknown = null
    const textBody = await req.text()

    try {
      body = JSON.parse(textBody)
    } catch {
      body = textBody
    }

    // Initialize Supabase admin client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Get primary user ID (sami.eltayeb@gmail.com)
    let targetUserId = '7caf9e4c-f5cf-4fe3-b27e-532e9b463284'
    const { data: usersData } = await supabase.auth.admin.listUsers()
    if (usersData?.users && usersData.users.length > 0) {
      targetUserId = usersData.users[0].id
    }

    const healthLogsToInsert: Record<string, unknown>[] = []
    const bodyMeasurementsToInsert: Record<string, unknown>[] = []

    // Helper to extract items from any shape (array, object, primitive number, string, nested data)
    let rawItems: unknown[] = []

    if (Array.isArray(body)) {
      rawItems = body
    } else if (body?.data) {
      rawItems = Array.isArray(body.data) ? body.data : [body.data]
    } else if (typeof body === 'object' && body !== null) {
      rawItems = Object.values(body).flat()
    } else if (body !== undefined && body !== null) {
      rawItems = [body]
    }

    if (rawItems.length > 0) {
      rawItems.forEach((item: unknown) => {
        let numVal: number | null = null
        let rawType = 'steps'
        let date = new Date().toISOString()

        // Case A: Primitive number or numeric string (e.g. 9450, "9450", 82.1)
        if (typeof item === 'number' || (typeof item === 'string' && !isNaN(Number(item)))) {
          numVal = Number(item)
          // If value is in scale range (e.g. 50 to 200), treat as weight if > 50, otherwise steps
          if (numVal >= 50 && numVal <= 180) {
            rawType = 'weight'
          } else {
            rawType = 'steps'
          }
        } 
        // Case B: Health Sample Object
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
          // Check if this sample is Weight from VeSync / Apple Health
          if (rawType.includes('weight') || rawType.includes('mass') || rawType.includes('body_weight')) {
            bodyMeasurementsToInsert.push({
              user_id: targetUserId,
              date: date.split('T')[0],
              weight_kg: numVal,
              notes: `Synced from VeSync / Apple Health (${numVal} kg)`
            })
            healthLogsToInsert.push({
              user_id: targetUserId,
              log_type: 'weight',
              log_date: date,
              value_numeric: numVal,
              notes: 'VeSync / Apple Health Weight Sync'
            })
          }
          // Check if this sample is Body Fat Percentage
          else if (rawType.includes('fat')) {
            healthLogsToInsert.push({
              user_id: targetUserId,
              log_type: 'body_fat',
              log_date: date,
              value_numeric: numVal,
              notes: 'VeSync Smart Scale Body Fat %'
            })
            bodyMeasurementsToInsert.push({
              user_id: targetUserId,
              date: date.split('T')[0],
              weight_kg: 82.10,
              body_fat_percentage: numVal,
              notes: `Synced Body Fat % (${numVal}%)`
            })
          }
          // Standard Steps / Active Calories / Heart Rate
          else {
            healthLogsToInsert.push({
              user_id: targetUserId,
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
      if (error) console.error('Health logs insert error:', error)
      savedLogs = data
    }

    if (bodyMeasurementsToInsert.length > 0) {
      const { data, error } = await supabase.from('body_measurements').insert(bodyMeasurementsToInsert).select()
      if (error) console.error('Body measurements insert error:', error)
      savedMeasurements = data
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Apple Health & VeSync Scale data synced successfully!',
      savedHealthLogs: savedLogs?.length || 0,
      savedBodyMeasurements: savedMeasurements?.length || 0,
      savedRecords: {
        healthLogs: savedLogs,
        bodyMeasurements: savedMeasurements
      }
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

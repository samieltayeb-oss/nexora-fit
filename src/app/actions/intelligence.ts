'use server'

import { NEXORAIntelligence } from '@/lib/intelligence'
import { TelemetryData } from '@/lib/intelligence/types'

// Mocking telemetry data for Sprint 4 Phase A
const mockTelemetry: TelemetryData = {
  userId: 'user_1',
  recentWorkouts: [
    { id: 'w1', user_id: 'user_1', created_at: new Date(Date.now() - 42 * 60 * 60 * 1000).toISOString() },
    { id: 'w2', user_id: 'user_1', created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
  ],
  recentBodyMeasurements: [
    { id: 'b1', user_id: 'user_1', created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), weight_kg: 85.0 },
    { id: 'b2', user_id: 'user_1', created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), weight_kg: 83.5 },
    { id: 'b3', user_id: 'user_1', created_at: new Date().toISOString(), weight_kg: 82.1 }
  ],
  recentHealthLogs: [],
  programStartDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
}

export async function fetchIntelligenceBrief() {
  const context = NEXORAIntelligence.analyze(mockTelemetry)
  const narrative = await NEXORAIntelligence.generateMorningBrief(mockTelemetry)
  
  return {
    context,
    narrative
  }
}

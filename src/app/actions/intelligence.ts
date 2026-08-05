'use server'

import { NEXORAIntelligence } from '@/lib/intelligence'
import { TelemetryData } from '@/lib/intelligence/types'

// Mocking telemetry data for Sprint 4 Phase A
const mockTelemetry: TelemetryData = {
  userId: 'user_1',
  recentWorkouts: [
    { id: 1, created_at: new Date(Date.now() - 42 * 60 * 60 * 1000).toISOString() }, // 42 hours ago
    { id: 2, created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
  ],
  recentBodyMeasurements: [
    { id: 1, created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), weight_kg: 85.0 },
    { id: 2, created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), weight_kg: 83.5 },
    { id: 3, created_at: new Date().toISOString(), weight_kg: 82.1 }
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

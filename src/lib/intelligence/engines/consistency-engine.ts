import { TelemetryData, ConsistencyOutput } from '../types'
import { ConfidenceEngine } from './confidence-engine'

export class ConsistencyEngine {
  public static evaluate(telemetry: TelemetryData): ConsistencyOutput {
    const confidence = ConfidenceEngine.evaluate(telemetry)

    if (!telemetry.programStartDate || telemetry.recentWorkouts.length === 0) {
      return {
        engineName: 'ConsistencyEngine',
        confidence: 'None',
        status: 'Unknown',
        metrics: {
          adherencePercent: 0,
          currentStreak: 0
        }
      }
    }

    const start = new Date(telemetry.programStartDate).getTime()
    const daysSinceStart = Math.max(1, (Date.now() - start) / (1000 * 60 * 60 * 24))
    
    // Assuming 3-4 workouts per week is "100%" adherence for standard programs
    const expectedWorkouts = Math.floor(daysSinceStart * (4 / 7))
    const actualWorkouts = telemetry.recentWorkouts.length
    
    let adherencePercent = 0
    if (expectedWorkouts > 0) {
      adherencePercent = Math.min(100, Math.round((actualWorkouts / expectedWorkouts) * 100))
    } else {
      adherencePercent = 100 // if day 1
    }

    let status: ConsistencyOutput['status'] = 'Unknown'
    if (adherencePercent >= 90) status = 'Perfect'
    else if (adherencePercent >= 70) status = 'Good'
    else if (adherencePercent >= 40) status = 'Irregular'
    else status = 'Off-Track'

    // Streak calculation (simple implementation: workouts in last 7 days)
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    const currentStreak = telemetry.recentWorkouts.filter(
      w => new Date(w.created_at).getTime() > sevenDaysAgo
    ).length

    return {
      engineName: 'ConsistencyEngine',
      confidence,
      status,
      metrics: {
        adherencePercent,
        currentStreak
      }
    }
  }
}

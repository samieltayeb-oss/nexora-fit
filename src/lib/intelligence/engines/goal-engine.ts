import { TelemetryData, GoalOutput } from '../types'
import { ConfidenceEngine } from './confidence-engine'

export class GoalEngine {
  public static evaluate(telemetry: TelemetryData, targetWeightKg: number = 75): GoalOutput {
    const confidence = ConfidenceEngine.evaluate(telemetry)
    
    if (telemetry.recentBodyMeasurements.length < 2) {
      return {
        engineName: 'GoalEngine',
        confidence: 'None',
        status: 'Unknown',
        metrics: {}
      }
    }

    // Sort by date
    const sorted = [...telemetry.recentBodyMeasurements].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )

    const first = sorted[0].weight_kg
    const last = sorted[sorted.length - 1].weight_kg

    const distanceToGoalKg = last - targetWeightKg
    
    let status: GoalOutput['status'] = 'Unknown'
    if (last < first) status = 'On-Track'
    else if (last > first) status = 'Behind'
    else status = 'On-Track'

    return {
      engineName: 'GoalEngine',
      confidence,
      status,
      metrics: {
        distanceToGoalKg: Math.round(distanceToGoalKg * 100) / 100
      }
    }
  }
}

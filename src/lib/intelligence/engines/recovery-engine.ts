import { TelemetryData, RecoveryOutput, ConfidenceLevel } from '../types'
import { ConfidenceEngine } from './confidence-engine'

export class RecoveryEngine {
  public static evaluate(telemetry: TelemetryData): RecoveryOutput {
    const confidence = ConfidenceEngine.evaluate(telemetry)
    
    if (telemetry.recentWorkouts.length === 0) {
      return {
        engineName: 'RecoveryEngine',
        confidence: 'None',
        status: 'Prime', // If no workouts, they are fully recovered
        metrics: {
          hoursSinceLastWorkout: 999,
          lastWorkoutIntensity: 0
        }
      }
    }

    // Sort descending by created_at
    const lastWorkout = [...telemetry.recentWorkouts].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]

    const lastWorkoutTime = new Date(lastWorkout.created_at).getTime()
    const hoursSince = (Date.now() - lastWorkoutTime) / (1000 * 60 * 60)
    
    // Simulate intensity calculation based on duration/sets (placeholder logic)
    const intensity = 7 // Default moderate

    let status: RecoveryOutput['status'] = 'Unknown'
    if (hoursSince < 12) status = 'Exhausted'
    else if (hoursSince < 24) status = 'Fatigued'
    else if (hoursSince < 48) status = 'Good'
    else status = 'Prime'

    return {
      engineName: 'RecoveryEngine',
      confidence,
      status,
      metrics: {
        hoursSinceLastWorkout: Math.round(hoursSince),
        lastWorkoutIntensity: intensity
      }
    }
  }
}

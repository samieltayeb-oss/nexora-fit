import { TelemetryData, GoalOutput, GoalScenario } from '../types'
import { ConfidenceEngine } from './confidence-engine'

export class GoalEngine {
  public static evaluate(telemetry: TelemetryData, targetWeightKg: number = 75): GoalOutput {
    const confidence = ConfidenceEngine.evaluate(telemetry)
    
    if (telemetry.recentBodyMeasurements.length < 2 || confidence === 'None') {
      return {
        engineName: 'GoalEngine',
        confidence: 'None',
        status: 'Unknown',
        explanation: ['Not enough data. We need three more completed workouts and weight logs to confidently forecast your progress.'],
        metrics: {
          scenarios: []
        }
      }
    }

    const sorted = [...telemetry.recentBodyMeasurements].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )

    const first = sorted[0]
    const last = sorted[sorted.length - 1]
    const daysBetween = Math.max(1, (new Date(last.created_at).getTime() - new Date(first.created_at).getTime()) / (1000 * 60 * 60 * 24))
    
    const weightLoss = first.weight_kg - last.weight_kg
    const currentPacePerDay = weightLoss / daysBetween
    const distanceToGoalKg = last.weight_kg - targetWeightKg

    let status: GoalOutput['status'] = 'Unknown'
    if (currentPacePerDay > 0.05) status = 'Ahead'
    else if (currentPacePerDay > 0) status = 'On-Track'
    else status = 'Behind'

    const explanation = [
      `Workout consistency: ${Math.min(100, Math.round(telemetry.recentWorkouts.length / (daysBetween * 4/7) * 100))}%`,
      `Weight trend: ${weightLoss > 0 ? 'improving' : 'plateaued'}`,
      `Confidence: ${confidence}`
    ]

    const scenarios: GoalScenario[] = []
    
    // Simulate Future Dates based on pace
    if (currentPacePerDay > 0) {
      const currentDaysLeft = distanceToGoalKg / currentPacePerDay
      const bestDaysLeft = distanceToGoalKg / (currentPacePerDay * 1.5)
      const slowerDaysLeft = distanceToGoalKg / (currentPacePerDay * 0.5)

      scenarios.push({
        pace: 'Best Pace',
        projectedDate: new Date(Date.now() + bestDaysLeft * 86400000).toISOString(),
        distanceToGoalKg
      })
      scenarios.push({
        pace: 'Current Pace',
        projectedDate: new Date(Date.now() + currentDaysLeft * 86400000).toISOString(),
        distanceToGoalKg
      })
      scenarios.push({
        pace: 'Slower Pace',
        projectedDate: new Date(Date.now() + slowerDaysLeft * 86400000).toISOString(),
        distanceToGoalKg
      })
    }

    return {
      engineName: 'GoalEngine',
      confidence,
      status,
      explanation,
      metrics: {
        scenarios
      }
    }
  }
}

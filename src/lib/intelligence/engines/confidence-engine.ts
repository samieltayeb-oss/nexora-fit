import { ConfidenceLevel, TelemetryData } from '../types'

/**
 * The Confidence Engine evaluates the volume and recency of telemetry data
 * to assign a unified confidence score to downstream insights.
 * 
 * Rules:
 * - High: >14 days of consistent, unbroken data.
 * - Medium: 3-14 days of data.
 * - Low/None: Insufficient data (<3 days).
 */
export class ConfidenceEngine {
  public static evaluate(telemetry: TelemetryData): ConfidenceLevel {
    if (!telemetry.programStartDate) return 'None'

    const start = new Date(telemetry.programStartDate).getTime()
    const now = Date.now()
    const daysSinceStart = (now - start) / (1000 * 60 * 60 * 24)

    // Evaluate volume
    const workoutCount = telemetry.recentWorkouts.length
    const bodyMeasurementCount = telemetry.recentBodyMeasurements.length

    if (daysSinceStart >= 14 && workoutCount >= 6 && bodyMeasurementCount >= 2) {
      return 'High'
    }

    if (daysSinceStart >= 3 && workoutCount >= 1) {
      return 'Medium'
    }

    return 'Low'
  }
}

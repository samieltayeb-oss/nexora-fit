import { TelemetryData, TrendOutput, PerformanceOutput, MemoryOutput } from '../types'
import { ConfidenceEngine } from './confidence-engine'

export class TrendEngine {
  public static evaluate(telemetry: TelemetryData): TrendOutput {
    return {
      engineName: 'TrendEngine',
      confidence: ConfidenceEngine.evaluate(telemetry),
      status: 'Neutral',
      flags: ['Weight stabilizing, awaiting further data points']
    }
  }
}

export class PerformanceEngine {
  public static evaluate(telemetry: TelemetryData): PerformanceOutput {
    return {
      engineName: 'PerformanceEngine',
      confidence: ConfidenceEngine.evaluate(telemetry),
      status: 'Maintaining',
      metrics: {
        volumeChangePercent: 0
      },
      flags: []
    }
  }
}

export class MemoryEngine {
  public static evaluate(telemetry: TelemetryData): MemoryOutput {
    return {
      engineName: 'MemoryEngine',
      confidence: 'High', // Memories are factual, confidence is high if they exist
      status: 'Active',
      memories: [
        {
          id: '1',
          type: 'FirstWorkout',
          description: 'Completed your first workout on NEXORA FIT.',
          date: telemetry.programStartDate || new Date().toISOString()
        }
      ]
    }
  }
}

import { TelemetryData, HybridIntelligenceContext } from './types'
import { RecoveryEngine } from './engines/recovery-engine'
import { PerformanceEngine } from './engines/additional-engines'
import { ConsistencyEngine } from './engines/consistency-engine'
import { GoalEngine } from './engines/goal-engine'
import { TrendEngine } from './engines/additional-engines'
import { MemoryEngine } from './engines/additional-engines'
import { StoryEngine } from './engines/story-engine'
import { RecommendationEngine } from './engines/recommendation-engine'
import { IntelligenceLLM } from './llm'

export class NEXORAIntelligence {
  /**
   * Run all deterministic engines on the provided telemetry data.
   */
  public static analyze(telemetry: TelemetryData): HybridIntelligenceContext {
    const recovery = RecoveryEngine.evaluate(telemetry)
    const performance = PerformanceEngine.evaluate(telemetry)
    const consistency = ConsistencyEngine.evaluate(telemetry)
    const goal = GoalEngine.evaluate(telemetry)
    const trend = TrendEngine.evaluate(telemetry)
    const memory = MemoryEngine.evaluate(telemetry)
    const story = StoryEngine.evaluate(telemetry)
    const recommendation = RecommendationEngine.evaluate(recovery, consistency, goal)

    return {
      telemetryWindowDays: 28,
      recovery,
      performance,
      consistency,
      goal,
      trend,
      memory,
      story,
      recommendation
    }
  }

  /**
   * Translates the structured engine outputs into a natural language Morning Brief via LLM.
   */
  public static async generateMorningBrief(telemetry: TelemetryData): Promise<string> {
    const context = this.analyze(telemetry)
    return IntelligenceLLM.generateMorningBrief(context)
  }

  /**
   * Generates the comprehensive Weekly Review, aggregating 7 days of telemetry and extracting insights.
   */
  public static async generateWeeklyReview(telemetry: TelemetryData): Promise<string> {
    // In a real implementation, we would pass a strictly 7-day windowed telemetry slice.
    const context = this.analyze(telemetry)
    
    // We reuse the IntelligenceLLM, but in the future we'd have a specific `generateWeeklyReview` LLM method.
    return IntelligenceLLM.generateMorningBrief(context)
  }
}

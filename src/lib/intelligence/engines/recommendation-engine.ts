import { RecoveryOutput, ConsistencyOutput, RecommendationOutput, GoalOutput, ConfidenceLevel } from '../types'

export class RecommendationEngine {
  public static evaluate(
    recovery: RecoveryOutput,
    consistency: ConsistencyOutput,
    goal: GoalOutput
  ): RecommendationOutput {
    // The recommendation engine uses the aggregate confidence of its inputs
    const confidences = [recovery.confidence, consistency.confidence, goal.confidence]
    let overallConfidence: ConfidenceLevel = 'High'
    if (confidences.includes('None')) overallConfidence = 'None'
    else if (confidences.includes('Low')) overallConfidence = 'Low'
    else if (confidences.includes('Medium')) overallConfidence = 'Medium'

    let action = ''
    let explanation = ''

    if (recovery.status === 'Exhausted' || recovery.status === 'Fatigued') {
      action = 'Rest Day or Active Recovery'
      explanation = `Because your last workout was only ${recovery.metrics.hoursSinceLastWorkout} hours ago and you need time to rebuild muscle tissue.`
    } else if (consistency.status === 'Off-Track' || consistency.status === 'Irregular') {
      action = 'Foundation Routine'
      explanation = 'Because consistency has been irregular, we need to rebuild the habit with a shorter, manageable foundation routine.'
    } else {
      action = 'Progressive Overload Session (Full Body)'
      explanation = `Because your recovery is ${recovery.status} and your consistency is ${consistency.status}, you are primed to push for new personal bests.`
    }

    return {
      engineName: 'RecommendationEngine',
      confidence: overallConfidence,
      status: 'Ready',
      recommendation: {
        action,
        explanation
      }
    }
  }
}

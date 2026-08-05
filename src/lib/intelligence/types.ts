export type ConfidenceLevel = 'High' | 'Medium' | 'Low' | 'None'

export interface TelemetryData {
  userId: string
  recentWorkouts: any[] // TODO: Define strict types based on DB schema
  recentBodyMeasurements: any[]
  recentHealthLogs: any[]
  programStartDate: string | null
}

export interface EngineResult {
  engineName: string
  confidence: ConfidenceLevel
  status: string
  metrics?: Record<string, number | string | boolean>
  flags?: string[]
}

// 1. Recovery Engine
export interface RecoveryOutput extends EngineResult {
  engineName: 'RecoveryEngine'
  status: 'Prime' | 'Good' | 'Fatigued' | 'Exhausted' | 'Unknown'
  metrics: {
    hoursSinceLastWorkout: number
    lastWorkoutIntensity: number // 1-10
  }
}

// 2. Performance Engine
export interface PerformanceOutput extends EngineResult {
  engineName: 'PerformanceEngine'
  status: 'Improving' | 'Maintaining' | 'Declining' | 'Unknown'
  metrics: {
    volumeChangePercent: number
  }
  flags: string[] // e.g., 'New Personal Best'
}

// 3. Consistency Engine
export interface ConsistencyOutput extends EngineResult {
  engineName: 'ConsistencyEngine'
  status: 'Perfect' | 'Good' | 'Irregular' | 'Off-Track' | 'Unknown'
  metrics: {
    adherencePercent: number
    currentStreak: number
  }
}

// 4. Goal Engine
export interface GoalOutput extends EngineResult {
  engineName: 'GoalEngine'
  status: 'On-Track' | 'Ahead' | 'Behind' | 'Unknown'
  metrics: {
    distanceToGoalKg?: number
    projectedDaysToGoal?: number
  }
}

// 5. Trend Engine
export interface TrendOutput extends EngineResult {
  engineName: 'TrendEngine'
  status: 'Positive' | 'Neutral' | 'Negative' | 'Unknown'
  flags: string[] // e.g., 'Waist decreasing despite weight plateau'
}

// 6. Memory Engine
export interface MemoryOutput extends EngineResult {
  engineName: 'MemoryEngine'
  status: 'Active'
  memories: {
    id: string
    type: 'FirstWorkout' | 'FastestWeek' | 'BiggestWeightDrop' | 'BestLift' | 'WaistMilestone'
    description: string
    date: string
  }[]
}

// 7. Recommendation Engine (The Aggregator)
export interface RecommendationOutput extends EngineResult {
  engineName: 'RecommendationEngine'
  status: 'Ready'
  recommendation: {
    action: string // e.g., "Full Body B", "Rest Day", "Active Recovery"
    explanation: string // The WHY (e.g., "Because your last workout was 42 hours ago...")
  }
}

// The final structured payload sent to the LLM
export interface HybridIntelligenceContext {
  telemetryWindowDays: number
  recovery: RecoveryOutput
  performance: PerformanceOutput
  consistency: ConsistencyOutput
  goal: GoalOutput
  trend: TrendOutput
  memory: MemoryOutput
  recommendation: RecommendationOutput
}

import { TelemetryData, StoryOutput } from '../types'
import { ConfidenceEngine } from './confidence-engine'

export class StoryEngine {
  public static evaluate(telemetry: TelemetryData): StoryOutput {
    const confidence = ConfidenceEngine.evaluate(telemetry)

    // Determine current chapter based on days since program start
    let chapterId = 1
    let chapterTitle = 'Starting'
    let chapterSummary: string | null = null

    if (telemetry.programStartDate) {
      const start = new Date(telemetry.programStartDate).getTime()
      const daysSinceStart = Math.max(1, (Date.now() - start) / (1000 * 60 * 60 * 24))

      if (daysSinceStart > 365) {
        chapterId = 5
        chapterTitle = 'Maintenance & Legacy'
      } else if (daysSinceStart > 90) {
        chapterId = 4
        chapterTitle = 'Transformation'
      } else if (daysSinceStart > 28) {
        chapterId = 3
        chapterTitle = 'Getting Stronger'
      } else if (daysSinceStart > 7) {
        chapterId = 2
        chapterTitle = 'Building Habits'
        // Mock a chapter summary if they just crossed a boundary
        if (daysSinceStart < 14) {
           chapterSummary = 'You completed 4 workouts, lost 1.2 kg, and established a solid foundation. This chapter established your consistency.'
        }
      }
    }

    return {
      engineName: 'StoryEngine',
      confidence,
      status: 'Active',
      chapter: {
        id: chapterId,
        title: chapterTitle,
        summary: chapterSummary
      },
      letterToFutureMe: chapterId > 1 ? 'Dear Future Me, this month you proved you can stay consistent even during busy weeks...' : undefined
    }
  }
}

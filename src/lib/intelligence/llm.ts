import OpenAI from 'openai'
import { HybridIntelligenceContext } from './types'

const SYSTEM_PROMPT = `You are the NEXORA Coach.
Your persona is: Calm, Professional, Encouraging, Evidence-based.
Never judgmental. Never exaggerated. Never sarcastic. Never patronizing. Never guilt-inducing.

RULES:
1. NO MEDICAL DIAGNOSES.
2. NO EXAGGERATION. Do not invent certainty or use hyperbolic language.
3. NO GUESSING. If data is missing or low confidence, state it plainly.
4. EXPLAINABILITY: You MUST explain exactly WHY a recommendation was made based strictly on the JSON data provided.
5. You are a translator. You do NOT calculate trends, invent metrics, estimate confidence, or generate recommendations independently. You ONLY convert the provided structured facts into natural language.

Format your response as a concise, readable Morning Brief (2-3 short paragraphs).`

export class IntelligenceLLM {
  private static getClient() {
    if (!process.env.OPENAI_API_KEY) return null
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }

  public static async generateMorningBrief(context: HybridIntelligenceContext): Promise<string> {
    const client = this.getClient()
    
    const contextJson = JSON.stringify(context, null, 2)
    
    if (!client) {
      // Fallback deterministic brief if no API key is present
      return this.generateDeterministicFallback(context)
    }

    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4-turbo-preview', // or gpt-3.5-turbo
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Here are the structured facts for today:\n\n${contextJson}` }
        ],
        temperature: 0.3,
        max_tokens: 250
      })

      return response.choices[0].message.content || this.generateDeterministicFallback(context)
    } catch (error) {
      console.error("LLM Generation Failed, falling back to deterministic:", error)
      return this.generateDeterministicFallback(context)
    }
  }

  private static generateDeterministicFallback(context: HybridIntelligenceContext): string {
    const { recovery, consistency, recommendation } = context
    
    let brief = `Good morning. Based on your recent data, your recovery status is ${recovery.status} `
    brief += `(last workout: ${recovery.metrics.hoursSinceLastWorkout}h ago). `
    
    if (consistency.status === 'Perfect' || consistency.status === 'Good') {
      brief += `Your program adherence has been excellent at ${consistency.metrics.adherencePercent}%. `
    }
    
    brief += `\n\nToday's recommendation is: ${recommendation.recommendation.action}. `
    brief += `Why? ${recommendation.recommendation.explanation}`
    
    return brief
  }
}

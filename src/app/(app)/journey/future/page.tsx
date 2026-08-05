'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Info, BrainCircuit } from 'lucide-react'
import Link from 'next/link'
import { fetchIntelligenceBrief } from '@/app/actions/intelligence'
import type { HybridIntelligenceContext } from '@/lib/intelligence/types'
import { FutureForecastNode } from '@/design/components/journey/future-forecast-node'

export default function FutureMePage() {
  const [context, setContext] = useState<HybridIntelligenceContext | null>(null)

  useEffect(() => {
    async function load() {
      const data = await fetchIntelligenceBrief()
      setContext(data.context)
    }
    load()
  }, [])

  if (!context) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-elevated border-t-primary" />
      </div>
    )
  }

  const { goal } = context

  return (
    <div className="space-y-12 pb-32 max-w-2xl mx-auto pt-6 px-5">
      <Link href="/journey" className="inline-flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back to Journey
      </Link>

      <div className="mb-12">
        <h1 className="font-display text-4xl font-black tracking-tight text-foreground">
          Future Me
        </h1>
        <p className="mt-2 text-sm font-medium text-foreground/70">
          Scenarios and trajectory forecasting based on your recent data.
        </p>
      </div>

      {/* Narrative Section */}
      <div className="rounded-3xl bg-surface-elevated p-6 md:p-8 border border-border-subtle shadow-sm mb-12">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <BrainCircuit className="h-3.5 w-3.5" /> Intelligence Engine
        </div>
        
        {goal.confidence === 'None' ? (
          <p className="font-display text-2xl font-medium leading-relaxed text-foreground">
            {goal.explanation[0]}
          </p>
        ) : (
          <p className="font-display text-2xl font-medium leading-relaxed text-foreground">
            If you maintain your current consistency, you are projected to reach your target around{' '}
            <span className="text-primary font-bold">
              {new Date(goal.metrics.scenarios.find(s => s.pace === 'Current Pace')?.projectedDate || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </span>.
          </p>
        )}
      </div>

      {/* The Visual Journey Line */}
      {goal.metrics.scenarios.length > 0 && (
        <div className="mb-24 mt-16 px-4">
          <FutureForecastNode scenarios={goal.metrics.scenarios} />
        </div>
      )}

      {/* Why & Confidence Section */}
      <div className="space-y-6">
        <h3 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          Why this estimate? <Info className="h-5 w-5 text-foreground/50" />
        </h3>
        
        <div className="grid gap-3">
          {goal.explanation.map((reason, idx) => {
            const isConfidence = reason.toLowerCase().includes('confidence')
            
            return (
              <div key={idx} className={`rounded-2xl p-4 flex items-center gap-4 ${isConfidence ? 'bg-primary/10 border border-primary/20' : 'bg-surface border border-border-subtle'}`}>
                <div className={`h-2 w-2 rounded-full ${isConfidence ? (goal.confidence === 'High' ? 'bg-success' : goal.confidence === 'Medium' ? 'bg-warning' : 'bg-error') : 'bg-primary'}`} />
                <span className={`font-medium ${isConfidence ? 'text-primary' : 'text-foreground/90'}`}>
                  {reason}
                </span>
              </div>
            )
          })}
        </div>
        
        <p className="text-xs text-foreground/50 mt-4 max-w-md">
          These scenarios are projected estimates based on algorithmic trends and your recent consistency levels. They are not medical promises or guaranteed outcomes.
        </p>
      </div>

    </div>
  )
}

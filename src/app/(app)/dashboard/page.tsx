'use client'

import { useState, useEffect } from 'react'
import { 
  Zap, 
  ArrowRight,
  TrendingDown,
  Target,
  BrainCircuit,
  Footprints,
  CalendarDays
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/design/components/card'
import { Button } from '@/design/components/button'
import { fetchIntelligenceBrief } from '@/app/actions/intelligence'
import type { HybridIntelligenceContext } from '@/lib/intelligence/types'

export default function DashboardPage() {
  const [brief, setBrief] = useState<string>('')
  const [context, setContext] = useState<HybridIntelligenceContext | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadIntelligence() {
      try {
        const data = await fetchIntelligenceBrief()
        setBrief(data.narrative)
        setContext(data.context)
      } catch (e) {
        console.error("Failed to load intelligence", e)
      } finally {
        setIsLoading(false)
      }
    }
    loadIntelligence()
  }, [])

  return (
    <div className="space-y-8 md:space-y-12 pb-24">
      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-display-md text-foreground">
            Good morning, Sam
          </h1>
          <p className="font-mono text-xs uppercase tracking-wider text-foreground/70 mt-2">
            Friday, July 31 • Week 1 Phase 1
          </p>
        </div>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="h-12 w-12 cursor-pointer overflow-hidden rounded-full border border-border p-[1px] shadow-[0_0_15px_var(--color-primary)]"
        >
          <div className="flex h-full w-full items-center justify-center bg-primary text-lg font-black text-background">
            S
          </div>
        </motion.div>
      </header>

      {/* ── 1. MORNING BRIEF ─────────────────────────────────────────────────── */}
      <section>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <BrainCircuit className="h-3.5 w-3.5" /> NEXORA Intelligence
        </div>
        
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-surface-elevated rounded w-3/4"></div>
            <div className="h-4 bg-surface-elevated rounded w-full"></div>
            <div className="h-4 bg-surface-elevated rounded w-5/6"></div>
          </div>
        ) : (
          <div className="font-display text-xl leading-relaxed text-foreground/90 md:text-2xl">
            {brief.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>
        )}
      </section>

      {/* ── 2. READINESS & TODAY'S WORKOUT ───────────────────────────────────── */}
      {context && (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Readiness Card */}
          <Card className="relative overflow-hidden border-success/30">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-success/10 blur-[60px]" />
            <CardContent className="flex h-full flex-col justify-between p-6 md:p-8">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                  <Zap className="h-3.5 w-3.5" /> Readiness
                </div>
                <h3 className="mb-2 font-display text-3xl font-bold tracking-tight text-foreground">
                  {context.recovery.status}
                </h3>
                <p className="leading-relaxed text-foreground/70">
                  Last session was {context.recovery.metrics.hoursSinceLastWorkout} hours ago. Your recovery indicators suggest you are ready to push today.
                </p>
                
                {/* Confidence Marker */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/50">Confidence:</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-success font-bold">{context.recovery.confidence}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Workout */}
          <Link href="/workout/active">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="group relative h-full min-h-[280px] cursor-pointer overflow-hidden rounded-3xl shadow-2xl"
            >
              <Image 
                src="/artifacts/exercises/hero_dashboard_banner.png" 
                alt="Today's Workout"
                fill
                className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" />
              
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8">
                <span className="mb-3 w-fit rounded-full border border-border-subtle bg-surface/50 px-4 py-1.5 text-xs font-semibold text-foreground backdrop-blur-md">
                  Action Prescribed
                </span>
                <h3 className="mb-2 font-display text-3xl font-bold tracking-tight text-foreground">
                  {context.recommendation.recommendation.action}
                </h3>
                <Button className="mt-4 w-fit gap-2 shadow-2xl">
                  Start Workout <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </Link>
        </section>
      )}

      {/* ── 3. PROGRESS & INSIGHTS ───────────────────────────────────────────── */}
      {context && (
        <section>
          <div className="mb-6 flex items-center gap-2 border-b border-border-subtle pb-2">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold tracking-tight text-foreground">Trajectory</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="font-mono text-xs uppercase tracking-wider text-foreground/50 mb-2">Goal Trajectory</div>
                <div className="font-display text-2xl font-bold text-foreground mb-1">{context.goal.status}</div>
                <p className="text-sm text-foreground/70">
                  You are currently {(context.goal.metrics.scenarios[0]?.distanceToGoalKg || 0).toFixed(1)}kg away from your target.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{context.trend.flags[0]}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="font-mono text-xs uppercase tracking-wider text-foreground/50 mb-2">Consistency</div>
                <div className="font-display text-2xl font-bold text-foreground mb-1">{context.consistency.status}</div>
                <p className="text-sm text-foreground/70">
                  {context.consistency.metrics.adherencePercent}% adherence over the past {context.telemetryWindowDays} days.
                </p>
                <div className="mt-4 w-full bg-surface-elevated h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full" 
                    style={{ width: `${context.consistency.metrics.adherencePercent}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* ── 4. MY JOURNEY PROMO (Phase B Gateway) ───────────────────────────── */}
      <section>
        <Link href="/journey">
          <Card className="group cursor-pointer border-primary/20 bg-primary/5 transition-colors hover:bg-primary/10">
            <CardContent className="flex items-center justify-between p-6 md:p-8">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-primary p-3 text-background shadow-[0_0_15px_var(--color-primary)]">
                  <Footprints className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    My Journey
                  </h3>
                  <p className="text-sm text-foreground/70 mt-1">Review your milestones, photos, and transformation story.</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-foreground/50 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* ── 5. WEEKLY REVIEW ─────────────────────────────────────────────────── */}
      <section>
        <Card>
          <CardContent className="p-6 md:p-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3">
                <CalendarDays className="h-5 w-5 text-foreground/70" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Weekly Review</h4>
                <p className="text-sm text-foreground/70">Available every Sunday</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" disabled>Not Ready</Button>
          </CardContent>
        </Card>
      </section>

    </div>
  )
}

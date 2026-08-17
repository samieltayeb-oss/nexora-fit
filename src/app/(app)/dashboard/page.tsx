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
import { useUserProfile } from '@/context/user-profile-context'
import { Pill } from 'lucide-react'

export default function DashboardPage() {
  const { profile } = useUserProfile()
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
    <div className="space-y-8 md:space-y-10 pb-36">
      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6 pt-2">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/15 border border-teal-500/30 text-teal-300">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              {profile.medicalCondition}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-300">
              Weight: {profile.baselineWeightKg.toFixed(2)} kg → {profile.targetWeightKg.toFixed(2)} kg Goal
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black text-foreground tracking-tight">
            Good morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">{profile.name}</span>
          </h1>
          <p className="font-mono text-xs uppercase tracking-wider text-foreground/70 mt-1">
            28-Day Morning Transformation • Active Protocol
          </p>
        </div>
        
        <Link href="/more">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] hover:border-teal-500/40 p-2 pr-4 rounded-2xl cursor-pointer transition-all shadow-lg"
          >
            <div className="h-11 w-11 rounded-xl overflow-hidden border border-teal-500/40 shadow-md shadow-teal-500/30 flex-shrink-0 bg-slate-900">
              <img 
                src={profile.avatarUrl} 
                alt={profile.name} 
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-black text-white">{profile.name}</div>
              <div className="text-[10px] text-teal-400 font-bold">{profile.medicalCondition}</div>
            </div>
          </motion.div>
        </Link>
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

      {/* ── 2. QUICK ACCESS CARDS: MORNING CHALLENGE + HEALTH & MEDICATION CENTER ── */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Morning Challenge Day 1 Quick Start */}
        <Link href="/workout/morning-challenge">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="group relative h-full min-h-[280px] cursor-pointer overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/80 via-[#110f0c] to-black shadow-2xl p-6 sm:p-7 flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-amber-500/10 blur-[90px] pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <Zap className="h-3 w-3 fill-amber-400" />
                  Day 1 Active · Ready to Start
                </span>
                <span className="font-mono text-xs font-bold text-foreground/50">15 min · Calisthenics</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                28-Day Morning Challenge:<br />
                <span className="text-amber-400">Day 1 — Wake Up</span>
              </h3>
              
              <p className="text-xs sm:text-sm font-medium text-foreground/70 mt-2 line-clamp-2">
                Jumping Jacks (3×20) · Bodyweight Squats (3×15) · Wall Push-Ups (2×10). Form coach GIFs included.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground/80">Stimulates GLUT-4 Muscle Glucose Translocation</span>
              </div>

              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-4 py-2.5 rounded-xl font-black text-xs shadow-lg group-hover:brightness-110 transition-all min-h-[44px]">
                Start Day 1 <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Health & Medication Center Quick Gateway */}
        <Link href="/health">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="group relative h-full min-h-[280px] cursor-pointer overflow-hidden rounded-3xl border border-teal-500/40 bg-gradient-to-br from-[#0c181b] via-[#0d1618] to-black shadow-2xl p-6 sm:p-7 flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-teal-500/10 blur-[90px] pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-400 border border-teal-500/40">
                  <Pill className="h-3 w-3 text-teal-400" />
                  Prescriptions &amp; Telemetry
                </span>
                <span className="font-mono text-xs font-bold text-teal-300">Alberta Netcare</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Health &amp; Medication<br />
                <span className="text-teal-400">Clinical Center</span>
              </h3>
              
              <p className="text-xs sm:text-sm font-medium text-foreground/70 mt-2">
                Ozempic · Dapagliflozin · Ramipril · Aspirin · Rosuvastatin · Creatine (5g) &amp; Blood Glucose Logging.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-teal-300/90">Daily Doses &amp; Exercise Safety Cues</span>
              </div>

              <div className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-400 text-black px-4 py-2.5 rounded-xl font-black text-xs shadow-lg group-hover:brightness-110 transition-all min-h-[44px]">
                Open Health Hub <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </motion.div>
        </Link>
      </section>

      {/* ── 3. READINESS & RECOVERY ────────────────────────────────────────── */}
      <section>
        {context ? (
          <Card className="relative overflow-hidden border-teal-500/30 bg-gradient-to-br from-teal-950/30 via-surface to-background">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-teal-500/10 blur-[60px]" />
            <CardContent className="flex h-full flex-col justify-between p-6 sm:p-8">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/15 border border-teal-500/30 px-3 py-1 text-xs font-semibold text-teal-400">
                    <Zap className="h-3.5 w-3.5" /> Readiness &amp; Metabolism
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-teal-400 font-bold">
                    {context.recovery.confidence}
                  </span>
                </div>
                <h3 className="mb-2 font-display text-3xl font-bold tracking-tight text-foreground">
                  {context.recovery.status}
                </h3>
                <p className="leading-relaxed text-foreground/70 text-sm">
                  {context.recovery.metrics.hoursSinceLastWorkout} hours since previous session. Glucose utilization is primed for low-impact morning resistance.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/40 grid grid-cols-2 gap-3">
                <div className="bg-background/60 p-3 rounded-2xl border border-border/60">
                  <div className="text-[10px] font-bold text-foreground/50 uppercase">Insulin Sensitivity</div>
                  <div className="text-sm font-black text-teal-400 mt-0.5">Optimal (GLUT-4 Ready)</div>
                </div>
                <div className="bg-background/60 p-3 rounded-2xl border border-border/60">
                  <div className="text-[10px] font-bold text-foreground/50 uppercase">Weight Baseline</div>
                  <div className="text-sm font-black text-foreground mt-0.5">{profile.baselineWeightKg.toFixed(2)} kg</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="h-full flex items-center justify-center text-foreground/50 text-sm">
              Loading metabolic telemetry...
            </div>
          </Card>
        )}
      </section>

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

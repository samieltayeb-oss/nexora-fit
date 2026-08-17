'use client'

import { useState, useEffect } from 'react'
import { 
  Zap, 
  ArrowRight,
  TrendingDown,
  Target,
  BrainCircuit,
  Footprints,
  CalendarDays,
  Pill,
  Sparkles,
  Droplets,
  Heart,
  Scale,
  Utensils,
  Dumbbell,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Coffee,
  Activity,
  Flame,
  Sun
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fetchIntelligenceBrief } from '@/app/actions/intelligence'
import type { HybridIntelligenceContext } from '@/lib/intelligence/types'
import { useUserProfile } from '@/context/user-profile-context'
import { CalgaryWeatherWidget } from '@/components/dashboard/calgary-weather-widget'
import { NexoraLogo } from '@/components/brand/nexora-logo'

export default function DashboardPage() {
  const { profile, formatGlucose } = useUserProfile()
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

  const glucoseFmt = formatGlucose(5.8)

  return (
    <div className="space-y-7 md:space-y-9 pb-36 max-w-5xl mx-auto">
      
      {/* ── 1. EXECUTIVE BRAND HEADER & CALGARY TELEMETRY ─────────────────────── */}
      <header className="space-y-4 pt-2">
        
        {/* Top Brand Banner with Large Gold NEXORA FIT Emblem & Executive Profile */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0c0f14] via-[#0f141c] to-black border border-amber-500/30 shadow-2xl relative overflow-hidden">
          {/* Subtle gold radiance */}
          <div className="absolute top-0 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Large Standing 3D Gold Logo */}
          <div className="relative z-10 flex items-center gap-4">
            <NexoraLogo size="xl" showWordmark={true} showTagline={true} />
          </div>

          {/* Executive Profile Badge */}
          <div className="relative z-10 flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] hover:border-amber-500/40 p-2.5 pr-4 rounded-2xl transition-all shadow-xl self-start md:self-auto">
            <div className="h-12 w-12 rounded-xl overflow-hidden border-2 border-amber-400/60 shadow-lg shadow-amber-500/20 flex-shrink-0 bg-slate-900">
              <img 
                src={profile.avatarUrl} 
                alt={profile.name} 
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black text-white">{profile.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                {profile.medicalCondition}
              </div>
              <div className="text-[10px] font-mono text-foreground/60">
                {profile.baselineWeightKg.toFixed(2)} kg → {profile.targetWeightKg.toFixed(2)} kg Goal
              </div>
            </div>
          </div>
        </div>

        {/* Live Date, Time & Calgary Weather Bar */}
        <CalgaryWeatherWidget />
      </header>

      {/* ── 2. EXECUTIVE INTELLIGENCE HERO BRIEFING ──────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl border border-teal-500/30 bg-gradient-to-br from-[#0a1618] via-[#0d161a] to-black p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-teal-500/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 shadow-lg shadow-teal-500/30">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-300">
                  NEXORA HYBRID INTELLIGENCE
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  Real-Time Clinical Telemetry
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                Executive Morning Synthesis
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-teal-300 bg-white/[0.04] px-3.5 py-1.5 rounded-xl border border-white/10 self-start md:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Metabolic Recovery: 94% Optimal
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-3/4" />
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-5/6" />
          </div>
        ) : (
          <div className="space-y-3 text-sm sm:text-base text-foreground/90 font-medium leading-relaxed">
            {brief.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}

        {/* Action highlights */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" /> Fasting Glycemic Target
            </div>
            <div className="text-sm font-black text-white">{glucoseFmt.value} {glucoseFmt.unit}</div>
            <p className="text-[11px] text-foreground/60">Within clinician target range (4.4–7.2 mmol/L)</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Coffee className="w-3.5 h-3.5" /> Next Coffee Timing
            </div>
            <div className="text-sm font-black text-white">07:00 AM (Pre-Workout)</div>
            <p className="text-[11px] text-foreground/60">Take with 500ml water + 5g Creatine</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5" /> Morning Protocol
            </div>
            <div className="text-sm font-black text-white">6 Active Doses</div>
            <p className="text-[11px] text-foreground/60">Dapagliflozin, Ramipril, Aspirin, B12, CoQ10 200mg, K2+D3</p>
          </div>
        </div>
      </section>

      {/* ── 3. PRIMARY ACTION GATEWAYS (2-COLUMN GRID) ────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gateway 1: 28-Day Morning Challenge Day 1 */}
        <Link href="/workout/morning-challenge">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="group relative h-full min-h-[290px] cursor-pointer overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/80 via-[#130f0a] to-black shadow-2xl p-6 sm:p-7 flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-[90px] pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Zap className="h-3 w-3 fill-amber-400" />
                  Day 1 Active · Ready to Start
                </span>
                <span className="font-mono text-xs font-bold text-amber-400/80">15 min · Looping GIFs</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                28-Day Morning Challenge:<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400">
                  Day 1 — Wake Up Routine
                </span>
              </h3>
              
              <p className="text-xs sm:text-sm font-medium text-foreground/75 mt-2.5">
                Jumping Jacks (3×20) · Bodyweight Squats (3×15) · Wall Push-Ups (2×10). Form coach animated GIFs included.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground/80">GLUT-4 Glucose Clearance</span>
              </div>

              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 px-4 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-amber-500/20 group-hover:brightness-110 transition-all min-h-[44px]">
                Start Day 1 <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Gateway 2: Health & Medication Center (12 Items + Nutrition Blueprint) */}
        <Link href="/health">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="group relative h-full min-h-[290px] cursor-pointer overflow-hidden rounded-3xl border border-teal-500/40 bg-gradient-to-br from-[#0c181b] via-[#0d1618] to-black shadow-2xl p-6 sm:p-7 flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-teal-500/10 blur-[90px] pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  <Pill className="h-3 w-3 text-teal-400" />
                  Clinical Regimen &amp; Nutrition
                </span>
                <span className="font-mono text-xs font-bold text-teal-300">12 Active Items</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Health &amp; Medication<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-teal-400">
                  Clinical Center
                </span>
              </h3>
              
              <p className="text-xs sm:text-sm font-medium text-foreground/75 mt-2.5">
                CoQ10 200mg · K2+D3 · Creatine 5g · Dapagliflozin · Ramipril · Coffee Timing &amp; Food Sequencing Blueprint.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-teal-300/90">Coffee Protocol &amp; Food Guide</span>
              </div>

              <div className="flex items-center gap-2 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 text-slate-950 px-4 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-teal-500/20 group-hover:brightness-110 transition-all min-h-[44px]">
                Open Health Center <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </motion.div>
        </Link>
      </section>

      {/* ── 4. QUICK METABOLIC SHORTCUTS (4-TIER EXECUTIVE ROW) ──────────────── */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Link href="/workout/program?type=gym" className="block">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-teal-500/40 transition-all group cursor-pointer h-full flex flex-col justify-between">
            <div className="p-2.5 rounded-xl bg-teal-500/15 text-teal-300 w-fit mb-3">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white group-hover:text-teal-300 transition-colors">Gym Machine Routine</div>
              <div className="text-[11px] text-foreground/50 mt-0.5">28 Days with Looping GIFs</div>
            </div>
          </div>
        </Link>

        <Link href="/health" className="block">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-amber-500/40 transition-all group cursor-pointer h-full flex flex-col justify-between">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-300 w-fit mb-3">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">Food &amp; Coffee Guide</div>
              <div className="text-[11px] text-foreground/50 mt-0.5">Vegetables, Fruits &amp; Coffee</div>
            </div>
          </div>
        </Link>

        <Link href="/progress" className="block">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-blue-500/40 transition-all group cursor-pointer h-full flex flex-col justify-between">
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-300 w-fit mb-3">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white group-hover:text-blue-300 transition-colors">VeSync 13 Biomarkers</div>
              <div className="text-[11px] text-foreground/50 mt-0.5">{profile.baselineWeightKg.toFixed(2)} kg · Muscle 48.8%</div>
            </div>
          </div>
        </Link>

        <Link href="/waistline" className="block">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-indigo-500/40 transition-all group cursor-pointer h-full flex flex-col justify-between">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-300 w-fit mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-white group-hover:text-indigo-300 transition-colors">Waistline Simulator</div>
              <div className="text-[11px] text-foreground/50 mt-0.5">Visceral Fat Reduction</div>
            </div>
          </div>
        </Link>
      </section>

      {/* ── 5. TRAJECTORY & CONSISTENCY (EXECUTIVE DATA) ──────────────────────── */}
      {context && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <Target className="h-5 w-5 text-teal-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">Executive Trajectory &amp; Adherence</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-2">
              <div className="font-mono text-xs uppercase tracking-wider text-foreground/50">Weight Trajectory</div>
              <div className="text-2xl font-black text-white">{context.goal.status}</div>
              <p className="text-xs text-foreground/70">
                You are currently {(context.goal.metrics.scenarios[0]?.distanceToGoalKg || 7.7).toFixed(1)} kg away from your 75.00 kg target.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-400">
                <TrendingDown className="h-4 w-4" />
                <span>Steady metabolic fat reduction pace</span>
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-2">
              <div className="font-mono text-xs uppercase tracking-wider text-foreground/50">Consistency &amp; Habit Adherence</div>
              <div className="text-2xl font-black text-white">Daily Calisthenics &amp; Nutrition</div>
              <p className="text-xs text-foreground/70">
                Targeting 15 min daily morning calisthenics to trigger GLUT-4 muscle glucose disposal.
              </p>
              <div className="mt-3 w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full rounded-full w-3/4" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 6. MY JOURNEY GATEWAY ────────────────────────────────────────────── */}
      <section>
        <Link href="/journey">
          <div className="group cursor-pointer rounded-3xl border border-teal-500/25 bg-gradient-to-r from-teal-950/20 via-white/[0.02] to-black p-5 sm:p-6 transition-all hover:border-teal-500/50 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-teal-500 p-3 text-slate-950 shadow-md shadow-teal-500/30">
                <Footprints className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-black text-white group-hover:text-teal-300 transition-colors">
                  My Transformation Journey
                </h4>
                <p className="text-xs text-foreground/60 mt-0.5">
                  Review historical VeSync body composition scans, photo check-ins, and milestone achievements.
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-foreground/50 transition-transform group-hover:translate-x-1 group-hover:text-teal-300" />
          </div>
        </Link>
      </section>

    </div>
  )
}

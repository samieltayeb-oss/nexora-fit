'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  Dumbbell, 
  ArrowRight, 
  Watch, 
  RefreshCw, 
  Sparkles, 
  Flame, 
  Zap, 
  ChevronRight,
  TrendingDown,
  Target,
  Check
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { NumberCounter } from '@/components/motion/number-counter'

export default function DashboardPage() {
  const [weight, setWeight] = useState<number>(82.10)
  const goalWeight = 75.0
  const startWeight = 85.0
  const progressPercent = Math.max(0, Math.min(100, ((startWeight - weight) / (startWeight - goalWeight)) * 100))
  
  const [activeCalories, setActiveCalories] = useState<number>(530)
  const [stepCount, setStepCount] = useState<number>(9450)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSyncSuccess, setShowSyncSuccess] = useState(false)

  const fetchHealthData = async () => {
    setIsRefreshing(true)
    try {
      const supabase = createClient()
      
      const { data } = await supabase
        .from('health_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (data && data.length > 0) {
        const calLog = data.find(l => l.log_type === 'active_calories')
        const stepLog = data.find(l => l.log_type === 'steps')

        if (calLog?.value_numeric) setActiveCalories(Number(calLog.value_numeric))
        if (stepLog?.value_numeric) setStepCount(Number(stepLog.value_numeric))
      }

      const { data: bodyData } = await supabase
        .from('body_measurements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

      if (bodyData && bodyData.length > 0 && bodyData[0].weight_kg) {
        setWeight(Number(bodyData[0].weight_kg))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchHealthData()
  }, [])

  const handleSyncClick = async () => {
    await fetchHealthData()
    setShowSyncSuccess(true)
    setTimeout(() => setShowSyncSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* ── TOP HEADER ────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">
            Good morning, Sam
          </h1>
          <p className="text-slate-400 mt-1 font-medium">
            Friday, July 31 • Week 1 Phase 1
          </p>
        </div>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-full overflow-hidden shadow-[0_0_15px_var(--accent-primary-glow)] cursor-pointer p-[1px] bg-gradient-to-b from-white/20 to-transparent"
        >
          {/* Mesh gradient avatar */}
          <div className="w-full h-full bg-gradient-to-tr from-[var(--accent-primary)] via-cyan-400 to-indigo-500 flex items-center justify-center text-slate-950 font-black text-lg">
            S
          </div>
        </motion.div>
      </header>

      {/* ── FLAGSHIP HERO: GOAL PROGRESS & READINESS ───────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Goal Card */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between min-h-[280px]">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary-glow)] rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 mb-4">
                  <Target className="w-3.5 h-3.5 text-[var(--accent-primary)]" /> Trajectory Focus
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl md:text-6xl font-bold tracking-tighter">
                    <NumberCounter value={weight} decimals={2} />
                  </span>
                  <span className="text-xl text-slate-400 font-medium">kg</span>
                </div>
                <p className="text-sm text-slate-400 mt-2 font-medium flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-[var(--accent-success)]" />
                  <span className="text-[var(--accent-success)]">{(startWeight - weight).toFixed(2)}kg lost</span>
                  <span className="mx-1">•</span>
                  {(weight - goalWeight).toFixed(2)}kg to goal
                </p>
              </div>

              {/* Minimal Progress Line */}
              <div className="mt-8 pt-4">
                <div className="flex justify-between text-xs text-slate-500 font-medium mb-2">
                  <span>Start: {startWeight}kg</span>
                  <span>Goal: {goalWeight}kg</span>
                </div>
                <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-[var(--accent-primary)] rounded-full relative"
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/50" />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Dimensional Progress Indicator */}
            <div className="flex items-center justify-center relative w-40 h-40 self-center">
              <svg className="w-full h-full transform -rotate-90 filter drop-shadow-2xl">
                {/* Background Track */}
                <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
                {/* Foreground Track */}
                <motion.circle 
                  cx="80" cy="80" r="70" 
                  stroke="var(--accent-primary)" 
                  strokeWidth="12" 
                  strokeDasharray="440" 
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset: 440 - (440 * progressPercent) / 100 }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                  strokeLinecap="round" 
                  fill="none" 
                  className="drop-shadow-[0_0_15px_var(--accent-primary-glow)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
                  <NumberCounter value={progressPercent} decimals={0} />%
                </span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">There</span>
              </div>
            </div>
          </div>
        </div>

        {/* Readiness/Recovery Card */}
        <div className="glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-success)]/10 rounded-full blur-[60px]" />
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-success)]/10 text-xs font-semibold text-[var(--accent-success)] mb-4">
              <Zap className="w-3.5 h-3.5" /> High Readiness
            </div>
            <h3 className="text-3xl font-bold tracking-tight text-[var(--foreground)] mb-2">Prime</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Your recovery is optimal today. You have the green light to push intensity in the gym.
            </p>
          </div>

          <div className="mt-6 flex gap-2">
            <div className="h-1.5 flex-1 bg-[var(--accent-success)] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
            <div className="h-1.5 flex-1 bg-[var(--accent-success)] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
            <div className="h-1.5 flex-1 bg-slate-800 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── TODAY'S WORKOUT FEATURE ───────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight">Today's Protocol</h2>
          <Link href="/workout" className="text-sm font-medium text-[var(--accent-primary)] hover:text-cyan-300 transition-colors">
            View Program
          </Link>
        </div>
        
        <Link href="/workout/active">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="group relative h-[320px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl"
          >
            {/* Background Image with premium blur-up */}
            <Image 
              src="/artifacts/exercises/hero_dashboard_banner.png" 
              alt="Today's Workout"
              fill
              className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Rich multi-stop gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/60 to-transparent opacity-90" />
            
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">
              <div className="flex justify-between items-start">
                <span className="glass-panel px-4 py-1.5 rounded-full text-xs font-semibold text-[var(--foreground)]">
                  Gym Machine Phase
                </span>
                <span className="glass-panel px-4 py-1.5 rounded-full text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[var(--accent-warning)]" /> 45-60 Min
                </span>
              </div>

              <div>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3 drop-shadow-md">
                  Full Body Foundation
                </h3>
                <p className="text-slate-300 text-sm md:text-base font-medium max-w-md mb-6 leading-relaxed drop-shadow">
                  Cardio Warm-Up + 3 Primary Gym Machines. Establish the baseline safely.
                </p>
                
                <div className="inline-flex items-center gap-3 glass-panel px-6 py-3.5 rounded-2xl font-bold text-sm text-white hover:bg-white/10 transition-colors shadow-2xl active:scale-95">
                  <Dumbbell className="w-4 h-4" /> Start Workout <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      </section>

      {/* ── TODAY'S SIGNALS (Health Sync) ────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight">Today's Signals</h2>
          <button 
            onClick={handleSyncClick}
            disabled={isRefreshing}
            className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
              showSyncSuccess 
                ? 'bg-[var(--accent-success)]/20 text-[var(--accent-success)] shadow-[0_0_10px_var(--accent-success)]'
                : 'glass-panel text-slate-400 hover:text-[var(--foreground)] active:scale-95'
            }`}
          >
            {showSyncSuccess ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <Check className="w-3.5 h-3.5" />
              </motion.div>
            ) : (
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            )}
            {showSyncSuccess ? 'Synced' : 'Sync Watch'}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Signal Card: Steps */}
          <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group">
            <div className="text-slate-400 mb-2">
              <Activity className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
              <NumberCounter value={stepCount} />
            </div>
            <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Steps</div>
          </div>

          {/* Signal Card: Calories */}
          <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group">
            <div className="text-[var(--accent-warning)] mb-2">
              <Flame className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
              <NumberCounter value={activeCalories} />
            </div>
            <div className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Active Kcal</div>
          </div>

        </div>
      </section>
      
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  Dumbbell, 
  ArrowRight, 
  ShieldCheck, 
  Watch, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Zap, 
  ChevronRight,
  TrendingDown,
  Scale,
  Crown,
  Heart,
  Moon,
  BatteryCharging
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { NumberCounter } from '@/components/motion/number-counter'
import { AnimatedCard } from '@/components/motion/animated-card'
import { Gym3DDashboard } from '@/components/3d/gym-3d-dashboard'

export default function DashboardPage() {
  const [weight, setWeight] = useState<number>(82.10)
  const goalWeight = 75.0
  const startWeight = 85.0
  const progressPercent = Math.max(0, Math.min(100, ((startWeight - weight) / (startWeight - goalWeight)) * 100))
  
  const [activeCalories, setActiveCalories] = useState<number>(530)
  const [stepCount, setStepCount] = useState<number>(9450)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSyncSuccess, setShowSyncSuccess] = useState(false)
  const [weightSource, setWeightSource] = useState<string>('VeSync Smart Scale')

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
        setWeightSource('VeSync Scale Synced')
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
    <div className="p-4 md:p-8 space-y-8 max-w-2xl mx-auto font-sans text-slate-100 pb-32 md:pb-16 selection:bg-teal-500 selection:text-slate-950">
      
      {/* Editorial Header */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between pt-2"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gradient-to-r from-teal-500/15 via-cyan-500/15 to-transparent border border-teal-400/20 text-teal-300 text-[11px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-[0_0_20px_rgba(20,184,166,0.15)]">
              <Crown className="w-3.5 h-3.5 text-amber-400" /> SAM FIT ELITE 3D
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mt-2 flex items-center gap-2 drop-shadow-md">
            Today <Sparkles className="w-7 h-7 text-teal-400 animate-pulse" />
          </h1>
          <p className="text-slate-400 text-xs md:text-sm font-medium mt-0.5">Friday, July 31 • Week 1 Phase 1</p>
        </div>

        <motion.div 
          whileHover={{ scale: 1.08, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="relative cursor-pointer"
        >
          <div className="absolute -inset-1.5 bg-gradient-to-tr from-teal-500 via-cyan-400 to-indigo-500 rounded-full blur-lg opacity-70 animate-pulse" />
          <div className="relative w-14 h-14 bg-slate-950/90 rounded-full flex items-center justify-center border border-white/20 font-black text-teal-400 text-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            S
          </div>
        </motion.div>
      </motion.div>

      {/* 👑 Interactive 3D Gym & Muscle Model Engine */}
      <AnimatedCard delay={0.1}>
        <Gym3DDashboard />
      </AnimatedCard>

      {/* Hero Apple Fitness+ Style Weight Loss Journey Card */}
      <AnimatedCard delay={0.2}>
        <div className="p-6 md:p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
            <div>
              <span className="text-xs font-black text-teal-400 uppercase tracking-widest flex items-center gap-2">
                <Scale className="w-4 h-4" /> Weight Loss Trajectory
              </span>
              <div className="text-5xl font-black text-white tracking-tight mt-2 flex items-baseline gap-2">
                <NumberCounter value={weight} decimals={2} />
                <span className="text-xl text-slate-400 font-bold">kg</span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">Goal: {goalWeight}.0 kg • Journey to 75kg</p>
            </div>

            {/* Apple Fitness Style Circular Ring Meter */}
            <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="8" className="text-slate-800/60" fill="transparent" />
                <motion.circle 
                  cx="48" 
                  cy="48" 
                  r="38" 
                  stroke="url(#ringGradient)" 
                  strokeWidth="8" 
                  strokeDasharray="238" 
                  initial={{ strokeDashoffset: 238 }}
                  animate={{ strokeDashoffset: 238 - (238 * progressPercent) / 100 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  strokeLinecap="round" 
                  fill="transparent" 
                />
                <defs>
                  <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00F5D4" />
                    <stop offset="100%" stopColor="#00B4D8" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <NumberCounter value={progressPercent} decimals={0} suffix="%" className="text-base font-black text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-white/[0.06] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-500 rounded-full relative shadow-[0_0_20px_rgba(20,184,166,0.6)]"
              >
                <div className="absolute top-0 right-0 bottom-0 w-3 bg-white/70 rounded-full blur-[1px]" />
              </motion.div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-bold mt-1">
              <span>Start: {startWeight}.0 kg</span>
              <span className="text-teal-400 font-black flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" /> {(weight - goalWeight).toFixed(2)} kg remaining
              </span>
              <span>Target: {goalWeight}.0 kg</span>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Nike Training Club Style Hero Workout Studio Card */}
      <AnimatedCard delay={0.3}>
        <div className="relative rounded-3xl overflow-hidden group">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/artifacts/exercises/hero_dashboard_banner.png" 
              alt="Hero Gym Studio"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.4]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          </div>

          <div className="relative z-10 p-6 md:p-8 space-y-5">
            <div className="flex justify-between items-center">
              <span className="px-3.5 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-xs font-black text-teal-300 backdrop-blur-xl flex items-center gap-1.5 shadow-lg">
                <Flame className="w-4 h-4 text-amber-400 animate-bounce" /> Full Body Day A
              </span>
              <span className="text-xs font-extrabold text-slate-200 backdrop-blur-xl px-3.5 py-1 bg-black/40 rounded-full border border-white/10 shadow-lg">
                45-60 MIN
              </span>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-2xl leading-tight">
                Full Body Foundation
              </h2>
              <p className="text-slate-300 text-xs md:text-sm mt-2 max-w-md font-medium leading-relaxed drop-shadow">
                Cardio Warm-Up + 3 Primary Gym Machines (Leg Press, Chest Press, Seated Row). Step-by-step visual coaching included.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link href="/workout/active" className="flex-1">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 text-slate-950 font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_35px_rgba(20,184,166,0.35)] tracking-wide cursor-pointer text-base"
                >
                  Start Guided Session <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Visual Health Gauges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Apple Watch & Scale Live Health Card */}
        <AnimatedCard delay={0.4}>
          <div className="p-6 space-y-4 relative group h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  <Watch className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Apple Watch & Scale</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Live HealthKit Sync</p>
                </div>
              </div>
              {isRefreshing && <RefreshCw className="w-4 h-4 text-teal-400 animate-spin" />}
            </div>

            <div className="space-y-2 bg-slate-950/80 p-4 rounded-2xl border border-white/[0.05] shadow-inner">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-400" /> Daily Steps
                </span>
                <NumberCounter value={stepCount} className="text-xl font-black text-white tracking-tight" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400" /> Active Calories
                </span>
                <NumberCounter value={activeCalories} suffix=" kcal" className="text-xl font-black text-rose-400 tracking-tight" />
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <span className="text-xs text-slate-400 font-bold">Scale Weight</span>
                <span className="text-sm font-black text-teal-400">{weight} kg</span>
              </div>
            </div>

            <button 
              onClick={handleSyncClick}
              disabled={isRefreshing}
              className="text-xs bg-gradient-to-r from-slate-800/80 to-slate-850/80 hover:from-slate-750 hover:to-slate-800 text-slate-200 font-extrabold py-3.5 px-4 rounded-2xl w-full flex justify-center items-center gap-2 border border-white/[0.08] transition-all active:scale-95 shadow-lg"
            >
              <RefreshCw className={`w-4 h-4 text-teal-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Syncing...' : 'Sync Watch & Scale'}
            </button>

            {showSyncSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 text-xs font-black px-4 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Watch & Scale Synced!
              </motion.div>
            )}
          </div>
        </AnimatedCard>

        {/* WHOOP Strain & Readiness Card */}
        <AnimatedCard delay={0.5}>
          <div className="p-6 space-y-4 flex flex-col justify-between h-full">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Gym Readiness</h3>
                <p className="text-[10px] text-slate-400 font-medium">Safety Protocol Active</p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/[0.05] shadow-inner space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold">Safety Cap</span>
                <span className="text-xs font-black text-amber-400 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full">RPE 5-6</span>
              </div>
              <div className="text-lg font-black text-white tracking-tight">Non-Failure Training</div>
              <p className="text-[11px] text-slate-400 font-medium leading-normal">Keep 3-4 repetitions left in reserve for cardiovascular safety.</p>
            </div>

            <Link href="/health">
              <div className="text-xs bg-slate-800/80 hover:bg-slate-750 text-slate-200 font-extrabold py-3.5 px-4 rounded-2xl w-full flex justify-center items-center gap-1 border border-white/[0.08] transition-all active:scale-95 shadow-lg">
                Log BP & Health <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </Link>
          </div>
        </AnimatedCard>

      </div>
    </div>
  )
}

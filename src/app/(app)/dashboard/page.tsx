'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  Dumbbell, 
  ArrowRight, 
  RefreshCw, 
  Flame, 
  Zap, 
  TrendingDown,
  Target,
  Check
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { NumberCounter } from '@/components/ui/number-counter'
import { Card, CardContent } from '@/design/components/card'
import { Button } from '@/design/components/button'
import { StatCard } from '@/design/components/stat-card'
import { ProgressRing } from '@/design/components/progress-ring'

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

      {/* ── FLAGSHIP HERO: GOAL PROGRESS & READINESS ───────────────────────── */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Goal Card */}
        <Card className="relative overflow-hidden lg:col-span-2">
          {/* Subtle decorative glow */}
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/20 blur-[80px]" />
          
          <CardContent className="relative z-10 flex h-full flex-col justify-between gap-8 p-6 md:flex-row md:p-8">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-elevated px-3 py-1 text-xs font-semibold text-foreground/90">
                  <Target className="h-3.5 w-3.5 text-primary" /> Trajectory Focus
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-display-lg tracking-tighter text-foreground">
                    <NumberCounter value={weight} decimals={2} />
                  </span>
                  <span className="text-xl font-medium text-foreground/70">kg</span>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-foreground/70">
                  <TrendingDown className="h-4 w-4 text-success" />
                  <span className="text-success">{(startWeight - weight).toFixed(2)}kg lost</span>
                  <span className="mx-1">•</span>
                  {(weight - goalWeight).toFixed(2)}kg to goal
                </p>
              </div>

              {/* Minimal Progress Line */}
              <div className="mt-8 pt-4">
                <div className="mb-2 flex justify-between font-mono text-xs font-medium text-foreground/50">
                  <span>Start: {startWeight}kg</span>
                  <span>Goal: {goalWeight}kg</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-elevated">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="relative h-full rounded-full bg-primary"
                  >
                    <div className="absolute bottom-0 right-0 top-0 w-8 bg-gradient-to-r from-transparent to-white/50" />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Dimensional Progress Indicator */}
            <div className="self-center">
              <ProgressRing value={progressPercent} size={140} strokeWidth={10}>
                <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                  <NumberCounter value={progressPercent} decimals={0} />%
                </span>
                <span className="mt-1 font-mono text-[10px] font-medium uppercase tracking-wider text-foreground/70">There</span>
              </ProgressRing>
            </div>
          </CardContent>
        </Card>

        {/* Readiness/Recovery Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-success/10 blur-[60px]" />
          <CardContent className="flex h-full flex-col justify-between p-6">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                <Zap className="h-3.5 w-3.5" /> High Readiness
              </div>
              <h3 className="mb-2 font-display text-3xl font-bold tracking-tight text-foreground">Prime</h3>
              <p className="leading-relaxed text-foreground/70">
                Your recovery is optimal today. You have the green light to push intensity in the gym.
              </p>
            </div>
            <div className="mt-6 flex gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-success shadow-[0_0_10px_var(--color-success)]" />
              <div className="h-1.5 flex-1 rounded-full bg-success shadow-[0_0_10px_var(--color-success)]" />
              <div className="h-1.5 flex-1 rounded-full bg-surface-elevated" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── TODAY'S WORKOUT FEATURE ───────────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-foreground">Today's Protocol</h2>
          <Link href="/workout" className="text-sm font-medium text-primary transition-colors hover:text-primary-hover">
            View Program
          </Link>
        </div>
        
        <Link href="/workout/active">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="group relative h-[320px] cursor-pointer overflow-hidden rounded-3xl shadow-2xl"
          >
            {/* Background Image with premium blur-up */}
            <Image 
              src="/artifacts/exercises/hero_dashboard_banner.png" 
              alt="Today's Workout"
              fill
              className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Rich multi-stop gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" />
            
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-8">
              <div className="flex items-start justify-between">
                <span className="rounded-full border border-border-subtle bg-surface/50 px-4 py-1.5 text-xs font-semibold text-foreground backdrop-blur-md">
                  Gym Machine Phase
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface/50 px-4 py-1.5 text-xs font-semibold text-foreground backdrop-blur-md">
                  <Flame className="h-3.5 w-3.5 text-warning" /> 45-60 Min
                </span>
              </div>

              <div>
                <h3 className="mb-3 font-display text-4xl font-bold tracking-tight text-foreground drop-shadow-md md:text-5xl">
                  Full Body Foundation
                </h3>
                <p className="mb-6 max-w-md font-medium leading-relaxed text-foreground/90 drop-shadow md:text-base">
                  Cardio Warm-Up + 3 Primary Gym Machines. Establish the baseline safely.
                </p>
                <Button className="gap-2 shadow-2xl">
                  <Dumbbell className="h-4 w-4" /> Start Workout <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </Link>
      </section>

      {/* ── TODAY'S SIGNALS (Health Sync) ────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-foreground">Today's Signals</h2>
          <Button 
            variant="secondary"
            size="sm"
            onClick={handleSyncClick}
            disabled={isRefreshing}
            className={showSyncSuccess ? "border-success bg-success/20 text-success" : ""}
          >
            {showSyncSuccess ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <Check className="mr-1.5 h-3.5 w-3.5" />
              </motion.div>
            ) : (
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            )}
            {showSyncSuccess ? 'Synced' : 'Sync Watch'}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            title="Steps"
            value={<NumberCounter value={stepCount} />}
            icon={Activity}
          />
          <StatCard
            title="Active Kcal"
            value={<NumberCounter value={activeCalories} />}
            icon={Flame}
          />
        </div>
      </section>
      
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { WeightChart } from '@/components/weight-chart'
import { TrendingDown, Sparkles, RefreshCw, Cpu, Activity, Flame, Zap, Droplets, Dumbbell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { NumberCounter } from '@/components/motion/number-counter'

export default function ProgressPage() {
  const [weight, setWeight] = useState<number>(82.10)
  const [bodyFat, setBodyFat] = useState<number>(23.6)
  const [muscleMass, setMuscleMass] = useState<number>(59.06)
  const [visceralFat, setVisceralFat] = useState<number>(10)
  const [bmi, setBmi] = useState<number>(27.5)
  const [bmr, setBmr] = useState<number>(1733)
  const [bodyWater, setBodyWater] = useState<number>(55.1)
  const [skeletalMuscle, setSkeletalMuscle] = useState<number>(49.3)
  const [boneMass, setBoneMass] = useState<number>(3.11)
  const [protein, setProtein] = useState<number>(17.4)
  const [metabolicAge, setMetabolicAge] = useState<number>(49)
  const [subcutFat, setSubcutFat] = useState<number>(20.5)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchProgress = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const { data: bodyData } = await supabase
        .from('body_measurements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (bodyData && bodyData.length > 0) {
        const weightRow = bodyData.find(r => r.weight_kg !== null)
        if (weightRow) setWeight(Number(weightRow.weight_kg))
        
        const fatRow = bodyData.find(r => r.body_fat_percentage !== null)
        if (fatRow) setBodyFat(Number(fatRow.body_fat_percentage))
      }

      const { data: logsData } = await supabase
        .from('health_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30)

      if (logsData && logsData.length > 0) {
        const fatLog = logsData.find(l => l.log_type === 'body_fat')
        if (fatLog?.value_numeric) setBodyFat(Number(fatLog.value_numeric))

        const bmiLog = logsData.find(l => l.log_type === 'bmi')
        if (bmiLog?.value_numeric) setBmi(Number(bmiLog.value_numeric))

        const muscleLog = logsData.find(l => l.log_type === 'muscle_mass')
        if (muscleLog?.value_numeric) setMuscleMass(Number(muscleLog.value_numeric))

        const visceralLog = logsData.find(l => l.log_type === 'visceral_fat')
        if (visceralLog?.value_numeric) setVisceralFat(Number(visceralLog.value_numeric))

        const waterLog = logsData.find(l => l.log_type === 'body_water')
        if (waterLog?.value_numeric) setBodyWater(Number(waterLog.value_numeric))

        const skelLog = logsData.find(l => l.log_type === 'skeletal_muscle')
        if (skelLog?.value_numeric) setSkeletalMuscle(Number(skelLog.value_numeric))

        const boneLog = logsData.find(l => l.log_type === 'bone_mass')
        if (boneLog?.value_numeric) setBoneMass(Number(boneLog.value_numeric))

        const protLog = logsData.find(l => l.log_type === 'protein')
        if (protLog?.value_numeric) setProtein(Number(protLog.value_numeric))

        const bmrLog = logsData.find(l => l.log_type === 'bmr')
        if (bmrLog?.value_numeric) setBmr(Number(bmrLog.value_numeric))

        const ageLog = logsData.find(l => l.log_type === 'metabolic_age')
        if (ageLog?.value_numeric) setMetabolicAge(Number(ageLog.value_numeric))

        const subLog = logsData.find(l => l.log_type === 'subcutaneous_fat')
        if (subLog?.value_numeric) setSubcutFat(Number(subLog.value_numeric))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProgress()
  }, [])

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* ── TOP HEADER ────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg border border-[var(--accent-primary)]/20">
              <Cpu className="w-3.5 h-3.5" /> VeSync Engine
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight mt-2 flex items-center gap-2">
            Body Composition
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1">Live metrics from your smart scale</p>
        </div>

        <button 
          onClick={fetchProgress}
          disabled={isLoading}
          className="glass-panel hover:bg-white/5 hover:shadow-[0_0_15px_var(--accent-primary-glow)] text-[var(--accent-primary)] text-xs font-bold px-4 py-2 rounded-2xl flex items-center gap-2 transition-all active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> 
          <span className="hidden md:inline">{isLoading ? 'Syncing...' : 'Sync Scale'}</span>
        </button>
      </header>

      {/* ── HERO: WEIGHT JOURNEY ─────────────────────────────────────────────── */}
      <section className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-primary-glow)] rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Current Weight</h2>
            <div className="text-6xl md:text-7xl font-bold text-[var(--foreground)] tracking-tighter mt-1 flex items-baseline gap-2">
              <NumberCounter value={weight} decimals={2} /> <span className="text-2xl text-slate-400 font-medium tracking-normal">kg</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[var(--accent-success)] bg-[var(--accent-success)]/10 px-4 py-2 rounded-2xl text-xs font-bold">
            <TrendingDown className="w-4 h-4" /> {(weight - 75.0).toFixed(2)} kg to goal
          </div>
        </div>

        <div className="relative z-10">
          <WeightChart />
        </div>
      </section>

      {/* ── THE METRICS STORY ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Health Indicators */}
        <section className="glass-panel rounded-3xl p-6 relative overflow-hidden">
          <h3 className="text-lg font-bold text-[var(--foreground)] tracking-tight mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[var(--accent-primary)]" /> Core Indicators
          </h3>
          <div className="space-y-4">
            <MetricRow icon={<Activity />} label="BMI" value={bmi} suffix="" status="High" statusColor="amber" index={0} />
            <MetricRow icon={<Flame />} label="Body Fat" value={bodyFat} suffix="%" status="Standard" statusColor="teal" index={1} />
            <MetricRow icon={<Zap />} label="Visceral Fat" value={visceralFat} suffix="" status="Standard" statusColor="teal" index={2} />
            <MetricRow icon={<Activity />} label="Subcutaneous Fat" value={subcutFat} suffix="%" status="High" statusColor="amber" index={3} />
          </div>
        </section>

        {/* Composition Breakdown */}
        <section className="glass-panel rounded-3xl p-6 relative overflow-hidden">
          <h3 className="text-lg font-bold text-[var(--foreground)] tracking-tight mb-6 flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-[var(--accent-primary)]" /> Composition
          </h3>
          <div className="space-y-4">
            <MetricRow icon={<Dumbbell />} label="Muscle Mass" value={muscleMass} suffix=" kg" status="Standard" statusColor="teal" index={2} />
            <MetricRow icon={<Dumbbell />} label="Skeletal Muscle" value={skeletalMuscle} suffix="%" status="Standard" statusColor="teal" index={3} />
            <MetricRow icon={<Activity />} label="Bone Mass" value={boneMass} suffix=" kg" status="Standard" statusColor="teal" index={4} />
            <MetricRow icon={<Droplets />} label="Body Water" value={bodyWater} suffix="%" status="Standard" statusColor="teal" index={5} />
          </div>
        </section>

        {/* Metabolic Profile */}
        <section className="glass-panel rounded-3xl p-6 relative overflow-hidden md:col-span-2">
          <h3 className="text-lg font-bold text-[var(--foreground)] tracking-tight mb-6 flex items-center gap-2">
            <Flame className="w-5 h-5 text-[var(--accent-warning)]" /> Metabolic Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <MetricRow icon={<Activity />} label="Protein" value={protein} suffix="%" status="Standard" statusColor="teal" index={4} />
            <MetricRow icon={<Flame />} label="Basal Metabolic Rate" value={bmr} suffix=" kcal" status="Standard" statusColor="teal" index={5} />
            <MetricRow icon={<Activity />} label="Fat-Free Weight" value={62.23} suffix=" kg" status="Standard" statusColor="teal" index={6} />
            <MetricRow icon={<Activity />} label="Metabolic Age" value={metabolicAge} suffix=" yrs" status="High" statusColor="amber" index={7} />
          </div>
        </section>
      </div>

    </div>
  )
}

function MetricRow({ 
  icon, label, value, suffix, status, statusColor, index = 0
}: { 
  icon: React.ReactNode, label: string, value: number, suffix: string, status: string, statusColor: 'teal' | 'amber', index?: number 
}) {
  const colorMap = {
    teal: 'text-[var(--accent-success)] bg-[var(--accent-success)]/10',
    amber: 'text-[var(--accent-warning)] bg-[var(--accent-warning)]/10'
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 + 0.1, duration: 0.4 }}
      className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 group hover:bg-white/[0.02] -mx-2 px-2 rounded-xl transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
          {icon}
        </div>
        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-base font-bold text-[var(--foreground)]">
          <NumberCounter value={value} decimals={label === 'Visceral Fat' || label === 'Basal Metabolic Rate' || label === 'Metabolic Age' ? 0 : 1} />
          {suffix}
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colorMap[statusColor]}`}>
          {status}
        </span>
      </div>
    </motion.div>
  )
}

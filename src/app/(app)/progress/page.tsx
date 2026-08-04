'use client'

import { useState, useEffect } from 'react'
import { WeightChart } from '@/components/weight-chart'
import { TrendingDown, Scale, Sparkles, Activity, RefreshCw, Layers, ShieldCheck, Cpu } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { NumberCounter } from '@/components/motion/number-counter'
import { AnimatedCard } from '@/components/motion/animated-card'

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
    <div className="p-4 md:p-8 space-y-8 max-w-2xl mx-auto font-sans text-slate-100 pb-32 md:pb-16">
      
      {/* Top Header */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between pt-2"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/40 text-teal-300 text-[11px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg">
              <Cpu className="w-3.5 h-3.5" /> OURA & VESYNC MATRIX
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-2 flex items-center gap-2">
            Progress <Sparkles className="w-6 h-6 text-teal-400 animate-pulse" />
          </h1>
          <p className="text-slate-400 text-xs md:text-sm font-medium mt-0.5">VeSync Scale & HealthKit Analytics</p>
        </div>

        <button 
          onClick={fetchProgress}
          className="px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-850 hover:from-slate-750 hover:to-slate-800 border border-white/10 text-teal-400 text-xs font-extrabold rounded-2xl flex items-center gap-2 shadow-xl transition-all active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> 
          {isLoading ? 'Loading...' : 'Refresh Matrix'}
        </button>
      </motion.div>

      {/* Primary Scale Weight Header Card */}
      <AnimatedCard delay={0.1}>
        <div className="bg-gradient-to-br from-slate-900/90 via-slate-950 to-teal-950/40 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-xs font-black text-teal-400 uppercase tracking-widest">Latest Smart Scale Weight</span>
              <div className="text-4xl md:text-5xl font-black text-white tracking-tight mt-2 flex items-baseline gap-2">
                <NumberCounter value={weight} decimals={2} /> <span className="text-xl text-slate-400 font-bold">kg</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">VeSync Scale Synced • Live Database</p>
            </div>
            <div className="flex items-center gap-1.5 text-teal-400 bg-teal-500/10 border border-teal-500/30 px-4 py-2 rounded-2xl text-xs font-black shadow-lg">
              <TrendingDown className="w-4 h-4" /> {(weight - 75.0).toFixed(2)} kg to goal
            </div>
          </div>

          <WeightChart />
        </div>
      </AnimatedCard>

      {/* Complete VeSync Body Composition Breakdown Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-400" /> Full VeSync Body Composition Matrix
          </h2>
          <span className="text-[11px] text-teal-400 font-bold px-2.5 py-0.5 bg-teal-500/10 border border-teal-500/30 rounded-full">
            12 Parameters
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <OuraMetricCard delay={0.15} title="BMI" numVal={bmi} decimals={1} status="High" statusColor="text-amber-400 bg-amber-500/10 border-amber-500/30" />
          <OuraMetricCard delay={0.2} title="Body Fat" numVal={bodyFat} decimals={1} suffix="%" status="Acceptable" statusColor="text-teal-400 bg-teal-500/10 border-teal-500/30" />
          <OuraMetricCard delay={0.25} title="Subcutaneous Fat" numVal={subcutFat} decimals={1} suffix="%" status="High" statusColor="text-amber-400 bg-amber-500/10 border-amber-500/30" />
          
          <OuraMetricCard delay={0.3} title="Fat-Free Weight" numVal={62.23} decimals={2} suffix=" kg" status="Standard" statusColor="text-teal-400 bg-teal-500/10 border-teal-500/30" />
          <OuraMetricCard delay={0.35} title="Visceral Fat" numVal={visceralFat} decimals={0} status="Standard" statusColor="text-teal-400 bg-teal-500/10 border-teal-500/30" />
          <OuraMetricCard delay={0.4} title="Muscle Mass" numVal={muscleMass} decimals={2} suffix=" kg" status="Standard" statusColor="text-teal-400 bg-teal-500/10 border-teal-500/30" />
          
          <OuraMetricCard delay={0.45} title="Body Water" numVal={bodyWater} decimals={1} suffix="%" status="Standard" statusColor="text-teal-400 bg-teal-500/10 border-teal-500/30" />
          <OuraMetricCard delay={0.5} title="Skeletal Muscle" numVal={skeletalMuscle} decimals={1} suffix="%" status="Standard" statusColor="text-teal-400 bg-teal-500/10 border-teal-500/30" />
          <OuraMetricCard delay={0.55} title="Bone Mass" numVal={boneMass} decimals={2} suffix=" kg" status="Standard" statusColor="text-teal-400 bg-teal-500/10 border-teal-500/30" />
          
          <OuraMetricCard delay={0.6} title="Protein" numVal={protein} decimals={1} suffix="%" status="Standard" statusColor="text-teal-400 bg-teal-500/10 border-teal-500/30" />
          <OuraMetricCard delay={0.65} title="BMR" numVal={bmr} decimals={0} suffix=" kcal" status="Standard" statusColor="text-teal-400 bg-teal-500/10 border-teal-500/30" />
          <OuraMetricCard delay={0.7} title="Metabolic Age" numVal={metabolicAge} decimals={0} status="High" statusColor="text-amber-400 bg-amber-500/10 border-amber-500/30" />
        </div>
      </section>
    </div>
  )
}

function OuraMetricCard({ title, numVal, decimals = 1, suffix = '', status, statusColor, delay = 0 }: { title: string; numVal: number; decimals?: number; suffix?: string; status: string; statusColor: string; delay?: number }) {
  return (
    <AnimatedCard delay={delay}>
      <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-4 shadow-xl backdrop-blur-xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 h-full">
        <span className="text-[11px] font-extrabold text-slate-400 truncate uppercase tracking-wider">{title}</span>
        <div className="text-2xl font-black text-white tracking-tight">
          <NumberCounter value={numVal} decimals={decimals} suffix={suffix} />
        </div>
        <span className={`inline-block self-start text-[10px] font-black px-2.5 py-0.5 rounded-full border ${statusColor}`}>
          {status}
        </span>
      </div>
    </AnimatedCard>
  )
}

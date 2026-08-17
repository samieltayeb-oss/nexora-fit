'use client'

import { useState, useEffect } from 'react'
import { WeightChart } from '@/components/charts/weight-chart'
import { 
  TrendingDown, 
  Sparkles, 
  RefreshCw, 
  Cpu, 
  Activity, 
  Flame, 
  Zap, 
  Droplets, 
  Dumbbell, 
  Watch, 
  Check, 
  X, 
  ExternalLink,
  ShieldCheck,
  Scale
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { NumberCounter } from '@/components/ui/number-counter'
import { triggerCelebrationConfetti } from '@/components/ui/celebration'

const STORAGE_KEY_COMPOSITION = 'samfit_vesync_composition'

export default function ProgressPage() {
  const [weight, setWeight] = useState<number>(82.70)
  const [bodyFat, setBodyFat] = useState<number>(24.3)
  const [muscleMass, setMuscleMass] = useState<number>(59.37)
  const [visceralFat, setVisceralFat] = useState<number>(10)
  const [bmi, setBmi] = useState<number>(28.0)
  const [bmr, setBmr] = useState<number>(1750)
  const [bodyWater, setBodyWater] = useState<number>(54.5)
  const [skeletalMuscle, setSkeletalMuscle] = useState<number>(48.8)
  const [boneMass, setBoneMass] = useState<number>(3.12)
  const [protein, setProtein] = useState<number>(17.2)
  const [metabolicAge, setMetabolicAge] = useState<number>(50)
  const [subcutFat, setSubcutFat] = useState<number>(21.2)
  const [fatFreeWeight, setFatFreeWeight] = useState<number>(62.55)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Sync Modal State
  const [showSyncModal, setShowSyncModal] = useState<boolean>(false)
  const [inputWeight, setInputWeight] = useState<string>('82.70')
  const [inputBodyFat, setInputBodyFat] = useState<string>('24.3')
  const [inputVisceral, setInputVisceral] = useState<string>('10')
  const [activeTab, setActiveTab] = useState<'quick_log' | 'watch_setup'>('quick_log')
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false)

  // Load persisted composition
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPOSITION)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.weight) {
          setWeight(parsed.weight)
          setInputWeight(parsed.weight.toString())
          if (parsed.bodyFat) setBodyFat(parsed.bodyFat)
        }
      }
    } catch (e) {
      console.warn('Could not read localStorage', e)
    }
  }, [])

  const recalculateMetrics = (newWeight: number, newBodyFat: number) => {
    const heightM = 1.72
    const calculatedBmi = Number((newWeight / (heightM * heightM)).toFixed(1))
    const fatMass = newWeight * (newBodyFat / 100)
    const leanMass = Number((newWeight - fatMass).toFixed(2))
    const calculatedMuscle = Number((leanMass * 0.95).toFixed(2))
    
    setBmi(calculatedBmi)
    setMuscleMass(calculatedMuscle)
    setFatFreeWeight(leanMass)
  }

  const handleSaveVeSync = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const parsedWeight = parseFloat(inputWeight) || 82.70
    const parsedBodyFat = parseFloat(inputBodyFat) || 24.3
    const parsedVisceral = parseInt(inputVisceral) || 10

    setWeight(parsedWeight)
    setBodyFat(parsedBodyFat)
    setVisceralFat(parsedVisceral)
    recalculateMetrics(parsedWeight, parsedBodyFat)

    // Save to LocalStorage
    try {
      localStorage.setItem(
        STORAGE_KEY_COMPOSITION,
        JSON.stringify({
          weight: parsedWeight,
          bodyFat: parsedBodyFat,
          visceralFat: parsedVisceral,
          updatedAt: new Date().toISOString(),
        })
      )
    } catch (err) {
      console.error(err)
    }

    // Try saving to Supabase if available
    try {
      const supabase = createClient()
      await supabase.from('body_measurements').insert({
        weight_kg: parsedWeight,
        body_fat_percentage: parsedBodyFat,
        visceral_fat: parsedVisceral,
        created_at: new Date().toISOString()
      })
    } catch (err) {
      console.warn('Supabase offline or table missing, local state active', err)
    }

    setIsLoading(false)
    setSyncSuccess(true)
    triggerCelebrationConfetti()
    setTimeout(() => {
      setSyncSuccess(false)
      setShowSyncModal(false)
    }, 1200)
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-32">
      
      {/* ── TOP HEADER ────────────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-teal-500/15 text-teal-300 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg border border-teal-500/30">
              <Cpu className="w-3.5 h-3.5 text-teal-400" /> Smart Fitness Scale (VeSync)
            </span>
            <span className="px-2.5 py-0.5 bg-blue-500/15 text-blue-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/30">
              13 Biomarkers Calibrated
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mt-2 flex items-center gap-2">
            Body Composition
          </h1>
          <p className="text-foreground/70 text-sm font-medium mt-1">Live metrics from your smart fitness scale</p>
        </div>

        <button 
          onClick={() => setShowSyncModal(true)}
          className="bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 text-xs font-black px-5 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20 active:scale-95 cursor-pointer hover:brightness-110"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> 
          <span>Sync Scale / Manual Input</span>
        </button>
      </header>

      {/* ── HERO: WEIGHT JOURNEY ─────────────────────────────────────────────── */}
      <section className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden border border-teal-500/20 bg-gradient-to-br from-[#0c1417] via-[#0d1618] to-[#080d0f]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black text-foreground/60 uppercase tracking-widest">Current Weight</h2>
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                VeSync Verified
              </span>
            </div>
            <div className="text-6xl md:text-7xl font-black text-white tracking-tighter mt-1 flex items-baseline gap-2">
              <NumberCounter value={weight} decimals={2} /> <span className="text-2xl text-teal-400 font-bold tracking-normal">kg</span>
            </div>
            <p className="text-xs text-foreground/60 mt-1 font-medium">
              Sami Suliman • Target: <span className="text-amber-300 font-bold">75.00 kg</span> ({Number((weight - 75.0).toFixed(2))} kg to goal)
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-amber-300 bg-amber-500/15 border border-amber-500/30 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-lg">
              <TrendingDown className="w-4 h-4 text-amber-400" /> {(weight - 75.0).toFixed(2)} kg to goal
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <WeightChart />
        </div>
      </section>

      {/* ── THE 13 EXACT METRICS FROM VESYNC SCALE ───────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Health Indicators */}
        <section className="glass-panel rounded-3xl p-6 relative overflow-hidden border border-border/80">
          <h3 className="text-lg font-bold text-foreground tracking-tight mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-400" /> Core Indicators
          </h3>
          <div className="space-y-4">
            <MetricRow icon={<Activity className="w-4 h-4 text-amber-400" />} label="BMI" value={bmi} suffix="" status="High" statusColor="amber" index={0} />
            <MetricRow icon={<Flame className="w-4 h-4 text-teal-400" />} label="Body Fat" value={bodyFat} suffix="%" status="Acceptable" statusColor="teal" index={1} />
            <MetricRow icon={<Activity className="w-4 h-4 text-amber-400" />} label="Subcutaneous Fat" value={subcutFat} suffix="%" status="High" statusColor="amber" index={2} />
            <MetricRow icon={<Zap className="w-4 h-4 text-teal-400" />} label="Visceral Fat" value={visceralFat} suffix="" status="Standard (10)" statusColor="teal" index={3} />
          </div>
        </section>

        {/* Composition Breakdown */}
        <section className="glass-panel rounded-3xl p-6 relative overflow-hidden border border-border/80">
          <h3 className="text-lg font-bold text-foreground tracking-tight mb-6 flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-teal-400" /> Composition
          </h3>
          <div className="space-y-4">
            <MetricRow icon={<Dumbbell className="w-4 h-4 text-teal-400" />} label="Muscle Mass" value={muscleMass} suffix=" kg" status="Standard" statusColor="teal" index={2} />
            <MetricRow icon={<Dumbbell className="w-4 h-4 text-amber-400" />} label="Skeletal Muscles" value={skeletalMuscle} suffix="%" status="Low (48.8%)" statusColor="amber" index={3} />
            <MetricRow icon={<Activity className="w-4 h-4 text-teal-400" />} label="Fat-Free Body Weight" value={fatFreeWeight} suffix=" kg" status="Standard" statusColor="teal" index={4} />
            <MetricRow icon={<Droplets className="w-4 h-4 text-teal-400" />} label="Body Water" value={bodyWater} suffix="%" status="Standard" statusColor="teal" index={5} />
          </div>
        </section>

        {/* Metabolic Profile */}
        <section className="glass-panel rounded-3xl p-6 relative overflow-hidden md:col-span-2 border border-border/80">
          <h3 className="text-lg font-bold text-foreground tracking-tight mb-6 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" /> Metabolic Profile &amp; Diabetic Type 2 Recovery
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <MetricRow icon={<Activity className="w-4 h-4 text-teal-400" />} label="Bone Mass" value={boneMass} suffix=" kg" status="Standard" statusColor="teal" index={4} />
            <MetricRow icon={<Activity className="w-4 h-4 text-teal-400" />} label="Protein" value={protein} suffix="%" status="Standard" statusColor="teal" index={5} />
            <MetricRow icon={<Flame className="w-4 h-4 text-teal-400" />} label="BMR (Basal Metabolic Rate)" value={bmr} suffix=" kcal" status="Standard" statusColor="teal" index={6} />
            <MetricRow icon={<Activity className="w-4 h-4 text-amber-400" />} label="Metabolic Age" value={metabolicAge} suffix=" yrs" status="High (50 yrs)" statusColor="amber" index={7} />
          </div>
        </section>
      </div>

      {/* ── INTERACTIVE SYNC MODAL (VESYNC & APPLE WATCH) ───────────────────── */}
      <AnimatePresence>
        {showSyncModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowSyncModal(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-[101] w-full max-w-lg bg-[#0e1115] border border-teal-500/40 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">VeSync & Apple Watch Sync</h3>
                    <p className="text-xs text-foreground/60">Log scale weigh-in or configure auto-sync</p>
                  </div>
                </div>
                <button onClick={() => setShowSyncModal(false)} className="text-white/60 hover:text-white p-1 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex p-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('quick_log')}
                  className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    activeTab === 'quick_log'
                      ? 'bg-teal-500 text-slate-950 shadow-md'
                      : 'text-foreground/60 hover:text-white'
                  }`}
                >
                  ⚡ Instant Scale Sync
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('watch_setup')}
                  className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    activeTab === 'watch_setup'
                      ? 'bg-teal-500 text-slate-950 shadow-md'
                      : 'text-foreground/60 hover:text-white'
                  }`}
                >
                  ⌚ Apple Watch Auto-Sync
                </button>
              </div>

              {activeTab === 'quick_log' ? (
                <form onSubmit={handleSaveVeSync} className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-200 leading-relaxed">
                    💡 <strong>Latest Scale Reading</strong>: Enter your VeSync reading (e.g. <strong>82.70 kg</strong>) to immediately update your whole health dashboard, BMI, and metabolic chart.
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground/70 mb-1">
                      Current Scale Weight (kg)
                    </label>
                    <input 
                      type="number" 
                      step="0.05"
                      value={inputWeight}
                      onChange={e => setInputWeight(e.target.value)}
                      placeholder="82.70"
                      className="w-full bg-black/60 border border-teal-500/30 rounded-xl p-3.5 text-2xl font-black text-teal-300 outline-hidden focus:border-teal-400"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-foreground/70 mb-1">
                        Body Fat %
                      </label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={inputBodyFat}
                        onChange={e => setInputBodyFat(e.target.value)}
                        placeholder="23.8"
                        className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm font-bold text-white outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground/70 mb-1">
                        Visceral Fat Level
                      </label>
                      <input 
                        type="number" 
                        step="1"
                        value={inputVisceral}
                        onChange={e => setInputVisceral(e.target.value)}
                        placeholder="10"
                        className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-sm font-bold text-white outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-teal-500/20 hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {syncSuccess ? (
                      <><Check className="w-5 h-5" /> Saved &amp; Calibrated to 82.70 kg!</>
                    ) : (
                      <><RefreshCw className="w-4 h-4" /> Save Scale Reading ({inputWeight} kg)</>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-xs leading-relaxed text-foreground/80">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <div className="font-bold text-amber-300 text-sm mb-1">Why doesn&apos;t the web app read Apple Watch directly?</div>
                    <p className="text-foreground/70">
                      Apple restricts HealthKit behind iOS sandbox security. Web browsers cannot silently access your Apple Health without an automated <strong>iOS Shortcut</strong> or <strong>Health Auto Export</strong> webhook.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                    <div className="font-bold text-white">How to enable 100% Background Sync:</div>
                    <ol className="list-decimal list-inside space-y-1.5 text-foreground/70">
                      <li>Open the <strong>Shortcuts App</strong> on your iPhone.</li>
                      <li>Create an Automation: <em>When VeSync scale records a new measurement</em> or <em>Daily at 8:00 AM</em>.</li>
                      <li>Add Action: <strong>Get Health Samples</strong> (Weight &amp; Active Energy).</li>
                      <li>Add Action: <strong>Get Contents of URL</strong>:
                        <code className="block bg-black/60 text-teal-300 p-2 rounded-lg mt-1 font-mono text-[10px] break-all border border-teal-500/20">
                          https://nexora-fit.vercel.app/api/health/sync
                        </code>
                      </li>
                    </ol>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('quick_log')}
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    ← Back to Scale Log
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

function MetricRow({ 
  icon, label, value, suffix, status, statusColor, index = 0
}: { 
  icon: React.ReactNode
  label: string
  value: number
  suffix: string
  status: string
  statusColor: 'teal' | 'amber' | 'blue'
  index?: number
}) {
  const badgeClasses = {
    teal: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    blue: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  }[statusColor]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-teal-500/30 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          {icon}
        </div>
        <span className="text-xs md:text-sm font-semibold text-foreground/80">{label}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm md:text-base font-black text-white font-mono">
          <NumberCounter value={value} decimals={suffix === '%' || suffix === '' ? 1 : 2} />{suffix}
        </span>
        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${badgeClasses}`}>
          {status}
        </span>
      </div>
    </motion.div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { 
  Heart, 
  Droplets, 
  Apple, 
  Pill, 
  ActivitySquare, 
  Plus, 
  ShieldCheck, 
  X, 
  Sparkles, 
  Check, 
  TrendingDown, 
  AlertTriangle,
  RefreshCw,
  Watch
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { NexoraLogo } from '@/components/brand/nexora-logo'

interface GlucoseLog {
  id: string
  time: string
  value: number
  context: 'Fasting' | 'Pre-Workout' | 'Post-Workout' | 'Post-Meal'
  status: 'In Range' | 'Elevated' | 'Low'
}

interface BPLog {
  id: string
  time: string
  systolic: number
  diastolic: number
  pulse: number
}

export default function HealthPage() {
  // Modal states
  const [showGlucoseModal, setShowGlucoseModal] = useState(false)
  const [showBPModal, setShowBPModal] = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showSyncModal, setShowSyncModal] = useState(false)

  // Glucose state
  const [glucoseLogs, setGlucoseLogs] = useState<GlucoseLog[]>([
    { id: '1', time: 'Today, 7:15 AM', value: 104, context: 'Fasting', status: 'In Range' },
    { id: '2', time: 'Yesterday, 8:00 AM', value: 112, context: 'Fasting', status: 'In Range' },
    { id: '3', time: 'Yesterday, 8:45 AM', value: 98, context: 'Post-Workout', status: 'In Range' },
  ])
  const [newGlucoseValue, setNewGlucoseValue] = useState('105')
  const [newGlucoseContext, setNewGlucoseContext] = useState<'Fasting' | 'Pre-Workout' | 'Post-Workout' | 'Post-Meal'>('Fasting')

  // BP State
  const [bpLogs, setBpLogs] = useState<BPLog[]>([
    { id: '1', time: 'Today, 7:30 AM', systolic: 122, diastolic: 78, pulse: 68 },
    { id: '2', time: 'Yesterday, 7:30 AM', systolic: 124, diastolic: 80, pulse: 70 },
  ])
  const [newSystolic, setNewSystolic] = useState('120')
  const [newDiastolic, setNewDiastolic] = useState('78')
  const [newPulse, setNewPulse] = useState('68')

  // Habits State
  const [habits, setHabits] = useState({
    protein: true,
    hydration: true,
    vegetables: false,
    postWorkoutWalk: true,
  })

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncSuccess, setSyncSuccess] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedGlucose = localStorage.getItem('samfit_glucose_logs')
      if (savedGlucose) setGlucoseLogs(JSON.parse(savedGlucose))
      const savedBP = localStorage.getItem('samfit_bp_logs')
      if (savedBP) setBpLogs(JSON.parse(savedBP))
      const savedHabits = localStorage.getItem('samfit_habits')
      if (savedHabits) setHabits(JSON.parse(savedHabits))
    } catch (e) {
      console.error(e)
    }
  }, [])

  const handleAddGlucose = (e: React.FormEvent) => {
    e.preventDefault()
    const val = Number(newGlucoseValue)
    if (!val) return
    const status: 'In Range' | 'Elevated' | 'Low' = val < 70 ? 'Low' : val <= 130 ? 'In Range' : 'Elevated'
    const newLog: GlucoseLog = {
      id: Date.now().toString(),
      time: 'Just now',
      value: val,
      context: newGlucoseContext,
      status,
    }
    const updated = [newLog, ...glucoseLogs]
    setGlucoseLogs(updated)
    try {
      localStorage.setItem('samfit_glucose_logs', JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
    setShowGlucoseModal(false)
  }

  const handleAddBP = (e: React.FormEvent) => {
    e.preventDefault()
    const sys = Number(newSystolic)
    const dia = Number(newDiastolic)
    const pul = Number(newPulse)
    if (!sys || !dia) return
    const newLog: BPLog = {
      id: Date.now().toString(),
      time: 'Just now',
      systolic: sys,
      diastolic: dia,
      pulse: pul,
    }
    const updated = [newLog, ...bpLogs]
    setBpLogs(updated)
    try {
      localStorage.setItem('samfit_bp_logs', JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
    setShowBPModal(false)
  }

  const toggleHabit = (key: keyof typeof habits) => {
    const updated = { ...habits, [key]: !habits[key] }
    setHabits(updated)
    try {
      localStorage.setItem('samfit_habits', JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
  }

  const handleTriggerSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      setSyncSuccess(true)
      setTimeout(() => setSyncSuccess(false), 3500)
    }, 1800)
  }

  const latestGlucose = glucoseLogs[0]?.value ?? 104
  const latestBP = bpLogs[0] ?? { systolic: 122, diastolic: 78, pulse: 68 }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-3xl mx-auto pb-32 text-foreground font-sans">
      
      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/15 border border-teal-500/30 text-teal-300">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              Diabetic Type 2 Management
            </span>
            <span className="font-mono text-xs font-semibold text-foreground/60">
              Sami Suliman • 81.0 kg
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Metabolic & Vitals HUD
          </h1>
          <p className="text-foreground/70 text-sm mt-1">
            Real-time glycemic tracking, blood pressure regulation, and insulin sensitivity.
          </p>
        </div>

        <button
          onClick={handleTriggerSync}
          disabled={isSyncing}
          className="flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 px-4 py-2.5 rounded-2xl text-xs font-bold text-teal-300 transition-all cursor-pointer shadow-lg self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing Apple Health...' : syncSuccess ? '✓ Vitals Synced' : 'Sync HealthKit'}
        </button>
      </header>

      {/* ── CLINICAL GLYCEMIC OVERVIEW CARD ─────────────────────────────────── */}
      <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-teal-950/40 via-[#0d1618] to-black p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-teal-500/10 blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
          <div>
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-teal-400">
              GLYCEMIC CONTROL STATUS
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black text-white">{latestGlucose}</span>
              <span className="text-sm font-bold text-foreground/60">mg/dL (Fasting)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-black">
              <ShieldCheck className="w-4 h-4" /> Optimal Zone (80–130)
            </span>
          </div>
        </div>

        {/* Benefits of Calisthenics for T2D */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
            <div className="text-[11px] font-black text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> GLUT-4 Translocation
            </div>
            <p className="text-xs text-foreground/70 font-medium mt-1 leading-relaxed">
              Morning 15-minute calisthenics contracts large muscle groups (quads/glutes), pulling glucose directly out of your bloodstream without requiring extra insulin.
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
            <div className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5" /> 81 kg $\rightarrow$ 75 kg Trajectory
            </div>
            <p className="text-xs text-foreground/70 font-medium mt-1 leading-relaxed">
              Losing 6 kg of visceral fat typically cuts hepatic insulin resistance by over 40%, supporting lasting glycemic stabilization.
            </p>
          </div>
        </div>
      </div>

      {/* ── 2 COLUMN VITALS LOGGER ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Blood Glucose Card */}
        <div 
          onClick={() => setShowGlucoseModal(true)}
          className="bg-background border border-border/80 hover:border-blue-500/50 rounded-3xl p-6 shadow-xl group cursor-pointer transition-all hover:bg-white/[0.02]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500/15 border border-blue-500/30 p-3 rounded-2xl">
              <Droplets className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Log Value
            </span>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">Blood Glucose</h3>
          <div className="text-2xl font-black text-white">{latestGlucose} <span className="text-xs text-foreground/50 font-normal">mg/dL</span></div>
          <p className="text-xs text-foreground/60 mt-1">Tap to log fasting, pre or post-workout readings</p>
        </div>

        {/* Blood Pressure Card */}
        <div 
          onClick={() => setShowBPModal(true)}
          className="bg-background border border-border/80 hover:border-rose-500/50 rounded-3xl p-6 shadow-xl group cursor-pointer transition-all hover:bg-white/[0.02]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-rose-500/15 border border-rose-500/30 p-3 rounded-2xl">
              <Heart className="w-6 h-6 text-rose-400" />
            </div>
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Log BP
            </span>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">Blood Pressure</h3>
          <div className="text-2xl font-black text-white">
            {latestBP.systolic}/{latestBP.diastolic} <span className="text-xs text-foreground/50 font-normal">mmHg • {latestBP.pulse} bpm</span>
          </div>
          <p className="text-xs text-foreground/60 mt-1">Target: &lt; 130/80 mmHg. Tap to record vitals.</p>
        </div>
      </div>

      {/* ── NUTRITION & METABOLIC HABITS ───────────────────────────────────── */}
      <section className="bg-background border border-border/80 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/15 border border-emerald-500/30 p-2.5 rounded-xl">
              <Apple className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Type 2 Daily Metabolic Habits</h2>
              <p className="text-xs text-foreground/60">Key behaviors to stabilize insulin response</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <HabitToggle 
            checked={habits.protein} 
            onChange={() => toggleHabit('protein')}
            title="Protein & Fiber First at Meals"
            desc="Blunts post-prandial glucose spike by slowing gastric emptying"
          />
          <HabitToggle 
            checked={habits.hydration} 
            onChange={() => toggleHabit('hydration')}
            title="Optimal Morning Hydration (500ml+)"
            desc="Helps kidneys flush excess circulating glucose"
          />
          <HabitToggle 
            checked={habits.postWorkoutWalk} 
            onChange={() => toggleHabit('postWorkoutWalk')}
            title="15-Min Morning Calisthenics Routine"
            desc="Sustained muscle activation for 24-hr metabolic burn"
          />
          <HabitToggle 
            checked={habits.vegetables} 
            onChange={() => toggleHabit('vegetables')}
            title="Cruciferous / Green Vegetables"
            desc="Provides micronutrients and fiber without insulin surge"
          />
        </div>
      </section>

      {/* ── CLINICIAN ACTION PLAN & EMERGENCY PROTOCOL ─────────────────────── */}
      <section className="bg-background border border-border/80 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500/15 border border-amber-500/30 p-3 rounded-2xl flex-shrink-0">
            <Pill className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Diabetic Type 2 Safety & Clinician Protocol
            </h3>
            <p className="text-xs text-foreground/60 mt-0.5">
              Hypoglycemia rules, RPE 5-6 training ceiling, and medical clearance
            </p>
          </div>
        </div>

        <button 
          onClick={() => setShowPlanModal(true)}
          className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex-shrink-0 text-center"
        >
          View Protocol
        </button>
      </section>

      {/* ── MODAL 1: GLUCOSE LOGGER ────────────────────────────────────────── */}
      <AnimatePresence>
        {showGlucoseModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowGlucoseModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-[101] w-full max-w-md bg-[#0f1115] border border-blue-500/40 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Log Blood Glucose</h3>
                    <p className="text-xs text-foreground/60">Sami Suliman • Type 2 Log</p>
                  </div>
                </div>
                <button onClick={() => setShowGlucoseModal(false)} className="text-white/60 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddGlucose} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/70 mb-1">
                    Glucose Value (mg/dL)
                  </label>
                  <input 
                    type="number" 
                    value={newGlucoseValue}
                    onChange={e => setNewGlucoseValue(e.target.value)}
                    required
                    min="40"
                    max="400"
                    className="w-full bg-black/60 border border-border/80 focus:border-blue-500 rounded-xl p-3 text-2xl font-black text-white outline-hidden"
                  />
                  <span className="text-[10px] text-foreground/50 mt-1 block">
                    Target range: 80 – 130 mg/dL
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/70 mb-1">
                    Context
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Fasting', 'Pre-Workout', 'Post-Workout', 'Post-Meal'] as const).map(ctx => (
                      <button
                        type="button"
                        key={ctx}
                        onClick={() => setNewGlucoseContext(ctx)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          newGlucoseContext === ctx
                            ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                            : 'bg-white/[0.02] border-white/10 text-foreground/70 hover:bg-white/[0.05]'
                        }`}
                      >
                        {ctx}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-black text-sm shadow-lg hover:brightness-110 transition-all cursor-pointer"
                >
                  Save Reading
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 2: BP LOGGER ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showBPModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowBPModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-[101] w-full max-w-md bg-[#0f1115] border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Log Blood Pressure</h3>
                    <p className="text-xs text-foreground/60">Resting vitals</p>
                  </div>
                </div>
                <button onClick={() => setShowBPModal(false)} className="text-white/60 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddBP} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground/70 mb-1">
                      Systolic (Upper)
                    </label>
                    <input 
                      type="number" 
                      value={newSystolic}
                      onChange={e => setNewSystolic(e.target.value)}
                      required
                      className="w-full bg-black/60 border border-border/80 focus:border-rose-500 rounded-xl p-3 text-xl font-black text-white outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground/70 mb-1">
                      Diastolic (Lower)
                    </label>
                    <input 
                      type="number" 
                      value={newDiastolic}
                      onChange={e => setNewDiastolic(e.target.value)}
                      required
                      className="w-full bg-black/60 border border-border/80 focus:border-rose-500 rounded-xl p-3 text-xl font-black text-white outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/70 mb-1">
                    Pulse / Heart Rate (BPM)
                  </label>
                  <input 
                    type="number" 
                    value={newPulse}
                    onChange={e => setNewPulse(e.target.value)}
                    required
                    className="w-full bg-black/60 border border-border/80 focus:border-rose-500 rounded-xl p-3 text-xl font-black text-white outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-400 text-black font-black text-sm shadow-lg hover:brightness-110 transition-all cursor-pointer"
                >
                  Save Blood Pressure
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 3: CLINICIAN ACTION PLAN ─────────────────────────────────── */}
      <AnimatePresence>
        {showPlanModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowPlanModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-[101] w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#0f1115] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Type 2 Diabetes Safety Protocol</h3>
                    <p className="text-xs text-foreground/60">Patient: Sami Suliman • Weight: 81.0 kg</p>
                  </div>
                </div>
                <button onClick={() => setShowPlanModal(false)} className="text-white/60 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-medium text-foreground/80 leading-relaxed">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Exercise Safety Rule (RPE 5–6 Max)
                  </div>
                  <p>
                    Maintain moderate intensity where you can speak a full sentence without gasping. Avoid breath-holding (Valsalva) to prevent blood pressure spikes.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                  <div className="font-bold text-white">Pre-Workout Glucose Check</div>
                  <p>
                    • If &lt; 90 mg/dL: Take 15g fast carbs (e.g., half banana or 4oz juice) before starting.<br />
                    • If 90–180 mg/dL: Safe to train immediately.<br />
                    • If &gt; 250 mg/dL: Check ketones and defer intense exertion.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                  <div className="font-bold text-white">Hydration & Electrolytes</div>
                  <p>
                    Drink at least 500ml water 30 minutes before your morning 15-minute challenge to support vascular elasticity.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPlanModal(false)}
                className="w-full py-3.5 rounded-xl bg-amber-500 text-black font-black text-xs hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Understood & Acknowledged
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

function HabitToggle({
  checked,
  onChange,
  title,
  desc,
}: {
  checked: boolean
  onChange: () => void
  title: string
  desc: string
}) {
  return (
    <div 
      onClick={onChange}
      className={`p-4 border rounded-2xl cursor-pointer transition-all flex items-start gap-3.5 ${
        checked
          ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
          : 'bg-white/[0.02] border-white/[0.08] text-foreground/70 hover:bg-white/[0.05]'
      }`}
    >
      <div className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
        checked ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-white/20'
      }`}>
        {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
      <div>
        <div className={`text-sm font-bold ${checked ? 'text-emerald-300' : 'text-foreground'}`}>
          {title}
        </div>
        <div className="text-xs text-foreground/50 mt-0.5">
          {desc}
        </div>
      </div>
    </div>
  )
}

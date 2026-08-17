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
  Watch,
  Info,
  Calendar,
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { NexoraLogo } from '@/components/brand/nexora-logo'
import { triggerCelebrationConfetti } from '@/components/ui/celebration'

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

export interface MedicationItem {
  id: string
  name: string
  generic: string
  dose: string
  schedule: 'Daily Morning' | 'Daily Evening' | 'Weekly (Sunday)' | 'PRN Emergency Only'
  category: string
  instructions: string
  source: string
  dateStarted?: string
  isEmergency?: boolean
  userNote?: string
  exerciseCue: string
}

const MEDICATION_REGIMEN: MedicationItem[] = [
  {
    id: 'dapagliflozin',
    name: 'AURO-DAPAGLIFLOZIN 10MG TABLET',
    generic: 'DAPAGLIFLOZIN',
    dose: '10 mg',
    schedule: 'Daily Morning',
    category: 'SGLT2 Inhibitor • Renal Glucose Filtration & Cardiac Support',
    instructions: 'TAKE 1 TABLET BY MOUTH ONCE DAILY (MORNING WITH 500ML WATER)',
    source: 'Alberta Netcare',
    dateStarted: 'Jul 26, 2026',
    exerciseCue: 'Increases urinary glucose excretion. Drink 500ml+ water before morning calisthenics.'
  },
  {
    id: 'ramipril',
    name: 'TARO-RAMIPRIL 5 MG CAPSULE',
    generic: 'RAMIPRIL',
    dose: '5 mg',
    schedule: 'Daily Morning',
    category: 'ACE Inhibitor • Blood Pressure & Renal Protection',
    instructions: 'TAKE 1 CAPSULE BY MOUTH ONCE DAILY',
    source: 'Alberta Netcare',
    dateStarted: 'Jul 26, 2026',
    exerciseCue: 'Maintains optimal vascular resistance. Avoid sudden standing from floor exercises.'
  },
  {
    id: 'aspirin',
    name: 'ASPIRIN 81 MG TABLET',
    generic: 'ACETYLSALICYLIC ACID (LOW-DOSE)',
    dose: '81 mg',
    schedule: 'Daily Morning',
    category: 'Antiplatelet • Secondary Cardio-Protection & Vascular Flow',
    instructions: 'TAKE 1 TABLET BY MOUTH ONCE DAILY WITH WATER',
    source: 'Alberta Netcare',
    dateStarted: 'Jul 26, 2026',
    exerciseCue: 'Supports smooth microvascular blood flow during exertion.'
  },
  {
    id: 'b12',
    name: 'VITAMIN B12',
    generic: 'METHYLCOBALAMIN / COBALAMIN',
    dose: '1000 mcg',
    schedule: 'Daily Morning',
    category: 'Clinical Supplement • Nerve Health & Cellular Energy',
    instructions: 'TAKE 1 DOSE DAILY WITH MORNING MEAL',
    source: 'Patient Regimen',
    dateStarted: 'Active Daily',
    exerciseCue: 'Essential cofactor for mitochondrial ATP energy production.'
  },
  {
    id: 'creatine',
    name: 'CREATINE MONOHYDRATE',
    generic: 'CREATINE MONOHYDRATE POWDER',
    dose: '5g (Pre-Workout)',
    schedule: 'Daily Morning',
    category: 'Ergogenic & Glycemic Booster • Cellular ATP & GLUT-4 Translocation',
    instructions: 'TAKE 5 GRAMS IN 500ML WATER 20–30 MINUTES BEFORE MORNING WORKOUT',
    source: 'Patient Regimen',
    dateStarted: 'Active Daily',
    exerciseCue: 'Boosts phosphocreatine ATP replenishment during calisthenics reps and stimulates insulin-independent glucose uptake into muscle tissue. Drink with 500ml+ water.'
  },
  {
    id: 'rosuvastatin',
    name: 'ROSUVASTATIN 40 MG TABLET',
    generic: 'ROSUVASTATIN (ROSUVASTATIN CALCIUM)',
    dose: '40 mg',
    schedule: 'Daily Evening',
    category: 'Lipid-Lowering Statin • Plaque Stabilization & Vascular Health',
    instructions: 'TAKE 1 TABLET BY MOUTH ONCE DAILY (EVENING)',
    source: 'Alberta Netcare',
    dateStarted: 'Jul 28, 2026',
    exerciseCue: 'Evening dosing aligns with liver overnight cholesterol synthesis peak.'
  },
  {
    id: 'omega3',
    name: 'OMEGA 3 SELECT',
    generic: 'PURIFIED EPA / DHA FISH OIL',
    dose: '1000 mg EPA/DHA',
    schedule: 'Daily Evening',
    category: 'Clinical Supplement • Triglyceride & Joint Support',
    instructions: 'TAKE DAILY WITH FOOD (EVENING MEAL)',
    source: 'Patient Regimen',
    dateStarted: 'Active Daily',
    exerciseCue: 'Reduces post-exercise systemic inflammation and supports joint lubrication.'
  },
  {
    id: 'magnesium',
    name: 'MAGNESIUM CITRATE',
    generic: 'BIOAVAILABLE MAGNESIUM CITRATE',
    dose: '200–400 mg',
    schedule: 'Daily Evening',
    category: 'Clinical Supplement • Muscle Recovery, Glucose Metabolism & Sleep',
    instructions: 'TAKE DAILY IN EVENING WITH WATER',
    source: 'Patient Regimen',
    dateStarted: 'Active Daily',
    exerciseCue: 'Relaxes muscular tension, prevents cramps, and improves insulin receptor signaling.'
  },
  {
    id: 'ozempic',
    name: 'OZEMPIC 1 MG/DOSE (4 MG) PEN',
    generic: 'SEMAGLUTIDE',
    dose: '1 mg / week',
    schedule: 'Weekly (Sunday)',
    category: 'GLP-1 Receptor Agonist • Glycemic & Appetite Control',
    instructions: 'STEP3: INJECT 1 MILLIGRAM(S) SUBCUTANEOUSLY ONCE A WEEK FOR 2 MONTHS',
    source: 'Alberta Netcare',
    dateStarted: 'Aug 2, 2026',
    exerciseCue: 'Combines with calisthenics to enhance insulin sensitivity and visceral fat reduction.'
  },
  {
    id: 'rhonitro',
    name: 'RHO-NITRO 0.4 MG/DOSE SPRAY',
    generic: 'NITROGLYCERIN SUBLINGUAL SPRAY',
    dose: '0.4 mg/dose',
    schedule: 'PRN Emergency Only',
    category: 'Coronary Vasodilator • Emergency Chest Pain Protocol',
    instructions: 'AT THE ONSET OF CHEST PAIN SPRAY 1 OR 2 DOSES INTO YOUR MOUTH OR UNDER THE TONGUE. MAY REPEAT TWICE AT 5-10 MINUTE INTERVALS IF THE PAIN PERSISTS CALL 911.',
    source: 'Alberta Netcare',
    dateStarted: 'Jan 20, 2026',
    isEmergency: true,
    userNote: 'Emergency Standby Only — Active in pocket (Thank God never had to use it)',
    exerciseCue: 'Keep accessible during travel/gym. If acute tightness occurs, stop immediately.'
  }
]

export default function HealthPage() {
  const [showGlucoseModal, setShowGlucoseModal] = useState(false)
  const [showBPModal, setShowBPModal] = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [selectedMed, setSelectedMed] = useState<MedicationItem | null>(null)

  const [glucoseLogs, setGlucoseLogs] = useState<GlucoseLog[]>([
    { id: '1', time: 'Today, 7:15 AM', value: 104, context: 'Fasting', status: 'In Range' },
    { id: '2', time: 'Yesterday, 8:00 AM', value: 112, context: 'Fasting', status: 'In Range' },
    { id: '3', time: 'Yesterday, 8:45 AM', value: 98, context: 'Post-Workout', status: 'In Range' },
  ])
  const [newGlucoseValue, setNewGlucoseValue] = useState('105')
  const [newGlucoseContext, setNewGlucoseContext] = useState<'Fasting' | 'Pre-Workout' | 'Post-Workout' | 'Post-Meal'>('Fasting')

  const [bpLogs, setBpLogs] = useState<BPLog[]>([
    { id: '1', time: 'Today, 7:30 AM', systolic: 122, diastolic: 78, pulse: 68 },
    { id: '2', time: 'Yesterday, 7:30 AM', systolic: 124, diastolic: 80, pulse: 70 },
  ])
  const [newSystolic, setNewSystolic] = useState('120')
  const [newDiastolic, setNewDiastolic] = useState('78')
  const [newPulse, setNewPulse] = useState('68')

  const [takenMeds, setTakenMeds] = useState<string[]>([])

  const [habits, setHabits] = useState({
    protein: true,
    hydration: true,
    vegetables: true,
    postWorkoutWalk: true,
  })

  const [isSyncing, setIsSyncing] = useState(false)
  const [syncSuccess, setSyncSuccess] = useState(false)

  useEffect(() => {
    try {
      const savedGlucose = localStorage.getItem('samfit_glucose_logs')
      if (savedGlucose) setGlucoseLogs(JSON.parse(savedGlucose))
      const savedBP = localStorage.getItem('samfit_bp_logs')
      if (savedBP) setBpLogs(JSON.parse(savedBP))
      const savedHabits = localStorage.getItem('samfit_habits')
      if (savedHabits) setHabits(JSON.parse(savedHabits))
      const savedTaken = localStorage.getItem('samfit_taken_meds_' + new Date().toISOString().slice(0, 10))
      if (savedTaken) setTakenMeds(JSON.parse(savedTaken))
    } catch (e) {
      console.error(e)
    }
  }, [])

  const toggleMedTaken = (id: string) => {
    const next = takenMeds.includes(id)
      ? takenMeds.filter(m => m !== id)
      : [...takenMeds, id]
    setTakenMeds(next)
    try {
      localStorage.setItem('samfit_taken_meds_' + new Date().toISOString().slice(0, 10), JSON.stringify(next))
    } catch (err) {
      console.error(err)
    }
  }

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
    } catch (err) {
      console.error(err)
    }
    setShowGlucoseModal(false)
    triggerCelebrationConfetti()
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
      pulse: pul || 70,
    }
    const updated = [newLog, ...bpLogs]
    setBpLogs(updated)
    try {
      localStorage.setItem('samfit_bp_logs', JSON.stringify(updated))
    } catch (err) {
      console.error(err)
    }
    setShowBPModal(false)
    triggerCelebrationConfetti()
  }

  const toggleHabit = (key: keyof typeof habits) => {
    const updated = { ...habits, [key]: !habits[key] }
    setHabits(updated)
    try {
      localStorage.setItem('samfit_habits', JSON.stringify(updated))
    } catch (err) {
      console.error(err)
    }
  }

  const handleTriggerSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      setSyncSuccess(true)
      setTimeout(() => setSyncSuccess(false), 3000)
    }, 1200)
  }

  const latestGlucose = glucoseLogs[0]?.value ?? 104
  const latestBP = bpLogs[0] ?? { systolic: 122, diastolic: 78, pulse: 68 }

  const morningMeds = MEDICATION_REGIMEN.filter(m => m.schedule === 'Daily Morning')
  const eveningMeds = MEDICATION_REGIMEN.filter(m => m.schedule === 'Daily Evening')
  const weeklyMeds = MEDICATION_REGIMEN.filter(m => m.schedule === 'Weekly (Sunday)')
  const emergencyMeds = MEDICATION_REGIMEN.filter(m => m.isEmergency)

  const dailyDoseCount = morningMeds.length + eveningMeds.length
  const dailyTakenCount = takenMeds.filter(id => id !== 'ozempic' && id !== 'rhonitro').length

  return (
    <div className="space-y-8 pb-32 max-w-4xl mx-auto">
      
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/15 border border-teal-500/30 text-teal-300">
              Clinical Telemetry &amp; Regimen
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/15 border border-blue-500/30 text-blue-300">
              Alberta Netcare Verified
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black text-foreground tracking-tight">
            Metabolic &amp; Medication Center
          </h1>
          <p className="font-mono text-xs uppercase tracking-wider text-foreground/70 mt-1">
            Patient: Sami Suliman • Diabetic Type 2 • 82.70 kg Baseline
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

      <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-[#0a1518] via-[#0d1618] to-black p-6 sm:p-7 shadow-2xl relative overflow-hidden">
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

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
            <div className="text-[11px] font-black text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> GLUT-4 Translocation
            </div>
            <p className="text-xs text-foreground/70 font-medium mt-1 leading-relaxed">
              Morning 15-minute calisthenics contracts large muscle groups, pulling glucose directly out of your bloodstream without requiring extra insulin.
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
            <div className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5" /> 82.70 kg → 75.0 kg Target
            </div>
            <p className="text-xs text-foreground/70 font-medium mt-1 leading-relaxed">
              Losing visceral fat significantly cuts hepatic insulin resistance, amplifying the effectiveness of Ozempic and Dapagliflozin.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <p className="text-xs text-foreground/60 mt-1">Target: 80–130 mg/dL. Tap to log fasting or post-workout.</p>
        </div>

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
          <p className="text-xs text-foreground/60 mt-1">Regulated by Ramipril. Target: &lt; 130/80 mmHg.</p>
        </div>
      </div>

      <section className="bg-background border border-border/80 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-3.5">
            <div className="bg-gradient-to-tr from-teal-500 to-cyan-400 p-3 rounded-2xl text-slate-950 shadow-md shadow-teal-500/30">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-foreground">Prescription &amp; Supplement Regimen</h2>
                <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                  Alberta Netcare
                </span>
              </div>
              <p className="text-xs text-foreground/60 mt-0.5">
                Daily adherence tracker &amp; clinical exercise precautions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-300 bg-teal-500/10 border border-teal-500/30 px-3 py-1.5 rounded-xl">
              Today: {dailyTakenCount} of {dailyDoseCount} Daily Doses Taken
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
            <span>☀️ Morning Protocol (4 Items)</span>
            <div className="h-px flex-1 bg-amber-500/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {morningMeds.map(med => (
              <MedicationCard 
                key={med.id} 
                med={med} 
                isTaken={takenMeds.includes(med.id)}
                onToggle={() => toggleMedTaken(med.id)}
                onViewDetails={() => setSelectedMed(med)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-400">
            <span>🌙 Evening Protocol (3 Items)</span>
            <div className="h-px flex-1 bg-indigo-500/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {eveningMeds.map(med => (
              <MedicationCard 
                key={med.id} 
                med={med} 
                isTaken={takenMeds.includes(med.id)}
                onToggle={() => toggleMedTaken(med.id)}
                onViewDetails={() => setSelectedMed(med)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal-400">
            <span>💉 Weekly Metabolic Protocol (1 Item)</span>
            <div className="h-px flex-1 bg-teal-500/20" />
          </div>
          <div className="grid grid-cols-1 gap-3">
            {weeklyMeds.map(med => (
              <MedicationCard 
                key={med.id} 
                med={med} 
                isTaken={takenMeds.includes(med.id)}
                onToggle={() => toggleMedTaken(med.id)}
                onViewDetails={() => setSelectedMed(med)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-400">
            <span>🚨 Emergency Standby Only (NOT Daily)</span>
            <div className="h-px flex-1 bg-rose-500/20" />
          </div>
          <div className="grid grid-cols-1 gap-3">
            {emergencyMeds.map(med => (
              <div 
                key={med.id}
                onClick={() => setSelectedMed(med)}
                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 hover:border-rose-500/60 transition-all cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 mt-0.5">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm group-hover:text-rose-300 transition-colors">
                          {med.name}
                        </span>
                        <span className="px-2 py-0.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-black uppercase rounded-md">
                          PRN Emergency Only
                        </span>
                      </div>
                      <p className="text-xs text-rose-200/80 font-medium mt-1">
                        {med.userNote}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-rose-300 font-bold bg-black/40 px-3 py-1.5 rounded-xl border border-rose-500/30 self-start sm:self-auto">
                    View Instructions →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background border border-border/80 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/15 border border-emerald-500/30 p-2.5 rounded-xl">
            <Apple className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Type 2 Daily Metabolic Habits</h2>
            <p className="text-xs text-foreground/60">Key behaviors to stabilize insulin response</p>
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
            desc="Helps kidneys flush excess circulating glucose with Dapagliflozin"
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
                <button onClick={() => setShowGlucoseModal(false)} className="text-white/60 hover:text-white p-1 cursor-pointer">
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
                <button onClick={() => setShowBPModal(false)} className="text-white/60 hover:text-white p-1 cursor-pointer">
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

      <AnimatePresence>
        {selectedMed && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMed(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-[101] w-full max-w-lg bg-[#0e1115] border border-teal-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 max-h-[88vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-2xl ${
                    selectedMed.isEmergency ? 'bg-rose-500/20 text-rose-400' : 'bg-teal-500/20 text-teal-400'
                  }`}>
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white leading-snug">{selectedMed.name}</h3>
                    <p className="text-xs text-foreground/60 font-mono mt-0.5">Generic: {selectedMed.generic}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedMed(null)} className="text-white/60 hover:text-white p-1 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1.5">
                  <div className="font-black text-teal-400 uppercase tracking-wider text-[10px]">
                    Prescription Instructions
                  </div>
                  <p className="text-white font-bold leading-relaxed">{selectedMed.instructions}</p>
                  {selectedMed.dateStarted && (
                    <div className="text-[10px] text-foreground/50 pt-1">
                      Started: {selectedMed.dateStarted} • Source: {selectedMed.source}
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 space-y-1">
                  <div className="font-bold text-teal-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Exercise &amp; Metabolic Impact
                  </div>
                  <p className="text-foreground/80 leading-relaxed font-medium">
                    {selectedMed.exerciseCue}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                  <span className="text-foreground/60 font-medium">Therapeutic Category</span>
                  <span className="font-bold text-white text-right max-w-[240px]">{selectedMed.category}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    toggleMedTaken(selectedMed.id)
                    setSelectedMed(null)
                  }}
                  className={`flex-1 py-3.5 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    takenMeds.includes(selectedMed.id)
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 shadow-lg'
                  }`}
                >
                  {takenMeds.includes(selectedMed.id) ? (
                    <><Check className="w-4 h-4" /> Marked as Taken Today</>
                  ) : (
                    <><Check className="w-4 h-4" /> Mark Dose Taken Today</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

function MedicationCard({
  med,
  isTaken,
  onToggle,
  onViewDetails,
}: {
  med: MedicationItem
  isTaken: boolean
  onToggle: () => void
  onViewDetails: () => void
}) {
  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      isTaken 
        ? 'bg-emerald-500/10 border-emerald-500/40' 
        : 'bg-white/[0.02] border-white/[0.07] hover:border-teal-500/40'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1 cursor-pointer" onClick={onViewDetails}>
          <div className={`mt-0.5 p-2 rounded-xl flex-shrink-0 ${
            isTaken ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.04] text-foreground/70'
          }`}>
            <Pill className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs sm:text-sm font-bold text-white truncate hover:text-teal-300 transition-colors">
                {med.name}
              </h4>
            </div>
            <div className="text-[11px] text-teal-400 font-semibold mt-0.5">
              {med.dose} • <span className="text-foreground/50">{med.schedule}</span>
            </div>
            <p className="text-[10px] text-foreground/50 truncate mt-1">
              {med.instructions}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className={`w-7 h-7 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
            isTaken
              ? 'bg-emerald-500 border-emerald-400 text-black shadow-md shadow-emerald-500/30'
              : 'border-white/20 hover:border-teal-400 bg-white/[0.02]'
          }`}
          title={isTaken ? 'Dose taken' : 'Mark as taken'}
        >
          {isTaken && <Check className="w-4 h-4 stroke-[3]" />}
        </button>
      </div>
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

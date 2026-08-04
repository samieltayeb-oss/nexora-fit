'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  Target, Sparkles, TrendingDown, ShieldCheck, Flame, Zap, 
  Activity, CheckCircle2, Award, ChevronRight, HelpCircle, 
  Footprints, Utensils, Moon, RefreshCw, Trophy, Scale, Info, Sliders, Dumbbell, Play, Maximize2, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { NumberCounter } from '@/components/ui/number-counter'
import { AnimatedCard } from '@/components/ui/animated-card'
import { triggerCelebrationConfetti } from '@/components/ui/celebration'

export default function WaistlineCoachPage() {
  const router = useRouter()

  // Simulator State
  const [simulatedWeight, setSimulatedWeight] = useState<number>(81.0)
  
  // Waist & Habit State
  const [currentWaist, setCurrentWaist] = useState<number>(101)
  const goalWaist = 92
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  // Nutrition checklist
  const [habits, setHabits] = useState({
    protein: true,
    fiber: true,
    vegetables: true,
    water: true,
    noLateNight: false,
    noSugarDrinks: true,
    noTakeaways: true
  })

  // Calculate dynamic simulator outputs
  const weightLostInSim = 81.0 - simulatedWeight
  const estimatedWaistSim = (currentWaist - weightLostInSim * 0.85).toFixed(1)
  const estimatedBmiSim = (simulatedWeight / (1.72 * 1.72)).toFixed(1)
  const estimatedBodyFatSim = (23.4 - weightLostInSim * 0.6).toFixed(1)

  // AI Coach Active Question
  const [activeAiQuestion, setActiveAiQuestion] = useState<number | null>(0)

  const toggleHabit = (key: keyof typeof habits) => {
    setHabits(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const habitScore = Math.round((Object.values(habits).filter(Boolean).length / 7) * 100)

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-2xl mx-auto font-sans text-slate-100 pb-32 md:pb-16 selection:bg-teal-500 selection:text-slate-950">
      
      {/* Module Header */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-400/30 text-teal-300 text-[11px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg">
              <Target className="w-3.5 h-3.5 text-teal-400" /> FLAGSHIP FEATURE
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-2 flex items-center gap-2 drop-shadow-md">
            Core & Waistline Coach <Sparkles className="w-6 h-6 text-teal-400 animate-pulse" />
          </h1>
          <p className="text-slate-400 text-xs md:text-sm font-medium mt-0.5">Evidence-Based Waist Circumference & Body Composition Engine</p>
        </div>

        {/* Prominent Start Guided Training Session Button */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/workout/active')}
          className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-slate-950" /> Start Guided Core Training
        </motion.button>
      </motion.div>

      {/* Scientific Education Disclaimer Banner */}
      <AnimatedCard delay={0.1}>
        <div className="p-4 flex items-start gap-3.5 relative overflow-hidden">
          <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-2xl text-teal-400 flex-shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">The Science of Waistline Reduction</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Spot fat reduction is a myth. You cannot burn abdominal fat with ab exercises alone. Fat loss occurs across your entire body via a sustained energy deficit. Core exercises strengthen your postural pillar while overall fat loss shrinks your waist.
            </p>
          </div>
        </div>
      </AnimatedCard>

      {/* SECTION 0: Module Dashboard Header Cards */}
      <AnimatedCard delay={0.15}>
        <div className="p-6 space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-black text-teal-400 uppercase tracking-widest">Current Waistline Status</span>
              <div className="text-4xl md:text-5xl font-black text-white tracking-tight mt-1 flex items-baseline gap-2">
                <NumberCounter value={currentWaist} decimals={0} /> <span className="text-xl text-slate-400 font-bold">cm</span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Goal Waist: {goalWaist} cm • {(currentWaist - goalWaist).toFixed(1)} cm to target</p>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <span className="px-4 py-1.5 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-400/40 text-teal-300 font-black text-sm rounded-full shadow-lg">
                Belly Score: 8.7 / 10
              </span>
              <span className="text-[11px] text-slate-400 font-medium">82% Consistency Rating</span>
            </div>
          </div>

          {/* Waist Reduction Progress Bar */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-white/[0.06] shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, Math.min(100, ((105 - currentWaist) / (105 - goalWaist)) * 100))}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-500 rounded-full relative shadow-[0_0_20px_rgba(20,184,166,0.5)]"
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-bold">
              <span>Start: 105 cm</span>
              <span className="text-teal-400 font-black">Target: {goalWaist} cm</span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Est. Body Fat</span>
              <div className="text-lg font-black text-white">23.4%</div>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Core Strength</span>
              <div className="text-lg font-black text-teal-400">B+ Rating</div>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Posture</span>
              <div className="text-lg font-black text-emerald-400">Good</div>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Consistency</span>
              <div className="text-lg font-black text-cyan-400">82%</div>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* SECTION 10: Interactive 3D Waist & Weight Goal Simulator */}
      <AnimatedCard delay={0.2}>
        <div className="p-6 md:p-8 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Belly Goal Simulator</h3>
                <p className="text-xs text-slate-400 font-medium">Projected waist & fit as weight decreases</p>
              </div>
            </div>
            <span className="text-xs font-black text-cyan-400 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
              Interactive
            </span>
          </div>

          {/* Interactive Weight Slider */}
          <div className="space-y-3 bg-slate-950/90 p-5 rounded-2xl border border-white/5 shadow-inner">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-slate-400">Simulated Weight:</span>
              <span className="text-2xl font-black text-teal-400">{simulatedWeight.toFixed(1)} kg</span>
            </div>

            <input 
              type="range" 
              min="75.0" 
              max="81.0" 
              step="0.5"
              value={simulatedWeight}
              onChange={(e) => setSimulatedWeight(parseFloat(e.target.value))}
              className="w-full h-3 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />

            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Target: 75.0 kg</span>
              <span>Current: 81.0 kg</span>
            </div>
          </div>

          {/* Projected Outcomes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Est. Waist</span>
              <div className="text-xl font-black text-teal-300">{estimatedWaistSim} cm</div>
              <span className="text-[10px] text-teal-400 font-bold">-{ (currentWaist - parseFloat(estimatedWaistSim)).toFixed(1) } cm change</span>
            </div>
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Est. BMI</span>
              <div className="text-xl font-black text-white">{estimatedBmiSim}</div>
              <span className="text-[10px] text-slate-400 font-bold">Normal Range</span>
            </div>
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Est. Body Fat</span>
              <div className="text-xl font-black text-cyan-300">{estimatedBodyFatSim}%</div>
              <span className="text-[10px] text-cyan-400 font-bold">-{ (23.4 - parseFloat(estimatedBodyFatSim)).toFixed(1) }% fat loss</span>
            </div>
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Belt Notch</span>
              <div className="text-xs font-black text-amber-400 mt-1">
                {simulatedWeight <= 77.0 ? 'Notch 1 (Tighter)' : 'Notch 2'}
              </div>
              <span className="text-[10px] text-slate-400 font-bold">Looser Fit</span>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* SECTION 4: Best Safe Core Exercises with 3D Generated Renderings */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-teal-400" /> Safe Core & Training Routines
          </h2>
          <span className="text-[11px] text-teal-400 font-bold px-2.5 py-0.5 bg-teal-500/10 border border-teal-500/30 rounded-full">
            3D Renderings & Guides
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ExerciseCardWith3D 
            title="Pallof Press" 
            desc="Anti-rotation core stability preventing lower back shear and tightening waistline stance." 
            tag="Core Pillar"
            imageSrc="/artifacts/exercises/pallof_press_3d.png"
            onOpenImage={() => setLightboxImage('/artifacts/exercises/pallof_press_3d.png')}
            onStart={() => router.push('/workout/active')}
          />
          <ExerciseCardWith3D 
            title="Bird Dog" 
            desc="Cross-body abdominal bracing & spine stabilization for posture alignment." 
            tag="Posture & Core"
            imageSrc="/artifacts/exercises/bird_dog_3d.png"
            onOpenImage={() => setLightboxImage('/artifacts/exercises/bird_dog_3d.png')}
            onStart={() => router.push('/workout/active')}
          />
          <ExerciseCardWith3D 
            title="Dead Bug" 
            desc="Deep transverse abdominis activation without neck or spinal flex strain." 
            tag="Deep Core"
            imageSrc="/artifacts/exercises/dead_bug_3d.png"
            onOpenImage={() => setLightboxImage('/artifacts/exercises/dead_bug_3d.png')}
            onStart={() => router.push('/workout/active')}
          />
          <ExerciseCardWith3D 
            title="Farmer Carry" 
            desc="Heavy loaded walking posture & oblique endurance for functional core bracing." 
            tag="Full Body & Core"
            imageSrc="/artifacts/exercises/farmer_carry_3d.png"
            onOpenImage={() => setLightboxImage('/artifacts/exercises/farmer_carry_3d.png')}
            onStart={() => router.push('/workout/active')}
          />
        </div>
      </section>

      {/* SECTION 5: Guided Progressive Walking Planner */}
      <AnimatedCard delay={0.3}>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Progressive Walking Planner</h3>
                <p className="text-xs text-slate-400 font-medium">Daily steps for fat loss without joint stress</p>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-400 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              4-Week Arc
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Week 1</span>
              <div className="text-base font-black text-white">15 Min/Day</div>
              <span className="text-[10px] text-teal-400 font-bold">Completed ✓</span>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-white/5 space-y-1 ring-1 ring-teal-400/40">
              <span className="text-[10px] font-bold text-teal-400 uppercase">Week 2 (Active)</span>
              <div className="text-base font-black text-teal-300">20 Min/Day</div>
              <span className="text-[10px] text-teal-400 font-bold">In Progress</span>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Week 3</span>
              <div className="text-base font-black text-slate-300">25 Min/Day</div>
              <span className="text-[10px] text-slate-500 font-bold">Upcoming</span>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Week 4</span>
              <div className="text-base font-black text-slate-300">30 Min/Day</div>
              <span className="text-[10px] text-slate-500 font-bold">Upcoming</span>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* SECTION 6: Belly Nutrition Habit Tracker */}
      <AnimatedCard delay={0.4}>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Nutrition Habit Checklist</h3>
                <p className="text-xs text-slate-400 font-medium">Daily habits supporting waistline reduction</p>
              </div>
            </div>
            <span className="text-xs font-black text-amber-400 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
              Score: {habitScore}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <HabitItem label="Hit Protein Target (92g+)" checked={habits.protein} onClick={() => toggleHabit('protein')} />
            <HabitItem label="High Fiber (Vegetables & Oats)" checked={habits.fiber} onClick={() => toggleHabit('fiber')} />
            <HabitItem label="Hydration (2.5L+ Water)" checked={habits.water} onClick={() => toggleHabit('water')} />
            <HabitItem label="No Sugary Drinks / Sodas" checked={habits.noSugarDrinks} onClick={() => toggleHabit('noSugarDrinks')} />
            <HabitItem label="No Restaurant Takeaways" checked={habits.noTakeaways} onClick={() => toggleHabit('noTakeaways')} />
            <HabitItem label="No Late-Night Snacking (Past 9PM)" checked={habits.noLateNight} onClick={() => toggleHabit('noLateNight')} />
          </div>
        </div>
      </AnimatedCard>

      {/* SECTION 9: AI Waist Coach Q&A Engine */}
      <AnimatedCard delay={0.5}>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">AI Waistline Coach Q&A</h3>
              <p className="text-xs text-slate-400 font-medium">Evidence-based answers tailored to your data</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <AiAccordion 
              index={0}
              activeIdx={activeAiQuestion}
              setActiveIdx={setActiveAiQuestion}
              question="My belly hasn't changed in 3 weeks. What's happening?"
              answer="Waist loss is non-linear. Visceral fat surrounding internal organs is often burned first before subcutaneous belly fat shrinks. If your weight or waist measurement is steady, stay consistent—visceral reduction improves metabolic health before visible mirror changes occur."
            />
            <AiAccordion 
              index={1}
              activeIdx={activeAiQuestion}
              setActiveIdx={setActiveAiQuestion}
              question="Why am I losing weight but my stomach still looks similar?"
              answer="Body fat is drawn from all over your body based on genetics. Often, fat leaves arms, face, and legs first before the midsection. Keep your calorie deficit and protein high to preserve muscle while overall fat drops."
            />
            <AiAccordion 
              index={2}
              activeIdx={activeAiQuestion}
              setActiveIdx={setActiveAiQuestion}
              question="I've lost 4 kg. Why are my pants only slightly looser?"
              answer="4 kg of fat loss equates to about 1.5 to 2 cm off your waistline, which represents roughly 1 belt notch. Consistency over 8–12 weeks will yield significant belt notch improvements."
            />
          </div>
        </div>
      </AnimatedCard>

      {/* SECTION 11: Milestone Celebration Banner */}
      <AnimatedCard delay={0.6}>
        <div className="p-6 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-indigo-500/20 border border-teal-400/40 rounded-3xl flex items-center justify-between backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-teal-400 to-cyan-400 text-slate-950 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Waist Milestone Reached!</h4>
              <p className="text-xs text-teal-300 font-medium mt-0.5">-1.3 cm reduction achieved this week!</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={triggerCelebrationConfetti}
            className="px-4 py-2 bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/20"
          >
            Celebrate! 🎉
          </motion.button>
        </div>
      </AnimatedCard>

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-slate-950/95 z-[200] flex items-center justify-center p-4">
          <button 
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-3 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          {/* eslint-disable-next-next/no-img-element */}
          <img 
            src={lightboxImage} 
            alt="3D Exercise Render" 
            className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-slate-800 shadow-2xl"
          />
        </div>
      )}

    </div>
  )
}

function ExerciseCardWith3D({ title, desc, tag, imageSrc, onOpenImage, onStart }: { title: string; desc: string; tag: string; imageSrc: string; onOpenImage: () => void; onStart: () => void }) {
  return (
    <div className="bg-slate-900/80 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl hover:border-slate-700 transition-all flex flex-col justify-between">
      <div className="aspect-[4/3] bg-slate-950 relative overflow-hidden group cursor-pointer" onClick={onOpenImage}>
        <Image 
          src={imageSrc} 
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-black text-teal-300 border border-white/10">
          {tag}
        </div>
        <button className="absolute top-3 right-3 p-2 bg-slate-950/80 text-slate-300 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-black text-white">{title}</h4>
          <p className="text-xs text-slate-400 leading-relaxed font-medium mt-1">{desc}</p>
        </div>

        <button 
          onClick={onStart}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-teal-300 font-bold text-xs rounded-xl border border-white/5 transition-colors flex items-center justify-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-teal-300" /> Start Guided Routine
        </button>
      </div>
    </div>
  )
}

function HabitItem({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
        checked 
          ? 'bg-teal-950/20 border-teal-400/40 text-white shadow-md' 
          : 'bg-slate-950/80 border-white/5 text-slate-400'
      }`}
    >
      <span className="font-bold">{label}</span>
      <CheckCircle2 className={`w-4 h-4 ${checked ? 'text-teal-400' : 'text-slate-600'}`} />
    </button>
  )
}

function AiAccordion({ index, activeIdx, setActiveIdx, question, answer }: { index: number; activeIdx: number | null; setActiveIdx: (idx: number | null) => void; question: string; answer: string }) {
  const isOpen = activeIdx === index

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-slate-950/80">
      <button 
        onClick={() => setActiveIdx(isOpen ? null : index)}
        className="w-full p-3.5 text-left font-bold text-slate-200 flex justify-between items-center hover:bg-white/5 transition-colors"
      >
        <span>{question}</span>
        <ChevronRight className={`w-4 h-4 text-teal-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-3.5 border-t border-white/5 text-slate-300 leading-relaxed bg-slate-900/40 font-medium"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

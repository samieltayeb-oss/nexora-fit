'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { 
  ChevronLeft, Volume2, VolumeX, ShieldAlert, AlertTriangle, 
  CheckCircle2, RefreshCw, Layers, Dumbbell, Activity, Info
} from 'lucide-react'
import { BENCHMARK_EXERCISES } from '@/lib/exercise-data'

export default function ExerciseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const exercise = BENCHMARK_EXERCISES.find(ex => ex.slug === resolvedParams.slug) || BENCHMARK_EXERCISES[0]

  const [selectedImage, setSelectedImage] = useState(exercise.media[0]?.url || '')
  const [activeTab, setActiveTab] = useState<'gallery' | 'start' | 'finish' | 'form' | 'mistake'>('gallery')
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleReadAloud = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 text-slate-100 font-sans">
      
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Link href="/workout/library" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold">
          <ChevronLeft className="w-4 h-4" /> Back to Library
        </Link>
        
        <button
          onClick={() => handleReadAloud(`${exercise.name}. ${exercise.shortDescription}. Starting setup: ${exercise.setupSteps.join('. ')}. Breathing: ${exercise.breathingInstructions}`)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
            isSpeaking 
              ? 'bg-teal-500/20 border-teal-500/50 text-teal-400 animate-pulse' 
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          {isSpeaking ? 'Stop Audio' : 'Read Guide Aloud'}
        </button>
      </div>

      {/* A. Exercise Summary Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="bg-teal-500/20 text-teal-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            {exercise.movementPattern} Pattern
          </span>
          <span className="bg-slate-800 text-slate-300 text-xs font-semibold px-3 py-1 rounded-full">
            {exercise.difficulty}
          </span>
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full">
            {exercise.phase}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-white tracking-tight">{exercise.name}</h1>
        <p className="text-slate-300 text-sm leading-relaxed">{exercise.fullDescription}</p>

        <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-800">
          <div>
            <span className="text-slate-500 block uppercase font-semibold text-[10px]">Primary Muscles</span>
            <span className="text-white font-bold">{exercise.primaryMuscles.join(', ')}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-semibold text-[10px]">Secondary Muscles</span>
            <span className="text-slate-300 font-medium">{exercise.secondaryMuscles.join(', ')}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-semibold text-[10px]">Equipment</span>
            <span className="text-slate-300 font-medium">{exercise.equipment}</span>
          </div>
        </div>
      </div>

      {/* Photorealistic Multi-Position Image Gallery */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-5">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Photorealistic Visual Guidance</h2>
        
        {/* Main Display Frame */}
        <div className="aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 relative">
          {/* eslint-disable-next-next/no-img-element */}
          <img 
            src={selectedImage} 
            alt={exercise.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thumbnail Selector Row */}
        <div className="grid grid-cols-4 gap-3">
          {exercise.media.map((mediaItem) => (
            <button
              key={mediaItem.id}
              onClick={() => setSelectedImage(mediaItem.url)}
              className={`rounded-xl overflow-hidden border-2 transition-all p-1 text-left bg-slate-950 ${
                selectedImage === mediaItem.url ? 'border-teal-500 shadow-lg shadow-teal-500/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="aspect-video rounded-lg overflow-hidden mb-1">
                {/* eslint-disable-next-next/no-img-element */}
                <img src={mediaItem.url} alt={mediaItem.altText} className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] font-bold text-slate-300 capitalize block truncate px-1">
                {mediaItem.viewType.replace('_', ' ')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Structured Sections B through P */}
      <div className="space-y-6">

        {/* B. Before You Start */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-teal-400" /> B. Before You Start
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="font-bold text-teal-400 block mb-1">Equipment Setup:</span>
              <p>{exercise.beforeYouStart.equipmentSetup}</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="font-bold text-teal-400 block mb-1">Seat Adjustment:</span>
              <p>{exercise.beforeYouStart.seatAdjustment}</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="font-bold text-teal-400 block mb-1">Posture Alignment:</span>
              <p>{exercise.beforeYouStart.posture}</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="font-bold text-teal-400 block mb-1">Foot Placement:</span>
              <p>{exercise.beforeYouStart.placement}</p>
            </div>
          </div>
        </section>

        {/* C. Starting Position & D. Movement Steps */}
        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
            <h2 className="text-lg font-bold text-white">C. Starting Position</h2>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
              {exercise.setupSteps.map((step, i) => (
                <li key={i} className="leading-relaxed">{step}</li>
              ))}
            </ol>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
            <h2 className="text-lg font-bold text-white">D. Movement Steps</h2>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
              {exercise.movementSteps.map((step, i) => (
                <li key={i} className="leading-relaxed">{step}</li>
              ))}
            </ol>
          </section>
        </div>

        {/* E, F, G, H: Parameters & Breathing */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h2 className="text-lg font-bold text-white">E-H. Breathing, Tempo & Prescriptions</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-teal-950/40 border border-teal-500/20 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-teal-400 block mb-1">Breathing</span>
              <p className="text-teal-100">{exercise.breathingInstructions}</p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tempo</span>
              <p className="text-slate-200">{exercise.tempoGuidance}</p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Range of Motion</span>
              <p className="text-slate-200">{exercise.rangeOfMotion}</p>
            </div>

            <div className="p-4 bg-amber-950/30 border border-amber-500/20 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">Prescription</span>
              <p className="text-amber-200 font-bold">{exercise.prescribedSets} • {exercise.prescribedReps}</p>
              <p className="text-slate-400 text-[10px] mt-0.5">{exercise.rpeTarget}</p>
            </div>
          </div>
        </section>

        {/* I. What You Should Feel */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <h2 className="text-lg font-bold text-white">I. What You Should Feel</h2>
          <div className="grid md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="font-bold text-teal-400 block mb-1">Working Muscles</span>
              <p className="text-slate-300">{exercise.whatToFeel.workingMuscles}</p>
            </div>
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="font-bold text-slate-300 block mb-1">Normal Effort</span>
              <p className="text-slate-400">{exercise.whatToFeel.normalEffort}</p>
            </div>
            <div className="p-3.5 bg-red-950/20 border border-red-500/20 rounded-2xl">
              <span className="font-bold text-red-400 block mb-1">Should NOT Feel</span>
              <p className="text-red-200">{exercise.whatToFeel.shouldNotFeel}</p>
            </div>
          </div>
        </section>

        {/* J. Common Mistakes */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h2 className="text-lg font-bold text-white">J. Common Mistakes</h2>
          <div className="space-y-3 text-xs">
            {exercise.commonMistakes.map((mistake, i) => (
              <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                <span className="font-bold text-amber-400 text-sm block">{mistake.name}</span>
                <p className="text-slate-300">{mistake.description}</p>
                <p className="text-teal-400 font-semibold text-[11px] pt-1">💡 Coaching Cue: {mistake.avoidCue}</p>
              </div>
            ))}
          </div>
        </section>

        {/* K, L. Safety Notes & Stop Conditions */}
        <section className="bg-red-950/20 border border-red-500/30 rounded-3xl p-6 space-y-4 shadow-xl">
          <h2 className="text-lg font-bold text-red-400 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" /> K-L. Safety Notes & Stop Conditions
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-200 uppercase block mb-2">Safety Notes</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {exercise.safetyNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-bold text-red-400 uppercase block mb-2">Stop Immediately If</span>
              <ul className="list-disc list-inside space-y-1 text-red-200 font-medium">
                {exercise.stopConditions.map((cond, i) => (
                  <li key={i}>{cond}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* M, N, O, P. Alternatives & Progression */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h2 className="text-lg font-bold text-white">M-P. Variations, Alternatives & Progression</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <span className="font-bold text-teal-400 block mb-1">Easier Variation</span>
              <p className="text-slate-300">{exercise.easierVariation}</p>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <span className="font-bold text-indigo-400 block mb-1">Machine Alternative</span>
              <p className="text-slate-300">{exercise.machineAlternative}</p>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <span className="font-bold text-amber-400 block mb-1">Home Alternative</span>
              <p className="text-slate-300">{exercise.homeAlternative}</p>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <span className="font-bold text-emerald-400 block mb-1">Progression Rule</span>
              <p className="text-slate-300">{exercise.progressionGuidance}</p>
            </div>
          </div>
        </section>

      </div>

    </div>
  )
}

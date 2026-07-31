'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Pause, AlertTriangle, Replace, Info, X } from 'lucide-react'

// Mock Data for the Workout Player
const workoutData = {
  name: 'Day A - Full Body Foundation',
  exercises: [
    {
      id: 1,
      name: 'Leg Press Machine',
      targetSets: 2,
      targetReps: '10-15',
      prevWeight: '60 kg',
      imageUrl: '/placeholder-exercise.jpg' // Would use a real image or fallback
    },
    {
      id: 2,
      name: 'Seated Chest Press',
      targetSets: 2,
      targetReps: '10-15',
      prevWeight: '40 kg',
      imageUrl: '/placeholder-exercise.jpg'
    }
  ]
}

export default function ActiveWorkoutPage() {
  const router = useRouter()
  const [elapsed, setElapsed] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0)
  
  const [showSafetyModal, setShowSafetyModal] = useState(false)
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (!isPaused) {
      interval = setInterval(() => {
        setElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPaused])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const currentEx = workoutData.exercises[currentExerciseIdx]

  return (
    <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col md:pb-0">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between pb-safe-top">
        <div>
          <h1 className="text-sm font-bold text-slate-300 uppercase tracking-wider">{workoutData.name}</h1>
          <div className="text-xl font-mono text-white tracking-widest mt-1">{formatTime(elapsed)}</div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsPaused(!isPaused)} 
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-colors"
          >
            <Pause className="w-5 h-5" />
          </button>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl transition-colors"
          >
            Finish
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Exercise Image / Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="aspect-video bg-slate-800 flex items-center justify-center relative">
              {/* Placeholder for real exercise image */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
              <DumbbellIcon className="w-16 h-16 text-slate-700 z-0" />
              <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-white leading-tight">{currentEx.name}</h2>
                  <p className="text-teal-400 font-medium mt-1">Target: {currentEx.targetReps} reps</p>
                </div>
                <button className="bg-slate-800/80 backdrop-blur p-2 rounded-full text-slate-300 hover:text-white">
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 grid grid-cols-2 gap-4 border-t border-slate-800">
              <button className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                <Replace className="w-4 h-4" /> Swap Exercise
              </button>
              <button 
                onClick={() => setShowSafetyModal(true)}
                className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" /> Report Symptom
              </button>
            </div>
          </div>

          {/* Sets Tracker */}
          <div className="space-y-3">
            {[1, 2].map((setNum) => (
              <div key={setNum} className={`flex items-center gap-3 p-3 rounded-2xl border ${setNum === 1 ? 'bg-slate-900 border-teal-500/30' : 'bg-slate-900 border-slate-800'}`}>
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-400">
                  {setNum}
                </div>
                
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">KG</label>
                    <input type="number" defaultValue="60" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white text-center font-bold focus:border-teal-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Reps</label>
                    <input type="number" defaultValue="12" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white text-center font-bold focus:border-teal-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">RPE</label>
                    <input type="number" defaultValue="6" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-white text-center font-bold focus:border-teal-500 outline-none" />
                  </div>
                </div>

                <button className="w-12 h-12 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center justify-center transition-colors shadow-lg shadow-teal-500/20">
                  <Check className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Safety Modal overlay */}
      {showSafetyModal && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/50 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <button onClick={() => setShowSafetyModal(false)} className="text-slate-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Stop Workout / I feel unwell</h3>
            <div className="space-y-3 text-slate-300 text-sm mb-6">
              <p>• Sit or rest safely.</p>
              <p>• Do not continue through chest discomfort, faintness, unusual breathlessness or severe symptoms.</p>
              <p>• Follow the emergency plan provided by your healthcare team.</p>
              <p className="font-semibold text-red-400 mt-4">Call emergency services when symptoms are severe or urgent.</p>
            </div>
            
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-4 rounded-xl transition-colors"
            >
              Abort Workout
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

function DumbbellIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.4 14.4 9.6 9.6" />
      <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
      <path d="m21.5 21.5-1.4-1.4" />
      <path d="M3.9 3.9 2.5 2.5" />
      <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
    </svg>
  )
}

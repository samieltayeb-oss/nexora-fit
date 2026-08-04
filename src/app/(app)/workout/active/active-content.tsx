'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, Pause, Play, Trophy,
  Volume2, VolumeX, CheckCircle, RefreshCw, X
} from 'lucide-react'
import { CALISTHENICS_SESSION, GYM_SESSION, WorkoutExercise } from '@/lib/workout-session-data'
import { soundEngine } from '@/lib/utils/sound-engine'
import { triggerCelebrationConfetti } from '@/components/ui/celebration'
import { useWorkoutPersistence, WorkoutSetState } from '@/hooks/use-workout-persistence'

function fmt(s: number) {
  if (s < 0) s = 0
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

export default function ActiveWorkoutContent() {
  const router = useRouter()
  const params = useSearchParams()
  const isGym = params.get('type') !== 'calisthenics'
  const sessionId = isGym ? 'gym-session' : 'calisthenics-session'

  const exercises: WorkoutExercise[] = isGym ? GYM_SESSION : CALISTHENICS_SESSION
  const programTitle = isGym ? 'Gym Strength' : 'Calisthenics'

  const { saveState, loadState, clearState, isReady } = useWorkoutPersistence(sessionId, 'v1')

  const [hasPromptedResume, setHasPromptedResume] = useState(false)
  const [showResumeDialog, setShowResumeDialog] = useState(false)
  const [savedStateCache, setSavedStateCache] = useState<any>(null)

  // Core state
  const [exIdx, setExIdx] = useState(0)
  const [completedSets, setCompletedSets] = useState<WorkoutSetState[]>([])
  const [phase, setPhase] = useState<'ready' | 'active' | 'rest' | 'done'>('ready')
  const [audioOn, setAudioOn] = useState(true)
  const [audioUnlocked, setAudioUnlocked] = useState(false)

  // Timestamps
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null)
  const [lastUpdatedTimestamp, setLastUpdatedTimestamp] = useState<number>(Date.now())
  const [isPaused, setIsPaused] = useState(false)
  const [accumulatedPauseMs, setAccumulatedPauseMs] = useState(0)
  const [lastPauseTimestamp, setLastPauseTimestamp] = useState<number | null>(null)
  
  const [restStartTimestamp, setRestStartTimestamp] = useState<number | null>(null)
  const [restDurationSeconds, setRestDurationSeconds] = useState(0)

  // UI Tick for timers
  const [tick, setTick] = useState(0)

  const ex = exercises[exIdx]
  const nextEx = exercises[exIdx + 1] ?? null
  const totalSets = ex.sets
  
  // Calculate current set from completedSets for THIS exercise
  const currentExCompletedSets = completedSets.length
  const currentSet = Math.min(currentExCompletedSets + 1, totalSets)

  // Calculate elapsed time dynamically
  let elapsedSeconds = 0
  if (startTimestamp) {
    let activeTime = Date.now() - startTimestamp - accumulatedPauseMs
    if (isPaused && lastPauseTimestamp) {
      activeTime -= (Date.now() - lastPauseTimestamp)
    }
    elapsedSeconds = Math.floor(activeTime / 1000)
  }

  // Calculate rest countdown dynamically
  let restCountdown = 0
  if (phase === 'rest' && restStartTimestamp) {
    const elapsedRest = Math.floor((Date.now() - restStartTimestamp) / 1000)
    restCountdown = Math.max(0, restDurationSeconds - elapsedRest)
  }

  // Check for saved state on mount
  useEffect(() => {
    if (!isReady || hasPromptedResume) return
    const saved = loadState()
    if (saved) {
      setSavedStateCache(saved)
      setShowResumeDialog(true)
    }
    setHasPromptedResume(true)
  }, [isReady, hasPromptedResume, loadState])

  // Timer Tick Loop
  useEffect(() => {
    if (phase === 'ready' || phase === 'done' || isPaused) return
    const interval = setInterval(() => {
      setTick(t => t + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [phase, isPaused])

  // Rest Phase Auto-Advance
  useEffect(() => {
    if (phase === 'rest' && restCountdown <= 0 && restStartTimestamp !== null) {
      handlePhaseComplete()
    } else if (phase === 'rest' && restCountdown === 3 && audioOn && audioUnlocked) {
      soundEngine.playCountdownTickSound?.()
    }
  }, [phase, restCountdown, restStartTimestamp, audioOn, audioUnlocked])

  // Save state effect wrapper
  const triggerSave = useCallback(() => {
    if (!startTimestamp) return
    saveState({
      current_exercise_index: exIdx,
      completed_sets: completedSets,
      start_timestamp: startTimestamp,
      last_updated_timestamp: Date.now(),
      pause_state: {
        is_paused: isPaused,
        accumulated_pause_ms: accumulatedPauseMs,
        last_pause_timestamp: lastPauseTimestamp
      },
      rest_timer: {
        is_resting: phase === 'rest',
        rest_start_timestamp: restStartTimestamp,
        rest_duration_seconds: restDurationSeconds
      }
    })
  }, [saveState, exIdx, completedSets, startTimestamp, isPaused, accumulatedPauseMs, lastPauseTimestamp, phase, restStartTimestamp, restDurationSeconds])

  // Trigger save whenever meaningful state changes
  useEffect(() => {
    if (startTimestamp && !showResumeDialog) {
      triggerSave()
    }
  }, [triggerSave, exIdx, completedSets, isPaused, phase])

  const handlePhaseComplete = useCallback(() => {
    if (phase === 'active') {
      // Complete Set
      const newSet: WorkoutSetState = { reps: ex.setsReps.includes('Reps') ? 10 : 0, load: 0 } // Defaults, UI can update later
      setCompletedSets(prev => [...prev, newSet])
      soundEngine.playSetCompleteSound?.()
      
      if (currentSet < totalSets) {
        setPhase('rest')
        setRestStartTimestamp(Date.now())
        setRestDurationSeconds(ex.restSeconds || 60)
        if (audioOn && audioUnlocked)
          soundEngine.speakText?.(`Set ${currentSet} done. Rest for ${ex.restSeconds} seconds.`)
      } else {
        advanceExercise()
      }
    } else if (phase === 'rest') {
      setPhase('active')
      setRestStartTimestamp(null)
      if (audioOn && audioUnlocked)
        soundEngine.speakText?.(`Rest over. Begin set ${currentSet + 1}.`)
    }
  }, [phase, currentSet, totalSets, ex, audioOn, audioUnlocked])

  const advanceExercise = useCallback(() => {
    if (exIdx + 1 >= exercises.length) {
      soundEngine.playVictoryFanfareSound?.()
      triggerCelebrationConfetti()
      setPhase('done')
      clearState() // Clear persistence on success
      return
    }
    const next = exercises[exIdx + 1]
    setExIdx(p => p + 1)
    setCompletedSets([])
    setPhase('ready')
    if (audioOn && audioUnlocked)
      soundEngine.speakText?.(`Next: ${next.name}. ${next.tip}`)
  }, [exIdx, exercises, audioOn, audioUnlocked, clearState])

  const handleStart = () => {
    soundEngine.unlockAudio?.()
    setAudioUnlocked(true)
    if (!startTimestamp) {
      setStartTimestamp(Date.now())
    }
    setPhase('active')
    if (audioOn) soundEngine.speakText?.(`Starting ${ex.name}. ${ex.tip}`)
  }

  const togglePause = () => {
    if (isPaused) {
      if (lastPauseTimestamp) {
        setAccumulatedPauseMs(p => p + (Date.now() - lastPauseTimestamp))
      }
      setIsPaused(false)
      setLastPauseTimestamp(null)
    } else {
      setIsPaused(true)
      setLastPauseTimestamp(Date.now())
    }
  }

  const resumeSavedSession = () => {
    if (!savedStateCache) return
    setExIdx(savedStateCache.current_exercise_index)
    setCompletedSets(savedStateCache.completed_sets)
    setStartTimestamp(savedStateCache.start_timestamp)
    setIsPaused(savedStateCache.pause_state.is_paused)
    setAccumulatedPauseMs(savedStateCache.pause_state.accumulated_pause_ms)
    setLastPauseTimestamp(savedStateCache.pause_state.last_pause_timestamp)
    setRestStartTimestamp(savedStateCache.rest_timer.rest_start_timestamp)
    setRestDurationSeconds(savedStateCache.rest_timer.rest_duration_seconds)
    setPhase(savedStateCache.rest_timer.is_resting ? 'rest' : 'active')
    setShowResumeDialog(false)
  }

  const discardSavedSession = () => {
    clearState()
    setShowResumeDialog(false)
  }

  const totalDots = exercises.reduce((a, e) => a + e.sets, 0)
  const doneDots = exercises.slice(0, exIdx).reduce((a, e) => a + e.sets, 0) + completedSets.length
  const restProgress = phase === 'rest' && restDurationSeconds > 0 
    ? ((restDurationSeconds - restCountdown) / restDurationSeconds) * 100 
    : 0

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--background)] overflow-hidden select-none">
      
      {/* Resume Dialog */}
      <AnimatePresence>
        {showResumeDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <div className="glass-card p-6 max-w-sm w-full rounded-[2rem] text-center border-white/10">
              <RefreshCw className="w-12 h-12 text-[var(--accent-primary)] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Resume Workout?</h3>
              <p className="text-slate-400 mb-6 text-sm">We found an active workout session in progress. Would you like to resume where you left off?</p>
              <div className="flex flex-col gap-3">
                <button onClick={resumeSavedSession} className="w-full py-3 bg-[var(--accent-primary)] text-slate-950 font-bold rounded-xl">Resume Session</button>
                <button onClick={discardSavedSession} className="w-full py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20">Start New Workout</button>
                <button onClick={discardSavedSession} className="w-full py-3 bg-transparent text-slate-400 font-bold rounded-xl hover:text-white">Discard Saved Workout</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={ex.id}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute inset-0"
        >
          <img src={ex.image} alt={ex.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/80 via-transparent to-[var(--background)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 pt-safe pt-6">
        <button onClick={() => router.push('/workout')} className="glass-panel rounded-full p-3 hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div className="glass-panel rounded-full px-5 py-2">
          <span className="text-[10px] font-black text-white tracking-widest uppercase">{programTitle}</span>
        </div>
        <button onClick={() => setAudioOn(p => !p)} className="glass-panel rounded-full p-3 hover:bg-white/10 transition-colors">
          {audioOn ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
        </button>
      </div>

      <AnimatePresence>
        {phase === 'rest' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          >
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="128" cy="128" r="120" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                <motion.circle 
                  cx="128" cy="128" r="120" 
                  stroke="var(--accent-warning)" 
                  strokeWidth="8" 
                  strokeDasharray="754" 
                  initial={{ strokeDashoffset: 754 }}
                  animate={{ strokeDashoffset: 754 - (754 * restProgress) / 100 }}
                  transition={{ duration: 1, ease: 'linear' }}
                  strokeLinecap="round" 
                  fill="none" 
                  className="drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center drop-shadow-2xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-warning)] mb-1 drop-shadow-md">Rest</span>
                <span className="text-7xl font-bold text-white tracking-tighter tabular-nums drop-shadow-2xl">{restCountdown}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 z-30 px-6 pt-12 pb-safe mb-4 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/90 to-transparent">
        <div className="max-w-md mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={ex.id + '-label'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-8 ${phase === 'rest' ? 'opacity-30' : 'opacity-100'} transition-opacity duration-500`}
            >
              <div className="flex items-center gap-3 mb-3 drop-shadow-md">
                <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full backdrop-blur-md">
                  Set {currentSet} of {totalSets}
                </span>
                <span className="text-xs text-slate-400 font-medium drop-shadow">{ex.muscles.join(' · ')}</span>
                {elapsedSeconds > 0 && (
                  <span className="text-xs text-slate-300 font-medium tabular-nums ml-auto">{fmt(elapsedSeconds)}</span>
                )}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2 drop-shadow-2xl">{ex.name}</h2>
              <div className="text-xl font-medium text-slate-300 drop-shadow-md">{ex.setsReps}</div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-4">
            <button
              onClick={() => { if (exIdx > 0) { setExIdx(p => p - 1); setCompletedSets([]); setPhase('ready') } }}
              disabled={exIdx === 0}
              className="glass-panel p-4 rounded-2xl disabled:opacity-30 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {phase === 'ready' ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="relative flex-1 py-5 rounded-2xl font-bold text-slate-950 text-lg flex items-center justify-center gap-2 shadow-[0_0_30px_var(--accent-primary-glow)] bg-[var(--accent-primary)] hover:brightness-110 transition-all group"
              >
                <div className="absolute inset-0 rounded-2xl bg-[var(--accent-primary)] animate-ping opacity-20 group-hover:opacity-0" />
                <Play className="w-6 h-6 fill-slate-950 relative z-10" /> 
                <span className="relative z-10">Start</span>
              </motion.button>
            ) : phase === 'active' || phase === 'rest' ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={togglePause}
                className="flex-1 py-5 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-2 glass-panel hover:bg-white/10 transition-colors"
              >
                {isPaused ? <><Play className="w-6 h-6 fill-white" /> Resume</> : <><Pause className="w-6 h-6 fill-white" /> Pause</>}
              </motion.button>
            ) : null}

            {(phase === 'active' || phase === 'rest') ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { setRestStartTimestamp(0); handlePhaseComplete() }}
                className="glass-panel p-4 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <CheckCircle className="w-6 h-6 text-[var(--accent-success)]" />
              </motion.button>
            ) : (
              <button
                onClick={() => { if (exIdx + 1 < exercises.length) { setExIdx(p => p + 1); setCompletedSets([]); setPhase('ready') } }}
                disabled={exIdx === exercises.length - 1}
                className="glass-panel p-4 rounded-2xl disabled:opacity-30 hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}
          </div>

          <div className="mt-6 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(doneDots / totalDots) * 100}%` }}
              className="h-full bg-[var(--accent-primary)] rounded-full"
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {phase === 'done' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] bg-[var(--background)]/90 backdrop-blur-3xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="glass-card rounded-[2rem] p-8 max-w-sm w-full text-center"
            >
              <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-amber-500" />
              </div>
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 mb-2 drop-shadow-lg">Goal Reached</h2>
              <h3 className="text-xl font-bold text-white mb-2">Protocol Complete</h3>
              <p className="text-slate-400 font-medium mb-8">
                {exercises.length} exercises · {fmt(elapsedSeconds)}
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-4 bg-[var(--accent-primary)] text-slate-950 font-bold rounded-2xl hover:brightness-110 shadow-[0_0_20px_var(--accent-primary-glow)] active:scale-95"
              >
                Return Home
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

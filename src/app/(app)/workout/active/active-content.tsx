'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, Pause, Play, Trophy,
  Volume2, VolumeX, Info, X, Home, CheckCircle, Zap
} from 'lucide-react'
import { CALISTHENICS_SESSION, GYM_SESSION, WorkoutExercise } from '@/lib/workout-session-data'
import { soundEngine } from '@/components/audio/sound-engine'
import { triggerCelebrationConfetti } from '@/components/motion/celebration'

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────
function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${m}:${s < 0 ? '00' : sec}`
}

// ─────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────
export default function ActiveWorkoutContent() {
  const router = useRouter()
  const params = useSearchParams()
  const isGym = params.get('type') !== 'calisthenics'

  const exercises: WorkoutExercise[] = isGym ? GYM_SESSION : CALISTHENICS_SESSION
  const programTitle = isGym ? 'Gym Strength' : 'Calisthenics'

  // ── Core state ──────────────────────────────────────────────────
  const [exIdx,       setExIdx]       = useState(0)
  const [currentSet,  setCurrentSet]  = useState(1)
  const [completedSets, setCompletedSets] = useState<boolean[]>([])   // dots
  const [phase,       setPhase]       = useState<'ready' | 'active' | 'rest' | 'done'>('ready')
  const [countdown,   setCountdown]   = useState(0)
  const [elapsed,     setElapsed]     = useState(0)          // total session time
  const [isPaused,    setIsPaused]    = useState(false)
  const [audioOn,     setAudioOn]     = useState(true)
  const [showTip,     setShowTip]     = useState(false)
  const [showDone,    setShowDone]    = useState(false)
  const [audioUnlocked, setAudioUnlocked] = useState(false)

  const ex      = exercises[exIdx]
  const nextEx  = exercises[exIdx + 1] ?? null
  const totalSets = ex.sets

  // Total dots = totalSets × all exercises
  const totalDots = exercises.reduce((a, e) => a + e.sets, 0)
  const doneDots  = exercises.slice(0, exIdx).reduce((a, e) => a + e.sets, 0) + (currentSet - 1)

  // ── Elapsed timer ────────────────────────────────────────────────
  useEffect(() => {
    if (phase === 'ready' || isPaused || phase === 'done') return
    const t = setInterval(() => setElapsed(p => p + 1), 1000)
    return () => clearInterval(t)
  }, [phase, isPaused])

  // ── Phase countdown timer ─────────────────────────────────────────
  useEffect(() => {
    if (phase === 'ready' || phase === 'done' || isPaused || countdown <= 0) return
    const t = setInterval(() => {
      setCountdown(p => {
        if (p <= 1) {
          clearInterval(t)
          handlePhaseComplete()
          return 0
        }
        // Voice at 3s
        if (p === 4 && audioOn && audioUnlocked) {
          soundEngine.playCountdownTickSound?.()
        }
        return p - 1
      })
    }, 1000)
    return () => clearInterval(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, isPaused, countdown])

  const handlePhaseComplete = useCallback(() => {
    if (phase === 'active') {
      // Mark this set done
      setCompletedSets(p => [...p, true])
      soundEngine.playSetCompleteSound?.()
      if (currentSet < totalSets) {
        // Rest before next set
        setPhase('rest')
        setCountdown(ex.restSeconds || 60)
        if (audioOn && audioUnlocked)
          soundEngine.speakText?.(`Set ${currentSet} done. Rest for ${ex.restSeconds} seconds.`)
      } else {
        // Move to next exercise
        advanceExercise()
      }
    } else if (phase === 'rest') {
      // Start next set
      setCurrentSet(p => p + 1)
      setPhase('active')
      setCountdown(ex.durationSeconds)
      if (audioOn && audioUnlocked)
        soundEngine.speakText?.(`Rest over. Begin set ${currentSet + 1}.`)
    }
  }, [phase, currentSet, totalSets, ex, audioOn, audioUnlocked])

  const advanceExercise = useCallback(() => {
    if (exIdx + 1 >= exercises.length) {
      // Workout done!
      soundEngine.playVictoryFanfareSound?.()
      triggerCelebrationConfetti()
      setPhase('done')
      setShowDone(true)
      return
    }
    const next = exercises[exIdx + 1]
    setExIdx(p => p + 1)
    setCurrentSet(1)
    setPhase('ready')
    setCountdown(0)
    if (audioOn && audioUnlocked)
      soundEngine.speakText?.(`Next: ${next.name}. ${next.tip}`)
  }, [exIdx, exercises, audioOn, audioUnlocked])

  // ── Start / unlock audio ─────────────────────────────────────────
  const handleStart = () => {
    soundEngine.unlockAudio?.()
    setAudioUnlocked(true)
    setPhase('active')
    setCountdown(ex.durationSeconds)
    if (audioOn)
      soundEngine.speakText?.(`Starting ${ex.name}. ${ex.tip}`)
  }

  // ── Manual PREV / NEXT ───────────────────────────────────────────
  const goNext = () => {
    if (exIdx + 1 < exercises.length) {
      setExIdx(p => p + 1); setCurrentSet(1); setPhase('ready'); setCountdown(0)
    }
  }
  const goPrev = () => {
    if (exIdx > 0) {
      setExIdx(p => p - 1); setCurrentSet(1); setPhase('ready'); setCountdown(0)
    }
  }

  const setDots = Array.from({ length: totalSets }, (_, i) => i < currentSet - 1 || (phase === 'done'))
  
  const restProgress = phase === 'rest' && ex.restSeconds 
    ? ((ex.restSeconds - countdown) / ex.restSeconds) * 100 
    : 0

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--background)] overflow-hidden select-none">

      {/* ── FULL-SCREEN EXERCISE IMAGE ─────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={ex.id}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={ex.image}
            alt={ex.name}
            className="w-full h-full object-cover"
          />
          {/* Deep Cinematic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/80 via-transparent to-[var(--background)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* ── TOP BAR ───────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 pt-safe pt-6">
        {/* Back */}
        <button
          onClick={() => router.push('/workout')}
          className="glass-panel rounded-full p-3 hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        {/* Title */}
        <div className="glass-panel rounded-full px-5 py-2">
          <span className="text-[10px] font-black text-white tracking-widest uppercase">
            {programTitle}
          </span>
        </div>

        {/* Audio toggle */}
        <button
          onClick={() => setAudioOn(p => !p)}
          className="glass-panel rounded-full p-3 hover:bg-white/10 transition-colors"
        >
          {audioOn
            ? <Volume2 className="w-5 h-5 text-white" />
            : <VolumeX className="w-5 h-5 text-slate-400" />
          }
        </button>
      </div>

      {/* ── FLOATING NEXT-EXERCISE CARD ───────────────────────── */}
      <div className="absolute top-24 right-6 z-30 w-36 hidden md:block">
        <div className="glass-panel backdrop-blur-3xl rounded-3xl overflow-hidden p-3 shadow-2xl border-white/20">
          <div className="relative h-20 rounded-2xl overflow-hidden mb-3">
            {nextEx ? (
              <img src={nextEx.image} alt={nextEx.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white/5 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
            )}
          </div>
          <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Up Next</div>
          <div className="text-xs font-bold text-white truncate">{nextEx ? nextEx.name : 'Finish'}</div>
        </div>
      </div>

      {/* ── REST TIMER OVERLAY ────────────────────────────────── */}
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
                <span className="text-7xl font-bold text-white tracking-tighter tabular-nums drop-shadow-2xl">{countdown}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BOTTOM OVERLAY — Controls ─────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-6 pb-safe pb-8">
        
        <div className="max-w-2xl mx-auto w-full">
          {/* Exercise Info */}
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
                <span className="text-xs text-slate-400 font-medium drop-shadow">
                  {ex.muscles.join(' · ')}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2 drop-shadow-2xl">
                {ex.name}
              </h2>
              <div className="text-xl font-medium text-slate-300 drop-shadow-md">
                {ex.setsReps}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls Bar */}
          <div className="flex items-center gap-4">
            <button
              onClick={goPrev}
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
                <span className="relative z-10">Start Set</span>
              </motion.button>
            ) : phase === 'active' || phase === 'rest' ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPaused(p => !p)}
                className="flex-1 py-5 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-2 glass-panel hover:bg-white/10 transition-colors"
              >
                {isPaused
                  ? <><Play className="w-6 h-6 fill-white" /> Resume</>
                  : <><Pause className="w-6 h-6 fill-white" /> Pause</>
                }
              </motion.button>
            ) : null}

            {(phase === 'active' || phase === 'rest') ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { setCountdown(0); handlePhaseComplete() }}
                className="glass-panel p-4 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <CheckCircle className="w-6 h-6 text-[var(--accent-success)]" />
              </motion.button>
            ) : (
              <button
                onClick={goNext}
                disabled={exIdx === exercises.length - 1}
                className="glass-panel p-4 rounded-2xl disabled:opacity-30 hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-6 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(doneDots / totalDots) * 100}%` }}
              className="h-full bg-[var(--accent-primary)] rounded-full"
            />
          </div>
        </div>
      </div>

      {/* ── WORKOUT COMPLETE OVERLAY ──────────────────────────── */}
      <AnimatePresence>
        {showDone && (
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
              
              <h2 className="text-3xl font-bold text-white mb-2">Workout Complete</h2>
              <p className="text-slate-400 font-medium mb-8">
                {exercises.length} exercises · {fmt(elapsed)}
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-4 bg-[var(--accent-primary)] text-slate-950 font-bold rounded-2xl hover:brightness-110 transition-all shadow-[0_0_20px_var(--accent-primary-glow)]"
                >
                  Return Home
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

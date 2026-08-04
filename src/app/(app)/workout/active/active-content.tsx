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
  const programTitle = isGym ? 'GYM STRENGTH CHALLENGE' : 'CALISTHENICS CHALLENGE'
  const accentColor  = isGym ? 'teal' : 'indigo'

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

  // ── Set dots display ─────────────────────────────────────────────
  // Show ONLY current exercise's set dots in the float card (max 12 dots)
  const setDots = Array.from({ length: totalSets }, (_, i) => i < currentSet - 1 || (phase === 'done'))

  // ── Phase label ──────────────────────────────────────────────────
  const phaseLabel = phase === 'ready' ? 'TAP TO START' :
                     phase === 'active' ? `SET ${currentSet} OF ${totalSets}` :
                     phase === 'rest'   ? 'REST' : 'COMPLETE ✓'
  const phaseColor = phase === 'rest' ? '#f59e0b' : phase === 'active' ? (isGym ? '#14b8a6' : '#6366f1') : '#ffffff'

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0f] overflow-hidden select-none">

      {/* ── FULL-SCREEN EXERCISE IMAGE ─────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={ex.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.45 }}
          className="absolute inset-0"
        >
          <img
            src={ex.image}
            alt={ex.name}
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50" />
        </motion.div>
      </AnimatePresence>

      {/* ── TOP BAR ───────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pt-safe pt-4">
        {/* Back */}
        <button
          onClick={() => router.push('/workout')}
          className="bg-black/50 backdrop-blur-md border border-white/20 rounded-full p-2.5"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        {/* Title */}
        <div className="flex-1 text-center mx-3">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2 inline-block shadow-2xl">
            <div className="text-[11px] font-black text-slate-900 tracking-tight leading-tight">
              {programTitle}
            </div>
          </div>
        </div>

        {/* Audio toggle */}
        <button
          onClick={() => setAudioOn(p => !p)}
          className="bg-black/50 backdrop-blur-md border border-white/20 rounded-full p-2.5"
        >
          {audioOn
            ? <Volume2 className="w-5 h-5 text-white" />
            : <VolumeX className="w-5 h-5 text-slate-400" />
          }
        </button>
      </div>

      {/* ── FLOATING NEXT-EXERCISE CARD (top-right BetterMe style) ─ */}
      <div className="absolute top-20 right-4 z-30 w-[140px]">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/30">

          {/* Next exercise thumbnail */}
          <div className="relative h-[80px] bg-slate-100">
            {nextEx ? (
              <img
                src={nextEx.image}
                alt={nextEx.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-100 to-cyan-100">
                <Trophy className="w-8 h-8 text-amber-500" />
              </div>
            )}
            {nextEx && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            )}
          </div>

          {/* Set progress dots */}
          <div className="px-2.5 pt-2 pb-1">
            <div className="flex flex-wrap gap-0.5">
              {setDots.map((done, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    done
                      ? 'bg-red-500'
                      : 'bg-slate-200'
                  }`}
                  style={{ width: `${Math.min(100 / totalSets - 2, 14)}%`, minWidth: 8 }}
                />
              ))}
              {/* Remaining sets from future exercises — show as grey */}
              {Array.from({ length: Math.min(8 - totalSets, 6) }).map((_, i) => (
                <div key={`r-${i}`} className="h-1.5 rounded-full bg-slate-100" style={{ width: 8 }} />
              ))}
            </div>

            {/* Timers */}
            <div className="flex items-center justify-between mt-1.5">
              <div>
                <div className="text-[8px] text-slate-400 font-bold uppercase">ELAPSED</div>
                <div className="text-[11px] font-black text-slate-800 font-mono">{fmt(elapsed)}</div>
              </div>
              <div className="text-right">
                <div className="text-[8px] text-slate-400 font-bold uppercase">
                  {phase === 'rest' ? 'REST' : 'SET'}
                </div>
                <div
                  className="text-[11px] font-black font-mono"
                  style={{ color: phaseColor === '#ffffff' ? '#1e293b' : phaseColor }}
                >
                  {phase === 'ready' ? '--:--' : fmt(countdown)}
                </div>
              </div>
            </div>

            {/* PREV / NEXT */}
            <div className="flex gap-1 mt-2 mb-1">
              <button
                onClick={goPrev}
                disabled={exIdx === 0}
                className="flex-1 py-1.5 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 disabled:opacity-30"
              >
                PREV
              </button>
              <button
                onClick={goNext}
                disabled={exIdx === exercises.length - 1}
                className="flex-1 py-1.5 bg-slate-800 rounded-lg text-[10px] font-black text-white disabled:opacity-30"
              >
                NEXT
              </button>
            </div>
          </div>
        </div>

        {/* Next exercise name */}
        {nextEx && (
          <div className="mt-1.5 text-center">
            <div className="text-[9px] text-white/60 font-bold uppercase tracking-wider">UP NEXT</div>
            <div className="text-[10px] text-white font-black leading-tight">{nextEx.name}</div>
          </div>
        )}
      </div>

      {/* ── BOTTOM OVERLAY — Exercise info + controls ─────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-5 pb-10">

        {/* Exercise name + sets badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={ex.id + '-label'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            {/* Category badge */}
            <div className="mb-2">
              <span
                className="text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest"
                style={{
                  color: isGym ? '#14b8a6' : '#818cf8',
                  borderColor: isGym ? 'rgba(20,184,166,0.4)' : 'rgba(129,140,248,0.4)',
                  backgroundColor: isGym ? 'rgba(20,184,166,0.15)' : 'rgba(129,140,248,0.15)',
                }}
              >
                {ex.category === 'warmup' ? '🔥 Warm Up' :
                 ex.category === 'core' ? '💪 Core' :
                 ex.category === 'cardio' ? '❤️ Cardio' :
                 ex.category === 'cool_down' ? '❄️ Cool Down' : '🏋️ Strength'}
              </span>
            </div>

            {/* Exercise name */}
            <h2 className="text-4xl font-black text-white leading-none tracking-tight mb-1 drop-shadow-2xl">
              {ex.name.toUpperCase()}
            </h2>

            {/* Sets × Reps + muscles */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-lg font-black text-white bg-black/50 backdrop-blur rounded-xl px-3 py-1">
                {ex.setsReps}
              </span>
              <span className="text-xs text-white/70 font-medium">
                {ex.muscles.join(' · ')}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Phase status bar */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className="text-xs font-black px-3 py-1.5 rounded-full"
            style={{ color: phaseColor, backgroundColor: 'rgba(0,0,0,0.5)', border: `1px solid ${phaseColor}40` }}
          >
            {phaseLabel}
          </div>
          {phase === 'rest' && countdown > 0 && (
            <div className="text-2xl font-black text-amber-400 font-mono">
              {countdown}s
            </div>
          )}
          {phase === 'active' && countdown > 0 && (
            <div className="text-2xl font-black font-mono" style={{ color: isGym ? '#14b8a6' : '#818cf8' }}>
              {fmt(countdown)}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {/* Tip button */}
          <button
            onClick={() => setShowTip(p => !p)}
            className="bg-black/50 backdrop-blur-md border border-white/20 rounded-2xl p-3.5"
          >
            <Info className="w-5 h-5 text-white" />
          </button>

          {/* Main action: Start / Pause / Resume */}
          {phase === 'ready' ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="flex-1 py-4 rounded-2xl font-black text-slate-950 text-base flex items-center justify-center gap-2.5 shadow-2xl"
              style={{
                background: isGym
                  ? 'linear-gradient(135deg, #14b8a6, #06b6d4)'
                  : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              }}
            >
              <Play className="w-5 h-5 fill-slate-950" />
              START · {ex.setsReps}
            </motion.button>
          ) : phase === 'active' || phase === 'rest' ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPaused(p => !p)}
              className="flex-1 py-4 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2.5 bg-black/60 backdrop-blur-md border border-white/20 shadow-xl"
            >
              {isPaused
                ? <><Play className="w-5 h-5 fill-white" /> RESUME</>
                : <><Pause className="w-5 h-5" /> PAUSE</>
              }
            </motion.button>
          ) : null}

          {/* Skip / Done set */}
          {(phase === 'active' || phase === 'rest') && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => { setCountdown(0); handlePhaseComplete() }}
              className="bg-black/50 backdrop-blur-md border border-white/20 rounded-2xl p-3.5"
            >
              <CheckCircle className="w-5 h-5 text-teal-400" />
            </motion.button>
          )}

          {/* Next exercise (ready state) */}
          {phase === 'ready' && exIdx < exercises.length - 1 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={goNext}
              className="bg-black/50 backdrop-blur-md border border-white/20 rounded-2xl p-3.5"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </motion.button>
          )}
        </div>

        {/* Progress bar — total workout */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(doneDots / totalDots) * 100}%` }}
              className="h-full rounded-full"
              style={{
                background: isGym
                  ? 'linear-gradient(90deg, #14b8a6, #06b6d4)'
                  : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              }}
            />
          </div>
          <span className="text-[9px] text-white/50 font-bold">
            {exIdx + 1}/{exercises.length}
          </span>
        </div>
      </div>

      {/* ── TIP CARD ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-44 left-4 right-4 z-40 bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Form Tip</span>
              </div>
              <button onClick={() => setShowTip(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-white font-medium leading-relaxed">{ex.tip}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {ex.muscles.map(m => (
                <span key={m} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">{m}</span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── WORKOUT COMPLETE OVERLAY ──────────────────────────── */}
      <AnimatePresence>
        {showDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 20 }}
              className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center space-y-5 shadow-2xl"
            >
              {/* Trophy */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/40"
              >
                <Trophy className="w-10 h-10 text-slate-900" />
              </motion.div>

              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">WORKOUT DONE!</h2>
                <p className="text-slate-400 text-sm font-medium mt-1">
                  {exercises.length} exercises · {fmt(elapsed)}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 rounded-2xl p-3">
                  <div className="text-lg font-black text-teal-400">{exercises.length}</div>
                  <div className="text-[9px] text-slate-400 font-bold mt-0.5">EXERCISES</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-3">
                  <div className="text-lg font-black text-amber-400">{fmt(elapsed)}</div>
                  <div className="text-[9px] text-slate-400 font-bold mt-0.5">TIME</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-3">
                  <div className="text-lg font-black text-rose-400">
                    {exercises.reduce((a, e) => a + e.sets, 0)}
                  </div>
                  <div className="text-[9px] text-slate-400 font-bold mt-0.5">SETS</div>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => router.push('/workout')}
                  className="w-full py-4 bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black rounded-2xl shadow-xl shadow-teal-500/20"
                >
                  Back to Programs
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-3 bg-white/5 border border-white/10 text-slate-300 font-bold rounded-2xl flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" /> Go to Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

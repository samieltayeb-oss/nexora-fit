'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Pause, RotateCcw, Check, Sparkles, Wind, Gauge } from 'lucide-react'

interface FormCoachModalProps {
  isOpen: boolean
  onClose: () => void
}

type Phase = 'top' | 'lowering' | 'bottom' | 'pressing'

export default function FormCoachModal({ isOpen, onClose }: FormCoachModalProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState<0.5 | 1>(1)
  const [activePhaseIndex, setActivePhaseIndex] = useState(0)
  const [repCount, setRepCount] = useState(0)

  // 4 Phase loop
  // 0: Top Setup (0.5s)
  // 1: Lowering (2.0s)
  // 2: Bottom Depth (0.5s)
  // 3: Pressing (1.0s)
  const phases: { name: string; label: string; breath: string; cue: string; duration: number }[] = [
    { name: 'Top Setup', label: '1. Lockout & Brace', breath: 'Hold Breath', cue: 'Hands shoulder-width, core tight, straight head-to-heels line', duration: 800 },
    { name: 'Lowering', label: '2. Controlled Descent (2s)', breath: 'Inhale Slowly', cue: 'Tuck elbows at 45°, lower your chest over 2 seconds', duration: 2000 },
    { name: 'Bottom Depth', label: '3. Bottom Depth (1 inch)', breath: 'Inhale Peak', cue: 'Chest hovers 1 inch above floor. No sagging hips.', duration: 600 },
    { name: 'Pressing', label: '4. Explosive Drive', breath: 'Exhale Hard', cue: 'Drive through palms and lock out triceps with power', duration: 1000 },
  ]

  useEffect(() => {
    if (!isOpen || !isPlaying) return

    const currentDuration = phases[activePhaseIndex].duration / speed
    const timer = setTimeout(() => {
      setActivePhaseIndex((prev) => {
        const next = (prev + 1) % phases.length
        if (next === 0) setRepCount((r) => r + 1)
        return next
      })
    }, currentDuration)

    return () => clearTimeout(timer)
  }, [isOpen, isPlaying, activePhaseIndex, speed])

  if (!isOpen) return null

  const currentPhase = phases[activePhaseIndex]
  const isBottomPose = activePhaseIndex === 1 || activePhaseIndex === 2

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Dialog Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="relative z-[111] w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-[2rem] bg-[#0c0c0e] border border-amber-500/40 shadow-[0_25px_70px_rgba(0,0,0,0.9)] text-foreground overflow-hidden"
      >
        {/* Header Bar */}
        <div className="p-5 pb-3 flex items-center justify-between border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/15 p-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <div className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-amber-400">
                Interactive Form Coach · Sample
              </div>
              <h2 className="font-display text-xl font-black text-white">Push-Up Masterclass</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white/70 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── INTERACTIVE ANIMATION STAGE ── */}
        <div className="relative aspect-[4/3] w-full bg-black overflow-hidden select-none">
          {/* Looping Motion GIF of Push-Up */}
          <img
            src="/artifacts/morning-challenge/push_up_motion.gif"
            alt="Push-Up Form Motion Animation"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Dark Cinematic Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-black/30 pointer-events-none" />

          {/* Live Motion Badge */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
            <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/40 text-xs font-black text-amber-400 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span>LIVE MOTION ANIMATION (GIF)</span>
            </div>

            <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/40 text-xs font-bold text-emerald-400">
              <Check className="h-3.5 w-3.5" />
              <span>45° Elbow Tuck · Rigid Plank Spine</span>
            </div>
          </div>

          {/* Breathing Cadence HUD */}
          <div className="absolute top-4 right-4 z-20 pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                borderColor: ['rgba(245, 158, 11, 0.4)', 'rgba(56, 189, 248, 0.8)', 'rgba(245, 158, 11, 0.4)'],
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border text-xs font-black"
            >
              <Wind className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
              <span className="text-sky-300">
                Inhale Down · Exhale Up
              </span>
            </motion.div>
          </div>

          {/* Bottom HUD bar */}
          <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs text-white/80 font-bold">
              ⚡ Real-time Movement Cadence (2s Down / 1s Up)
            </div>

            <div className="bg-amber-500 px-3 py-1.5 rounded-xl text-black font-black text-xs shadow-md">
              Full Rep Loop
            </div>
          </div>
        </div>

        {/* ── INTERACTIVE CONTROLS ── */}
        <div className="p-5 border-b border-white/[0.08] bg-white/[0.02]">
          {/* Phase Scrubbing Timeline Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {phases.map((p, idx) => (
              <button
                key={p.name}
                onClick={() => {
                  setActivePhaseIndex(idx)
                  setIsPlaying(false)
                }}
                className={`px-2.5 py-2 rounded-xl text-left border transition-all cursor-pointer ${
                  activePhaseIndex === idx
                    ? 'border-amber-500/80 bg-amber-500/20 text-amber-300'
                    : 'border-white/[0.06] bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="font-mono text-[9px] font-bold uppercase opacity-60">Phase {idx + 1}</div>
                <div className="text-[11px] font-black truncate">{p.name}</div>
              </button>
            ))}
          </div>

          {/* Play / Speed Controls */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-4 py-2 rounded-xl font-black text-xs shadow-md hover:brightness-110 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5 fill-black" /> : <Play className="h-3.5 w-3.5 fill-black" />}
                {isPlaying ? 'Pause Loop' : 'Play Live Cadence'}
              </button>

              <button
                onClick={() => {
                  setActivePhaseIndex(0)
                  setRepCount(0)
                }}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white/80 px-3 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>

            {/* Speed Toggle */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              <Gauge className="h-3.5 w-3.5 text-white/40 ml-1.5" />
              <button
                onClick={() => setSpeed(0.5)}
                className={`px-2 py-1 rounded-lg font-mono text-[10px] font-black transition-all cursor-pointer ${
                  speed === 0.5 ? 'bg-amber-500 text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                0.5x Slow
              </button>
              <button
                onClick={() => setSpeed(1)}
                className={`px-2 py-1 rounded-lg font-mono text-[10px] font-black transition-all cursor-pointer ${
                  speed === 1 ? 'bg-amber-500 text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                1.0x Real
              </button>
            </div>
          </div>
        </div>

        {/* ── COACHING CUE & CHECKLIST ── */}
        <div className="p-5 space-y-4">
          {/* Active Phase Cue */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="font-mono text-[10px] font-black uppercase tracking-wider text-amber-400 mb-1">
              Active Focus Cue: {currentPhase.label}
            </div>
            <p className="text-xs md:text-sm font-semibold text-white/90">
              {currentPhase.cue}
            </p>
          </div>

          {/* Form Checklist */}
          <div>
            <div className="font-mono text-[10px] font-black uppercase tracking-wider text-white/50 mb-2">
              Non-Negotiable Form Rules
            </div>
            <div className="space-y-2">
              {[
                'Elbows track at a 45° arrow angle relative to your torso (protects shoulder rotator cuff).',
                'Core and glutes squeezed tight — do not allow lower back to arch or hips to dip.',
                'Full depth: Chest hovers 1 inch off the floor on every single rep.',
                'Neck stays neutral: Look at the floor 6 inches ahead of your hands, not forward.',
              ].map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 text-xs text-white/80">
                  <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

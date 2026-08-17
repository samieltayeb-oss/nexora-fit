'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Dumbbell, ChevronRight, Flame, Clock, Trophy, Sun, Sparkles, Play, Star } from 'lucide-react'

export default function WorkoutHubPage() {
  return (
    <div className="min-h-screen pb-36 space-y-6">
      {/* Header */}
      <div className="pt-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/15 border border-teal-500/30 text-teal-300">
            NEXORA FIT Training Hub
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> GIF Motion Coach Active
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-black leading-tight tracking-tight text-foreground">
          Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">Transformation Program</span>
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm font-medium text-foreground/70">
          Clinically structured for Type 2 Diabetes management, lean tissue preservation, and visceral fat reduction.
        </p>
      </div>

      {/* Program Cards Grid */}
      <div className="space-y-5">

        {/* 1. 28-DAY MORNING TRANSFORMATION (15-Min Home Challenge) */}
        <Link href="/workout/morning-challenge">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/70 via-[#100e0a] to-[#0a0a0c] shadow-2xl p-6 sm:p-7 transition-all hover:border-amber-400/60 cursor-pointer"
          >
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-[90px] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl border border-amber-500/40 bg-amber-500/20 p-2 text-amber-400">
                    <Sun className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[10px] font-black uppercase tracking-[0.15em] text-amber-400">
                    Morning Routine · Home Calisthenics
                  </span>
                </div>
                <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase rounded-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Looping Form GIFs
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1.5">
                28-DAY MORNING CHALLENGE
              </h2>
              <p className="text-xs sm:text-sm text-foreground/80 font-medium mb-4 max-w-xl">
                15 minutes every morning to stimulate muscle GLUT-4 glucose clearing without insulin spikes. Push-ups, Squats, Planks &amp; Lunges.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-foreground/90 mb-5">
                <div className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10">
                  <Clock className="h-3.5 w-3.5 text-amber-400" /> 15 min / day
                </div>
                <div className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10">
                  <Flame className="h-3.5 w-3.5 text-amber-400" /> 90–220 cal
                </div>
                <div className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10">
                  <Trophy className="h-3.5 w-3.5 text-amber-400" /> 28 Days Sequential
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                <div className="flex gap-1.5 flex-wrap">
                  {['No Equipment', 'Home Floor', 'RPE 5–6 Safe'].map(tag => (
                    <span key={tag} className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[9px] font-black text-amber-300">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 px-4 py-2 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/30 group-hover:brightness-110 transition-all">
                  Open Day 1 <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* 2. GYM STRENGTH & MACHINE CHALLENGE */}
        <Link href="/workout/program?type=gym">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden rounded-3xl border border-teal-500/40 bg-gradient-to-br from-teal-950/60 via-[#0d1618] to-black shadow-2xl p-6 sm:p-7 transition-all hover:border-teal-400/60 cursor-pointer"
          >
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-teal-500/10 blur-[90px] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl border border-teal-500/40 bg-teal-500/20 p-2 text-teal-400">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[10px] font-black uppercase tracking-[0.15em] text-teal-400">
                    Gym Machine Foundation
                  </span>
                </div>
                <span className="px-2.5 py-1 bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[10px] font-black uppercase rounded-lg flex items-center gap-1">
                  <Play className="w-3 h-3 fill-teal-300" /> Animated Motion Guide
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1.5">
                GYM MACHINE ROUTINE
              </h2>
              <p className="text-xs sm:text-sm text-foreground/80 font-medium mb-4 max-w-xl">
                Joint-friendly machine exercises with guided paths. Leg Press, Chest Press, Lat Pulldown, Seated Row, Leg Extension &amp; Cable Triceps.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-foreground/90 mb-5">
                <div className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10">
                  <Clock className="h-3.5 w-3.5 text-teal-400" /> 35–45 min / session
                </div>
                <div className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10">
                  <Flame className="h-3.5 w-3.5 text-teal-400" /> 180–270 cal
                </div>
                <div className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10">
                  <Trophy className="h-3.5 w-3.5 text-teal-400" /> 28 Days Program
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                <div className="flex gap-1.5 flex-wrap">
                  {['Gym Machines', 'Form Visualizer', 'Hypertrophy'].map(tag => (
                    <span key={tag} className="rounded-full border border-teal-500/30 bg-teal-500/10 px-2.5 py-0.5 text-[9px] font-black text-teal-300">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 px-4 py-2 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/30 group-hover:brightness-110 transition-all">
                  Start Routine <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Quick Exercise Library Link */}
        <Link href="/workout/library">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-teal-500/40 transition-all flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/[0.04] text-foreground/80 group-hover:text-teal-400 transition-colors">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                  Exercise Motion &amp; Technique Library
                </h4>
                <p className="text-xs text-foreground/60">
                  Inspect all machine adjustments, form animations, and safety limits
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-foreground/40 group-hover:text-teal-300 transition-colors" />
          </div>
        </Link>

      </div>
    </div>
  )
}

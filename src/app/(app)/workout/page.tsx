'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Dumbbell, PersonStanding, ChevronRight, Flame, Clock, Trophy, Star } from 'lucide-react'

export default function WorkoutHubPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-32">
      {/* Header */}
      <div className="px-5 pt-10 pb-6">
        <p className="text-[10px] font-black text-teal-400 uppercase tracking-[0.2em] mb-1">SAM FIT</p>
        <h1 className="text-3xl font-black tracking-tight text-white leading-tight">
          Choose Your<br />
          <span className="text-teal-400">Training Style</span>
        </h1>
        <p className="text-sm text-slate-400 mt-2 font-medium">Two complete 28-day transformation programs</p>
      </div>

      {/* Program Cards */}
      <div className="px-5 space-y-4">

        {/* Gym Machine Workout */}
        <Link href="/workout/program?type=gym">
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="relative rounded-3xl overflow-hidden border border-teal-400/30 shadow-2xl shadow-teal-500/20"
            style={{ minHeight: 200 }}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src="/artifacts/exercises/chest_press_illustrated.jpg"
                alt="Gym Workout"
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d1f1c]/95 via-[#0d1f1c]/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-teal-400/20 border border-teal-400/40 rounded-xl p-2">
                  <Dumbbell className="w-5 h-5 text-teal-400" />
                </div>
                <span className="text-[10px] font-black text-teal-400 uppercase tracking-[0.15em]">Machine Training</span>
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight mb-1">GYM STRENGTH<br />CHALLENGE</h2>
              <p className="text-xs text-slate-300 font-medium mb-4">Leg Press · Chest Press · Lat Pulldown · Seated Row · and more</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  35–50 min / session
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  180–270 cal
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  28 Days
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[4%] bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full" />
                </div>
                <span className="text-[10px] text-slate-400 font-bold">1 / 28 done</span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-1">
                  {['Beginner', 'Gym', 'Machine'].map(tag => (
                    <span key={tag} className="text-[9px] font-black px-2 py-0.5 rounded-full bg-teal-400/10 text-teal-300 border border-teal-400/20">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 bg-teal-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-lg">
                  Start <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Calisthenics / Bodyweight */}
        <Link href="/workout/program?type=calisthenics">
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="relative rounded-3xl overflow-hidden border border-indigo-400/30 shadow-2xl shadow-indigo-500/20"
            style={{ minHeight: 200 }}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src="/artifacts/exercises/pushup_illustrated.jpg"
                alt="Calisthenics"
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#12101f]/95 via-[#12101f]/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-indigo-400/20 border border-indigo-400/40 rounded-xl p-2">
                  <PersonStanding className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.15em]">Bodyweight</span>
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight mb-1">CALISTHENICS<br />CHALLENGE</h2>
              <p className="text-xs text-slate-300 font-medium mb-4">Push-Ups · Planks · Burpees · Mountain Climbers · Lunges · and more</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  15–30 min / day
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  120–200 cal
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  28 Days
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full" />
                </div>
                <span className="text-[10px] text-slate-400 font-bold">0 / 28 done</span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-1">
                  {['No Equipment', 'Home', 'Outdoor'].map(tag => (
                    <span key={tag} className="text-[9px] font-black px-2 py-0.5 rounded-full bg-indigo-400/10 text-indigo-300 border border-indigo-400/20">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 bg-indigo-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-lg">
                  Start <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-2">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-xl font-black text-teal-400">56</div>
            <div className="text-[10px] text-slate-400 font-bold mt-0.5">Total Days</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-xl font-black text-amber-400">22</div>
            <div className="text-[10px] text-slate-400 font-bold mt-0.5">Exercises</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-xl font-black text-rose-400">
              <Star className="w-5 h-5 mx-auto fill-rose-400" />
            </div>
            <div className="text-[10px] text-slate-400 font-bold mt-0.5">Premium</div>
          </div>
        </div>

        {/* Exercise Library Link */}
        <Link href="/workout/library">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-slate-700 rounded-xl p-2.5">
                <Dumbbell className="w-4 h-4 text-slate-300" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Exercise Library</div>
                <div className="text-[11px] text-slate-400 font-medium">Form guides · Machine setup · Tips</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>
        </Link>
      </div>
    </div>
  )
}

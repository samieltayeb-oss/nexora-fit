import { createClient } from '@/utils/supabase/server'
import { Activity, Dumbbell, ArrowRight, ShieldCheck, Plus, Target, CalendarDays, Watch } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // In a real app we'd fetch this from the database
  const weight = 81.05
  const goalWeight = 75
  const progressPercent = Math.max(0, Math.min(100, ((85 - weight) / (85 - goalWeight)) * 100))
  
  const todayWorkout = {
    title: 'Full Body Foundation',
    duration: '45-60 min',
    phase: 'Phase 1 - Week 1',
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Today</h1>
          <p className="text-slate-400 text-sm">Friday, July 31</p>
        </div>
        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
          <span className="text-lg font-medium text-teal-400">S</span>
        </div>
      </div>

      {/* Safety Status */}
      <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-4 flex items-center gap-4">
        <div className="bg-teal-500/20 p-2 rounded-full">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-teal-400">Safety Status</h3>
          <p className="text-xs text-slate-300 mt-0.5">Medical clearance confirmed</p>
        </div>
      </div>

      {/* Primary Goal / Weight Progress */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-bl-[100px] -z-10 group-hover:bg-teal-500/10 transition-colors" />
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-teal-500" />
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Weight Goal</h2>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white tracking-tighter">{weight} <span className="text-lg text-slate-400 font-normal">kg</span></div>
            <p className="text-xs text-slate-400 mt-1">{(weight - goalWeight).toFixed(2)} kg remaining</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/30 rounded-full" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Start: 85.0 kg</span>
            <span>Goal: {goalWeight}.0 kg</span>
          </div>
        </div>
      </section>

      {/* Up Next / Workout Card */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4">Up Next</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-1 shadow-xl">
          <div className="p-5 flex gap-4">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Dumbbell className="w-8 h-8 text-slate-300" />
            </div>
            <div className="flex-1 flex justify-center flex-col">
              <h3 className="text-lg font-bold text-white">{todayWorkout.title}</h3>
              <p className="text-sm text-slate-400">{todayWorkout.phase} • {todayWorkout.duration}</p>
            </div>
          </div>
          
          <Link href="/workout/active" className="block m-2">
            <div className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(20,184,166,0.15)]">
              Start Workout <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        {/* Readiness Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-300">Readiness</h3>
          </div>
          <div className="text-2xl font-bold text-white mb-1">Check In</div>
          <p className="text-xs text-slate-400 mb-4">Log sleep & energy</p>
          <button className="text-xs bg-slate-800 text-slate-300 px-3 py-2 rounded-lg w-full font-medium hover:bg-slate-700 transition-colors">
            Log Now
          </button>
        </div>

        {/* Activity / Watch Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Watch className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-semibold text-slate-300">Activity</h3>
          </div>
          <div className="text-2xl font-bold text-white mb-1">--</div>
          <p className="text-xs text-slate-400 mb-4">Active Calories</p>
          <button className="text-xs bg-slate-800 text-slate-300 px-3 py-2 rounded-lg w-full font-medium flex justify-center items-center gap-1 hover:bg-slate-700 transition-colors">
            <Plus className="w-3 h-3" /> Sync Watch
          </button>
        </div>
      </div>

    </div>
  )
}

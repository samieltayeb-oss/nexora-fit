import Link from 'next/link'
import { Dumbbell, Search, ChevronRight, Play } from 'lucide-react'

export default function WorkoutHubPage() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Workout</h1>
          <p className="text-slate-400 text-sm">Your Training Plan</p>
        </div>
      </div>

      {/* Current Program */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-[100px] -z-10 group-hover:bg-indigo-500/10 transition-colors" />
        
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Current Phase</h2>
        <div className="text-2xl font-bold text-white mb-1">Phase 1: Adaptation</div>
        <p className="text-slate-400 text-sm mb-6">Week 1 of 12 • 3 Sessions / Week</p>

        <div className="space-y-3">
          <WorkoutDayCard day="Day A" title="Full Body Foundation" isNext />
          <WorkoutDayCard day="Day B" title="Full Body Control" />
          <WorkoutDayCard day="Day C" title="Full Body Function" />
        </div>
      </section>

      {/* Library Link */}
      <Link href="/workout/library" className="block">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="bg-teal-500/10 p-3 rounded-xl">
              <Search className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Exercise Library</h3>
              <p className="text-sm text-slate-400">View safe alternatives & form guides</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </div>
      </Link>
    </div>
  )
}

function WorkoutDayCard({ day, title, isNext = false }: { day: string; title: string; isNext?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border flex items-center justify-between ${isNext ? 'bg-slate-800 border-slate-700' : 'bg-slate-950/50 border-slate-800'}`}>
      <div>
        <div className="text-xs font-medium text-slate-400 mb-1">{day}</div>
        <div className={`font-semibold ${isNext ? 'text-white' : 'text-slate-300'}`}>{title}</div>
      </div>
      {isNext ? (
        <Link href="/workout/active">
          <button className="bg-teal-500 hover:bg-teal-400 text-slate-950 p-2 rounded-full transition-colors shadow-lg shadow-teal-500/20">
            <Play className="w-5 h-5 ml-0.5" />
          </button>
        </Link>
      ) : (
        <Dumbbell className="w-5 h-5 text-slate-600" />
      )}
    </div>
  )
}

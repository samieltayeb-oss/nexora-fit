import { Heart, Droplets, Apple, Pill, ActivitySquare } from 'lucide-react'

export default function HealthPage() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Health</h1>
          <p className="text-foreground/70 text-sm">Vitals & Nutrition</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Blood Pressure */}
        <div className="bg-background border border-border rounded-3xl p-5 shadow-lg group cursor-pointer hover:bg-surface/50 transition-colors">
          <div className="bg-rose-500/10 p-3 rounded-xl w-fit mb-4">
            <Heart className="w-6 h-6 text-rose-500" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">Blood Pressure</h3>
          <p className="text-sm text-foreground/70">Log BP & Heart Rate</p>
        </div>

        {/* Glucose */}
        <div className="bg-background border border-border rounded-3xl p-5 shadow-lg group cursor-pointer hover:bg-surface/50 transition-colors">
          <div className="bg-blue-500/10 p-3 rounded-xl w-fit mb-4">
            <Droplets className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">Blood Glucose</h3>
          <p className="text-sm text-foreground/70">Log pre/post workout</p>
        </div>
      </div>

      {/* Nutrition / Habits */}
      <section className="bg-background border border-border rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-500/10 p-2 rounded-xl">
            <Apple className="w-5 h-5 text-green-500" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Nutrition Habits</h2>
        </div>

        <div className="space-y-4">
          <HabitCheck title="Protein Target Hit" desc="Included protein with major meals" />
          <HabitCheck title="Hydration Goal" desc="Drank enough water today" />
          <HabitCheck title="Vegetables" desc="Included veggies today" />
        </div>
      </section>

      {/* Apple Health Import */}
      <section className="bg-background border border-border rounded-3xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ActivitySquare className="w-5 h-5 text-primary" /> Apple Health
          </h3>
          <p className="text-sm text-foreground/70 mt-1">Manual data import & sync</p>
        </div>
        <button className="bg-surface hover:bg-slate-700 text-foreground px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          Import CSV
        </button>
      </section>

      {/* Medical Notes / Emergency */}
      <section className="bg-background border border-border rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-amber-500/10 p-2 rounded-xl">
            <Pill className="w-5 h-5 text-amber-500" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Medical Notes</h2>
        </div>
        <p className="text-sm text-foreground/70 mb-4">
          View your clinician instructions and emergency plan.
        </p>
        <button className="w-full bg-surface text-foreground py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors">
          View Plan
        </button>
      </section>

    </div>
  )
}

function HabitCheck({ title, desc }: { title: string; desc: string }) {
  return (
    <label className="flex items-center gap-4 p-4 border border-border rounded-2xl cursor-pointer hover:bg-surface/50 transition-colors group">
      <input 
        type="checkbox" 
        className="w-5 h-5 rounded border-border-subtle bg-background text-green-500 focus:ring-green-500/50 focus:ring-offset-slate-900" 
      />
      <div>
        <div className="font-semibold text-foreground/90 group-hover:text-foreground transition-colors">{title}</div>
        <div className="text-xs text-slate-500">{desc}</div>
      </div>
    </label>
  )
}

import { WeightChart } from '@/components/weight-chart'
import { TrendingDown, Activity, Plus } from 'lucide-react'

export default function ProgressPage() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Progress</h1>
          <p className="text-slate-400 text-sm">30-Day Trends</p>
        </div>
        <button className="bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Log Data
        </button>
      </div>

      {/* Weight Trend */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-lg font-bold text-white">Weight Trend</h2>
            <p className="text-sm text-slate-400 mt-1">Average -0.5 kg/week</p>
          </div>
          <div className="flex items-center gap-1 text-teal-400 bg-teal-500/10 px-2 py-1 rounded-lg text-xs font-medium">
            <TrendingDown className="w-3 h-3" />
            3.45 kg
          </div>
        </div>
        
        <WeightChart />
      </section>

      {/* Other Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <h3 className="text-sm font-semibold text-slate-400 mb-1">Waist</h3>
          <div className="text-2xl font-bold text-white mb-2">-- cm</div>
          <p className="text-xs text-slate-500">Not recorded</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <h3 className="text-sm font-semibold text-slate-400 mb-1">Body Fat (Est)</h3>
          <div className="text-2xl font-bold text-white mb-2">23.4%</div>
          <p className="text-xs text-slate-500">From Smart Scale</p>
        </div>
      </div>
      
      {/* Consistency */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-500/10 p-2 rounded-xl">
            <Activity className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Consistency Score</h2>
            <p className="text-sm text-slate-400">Past 4 weeks</p>
          </div>
        </div>
        
        <div className="flex gap-2 h-24 items-end mt-6">
          {/* Mock bars */}
          {[60, 80, 100, 75].map((h, i) => (
            <div key={i} className="flex-1 bg-slate-800 rounded-t-lg relative group cursor-pointer hover:bg-slate-700 transition-colors">
              <div 
                className={`absolute bottom-0 left-0 right-0 rounded-t-lg transition-all ${i === 2 ? 'bg-teal-500' : 'bg-indigo-500'}`}
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-2 px-1">
          <span>W1</span>
          <span>W2</span>
          <span>W3</span>
          <span>W4</span>
        </div>
      </section>
    </div>
  )
}

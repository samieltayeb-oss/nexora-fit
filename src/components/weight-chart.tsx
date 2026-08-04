'use client'

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts'
import { Scale } from 'lucide-react'

const data = [
  { date: 'Jul 1', weight: 84.5 },
  { date: 'Jul 8', weight: 83.8 },
  { date: 'Jul 15', weight: 83.0 },
  { date: 'Jul 22', weight: 82.1 },
  { date: 'Jul 29', weight: 81.3 },
  { date: 'Jul 31', weight: 81.05 },
]

const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: Record<string, unknown>[], label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-2xl shadow-2xl border-white/10 backdrop-blur-xl">
        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{label}</p>
        <p className="text-lg font-bold text-white flex items-baseline gap-1">
          {payload[0].value} <span className="text-xs text-slate-400 font-medium tracking-normal">kg</span>
        </p>
      </div>
    )
  }
  return null
}

export function WeightChart({ goalWeight = 75.0 }: { goalWeight?: number }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[250px] w-full mt-4 flex flex-col items-center justify-center border border-dashed border-slate-700/50 rounded-3xl bg-white/[0.01]">
        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3">
          <Scale className="w-5 h-5 text-slate-500" />
        </div>
        <p className="text-sm font-semibold text-slate-300">No data yet</p>
        <p className="text-xs font-medium text-slate-500 mt-1 max-w-[200px] text-center">
          Step on your smart scale to see your weight journey mapped here.
        </p>
      </div>
    )
  }

  return (
    <div className="h-[250px] w-full mt-4 -ml-4 md:ml-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            stroke="#475569" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#64748b' }}
            dy={10}
          />
          <YAxis 
            stroke="#475569" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            domain={['dataMin - 1', 'dataMax + 1']}
            tickFormatter={(value) => `${value}kg`}
            tick={{ fill: '#64748b' }}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <ReferenceLine 
            y={goalWeight} 
            stroke="var(--accent-success)" 
            strokeDasharray="4 4" 
            strokeWidth={1.5}
            label={{ position: 'top', value: 'Goal', fill: 'var(--accent-success)', fontSize: 10, fontWeight: 700, offset: 5 }}
          />
          <Area 
            type="monotone" 
            dataKey="weight" 
            stroke="var(--accent-primary)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorWeight)"
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

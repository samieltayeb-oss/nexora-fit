'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
  { date: 'Jul 1', weight: 84.5 },
  { date: 'Jul 8', weight: 83.8 },
  { date: 'Jul 15', weight: 83.0 },
  { date: 'Jul 22', weight: 82.1 },
  { date: 'Jul 29', weight: 81.3 },
  { date: 'Jul 31', weight: 81.05 },
]

export function WeightChart() {
  return (
    <div className="h-[250px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <XAxis 
            dataKey="date" 
            stroke="#475569" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#475569" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            domain={['dataMin - 1', 'dataMax + 1']}
            tickFormatter={(value) => `${value}kg`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc' }}
            itemStyle={{ color: '#14b8a6' }}
          />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#14b8a6" 
            strokeWidth={3}
            dot={{ fill: '#14b8a6', strokeWidth: 2, r: 4, stroke: '#020617' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

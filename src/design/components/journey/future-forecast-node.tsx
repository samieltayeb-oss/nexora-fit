import { motion } from 'framer-motion'
import { GoalScenario } from '@/lib/intelligence/types'

export function FutureForecastNode({ scenarios }: { scenarios: GoalScenario[] }) {
  if (scenarios.length === 0) return null

  // Sort by date closest first (Best Pace)
  const sorted = [...scenarios].sort((a, b) => new Date(a.projectedDate).getTime() - new Date(b.projectedDate).getTime())

  return (
    <div className="w-full py-12">
      <div className="relative h-2 w-full rounded-full bg-surface-elevated">
        {/* The Journey Line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-primary to-amber-600"
        />

        {/* Start Point */}
        <div className="absolute -left-2 -top-2 h-6 w-6 rounded-full bg-surface border-4 border-primary z-10" />
        <span className="absolute -left-4 top-6 text-[10px] font-mono font-bold text-foreground/50 uppercase">Today</span>

        {/* Nodes for scenarios */}
        {sorted.map((scenario, idx) => {
          // Map Best Pace to ~60%, Current to ~80%, Slower to 100%
          let leftPercent = '100%'
          if (scenario.pace === 'Best Pace') leftPercent = '60%'
          if (scenario.pace === 'Current Pace') leftPercent = '80%'

          return (
            <motion.div
              key={scenario.pace}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1 + (idx * 0.5) }}
              className="absolute -top-2 z-10"
              style={{ left: leftPercent, transform: 'translateX(-50%)' }}
            >
              <div className={`h-6 w-6 rounded-full border-4 bg-surface ${scenario.pace === 'Current Pace' ? 'border-primary' : 'border-border-subtle'}`} />
              <div className="absolute left-1/2 mt-2 -translate-x-1/2 text-center w-24">
                <div className={`text-[10px] font-mono font-bold uppercase tracking-wider ${scenario.pace === 'Current Pace' ? 'text-primary' : 'text-foreground/50'}`}>
                  {scenario.pace}
                </div>
                <div className="text-xs font-bold text-foreground mt-0.5">
                  {new Date(scenario.projectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

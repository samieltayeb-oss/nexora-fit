import { motion } from 'framer-motion'
import { Trophy, TrendingDown, Calendar, Zap, Activity } from 'lucide-react'

export function MemoryCard({
  type,
  description,
  date,
}: {
  type: 'FirstWorkout' | 'FastestWeek' | 'BiggestWeightDrop' | 'BestLift' | 'WaistMilestone' | 'MonthlyReflection'
  description: string
  date: string
}) {
  const isTrophy = type !== 'MonthlyReflection'

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-3xl p-6 md:p-8 shadow-sm border ${
        isTrophy ? 'bg-surface border-primary/20' : 'bg-surface-elevated border-border-subtle'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-4 rounded-2xl flex-shrink-0 ${isTrophy ? 'bg-primary/20 text-primary' : 'bg-surface text-foreground/70'}`}>
          {type === 'FirstWorkout' && <Calendar className="h-6 w-6" />}
          {type === 'BiggestWeightDrop' && <TrendingDown className="h-6 w-6" />}
          {type === 'BestLift' && <Zap className="h-6 w-6" />}
          {type === 'FastestWeek' && <Activity className="h-6 w-6" />}
          {type === 'WaistMilestone' && <Trophy className="h-6 w-6" />}
          {type === 'MonthlyReflection' && <Trophy className="h-6 w-6 text-warning" />}
        </div>
        
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/50 font-bold mb-1 block">
            {new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <h3 className="font-display text-xl font-bold tracking-tight text-foreground mb-2">
            {type === 'MonthlyReflection' ? 'AI Reflection' : type.replace(/([A-Z])/g, ' $1').trim()}
          </h3>
          <p className="text-sm text-foreground/80 leading-relaxed font-medium">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

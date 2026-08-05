import { motion } from 'framer-motion'

export function ChapterHeader({ 
  id, 
  title, 
  summary 
}: { 
  id: number
  title: string
  summary: string | null
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-surface p-8 shadow-sm border border-border-subtle mb-8">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
      <div className="relative z-10">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary font-black">
          Chapter {id}
        </span>
        <h2 className="mt-2 font-display text-4xl font-black tracking-tight text-foreground md:text-5xl">
          {title}
        </h2>
        {summary && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 border-l-2 border-primary pl-4"
          >
            <p className="font-medium text-foreground/80 leading-relaxed max-w-xl">
              {summary}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

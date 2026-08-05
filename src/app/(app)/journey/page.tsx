'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Compass } from 'lucide-react'
import Link from 'next/link'
import { ChapterHeader } from '@/design/components/journey/chapter-header'
import { MemoryCard } from '@/design/components/journey/memory-card'
import { fetchIntelligenceBrief } from '@/app/actions/intelligence'
import type { HybridIntelligenceContext } from '@/lib/intelligence/types'

export default function JourneyPage() {
  const [context, setContext] = useState<HybridIntelligenceContext | null>(null)

  useEffect(() => {
    async function load() {
      const data = await fetchIntelligenceBrief()
      setContext(data.context)
    }
    load()
  }, [])

  if (!context) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-elevated border-t-primary" />
      </div>
    )
  }

  const { story, memory } = context

  return (
    <div className="space-y-12 pb-32 max-w-2xl mx-auto pt-6">
      <div className="px-5 text-center mb-12">
        <h1 className="font-display text-4xl font-black tracking-tight text-foreground">
          My Journey™
        </h1>
        <p className="mt-2 text-sm font-medium text-foreground/70">
          The story of your transformation.
        </p>
      </div>

      {/* Gateway to Future Me */}
      <Link href="/journey/future">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mx-5 mb-16 rounded-3xl bg-gradient-to-br from-primary to-amber-600 p-[1px] shadow-2xl"
        >
          <div className="flex items-center justify-between rounded-3xl bg-background/95 p-6 backdrop-blur-xl md:p-8">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-primary/20 p-3 text-primary">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold tracking-tight text-foreground">Future Me</h3>
                <p className="mt-1 text-sm text-foreground/70">View your trajectory and scenarios</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-foreground/50" />
          </div>
        </motion.div>
      </Link>

      {/* The Chapters */}
      <div className="px-5">
        <ChapterHeader 
          id={story.chapter.id} 
          title={story.chapter.title} 
          summary={story.chapter.summary} 
        />
        
        <div className="space-y-6 mt-8 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-border-subtle -z-10" />

          {/* AI Memories */}
          {story.letterToFutureMe && (
            <MemoryCard 
              type="MonthlyReflection" 
              date={new Date().toISOString()} 
              description={story.letterToFutureMe} 
            />
          )}

          {memory.memories.map((mem) => (
            <MemoryCard 
              key={mem.id}
              type={mem.type}
              date={mem.date}
              description={mem.description}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

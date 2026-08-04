'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export function AnimatedCard({ 
  children, 
  className = '', 
  delay = 0 
}: { 
  children: ReactNode
  className?: string
  delay?: number 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ 
        y: -5, 
        scale: 1.01,
        transition: { duration: 0.25, ease: 'easeOut' }
      }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden transition-all duration-300 rounded-3xl bg-background/40 backdrop-blur-3xl border border-white/[0.08] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.85),_inset_0_1px_1px_0_rgba(255,255,255,0.12)] ${className}`}
    >
      {/* Top Edge Soft Glass Reflection */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  )
}

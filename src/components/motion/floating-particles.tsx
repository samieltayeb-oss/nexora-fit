'use client'

import { motion } from 'framer-motion'

export function FloatingParticles() {
  const particles = Array.from({ length: 12 })

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {particles.map((_, i) => {
        const size = Math.floor(Math.random() * 4) + 2
        const initialX = Math.random() * 100
        const initialY = Math.random() * 100
        const duration = Math.random() * 12 + 10

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-teal-400/20 blur-[1px]"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${initialX}%`,
              top: `${initialY}%`,
            }}
            animate={{
              y: ['0%', '-40%', '0%'],
              x: ['0%', '20%', '0%'],
              opacity: [0.2, 0.7, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.8,
            }}
          />
        )
      })}
    </div>
  )
}

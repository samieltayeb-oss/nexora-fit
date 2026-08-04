'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{ size: number, x: number, y: number, duration: number }>>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      const p = Array.from({ length: 12 }).map(() => ({
        size: Math.floor(Math.random() * 4) + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 12 + 10,
      }))
      setParticles(p)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-teal-400/20 blur-[1px]"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: ['0%', '-40%', '0%'],
            x: ['0%', '20%', '0%'],
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.8,
          }}
        />
      ))}
    </div>
  )
}

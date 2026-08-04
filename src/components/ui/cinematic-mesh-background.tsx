'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

export function CinematicMeshBackground() {
  const { scrollY } = useScroll()
  
  // Parallax transform layers
  const yMesh1 = useTransform(scrollY, [0, 1000], [0, -150])
  const yMesh2 = useTransform(scrollY, [0, 1000], [0, 100])
  const yMesh3 = useTransform(scrollY, [0, 1000], [0, -80])

  // Smooth springs for parallax
  const smoothY1 = useSpring(yMesh1, { damping: 25, stiffness: 100 })
  const smoothY2 = useSpring(yMesh2, { damping: 25, stiffness: 100 })
  const smoothY3 = useSpring(yMesh3, { damping: 25, stiffness: 100 })

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20 select-none">
      
      {/* 1. Film-Grain Noise Texture Overlay (Arc / Linear Style) */}
      <svg className="fixed inset-0 w-full h-full opacity-[0.035] mix-blend-overlay z-50 pointer-events-none">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* 2. Animated Gradient Mesh Layer 1 (Top Cyan / Emerald Bloom) */}
      <motion.div 
        style={{ y: smoothY1 }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 15, 0]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[55rem] h-[35rem] bg-gradient-to-tr from-cyan-500/25 via-teal-500/15 to-emerald-500/20 rounded-full blur-[140px]"
      />

      {/* 3. Animated Gradient Mesh Layer 2 (Bottom Indigo / Violet Bloom) */}
      <motion.div 
        style={{ y: smoothY2 }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.25, 0.45, 0.25],
          rotate: [0, -20, 0]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2
        }}
        className="absolute bottom-0 right-0 w-[45rem] h-[45rem] bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-pink-600/10 rounded-full blur-[160px]"
      />

      {/* 4. Animated Gradient Mesh Layer 3 (Left Amber / Teal Floor Bloom) */}
      <motion.div 
        style={{ y: smoothY3 }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4
        }}
        className="absolute top-1/3 -left-32 w-[40rem] h-[40rem] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-cyan-500/15 rounded-full blur-[150px]"
      />

      {/* 5. Very Slow Moving Ambient Micro Particles */}
      <SlowParticles />
    </div>
  )
}

function SlowParticles() {
  const particles = Array.from({ length: 16 })

  return (
    <div className="absolute inset-0">
      {particles.map((_, i) => {
        const size = (i % 3) + 2
        const initialX = (i * 6.25) % 100
        const initialY = (i * 12.5) % 100
        const duration = 24 + (i % 8) * 3 // Very slow 24s-45s duration loops

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-300/30 blur-[0.5px] shadow-[0_0_10px_rgba(0,245,212,0.4)]"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${initialX}%`,
              top: `${initialY}%`,
            }}
            animate={{
              y: ['0%', '-60%', '0%'],
              x: ['0%', '30%', '0%'],
              opacity: [0.15, 0.65, 0.15],
              scale: [1, 1.6, 1],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 1.2,
            }}
          />
        )
      })}
    </div>
  )
}

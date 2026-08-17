'use client'

import React from 'react'

interface NexoraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showWordmark?: boolean
  showTagline?: boolean
  className?: string
}

export function NexoraLogo({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  className = '',
}: NexoraLogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* ── HEX-PULSE MONOGRAM ── */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center flex-shrink-0`}>
        {/* Glow backdrop */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-teal-500/30 to-cyan-400/30 blur-md opacity-75 animate-pulse" />
        
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-[0_0_12px_rgba(20,184,166,0.5)]"
        >
          <defs>
            <linearGradient id="nexoraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Hex Shield Border */}
          <polygon
            points="50,4 92,26 92,74 50,96 8,74 8,26"
            stroke="url(#nexoraGrad)"
            strokeWidth="5"
            fill="#080c10"
            rx="4"
          />

          {/* Futuristic N + Health Vitality Pulse */}
          <path
            d="M 28,70 L 28,30 L 42,50 L 58,50 L 72,30 L 72,70"
            stroke="url(#nexoraGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Golden Center Vitality Pulse */}
          <path
            d="M 40,50 L 46,38 L 54,62 L 60,50"
            stroke="url(#pulseGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Corner Precision Dots */}
          <circle cx="50" cy="14" r="2.5" fill="#2dd4bf" />
          <circle cx="50" cy="86" r="2.5" fill="#3b82f6" />
        </svg>
      </div>

      {/* ── WORDMARK ── */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-display font-black tracking-wider text-white ${textSizes[size]}`}>
              NEXORA
            </span>
            <span className="font-mono text-[9px] font-black uppercase tracking-widest text-teal-400 bg-teal-500/15 border border-teal-500/30 px-1.5 py-0.5 rounded-md">
              FIT
            </span>
          </div>
          {showTagline && (
            <span className="font-mono text-[9px] font-bold tracking-widest text-foreground/50 uppercase mt-0.5">
              Precision Health & Longevity
            </span>
          )}
        </div>
      )}
    </div>
  )
}

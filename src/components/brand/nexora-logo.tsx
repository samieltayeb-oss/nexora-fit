'use client'

import React from 'react'

interface NexoraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
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
    sm: 'w-11 h-11',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
    '2xl': 'w-44 h-44',
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
    '2xl': 'text-5xl',
  }

  const tagSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
    '2xl': 'text-base',
  }

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* ── OFFICIAL 3D GOLD & SILVER NEXORA EMBLEM ── */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center flex-shrink-0 group`}>
        {/* Luxury Gold & Amber Ambient Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-yellow-500/25 to-teal-400/20 blur-xl opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <img
          src="/brand/nexorafit.png"
          alt="NEXORA FIT Logo"
          className="w-full h-full object-contain relative z-10 drop-shadow-[0_8px_25px_rgba(245,158,11,0.35)] hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* ── WORDMARK ── */}
      {showWordmark && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-2">
            <span className={`font-display font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 drop-shadow-sm ${textSizes[size]}`}>
              NEXORA
            </span>
            <span className={`font-mono font-black tracking-widest text-teal-300 uppercase px-2 py-0.5 rounded-md bg-teal-500/15 border border-teal-500/30 ${tagSizes[size]}`}>
              FIT
            </span>
          </div>
          {showTagline && (
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-amber-300/80 uppercase mt-1 font-bold">
              TRAIN · TRANSFORM · BECOME
            </span>
          )}
        </div>
      )}
    </div>
  )
}

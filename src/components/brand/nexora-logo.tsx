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
  // Height presets for the full horizontal logo
  const logoHeights = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-20 sm:h-24',
    '2xl': 'h-28 sm:h-36',
  }

  // Square emblem sizes
  const emblemSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28',
  }

  if (showWordmark) {
    return (
      <div className={`relative flex items-center group ${className}`}>
        {/* Luxury Gold Ambient Back-Glow */}
        <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-amber-500/25 via-yellow-400/20 to-teal-400/20 blur-xl opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        {/* Full 3D Gold & Silver Horizontal Logo */}
        <img
          src="/brand/nexorafit.png"
          alt="NEXORA FIT — Train. Transform. Become."
          width={280}
          height={70}
          className={`${logoHeights[size]} w-auto object-contain relative z-10 drop-shadow-[0_10px_30px_rgba(245,158,11,0.35)] transition-transform duration-300 group-hover:scale-[1.02]`}
        />
      </div>
    )
  }

  return (
    <div className={`relative flex items-center justify-center group ${className}`}>
      {/* Luxury Gold Ambient Glow for Square Emblem */}
      <div className="absolute inset-0 rounded-2xl bg-amber-500/25 blur-lg opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      {/* 3D Gold 'N' Emblem */}
      <img
        src="/brand/emblem.png"
        alt="NEXORA Emblem"
        width={56}
        height={56}
        className={`${emblemSizes[size]} object-contain relative z-10 drop-shadow-[0_8px_20px_rgba(245,158,11,0.4)] transition-transform duration-300 group-hover:scale-105`}
      />
    </div>
  )
}

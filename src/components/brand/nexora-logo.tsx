'use client'

import React from 'react'
import Image from 'next/image'

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
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }

  const iconPx = {
    sm: 28,
    md: 40,
    lg: 56,
    xl: 80,
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* ── OFFICIAL BRAND LOGO ICON ── */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center flex-shrink-0`}>
        {/* Ambient Teal/Cyan Glow */}
        <div className="absolute inset-0 rounded-2xl bg-teal-500/20 blur-md opacity-80 animate-pulse pointer-events-none" />
        
        <img
          src="/brand/logo-primary.png"
          alt="NEXORA Logo"
          className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_16px_rgba(45,212,191,0.4)]"
        />
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


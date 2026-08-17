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
    sm: 'w-9 h-9',
    md: 'w-13 h-13',
    lg: 'w-18 h-18',
    xl: 'w-26 h-26',
  }

  const iconPx = {
    sm: 36,
    md: 52,
    lg: 72,
    xl: 104,
  }

  const textSizes = {
    sm: 'text-base',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  }

  const tagSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  }

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* ── OFFICIAL BRAND LOGO ICON ── */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center flex-shrink-0`}>
        {/* Ambient Teal/Cyan Glow */}
        <div className="absolute inset-0 rounded-2xl bg-teal-400/25 blur-lg opacity-90 animate-pulse pointer-events-none" />
        
        <img
          src="/brand/logo-primary.png"
          alt="NEXORA Logo"
          className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_20px_rgba(45,212,191,0.5)]"
        />
      </div>

      {/* ── WORDMARK ── */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-2">
            <span className={`font-display font-black tracking-wider text-white ${textSizes[size]}`}>
              NEXORA
            </span>
            <span className={`font-mono font-bold tracking-widest text-teal-400 uppercase ${tagSizes[size]}`}>
              FIT
            </span>
          </div>
          {showTagline && (
            <span className="font-mono text-[10px] tracking-[0.2em] text-foreground/50 uppercase mt-1">
              Executive Health Architecture
            </span>
          )}
        </div>
      )}
    </div>
  )
}

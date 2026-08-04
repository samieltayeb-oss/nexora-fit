'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Dumbbell, Flame, Target } from 'lucide-react'

export function Gym3DDashboard() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="w-full h-96 rounded-3xl bg-background/40 backdrop-blur-3xl border border-white/[0.08] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.85)] relative overflow-hidden group select-none cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Photorealistic 3D Athletic Human Avatar Stage */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/artifacts/exercises/gym_avatar_3d.png" 
          alt="3D Athletic Gym Avatar"
          fill
          className={`object-cover object-center transition-transform duration-700 brightness-90 ${isHovered ? 'scale-105' : 'scale-100'}`}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-background/40" />
      </div>

      {/* Floating Holographic Target Orbit Ring (Animated Motion Layer) */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-dashed border-primary/40 rounded-full pointer-events-none shadow-[0_0_30px_rgba(0,245,212,0.2)]"
      />

      {/* Top Left Status Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="px-3.5 py-1.5 bg-background/80 border border-primary/40 text-primary text-[11px] font-black uppercase tracking-wider rounded-full backdrop-blur-xl shadow-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" /> 3D Body Target Model
        </span>
      </div>

      {/* Top Right Live Muscle Activation Pills */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-1.5">
        <span className="px-3 py-1 bg-primary/20 border border-primary/40 text-primary text-[10px] font-black rounded-full backdrop-blur-md flex items-center gap-1 shadow-md">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Chest: Activated
        </span>
        <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black rounded-full backdrop-blur-md flex items-center gap-1 shadow-md">
          <Dumbbell className="w-3.5 h-3.5 text-emerald-400" /> Quads: Activated
        </span>
      </div>

      {/* Bottom Floating Information Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10 backdrop-blur-2xl bg-background/80 p-4 rounded-2xl border border-white/10 flex justify-between items-end shadow-2xl">
        <div>
          <div className="text-[10px] font-extrabold text-foreground/70 uppercase tracking-widest flex items-center gap-1">
            <Target className="w-3 h-3 text-primary" /> Today&apos;s Muscle Focus
          </div>
          <div className="text-base font-black text-foreground tracking-tight mt-0.5 flex items-center gap-2">
            Chest & Quads <span className="text-xs text-primary font-bold px-2 py-0.5 bg-primary/10 border border-primary/30 rounded-full">RPE 5-6 Limit</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-extrabold text-foreground/70 uppercase tracking-widest">Target Weight</div>
          <div className="text-base font-black text-primary">75.0 kg Orbit Ring</div>
        </div>
      </div>
    </div>
  )
}

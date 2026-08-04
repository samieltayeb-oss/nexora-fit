'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Dumbbell, TrendingUp, HeartPulse, Menu, Sparkles, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { CinematicMeshBackground } from '@/components/motion/cinematic-mesh-background'

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#030508] text-slate-100 flex flex-col md:flex-row relative selection:bg-teal-500 selection:text-slate-950 overflow-x-hidden">
      
      {/* Cinematic Mesh, Slow Particles, Light Bloom, Noise Texture & Parallax Engine */}
      <CinematicMeshBackground />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto md:max-w-none md:ml-64 relative pb-28 md:pb-8">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Floating OLED Glass Dock Navigation */}
      <nav className="fixed bottom-4 left-4 right-4 z-50 md:hidden max-w-md mx-auto">
        <div className="bg-slate-950/85 backdrop-blur-2xl border border-white/10 rounded-full p-2 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex justify-around items-center ring-1 ring-white/5">
          <NavItem href="/dashboard" icon={<CalendarDays className="w-5 h-5" />} label="Today" />
          <NavItem href="/workout" icon={<Dumbbell className="w-5 h-5" />} label="Workout" />
          <NavItem href="/waistline" icon={<Target className="w-5 h-5" />} label="Waistline" />
          <NavItem href="/progress" icon={<TrendingUp className="w-5 h-5" />} label="Progress" />
          <NavItem href="/more" icon={<Menu className="w-5 h-5" />} label="More" />
        </div>
      </nav>

      {/* Desktop Luxury Glass Sidebar */}
      <nav className="hidden md:flex flex-col w-64 bg-slate-950/80 backdrop-blur-2xl border-r border-white/10 fixed left-0 top-0 bottom-0 z-50 p-6 space-y-8">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.08, rotate: 5 }}
            className="w-10 h-10 bg-gradient-to-tr from-teal-500 to-cyan-400 rounded-xl flex items-center justify-center text-slate-950 font-black text-xl shadow-[0_0_20px_rgba(20,184,166,0.5)] cursor-pointer"
          >
            S
          </motion.div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
              SAM FIT <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
            </h1>
            <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">Elite Health Coach</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <SidebarItem href="/dashboard" icon={<CalendarDays className="w-5 h-5" />} label="Today" />
          <SidebarItem href="/workout" icon={<Dumbbell className="w-5 h-5" />} label="Workout" />
          <SidebarItem href="/waistline" icon={<Target className="w-5 h-5" />} label="Core & Waistline" />
          <SidebarItem href="/progress" icon={<TrendingUp className="w-5 h-5" />} label="Progress" />
          <SidebarItem href="/health" icon={<HeartPulse className="w-5 h-5" />} label="Health" />
          <SidebarItem href="/more" icon={<Menu className="w-5 h-5" />} label="More" />
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-950 border border-white/5 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/20 rounded-full blur-xl pointer-events-none" />
          <div className="text-xs font-bold text-white relative z-10">Medical Clearance</div>
          <div className="text-[10px] text-teal-400 mt-0.5 flex items-center gap-1 relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" /> Active Protection
          </div>
        </div>
      </nav>
    </div>
  )
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <Link href={href} className="relative py-2 px-3 rounded-full flex flex-col items-center justify-center">
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-400/30 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.3)]" />
      )}
      <div className={`relative z-10 transition-colors ${isActive ? 'text-teal-300' : 'text-slate-400 hover:text-slate-200'}`}>
        {icon}
      </div>
      <span className={`text-[9px] font-extrabold uppercase tracking-wider mt-0.5 relative z-10 transition-colors ${isActive ? 'text-teal-300' : 'text-slate-400'}`}>
        {label}
      </span>
    </Link>
  )
}

function SidebarItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <Link href={href}>
      <div 
        className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 font-semibold text-sm ${
          isActive 
            ? 'text-teal-300 bg-gradient-to-r from-teal-500/15 to-cyan-500/15 border border-teal-400/30 shadow-[0_0_20px_rgba(20,184,166,0.2)] font-bold' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <div>{icon}</div>
        <span className="tracking-tight">{label}</span>
      </div>
    </Link>
  )
}

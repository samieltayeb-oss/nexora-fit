'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Dumbbell, TrendingUp, HeartPulse, Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '@/design/components/page-transition'
import { NexoraLogo } from '@/components/brand/nexora-logo'

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col md:flex-row relative selection:bg-[var(--accent-primary)] selection:text-slate-950 overflow-x-hidden">
      
      {/* Subtle radial bloom for premium depth */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[var(--accent-primary-glow)] blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[rgba(16,185,129,0.05)] blur-[100px]" />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full mx-auto md:ml-[96px] relative pb-[110px] md:pb-8 pt-safe px-safe">
        <div className="max-w-5xl mx-auto w-full pt-4 md:pt-10 px-4 md:px-8">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </main>

      {/* Mobile Premium Glass Dock Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-3 pb-safe pt-2 bg-gradient-to-t from-[var(--background)] via-[var(--background)] to-transparent pointer-events-none">
        <div className="glass-panel rounded-[2rem] p-1.5 flex justify-around items-center shadow-2xl pointer-events-auto mx-auto max-w-md mb-3 border border-white/10">
          <NavItem href="/dashboard" icon={<CalendarDays className="w-5 h-5" />} label="Today" />
          <NavItem href="/workout" icon={<Dumbbell className="w-5 h-5" />} label="Train" />
          <NavItem href="/progress" icon={<TrendingUp className="w-5 h-5" />} label="Progress" />
          <NavItem href="/health" icon={<HeartPulse className="w-5 h-5" />} label="Health & Meds" />
          <NavItem href="/more" icon={<Menu className="w-5 h-5" />} label="More" />
        </div>
      </nav>

      {/* Desktop Minimal Navigation Rail */}
      <nav className="hidden md:flex flex-col w-[96px] glass-panel border-r border-[var(--surface-border)] fixed left-0 top-0 bottom-0 z-50 py-7 items-center justify-between">
        <div className="flex flex-col items-center gap-10">
          {/* Logo / Avatar */}
          <Link href="/dashboard">
            <motion.div 
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
            >
              <NexoraLogo size="lg" showWordmark={false} />
            </motion.div>
          </Link>

          {/* Main Links */}
          <div className="flex flex-col gap-6">
            <SidebarRailItem href="/dashboard" icon={<CalendarDays className="w-6 h-6" />} label="Today" />
            <SidebarRailItem href="/workout" icon={<Dumbbell className="w-6 h-6" />} label="Train" />
            <SidebarRailItem href="/progress" icon={<TrendingUp className="w-6 h-6" />} label="Progress" />
            <SidebarRailItem href="/health" icon={<HeartPulse className="w-6 h-6" />} label="Health & Meds" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <SidebarRailItem href="/more" icon={<Menu className="w-6 h-6" />} label="More" />
        </div>
      </nav>
    </div>
  )
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <Link href={href} className="relative flex-1 py-3 px-1 rounded-full flex flex-col items-center justify-center group active:scale-95 transition-transform min-h-[48px]">
      {isActive && (
        <motion.div 
          layoutId="mobile-nav-indicator"
          className="absolute inset-0 bg-white/10 rounded-full" 
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      )}
      <div className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-[var(--accent-primary)]' : 'text-slate-400 group-hover:text-foreground/90'}`}>
        {icon}
      </div>
      <span className={`text-[9px] sm:text-[10px] font-bold mt-1 relative z-10 transition-colors duration-300 text-center leading-tight whitespace-nowrap ${isActive ? 'text-[var(--foreground)]' : 'text-slate-400'}`}>
        {label}
      </span>
    </Link>
  )
}

function SidebarRailItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <Link href={href} className="group flex flex-col items-center gap-1.5 relative">
      <div 
        className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          isActive 
            ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] shadow-[inset_0_0_0_1px_var(--accent-primary-glow)] ring-2 ring-teal-500/20' 
            : 'text-slate-400 hover:text-foreground hover:bg-white/5'
        }`}
      >
        {icon}
      </div>
      <span className={`text-[10px] font-bold transition-colors text-center ${isActive ? 'text-teal-300' : 'text-slate-400'}`}>
        {label}
      </span>
    </Link>
  )
}


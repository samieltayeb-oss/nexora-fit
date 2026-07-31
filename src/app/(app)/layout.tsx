import { ReactNode } from 'react'
import Link from 'next/link'
import { CalendarDays, Dumbbell, TrendingUp, HeartPulse, Menu } from 'lucide-react'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col pb-20 md:pb-0 md:flex-row">
      <main className="flex-1 w-full max-w-lg mx-auto md:max-w-none md:ml-64 relative pb-safe">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800 z-50 md:hidden pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          <NavItem href="/dashboard" icon={<CalendarDays className="w-6 h-6" />} label="Today" />
          <NavItem href="/workout" icon={<Dumbbell className="w-6 h-6" />} label="Workout" />
          <NavItem href="/progress" icon={<TrendingUp className="w-6 h-6" />} label="Progress" />
          <NavItem href="/health" icon={<HeartPulse className="w-6 h-6" />} label="Health" />
          <NavItem href="/more" icon={<Menu className="w-6 h-6" />} label="More" />
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 fixed left-0 top-0 bottom-0 z-50">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">SAM FIT</h1>
        </div>
        <div className="flex-1 flex flex-col gap-2 px-4">
          <SidebarItem href="/dashboard" icon={<CalendarDays className="w-5 h-5" />} label="Today" />
          <SidebarItem href="/workout" icon={<Dumbbell className="w-5 h-5" />} label="Workout" />
          <SidebarItem href="/progress" icon={<TrendingUp className="w-5 h-5" />} label="Progress" />
          <SidebarItem href="/health" icon={<HeartPulse className="w-5 h-5" />} label="Health" />
          <SidebarItem href="/more" icon={<Menu className="w-5 h-5" />} label="More" />
        </div>
      </nav>
    </div>
  )
}

function NavItem({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-teal-400 transition-colors">
      <div className="mb-1">{icon}</div>
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  )
}

function SidebarItem({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-teal-400 hover:bg-slate-800/50 transition-colors">
      <div>{icon}</div>
      <span className="font-medium">{label}</span>
    </Link>
  )
}

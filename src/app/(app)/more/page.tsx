'use client'

import Link from 'next/link'
import { 
  User, 
  Settings, 
  ShieldCheck, 
  HelpCircle, 
  LogOut, 
  Smartphone, 
  ChevronRight, 
  Sparkles, 
  Bell, 
  Dumbbell, 
  ExternalLink,
  Watch
} from 'lucide-react'

export default function MorePage() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-2xl mx-auto text-slate-100 font-sans pb-24 md:pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            More <Sparkles className="w-6 h-6 text-teal-400 animate-pulse" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">App settings, Apple Watch connection & profile</p>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-teal-500 to-cyan-400 rounded-2xl flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-teal-500/20">
            S
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white tracking-tight">Sami El-Tayeb</h2>
            <p className="text-xs text-slate-400 mt-0.5">sami.eltayeb@gmail.com</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 border border-teal-500/30 rounded-full text-[11px] font-semibold text-teal-400 mt-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Medical Safety Cleared
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Integrations & Hardware */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Hardware & Sync</h3>
        
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md divide-y divide-slate-800/60">
          <MenuLink 
            href="/dashboard"
            icon={<Watch className="w-5 h-5 text-rose-400" />}
            title="Apple Watch Auto-Sync"
            subtitle="Configured via iOS Shortcuts • Active"
            badge="Connected"
          />
          <MenuLink 
            href="/admin/exercises"
            icon={<Dumbbell className="w-5 h-5 text-teal-400" />}
            title="Exercise Visuals Admin"
            subtitle="Inspect photorealistic 24-image library & prompts"
          />
        </div>
      </div>

      {/* Section 2: Account & Settings */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Settings & Preferences</h3>
        
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md divide-y divide-slate-800/60">
          <MenuLink 
            href="/onboarding"
            icon={<User className="w-5 h-5 text-amber-400" />}
            title="Fitness Profile & Goal Weight"
            subtitle="81.05 kg → 75.0 kg target • 3 days/week"
          />
          <MenuLink 
            href="#"
            icon={<Bell className="w-5 h-5 text-indigo-400" />}
            title="Workout Reminders"
            subtitle="Scheduled for 8:00 AM Mon / Wed / Fri"
          />
          <MenuLink 
            href="#"
            icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
            title="Medical Clearance & BP Limits"
            subtitle="RPE 5-6 cap • Safety Abort Active"
          />
        </div>
      </div>

      {/* Section 3: Support & Web App Info */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Support & Application</h3>
        
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md divide-y divide-slate-800/60">
          <MenuLink 
            href="https://sam-fit-five.vercel.app"
            external
            icon={<Smartphone className="w-5 h-5 text-cyan-400" />}
            title="Production Deployment"
            subtitle="sam-fit-five.vercel.app"
          />
          <MenuLink 
            href="#"
            icon={<HelpCircle className="w-5 h-5 text-slate-400" />}
            title="Help & Exercise Guide"
            subtitle="Step-by-step gym machine tutorial"
          />
        </div>
      </div>

      {/* Logout Button */}
      <form action="/auth/signout" method="post">
        <button 
          type="submit"
          className="w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.99]"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 font-medium">
        SAM FIT v1.0.0 • Production Build
      </p>
    </div>
  )
}

function MenuLink({ 
  href, 
  icon, 
  title, 
  subtitle, 
  badge,
  external 
}: { 
  href: string
  icon: React.ReactNode
  title: string
  subtitle: string
  badge?: string
  external?: boolean 
}) {
  const content = (
    <div className="p-4 flex items-center gap-4 hover:bg-slate-800/40 transition-colors group cursor-pointer">
      <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl group-hover:border-teal-500/40 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-teal-400 transition-colors">{title}</h4>
          {badge && (
            <span className="px-2 py-0.5 bg-teal-500/20 border border-teal-500/30 text-teal-400 text-[10px] font-bold rounded-full">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 truncate mt-0.5">{subtitle}</p>
      </div>
      {external ? (
        <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
      ) : (
        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
      )}
    </div>
  )

  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer">{content}</a>
  }

  return <Link href={href}>{content}</Link>
}

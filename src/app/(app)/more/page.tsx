'use client'

import { useState } from 'react'
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
  Watch,
  X,
  Check,
  Heart,
  Scale,
  Flame,
  Pill
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { NexoraLogo } from '@/components/brand/nexora-logo'

export default function MorePage() {
  const [showRemindersModal, setShowRemindersModal] = useState(false)
  const [showMedicalModal, setShowMedicalModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const [reminderTime, setReminderTime] = useState('07:00')
  const [reminderDays, setReminderDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
  const [reminderSaved, setReminderSaved] = useState(false)

  const handleSaveReminders = (e: React.FormEvent) => {
    e.preventDefault()
    setReminderSaved(true)
    setTimeout(() => {
      setReminderSaved(false)
      setShowRemindersModal(false)
    }, 1200)
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-2xl mx-auto text-foreground font-sans pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <NexoraLogo size="sm" showWordmark={true} />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            Executive Profile & Settings
          </h1>
          <p className="text-foreground/70 text-sm">Clinical preferences, hardware sync & account telemetry</p>
        </div>
      </div>

      {/* User Profile Card — SAMI SULIMAN */}
      <div className="bg-gradient-to-br from-[#0c1417] via-[#0d1618] to-[#080d0f] border border-teal-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-teal-500/10 blur-[60px] pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-teal-500/50 shadow-xl shadow-teal-500/30 flex-shrink-0 bg-slate-900">
            <img 
              src="/brand/owner.png" 
              alt="Sami Suliman" 
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">Sami Suliman</h2>
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                Primary Account
              </span>
            </div>
            <p className="text-xs text-foreground/70 mt-0.5">sami.suliman@gmail.com</p>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/15 border border-teal-500/40 rounded-full text-[10px] font-bold text-teal-300">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> Diabetic Type 2 Management
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/40 rounded-full text-[10px] font-bold text-amber-300">
                <Scale className="w-3.5 h-3.5 text-amber-400" /> 82.70 kg → 75.0 kg Target
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Integrations & Hardware */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-foreground/70 uppercase tracking-wider px-1">Hardware & Biometrics</h3>
        
        <div className="bg-background/90 border border-border rounded-3xl overflow-hidden shadow-xl backdrop-blur-md divide-y divide-border/60">
          <MenuLink 
            href="/health"
            icon={<Watch className="w-5 h-5 text-rose-400" />}
            title="Apple Watch & HealthKit"
            subtitle="Live HR & active caloric burn sync • Active"
            badge="Connected"
          />
          <MenuLink 
            href="/admin/exercises"
            icon={<Dumbbell className="w-5 h-5 text-primary" />}
            title="Exercise Visuals & Library Admin"
            subtitle="Inspect animated keyframes & form library"
          />
        </div>
      </div>

      {/* Section 2: Account & Settings */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-foreground/70 uppercase tracking-wider px-1">Clinical Settings & Reminders</h3>
        
        <div className="bg-background/90 border border-border rounded-3xl overflow-hidden shadow-xl backdrop-blur-md divide-y divide-border/60">
          <MenuLink 
            href="/onboarding"
            icon={<User className="w-5 h-5 text-amber-400" />}
            title="Fitness Profile & Weight Trajectory"
            subtitle="Sami Suliman • 82.70 kg VeSync baseline • 75.0 kg goal"
          />
          <MenuLink 
            href="/health"
            icon={<Pill className="w-5 h-5 text-teal-400" />}
            title="Prescriptions & Clinical Supplements"
            subtitle="Ozempic, Dapagliflozin, Ramipril, Aspirin, Statin, Supplements"
            badge="Netcare"
          />
          <div onClick={() => setShowRemindersModal(true)} className="cursor-pointer">
            <MenuLinkItem 
              icon={<Bell className="w-5 h-5 text-indigo-400" />}
              title="Daily Morning Challenge Alarm"
              subtitle="7:00 AM Daily 15-min notification"
            />
          </div>
          <div onClick={() => setShowMedicalModal(true)} className="cursor-pointer">
            <MenuLinkItem 
              icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
              title="Type 2 Diabetes Safety Limits"
              subtitle="RPE 5-6 cap • Valsalva prevention active"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Support & Web App Info */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-foreground/70 uppercase tracking-wider px-1">Support & Guide</h3>
        
        <div className="bg-background/90 border border-border rounded-3xl overflow-hidden shadow-xl backdrop-blur-md divide-y divide-border/60">
          <MenuLink 
            href="https://nexora-fit.vercel.app"
            external
            icon={<Smartphone className="w-5 h-5 text-cyan-400" />}
            title="Production Deployment"
            subtitle="nexora-fit.vercel.app"
          />
          <div onClick={() => setShowHelpModal(true)} className="cursor-pointer">
            <MenuLinkItem 
              icon={<HelpCircle className="w-5 h-5 text-foreground/70" />}
              title="Sets × Reps Guide & Exercise Tutorial"
              subtitle="Understanding 3×20, 3×15, and rest intervals"
            />
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <form action="/auth/signout" method="post">
        <button 
          type="submit"
          className="w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.99] cursor-pointer"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </form>

      <p className="text-center text-xs text-foreground/40 font-medium">
        NEXORA FIT • Executive Longevity Platform v2.0
      </p>

      {/* ── MODAL 1: WORKOUT REMINDERS ────────────────────────────────────── */}
      <AnimatePresence>
        {showRemindersModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowRemindersModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-[101] w-full max-w-md bg-[#0f1115] border border-indigo-500/40 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Morning Workout Reminder</h3>
                    <p className="text-xs text-foreground/60">Schedule your 15-minute challenge</p>
                  </div>
                </div>
                <button onClick={() => setShowRemindersModal(false)} className="text-white/60 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveReminders} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/70 mb-1">
                    Reminder Time
                  </label>
                  <input 
                    type="time" 
                    value={reminderTime}
                    onChange={e => setReminderTime(e.target.value)}
                    className="w-full bg-black/60 border border-border/80 rounded-xl p-3 text-xl font-bold text-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/70 mb-1">
                    Frequency
                  </label>
                  <div className="flex items-center gap-1.5 justify-between">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                      const isSel = reminderDays.includes(day)
                      return (
                        <button
                          type="button"
                          key={day}
                          onClick={() => {
                            setReminderDays(
                              isSel ? reminderDays.filter(d => d !== day) : [...reminderDays, day]
                            )
                          }}
                          className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all ${
                            isSel 
                              ? 'bg-indigo-500 text-white border-indigo-400' 
                              : 'bg-white/[0.03] border-white/10 text-foreground/50'
                          }`}
                        >
                          {day.slice(0, 1)}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-sm shadow-lg hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {reminderSaved ? <><Check className="w-4 h-4" /> Reminder Saved!</> : 'Save Reminder Schedule'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 2: MEDICAL LIMITS ───────────────────────────────────────── */}
      <AnimatePresence>
        {showMedicalModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowMedicalModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-[101] w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#0f1115] border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Type 2 Diabetes Safety Limits</h3>
                    <p className="text-xs text-foreground/60">Sami Suliman • Clinical Safeguards</p>
                  </div>
                </div>
                <button onClick={() => setShowMedicalModal(false)} className="text-white/60 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-foreground/80 leading-relaxed">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                  <div className="font-bold text-white mb-1">RPE 5–6 Max Intensity</div>
                  <p className="text-foreground/70">
                    Never train to exhaustion. Calisthenics movements are calibrated for continuous nasal/rhythmic breathing.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                  <div className="font-bold text-white mb-1">Target Glycemic Window</div>
                  <p className="text-foreground/70">
                    Fasting glucose target is 80–130 mg/dL. Morning exercise pulls glucose into muscle cells via GLUT-4 transporters.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                  <div className="font-bold text-white mb-1">Blood Pressure Safety Abort</div>
                  <p className="text-foreground/70">
                    If resting BP exceeds 160/100 mmHg, take a rest day with gentle walking instead of resistance training.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowMedicalModal(false)}
                className="w-full py-3 rounded-xl bg-emerald-500 text-black font-black text-xs hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                Close Settings
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 3: HELP & SETS X REPS GUIDE ──────────────────────────────── */}
      <AnimatePresence>
        {showHelpModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowHelpModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-[101] w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#0f1115] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">How Training Notation Works</h3>
                    <p className="text-xs text-foreground/60">Understanding Sets × Reps formula</p>
                  </div>
                </div>
                <button onClick={() => setShowHelpModal(false)} className="text-white/60 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <div className="font-bold text-amber-300 text-sm mb-1">The Formula: Sets × Reps</div>
                  <p className="text-foreground/80">
                    • <strong>Rep (Repetition)</strong> = Doing the exercise 1 time.<br />
                    • <strong>Set</strong> = A group/round of reps before resting.<br />
                    • <strong>Rest</strong> = 30 to 45 seconds of recovery between sets.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                  <div className="font-bold text-white mb-1">Example: 3 × 20 Jumping Jacks</div>
                  <p className="text-foreground/70">
                    Do 20 jumping jacks $\rightarrow$ Rest 30s $\rightarrow$ Do 20 $\rightarrow$ Rest 30s $\rightarrow$ Do 20 $\rightarrow$ Finished!
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                  <div className="font-bold text-white mb-1">Example: 2 × 10 Wall Push-Ups</div>
                  <p className="text-foreground/70">
                    Do 10 wall push-ups $\rightarrow$ Rest 30s $\rightarrow$ Do 10 wall push-ups $\rightarrow$ Finished!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full py-3.5 rounded-xl bg-amber-500 text-black font-black text-xs hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Got It!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
    <div className="p-4 flex items-center gap-4 hover:bg-white/[0.03] transition-colors group cursor-pointer">
      <div className="p-3 bg-background border border-border rounded-2xl group-hover:border-primary/40 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">{title}</h4>
          {badge && (
            <span className="px-2 py-0.5 bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold rounded-full">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-foreground/70 truncate mt-0.5">{subtitle}</p>
      </div>
      {external ? (
        <ExternalLink className="w-4 h-4 text-foreground/40 group-hover:text-primary transition-colors" />
      ) : (
        <ChevronRight className="w-5 h-5 text-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      )}
    </div>
  )

  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer">{content}</a>
  }

  return <Link href={href}>{content}</Link>
}

function MenuLinkItem({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <div className="p-4 flex items-center gap-4 hover:bg-white/[0.03] transition-colors group">
      <div className="p-3 bg-background border border-border rounded-2xl group-hover:border-primary/40 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-xs text-foreground/70 truncate mt-0.5">{subtitle}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
    </div>
  )
}


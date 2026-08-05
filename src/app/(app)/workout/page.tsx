'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Dumbbell, PersonStanding, ChevronRight, Flame, Clock, Trophy, Star } from 'lucide-react'
import { Card, CardContent } from '@/design/components/card'

export default function WorkoutHubPage() {
  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="px-5 pb-6 pt-10">
        <p className="mb-1 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-primary">NEXORA FIT</p>
        <h1 className="font-display text-3xl font-black leading-tight tracking-tight text-foreground">
          Choose Your<br />
          <span className="text-primary">Training Style</span>
        </h1>
        <p className="mt-2 text-sm font-medium text-foreground/70">Two complete 28-day transformation programs</p>
      </div>

      {/* Program Cards */}
      <div className="space-y-4 px-5">

        {/* Gym Machine Workout */}
        <Link href="/workout/program?type=gym">
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="group relative overflow-hidden rounded-3xl border border-border-subtle bg-surface shadow-sm transition-shadow duration-500 hover:shadow-[0_0_30px_var(--color-primary)]"
            style={{ minHeight: 200 }}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src="/artifacts/exercises/chest_press_illustrated.jpg"
                alt="Gym Workout"
                className="h-full w-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-surface/95 via-surface/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-xl border border-primary/40 bg-primary/20 p-2">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <span className="font-mono text-[10px] font-black uppercase tracking-[0.15em] text-primary">Machine Training</span>
              </div>

              <h2 className="mb-1 font-display text-2xl font-black tracking-tight text-foreground">GYM STRENGTH<br />CHALLENGE</h2>
              <p className="mb-4 text-xs font-medium text-foreground/90">Leg Press · Chest Press · Lat Pulldown · Seated Row · and more</p>

              <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground/90">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  35–50 min / session
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground/90">
                  <Flame className="h-3.5 w-3.5 text-warning" />
                  180–270 cal
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground/90">
                  <Trophy className="h-3.5 w-3.5 text-primary" />
                  28 Days
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 overflow-hidden rounded-full bg-surface-elevated h-1.5">
                  <div className="h-full w-[4%] rounded-full bg-primary" />
                </div>
                <span className="text-[10px] font-bold text-foreground/70">1 / 28 done</span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-1">
                  {['Beginner', 'Gym', 'Machine'].map(tag => (
                    <span key={tag} className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[9px] font-black text-primary">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-black text-background shadow-lg">
                  Start <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Calisthenics / Bodyweight */}
        <Link href="/workout/program?type=calisthenics">
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="group relative overflow-hidden rounded-3xl border border-border-subtle bg-surface shadow-sm transition-shadow duration-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]"
            style={{ minHeight: 200 }}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src="/artifacts/exercises/pushup_illustrated.jpg"
                alt="Calisthenics"
                className="h-full w-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-surface/95 via-surface/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-xl border border-success/40 bg-success/20 p-2">
                  <PersonStanding className="h-5 w-5 text-success" />
                </div>
                <span className="font-mono text-[10px] font-black uppercase tracking-[0.15em] text-success">Bodyweight</span>
              </div>

              <h2 className="mb-1 font-display text-2xl font-black tracking-tight text-foreground">CALISTHENICS<br />CHALLENGE</h2>
              <p className="mb-4 text-xs font-medium text-foreground/90">Push-Ups · Planks · Burpees · Mountain Climbers · Lunges · and more</p>

              <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground/90">
                  <Clock className="h-3.5 w-3.5 text-success" />
                  15–30 min / day
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground/90">
                  <Flame className="h-3.5 w-3.5 text-warning" />
                  120–200 cal
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground/90">
                  <Trophy className="h-3.5 w-3.5 text-success" />
                  28 Days
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 overflow-hidden rounded-full bg-surface-elevated h-1.5">
                  <div className="h-full w-0 rounded-full bg-success" />
                </div>
                <span className="text-[10px] font-bold text-foreground/70">0 / 28 done</span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-1">
                  {['No Equipment', 'Home', 'Outdoor'].map(tag => (
                    <span key={tag} className="rounded-full border border-success/20 bg-success/10 px-2 py-0.5 text-[9px] font-black text-success">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-success px-4 py-2 text-xs font-black text-background shadow-lg">
                  Start <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Quick Stats */}
        <div className="mt-2 grid grid-cols-3 gap-3">
          <Card className="cursor-pointer transition-colors hover:bg-surface-elevated">
            <CardContent className="p-4 text-center">
              <div className="font-display text-xl font-black text-primary">56</div>
              <div className="mt-0.5 font-mono text-[10px] font-bold text-foreground/70">Total Days</div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer transition-colors hover:bg-surface-elevated">
            <CardContent className="p-4 text-center">
              <div className="font-display text-xl font-black text-primary">22</div>
              <div className="mt-0.5 font-mono text-[10px] font-bold text-foreground/70">Exercises</div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer transition-colors hover:bg-surface-elevated">
            <CardContent className="p-4 text-center">
              <div className="font-display text-xl font-black text-primary">
                <Star className="mx-auto h-5 w-5 fill-primary drop-shadow-[0_0_8px_var(--color-primary)]" />
              </div>
              <div className="mt-0.5 font-mono text-[10px] font-bold text-foreground/70">Premium</div>
            </CardContent>
          </Card>
        </div>

        {/* Exercise Library Link */}
        <Link href="/workout/library">
          <Card className="group cursor-pointer transition-colors hover:bg-surface-elevated">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-surface-elevated p-2.5 transition-colors group-hover:bg-primary/20">
                  <Dumbbell className="h-4 w-4 text-foreground/90 transition-colors group-hover:text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">Exercise Library</div>
                  <div className="text-[11px] font-medium text-foreground/70">Form guides · Machine setup · Tips</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-foreground/50 transition-colors group-hover:text-primary" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

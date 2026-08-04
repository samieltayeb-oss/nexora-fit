'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, CheckCircle, ChevronLeft, Play, Flame, Clock, Trophy, Target, Dumbbell, PersonStanding } from 'lucide-react'

// ─────────────────────────────────────────────
// WEEK STRUCTURES
// ─────────────────────────────────────────────
const WEEKS = [
  { week: 1, label: 'WEEK 1 — FEEL IT',           subtitle: 'Build the habit. Learn the movements.', gymColor: '#14b8a6', caliColor: '#6366f1' },
  { week: 2, label: 'WEEK 2 — SEE IT',            subtitle: 'Form locks in. Strength begins.',        gymColor: '#6366f1', caliColor: '#8b5cf6' },
  { week: 3, label: 'WEEK 3 — PEOPLE NOTICE',     subtitle: 'Your body is visibly changing.',         gymColor: '#f59e0b', caliColor: '#ec4899' },
  { week: 4, label: 'WEEK 4 — GOALS EXCEEDED',    subtitle: "You've transformed. Now level up.",      gymColor: '#ef4444', caliColor: '#f97316' },
]

// ─────────────────────────────────────────────
// GYM PROGRAM (28 days)
// ─────────────────────────────────────────────
const GYM_DAYS = [
  // Week 1
  { day:1,  title:'Full Body Foundation', focus:'Legs & Chest',          duration:'35 min', calories:180, thumb:'/artifacts/exercises/leg_press_illustrated.jpg',       week:1, isRest:false },
  { day:2,  title:'Active Recovery',      focus:'Cardio & Mobility',     duration:'20 min', calories:90,  thumb:'/artifacts/exercises/recumbent_bike_illustrated.jpg',  week:1, isRest:false },
  { day:3,  title:'Push & Pull',          focus:'Back & Shoulders',      duration:'40 min', calories:200, thumb:'/artifacts/exercises/lat_pulldown_illustrated.jpg',    week:1, isRest:false },
  { day:4,  title:'Rest Day',             focus:'Recovery',              duration:'—',      calories:0,   thumb:'/artifacts/exercises/hip_mobility_illustrated.jpg',    week:1, isRest:true  },
  { day:5,  title:'Lower Body Strength',  focus:'Quads & Hamstrings',    duration:'38 min', calories:190, thumb:'/artifacts/exercises/leg_extension_illustrated.jpg',   week:1, isRest:false },
  { day:6,  title:'Upper Body Endurance', focus:'Chest & Triceps',       duration:'35 min', calories:175, thumb:'/artifacts/exercises/chest_press_illustrated.jpg',     week:1, isRest:false },
  { day:7,  title:'Rest & Restore',       focus:'Full Rest',             duration:'—',      calories:0,   thumb:'/artifacts/exercises/hip_mobility_illustrated.jpg',    week:1, isRest:true  },
  // Week 2
  { day:8,  title:'Power Legs',           focus:'Compound Lower',        duration:'42 min', calories:220, thumb:'/artifacts/exercises/leg_press_illustrated.jpg',       week:2, isRest:false },
  { day:9,  title:'Core & Cardio',        focus:'Fat Burn',              duration:'30 min', calories:150, thumb:'/artifacts/exercises/recumbent_bike_illustrated.jpg',  week:2, isRest:false },
  { day:10, title:'Back Dominator',       focus:'Lats & Rhomboids',      duration:'40 min', calories:205, thumb:'/artifacts/exercises/seated_row_illustrated.jpg',      week:2, isRest:false },
  { day:11, title:'Active Recovery',      focus:'Stretch & Mobility',    duration:'25 min', calories:80,  thumb:'/artifacts/exercises/hip_mobility_illustrated.jpg',    week:2, isRest:false },
  { day:12, title:'Leg Isolation',        focus:'Quads & Hamstrings',    duration:'38 min', calories:195, thumb:'/artifacts/exercises/leg_curl_illustrated.jpg',        week:2, isRest:false },
  { day:13, title:'Push Power',           focus:'Chest & Shoulders',     duration:'40 min', calories:210, thumb:'/artifacts/exercises/shoulder_press_illustrated.jpg',  week:2, isRest:false },
  { day:14, title:'Rest & Restore',       focus:'Full Rest',             duration:'—',      calories:0,   thumb:'/artifacts/exercises/hip_mobility_illustrated.jpg',    week:2, isRest:true  },
  // Week 3
  { day:15, title:'Strength Circuit',     focus:'Full Body',             duration:'45 min', calories:240, thumb:'/artifacts/exercises/chest_press_illustrated.jpg',     week:3, isRest:false },
  { day:16, title:'Cardio Blast',         focus:'LISS Cardio',           duration:'30 min', calories:160, thumb:'/artifacts/exercises/recumbent_bike_illustrated.jpg',  week:3, isRest:false },
  { day:17, title:'Pull Compound',        focus:'Back & Biceps',         duration:'42 min', calories:215, thumb:'/artifacts/exercises/lat_pulldown_illustrated.jpg',    week:3, isRest:false },
  { day:18, title:'Active Recovery',      focus:'Mobility & Core',       duration:'25 min', calories:90,  thumb:'/artifacts/exercises/hip_mobility_illustrated.jpg',    week:3, isRest:false },
  { day:19, title:'Leg Strength+',        focus:'Quads & Glutes',        duration:'45 min', calories:230, thumb:'/artifacts/exercises/leg_press_illustrated.jpg',       week:3, isRest:false },
  { day:20, title:'Upper Body Peak',      focus:'Chest, Shoulders, Tris',duration:'45 min', calories:225, thumb:'/artifacts/exercises/cable_fly_illustrated.jpg',       week:3, isRest:false },
  { day:21, title:'Rest & Restore',       focus:'Full Rest',             duration:'—',      calories:0,   thumb:'/artifacts/exercises/hip_mobility_illustrated.jpg',    week:3, isRest:true  },
  // Week 4
  { day:22, title:'Power Full Body',      focus:'Max Effort',            duration:'50 min', calories:270, thumb:'/artifacts/exercises/leg_extension_illustrated.jpg',   week:4, isRest:false },
  { day:23, title:'Cardio & Core',        focus:'Fat Burn',              duration:'35 min', calories:180, thumb:'/artifacts/exercises/recumbent_bike_illustrated.jpg',  week:4, isRest:false },
  { day:24, title:'Back & Bicep Max',     focus:'Pull Day',              duration:'45 min', calories:235, thumb:'/artifacts/exercises/seated_row_illustrated.jpg',      week:4, isRest:false },
  { day:25, title:'Active Recovery',      focus:'Light & Easy',          duration:'25 min', calories:80,  thumb:'/artifacts/exercises/hip_mobility_illustrated.jpg',    week:4, isRest:false },
  { day:26, title:'Leg Final Test',       focus:'All Leg Muscles',       duration:'48 min', calories:250, thumb:'/artifacts/exercises/leg_curl_illustrated.jpg',        week:4, isRest:false },
  { day:27, title:'Upper Body Final',     focus:'Push & Fly',            duration:'48 min', calories:245, thumb:'/artifacts/exercises/chest_press_illustrated.jpg',     week:4, isRest:false },
  { day:28, title:'🏆 Final Challenge',  focus:'Full Body Test',        duration:'55 min', calories:290, thumb:'/artifacts/exercises/leg_press_illustrated.jpg',       week:4, isRest:false },
]

// ─────────────────────────────────────────────
// CALISTHENICS PROGRAM (28 days)
// ─────────────────────────────────────────────
const CALI_DAYS = [
  // Week 1
  { day:1,  title:'Day 1 — Begin',        focus:'Jumping Jacks + Squats',  sets:'2×20 + 2×15',duration:'15 min', calories:120, thumb:'/artifacts/exercises/jumping_jack_illustrated.jpg',    week:1, isRest:false },
  { day:2,  title:'Push Day',             focus:'Push-Ups',                sets:'2×10',        duration:'20 min', calories:130, thumb:'/artifacts/exercises/pushup_illustrated.jpg',           week:1, isRest:false },
  { day:3,  title:'Core Intro',           focus:'Planks + Crunches',       sets:'2×30s + 2×15',duration:'20 min', calories:110, thumb:'/artifacts/exercises/plank_illustrated.jpg',            week:1, isRest:false },
  { day:4,  title:'Rest Day',             focus:'Recovery',                sets:'—',           duration:'—',      calories:0,   thumb:'/artifacts/exercises/lunge_illustrated.jpg',            week:1, isRest:true  },
  { day:5,  title:'Leg Power',            focus:'Squats + Lunges',         sets:'3×15 + 2×12', duration:'22 min', calories:145, thumb:'/artifacts/exercises/squat_illustrated.jpg',            week:1, isRest:false },
  { day:6,  title:'Cardio Burn',          focus:'High Knees + Mountain Climbers', sets:'3×30 + 2×20', duration:'20 min', calories:160, thumb:'/artifacts/exercises/high_knees_illustrated.jpg', week:1, isRest:false },
  { day:7,  title:'Rest & Restore',       focus:'Full Rest',               sets:'—',           duration:'—',      calories:0,   thumb:'/artifacts/exercises/plank_illustrated.jpg',            week:1, isRest:true  },
  // Week 2
  { day:8,  title:'Push Power',           focus:'Push-Ups + Dips',         sets:'3×12 + 2×10', duration:'25 min', calories:150, thumb:'/artifacts/exercises/pushup_illustrated.jpg',           week:2, isRest:false },
  { day:9,  title:'Core Blast',           focus:'Crunches + Mountain Climbers', sets:'3×20 + 2×30', duration:'25 min', calories:155, thumb:'/artifacts/exercises/mountain_climbers_illustrated.jpg', week:2, isRest:false },
  { day:10, title:'Lower Body',           focus:'Squats + Lunges',         sets:'3×20 + 3×15', duration:'28 min', calories:165, thumb:'/artifacts/exercises/lunge_illustrated.jpg',            week:2, isRest:false },
  { day:11, title:'Active Rest',          focus:'Light Stretching',        sets:'—',           duration:'20 min', calories:60,  thumb:'/artifacts/exercises/hip_mobility_illustrated.jpg',     week:2, isRest:false },
  { day:12, title:'Full Body HIIT',       focus:'Burpees + Jumping Jacks', sets:'3×10 + 3×30', duration:'25 min', calories:180, thumb:'/artifacts/exercises/burpee_illustrated.jpg',           week:2, isRest:false },
  { day:13, title:'Back & Core',          focus:'Superman + Plank',        sets:'3×20 + 3×40s',duration:'25 min', calories:140, thumb:'/artifacts/exercises/superman_illustrated.jpg',         week:2, isRest:false },
  { day:14, title:'Rest & Restore',       focus:'Full Rest',               sets:'—',           duration:'—',      calories:0,   thumb:'/artifacts/exercises/plank_illustrated.jpg',            week:2, isRest:true  },
  // Week 3
  { day:15, title:'Push Circuit',         focus:'Push-Ups + Mountain Climbers', sets:'3×15 + 3×20', duration:'28 min', calories:165, thumb:'/artifacts/exercises/pushup_illustrated.jpg', week:3, isRest:false },
  { day:16, title:'Leg Burner',           focus:'Squats + Lunges + Jumps', sets:'3×25 + 2×20 + 2×15', duration:'30 min', calories:190, thumb:'/artifacts/exercises/squat_illustrated.jpg', week:3, isRest:false },
  { day:17, title:'Core & Back',          focus:'Superman + Crunches',     sets:'3×25 + 3×20', duration:'25 min', calories:145, thumb:'/artifacts/exercises/superman_illustrated.jpg',         week:3, isRest:false },
  { day:18, title:'Active Recovery',      focus:'Light Cardio',            sets:'—',           duration:'20 min', calories:70,  thumb:'/artifacts/exercises/high_knees_illustrated.jpg',       week:3, isRest:false },
  { day:19, title:'HIIT Blast',           focus:'Burpees + High Knees',   sets:'3×15 + 3×30', duration:'28 min', calories:200, thumb:'/artifacts/exercises/burpee_illustrated.jpg',           week:3, isRest:false },
  { day:20, title:'Full Push Day',        focus:'Push-Ups + Dips + Plank', sets:'3×20 + 2×15 + 3×45s', duration:'30 min', calories:175, thumb:'/artifacts/exercises/plank_illustrated.jpg', week:3, isRest:false },
  { day:21, title:'Rest & Restore',       focus:'Full Rest',               sets:'—',           duration:'—',      calories:0,   thumb:'/artifacts/exercises/lunge_illustrated.jpg',            week:3, isRest:true  },
  // Week 4
  { day:22, title:'Power Circuit',        focus:'Full Body Max',           sets:'3×25 + 2×35 + 2×15', duration:'35 min', calories:220, thumb:'/artifacts/exercises/mountain_climbers_illustrated.jpg', week:4, isRest:false },
  { day:23, title:'Leg Dominator',        focus:'Squats + Lunges + Jumps', sets:'4×25 + 3×20', duration:'35 min', calories:210, thumb:'/artifacts/exercises/squat_illustrated.jpg',            week:4, isRest:false },
  { day:24, title:'Core Max',             focus:'Plank + Crunches + Mountain Climbers', sets:'4×60s + 4×25 + 3×30', duration:'30 min', calories:185, thumb:'/artifacts/exercises/crunch_illustrated.jpg', week:4, isRest:false },
  { day:25, title:'Active Recovery',      focus:'Easy Walk + Stretching',  sets:'—',           duration:'20 min', calories:70,  thumb:'/artifacts/exercises/hip_mobility_illustrated.jpg',     week:4, isRest:false },
  { day:26, title:'HIIT Final',           focus:'Burpees + High Knees + Jumps', sets:'4×15 + 4×30', duration:'35 min', calories:240, thumb:'/artifacts/exercises/burpee_illustrated.jpg', week:4, isRest:false },
  { day:27, title:'Upper Body Final',     focus:'Push-Ups + Superman + Plank', sets:'4×20 + 4×25 + 4×60s', duration:'35 min', calories:200, thumb:'/artifacts/exercises/superman_illustrated.jpg', week:4, isRest:false },
  { day:28, title:'🏆 Day 28 — DONE',    focus:'Full Body Challenge',     sets:'Max effort — all exercises', duration:'40 min', calories:260, thumb:'/artifacts/exercises/pushup_illustrated.jpg', week:4, isRest:false },
]

const GYM_COMPLETED = [1]
const GYM_CURRENT   = 2
const CALI_COMPLETED: number[] = []
const CALI_CURRENT  = 1

export default function WorkoutProgramContent() {
  const router = useRouter()
  const params = useSearchParams()
  const type = params.get('type') === 'calisthenics' ? 'calisthenics' : 'gym'

  const isGym   = type === 'gym'
  const days    = isGym ? GYM_DAYS : CALI_DAYS
  const completed = isGym ? GYM_COMPLETED : CALI_COMPLETED
  const current   = isGym ? GYM_CURRENT : CALI_CURRENT
  const accent    = isGym ? 'teal' : 'indigo'
  const title     = isGym ? 'GYM STRENGTH CHALLENGE' : 'CALISTHENICS CHALLENGE'
  const subtitle  = isGym ? 'Machine Training · 3–4 Days / Week' : 'Bodyweight Only · Every Day'
  const completedCount = completed.length

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-32">

      {/* Header */}
      <div className={`relative overflow-hidden bg-gradient-to-b ${isGym ? 'from-[#0d1f1c]' : 'from-[#12101f]'} to-[#0a0a0f]`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${isGym ? 'from-teal-500/10' : 'from-indigo-500/10'} via-transparent to-transparent pointer-events-none`} />

        <div className="relative z-10 px-5 pt-6 pb-5">
          {/* Back */}
          <button
            onClick={() => router.push('/workout')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-5"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Programs
          </button>

          {/* Badge */}
          <div className="flex items-center gap-2 mb-2">
            <div className={`${isGym ? 'bg-teal-400/20 border-teal-400/40' : 'bg-indigo-400/20 border-indigo-400/40'} border rounded-xl p-1.5`}>
              {isGym
                ? <Dumbbell className="w-4 h-4 text-teal-400" />
                : <PersonStanding className="w-4 h-4 text-indigo-400" />
              }
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isGym ? 'text-teal-400' : 'text-indigo-400'}`}>
              {isGym ? '28-Day Gym Program' : '28-Day Calisthenics Program'}
            </span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white leading-tight mb-1">{title}</h1>
          <p className="text-xs text-slate-400 font-medium mb-5">{subtitle}</p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Main Goal</div>
              <div className="text-xs font-black text-white flex items-center gap-1">
                <Target className="w-3 h-3 text-teal-400" />
                Lose Fat · Build Muscle
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Your Weight</div>
              <div className="text-xs font-black text-white flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-400" />
                85 kg → 75 kg
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-bold text-white">Progress</span>
            <span className={`text-xs font-black ${isGym ? 'text-teal-400' : 'text-indigo-400'}`}>{completedCount} of 28 workouts</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / 28) * 100}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className={`h-full rounded-full ${isGym ? 'bg-gradient-to-r from-teal-400 to-cyan-400' : 'bg-gradient-to-r from-indigo-400 to-purple-400'}`}
            />
          </div>
        </div>
      </div>

      {/* Start Today CTA */}
      <div className="px-5 my-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push(`/workout/active?type=${type}&day=${current}`)}
          className={`w-full font-black py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-2xl text-sm text-slate-950 ${
            isGym
              ? 'bg-gradient-to-r from-teal-400 to-cyan-400 shadow-teal-500/30'
              : 'bg-gradient-to-r from-indigo-400 to-purple-400 shadow-indigo-500/30'
          }`}
        >
          <Play className="w-5 h-5 fill-slate-950" />
          START TODAY'S WORKOUT · Day {current}
        </motion.button>
      </div>

      {/* Week Groups */}
      <div className="px-5 space-y-8">
        {WEEKS.map((week) => {
          const weekDays = days.filter(d => d.week === week.week)
          const weekColor = isGym ? week.gymColor : week.caliColor

          return (
            <div key={week.week}>
              {/* Week Banner */}
              <div className="mb-4">
                <div className="text-sm font-black tracking-tight mb-0.5" style={{ color: weekColor }}>
                  {week.label}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">{week.subtitle}</div>
              </div>

              {/* Day Grid — 3 columns */}
              <div className="grid grid-cols-3 gap-2.5">
                {weekDays.map((d) => {
                  const isCompleted = completed.includes(d.day)
                  const isCurrent  = d.day === current
                  const isLocked   = d.day > current

                  return (
                    <motion.button
                      key={d.day}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => {
                        if (!isLocked) router.push(`/workout/active?type=${type}&day=${d.day}`)
                      }}
                      className={`relative rounded-2xl overflow-hidden border aspect-square ${
                        isCurrent
                          ? isGym ? 'border-teal-400 shadow-[0_0_18px_rgba(20,184,166,0.5)]' : 'border-indigo-400 shadow-[0_0_18px_rgba(99,102,241,0.5)]'
                          : isCompleted
                          ? isGym ? 'border-teal-400/40' : 'border-indigo-400/40'
                          : 'border-white/8'
                      }`}
                    >
                      {/* Background thumbnail */}
                      <div className="absolute inset-0">
                        <img
                          src={d.thumb}
                          alt={d.title}
                          className={`w-full h-full object-cover transition-all ${
                            isLocked ? 'opacity-15 grayscale' : isCompleted ? 'opacity-55' : 'opacity-75'
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      </div>

                      {/* Lock icon */}
                      {isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Lock className="w-4 h-4 text-slate-500" />
                        </div>
                      )}

                      {/* Completed badge */}
                      {isCompleted && (
                        <div className="absolute top-1.5 right-1.5">
                          <CheckCircle className={`w-4 h-4 ${isGym ? 'text-teal-400' : 'text-indigo-400'}`} />
                        </div>
                      )}

                      {/* Live dot for today */}
                      {isCurrent && (
                        <div className="absolute top-1.5 right-1.5">
                          <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${isGym ? 'bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,1)]' : 'bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,1)]'}`} />
                        </div>
                      )}

                      {/* Sets badge (calisthenics only) */}
                      {!isGym && !isLocked && !d.isRest && 'sets' in d && (
                        <div className="absolute top-1.5 left-1.5">
                          <span className="text-[8px] font-black bg-black/70 text-white px-1.5 py-0.5 rounded-md">
                            {(d as { sets: string }).sets.split(' + ')[0]}
                          </span>
                        </div>
                      )}

                      {/* Bottom label */}
                      <div className="absolute bottom-1.5 left-1.5 right-1.5">
                        <div className="text-[9px] font-black text-white leading-tight">
                          {d.isRest ? '😴 Rest' : `Day ${d.day}`}
                        </div>
                        {isCurrent && (
                          <div className={`text-[8px] font-bold ${isGym ? 'text-teal-300' : 'text-indigo-300'}`}>TODAY</div>
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Finish Card */}
        <div className={`border rounded-3xl p-6 text-center ${isGym ? 'bg-teal-500/5 border-teal-400/20' : 'bg-indigo-500/5 border-indigo-400/20'}`}>
          <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <div className="text-sm font-black text-white mb-1">Complete all 28 days</div>
          <div className="text-[11px] text-slate-400 font-medium">Unlock your transformation report & next-level program</div>
        </div>
      </div>
    </div>
  )
}

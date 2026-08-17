'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Dumbbell, Lock, CheckCircle, Play,
  Flame, Clock, X, Target, Zap, Trophy, Sparkles, ShieldCheck
} from 'lucide-react'
import { triggerCelebrationConfetti } from '@/components/ui/celebration'
import { useUserProfile } from '@/context/user-profile-context'
import GymFormCoachModal from './gym-form-coach-modal'

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────
interface GymExercise {
  name: string
  reps: string
  tip: string
}

interface GymChallengeDay {
  day: number
  week: number
  title: string
  focus: string
  duration: string
  calories: number
  emoji: string
  thumb: string
  isRest: boolean
  warmup: GymExercise[]
  work: GymExercise[]
  cooldown: GymExercise[]
}

// ─────────────────────────────────────────────────────────
// 4 WEEKS PROGRESSION STRUCTURE
// ─────────────────────────────────────────────────────────
const WEEKS = [
  {
    week: 1,
    label: 'WEEK 1 — FEEL IT',
    subtitle: 'Build the habit. Learn machine paths & form.',
    color: 'from-teal-950/70 to-[#0a0a0f]',
    accent: 'text-teal-400',
    border: 'border-teal-500/40',
    badgeBg: 'bg-teal-500/20',
  },
  {
    week: 2,
    label: 'WEEK 2 — SEE IT',
    subtitle: 'Form locks in. Strength adaptations begin.',
    color: 'from-cyan-950/70 to-[#0a0a0f]',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/40',
    badgeBg: 'bg-cyan-500/20',
  },
  {
    week: 3,
    label: 'WEEK 3 — PEOPLE NOTICE',
    subtitle: 'Muscular density increases. Metabolism surges.',
    color: 'from-indigo-950/70 to-[#0a0a0f]',
    accent: 'text-indigo-400',
    border: 'border-indigo-500/40',
    badgeBg: 'bg-indigo-500/20',
  },
  {
    week: 4,
    label: 'WEEK 4 — GOALS EXCEEDED',
    subtitle: 'Peak strength & transformation achieved.',
    color: 'from-amber-950/70 to-[#0a0a0f]',
    accent: 'text-amber-400',
    border: 'border-amber-500/40',
    badgeBg: 'bg-amber-500/20',
  },
]

// ─────────────────────────────────────────────────────────
// 28 COMPLETE DAYS OF GYM MACHINE ROUTINE
// ─────────────────────────────────────────────────────────
const DAYS: GymChallengeDay[] = [
  // ── WEEK 1: BUILD THE HABIT ──────────────────────────
  {
    day: 1, week: 1, emoji: '🦾', thumb: '/artifacts/exercises/leg_press_motion.gif', isRest: false,
    title: 'Full Body Foundation',
    focus: 'Legs, Chest & Upper Back',
    duration: '35 min', calories: 180,
    warmup: [
      { name: 'Treadmill Walk (Cardio)', reps: '5 min', tip: '3.5 km/h at 1% incline to warm up knees & hips' },
      { name: 'Shoulder Circles', reps: '20 reps', tip: '10 forward, 10 backward for joint lubrication' },
      { name: 'Kneeling Hip Flexor Stretch', reps: '45 sec / side', tip: 'Loosen tight hip flexors before leg training' },
    ],
    work: [
      { name: 'Leg Press Machine', reps: '3 × 12', tip: 'Feet shoulder-width. Lower to 90°, do not lock knees at top.' },
      { name: 'Seated Chest Press Machine', reps: '3 × 12', tip: 'Handles at mid-chest. 2s controlled lowering, smooth press.' },
      { name: 'Neutral-Grip Lat Pulldown', reps: '3 × 12', tip: 'Lead with elbows down to collarbone, pinch shoulder blades.' },
    ],
    cooldown: [
      { name: 'Recumbent Bike (Cool-Down)', reps: '5 min', tip: 'Low resistance pedaling to flush lactic acid' },
      { name: 'Chest Wall Stretch', reps: '30 sec each side', tip: 'Open up the chest and front delts' },
    ],
  },
  {
    day: 2, week: 1, emoji: '🚴', thumb: '/artifacts/exercises/recumbent_bike_motion.gif', isRest: false,
    title: 'Active Recovery & Core Cardio',
    focus: 'LISS Cardio & Mobility',
    duration: '20 min', calories: 110,
    warmup: [
      { name: 'Treadmill Walk', reps: '3 min', tip: 'Gentle stroll to activate circulation' },
      { name: 'Hip Flexor Stretch', reps: '45 sec each leg', tip: 'Decompress hips and lower back' },
    ],
    work: [
      { name: 'Recumbent Bike', reps: '15 min steady', tip: '70–80 RPM cadence. Zone 2 fat burn without joint impact.' },
      { name: 'Shoulder Circles', reps: '20 reps', tip: 'Full rotation to maintain rotator cuff health.' },
    ],
    cooldown: [
      { name: 'Seated Hamstring Stretch', reps: '45 sec', tip: 'Gentle forward fold, breathe deeply' },
      { name: 'Deep Diaphragmatic Breathing', reps: '2 min', tip: 'Inhale 4s, hold 2s, exhale 6s to trigger parasympathetic recovery' },
    ],
  },
  {
    day: 3, week: 1, emoji: '⚡', thumb: '/artifacts/exercises/lat_pulldown_motion.gif', isRest: false,
    title: 'Push & Pull Upper Body',
    focus: 'Lats, Rhomboids & Triceps',
    duration: '35 min', calories: 190,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Smooth brisk walk at 4.0 km/h' },
      { name: 'Shoulder Circles', reps: '20 reps', tip: 'Warm up deltoids and rotator cuff' },
    ],
    work: [
      { name: 'Neutral-Grip Lat Pulldown', reps: '3 × 12', tip: 'Drive elbows into side pockets, chest proud.' },
      { name: 'Seated Cable Row', reps: '3 × 12', tip: 'Pull V-handle into lower ribs, 1s peak contraction.' },
      { name: 'Cable Triceps Press-Down', reps: '3 × 15', tip: 'Elbows glued to ribs, full lockout at bottom.' },
    ],
    cooldown: [
      { name: 'Recumbent Bike', reps: '5 min', tip: 'Easy cool-down pedaling' },
      { name: 'Doorframe Lat Stretch', reps: '45 sec each side', tip: 'Feel long stretch along sides of back' },
    ],
  },
  {
    day: 4, week: 1, emoji: '😴', thumb: '/artifacts/exercises/hip_mobility_motion.gif', isRest: true,
    title: 'Rest & Restore',
    focus: 'Full Rest & Muscle Repair',
    duration: '—', calories: 0,
    warmup: [],
    work: [
      { name: 'True Rest Day', reps: '—', tip: 'Muscles rebuild during deep rest. Prioritize 8+ hours sleep and 92g+ protein intake.' },
    ],
    cooldown: [],
  },
  {
    day: 5, week: 1, emoji: '🦵', thumb: '/artifacts/exercises/leg_extension_motion.gif', isRest: false,
    title: 'Lower Body Strength',
    focus: 'Quadriceps & Hamstrings',
    duration: '38 min', calories: 200,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Warm up knee joints and hip synovial fluid' },
      { name: 'Kneeling Hip Flexor Stretch', reps: '45 sec / side', tip: 'Deep hip opening stretch' },
    ],
    work: [
      { name: 'Leg Press Machine', reps: '3 × 12', tip: 'Full foot contact, smooth 3s eccentric descent.' },
      { name: 'Leg Extension Machine', reps: '3 × 15', tip: 'Pause 1s at top to maximize quad contraction.' },
      { name: 'Seated Leg Curl Machine', reps: '3 × 15', tip: 'Curl down smoothly, don\'t allow weight to slam.' },
    ],
    cooldown: [
      { name: 'Recumbent Bike', reps: '5 min', tip: 'Gentle cadence recovery' },
      { name: 'Standing Quad Stretch', reps: '30 sec each leg', tip: 'Hold wall for balance, keep knees together' },
    ],
  },
  {
    day: 6, week: 1, emoji: '💥', thumb: '/artifacts/exercises/chest_press_motion.gif', isRest: false,
    title: 'Upper Body Pump & Delts',
    focus: 'Chest, Shoulders & Arms',
    duration: '35 min', calories: 185,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Raise core temperature' },
      { name: 'Shoulder Circles', reps: '20 reps', tip: 'Loosen shoulder joints' },
    ],
    work: [
      { name: 'Seated Chest Press Machine', reps: '3 × 12', tip: 'Keep chest tall, push smoothly forward.' },
      { name: 'Seated Shoulder Press Machine', reps: '3 × 12', tip: 'Handles at ear height, press straight overhead.' },
      { name: 'Standing Cable Chest Fly', reps: '3 × 12', tip: 'Hug a wide barrel, squeeze chest in center.' },
    ],
    cooldown: [
      { name: 'Recumbent Bike', reps: '5 min', tip: 'Flush fatigue out of muscles' },
      { name: 'Chest Wall Stretch', reps: '45 sec / side', tip: 'Relax pectorals and shoulders' },
    ],
  },
  {
    day: 7, week: 1, emoji: '😴', thumb: '/artifacts/exercises/hip_mobility_motion.gif', isRest: true,
    title: 'Week 1 Complete · Rest Day',
    focus: 'Active Regeneration',
    duration: '—', calories: 0,
    warmup: [],
    work: [
      { name: 'Week 1 Completed!', reps: '—', tip: 'You built the foundation! Week 2 increases intensity and muscle tone.' },
    ],
    cooldown: [],
  },

  // ── WEEK 2: FEEL THE BURN ─────────────────────────────
  {
    day: 8, week: 2, emoji: '🔥', thumb: '/artifacts/exercises/leg_press_motion.gif', isRest: false,
    title: 'Power Legs Progression',
    focus: 'Compound Lower Body',
    duration: '40 min', calories: 220,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Brisk 4.0 km/h warm-up walk' },
      { name: 'Kneeling Hip Flexor Stretch', reps: '45 sec / side', tip: 'Tuck tailbone, open up hip' },
    ],
    work: [
      { name: 'Leg Press Machine', reps: '4 × 12', tip: 'Add 1 additional set. Full depth with controlled 3s lowering.' },
      { name: 'Leg Extension Machine', reps: '3 × 15', tip: '1s peak contraction hold on every rep.' },
      { name: 'Seated Leg Curl Machine', reps: '3 × 15', tip: 'Strict hamstring curls without lifting hips off seat.' },
    ],
    cooldown: [
      { name: 'Recumbent Bike', reps: '5 min', tip: 'Zone 1 cool-down spin' },
      { name: 'Hamstring & Quad Stretches', reps: '2 min', tip: 'Hold each stretch for 30 seconds' },
    ],
  },
  {
    day: 9, week: 2, emoji: '🚴', thumb: '/artifacts/exercises/recumbent_bike_motion.gif', isRest: false,
    title: 'Metabolic Cardio & Flush',
    focus: 'Cardio & LISS Conditioning',
    duration: '25 min', calories: 150,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Warm up body temperature' },
    ],
    work: [
      { name: 'Recumbent Bike', reps: '20 min steady', tip: 'Maintain 75–85 RPM. Steady fat oxidation.' },
      { name: 'Shoulder Circles', reps: '20 reps', tip: 'Active shoulder mobility.' },
    ],
    cooldown: [
      { name: 'Hip Flexor Stretch', reps: '1 min each', tip: 'Release hips after bike session' },
    ],
  },
  {
    day: 10, week: 2, emoji: '🧱', thumb: '/artifacts/exercises/seated_row_motion.gif', isRest: false,
    title: 'Back & Core Dominator',
    focus: 'Upper Back & Postural Pillars',
    duration: '40 min', calories: 210,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Gradual incline walk' },
      { name: 'Shoulder Circles', reps: '20 reps', tip: 'Warms rotator cuff' },
    ],
    work: [
      { name: 'Neutral-Grip Lat Pulldown', reps: '4 × 12', tip: 'Pinch shoulder blades tight at bottom.' },
      { name: 'Seated Cable Row', reps: '4 × 12', tip: 'Pull to navel, 2s slow return stretch.' },
      { name: 'Cable Triceps Press-Down', reps: '3 × 15', tip: 'Keep elbows fixed at side ribs.' },
    ],
    cooldown: [
      { name: 'Recumbent Bike', reps: '5 min', tip: 'Gentle cadence' },
      { name: 'Lat & Chest Stretch', reps: '2 min', tip: 'Breathe into tight back muscles' },
    ],
  },
  {
    day: 11, week: 2, emoji: '🧘', thumb: '/artifacts/exercises/hip_mobility_motion.gif', isRest: false,
    title: 'Mobility & Joint Health',
    focus: 'Active Recovery & Flexibility',
    duration: '20 min', calories: 85,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Slow gentle stroll' },
    ],
    work: [
      { name: 'Kneeling Hip Flexor Stretch', reps: '3 × 45 sec / side', tip: 'Focus on breathing into the hip socket.' },
      { name: 'Shoulder Circles', reps: '3 × 20 reps', tip: 'Slow controlled rotations.' },
      { name: 'Recumbent Bike', reps: '10 min', tip: 'Low intensity recovery ride.' },
    ],
    cooldown: [
      { name: 'Full Body Deep Breathing', reps: '2 min', tip: 'Restore heart rate variability.' },
    ],
  },
  {
    day: 12, week: 2, emoji: '🔥', thumb: '/artifacts/exercises/seated_leg_curl_motion.gif', isRest: false,
    title: 'Leg Isolation & Hamstring Focus',
    focus: 'Hamstrings & Quads',
    duration: '38 min', calories: 205,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Raise body heat' },
      { name: 'Hip Flexor Stretch', reps: '45 sec / side', tip: 'Hip mobility prep' },
    ],
    work: [
      { name: 'Leg Press Machine', reps: '3 × 12', tip: 'Drive through full foot, smooth cadence.' },
      { name: 'Seated Leg Curl Machine', reps: '4 × 15', tip: 'Extra volume set for hamstring development.' },
      { name: 'Leg Extension Machine', reps: '3 × 15', tip: 'Hold 1 second at top extension.' },
    ],
    cooldown: [
      { name: 'Recumbent Bike', reps: '5 min', tip: 'Cool-down spin' },
      { name: 'Seated Hamstring Stretch', reps: '1 min', tip: 'Relax posterior chain' },
    ],
  },
  {
    day: 13, week: 2, emoji: '💥', thumb: '/artifacts/exercises/shoulder_press_motion.gif', isRest: false,
    title: 'Push Power & Shoulder Definition',
    focus: 'Shoulders, Chest & Triceps',
    duration: '40 min', calories: 215,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Warm up cardio' },
      { name: 'Shoulder Circles', reps: '20 reps', tip: 'Prepare delts' },
    ],
    work: [
      { name: 'Seated Shoulder Press Machine', reps: '4 × 12', tip: 'Press overhead smoothly without arching back.' },
      { name: 'Seated Chest Press Machine', reps: '3 × 12', tip: 'Retract scapula, push forward with control.' },
      { name: 'Standing Cable Chest Fly', reps: '3 × 12', tip: 'Squeeze inner chest at peak contraction.' },
      { name: 'Cable Triceps Press-Down', reps: '3 × 15', tip: 'Lockout triceps firmly at bottom.' },
    ],
    cooldown: [
      { name: 'Recumbent Bike', reps: '5 min', tip: 'Gentle recovery' },
      { name: 'Chest Wall Stretch', reps: '1 min', tip: 'Open shoulders' },
    ],
  },
  {
    day: 14, week: 2, emoji: '😴', thumb: '/artifacts/exercises/hip_mobility_motion.gif', isRest: true,
    title: 'Halfway Mark · Rest Day',
    focus: 'Full Recovery',
    duration: '—', calories: 0,
    warmup: [],
    work: [
      { name: 'Halfway Checkpoint!', reps: '—', tip: '14 days complete! Your neural pathways and muscle recruitment are locked in.' },
    ],
    cooldown: [],
  },

  // ── WEEK 3: PEOPLE NOTICE ─────────────────────────────
  {
    day: 15, week: 3, emoji: '⚡', thumb: '/artifacts/exercises/chest_press_motion.gif', isRest: false,
    title: 'Strength Circuit & Density',
    focus: 'Chest, Back & Core',
    duration: '45 min', calories: 240,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Warm up muscles' },
      { name: 'Shoulder Circles', reps: '20 reps', tip: 'Joint prep' },
    ],
    work: [
      { name: 'Seated Chest Press Machine', reps: '4 × 12', tip: 'Heavy controlled sets with 2s eccentric.' },
      { name: 'Neutral-Grip Lat Pulldown', reps: '4 × 12', tip: 'Full stretch at top, squeeze lats at bottom.' },
      { name: 'Standing Cable Chest Fly', reps: '3 × 15', tip: 'High-rep pump for chest fibers.' },
    ],
    cooldown: [
      { name: 'Recumbent Bike', reps: '5 min', tip: 'Flush fatigue' },
    ],
  },
  {
    day: 16, week: 3, emoji: '🚴', thumb: '/artifacts/exercises/recumbent_bike_motion.gif', isRest: false,
    title: 'Cardio Blast & Fat Burn',
    focus: 'Endurance & Stamina',
    duration: '30 min', calories: 170,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Gradual speed increase' },
    ],
    work: [
      { name: 'Recumbent Bike', reps: '25 min steady', tip: 'Heart rate in steady fat-burning zone.' },
      { name: 'Shoulder Circles', reps: '20 reps', tip: 'Keep joints mobile.' },
    ],
    cooldown: [
      { name: 'Leg Stretches', reps: '2 min', tip: 'Stretch quads and calves' },
    ],
  },
  {
    day: 17, week: 3, emoji: '🦾', thumb: '/artifacts/exercises/lat_pulldown_motion.gif', isRest: false,
    title: 'Pull Compound Mastery',
    focus: 'Lats, Traps & Biceps',
    duration: '42 min', calories: 225,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Cardio warm-up' },
      { name: 'Shoulder Circles', reps: '20 reps', tip: 'Shoulder prep' },
    ],
    work: [
      { name: 'Neutral-Grip Lat Pulldown', reps: '4 × 12', tip: 'Elbows driving straight down.' },
      { name: 'Seated Cable Row', reps: '4 × 12', tip: 'Hold 1s squeeze on every rep.' },
      { name: 'Cable Triceps Press-Down', reps: '3 × 15', tip: 'Full range extension.' },
    ],
    cooldown: [
      { name: 'Recumbent Bike', reps: '5 min', tip: 'Cool-down spin' },
    ],
  },
  {
    day: 18, week: 3, emoji: '🧘', thumb: '/artifacts/exercises/hip_mobility_motion.gif', isRest: false,
    title: 'Active Mobility & Regeneration',
    focus: 'Mobility & Joint Alignment',
    duration: '25 min', calories: 95,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Slow stroll' },
    ],
    work: [
      { name: 'Kneeling Hip Flexor Stretch', reps: '3 × 45 sec', tip: 'Open anterior hip capsule.' },
      { name: 'Shoulder Circles', reps: '3 × 20 reps', tip: 'Full rotation.' },
      { name: 'Recumbent Bike', reps: '15 min', tip: 'Easy cycling.' },
    ],
    cooldown: [
      { name: 'Deep Breathing', reps: '2 min', tip: 'Parasympathetic recovery.' },
    ],
  },
  {
    day: 19, week: 3, emoji: '🦵', thumb: '/artifacts/exercises/leg_press_motion.gif', isRest: false,
    title: 'Leg Power & Hypertrophy',
    focus: 'Quads & Glutes',
    duration: '45 min', calories: 245,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Warm up legs' },
      { name: 'Hip Flexor Stretch', reps: '45 sec / side', tip: 'Joint prep' },
    ],
    work: [
      { name: 'Leg Press Machine', reps: '4 × 12', tip: 'Heavy, clean form. 3s negative.' },
      { name: 'Leg Extension Machine', reps: '4 × 15', tip: 'Quad burn protocol.' },
      { name: 'Seated Leg Curl Machine', reps: '4 × 15', tip: 'Strict hamstring curl.' },
    ],
    cooldown: [
      { name: 'Recumbent Bike', reps: '5 min', tip: 'Flush legs' },
    ],
  },
  {
    day: 20, week: 3, emoji: '💥', thumb: '/artifacts/exercises/cable_fly_motion.gif', isRest: false,
    title: 'Upper Body Peak Hypertrophy',
    focus: 'Chest, Delts & Triceps',
    duration: '45 min', calories: 235,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Warm up' },
      { name: 'Shoulder Circles', reps: '20 reps', tip: 'Shoulder mobility' },
    ],
    work: [
      { name: 'Seated Chest Press Machine', reps: '4 × 12', tip: 'Explosive push, 2s return.' },
      { name: 'Seated Shoulder Press Machine', reps: '4 × 12', tip: 'Strict vertical press.' },
      { name: 'Standing Cable Chest Fly', reps: '4 × 15', tip: 'Full chest isolation.' },
      { name: 'Cable Triceps Press-Down', reps: '3 × 15', tip: 'Lockout burn.' },
    ],
    cooldown: [
      { name: 'Recumbent Bike', reps: '5 min', tip: 'Cool-down' },
    ],
  },
  {
    day: 21, week: 3, emoji: '😴', thumb: '/artifacts/exercises/hip_mobility_motion.gif', isRest: true,
    title: 'Week 3 Peak · Rest Day',
    focus: 'Full Rest',
    duration: '—', calories: 0,
    warmup: [],
    work: [
      { name: 'Ready for the Final Week!', reps: '—', tip: '3 weeks down! Only 7 days remain to cement your complete transformation.' },
    ],
    cooldown: [],
  },

  // ── WEEK 4: GOALS EXCEEDED ───────────────────────────
  {
    day: 22, week: 4, emoji: '⚡', thumb: '/artifacts/exercises/leg_extension_motion.gif', isRest: false,
    title: 'Power Full Body Overload',
    focus: 'Maximum Strength Adaptation',
    duration: '48 min', calories: 260,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Brisk warm-up' },
      { name: 'Shoulder Circles', reps: '20 reps', tip: 'Joint lubricator' },
    ],
    work: [
      { name: 'Leg Press Machine', reps: '4 × 12', tip: 'Peak effort on every rep.' },
      { name: 'Seated Chest Press Machine', reps: '4 × 12', tip: 'Full pectoral drive.' },
      { name: 'Neutral-Grip Lat Pulldown', reps: '4 × 12', tip: 'Lead with elbows.' },
      { name: 'Leg Extension Machine', reps: '3 × 15', tip: 'Continuous tension.' },
    ],
    cooldown: [
      { name: 'Recumbent Bike', reps: '5 min', tip: 'Recovery spin' },
    ],
  },
  {
    day: 23, week: 4, emoji: '🚴', thumb: '/artifacts/exercises/recumbent_bike_motion.gif', isRest: false,
    title: 'Cardio & Fat-Oxidation Peak',
    focus: 'Fat Burn & Stamina',
    duration: '35 min', calories: 190,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Warm up walk' },
    ],
    work: [
      { name: 'Recumbent Bike', reps: '30 min steady', tip: 'Consistent 80 RPM cadence.' },
      { name: 'Shoulder Circles', reps: '20 reps', tip: 'Active shoulder release.' },
    ],
    cooldown: [
      { name: 'Full Leg Stretch', reps: '2 min', tip: 'Stretch quads & calves' },
    ],
  },
  {
    day: 24, week: 4, emoji: '🦾', thumb: '/artifacts/exercises/seated_row_motion.gif', isRest: false,
    title: 'Back & Lat Thickness',
    focus: 'Rhomboids, Lats & Upper Back',
    duration: '45 min', calories: 240,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Warm up' },
      { name: 'Shoulder Circles', reps: '20 reps', tip: 'Mobility' },
    ],
    work: [
      { name: 'Neutral-Grip Lat Pulldown', reps: '4 × 12', tip: 'Controlled 2s negative.' },
      { name: 'Seated Cable Row', reps: '4 × 12', tip: 'Hard squeeze at abdomen.' },
      { name: 'Cable Triceps Press-Down', reps: '4 × 15', tip: 'Pin elbows to ribs.' },
    ],
    cooldown: [
      { name: 'Recumbent Bike', reps: '5 min', tip: 'Flush lactic acid' },
    ],
  },
  {
    day: 25, week: 4, emoji: '🧘', thumb: '/artifacts/exercises/hip_mobility_motion.gif', isRest: false,
    title: 'Decompression & Stretch',
    focus: 'Joint Restoration',
    duration: '20 min', calories: 80,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Gentle walk' },
    ],
    work: [
      { name: 'Kneeling Hip Flexor Stretch', reps: '3 × 45 sec', tip: 'Hip mobility.' },
      { name: 'Shoulder Circles', reps: '3 × 20 reps', tip: 'Shoulder health.' },
      { name: 'Recumbent Bike', reps: '10 min', tip: 'Light ride.' },
    ],
    cooldown: [
      { name: 'Deep Breathing', reps: '2 min', tip: 'Relaxation.' },
    ],
  },
  {
    day: 26, week: 4, emoji: '🦵', thumb: '/artifacts/exercises/seated_leg_curl_motion.gif', isRest: false,
    title: 'Lower Body Final Test',
    focus: 'Complete Leg Musculature',
    duration: '48 min', calories: 255,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Cardio prep' },
      { name: 'Hip Flexor Stretch', reps: '45 sec / side', tip: 'Hip stretch' },
    ],
    work: [
      { name: 'Leg Press Machine', reps: '4 × 12', tip: 'Maximum controlled weight.' },
      { name: 'Leg Extension Machine', reps: '4 × 15', tip: 'Full quad extension.' },
      { name: 'Seated Leg Curl Machine', reps: '4 × 15', tip: 'Strict hamstring curl.' },
    ],
    cooldown: [
      { name: 'Recumbent Bike', reps: '5 min', tip: 'Cool-down' },
    ],
  },
  {
    day: 27, week: 4, emoji: '💥', thumb: '/artifacts/exercises/chest_press_motion.gif', isRest: false,
    title: 'Upper Body Final Overload',
    focus: 'Chest, Shoulders & Arms',
    duration: '48 min', calories: 250,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Warm-up walk' },
      { name: 'Shoulder Circles', reps: '20 reps', tip: 'Rotator cuff' },
    ],
    work: [
      { name: 'Seated Chest Press Machine', reps: '4 × 12', tip: 'Peak chest press.' },
      { name: 'Seated Shoulder Press Machine', reps: '4 × 12', tip: 'Overhead strength.' },
      { name: 'Standing Cable Chest Fly', reps: '4 × 15', tip: 'Cable isolation.' },
      { name: 'Cable Triceps Press-Down', reps: '4 × 15', tip: 'Triceps lockout.' },
    ],
    cooldown: [
      { name: 'Recumbent Bike', reps: '5 min', tip: 'Flush out' },
    ],
  },
  {
    day: 28, week: 4, emoji: '🏆', thumb: '/artifacts/exercises/leg_press_motion.gif', isRest: false,
    title: '🏆 Grand Finale — Transformation Completed!',
    focus: 'Full Body Mastery Test',
    duration: '55 min', calories: 295,
    warmup: [
      { name: 'Treadmill Walk', reps: '5 min', tip: 'Final warm-up walk' },
      { name: 'Shoulder Circles', reps: '20 reps', tip: 'Shoulder mobility' },
      { name: 'Kneeling Hip Flexor Stretch', reps: '45 sec / side', tip: 'Hip stretch' },
    ],
    work: [
      { name: 'Leg Press Machine', reps: '4 × 12', tip: 'Peak lower body strength.' },
      { name: 'Seated Chest Press Machine', reps: '4 × 12', tip: 'Peak upper body strength.' },
      { name: 'Neutral-Grip Lat Pulldown', reps: '4 × 12', tip: 'Peak back strength.' },
      { name: 'Standing Cable Chest Fly', reps: '3 × 15', tip: 'High-rep finisher.' },
      { name: 'Cable Triceps Press-Down', reps: '3 × 15', tip: 'Final triceps burn.' },
    ],
    cooldown: [
      { name: 'Recumbent Bike', reps: '10 min', tip: 'Victory cool-down ride!' },
      { name: 'Full Body Stretch Flow', reps: '5 min', tip: 'Celebrate your 28-day milestone!' },
    ],
  },
]

// ─────────────────────────────────────────────────────────
// ROW ITEM COMPONENT (Tap to open Form Coach Modal!)
// ─────────────────────────────────────────────────────────
function ExerciseRow({
  ex,
  accent,
  onOpenFormCoach,
}: {
  ex: GymExercise
  accent: 'teal' | 'cyan' | 'indigo' | 'amber'
  onOpenFormCoach?: () => void
}) {
  const accentClasses = {
    teal: 'border-teal-500/25 bg-teal-950/20 text-teal-300',
    cyan: 'border-cyan-500/25 bg-cyan-950/20 text-cyan-300',
    indigo: 'border-indigo-500/25 bg-indigo-950/20 text-indigo-300',
    amber: 'border-amber-500/25 bg-amber-950/20 text-amber-300',
  }[accent]

  return (
    <div
      onClick={onOpenFormCoach}
      className={`group relative overflow-hidden rounded-2xl border ${accentClasses} p-3.5 transition-all hover:border-teal-400/50 hover:bg-white/[0.04] ${
        onOpenFormCoach ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <div className="font-bold text-xs md:text-sm text-white group-hover:text-teal-300 transition-colors">
            {ex.name}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-black text-teal-300 bg-black/50 px-2.5 py-1 rounded-xl border border-teal-500/30">
            {ex.reps}
          </span>
          {onOpenFormCoach && (
            <span className="text-[10px] font-bold text-teal-400 bg-teal-500/20 px-2 py-0.5 rounded-lg border border-teal-500/30 flex items-center gap-1">
              <Play className="w-2.5 h-2.5 fill-teal-400" /> View Form GIF
            </span>
          )}
        </div>
      </div>
      <p className="text-[11px] text-white/70 mt-1 pl-4 font-medium leading-relaxed">
        {ex.tip}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────
export default function WorkoutProgramContent() {
  const router = useRouter()
  const params = useSearchParams()
  const typeParam = params.get('type')
  const { profile } = useUserProfile()

  // Redirect calisthenics parameter to 28-day morning challenge
  useEffect(() => {
    if (typeParam === 'calisthenics') {
      router.replace('/workout/morning-challenge')
    }
  }, [typeParam, router])

  const [completedDays, setCompletedDays] = useState<number[]>([])
  const [currentDay, setCurrentDay] = useState<number>(1)
  const [selectedDay, setSelectedDay] = useState<GymChallengeDay | null>(null)
  const [activeCoachExercise, setActiveCoachExercise] = useState<string | null>(null)

  // Load persistence
  useEffect(() => {
    try {
      const savedCompleted = localStorage.getItem('nexora_gym_challenge_completed_days')
      const savedCurrent = localStorage.getItem('nexora_gym_challenge_current_day')
      if (savedCompleted) setCompletedDays(JSON.parse(savedCompleted))
      if (savedCurrent) setCurrentDay(Number(savedCurrent))
    } catch {}
  }, [])

  const handleCompleteDay = (dayNum: number) => {
    let nextCompleted: number[]
    if (!completedDays.includes(dayNum)) {
      nextCompleted = [...completedDays, dayNum]
      triggerCelebrationConfetti()
    } else {
      nextCompleted = completedDays
    }
    setCompletedDays(nextCompleted)
    const nextDay = Math.min(dayNum + 1, 28)
    if (nextDay > currentDay) {
      setCurrentDay(nextDay)
      try {
        localStorage.setItem('nexora_gym_challenge_current_day', String(nextDay))
      } catch {}
    }
    try {
      localStorage.setItem('nexora_gym_challenge_completed_days', JSON.stringify(nextCompleted))
    } catch {}
    setSelectedDay(null)
  }

  const completedCount = completedDays.length
  const progressPct = Math.round((completedCount / 28) * 100)
  const activeToday = DAYS.find(d => d.day === currentDay) || DAYS[0]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-foreground pb-36 select-none font-sans">
      
      {/* ── Form Coach Modal ─────────────────────────────── */}
      <AnimatePresence>
        {activeCoachExercise && (
          <GymFormCoachModal
            exerciseName={activeCoachExercise}
            onClose={() => setActiveCoachExercise(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Header Banner ─────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0c1a17] via-[#091211] to-[#0a0a0f] border-b border-teal-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/15 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 px-5 pt-6 pb-6 max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => router.push('/workout')}
            className="flex items-center gap-1.5 text-xs font-bold text-foreground/70 hover:text-white mb-4 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Workout Center
          </button>

          {/* Title and Badge */}
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-xl border border-teal-500/40 bg-teal-500/20 p-1.5 text-teal-400">
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-teal-400">
              28-Day Gym Machine Program
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-1.5 drop-shadow-md">
            GYM MACHINE ROUTINE
          </h1>
          <p className="text-xs sm:text-sm text-foreground/75 font-medium mb-5 max-w-xl">
            Joint-friendly machine training with looping animated form GIFs, guided setup &amp; full 28-day progressive overload.
          </p>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-3">
              <div className="text-[10px] text-foreground/70 font-bold uppercase tracking-wider mb-0.5">Main Goal</div>
              <div className="text-xs font-black text-white flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-teal-400" />
                Lose Fat · Build Muscle
              </div>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-3">
              <div className="text-[10px] text-foreground/70 font-bold uppercase tracking-wider mb-0.5">Your Weight Arc</div>
              <div className="text-xs font-black text-teal-300 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-teal-400" />
                82.70 kg → 75.00 kg
              </div>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-3">
              <div className="text-[10px] text-foreground/70 font-bold uppercase tracking-wider mb-0.5">Daily Time</div>
              <div className="text-xs font-black text-white flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                35–45 Min / Day
              </div>
            </div>
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-3">
              <div className="text-[10px] text-foreground/70 font-bold uppercase tracking-wider mb-0.5">Form Visualizer</div>
              <div className="text-xs font-black text-teal-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                Looping Avatar GIFs
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-foreground/80">Transformation Progress</span>
              <span className="font-black text-teal-400">{completedCount} of 28 Days ({progressPct}%)</span>
            </div>
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.6)]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 pt-6 space-y-8">
        
        {/* ── TODAY'S WORKOUT HERO BUTTON ───────────────────── */}
        {activeToday && (
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedDay(activeToday)}
            className="group relative overflow-hidden rounded-3xl border border-teal-500/50 bg-gradient-to-r from-teal-950/80 via-[#0d1716] to-[#0a0a0f] p-5 sm:p-6 shadow-2xl shadow-teal-500/20 cursor-pointer"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/30 border border-teal-500/50 text-[9px] font-black uppercase tracking-widest text-teal-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                    TODAY&apos;S FOCUS · DAY {activeToday.day}
                  </span>
                  <span className="text-xs font-bold text-white/60">Week {activeToday.week}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">{activeToday.title}</h2>
                <p className="text-xs text-teal-300/90 font-medium">{activeToday.focus} · {activeToday.duration}</p>
              </div>

              <button className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 group-hover:brightness-110 transition-all">
                <Play className="w-4 h-4 fill-slate-950" />
                Open Day {activeToday.day} Training Plan
              </button>
            </div>
          </motion.div>
        )}

        {/* ── 28-DAY GRID (WEEKS 1–4) ────────────────────────── */}
        <div className="space-y-8">
          {WEEKS.map(week => {
            const weekDays = DAYS.filter(d => d.week === week.week)
            return (
              <div key={week.week}>
                {/* Week Header */}
                <div className={`mb-3.5 flex items-center justify-between rounded-2xl border ${week.border} bg-gradient-to-r ${week.color} px-4 py-3 shadow-lg`}>
                  <div>
                    <div className={`font-mono text-xs font-black uppercase tracking-[0.18em] ${week.accent}`}>
                      {week.label}
                    </div>
                    <div className="text-[11px] text-white/60 font-medium">{week.subtitle}</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase ${week.badgeBg} ${week.accent} border ${week.border}`}>
                    Week {week.week} of 4
                  </span>
                </div>

                {/* Day Cards — 4 column grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {weekDays.map(day => {
                    const isDone = completedDays.includes(day.day)
                    const isCurrent = day.day === currentDay
                    const isLocked = day.day > currentDay
                    const canTap = isDone || isCurrent || !isLocked

                    return (
                      <motion.button
                        key={day.day}
                        whileTap={canTap ? { scale: 0.94 } : {}}
                        onClick={() => canTap && setSelectedDay(day)}
                        disabled={isLocked}
                        className={`relative overflow-hidden flex flex-col justify-between rounded-2xl border transition-all aspect-[4/3] sm:aspect-square cursor-pointer p-3
                          ${isCurrent
                            ? 'border-teal-400 shadow-[0_0_24px_rgba(20,184,166,0.45)] ring-2 ring-teal-400/50'
                            : isDone
                              ? 'border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                              : 'border-white/[0.08] opacity-50 cursor-not-allowed'
                          }`}
                      >
                        {/* Background Looping Motion GIF / Thumb */}
                        <img
                          src={day.thumb}
                          alt={day.title}
                          className={`absolute inset-0 h-full w-full object-cover transition-all ${
                            isLocked ? 'grayscale brightness-30' : isDone ? 'brightness-75' : 'brightness-90'
                          }`}
                        />
                        {/* Dark overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

                        {/* Top Badges */}
                        <div className="relative z-10 flex items-center justify-between w-full">
                          <span className="text-base">{day.emoji}</span>
                          <div>
                            {isDone ? (
                              <div className="rounded-full bg-emerald-500 p-1 shadow-md">
                                <CheckCircle className="h-3 w-3 text-black" />
                              </div>
                            ) : isLocked ? (
                              <div className="rounded-full bg-black/70 backdrop-blur-xs p-1 border border-white/10">
                                <Lock className="h-3 w-3 text-white/50" />
                              </div>
                            ) : isCurrent ? (
                              <div className="rounded-full bg-teal-400 p-1 shadow-[0_0_10px_rgba(20,184,166,0.9)]">
                                <Zap className="h-3 w-3 text-black" />
                              </div>
                            ) : null}
                          </div>
                        </div>

                        {/* Bottom Label */}
                        <div className="relative z-10 w-full text-left">
                          <div className={`font-mono text-xs font-black uppercase tracking-wider ${
                            isCurrent ? 'text-teal-300' : isDone ? 'text-emerald-300' : 'text-white/70'
                          }`}>
                            Day {day.day}
                          </div>
                          <div className="text-[10px] text-white font-bold truncate">
                            {day.title}
                          </div>
                          {day.isRest ? (
                            <div className="text-[9px] font-black text-amber-300/90 uppercase">Rest</div>
                          ) : (
                            <div className="text-[9px] text-white/60">{day.duration}</div>
                          )}
                        </div>

                        {/* Pulse Ring for Current Day */}
                        {isCurrent && (
                          <motion.div
                            animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.2, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute inset-0 rounded-2xl border-2 border-teal-400 pointer-events-none"
                          />
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── TROPHY FINISH CARD ─────────────────────────────── */}
        <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-teal-950/40 via-[#0a0a0f] to-transparent p-6 text-center shadow-xl">
          <Trophy className="mx-auto mb-2.5 h-8 w-8 text-amber-400" />
          <div className="text-lg font-black text-white">28 Days of Precision Hypertrophy</div>
          <p className="mt-1 text-xs font-medium text-foreground/70 max-w-md mx-auto">
            Complete the full 4-week protocol to build maximum muscle density, improve posture, and incinerate visceral belly fat.
          </p>
        </div>
      </div>

      {/* ── DAY DETAIL MODAL / DIALOG ──────────────────────── */}
      <AnimatePresence>
        {selectedDay && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDay(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="relative z-[101] w-full md:max-w-xl max-h-[88vh] overflow-y-auto rounded-t-[2.5rem] md:rounded-[2.5rem] bg-[#0c1415] border border-teal-500/40 shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden"
            >
              {/* Featured Avatar Image Banner */}
              <div className="relative h-48 md:h-56 w-full overflow-hidden bg-black">
                <img
                  src={selectedDay.thumb}
                  alt={selectedDay.title}
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1415] via-[#0c1415]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

                {/* Close button */}
                <button
                  onClick={() => setSelectedDay(null)}
                  className="absolute top-4 right-4 z-20 rounded-full bg-black/70 backdrop-blur-md p-2 text-white/80 hover:text-white hover:bg-black/90 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Badge Overlay */}
                <div className="absolute bottom-3 left-5 z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{selectedDay.emoji}</span>
                    <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-teal-400 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-teal-500/30">
                      Day {selectedDay.day} · Week {selectedDay.week}
                    </span>
                    {completedDays.includes(selectedDay.day) && (
                      <span className="font-mono text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Completed
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-md">
                    {selectedDay.title}
                  </h2>
                </div>
              </div>

              <div className="p-5 md:p-6 pt-2 space-y-5">
                {/* Focus subtitle & stats */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                  <p className="text-xs md:text-sm font-semibold text-foreground/80">{selectedDay.focus}</p>
                  
                  {!selectedDay.isRest && (
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-xl border border-teal-500/20">
                        <Clock className="h-3.5 w-3.5" /> {selectedDay.duration}
                      </div>
                      {selectedDay.calories > 0 && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-xl border border-cyan-500/20">
                          <Flame className="h-3.5 w-3.5" /> ~{selectedDay.calories} kcal
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Rest Day Message */}
                {selectedDay.isRest ? (
                  <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6 text-center space-y-3">
                    <div className="text-4xl">😴</div>
                    <div className="text-lg font-black text-white">Full Recovery & Regeneration</div>
                    <p className="text-xs md:text-sm font-medium text-foreground/75 leading-relaxed max-w-md mx-auto">
                      {selectedDay.work[0]?.tip}
                    </p>
                    <button
                      onClick={() => handleCompleteDay(selectedDay.day)}
                      className="mt-2 rounded-2xl bg-teal-500/20 border border-teal-500/40 px-6 py-3 font-bold text-xs text-teal-300 hover:bg-teal-500/30 transition-all cursor-pointer"
                    >
                      ✓ Mark Rest Day Completed
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    
                    {/* Educational Banner */}
                    <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-500/15 via-cyan-500/10 to-transparent p-3.5 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex-shrink-0 mt-0.5">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-teal-300 flex items-center gap-1.5">
                          How Training Notation Works:
                        </div>
                        <p className="text-foreground/80 text-[11px] mt-0.5 leading-relaxed font-medium">
                          <strong>Formula: Sets × Reps</strong> (e.g. <strong>3 × 12</strong> = Complete 12 reps, rest 60–90s, repeat for 3 total sets).
                        </p>
                      </div>
                    </div>

                    {/* Warm-Up Section */}
                    {selectedDay.warmup.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-teal-400">
                            ☀️ 5 Min Cardio &amp; Mobility Warm-Up
                          </span>
                          <div className="h-px flex-1 bg-teal-500/20" />
                        </div>
                        <div className="space-y-2">
                          {selectedDay.warmup.map((ex, i) => (
                            <ExerciseRow
                              key={i}
                              ex={ex}
                              accent="teal"
                              onOpenFormCoach={() => setActiveCoachExercise(ex.name)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Main Machine Work */}
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-cyan-400">
                          🔥 Main Machine Hypertrophy · Tap Any Exercise for Looping Form GIF
                        </span>
                        <div className="h-px flex-1 bg-cyan-500/20" />
                      </div>
                      <div className="space-y-2">
                        {selectedDay.work.map((ex, i) => (
                          <ExerciseRow
                            key={i}
                            ex={ex}
                            accent="cyan"
                            onOpenFormCoach={() => setActiveCoachExercise(ex.name)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Cool-Down Section */}
                    {selectedDay.cooldown.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-indigo-400">
                            🧊 5 Min Cool-Down &amp; Lactic Acid Flush
                          </span>
                          <div className="h-px flex-1 bg-indigo-500/20" />
                        </div>
                        <div className="space-y-2">
                          {selectedDay.cooldown.map((ex, i) => (
                            <ExerciseRow
                              key={i}
                              ex={ex}
                              accent="indigo"
                              onOpenFormCoach={() => setActiveCoachExercise(ex.name)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Complete / Start Workout Action Button */}
                {!selectedDay.isRest && (
                  <div className="pt-2 space-y-2.5">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleCompleteDay(selectedDay.day)}
                      className="w-full rounded-2xl bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 py-4 font-black text-sm text-slate-950 shadow-[0_8px_32px_rgba(20,184,166,0.3)] hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {completedDays.includes(selectedDay.day) ? (
                        <>
                          <CheckCircle className="h-4 w-4" /> Day {selectedDay.day} Completed (Tap to Re-Save)
                        </>
                      ) : (
                        <>
                          <Trophy className="h-4 w-4 fill-slate-950" /> Complete Day {selectedDay.day} &amp; Unlock Next Day
                        </>
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

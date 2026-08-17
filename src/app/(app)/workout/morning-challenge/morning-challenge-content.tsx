'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Sun, Lock, CheckCircle, Play,
  Flame, Clock, X, Target, Zap, Trophy, Sparkles
} from 'lucide-react'
import FormCoachModal from './form-coach-modal'

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────
interface Exercise {
  name: string
  reps: string
  tip: string
}

interface ChallengeDay {
  day: number
  week: number
  title: string
  focus: string
  duration: string
  calories: number
  emoji: string
  thumb: string
  isRest: boolean
  warmup: Exercise[]
  work: Exercise[]
  cooldown: Exercise[]
}

// ─────────────────────────────────────────────────────────
// PROGRAM DATA — 28 DAYS × 15 MIN
// Each session: 2 min warm-up · 11 min work · 2 min cool-down
// ─────────────────────────────────────────────────────────
const DAYS: ChallengeDay[] = [
  // ── WEEK 1: BUILD THE HABIT ──────────────────────────
  {
    day: 1, week: 1, emoji: '🌅', thumb: '/artifacts/morning-challenge/jumping_jacks.jpg', isRest: false,
    title: 'Day 1 — Wake Up',
    focus: 'Full Body Activation',
    duration: '15 min', calories: 90,
    warmup: [
      { name: 'Arm Circles', reps: '30 sec', tip: 'Loosen your shoulders slowly' },
      { name: 'Neck Rolls', reps: '30 sec', tip: 'Gentle, controlled movement' },
      { name: 'Hip Circles', reps: '30 sec', tip: 'Stand with feet shoulder-width' },
      { name: 'Light March', reps: '30 sec', tip: 'Lift your knees to waist height' },
    ],
    work: [
      { name: 'Jumping Jacks', reps: '3 × 20', tip: 'Land softly on your toes' },
      { name: 'Bodyweight Squats', reps: '3 × 15', tip: 'Keep chest up, knees behind toes' },
      { name: 'Wall Push-Up', reps: '2 × 10', tip: 'Great for beginners — modify if needed' },
    ],
    cooldown: [
      { name: 'Standing Quad Stretch', reps: '30 sec each leg', tip: 'Hold a wall for balance' },
      { name: 'Seated Hamstring Stretch', reps: '45 sec', tip: 'Sit tall, reach for toes gently' },
      { name: 'Deep Breathing', reps: '45 sec', tip: 'Inhale 4s, hold 2s, exhale 6s' },
    ],
  },
  {
    day: 2, week: 1, emoji: '💪', thumb: '/artifacts/morning-challenge/push_ups.jpg', isRest: false,
    title: 'Push Foundation',
    focus: 'Chest & Triceps',
    duration: '15 min', calories: 100,
    warmup: [
      { name: 'Arm Circles', reps: '30 sec', tip: 'Forward and backward' },
      { name: 'Chest Opener Stretch', reps: '30 sec', tip: 'Clasp hands behind back, squeeze' },
      { name: 'Cat-Cow Stretch', reps: '60 sec', tip: 'On hands and knees, breathe through each rep' },
    ],
    work: [
      { name: 'Push-Ups', reps: '3 × 8', tip: 'Keep your core tight, elbows at 45°' },
      { name: 'Plank Hold', reps: '3 × 20 sec', tip: 'Hips level — squeeze glutes and core' },
      { name: 'Tricep Dips (Chair)', reps: '2 × 10', tip: 'Fingers forward, lower slowly' },
    ],
    cooldown: [
      { name: 'Cross-Body Shoulder Stretch', reps: '30 sec each', tip: 'Keep arm straight across chest' },
      { name: 'Chest Wall Stretch', reps: '30 sec each side', tip: 'Place palm on wall, rotate away' },
      { name: 'Child\'s Pose', reps: '60 sec', tip: 'Arms extended, forehead to floor' },
    ],
  },
  {
    day: 3, week: 1, emoji: '🦵', thumb: '/artifacts/morning-challenge/wall_sit.jpg', isRest: false,
    title: 'Leg Intro',
    focus: 'Quads & Glutes',
    duration: '15 min', calories: 110,
    warmup: [
      { name: 'Leg Swings', reps: '30 sec each leg', tip: 'Front-to-back, hold wall for balance' },
      { name: 'Hip Circles', reps: '45 sec', tip: 'Wide, slow circles both directions' },
      { name: 'Light Bodyweight Squats', reps: '10 reps', tip: 'Just warming up — no rushing' },
    ],
    work: [
      { name: 'Forward Lunges', reps: '3 × 10 each leg', tip: 'Front knee stays over ankle' },
      { name: 'Glute Bridge', reps: '3 × 15', tip: 'Squeeze glutes at top, hold 1 sec' },
      { name: 'Wall Sit', reps: '2 × 20 sec', tip: 'Thighs parallel to floor, back flat' },
    ],
    cooldown: [
      { name: 'Pigeon Pose', reps: '45 sec each side', tip: 'Hip-flexor release — go as deep as comfortable' },
      { name: 'Standing Calf Stretch', reps: '30 sec each', tip: 'Heel on floor, lean into wall' },
      { name: 'Lying Quad Stretch', reps: '30 sec each', tip: 'Pull heel toward glute gently' },
    ],
  },
  {
    day: 4, week: 1, emoji: '🧘', thumb: '/artifacts/morning-challenge/glute_bridge.jpg', isRest: true,
    title: 'Active Recovery',
    focus: 'Mobility & Breathing',
    duration: '15 min', calories: 40,
    warmup: [],
    work: [
      { name: 'Full Body Stretch Flow', reps: '5 min', tip: 'Move through each major muscle group slowly' },
      { name: 'Deep Breathing Exercises', reps: '5 min', tip: 'Box breathing: 4 in · 4 hold · 4 out · 4 hold' },
      { name: 'Gentle Walk (or March in Place)', reps: '5 min', tip: 'Light movement keeps blood flowing' },
    ],
    cooldown: [],
  },
  {
    day: 5, week: 1, emoji: '🔥', thumb: '/artifacts/morning-challenge/squats.jpg', isRest: false,
    title: 'Full Body Wake-Up',
    focus: 'Cardio + Strength',
    duration: '15 min', calories: 130,
    warmup: [
      { name: 'Jumping Jacks', reps: '45 sec', tip: 'Get the heart rate up from the start' },
      { name: 'Hip Opener Circles', reps: '30 sec', tip: 'Large slow circles each direction' },
    ],
    work: [
      { name: 'Jumping Jacks', reps: '3 × 20', tip: 'Land softly every rep' },
      { name: 'Push-Ups', reps: '3 × 10', tip: 'Control the descent — 2 seconds down' },
      { name: 'Bodyweight Squats', reps: '3 × 20', tip: 'Drive through your heels on the way up' },
      { name: 'Plank', reps: '2 × 25 sec', tip: 'Breathe normally, don\'t hold your breath' },
    ],
    cooldown: [
      { name: 'Forward Fold Stretch', reps: '45 sec', tip: 'Bend knees slightly if hamstrings are tight' },
      { name: 'Cobra Stretch', reps: '30 sec', tip: 'Gentle — feel the stretch in abs and chest' },
    ],
  },
  {
    day: 6, week: 1, emoji: '💥', thumb: '/artifacts/morning-challenge/crunches.jpg', isRest: false,
    title: 'Core Intro',
    focus: 'Abs & Stability',
    duration: '15 min', calories: 105,
    warmup: [
      { name: 'Cat-Cow Stretch', reps: '60 sec', tip: 'Warms the spine before core work' },
      { name: 'Dead Bug (slow)', reps: '5 each side', tip: 'Lower back pressed firmly to floor' },
    ],
    work: [
      { name: 'Crunches', reps: '3 × 15', tip: 'Exhale as you crunch up — feel the squeeze' },
      { name: 'Mountain Climbers', reps: '2 × 20', tip: 'Keep hips level, drive knees in fast' },
      { name: 'Plank Hold', reps: '3 × 25 sec', tip: 'Every rep counts — fight to stay flat' },
      { name: 'Leg Raises', reps: '2 × 10', tip: 'Lower back flat on floor at all times' },
    ],
    cooldown: [
      { name: 'Child\'s Pose', reps: '60 sec', tip: 'Arms extended, relax the lower back' },
      { name: 'Lying Spinal Twist', reps: '30 sec each side', tip: 'Let gravity pull knee to floor' },
    ],
  },
  {
    day: 7, week: 1, emoji: '😴', thumb: '/artifacts/morning-challenge/glute_bridge.jpg', isRest: true,
    title: 'Rest & Restore',
    focus: 'Full Rest',
    duration: '—', calories: 0,
    warmup: [], work: [
      { name: 'True Rest Day', reps: '—', tip: 'Your body grows stronger while you rest. Sleep well, eat well, drink water.' },
    ], cooldown: [],
  },

  // ── WEEK 2: FEEL THE BURN ─────────────────────────────
  {
    day: 8, week: 2, emoji: '🔥', thumb: '/artifacts/morning-challenge/diamond_pushups.jpg', isRest: false,
    title: 'Push Power',
    focus: 'Chest, Triceps & Shoulders',
    duration: '15 min', calories: 130,
    warmup: [
      { name: 'Arm Swings', reps: '30 sec', tip: 'Wide, fast swings to warm the chest' },
      { name: 'Shoulder Rolls', reps: '30 sec', tip: 'Full rotation both ways' },
    ],
    work: [
      { name: 'Push-Ups', reps: '3 × 12', tip: 'Full range — chest to floor if you can' },
      { name: 'Wide Push-Ups', reps: '2 × 10', tip: 'Hands wider than shoulders — more chest' },
      { name: 'Tricep Dips (Chair)', reps: '3 × 12', tip: 'Elbows back, not flared' },
      { name: 'Plank Hold', reps: '2 × 30 sec', tip: 'Core braced, breathing steady' },
    ],
    cooldown: [
      { name: 'Doorframe Chest Stretch', reps: '45 sec', tip: 'Elbow at 90°, rotate body away' },
      { name: 'Child\'s Pose', reps: '45 sec', tip: 'Decompress the spine and shoulder blades' },
    ],
  },
  {
    day: 9, week: 2, emoji: '🦵', thumb: '/artifacts/morning-challenge/jump_squats.jpg', isRest: false,
    title: 'Leg Burner',
    focus: 'Quads, Hamstrings & Calves',
    duration: '15 min', calories: 145,
    warmup: [
      { name: 'Light Squats', reps: '10 reps', tip: 'Slow and controlled, feel each rep' },
      { name: 'Leg Swings', reps: '30 sec each leg', tip: 'Front-back and side-to-side' },
    ],
    work: [
      { name: 'Bodyweight Squats', reps: '3 × 20', tip: 'Go as low as flexibility allows' },
      { name: 'Jump Squats', reps: '3 × 10', tip: 'Soft landing — toes first, bend knees' },
      { name: 'Reverse Lunges', reps: '2 × 12 each leg', tip: 'Back knee nearly touches floor' },
      { name: 'Calf Raises', reps: '3 × 20', tip: 'Full range — all the way up and down' },
    ],
    cooldown: [
      { name: 'Standing Hamstring Stretch', reps: '45 sec each leg', tip: 'Hinge at hip, back flat' },
      { name: 'Calf Stretch', reps: '30 sec each', tip: 'Heel pressed firmly to floor' },
    ],
  },
  {
    day: 10, week: 2, emoji: '🧱', thumb: '/artifacts/morning-challenge/side_plank.jpg', isRest: false,
    title: 'Core Blast',
    focus: 'Full Core Burn',
    duration: '15 min', calories: 120,
    warmup: [
      { name: 'Cat-Cow', reps: '60 sec', tip: 'Warm the spine deliberately' },
      { name: 'Pelvic Tilts', reps: '10 reps', tip: 'Lying on back — flatten lower back to floor' },
    ],
    work: [
      { name: 'Plank', reps: '3 × 35 sec', tip: 'Maintain perfect form — quality over time' },
      { name: 'Crunches', reps: '3 × 20', tip: 'Slow and controlled, exhale at top' },
      { name: 'Mountain Climbers', reps: '3 × 25', tip: 'Keep hips down — it\'s not a plank jump' },
      { name: 'Leg Raises', reps: '3 × 12', tip: 'Press lower back into floor' },
    ],
    cooldown: [
      { name: 'Cobra Stretch', reps: '45 sec', tip: 'Extend through the abs and hip flexors' },
      { name: 'Lying Spinal Twist', reps: '30 sec each', tip: 'Let the knee fall naturally' },
    ],
  },
  {
    day: 11, week: 2, emoji: '⚡', thumb: '/artifacts/morning-challenge/high_knees.jpg', isRest: false,
    title: 'HIIT Intro',
    focus: 'Cardio & Fat Burn',
    duration: '15 min', calories: 160,
    warmup: [
      { name: 'March in Place', reps: '45 sec', tip: 'Get blood flowing before the sprint' },
      { name: 'Hip Circles', reps: '30 sec', tip: 'Loosen the hip flexors' },
    ],
    work: [
      { name: 'High Knees', reps: '4 × 30 sec', tip: 'Drive arms — coordination is cardio' },
      { name: 'Jumping Jacks', reps: '4 × 25', tip: 'Stay on your toes throughout' },
      { name: 'Burpees', reps: '3 × 5', tip: 'Beginners: step feet back instead of jumping' },
    ],
    cooldown: [
      { name: 'Forward Fold', reps: '45 sec', tip: 'Shake out the legs gently' },
      { name: 'Seated Deep Breathing', reps: '60 sec', tip: 'Heart rate should drop in 1–2 min' },
    ],
  },
  {
    day: 12, week: 2, emoji: '🌊', thumb: '/artifacts/morning-challenge/burpees.jpg', isRest: false,
    title: 'Full Body Flow',
    focus: 'Strength + Cardio Mix',
    duration: '15 min', calories: 150,
    warmup: [
      { name: 'Jumping Jacks', reps: '30 sec', tip: 'Light cardio to open up' },
      { name: 'Arm Circles', reps: '30 sec', tip: 'Both directions' },
    ],
    work: [
      { name: 'Burpees', reps: '3 × 7', tip: 'The king of bodyweight — own it' },
      { name: 'Push-Ups', reps: '3 × 12', tip: 'Perfect form — slow the descent' },
      { name: 'Squats', reps: '3 × 20', tip: 'Drive the knees out, chest up' },
      { name: 'Side Plank', reps: '2 × 20 sec each', tip: 'Stack feet or stagger for easier balance' },
    ],
    cooldown: [
      { name: 'Thread the Needle Stretch', reps: '30 sec each', tip: 'Rotational shoulder and spine release' },
      { name: 'Hip Flexor Lunge Stretch', reps: '30 sec each', tip: 'Back knee on floor, lean forward' },
    ],
  },
  {
    day: 13, week: 2, emoji: '🦸', thumb: '/artifacts/morning-challenge/superman.jpg', isRest: false,
    title: 'Back & Core',
    focus: 'Posterior Chain',
    duration: '15 min', calories: 115,
    warmup: [
      { name: 'Cat-Cow', reps: '60 sec', tip: 'Slowly warm the entire spine' },
      { name: 'Glute Bridges (slow)', reps: '10 reps', tip: 'Activate the posterior chain' },
    ],
    work: [
      { name: 'Superman Hold', reps: '3 × 12', tip: 'Lift arms and legs simultaneously, hold 2 sec' },
      { name: 'Side Plank', reps: '3 × 25 sec each', tip: 'Elbow directly under shoulder' },
      { name: 'Glute Bridge', reps: '3 × 20', tip: 'Single-leg variation for advanced' },
      { name: 'Dead Bug', reps: '3 × 8 each side', tip: 'Slow, controlled, lower back never leaves floor' },
    ],
    cooldown: [
      { name: 'Child\'s Pose', reps: '60 sec', tip: 'Deep lower back release' },
      { name: 'Pigeon Pose', reps: '30 sec each', tip: 'Hip flexor and glute stretch' },
    ],
  },
  {
    day: 14, week: 2, emoji: '😴', thumb: '/artifacts/morning-challenge/glute_bridge.jpg', isRest: true,
    title: 'Rest & Restore',
    focus: 'Full Rest',
    duration: '—', calories: 0,
    warmup: [], work: [
      { name: 'True Rest Day', reps: '—', tip: 'Week 2 complete. You\'re building a habit. Rest and recover.' },
    ], cooldown: [],
  },

  // ── WEEK 3: STRENGTH ──────────────────────────────────
  {
    day: 15, week: 3, emoji: '💎', thumb: '/artifacts/morning-challenge/diamond_pushups.jpg', isRest: false,
    title: 'Push Circuit',
    focus: 'Chest & Shoulders Peak',
    duration: '15 min', calories: 145,
    warmup: [
      { name: 'Push-Up Hold (top position)', reps: '20 sec', tip: 'Shoulder activation before load' },
      { name: 'Shoulder Rotations', reps: '30 sec', tip: 'External rotation to protect the joint' },
    ],
    work: [
      { name: 'Push-Ups', reps: '3 × 15', tip: 'Volume is climbing — feel the progress' },
      { name: 'Diamond Push-Ups', reps: '3 × 8', tip: 'Hands in a triangle — maximum tricep' },
      { name: 'Pike Push-Ups', reps: '3 × 8', tip: 'Hips high, push head toward floor between hands' },
      { name: 'Plank', reps: '3 × 40 sec', tip: 'You\'ve earned a longer hold' },
    ],
    cooldown: [
      { name: 'Doorframe Chest Stretch', reps: '45 sec', tip: 'Feel the chest open fully' },
      { name: 'Tricep Overhead Stretch', reps: '30 sec each', tip: 'Elbow by ear, push back with other hand' },
    ],
  },
  {
    day: 16, week: 3, emoji: '🚀', thumb: '/artifacts/morning-challenge/jump_squats.jpg', isRest: false,
    title: 'Leg Power',
    focus: 'Explosive Legs',
    duration: '15 min', calories: 175,
    warmup: [
      { name: 'Leg Swings', reps: '30 sec each', tip: 'Dynamic — not static' },
      { name: 'Shallow Squats', reps: '10 reps', tip: 'Warm the knees gradually' },
    ],
    work: [
      { name: 'Jump Squats', reps: '4 × 12', tip: 'Explode up, land like a feather' },
      { name: 'Reverse Lunges', reps: '3 × 15 each leg', tip: 'Controlled descent, push through front heel' },
      { name: 'Glute Bridge Pulses', reps: '3 × 25', tip: 'Stay elevated, small quick pulses' },
      { name: 'Lateral Squats', reps: '2 × 12 each side', tip: 'Sit back into one hip at a time' },
    ],
    cooldown: [
      { name: 'Pigeon Pose', reps: '45 sec each', tip: 'Earned after explosive leg day' },
      { name: 'Lying Hamstring Stretch', reps: '45 sec each', tip: 'Loop towel around foot if needed' },
    ],
  },
  {
    day: 17, week: 3, emoji: '🧱', thumb: '/artifacts/morning-challenge/bicycle_crunches.jpg', isRest: false,
    title: 'Core Max',
    focus: 'Plank Variations & Abs',
    duration: '15 min', calories: 130,
    warmup: [
      { name: 'Dead Bug (slow)', reps: '8 each side', tip: 'Activate the transverse abdominis' },
      { name: 'Pelvic Tilts', reps: '10 reps', tip: 'Engage deep core before planks' },
    ],
    work: [
      { name: 'Forearm Plank', reps: '3 × 45 sec', tip: 'You\'re getting stronger — hold it' },
      { name: 'Side Plank', reps: '3 × 30 sec each', tip: 'Raise top arm for extra challenge' },
      { name: 'Bicycle Crunches', reps: '3 × 20', tip: 'Slow rotation — feel each oblique crunch' },
      { name: 'Leg Raises', reps: '3 × 15', tip: 'Pause at bottom just before your feet touch' },
    ],
    cooldown: [
      { name: 'Cobra Stretch', reps: '45 sec', tip: 'Full range — lengthen the anterior core' },
      { name: 'Child\'s Pose', reps: '60 sec', tip: 'Let the lower back breathe' },
    ],
  },
  {
    day: 18, week: 3, emoji: '🧘', thumb: '/artifacts/morning-challenge/superman.jpg', isRest: true,
    title: 'Active Recovery',
    focus: 'Mobility Flow',
    duration: '15 min', calories: 45,
    warmup: [],
    work: [
      { name: 'Hip Mobility Flow', reps: '5 min', tip: 'World\'s greatest stretch, pigeon, lizard pose' },
      { name: 'Thoracic Spine Rotations', reps: '5 min', tip: 'Thread-the-needle stretch, each side' },
      { name: 'Deep Breathing', reps: '5 min', tip: 'Diaphragmatic breathing — belly rises, not chest' },
    ],
    cooldown: [],
  },
  {
    day: 19, week: 3, emoji: '⚡', thumb: '/artifacts/morning-challenge/burpees.jpg', isRest: false,
    title: 'HIIT Blast',
    focus: 'Cardio & Fat Burn',
    duration: '15 min', calories: 185,
    warmup: [
      { name: 'High Knees (slow)', reps: '30 sec', tip: 'Gradual ramp-up before the sprint' },
      { name: 'Arm Circles + Jumps', reps: '30 sec', tip: 'Get the whole body warm' },
    ],
    work: [
      { name: 'Burpees', reps: '4 × 10', tip: 'Week 3 — no step-backs. Jump everything.' },
      { name: 'High Knees', reps: '4 × 30 sec', tip: 'Drive arms hard — run on the spot' },
      { name: 'Mountain Climbers', reps: '3 × 30', tip: 'Fast as possible — this is cardio, not plank' },
    ],
    cooldown: [
      { name: 'Forward Fold', reps: '60 sec', tip: 'Let the spine decompress after all that impact' },
      { name: 'Seated Breathing', reps: '60 sec', tip: 'Nasal inhale, exhale through mouth' },
    ],
  },
  {
    day: 20, week: 3, emoji: '💪', thumb: '/artifacts/morning-challenge/pike_pushups.jpg', isRest: false,
    title: 'Upper Body Strength',
    focus: 'Push-Up Variations',
    duration: '15 min', calories: 160,
    warmup: [
      { name: 'Arm Circles', reps: '30 sec', tip: 'Both arms, both directions' },
      { name: 'Wrist Circles', reps: '20 sec', tip: 'Push-up prep — protect the wrists' },
    ],
    work: [
      { name: 'Standard Push-Ups', reps: '3 × 15', tip: 'Tempo 2-0-1 (2 sec down, explode up)' },
      { name: 'Wide Push-Ups', reps: '3 × 12', tip: 'Elbows flared wider for chest emphasis' },
      { name: 'Diamond Push-Ups', reps: '3 × 10', tip: 'Lock elbows at top — squeeze triceps' },
      { name: 'Superman Hold', reps: '3 × 15', tip: 'Back strengthens while chest rests' },
    ],
    cooldown: [
      { name: 'Child\'s Pose', reps: '45 sec', tip: 'Extended arms — stretch the lats' },
      { name: 'Cross-Body Shoulder Stretch', reps: '30 sec each', tip: 'Pull arm across chest' },
    ],
  },
  {
    day: 21, week: 3, emoji: '😴', thumb: '/artifacts/morning-challenge/glute_bridge.jpg', isRest: true,
    title: 'Rest & Restore',
    focus: 'Full Rest',
    duration: '—', calories: 0,
    warmup: [], work: [
      { name: 'True Rest Day', reps: '—', tip: 'Week 3 complete. One week left. Rest hard.' },
    ], cooldown: [],
  },

  // ── WEEK 4: PEAK ──────────────────────────────────────
  {
    day: 22, week: 4, emoji: '🏔️', thumb: '/artifacts/morning-challenge/burpees.jpg', isRest: false,
    title: 'Power Circuit',
    focus: 'Maximum Full Body',
    duration: '15 min', calories: 200,
    warmup: [
      { name: 'Dynamic Squat + Reach', reps: '45 sec', tip: 'Squat down, reach arms overhead, stand' },
      { name: 'High Knees', reps: '30 sec', tip: 'Warm-up at 70% — peak week starts now' },
    ],
    work: [
      { name: 'Burpees', reps: '4 × 12', tip: 'Peak week — maximum controlled effort' },
      { name: 'Jump Squats', reps: '4 × 15', tip: 'Land soft every single rep' },
      { name: 'Push-Ups', reps: '4 × 15', tip: 'Controlled descent, explosive push' },
      { name: 'Plank', reps: '2 × 50 sec', tip: 'Hold what you earned over 3 weeks' },
    ],
    cooldown: [
      { name: 'Full Body Stretch Flow', reps: '2 min', tip: 'Move through every major muscle — you earned it' },
    ],
  },
  {
    day: 23, week: 4, emoji: '🔱', thumb: '/artifacts/morning-challenge/wall_sit.jpg', isRest: false,
    title: 'Leg Dominator',
    focus: 'Ultimate Leg Day',
    duration: '15 min', calories: 190,
    warmup: [
      { name: 'Leg Swings', reps: '30 sec each', tip: 'Full range — forward, back, and lateral' },
      { name: 'Shallow Squats', reps: '15 reps', tip: 'Gradually increase range' },
    ],
    work: [
      { name: 'Jump Squats', reps: '4 × 15', tip: 'Explode — this is your peak week' },
      { name: 'Jump Lunges', reps: '3 × 10 each leg', tip: 'Alternate legs in the air — stay light' },
      { name: 'Wall Sit', reps: '3 × 45 sec', tip: 'Maintain 90° — breathe through it' },
      { name: 'Single-Leg Glute Bridge', reps: '3 × 12 each', tip: 'Full hip extension at top' },
    ],
    cooldown: [
      { name: 'Pigeon Pose', reps: '60 sec each', tip: 'After explosive work — this is essential' },
      { name: 'Hamstring Stretch', reps: '45 sec each', tip: 'Slow breath, let the muscle relax' },
    ],
  },
  {
    day: 24, week: 4, emoji: '🧱', thumb: '/artifacts/morning-challenge/side_plank.jpg', isRest: false,
    title: 'Core Finisher',
    focus: 'Abs Max Effort',
    duration: '15 min', calories: 150,
    warmup: [
      { name: 'Pelvic Tilts', reps: '10 reps', tip: 'Activate the deep core before loading' },
    ],
    work: [
      { name: 'Forearm Plank', reps: '4 × 60 sec', tip: 'Peak hold — you\'ve been building to this' },
      { name: 'Bicycle Crunches', reps: '4 × 25', tip: 'Slow rotation — twist from the obliques' },
      { name: 'Leg Raises', reps: '4 × 20', tip: 'Pause at bottom — control the negative' },
      { name: 'Mountain Climbers', reps: '3 × 35', tip: 'Full speed — burn everything' },
    ],
    cooldown: [
      { name: 'Cobra Stretch', reps: '60 sec', tip: 'Lengthen the anterior chain' },
      { name: 'Lying Spinal Twist', reps: '45 sec each', tip: 'Decompress after all that core work' },
    ],
  },
  {
    day: 25, week: 4, emoji: '🧘', thumb: '/artifacts/morning-challenge/superman.jpg', isRest: true,
    title: 'Active Recovery',
    focus: 'Final Prep',
    duration: '15 min', calories: 40,
    warmup: [],
    work: [
      { name: 'Full Body Mobility Flow', reps: '5 min', tip: 'Prepare every joint for the final 3 days' },
      { name: 'Foam Roll or Self-Massage', reps: '5 min', tip: 'Focus on quads, calves, and back' },
      { name: 'Visualization & Breathing', reps: '5 min', tip: 'Picture Day 28. You\'re almost there.' },
    ],
    cooldown: [],
  },
  {
    day: 26, week: 4, emoji: '🌪️', thumb: '/artifacts/morning-challenge/high_knees.jpg', isRest: false,
    title: 'HIIT Final',
    focus: 'Maximum Cardio Burn',
    duration: '15 min', calories: 210,
    warmup: [
      { name: 'High Knees (slow build)', reps: '45 sec', tip: 'Gradual ramp to max effort' },
    ],
    work: [
      { name: 'Burpees', reps: '5 × 10', tip: 'Final HIIT session — full effort every rep' },
      { name: 'High Knees', reps: '5 × 30 sec', tip: 'Sprint-level intensity' },
      { name: 'Mountain Climbers', reps: '4 × 35', tip: 'No resting between sets — push through' },
    ],
    cooldown: [
      { name: 'Full Stretch Flow', reps: '2 min', tip: 'Honor the work — stretch everything' },
    ],
  },
  {
    day: 27, week: 4, emoji: '👑', thumb: '/artifacts/morning-challenge/pike_pushups.jpg', isRest: false,
    title: 'Upper Body Final',
    focus: 'Push Everything',
    duration: '15 min', calories: 185,
    warmup: [
      { name: 'Dynamic Arm Swings', reps: '30 sec', tip: 'Full range, fast and controlled' },
      { name: 'Plank Position Hold', reps: '20 sec', tip: 'Shoulder activation before loading' },
    ],
    work: [
      { name: 'Push-Ups', reps: '4 × 20', tip: 'Final push day. You know how.' },
      { name: 'Diamond Push-Ups', reps: '3 × 15', tip: 'Triceps on fire — embrace it' },
      { name: 'Pike Push-Ups', reps: '3 × 12', tip: 'Final shoulder press — full range' },
      { name: 'Superman Hold', reps: '4 × 20', tip: 'Strong back carries you through day 28' },
      { name: 'Plank', reps: '2 × 60 sec', tip: 'Final plank of the challenge' },
    ],
    cooldown: [
      { name: 'Child\'s Pose', reps: '60 sec', tip: 'Last rest before the final day' },
    ],
  },
  {
    day: 28, week: 4, emoji: '🏆', thumb: '/artifacts/morning-challenge/day28_trophy.jpg', isRest: false,
    title: '🏆 Day 28 — DONE',
    focus: 'Full Body Challenge',
    duration: '15 min', calories: 220,
    warmup: [
      { name: 'Everything from Day 1', reps: '2 min', tip: 'This is your victory lap — enjoy every second' },
    ],
    work: [
      { name: 'Jumping Jacks', reps: '3 × 25', tip: 'Day 1 — but stronger' },
      { name: 'Push-Ups', reps: '3 × 20', tip: 'Day 2 — but with 4 weeks of strength' },
      { name: 'Squats', reps: '3 × 25', tip: 'Day 3 — but explosive now' },
      { name: 'Burpees', reps: '3 × 10', tip: 'Week 2 — now it feels easy' },
      { name: 'Plank', reps: '2 × 60 sec', tip: 'Hold with pride. You earned this.' },
    ],
    cooldown: [
      { name: 'Full Body Stretch', reps: '2 min', tip: 'Breathe. You did 28 days. You are different.' },
    ],
  },
]

// ─────────────────────────────────────────────────────────
// WEEK LABELS
// ─────────────────────────────────────────────────────────
const WEEKS = [
  { week: 1, label: 'Week 1 — Build the Habit',    color: 'from-amber-500/20 to-orange-500/10',   accent: 'text-amber-400',  border: 'border-amber-500/30' },
  { week: 2, label: 'Week 2 — Feel the Burn',      color: 'from-orange-500/20 to-red-500/10',     accent: 'text-orange-400', border: 'border-orange-500/30' },
  { week: 3, label: 'Week 3 — Get Stronger',       color: 'from-red-500/20 to-rose-500/10',       accent: 'text-red-400',    border: 'border-red-500/30' },
  { week: 4, label: 'Week 4 — Peak & Prove It',    color: 'from-rose-500/20 to-primary/10',       accent: 'text-primary',    border: 'border-primary/40' },
]

// ─────────────────────────────────────────────────────────
// MOCK PROGRESS — In production this would come from Supabase
// ─────────────────────────────────────────────────────────
const COMPLETED_DAYS: number[] = [1, 2, 3]
const CURRENT_DAY = 4

// ─────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────
export default function MorningChallengeContent() {
  const router = useRouter()
  const [selectedDay, setSelectedDay] = useState<ChallengeDay | null>(null)
  const [activeCoachExercise, setActiveCoachExercise] = useState<string | null>(null)
  const [completedDays, setCompletedDays] = useState<number[]>([])
  const [justCompletedDay, setJustCompletedDay] = useState<number | null>(null)

  // Load persisted completed days from localStorage on mount (defaults to empty: Day 1 only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('samfit_morning_completed_days')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setCompletedDays(parsed)
        }
      }
    } catch (e) {
      console.error('Failed to load completed days from localStorage', e)
    }
  }, [])

  const currentDay = Math.min(28, completedDays.length + 1)
  const completedCount = completedDays.length
  const progressPercent = (completedCount / 28) * 100
  const currentDayData = DAYS.find(d => d.day === currentDay)

  const handleCompleteDay = (dayNumber: number) => {
    if (!completedDays.includes(dayNumber)) {
      const updated = [...completedDays, dayNumber].sort((a, b) => a - b)
      setCompletedDays(updated)
      try {
        localStorage.setItem('samfit_morning_completed_days', JSON.stringify(updated))
      } catch (e) {
        console.error('Failed to save to localStorage', e)
      }
      setJustCompletedDay(dayNumber)
      setTimeout(() => setJustCompletedDay(null), 4000)
    }
    setSelectedDay(null)
  }

  const handleResetChallenge = () => {
    if (confirm('Are you sure you want to reset your 28-day morning challenge to Day 1?')) {
      setCompletedDays([])
      try {
        localStorage.removeItem('samfit_morning_completed_days')
      } catch (e) {
        console.error('Failed to clear localStorage', e)
      }
      setSelectedDay(null)
    }
  }

  return (
    <div className="min-h-screen pb-36 text-foreground">
      <div className="max-w-3xl mx-auto">

        {/* ── CONGRATULATIONS TOAST ── */}
        <AnimatePresence>
          {justCompletedDay && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-4 rounded-2xl border border-emerald-500/50 bg-gradient-to-r from-emerald-950/80 to-black p-4 flex items-center justify-between gap-3 shadow-[0_10px_40px_rgba(16,185,129,0.3)]"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500/20 p-2 text-emerald-400 border border-emerald-500/40">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-sm font-black text-white">
                    🎉 Day {justCompletedDay} Completed!
                  </div>
                  <div className="text-xs text-emerald-300 font-medium mt-0.5">
                    {justCompletedDay < 28 ? `Day ${justCompletedDay + 1} is now unlocked!` : 'You completed the entire 28-Day Challenge! 🏆'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setJustCompletedDay(null)}
                className="text-white/60 hover:text-white text-xs px-2 py-1"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── INTERACTIVE FORM ANIMATION BANNER ── */}
        <div className="mb-4 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/20 p-2.5 text-amber-400 border border-amber-500/30 flex-shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                  MOTION COACH
                </span>
                <span className="text-xs font-bold text-white">Live Form Motion Animations</span>
              </div>
              <p className="text-[11px] text-foreground/70 font-medium mt-0.5">
                Every exercise now includes a looping animated GIF with breathing & biomechanics cues.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveCoachExercise('push-up')}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-4 py-2 rounded-xl text-xs font-black shadow-[0_4px_16px_rgba(245,158,11,0.3)] hover:brightness-110 transition-all cursor-pointer flex-shrink-0"
          >
            <Play className="h-3.5 w-3.5 fill-black" />
            Browse Form Animations
          </button>
        </div>

        {/* ── HERO HEADER ─────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl mb-6">
          {/* Sunrise gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/70 via-[#0d0b08] to-[#08080a]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full bg-amber-500/15 blur-[80px] pointer-events-none" />

          <div className="relative z-10 px-5 pt-6 pb-6 border border-amber-500/20 rounded-3xl">
            {/* Top Bar with Back and Reset */}
            <div className="mb-5 flex items-center justify-between">
              <button
                onClick={() => router.push('/workout')}
                className="flex items-center gap-1.5 text-xs font-bold text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> Back to Programs
              </button>

              {completedDays.length > 0 && (
                <button
                  onClick={handleResetChallenge}
                  className="font-mono text-[10px] font-bold text-foreground/50 hover:text-rose-400 bg-white/5 hover:bg-rose-500/10 border border-white/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  ↺ Reset to Day 1
                </button>
              )}
            </div>

            {/* Badge */}
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/15 p-1.5">
                <Sun className="h-4 w-4 text-amber-400" />
              </div>
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">
                Morning Challenge · No Equipment
              </span>
            </div>

            <h1 className="mb-1 font-display text-3xl md:text-4xl font-black tracking-tight text-foreground leading-[1.1]">
              28-DAY HOME<br />
              <span className="text-amber-400">MORNING</span> CHALLENGE
            </h1>
            <p className="mb-5 text-xs md:text-sm font-medium text-foreground/60">
              Calisthenics · 15 min every morning · 100% bodyweight · Animated Form Guide
            </p>

            {/* Stats Row */}
            <div className="mb-5 grid grid-cols-3 gap-3">
              {[
                { icon: <Clock className="h-3.5 w-3.5 text-amber-400" />, label: 'Duration', value: '15 min' },
                { icon: <Flame className="h-3.5 w-3.5 text-orange-400" />, label: 'Calories', value: '90–220' },
                { icon: <Target className="h-3.5 w-3.5 text-amber-400" />, label: 'Equipment', value: 'None' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-3">
                  <div className="mb-1 flex items-center gap-1">{s.icon}</div>
                  <div className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">{s.label}</div>
                  <div className="text-xs md:text-sm font-black text-foreground">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Your Progress</span>
              <span className="text-xs font-black text-amber-400">{completedCount} of 28 workouts</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
              />
            </div>
          </div>
        </div>

        {/* ── START CTA ───────────────────────────────── */}
        {currentDayData && (
          <div className="mb-6">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedDay(currentDayData)}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-4 flex items-center justify-center gap-2.5 font-black text-sm text-black shadow-[0_8px_32px_rgba(245,158,11,0.3)] hover:brightness-110 transition-all cursor-pointer"
            >
              <Play className="h-5 w-5 fill-black" />
              START TODAY&apos;S WORKOUT · Day {currentDay}
            </motion.button>
          </div>
        )}

        {/* ── DAY GRID ────────────────────────────────── */}
        <div className="space-y-6">
          {WEEKS.map(week => {
            const weekDays = DAYS.filter(d => d.week === week.week)
            return (
              <div key={week.week}>
                {/* Week Header */}
                <div className={`mb-3 flex items-center gap-2 rounded-xl border ${week.border} bg-gradient-to-r ${week.color} px-3.5 py-2.5`}>
                  <div className={`font-mono text-[11px] font-black uppercase tracking-[0.18em] ${week.accent}`}>
                    {week.label}
                  </div>
                </div>

                {/* Day Cards — 4 column grid */}
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
                  {weekDays.map(day => {
                    const isDone = completedDays.includes(day.day)
                    const isCurrent = day.day === currentDay
                    const isLocked = day.day > currentDay
                    const canTap = isDone || isCurrent

                    return (
                      <motion.button
                        key={day.day}
                        whileTap={canTap ? { scale: 0.93 } : {}}
                        onClick={() => canTap && setSelectedDay(day)}
                        disabled={isLocked}
                        className={`relative overflow-hidden flex flex-col items-end justify-end rounded-2xl border transition-all aspect-square cursor-pointer
                          ${isCurrent
                            ? 'border-amber-500/90 shadow-[0_0_24px_rgba(245,158,11,0.35)] ring-2 ring-amber-500/40'
                            : isDone
                              ? 'border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                              : 'border-white/[0.05] opacity-45 cursor-not-allowed'
                          }`}
                      >
                        {/* Background image */}
                        <img
                          src={day.thumb}
                          alt={day.title}
                          className={`absolute inset-0 h-full w-full object-cover transition-all ${
                            isLocked ? 'grayscale brightness-40' : isDone ? 'brightness-85' : 'brightness-95'
                          }`}
                        />
                        {/* Dark overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                        {/* Status badge */}
                        <div className="absolute top-2 right-2 z-10">
                          {isDone
                            ? <div className="rounded-full bg-emerald-500 p-0.5"><CheckCircle className="h-3.5 w-3.5 text-black" /></div>
                            : isLocked
                              ? <div className="rounded-full bg-black/60 backdrop-blur-xs p-1 border border-white/10"><Lock className="h-3 w-3 text-white/50" /></div>
                              : isCurrent
                                ? <div className="rounded-full bg-amber-500 p-0.5 shadow-[0_0_10px_rgba(245,158,11,0.8)]"><Zap className="h-3.5 w-3.5 text-black" /></div>
                                : null
                          }
                        </div>

                        {/* Day label at bottom */}
                        <div className="relative z-10 w-full px-2 pb-2">
                          <div className={`font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider ${
                            isCurrent ? 'text-amber-400' : isDone ? 'text-emerald-300' : 'text-white/60'
                          }`}>
                            Day {day.day}
                          </div>

                          {day.isRest && (
                            <div className="text-[8px] font-black text-amber-300/80 uppercase tracking-widest">Rest</div>
                          )}
                        </div>

                        {/* Current day pulse ring */}
                        {isCurrent && (
                          <motion.div
                            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.2, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute inset-0 rounded-2xl border-2 border-amber-400 pointer-events-none"
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

        {/* ── BOTTOM MOTIVATION ───────────────────────── */}
        <div className="mt-8 rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-transparent p-6 text-center">
          <Trophy className="mx-auto mb-2 h-7 w-7 text-amber-400" />
          <div className="font-display text-base font-black text-foreground">15 minutes every morning.</div>
          <div className="mt-1 text-xs font-medium text-foreground/60 max-w-md mx-auto">
            That&apos;s 1% of your day. In 28 days, you&apos;ll be a completely different person.
          </div>
        </div>

      </div>

      {/* ── DAY DETAIL MODAL / DIALOG ── */}
      <AnimatePresence>
        {selectedDay && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDay(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="relative z-[101] w-full md:max-w-xl max-h-[88vh] overflow-y-auto rounded-t-[2rem] md:rounded-[2rem] bg-[#0e0d0b] border border-amber-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Featured Avatar Image Banner */}
              <div className="relative h-48 md:h-56 w-full overflow-hidden">
                <img
                  src={selectedDay.thumb}
                  alt={selectedDay.title}
                  className="h-full w-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d0b] via-[#0e0d0b]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

                {/* Close button */}
                <button
                  onClick={() => setSelectedDay(null)}
                  className="absolute top-4 right-4 z-20 rounded-full bg-black/60 backdrop-blur-md p-2 text-white/80 hover:text-white hover:bg-black/90 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Badge overlay on image */}
                <div className="absolute bottom-3 left-5 z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{selectedDay.emoji}</span>
                    <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-amber-400 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/30">
                      Day {selectedDay.day} · Week {selectedDay.week}
                    </span>
                    {completedDays.includes(selectedDay.day) && (
                      <span className="font-mono text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Completed
                      </span>
                    )}
                  </div>
                  <h2 className="font-display text-2xl font-black tracking-tight text-white drop-shadow-md">
                    {selectedDay.title}
                  </h2>
                </div>
              </div>

              <div className="p-5 md:p-6 pt-2">
                {/* Focus subtitle & stats */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                  <p className="text-xs md:text-sm font-semibold text-foreground/70">{selectedDay.focus}</p>
                  
                  {!selectedDay.isRest && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                        <Clock className="h-3.5 w-3.5" /> {selectedDay.duration}
                      </div>
                      {selectedDay.calories > 0 && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-xl border border-orange-500/20">
                          <Flame className="h-3.5 w-3.5" /> ~{selectedDay.calories} kcal
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Rest Day Message */}
                {selectedDay.isRest ? (
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
                    <div className="mb-3 text-4xl">😴</div>
                    <div className="font-display text-lg font-black text-foreground">Rest & Recovery</div>
                    <p className="mt-2 text-xs md:text-sm font-medium text-foreground/70 leading-relaxed max-w-md mx-auto">
                      {selectedDay.work[0]?.tip}
                    </p>
                    <button
                      onClick={() => handleCompleteDay(selectedDay.day)}
                      className="mt-5 rounded-2xl bg-amber-500/20 border border-amber-500/40 px-6 py-3 font-bold text-xs text-amber-300 hover:bg-amber-500/30 transition-all cursor-pointer"
                    >
                      ✓ Mark Rest Day Completed
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* ── SETS X REPS EDUCATIONAL BANNER ── */}
                    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent p-3.5 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0 mt-0.5">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-amber-300 flex items-center gap-1.5">
                          How Training Notation Works:
                        </div>
                        <p className="text-foreground/80 text-[11px] mt-0.5 leading-relaxed font-medium">
                          <strong>Formula: Sets × Reps</strong> (e.g. <strong>3 × 20</strong> = Do 20 count, rest 30s, repeat for 3 total rounds).
                        </p>
                      </div>
                    </div>

                    {/* Warm-Up */}
                    {selectedDay.warmup.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-amber-400">
                            ☀️ 2 Min Warm-Up (Mobility & Pulse)
                          </span>
                          <div className="h-px flex-1 bg-amber-500/20" />
                        </div>
                        <div className="space-y-2">
                          {selectedDay.warmup.map((ex, i) => (
                            <ExerciseRow 
                              key={i} 
                              ex={ex} 
                              accent="amber" 
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Main Work */}
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-orange-400">
                          🔥 11 Min Main Work · Tap Any Exercise for Animated Form GIF
                        </span>
                        <div className="h-px flex-1 bg-orange-500/20" />
                      </div>
                      <div className="space-y-2">
                        {selectedDay.work.map((ex, i) => (
                          <ExerciseRow 
                            key={i} 
                            ex={ex} 
                            accent="orange" 
                            onOpenFormCoach={() => setActiveCoachExercise(ex.name)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Cool-Down */}
                    {selectedDay.cooldown.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-blue-400">
                            🧊 2 Min Cool-Down (Flexibility & Breathing)
                          </span>
                          <div className="h-px flex-1 bg-blue-500/20" />
                        </div>
                        <div className="space-y-2">
                          {selectedDay.cooldown.map((ex, i) => (
                            <ExerciseRow 
                              key={i} 
                              ex={ex} 
                              accent="blue" 
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Complete / Start Workout Action Button */}
                {!selectedDay.isRest && (
                  <div className="mt-6 space-y-2">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleCompleteDay(selectedDay.day)}
                      className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-4 font-black text-sm text-black shadow-[0_8px_32px_rgba(245,158,11,0.3)] hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {completedDays.includes(selectedDay.day) ? (
                        <>
                          <CheckCircle className="h-4 w-4" /> Day {selectedDay.day} Completed (Tap to Re-Save)
                        </>
                      ) : (
                        <>
                          <Trophy className="h-4 w-4 fill-black" /> Complete Day {selectedDay.day} & Unlock Next Day
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

      {/* ── INTERACTIVE FORM COACH ANIMATION MODAL ── */}
      <FormCoachModal
        isOpen={activeCoachExercise !== null}
        onClose={() => setActiveCoachExercise(null)}
        exerciseQuery={activeCoachExercise ?? undefined}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// HELPER: PARSE REPS EXPLANATION (e.g. 3 × 20 -> 3 Sets of 20 Reps)
// ─────────────────────────────────────────────────────────
function parseRepsDetails(repsStr: string): { badge: string; subtitle: string } {
  const match = repsStr.match(/(\d+)\s*[×x*]\s*(\d+s?)/i)
  if (match) {
    const sets = match[1]
    const count = match[2]
    const isSeconds = count.endsWith('s')
    const unit = isSeconds ? 'sec hold' : 'reps'
    return {
      badge: `${sets} Sets × ${count} ${isSeconds ? '' : 'Reps'}`,
      subtitle: `${sets} rounds of ${count} ${unit} • ~30s rest`,
    }
  }

  if (repsStr.includes('s') || repsStr.includes('sec')) {
    return {
      badge: `${repsStr} Hold`,
      subtitle: `${repsStr} continuous mobility`,
    }
  }

  return {
    badge: repsStr,
    subtitle: repsStr,
  }
}

// ─────────────────────────────────────────────────────────
// EXERCISE ROW SUB-COMPONENT
// ─────────────────────────────────────────────────────────
function ExerciseRow({
  ex,
  accent,
  onOpenFormCoach,
}: {
  ex: Exercise
  accent: 'amber' | 'orange' | 'blue'
  onOpenFormCoach?: () => void
}) {
  const dotColor = {
    amber: 'bg-amber-400',
    orange: 'bg-orange-400',
    blue: 'bg-blue-400',
  }[accent]

  const { badge, subtitle } = parseRepsDetails(ex.reps)

  return (
    <div
      onClick={onOpenFormCoach}
      className={`flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3.5 transition-all ${
        onOpenFormCoach
          ? 'hover:border-amber-500/50 hover:bg-amber-500/10 cursor-pointer group'
          : ''
      }`}
    >
      <div className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${dotColor}`} />
      
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] sm:text-sm font-bold text-foreground group-hover:text-amber-300 transition-colors">
              {ex.name}
            </span>
            {onOpenFormCoach && (
              <span className="inline-flex items-center gap-1 font-mono text-[9px] font-black uppercase text-amber-400 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-md shadow-xs">
                <Sparkles className="h-2.5 w-2.5" /> Watch GIF Form
              </span>
            )}
          </div>

          <div className="flex flex-col sm:items-end">
            <span
              className={`font-mono text-xs font-black ${
                accent === 'amber'
                  ? 'text-amber-400'
                  : accent === 'orange'
                  ? 'text-orange-400'
                  : 'text-blue-400'
              }`}
            >
              {badge}
            </span>
            <span className="text-[10px] text-foreground/50 font-medium">
              {subtitle}
            </span>
          </div>
        </div>

        <p className="mt-1 text-[11px] font-medium text-foreground/60 leading-relaxed">
          {ex.tip}
        </p>
      </div>
    </div>
  )
}

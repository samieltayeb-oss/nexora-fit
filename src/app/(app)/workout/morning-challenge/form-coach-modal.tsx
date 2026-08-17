'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Sparkles, Wind, Gauge, Dumbbell, ShieldCheck, Zap } from 'lucide-react'

export interface ExerciseFormGuide {
  name: string
  title: string
  category: string
  gifSrc: string
  angleInfo: string
  alignmentBadge: string
  breathCue: string
  cadence: string
  focusCue: string
  rules: string[]
}

const EXERCISE_GUIDES: Record<string, ExerciseFormGuide> = {
  'push-up': {
    name: 'Push-Ups',
    title: 'Push-Up Masterclass',
    category: 'Upper Body & Core',
    gifSrc: '/artifacts/morning-challenge/push_up_motion.gif',
    angleInfo: 'Elbows: 45° Arrow · Chest 1" Off Floor',
    alignmentBadge: 'Rigid Head-to-Heels Plank',
    breathCue: 'Inhale Down · Exhale Press',
    cadence: '2s Descent · 1s Explosive Press',
    focusCue: 'Tuck elbows at a 45° angle to protect the rotator cuff. Squeeze glutes so hips do not sag.',
    rules: [
      'Elbows track at 45° (never flare out to 90°).',
      'Chest hovers 1 inch off the floor on every rep.',
      'Squeeze core and glutes to lock your spine straight.',
      'Look 6 inches ahead of hands to keep neck neutral.',
    ],
  },
  'diamond push-up': {
    name: 'Diamond Push-Ups',
    title: 'Diamond Push-Up Guide',
    category: 'Triceps & Inner Chest',
    gifSrc: '/artifacts/morning-challenge/diamond_pushups_motion.gif',
    angleInfo: 'Hands: Index & Thumbs Touching',
    alignmentBadge: 'Maximum Tricep Lockout',
    breathCue: 'Inhale In · Exhale Lockout',
    cadence: '2s Down · 1s Power Drive',
    focusCue: 'Form a triangle/diamond with index fingers and thumbs directly under center chest.',
    rules: [
      'Place hands directly beneath chest center.',
      'Keep elbows pinned tight against your ribs.',
      'Maintain rigid full-body plank throughout.',
      'Lock triceps firmly at the top of each rep.',
    ],
  },
  'pike push-up': {
    name: 'Pike Push-Ups',
    title: 'Pike Push-Up Guide',
    category: 'Anterior Shoulders & Delts',
    gifSrc: '/artifacts/morning-challenge/pike_pushups_motion.gif',
    angleInfo: 'Hips High: Inverted "V" Pike',
    alignmentBadge: 'Vertical Overhead Press Vector',
    breathCue: 'Inhale Down · Exhale Overhead Drive',
    cadence: '2s Lower · 1s Push Back',
    focusCue: 'Push hips up into an inverted V. Lower the crown of your head toward the floor between hands.',
    rules: [
      'Walk feet forward to push hips as high as possible.',
      'Lower head diagonally forward to create a tripod.',
      'Press through palms and push head back through shoulders.',
      'Look at your toes, not your hands, to keep neck safe.',
    ],
  },
  'squat': {
    name: 'Bodyweight Squats',
    title: 'Bodyweight Squat Mastery',
    category: 'Quads, Glutes & Hamstrings',
    gifSrc: '/artifacts/morning-challenge/squats_motion.gif',
    angleInfo: 'Knee Flexion: 90° Parallel or Below',
    alignmentBadge: 'Chest Proud · Spine Neutral',
    breathCue: 'Inhale Sink · Exhale Drive',
    cadence: '2s Descent · 1s Drive Up',
    focusCue: 'Sit hips back and down like sitting in a low chair. Drive knees out tracking over your pinky toes.',
    rules: [
      'Feet shoulder-width apart, toes turned slightly out (5–15°).',
      'Hinge at hips first, then bend knees smoothly.',
      'Keep weight balanced across full foot (drive through heels).',
      'Chest stays upright and proud throughout.',
    ],
  },
  'jump squat': {
    name: 'Jump Squats',
    title: 'Explosive Jump Squat Guide',
    category: 'Explosive Power & Cardio',
    gifSrc: '/artifacts/morning-challenge/jump_squats_motion.gif',
    angleInfo: 'Triple Extension: Hips, Knees, Ankles',
    alignmentBadge: 'Soft Feather Landing',
    breathCue: 'Inhale Sink · Exhale Explode',
    cadence: 'Explosive Jump · Immediate Absorption',
    focusCue: 'Lower to parallel then explode vertically. Land toe-to-heel silently absorbing the impact into next squat.',
    rules: [
      'Squat to full depth before launching upward.',
      'Extend ankles, knees, and hips fully in mid-air.',
      'Land silently on the balls of your feet.',
      'Flow immediately into the next squat descent.',
    ],
  },
  'lunge': {
    name: 'Forward & Reverse Lunges',
    title: 'Lunge Form Masterclass',
    category: 'Legs & Unilateral Balance',
    gifSrc: '/artifacts/morning-challenge/lunges_motion.gif',
    angleInfo: 'Front & Back Knees: 90° Angles',
    alignmentBadge: 'Torso Upright · Hips Square',
    breathCue: 'Inhale Step · Exhale Drive',
    cadence: 'Controlled Step · Powerful Return',
    focusCue: 'Step forward until front thigh is parallel to floor. Back knee hovers 1 inch off ground.',
    rules: [
      'Front knee stays stacked over front ankle (never past toes).',
      'Lower back knee straight down until it almost touches floor.',
      'Push through front heel to return to standing.',
      'Keep hips square and chest tall like a string pulling you up.',
    ],
  },
  'jumping jack': {
    name: 'Jumping Jacks',
    title: 'Jumping Jacks Rhythm',
    category: 'Full Body Cardio Warm-Up',
    gifSrc: '/artifacts/morning-challenge/jumping_jacks_motion.gif',
    angleInfo: 'Arms Overhead: 180° Full Extension',
    alignmentBadge: 'Light On Toes · Soft Ankles',
    breathCue: 'Rhythmic Nasal Breathing',
    cadence: 'Fluid 120-140 BPM Cadence',
    focusCue: 'Stay light on the balls of your feet. Clapped hands overhead, full arm extension.',
    rules: [
      'Land softly on the balls of your feet to protect knees.',
      'Full arm circle — touch hands overhead at top of jump.',
      'Keep knees soft and springy.',
      'Maintain steady, controlled breathing.',
    ],
  },
  'high knees': {
    name: 'High Knees',
    title: 'High Knees Sprint Mechanics',
    category: 'HIIT Cardio & Hip Flexors',
    gifSrc: '/artifacts/morning-challenge/high_knees_motion.gif',
    angleInfo: 'Knee Height: 90° Hip Level',
    alignmentBadge: 'Forward Lean 5° · Pumping Arms',
    breathCue: 'Rhythmic Breathing',
    cadence: 'Max Effort Rapid Turnover',
    focusCue: 'Drive knees up to waist height with explosive arm drive. Stay on your toes with minimal ground contact time.',
    rules: [
      'Drive knees all the way up to hip height (90°).',
      'Pump arms from cheek to back pocket in sync with legs.',
      'Stay on the balls of your feet with rapid ground tap.',
      'Keep core braced to prevent leaning backward.',
    ],
  },
  'burpee': {
    name: 'Burpees',
    title: 'Burpee Movement Flow',
    category: 'Full Body HIIT Conditioning',
    gifSrc: '/artifacts/morning-challenge/burpees_motion.gif',
    angleInfo: 'Floor Plank → Explosive Vertical Jump',
    alignmentBadge: 'Smooth Transition Flow',
    breathCue: 'Exhale On Jump · Inhale On Drop',
    cadence: 'Steady Rhythmic Flow',
    focusCue: 'Drop hands, jump feet back into a plank, jump feet to hands, and explode with arms overhead.',
    rules: [
      'Land in a flat, solid plank without letting hips sag.',
      'Snap feet outside your hands when jumping forward.',
      'Jump vertically with full hip extension and hands overhead.',
      'Beginners can step feet back one by one if needed.',
    ],
  },
  'mountain climber': {
    name: 'Mountain Climbers',
    title: 'Mountain Climber Technique',
    category: 'Core Compression & Cardio',
    gifSrc: '/artifacts/morning-challenge/push_up_motion.gif',
    angleInfo: 'Plank: 180° · Knee Drive: Under Chest',
    alignmentBadge: 'Shoulders Over Wrists',
    breathCue: 'Short Exhale Per Knee Drive',
    cadence: 'Rapid Controlled Alternation',
    focusCue: 'Maintain a rigid push-up plank while driving knees alternately toward your chest like running up a slope.',
    rules: [
      'Keep shoulders stacked directly over hands.',
      'Keep hips level — do not bounce your butt into the air.',
      'Drive knee straight forward under your chest.',
      'Maintain continuous rhythmic pacing.',
    ],
  },
  'crunches': {
    name: 'Core Crunches',
    title: 'Abdominal Crunch Isolation',
    category: 'Upper Abs & Rectus Abdominis',
    gifSrc: '/artifacts/morning-challenge/crunches_motion.gif',
    angleInfo: 'Shoulder Blades: 2-3" Off Mat',
    alignmentBadge: 'Lower Back Glued To Floor',
    breathCue: 'Inhale Down · Exhale Peak Crunch',
    cadence: '1.5s Up · 1s Hold · 1.5s Down',
    focusCue: 'Press lower back flat to mat. Peel shoulder blades up using your abs, not by yanking your neck.',
    rules: [
      'Do not pull on your neck with your hands; support head gently.',
      'Lower back remains in 100% contact with the floor.',
      'Pause at the peak for 1 second to maximize tension.',
      'Exhale completely as you reach the top of the crunch.',
    ],
  },
  'bicycle crunch': {
    name: 'Bicycle Crunches',
    title: 'Bicycle Crunch Oblique Flow',
    category: 'Obliques & Transverse Core',
    gifSrc: '/artifacts/morning-challenge/bicycle_crunches_motion.gif',
    angleInfo: 'Torso Rotation: Rib-to-Opposite-Hip',
    alignmentBadge: 'Continuous Core Tension',
    breathCue: 'Rhythmic Exhale Each Switch',
    cadence: 'Deliberate Slow Twist',
    focusCue: 'Bring opposite elbow to knee while extending other leg straight. Rotate from your ribcage.',
    rules: [
      'Slow and deliberate — never rush bicycle crunches.',
      'Extend the non-working leg straight out at 45° to floor.',
      'Rotate your shoulder across, not just your elbow.',
      'Keep shoulder blades elevated off the floor entire time.',
    ],
  },
  'superman': {
    name: 'Superman Hold',
    title: 'Superman Posterior Chain Guide',
    category: 'Lower Back, Glutes & Traps',
    gifSrc: '/artifacts/morning-challenge/superman_motion.gif',
    angleInfo: 'Limbs Lifted: 4–6" Off Mat',
    alignmentBadge: 'Full Posterior Chain Arch',
    breathCue: 'Inhale Lift · Hold · Exhale',
    cadence: '2s Lift · 2s Isometric Squeeze',
    focusCue: 'Lying on stomach, lift arms, chest, and thighs off the floor simultaneously. Squeeze lower back and glutes.',
    rules: [
      'Lift both arms and legs off the mat at the same time.',
      'Squeeze glutes and mid-back at the peak.',
      'Keep neck in neutral line by looking down at the mat.',
      'Hold the peak for 2 full seconds before lowering slowly.',
    ],
  },
  'glute bridge': {
    name: 'Glute Bridges',
    title: 'Glute Bridge & Hip Extension',
    category: 'Glutes, Hamstrings & Pelvic Core',
    gifSrc: '/artifacts/morning-challenge/glute_bridge_motion.gif',
    angleInfo: 'Hip Angle: 180° Straight Line Knee-to-Shoulder',
    alignmentBadge: 'Maximum Glute Contraction',
    breathCue: 'Inhale Down · Exhale Bridge Up',
    cadence: '2s Lift · 1.5s Peak Squeeze · 2s Down',
    focusCue: 'Drive through your heels to raise hips until your body forms a straight line from knees to shoulders.',
    rules: [
      'Drive through your heels, not your toes.',
      'Squeeze glutes hard at the top without over-arching lower back.',
      'Keep feet flat and knees hip-width apart.',
      'Lower down with control — do not drop your hips.',
    ],
  },
  'side plank': {
    name: 'Side Plank',
    title: 'Side Plank Isometric Alignment',
    category: 'Lateral Core & Obliques',
    gifSrc: '/artifacts/morning-challenge/side_plank_motion.gif',
    angleInfo: 'Body Line: 180° Head-to-Feet Vector',
    alignmentBadge: 'Elbow Stacked Under Shoulder',
    breathCue: 'Steady Diaphragmatic Breath',
    cadence: 'Isometric Timed Hold',
    focusCue: 'Elevate hips on one forearm. Form a straight diagonal line. Squeeze bottom oblique and glutes.',
    rules: [
      'Elbow must sit directly beneath your shoulder.',
      'Do not let the bottom hip sag toward the floor.',
      'Top arm reaches straight to ceiling for balance.',
      'Stack feet or stagger for added balance.',
    ],
  },
  'wall sit': {
    name: 'Isometric Wall Sit',
    title: 'Wall Sit Quad Endurance',
    category: 'Quads & Knee Joint Stability',
    gifSrc: '/artifacts/morning-challenge/squats_motion.gif',
    angleInfo: 'Hips & Knees: Strict 90° Right Angles',
    alignmentBadge: 'Back Flat Against Wall',
    breathCue: 'Deep Inhale · Controlled Exhale',
    cadence: 'Isometric Timed Hold',
    focusCue: 'Slide down until thighs are parallel to the floor. Back flat against the wall, knees over ankles.',
    rules: [
      'Thighs must be completely parallel to the ground (90°).',
      'Knees stacked directly above ankles (never past toes).',
      'Back and head flat against the wall.',
      'Do not rest hands on knees or thighs.',
    ],
  },
}

interface FormCoachModalProps {
  isOpen: boolean
  onClose: () => void
  exerciseQuery?: string
}

export function findExerciseGuide(query?: string): ExerciseFormGuide {
  if (!query) return EXERCISE_GUIDES['push-up']
  const q = query.toLowerCase()
  for (const key of Object.keys(EXERCISE_GUIDES)) {
    if (q.includes(key)) {
      return EXERCISE_GUIDES[key]
    }
  }
  return EXERCISE_GUIDES['push-up']
}

export default function FormCoachModal({ isOpen, onClose, exerciseQuery }: FormCoachModalProps) {
  const [speed, setSpeed] = useState<0.5 | 1>(1)
  const guide = findExerciseGuide(exerciseQuery)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Dialog Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="relative z-[111] w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-[2rem] bg-[#0c0c0e] border border-amber-500/40 shadow-[0_25px_70px_rgba(0,0,0,0.9)] text-foreground overflow-hidden"
      >
        {/* Header Bar */}
        <div className="p-5 pb-3 flex items-center justify-between border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/15 p-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <div className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-amber-400">
                Form Coach · {guide.category}
              </div>
              <h2 className="font-display text-xl font-black text-white">{guide.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white/70 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── INTERACTIVE ANIMATION STAGE ── */}
        <div className="relative aspect-[4/3] w-full bg-black overflow-hidden select-none">
          {/* Looping Motion GIF */}
          <img
            src={guide.gifSrc}
            alt={guide.title}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Dark Cinematic Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-black/30 pointer-events-none" />

          {/* Live Motion Badge */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
            <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/40 text-xs font-black text-amber-400 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span>LIVE MOTION (GIF)</span>
            </div>

            <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/40 text-xs font-bold text-emerald-400">
              <Check className="h-3.5 w-3.5" />
              <span>{guide.alignmentBadge}</span>
            </div>
          </div>

          {/* Breathing Cadence HUD */}
          <div className="absolute top-4 right-4 z-20 pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                borderColor: ['rgba(245, 158, 11, 0.4)', 'rgba(56, 189, 248, 0.8)', 'rgba(245, 158, 11, 0.4)'],
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border text-xs font-black"
            >
              <Wind className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
              <span className="text-sky-300">
                {guide.breathCue}
              </span>
            </motion.div>
          </div>

          {/* Bottom HUD bar */}
          <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs text-white/80 font-bold">
              ⚡ {guide.cadence}
            </div>

            <div className="bg-amber-500 px-3 py-1.5 rounded-xl text-black font-black text-xs shadow-md">
              Looping Form
            </div>
          </div>
        </div>

        {/* ── FOCUS CUE & ANGLE BADGE ── */}
        <div className="p-5 space-y-4">
          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-amber-400">
                Biomechanical Alignment Focus
              </span>
            </div>
            <div className="text-xs font-bold text-amber-300 mb-1">
              📐 {guide.angleInfo}
            </div>
            <p className="text-xs md:text-sm font-medium text-white/85 leading-relaxed">
              {guide.focusCue}
            </p>
          </div>

          {/* Form Checklist */}
          <div>
            <div className="font-mono text-[10px] font-black uppercase tracking-wider text-white/50 mb-2">
              4 Non-Negotiable Form Rules
            </div>
            <div className="space-y-2">
              {guide.rules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 text-xs text-white/80">
                  <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-white/10 hover:bg-white/20 py-3.5 font-bold text-xs text-white transition-colors cursor-pointer"
          >
            Got It · Return to Workout
          </button>
        </div>
      </motion.div>
    </div>
  )
}

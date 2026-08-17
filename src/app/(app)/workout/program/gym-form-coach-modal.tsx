'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Sparkles, Wind, Gauge, Dumbbell, ShieldCheck, Zap } from 'lucide-react'

export interface GymExerciseFormGuide {
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

const GYM_EXERCISE_GUIDES: Record<string, GymExerciseFormGuide> = {
  'leg press': {
    name: 'Leg Press Machine',
    title: 'Leg Press 45° Mastery',
    category: 'Quadriceps, Glutes & Hamstrings',
    gifSrc: '/artifacts/exercises/leg_press_motion.gif',
    angleInfo: 'Knees: 90° at Bottom · Soft Knee at Top',
    alignmentBadge: 'Lower Back Pinned to Seat',
    breathCue: 'Inhale Lower Sled · Exhale Press Up',
    cadence: '3s Controlled Descent · 1s Smooth Drive',
    focusCue: 'Place feet shoulder-width in center of plate. Drive through your entire foot—never lock your knees at top.',
    rules: [
      'Lower back and hips must stay firmly pressed against the backrest.',
      'Lower the sled until knees reach approximately a 90° angle.',
      'Press through heels and mid-foot; keep knees tracking in line with toes.',
      'NEVER hyperextend or violently lock out knees at the top.',
    ],
  },
  'chest press': {
    name: 'Seated Chest Press Machine',
    title: 'Chest Press Machine Guide',
    category: 'Pectorals, Front Deltoids & Triceps',
    gifSrc: '/artifacts/exercises/chest_press_motion.gif',
    angleInfo: 'Handles: Mid-Chest Level · Elbows 45–60°',
    alignmentBadge: 'Shoulder Blades Retracted',
    breathCue: 'Inhale Return · Exhale Press Forward',
    cadence: '2s Controlled Return · 1s Explosive Push',
    focusCue: 'Adjust seat so handles line up with middle of your chest. Keep shoulders down and back against the pad.',
    rules: [
      'Set seat height so handles sit across nipple/mid-chest line.',
      'Pinch shoulder blades together and keep chest proud.',
      'Push forward in a smooth arc without letting shoulders roll forward.',
      'Stop just short of locking elbows out to maintain tension.',
    ],
  },
  'lat pulldown': {
    name: 'Neutral-Grip Lat Pulldown',
    title: 'Lat Pulldown Protocol',
    category: 'Latissimus Dorsi, Rhomboids & Biceps',
    gifSrc: '/artifacts/exercises/lat_pulldown_motion.gif',
    angleInfo: 'Torso: Slight 10–15° Back Lean',
    alignmentBadge: 'Elbows Driven Down to Ribs',
    breathCue: 'Exhale Pull to Chest · Inhale Extend Up',
    cadence: '1s Concentric Pull · 2s Controlled Negative',
    focusCue: 'Lead the movement by pulling your elbows straight down toward your hip pockets. Squeeze shoulder blades together.',
    rules: [
      'Adjust thigh pad snug against thighs so you remain seated firmly.',
      'Grip the bar slightly wider than shoulder-width with neutral/overhand grip.',
      'Pull down to collarbone level while opening chest up.',
      'Avoid excessive backward swinging; control the bar all the way up.',
    ],
  },
  'seated row': {
    name: 'Seated Cable Row',
    title: 'Seated Cable Row Masterclass',
    category: 'Mid-Back, Rhomboids & Lats',
    gifSrc: '/artifacts/exercises/seated_row_motion.gif',
    angleInfo: 'Torso: 90° Upright · Knees Softly Bent',
    alignmentBadge: 'Full Scapular Retraction',
    breathCue: 'Exhale Pull to Navel · Inhale Stretch Forward',
    cadence: '1s Squeeze · 2s Smooth Return',
    focusCue: 'Pull the handle smoothly into your lower ribs/navel. Pinch your shoulder blades together like cracking a walnut.',
    rules: [
      'Sit tall with a slight knee bend; do not lock knees.',
      'Pull elbows back past your torso while keeping shoulders depressed.',
      'Hold the peak contraction for a full second.',
      'Allow shoulder blades to protract smoothly on the return stretch.',
    ],
  },
  'leg extension': {
    name: 'Leg Extension Machine',
    title: 'Leg Extension Quad Isolation',
    category: 'Quadriceps Isolation',
    gifSrc: '/artifacts/exercises/leg_extension_motion.gif',
    angleInfo: 'Pivot Axis: Aligned with Knee Joints',
    alignmentBadge: '1s Squeeze Peak Extension',
    breathCue: 'Exhale Kick Up · Inhale Lower Slowly',
    cadence: '1s Lift · 1s Hold Peak · 3s Negative',
    focusCue: 'Pad sits on lower shins just above ankles. Extend legs straight out and hold the peak quad squeeze.',
    rules: [
      'Align machine pivot joint directly with your knee joint.',
      'Hold side handles firmly to keep hips planted in the seat.',
      'Kick upward smoothly; pause 1 second at full extension.',
      'Lower the weight slowly under strict 3-second tension.',
    ],
  },
  'leg curl': {
    name: 'Seated Leg Curl Machine',
    title: 'Hamstring Curl Mastery',
    category: 'Hamstrings & Posterior Chain',
    gifSrc: '/artifacts/exercises/seated_leg_curl_motion.gif',
    angleInfo: 'Pad: Just Below Calves / Above Heel',
    alignmentBadge: 'Thigh Pad Firmly Clamped',
    breathCue: 'Exhale Curl Down · Inhale Return Up',
    cadence: '1s Power Curl · 2s Controlled Release',
    focusCue: 'Lock thigh clamp down tightly. Curl heels back under your thighs smoothly while pulling your toes toward shins.',
    rules: [
      'Sit with back flat against backrest and clamp top thigh pad firmly.',
      'Curl down through full range of motion until heels tuck under seat.',
      'Feel deep hamstring contraction at bottom of movement.',
      'Control the return up so weight stack does not slam.',
    ],
  },
  'shoulder press': {
    name: 'Seated Shoulder Press Machine',
    title: 'Overhead Shoulder Press Guide',
    category: 'Anterior & Lateral Deltoids',
    gifSrc: '/artifacts/exercises/shoulder_press_motion.gif',
    angleInfo: 'Elbows: Slightly In Front of Torso (Scapular Plane)',
    alignmentBadge: 'Neutral Spine Against Seat',
    breathCue: 'Inhale Lower · Exhale Press Overhead',
    cadence: '2s Lower · 1s Drive Overhead',
    focusCue: 'Adjust seat so handles are at ear/chin height. Press straight up overhead without arching lower back.',
    rules: [
      'Keep back flat against pad and feet firmly planted on floor.',
      'Elbows should track slightly forward, not flared out directly to sides.',
      'Press up smoothly until arms are almost fully extended overhead.',
      'Lower with control until handles reach ear level.',
    ],
  },
  'triceps pressdown': {
    name: 'Cable Triceps Press-Down',
    title: 'Cable Triceps Pressdown',
    category: 'Triceps Brachii',
    gifSrc: '/artifacts/exercises/triceps_pressdown_motion.gif',
    angleInfo: 'Elbows: Pinned 90° to Ribs',
    alignmentBadge: 'Locked Elbow Pivot Axis',
    breathCue: 'Exhale Press Down · Inhale Return 90°',
    cadence: '1s Push & Lockout · 2s Return',
    focusCue: 'Glue your elbows to your side ribs. The only moving joint is your forearm hinging at the elbow.',
    rules: [
      'Stand with slight forward torso lean and soft knees.',
      'Pin elbows tight against your ribs and do not let them drift forward.',
      'Push down until arms are straight and spread rope/lock bar.',
      'Return up to 90 degrees under control before next rep.',
    ],
  },
  'cable fly': {
    name: 'Standing Cable Chest Fly',
    title: 'Cable Chest Fly Protocol',
    category: 'Pectoral Squeeze & Isolation',
    gifSrc: '/artifacts/exercises/cable_fly_motion.gif',
    angleInfo: 'Arms: Slight Fixed Elbow Bend ("Hug a Tree")',
    alignmentBadge: 'Staggered Stance Stability',
    breathCue: 'Inhale Open Wide · Exhale Bring Hands Together',
    cadence: '2s Stretch · 1s Peak Chest Squeeze',
    focusCue: 'Bring handles together in front of sternum like hugging a wide barrel. Squeeze chest hard at center.',
    rules: [
      'Take a staggered stance (one foot forward) for solid balance.',
      'Maintain a slight fixed bend in elbows throughout the motion.',
      'Bring hands together until knuckles or handles touch in front of chest.',
      'Feel deep stretch across chest on open return without overextending.',
    ],
  },
  'recumbent bike': {
    name: 'Recumbent Bike (Cardio/Cool-Down)',
    title: 'Recumbent Bike Cadence',
    category: 'Low-Impact Cardio & Recovery',
    gifSrc: '/artifacts/exercises/recumbent_bike_motion.gif',
    angleInfo: 'Knee Extension: Slight 10–15° Bend at Full Reach',
    alignmentBadge: 'Ergonomic Lumbar Support',
    breathCue: 'Rhythmic Nasal Breathing',
    cadence: '65–80 RPM Smooth Cadence',
    focusCue: 'Adjust seat so knee is slightly bent when pedal is furthest away. Relax upper body against backrest.',
    rules: [
      'Ensure leg does not fully lock out or overreach on pedal stroke.',
      'Keep back supported against lumbar seat pad.',
      'Maintain steady, consistent RPM rather than heavy resistance mash.',
      'Breathe deeply in through nose, out through mouth to recover.',
    ],
  },
  'treadmill walk': {
    name: 'Treadmill Warm-Up Walk',
    title: 'Treadmill Warm-Up Walk',
    category: 'Cardiovascular Warm-Up',
    gifSrc: '/artifacts/exercises/treadmill_walk_motion.gif',
    angleInfo: 'Speed: 3.5–5.0 km/h · Incline: 1.0–2.0%',
    alignmentBadge: 'Upright Posture & Natural Arm Swing',
    breathCue: 'Natural Rhythmic Breathing',
    cadence: '100–120 Steps / Min',
    focusCue: 'Walk tall with arms swinging naturally. Gentle 1% incline protects knees from flat impact.',
    rules: [
      'Clip red safety key to waistband before starting.',
      'Land heel-to-toe with natural, unconstrained stride.',
      'Avoid gripping front handrails tightly; swing arms naturally.',
      'Gradually increase pace to raise internal body temperature.',
    ],
  },
  'hip mobility': {
    name: 'Kneeling Hip Flexor Stretch',
    title: 'Hip Flexor Mobility Stretch',
    category: 'Hip Mobility & Joint Health',
    gifSrc: '/artifacts/exercises/hip_mobility_motion.gif',
    angleInfo: 'Front & Back Knees: 90° Angles',
    alignmentBadge: 'Pelvis Tucked · Torso Tall',
    breathCue: 'Deep Inhale · Exhale Sink Into Stretch',
    cadence: 'Hold 30–45s Per Side',
    focusCue: 'Tuck tailbone under (posterior pelvic tilt) and gently shift weight forward until you feel front hip stretch.',
    rules: [
      'Use a soft gym mat under the rear knee for joint comfort.',
      'Keep torso upright without arching lower back.',
      'Squeeze the glute on the trailing leg to deepen hip opening.',
      'Breathe deeply into diaphragm to release tight hip capsule.',
    ],
  },
  'shoulder circles': {
    name: 'Shoulder Circles (Mobility)',
    title: 'Shoulder Joint Lubrication',
    category: 'Rotator Cuff & Deltoid Warm-Up',
    gifSrc: '/artifacts/exercises/shoulder_circles_motion.gif',
    angleInfo: 'Arms: Full 360° Smooth Circumduction',
    alignmentBadge: 'Stand Tall · Ribs Pulled Down',
    breathCue: 'Smooth Continuous Breathing',
    cadence: '10 Forward · 10 Backward (Slow)',
    focusCue: 'Make smooth, round circles with shoulders and arms. Feel synovial fluid warming up the shoulder joint.',
    rules: [
      'Keep core engaged and posture upright; avoid swaying torso.',
      'Start with small circles and progressively widen circumference.',
      'Perform 10 controlled repetitions forward, then 10 backward.',
      'Stop if you feel sharp pain—keep motion smooth and pain-free.',
    ],
  },
}

function normalizeKey(str: string): string {
  const lower = str.toLowerCase().trim()
  if (lower.includes('leg press')) return 'leg press'
  if (lower.includes('chest press') || lower.includes('bench press')) return 'chest press'
  if (lower.includes('lat pull') || lower.includes('pulldown')) return 'lat pulldown'
  if (lower.includes('seated row') || lower.includes('cable row') || lower.includes('row')) return 'seated row'
  if (lower.includes('leg extension') || lower.includes('quad extension')) return 'leg extension'
  if (lower.includes('leg curl') || lower.includes('hamstring curl')) return 'leg curl'
  if (lower.includes('shoulder press') || lower.includes('overhead press') || lower.includes('military')) return 'shoulder press'
  if (lower.includes('tricep') || lower.includes('pushdown') || lower.includes('pressdown')) return 'triceps pressdown'
  if (lower.includes('cable fly') || lower.includes('chest fly') || lower.includes('crossover')) return 'cable fly'
  if (lower.includes('bike') || lower.includes('cycling') || lower.includes('recumbent')) return 'recumbent bike'
  if (lower.includes('treadmill') || lower.includes('walk') || lower.includes('march')) return 'treadmill walk'
  if (lower.includes('hip') || lower.includes('stretch') || lower.includes('flexor')) return 'hip mobility'
  if (lower.includes('shoulder circle') || lower.includes('rotator') || lower.includes('arm circle')) return 'shoulder circles'
  return 'chest press'
}

interface GymFormCoachModalProps {
  exerciseName: string
  onClose: () => void
}

export default function GymFormCoachModal({ exerciseName, onClose }: GymFormCoachModalProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'rules' | 'breathing'>('visual')

  const key = normalizeKey(exerciseName)
  const guide = GYM_EXERCISE_GUIDES[key] || GYM_EXERCISE_GUIDES['chest press']

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6 select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="relative z-[201] w-full md:max-w-xl max-h-[90vh] overflow-y-auto rounded-t-[2.5rem] md:rounded-[2.5rem] bg-[#0c1314] border border-teal-500/40 shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden"
      >
        {/* Header Bar */}
        <div className="relative p-5 pb-3 border-b border-white/[0.08] flex items-center justify-between bg-gradient-to-r from-teal-950/70 via-black to-teal-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/40">
              <Dumbbell className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-teal-400">
                  Gym Machine Form Coach
                </span>
                <span className="px-2 py-0.5 rounded-md text-[8px] font-black bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Looping 3D Motion
                </span>
              </div>
              <h2 className="text-lg font-black text-white leading-tight">{guide.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-white/10 hover:bg-white/20 p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Big Motion GIF Player Banner */}
        <div className="relative aspect-square sm:aspect-[4/3] w-full bg-black overflow-hidden flex items-center justify-center">
          <img
            src={guide.gifSrc}
            alt={guide.name}
            className="w-full h-full object-cover"
          />

          {/* Gradient vignettes */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1314] via-transparent to-black/30 pointer-events-none" />

          {/* Alignment Badge Pill */}
          <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-teal-500/40 text-[10px] font-black text-teal-300 shadow-xl">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
              {guide.alignmentBadge}
            </div>
          </div>

          {/* Angle info Pill */}
          <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
            <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-[10px] font-bold text-white/90">
              📐 {guide.angleInfo}
            </div>
            <div className="bg-teal-500/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-teal-500/40 text-[10px] font-black text-teal-300">
              ⚡ {guide.cadence}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 pt-4 border-b border-white/[0.08] bg-[#0c1314]">
          {[
            { id: 'visual', label: 'Form & Mechanics', icon: Zap },
            { id: 'rules', label: 'Step-By-Step Rules', icon: Check },
            { id: 'breathing', label: 'Breath & Tempo', icon: Wind },
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'border-teal-400 text-teal-300 bg-teal-500/10 rounded-t-lg'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-5 space-y-4">
          {activeTab === 'visual' && (
            <div className="space-y-3.5">
              {/* Primary Focus Cue */}
              <div className="p-4 rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-500/15 via-teal-950/40 to-transparent flex items-start gap-3">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex-shrink-0 mt-0.5">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-teal-300 uppercase tracking-wider mb-1">
                    Gold Standard Cue
                  </div>
                  <p className="text-xs font-medium text-white/90 leading-relaxed">
                    {guide.focusCue}
                  </p>
                </div>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/50">Primary Target</div>
                  <div className="font-bold text-white">{guide.category}</div>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/50">Rep Tempo</div>
                  <div className="font-bold text-teal-300">{guide.cadence}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-2.5">
              {guide.rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10"
                >
                  <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed font-medium">
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'breathing' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex-shrink-0 mt-0.5">
                  <Wind className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-cyan-300 uppercase tracking-wider mb-1">
                    Breathing Pattern
                  </div>
                  <p className="text-xs font-medium text-white/90 leading-relaxed">
                    <strong>{guide.breathCue}</strong>. Never hold your breath during machine exercises (avoid Valsalva maneuver to prevent blood pressure spikes).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Gauge className="h-4 w-4 text-teal-400" /> Eccentric (Lowering) Phase Control:
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Always take 2–3 full seconds to return the weight stack. 60% of muscle growth and strength adaptation occurs during the controlled eccentric return.
                </p>
              </div>
            </div>
          )}

          {/* Action button */}
          <button
            onClick={onClose}
            className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-teal-500/25 cursor-pointer hover:brightness-110 transition-all"
          >
            Got It · Return to Day Plan
          </button>
        </div>
      </motion.div>
    </div>
  )
}

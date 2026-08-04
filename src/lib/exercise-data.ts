export interface ExerciseMediaItem {
  id: string
  viewType: 'start' | 'finish' | 'form_view' | 'mistake'
  url: string
  altText: string
  caption: string
  reviewStatus: 'draft' | 'ai_generated' | 'reviewed' | 'approved' | 'needs_replacement'
  prompt?: string
}

export interface ExerciseRecord {
  id: string
  slug: string
  name: string
  shortDescription: string
  fullDescription: string
  category: 'strength' | 'warm_up' | 'cardio' | 'mobility' | 'cool_down'
  movementPattern: string
  primaryMuscles: string[]
  secondaryMuscles: string[]
  equipment: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  phase: string
  
  firstTimeGymTips?: {
    howToFindMachine: string
    howToAdjust: string
    newbieAdvice: string
  }

  beforeYouStart: {
    equipmentSetup: string
    seatAdjustment: string
    startingResistance: string
    placement: string
    posture: string
    spaceRequired: string
    spotterNeeded: boolean
    beginnerSuitable: boolean
  }
  
  setupSteps: string[]
  movementSteps: string[]
  breathingInstructions: string
  tempoGuidance: string
  rangeOfMotion: string
  prescribedReps: string
  prescribedSets: string
  rpeTarget: string
  restTimeSeconds: number
  whatToFeel: {
    workingMuscles: string
    normalEffort: string
    shouldNotFeel: string
  }
  commonMistakes: {
    name: string
    description: string
    avoidCue: string
  }[]
  safetyNotes: string[]
  stopConditions: string[]
  easierVariation: string
  harderVariation: string
  machineAlternative: string
  homeAlternative: string
  progressionGuidance: string
  
  reviewStatus: 'draft' | 'needs_review' | 'approved'
  media: ExerciseMediaItem[]
  alternativesByReason?: {
    reason: string
    alternativeName: string
    alternativeSlug: string
    note: string
  }[]
}

export const BENCHMARK_EXERCISES: ExerciseRecord[] = [
  // 1. Warm-Up Cardio: Treadmill Walk
  {
    id: 'ex-treadmill-warmup',
    slug: 'treadmill-walk-warmup',
    name: '1. Treadmill Walk (Cardio Warm-Up)',
    shortDescription: '5-minute comfortable walk to gradually raise core temperature and heart rate.',
    fullDescription: 'Essential 1st-step warm-up for beginners. Gently activates systemic circulation, lubricates knee and hip joints, and prepares your heart safely before any resistance training.',
    category: 'warm_up',
    movementPattern: 'cardio',
    primaryMuscles: ['Cardiovascular System', 'Calves', 'Quadriceps'],
    secondaryMuscles: ['Gluteus Maximus', 'Hamstrings'],
    equipment: 'Commercial Treadmill',
    difficulty: 'Beginner',
    phase: 'Phase 1: Warm-Up (5 Minutes)',
    
    firstTimeGymTips: {
      howToFindMachine: 'Look for the row of treadmill machines in the cardio zone. Pick one with clear space around it.',
      howToAdjust: 'No mechanical adjustment needed! Locate the RED emergency stop clip and green START button on the console.',
      newbieAdvice: 'Clip the red safety key to your waistband before pressing Quick Start. Start slow (2.5 - 3.0 km/h).'
    },

    beforeYouStart: {
      equipmentSetup: 'Straddle the treadmill belt with feet on side rails before hitting Start.',
      seatAdjustment: 'N/A',
      startingResistance: 'Speed: 2.8 - 3.2 km/h. Incline: 0.0% flat.',
      placement: 'Feet centered on moving belt, looking straight forward at eye level.',
      posture: 'Upright, shoulders relaxed down, arms swinging naturally at sides.',
      spaceRequired: 'Check rear belt area is clear of gym bags or water bottles.',
      spotterNeeded: false,
      beginnerSuitable: true
    },
    
    setupSteps: [
      'Stand straddling the belt on the side plastic rails.',
      'Attach the red safety clip securely to your shirt or waistband.',
      'Press the green "Quick Start" button on the console display.',
      'Wait for 3-2-1 countdown as the belt begins moving slowly.',
      'Step smoothly onto the moving belt and begin a natural walking stride.'
    ],
    
    movementSteps: [
      'Walk at a relaxed, comfortable pace (approx 3.0 km/h).',
      'Swing your arms naturally with elbows bent at 90 degrees.',
      'Maintain an upright posture—do not lean heavily on the handrails.',
      'Use the "Talk Test": you should be able to speak full sentences easily.',
      'After 5 minutes, press the yellow "Cool Down" or "Stop" button and stay on belt until it completely halts.'
    ],
    
    breathingInstructions: 'Breathe rhythmically in through your nose and out through your mouth. Keep breathing continuous and relaxed.',
    tempoGuidance: 'Consistent, steady walking cadence (~100 steps per minute).',
    rangeOfMotion: 'Natural walking stride landing on mid-foot and rolling smoothly off toes.',
    prescribedReps: '5 Minutes',
    prescribedSets: '1 Continuous Session',
    rpeTarget: 'RPE 2-3 (Very Light Effort)',
    restTimeSeconds: 0,
    
    whatToFeel: {
      workingMuscles: 'Gentle warmth spreading through your legs and mild elevation in breathing.',
      normalEffort: 'Relaxed effort where you can easily hold a conversation.',
      shouldNotFeel: 'No joint pain, no heavy breathlessness, no dizziness, no chest tightness.'
    },
    
    commonMistakes: [
      {
        name: 'Clinging Hard to Handrails',
        description: 'Gripping side rails tightly and leaning backward while walking.',
        avoidCue: 'Keep hands off rails or rest fingertips lightly for balance only.'
      }
    ],
    
    safetyNotes: [
      'Always use the red emergency safety clip.',
      'Never step off a moving treadmill belt at high speed.'
    ],
    
    stopConditions: [
      'Dizziness or lightheadedness',
      'Chest pressure or discomfort',
      'Unusual shortness of breath'
    ],
    
    easierVariation: 'Recumbent Bike at zero resistance',
    harderVariation: 'Speed 4.0 km/h or light 1% incline',
    machineAlternative: 'Recumbent Stationary Bike',
    homeAlternative: 'Brisk indoor hallway walk or marching in place',
    progressionGuidance: 'Keep warm-up light and easy—the goal is joint lubrication, not fatigue.',
    
    reviewStatus: 'approved',
    media: [
      {
        id: 'media-tm-start',
        viewType: 'start',
        url: '/artifacts/exercises/treadmill_walk_start.png',
        altText: 'Male beginner model walking on commercial treadmill with posture aligned.',
        caption: 'Treadmill Warm-Up: Relaxed upright stride, 3 km/h pace, eyes forward.',
        reviewStatus: 'approved',
        prompt: 'Photorealistic fitness photo of an adult male beginner on a commercial treadmill doing a gentle warm-up walk'
      }
    ]
  },

  // 2. Dynamic Mobility: Shoulder Circles
  {
    id: 'ex-shoulder-circles',
    slug: 'shoulder-circles-mobility',
    name: '2. Shoulder Circles (Dynamic Mobility)',
    shortDescription: 'Gentle arm and shoulder rotations to lubricate rotator cuff and upper-back joints.',
    fullDescription: 'Prepares the shoulder complex before pressing and pulling movements. Increases synovial fluid in the glenohumeral joint.',
    category: 'mobility',
    movementPattern: 'mobility',
    primaryMuscles: ['Deltoids', 'Rotator Cuff', 'Rhomboids'],
    secondaryMuscles: ['Trapezius'],
    equipment: 'Bodyweight (No Equipment Required)',
    difficulty: 'Beginner',
    phase: 'Phase 1: Dynamic Mobility (2 Minutes)',
    
    firstTimeGymTips: {
      howToFindMachine: 'No machine needed! Perform near your bench or in the open stretching area.',
      howToAdjust: 'N/A',
      newbieAdvice: 'Keep movements smooth and painless. Never force large circles if shoulders feel tight.'
    },

    beforeYouStart: {
      equipmentSetup: 'N/A',
      seatAdjustment: 'N/A',
      startingResistance: 'Bodyweight',
      placement: 'Stand tall with feet hip-width apart.',
      posture: 'Chest lifted, core lightly engaged, chin parallel to floor.',
      spaceRequired: 'Arm length clear radius around you.',
      spotterNeeded: false,
      beginnerSuitable: true
    },
    
    setupSteps: [
      'Stand upright with feet hip-width apart and knees soft.',
      'Extend arms out to sides at shoulder height or keep hands on shoulders.',
      'Relax your neck and jaw.'
    ],
    
    movementSteps: [
      'Make small, controlled forward circles with your arms/shoulders for 10 reps.',
      'Gradually increase circle size if comfortable.',
      'Reverse directions and perform 10 backward circles.',
      'Keep breathing continuously.'
    ],
    
    breathingInstructions: 'Inhale for two circles, exhale for two circles. Never hold your breath.',
    tempoGuidance: 'Slow, smooth rotational tempo (~2 seconds per full circle).',
    rangeOfMotion: 'Comfortable painless range of motion.',
    prescribedReps: '10 Forward / 10 Backward',
    prescribedSets: '1 Set',
    rpeTarget: 'RPE 1-2 (Effortless)',
    restTimeSeconds: 0,
    
    whatToFeel: {
      workingMuscles: 'Gentle warmth around upper shoulders and upper back.',
      normalEffort: 'Smooth, fluid joint movement.',
      shouldNotFeel: 'No pinching, popping pain, or neck tightness.'
    },
    
    commonMistakes: [
      {
        name: 'Fast Jerky Movements',
        description: 'Flailing arms rapidly through space.',
        avoidCue: 'Perform slow, graceful controlled rotations.'
      }
    ],
    
    safetyNotes: ['Reduce circle size if you feel any tightness.'],
    stopConditions: ['Sharp shoulder pain or clicking with discomfort'],
    easierVariation: 'Seated Shoulder Shrugs',
    harderVariation: 'Banded Arm Dislocates with light band',
    machineAlternative: 'N/A',
    homeAlternative: 'Standing Shoulder Circles',
    progressionGuidance: 'Focus on fluid joint lubrication.',
    
    reviewStatus: 'approved',
    media: [
      {
        id: 'media-sc-start',
        viewType: 'start',
        url: '/artifacts/exercises/shoulder_circles_start.png',
        altText: 'Male model demonstrating standing shoulder circles mobility in gym.',
        caption: 'Shoulder Mobility: Controlled circular arm rotations, erect posture.',
        reviewStatus: 'approved',
        prompt: 'Photorealistic fitness photo of an adult male beginner doing shoulder circles mobility warm-up'
      }
    ]
  },

  // 3. Main Strength Lift 1: Leg Press Machine
  {
    id: 'ex-leg-press',
    slug: 'leg-press-machine',
    name: '3. Leg Press Machine',
    shortDescription: 'Seated compound leg exercise strengthening quads, glutes, and hamstrings safely.',
    fullDescription: 'The seated leg press allows beginners to build lower-body strength with complete spinal support. It isolates the legs while removing axial loading on the lower back.',
    category: 'strength',
    movementPattern: 'squat',
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Calves'],
    equipment: '45-Degree or Seated Leg Press Machine',
    difficulty: 'Beginner',
    phase: 'Phase 1: Adaptation (Main Lift 1)',
    
    firstTimeGymTips: {
      howToFindMachine: 'Look for a large machine with a angled backrest pad and a heavy slanted footplate platform.',
      howToAdjust: 'Find the pull-pin behind or beside the backrest to tilt the seat. Find the yellow safety catch levers near your hips.',
      newbieAdvice: 'Start with NO added weight plates or just the base machine resistance to test your form safely!'
    },

    beforeYouStart: {
      equipmentSetup: 'Select a light starting resistance (e.g. 40-60 kg) using the weight pin.',
      seatAdjustment: 'Adjust backrest angle to ~60-70 degrees so your hips stay securely in place without lifting.',
      startingResistance: 'Use conservative weight to focus on smooth, controlled movement.',
      placement: 'Place feet flat on the sled platform, shoulder-width apart, toes pointing slightly outward (5-10°).',
      posture: 'Keep head, upper back, and lower back firmly against the back pad throughout.',
      spaceRequired: 'Clear sled travel path. Ensure safety catch handles operate smoothly.',
      spotterNeeded: false,
      beginnerSuitable: true
    },
    
    setupSteps: [
      'Sit fully back against the back pad with your lower back pressed firmly against the seat.',
      'Place both feet flat on the footplate, shoulder-width apart.',
      'Align your knees directly over your second and third toes.',
      'Grip the side handles gently to stabilize your upper body.',
      'Disengage the safety lever by pressing slightly and rotating the handles out.'
    ],
    
    movementSteps: [
      'Unlock the machine by pushing slightly forward through your heels.',
      'Inhale deeply and slowly lower the platform by bending your knees to approximately 90 degrees.',
      'Pause briefly at the bottom without letting your lower back round off the pad.',
      'Exhale as you press smoothly back up through your mid-foot and heels.',
      'Stop just short of locking your knees out at the top position.'
    ],
    
    breathingInstructions: 'Inhale slowly as the sled moves toward you. Exhale steadily while pressing the sled away. Never hold your breath during the press.',
    tempoGuidance: '2 seconds to press out, 1 second pause at top, 3 seconds to lower under control.',
    rangeOfMotion: 'Lower until knees reach a 90-degree angle. Do not allow your tailbone to tuck or lift off the back pad (butt wink).',
    prescribedReps: '10-15 reps',
    prescribedSets: '2 sets',
    rpeTarget: 'RPE 5-6 (3-4 reps in reserve)',
    restTimeSeconds: 90,
    
    whatToFeel: {
      workingMuscles: 'Smooth tension across the front of your thighs (quads) and glutes.',
      normalEffort: 'Mild muscular warmth and exertion in the legs.',
      shouldNotFeel: 'No knee joint pinching, no lower back strain or lifting off the seat.'
    },
    
    commonMistakes: [
      {
        name: 'Knees Collapsing Inward (Valgus)',
        description: 'Allowing the knees to cave inside the toe line during the press.',
        avoidCue: 'Keep knees tracking directly over your second and third toes.'
      },
      {
        name: 'Locking Knees at Top',
        description: 'Snapping the knees straight into full extension under load.',
        avoidCue: 'Maintain a soft 5-degree bend in the knees at the top of the press.'
      }
    ],
    
    safetyNotes: [
      'Always engage safety stops before exiting the machine.',
      'Keep heels glued flat against the footplate at all times.'
    ],
    
    stopConditions: ['Sharp pain in either knee joint', 'Lower back pressure or pulling sensation'],
    easierVariation: 'Seated Leg Extension Machine with light load',
    harderVariation: 'Single-Leg Press or Incline Leg Press',
    machineAlternative: 'Seated Leg Extension plus Seated Leg Curl',
    homeAlternative: 'Chair Sit-to-Stand with hand support',
    progressionGuidance: 'Master 2 sets of 15 clean reps at RPE 5 before increasing weight by 5kg increments.',
    
    reviewStatus: 'approved',
    media: [
      {
        id: 'media-lp-start',
        viewType: 'start',
        url: '/artifacts/exercises/leg_press_start.png',
        altText: 'Male model on Leg Press Machine in starting position with knees bent at 90 degrees.',
        caption: 'Starting Position: Feet shoulder-width apart, knees at 90°, spine supported against pad.',
        reviewStatus: 'approved'
      },
      {
        id: 'media-lp-finish',
        viewType: 'finish',
        url: '/artifacts/exercises/leg_press_finish.png',
        altText: 'Male model on Leg Press Machine in top finish position.',
        caption: 'Finish Position: Press through heels until legs extended with soft knee bend.',
        reviewStatus: 'approved'
      },
      {
        id: 'media-lp-form',
        viewType: 'form_view',
        url: '/artifacts/exercises/leg_press_form.png',
        altText: 'Side angle view showing foot placement and spine alignment.',
        caption: 'Key Form View: Foot tracking aligned over toes and hips flush against back pad.',
        reviewStatus: 'approved'
      },
      {
        id: 'media-lp-mistake',
        viewType: 'mistake',
        url: '/artifacts/exercises/leg_press_mistake.png',
        altText: 'Educational comparison highlighting knee collapse inward.',
        caption: 'Avoid This: Knees collapsing inward or lower back lifting off seat.',
        reviewStatus: 'approved'
      }
    ]
  },

  // 4. Main Strength Lift 2: Seated Chest Press
  {
    id: 'ex-chest-press',
    slug: 'seated-chest-press',
    name: '4. Seated Chest Press',
    shortDescription: 'Machine-based horizontal push targeting chest, front shoulders, and triceps.',
    fullDescription: 'The seated chest press machine guides the pressing path, ensuring shoulder safety and preventing balance issues common with free-weight presses.',
    category: 'strength',
    movementPattern: 'push',
    primaryMuscles: ['Pectoralis Major', 'Anterior Deltoids'],
    secondaryMuscles: ['Triceps Brachii'],
    equipment: 'Seated Chest Press Machine',
    difficulty: 'Beginner',
    phase: 'Phase 1: Adaptation (Main Lift 2)',
    
    firstTimeGymTips: {
      howToFindMachine: 'Look for a machine with horizontal handles facing a padded seat with a weight stack stack pin.',
      howToAdjust: 'Pull the seat height pin beneath the seat pad so the handles align right at mid-chest height.',
      newbieAdvice: 'Keep your elbows angled slightly downward (~45°). Never flare them out inline with your ears!'
    },

    beforeYouStart: {
      equipmentSetup: 'Set pin weight to a light resistance (e.g. 20-30 kg).',
      seatAdjustment: 'Adjust seat height so the handles align directly with mid-chest level.',
      startingResistance: 'Light load ensuring smooth, controlled elbow extension.',
      placement: 'Feet flat on floor, shoulder-width apart for firm grounding.',
      posture: 'Press chest up slightly, pull shoulder blades down and back against pad.',
      spaceRequired: 'Check arm path is clear.',
      spotterNeeded: false,
      beginnerSuitable: true
    },
    
    setupSteps: [
      'Adjust seat height so handles sit at mid-chest level.',
      'Sit with back and head firmly pressed against the support pad.',
      'Place feet flat on the floor for stability.',
      'Grip the handles with an overhand grip, wrists neutral.',
      'Pull shoulders back and down into the seat backrest.'
    ],
    
    movementSteps: [
      'Exhale as you press the handles forward in a smooth, controlled arc.',
      'Extend arms fully without locking out the elbow joints.',
      'Pause for 1 second at full extension.',
      'Inhale as you slowly return handles to starting position near chest level.',
      'Keep shoulders retracting against pad throughout.'
    ],
    
    breathingInstructions: 'Exhale while pressing forward. Inhale as handles return back toward your chest.',
    tempoGuidance: '2 seconds forward, 1 second hold, 3 seconds return.',
    rangeOfMotion: 'Press until arms are extended with soft elbows; return handles to chest line without weights slamming.',
    prescribedReps: '10-15 reps',
    prescribedSets: '2 sets',
    rpeTarget: 'RPE 5-6',
    restTimeSeconds: 90,
    
    whatToFeel: {
      workingMuscles: 'Engaged tension across upper chest and back of upper arms.',
      normalEffort: 'Controlled muscular effort in chest and triceps.',
      shouldNotFeel: 'No front shoulder pinching or elbow joint click/pain.'
    },
    
    commonMistakes: [
      {
        name: 'Shoulders Shrugging Up',
        description: 'Humping shoulders toward ears while pressing.',
        avoidCue: 'Keep shoulders pressed down away from your ears.'
      }
    ],
    
    safetyNotes: ['Maintain firm foot contact on the floor.'],
    stopConditions: ['Shoulder joint pain or impingement sensation'],
    easierVariation: 'Incline Wall Push-Up',
    harderVariation: 'Incline Machine Press or Dumbbell Press',
    machineAlternative: 'Cable Chest Press or Pec Fly Machine',
    homeAlternative: 'Resistance-Band Chest Press',
    progressionGuidance: 'Increase load by smallest pin increment after completing 2x15 with perfect form.',
    
    reviewStatus: 'approved',
    media: [
      {
        id: 'media-cp-start',
        viewType: 'start',
        url: '/artifacts/exercises/chest_press_start.png',
        altText: 'Male model seated on Chest Press machine holding handles at chest level.',
        caption: 'Starting Position: Handles aligned with mid-chest, elbows at 45° angle, feet flat.',
        reviewStatus: 'approved'
      },
      {
        id: 'media-cp-finish',
        viewType: 'finish',
        url: '/artifacts/exercises/chest_press_finish.png',
        altText: 'Male model on Chest Press machine with handles pressed forward.',
        caption: 'Finish Position: Arms extended smoothly with soft elbows, shoulders back against pad.',
        reviewStatus: 'approved'
      },
      {
        id: 'media-cp-form',
        viewType: 'form_view',
        url: '/artifacts/exercises/chest_press_form.png',
        altText: 'Front angle view showing hand grip and elbow angle on chest press.',
        caption: 'Key Form View: Neutral wrist alignment and 45° elbow tuck.',
        reviewStatus: 'approved'
      },
      {
        id: 'media-cp-mistake',
        viewType: 'mistake',
        url: '/artifacts/exercises/chest_press_mistake.png',
        altText: 'Comparison showing flared elbows and shrugged shoulders.',
        caption: 'Avoid This: Flaring elbows out to 90 degrees or shrugging shoulders.',
        reviewStatus: 'approved'
      }
    ]
  },

  // 5. Main Strength Lift 3: Seated Cable Row
  {
    id: 'ex-seated-row',
    slug: 'seated-cable-row',
    name: '5. Seated Cable Row',
    shortDescription: 'Seated horizontal pull for upper back, lats, and posture correction.',
    fullDescription: 'The seated cable row strengthens the rhomboids, middle trapezius, and upper lats while reinforcing upright posture and shoulder blade control.',
    category: 'strength',
    movementPattern: 'pull',
    primaryMuscles: ['Rhomboids', 'Latissimus Dorsi', 'Middle Trapezius'],
    secondaryMuscles: ['Biceps Brachii', 'Rear Deltoids'],
    equipment: 'Seated Low Cable Row Machine with V-Bar or Neutral Handle',
    difficulty: 'Beginner',
    phase: 'Phase 1: Adaptation (Main Lift 3)',
    
    firstTimeGymTips: {
      howToFindMachine: 'Look for a long bench on the floor facing a low pulley cable wheel with footrest plates.',
      howToAdjust: 'Attach the triangle V-bar handle to the cable carabiner clip.',
      newbieAdvice: 'Sit up tall like a sailboat mast. Do NOT swing your torso backward to pull!'
    },

    beforeYouStart: {
      equipmentSetup: 'Attach neutral close-grip V-bar handle to low pulley.',
      seatAdjustment: 'Sit facing the weight stack with feet on foot pegs.',
      startingResistance: 'Light resistance (20-30 kg) to emphasize scapular retraction.',
      placement: 'Knees slightly bent, feet secure on footrests.',
      posture: 'Tall spine, chest up, shoulders down.',
      spaceRequired: 'Clear cable travel path.',
      spotterNeeded: false,
      beginnerSuitable: true
    },
    
    setupSteps: [
      'Sit facing the low pulley with feet resting securely on the footrests.',
      'Keep a soft bend in your knees (do not lock out knees).',
      'Reach forward and grip the V-bar attachment.',
      'Sit up tall with a natural arch in lower back and chest open.',
      'Draw shoulders down and back.'
    ],
    
    movementSteps: [
      'Exhale as you pull the handle toward your lower abdomen/navel.',
      'Squeeze shoulder blades together at the back of the movement.',
      'Keep elbows close to your sides.',
      'Pause for 1 second in the contracted position.',
      'Inhale as you slowly extend arms back to start without rounding your spine.'
    ],
    
    breathingInstructions: 'Exhale while pulling the handle into your body. Inhale as you return arms forward.',
    tempoGuidance: '2 seconds pull, 1 second squeeze, 3 seconds controlled return.',
    rangeOfMotion: 'Pull until handle touches lower abdomen; return until arms extend while maintaining upright posture.',
    prescribedReps: '10-15 reps',
    prescribedSets: '2 sets',
    rpeTarget: 'RPE 5-6',
    restTimeSeconds: 90,
    
    whatToFeel: {
      workingMuscles: 'Squeeze between shoulder blades and back of upper arms.',
      normalEffort: 'Gentle warmth in upper back muscles.',
      shouldNotFeel: 'No lower back swaying, pulling, or neck strain.'
    },
    
    commonMistakes: [
      {
        name: 'Torso Momentum / Leaning Back',
        description: 'Swinging the upper body backward to pull heavy weight.',
        avoidCue: 'Keep torso stationary at a 90-degree angle to the bench.'
      }
    ],
    
    safetyNotes: ['Keep knees softly bent throughout.'],
    stopConditions: ['Lower back arching pain'],
    easierVariation: 'Resistance-Band Seated Row',
    harderVariation: 'Single-Arm Cable Row or Dumbbell Row',
    machineAlternative: 'Chest-Supported Row Machine',
    homeAlternative: 'Door-Anchored Resistance-Band Row',
    progressionGuidance: 'Focus on squeezing shoulder blades together before adding weight.',
    
    reviewStatus: 'approved',
    media: [
      {
        id: 'media-sr-start',
        viewType: 'start',
        url: '/artifacts/exercises/seated_row_start.png',
        altText: 'Male model seated facing cable machine holding handle with arms extended.',
        caption: 'Starting Position: Arms extended, knees soft, spine tall and shoulders retracted.',
        reviewStatus: 'approved'
      },
      {
        id: 'media-sr-finish',
        viewType: 'finish',
        url: '/artifacts/exercises/seated_row_finish.png',
        altText: 'Male model pulling cable handle to abdomen with shoulder blades pinched.',
        caption: 'Finish Position: Handle pulled to abdomen, shoulder blades squeezed together.',
        reviewStatus: 'approved'
      },
      {
        id: 'media-sr-form',
        viewType: 'form_view',
        url: '/artifacts/exercises/seated_row_form.png',
        altText: 'Three-quarter view of upper back muscle engagement on cable row.',
        caption: 'Key Form View: Elbows tucked near ribs and shoulder blades pulled back.',
        reviewStatus: 'approved'
      },
      {
        id: 'media-sr-mistake',
        viewType: 'mistake',
        url: '/artifacts/exercises/seated_row_mistake.png',
        altText: 'Educational graphic showing excessive backward leaning momentum error.',
        caption: 'Avoid This: Swinging torso backward or rounding the lower spine.',
        reviewStatus: 'approved'
      }
    ]
  },

  // 6. Neutral-Grip Lat Pulldown
  {
    id: 'ex-lat-pulldown',
    slug: 'neutral-grip-lat-pulldown',
    name: '6. Neutral-Grip Lat Pulldown',
    shortDescription: 'Seated vertical pull targeting upper back lats and posture muscles.',
    fullDescription: 'Provides vertical pulling strength to balance pressing movements while keeping shoulders in a safe, joint-friendly neutral grip position.',
    category: 'strength',
    movementPattern: 'pull',
    primaryMuscles: ['Latissimus Dorsi', 'Teres Major'],
    secondaryMuscles: ['Biceps Brachii', 'Brachialis'],
    equipment: 'Lat Pulldown Machine with Neutral Parallel Bar',
    difficulty: 'Beginner',
    phase: 'Phase 1: Adaptation (Vertical Pull)',
    
    firstTimeGymTips: {
      howToFindMachine: 'Look for a high cable tower with a seat and adjustable thigh pads underneath.',
      howToAdjust: 'Adjust the thigh pad roller pin so it holds your thighs snugly down against the seat.',
      newbieAdvice: 'Pull the bar down in front of your chest—NEVER behind your neck!'
    },

    beforeYouStart: {
      equipmentSetup: 'Attach neutral close-grip parallel bar handle to top pulley.',
      seatAdjustment: 'Adjust thigh pad roller height so your thighs are locked down firmly.',
      startingResistance: 'Light load (20-30 kg) to master vertical pulling form.',
      placement: 'Feet flat on floor, thighs wedged securely under pads.',
      posture: 'Chest open, slight 10-degree lean backward at hips.',
      spaceRequired: 'Clear vertical cable line.',
      spotterNeeded: false,
      beginnerSuitable: true
    },
    
    setupSteps: [
      'Reach up and grip the neutral parallel handle.',
      'Sit down smoothly and wedge your thighs beneath the padded thigh rollers.',
      'Keep feet flat on the floor.',
      'Tilt torso back slightly (~10 degrees) with chest lifted toward the ceiling.'
    ],
    
    movementSteps: [
      'Exhale as you pull the handle down toward your upper chest.',
      'Lead the movement with your elbows, pulling them down toward your side ribs.',
      'Squeeze your lats and shoulder blades at the bottom position.',
      'Inhale as you slowly control the handle back up until arms extend fully.'
    ],
    
    breathingInstructions: 'Exhale while pulling the bar down. Inhale as the bar returns smoothly upward.',
    tempoGuidance: '2 seconds pull down, 1 second hold at chest, 3 seconds controlled return.',
    rangeOfMotion: 'Pull until handle reaches collarbone height; extend arms overhead without shrugging shoulders.',
    prescribedReps: '10-15 reps',
    prescribedSets: '2 sets',
    rpeTarget: 'RPE 5-6',
    restTimeSeconds: 90,
    
    whatToFeel: {
      workingMuscles: 'Muscles under armpits (lats) and front of upper arms.',
      normalEffort: 'Smooth pulling effort across upper sides of back.',
      shouldNotFeel: 'No neck strain or shoulder joint pinching.'
    },
    
    commonMistakes: [
      {
        name: 'Pulling Behind the Neck',
        description: 'Pulling the bar down behind the head putting severe stress on cervical spine.',
        avoidCue: 'Always pull the bar down in front to collarbone level.'
      }
    ],
    
    safetyNotes: ['Keep thighs wedged firmly under pads at all times.'],
    stopConditions: ['Shoulder pinching or upper spine pain'],
    easierVariation: 'Assisted Lat Pulldown or Band Lat Pulldown',
    harderVariation: 'Wide Grip Lat Pulldown or Assisted Chin-up',
    machineAlternative: 'Seated Cable Row',
    homeAlternative: 'Resistance Band Overhead Lat Pulldown',
    progressionGuidance: 'Master smooth control before increasing resistance pin.',
    
    reviewStatus: 'approved',
    media: [
      {
        id: 'media-lpud-start',
        viewType: 'start',
        url: '/artifacts/exercises/lat_pulldown_start.png',
        altText: 'Male model seated at Lat Pulldown machine holding handles overhead.',
        caption: 'Starting Position: Thighs locked under pads, arms extended overhead, chest open.',
        reviewStatus: 'approved'
      },
      {
        id: 'media-lpud-finish',
        viewType: 'finish',
        url: '/artifacts/exercises/lat_pulldown_finish.png',
        altText: 'Male model pulling lat pulldown handle down to upper chest.',
        caption: 'Finish Position: Handle pulled to upper chest, elbows drawn down toward ribs.',
        reviewStatus: 'approved'
      }
    ]
  },

  // 7. Seated Leg Curl Machine
  {
    id: 'ex-leg-curl',
    slug: 'seated-leg-curl',
    name: '7. Seated Leg Curl Machine',
    shortDescription: 'Seated hamstring isolation strengthening back of legs and knee joint stability.',
    fullDescription: 'Targets the hamstrings while seated, ensuring safe hamstring strengthening for knee joint balance.',
    category: 'strength',
    movementPattern: 'knee_flexion',
    primaryMuscles: ['Hamstrings (Biceps Femoris, Semitendinosus)'],
    secondaryMuscles: ['Calves (Gastrocnemius)'],
    equipment: 'Seated Leg Curl Machine',
    difficulty: 'Beginner',
    phase: 'Phase 1: Adaptation (Knee Health)',
    
    firstTimeGymTips: {
      howToFindMachine: 'Look for a seated machine with a roller pad resting over your lower shins and a top thigh hold-down pad.',
      howToAdjust: 'Adjust the backrest pin so your knee joints align with the machine red pivot point.',
      newbieAdvice: 'Keep your feet flexed (toes pointing up) throughout the curl!'
    },

    beforeYouStart: {
      equipmentSetup: 'Select light weight pin (15-25 kg).',
      seatAdjustment: 'Adjust backrest so knees line up with pivot axis of machine.',
      startingResistance: 'Light load ensuring smooth knee flexion.',
      placement: 'Lower leg roller sits just above ankle heels.',
      posture: 'Back against pad, thighs held down securely.',
      spaceRequired: 'Clear leg curl arc.',
      spotterNeeded: false,
      beginnerSuitable: true
    },
    
    setupSteps: [
      'Sit back firmly against the backrest pad.',
      'Position lower leg roller just under your ankles/calves.',
      'Lower the top thigh pad down onto your lower thighs to prevent hips from moving.',
      'Grip side handles for balance.'
    ],
    
    movementSteps: [
      'Exhale as you curl your heels backward under the seat toward your glutes.',
      'Squeeze hamstrings at full flexed position for 1 second.',
      'Inhale as you slowly control legs back out to starting position.'
    ],
    
    breathingInstructions: 'Exhale while curling legs back. Inhale as legs return forward.',
    tempoGuidance: '2 seconds curl, 1 second hold, 3 seconds return.',
    rangeOfMotion: 'Curl from full extension to 90 degrees under seat.',
    prescribedReps: '10-15 reps',
    prescribedSets: '2 sets',
    rpeTarget: 'RPE 5-6',
    restTimeSeconds: 90,
    
    whatToFeel: {
      workingMuscles: 'Smooth tension in the back of your thighs (hamstrings).',
      normalEffort: 'Controlled muscular effort behind knees and thighs.',
      shouldNotFeel: 'No knee cap pain or lower back arching.'
    },
    
    commonMistakes: [
      {
        name: 'Hips Lifting Off Seat',
        description: 'Arching lower back and lifting hips to force heavy weight.',
        avoidCue: 'Keep thigh pad locked down and hips flat on seat.'
      }
    ],
    
    safetyNotes: ['Ensure top thigh pad is locked securely.'],
    stopConditions: ['Sharp pain behind knee or hamstring cramping'],
    easierVariation: 'Standing Cable Leg Curl with ankle strap',
    harderVariation: 'Single-Leg Seated Leg Curl',
    machineAlternative: 'Lying Leg Curl Machine',
    homeAlternative: 'Glute Bridge with heel drag on floor',
    progressionGuidance: 'Increase pin resistance only when form is smooth.',
    
    reviewStatus: 'approved',
    media: [
      {
        id: 'media-lc-start',
        viewType: 'start',
        url: '/artifacts/exercises/seated_leg_curl_start.png',
        altText: 'Male model seated on Leg Curl machine with legs extended forward over roller.',
        caption: 'Starting Position: Back against pad, legs extended over lower ankle roller.',
        reviewStatus: 'approved'
      },
      {
        id: 'media-lc-finish',
        viewType: 'finish',
        url: '/artifacts/exercises/seated_leg_curl_finish.png',
        altText: 'Male model curling legs back under seat on Leg Curl machine.',
        caption: 'Finish Position: Heels curled smoothly under seat with hamstrings contracted.',
        reviewStatus: 'approved'
      }
    ]
  },

  // 8. Leg Extension Machine
  {
    id: 'ex-leg-extension',
    slug: 'leg-extension-machine',
    name: '8. Leg Extension Machine',
    shortDescription: 'Seated quadriceps isolation strengthening thigh muscles and knee cap tracking.',
    fullDescription: 'Isolates the quadriceps through knee extension, helping build single-joint thigh strength and knee stability under controlled resistance.',
    category: 'strength',
    movementPattern: 'knee_extension',
    primaryMuscles: ['Quadriceps (Rectus Femoris, Vastus Lateralis, Medialis)'],
    secondaryMuscles: ['Knee Extensor Tendons'],
    equipment: 'Seated Leg Extension Machine',
    difficulty: 'Beginner',
    phase: 'Phase 1: Adaptation (Quad Isolation)',
    
    firstTimeGymTips: {
      howToFindMachine: 'Look for a seated machine where your shins rest behind a lower padded roller bar.',
      howToAdjust: 'Adjust the lower ankle pad pin so it sits comfortably against your lower shins (above ankles).',
      newbieAdvice: 'Pause for 1 second at the top position with legs straight, but do not snap your knees!'
    },

    beforeYouStart: {
      equipmentSetup: 'Select light weight pin (15-25 kg).',
      seatAdjustment: 'Adjust backrest so knees align with machine pivot axis.',
      startingResistance: 'Light resistance to protect knee joint.',
      placement: 'Lower shin pad rests above foot ankles.',
      posture: 'Back firmly against backrest pad.',
      spaceRequired: 'Clear extension path.',
      spotterNeeded: false,
      beginnerSuitable: true
    },
    
    setupSteps: [
      'Sit back with lower back resting against backrest.',
      'Place lower shins behind the padded roller bar.',
      'Grip side handles for upper body stability.'
    ],
    
    movementSteps: [
      'Exhale as you extend your legs smoothly upward until your thighs are fully contracted.',
      'Hold the top straight-leg position for a brief 1-second pause.',
      'Inhale as you slowly lower the roller pad back to the starting 90-degree position.'
    ],
    
    breathingInstructions: 'Exhale while lifting legs up. Inhale as legs lower down under control.',
    tempoGuidance: '2 seconds up, 1 second pause at top, 3 seconds lowering.',
    rangeOfMotion: 'From 90-degree knee bend up to full leg extension with soft knees.',
    prescribedReps: '10-15 reps',
    prescribedSets: '2 sets',
    rpeTarget: 'RPE 5-6',
    restTimeSeconds: 90,
    
    whatToFeel: {
      workingMuscles: 'Deep burn across the front of your thighs (quadriceps).',
      normalEffort: 'Isolated quad muscle fatigue.',
      shouldNotFeel: 'No sharp kneecap grinding or joint pain.'
    },
    
    commonMistakes: [
      {
        name: 'Kicking Weights Up Rapidly',
        description: 'Using explosive momentum to throw the weight pad upward.',
        avoidCue: 'Lift smoothly using quad muscle strength only.'
      }
    ],
    
    safetyNotes: ['Do not snap knees locked straight at the top.'],
    stopConditions: ['Sharp kneecap pain'],
    easierVariation: 'Seated Leg Press with light weight',
    harderVariation: 'Single-Leg Extension',
    machineAlternative: 'Leg Press Machine',
    homeAlternative: 'Seated Leg Straightening with bodyweight',
    progressionGuidance: 'Increase weight pin gradually.',
    
    reviewStatus: 'approved',
    media: [
      {
        id: 'media-le-start',
        viewType: 'start',
        url: '/artifacts/exercises/leg_extension_start.png',
        altText: 'Male model seated on Leg Extension machine with shins behind lower roller pad.',
        caption: 'Starting Position: Knees bent 90°, shins behind lower roller pad.',
        reviewStatus: 'approved'
      },
      {
        id: 'media-le-finish',
        viewType: 'finish',
        url: '/artifacts/exercises/leg_extension_finish.png',
        altText: 'Male model extending legs upward on Leg Extension machine.',
        caption: 'Finish Position: Legs extended smoothly with quadriceps fully contracted.',
        reviewStatus: 'approved'
      }
    ]
  },

  // 9. Cable Triceps Press-Down
  {
    id: 'ex-triceps-pressdown',
    slug: 'cable-triceps-pressdown',
    name: '9. Cable Triceps Press-Down',
    shortDescription: 'Standing cable extension isolating the back of arms (triceps).',
    fullDescription: 'Strengthens the triceps muscles to support all pressing movements and upper body pushing stability.',
    category: 'strength',
    movementPattern: 'isolation_push',
    primaryMuscles: ['Triceps Brachii (Lateral, Long, Medial Heads)'],
    secondaryMuscles: ['Forearms', 'Core'],
    equipment: 'High Cable Pulley with Rope or Straight Bar',
    difficulty: 'Beginner',
    phase: 'Phase 1: Adaptation (Arm Isolation)',
    
    firstTimeGymTips: {
      howToFindMachine: 'Look for a tall cable tower machine with a high pulley wheel.',
      howToAdjust: 'Attach the rope attachment or straight bar to the top carabiner hook.',
      newbieAdvice: 'Glue your elbows to your side ribs like they are pinned there!'
    },

    beforeYouStart: {
      equipmentSetup: 'Attach rope or bar to high cable pulley.',
      seatAdjustment: 'N/A (Standing movement).',
      startingResistance: 'Light weight pin (10-15 kg).',
      placement: 'Stand tall facing cable machine, feet hip-width apart.',
      posture: 'Chest up, elbows pinned to sides, knees soft.',
      spaceRequired: 'Clear standing space in front of cable stack.',
      spotterNeeded: false,
      beginnerSuitable: true
    },
    
    setupSteps: [
      'Grip the rope handles or straight bar at chest height.',
      'Step back slightly from the cable stack.',
      'Pin your elbows firmly against your side ribs.',
      'Stand tall with knees softly bent.'
    ],
    
    movementSteps: [
      'Exhale as you press the handle downward until your arms are fully extended.',
      'Squeeze triceps at the bottom position for 1 second.',
      'Inhale as you slowly allow forearms to rise back up to 90 degrees while keeping elbows pinned to your ribs.'
    ],
    
    breathingInstructions: 'Exhale while pushing down. Inhale as handle rises up.',
    tempoGuidance: '2 seconds down, 1 second squeeze at bottom, 3 seconds controlled return.',
    rangeOfMotion: 'From 90-degree elbow bend down to full arm extension.',
    prescribedReps: '10-15 reps',
    prescribedSets: '2 sets',
    rpeTarget: 'RPE 5-6',
    restTimeSeconds: 90,
    
    whatToFeel: {
      workingMuscles: 'Warm contraction across back of upper arms.',
      normalEffort: 'Isolated triceps fatigue.',
      shouldNotFeel: 'No elbow joint pinching or shoulder swaying.'
    },
    
    commonMistakes: [
      {
        name: 'Elbows Flaring and Moving',
        description: 'Allowing elbows to swing forward and backward during movement.',
        avoidCue: 'Keep elbows locked against your side torso throughout.'
      }
    ],
    
    safetyNotes: ['Keep wrists neutral without bending backward.'],
    stopConditions: ['Elbow tendon pain'],
    easierVariation: 'Light Resistance-Band Press-Down',
    harderVariation: 'Overhead Cable Triceps Extension',
    machineAlternative: 'Seated Dip Machine',
    homeAlternative: 'Door-Anchored Band Triceps Press-Down',
    progressionGuidance: 'Increase pin resistance gradually.',
    
    reviewStatus: 'approved',
    media: [
      {
        id: 'media-tp-start',
        viewType: 'start',
        url: '/artifacts/exercises/triceps_pressdown_start.png',
        altText: 'Male model standing at cable machine holding handles at chest height with elbows pinned.',
        caption: 'Starting Position: Elbows pinned to sides, forearms at 90°, upright stance.',
        reviewStatus: 'approved'
      },
      {
        id: 'media-tp-finish',
        viewType: 'finish',
        url: '/artifacts/exercises/triceps_pressdown_finish.png',
        altText: 'Male model pressing cable handles down to upper thighs.',
        caption: 'Finish Position: Arms fully extended downward with triceps contracted.',
        reviewStatus: 'approved'
      }
    ]
  }
]

export const ADDITIONAL_EXERCISES_SUMMARY = [
  'Treadmill Walk (Warm-up / Cardio / Cool-down)',
  'Recumbent Bike (Warm-up / Cardio)',
  'Shoulder Circles (Mobility)',
  'Ankle Mobility Drills (Mobility)',
  'Gentle Hip Mobility (Mobility)',
  'Supported Sit-to-Stand (Strength / Warm-up)',
  'Seated Leg Curl Machine (Strength)',
  'Neutral-Grip Lat Pulldown (Strength)',
  'Pallof Press (Core Stability)',
  'Incline Chest Press Machine (Strength)',
  'Chest-Supported Row (Strength)',
  'Machine Hip Abduction (Strength)',
  'Cable Face Pull (Upper Back / Shoulder Health)',
  'Dead Bug (Core)',
  'Heel Slide (Core / Lower Limb)',
  'Leg Extension Machine (Strength)',
  'Supported Split Squat (Strength)',
  'Cable Triceps Press-Down (Strength)',
  'Cable Biceps Curl (Strength)',
  'Bird Dog (Core / Balance)',
  'Wall Push-Up (Home Alternative)',
  'Resistance-Band Row (Home Alternative)',
  'Glute Bridge (Strength / Mobility)',
  'Calf Raise with Support (Strength)'
]

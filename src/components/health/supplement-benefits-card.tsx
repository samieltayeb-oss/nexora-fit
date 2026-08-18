'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Pill, Sparkles, Shield, HeartPulse, Activity, Zap, CheckCircle2, 
  Clock, ArrowUpRight, Flame, Layers, Info, ChevronRight, X, AlertCircle 
} from 'lucide-react'

interface Ingredient {
  name: string
  dose: string
  role: string
}

interface Mechanism {
  title: string
  detail: string
}

export interface SupplementData {
  id: string
  name: string
  subtitle: string
  dose: string
  timing: string
  category: string
  badgeColor: string
  icon: string
  targetBiomarkers: string[]
  primaryOrgans: string[]
  overview: string
  ingredients?: Ingredient[]
  clinicalMechanisms: Mechanism[]
  samiSpecificBenefit: string
  absorptionSynergy: string
}

export const CLINICAL_SUPPLEMENTS: SupplementData[] = [
  {
    id: 'testosterone-boost',
    name: 'Ultra Testosterone Boost',
    subtitle: 'Clinically Standardized Bioactive Multi-Herb Complex',
    dose: '2 Tablets Daily',
    timing: '08:30 AM (With Breakfast & Healthy Fats)',
    category: 'Endocrine & Metabolic Support',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: '⚡',
    targetBiomarkers: ['Free Testosterone Support', 'Healthy Cortisol Balance', 'Inflammatory Marker Balance', 'Lean Muscle Retention'],
    primaryOrgans: ['Hypothalamus-Pituitary Axis', 'Adrenal System', 'Skeletal Muscle Tissue', 'Cardiovascular System'],
    overview: 'Educational botanical formula designed to support healthy androgen balance, promote bioavailable free testosterone modulation, assist healthy stress cortisol regulation, and support lean muscle recovery.',
    ingredients: [
      {
        name: 'Testofen® Fenugreek Extract 33:1 (50% saponins)',
        dose: '300 mg (equiv. to 9,900 mg raw fenugreek)',
        role: 'Standardized fenuside saponins assist in supporting healthy free testosterone bioavailability and active muscle recovery.'
      },
      {
        name: 'Maca Extract 6:1 (Lepidium meyenii)',
        dose: '125 mg (equiv. to 750 mg raw maca root)',
        role: 'Peruvian adaptogen traditionally utilized to support cellular stamina, neuro-endocrine drive, and vitality.'
      },
      {
        name: 'Sensoril® Ashwagandha Extract (Withania somnifera)',
        dose: '62.5 mg (32–45% oligosaccharides, 10–20% withanolides)',
        role: 'Shown in clinical studies to support healthy cortisol modulation and assist metabolic balance under physical demand.'
      },
      {
        name: 'Zinc (Citrate)',
        dose: '15 mg',
        role: 'Essential mineral cofactor for cellular enzyme function, endocrine synthesis, and immune health.'
      },
      {
        name: 'Boron (Citrate)',
        dose: '0.35 mg',
        role: 'Trace mineral that supports healthy SHBG balance and assists free testosterone availability.'
      }
    ],
    clinicalMechanisms: [
      {
        title: 'Free Testosterone Availability Support',
        detail: 'Fenugreek saponins interact with SHBG binding dynamics, supporting bioactive testosterone circulation to muscle tissues.'
      },
      {
        title: 'HPA Axis Stress Modulation',
        detail: 'Sensoril® withanolides assist in down-regulating excessive adrenal cortisol secretion, supporting muscle retention and metabolic stability.'
      },
      {
        title: 'Vascular Endothelial Support',
        detail: 'Supports balanced systemic inflammatory markers (hs-CRP), promoting cardiovascular and endothelial wellness.'
      }
    ],
    samiSpecificBenefit: 'Supports lean muscle retention during structured caloric management and promotes balanced morning energy while pursuing healthy body composition goals.',
    absorptionSynergy: 'Take 2 tablets with breakfast or lunch. Dietary fats in the meal (egg yolks or avocado) optimize the bioavailability of lipid-soluble botanicals.'
  },
  {
    id: 'taurine',
    name: 'Taurine 1000 mg (1g)',
    subtitle: 'Cardiac Rhythm & Cellular Osmolyte Support',
    dose: '1000 mg (1g) Daily',
    timing: '07:00 AM (Pre-Workout with 500ml Water & Coffee)',
    category: 'Amino Acid & Cellular Hydration',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    icon: '💧',
    targetBiomarkers: ['Cardiac Rhythm Support', 'Vascular Endothelial Tone', 'Intracellular Hydration', 'Exercise Capacity'],
    primaryOrgans: ['Heart (Cardiomyocytes)', 'Vascular Endothelium', 'Skeletal Muscle Cells', 'Central Nervous System'],
    overview: 'Essential organic sulfonic amino acid that acts as a major intracellular osmolyte in heart and skeletal muscles, supporting calcium flux regulation, mitochondrial health, and vascular elasticity.',
    clinicalMechanisms: [
      {
        title: 'Myocardial Ion Handling',
        detail: 'Assists sarcoplasmic reticulum calcium ATPase (SERCA2a) function, supporting optimal cardiomyocyte contractility and cellular balance.'
      },
      {
        title: 'Endothelial Nitric Oxide Support',
        detail: 'Supports endothelial nitric oxide synthase (eNOS) activity, promoting smooth vessel relaxation and healthy vascular tone.'
      },
      {
        title: 'Intracellular Osmoregulation',
        detail: 'Assists water and electrolyte retention inside muscle cells (cellular volumization), supporting muscle endurance and membrane stability.'
      }
    ],
    samiSpecificBenefit: 'Synergizes with Creatine Monohydrate and hydration protocols to support cardiovascular performance and muscle hydration during morning training.',
    absorptionSynergy: 'Take with 500ml water and morning coffee 20–30 minutes before training. Free-form Taurine is rapidly absorbed on an empty stomach.'
  },
  {
    id: 'coq10',
    name: 'Coenzyme Q-10 (CoQ10) 200 mg',
    subtitle: 'Cellular ATP & Mitochondrial Defense',
    dose: '200 mg Daily',
    timing: '08:30 AM (Breakfast with Healthy Fats)',
    category: 'Mitochondrial Bioenergetics',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    icon: '⚡',
    targetBiomarkers: ['Mitochondrial ATP Synthesis', 'Cellular Antioxidant Defense', 'Vascular Lipid Balance'],
    primaryOrgans: ['Heart Muscle', 'Liver', 'Skeletal Muscle Mitochondria', 'Blood Vessel Walls'],
    overview: 'Essential lipid-soluble cofactor for the mitochondrial electron transport chain (Complexes I, II, and III). Supports natural mitochondrial energy generation in cardiovascular and muscle tissues.',
    clinicalMechanisms: [
      {
        title: 'Mitochondrial Enzyme Support',
        detail: 'Helps support endogenous tissue CoQ10 concentrations in high-demand cardiac and skeletal muscle cells.'
      },
      {
        title: 'Mitochondrial ATP Synthesis',
        detail: 'Facilitates electron transport across the inner mitochondrial membrane, supporting cellular ATP generation.'
      },
      {
        title: 'Lipophilic Antioxidant Support',
        detail: 'Assists in defending circulating lipid particles against oxidative stress and free radical damage.'
      }
    ],
    samiSpecificBenefit: 'Supports cellular energy production and muscle endurance, promoting cardiovascular resilience alongside comprehensive medical management.',
    absorptionSynergy: 'Take with breakfast containing dietary fats (eggs or avocado) for optimal lipid-phase intestinal absorption.'
  },
  {
    id: 'k2d3',
    name: 'Vitamin K2 + D3 (120 mcg / 1000 IU)',
    subtitle: 'Vascular Mineral Matrix & Bone Synergy',
    dose: '120 mcg MK-7 + 1000 IU D3 Daily',
    timing: '08:30 AM (With Breakfast)',
    category: 'Vascular Mineral Matrix & Bone Support',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: '🦴',
    targetBiomarkers: ['Matrix Gla Protein (MGP) Activation', 'Insulin Receptor Support', 'Bone Mineral Matrix Density'],
    primaryOrgans: ['Coronary Arteries', 'Aorta & Heart Valves', 'Bone Matrix', 'Pancreatic Beta Cells'],
    overview: 'Synergistic arterial and skeletal health protocol. Vitamin D3 facilitates calcium absorption, while Vitamin K2 (Menaquinone-7) activates Matrix Gla Protein (MGP) to support healthy calcium utilization into bone structures.',
    clinicalMechanisms: [
      {
        title: 'Calcium Directing Mechanism',
        detail: 'Carboxylates Matrix Gla Protein (MGP), supporting the natural regulation of soft-tissue and vascular calcium balance.'
      },
      {
        title: 'Osteocalcin Activation',
        detail: 'Carboxylates osteocalcin, binding circulating calcium into the hydroxyapatite crystal lattice of bones.'
      },
      {
        title: 'Immune & Glycemic Modulation',
        detail: 'Vitamin D3 binds to VDR receptors on pancreatic beta cells, supporting healthy insulin sensitivity.'
      }
    ],
    samiSpecificBenefit: 'Promotes arterial elasticity and healthy vascular compliance while maintaining strong bone density during fat-loss resistance training.',
    absorptionSynergy: 'Lipid-soluble vitamins requiring dietary fats for optimal micelle formation and absorption.'
  },
  {
    id: 'creatine',
    name: 'Creatine Monohydrate (Creapure) 5g',
    subtitle: 'Cellular Phosphagen & Cognitive Energy',
    dose: '5000 mg (5g) Daily',
    timing: '07:00 AM (Pre-Workout with 500ml Water)',
    category: 'Phosphagen Bioenergetics & Neural Support',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    icon: '🧬',
    targetBiomarkers: ['Intracellular Phosphocreatine (PCr) ↑', 'GLUT-4 Translocation Support', 'Glycogen Storage Capacity'],
    primaryOrgans: ['Skeletal Muscle Fast-Twitch Fibers', 'Brain Cortex & Neurons', 'Kidneys', 'Heart'],
    overview: 'Heavily researched ergogenic aid. Replenishes intracellular phosphocreatine stores to rapidly re-phosphorylate ADP into ATP during anaerobic calisthenics and gym machine training.',
    clinicalMechanisms: [
      {
        title: 'ATP Regeneration Shuttle',
        detail: 'Donates a high-energy phosphate group to ADP, generating instant ATP without creating lactic acid.'
      },
      {
        title: 'GLUT-4 Glucose Uptake Support',
        detail: 'Upregulates skeletal muscle GLUT-4 glucose transporter expression, supporting muscle glucose clearance.'
      },
      {
        title: 'Cognitive & Neuro-Protection',
        detail: 'Supplies high-energy phosphate buffers to cortical neurons, supporting focus and executive cognition under stress.'
      }
    ],
    samiSpecificBenefit: 'Supports strength output on gym machines while assisting peripheral glucose utilization during morning workouts.',
    absorptionSynergy: 'Drink with 500ml water. Caffeine from morning coffee enhances mental sharpness without impairing creatine saturation.'
  },
  {
    id: 'b12',
    name: 'Vitamin B12 (Methylcobalamin) 1000 mcg',
    subtitle: 'Neurological Myelin & Methylation Support',
    dose: '1000 mcg (Sublingual / Dissolvable)',
    timing: '08:30 AM (With Breakfast)',
    category: 'Neurological & Cellular Methylation',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    icon: '🩸',
    targetBiomarkers: ['Serum Cobalamin Support', 'Homocysteine Balance', 'Erythrocyte Mean Corpuscular Volume'],
    primaryOrgans: ['Peripheral Nerves', 'Bone Marrow', 'Liver', 'Brain'],
    overview: 'Bioactive coenzyme form of Vitamin B12. Essential for homocysteine recycling into methionine, DNA synthesis, and peripheral nerve myelin sheath maintenance.',
    clinicalMechanisms: [
      {
        title: 'Cellular Myelin Maintenance',
        detail: 'Serves as an essential cofactor for methionine synthase, maintaining peripheral nerve fiber health.'
      },
      {
        title: 'Homocysteine Clearance',
        detail: 'Converts toxic homocysteine into methionine, supporting cardiovascular and endothelial health.'
      },
      {
        title: 'Red Blood Cell Synthesis',
        detail: 'Essential for erythropoiesis in bone marrow, supporting oxygen delivery and physical stamina.'
      }
    ],
    samiSpecificBenefit: 'Supports optimal nutritional status and neurological wellness as part of an integrated, physician-supervised protocol.',
    absorptionSynergy: 'Sublingual absorption bypasses intrinsic factor requirements, delivering active methylcobalamin directly to the bloodstream.'
  },
  {
    id: 'omega3',
    name: 'Omega-3 Select EPA / DHA (1000 mg)',
    subtitle: 'Vascular Triglyceride & Anti-Inflammatory Balance',
    dose: '1000 mg (High EPA/DHA) Daily',
    timing: '12:30 PM (With Lunch)',
    category: 'Cardiovascular Lipid & Cellular Membrane',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    icon: '🐟',
    targetBiomarkers: ['Serum Triglyceride Support', 'Omega-3 Index >8%', 'Healthy Inflammatory Signaling'],
    primaryOrgans: ['Vascular Endothelium', 'Heart Muscle', 'Liver', 'Cellular Phospholipid Bilayers'],
    overview: 'Ultra-purified marine triglyceride oil. EPA and DHA incorporate directly into cell membranes, supporting healthy triglyceride levels and promoting balanced inflammatory eicosanoid signaling.',
    clinicalMechanisms: [
      {
        title: 'Vascular Lipid Balance',
        detail: 'Supports hepatic fatty acid oxidation, assisting in maintaining healthy circulating triglyceride levels.'
      },
      {
        title: 'Specialized Pro-Resolving Mediators (SPMs)',
        detail: 'Precursor for resolvins, protectins, and maresins that support natural tissue recovery and arterial health.'
      },
      {
        title: 'Cellular Membrane Fluidity',
        detail: 'Improves membrane elasticity in red blood cells and vascular walls, promoting smooth capillary microcirculation.'
      }
    ],
    samiSpecificBenefit: 'Supports healthy lipid ratios and joint comfort during daily calisthenics and gym machine training.',
    absorptionSynergy: 'Take with lunch containing dietary fats. Emulsified by bile salts for optimal lymphatic absorption.'
  },
  {
    id: 'magnesium',
    name: 'Magnesium Citrate 150 mg',
    subtitle: 'Insulin Sensitivity & Neuromuscular Relaxation',
    dose: '150 mg Daily',
    timing: '09:30 PM (Before Bed with Water)',
    category: 'Electrolyte & Neuromuscular Balance',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    icon: '🌙',
    targetBiomarkers: ['Insulin Tyrosine Kinase Activity', 'Parasympathetic HRV', 'Nocturnal Muscle Relaxation'],
    primaryOrgans: ['Skeletal Muscle Cells', 'Pancreatic Beta Cells', 'Central Nervous System', 'Heart'],
    overview: 'Essential mineral cofactor for over 300 biochemical enzymatic reactions, including ATP stabilization, insulin receptor tyrosine kinase phosphorylation, and GABAergic sleep recovery.',
    clinicalMechanisms: [
      {
        title: 'Insulin Receptor Kinase Support',
        detail: 'Required for the tyrosine kinase phosphorylation of insulin receptors, facilitating healthy intracellular glucose uptake.'
      },
      {
        title: 'NMDA Receptor Balance',
        detail: 'Acts as a natural physiological calcium channel blocker, reducing neuronal excitability and promoting restorative sleep.'
      },
      {
        title: 'Vascular Smooth Muscle Relaxation',
        detail: 'Promotes arterial smooth muscle relaxation, supporting healthy nocturnal blood pressure balance.'
      }
    ],
    samiSpecificBenefit: 'Supports overnight muscle recovery, restful sleep, and healthy morning fasting glucose regulation.',
    absorptionSynergy: 'Take 30–60 minutes before bed with water. Organic citrate salt provides gentle absorption and muscle relaxation.'
  }
]

export function SupplementBenefitsCockpit() {
  const [selectedSupplement, setSelectedSupplement] = useState<SupplementData | null>(null)

  return (
    <div className="space-y-4 select-none">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-[#0d1416] to-[#0a0a0f] p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                [CLINICIAN-DEFINED PROTOCOL]
              </span>
              <span className="text-[10px] font-mono font-bold text-white/50">8 Active Formulas</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Clinical Supplement Matrix</h2>
            <p className="text-xs text-foreground/75 font-medium max-w-xl">
              Tap any supplement to view its biochemical rationale, active ingredients, target biomarkers, and metabolic absorption synergies.
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {CLINICAL_SUPPLEMENTS.map(supp => (
          <motion.div
            key={supp.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedSupplement(supp)}
            className="group cursor-pointer rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-black/60 p-4 hover:border-amber-500/40 hover:bg-white/[0.06] transition-all shadow-lg flex flex-col justify-between"
          >
            <div>
              {/* Top Meta Bar */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border ${supp.badgeColor}`}>
                  {supp.category}
                </span>
                <span className="text-xs font-mono font-bold text-white/60 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" /> {supp.timing.split('(')[0]}
                </span>
              </div>

              {/* Title & Dose */}
              <div className="flex items-start gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-105 transition-transform">
                  {supp.icon}
                </div>
                <div>
                  <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                    {supp.name}
                  </h3>
                  <div className="text-[11px] font-bold text-teal-300/90">{supp.dose}</div>
                </div>
              </div>

              <p className="text-[11px] text-foreground/70 font-medium line-clamp-2 leading-relaxed mb-3">
                {supp.overview}
              </p>
            </div>

            {/* Bottom Target Biomarkers Pills */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <Activity className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span className="text-[10px] font-bold text-foreground/75 truncate">
                  {supp.targetBiomarkers.slice(0, 2).join(' · ')}
                </span>
              </div>
              <span className="text-[10px] font-black text-amber-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform flex-shrink-0">
                Details <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comprehensive Medical Disclaimer Box */}
      <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-white/60 font-medium leading-relaxed">
          <strong>Educational &amp; Clinical Disclaimer:</strong> Supplement biochemical mechanisms and target biomarker pathways are provided for educational and progress-tracking reference only. They do not guarantee disease prevention, diagnosis, or treatment. Always follow your prescribing physician&apos;s directives before making changes to medications or supplements.
        </p>
      </div>

      {/* Deep-Dive Slide-Over / Modal */}
      <AnimatePresence>
        {selectedSupplement && (
          <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center p-0 md:p-6 select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSupplement(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Drawer */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="relative z-[121] w-full md:max-w-xl max-h-[90vh] overflow-y-auto rounded-t-[2.5rem] md:rounded-[2.5rem] bg-[#0c1415] border border-amber-500/40 shadow-[0_20px_70px_rgba(0,0,0,0.9)] p-5 md:p-6 space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-2xl flex-shrink-0">
                    {selectedSupplement.icon}
                  </div>
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider mb-1 border ${selectedSupplement.badgeColor}`}>
                      {selectedSupplement.category}
                    </span>
                    <h2 className="text-xl font-black text-white leading-tight">
                      {selectedSupplement.name}
                    </h2>
                    <p className="text-xs text-amber-300/90 font-bold mt-0.5">
                      {selectedSupplement.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSupplement(null)}
                  className="rounded-full bg-white/10 hover:bg-white/20 p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Dosage & Timing Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-0.5">
                  <div className="text-[9px] font-mono uppercase tracking-wider text-white/50">Daily Dosage</div>
                  <div className="text-xs font-black text-white">{selectedSupplement.dose}</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-0.5">
                  <div className="text-[9px] font-mono uppercase tracking-wider text-white/50">Optimal Timing</div>
                  <div className="text-xs font-black text-amber-300 truncate">{selectedSupplement.timing}</div>
                </div>
              </div>

              {/* Overview */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-950/20 to-transparent border border-amber-500/25 space-y-1">
                <div className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-400" /> Biochemical Overview
                </div>
                <p className="text-xs text-white/85 font-medium leading-relaxed">
                  {selectedSupplement.overview}
                </p>
              </div>

              {/* Ingredients List (if complex formula) */}
              {selectedSupplement.ingredients && selectedSupplement.ingredients.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-teal-400" /> Active Ingredients &amp; Rationale
                  </div>
                  <div className="space-y-2">
                    {selectedSupplement.ingredients.map((ing, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-teal-300">
                          <span>{ing.name}</span>
                          <span className="font-mono text-[10px] text-white/60 bg-black/40 px-2 py-0.5 rounded border border-white/10">{ing.dose}</span>
                        </div>
                        <p className="text-[11px] text-white/70 font-medium leading-relaxed">
                          {ing.role}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clinical Mechanisms */}
              <div className="space-y-2">
                <div className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-cyan-400" /> Cellular Mechanisms of Action
                </div>
                <div className="space-y-2">
                  {selectedSupplement.clinicalMechanisms.map((mech, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-white/[0.02] border border-cyan-500/20 space-y-1">
                      <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> {mech.title}
                      </div>
                      <p className="text-[11px] text-white/75 font-medium leading-relaxed pl-5">
                        {mech.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Biomarkers & Organs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">Target Biomarkers</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSupplement.targetBiomarkers.map((b, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-200 border border-amber-500/30">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold">Primary Target Organs</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSupplement.primaryOrgans.map((o, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-500/15 text-teal-200 border border-teal-500/30">
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Absorption Synergy */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">Bioavailability &amp; Timing</div>
                <p className="text-xs text-white/80 font-medium leading-relaxed">
                  {selectedSupplement.absorptionSynergy}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedSupplement(null)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer"
              >
                Close Protocol Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SupplementBenefitsCockpit

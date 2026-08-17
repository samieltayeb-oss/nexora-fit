'use client'

import React, { useState } from 'react'
import { 
  ShieldCheck, 
  Zap, 
  Heart, 
  Flame, 
  Activity, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Droplets, 
  Scale, 
  Brain, 
  ChevronRight,
  TrendingDown,
  Pill,
  Sun,
  Moon,
  Info
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface SupplementBenefit {
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
  clinicalMechanisms: {
    title: string
    detail: string
  }[]
  samiSpecificBenefit: string
  absorptionSynergy: string
  ingredients?: {
    name: string
    dose: string
    role: string
  }[]
}

export const SUPPLEMENT_BENEFITS: SupplementBenefit[] = [
  {
    id: 'ultra-testo-boost',
    name: 'Webber Naturals Ultra Testosterone Boost',
    subtitle: 'Androgen Axis & Anti-Cortisol Formula',
    dose: '2 Tablets Daily with Food',
    timing: 'Morning Breakfast or Lunch (with Meal)',
    category: 'Endocrine & Androgen Optimization',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: '⚡',
    targetBiomarkers: ['Free Testosterone ↑', 'Salivary Cortisol ↓', 'hs-CRP Inflammation ↓', 'Lean Muscle Retention ↑'],
    primaryOrgans: ['Testes / Hypothalamus-Pituitary Axis', 'Adrenal Glands', 'Skeletal Muscle Tissue', 'Cardiovascular System'],
    overview: 'Clinical multi-pathway botanical formula designed to counteract age-related androgen decline, liberate bioavailable free testosterone, reduce systemic stress cortisol, and accelerate lean muscle protein synthesis.',
    ingredients: [
      {
        name: 'Testofen® Fenugreek Extract 33:1 (50% saponins)',
        dose: '300 mg (equiv. to 9,900 mg raw fenugreek)',
        role: 'Standardized fenuside saponins liberate testosterone from SHBG (Sex Hormone-Binding Globulin), boosting active free testosterone and anabolic muscle recovery.'
      },
      {
        name: 'Maca Extract 6:1 (Lepidium meyenii)',
        dose: '125 mg (equiv. to 750 mg raw maca root)',
        role: 'Peruvian adaptogen that enhances cellular stamina, neuro-endocrine drive, and physical energy without jitteriness.'
      },
      {
        name: 'Sensoril® Ashwagandha Extract (Withania somnifera)',
        dose: '62.5 mg (32–45% oligosaccharides, 10–20% withanolides)',
        role: 'Clinically proven to reduce cortisol (catabolic stress hormone) and C-reactive protein (CRP), preventing stress-induced visceral fat accumulation.'
      },
      {
        name: 'Zinc (Citrate)',
        dose: '15 mg',
        role: 'Critical mineral cofactor for luteinizing hormone (LH) release, testosterone synthesis, and pancreatic insulin storage.'
      },
      {
        name: 'Boron (Citrate)',
        dose: '0.35 mg',
        role: 'Trace mineral that rapidly lowers SHBG, freeing up more circulating testosterone and downregulating inflammatory cytokines.'
      }
    ],
    clinicalMechanisms: [
      {
        title: 'Unbinding Free Testosterone',
        detail: 'Fenugreek saponins bind competitively to SHBG, freeing up bioactive testosterone to enter muscle cell nuclei and trigger protein synthesis.'
      },
      {
        title: 'HPA Axis Stress Dampening',
        detail: 'Sensoril® withanolides down-regulate hyperactive adrenal cortisol secretion, preventing muscle breakdown (catabolism) and abdominal visceral fat storage.'
      },
      {
        title: 'Cardiovascular Inflammatory Protection',
        detail: 'Lowers high-sensitivity C-Reactive Protein (hs-CRP), soothing vascular endothelial lining and protecting cardiac vessels.'
      }
    ],
    samiSpecificBenefit: 'For Sami (aiming from 82.70 kg → 75.00 kg with Type 2 management), maintaining high free testosterone prevents muscle loss during caloric restriction, while reducing cortisol keeps morning fasting glucose stable.',
    absorptionSynergy: 'Take 2 tablets with breakfast or lunch. Dietary fats in the meal (egg yolks or avocado) optimize the bioavailability of the lipid-soluble withanolides and saponins.'
  },
  {
    id: 'taurine',
    name: 'Taurine 1000 mg (1g)',
    subtitle: 'Cardiac Contractility & Cellular Osmolyte',
    dose: '1000 mg (1g) Daily',
    timing: '07:00 AM (Pre-Workout with 500ml Water & Coffee)',
    category: 'Amino Acid & Cardiovascular Osmoregulation',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    icon: '💧',
    targetBiomarkers: ['Left Ventricular Stroke Volume ↑', 'Vascular Endothelial Tone', 'Muscle Intracellular Hydration ↑', 'Exercise Capacity ↑'],
    primaryOrgans: ['Heart (Cardiomyocytes)', 'Vascular Endothelium', 'Skeletal Muscle Cells', 'Central Nervous System'],
    overview: 'Essential organic sulfonic amino acid that acts as the primary intracellular osmolyte in the heart and skeletal muscles, regulating calcium fluxes, mitochondrial stability, and vascular elasticity.',
    clinicalMechanisms: [
      {
        title: 'Myocardial Calcium Handling',
        detail: 'Modulates sarcoplasmic reticulum calcium ATPase (SERCA2a), optimizing the force of cardiac contractions (inotropy) while preventing intracellular calcium overload.'
      },
      {
        title: 'Endothelial Nitric Oxide Synergy',
        detail: 'Enhances endothelial nitric oxide synthase (eNOS) phosphorylation, promoting smooth vessel relaxation and reducing arterial resistance alongside Ramipril.'
      },
      {
        title: 'Intracellular Osmoregulation & Anti-Cramping',
        detail: 'Pulls water and electrolytes directly inside muscle cells (cellular volumization), preventing exercise-induced cramps and stabilizing cell membranes during morning calisthenics.'
      }
    ],
    samiSpecificBenefit: 'Synergizes with Creatine Monohydrate (5g) and Ramipril (5mg) to ensure maximum cardiovascular efficiency during morning workouts, protecting heart tissues under exertion.',
    absorptionSynergy: 'Drink with 500ml water and morning coffee 20–30 minutes before training. Free-form Taurine is rapidly absorbed on an empty stomach.'
  },
  {
    id: 'coq10',
    name: 'Coenzyme Q-10 (CoQ10) 200 mg',
    subtitle: 'Cellular ATP & Statin Protection',
    dose: '200 mg Daily',
    timing: '08:30 AM (Breakfast with Healthy Fats)',
    category: 'Mitochondrial Bioenergetics',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    icon: '⚡',
    targetBiomarkers: ['Mitochondrial ATP Synthesis ↑', 'Statin-Induced Myalgia Prevention', 'Vascular LDL Oxidation ↓'],
    primaryOrgans: ['Heart Muscle', 'Liver', 'Skeletal Muscle Mitochondria', 'Blood Vessel Walls'],
    overview: 'Essential lipid-soluble cofactor for the mitochondrial electron transport chain (Complex I, II, and III). Crucial for replenishing CoQ10 depleted by Rosuvastatin statin therapy.',
    clinicalMechanisms: [
      {
        title: 'Overcoming Statin Depletion',
        detail: 'Rosuvastatin inhibits HMG-CoA reductase, which inadvertently reduces the body’s natural synthesis of CoQ10 by up to 50%. 200mg daily restores tissue CoQ10 levels, eliminating muscle fatigue and aches.'
      },
      {
        title: 'Mitochondrial ATP Energy',
        detail: 'Transports electrons across the inner mitochondrial membrane to generate cellular ATP for the heart (which has the highest CoQ10 concentration in the human body).'
      },
      {
        title: 'Lipophilic Antioxidant Defense',
        detail: 'Directly protects circulating LDL particles from peroxidation, preventing them from oxidizing into atherogenic plaques.'
      }
    ],
    samiSpecificBenefit: 'Since Sami takes Rosuvastatin 40mg daily, CoQ10 200mg is mandatory to maintain high physical energy, eliminate muscle heaviness, and protect cardiovascular pump function.',
    absorptionSynergy: 'Must be taken with breakfast containing healthy fats (whole eggs or avocado) because CoQ10 is lipid-soluble and requires dietary lipids for intestinal micelle absorption.'
  },
  {
    id: 'k2d3',
    name: 'Vitamin K2 + D3 (120 mcg / 1000 IU)',
    subtitle: 'Arterial Elasticity & Insulin Sensitivity',
    dose: '120 mcg MK-7 + 1000 IU D3 Daily',
    timing: '08:30 AM (With Breakfast)',
    category: 'Vascular Mineral Matrix & Glycemic Control',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: '🦴',
    targetBiomarkers: ['Arterial Calcification Prevention (MGP Activation)', 'Insulin Receptor Sensitivity ↑', 'Bone Mineral Density ↑'],
    primaryOrgans: ['Coronary Arteries', 'Aorta & Heart Valves', 'Bone Matrix', 'Pancreatic Beta Cells'],
    overview: 'Synergistic arterial and bone health protocol. Vitamin D3 facilitates calcium absorption, while Vitamin K2 (Menaquinone-7) activates Matrix Gla Protein (MGP) to redirect calcium away from arterial walls into bone mineral matrix.',
    clinicalMechanisms: [
      {
        title: 'The Calcium Paradox Solution',
        detail: 'Carboxylates Matrix Gla Protein (MGP), the most potent inhibitor of soft-tissue and arterial wall calcification known in clinical medicine.'
      },
      {
        title: 'Insulin Receptor Gene Upregulation',
        detail: 'Vitamin D3 activates nuclear Vitamin D Receptors (VDR) on skeletal muscle cells and pancreatic beta-cells, enhancing insulin sensitivity and glucose disposal.'
      },
      {
        title: 'Long-Acting MK-7 Half-Life',
        detail: 'Menaquinone-7 has a 72-hour circulating half-life, maintaining 24/7 protection against arterial stiffness.'
      }
    ],
    samiSpecificBenefit: 'Protects Sami’s arterial flexibility and coronary vessels from calcification while boosting the metabolic action of Dapagliflozin and morning workouts on insulin sensitivity.',
    absorptionSynergy: 'Fat-soluble vitamins: take with morning whole eggs, olive oil, or avocado for maximum bioavailability.'
  },
  {
    id: 'creatine',
    name: 'Creatine Monohydrate (5g)',
    subtitle: 'Cellular ATP & GLUT-4 Translocation',
    dose: '5 grams Daily',
    timing: '07:00 AM (Pre-Workout with 500ml Water)',
    category: 'Ergogenic & Glycemic Booster',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    icon: '🏋️',
    targetBiomarkers: ['Phosphocreatine (PCr) Muscle Stores ↑', 'Insulin-Independent Glucose Uptake ↑', 'Lean Muscle Power ↑'],
    primaryOrgans: ['Skeletal Muscle', 'Brain / Neurons', 'Mitochondria'],
    overview: 'The most clinically researched ergogenic aid in sports medicine. Regenerates ATP during high-intensity muscle contractions and triggers insulin-independent GLUT-4 glucose transport into muscle cells.',
    clinicalMechanisms: [
      {
        title: 'Rapid Phosphagen ATP Regeneration',
        detail: 'Donates a phosphate group to ADP, instantly regenerating ATP during bodyweight squats, push-ups, and gym machine presses.'
      },
      {
        title: 'GLUT-4 Glucose Translocation',
        detail: 'Increases intracellular osmotic pressure and activates AMPK signaling, pulling glucose out of the bloodstream into muscle tissue without requiring insulin spikes.'
      },
      {
        title: 'Muscle Protein Synthesis & Anti-Sarcopenia',
        detail: 'Increases muscle cell hydration and myoblast differentiation, preserving functional lean mass while losing fat.'
      }
    ],
    samiSpecificBenefit: 'Allows Sami to burn more calories and clear circulating blood sugar rapidly during the 15-minute morning routine, accelerating fat loss from 82.70 kg to 75.00 kg.',
    absorptionSynergy: 'Mix 5g with 500ml water and take with pre-workout morning coffee. Exercise increases creatine transporter activity into skeletal muscle.'
  },
  {
    id: 'b12',
    name: 'Vitamin B12 (1000 mcg Methylcobalamin)',
    subtitle: 'Nerve Health & Cellular Metabolism',
    dose: '1000 mcg Daily',
    timing: '08:30 AM (Morning Meal)',
    category: 'Neuro-Metabolic Vitamin',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    icon: '🧠',
    targetBiomarkers: ['Homocysteine Clearance', 'Myelin Sheath Integrity', 'RBC Hemoglobin Synthesis'],
    primaryOrgans: ['Peripheral Nerves', 'Bone Marrow', 'Brain & Spinal Cord'],
    overview: 'Bioavailable active coenzyme form of B12. Essential for myelin sheath nerve preservation, methylation cycles, and red blood cell hemoglobin oxygenation.',
    clinicalMechanisms: [
      {
        title: 'Diabetic Nerve Myelin Protection',
        detail: 'Supports the production of phospholipids that insulate peripheral nerves, guarding against diabetic peripheral neuropathy and tingling.'
      },
      {
        title: 'Homocysteine Methylation',
        detail: 'Converts vascular-toxic homocysteine into benign methionine, protecting the endothelial lining of coronary and brain vessels.'
      }
    ],
    samiSpecificBenefit: 'Essential neuro-protective support for diabetic nerve health, cognitive sharpness, and daily cellular energy output.',
    absorptionSynergy: 'Take sublingually or with breakfast.'
  },
  {
    id: 'omega3',
    name: 'Omega-3 Select (1000 mg Purified EPA/DHA)',
    subtitle: 'Cardiovascular & Anti-Inflammatory Lipids',
    dose: '1000 mg EPA/DHA Daily',
    timing: '07:00 PM (Evening Dinner)',
    category: 'Essential Fatty Acids',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    icon: '🐟',
    targetBiomarkers: ['Serum Triglycerides ↓', 'Resolvins / Protectins ↑', 'Endothelial Flow-Mediated Dilation ↑'],
    primaryOrgans: ['Heart', 'Vascular Endothelium', 'Joint Cartilage', 'Brain Cell Membranes'],
    overview: 'Concentrated marine EPA (Eicosapentaenoic Acid) and DHA (Docosahexaenoic Acid) fatty acids that lower circulating blood triglycerides and reduce systemic joint and vascular inflammation.',
    clinicalMechanisms: [
      {
        title: 'Hepatic Triglyceride Reduction',
        detail: 'Downregulates sterol regulatory element-binding protein 1c (SREBP-1c) in the liver, suppressing VLDL triglyceride production.'
      },
      {
        title: 'Anti-Inflammatory Resolvins',
        detail: 'Converts into specialized pro-resolving mediators (SPMs) that actively turn off chronic inflammatory signaling in blood vessels and joints.'
      }
    ],
    samiSpecificBenefit: 'Works synergistically with Rosuvastatin to keep blood clean, plaques stabilized, and knees/joints smooth during squats and machine workouts.',
    absorptionSynergy: 'Take with evening dinner containing dietary fats for maximum emulsification and lymphatic absorption.'
  },
  {
    id: 'magnesium',
    name: 'Magnesium Citrate (200–400 mg)',
    subtitle: 'Insulin Receptor & Nocturnal Recovery',
    dose: '200–400 mg Daily',
    timing: '09:30 PM (30–60m Before Bed)',
    category: 'Electrolyte & Neuromuscular Relaxant',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: '🌙',
    targetBiomarkers: ['Insulin Tyrosine Kinase Activation ↑', 'Nocturnal Heart Rate Variability (HRV) ↑', 'GABA Receptor Binding ↑'],
    primaryOrgans: ['Skeletal Muscle', 'Heart Conductive System', 'Central Nervous System', 'Pancreas'],
    overview: 'Essential mineral cofactor for over 300 enzymatic reactions, crucial for insulin receptor phosphorylation, smooth muscle relaxation, and deep restorative sleep.',
    clinicalMechanisms: [
      {
        title: 'Insulin Receptor Tyrosine Kinase',
        detail: 'Magnesium is the obligate cofactor for tyrosine kinase phosphorylation inside cells; deficiency induces immediate peripheral insulin resistance.'
      },
      {
        title: 'GABA-A Receptor Activation & Muscle Relaxation',
        detail: 'Binds to GABA neuro-receptors in the brain and displaces intracellular calcium in muscle fibers, releasing physical tension and improving sleep architecture.'
      }
    ],
    samiSpecificBenefit: 'Promotes deep Stage 3/4 slow-wave sleep (where growth hormone and recovery peak) and keeps morning fasting glucose low.',
    absorptionSynergy: 'Take with a glass of water before bed.'
  }
]

export function SupplementBenefitsCockpit() {
  const [selectedId, setSelectedId] = useState<string>('ultra-testo-boost')

  const selected = SUPPLEMENT_BENEFITS.find(s => s.id === selectedId) || SUPPLEMENT_BENEFITS[0]

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#120e0a] via-[#10141a] to-black p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 border border-amber-500/40 text-amber-300">
                Evidence-Based Pharmacognosy
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 border border-teal-500/40 text-teal-300">
                8 Active Supplements
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" /> Clinical Supplement Benefits &amp; Bio-Mechanisms
            </h2>
            <p className="text-xs sm:text-sm text-foreground/70 font-medium">
              Detailed biological mechanisms, target organs, absorption synergies, and metabolic rationale for Sami Suliman.
            </p>
          </div>
        </div>

        {/* Horizontal Selector Pill Buttons */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
          {SUPPLEMENT_BENEFITS.map(supp => {
            const isSelected = supp.id === selectedId
            return (
              <button
                key={supp.id}
                type="button"
                onClick={() => setSelectedId(supp.id)}
                className={`px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap min-h-[44px] ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-white/[0.03] text-foreground/70 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <span>{supp.icon}</span>
                <span>{supp.name.split('(')[0].replace('Webber Naturals ', '')}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Supplement Deep-Dive Hero Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0e1217] via-[#0f151c] to-black p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Info */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-white/[0.08]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${selected.badgeColor}`}>
                  {selected.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/[0.05] border border-white/10 text-foreground/80">
                  Dose: {selected.dose}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <span className="text-3xl">{selected.icon}</span> {selected.name}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-amber-300">
                {selected.subtitle}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-left md:text-right self-start md:self-auto space-y-0.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/50 flex items-center gap-1 md:justify-end">
                <Clock className="w-3 h-3 text-teal-400" /> Optimal Clinical Timing
              </div>
              <div className="text-xs font-black text-teal-300">{selected.timing}</div>
            </div>
          </div>

          {/* Overview Statement */}
          <div className="relative z-10 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs sm:text-sm text-foreground/85 leading-relaxed font-medium">
            {selected.overview}
          </div>

          {/* Target Biomarkers & Primary Organs Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/25 space-y-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Target Biomarkers &amp; Clinical Endpoints
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selected.targetBiomarkers.map((bm, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-white font-bold text-[11px]">
                    {bm}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/25 space-y-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" /> Primary Target Organs
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selected.primaryOrgans.map((organ, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-white font-bold text-[11px]">
                    {organ}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Multi-Ingredient Breakdown (if formula like Testo Boost) */}
          {selected.ingredients && (
            <div className="relative z-10 space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Active Standardized Botanical &amp; Mineral Ingredients
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selected.ingredients.map((ing, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                    <div className="flex items-center justify-between text-xs font-black text-white">
                      <span>{ing.name}</span>
                      <span className="font-mono text-[10px] text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-md">
                        {ing.dose}
                      </span>
                    </div>
                    <p className="text-[11px] text-foreground/70 font-medium leading-relaxed">
                      {ing.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Biological Modes of Action */}
          <div className="relative z-10 space-y-3">
            <div className="text-xs font-black uppercase tracking-wider text-teal-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" /> Key Biological Modes of Action
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selected.clinicalMechanisms.map((mech, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1.5">
                  <div className="font-bold text-xs text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                    <span>{mech.title}</span>
                  </div>
                  <p className="text-[11px] text-foreground/70 font-medium leading-relaxed">
                    {mech.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sami-Specific Metabolic Impact & Absorption Synergy */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-4 border-t border-white/[0.08]">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-400" /> Sami&apos;s Specific Clinical Target
              </div>
              <p className="text-xs text-foreground/90 font-semibold leading-relaxed">
                {selected.samiSpecificBenefit}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/30 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-teal-400" /> Clinical Absorption &amp; Timing Synergy
              </div>
              <p className="text-xs text-foreground/90 font-semibold leading-relaxed">
                {selected.absorptionSynergy}
              </p>
            </div>
          </div>

        </motion.div>
      </AnimatePresence>

    </div>
  )
}

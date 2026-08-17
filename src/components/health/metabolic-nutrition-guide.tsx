'use client'

import { useState } from 'react'
import { 
  Apple, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Droplets, 
  Check, 
  ChevronRight, 
  AlertTriangle, 
  Utensils, 
  Clock, 
  Info,
  CheckCircle2,
  TrendingDown,
  Layers,
  Heart,
  Pill,
  Leaf,
  Scale,
  Coffee,
  Sun,
  Moon,
  Zap,
  Filter
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserProfile } from '@/context/user-profile-context'

export interface FoodCategory {
  id: string
  title: string
  subtitle: string
  plateShare: string
  badgeColor: string
  icon: string
  description: string
  foods: {
    name: string
    portion: string
    glycemicIndex: 'Zero / Negligible (GI 0)' | 'Very Low (GI < 15)' | 'Low (GI 15–35)' | 'Moderate (GI 35–50)'
    clinicalBenefit: string
    keyNutrients: string
    isHero?: boolean
    timing?: string
  }[]
}

const FOOD_CATEGORIES: FoodCategory[] = [
  {
    id: 'coffee',
    title: 'Coffee Lover Clinical Protocol',
    subtitle: 'Optimal Timing, Dosing & Blood Sugar Synergy',
    plateShare: '2–3 Cups Max / Day',
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    icon: '☕',
    description: 'Coffee is rich in chlorogenic acid polyphenols that improve cellular glucose uptake. Follow strict timing to optimize fat mobilization without elevating evening cortisol or blood pressure.',
    foods: [
      {
        name: 'Cup 1: Pre-Workout Espresso / Black Americano',
        portion: '1 Double Shot or 250ml Black Coffee',
        glycemicIndex: 'Zero / Negligible (GI 0)',
        timing: '07:00 AM (20–30m before morning calisthenics)',
        clinicalBenefit: 'Synergizes with Creatine (5g) and morning workout to trigger adrenaline, accelerate lipolysis (fat breakdown), and activate insulin-independent GLUT-4 muscle glucose transporters.',
        keyNutrients: 'Chlorogenic Acid, 80–120mg Caffeine, Potassium, Magnesium',
        isHero: true
      },
      {
        name: 'Cup 2: Mid-Morning Focus Coffee',
        portion: '1 Cup (250ml) Black or with Ceylon Cinnamon',
        glycemicIndex: 'Zero / Negligible (GI 0)',
        timing: '10:00 AM – 10:30 AM (90–120m after waking)',
        clinicalBenefit: 'Taken after your natural morning cortisol awakening spike begins to taper. Adding Ceylon cinnamon enhances insulin receptor phosphorylation and blunts hunger.',
        keyNutrients: 'Antioxidants, Trigonelline, Cinnamaldehyde (if cinnamon added)',
        isHero: true
      },
      {
        name: 'Cup 3: Early Afternoon Post-Lunch Digestif (Optional)',
        portion: '1 Single Espresso or Americano',
        glycemicIndex: 'Zero / Negligible (GI 0)',
        timing: '01:30 PM – 02:00 PM (Hard Stop at 02:00 PM)',
        clinicalBenefit: 'Chlorogenic acid inhibits glucose-6-phosphatase in the liver, helping reduce post-lunch glucose surge. MUST be consumed before 2:00 PM to protect nocturnal sleep architecture.',
        keyNutrients: 'Polyphenols, 60mg Caffeine'
      },
      {
        name: '1:1 Hydration Matching Rule',
        portion: '1 Glass (300ml) Water per Cup of Coffee',
        glycemicIndex: 'Zero / Negligible (GI 0)',
        timing: 'Immediately alongside each coffee',
        clinicalBenefit: 'Mandatory with Dapagliflozin: Coffee is a mild diuretic. Adequate water volume prevents dehydration, prevents Ramipril orthostatic dips, and ensures kidney filtration.',
        keyNutrients: 'Pure H2O, Cellular Hydration',
        isHero: true
      }
    ]
  },
  {
    id: 'veggies',
    title: 'Vegetables Guide (50% Plate Foundation)',
    subtitle: 'Soluble Fiber, Nitrates & Sulforaphane',
    plateShare: '50% of Plate (Unlimited Non-Starchy)',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    icon: '🥦',
    description: 'Non-starchy vegetables should form half of every lunch and dinner. They form a physical viscous barrier in the intestine, slowing carbohydrate absorption and blunting post-meal glucose spikes.',
    foods: [
      {
        name: 'Broccoli, Broccolini & Brussels Sprouts',
        portion: '1.5 – 2 Cups (Steamed / Roasted in Olive Oil)',
        glycemicIndex: 'Very Low (GI < 15)',
        clinicalBenefit: 'Contains sulforaphane which triggers Nrf2 antioxidant cellular defense and inhibits excessive hepatic gluconeogenesis (liver glucose dumping).',
        keyNutrients: 'Sulforaphane, Fiber (5g), Vitamin C, Chromium',
        isHero: true
      },
      {
        name: 'Dark Leafy Greens (Spinach, Baby Kale, Arugula, Chard)',
        portion: '2 – 3 Big Handfuls Daily',
        glycemicIndex: 'Very Low (GI < 15)',
        clinicalBenefit: 'High in bioavailable magnesium and dietary nitrates. Relaxes vascular endothelial walls (synergizes with Ramipril) and enhances insulin receptor sensitivity.',
        keyNutrients: 'Magnesium (80mg), Folate, Lutein, Natural Nitrates',
        isHero: true
      },
      {
        name: 'Asparagus Spears',
        portion: '8 – 10 Spears (Grilled / Sautéed)',
        glycemicIndex: 'Very Low (GI < 15)',
        clinicalBenefit: 'Packed with inulin prebiotic fiber which feeds gut Akkermansia muciniphila (the bacterium that improves metabolic endotoxemia and insulin sensitivity).',
        keyNutrients: 'Inulin Prebiotic, Chromium, Potassium, Vitamin K'
      },
      {
        name: 'Zucchini, Cucumbers & Celery',
        portion: '1 Medium Zucchini / 1 Whole Cucumber',
        glycemicIndex: 'Very Low (GI < 15)',
        clinicalBenefit: '95% cellular electrolyte water that assists Dapagliflozin in flushing excess blood glucose through the kidneys without adding calories.',
        keyNutrients: 'Electrolyte Water, Potassium, Vitamin C, Silica'
      },
      {
        name: 'Cauliflower (Riced, Steamed or Roasted)',
        portion: '1 – 2 Cups',
        glycemicIndex: 'Very Low (GI < 15)',
        clinicalBenefit: '1:1 replacement for white rice or mashed potatoes. Reduces meal carbohydrate load by 85% while delivering choline for liver health.',
        keyNutrients: 'Choline, Glucosinolates, Dietary Fiber (3g)'
      },
      {
        name: 'Garlic, Red Onions & Leeks (Allium Family)',
        portion: '2 Cloves Garlic / 1/2 Onion in cooking',
        glycemicIndex: 'Very Low (GI < 15)',
        clinicalBenefit: 'Allicin and quercetin compounds improve blood vessel elasticity, reduce LDL oxidation, and enhance fasting blood glucose regulation.',
        keyNutrients: 'Allicin, Quercetin, Prebiotic FOS, Sulfur'
      },
      {
        name: 'Medicinal & Culinary Mushrooms (Shiitake, Cremini, Portobello)',
        portion: '1 Cup Sautéed',
        glycemicIndex: 'Very Low (GI < 15)',
        clinicalBenefit: 'Rich in beta-glucans and ergothioneine, powerful cellular antioxidants that modulate immune response and reduce glycemic excursions.',
        keyNutrients: 'Beta-Glucans, Ergothioneine, Selenium, B-Vitamins'
      }
    ]
  },
  {
    id: 'fruits',
    title: 'Fruits Guide (Low-GI & High-Polyphenol)',
    subtitle: 'Antioxidants, Anthocyanins & Safe Glycemic Loads',
    plateShare: '1–2 Servings / Day (With Meals / Post-Workout)',
    badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    icon: '🍓',
    description: 'For Type 2 Diabetes, choose only low-glycemic, high-polyphenol whole fruits. Never drink fruit juice or fruit smoothies (which lack intact fiber and flood the liver with rapid fructose).',
    foods: [
      {
        name: 'Wild Blueberries & Blackberries',
        portion: '1/2 – 3/4 Cup (Fresh or Frozen Unsweetened)',
        glycemicIndex: 'Low (GI 15–35)',
        timing: 'Morning breakfast or immediately post-workout',
        clinicalBenefit: 'Clinical trials show daily blueberry anthocyanins improve whole-body insulin sensitivity by up to 22% and protect retinal microvasculature.',
        keyNutrients: 'Anthocyanins (400mg), Fiber (4g), Vitamin C, Manganese',
        isHero: true
      },
      {
        name: 'Hass Avocado (The Ultimate Metabolic Fruit)',
        portion: '1/2 to 1 Whole Avocado Daily',
        glycemicIndex: 'Zero / Negligible (GI 0)',
        timing: 'Breakfast or Lunch',
        clinicalBenefit: 'Technically a fruit! Delivers 10g of prebiotic fiber and 700mg potassium. Essential for absorbing fat-soluble CoQ10 200mg and Vitamin K2+D3.',
        keyNutrients: '10g Fiber, Monounsaturated Oleic Acid, Potassium (700mg)',
        isHero: true
      },
      {
        name: 'Raspberries & Strawberries',
        portion: '1 Cup Whole Berries',
        glycemicIndex: 'Low (GI 15–35)',
        timing: 'Breakfast or Midday meal',
        clinicalBenefit: 'Highest fiber-to-sugar ratio of any sweet fruit (8g fiber in 1 cup of raspberries). Fisetin and ellagic acid promote cellular autophagy.',
        keyNutrients: 'Fiber (8g), Ellagitannins, Fisetin, Vitamin C (100% DV)'
      },
      {
        name: 'Tart Green Apples (Granny Smith)',
        portion: '1/2 to 1 Medium Apple (with Skin)',
        glycemicIndex: 'Low (GI 15–35)',
        timing: 'Afternoon snack with raw walnuts',
        clinicalBenefit: 'Rich in apple pectin soluble fiber which binds bile acids in the gut, supporting Rosuvastatin cholesterol clearance and feeding colonocytes.',
        keyNutrients: 'Apple Pectin (Soluble Fiber), Quercetin, Malic Acid'
      },
      {
        name: 'Lemons & Limes (Fresh Squeezed)',
        portion: 'Juice of 1/2 Lemon in morning water or salad',
        glycemicIndex: 'Very Low (GI < 15)',
        timing: 'Morning hydration & meal dressing',
        clinicalBenefit: 'Citric acid slows salivary and pancreatic amylase breakdown of complex starches, lowering glycemic spikes by 15–20%.',
        keyNutrients: 'Citric Acid, Vitamin C, Hesperidin Flavonoids'
      }
    ]
  },
  {
    id: 'proteins',
    title: 'Lean & Anti-Inflammatory Proteins (30% Plate)',
    subtitle: 'Muscle Preservation, Satiety & GLUT-4 Translocation',
    plateShare: '30% of Plate (Every Main Meal)',
    badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    icon: '🥩',
    description: 'Stimulates Muscle Protein Synthesis (MPS), elevates glucagon-like peptide-1 (GLP-1) satiety signaling, and protects lean metabolic mass during weight reduction from 82.7kg to 75.0kg.',
    foods: [
      {
        name: 'Wild Alaskan Salmon & Sardines',
        portion: '150g – 200g (5–7 oz)',
        glycemicIndex: 'Zero / Negligible (GI 0)',
        clinicalBenefit: 'High EPA/DHA omega-3s reduce cellular insulin resistance and triglyceride levels while supporting joint recovery after exercise.',
        keyNutrients: '34g Protein, 2000mg EPA/DHA Omega-3, Astaxanthin, Vitamin D3',
        isHero: true
      },
      {
        name: 'Pasture-Raised Whole Eggs',
        portion: '2 – 3 Whole Eggs',
        glycemicIndex: 'Zero / Negligible (GI 0)',
        clinicalBenefit: 'Zero carbohydrate impact with complete essential amino acid profile. Yolk lipids maximize fat-soluble K2/D3 and CoQ10 200mg absorption.',
        keyNutrients: '18g Protein, Choline (300mg), Lutein, Zeaxanthin, Vitamin D3',
        isHero: true
      },
      {
        name: 'Organic Chicken Breast / Turkey Tenderloin',
        portion: '150g – 180g (Grilled/Baked)',
        glycemicIndex: 'Zero / Negligible (GI 0)',
        clinicalBenefit: 'High leucine concentration (2.5g/serving) triggers mTOR for skeletal muscle preservation during fat loss.',
        keyNutrients: '38g Clean Protein, Leucine, Niacin, Selenium'
      },
      {
        name: 'Lean Grass-Fed Beef (90/10)',
        portion: '120g – 150g (2-3x per week)',
        glycemicIndex: 'Zero / Negligible (GI 0)',
        clinicalBenefit: 'Naturally rich in endogenous creatine precursors, carnitine for fatty acid transport, and heme iron.',
        keyNutrients: '30g Protein, Heme Iron, Zinc, CLA, Creatine Precursors, Vitamin B12'
      },
      {
        name: '0% Plain Greek Yogurt / Icelandic Skyr',
        portion: '1 Cup (200g)',
        glycemicIndex: 'Low (GI 15–35)',
        clinicalBenefit: 'Slow-digesting micellar casein protein provides 4–6 hours of sustained amino acid delivery and gut probiotics.',
        keyNutrients: '20g Protein, Probiotics, Calcium (250mg), Potassium'
      }
    ]
  },
  {
    id: 'fats_carbs',
    title: 'Healthy Lipids & Low-GI Complex Carbs (20% Plate)',
    subtitle: 'Hormonal Health & Slow-Fermenting Prebiotics',
    plateShare: '20% of Plate',
    badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    icon: '🥑',
    description: 'Provides essential fat-soluble vitamin cofactors (K2, D3, CoQ10) and slow-fermenting prebiotic resistant starches without rapid insulin surges.',
    foods: [
      {
        name: 'Extra Virgin Olive Oil (Cold-Pressed)',
        portion: '1 – 2 Tablespoons Daily (Raw on salads/veggies)',
        glycemicIndex: 'Zero / Negligible (GI 0)',
        clinicalBenefit: 'Oleocanthal acts as a natural vascular anti-inflammatory; improves endothelial nitric oxide bioavailability alongside Ramipril.',
        keyNutrients: 'Oleic Acid (Omega-9), Polyphenols, Vitamin E',
        isHero: true
      },
      {
        name: 'Raw Walnuts & Almonds',
        portion: 'Handful (30g / 1 oz)',
        glycemicIndex: 'Very Low (GI < 15)',
        clinicalBenefit: 'Alpha-linolenic acid (ALA) supports brain function and metabolic flexibility while curbing afternoon hunger.',
        keyNutrients: '6g Protein, 4g Fiber, ALA Omega-3, Magnesium (75mg)'
      },
      {
        name: 'Chia Seeds & Ground Flaxseeds',
        portion: '1 – 2 Tablespoons',
        glycemicIndex: 'Very Low (GI < 15)',
        clinicalBenefit: 'Soluble mucilage fiber forms a gel in stomach, flattening post-prandial glucose curves by up to 35%.',
        keyNutrients: '5g Fiber, 3g ALA Omega-3, Lignans (Phyto-antioxidants)'
      },
      {
        name: 'Cooked Lentils & Black Beans (Portion Controlled)',
        portion: '1/2 Cup Cooked',
        glycemicIndex: 'Low (GI 15–35)',
        clinicalBenefit: 'Resistant starch passes to colon intact, feeding short-chain fatty acid (butyrate) production and improving next-day fasting glucose.',
        keyNutrients: '9g Protein, 8g Fiber, Resistant Starch, Folate'
      },
      {
        name: 'Quinoa & Steel-Cut Oats (Eat Last in Meal Sequence)',
        portion: '1/2 Cup Cooked',
        glycemicIndex: 'Moderate (GI 35–50)',
        clinicalBenefit: 'Beta-glucan fiber slows digestion. Always eat AFTER your vegetables and protein to minimize the glucose excursion.',
        keyNutrients: 'Beta-Glucan, Complex Carbs, Iron, B-Vitamins'
      }
    ]
  }
]

const COFFEE_RULES = [
  {
    title: '☕ Ideal Daily Dose',
    rule: '2 to 3 cups maximum per day (Espresso, Americano, or Filtered Black Coffee).',
    rationale: 'Provides ~180–250mg caffeine for peak metabolic thermogenesis without overstimulating adrenal cortisol.'
  },
  {
    title: '⏰ Hard Cut-Off Time: 02:00 PM',
    rule: 'Never drink caffeinated coffee after 2:00 PM.',
    rationale: 'Caffeine has a 5–7 hour half-life. Afternoon caffeine degrades restorative Stage 3/4 deep sleep, spiking morning fasting insulin resistance.'
  },
  {
    title: '⚡ Pre-Workout Synergy (07:00 AM)',
    rule: 'Drink Cup 1 with 500ml water + 5g Creatine 20–30 mins before morning challenge.',
    rationale: 'Elevates cellular cAMP and epinephrine, triggering muscle GLUT-4 glucose uptake without needing insulin.'
  },
  {
    title: '🚫 Zero Added Sugar / Zero Syrups',
    rule: 'Drink Black, or add Ceylon Cinnamon / splash of unsweetened almond/oat milk.',
    rationale: 'Commercial coffee syrups and condensed milk contain 30–50g rapid fructose which instantly halts fat burning.'
  },
  {
    title: '💧 Match 1:1 with Pure Water',
    rule: 'Drink 1 full glass of water with every cup of coffee.',
    rationale: 'Offsets caffeine mild diuretic action and supports Dapagliflozin SGLT-2 urinary filtration.'
  }
]

const FOODS_TO_AVOID = [
  {
    category: 'High-Fructose & High-GI Fruits to Avoid',
    items: 'Dried fruits (dates, raisins, figs, dried apricots), Fruit juices (orange, apple), Smoothies, Mangoes, Pineapples, Ripe Bananas, Grapes, Watermelon',
    reason: 'Pure liquid or concentrated fructose floods the liver, inducing rapid hepatic de novo lipogenesis (fat storage) and massive blood sugar spikes.'
  },
  {
    category: 'Refined Sugars & Sweeteners',
    items: 'White sugar, brown sugar, high fructose corn syrup, sweetened coffee syrups, honey, agave nectar, soda, sweetened iced tea',
    reason: 'Rapidly spikes circulating blood glucose, overwhelming Dapagliflozin renal threshold and driving vascular oxidative stress.'
  },
  {
    category: 'Refined White Flours & Bakery Items',
    items: 'White bread, bagels, croissants, donuts, pastries, standard white pasta, white crackers, commercial pizza crust',
    reason: 'Converts into glucose in <15 minutes in the upper GI tract, creating acute insulin resistance and energy crashes.'
  },
  {
    category: 'Industrial Seed & Vegetable Oils',
    items: 'Deep-fried restaurant foods, commercial margarine, soybean oil, corn oil, canola oil blends',
    reason: 'Heavily oxidized omega-6 linoleic acid drives vascular endothelial inflammation and impairs Ramipril blood pressure efficacy.'
  },
  {
    category: 'Starchy Vegetables to Strictly Limit',
    items: 'White Russet potatoes (fried/mashed/fries), creamed corn, canned veggies in syrup',
    reason: 'Very high glycemic index (GI 85+) that behaves identically to table sugar in the bloodstream.'
  }
]

export function MetabolicNutritionGuide() {
  const { profile } = useUserProfile()
  const [activeCategory, setActiveCategory] = useState<string>('coffee')
  const [showMealPlanModal, setShowMealPlanModal] = useState<boolean>(false)

  const selectedCat = FOOD_CATEGORIES.find(c => c.id === activeCategory) || FOOD_CATEGORIES[0]

  return (
    <div className="space-y-6">
      
      {/* Blueprint Header */}
      <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-[#0c181b] via-[#0d1618] to-black p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-teal-500/10 blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 border border-teal-500/40 text-teal-300">
                Type 2 Clinical Nutrition Protocol
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-300">
                Target: {profile.baselineWeightKg.toFixed(2)} kg → {profile.targetWeightKg.toFixed(2)} kg
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <Utensils className="w-6 h-6 text-teal-400" /> Metabolic Food &amp; Coffee Blueprint
            </h2>
            <p className="text-xs sm:text-sm text-foreground/70 font-medium mt-1">
              Evidence-based food recommendations, coffee timing, and nutrient synergy for Sami Suliman.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowMealPlanModal(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 text-slate-950 font-black text-xs px-4 py-3 rounded-2xl shadow-xl shadow-teal-500/20 hover:brightness-110 transition-all cursor-pointer min-h-[44px]"
          >
            <Clock className="w-4 h-4" /> View Sami&apos;s Daily Meal &amp; Coffee Timeline
          </button>
        </div>

        {/* The 3-Pillar Plate Rule Visual */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center justify-between">
              <span>50% Non-Starchy Greens</span>
              <span>🥦 Step 1</span>
            </div>
            <p className="text-xs font-bold text-white">Eat Vegetables &amp; Soluble Fiber First</p>
            <p className="text-[11px] text-foreground/70 leading-snug">
              Coats the intestinal lining to blunt rapid sugar absorption.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-blue-400 flex items-center justify-between">
              <span>30% Lean Bio-Protein</span>
              <span>🥩 Step 2</span>
            </div>
            <p className="text-xs font-bold text-white">Eat Protein &amp; Healthy Lipids Next</p>
            <p className="text-[11px] text-foreground/70 leading-snug">
              Triggers GLP-1 satiety hormones, protects muscle during fat loss.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center justify-between">
              <span>20% Low-GI Carbs / Berries</span>
              <span>🥑 Step 3</span>
            </div>
            <p className="text-xs font-bold text-white">Eat Starches &amp; Berries Last</p>
            <p className="text-[11px] text-foreground/70 leading-snug">
              Food order sequencing cuts post-meal glucose spike by up to 73%.
            </p>
          </div>
        </div>
      </div>

      {/* Coffee Lover Banner / Highlight */}
      <div className="bg-gradient-to-r from-amber-950/40 via-[#18120b] to-black border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 shadow-md">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">Coffee Lover Clinical Guidelines</h3>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  2–3 Cups / Day
                </span>
              </div>
              <p className="text-xs text-foreground/70 mt-0.5">
                How to enjoy coffee while maximizing fat burning and preserving restorative sleep
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {COFFEE_RULES.map(rule => (
            <div key={rule.title} className="p-4 rounded-2xl bg-white/[0.03] border border-amber-500/20 space-y-1">
              <div className="text-xs font-black text-amber-300">{rule.title}</div>
              <p className="text-xs font-bold text-white leading-snug">{rule.rule}</p>
              <p className="text-[11px] text-foreground/60 leading-relaxed font-medium mt-1">
                {rule.rationale}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {FOOD_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-black transition-all whitespace-nowrap cursor-pointer min-h-[44px] ${
              activeCategory === cat.id
                ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/30'
                : 'bg-white/[0.04] text-foreground/70 border border-white/[0.08] hover:bg-white/[0.08]'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.title}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeCategory === cat.id ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-white/10 text-foreground/60'
            }`}>
              {cat.plateShare}
            </span>
          </button>
        ))}
      </div>

      {/* Food Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-base font-bold text-white">{selectedCat.title}</h3>
            <p className="text-xs text-foreground/60">{selectedCat.description}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${selectedCat.badgeColor}`}>
            {selectedCat.plateShare}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {selectedCat.foods.map((food, idx) => (
            <motion.div
              key={food.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`p-4 sm:p-5 rounded-2xl border transition-all relative overflow-hidden ${
                food.isHero 
                  ? 'bg-gradient-to-br from-teal-950/30 via-white/[0.02] to-black border-teal-500/40 shadow-lg' 
                  : 'bg-white/[0.02] border-white/[0.07] hover:border-teal-500/30'
              }`}
            >
              {food.isHero && (
                <div className="absolute top-0 right-0 px-2.5 py-0.5 rounded-bl-xl bg-teal-500/20 border-l border-b border-teal-500/40 text-[9px] font-black uppercase text-teal-300">
                  ★ Protocol Flagship
                </div>
              )}

              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white">{food.name}</h4>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[11px] font-mono text-teal-300 font-bold bg-teal-500/10 px-2 py-0.5 rounded-md">
                      Portion: {food.portion}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {food.glycemicIndex}
                    </span>
                    {food.timing && (
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md">
                        {food.timing}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-xs text-foreground/80 font-medium mt-2.5 leading-relaxed">
                {food.clinicalBenefit}
              </p>

              <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-foreground/50">
                <span className="font-mono text-teal-400/80 font-semibold">{food.keyNutrients}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Foods to Avoid / Minimize Matrix */}
      <section className="bg-background border border-rose-500/30 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
          <div className="p-2.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Foods, Fruits &amp; Sugars to Strictly Minimize / Avoid</h3>
            <p className="text-xs text-foreground/60">Mitigating rapid arterial stress &amp; post-prandial glycemic excursions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {FOODS_TO_AVOID.map(item => (
            <div key={item.category} className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-1.5">
              <div className="font-bold text-xs text-rose-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                {item.category}
              </div>
              <p className="text-xs font-semibold text-white">{item.items}</p>
              <p className="text-[11px] text-foreground/60 leading-relaxed font-medium">
                {item.reason}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sample Daily Meal & Coffee Plan Modal */}
      <AnimatePresence>
        {showMealPlanModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowMealPlanModal(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-[101] w-full max-w-2xl bg-[#0e1115] border border-teal-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 max-h-[88vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 bg-teal-500/20 border border-teal-500/30 text-teal-300 text-[10px] font-black uppercase rounded-full">
                      Sami Suliman Daily Schedule
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-white">Daily Meal, Coffee &amp; Supplement Timeline</h3>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    Coordinated with morning calisthenics, Coffee, Creatine, Dapagliflozin, CoQ10 200mg, K2+D3 &amp; Evening Meds
                  </p>
                </div>
                <button onClick={() => setShowMealPlanModal(false)} className="text-white/60 hover:text-white p-2 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center">
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                
                {/* 07:00 AM */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between text-amber-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Coffee className="w-4 h-4" /> 07:00 AM — Coffee Cup 1 + Pre-Workout Creatine
                    </span>
                    <span className="font-mono text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-md">Pre-Training</span>
                  </div>
                  <p className="text-white font-medium">
                    Drink <strong>Cup 1 Coffee (Espresso or Black Americano)</strong> alongside <strong>500ml water</strong> mixed with <strong>5g Creatine Monohydrate</strong>.
                  </p>
                  <p className="text-[11px] text-foreground/70">
                    Why: Caffeine + Creatine accelerates muscular ATP replenishment during the 15-minute challenge and drives GLUT-4 glucose clearance into muscle tissue.
                  </p>
                </div>

                {/* 08:30 AM */}
                <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 space-y-2">
                  <div className="flex items-center justify-between text-teal-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Utensils className="w-4 h-4" /> 08:30 AM — Breakfast &amp; Morning Clinical Protocol
                    </span>
                    <span className="font-mono text-[10px] bg-teal-500/20 px-2 py-0.5 rounded-md">Post-Workout Meal</span>
                  </div>
                  <div className="text-white font-medium space-y-1">
                    <div>• <strong>Plate</strong>: 2–3 Whole Eggs with sautéed baby spinach, 1/2 avocado slice, and 1/2 cup wild blueberries or raspberries.</div>
                    <div>• <strong>Morning Meds &amp; Supplements</strong>: Take Dapagliflozin 10mg, Ramipril 5mg, Aspirin 81mg, Vitamin B12, <strong>CoQ10 200mg</strong>, and <strong>Vitamin K2+D3 (120mcg/1000 IU)</strong>.</div>
                  </div>
                  <p className="text-[11px] text-foreground/70">
                    Why: The healthy fats from whole eggs and avocado maximize absorption of fat-soluble CoQ10, Vitamin K2, and Vitamin D3.
                  </p>
                </div>

                {/* 10:30 AM */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between text-amber-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Coffee className="w-4 h-4" /> 10:30 AM — Coffee Cup 2 (Mid-Morning Focus)
                    </span>
                    <span className="font-mono text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-md">Mid-Morning</span>
                  </div>
                  <p className="text-white font-medium">
                    Enjoy <strong>Cup 2 Coffee (Black or with a dash of Ceylon Cinnamon)</strong> + <strong>1 full glass (300ml) water</strong>.
                  </p>
                  <p className="text-[11px] text-foreground/70">
                    Why: Taken when morning cortisol begins declining for calm mental alertness. Cinnamon improves insulin receptor sensitivity.
                  </p>
                </div>

                {/* 12:30 PM */}
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2">
                  <div className="flex items-center justify-between text-blue-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Utensils className="w-4 h-4" /> 12:30 PM — Metabolic Lunch Plate
                    </span>
                    <span className="font-mono text-[10px] bg-blue-500/20 px-2 py-0.5 rounded-md">Midday Refuel</span>
                  </div>
                  <div className="text-white font-medium space-y-1">
                    <div>• <strong>Plate</strong>: 160g Grilled Chicken Breast or Wild Salmon over a massive mixed green salad (cucumbers, bell peppers, extra virgin olive oil + lemon dressing) with 1/2 cup cooked lentils.</div>
                  </div>
                  <p className="text-[11px] text-foreground/70">
                    Why: High bioavailable protein + polyphenol greens stabilizes midday glycemic control with zero energy crash.
                  </p>
                </div>

                {/* 01:30 PM */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between text-amber-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Coffee className="w-4 h-4" /> 01:30 PM — Coffee Cup 3 (Optional Digestif &amp; Daily Cut-off)
                    </span>
                    <span className="font-mono text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-md">02:00 PM Hard Stop</span>
                  </div>
                  <p className="text-white font-medium">
                    Optional <strong>Single Espresso or Americano</strong> + <strong>1 full glass water</strong>. Last caffeine of the day.
                  </p>
                  <p className="text-[11px] text-foreground/70">
                    Why: Chlorogenic acid slows glucose uptake from lunch. No caffeine after 2:00 PM ensures uninterrupted deep REM sleep.
                  </p>
                </div>

                {/* 04:00 PM */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                  <div className="flex items-center justify-between text-indigo-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Apple className="w-4 h-4" /> 04:00 PM — Satiety Bridge (Optional)
                    </span>
                    <span className="font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded-md">Afternoon</span>
                  </div>
                  <div className="text-white font-medium">
                    • 1 Handful (30g) raw walnuts or almonds, OR 1 cup 0% Greek yogurt with Ceylon cinnamon.
                  </div>
                  <p className="text-[11px] text-foreground/70">
                    Why: Prevents evening hunger cravings and supplies magnesium for vascular health.
                  </p>
                </div>

                {/* 07:00 PM */}
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between text-indigo-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Utensils className="w-4 h-4" /> 07:00 PM — Evening Dinner &amp; Overnight Recovery
                    </span>
                    <span className="font-mono text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded-md">Dinner Regimen</span>
                  </div>
                  <div className="text-white font-medium space-y-1">
                    <div>• <strong>Plate</strong>: Baked white fish or lean grass-fed beef with roasted broccoli and asparagus with olive oil drizzle.</div>
                    <div>• <strong>Evening Meds &amp; Supplements</strong>: Take Rosuvastatin 40mg, Omega 3 Select, and Magnesium Citrate with water.</div>
                  </div>
                  <p className="text-[11px] text-foreground/70">
                    Why: Magnesium and Omega 3 promote deep parasympathetic recovery and prevent nocturnal muscle cramps.
                  </p>
                </div>

              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowMealPlanModal(false)}
                  className="w-full py-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-bold text-xs transition-colors cursor-pointer min-h-[44px]"
                >
                  Close Meal &amp; Coffee Schedule
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

# My Journey™ — The Story of Your Transformation
*Sprint 4 Phase B Specification*

This document outlines the execution plan for Phase B of the NEXORA Intelligence Engine™. Rather than treating "My Journey" as a standard progress timeline, we are treating it as a **Personal Documentary**. It is the emotional center and the biography of the user's fitness journey.

---

## 1. UX Structure: Visual Chapters

The journey is not an endless feed. It is structured into defined, semantic chapters that give the user a sense of progression and narrative arc.

- **Chapter 1: Starting** (Days 1–7)
- **Chapter 2: Building Habits** (Days 8–28)
- **Chapter 3: Getting Stronger** (Months 2–3)
- **Chapter 4: Transformation** (Months 3–6)
- **Chapter 5: Maintenance & Legacy** (Year 1+)

Each chapter header will feature premium typography, dynamic animations, and an AI-generated chapter summary based on the `MemoryEngine` data.

---

## 2. Memory System & Milestone Cards

We will focus on **Quality over Quantity**. The `MemoryEngine` will not flood the user with generic notifications; achievements must feel earned.

### High-Value Milestones (The "Trophy" Cards)
- First Workout
- First 7-Day Streak
- First Month Completed
- First 5 kg Lost
- 100 Workouts
- 1 Year Anniversary

### AI Monthly Reflections
At the end of every month, the Hybrid Intelligence (LLM) will generate a highly personalized memory card. 
*Example: "August 2026. You completed 12 workouts this month. Your consistency reached 91% and your waist decreased by 2 cm. This was your strongest month since starting NEXORA FIT."* 
This provides data-driven encouragement without falling into motivational clichés.

---

## 3. The "Future Me" Module

A dedicated section within My Journey™ that projects the user's trajectory based strictly on the deterministic `GoalEngine` and `TrendEngine`.

**Flow:**
`Today` ➔ `Goal Forecast` ➔ `Target Date` ➔ `Current Trajectory`

> [!WARNING]
> **Guardrail Check:** All "Future Me" projections must be explicitly labeled as *estimates based on current consistency*, never as guaranteed outcomes or medical promises.

---

## 4. Viral Growth: The Annual Movie (Concept)

At the end of the year, NEXORA FIT will aggregate the milestones, progress photos, weight trends, and AI reflections into a shareable "My 2026 Journey" summary (akin to Spotify Wrapped).
*(Note: For this sprint, we will build the UI scaffold and data structures for this, preparing the foundation for future exportable video generation.)*

---

## 5. Implementation Strategy

### Route Architecture
- `/journey` (Main entry point, scrolling chapter view)
- `/journey/memories/[id]` (Deep link to a specific milestone/photo)
- `/journey/future` (The Future Me forecast view)

### Components
- `ChapterHeader`: Large cinematic typography and blur effects.
- `MemoryCard`: A premium card displaying a photo (or gradient), a milestone icon, and the AI reflection.
- `FutureForecastNode`: Data visualization for the "Future Me" projections.

> [!IMPORTANT]
> **User Review Required**
> 
> Please review this Phase B specification. 
> 
> **Open Question:** For the "Future Me" forecasts, do you want to show a literal line chart extending into the future, or keep it strictly narrative/text-based (e.g., "If you maintain 85% consistency, you are projected to reach your goal by October 12th") to avoid the anxiety of missing numerical chart targets?

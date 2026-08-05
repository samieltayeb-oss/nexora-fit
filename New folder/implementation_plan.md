# My Journey™ — The Story of Your Transformation
*Sprint 4 Phase B Specification — FINAL APPROVED*

This document outlines the execution plan for Phase B of the NEXORA Intelligence Engine™. Rather than treating "My Journey" as a standard progress timeline, it is the **Personal Documentary** of the user's fitness journey.

---

## 1. UX Structure: Visual Chapters & Summaries

The journey is structured into defined, semantic chapters:
- **Chapter 1: Starting**
- **Chapter 2: Building Habits**
- **Chapter 3: Getting Stronger**
- **Chapter 4: Transformation**
- **Chapter 5: Maintenance & Legacy**

**Chapter Endings:** Every chapter concludes with a data-driven summary (e.g., *You completed 18 workouts, lost 2.1kg, increased squat by 20%*), acting as a definitive conclusion to that stage of the journey before the next chapter begins.

---

## 2. The Story Engine (New Deterministic Layer)

We are introducing the **Story Engine**, placed directly before the Recommendation Engine.

**Architecture Flow:**
`Telemetry` ➔ `Recovery, Performance, Goal, Trend, Memory` ➔ **`Story Engine`** ➔ `LLM`

**Responsibilities of the Story Engine:**
- Determine when Chapter transitions occur.
- Assess memory importance and filter high-value milestones.
- Aggregate data for Monthly Reflections and the "Letter to Future Me".
- Compile Annual Highlights for the "NEXORA Year in Motion™".

---

## 3. The "Future Me" Module (Hybrid Experience)

The "Future Me" module completely replaces traditional financial-style line charts with a cinematic, highly explainable visualization.

### The Visualization
A premium, animated Apple-style journey line: `Today ──●──────◎ Goal`.

### The Narrative
Before showing numbers, the system displays a narrative explanation based on current consistency.

### Three Possible Futures
Instead of one static prediction, the `GoalEngine` and `StoryEngine` generate three scenarios to illustrate how habits influence outcomes:
1. **Current Pace** (e.g., Goal by October 12)
2. **Best Pace** (e.g., Goal by September 28)
3. **Slower Pace** (e.g., Goal by November 3)

### Explainability & Confidence
Every forecast will explicitly state **WHY** the estimate was generated (e.g., "Because workout consistency is 91% and weight trend is improving") and prominently display the **Confidence Score** (High, Medium, Low). If confidence is low, it will clearly state the requirement (e.g., "We need three more workouts to forecast confidently").

---

## 4. AI Memories & Letter to Future Me

- **Unique Memory Cards:** Workout, Weight, Strength, Recovery, Milestone, and Journey memories will each have distinct visual layouts.
- **Monthly Reflection / Letter to Future Me:** Every month, the Story Engine prompts the LLM to write a personalized "Dear Future Me..." letter grounded in actual progress data. This creates a deeply emotional archive that users can revisit years later.

---

## 5. Future Implementation: NEXORA Year in Motion™
At the end of the year, the app will generate a shareable, cinematic video export of the user's journey. (Phase B will lay the foundational data structures and UI concepts for this future viral growth feature).

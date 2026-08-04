-- Migration: Exercise Content System Enhancements

-- 1. Extend public.exercises table with comprehensive fields
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS full_description TEXT;
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'strength'; -- strength, warm_up, cardio, mobility, cool_down
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS movement_pattern TEXT; -- push, pull, squat, hinge, lunge, carry, isolation, cardio, mobility
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS before_you_start JSONB; -- Equipment setup, seat adjustment, spotter requirements
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS setup_steps JSONB; -- Array of starting position steps
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS movement_steps JSONB; -- Array of movement steps
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS breathing_instructions TEXT;
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS tempo_guidance TEXT;
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS range_of_motion TEXT;
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS what_to_feel TEXT;
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS stop_conditions TEXT[];
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS easier_variation TEXT;
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS harder_variation TEXT;
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS machine_alternative TEXT;
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS home_alternative TEXT;
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS progression_guidance TEXT;
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS trainer_review_status TEXT DEFAULT 'draft'; -- draft, needs_review, approved
ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS content_version INTEGER DEFAULT 1;

-- 2. Create exercise_media table for multi-view image management
CREATE TABLE IF NOT EXISTS public.exercise_media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
    media_type TEXT NOT NULL DEFAULT 'image', -- image, video
    view_type TEXT NOT NULL, -- start, finish, form_view, mistake
    step_number INTEGER DEFAULT 1,
    storage_path TEXT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    generation_prompt TEXT,
    model_used TEXT,
    review_status TEXT DEFAULT 'ai_generated', -- draft, ai_generated, reviewed, approved, needs_replacement
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ
);

-- 3. Create exercise_alternatives mapping table
CREATE TABLE IF NOT EXISTS public.exercise_alternatives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
    alternative_exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
    reason TEXT NOT NULL, -- machine_unavailable, knee_discomfort, shoulder_discomfort, back_discomfort, balance_difficulty, home_workout
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.exercise_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_alternatives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view exercise media" ON public.exercise_media FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view exercise alternatives" ON public.exercise_alternatives FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public users can view exercise media" ON public.exercise_media FOR SELECT TO anon USING (true);
CREATE POLICY "Public users can view exercise alternatives" ON public.exercise_alternatives FOR SELECT TO anon USING (true);

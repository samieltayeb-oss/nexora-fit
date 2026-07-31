-- SAM FIT - Initial Schema and RLS Policies

-- Enable uuid-ossp extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Health Profiles (core metrics and medical flags)
CREATE TABLE public.health_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    sex TEXT CHECK (sex IN ('Male', 'Female')),
    date_of_birth DATE,
    height_cm NUMERIC,
    starting_weight_kg NUMERIC,
    goal_weight_kg NUMERIC,
    medical_clearance_status TEXT DEFAULT 'Not confirmed',
    medical_clearance_date TIMESTAMPTZ,
    clinician_max_heart_rate INTEGER,
    clinician_notes TEXT,
    preferred_unit TEXT DEFAULT 'metric',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Body Measurements
CREATE TABLE public.body_measurements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg NUMERIC NOT NULL,
    waist_cm NUMERIC,
    body_fat_percentage NUMERIC,
    muscle_mass_kg NUMERIC,
    visceral_fat_rating NUMERIC,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Exercises Library
CREATE TABLE public.exercises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    primary_muscle_groups TEXT[],
    secondary_muscle_groups TEXT[],
    equipment TEXT,
    difficulty TEXT,
    purpose TEXT,
    starting_position TEXT,
    instructions JSONB, -- Array of steps
    breathing_cue TEXT,
    suggested_starting_reps TEXT,
    rest_time_seconds INTEGER DEFAULT 60,
    common_mistakes TEXT[],
    safety_notes TEXT,
    avoid_when TEXT,
    image_url TEXT,
    video_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Workout Templates
CREATE TABLE public.workout_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL means global template
    name TEXT NOT NULL,
    description TEXT,
    phase TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Workout Template Exercises
CREATE TABLE public.workout_template_exercises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    template_id UUID REFERENCES public.workout_templates(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    target_sets INTEGER,
    target_reps_min INTEGER,
    target_reps_max INTEGER,
    target_rpe NUMERIC,
    rest_time_seconds INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Workout Sessions (The live log)
CREATE TABLE public.workout_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    template_id UUID REFERENCES public.workout_templates(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    status TEXT DEFAULT 'in_progress', -- in_progress, completed, aborted
    pre_workout_glucose NUMERIC,
    pre_workout_bp_systolic INTEGER,
    pre_workout_bp_diastolic INTEGER,
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 5),
    symptoms_recorded TEXT[],
    abort_reason TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Workout Sets
CREATE TABLE public.workout_sets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.workout_sessions(id) ON DELETE CASCADE NOT NULL,
    exercise_id UUID REFERENCES public.exercises(id) ON DELETE RESTRICT,
    set_number INTEGER NOT NULL,
    weight_kg NUMERIC,
    reps INTEGER,
    rpe NUMERIC,
    form_rating TEXT, -- good, acceptable, poor
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Health & Safety Logs (Glucose, BP, Symptoms outside of workouts)
CREATE TABLE public.health_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    log_type TEXT NOT NULL, -- glucose, bp, symptom, nutrition
    log_date TIMESTAMPTZ DEFAULT NOW(),
    value_numeric NUMERIC,
    value_text TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Health Profiles: Users can read and update their own health profile
CREATE POLICY "Users can view own health profile" ON public.health_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own health profile" ON public.health_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own health profile" ON public.health_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Body Measurements: Users can CRUD their own measurements
CREATE POLICY "Users can view own body measurements" ON public.body_measurements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own body measurements" ON public.body_measurements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own body measurements" ON public.body_measurements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own body measurements" ON public.body_measurements FOR DELETE USING (auth.uid() = user_id);

-- Exercises: Anyone authenticated can view global exercises
CREATE POLICY "Authenticated users can view exercises" ON public.exercises FOR SELECT TO authenticated USING (true);
-- (Admin policies would be added here for insert/update/delete)

-- Workout Templates: Users can view global (user_id IS NULL) or own templates
CREATE POLICY "Users can view global and own templates" ON public.workout_templates FOR SELECT TO authenticated USING (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "Users can insert own templates" ON public.workout_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own templates" ON public.workout_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own templates" ON public.workout_templates FOR DELETE USING (auth.uid() = user_id);

-- Workout Template Exercises: Users can view global and own template exercises
CREATE POLICY "Users can view global and own template exercises" ON public.workout_template_exercises FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.workout_templates wt
        WHERE wt.id = template_id AND (wt.user_id IS NULL OR wt.user_id = auth.uid())
    )
);
CREATE POLICY "Users can manage own template exercises" ON public.workout_template_exercises FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.workout_templates wt
        WHERE wt.id = template_id AND wt.user_id = auth.uid()
    )
);

-- Workout Sessions: Users can CRUD their own sessions
CREATE POLICY "Users can view own workout sessions" ON public.workout_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workout sessions" ON public.workout_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workout sessions" ON public.workout_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workout sessions" ON public.workout_sessions FOR DELETE USING (auth.uid() = user_id);

-- Workout Sets: Users can CRUD sets for their own sessions
CREATE POLICY "Users can view own workout sets" ON public.workout_sets FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.workout_sessions ws WHERE ws.id = session_id AND ws.user_id = auth.uid())
);
CREATE POLICY "Users can insert own workout sets" ON public.workout_sets FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.workout_sessions ws WHERE ws.id = session_id AND ws.user_id = auth.uid())
);
CREATE POLICY "Users can update own workout sets" ON public.workout_sets FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.workout_sessions ws WHERE ws.id = session_id AND ws.user_id = auth.uid())
);
CREATE POLICY "Users can delete own workout sets" ON public.workout_sets FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.workout_sessions ws WHERE ws.id = session_id AND ws.user_id = auth.uid())
);

-- Health Logs: Users can CRUD their own logs
CREATE POLICY "Users can view own health logs" ON public.health_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own health logs" ON public.health_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own health logs" ON public.health_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own health logs" ON public.health_logs FOR DELETE USING (auth.uid() = user_id);

-- Set up Realtime for tables that might need it
alter publication supabase_realtime add table public.workout_sessions;

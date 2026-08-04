-- Sprint 1: Security & Persistence
-- 1. Create secure API sync keys table
CREATE TABLE IF NOT EXISTS sync_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key_prefix VARCHAR(8) NOT NULL,
  key_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) DEFAULT 'Apple Health Shortcut',
  created_at TIMESTAMPTZ DEFAULT now(),
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ
);

-- Enable RLS on sync_keys
ALTER TABLE sync_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own sync keys" 
ON sync_keys FOR ALL USING (auth.uid() = user_id);

-- 2. Exhaustive RLS Audit & Enforcement for existing tables
-- Health Logs
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own health logs" ON health_logs;
CREATE POLICY "Users can manage their own health logs" 
ON health_logs FOR ALL USING (auth.uid() = user_id);

-- Body Measurements
ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own body measurements" ON body_measurements;
CREATE POLICY "Users can manage their own body measurements" 
ON body_measurements FOR ALL USING (auth.uid() = user_id);

-- 3. Future-proofing RLS on workout tables (if they exist)
DO $$ 
BEGIN 
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'workout_sessions') THEN
    ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can manage their own workout sessions" ON workout_sessions;
    CREATE POLICY "Users can manage their own workout sessions" 
    ON workout_sessions FOR ALL USING (auth.uid() = user_id);
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'workout_sets') THEN
    ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can manage their own workout sets" ON workout_sets;
    CREATE POLICY "Users can manage their own workout sets" 
    ON workout_sets FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- Sprint 1: Real Security Verification - Final (Corrected & Hardened)

-- 1. Create secure API sync keys table (Idempotent)
CREATE TABLE IF NOT EXISTS public.sync_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key_prefix VARCHAR(8) NOT NULL CHECK (length(key_prefix) > 0),
  key_hash CHAR(64) NOT NULL CHECK (key_hash ~ '^[0-9a-f]{64}$'),
  name VARCHAR(255) DEFAULT 'Apple Health Shortcut',
  active BOOLEAN DEFAULT true,
  failed_attempts INT DEFAULT 0 CHECK (failed_attempts >= 0),
  created_at TIMESTAMPTZ DEFAULT now(),
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ
);

-- Ensure guarded columns exist if table was created previously without them
ALTER TABLE public.sync_keys ADD COLUMN IF NOT EXISTS name VARCHAR(255) DEFAULT 'Apple Health Shortcut';
ALTER TABLE public.sync_keys ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE public.sync_keys ADD COLUMN IF NOT EXISTS failed_attempts INT DEFAULT 0 CHECK (failed_attempts >= 0);

-- Unique index on key_hash
CREATE UNIQUE INDEX IF NOT EXISTS ux_sync_keys_hash ON public.sync_keys (key_hash);
-- Fast prefix lookup index
CREATE INDEX IF NOT EXISTS idx_sync_keys_prefix ON public.sync_keys (key_prefix);

-- RLS: sync_keys (Protected write access)
ALTER TABLE public.sync_keys ENABLE ROW LEVEL SECURITY;

-- Revoke ALL client access to the base table to protect key_hash
DROP POLICY IF EXISTS "Users can view own keys" ON public.sync_keys;
DROP POLICY IF EXISTS "Users can delete own keys" ON public.sync_keys;
REVOKE ALL ON public.sync_keys FROM authenticated;
REVOKE ALL ON public.sync_keys FROM anon;
REVOKE ALL ON public.sync_keys FROM PUBLIC;

-- Safe View for Metadata
CREATE OR REPLACE VIEW public.sync_key_metadata AS
SELECT 
  id,
  user_id,
  key_prefix,
  name,
  active,
  failed_attempts,
  created_at,
  last_used_at,
  expires_at,
  revoked_at
FROM public.sync_keys;

GRANT SELECT ON public.sync_key_metadata TO authenticated;

-- (INSERT, UPDATE, DELETE are handled exclusively by protected server routes via service role)

-- 2. Create sync_logs Audit Trail Table (Idempotent)
CREATE TABLE IF NOT EXISTS public.sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_key_id UUID REFERENCES public.sync_keys(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  request_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  completion_time TIMESTAMPTZ,
  status VARCHAR(50) NOT NULL CHECK (status IN ('started', 'success', 'rejected', 'failed')),
  accepted_records INT DEFAULT 0 CHECK (accepted_records >= 0),
  rejected_records INT DEFAULT 0 CHECK (rejected_records >= 0),
  duplicate_records INT DEFAULT 0 CHECK (duplicate_records >= 0),
  source VARCHAR(255),
  ip_hash VARCHAR(255),
  error_code VARCHAR(100)
);

ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own sync logs" ON public.sync_logs;
CREATE POLICY "Users can view their own sync logs" 
ON public.sync_logs FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- 3. Exhaustive RLS Audit & Enforcement for ALL user-owned tables

DO $$ 
BEGIN 
  -- profiles
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can manage their own profiles" ON public.profiles;
    CREATE POLICY "Users can manage their own profiles" 
    ON public.profiles FOR ALL TO authenticated 
    USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  END IF;

  -- health_profiles
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'health_profiles') THEN
    ALTER TABLE public.health_profiles ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can manage their own health profiles" ON public.health_profiles;
    CREATE POLICY "Users can manage their own health profiles" 
    ON public.health_profiles FOR ALL TO authenticated 
    USING (auth.uid() = id) WITH CHECK (auth.uid() = id); -- Uses id based on initial_schema
  END IF;

  -- health_logs
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'health_logs') THEN
    ALTER TABLE public.health_logs ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can manage their own health logs" ON public.health_logs;
    CREATE POLICY "Users can manage their own health logs" 
    ON public.health_logs FOR ALL TO authenticated 
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- body_measurements
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'body_measurements') THEN
    ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can manage their own body measurements" ON public.body_measurements;
    CREATE POLICY "Users can manage their own body measurements" 
    ON public.body_measurements FOR ALL TO authenticated 
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- workout_sessions
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'workout_sessions') THEN
    ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can manage their own workout sessions" ON public.workout_sessions;
    CREATE POLICY "Users can manage their own workout sessions" 
    ON public.workout_sessions FOR ALL TO authenticated 
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- workout_sets (Note: workout_sets uses session_id to map to workout_sessions, not user_id directly)
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'workout_sets') THEN
    ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can manage their own workout sets" ON public.workout_sets;
    CREATE POLICY "Users can manage their own workout sets" 
    ON public.workout_sets FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.workout_sessions ws WHERE ws.id = session_id AND ws.user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.workout_sessions ws WHERE ws.id = session_id AND ws.user_id = auth.uid()));
  END IF;
END $$;

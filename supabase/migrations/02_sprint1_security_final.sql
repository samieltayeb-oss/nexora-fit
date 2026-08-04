-- Sprint 1: Real Security Verification - Final

-- 1. Create secure API sync keys table (Idempotent)
CREATE TABLE IF NOT EXISTS sync_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key_prefix VARCHAR(8) NOT NULL,
  key_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) DEFAULT 'Apple Health Shortcut',
  active BOOLEAN DEFAULT true,
  failed_attempts INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ
);

-- Ensure indexes exist for fast hash lookups
CREATE INDEX IF NOT EXISTS idx_sync_keys_hash ON sync_keys (key_prefix, key_hash);

ALTER TABLE sync_keys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own sync keys" ON sync_keys;
CREATE POLICY "Users can manage their own sync keys" 
ON sync_keys FOR ALL USING (auth.uid() = user_id);

-- Create RPC for incrementing failed attempts without leaking info
CREATE OR REPLACE FUNCTION increment_key_failed_attempts(p_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE sync_keys SET failed_attempts = failed_attempts + 1 WHERE id = p_id;
END;
$$;


-- 2. Create sync_logs Audit Trail Table (Idempotent)
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_key_id UUID REFERENCES sync_keys(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  request_time TIMESTAMPTZ NOT NULL,
  completion_time TIMESTAMPTZ NOT NULL,
  status VARCHAR(50) NOT NULL,
  accepted_records INT DEFAULT 0,
  rejected_records INT DEFAULT 0,
  duplicate_records INT DEFAULT 0,
  source VARCHAR(255),
  ip_hash VARCHAR(255),
  error_code VARCHAR(100)
);

ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own sync logs" ON sync_logs;
CREATE POLICY "Users can view their own sync logs" 
ON sync_logs FOR SELECT USING (auth.uid() = user_id);


-- 3. Exhaustive RLS Audit & Enforcement
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

-- Profiles
DO $$ 
BEGIN 
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can manage their own profiles" ON profiles;
    CREATE POLICY "Users can manage their own profiles" 
    ON profiles FOR ALL USING (auth.uid() = id);
  END IF;
END $$;

# Sprint 1: Security Migration Review

Before proceeding with the actual tests against the Vercel Preview deployment, please carefully review and execute the following SQL migration in your Supabase SQL Editor. 

---

## 1. Safety Confirmation
**I confirm that there are NO destructive commands in this migration.** 
- No `DROP TABLE` (without `IF EXISTS` protecting re-runs)
- No `TRUNCATE`
- No unconditional `DELETE`
- No deletion of current health data.
- The migration is fully idempotent and safely incremental.

## 2. Backup Instructions
If you are running this against production instead of a preview branch:
1. Open the Supabase Dashboard -> **Table Editor**.
2. Select `health_logs`, click **Export** (CSV).
3. Select `body_measurements`, click **Export** (CSV).
4. *(Optional but recommended)* Use `pg_dump` via CLI to take a full schema and data snapshot.

## 3. The Migration SQL
**Filename**: `02_sprint1_security_final.sql`
**Tables Affected**: `sync_keys` (New), `sync_logs` (New), `health_logs` (RLS Updated), `body_measurements` (RLS Updated), `profiles` (RLS Updated).

```sql
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
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own health logs" ON health_logs;
CREATE POLICY "Users can manage their own health logs" 
ON health_logs FOR ALL USING (auth.uid() = user_id);

ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own body measurements" ON body_measurements;
CREATE POLICY "Users can manage their own body measurements" 
ON body_measurements FOR ALL USING (auth.uid() = user_id);

DO $$ 
BEGIN 
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can manage their own profiles" ON profiles;
    CREATE POLICY "Users can manage their own profiles" 
    ON profiles FOR ALL USING (auth.uid() = id);
  END IF;
END $$;
```

## 4. Rollback Instructions
If you need to instantly revert the database schema to pre-Sprint 1, execute `02_sprint1_security_rollback.sql`:

```sql
DROP TABLE IF EXISTS sync_logs CASCADE;
DROP TABLE IF EXISTS sync_keys CASCADE;
DROP FUNCTION IF EXISTS increment_key_failed_attempts(UUID);
```
*(Note: We deliberately leave the `health_logs` RLS intact during rollback, as disabling RLS is inherently unsafe.)*

---
## Ready for the Test Suite?
1. Execute the SQL above.
2. Fill out `.env.security-test.local` (created from the `.example` file) with your Preview Deployment URL and temporary test accounts.
3. Reply with "Done" and I will execute the test suite to prove the RLS and API hardening is working!

# Sprint 1: Corrected Security Migration Review

This revised migration explicitly resolves all 10 mandatory conditions:
- **No RPCs**: `increment_key_failed_attempts` has been completely eliminated. The server-side API handles failed_attempts strictly via the protected service-role client.
- **Client-Side Restrictions**: Browser clients can only `SELECT` and `DELETE` (revoke) their keys. They cannot `INSERT` or `UPDATE` sensitive metadata like `key_hash` or `failed_attempts`.
- **Idempotency**: All definitions are guarded by `IF NOT EXISTS`, and columns are safely appended if missing.
- **Constraints**: Hexadecimal regex constraint on `key_hash`, non-empty constraint on `key_prefix`, and strict nonnegative checks on counters.

## 1. Safety Confirmation
**I confirm that there are NO destructive commands in this migration.** 
There are no `DROP TABLE` (without IF EXISTS), `TRUNCATE`, or `DELETE` statements.

## 2. Exhaustive Backup Instructions
Before applying this against production, you must back up both Data **and** Schema (including policies and functions).
**CSV Exports are insufficient.** Use the Supabase CLI or `pg_dump`:

1. **Backup Schema & Policies**:
   ```bash
   pg_dump -h YOUR_DB_HOST -U YOUR_DB_USER -d postgres --schema-only -f prod_schema_backup.sql
   ```
2. **Backup Data**:
   ```bash
   pg_dump -h YOUR_DB_HOST -U YOUR_DB_USER -d postgres --data-only -f prod_data_backup.sql
   ```
*(Alternatively, rely on Supabase's automated daily Point-in-Time recovery backups if on a Pro plan).*

## 3. Table-by-Table Policy Matrix

| Table | Policy Action | Role | Using Rule | With Check Rule |
|-------|--------------|------|------------|-----------------|
| `sync_keys` | `SELECT` | authenticated | `auth.uid() = user_id` | N/A |
| `sync_keys` | `DELETE` | authenticated | `auth.uid() = user_id` | N/A |
| `sync_logs` | `SELECT` | authenticated | `auth.uid() = user_id` | N/A |
| `profiles` | `ALL` | authenticated | `auth.uid() = id` | `auth.uid() = id` |
| `health_profiles` | `ALL` | authenticated | `auth.uid() = user_id` | `auth.uid() = user_id` |
| `health_logs` | `ALL` | authenticated | `auth.uid() = user_id` | `auth.uid() = user_id` |
| `body_measurements` | `ALL` | authenticated | `auth.uid() = user_id` | `auth.uid() = user_id` |
| `workout_sessions` | `ALL` | authenticated | `auth.uid() = user_id` | `auth.uid() = user_id` |
| `workout_sets` | `ALL` | authenticated | `auth.uid() = user_id` | `auth.uid() = user_id` |

*(Note: Key generation and metadata updates are handled safely server-side, bypassing RLS via the Service Role key).*

## 4. The Migration SQL
**Filename**: `02_sprint1_security_final.sql`

```sql
-- Sprint 1: Real Security Verification - Final (Corrected)

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
DROP POLICY IF EXISTS "Users can view own keys" ON public.sync_keys;
CREATE POLICY "Users can view own keys" 
ON public.sync_keys FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own keys" ON public.sync_keys;
CREATE POLICY "Users can delete own keys" 
ON public.sync_keys FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);
-- (INSERT and UPDATE are handled exclusively by protected server routes)

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
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
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

  -- workout_sets
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'workout_sets') THEN
    ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can manage their own workout sets" ON public.workout_sets;
    CREATE POLICY "Users can manage their own workout sets" 
    ON public.workout_sets FOR ALL TO authenticated 
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
```

## 5. Rollback Instructions
If you need to revert the database schema to pre-Sprint 1, execute `02_sprint1_security_rollback.sql`.
**CAUTION:** Running the rollback permanently deletes all synchronization keys and synchronization audit history.

```sql
DROP TABLE IF EXISTS public.sync_logs CASCADE;
DROP TABLE IF EXISTS public.sync_keys CASCADE;
```

---
## Review & Execution
Please review the exact SQL provided above. Once you've applied this migration safely to your preview environment, reply with "Done" and I will trigger the automated security tests to produce the final live Sprint 1 Security Report!

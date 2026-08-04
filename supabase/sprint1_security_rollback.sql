-- Sprint 1: Security Rollback Script

-- CAUTION / WARNING: 
-- Running this rollback permanently deletes all synchronization keys and synchronization audit history.
-- Do not run this unless you are explicitly reverting Sprint 1 changes and accept the data loss of all user sync keys.

DROP TABLE IF EXISTS public.sync_logs CASCADE;
DROP TABLE IF EXISTS public.sync_keys CASCADE;

-- Note: We are leaving RLS enabled on health_logs and body_measurements because 
-- disabling RLS completely on user-data tables is inherently unsafe.

-- Sprint 1: Security Rollback Script

-- CAUTION: This will drop the new tables and remove security policies.
-- Do not run this unless you are explicitly reverting Sprint 1 changes.

DROP TABLE IF EXISTS sync_logs CASCADE;
DROP TABLE IF EXISTS sync_keys CASCADE;

DROP FUNCTION IF EXISTS increment_key_failed_attempts(UUID);

-- Note: We are leaving RLS enabled on health_logs and body_measurements because 
-- disabling RLS completely on user-data tables is inherently unsafe.
-- However, if you must revert to the old policies (which were non-existent or different),
-- you would drop the new strict policies here:

-- DROP POLICY IF EXISTS "Users can manage their own health logs" ON health_logs;
-- DROP POLICY IF EXISTS "Users can manage their own body measurements" ON body_measurements;

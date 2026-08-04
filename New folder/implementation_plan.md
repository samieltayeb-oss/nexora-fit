# Sprint 1: Security & Persistence

This sprint focuses on the two most critical business risks: securing the backend against multi-tenant data leaks and protecting active workouts from accidental data loss.

## User Review Required
> [!WARNING]  
> **Apple Health Shortcut Update Required**
> To fix the massive security flaw where your iOS Shortcut is dumping data into a hardcoded User ID, we are changing the architecture. We will generate a unique `sync_key` for your account. Once this sprint is complete, you will need to update your iOS Shortcut URL to include `?sync_key=YOUR_KEY`. Do you approve this architecture shift?

## Proposed Changes

---

### 1. Multi-Tenant Sync Security (API Route)
**Problem**: `/api/health/sync` pulls the first user from the database or uses a hardcoded ID, which will leak or overwrite data in a commercial multi-tenant environment.
**Solution**:
- [NEW] Create a `sync_keys` table in Supabase linking a random UUID (`api_key`) to a `user_id`.
- [MODIFY] `src/app/api/health/sync/route.ts` will extract `req.nextUrl.searchParams.get('sync_key')`.
- If valid, we associate the health logs with the correct `user_id`. If invalid or missing, we return `401 Unauthorized`.

### 2. Strict Row Level Security (RLS)
**Problem**: While RLS is enabled on Supabase, we need to ensure all tables strictly enforce the `auth.uid()` policy.
**Solution**:
- Write a Supabase SQL migration script (`01_sprint_1_security.sql`) to verify and enforce that users can only `SELECT`, `INSERT`, `UPDATE`, and `DELETE` rows in `health_logs` and `body_measurements` where `user_id = auth.uid()`.

### 3. Offline Workout Persistence
**Problem**: The active workout player state lives entirely in React memory. If a user refreshes the page or loses cellular connection, the workout resets to zero.
**Solution**:
- [MODIFY] `src/components/workout/active-content.tsx`
- Implement `useEffect` to autosave the active workout state (current exercise index, elapsed time, completed sets) to `localStorage` every 5 seconds.
- On mount, check if a saved `active_workout_state` exists in `localStorage` and prompt the user to resume or discard it.

## Verification Plan

### Automated & Manual Testing
1. **API Security Test**: Attempt to hit `/api/health/sync` via POST without a `sync_key`. Verify it fails with `401 Unauthorized`.
2. **API Success Test**: Hit the endpoint with a valid `sync_key` and ensure logs are written to the correct user.
3. **Persistence Test**: Start a workout, navigate to step 3, refresh the browser, and verify the workout resumes exactly at step 3 with the timer intact.

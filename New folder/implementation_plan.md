# Sprint 1: Real Security Verification

This plan addresses the requirement to provide **real** evidence of security, RLS, and cryptographic hardening before merging the `architecture-freeze` branch into `master`.

## Security Review Matrix
| Risk | Level | Mitigation | Future Improvement |
|------|-------|------------|--------------------|
| Sync key stolen from Shortcut | Medium | Headers-only transport. Rotate key. | Implement push-based Apple HealthKit background delivery. |
| Lost phone / Compromised device | Medium | Revoke device's sync key instantly. | IP-based anomaly detection. |
| Replay attack / Duplicate Syncs | Low | Deduplication via timestamp & metric type checks. | Unique hash-based constraints on `health_logs`. |
| Brute force / Denial of Wallet | Low | Zod strict limits (5MB, 500 samples). API rate limiting. | Redis-based strict rate limiting. |
| Browser cache access (Local Storage) | Low | No secrets stored. Only workout state is cached. | Use IndexedDB with encrypted local wrappers. |

## Proposed Cryptographic Implementation
1. **Generation**: `crypto.randomBytes(32).toString('hex')` (64-character high-entropy hex string).
2. **Storage**: The plain key is shown **once**. The DB stores only a `SHA-256` hash using Web Crypto (`crypto.subtle.digest`), ensuring constant-time comparison is not strictly necessary for the hash lookup, but we will use secure DB lookups.
3. **Key Management**: `sync_keys` table tracks `key_prefix`, `key_hash`, `active`, `last_used_at`, `expires_at`, `revoked_at`, and `failed_attempts`.

## New Audit Trail (`sync_logs` table)
Every sync attempt will be logged to provide a full audit trail:
- `id`, `sync_key_id`, `user_id`, `request_time`, `completion_time`, `status` (success/failed), `accepted_records`, `rejected_records`, `duplicate_records`, `source`, `ip_hash`, `error_code`.

## LocalStorage Proofs
- **Confirmed**: `useWorkoutPersistence` stores *only* the current exercise index, completed sets, timestamps, and the `user_id`. It does **not** store JWTs, passwords, or sync keys.

## Real Evidence Generation Strategy
Because I (Gravity) do not possess the `DATABASE_URL` (direct Postgres connection string) or a Supabase CLI login token, **I cannot execute DDL migrations on the remote database automatically.**

To provide you with the **real test results**, we will follow this protocol:
1. I will write the final SQL migration (`02_sprint1_security_final.sql`) covering `sync_keys`, `sync_logs`, and all RLS policies.
2. I will write an automated Node.js test suite (`test-security.js`) that performs real cross-user RLS inserts/selects and real API requests against localhost.
3. **You (the User)** will run the SQL migration in your Supabase Dashboard.
4. I will then execute `node test-security.js` to prove that the API correctly rejects invalid keys, accepts valid keys, and that User A cannot read User B's data.

Do you approve this sequence to generate the real evidence?

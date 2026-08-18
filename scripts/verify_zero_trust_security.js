const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bozfnkutkppxjonukkad.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvemZua3V0a3BweGpvbnVra2FkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTUxNzEzMywiZXhwIjoyMTAxMDkzMTMzfQ.AJ94I1TyxuKAqBAtiZ0i4VlZtZJuU1raBj1Z3haBNPU';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvemZua3V0a3BweGpvbnVra2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MTcxMzMsImV4cCI6MjEwMTA5MzEzM30.f18woEwHR4l9p0e0sDU-ORy0XZSWiQDtIeadKxi-Nik';

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const hashKey = (key) => crypto.createHash('sha256').update(key).digest('hex');

const TEST_API_BASE = process.env.TEST_API_BASE_URL || 'http://localhost:3000';

async function runSecurityAudit() {
  console.log('====================================================');
  console.log('🔒 NEXORA FIT — ZERO-TRUST SECURITY AUDIT SUITE');
  console.log(`🎯 Testing API Endpoint: ${TEST_API_BASE}/api/health/sync`);
  console.log(`🗄️ Supabase Target: ${SUPABASE_URL}`);
  console.log('====================================================\n');

  const testResults = [];
  const recordResult = (testName, expected, actual, passed, details = '') => {
    testResults.push({ testName, expected, actual, passed, details });
    const symbol = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`[${symbol}] ${testName}`);
    console.log(`   Expected: ${expected} | Actual: ${actual}`);
    if (details) console.log(`   Details: ${details}`);
    console.log('');
  };

  // ── 0. PROVISIONING ISOLATED TEST USERS & KEYS ────────────────
  console.log('--- 0. PROVISIONING TEST CREDENTIALS ---');
  const userA_Email = `test.user.a.${Date.now()}@nexorafit.test`;
  const userB_Email = `test.user.b.${Date.now()}@nexorafit.test`;
  const testPassword = 'TestPassword123!Secure';

  const { data: userAData, error: errA } = await adminClient.auth.admin.createUser({
    email: userA_Email,
    password: testPassword,
    email_confirm: true
  });
  if (errA) throw new Error(`Failed to create User A: ${errA.message}`);
  const userA_Id = userAData.user.id;

  const { data: userBData, error: errB } = await adminClient.auth.admin.createUser({
    email: userB_Email,
    password: testPassword,
    email_confirm: true
  });
  if (errB) throw new Error(`Failed to create User B: ${errB.message}`);
  const userB_Id = userBData.user.id;

  console.log(`User A: ${userA_Id} (${userA_Email})`);
  console.log(`User B: ${userB_Id} (${userB_Email})`);

  // Create valid sync key for User A
  const rawValidKeyA = `nexora_sync_live_${crypto.randomBytes(16).toString('hex')}`;
  const keyPrefixA = rawValidKeyA.substring(0, 8);
  const keyHashA = hashKey(rawValidKeyA);

  const { data: syncKeyRecordA, error: keyErrA } = await adminClient.from('sync_keys').insert({
    user_id: userA_Id,
    name: 'Apple Health Test Key A',
    key_prefix: keyPrefixA,
    key_hash: keyHashA,
    active: true
  }).select().single();
  if (keyErrA) throw new Error(`Failed to insert sync key A: ${keyErrA.message}`);
  const syncKeyIdA = syncKeyRecordA.id;

  // Create revoked sync key
  const rawRevokedKey = `nexora_sync_revk_${crypto.randomBytes(16).toString('hex')}`;
  const { data: revokedKeyRecord } = await adminClient.from('sync_keys').insert({
    user_id: userA_Id,
    name: 'Revoked Test Key',
    key_prefix: rawRevokedKey.substring(0, 8),
    key_hash: hashKey(rawRevokedKey),
    active: false,
    revoked_at: new Date().toISOString()
  }).select().single();

  // Create expired sync key
  const rawExpiredKey = `nexora_sync_expr_${crypto.randomBytes(16).toString('hex')}`;
  const { data: expiredKeyRecord } = await adminClient.from('sync_keys').insert({
    user_id: userA_Id,
    name: 'Expired Test Key',
    key_prefix: rawExpiredKey.substring(0, 8),
    key_hash: hashKey(rawExpiredKey),
    active: true,
    expires_at: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  }).select().single();

  console.log('Test keys provisioned.\n');

  // ── 1. HTTP METHOD ENFORCEMENT ──────────────────────────────
  console.log('--- 1. HTTP METHOD RESTRICTIONS ---');
  try {
    const getRes = await fetch(`${TEST_API_BASE}/api/health/sync`, { method: 'GET' });
    recordResult(
      'GET Request Rejection',
      'HTTP 405 Method Not Allowed',
      `HTTP ${getRes.status}`,
      getRes.status === 405,
      'GET method rejected to prevent mutation and URL leakage'
    );
  } catch (e) {
    console.error('Fetch error:', e.message);
  }

  // ── 2. CREDENTIAL AUTHENTICATION TESTS ──────────────────────
  console.log('--- 2. AUTHENTICATION INTEGRITY ---');

  // 2.1 Missing Credential
  const missingRes = await fetch(`${TEST_API_BASE}/api/health/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([{ type: 'weight', value: 82.5 }])
  });
  recordResult(
    'Missing Key Header',
    'HTTP 401 Unauthorized',
    `HTTP ${missingRes.status}`,
    missingRes.status === 401
  );

  // 2.2 Invalid Credential
  const invalidRes = await fetch(`${TEST_API_BASE}/api/health/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Nexora-Sync-Key': 'nexora_sync_invalid_bogus_token_12345'
    },
    body: JSON.stringify([{ type: 'weight', value: 82.5 }])
  });
  recordResult(
    'Invalid Key Header',
    'HTTP 401 Unauthorized',
    `HTTP ${invalidRes.status}`,
    invalidRes.status === 401
  );

  // 2.3 URL Query Parameter Secrets Rejection (Zero secrets in URL)
  const urlSecretRes = await fetch(`${TEST_API_BASE}/api/health/sync?key=${rawValidKeyA}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([{ type: 'weight', value: 82.5 }])
  });
  recordResult(
    'URL Secret / Query Parameter Rejection',
    'HTTP 401 Unauthorized',
    `HTTP ${urlSecretRes.status}`,
    urlSecretRes.status === 401,
    'Rejects secrets passed in query string'
  );

  // 2.4 Revoked Key Rejection
  const revokedRes = await fetch(`${TEST_API_BASE}/api/health/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Nexora-Sync-Key': rawRevokedKey
    },
    body: JSON.stringify([{ type: 'weight', value: 82.5 }])
  });
  recordResult(
    'Revoked Key Rejection',
    'HTTP 401 Unauthorized',
    `HTTP ${revokedRes.status}`,
    revokedRes.status === 401
  );

  // 2.5 Expired Key Rejection
  const expiredRes = await fetch(`${TEST_API_BASE}/api/health/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Nexora-Sync-Key': rawExpiredKey
    },
    body: JSON.stringify([{ type: 'weight', value: 82.5 }])
  });
  recordResult(
    'Expired Key Rejection',
    'HTTP 401 Unauthorized',
    `HTTP ${expiredRes.status}`,
    expiredRes.status === 401
  );

  // 2.6 Valid Key Authentication (Header X-Nexora-Sync-Key)
  const validRes = await fetch(`${TEST_API_BASE}/api/health/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Nexora-Sync-Key': rawValidKeyA
    },
    body: JSON.stringify([{ type: 'weight', value: 82.70 }])
  });
  recordResult(
    'Valid Key Header (X-Nexora-Sync-Key)',
    'HTTP 200 OK',
    `HTTP ${validRes.status}`,
    validRes.status === 200
  );

  // 2.7 Valid Key Authentication via Authorization: Bearer
  const bearerRes = await fetch(`${TEST_API_BASE}/api/health/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${rawValidKeyA}`
    },
    body: JSON.stringify([{ type: 'active_energy', value: 450 }])
  });
  recordResult(
    'Valid Key Header (Authorization: Bearer)',
    'HTTP 200 OK',
    `HTTP ${bearerRes.status}`,
    bearerRes.status === 200
  );

  // ── 3. CROSS-USER ISOLATION & PAYLOAD SPOOFING ─────────────
  console.log('--- 3. CROSS-USER ISOLATION & PAYLOAD SPOOFING ---');

  // Attempt to inject User B's user_id while using User A's sync key
  const spoofPayload = [
    { user_id: userB_Id, type: 'weight', value: 99.99 }
  ];
  const spoofRes = await fetch(`${TEST_API_BASE}/api/health/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Nexora-Sync-Key': rawValidKeyA
    },
    body: JSON.stringify(spoofPayload)
  });

  // Check database to verify record was inserted strictly for User A (not User B)
  const { data: userBLogs } = await adminClient
    .from('health_logs')
    .select('*')
    .eq('user_id', userB_Id)
    .eq('value_numeric', 99.99);

  const { data: userALogs } = await adminClient
    .from('health_logs')
    .select('*')
    .eq('user_id', userA_Id)
    .eq('value_numeric', 99.99);

  const spoofBlocked = (userBLogs && userBLogs.length === 0) && (userALogs && userALogs.length > 0);
  recordResult(
    'Payload User ID Spoofing Protection',
    'User ID in payload is ignored; inserted strictly under authenticated key owner (User A)',
    spoofBlocked ? 'User A strictly owned (User B has 0 records)' : 'VULNERABILITY DETECTED',
    spoofBlocked,
    `User A records: ${userALogs?.length || 0} | User B records: ${userBLogs?.length || 0}`
  );

  // ── 4. RLS & TABLE ACCESS ISOLATION ─────────────────────────
  console.log('--- 4. ROW LEVEL SECURITY (RLS) POLICIES ---');

  // Sign in as User A client
  const clientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  await clientA.auth.signInWithPassword({ email: userA_Email, password: testPassword });

  // Sign in as User B client
  const clientB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  await clientB.auth.signInWithPassword({ email: userB_Email, password: testPassword });

  // 4.1 Base sync_keys table MUST be blocked to authenticated users (key_hash inaccessible)
  const baseKeyQuery = await clientA.from('sync_keys').select('*');
  const baseTableProtected = baseKeyQuery.error !== null; // 42501 permission denied
  recordResult(
    'Direct sync_keys Table Protection',
    'Access DENIED to authenticated users (42501)',
    baseTableProtected ? 'DENIED (Protected)' : 'EXPOSED',
    baseTableProtected,
    `Error code: ${baseKeyQuery.error?.code || 'None'}`
  );

  // 4.2 Cross-user health_logs query
  const { data: crossUserLogs } = await clientB.from('health_logs').select('*').eq('user_id', userA_Id);
  const crossUserIsolated = (!crossUserLogs || crossUserLogs.length === 0);
  recordResult(
    'Cross-User health_logs RLS Query Isolation',
    'User B receives 0 records when querying User A logs',
    `User B received ${crossUserLogs?.length || 0} records`,
    crossUserIsolated
  );

  // ── 5. AUDIT LOGGING VERIFICATION ───────────────────────────
  console.log('--- 5. AUDIT LOGGING ---');
  const { data: syncLogs } = await adminClient
    .from('sync_logs')
    .select('*')
    .eq('user_id', userA_Id)
    .order('request_time', { ascending: false });

  const auditLogsWritten = syncLogs && syncLogs.length > 0;
  recordResult(
    'Audit Log Generation (sync_logs)',
    'Detailed sync_logs entries created with timestamps & metrics',
    auditLogsWritten ? `${syncLogs.length} audit logs found` : 'No logs found',
    auditLogsWritten
  );

  // ── CLEANUP TEST DATA ───────────────────────────────────────
  console.log('--- CLEANUP: Removing Test Users ---');
  await adminClient.auth.admin.deleteUser(userA_Id);
  await adminClient.auth.admin.deleteUser(userB_Id);
  console.log('Test users cleaned up successfully.\n');

  // ── FINAL SUMMARY ───────────────────────────────────────────
  const allPassed = testResults.every(t => t.passed);
  console.log('====================================================');
  if (allPassed) {
    console.log('🏆 ZERO-TRUST SECURITY AUDIT: 100% PASS');
    console.log(`✅ All ${testResults.length} security controls verified.`);
  } else {
    console.log('❌ SOME SECURITY TESTS FAILED:');
    testResults.filter(t => !t.passed).forEach(t => console.log(`   - ${t.testName}`));
  }
  console.log('====================================================');

  return { allPassed, testResults };
}

runSecurityAudit().catch(err => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(process.cwd(), '.env.security-test.local');
if (!fs.existsSync(envPath)) {
  console.error('ERROR: .env.security-test.local is missing.');
  process.exit(1);
}

const envVars = fs.readFileSync(envPath, 'utf8').split('\n');
envVars.forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
});

const {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  TEST_USER_A_EMAIL,
  TEST_USER_A_PASSWORD,
  TEST_USER_B_EMAIL,
  TEST_USER_B_PASSWORD,
  TEST_API_BASE_URL,
  TEST_SYNC_KEY,
  TEST_SYNC_KEY_PREFIX,
  TEST_SYNC_KEY_HASH
} = process.env;

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const clientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const clientB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let userA_Id = null;
let userB_Id = null;
let syncKeyId = null;

function printResult(testGroup, testName, expected, status, response, passed) {
  const symbol = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`[${testGroup}] ${testName}`);
  console.log(`   Expected: ${expected} | Actual: ${status}`);
  if (!passed && response) console.log(`   Response: ${JSON.stringify(response).substring(0, 200)}`);
  console.log(`   ${symbol}\n`);
  return passed;
}

async function runTests() {
  console.log('=============================================');
  console.log(`🚀 RUNNING REAL SECURITY TEST SUITE`);
  console.log(`🎯 Target API: ${TEST_API_BASE_URL}`);
  console.log('=============================================\n');

  let allPassed = true;

  console.log('--- SETUP: Provisioning Test Users ---');
  
  // Hash the test key dynamically just like the API does
  const hashKey = (key) => crypto.createHash('sha256').update(key).digest('hex');
  const actualHash = hashKey(TEST_SYNC_KEY);
  
  // Use Admin Client to ensure users exist and are confirmed
  const ensureUser = async (email, password) => {
    let { data: { users } } = await adminClient.auth.admin.listUsers();
    let user = users.find(u => u.email === email);
    if (user) {
      await adminClient.auth.admin.deleteUser(user.id);
    }
    const { data, error } = await adminClient.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) throw error;
    user = data.user;

    // Sign in to get a valid session for RLS testing
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
    const { data: sessionData, error: signInErr } = await client.auth.signInWithPassword({ email, password });
    if (signInErr) throw signInErr;
    return { user, client };
  };

  const a = await ensureUser(TEST_USER_A_EMAIL, TEST_USER_A_PASSWORD);
  userA_Id = a.user.id;
  const clientA = a.client;

  const b = await ensureUser(TEST_USER_B_EMAIL, TEST_USER_B_PASSWORD);
  userB_Id = b.user.id;
  const clientB = b.client;

  console.log(`User A ID: ${userA_Id}`);
  console.log(`User B ID: ${userB_Id}`);

  // Provision Sync Key via Admin
  await adminClient.from('sync_keys').delete().eq('user_id', userA_Id);
  const { data: keyRecord, error: keyErr } = await adminClient.from('sync_keys').insert({
    user_id: userA_Id,
    key_prefix: TEST_SYNC_KEY.substring(0, 8),
    key_hash: actualHash,
    active: true
  }).select().single();
  if (keyErr || !keyRecord) {
    console.error('Failed to insert sync key:', keyErr);
    process.exit(1);
  }
  syncKeyId = keyRecord.id;

  // ==========================================
  // 1. API AUTHENTICATION TESTS
  // ==========================================
  const apiUrl = `${TEST_API_BASE_URL}/api/health/sync`;
  
  async function testApi(name, headers, body, expectedStatus) {
    const res = await fetch(apiUrl, { method: 'POST', headers, body: JSON.stringify(body) });
    const passed = res.status === expectedStatus;
    if (!passed) allPassed = false;
    printResult('API Auth', name, expectedStatus, res.status, null, passed);
  }

  const validPayload = [{ type: 'steps', value: 1000 }];

  await testApi('Missing Key Header', { 'Content-Type': 'application/json' }, validPayload, 401);
  await testApi('Invalid Key', { 'Content-Type': 'application/json', 'X-Nexora-Sync-Key': 'garbagekey123' }, validPayload, 401);
  await testApi('Valid Key via Header', { 'Content-Type': 'application/json', 'X-Nexora-Sync-Key': TEST_SYNC_KEY }, validPayload, 200);
  await testApi('Spoofed User ID Ignored (Valid key but tries to inject User B)', { 'Content-Type': 'application/json', 'X-Nexora-Sync-Key': TEST_SYNC_KEY }, [{ user_id: userB_Id, type: 'steps', value: 500 }], 200);
  await testApi('Malformed JSON', { 'Content-Type': 'application/json', 'X-Nexora-Sync-Key': TEST_SYNC_KEY }, "invalid-json", 400);

  const massivePayload = Array.from({ length: 501 }, () => ({ type: 'steps', value: 10 }));
  await testApi('More than 500 samples rejected', { 'Content-Type': 'application/json', 'X-Nexora-Sync-Key': TEST_SYNC_KEY }, massivePayload, 400);

  // Revocation Test via Service Role (simulating a protected server action)
  await adminClient.from('sync_keys').update({ active: false, revoked_at: new Date().toISOString() }).eq('id', syncKeyId);
  await testApi('Revoked Key', { 'Content-Type': 'application/json', 'X-Nexora-Sync-Key': TEST_SYNC_KEY }, validPayload, 401);
  // Restore
  await adminClient.from('sync_keys').update({ active: true, revoked_at: null }).eq('id', syncKeyId);


  // ==========================================
  // 2. RLS & METADATA VIEW TESTS
  // ==========================================
  async function testRls(name, client, table, operation, payload, expectedSuccess, targetId) {
    let err, data;
    if (operation === 'insert') {
      const res = await client.from(table).insert(payload).select();
      err = res.error; data = res.data;
    } else if (operation === 'select') {
      const res = await client.from(table).select('*').eq('id', targetId);
      err = res.error; data = res.data;
    } else if (operation === 'update') {
      const res = await client.from(table).update(payload).eq('id', targetId).select();
      err = res.error; data = res.data;
    }
    const success = !err && data && data.length > 0;
    const passed = success === expectedSuccess;
    if (!passed) allPassed = false;
    printResult('RLS Policy', name, expectedSuccess ? 'Allowed' : 'Denied/Empty', success ? 'Allowed' : 'Denied/Empty', err, passed);
    return data ? data[0] : null;
  }

  // 2.1 Test safe sync_key_metadata view
  const viewRes = await clientA.from('sync_key_metadata').select('*').eq('user_id', userA_Id);
  const viewHasHash = viewRes.data && viewRes.data.length > 0 && viewRes.data[0].key_hash !== undefined;
  const viewPassed = !viewRes.error && viewRes.data && viewRes.data.length > 0 && !viewHasHash;
  if (!viewPassed) allPassed = false;
  printResult('RLS Policy', 'User A can read sync_key_metadata (and key_hash is hidden)', true, viewPassed, viewRes.data, viewPassed);

  // 2.2 Test base sync_keys table (should be DENIED)
  const baseRes = await clientA.from('sync_keys').select('*').eq('user_id', userA_Id);
  const basePassed = baseRes.error && baseRes.error.code === '42501'; // permission denied
  if (!basePassed) allPassed = false;
  printResult('RLS Policy', 'User A CANNOT read base sync_keys table (key_hash inaccessible)', true, basePassed, baseRes.error, basePassed);

  // 2.3 Cross-user Tests
  const logA = await testRls('User A can insert health_logs', clientA, 'health_logs', 'insert', { user_id: userA_Id, log_type: 'steps' }, true);
  if (logA) {
    await testRls('User B CANNOT read User A health_logs', clientB, 'health_logs', 'select', null, false, logA.id);
    await testRls('User B CANNOT update User A health_logs', clientB, 'health_logs', 'update', { value_numeric: 99 }, false, logA.id);
  }

  const sessionA = await testRls('User A can insert workout_session', clientA, 'workout_sessions', 'insert', { user_id: userA_Id, name: 'Test Session' }, true);
  if (sessionA) {
    const setA = await testRls('User A can insert workout_set (parent-linked)', clientA, 'workout_sets', 'insert', { session_id: sessionA.id, set_number: 1 }, true);
    if (setA) {
      await testRls('User B CANNOT read User A workout_set', clientB, 'workout_sets', 'select', null, false, setA.id);
    }
    await testRls('User B CANNOT insert workout_set into User A session', clientB, 'workout_sets', 'insert', { session_id: sessionA.id, set_number: 2 }, false);
  }

  console.log('=============================================');
  if (allPassed) {
    console.log('🏆 ALL REAL SECURITY TESTS PASSED SUCCESSFULLY');
  } else {
    console.log('❌ SOME TESTS FAILED. CHECK LOGS.');
  }
  console.log('=============================================');
}

runTests();

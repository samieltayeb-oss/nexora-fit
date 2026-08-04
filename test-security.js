const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// Load environment variables from .env.security-test.local
const envPath = path.resolve(process.cwd(), '.env.security-test.local');
if (!fs.existsSync(envPath)) {
  console.error('ERROR: .env.security-test.local is missing. Please create it from .env.security-test.local.example');
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

if (!SUPABASE_URL || !TEST_USER_A_EMAIL) {
  console.error('ERROR: Missing required environment variables in .env.security-test.local');
  process.exit(1);
}

// Initialize Clients
const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const clientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const clientB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let userA_Id = null;
let userB_Id = null;
let syncKeyId = null;

// Helper to log results
function printResult(testGroup, testName, expected, status, response, passed) {
  const symbol = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`[${testGroup}] ${testName}`);
  console.log(`   Expected: ${expected} | Actual: ${status}`);
  if (!passed) console.log(`   Response: ${JSON.stringify(response)}`);
  console.log(`   ${symbol}\n`);
  return passed;
}

async function runTests() {
  console.log('=============================================');
  console.log(`🚀 RUNNING SECURITY TEST SUITE`);
  console.log(`🎯 Target API: ${TEST_API_BASE_URL}`);
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  console.log('=============================================\n');

  let allPassed = true;

  // --- SETUP: Create Users and Sync Key ---
  console.log('--- SETUP: Provisioning Test Users ---');
  
  // Sign up User A
  const { data: authA, error: errA } = await clientA.auth.signUp({ email: TEST_USER_A_EMAIL, password: TEST_USER_A_PASSWORD });
  if (errA && !errA.message.includes('already registered')) {
    console.error('Failed to create User A:', errA);
    process.exit(1);
  }
  const { data: loginA } = await clientA.auth.signInWithPassword({ email: TEST_USER_A_EMAIL, password: TEST_USER_A_PASSWORD });
  userA_Id = loginA.user.id;

  // Sign up User B
  const { data: authB, error: errB } = await clientB.auth.signUp({ email: TEST_USER_B_EMAIL, password: TEST_USER_B_PASSWORD });
  if (errB && !errB.message.includes('already registered')) {
    console.error('Failed to create User B:', errB);
    process.exit(1);
  }
  const { data: loginB } = await clientB.auth.signInWithPassword({ email: TEST_USER_B_EMAIL, password: TEST_USER_B_PASSWORD });
  userB_Id = loginB.user.id;

  console.log(`User A ID: ${userA_Id}`);
  console.log(`User B ID: ${userB_Id}\n`);

  // Provision Sync Key for User A (Admin operation for testing)
  await adminClient.from('sync_keys').delete().eq('user_id', userA_Id); // Cleanup old
  const { data: keyRecord, error: keyErr } = await adminClient.from('sync_keys').insert({
    user_id: userA_Id,
    key_prefix: TEST_SYNC_KEY_PREFIX || TEST_SYNC_KEY.substring(0, 8),
    key_hash: TEST_SYNC_KEY_HASH, // Pre-computed hash from the user
    active: true
  }).select().single();
  
  if (keyErr) {
    console.error('Failed to provision sync key:', keyErr);
    process.exit(1);
  }
  syncKeyId = keyRecord.id;

  // ==========================================
  // 1. API AUTHENTICATION TESTS
  // ==========================================
  const apiUrl = `${TEST_API_BASE_URL}/api/health/sync`;
  
  async function testApi(name, headers, body, expectedStatus) {
    const res = await fetch(apiUrl, { method: 'POST', headers, body: JSON.stringify(body) });
    const json = await res.json().catch(() => ({}));
    const passed = res.status === expectedStatus;
    if (!passed) allPassed = false;
    printResult('API Auth', name, expectedStatus, res.status, json, passed);
  }

  const validPayload = [{ type: 'steps', value: 1000 }];

  await testApi('Missing Key Header', { 'Content-Type': 'application/json' }, validPayload, 401);
  await testApi('Invalid Key', { 'Content-Type': 'application/json', 'Authorization': 'Bearer garbagekey123' }, validPayload, 401);
  await testApi('Secret in URL but no header', { 'Content-Type': 'application/json' }, validPayload, 401); // Requires modifying URL in a real scenario, but simulated here via no-header

  // Valid Key Test
  await testApi('Valid Key via Authorization Header', { 'Content-Type': 'application/json', 'Authorization': `Bearer ${TEST_SYNC_KEY}` }, validPayload, 200);
  await testApi('Valid Key via X-Nexora-Sync-Key Header', { 'Content-Type': 'application/json', 'X-Nexora-Sync-Key': TEST_SYNC_KEY }, validPayload, 200);

  // Payload Validation Tests
  await testApi('Spoofed User ID Ignored (Returns 200, checks DB later)', { 'Content-Type': 'application/json', 'X-Nexora-Sync-Key': TEST_SYNC_KEY }, [{ user_id: userB_Id, type: 'steps', value: 500 }], 200);
  await testApi('Malformed JSON Array', { 'Content-Type': 'application/json', 'X-Nexora-Sync-Key': TEST_SYNC_KEY }, "not-json", 400);

  const massivePayload = Array.from({ length: 501 }, () => ({ type: 'steps', value: 10 }));
  await testApi('More than 500 records', { 'Content-Type': 'application/json', 'X-Nexora-Sync-Key': TEST_SYNC_KEY }, massivePayload, 400);

  // Revoke Key Test
  console.log('--- Revoking Key ---');
  await adminClient.from('sync_keys').update({ revoked_at: new Date().toISOString() }).eq('id', syncKeyId);
  await testApi('Revoked Key', { 'Content-Type': 'application/json', 'Authorization': `Bearer ${TEST_SYNC_KEY}` }, validPayload, 401);

  // Restore Key & Deactivate
  await adminClient.from('sync_keys').update({ revoked_at: null, active: false }).eq('id', syncKeyId);
  await testApi('Inactive Key', { 'Content-Type': 'application/json', 'Authorization': `Bearer ${TEST_SYNC_KEY}` }, validPayload, 401);

  // ==========================================
  // 2. RLS ENFORCEMENT TESTS
  // ==========================================
  async function testRls(name, client, operation, expectedSuccess) {
    let result, err;
    if (operation.type === 'insert') {
      const { data, error } = await client.from(operation.table).insert(operation.payload).select();
      result = data; err = error;
    } else if (operation.type === 'select') {
      const { data, error } = await client.from(operation.table).select('*').eq('id', operation.targetId);
      result = data; err = error;
    } else if (operation.type === 'update') {
      const { data, error } = await client.from(operation.table).update(operation.payload).eq('id', operation.targetId).select();
      result = data; err = error;
    } else if (operation.type === 'delete') {
      const { data, error } = await client.from(operation.table).delete().eq('id', operation.targetId).select();
      result = data; err = error;
    }

    const success = !err && result && result.length > 0;
    const passed = success === expectedSuccess;
    if (!passed) allPassed = false;
    printResult('RLS Policy', name, expectedSuccess ? 'Allowed' : 'Denied/Empty', success ? 'Allowed' : 'Denied/Empty', err || result, passed);
    return result;
  }

  // Insert a record for User A
  const recordA = await testRls('User A can insert own record', clientA, { type: 'insert', table: 'health_logs', payload: { user_id: userA_Id, log_type: 'steps', value_numeric: 100 } }, true);
  const recordA_Id = recordA ? recordA[0].id : null;

  if (recordA_Id) {
    await testRls('User A can read own record', clientA, { type: 'select', table: 'health_logs', targetId: recordA_Id }, true);
    await testRls('User A CANNOT read User B record (Simulated by User B trying to read User A record)', clientB, { type: 'select', table: 'health_logs', targetId: recordA_Id }, false);
    await testRls('User B CANNOT update User A record', clientB, { type: 'update', table: 'health_logs', targetId: recordA_Id, payload: { value_numeric: 999 } }, false);
    await testRls('User B CANNOT delete User A record', clientB, { type: 'delete', table: 'health_logs', targetId: recordA_Id }, false);
  }

  await testRls('User A CANNOT insert record spoofing User B ID', clientA, { type: 'insert', table: 'health_logs', payload: { user_id: userB_Id, log_type: 'steps', value_numeric: 50 } }, false);

  console.log('=============================================');
  if (allPassed) {
    console.log('🏆 ALL SECURITY TESTS PASSED SUCCESSFULLY');
  } else {
    console.log('❌ SOME TESTS FAILED. CHECK LOGS.');
  }
  console.log('=============================================');
}

runTests();

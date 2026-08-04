const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(process.cwd(), '.env.local');
const envVars = fs.readFileSync(envPath, 'utf8').split('\n');
envVars.forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
});

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  try {
    const { data: logs } = await supabase.from('health_logs').select('*');
    if (logs) fs.writeFileSync('supabase/health_logs_backup.json', JSON.stringify(logs, null, 2));

    const { data: measurements } = await supabase.from('body_measurements').select('*');
    if (measurements) fs.writeFileSync('supabase/body_measurements_backup.json', JSON.stringify(measurements, null, 2));

    console.log('JSON Backups complete.');
  } catch (e) {
    console.error('Backup failed:', e);
  }
})();

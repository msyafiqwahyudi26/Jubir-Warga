/**
 * One-off diagnostic: try a single auth.admin.createUser and dump the full
 * error object (incl. status, code, details) so we can see the underlying
 * Postgres reason that GoTrue wraps as "Database error creating new user".
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

async function main() {
  const probeEmail = `demo-probe-${Date.now()}@jubirwarga-demo.local`;
  const res = await supabase.auth.admin.createUser({
    email: probeEmail,
    password: 'Demo!Jubir2026',
    email_confirm: true,
    user_metadata: { name: 'Probe' },
  });
  console.log('--- raw response ---');
  console.log(JSON.stringify(res, null, 2));

  if (res.error) {
    console.log('\n--- error introspection ---');
    console.log('message:', res.error.message);
    console.log('status:', (res.error as { status?: number }).status);
    console.log('code:', (res.error as { code?: string }).code);
    console.log('name:', res.error.name);
    // AuthApiError stores body on .body / .errorBody / via toJSON
    for (const k of Object.keys(res.error)) {
      console.log(`error.${k} =`, (res.error as Record<string, unknown>)[k]);
    }
  } else if (res.data?.user) {
    console.log('Probe SUCCESS — user id:', res.data.user.id);
    await supabase.auth.admin.deleteUser(res.data.user.id);
    console.log('Probe user deleted.');
  }
}
main().catch((e) => { console.error(e); process.exit(1); });

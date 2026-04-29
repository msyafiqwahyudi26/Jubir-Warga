/**
 * cleanup-demo-seed.ts
 *
 * Reverse of generate-demo-seed.ts:
 *   1. Calls public.cleanup_demo_data() RPC → wipes is_demo=true rows.
 *   2. Lists auth.users with @jubirwarga-demo.local domain → deletes via Admin API.
 *
 * Run:
 *   pnpm tsx scripts/cleanup-demo-seed.ts
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { sleep } from './lib/distributions';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log(
  'Service role detected: ' +
    (SUPABASE_SERVICE_ROLE_KEY
      ? 'YES len=' + SUPABASE_SERVICE_ROLE_KEY.length
      : 'NO')
);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY.length < 200) {
  console.error('Missing/short env vars in .env.local'); process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const DEMO_DOMAINS = ['@jubirwarga-demo.local', '@demo.jubirwarga.id'] as const;

async function main(): Promise<void> {
  console.log('\n🗑  Jubir Warga — demo cleanup\n');

  // ─── 1. Call cleanup_demo_data() RPC ────────────────
  console.log('Phase 1: cleanup_demo_data() RPC');
  const { data: rpcData, error: rpcErr } = await supabase.rpc('cleanup_demo_data');
  if (rpcErr) {
    console.error('  ✗ RPC failed:', rpcErr.message);
    process.exit(1);
  }
  for (const row of (rpcData ?? []) as Array<{ table_name: string; deleted_count: number }>) {
    console.log(`  ${row.table_name.padEnd(18)} ${String(row.deleted_count).padStart(5)} deleted`);
  }

  // ─── 2. Delete demo auth users ──────────────────────
  console.log('\nPhase 2: deleting demo auth users');
  const demoUserIds: string[] = [];
  let page = 1;
  const perPage = 1000;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      console.error('  ✗ listUsers failed:', error.message);
      process.exit(1);
    }
    const users = data.users ?? [];
    if (users.length === 0) break;
    for (const u of users) {
      const email = (u.email ?? '').toLowerCase();
      if (DEMO_DOMAINS.some((d) => email.endsWith(d))) demoUserIds.push(u.id);
    }
    if (users.length < perPage) break;
    page += 1;
  }
  console.log(`  Found ${demoUserIds.length} demo auth users`);

  let deleted = 0;
  let failed = 0;
  for (let i = 0; i < demoUserIds.length; i += 5) {
    const batch = demoUserIds.slice(i, i + 5);
    const results = await Promise.allSettled(
      batch.map((id) => supabase.auth.admin.deleteUser(id))
    );
    for (const r of results) {
      if (r.status === 'fulfilled' && !r.value.error) deleted++;
      else failed++;
    }
    if (i + 5 < demoUserIds.length) await sleep(150);
  }
  console.log(`  ✓ Deleted ${deleted} auth users (${failed} failed)`);

  console.log('\n✅ Cleanup complete.');
}

main().catch((err) => {
  console.error('\n💥 Cleanup crashed:', err);
  process.exit(1);
});

/**
 * refresh-demo-bodies.ts
 *
 * Regenerate body content for existing is_demo threads + karya WITHOUT
 * recreating users / votes / signatures. Run after the content-templates.ts
 * banks have been updated (e.g., to swap lorem-Latin filler for Indonesian).
 *
 * Run:
 *   pnpm tsx scripts/refresh-demo-bodies.ts
 *   # or
 *   pnpm seed:demo:refresh-bodies
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { faker } from './lib/faker-id';
import { batchParallel, pickRandom } from './lib/distributions';
import {
  buildThreadBody, buildKaryaBody, chapterToKota, KOTA_LIST,
  type TopicId, TOPIC_IDS,
} from './lib/content-templates';

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

async function main(): Promise<void> {
  console.log('\n♻  Jubir Warga — refresh demo bodies (Indonesian-only)\n');

  // ─── 1. Threads ─────────────────────────────────────
  const { data: threads, error: tErr } = await supabase
    .from('threads').select('id, topic_id, chapter_id').eq('is_demo', true);
  if (tErr) { console.error('Failed to fetch threads:', tErr.message); process.exit(1); }
  console.log(`Phase 1: refreshing ${threads?.length ?? 0} thread bodies (concurrency=25)`);

  const tList = (threads ?? []) as Array<{ id: string; topic_id: string | null; chapter_id: string | null }>;
  const { ok: tOk, failed: tFailed } = await batchParallel(
    tList,
    async (row) => {
      const topic = (TOPIC_IDS.includes(row.topic_id as TopicId) ? row.topic_id : pickRandom(TOPIC_IDS)) as TopicId;
      const kota = chapterToKota(row.chapter_id);
      const newBody = buildThreadBody(topic, kota);
      const { error } = await supabase.from('threads').update({ body: newBody }).eq('id', row.id);
      if (error) throw new Error(`thread ${row.id}: ${error.message}`);
      return row.id;
    },
    {
      concurrency: 25,
      onBatch: (done, total) => {
        if (done % 50 === 0 || done === total) {
          console.log(`  → ${done}/${total} threads updated`);
        }
      },
    }
  );
  console.log(`  ✓ Updated ${tOk.length}/${tList.length} threads (${tFailed.length} failed)`);
  if (tFailed.length > 0) {
    console.log('    First failure:', (tFailed[0]?.err as Error)?.message);
  }

  // ─── 2. Karya ───────────────────────────────────────
  const { data: karya, error: kErr } = await supabase
    .from('karya').select('id, type').eq('is_demo', true);
  if (kErr) { console.error('Failed to fetch karya:', kErr.message); process.exit(1); }
  console.log(`\nPhase 2: refreshing ${karya?.length ?? 0} karya bodies`);

  const kList = (karya ?? []) as Array<{ id: string; type: string }>;
  const { ok: kOk, failed: kFailed } = await batchParallel(
    kList,
    async (row) => {
      // For Tulisan/Zine: full essay (4-8 paragraphs). For Vlog/Podcast/Ilustrasi:
      // shorter description (2 paragraphs) — matches generator's original behavior.
      const fullBody = buildKaryaBody();
      const trimmed = (row.type === 'Tulisan' || row.type === 'Zine')
        ? fullBody
        : fullBody.split('\n\n').slice(0, 2).join('\n\n');
      const { error } = await supabase.from('karya').update({ body: trimmed }).eq('id', row.id);
      if (error) throw new Error(`karya ${row.id}: ${error.message}`);
      return row.id;
    },
    { concurrency: 25 }
  );
  console.log(`  ✓ Updated ${kOk.length}/${kList.length} karya (${kFailed.length} failed)`);

  // ─── 3. Sample verification ─────────────────────────
  console.log('\n=== Sample verify: 5 random thread bodies ===\n');
  const { data: samples, error: sErr } = await supabase
    .from('threads')
    .select('id, title, topic_id, chapter_id, body')
    .eq('is_demo', true);
  if (sErr) { console.error(sErr.message); process.exit(1); }
  const all = (samples ?? []) as Array<{ id: string; title: string; topic_id: string; chapter_id: string; body: string }>;
  const five = faker.helpers.shuffle(all).slice(0, 5);

  // Latin word detector (rough heuristic — common lorem ipsum vocabulary).
  const LATIN_WORDS = [
    'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit',
    'sed','do','eiusmod','tempor','incididunt','labore','aliqua','enim',
    'veniam','quis','nostrud','exercitation','ullamco','laboris','nisi',
    'aliquip','ex','ea','commodo','consequat','duis','aute','irure',
    'reprehenderit','voluptate','velit','esse','cillum','fugiat','nulla',
    'pariatur','excepteur','sint','occaecat','cupidatat','proident','sunt',
    'culpa','officia','deserunt','mollit','anim','laborum',
    // less obvious Latin tokens that lorem generators emit
    'colligo','antiquus','quidem','reiciendis','canis','asperiores','viriliter',
    'pax','vulnero','deprecator','caritas','vae','tristis','solvo',
  ];
  const latinRegex = new RegExp(`\\b(${LATIN_WORDS.join('|')})\\b`, 'i');

  for (let i = 0; i < five.length; i++) {
    const t = five[i] as typeof all[number];
    console.log(`────────────────────────────────────────────────────────────`);
    console.log(`Sample ${i + 1}/5  ·  ${t.topic_id ?? '?'}  ·  chapter=${t.chapter_id ?? '?'}`);
    console.log(`Title: ${t.title}`);
    console.log();
    console.log(t.body);
    console.log();
    const found = t.body.match(latinRegex);
    if (found) {
      console.log(`⚠  LATIN WORD DETECTED: "${found[0]}"  (sample ${i + 1} body)`);
    } else {
      console.log(`✓ Indonesian-only (no Latin marker words)`);
    }
    // Geographical consistency: count distinct mentions of major kota
    const kotaMentions = KOTA_LIST.filter((k) =>
      new RegExp(`\\b${k}\\b`).test(t.body)
    );
    if (kotaMentions.length > 1) {
      console.log(`⚠  MULTI-KOTA: body mentions ${kotaMentions.join(', ')}`);
    } else {
      console.log(`✓ Single-kota body (${kotaMentions[0] ?? '<none>'})`);
    }
  }
  console.log(`────────────────────────────────────────────────────────────`);

  console.log(`\n✅ Refresh complete.`);
  console.log(`   threads updated: ${tOk.length}`);
  console.log(`   karya   updated: ${kOk.length}`);
}

main().catch((e) => { console.error('💥', e); process.exit(1); });

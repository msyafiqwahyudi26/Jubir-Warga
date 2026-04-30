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
  buildThreadBody, buildThreadTitle, buildKaryaBody, chapterToKota, KOTA_LIST,
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

  // ─── 0. Thread titles ───────────────────────────────
  // Re-derive title kota from chapter_id so title and body always agree
  // (fixes title-body city mismatch left over from initial seed).
  const { data: threadsForTitle, error: ttErr } = await supabase
    .from('threads').select('id, topic_id, chapter_id').eq('is_demo', true);
  if (ttErr) { console.error('Failed to fetch threads:', ttErr.message); process.exit(1); }
  console.log(`Phase 0: refreshing ${threadsForTitle?.length ?? 0} thread titles (concurrency=25)`);

  const ttList = (threadsForTitle ?? []) as Array<{ id: string; topic_id: string | null; chapter_id: string | null }>;
  const { ok: ttOk, failed: ttFailed } = await batchParallel(
    ttList,
    async (row) => {
      const topic = (TOPIC_IDS.includes(row.topic_id as TopicId) ? row.topic_id : pickRandom(TOPIC_IDS)) as TopicId;
      const kota = chapterToKota(row.chapter_id);
      const newTitle = buildThreadTitle(topic, kota);
      const { error } = await supabase.from('threads').update({ title: newTitle }).eq('id', row.id);
      if (error) throw new Error(`thread ${row.id}: ${error.message}`);
      return row.id;
    },
    {
      concurrency: 25,
      onBatch: (done, total) => {
        if (done % 50 === 0 || done === total) {
          console.log(`  → ${done}/${total} titles updated`);
        }
      },
    }
  );
  console.log(`  ✓ Updated ${ttOk.length}/${ttList.length} titles (${ttFailed.length} failed)`);
  if (ttFailed.length > 0) {
    console.log('    First failure:', (ttFailed[0]?.err as Error)?.message);
  }

  // ─── 1. Threads ─────────────────────────────────────
  const { data: threads, error: tErr } = await supabase
    .from('threads').select('id, topic_id, chapter_id').eq('is_demo', true);
  if (tErr) { console.error('Failed to fetch threads:', tErr.message); process.exit(1); }
  console.log(`\nPhase 1: refreshing ${threads?.length ?? 0} thread bodies (concurrency=25)`);

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

  function kotaMentioned(text: string): string[] {
    return KOTA_LIST.filter((k) => new RegExp(`\\b${k}\\b`).test(text));
  }

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
    const titleKota = kotaMentioned(t.title);
    const bodyKota = kotaMentioned(t.body);
    if (bodyKota.length > 1) {
      console.log(`⚠  MULTI-KOTA: body mentions ${bodyKota.join(', ')}`);
    } else {
      console.log(`✓ Single-kota body (${bodyKota[0] ?? '<none>'})`);
    }
    if (titleKota.length === 0) {
      console.log(`✓ Title has no kota mention (template lacks {kota} slot)`);
    } else if (bodyKota.length === 0) {
      console.log(`⚠  Title mentions ${titleKota.join(', ')} but body has no kota`);
    } else if (titleKota.every((k) => bodyKota.includes(k))) {
      console.log(`✓ Title kota (${titleKota.join(', ')}) matches body anchor`);
    } else {
      console.log(`⚠  TITLE-BODY MISMATCH: title=${titleKota.join(', ')} body=${bodyKota.join(', ')}`);
    }
  }
  console.log(`────────────────────────────────────────────────────────────`);

  // ─── 4. Full-table check: titles that mention a kota ───
  console.log('\n=== Full-table check: 5 random titles that mention a kota ===\n');
  const titleKotaPattern = new RegExp(`\\b(${KOTA_LIST.join('|')})\\b`);
  const titlesWithKota = all.filter((t) => titleKotaPattern.test(t.title));
  console.log(`  ${titlesWithKota.length}/${all.length} demo threads have a kota in their title.`);
  const fiveCheck = faker.helpers.shuffle(titlesWithKota).slice(0, 5);
  let mismatchCount = 0;
  for (let i = 0; i < fiveCheck.length; i++) {
    const t = fiveCheck[i] as typeof all[number];
    const titleKota = kotaMentioned(t.title);
    const bodyKota = kotaMentioned(t.body);
    const ok = titleKota.length > 0 && titleKota.every((k) => bodyKota.includes(k));
    const marker = ok ? '✓' : '⚠';
    if (!ok) mismatchCount++;
    console.log(`  ${marker} chapter=${t.chapter_id} · title=${titleKota.join(',')} · body=${bodyKota.join(',') || '<none>'}`);
    console.log(`     "${t.title}"`);
  }
  console.log(`  → ${fiveCheck.length - mismatchCount}/${fiveCheck.length} title-body consistent`);

  // Full sweep across the whole demo set for final tally.
  let totalMismatch = 0;
  for (const t of titlesWithKota) {
    const titleKota = kotaMentioned(t.title);
    const bodyKota = kotaMentioned(t.body);
    if (!titleKota.every((k) => bodyKota.includes(k))) totalMismatch++;
  }
  console.log(`  Full-table tally: ${totalMismatch} mismatched / ${titlesWithKota.length} title-with-kota / ${all.length} total demo threads`);

  console.log(`\n✅ Refresh complete.`);
  console.log(`   titles  updated: ${ttOk.length}`);
  console.log(`   threads updated: ${tOk.length}`);
  console.log(`   karya   updated: ${kOk.length}`);
}

main().catch((e) => { console.error('💥', e); process.exit(1); });

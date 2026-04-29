/**
 * generate-demo-seed.ts
 *
 * Generate 300 fake users + derived content (threads, replies, votes,
 * petisi sigs, janji follows, karya, laporan, polling votes, kelas
 * enrollment, badges) and apply to Supabase. All rows tagged is_demo=true.
 *
 * Run:
 *   pnpm tsx scripts/generate-demo-seed.ts
 *
 * Cleanup later via:
 *   pnpm tsx scripts/cleanup-demo-seed.ts
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { f, faker } from './lib/faker-id';
import {
  randInt, pickRandom, pickN, weightedPick, buildTierList,
  batchParallel, bulkInsert, sleep, type Tier,
} from './lib/distributions';
import {
  THREAD_TEMPLATES, KOTA_LIST, KARYA_TITLES, LAPORAN_BANK, INDONESIAN_FILLER,
  buildThreadBody, buildReplyBody, pickReplyKind,
  buildKaryaBody, pickKaryaType, buildKaryaMeta, fillPlaceholders,
  chapterToKota,
  type LaporanCategory, type KaryaType,
} from './lib/content-templates';

// ─── Env probe ─────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log(
  'Service role detected: ' +
    (SUPABASE_SERVICE_ROLE_KEY
      ? 'YES len=' + SUPABASE_SERVICE_ROLE_KEY.length
      : 'NO')
);

if (!SUPABASE_URL) {
  console.error('Missing SUPABASE_URL in .env.local'); process.exit(1);
}
if (!SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY.length < 200) {
  console.error('SUPABASE_SERVICE_ROLE_KEY missing or too short. Re-check .env.local.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ─── Constants ─────────────────────────────────────────
const TOTAL_USERS = 300;
const TARGET_LURKERS = 240;
const TARGET_MEDIUMS = 45;
const TARGET_POWERS  = 15;
const DEMO_PASSWORD = 'Demo!Jubir2026';
const EMAIL_DOMAIN = '@jubirwarga-demo.local';

const CHAPTER_IDS = [
  'jakarta', 'bandung', 'malang', 'surabaya', 'jogja', 'medan', 'makassar',
] as const;

// Pre-fetched seed reference data (filled by loadReferenceData()).
let PEJABAT_IDS: string[] = [];
let JANJI_ROWS: { id: string; status: string }[] = [];
let PETISI_IDS: string[] = [];
let POLLING: { id: string; options: { id: string; label: string; emoji: string; votes: number }[] }[] = [];
let KELAS_IDS: string[] = [];
let TOPIC_IDS_DB: string[] = [];

// ─── Types ─────────────────────────────────────────────
interface DemoUser {
  id: string;
  username: string;
  name: string;
  email: string;
  tier: Tier;
  chapter_id: string;
}

// ─── Pre-flight checks ─────────────────────────────────

async function preflightExistingDemo(): Promise<void> {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_demo', true);
  if (error) {
    console.error('  ✗ Failed to query profiles:', error.message);
    process.exit(1);
  }
  if (count && count > 0) {
    console.error(`  ✗ ${count} demo profiles already exist. Run cleanup-demo-seed.ts first.`);
    process.exit(1);
  }
  console.log(`  ✓ Pre-run sanity: 0 existing is_demo profiles`);
}

async function loadReferenceData(): Promise<void> {
  const [pej, janji, pet, pol, kel, top] = await Promise.all([
    supabase.from('pejabat').select('id').eq('is_demo', false),
    supabase.from('janji').select('id, status').eq('is_demo', false),
    supabase.from('petisi').select('id').eq('is_demo', false),
    supabase.from('polling').select('id, options'),
    supabase.from('kelas').select('id').eq('is_demo', false),
    supabase.from('topics').select('id'),
  ]);
  if (pej.error || janji.error || pet.error || pol.error || kel.error || top.error) {
    console.error('  ✗ Failed to load reference data');
    console.error('    ', pej.error?.message ?? janji.error?.message ?? pet.error?.message ?? pol.error?.message ?? kel.error?.message ?? top.error?.message);
    process.exit(1);
  }
  PEJABAT_IDS = (pej.data ?? []).map((r: { id: string }) => r.id);
  JANJI_ROWS = (janji.data ?? []) as { id: string; status: string }[];
  PETISI_IDS = (pet.data ?? []).map((r: { id: string }) => r.id);
  POLLING = (pol.data ?? []) as typeof POLLING;
  KELAS_IDS = (kel.data ?? []).map((r: { id: string }) => r.id);
  TOPIC_IDS_DB = (top.data ?? []).map((r: { id: string }) => r.id);
  console.log(
    `  ✓ Reference data: ${PEJABAT_IDS.length} pejabat, ${JANJI_ROWS.length} janji, ` +
    `${PETISI_IDS.length} petisi, ${POLLING.length} polling, ${KELAS_IDS.length} kelas, ${TOPIC_IDS_DB.length} topics`
  );
}

// ─── User creation ─────────────────────────────────────

function buildEmailUsername(idx: number): { email: string; username: string; name: string } {
  const name = f.person.fullName();
  const baseUsername = f.internet.username().toLowerCase().replace(/[._\-]/g, '');
  const username = `${baseUsername}${idx.toString().padStart(3, '0')}`.slice(0, 28);
  const email = `demo-${idx.toString().padStart(3, '0')}-${baseUsername}${EMAIL_DOMAIN}`.toLowerCase();
  return { email, username, name };
}

function levelForTier(tier: Tier): { level: number; xp: number } {
  const level =
    tier === 'power' ? randInt(8, 15) :
    tier === 'medium' ? randInt(3, 7) :
    randInt(1, 3);
  const xp = level * randInt(80, 150);
  return { level, xp };
}

async function createSingleUser(idx: number, tier: Tier): Promise<DemoUser | null> {
  const { email, username, name } = buildEmailUsername(idx);
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: { name },
  });
  if (error || !data?.user) {
    if (error && /badges/i.test(error.message)) {
      console.error('\n❌ TRIGGER BUG DETECTED — handle_new_user references non-existent column "badges".\n');
      console.error('   Fix in Supabase SQL Editor (paste, run, then re-run this script):\n');
      console.error(TRIGGER_FIX_SQL);
      process.exit(2);
    }
    console.error(`  ✗ user[${idx}] auth failed:`, error?.message);
    return null;
  }
  const id = data.user.id;
  const chapter_id = pickRandom(CHAPTER_IDS) as string;
  const { level, xp } = levelForTier(tier);
  const avatar_url = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(username)}`;
  const bio = weightedPick(
    [null, null, null, pickRandom(INDONESIAN_FILLER)],
    [3, 3, 3, 1]
  );
  const { error: updErr } = await supabase
    .from('profiles')
    .update({
      username, name, bio, chapter_id, avatar_url, level, xp,
      is_anonim: false, onboarded: true, is_demo: true,
    })
    .eq('id', id);
  if (updErr) {
    console.error(`  ✗ user[${idx}] profile update failed:`, updErr.message);
    await supabase.auth.admin.deleteUser(id).catch(() => undefined);
    return null;
  }
  return { id, username, name, email, tier, chapter_id };
}

// ─── Phase: threads ────────────────────────────────────

function pickThreadFormat(): string {
  return weightedPick(
    ['diskusi', 'tanya', 'pengalaman', 'polling', 'live'] as const,
    [50, 25, 18, 5, 2]
  );
}

function buildThreadRow(authorId: string, chapterId: string) {
  const tpl = pickRandom(THREAD_TEMPLATES);
  const anchorKota = chapterToKota(chapterId);
  const anchor = { kota: anchorKota };
  const title = fillPlaceholders(pickRandom(tpl.titles), anchor);
  const body = buildThreadBody(tpl.topic, anchorKota);
  const topic_id = TOPIC_IDS_DB.includes(tpl.topic) ? tpl.topic : pickRandom(TOPIC_IDS_DB);
  return {
    author_id: authorId,
    title,
    body,
    topic_id,
    chapter_id: chapterId,
    format: pickThreadFormat(),
    upvotes: 0,
    downvotes: 0,
    reply_count: 0,
    hot: false,
    pinned: false,
    is_demo: true,
    created_at: faker.date.recent({ days: 30 }).toISOString(),
  };
}

// ─── Main orchestrator ─────────────────────────────────

async function main(): Promise<void> {
  console.log('\n🌱 Jubir Warga — demo seed generator\n');

  console.log('Phase 0: pre-flight');
  await preflightExistingDemo();
  await loadReferenceData();

  // ─── 1. Users ───────────────────────────────────────
  console.log(`\nPhase 1: creating ${TOTAL_USERS} demo users (rate-limited, ~3-5 min)`);
  const tierList = buildTierList(TARGET_LURKERS, TARGET_MEDIUMS, TARGET_POWERS);
  const userIndices = Array.from({ length: TOTAL_USERS }, (_, i) => ({ idx: i, tier: tierList[i] as Tier }));
  const tierProgress = { lurker: 0, medium: 0, power: 0 };
  const { ok: users, failed } = await batchParallel(
    userIndices,
    async ({ idx, tier }) => {
      const u = await createSingleUser(idx, tier);
      if (u) tierProgress[tier]++;
      return u;
    },
    {
      concurrency: 5,
      delayMs: 200,
      onBatch: (done) => {
        // Every 25 users (= every 5 batches of 5), print a structured progress line.
        if (done % 25 === 0 || done === TOTAL_USERS) {
          const total = tierProgress.lurker + tierProgress.medium + tierProgress.power;
          console.log(
            `  → ${String(done).padStart(3)}/${TOTAL_USERS} attempted | ` +
            `created ${total} (L:${tierProgress.lurker} ` +
            `M:${tierProgress.medium} P:${tierProgress.power})`
          );
        }
      },
    }
  );
  const validUsers = users.filter((u): u is DemoUser => !!u);
  const nullCount = users.length - validUsers.length;
  console.log(
    `  ✓ Created ${validUsers.length}/${TOTAL_USERS} demo users ` +
    `(${nullCount} returned null, ${failed.length} threw)`
  );
  if (validUsers.length < TOTAL_USERS * 0.9) {
    console.error('  ✗ Too many failures — aborting downstream phases.');
    process.exit(1);
  }

  const lurkers = validUsers.filter((u) => u.tier === 'lurker');
  const mediums = validUsers.filter((u) => u.tier === 'medium');
  const powers  = validUsers.filter((u) => u.tier === 'power');
  console.log(`    distribution: ${lurkers.length} lurker / ${mediums.length} medium / ${powers.length} power`);

  // ─── 2. Threads ─────────────────────────────────────
  console.log('\nPhase 2: threads');
  const threadAuthors = [
    ...mediums.flatMap((u) => Array.from({ length: randInt(1, 3) }, () => u)),
    ...powers .flatMap((u) => Array.from({ length: randInt(5, 15) }, () => u)),
  ];
  const threadRows = threadAuthors.map((u) => buildThreadRow(u.id, u.chapter_id));
  const tIns = await bulkInsertReturning('threads', threadRows);
  console.log(`  ✓ inserted ${tIns.rows.length} threads (failed chunks: ${tIns.failedChunks.length})`);

  // ─── 3. Replies ─────────────────────────────────────
  console.log('\nPhase 3: thread replies');
  const replyRows: Array<Record<string, unknown>> = [];
  for (const u of mediums) {
    const n = randInt(3, 8);
    for (let i = 0; i < n; i++) {
      const t = pickRandom(tIns.rows);
      replyRows.push(buildReplyRow(t.id, u.id, t.created_at));
    }
  }
  for (const u of powers) {
    const n = randInt(15, 30);
    for (let i = 0; i < n; i++) {
      const t = pickRandom(tIns.rows);
      replyRows.push(buildReplyRow(t.id, u.id, t.created_at));
    }
  }
  const rIns = await bulkInsertSimple('thread_replies', replyRows);
  console.log(`  ✓ inserted ${rIns.inserted} replies (failed chunks: ${rIns.failedChunks.length})`);

  // ─── 4. Thread votes ────────────────────────────────
  console.log('\nPhase 4: thread votes');
  const voteRows: Array<{ thread_id: string; user_id: string; vote: 1 | -1; created_at: string }> = [];
  const seenVotes = new Set<string>();
  function addVotes(user: DemoUser, count: number) {
    const targets = pickN(tIns.rows, count);
    for (const t of targets) {
      const key = `${t.id}:${user.id}`;
      if (seenVotes.has(key)) continue;
      seenVotes.add(key);
      const vote = (faker.datatype.boolean({ probability: 0.9 }) ? 1 : -1) as 1 | -1;
      voteRows.push({
        thread_id: t.id, user_id: user.id, vote,
        created_at: faker.date.between({ from: t.created_at, to: new Date() }).toISOString(),
      });
    }
  }
  for (const u of lurkers) addVotes(u, faker.datatype.boolean({ probability: 0.3 }) ? randInt(2, 5) : randInt(0, 1));
  for (const u of mediums) addVotes(u, randInt(5, 15));
  for (const u of powers)  addVotes(u, randInt(20, 50));
  const vIns = await bulkInsertSimple('thread_votes', voteRows);
  console.log(`  ✓ inserted ${vIns.inserted} votes`);

  // Update thread counters from votes/replies
  console.log('  ↻ updating thread counters');
  await updateThreadCounters(tIns.rows.map((t) => t.id), voteRows, replyRows as Array<{ thread_id: string }>);

  // ─── 5. Petisi signatures ───────────────────────────
  console.log('\nPhase 5: petisi signatures');
  const petisiRows: Array<{ petisi_id: string; user_id: string; signed_at: string }> = [];
  const seenPetisi = new Set<string>();
  // Flagship petisi (first one) gets ~57% of sigs.
  const flagship = PETISI_IDS[0]!;
  const others = PETISI_IDS.slice(1);
  function addPetisiSig(user: DemoUser, n: number) {
    // Bias to flagship
    const targets: string[] = [];
    for (let i = 0; i < n; i++) {
      const p = faker.datatype.boolean({ probability: 0.55 }) ? flagship : pickRandom(others);
      if (!targets.includes(p)) targets.push(p);
    }
    for (const p of targets) {
      const k = `${p}:${user.id}`;
      if (seenPetisi.has(k)) continue;
      seenPetisi.add(k);
      petisiRows.push({
        petisi_id: p, user_id: user.id,
        signed_at: faker.date.recent({ days: 60 }).toISOString(),
      });
    }
  }
  for (const u of lurkers) addPetisiSig(u, randInt(1, 3));
  for (const u of mediums) addPetisiSig(u, randInt(2, 5));
  for (const u of powers)  addPetisiSig(u, randInt(3, Math.min(6, PETISI_IDS.length)));
  const pIns = await bulkInsertSimple('petisi_signatures', petisiRows);
  console.log(`  ✓ inserted ${pIns.inserted} petisi signatures (trg_petisi_count auto-updates current_count)`);

  // ─── 6. Janji follows ───────────────────────────────
  console.log('\nPhase 6: janji follows');
  const janjiRows: Array<{ janji_id: string; user_id: string; followed_at: string }> = [];
  const seenJanji = new Set<string>();
  // Higher follow probability for Mandek/Diingkari janji (warga marah).
  const janjiWeights = JANJI_ROWS.map((j) =>
    j.status === 'Mandek' || j.status === 'Diingkari' ? 3 :
    j.status === 'Berjalan' ? 2 :
    j.status === 'Belum'    ? 1.5 :
    1 // Ditepati
  );
  function addJanjiFollow(user: DemoUser, n: number) {
    for (let i = 0; i < n; i++) {
      const j = weightedPick(JANJI_ROWS, janjiWeights);
      const k = `${j.id}:${user.id}`;
      if (seenJanji.has(k)) continue;
      seenJanji.add(k);
      janjiRows.push({
        janji_id: j.id, user_id: user.id,
        followed_at: faker.date.recent({ days: 60 }).toISOString(),
      });
    }
  }
  for (const u of lurkers) addJanjiFollow(u, randInt(0, 1));
  for (const u of mediums) addJanjiFollow(u, randInt(2, 4));
  for (const u of powers)  addJanjiFollow(u, randInt(5, 10));
  const jIns = await bulkInsertSimple('janji_pemantau', janjiRows);
  console.log(`  ✓ inserted ${jIns.inserted} janji follows`);

  // ─── 7. Karya ───────────────────────────────────────
  console.log('\nPhase 7: karya');
  const karyaAuthors: DemoUser[] = [];
  for (const u of mediums) if (faker.datatype.boolean({ probability: 0.3 })) karyaAuthors.push(u);
  for (const u of powers)  for (let i = 0; i < randInt(1, 3); i++) karyaAuthors.push(u);
  const karyaRows = karyaAuthors.map((u) => buildKaryaRow(u.id));
  const kIns = await bulkInsertSimple('karya', karyaRows);
  console.log(`  ✓ inserted ${kIns.inserted} karya`);

  // ─── 8. Laporan (power users only) ──────────────────
  console.log('\nPhase 8: laporan');
  const laporanRows: Array<Record<string, unknown>> = [];
  for (const u of powers) {
    if (faker.datatype.boolean({ probability: 0.7 })) laporanRows.push(buildLaporanRow(u.id, u.chapter_id));
  }
  const lIns = await bulkInsertSimple('laporan', laporanRows);
  console.log(`  ✓ inserted ${lIns.inserted} laporan`);

  // ─── 9. Polling votes ───────────────────────────────
  console.log('\nPhase 9: polling votes');
  const pollingVotes: Array<{ polling_id: string; user_id: string; option_id: string; voted_at: string }> = [];
  if (POLLING.length > 0) {
    const polling = POLLING[0]!;
    const optionIds = polling.options.map((o) => o.id);
    const optWeights = [50, 30, 20]; // bias to first option
    // ~50% of all users vote
    const voters = faker.helpers.shuffle(validUsers).slice(0, Math.floor(validUsers.length * 0.5));
    for (const u of voters) {
      pollingVotes.push({
        polling_id: polling.id,
        user_id: u.id,
        option_id: weightedPick(optionIds, optWeights.slice(0, optionIds.length)),
        voted_at: faker.date.recent({ days: 30 }).toISOString(),
      });
    }
  }
  const pvIns = await bulkInsertSimple('polling_votes', pollingVotes);
  console.log(`  ✓ inserted ${pvIns.inserted} polling votes`);

  // ─── 10. Kelas enrollment ───────────────────────────
  console.log('\nPhase 10: kelas enrollment');
  const enrollRows: Array<{ kelas_id: string; user_id: string; progress: number; enrolled_at: string }> = [];
  const seenEnroll = new Set<string>();
  const flagshipKelas = KELAS_IDS.slice(0, 2); // 2 flagship
  function addEnrollment(u: DemoUser, n: number, progressMin: number, progressMax: number) {
    for (let i = 0; i < n; i++) {
      const k = faker.datatype.boolean({ probability: 0.55 }) ? pickRandom(flagshipKelas) : pickRandom(KELAS_IDS);
      const key = `${k}:${u.id}`;
      if (seenEnroll.has(key)) continue;
      seenEnroll.add(key);
      enrollRows.push({
        kelas_id: k, user_id: u.id,
        progress: randInt(progressMin, progressMax),
        enrolled_at: faker.date.recent({ days: 90 }).toISOString(),
      });
    }
  }
  for (const u of mediums) addEnrollment(u, 1, 30, 70);
  for (const u of powers)  addEnrollment(u, 2, 80, 100);
  const eIns = await bulkInsertSimple('kelas_enrollment', enrollRows);
  console.log(`  ✓ inserted ${eIns.inserted} kelas enrollments`);

  // ─── 11. User badges (extras beyond auto warga-baru) ─
  console.log('\nPhase 11: user_badges (extras)');
  const usersWithPetisi = new Set(petisiRows.map((r) => r.user_id));
  const usersWithKarya = new Set(karyaRows.map((r) => r.author_id as string));
  const usersWithManyVotes = new Map<string, number>();
  for (const v of voteRows) usersWithManyVotes.set(v.user_id, (usersWithManyVotes.get(v.user_id) ?? 0) + 1);

  const badgeRows: Array<{ user_id: string; badge_id: string; earned_at: string }> = [];
  const seenBadge = new Set<string>();
  function addBadge(uid: string, bid: string) {
    const k = `${uid}:${bid}`;
    if (seenBadge.has(k)) return;
    seenBadge.add(k);
    badgeRows.push({
      user_id: uid, badge_id: bid,
      earned_at: faker.date.recent({ days: 30 }).toISOString(),
    });
  }
  // Cap aktivis-mula at first 25 to stay in spec range (~400 total).
  const aktivisCap = 25;
  let aktivisCount = 0;
  for (const uid of usersWithPetisi) {
    if (aktivisCount >= aktivisCap) break;
    addBadge(uid, 'aktivis-mula'); aktivisCount++;
  }
  for (const uid of usersWithKarya) addBadge(uid, 'penulis');
  let voterCap = 30;
  for (const [uid, c] of usersWithManyVotes) {
    if (voterCap <= 0) break;
    if (c >= 10) { addBadge(uid, 'voter'); voterCap--; }
  }
  // Forum-star → power users with thread that has many replies
  const replyCountByThread = new Map<string, number>();
  for (const r of replyRows) {
    const tid = (r as { thread_id: string }).thread_id;
    replyCountByThread.set(tid, (replyCountByThread.get(tid) ?? 0) + 1);
  }
  for (const t of tIns.rows) {
    if ((replyCountByThread.get(t.id) ?? 0) >= 8) addBadge(t.author_id, 'forum-star');
  }
  const bIns = await bulkInsertSimple('user_badges', badgeRows);
  console.log(`  ✓ inserted ${bIns.inserted} extra user badges`);

  // ─── Summary ────────────────────────────────────────
  console.log('\n📊 Summary (queried from DB)');
  await printSummary();

  console.log('\n✅ Demo seed complete.');
  console.log('   Cleanup later: pnpm tsx scripts/cleanup-demo-seed.ts');
}

// ─── Helpers ───────────────────────────────────────────

async function bulkInsertReturning(table: string, rows: Array<Record<string, unknown>>) {
  // For threads we need ids back.
  const inserted: Array<{ id: string; author_id: string; created_at: string }> = [];
  const failedChunks: Array<{ startIdx: number; err: string }> = [];
  const chunkSize = 100;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { data, error } = await supabase.from(table).insert(chunk).select('id, author_id, created_at');
    if (error) failedChunks.push({ startIdx: i, err: error.message });
    else if (data) inserted.push(...(data as typeof inserted));
  }
  return { rows: inserted, failedChunks };
}

async function bulkInsertSimple(table: string, rows: Array<Record<string, unknown>>) {
  return bulkInsert(supabase as unknown as Parameters<typeof bulkInsert>[0], table, rows, 200);
}

function buildReplyRow(threadId: string, authorId: string, threadCreatedAt: string) {
  const kind = pickReplyKind();
  return {
    thread_id: threadId,
    parent_id: null,
    author_id: authorId,
    body: buildReplyBody(kind, kind === 'tag' ? f.internet.username().toLowerCase() : undefined),
    upvotes: randInt(0, 12),
    is_demo: true,
    created_at: faker.date.between({
      from: new Date(threadCreatedAt),
      to: new Date(Date.now()),
    }).toISOString(),
  };
}

function buildKaryaRow(authorId: string) {
  const type = pickKaryaType();
  const titlePool = KARYA_TITLES[type];
  const title = pickRandom(titlePool);
  const body = type === 'Tulisan' || type === 'Zine' ? buildKaryaBody() : buildKaryaBody().split('\n\n').slice(0, 2).join('\n\n');
  return {
    author_id: authorId,
    type,
    title,
    body,
    cover_url: null,
    meta: buildKaryaMeta(type),
    tags: pickN(['Politik','Pemuda','Demokrasi','Kota','APBD','Pemilu','Lokal','Lingkungan','Gender'] as const, randInt(1, 3)),
    views: randInt(40, 2400),
    featured: faker.datatype.boolean({ probability: 0.1 }),
    published_at: faker.date.recent({ days: 90 }).toISOString(),
    is_demo: true,
  };
}

function buildLaporanRow(reporterId: string, chapterId: string) {
  const cats: LaporanCategory[] = ['jalan','banjir','sampah','listrik','layanan','drainase','lain'];
  const catWeights = [25, 18, 22, 12, 10, 8, 5];
  const category = weightedPick(cats, catWeights);
  const tplPool = LAPORAN_BANK[category];
  const tpl = pickRandom(tplPool);
  const status = weightedPick(
    ['Diterima','Ditindaklanjuti','Selesai','Ditolak'] as const,
    [50, 30, 15, 5]
  );
  const city = chapterId; // matches seed convention
  return {
    reporter_id: reporterId,
    category,
    title: fillPlaceholders(tpl.title),
    description: fillPlaceholders(tpl.desc),
    location: `${city} · ${f.location.county()}`,
    city,
    photo_url: null,
    status,
    dukungan_count: randInt(2, 80),
    is_anonim: faker.datatype.boolean({ probability: 0.15 }),
    is_demo: true,
    created_at: faker.date.recent({ days: 60 }).toISOString(),
    resolved_at: status === 'Selesai' ? faker.date.recent({ days: 14 }).toISOString() : null,
  };
}

async function updateThreadCounters(
  threadIds: string[],
  votes: Array<{ thread_id: string; vote: 1 | -1 }>,
  replies: Array<{ thread_id: string }>
): Promise<void> {
  const up = new Map<string, number>();
  const down = new Map<string, number>();
  const reply = new Map<string, number>();
  for (const v of votes) {
    if (v.vote === 1) up.set(v.thread_id, (up.get(v.thread_id) ?? 0) + 1);
    else down.set(v.thread_id, (down.get(v.thread_id) ?? 0) + 1);
  }
  for (const r of replies) reply.set(r.thread_id, (reply.get(r.thread_id) ?? 0) + 1);

  // Update in chunks. supabase-js doesn't bulk-update with different values easily; use Promise.all per id.
  const updates = threadIds.map(async (id) => {
    const upvotes = up.get(id) ?? 0;
    const downvotes = down.get(id) ?? 0;
    const reply_count = reply.get(id) ?? 0;
    const hot = upvotes >= 15 && reply_count >= 5;
    return supabase.from('threads').update({ upvotes, downvotes, reply_count, hot }).eq('id', id);
  });
  // Run with concurrency limit so we don't hammer the API.
  for (let i = 0; i < updates.length; i += 20) {
    await Promise.all(updates.slice(i, i + 20));
    await sleep(50);
  }
}

async function printSummary(): Promise<void> {
  const tables: Array<[string, string]> = [
    ['profiles',      'is_demo=true'],
    ['threads',       'is_demo=true'],
    ['thread_replies','is_demo=true'],
    ['karya',         'is_demo=true'],
    ['laporan',       'is_demo=true'],
  ];
  for (const [t] of tables) {
    const { count } = await supabase.from(t).select('*', { count: 'exact', head: true }).eq('is_demo', true);
    console.log(`  ${t.padEnd(18)} ${(count ?? '?').toString().padStart(5)}`);
  }
  // Joins to demo profiles
  const { count: voteN } = await supabase.from('thread_votes').select('*', { count: 'exact', head: true });
  console.log(`  thread_votes (all)   ${(voteN ?? '?').toString().padStart(5)}`);
  const { count: sigN } = await supabase.from('petisi_signatures').select('*', { count: 'exact', head: true });
  console.log(`  petisi_signatures    ${(sigN ?? '?').toString().padStart(5)}`);
  const { count: jpN } = await supabase.from('janji_pemantau').select('*', { count: 'exact', head: true });
  console.log(`  janji_pemantau       ${(jpN ?? '?').toString().padStart(5)}`);
  const { count: peN } = await supabase.from('polling_votes').select('*', { count: 'exact', head: true });
  console.log(`  polling_votes        ${(peN ?? '?').toString().padStart(5)}`);
  const { count: enN } = await supabase.from('kelas_enrollment').select('*', { count: 'exact', head: true });
  console.log(`  kelas_enrollment     ${(enN ?? '?').toString().padStart(5)}`);
  const { count: ubN } = await supabase.from('user_badges').select('*', { count: 'exact', head: true });
  console.log(`  user_badges (all)    ${(ubN ?? '?').toString().padStart(5)}`);
}

const TRIGGER_FIX_SQL = `   create or replace function public.handle_new_user()
   returns trigger as $$
   begin
     insert into public.profiles (id, name, level, xp, onboarded)
     values (
       new.id,
       coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
       1, 0, false
     );
     insert into public.user_badges (user_id, badge_id) values (new.id, 'warga-baru');
     return new;
   end;
   $$ language plpgsql security definer;
`;

main().catch((err) => {
  console.error('\n💥 Generator crashed:', err);
  process.exit(1);
});

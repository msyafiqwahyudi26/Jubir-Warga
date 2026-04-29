# Spec #2 — Demo seed generator (300 fake user + derived content)

**Sprint**: 2
**Owner**: Claude Code (executor) · audited oleh planner
**Estimasi**: 2-3 jam (development), 5-10 menit (run + apply)
**Dependency**: Spec #1 ter-apply (kolom `is_demo` ada di tabel content)

---

## Goal

Bikin TypeScript script yang generate 300 user fiktif dengan distribusi aktivitas realistic (80% lurker, 15% medium, 5% power user) plus derived content (threads, replies, votes, petisi sign, follow janji, karya, laporan, kelas enrollment, badges). Apply langsung ke Supabase project. Hasil: webapp Phase 2 terlihat hidup saat pitch, semua data ditandai `is_demo = true` untuk cleanup mudah.

## Konteks

Sekarang database punya 14 pejabat real, 14 janji, 4 petisi, dll — tapi 0 user, 0 thread, 0 vote. Beranda menampilkan empty state ("belum ada thread di Phase 2") yang jujur tapi mati untuk pitch. Demo data 300 user akan: tunjukkan pola interaksi, ramaikan halaman komunitas/petisi, validasi performa query di volume realistic.

## File yang dibuat

```
scripts/
├── generate-demo-seed.ts       Main script — generate + apply
├── cleanup-demo-seed.ts        Reverse — DELETE demo + auth users
├── lib/
│   ├── faker-id.ts             Faker setup dengan locale id_ID + Indonesian patterns
│   ├── distributions.ts        Helper untuk weighted random (80/15/5 dll)
│   └── content-templates.ts    Template thread title, reply body, dll
└── README.md                   Cara run + cleanup
```

Plus tambahan dependency di `package.json` root atau `scripts/package.json`:

```json
{
  "dependencies": {
    "@faker-js/faker": "^9.2.0",
    "@supabase/supabase-js": "^2.46.1",
    "dotenv": "^16.4.5",
    "tsx": "^4.19.2"
  }
}
```

## Environment variables

Script baca dari `.env.local` di root atau `apps/web/.env.local`:

```env
SUPABASE_URL=https://ifrautpvbhdbhieystxk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<dari Supabase dashboard → Settings → API Keys → Legacy → service_role>
```

**SECURITY**: Service role key WAJIB dari `.env.local` (gitignored). JANGAN hardcode. JANGAN log ke stdout.

## Distribusi populasi

300 user terbagi:

| Tier | Count | Behavior |
|---|---|---|
| Lurker | 240 (80%) | 0-1 vote, 0 thread, 0 reply, 1-3 petisi sign, 0-1 follow janji, 0 karya |
| Medium | 45 (15%) | 5-15 vote, 1-3 thread, 3-8 reply, 2-5 petisi sign, 2-4 follow janji, 0-1 karya, 1-2 enrollment |
| Power | 15 (5%) | 20-50 vote, 5-15 thread, 15-30 reply, 4+ petisi sign, 5+ follow janji, 1-3 karya, 2-3 enrollment, kemungkinan submit laporan |

Total derived (estimasi):
- Threads: 240×0 + 45×2 + 15×10 = ~240
- Thread replies: 240×0 + 45×5 + 15×22 = ~555
- Thread votes: ~3500
- Petisi sigs: ~700 (4 petisi × ~175 avg)
- Janji follows: ~600 (14 janji × ~43 avg)
- Karya: ~25
- Laporan: ~10 (hanya power user)
- Polling votes: ~150 (1 polling × ~150 user dari medium+power)
- Kelas enrollment: ~75
- User badges: ~400 (rata-rata 1.3/user)

Total ≈ ~6300 row baru. Acceptable untuk free tier Supabase (500MB limit).

## Persona generation

Pakai `@faker-js/faker` dengan locale `id`:

```ts
import { faker, fakerID_ID } from '@faker-js/faker';

const f = fakerID_ID;
const profile = {
  email: f.internet.email().toLowerCase(),
  name: f.person.fullName(),               // "Sari Lestari"
  username: f.internet.username().toLowerCase().replace(/[._]/g, ''), // "sarilestari92"
  bio: weightedRandom([
    null, null, null,  // 60% no bio
    f.lorem.sentence({ min: 3, max: 8 }),
  ]),
  chapter_id: pickRandom(['jakarta','bandung','malang','surabaya','jogja','medan','makassar']),
  avatar_url: `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`,
  level: tier === 'power' ? randInt(8, 15) : tier === 'medium' ? randInt(3, 7) : randInt(1, 3),
  xp: level * randInt(80, 150),
  is_anonim: false,
  onboarded: true,
  is_demo: true,
};
```

**Avatar**: DiceBear API generative SVG, NO real face photos (ada privacy + ToS issue dengan stock photos).

**Email pattern**: harus benar-benar tidak collide dengan real user. Pakai prefix:
```ts
const email = `demo-${i.toString().padStart(3, '0')}-${f.internet.email().split('@')[0]}@jubirwarga-demo.local`;
// Contoh: demo-042-sarilestari@jubirwarga-demo.local
```
Domain `.local` tidak deliverable, aman dari collision. Kalau mau format yang lebih natural untuk screenshot pitch, bisa pakai domain `@demo.jubirwarga.id` (tidak pernah register, tapi terlihat normal).

**Password**: semua user demo pakai password `Demo!Jubir2026` (tidak akan dipakai login real). Disimpan via `auth.admin.createUser({ password, email_confirm: true })` supaya skip email verification.

## Content generation

### Threads (~240)

Template-based + faker fill-in:

```ts
const TEMPLATES = [
  // Politik
  { topic: 'politik', titles: [
    'RUU {topic_kebijakan}, kenapa mandek terus?',
    'Pengalaman ikut sidang DPR tentang {issue} kemarin',
    'Apa hak warga kalau {situasi}?',
    // dst, ~10 template per topic
  ]},
  // Lingkungan
  { topic: 'lingkungan', titles: [
    'Kondisi sungai di {kota} sekarang — foto + analisis',
    'Komunitas kami baru aja {aksi}, sharing pengalaman',
    // dst
  ]},
  // ... 9 topic, ~100 template total
];
```

Body 100-500 kata, paragraph break, kadang include URL fake ke "sumber" (e.g., "https://contoh.org/laporan-2026").

### Thread replies (~555)

Reply body template:
- 30%: agreement + tambahan konteks ("Setuju, di Bandung juga begini...")
- 25%: pertanyaan ("Sumbernya dari mana, mas?")
- 20%: pengalaman pribadi
- 15%: counter-argumen sopan
- 10%: tag user lain ("@username pernah bahas ini")

Distribusi waktu: cluster di 1-3 hari setelah thread post (realistis vs uniform random).

### Thread votes (~3500)

Distribusi: 90% upvote, 10% downvote (forum yang sehat). Pakai bulk insert.

### Petisi signatures (~700)

4 petisi, distribusi tidak merata: 1 petisi flagship dapat ~400, sisanya ~100 each. Update `petisi.current_count` otomatis via trigger yang sudah ada (`trg_petisi_count`).

### Janji follows (~600)

14 janji, distribusi proportional ke "controversy": janji dengan status `Mandek` atau `Diingkari` dapat lebih banyak follower (warga marah). Janji `Ditepati` dapat sedikit (sudah selesai).

### Karya (~25)

Template-based:
- 60% tipe `Tulisan` (judul + body 300-1000 kata)
- 25% tipe `Vlog` (judul + meta "12:34" + body deskripsi)
- 10% tipe `Ilustrasi` (judul + meta "Galeri")
- 5% tipe `Podcast` (judul + meta "45 mnt")

Author dari pool 60 user (medium + power tier).

### Laporan (~10)

Hanya power user. 7 kategori (`jalan`, `banjir`, `sampah`, `listrik`, `layanan`, `drainase`, `lain`), distribusi: jalan + sampah dominant. Status: 50% `Diterima`, 30% `Ditindaklanjuti`, 15% `Selesai`, 5% `Ditolak`.

### Polling votes (~150)

1 polling dari `seed.sql`, distribusi vote ke 4 option dengan satu opsi favorit (~50%).

### Kelas enrollment (~75)

7 kelas, distribusi: 2 kelas flagship dapat ~20 enrollee, 5 lainnya ~7 each. `progress`: power user 80-100, medium 30-70, lurker 0-30.

### User badges (~400)

Auto-grant beberapa badges berdasar action:
- `warga-baru` → semua 300 user (dari trigger handle_new_user yang sudah ada)
- `aktivis-mula` → user yang sign ≥1 petisi (~280 user)
- `penulis` → user yang punya karya (~25 user)
- `voter` → user yang vote ≥10 polling (~50 user)
- Manual extra dari list 12 badges yang ada di seed.

## Script structure

### `scripts/generate-demo-seed.ts`

Pseudocode:

```ts
import { createClient } from '@supabase/supabase-js';
import { fakerID_ID as f } from '@faker-js/faker';
import { config } from 'dotenv';
import { distributeUsers, generateContent } from './lib/distributions';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

async function main() {
  console.log('🌱 Generating 300 demo users...');

  const users = await Promise.all(
    Array.from({ length: 300 }, (_, i) => createDemoUser(i))
  );
  console.log(`✓ Created ${users.length} auth users + profiles`);

  const tiers = distributeUsers(users); // { lurkers, mediums, powers }

  console.log('🌱 Generating threads...');
  const threads = await generateThreads(tiers);
  console.log(`✓ Created ${threads.length} threads`);

  console.log('🌱 Generating replies...');
  const replies = await generateReplies(threads, tiers);
  console.log(`✓ Created ${replies.length} replies`);

  console.log('🌱 Generating votes...');
  const votes = await generateVotes(threads, users);
  console.log(`✓ Created ${votes.length} votes`);

  // ... petisi, janji, karya, dll

  console.log('\n📊 Summary:');
  await printSummary();
}

main().catch(console.error);
```

### Concurrency

- `auth.admin.createUser` rate-limit ~10/sec di free tier. Batch 5 concurrent dengan delay 200ms.
- Bulk insert untuk content (`.insert([...])` dengan array 100 row per call).
- Total runtime estimate: ~5-8 menit untuk 300 user + derived.

### Idempotent guard

Sebelum generate, cek apakah demo data sudah ada:
```ts
const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_demo', true);
if (count && count > 0) {
  console.error(`⚠️  Already ${count} demo profiles exist. Run cleanup-demo-seed.ts first.`);
  process.exit(1);
}
```

### Error handling

- Setiap step wrap di try/catch.
- Kalau auth.admin.createUser gagal di tengah jalan, log nomor user yang sukses + lanjut. Jangan throw karena ini long-running.
- End-of-script summary: tampilkan counts per table + warning kalau ada divergence dari target.

## `scripts/cleanup-demo-seed.ts`

```ts
async function cleanup() {
  console.log('🗑  Cleaning up demo data...');

  // 1. Hapus public.* via function
  const { data, error } = await supabase.rpc('cleanup_demo_data');
  if (error) throw error;
  console.log('Public schema cleaned:', data);

  // 2. Hapus auth.users yang demo
  const { data: users } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const demoUsers = users.users.filter(u => u.email?.endsWith('@jubirwarga-demo.local') || u.email?.endsWith('@demo.jubirwarga.id'));
  console.log(`Found ${demoUsers.length} demo auth users to delete`);

  for (const u of demoUsers) {
    await supabase.auth.admin.deleteUser(u.id);
  }
  console.log('✓ Auth users cleaned');
}
```

## Acceptance checklist

- [ ] File-file di `scripts/` ter-create
- [ ] Dependencies `@faker-js/faker`, `tsx`, `dotenv`, `@supabase/supabase-js` ter-install
- [ ] `pnpm tsx scripts/generate-demo-seed.ts` run sukses, output progress + summary
- [ ] Verifikasi via SQL Editor:
  ```sql
  select 'profiles' as t, count(*) from public.profiles where is_demo
  union all select 'threads', count(*) from public.threads where is_demo
  union all select 'thread_replies', count(*) from public.thread_replies where is_demo
  union all select 'thread_votes', count(*) from public.thread_votes
    where user_id in (select id from public.profiles where is_demo)
  union all select 'petisi_signatures', count(*) from public.petisi_signatures
    where user_id in (select id from public.profiles where is_demo)
  union all select 'karya', count(*) from public.karya where is_demo
  union all select 'laporan', count(*) from public.laporan where is_demo;
  ```
  Expected: profiles=300, threads≈240, replies≈555, votes≈3500, sigs≈700, karya≈25, laporan≈10
- [ ] Buka Beranda di `localhost:3000` → ThreadList sekarang menampilkan 3 hot thread real (bukan empty state)
- [ ] PetisiPreview shows updated count (bertambah dari 31.890 awal)
- [ ] `pnpm tsx scripts/cleanup-demo-seed.ts` run sukses, semua demo data hilang
- [ ] Re-run generator setelah cleanup → tetap sukses (idempotent)

## Out of scope

- ❌ Modify table schema lebih dari Spec #1
- ❌ Generate konten yang menyebutkan tokoh real selain pejabat yang sudah di-seed
- ❌ Generate konten yang berpotensi defamatory atau hate speech (filter di template)
- ❌ Bypass Supabase rate limit dengan pakai service_role di production app

## Security audit notes (planner WAJIB review setelah implementasi)

- [ ] Verifikasi service_role key TIDAK ter-commit (cek `git status`)
- [ ] Verifikasi semua demo email pakai domain non-deliverable
- [ ] Verifikasi tidak ada nama tokoh real (penyanyi, politisi, dll) di template — sample 20 thread random, baca title & body
- [ ] Verifikasi RLS policy tetap intact setelah bulk insert (run query dengan anon key, pastikan tetap kena policy)

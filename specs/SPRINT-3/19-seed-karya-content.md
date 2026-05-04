# Spec #19 — Seed Karya body content (5-10 long-form artikel real)

**Sprint**: 3 (post-implementation)
**Owner**: Claude Code (executor) · audited oleh planner
**Estimasi**: 3-4 jam
**Dependency**: Spec #8 Karya (commit `9019720`) sudah landed
**Source**: Audit visual 2026-05-04 — found `body_md` empty di 42 karya seed, ReadingView tampil placeholder "Tulisan belum tersedia"
**Window**: B (batch 2 paralel — SQL only territory)

**Decisions Mas (approved 2026-05-04):**
1. ✅ Seed minimal 5-10 long-form artikel real-style (bukan lorem ipsum)
2. ✅ Topik: cover 3 persona target (Aulia, Reza, Sari) + variasi format (tulisan, podcast script, ilustrasi caption)
3. ✅ Bahasa Gen Z Indonesia, brand voice match (kamu/aku, Magdalene/VICE/Asumsi tone)

**Required reading:**
1. `CLAUDE.md` §1 (project context, persona) + §4 (brand voice)
2. `apps/legacy/docs/Landing_Page_Beta_Copy.md` — tone reference
3. `supabase/demo_seed.sql` — existing 42 karya skeleton (extract id + title)
4. `apps/web/src/app/karya/[id]/page.tsx` — ReadingView template (verify body_md render)

---

## Goal

Backfill body content untuk minimal 5-10 karya placeholder. Karya yang di-fill: pilih dari "Pilihan Editor" 5 karya + Top 3 from "Semua karya" — ini yang paling visible di Karya page.

Setelah spec ini selesai:
- Reload `/karya/<id-pilihan-editor>` → render long-form artikel real, bukan placeholder
- ReadingView tampak bermakna untuk visitor first-impression
- Showcase brand voice + ekspertise editorial untuk launch publik

---

## Karya yang di-fill (10 prioritized)

Cek `supabase/demo_seed.sql` atau query `SELECT id, title, type FROM karya ORDER BY featured DESC LIMIT 15;` untuk dapat list. Default: 10 karya berikut (kalau ada di seed):

| # | Title (existing) | Type | Word target | Topik |
|---|---|---|---|---|
| 1 | "Demokrasi Deliberatif: Teori yang Bisa Kita Coba di RT/RW" | Tulisan | 800 | Tata kelola RT/RW |
| 2 | "Lima Alasan Pemuda Masih Apatis terhadap Pemilu Lokal" | Tulisan | 600 | Pemilu lokal |
| 3 | "Kenapa Suara Kita Bisa Hilang — dalam 6 panel visual" | Ilustrasi | 200 (caption) | Suara warga |
| 4 | "Ngobrol sama Ibu PKL soal APBD — ternyata mereka..." | Vlog | 400 (transcript) | APBD literacy |
| 5 | "Obrolan Pagi: Gerakan Pemuda & Pemilu 2029" | Podcast | 500 (script teaser) | Pemuda + pemilu |
| 6-10 | (sisa, pilih dari 42 yang relevan) | Mix | 400-600 each | Mix |

**Method**: Window B query DB dulu untuk dapat ID+title aktual, lalu generate body_md per karya.

---

## File yang dibuat

```
supabase/karya_content_seed.sql                     SQL UPDATE per karya id (10 statement)
scripts/seed-karya-content.ts                       (optional) idempotent runner via supabase-js
docs/karya-content-drafts/                          BARU folder
├── 01-demokrasi-deliberatif.md                     Long-form draft (markdown)
├── 02-lima-alasan-pemuda-apatis.md
├── 03-suara-kita-bisa-hilang.md (caption ilustrasi 6 panel)
├── 04-ngobrol-ibu-pkl-apbd.md (vlog transcript)
├── 05-obrolan-pagi-gerakan-pemuda.md (podcast script)
├── 06-10-*.md
```

## File yang TIDAK diubah

- ❌ `apps/web/src/**` — pure SQL + content task, NO code change
- ❌ `supabase/seed.sql` (existing reference data) — JANGAN modify, pakai file baru
- ❌ `supabase/demo_seed.sql` (existing demo) — JANGAN modify, pakai file baru
- ❌ Migration file (`0001-*.sql`) — immutable

---

## Step-by-step

### 1. Query existing karya

```bash
# Via psql atau Supabase Studio
SELECT id, title, type, slug FROM karya
WHERE featured = true OR sort_order < 10
ORDER BY sort_order ASC LIMIT 15;
```

Catat 10 ID + title.

### 2. Tulis body draft per karya di `docs/karya-content-drafts/`

**Pattern per file**:

```md
---
karya_id: "88888888-0001-0000-0000-000000000001"
title: "Lima Alasan Pemuda Masih Apatis terhadap Pemilu Lokal"
type: "tulisan"
read_time_min: 7
target_persona: "Aulia (mahasiswi 21)"
voice_reference: "Asumsi.co"
---

# Lima Alasan Pemuda Masih Apatis terhadap Pemilu Lokal

Kalau kamu lihat angka partisipasi pemilu lokal terakhir, bakal bingung. KPU bilang turn-out pilkada serentak Desember 2024 cuma 68% — angka terendah sejak orde reformasi. Yang lebih bikin penasaran: drop paling tajam dari **demografi 17-25 tahun**.

Aku ngobrol sama 12 anak muda di Jakarta, Bandung, sama Surabaya selama dua bulan. Bukan riset akademik — sekadar dengerin alasan mereka. Lima pola yang kelihatan jelas:

## 1. Calonnya gak ada yang ngajak ngobrol

[... 600 kata real content with brand voice ...]

## 2. Janji-janji terasa déjà vu

[...]

(Rest of article — total ~600-800 kata)

---

*Tulisan ini dipublish di Jubir Warga sebagai bagian seri "Anak Muda & Demokrasi 2026". Mau diskusi? [Gabung obrolan di forum Komunitas](/komunitas).*
```

**Brand voice constraint**:
- Pakai "kamu" / "aku"
- Mix bilingual natural (vibe, deep dive, venting OK)
- Hindari "Anda" / "Saya", "civic", "warga negara yang kritis"
- Data konkret (angka, tanggal, kota, nama narasumber fiktif boleh tapi plausible)
- Reference tone Magdalene/Asumsi/VICE: opinionated tapi balanced, longform punchy

### 3. Generate SQL UPDATE statement

**`supabase/karya_content_seed.sql`**:

```sql
-- Spec #19: Seed Karya body content batch 1 (10 karya)
-- Idempotent: gunakan UPDATE WHERE body_md IS NULL OR body_md = ''

-- 1. Lima Alasan Pemuda Masih Apatis
UPDATE karya
SET body_md = $$
# Lima Alasan Pemuda Masih Apatis terhadap Pemilu Lokal

Kalau kamu lihat angka partisipasi pemilu lokal terakhir, bakal bingung...

[... full markdown body ...]
$$,
updated_at = now()
WHERE id = '88888888-0001-0000-0000-000000000001'
  AND (body_md IS NULL OR body_md = '');

-- 2. Demokrasi Deliberatif
UPDATE karya
SET body_md = $$
# Demokrasi Deliberatif: Teori yang Bisa Kita Coba di RT/RW
...
$$,
updated_at = now()
WHERE id = '88888888-0002-0000-0000-000000000002'
  AND (body_md IS NULL OR body_md = '');

-- ... (8 more)
```

**Pakai PostgreSQL `$$...$$` quoted string** untuk markdown body (handle special char tanpa escape hell).

### 4. (Optional) Idempotent runner script

**`scripts/seed-karya-content.ts`**:

```ts
import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const drafts = ['01-...', '02-...', /* ... */];
  for (const file of drafts) {
    const content = await readFile(join('docs/karya-content-drafts', file + '.md'), 'utf-8');
    const { data: frontmatter, content: body } = matter(content);
    const { error } = await supabase
      .from('karya')
      .update({ body_md: body, updated_at: new Date().toISOString() })
      .eq('id', frontmatter.karya_id);
    if (error) console.error(`❌ ${file}:`, error.message);
    else console.log(`✅ ${file} → karya ${frontmatter.karya_id}`);
  }
}
main();
```

Run via `pnpm tsx scripts/seed-karya-content.ts`.

### 5. Apply SQL ke Supabase

**Method A (preferred)**: psql connection string + run `psql -f supabase/karya_content_seed.sql`

**Method B**: Supabase SQL Editor dashboard, paste isi file, run.

**Method C**: `pnpm tsx scripts/seed-karya-content.ts` (kalau pakai script)

### 6. Verify via Chrome

1. `pnpm dev`
2. Navigate `/karya` → klik "Lima Alasan Pemuda Masih Apatis..." → ReadingView tampil 600+ kata real, NO "Tulisan belum tersedia."
3. Sample 3 karya lain — verify body_md render benar
4. Spot check brand voice: no "Anda", no "civic"

---

## Acceptance checklist

- [ ] 10 file draft di `docs/karya-content-drafts/` ditulis (markdown + frontmatter)
- [ ] Setiap draft 200-800 kata (sesuai type), brand voice consistent
- [ ] Setiap draft 0 occurrence "Anda"/"Saya"/"civic"
- [ ] `supabase/karya_content_seed.sql` ada dengan 10 UPDATE statement
- [ ] SQL idempotent (`WHERE body_md IS NULL OR body_md = ''`)
- [ ] SQL applied ke Supabase project (verify via SELECT)
- [ ] `/karya/<id>` render long-form body untuk 10 karya
- [ ] No "Tulisan belum tersedia. Penulis lagi finalisasi draft." muncul untuk 10 karya
- [ ] ReadingView typography readable (Vollkorn body, prose lh-relaxed)
- [ ] Footer link "Diskusi di forum" tetap render

## Out of scope

- ❌ Sisa 32 karya body — defer ke Sprint 4 (or content team backfill manual)
- ❌ Karya UI redesign — separate spec
- ❌ Author photo / bio enrichment — separate spec
- ❌ Real photo upload (Ilustrasi/Vlog cover) — Sprint 4 (Storage bucket)

## Commit message

```
feat(content): seed karya body content batch 1 (10 long-form artikel)

- 10 markdown draft di docs/karya-content-drafts/ dengan frontmatter
- supabase/karya_content_seed.sql idempotent UPDATE 10 karya
- (optional) scripts/seed-karya-content.ts runner
- Brand voice: kamu/aku, Magdalene/VICE/Asumsi tone, persona-targeted
- Forbidden vocab guard: 0 "Anda"/"Saya"/"civic" verified

Per Spec #19. Sisa 32 karya body defer Sprint 4.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

## Coordinate paralel — Window B territory

✅ Aman edit: `supabase/karya_content_seed.sql`, `scripts/seed-karya-content.ts`, `docs/karya-content-drafts/`
❌ JANGAN edit: `apps/web/**`, `supabase/seed.sql`, `supabase/demo_seed.sql`, migration files

0 conflict expected dengan Window A/C/D/E (pure content + SQL territory).

**Note**: Apply SQL butuh akses Supabase production credential. Mas approve dulu sebelum apply (atau Window B prepare SQL, Mas execute manual).

# Spec #16 — Tier A cleanup (audit findings post-Sprint 3)

**Sprint**: 3 (post-implementation cleanup)
**Owner**: Claude Code (executor) · audited oleh planner
**Estimasi**: 1.5-2.5 jam
**Dependency**: Spec #7-#13 sudah landed (commit `72ce58c`)
**Source**: Audit visual smoke test 2026-05-04 via Chrome localhost:3000 (planner Cowork)
**Decisions Mas (approved 2026-05-04):**
1. ✅ Em dash policy: **selective** — hapus di curated copy, keep di body UGC
2. ✅ Dev meta "Sprint 4" labels: **hapus dari user-facing copy** — ganti dengan empty state proper atau hide
3. ✅ Quote nesting JanjiDetail: **fix template** — single source of truth
4. ✅ Manifest + icons: **port dari `apps/legacy/public/`** ke `apps/web/public/`
5. ✅ `/main` nav link: **tambah** sebagai surface ke-6 di site-header

**Required reading sebelum mulai:**
1. `CLAUDE.md` §4 (brand voice) + §5 (design system anti-pattern)
2. `memory.md` (locked decisions)
3. `context.md` (current state + pending decisions)
4. Audit findings di bawah (section "Issues found")

---

## Goal

Cleanup audit findings dari smoke test Sprint 3. Tujuan: page yang sudah landed (Komunitas/Karya/Kelas/Aksi/Tagih/Profil/Main + 8 detail) **production-ready** untuk beta launch — tidak ada dev meta exposed, tidak ada em dash di curated copy, tidak ada quote nesting bug, tidak ada 404 manifest/icons, dan `/main` discoverable dari nav.

Setelah spec ini selesai:
- Visual brand voice consistent (no em dash di hero/kicker/CTA/page header)
- User tidak lihat label "Sprint 4" / dev meta di production
- JanjiDetail quote rendering clean (no double-quote nesting)
- PWA manifest + icons return 200 (no 404 di Network tab)
- Header nav: Komunitas, Karya, Kelas, Janji, Aksi, **Main** (6 surface)

---

## Issues found (raw audit data)

### A. Em dash di curated copy (HARUS hapus)

| Lokasi | Current | Replace dengan |
|---|---|---|
| `apps/web/src/app/page.tsx` Beranda hero subtitle | `"konstitusi — tapi seberapa jauh sudah dipraktikkan?"` | `"konstitusi. Tapi seberapa jauh sudah dipraktikkan?"` |
| `apps/web/src/app/aksi/page.tsx` subtitle | `"Bukan cuma ngomong — kita kerjain."` | `"Bukan cuma ngomong, kita kerjain."` |
| `apps/web/src/components/beranda/janji-tracker.tsx` (cek copy) | scan `—` di header/subtitle | replace per context |
| Card kicker / page kicker pattern `— komunitas`, `— karya warga`, `— pilar`, etc. | KEEP (Caveat font, brand-aligned hand-written kicker — bukan em dash dalam copy, ini decoration) | NO CHANGE |

**Method**: grep `—` di `apps/web/src/**/*.{ts,tsx}` exclude `__tests__/`. Per match, decide:
- ✅ HAPUS kalau di: hero subtitle, page header, CTA copy, button label, kicker text dalam quotes
- ✅ KEEP kalau di: kicker prefix `<span>— {kicker}</span>` pattern (Caveat font hand-written), atau di body content yang quoted dari UGC

### B. Em dash di seed UGC (KEEP — natural di tulisan informal)

Seed di `supabase/seed.sql` dan `supabase/demo_seed.sql` punya em dash di body thread, karya, janji description. Ini natural Indonesian writing — KEEP semua. Contoh yang harus tetap:

- Thread body: `"tergantung kader RT — kalau kadernya semangat"` ✅ KEEP
- Karya title: `"Ngobrol sama Ibu PKL soal APBD — ternyata mereka..."` ✅ KEEP
- Komunitas card body dari thread: `"RTH di kota-kota besar masih jauh di bawah standar 30% — paling banter 9-10%"` ✅ KEEP

**Don't touch**: `supabase/seed.sql`, `supabase/demo_seed.sql`, `scripts/seed-*.ts` apapun yang generate UGC mock.

### C. Dev meta "Sprint 4" labels exposed di user-facing copy (HARUS hapus)

| File | Current | Replace dengan |
|---|---|---|
| `apps/web/src/app/karya/page.tsx` (Top kreator sidebar footer) | `"Aggregat akurat (karya count per author) Sprint 4."` | DELETE line. Sprint 4 task add accurate aggregate, sampai itu hide footnote. |
| `apps/web/src/app/tagih/page.tsx` (partai bars sidebar footer) | `"Detail page partai Sprint 4 (data agregat akurat menyusul)."` | DELETE line. |
| `apps/web/src/app/tagih/page.tsx` (peta footer) | `"Peta interaktif (tap-province → drilldown) Sprint 4."` | DELETE line. |
| `apps/web/src/app/tagih/[id]/page.tsx` (Pejabat card footer) | `"Profil pejabat lengkap (semua janji + riwayat) Sprint 4."` | DELETE line. |
| `apps/web/src/app/tagih/[id]/page.tsx` (Status card footer) | `"Riwayat perubahan status (timeline lengkap) Sprint 4."` | DELETE line. |
| `apps/web/src/app/tagih/[id]/page.tsx` (Bukti empty state) | `"Belum ada bukti. Warga bisa kirim bukti via fitur Lapor Sprint 4."` | Replace: `"Belum ada bukti yang masuk. Nanti kalau ada, akan tampil di sini."` |

**Method**: grep `Sprint 4` + `Sprint 5` di `apps/web/src/app/**/*.{ts,tsx}` exclude `__tests__/`. Hapus semua occurrence di JSX/copy. Comment `// TODO(sprint-4): ...` di code OK, tapi STRING di JSX HARUS hilang.

### D. Quote nesting di JanjiDetail title (HARUS fix)

**File**: `apps/web/src/app/tagih/[id]/page.tsx`

**Current rendering**: `""Kami akan turunkan harga BBM 30% dalam 100 hari pertama.""` — typographic curly quote `"..."` nested inside ASCII straight quote `"..."`.

**Root cause**: Kemungkinan template wrapper `"${claim}"` padahal seed `claim` field di DB sudah include curly quotes (`"..."`).

**Fix**: Inspect template di JSX. Pilih satu approach:
- (a) Strip wrapping quotes di seed data + template tetap pakai `"${claim}"`
- (b) Template render `{claim}` raw tanpa wrap — assume seed sudah include quotes

Recommend (b) — seed data sudah curated dengan quote, biarkan render apa adanya.

### E. Manifest + icons 404

**Confirmed via `curl http://localhost:3000/manifest.json` returns 404 page**

**Files referenced di `apps/web/src/app/layout.tsx`** (atau `metadata` export):
- `/manifest.json`
- `/icons/favicon-32.png`
- `/icons/icon-192.png`

**Source**: `apps/legacy/public/manifest.json` + `apps/legacy/public/icons/*` sudah ada (Phase 1 PWA setup).

**Fix**: Copy file dari `apps/legacy/public/` ke `apps/web/public/` matching path:
```
apps/legacy/public/manifest.json → apps/web/public/manifest.json
apps/legacy/public/icons/*.png   → apps/web/public/icons/*.png
```

**Verify**: `apps/legacy/public/manifest.json` brand naming masih relevant (Jubir Warga, bukan dev placeholder). Update name field kalau perlu. Pastikan `start_url` + `scope` + `theme_color` match Phase 2 design system (theme: `#1A2256` jw-blue, background: `#FFFAEE` jw-cream).

### F. `/main` nav link missing

**File**: `apps/web/src/components/site-header.tsx`

**Current nav**: 5 surface — Komunitas, Karya, Kelas, Janji, Aksi.

**Fix**: Tambah `<Link href="/main">Main</Link>` setelah Aksi. Total 6 surface.

**Visual**: Match existing Link pattern (`text-jw-ink hover:text-jw-coral transition`). Order: Komunitas, Karya, Kelas, Janji, Aksi, **Main**.

---

## File yang diubah

```
apps/web/src/app/page.tsx                   Beranda — em dash hero subtitle fix
apps/web/src/app/aksi/page.tsx              Aksi — em dash subtitle fix
apps/web/src/app/karya/page.tsx             Karya — hapus dev meta "Sprint 4"
apps/web/src/app/tagih/page.tsx             Tagih — hapus 2 dev meta "Sprint 4"
apps/web/src/app/tagih/[id]/page.tsx        JanjiDetail — hapus 3 dev meta + fix quote nesting
apps/web/src/components/site-header.tsx     Tambah /main nav link (6th surface)
apps/web/src/app/layout.tsx                 (optional) verify manifest/icons reference path
apps/web/public/manifest.json               BARU — copy dari apps/legacy/public/
apps/web/public/icons/*.png                 BARU — copy dari apps/legacy/public/icons/
```

## File yang TIDAK diubah (out of scope)

- ❌ `supabase/seed.sql` + `supabase/demo_seed.sql` — UGC body em dash KEEP
- ❌ `apps/web/src/components/beranda/*` Caveat kicker prefix `— {kicker}` KEEP
- ❌ Test files `__tests__/*` — kecuali snapshot break karena copy change
- ❌ Karya body content empty (defer to BACKLOG seed task)

---

## Step-by-step

### 1. Em dash sweep — curated copy

**Search**:
```bash
grep -rn '—' apps/web/src/app apps/web/src/components \
  --include='*.tsx' --include='*.ts' \
  | grep -v '__tests__' \
  | grep -v 'span.*font-hand'  # exclude kicker pattern
```

**Per match, decide hapus/keep berdasar tabel section A**. 

**Beranda hero subtitle** (`apps/web/src/app/page.tsx`):
```diff
- Hak berekspresi yang dijamin konstitusi — tapi seberapa jauh sudah dipraktikkan?
+ Hak berekspresi yang dijamin konstitusi. Tapi seberapa jauh sudah dipraktikkan?
```

**Aksi subtitle** (`apps/web/src/app/aksi/page.tsx`):
```diff
- Bukan cuma ngomong — kita kerjain.
+ Bukan cuma ngomong, kita kerjain.
```

**Other matches** — apply same logic per tabel A.

### 2. Dev meta "Sprint 4" cleanup

**Search**:
```bash
grep -rn 'Sprint 4\|Sprint 5' apps/web/src/app apps/web/src/components \
  --include='*.tsx' --include='*.ts' \
  | grep -v '__tests__' \
  | grep -v '// '  # exclude code comments
```

**Karya page** — find dan hapus footer `<p>` dengan "Aggregat akurat (karya count per author) Sprint 4."

**Tagih page** — find dan hapus 2 footer line:
- "Detail page partai Sprint 4 (data agregat akurat menyusul)."
- "Peta interaktif (tap-province → drilldown) Sprint 4."

**JanjiDetail page** — find dan hapus 2 footer line + 1 replacement:
- DELETE: "Profil pejabat lengkap (semua janji + riwayat) Sprint 4."
- DELETE: "Riwayat perubahan status (timeline lengkap) Sprint 4."
- REPLACE: "Belum ada bukti. Warga bisa kirim bukti via fitur Lapor Sprint 4." → "Belum ada bukti yang masuk. Nanti kalau ada, akan tampil di sini."

### 3. Quote nesting fix di JanjiDetail

**File**: `apps/web/src/app/tagih/[id]/page.tsx`

**Inspect**: Cari pattern di JSX yang render `claim`. Kalau template = `"{`"`}{claim}{`"`}"` atau `"${`"`}${claim}${`"`}"`, ada double wrap.

**Fix approach**:
```diff
- <h1>"{janji.claim}"</h1>
+ <h1>{janji.claim}</h1>
```

Karena seed `claim` udah `"..."` curly quoted. Kalau ada janji di seed yang gak include quote, fallback strip+wrap di helper.

**Verify**: Reload `/tagih/22222222-0001-0000-0000-000000000001`, title harus `"Kami akan turunkan harga BBM 30% dalam 100 hari pertama."` (single curly quote, no nesting).

### 4. Port manifest + icons

**Sandbox bash** (atau PowerShell di laptop):
```bash
# Verify source exists
ls apps/legacy/public/manifest.json apps/legacy/public/icons/

# Create destination
mkdir -p apps/web/public/icons

# Copy
cp apps/legacy/public/manifest.json apps/web/public/
cp apps/legacy/public/icons/*.png apps/web/public/icons/
```

**Inspect & update manifest.json**:
- `name`: "Jubir Warga"
- `short_name`: "Jubir Warga"
- `description`: align dengan Phase 2 positioning ("Suara warga, rumahnya di sini.")
- `theme_color`: `#1A2256`
- `background_color`: `#FFFAEE`
- `start_url`: `/`
- `display`: `standalone`
- `icons`: array dengan path yang valid (favicon-32.png, icon-192.png, icon-512.png)

**Verify**: `curl http://localhost:3000/manifest.json` return 200 + JSON valid. `curl http://localhost:3000/icons/icon-192.png` return 200.

### 5. /main nav link

**File**: `apps/web/src/components/site-header.tsx`

**Diff**:
```diff
  <Link href="/aksi" className="text-jw-ink hover:text-jw-coral transition">
    Aksi
  </Link>
+ <Link href="/main" className="text-jw-ink hover:text-jw-coral transition">
+   Main
+ </Link>
</nav>
```

**Verify**: Reload `/`, nav header tampil 6 surface dengan order Komunitas → Karya → Kelas → Janji → Aksi → Main. Click "Main" → navigate ke `/main`.

### 6. Smoke test

Setelah 5 step di atas:
1. `pnpm --filter @jw/web typecheck` — wajib pass
2. `pnpm --filter @jw/web lint` — 0 new warning
3. `pnpm --filter @jw/web test` — 195/195 pass (no test break)
4. `pnpm --filter @jw/web dev` — manual click-through:
   - `/` (em dash gone di subtitle)
   - `/karya` (no "Sprint 4" footer di sidebar)
   - `/tagih` (no "Sprint 4" footer di partai bars + map)
   - `/tagih/[any-id]` (no double quote, no 3 "Sprint 4" footers)
   - `/main` accessible via header nav
   - DevTools Network tab: `/manifest.json` 200, `/icons/icon-192.png` 200

---

## Acceptance checklist

- [ ] Em dash 0 occurrence di curated copy (hero subtitle, page subtitle, dev-controlled JSX text)
- [ ] Em dash MASIH ADA di seed UGC (verify thread body, karya title yang quoted) — keep
- [ ] "Sprint 4" / "Sprint 5" string 0 occurrence di JSX rendering (apps/web/src/app/**)
- [ ] JanjiDetail title render single-quoted (no `""..."""` nesting) — verify via Chrome inspector
- [ ] `apps/web/public/manifest.json` exists, return 200 di Network tab
- [ ] `apps/web/public/icons/favicon-32.png` + `icon-192.png` exist, return 200
- [ ] manifest.json content: name="Jubir Warga", theme_color=#1A2256, bg=#FFFAEE
- [ ] Header nav 6 surface: Komunitas, Karya, Kelas, Janji, Aksi, Main
- [ ] Click "Main" di nav → navigate ke `/main` → render game page
- [ ] `pnpm typecheck` 0 error
- [ ] `pnpm lint` 0 new warning
- [ ] `pnpm test` 195/195 pass

## Out of scope (defer)

- ❌ Karya body content seed (placeholder "Tulisan belum tersedia...") — BACKLOG: pre-launch seed 5-10 long-form artikel real
- ❌ Tier 1 BLOCKER ops setup (Sentry/UptimeRobot/Plausible/error boundary) — Spec terpisah (#17 atau #18)
- ❌ Em dash di body UGC seed — KEEP, natural Indonesian writing
- ❌ Caveat font kicker prefix `— {kicker}` — KEEP, brand decoration bukan copy
- ❌ Pending Decision #1-#4 dari context.md (chip exposure Nala, citation URL audit, Windows OOM) — separate decisions
- ❌ 8 mock response Nala tambahan (per Spec #15 original) — Spec #15 sendiri

## Notes untuk planner audit

Aku akan audit:
- Em dash count di curated copy = 0 (grep verification)
- Em dash count di seed UGC > 0 (sanity check tetap ada)
- "Sprint 4"/"Sprint 5" count di JSX rendering = 0
- Quote nesting JanjiDetail visual via Chrome screenshot
- manifest.json 200 + content valid
- Nav header tampil 6 surface
- Test suite tetap 195/195 (no break)

## Commit message

```
fix(web): tier A cleanup audit findings — em dash, dev meta, quote nesting, manifest, nav

Audit visual smoke test 2026-05-04 surface 6 issues. Tier A cleanup fix:

- Em dash sweep di curated copy (hero subtitle, page subtitle) — keep di body UGC
- Hapus 6 dev meta "Sprint 4" labels exposed di user-facing copy
  (Karya footer, Tagih partai/map footer, JanjiDetail pejabat/status/bukti)
- Fix quote nesting JanjiDetail title (template double-wrap → render raw)
- Port manifest.json + icons dari apps/legacy/public ke apps/web/public
- Tambah /main link ke nav header (6th surface: Komunitas/Karya/Kelas/Janji/Aksi/Main)

Per Spec #16. Decisions Mas approved 2026-05-04 (em dash selective, dev meta hapus,
quote fix, manifest port, /main nav add).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

## WAJIB INCLUDE spec file

```bash
git add apps/web/src/app/page.tsx \
        apps/web/src/app/aksi/page.tsx \
        apps/web/src/app/karya/page.tsx \
        apps/web/src/app/tagih/page.tsx \
        apps/web/src/app/tagih/\[id\]/page.tsx \
        apps/web/src/components/site-header.tsx \
        apps/web/public/manifest.json \
        apps/web/public/icons/ \
        specs/SPRINT-3/16-tier-a-cleanup.md
```

## Coordinate paralel

**Strict file ownership** — kalau ada Window 2 bekerja parallel di `nala/` atau `lib/main/`:
- ❌ JANGAN sentuh `apps/web/src/components/nala/*`
- ❌ JANGAN sentuh `apps/web/src/lib/nala/*`
- ❌ JANGAN sentuh `apps/web/src/lib/main/*`

✅ Aman scope: `app/` route files (page.tsx) + `components/site-header.tsx` + `public/`

Pull dulu sebelum push, rebase clean kalau Window 2 punya commit baru.

---

## Update STATUS.md

Setelah commit, update `specs/SPRINT-3/STATUS.md`:
- Add row Spec #16 status DONE dengan commit hash
- Note: audit findings 2026-05-04 → cleanup landed

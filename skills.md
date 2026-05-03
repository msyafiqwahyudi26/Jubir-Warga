# skills.md — Playbook task umum

Resep untuk task yang sering muncul. Kalau ada langkah yang ke-discover & berhasil, append di sini biar besok-besok tinggal ikuti.

---

## Git: push aman di Windows (workaround OOM)

Recurring issue di Windows — `git push` fail dengan out-of-memory.

```bash
cd "C:\Users\Asus\Downloads\Prototipe Jubir Warga"
git config --local pack.windowMemory 256m
git config --local pack.packSizeLimit 256m
git config --local pack.threads 1
git add -A
git commit -m "<conventional commit>"
git push
```

Config `--local` cukup sekali per clone — persisted di `.git/config`. Worth investigate root cause sebagai BACKLOG item (lihat `memory.md` "Recurring quirks").

## Git: verify state sebelum pindah device

```bash
git status                       # harus "nothing to commit, working tree clean"
git log @{u}..HEAD --oneline     # harus output kosong (semua udah pushed)
git branch --show-current        # branch yang aktif
```

Kalau ada uncommitted changes penting (bukan node_modules / .next):
```bash
git add -A
git commit -m "wip: checkpoint sebelum pindah device"
git push
```

## Sync di device baru / fresh clone

```bash
git clone https://github.com/msyafiqwahyudi26/Jubir-Warga.git
cd Jubir-Warga
pnpm install
cp .env.example .env.local       # isi sesuai prompt di file
```

Lalu baca urutan: `CLAUDE.md` → `memory.md` → `context.md` → `handover.md`.

## Quality gates sebelum commit

```bash
pnpm --filter @jw/web typecheck     # WAJIB pass (0 error)
pnpm --filter @jw/web lint          # warning OK, error harus fix
pnpm --filter @jw/web test          # full suite harus pass
```

Kalau salah satu fail: jangan commit, fix dulu. Kalau ambigu mana yang fail karena flake vs real issue: re-run sekali. Kalau fail consistent → real issue.

## Tambah mock response Nala baru

1. Edit `apps/web/src/lib/nala/mock-responses.ts`
2. Append entry ke array `MOCK_RESPONSES` dengan struktur:
   - `keywords: string[]` — minimal 3 keyword unik, lowercase
   - `response: string` — 3-5 paragraf, brand voice (kamu/aku, no "civic"), markdown OK (list + bold key term)
   - `sources: { title, url }[]` — minimum 2, dari NGO allowlist (ICJR, ICW, FITRA, LBH Jakarta, Perludem, Kode Inisiatif) atau media nasional (Tempo, Kompas)
3. Tambah test case di `apps/web/src/__tests__/lib-nala-mock-responses.test.ts`:
   - Keyword match positive
   - Brand voice guard (no "Anda", no "Saya", no "civic")
4. Run `pnpm --filter @jw/web test` → commit → push

**Catatan**: chip visible di `nala-prompt-chips.tsx` di-cap `.slice(0, 4)` — topic baru belum auto-jadi chip kecuali reorder atau naikin limit (lihat `context.md` "Pending decision #1").

## Bikin spec baru

1. Folder: `specs/SPRINT-<N>/<NN>-<feature-slug>.md` (numbering increment, `NN` 2-digit)
2. Sections wajib:
   - **Context** (kenapa)
   - **Acceptance criteria** (apa yang harus terbukti — checklist verifiable)
   - **Out of scope** (apa yang TIDAK dikerjain — anti-creep)
   - **Implementation outline** (file path + change scope)
   - **Risk & mitigation**
3. Update `specs/SPRINT-<N>/STATUS.md` (canonical sprint status)
4. Saat selesai: tandai checklist + commit dengan scope `feat(<area>):` atau `chore(<area>):`

## Handle BACKLOG item

Format entry di BACKLOG (root atau `apps/web/BACKLOG.md`):

```
- [<priority>] <judul>
  - Why: <konteks singkat>
  - Spec ref: <link spec atau none>
  - Status: TODO / IN PROGRESS / DONE <tanggal>
  - Catatan: <limitation, follow-up, dll>
```

Saat done: **jangan delete** — mark `✅ DONE <tanggal>` dengan catatan limitation/follow-up. Sejarah keputusan penting buat audit.

## Tambah migration Supabase

1. File baru: `supabase/migrations/<NNNN>_<deskripsi>.sql` (number increment, jangan reuse)
2. Wajib include: `ENABLE ROW LEVEL SECURITY` + minimal 1 policy untuk read
3. Insert/update policy pattern: `auth.uid() = <owner_column>`
4. Admin-only check: `EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)`
5. Test apply di local dulu — JANGAN run di production project tanpa Mas konfirmasi
6. **Migration `0001_*.sql` immutable** — jangan edit setelah apply

## Cross-check brand sebelum copy publik

1. Baca `apps/legacy/docs/Landing_Page_Beta_Copy.md` — source of truth copy
2. Baca `apps/legacy/docs/Prompt_Claude_Design_Jubir_Warga_v2.md` — design system
3. Cek vocabulary list di `CLAUDE.md` §4.2-4.3
4. Kalau bertentangan: **design doc menang untuk Phase 2**

## Investigate / debug pattern

1. **Reproduce** — minimal repro case dulu sebelum analyze
2. **Read** — baca code path lengkap, jangan tebak. Pakai sub-agent `Explore` kalau butuh scan luas.
3. **Hypothesis** — tulis hipotesis sebelum ngetik solusi
4. **Verify** — typecheck + test + manual smoke di `localhost:3000`
5. **Document** — kalau quirk recurring, append ke `memory.md` "Recurring quirks"

## End-of-session ritual (sebelum tutup laptop / pindah device)

1. Commit + push semua WIP (pakai workaround Windows OOM kalau perlu)
2. Update `context.md` "Recent conversation summary" — 2-4 bullet what happened
3. Update `handover.md` — last commit, WIP, next step, open question
4. Commit + push lagi (file `.md` ini)
5. Verify clean: `git status` + `git log @{u}..HEAD --oneline` (output kosong)

---

_Last updated: 2026-05-03_
_Append resep baru di sini saat discover sesuatu yang berulang._

# HANDOVER — Continuity Document

> **Untuk Mas (owner):** Paste isi file ini sebagai pesan PERTAMA di chat Cowork baru saat pindah device (e.g., dari komputer kantor ke laptop di rumah). Planner Claude akan onboard dengan konteks penuh.
>
> Last updated: 2026-05-03 (post Sprint 3 Spec #13 Main games DONE — commit `72ce58c`, 9/10 Sprint 3 closed, tinggal #15 Polish)

---

## ⚡ Quick resume cheat sheet (added 2026-05-03)

Mas mau pindah ke laptop. Setup memory file system baru di repo root supaya continuity makin seamless:

| File | Isi |
|---|---|
| `CLAUDE.md` | Operating manual lengkap (existing, source of truth untuk konvensi & brand) |
| `memory.md` | 🆕 Persistent context — owner, locked decisions, recurring quirks, brand voice digest |
| `agents.md` | 🆕 Routing guide — kapan pakai Claude Code vs Cowork vs sub-agent |
| `context.md` | 🆕 Current state — recently completed, pending decisions, conversation summary |
| `skills.md` | 🆕 Playbook — git push Windows OOM workaround, quality gates, end-of-session ritual |
| `handover.md` | File ini — comprehensive Sprint status & dual-agent workflow |

**Urutan baca saat resume di laptop**: `CLAUDE.md` → `memory.md` → `context.md` → `handover.md` (file ini, untuk Sprint detail).

**Last commit pushed**: `72ce58c` (Spec #13 Main games — Tebak Kata + Tebak Pejabat. Fast-forward dari `383a82d`, no conflict dengan Window 2). Verify dengan `git log --oneline -5`.

---

## Identitas planner

Aku adalah Claude dalam role **planner & auditor** untuk project **Jubir Warga**. Owner: Mas (`admin@spdindonesia.org`), SPD Indonesia. Mas eksekusi via **Claude Code di laptop**, aku review + plan.

**Pembagian kerja:**
- Aku → spec tertulis, schema design, security audit, decision support
- Claude Code di laptop → eksekusi kode (read repo files, write code, run tests, deploy)
- Mas → orchestrator: paste spec dari aku ke Claude Code, paste hasil Claude Code ke aku untuk audit

---

## Project context (1 paragraf)

**Jubir Warga** adalah platform komunitas anak muda Indonesia (17–39 tahun) untuk diskusi, karya, kelas, petisi, laporan warga, dan pemantauan janji pejabat. Owner: SPD Indonesia (Sindikasi Pemilu & Demokrasi). Sedang dalam beta, target launch publik **Juni 2026**. Repo monorepo dengan 2 phase:
- **Phase 1**: Vanilla React + CDN, sudah live di `https://jubir.spdindonesia.org` (apps/legacy/)
- **Phase 2**: Next.js 15 + Supabase + Tailwind v4, in development (apps/web/)

Pasca-PT independen 2026, Jubir Warga otonom; SPD jadi partner. Brand domain target: `jubirwarga.id`.

---

## Repo structure (snapshot)

```
D:\Website-Jubir Warga\
├── CLAUDE.md                     ← Operating manual untuk Claude Code (WAJIB baca dulu)
├── HANDOVER.md                   ← File ini (continuity doc)
├── README.md                     ← Monorepo overview
├── pnpm-workspace.yaml
├── package.json
├── apps/
│   ├── legacy/                   ← Phase 1 vanilla — DON'T TOUCH
│   │   └── docs/                 ← Required reading: RENCANA_1_BULAN.md, Landing_Page_Beta_Copy.md, Prompt_Claude_Design_Jubir_Warga_v2.md
│   └── web/                      ← Phase 2 Next.js (fokus pengembangan)
├── packages/
│   └── data/                     ← @jw/data (data layer, type-safe)
├── supabase/
│   ├── migrations/
│   │   ├── 0001_init.sql         ← Applied
│   │   ├── 0002_demo_mode.sql    ← Applied
│   │   └── 0003_fix_handle_new_user.sql  ← Applied (patch trigger bug)
│   └── seed.sql                  ← Reference data (14 pejabat real, 14 janji, etc)
├── scripts/                      ← Demo seed generator (Sprint 2 Spec #2)
├── deploy/                       ← VPS provisioning, nginx, monitoring
└── specs/SPRINT-2/               ← Active specs untuk sprint berjalan
```

---

## Status sekarang (2026-05-01)

**Sprint 1 (DONE):** Phase 2 Next.js init, Supabase wired, auth (4 provider: email/password/magic-link/Google/WA OTP), Beranda live data.

**Sprint 2 (DONE — closed 2026-05-01):**

| Spec | Status |
|---|---|
| #1 — Schema migration `is_demo` flag | ✅ DONE |
| #2 — Demo seed generator (300 user fictional) | ✅ DONE |
| #2.5 — Lorem fix (Indonesian sentence bank) | ✅ DONE (kantor) |
| #3 — Landing page + preview gate | ✅ DONE (kantor) |
| #4 — Design heritage port (Nala + logo + illustrations) | ✅ DONE (kantor, commit d0a3db6) |
| #5 — Nala AI global slide-over panel | ✅ DONE (laptop 2026-05-01, commit 386abf7) |

**Sprint 3 (in progress — started 2026-05-01):**

Plan ada di `specs/SPRINT-3/00-overview.md`. 10 spec total (#6-#15), BACKLOG-driven + page port continuation.

| Spec | Status |
|---|---|
| #6 — Supabase typegen untuk views | ✅ DONE 2026-05-01, commit `dff5a80` (root cause: dep drift, fix via ssr 0.5→0.10 bump + tilde pin) |
| #6.5 — Test Foundation (Vitest + RTL + 8 tests + CI gate) | ✅ DONE 2026-05-01, commit `94ce4d0` (23 test pass, baseline cov 32%/35%, CI green 40s) |
| #7 — Komunitas page (Index + ThreadDetail) | ✅ DONE 2026-05-01, commit `60c9597` (15 file baru, 16 test baru, 39 total pass, smoke test live OK) |
| #8 — Karya page (Index + ReadingView) | ✅ DONE 2026-05-01, commit `9019720` (12 file baru, 19 test baru, 58 total pass) |
| #9 — Kelas page (Index + Detail + LessonPlayer MVP) | ✅ DONE 2026-05-01, commit `3e16238` (14 file baru, 20 test baru, 78 total pass, civic→fixed) |
| #10 — Aksi page (Index + PetisiDetail + PollingDetail) | ✅ DONE 2026-05-01, commit `76a5784` (16 file baru, 18 test baru, 96 total pass, idempotency via PG unique-violation 23505) |
| #11 — Tagih page (Index + JanjiDetail + Submit) | ✅ DONE 2026-05-01, commit `ec347ab` (19 file baru, 24 test baru, 120 total pass) |
| #12 — Profil + KTP Warga (PasporPublic) | ✅ DONE 2026-05-01, commit `6db285b` (16 file baru, 35 test baru, 155 total pass, privacy by design — public visa filter action-privat) |
| #X1 — Custom SVG icon + emoji foundation (Tier 2 prep) | ✅ DONE 2026-05-01, commit `b4b7656` (12 file baru, 18 test, brand-palette guard test) |
| #X2 — Mock responses Nala 8 baru | ✅ DONE 2026-05-01, commit `383a82d` (8 mock — DPR/DPD, KUHP, BPJS, polisi, MK, APBD, pungli, pilkada — total 11 rule. 10 test baru, 142→165 pass. Citation per allowlist. Limitation: chip cap `.slice(0,4)` di `nala-prompt-chips.tsx:17` — 4 topic baru belum visible sebagai chip, di-BACKLOG) |
| #13 — Main games (Tebak Kata + Tebak Pejabat) | ✅ DONE 2026-05-03, commit `72ce58c` (12 impl + 4 test = 16 file. `lib/main/`: constants/word-of-day/pejabat-of-day/streak. `app/main/`: actions, page, tebak-kata + tebak-pejabat (Server + Client + leaderboard). 4 test baru: word-of-day, pejabat-of-day, streak, tebak-kata-game. Total test 155→195 pass. Strict ownership respected — Nala territory untouched. Smoke test SKIPPED — `pnpm dev` memory pressure, rest on typecheck+test. Acceptance 18/22 verified via test, 4 perlu manual browser. Header nav `/main` link out-of-scope, Mas follow-up commit needed.) |
| #14 — Brand consistency cleanup PPTX/DOCX | 📋 Listed |
| #15 — Polish + audit | 📋 Listed |

**Database state Supabase (project `ifrautpvbhdbhieystxk`):**

- 300 fake user profiles (is_demo=true, email @jubirwarga-demo.local)
- 225 demo threads, 564 replies, 1,305 votes
- 525 petisi signatures (ter-distribusi ke 4 petisi real)
- 312 janji follows (ke 14 janji real)
- 37 demo karya, 11 laporan, 150 polling votes, 69 kelas enrollment
- Trigger `handle_new_user` sudah di-patch (badges column tidak ada)
- Petisi flagship "Akses Internet Gratis Sekolah Negeri": 31,990 / 50,000 signatures (64%)

---

## Yang Mas perlu lakukan setelah pindah device

1. Pull repo: `git pull origin main`
2. Restore `.env.local` ke root repo (dari backup USB / 7zip)
3. `pnpm install`
4. `pnpm dev` → http://localhost:3000 → cek Beranda render dengan demo data
5. Open Cowork desktop app, **start chat BARU**
6. Paste isi HANDOVER.md ini sebagai opening message
7. Aku (di chat baru) onboard, kasih starter prompt Spec #4 untuk Claude Code

---

## Arsitektur singkat (untuk konteks aku)

- **Tech stack**: Next.js 15 App Router, TypeScript strict, Tailwind v4 `@theme`, TanStack Query, Zustand, Zod, Supabase 2.46, lucide-react 0.460
- **Brand voice**: AI bernama **Nala** (BUKAN Jubir, walaupun design doc lama menyebut Jubir). 5 ekspresi: curious, excited, mentor, thinking, confident
- **Color tokens**: 11 warna ketat — jw-blue, jw-cream, jw-blue-soft, jw-ink, jw-muted, jw-line, jw-coral, jw-marigold, jw-mint, jw-red, jw-grey
- **Typography**: Vollkorn (display), Inter (UI), Caveat (anotasi tangan), Fira Code (data/angka). Logo BUKAN font Caveat — wajib SVG hand-drawn
- **Vocabulary do**: kamu, ngumpul, nimbrung, curhat, uneg-uneg, resah
- **Vocabulary don't**: "civic" sebagai positioning, "warga negara yang kritis", emoji sebagai dekorasi UI, kotak warna placeholder
- **Demo mode**: semua data fiktif punya `is_demo=true`, akan di-cleanup pre-launch via `cleanup_demo_data()` function

---

## Decisions yang sudah diputuskan

| Topik | Decision |
|---|---|
| Naming AI | **Nala** (mempertahankan implementasi Phase 1) |
| Phase 1 fate saat Phase 2 launch | **Coexist** — Phase 1 tetap live, Phase 2 di subdomain |
| Monorepo tool | **pnpm workspaces** |
| Auth providers Sprint 1 | Email/password + Magic Link + Google OAuth + WhatsApp OTP — semua aktif |
| Page port order Sprint 2-3 | Komunitas → Karya → Kelas → Aksi → Tagih → Janji → Main |
| Preview password | `JubirWargaSuperApp2026` |
| Coming Soon launch date | Juni 2026 |
| Demo banner strategy | Visible 3-tier (banner + tag + env flag) — bisa dipakai sebagai campaign |
| Skala demo data | 300 user fiktif (selesai diproduksi) |
| Domain canonical | `jubir.spdindonesia.org` sekarang, `jubirwarga.id` saat rilis (env-driven) |
| WhatsApp komunitas link | Belum dibuat (placeholder `#`) |
| Newsletter | Substack (sementara `#`) |

---

## Decisions yang masih open

**Sprint 3 Spec #7 Komunitas (BLOCKING — perlu jawaban Mas sebelum Spec #7 bisa ditulis):**

1. **Server vs Client Component split di Komunitas?**
   - Vote arrow + sub-komunitas filter butuh interactivity
   - Rekomendasi planner: **Server Component (data fetch via @jw/data direct query helpers) + nested Client Components untuk vote/filter/reply submit**
2. **Vote auth requirement?**
   - Login required atau anonymous-allowed (1 vote per IP via cookie)?
   - Rekomendasi planner: **Login required** (anti-spam, leverage existing auth)
3. **Sub-komunitas data source (Politik Lokal, Mental Health Kantor, dll)?**
   - Hard-code constant atau pull dari DB table baru?
   - Rekomendasi planner: **Hard-code constant Sprint 3, migrate ke DB di Sprint 5**

**Sprint 3 Spec #13 Game #2 di Main:**

4. Saran planner: **Tebak Pejabat** (foto + clue, leverage 14 pejabat real seed). Alternatif: Janji Trivia, Pasal Match.

**Operasional (carry-over dari sebelumnya):**

5. **Domain final saat launch**: `jubirwarga.id` (kalau dibeli sebelum Juni) atau ikut investor preference? Belum ditentukan.
6. **Twilio Verify untuk WhatsApp OTP**: Mas belum setup. Code sudah jalan, tapi flow WA OTP akan error sampai Twilio configured.
7. **Google OAuth client**: belum setup di Google Cloud Console. Code jalan, tapi tombol Google OAuth akan error sampai client_id ditambahkan ke Supabase.

**Sprint 4-5 scope (per evaluation report 2026-05-01):**

8. **Onboarding wizard** (BLOCKING beta retention) — wizard 3-5 step pertama login. Lihat `docs/EVALUATION_PHASE1_VS_PHASE2_2026-05-01.md` Section F.
9. **Notification system minimum** (BLOCKING beta engagement) — bell + drawer + per-event triggers. DB table baru.
10. **Lapor Warga page** — `/lapor`, butuh form + camera + geolocation. Sprint 4.
11. **Profile public page + Follow system** — `/profil/[username]`. Sprint 4.
12. **Search global** — Postgres ts_vector. Sprint 4.

---

## Reference info (operational)

| Resource | Value |
|---|---|
| Supabase project ref | `ifrautpvbhdbhieystxk` |
| Supabase URL | `https://ifrautpvbhdbhieystxk.supabase.co` |
| Supabase region | `ap-southeast-1` (Singapore) |
| Phase 1 production | `https://jubir.spdindonesia.org` |
| Phase 2 staging | TBD (Sprint 3) |
| Brand domain target | `jubirwarga.id` |
| VPS IP | `76.13.196.172` (Hostinger) |
| GitHub repo | `https://github.com/msyafiqwahyudi26/Jubir-Warga` |
| Owner | SPD Indonesia (`admin@spdindonesia.org`) |
| IG | `@jubirwarga.id` |
| Email | `info@jubirwarga.id`, `partnerships@`, `press@` |

---

## Required reading dari planner sebelum bantu Mas

Sebelum aku (planner) mulai bantu di chat baru, aku akan baca **WAJIB**:
1. `CLAUDE.md` — operating manual
2. `memory.md` — persistent context (owner, locked decisions, recurring quirks)
3. `context.md` — current state + recent conversation summary
4. `handover.md` — file ini (Sprint status detail, dual-agent workflow)
5. `agents.md` — surface & sub-agent routing guide
6. `skills.md` — playbook task umum
7. `BACKLOG.md` — backlog item dengan timing eksplisit (Sprint 3/4/5 priority)
8. `docs/AUDIT_PRE_BETA_2026-05-01.md` — pre-beta launch checklist & audit per dimensi (skor, gap, sequence)
9. `docs/EVALUATION_PHASE1_VS_PHASE2_2026-05-01.md` — side-by-side comparison Phase 1 vs Phase 2, gap analysis super web/app, list 28 fitur kritis untuk Sprint 4-5
10. `packages/data/README.md` — data layer API surface (queries + hooks udah lengkap, JANGAN re-build)
11. `apps/web/QUICKSTART.md` — setup runbook
12. `specs/SPRINT-3/*.md` — spec aktif (overview + spec individual)
13. `specs/SPRINT-2/STATUS.md` — apa yang sudah selesai
14. `apps/legacy/docs/Prompt_Claude_Design_Jubir_Warga_v2.md` — design system spec lengkap
15. `apps/legacy/docs/Landing_Page_Beta_Copy.md` — copy landing source-of-truth

Kalau aku belum baca, ingatkan aku.

---

## Pesan terakhir (continuity hint)

Saat Mas pindah ke laptop dan paste HANDOVER.md ini ke chat baru, kasih juga konteks tambahan apa yang Mas inget terjadi terakhir (mis. "lorem fix Claude Code selesai dengan hasil X" atau "ada bug Y yang belum di-resolve"). Aku akan cross-check dengan repo state via tools yang tersedia.

**Status per 2026-05-03**: Sprint 2 closed. Sprint 3 9/10 DONE (#6, #6.5, #7-#13, #X1, #X2 ✅). Yang tersisa di Sprint 3: **#15 Polish** (final audit + per laporan Mas: 8 more mock responses Nala — perlu klarifikasi apakah folded ke #15 atau jadi #X3 terpisah). #14 (brand cleanup PPTX/DOCX) status ambigu — tidak disebut di laporan terakhir, perlu cross-check apakah masih open atau sudah diserap ke #15.

**Follow-up commit kecil dari Mas** (out of #13 ownership): tambah `/main` link ke `site-header.tsx` nav (existing 5-surface: Komunitas/Karya/Kelas/Janji/Aksi) supaya games discoverable dari header.

**Smoke test gap**: 4 acceptance item Spec #13 (hero render, link visual, tile color, win/lose banner) belum ke-verify via browser karena `pnpm dev` memory pressure. Manual smoke 2-3 menit di laptop sufficient. Kalau Sprint 4 bawa Playwright/E2E infra, re-verify via headless test.

**4 pending decision** (juga di `context.md`):
1. Chip exposure strategy untuk 4 topic Nala baru — opsi A (rotasi) / B (kategorisasi tab) / C (expander) / D (free-text)
2. Citation URL audit owner + timeline pre-Juni 2026
3. Windows git OOM root cause — bikin BACKLOG item terpisah?
4. Mock responses Nala phase 2 (8 more): folded ke #15 Polish atau spec terpisah #X3?

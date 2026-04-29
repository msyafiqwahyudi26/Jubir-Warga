# HANDOVER — Continuity Document

> **Untuk Mas (owner):** Paste isi file ini sebagai pesan PERTAMA di chat Cowork baru saat pindah device (e.g., dari komputer kantor ke laptop di rumah). Planner Claude akan onboard dengan konteks penuh.
>
> Last updated: 2026-04-29

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

## Status sekarang (2026-04-29)

**Sprint 1 (DONE):** Phase 2 Next.js init, Supabase wired, auth (4 provider: email/password/magic-link/Google/WA OTP), Beranda live data.

**Sprint 2 (in progress):**

| Spec | Status |
|---|---|
| #1 — Schema migration `is_demo` flag | ✅ Applied to Supabase |
| #2 — Demo seed generator (300 user fictional) | ✅ Applied (data live) |
| #2.5 — Lorem fix (Indonesian sentence bank) | 🔧 In progress (Claude Code di kantor) |
| #3 — Landing page + preview gate | 📋 Spec written, not executed |
| #4 — Design heritage port (Nala + logo + illustrations) | 📋 Spec written, **NEXT** |
| #5 — Nala AI global slide-over panel | 📋 Spec written, after #4 |

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

1. **Lorem fix sebelum atau sesudah Spec #4?** Saat ini Claude Code lagi fix lorem-Latin di body thread/karya. Setelah selesai → next: Spec #4 (design heritage port).
2. **Domain final saat launch**: `jubirwarga.id` (kalau dibeli sebelum Juni) atau ikut investor preference? Belum ditentukan.
3. **Twilio Verify untuk WhatsApp OTP**: Mas belum setup. Code sudah jalan, tapi flow WA OTP akan error sampai Twilio configured.
4. **Google OAuth client**: belum setup di Google Cloud Console. Code jalan, tapi tombol Google OAuth akan error sampai client_id ditambahkan ke Supabase.

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

Sebelum aku (planner) mulai bantu di chat baru, aku akan baca:
1. `CLAUDE.md` — operating manual
2. `apps/legacy/docs/Prompt_Claude_Design_Jubir_Warga_v2.md` — design system spec lengkap
3. `apps/legacy/docs/Landing_Page_Beta_Copy.md` — copy landing source-of-truth
4. `specs/SPRINT-2/*.md` — spec aktif

Kalau aku belum baca, ingatkan aku.

---

## Pesan terakhir (continuity hint)

Saat Mas pindah ke laptop dan paste HANDOVER.md ini ke chat baru, kasih juga konteks tambahan apa yang Mas inget terjadi terakhir (mis. "lorem fix Claude Code selesai dengan hasil X" atau "ada bug Y yang belum di-resolve"). Aku akan cross-check dengan repo state via tools yang tersedia.

Lanjut Sprint 2 Spec #4 (Design heritage port) adalah next logical step. Aku akan kasih starter prompt setelah Mas confirm laptop ready + pnpm dev jalan.

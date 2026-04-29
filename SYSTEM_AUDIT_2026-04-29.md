# System Audit — Jubir Warga
**Tanggal:** 29 April 2026
**Konteks:** Beta v2 sudah live di https://jubir.spdindonesia.org/. CICD aktif. Sekarang langkah back to fundamentals: audit arsitektur untuk scale ke super-web + mobile app jangka panjang.

---

## TL;DR

**Status sekarang:** ✅ Berhasil sebagai prototype/MVP. ⚠️ TIDAK siap untuk scaling production atau native app.

**Skor by area:**

| Area | Skor | Catatan |
|---|---|---|
| MVP completeness | 9/10 | 27 page, fungsional, demo-able |
| Performance prod | 4/10 | React dev build, Babel di browser, Tailwind CDN — semua salah untuk production |
| Code organization | 5/10 | Multi-file OK, tapi banyak window pollution + bug recurring (THREADS clash) |
| Type safety | 1/10 | JS murni, no TypeScript, refactor = berisiko |
| Routing | 3/10 | State-based, no URL routing, no deep linking, no SEO |
| State management | 4/10 | JWStore prototype-grade, tidak siap async/server state |
| Testing | 0/10 | Tidak ada test sama sekali |
| Tooling | 2/10 | No package.json, no linter, no formatter, no build |
| Security | 4/10 | dangerouslySetInnerHTML risk, CSP missing, mock auth |
| Mobile readiness | 6/10 | PWA OK, tapi React Native butuh rebuild signifikan |
| Backend readiness | 1/10 | Mock data hardcoded, tidak ada API layer |
| **Overall: pitch beta** | **8/10** | Sangat baik untuk demo |
| **Overall: production scale** | **3/10** | Akan break saat 1000+ users / mobile launch |

**Rekomendasi singkat:** Pertahankan versi sekarang sebagai beta-1 demo. Mulai paralel **Phase 2 rebuild** dengan stack proper (Next.js + TypeScript + Supabase + Tailwind compiled + Vitest), TIDAK mengubah versi live sampai Phase 2 sudah feature-parity.

---

## 1. Audit Arsitektur Sekarang

### 1.1 Stack Aktual

```
Frontend  : React 18 (CDN, development build) + Babel Standalone (in-browser transpile)
Styling   : Tailwind CDN + custom CSS (src/styles/tokens.css + global.css)
State     : Custom JWStore (window-globals + localStorage) + React useState
Data      : Hardcoded mock JS files (window.JWData)
Routing   : React useState page setter (no URL-based)
Build     : Tidak ada — file mentah dilayan oleh nginx
Bundler   : Tidak ada
Package   : Tidak ada package.json
Auth      : Mock (UI saja, tidak validate apa pun)
PWA       : Manifest + service-worker.js basic
Deploy    : rsync ke /var/www/jubirwarga/ via GitHub Actions
SSL       : Let's Encrypt via Certbot
Monitoring: Tidak ada
Analytics : Tidak ada
Testing   : Tidak ada
Type check: Tidak ada
```

### 1.2 Yang Berfungsi Baik (Pertahankan Konsep)

✅ **Brand foundation** (`tokens.css`, `global.css`) — design token sudah jelas, bisa di-port ke any framework.

✅ **Mock data structure** (`src/data/`) — model relasi antar entity sudah dipikirkan (`byId`, `q.threadsByCategory`). Schema-nya ready untuk SQL migration.

✅ **Component pattern** — `Button`, `Pill`, `Avatar`, `ProgressBar` sebagai shared lib. Pola "satu komponen = satu purpose" jalan.

✅ **27 page lengkap dengan konten realistis** — saat migrate ke framework baru, semua copy/text/struktur tinggal di-port, tidak perlu mikir ulang dari kosong.

✅ **CICD pipeline** sudah jalan end-to-end. Akan tetap relevan di Phase 2.

✅ **VPS + nginx + SSL infrastructure** — solid, tidak perlu pindah hosting.

### 1.3 Yang Berisiko untuk Scale

❌ **React + Babel CDN = production performance disaster:**
- React `development.js` ~1.1 MB (production.min: 135 KB) → 8x lebih besar
- Babel Standalone ~3 MB + transpile time ~1-2 detik per page load
- Tailwind CDN ~3 MB (compiled JIT version: ~15 KB)
- Total payload first load: ~7-9 MB JS (production target: <500 KB)
- Mobile 3G di Indonesia: load time 8-15 detik (target: <3 detik)
- **Implikasi:** jika viral, server bandwidth meledak; user bounce sebelum lihat konten

❌ **Window pollution** (60+ globals: `PageBeranda, JWData, JWStore, Tentang, KelasDetail, ...`)
- Pernah kena kasus name collision: `THREADS` (Beranda vs Komunitas), `JANJI` (Aksi vs Tagih), `JWFormat` (lib vs data)
- Tiap component baru risiko collision lagi
- Refactor = manual scan semua file
- Tidak ada cara automated untuk track "siapa pakai siapa"

❌ **No URL routing:**
- `https://jubir.spdindonesia.org/petisi/audit-apbd` tidak jalan — semua state-based
- Tidak bisa share link langsung ke detail page
- Browser back button tidak jalan
- **SEO = 0** — semua page render via JS, Google bot lihat blank
- Tidak bisa indexable, tidak bisa search

❌ **No type safety:**
- `JWData.theards` (typo) → silent fail, baru ketahuan saat user klik
- Rename `userId → user_id` = harus manual cek 50+ tempat
- Refactor besar di masa depan = high-risk eksperiment

❌ **State management tidak ready async:**
- `JWStore.actions.sign(petisiId)` jalan instan (mock). Kalau real backend:
  - Loading state? Tidak ada
  - Error handling? Tidak ada
  - Retry on network fail? Tidak ada
  - Optimistic UI dengan rollback? Tidak ada
- Pas migrate ke Supabase, perlu rewrite hampir semua interaksi

❌ **Code organization mengarah ke kekacauan:**
- File `.bak` dan `.tmp` ke-commit (artifact dari sed/python edit dari sandbox)
- File backup `*.jsx.bak` masih ada di repo
- `AUDIT_*.md` dan `PROGRESS_*.md` (internal docs) ke-commit publik
- Naming inconsistent: `Index.jsx` di-export sebagai `PageBeranda` (sumber confusion)
- Pattern: `const C = window.C; const { Pill: BPill } = window` — verbose, error-prone

❌ **No tests:**
- Setiap perubahan = manual test browser
- Bug regresi tidak terdeteksi (THREADS collision butuh user kena baru ketahuan)
- Refactor = main API roulette

❌ **No package.json:**
- Dependency version implicit (Lucide @latest = bisa breaking change kapan saja)
- Tidak ada `npm install` reproducibility
- Tidak ada lockfile
- Susah collaborate dengan dev lain

❌ **Mobile (React Native) path tidak realistis dari sekarang:**
- React Native butuh component dalam React (✓), tapi pakai komponen native (`<View>`, `<Text>`, dll), bukan HTML (`<div>`, `<button>`)
- Semua page sekarang pakai HTML elements + Tailwind classes — TIDAK portable ke RN
- Pas mau bikin native app, hampir 100% UI rewrite
- Logic (data, state, format) bisa shared kalau diekstrak ke pure-JS module — tapi sekarang campur dengan UI

❌ **Keamanan:**
- `dangerouslySetInnerHTML` digunakan di PetisiDetail body parsing — XSS risk kalau body dari user-input
- CSP header tidak di-set
- Mock auth (Login.jsx) tidak validate apa pun — siapa pun bisa "login" dengan input random
- Data POST (Lapor Baru, Submit Janji) tidak ada CSRF protection (irrelevant sampai ada backend, tapi worth noting)

---

## 2. Tooling Gap (Yang Belum Ada)

| Kategori | Sekarang | Industry standard | Impact gap |
|---|---|---|---|
| Package manager | tidak ada | pnpm / npm / yarn | dependency chaos |
| Build tool | tidak ada | Vite / esbuild / Turbopack | dev = lambat, prod = besar |
| Framework | React CDN | Next.js / Remix | no SSR, no routing, no API |
| Type system | JS murni | TypeScript | bug runtime > compile-time |
| Linter | tidak ada | ESLint + plugins | code style inkonsisten |
| Formatter | tidak ada | Prettier | diff besar, conflict merge |
| Pre-commit | tidak ada | Husky + lint-staged | bad code masuk repo |
| Unit test | tidak ada | Vitest / Jest | refactor scary |
| Component test | tidak ada | React Testing Library | UI bug bocor |
| E2E test | tidak ada | Playwright / Cypress | regresi tidak terdeteksi |
| Storybook | tidak ada | Storybook | UI inconsistency |
| Type check CI | tidak ada | tsc --noEmit | type error masuk prod |
| Lighthouse CI | tidak ada | @lhci/cli | perf regress tidak terlihat |
| Error tracking | tidak ada | Sentry | bug prod tidak terlapor |
| Analytics | tidak ada | Plausible / PostHog | tidak tahu siapa pakai apa |
| Uptime monitor | tidak ada | UptimeRobot | down tidak ketahuan |
| Database | tidak ada | Supabase Postgres | scale 0, semua mock |
| Auth | mock | Supabase Auth / Clerk | tidak ada login real |
| File storage | tidak ada | Supabase Storage / S3 | upload foto tidak jalan |
| Search | tidak ada | Algolia / Meilisearch | filter scale n^2 |
| State (server) | tidak ada | TanStack Query | tidak ada cache, retry |
| State (client) | JWStore basic | Zustand / Jotai | OK tapi limited |
| Icons | Lucide CDN | bundled | extra HTTP request |
| Forms | manual | react-hook-form + Zod | validation copy-paste |
| Routing | state | Next.js / TanStack Router | URL-based + deep link |
| i18n | tidak ada | next-intl | hardcoded Indonesia |
| Notifications | tidak ada | sonner / react-hot-toast | UX flat |

---

## 3. Risiko Konkret untuk Pertumbuhan

### Skenario A: 1,000 user signup dalam seminggu
- Mock `JWStore.actions.sign('pt-001')` cuma simpan di **localStorage browser masing-masing user** — tanda tangan tidak terkumpul ke server. Saat 1000 user "tanda tangan", kita TIDAK PUNYA datanya. Tidak bisa lapor ke audiensi DPRD.
- **Impact:** kredibilitas project hancur — claim "10,000 tanda tangan" sebenarnya 0 di backend.

### Skenario B: Wartawan share link `https://jubir.spdindonesia.org/petisi/audit-apbd`
- URL tidak ada — semua page state-based.
- Wartawan harus klik manual: Beranda → Aksi → klik card petisi.
- **Impact:** journalist tidak share link spesifik. Story coverage minimal.

### Skenario C: Google index situs
- Crawler lihat blank `<div id="root"></div>`. JS-rendered content tidak ke-index.
- **Impact:** search "tagih janji jakarta" tidak munculin Jubir Warga di Google.

### Skenario D: Server disk penuh / error
- Tidak ada monitoring, tidak ada alert.
- **Impact:** bisa down berhari-hari sebelum ketahuan.

### Skenario E: Bug di Beranda yang bikin crash
- Tidak ada error tracking.
- User bounce, tim tidak tahu kenapa.

### Skenario F: Mau bikin React Native app
- HTML/Tailwind tidak compile ke native components.
- Logic dan UI campur — extract logic = hard.
- **Impact:** native app = 60-70% rewrite, butuh 2-3 bulan dev tambahan.

### Skenario G: Pemilu 2029 traffic spike
- React dev build + Babel di browser = server bandwidth ledak (7-9 MB per page load × 100k users = 700-900 GB hari pertama).
- **Impact:** Hostinger bandwidth 8 TB/bulan habis dalam 2 hari. Site down atau overcharge.

---

## 4. Rekomendasi Target Architecture (Phase 2)

### 4.1 Stack Target

```
Framework      : Next.js 15 (App Router) — file-based routing, SSR, SEO, API routes
Language       : TypeScript strict
Styling        : Tailwind v4 (compiled, JIT) — class final ~15 KB
UI library     : shadcn/ui (component library, copy-paste, customizable)
Icons          : lucide-react (bundled, tree-shaken)
State client   : Zustand (lightweight, async-friendly)
State server   : TanStack Query (cache, retry, optimistic, infinite scroll)
Database       : Supabase (Postgres + RLS)
Auth           : Supabase Auth (email + Google + WhatsApp OTP via Twilio)
Storage        : Supabase Storage (foto laporan, avatar)
Realtime       : Supabase Realtime (live komentar, vote count)
Forms          : react-hook-form + Zod (validation type-safe)
Notifications  : sonner (toast)
Analytics      : Plausible (privacy-friendly, ringan)
Error tracking : Sentry (error capture + replay)
Tests          : Vitest (unit) + React Testing Library + Playwright (e2e)
Linter         : ESLint + @typescript-eslint + eslint-plugin-react
Formatter      : Prettier
Pre-commit     : Husky + lint-staged
CI gates       : type-check + lint + test sebelum deploy
Build          : Next.js + Turbopack
Deploy         : Vercel atau Cloudflare Pages atau Coolify-on-VPS
CDN            : Cloudflare (proxy + caching)
Monitoring     : UptimeRobot + Sentry + Plausible
```

### 4.2 Folder Structure Target

```
jubir-warga/                          # monorepo (pnpm workspaces)
├── apps/
│   ├── web/                          # Next.js webapp (utama)
│   │   ├── app/                      # App Router pages
│   │   │   ├── (auth)/login/         # /login
│   │   │   ├── (auth)/daftar/        # /daftar
│   │   │   ├── beranda/              # /beranda
│   │   │   ├── komunitas/
│   │   │   │   ├── page.tsx          # /komunitas
│   │   │   │   └── [threadId]/page.tsx  # /komunitas/abc-123
│   │   │   ├── tagih/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [janjiId]/page.tsx
│   │   │   ├── api/                  # API routes (jadi backend ringan)
│   │   │   │   ├── petisi/[id]/sign/route.ts
│   │   │   │   └── trpc/[...trpc]/route.ts
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── nala/                 # Nala-specific
│   │   │   └── illustrations/
│   │   ├── lib/
│   │   │   ├── supabase.ts
│   │   │   ├── format.ts
│   │   │   └── nala-prompts.ts
│   │   ├── styles/globals.css
│   │   ├── tailwind.config.ts
│   │   ├── next.config.ts
│   │   └── package.json
│   ├── mobile/                       # (Phase 3) React Native + Expo
│   │   └── ...
│   └── admin/                        # (Phase 3) admin dashboard
├── packages/
│   ├── ui/                           # shared UI components (cross-platform-ish)
│   ├── data/                         # types, schemas, query helpers
│   │   ├── schemas/                  # Zod schemas
│   │   ├── types.ts                  # TS types
│   │   └── seeds/                    # seed data dev
│   ├── lib/                          # shared utilities
│   └── config/                       # shared eslint, tsconfig, prettier
├── supabase/                         # backend
│   ├── migrations/                   # SQL migrations
│   │   ├── 0001_users.sql
│   │   ├── 0002_threads.sql
│   │   ├── 0003_petisi.sql
│   │   └── ...
│   ├── seed.sql                      # seed data prod
│   └── config.toml
├── deploy/                           # infra
│   ├── nginx-jubirwarga.conf         # (existing)
│   ├── github-actions/
│   └── docs/
├── .github/workflows/
│   ├── ci.yml                        # lint + type + test on PR
│   └── deploy.yml                    # deploy on push main
├── package.json                      # workspace root
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .eslintrc.json
├── .prettierrc
└── README.md
```

### 4.3 Database Schema Awal (Supabase)

```sql
-- users (extend supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  name text,
  chapter text,
  level int default 1,
  xp int default 0,
  badges jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- threads
create table public.threads (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id),
  title text not null,
  body text,
  category text,
  location text,
  format text,
  upvotes int default 0,
  downvotes int default 0,
  reply_count int default 0,
  hot boolean default false,
  created_at timestamptz default now()
);

-- petisi
create table public.petisi (
  id uuid primary key default gen_random_uuid(),
  initiator_id uuid references profiles(id),
  title text not null,
  summary text,
  body text,
  target int default 1000,
  current_count int default 0,
  deadline date,
  tags text[],
  created_at timestamptz default now()
);

-- petisi_signatures (many-to-many: user signs petisi)
create table public.petisi_signatures (
  petisi_id uuid references petisi(id),
  user_id uuid references profiles(id),
  signed_at timestamptz default now(),
  primary key (petisi_id, user_id)
);

-- janji (politician promises)
create table public.pejabat (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  jabatan text,
  partai text,
  level text, -- Pusat / Provinsi / Kota
  dapil text,
  skor int default 0
);

create table public.janji (
  id uuid primary key default gen_random_uuid(),
  pejabat_id uuid references pejabat(id),
  topik text,
  janji_text text,
  source_url text,
  status text check (status in ('Belum','Berjalan','Mandek','Ditepati','Diingkari')),
  deadline date,
  evidence_count int default 0,
  pemantau_count int default 0,
  created_by uuid references profiles(id),
  verified_at timestamptz
);

-- ... + chapters, kelas, modul, karya, laporan, vote, comment, follow, badge, dst.

-- RLS policies untuk security
alter table public.threads enable row level security;
create policy "Threads are viewable by everyone" on threads for select using (true);
create policy "Users can insert their own threads" on threads for insert with check (auth.uid() = author_id);
create policy "Users can update their own threads" on threads for update using (auth.uid() = author_id);
-- ... policies untuk semua table
```

### 4.4 Migration Strategy (Gradual, Tidak Destruktif)

**Prinsip:** Versi sekarang TETAP LIVE selama Phase 2 dibangun paralel. Cutover hanya saat versi baru sudah feature-parity + battle-tested.

#### Sprint 1 (Minggu 1) — Foundation Phase 2
- Init Next.js project di branch baru `phase-2`
- Setup TypeScript strict + ESLint + Prettier + Husky
- Setup Tailwind v4 + shadcn/ui
- Setup Supabase project (free tier)
- Define Zod schemas + TypeScript types untuk semua entity
- Migrate brand tokens (`tokens.css`) — 1 hari
- Migrate utility functions (`format.ts`, `nala-prompts.ts`) — 1 hari
- Setup CI pipeline (lint + type + test gate)

**Output:** empty Next.js shell, types siap, CI green.

#### Sprint 2 (Minggu 2) — Core Components + Data Layer
- Port `Pill, Button, Avatar, ProgressBar, Modal, NavTabs` ke shadcn/ui style
- Setup TanStack Query
- Bikin Supabase client + helper hooks (`useThreads()`, `useSignPetisi()`, dst)
- Migrate seed data ke `seed.sql` (Supabase)
- Bikin Storybook untuk semua component

**Output:** Component library siap, data hooks siap.

#### Sprint 3 (Minggu 3-4) — Page Migration: Read-only
- Port halaman utama (Beranda, Komunitas, Karya, Kelas, Aksi, Tagih, Main, Nala, Profil)
- Convert JSX → TSX
- Replace `window.JWData.threads` → `useQuery(['threads'], fetchThreads)`
- File-based routing: `app/beranda/page.tsx`, `app/komunitas/page.tsx`
- Server-side rendering untuk SEO (data prefetch)
- Lighthouse score target: 90+ Performance, 95+ A11y

**Output:** Semua 9 main page jalan dengan data dari Supabase.

#### Sprint 4 (Minggu 5-6) — Detail Pages + Interactivity
- Port semua detail page (KelasDetail, JanjiDetail, dll)
- URL params: `app/petisi/[id]/page.tsx`, `app/tagih/[janjiId]/page.tsx`, dst.
- Wire interaktivitas real: sign petisi, vote, comment — pakai Supabase + optimistic UI
- Auth flow real: Supabase Auth (email + Google + WhatsApp OTP)
- RLS policies tested

**Output:** End-to-end interaktif dengan backend real.

#### Sprint 5 (Minggu 7) — Forms + Upload + Games
- Form Lapor Baru + Submit Janji pakai react-hook-form + Zod
- File upload (foto laporan) ke Supabase Storage
- Mini-games (TebakKata, SpotHoaks, TebakPasal) port dengan score persist ke server
- Daily challenge logic

**Output:** Semua aksi user persist ke server.

#### Sprint 6 (Minggu 8) — Testing + Polish + Cutover
- E2E tests Playwright untuk critical flows (signup, sign petisi, submit lapor)
- Mobile responsive audit @375px, 414px, 768px
- Performance optimization (image optim, code splitting, prefetch)
- Lighthouse CI di workflow
- Sentry integration
- Plausible analytics
- Cutover: DNS pointer ke versi baru, archive versi lama
- Soft launch ke 100 alumni dulu

**Output:** Production-ready Phase 2.

### 4.5 Phase 3 (Bulan 3+) — Mobile App

- React Native + Expo
- Reuse 60-70% logic dari `packages/lib`, `packages/data`, hooks dari `apps/web`
- UI rebuild dengan native components (1-1 mapping per page)
- Biometric auth (TouchID/FaceID)
- Push notifications (Expo Push)
- Deep linking dari web ke app
- Submit ke App Store + Play Store

---

## 5. Decision Points (Saya Butuh Input Mas)

### Decision 1 — Strategi Phase 2
**Pilihan A:** **Rebuild full** ke Next.js + TS + Supabase (recommended)
- Pro: solid foundation untuk 5-10 tahun, native app realistic
- Con: 8 minggu kerja serius, butuh fokus, biaya cognitive

**Pilihan B:** Patch incremental (jangan ubah arsitektur)
- Pro: cepat, low effort
- Con: tech debt menumpuk, problem skenario A-G akan terjadi

**Pilihan C:** Hybrid — keep static, tambah backend API sederhana di VPS
- Pro: tidak ubah frontend, dapat persistence
- Con: tidak fix performance, SEO, mobile path

### Decision 2 — Backend
**Pilihan A:** **Supabase managed** (recommended)
- Free tier: 500 MB database, 1 GB storage, 50k MAU
- Auth, realtime, storage built-in
- Tidak perlu maintain server

**Pilihan B:** Self-hosted Postgres di VPS Mas
- Murah jangka panjang
- Butuh setup + backup + security maintenance

**Pilihan C:** Convex / PlanetScale / NeonDB
- Mirip Supabase, beda vendor lock-in

### Decision 3 — Hosting Phase 2
**Pilihan A:** **Vercel** (Next.js native)
- Free tier 100 GB bandwidth
- Edge functions, otomatis CDN
- Preview deployment per PR

**Pilihan B:** **Cloudflare Pages**
- Free unlimited bandwidth
- Workers + KV storage
- Lebih cepat dari Vercel di Indonesia (PoP Jakarta)

**Pilihan C:** Lanjut di VPS Hostinger sendiri
- Kontrol penuh
- Butuh setup Node.js runtime + reverse proxy

### Decision 4 — Migration cadence
**Pilihan A:** **Big bang** — selesaikan semua, cutover sekali
- 8 minggu commitment, hasil clean

**Pilihan B:** Page-by-page rollout — proxy sebagian URL ke Next.js
- Lebih lama (10-12 minggu)
- Risk lebih kecil

**Pilihan C:** Stop fitur baru sampai migration selesai
- Tim kapasitas terbatas, fokus tunggal

---

## 6. Yang Bisa Dikerjakan Sekarang Tanpa Rebuild Besar (Quick Wins)

Sambil mikir Phase 2, ini langkah kecil yang minim disruption tapi besar impact:

### 6.1 Production Performance (1-2 hari)
- Replace `react.development.js` → `react.production.min.js` di index.html
- Replace `react-dom.development.js` → `react-dom.production.min.js`
- Add nginx gzip/brotli compression untuk JSX/JS files
- Cache buster strategy yang lebih cerdas (file hash, bukan timestamp)
- Result: payload turun 3-5x, first paint lebih cepat 2-3x

### 6.2 Cleanup Repo (1 jam)
```bash
# Hapus file yang tidak perlu di-commit
git rm src/pages/**/*.bak
git rm src/pages/**/*.tmp
git rm AUDIT_*.md PROGRESS_*.md PROGRESS_clean.md

# Update .gitignore
echo "*.bak
*.tmp
AUDIT_*.md
PROGRESS_*.md
.DS_Store" >> .gitignore

git add -A && git commit -m "Cleanup: remove backup files + internal docs from repo"
git push
```

### 6.3 Tambah package.json + ESLint (1 jam)
Ini langkah kecil yang persiapan ke Phase 2:

```json
{
  "name": "jubir-warga",
  "version": "0.1.0-beta",
  "scripts": {
    "lint": "eslint src/**/*.jsx --max-warnings 0",
    "format": "prettier --write src/**/*.{jsx,js,css}",
    "deploy": "git push origin main"
  },
  "devDependencies": {
    "eslint": "^9",
    "@babel/eslint-parser": "^7",
    "eslint-plugin-react": "^7",
    "prettier": "^3"
  }
}
```

### 6.4 Tambah Sentry (30 menit)
Single `<script>` tag → semua JS error otomatis di-capture. Free tier 5k events/bulan.

### 6.5 Tambah Plausible Analytics (10 menit)
Single `<script>` tag → tracking visitor + page views. EU-hosted, GDPR-compliant. ~$9/bulan setelah free trial.

### 6.6 Setup Lighthouse CI di workflow (30 menit)
Tambah job ke `.github/workflows/deploy.yml` yang lari Lighthouse. Fail kalau perf score <80. Cegah regression.

### 6.7 Fix DOM nesting warning Beranda (15 menit)
`<button>` di dalam `<button>` di Polling/Petisi card. Ganti outer ke `<div role="button" tabIndex={0} onKeyDown={Enter}>`.

### 6.8 Tambah robots.txt + sitemap.xml (15 menit)
Untuk SEO basic, walaupun belum SSR.

### 6.9 Add README + CONTRIBUTING (1 jam)
Buat clear:
- Cara setup local dev
- Architecture overview
- Cara add page baru
- Cara migrate ke Phase 2
- Convention + style guide

---

## 7. Honest Self-Critique

Beberapa keputusan saya sesi ini yang sub-optimal di-recall:

1. **Bikin window pollution lebih banyak lagi** dengan tambah 18 page ke style yang sama (PageBeranda, KelasDetail, dst). Ini IKUT kontribusi ke debt yang harus di-rebuild di Phase 2. Seharusnya saya lebih agresif advokasi migrasi ke proper module system dari awal — tapi pragmatisme menang karena user butuh demo cepat.

2. **Tidak commit ke type safety dari awal**. JS murni → semua page rentan refactor break. Migrasi ke TS di Phase 2 = effort lebih besar.

3. **Dependency Lucide pakai `@latest`** di CDN URL — bisa breaking change kapan saja kalau Lucide release versi baru. Production seharusnya pin versi: `lucide@0.460.0`.

4. **Babel CDN untuk production** — saya lanjut pola existing (in-browser transpile) yang sebenarnya tidak ideal. Seharusnya warning lebih keras dari awal kalau ini akan jadi masalah saat scale.

5. **Tidak tambah error boundary di App.jsx** — kalau ada page crash, seluruh app pecah jadi blank. Tambah `<ErrorBoundary>` minimal.

6. **Tidak memikirkan caching strategy** untuk service worker. Sekarang SW basic — bisa cache stale data dan susah invalidate.

---

## 8. Apa yang Saya Rekomendasikan

**Untuk pitch beta sekarang (1-2 minggu ke depan):**
- Cleanup repo (1 jam — Quick Win 6.2)
- Tambah React production build (2 jam — Quick Win 6.1)
- Tambah Sentry + Plausible (1 jam — Quick Wins 6.4-6.5)
- Tambah Lighthouse CI gate (30 menit — Quick Win 6.6)
- Fix DOM nesting warning (15 menit — Quick Win 6.7)
- Demo pitch dengan confidence

**Setelah dapat funding / sign-off Phase 2:**
- Mulai Sprint 1 Migration Strategy (Section 4.4)
- 8 minggu intensif rebuild
- Cutover ke Phase 2

**Setelah Phase 2 stable (3 bulan post-launch):**
- Mulai Phase 3: React Native mobile app
- Reuse logic dari `packages/lib` & `packages/data`

---

## 9. Lampiran

### A. File yang HARUS di-cleanup dari repo SEKARANG

```
src/pages/Beranda.jsx.bak
src/pages/Beranda.jsx.tmp
src/pages/aksi/Index.jsx.bak
src/pages/aksi/Index.jsx.tmp
src/pages/komunitas/Index.jsx.bak
src/pages/komunitas/Index.jsx.tmp
src/pages/tagih/Index.jsx.bak
src/pages/tagih/Index.jsx.tmp
PROGRESS_clean.md
AUDIT_JUBIR_WARGA_2026-04-29.md (kalau internal-only)
PROGRESS_2026-04-29.md (kalau internal-only)
PROGRESS_2026-04-29-v2.md (kalau internal-only)
```

### B. CDN versi yang sebaiknya di-pin (bukan `latest`)

```html
<!-- Saat ini (RISIKO) -->
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

<!-- Sebaiknya -->
<script src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.js"></script>
```

### C. Risiko biggest yang mau diingat

> **"Yang sekarang bekerja sebagai prototype, akan menjadi penjara saat kita scale."**

React+Babel CDN approach optimal untuk MVP/demo. Tetapi setiap page baru yang kita bangun dengan pola ini = tech debt yang HARUS di-bayar saat migrate. Yang penting dipikirkan: di poin mana kita berhenti tambah debt baru dan mulai migrate?

Saran konkret: **selesai pitch demo → freeze fitur → mulai Phase 2 rebuild.**

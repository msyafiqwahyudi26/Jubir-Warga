# CLAUDE.md — Operating manual untuk Claude Code

Dokumen ini dibaca **pertama kali** oleh Claude Code (atau LLM developer lain) sebelum mengerjakan task apapun di repo ini. Wajib diikuti, tidak boleh diabaikan kecuali ada instruksi eksplisit dari Mas (owner) di chat.

---

## 0. Required reading sebelum task pertama

Wajib baca dulu file-file di bawah ini sebelum implementasi apapun. Konteks brand & produk lengkap ada di sana:

| File | Untuk task apa |
|---|---|
| `apps/legacy/docs/RENCANA_1_BULAN.md` | Roadmap, success metrics, IA, persona target |
| `apps/legacy/docs/Landing_Page_Beta_Copy.md` | Copy landing page (11 section) — source of truth saat tulis copy publik |
| `apps/legacy/docs/Prompt_Claude_Design_Jubir_Warga_v2.md` | Design system spec lengkap — palette, tipografi, ilustrasi, page-by-page IA |
| `specs/SPRINT-2/*.md` | Spec aktif untuk sprint berjalan |

Kalau task bersinggungan dengan visual / copy / brand, **WAJIB cross-check** ke Landing copy dan Design v2. Kalau bertentangan dengan implementasi Phase 1 — design doc menang untuk Phase 2.

---

## 1. Project context

**Jubir Warga** adalah platform online untuk anak muda Indonesia (17–39 tahun) untuk mengumpulkan, mengkurasi, dan mengangkat suara warga ke percakapan publik — diskusi, karya, kelas, petisi, laporan warga, pemantauan janji pejabat. Owner & operator: **SPD Indonesia** (Sindikasi Pemilu & Demokrasi). Sekarang dalam beta, target launch publik **Juni 2026**. Repo ini berisi Phase 1 (vanilla CDN, sudah live di `jubir.spdindonesia.org`) dan Phase 2 (Next.js + Supabase, in development) sebagai monorepo.

**Status institusional:** Jubir Warga lahir dari SPD sebagai platform anak muda. Sedang dalam proses pembentukan PT independen 2026. Pasca-PT: Jubir Warga otonom, SPD jadi partner. **Brand utama: Jubir Warga.** Untuk publik, jangan disclose riwayat institusional ini di copy halaman — Jubir Warga diposisikan sebagai brand utuh.

**Positioning v2:** "VICE Indonesia × Discord × Coursera × Change.org × Wordle, dengan AI sebagai sahabat dan paspor sebagai identitas."

**Audience inti (3 persona):**
- **Aulia** (21, mahasiswi Bandung) — mau ngerti isu publik tanpa baca jurnal. Pakai untuk explainer.
- **Reza** (26, NGO Surabaya) — punya opini, butuh panggung. Pakai Writing Partner & upload Karya.
- **Sari** (29, alumni Jubir Warga 2024, Jakarta) — organize komunitas, follow janji wali kotanya. Pakai Tagih Janji.

**Domain:**
- `jubir.spdindonesia.org` — Phase 1 live (akan tetap aktif sampai cutover)
- `jubirwarga.id` — target brand domain (untuk launch Juni 2026)
- App subdomain TBD (`app.jubirwarga.id` atau `beta.jubirwarga.id`)

---

## 2. Tech stack

| Layer | Tech | Version | Catatan |
|---|---|---|---|
| Runtime | Node.js | ≥20.11 | LTS only |
| Package manager | pnpm | 9.12.0 | Wajib pnpm — npm/yarn akan break workspace |
| Framework | Next.js | 15.0.3 | App Router + Turbopack dev |
| Language | TypeScript | 5.6.3 | Strict mode, `noUncheckedIndexedAccess: true` |
| Styling | Tailwind CSS | 4.0.0-beta | `@theme` syntax, brand tokens di `globals.css` |
| State (server) | TanStack Query | 5.59 | Untuk client-side fetch saja; prefer Server Components |
| State (UI) | Zustand | 5.0 | Hanya untuk UI state cross-component (modal, drawer, toast) |
| Validation | Zod | 3.23 | Wajib di semua Server Action input |
| Backend | Supabase | 2.46 | Postgres + Auth + Realtime + Storage |
| Auth client | @supabase/ssr | 0.5 | Cookie-based, BUKAN @supabase/auth-helpers (deprecated) |
| Icons | lucide-react | 0.460 | Pin major version, jangan auto-update |
| Deploy (Phase 1) | Hostinger VPS | — | Auto via GitHub Actions saat push ke `apps/legacy/**` |
| Deploy (Phase 2) | TBD | — | Vercel atau VPS — keputusan di Sprint 3 |

---

## 3. Repo structure

```
jubir-warga/
├── apps/
│   ├── legacy/              Phase 1 vanilla — DON'T TOUCH kecuali bug fix
│   │   └── docs/            ⚠️ Required reading (lihat section 0)
│   └── web/                 Phase 2 Next.js — fokus pengembangan utama
│       ├── src/
│       │   ├── app/         App Router — segregasi auth/landing/beta
│       │   ├── components/  React components — convention: kebab-case folder, PascalCase file
│       │   ├── lib/         Utilities, Supabase clients, providers
│       │   └── styles/      (jangan tambah file di sini, semua via globals.css)
│       ├── middleware.ts    Auth refresh + preview gate + route protection
│       └── next.config.ts
├── packages/
│   └── data/                @jw/data — type-safe data layer, framework-agnostic
├── supabase/
│   ├── migrations/          SQL schema migrations, numbered (0001, 0002, ...)
│   ├── seed.sql             Reference data (chapters, topics, badges, real pejabat)
│   └── demo_seed.sql        Demo user-generated content (300 fake users + derived)
├── scripts/                 Node TS scripts (generators, maintenance)
├── deploy/                  VPS provisioning, nginx, monitoring docs
├── specs/                   Feature execution specs — read these before coding
└── .github/workflows/       CI/CD
```

---

## 4. Brand voice (CRITICAL — pelanggaran = revisi paksa)

### 4.1 Naming brand & AI

**Brand utama: "Jubir Warga"** — DIPISAH (dua kata), tidak pernah "Jubirwarga" walaupun pitch deck lama menyebut digabung. Decision Mas (owner): standardize "Jubir Warga" konsisten di semua dokumen, copy, branding.

**Sub-brand untuk segmen 12-18 (SMP/SMA): "Warga Muda"** — bukan "Jubir Warga Muda" yang terlalu panjang. Akses lewat program Muda Berdampak (offline camp + workshop sekolah). Section di app khusus alumni Warga Muda akan di-spec di Sprint 4+.

**Mascot dan AI bernama "Nala"** — beo claymorphism dengan 5 ekspresi (curious, excited, mentor, thinking, confident). Bukan "Jubir" walaupun design doc lama menyebut "Jubir". Decision Mas (owner): pertahankan nama Nala karena implementasi Phase 1 sudah established dengan karakter visual yang berkembang. Origin story: beo = simbol bahwa **suara itu penting**, dan Nala bantu warga bersuara.

Component path: `apps/web/src/components/nala/*`.

### 4.2 Vocabulary — yang HARUS

- **"kamu"** untuk addressing user (bukan "Anda")
- **"aku"** sebagai self-reference Nala (bukan "saya")
- Kosakata santai anak muda Indonesia: ngumpul, nimbrung, curhat, uneg-uneg, resah, gabung, ngomongin, nyari, kepo, capek
- Bilingual mix Indonesia + istilah asing umum di Gen Z (mis. "venting", "deep dive", "vibe")
- Caveat font untuk anotasi kecil yang berasa "tulisan tangan"
- Data konkret (jumlah, tanggal, nama)

### 4.3 Vocabulary — yang TIDAK BOLEH

- Kata **"civic"** sebagai positioning (terdengar foreign-NGO)
- **"warga negara yang kritis"** (textbook)
- Jargon politik berat tanpa konteks
- Promosi politis partisan
- Emoji sebagai dekorasi UI (boleh dalam quotation marks user content)

### 4.4 Reference tone (untuk kalibrasi)

- Magdalene (editorial-feminist tone, casual)
- Asumsi (Gen Z politik, irreverent tapi substansi)
- VICE Indonesia (longform punchy)
- Whiteboard Journal (kultural, eksploratif)

### 4.5 Persona Nala (system prompt — untuk Phase 2 AI integration)

```
Kamu adalah Nala, AI persona dari platform Jubir Warga (Indonesia).

IDENTITY:
- Nama: Nala — beo (parrot) yang jadi sahabat warga digital.
- Karakter: hibrid sahabat dan mentor. Default mode sahabat — santai, hangat, bahasa anak muda Indonesia.
- Saat user di kelas atau ngajak diskusi serius: switch ke mentor mode — fokus, terstruktur, tetap warm.

VOICE:
- Pakai "aku" / "kamu", BUKAN "saya" / "Anda".
- Bilingual mix Indonesia santai. Sesekali boleh campur istilah asing umum di Gen Z.
- Tidak menggurui. Tidak terlalu formal.
- Pakai contoh konkret Indonesia (KRL, ojek online, kantin SD, RT/RW).

NILAI:
- Selalu sertakan sumber kalau claim sesuatu.
- Akui ketidakpastian. Lebih baik bilang "aku nggak yakin, tapi..." daripada nge-fake sure.
- Tidak partisan — tidak endorse partai/kandidat.
- Tidak bikin konten ujaran kebencian, fitnah, atau hoaks.
- Hormati perbedaan pendapat. Bisa diajak debat sehat.

KAPABILITAS:
- Penjelasan UU/Pasal/janji dalam bahasa anak muda.
- Bantu draft tulisan opini, surat advokasi, talking points.
- Coach kelas: cek pemahaman, jawab pertanyaan, kasih latihan.
- Ringkas thread panjang jadi poin kunci.
- Suggest aksi konkret berdasar percakapan.

BATASAN:
- Tidak kasih saran hukum spesifik (rujuk ke pengacara).
- Tidak kasih saran medis.
- Tidak kasih informasi yang bisa dipakai menyakiti orang.
- Kalau user ngomongin distress mental berat, suggest hotline + sumber profesional.
```

---

## 5. Design system (CRITICAL — anti-pattern = revisi paksa)

### 5.1 Color tokens (11 warna, TIDAK BOLEH tambah)

| Token (Tailwind v4) | Hex | Pakai untuk |
|---|---|---|
| `--color-jw-blue` | #1A2256 | Headline, CTA primary, footer |
| `--color-jw-cream` | #FFFAEE | Background utama, text on dark |
| `--color-jw-blue-soft` | #3B4A8A | Secondary blue, hover, subtle bg |
| `--color-jw-ink` | #2A2D3A | Body text, paragraph |
| `--color-jw-muted` | #6B6860 | Caption, meta |
| `--color-jw-line` | #E6DECB | Border, divider |
| `--color-jw-coral` | #E8632B | CTA secondary, "panas" badge, squiggly underline |
| `--color-jw-marigold` | #F2B137 | Level badge, "berjalan" status |
| `--color-jw-mint` | #7FB69E | "Ditepati" status, success |
| `--color-jw-red` | #C44434 | "Diingkari" status, error |
| `--color-jw-grey` | #8A9099 | "Belum" status, disabled |

**Aturan komposisi:** cream + blue dominan. Aksen maksimal 10% dari viewport.

### 5.2 Typography

- **Inter** (300–700) — UI body, tombol, navigasi, label
- **Vollkorn** (400, 600, 700, italic) — display headline, judul section, quote, hero italic
- **Caveat** (400, 600, 700) — anotasi tangan kecil, tagline informal. **TIDAK untuk logo**
- **Fira Code** (400, 500) — angka, data, statistik

### 5.3 Logo (hand-drawn feel, BUKAN font Caveat)

Logo wordmark "Jubir Warga" wajib hand-drawn feel:
- Huruf bulat (rounded), seperti tulisan spidol
- Sedikit irregular — tidak presisi seperti font geometrik
- Warna `--color-jw-blue`
- Underline squiggly coral di bawah wordmark
- Total ukuran header 28–32px tinggi

**Implementasi yang diizinkan:**

| Tier | Approach | Status |
|---|---|---|
| Goal jangka panjang | Custom hand-crafted SVG `<path>` letterforms by professional designer | TBD post-funding (Sprint 5+) |
| Acceptable interim | Font hand-drawn yang BUKAN Caveat — Patrick Hand, Reenie Beanie, atau Kalam (Google Fonts) | ✅ Sekarang |
| TIDAK acceptable | Font Caveat (sudah dipakai untuk anotasi, akan jadi confusing kalau dipakai juga untuk logo) | ❌ Hindari |
| TIDAK acceptable | Font geometrik (Inter, Roboto, Vollkorn-non-italic, dll) | ❌ Hindari |

Komponen `apps/web/src/components/jw-logo.tsx` wajib include comment:
```ts
// TODO(post-funding): replace with custom hand-crafted SVG letterforms by
// professional designer. Patrick Hand (or similar) is interim implementation.
```

Source reference: `apps/legacy/src/components/layout/main.jsx` (Phase 1 pakai font-hand Caveat — itu pre-CLAUDE.md decision yang akan di-superseded saat port ke Phase 2).

### 5.4 Iconography

Pakai **Lucide React** stroke 1.5–2px rounded. Warna `--color-jw-ink` atau `--color-jw-blue`. Set ikon yang sering dipakai:

`home, message-circle, edit-3, book-open, zap, target, gamepad-2, bell, search, user, settings, log-in, plus, check, x, alert-triangle, map-pin, calendar, clock, eye, share-2, bookmark, heart, thumbs-up, flag, link, image, mic, video, file-text, layers, trending-up, chevron-down, chevron-right, more-horizontal, paperclip, sparkles` (untuk AI Nala).

### 5.5 Ilustrasi SVG kustom (15 wajib — port bertahap)

Sumber referensi: `apps/legacy/docs/Prompt_Claude_Design_Jubir_Warga_v2.md` Section 2.5.

Prioritas port di Sprint 2 (5 dulu untuk landing + Beranda):
1. **Hero Beranda** — orang muda baca dokumen di kafe
2. **Hero Komunitas** — sekelompok orang ngobrol di lingkar
3. **Empty state Forum** — orang duduk di bench, balon bicara kosong
4. **Empty state Karya** — kanvas kosong
5. **404 / empty error** — orang muda garuk kepala dengan map keliru

Sisanya (10) port di Sprint 3 sesuai page yang di-port.

**Style ilustrasi:** flat dengan satu shadow halus, line stroke organik, warna brand. **BUKAN** stock illustration. **BUKAN** isometric 3D. **BUKAN** corporate vector look. **BUKAN** placeholder kotak warna.

### 5.6 Anti-pattern (zero tolerance)

1. ❌ Emoji sebagai dekorasi UI ("📊 Polling Hari Ini") — pakai Lucide icon + teks plain
2. ❌ Placeholder kotak warna polos dengan teks "ilustrasi X"
3. ❌ Stock-style colorful icon set (rainbow icons)
4. ❌ Halaman shallow — setiap halaman utama wajib minimal 3 section, setiap detail page wajib 5+ section
5. ❌ Font Caveat untuk logo
6. ❌ Pakai warna di luar 11 token

### 5.7 Microinteractions

- Hover card: `translateY -3px + shadow` halus
- Klik tombol: `scale 0.97 + ripple` optional
- Vote arrow: turn coral on hover, scale 1.1 on click
- Stempel masuk paspor: rotate animation + tilt acak
- Nala typing: dot bouncing animation
- Page transition: fade in 200ms

---

## 6. File conventions

- **React components**: file `kebab-case.tsx`, default export `PascalCase` function. Co-locate `actions.ts` (Server Actions) dan `*-form.tsx` (Client Component) di folder yang sama.
- **Folder route group**: `(name)` untuk segregasi tanpa pengaruh URL. Contoh: `app/(beta)/komunitas/page.tsx` melayani `/komunitas`.
- **Server Component default**: jangan tambah `'use client'` kecuali butuh hook (`useState`, `useEffect`, dll) atau event handler.
- **Server Action**: tambah `'use server'` di top-of-file. Function harus `async`. Input WAJIB di-validate dengan Zod sebelum hit DB.
- **Imports order**: (1) Node built-in, (2) third-party, (3) `@/*` aliases, (4) relative `./...`. Jangan campur.
- **Type imports**: `import type { ... }` untuk type-only.

---

## 7. Data layer rules (`packages/data` / `@jw/data`)

**TIDAK BOLEH** ada di `@jw/data`:
- `next/*` import (Next.js specific)
- `react`/`react-dom` import KECUALI di `hooks.ts`
- DOM API (`window`, `document`, `localStorage`)
- Side effect saat import

Alasan: package akan di-share dengan future React Native app.

**WAJIB**:
- Semua function di `queries.ts` adalah pure async
- Semua input function di-validate dengan Zod
- Semua output di-type dengan generic dari `Database` type

---

## 8. Security rules (CRITICAL)

### Supabase

- **Service role key NEVER masuk ke client bundle**
- **Anon key BOLEH masuk ke `NEXT_PUBLIC_*`** — keamanan datang dari RLS
- **RLS WAJIB enabled** di setiap table baru
- **Setiap migration baru** wajib include `ENABLE ROW LEVEL SECURITY` + minimal 1 policy untuk read
- **Insert/update policies** wajib check `auth.uid() = <owner_column>`
- **Admin-only operations** wajib pattern: `EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)`

### Auth flow

- Cookie auth via `@supabase/ssr`. Jangan simpan token di localStorage.
- Server Action yang butuh user: `const { data: { user } } = await supabase.auth.getUser()` di awal
- Redirect setelah auth: `revalidatePath('/', 'layout')` lalu `redirect()`

### Input validation

- Setiap Server Action input WAJIB di-validate dengan Zod
- File upload: validate MIME type + size di server
- User-generated text: store as-is, sanitize saat render

### Forbidden

- ❌ `dangerouslySetInnerHTML` tanpa sanitization library
- ❌ Trust `searchParams` atau `formData` mentah
- ❌ Log PII (email, nomor HP) ke console/Sentry/file
- ❌ Hardcode password atau secret di source code

---

## 9. Demo mode rules

Repo dalam mode "beta + dummy data" sampai launch publik Juni 2026.

- Setiap content table punya kolom `is_demo BOOLEAN DEFAULT false` (Spec #1)
- Real reference data (`is_demo = false`): pejabat, janji real, badges, chapters, topics
- Dummy user content (`is_demo = true`): 300 fake user + threads + karya + petisi sign + dll (Spec #2)
- App tidak filter `is_demo` sekarang — semua tampak
- Saat production launch: jalankan `cleanup_demo_data()` function untuk wipe demo
- Demo banner di header beta (rotating campaign / feedback / transparency)
- Tag `[Contoh]` subtle di card user-generated kalau `entity.is_demo === true`

---

## 10. Workflow per task

1. Baca spec sampai habis sebelum mulai. Jangan tebak isi.
2. Cross-check dengan required reading section 0.
3. Tanya kalau ada ambiguitas — JANGAN improvise.
4. Implementasi sesuai file path yang spec sebutkan.
5. Run typecheck: `pnpm --filter @jw/web typecheck`. Wajib pass.
6. Run lint: `pnpm --filter @jw/web lint`. Warning OK, error harus fix.
7. Manual smoke test: navigate ke route baru di `localhost:3000`.
8. Update `specs/<sprint>/STATUS.md` dengan checklist yang sudah dilakukan.
9. Commit dengan Conventional Commits (section 12).

---

## 11. Don't list

- ❌ Install package baru tanpa konfirmasi
- ❌ Downgrade Next.js / React / TypeScript major version
- ❌ Pakai `any` di TypeScript — pakai `unknown` lalu narrow
- ❌ Edit `apps/legacy/` kecuali Mas eksplisit minta
- ❌ Edit `supabase/migrations/0001_*.sql` setelah ter-apply (immutable)
- ❌ Commit `.env.local`, `*.env`, atau file dengan secret
- ❌ Run `supabase db reset` atau destructive command di production project
- ❌ Auto-format dengan Prettier kalau bukan diminta
- ❌ Tambah Sentry / analytics / tracking script tanpa konfirmasi
- ❌ Pakai font Caveat untuk logo
- ❌ Pakai emoji sebagai dekorasi UI
- ❌ Bikin warna baru di luar 11 token

---

## 12. Reference info (operational)

| Resource | Value |
|---|---|
| Supabase project ref | `ifrautpvbhdbhieystxk` |
| Supabase URL | `https://ifrautpvbhdbhieystxk.supabase.co` |
| Supabase region | `ap-southeast-1` (Singapore) |
| Phase 1 production | `https://jubir.spdindonesia.org` |
| Phase 2 staging | TBD (Sprint 3) |
| Brand domain (target) | `jubirwarga.id` |
| VPS IP | `76.13.196.172` (Hostinger) |
| GitHub repo | `https://github.com/msyafiqwahyudi26/Jubir-Warga` |
| Owner | SPD Indonesia (`admin@spdindonesia.org`) |
| IG | `@jubirwarga.id` |
| Email | `info@jubirwarga.id`, `partnerships@jubirwarga.id`, `press@jubirwarga.id` |
| Address | Jl. Tebet Barat Dalam IIC No. 14, Tebet, Jakarta Selatan |

---

## 13. Commit convention

Format: Conventional Commits.

```
<type>(<scope>): <subject>
```

Type: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `build`, `ci`.
Scope: `web`, `data`, `legacy`, `db`, `deploy`, `auth`, `landing`, `nala`, atau nama folder utama.

Contoh:
- `feat(auth): add WhatsApp OTP flow with Twilio`
- `fix(web): hydration error on /masuk from browser extension`
- `chore(db): migration 0002 add is_demo flag to content tables`

---

## 14. Saat stuck / ambigu

1. Re-read spec di `specs/<sprint>/<feature>.md`
2. Cek section "Acceptance" — apa yang harus terbukti?
3. Cek section "Out of scope" — pastikan tidak nyasar
4. Kalau masih bingung: dokumentasikan question di `specs/<sprint>/QUESTIONS.md`, tunda implementasi bagian itu, lanjut yang lain

---

Last updated: 2026-04-29 (Sprint 2 — post brand context realignment)

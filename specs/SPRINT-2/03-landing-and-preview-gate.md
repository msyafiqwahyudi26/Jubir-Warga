# Spec #3 (v2) — Landing page (Coming Soon mode) + preview gate

**Sprint**: 2
**Owner**: Claude Code (executor) · audited oleh planner
**Estimasi**: 4-5 jam
**Dependency**: Spec #4 (design heritage port) — saling tergantung. Bisa parallel asal Nala mascot + 1-2 SVG illustration siap.
**Required reading**: `apps/legacy/docs/Landing_Page_Beta_Copy.md` (sumber copy semua section), CLAUDE.md section 4 (brand voice) & 5 (design system).

---

## Goal

Bikin **2 halaman publik** sebagai gerbang ke beta:

1. `/coming-soon` — landing teaser brand-aligned dengan **adaptasi ringan** dari `Landing_Page_Beta_Copy.md`. Pesan utama: "Akan terbit Juni 2026, daftar untuk early access". Mengandung 11 section (hero, apa itu, 6 hal yang bisa kamu lakukan, Nala strip, chapter regional, roadmap, traksi, CTA, FAQ, footer) untuk pitch confidence — bukan splash page kosong.

2. `/preview-login` — minimalist password gate. Submit benar → cookie `jw_preview=ok` 7-hari → redirect ke beta.

Plus middleware update: route default protected, kecuali whitelist (`/coming-soon`, `/preview-login`, `/api/healthcheck`, static assets).

## Konteks

Pesan yang tidak boleh missal: "Jubir Warga BELUM live, akan terbit Juni 2026". Tapi landing tidak boleh terasa kosong — ini juga jadi pitch artifact yang bisa Mas share ke investor sebelum mereka login ke beta. Konten kaya = mereka punya konteks substansi sebelum lihat product.

Source-of-truth copy: `apps/legacy/docs/Landing_Page_Beta_Copy.md` punya 11 section yang sudah ditulis brand-faithful. Pakai itu **dengan 5 adaptasi** untuk Coming Soon mode (lihat section "Adaptasi Coming Soon" di bawah).

## File yang dibuat

```
apps/web/src/
├── app/
│   ├── coming-soon/
│   │   ├── page.tsx                Landing — Server Component
│   │   ├── opengraph-image.tsx     OG image generator (1200×630)
│   │   ├── early-access-form.tsx   Client Component: email opt-in
│   │   └── components/
│   │       ├── hero.tsx
│   │       ├── about-section.tsx
│   │       ├── pillars-grid.tsx     "6 hal yang bikin betah"
│   │       ├── nala-strip.tsx
│   │       ├── chapters-section.tsx
│   │       ├── roadmap-section.tsx  "Apa yang dibangun" (sudah/sedang/antri)
│   │       ├── traction-section.tsx 90 alumni / 3 chapter / 3 tahun / 5+ partner
│   │       ├── faq-section.tsx
│   │       └── coming-soon-footer.tsx
│   ├── preview-login/
│   │   ├── page.tsx                Password form
│   │   └── actions.ts              Server Action: validate + set cookie
│   └── api/
│       └── early-access/route.ts   POST endpoint: simpan email opt-in
├── lib/
│   └── preview-gate/
│       ├── config.ts               Constants
│       └── verify.ts               Helper
└── middleware.ts                   UPDATE: tambah preview gate check
```

Migration baru:

```
supabase/migrations/0003_early_access_signups.sql
```

## File yang diubah

- `apps/web/middleware.ts` — tambah preview gate logic
- `apps/web/.env.example` — tambah:
  ```env
  PREVIEW_PASSWORD=JubirWargaSuperApp2026
  PREVIEW_GATE_ENABLED=true
  # Canonical brand URL (untuk OG meta + sitemap canonical).
  # Default sekarang: spdindonesia.org karena domain jubirwarga.id belum dibeli.
  # Saat rilis Juni 2026, ganti env ini ke domain final (kemungkinan jubirwarga.id, atau ikut investor).
  NEXT_PUBLIC_CANONICAL_URL=https://jubir.spdindonesia.org
  NEXT_PUBLIC_BRAND_NAME=Jubir Warga
  ```

Plus bikin constants centralized untuk semua link external — supaya gampang update belakangan tanpa hunt seluruh codebase:

```
apps/web/src/lib/constants/external-links.ts
```

```ts
// External links — sentralisasi supaya gampang update saat link berubah.
// Setiap link punya komentar status: ACTIVE / PENDING / INTERNAL_ONLY.

export const EXTERNAL_LINKS = {
  // Sosmed — ACTIVE
  instagram: 'https://instagram.com/jubirwarga.id',
  twitter: 'https://twitter.com/jubirwarga',

  // Email — ACTIVE
  email: {
    info: 'mailto:info@jubirwarga.id',
    partnerships: 'mailto:partnerships@jubirwarga.id',
    press: 'mailto:press@jubirwarga.id',
  },

  // WhatsApp komunitas — PENDING (belum dibuat per Apr 2026)
  // TODO Mas: ganti saat group WA dibuat. Format: https://chat.whatsapp.com/<invite-code>
  whatsapp: '#',

  // Newsletter — PENDING (rencana awal Substack, mungkin pindah internal)
  // TODO Mas: ganti ke Substack URL setelah set up.
  newsletter: '#',

  // Phase 1 live link — ACTIVE
  phase1Live: 'https://jubir.spdindonesia.org',
} as const;

// Helper untuk render fallback "Coming soon" badge kalau link === '#'
export function isLinkActive(link: string): boolean {
  return link !== '#' && !link.startsWith('mailto:#');
}
```

Komponen yang pakai link ini (footer, share buttons, sub-CTAs) wajib import dari `EXTERNAL_LINKS`, jangan hard-code URL inline. Kalau link `'#'`, render dengan badge "(coming soon)" subtle.

## Adaptasi Coming Soon (vs landing copy original)

Original copy di `Landing_Page_Beta_Copy.md` ditulis seakan beta sudah jalan ("Ikut diskusi", "Sign-up sekarang"). Untuk Coming Soon mode, **5 perubahan**:

| Section | Original CTA | Ganti jadi |
|---|---|---|
| 1 (sticky banner) | "🔧 Versi BETA · Lagi bangun. [Ikut nimbrung →]" | "🔧 Akan Live Juni 2026 · Lagi bangun bareng komunitas. [Daftar early access ↓]" — anchor scroll ke form |
| 2 (Hero CTAs) | "Ikut diskusi →" + "Tanya Nala soal ini" | "Daftar early access →" (anchor ke form) + "Lihat preview ↗" (link ke `/preview-login`) |
| 5 (Nala strip CTA) | "Ngobrol bareng Nala →" | "Lihat Nala beraksi (preview) →" link ke `/preview-login` |
| 7 (Roadmap) | 3-column "Sudah Jadi / Sedang Dikerjakan / Antri" | TETAP — section ini sangat baik untuk transparency. Ganti header dari "Lagi bangun bareng" jadi "Apa yang dibangun saat ini" |
| 9 (CTA "Bikin paspor") | "Bikin paspor saya →" | Ganti jadi besar email opt-in form: "Daftar untuk dapat notifikasi launch" + email field + "Beri tahu saya" button |

Section 3 (Apa itu), 4 (6 hal), 6 (Chapter regional), 8 (Traksi), 10 (FAQ), 11 (Footer) **tetap copy-paste dari Landing_Page_Beta_Copy.md tanpa perubahan**. Itu kekuatan brand utama.

## Detail per section

### Section 0 (META)

Page title: "Jubir Warga — Suara warga, rumahnya di sini. (Akan terbit Juni 2026)"
Meta description: ambil dari Landing copy section 0
OG image: hero illustration + tagline overlay 1200×630

### Section 1 (Sticky banner atas)

```tsx
<div className="bg-jw-cream border-b border-jw-line sticky top-0 z-30">
  <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center justify-center gap-3 text-sm">
    <span className="rounded-full bg-jw-coral px-2.5 py-0.5 text-xs font-semibold text-white">
      COMING SOON
    </span>
    <span className="text-jw-blue">
      Akan live <strong>Juni 2026</strong> — lagi bangun bareng komunitas.
    </span>
    <a href="#early-access" className="text-jw-coral font-semibold hover:underline">
      Daftar early access ↓
    </a>
  </div>
</div>
```

### Section 2 (HERO)

Layout: 2 kolom desktop, stacked mobile.

**Kiri:**
- Eyebrow Caveat coral: tanggal hari ini Bahasa Indonesia (mis. "Senin, 28 April 2026") — generated server-side dari `formatDate(new Date(), { withDay: true })`
- Headline Vollkorn italic 64–80px, color blue: "Hari ini, *kita ngomongin* **Pasal 28E**." dengan squiggly underline coral di "Pasal 28E" (Spec #4 akan provide `<SquigglyUnderline>` component)
- Subheadline Inter 18px ink: "Hak berekspresi yang dijamin konstitusi — tapi seberapa jauh sudah dipraktikkan? Yuk kita ngobrolin."
- 2 CTA:
  - Primary coral "Daftar early access →" → anchor `#early-access`
  - Secondary outline blue "Lihat preview ↗" → link ke `/preview-login`

**Kanan:**
- Hero illustration #1 (orang muda baca dokumen di kafe) — Spec #4 #1 SVG
- Anotasi Caveat coral rotated -4°: "← baca!"

**Variasi hero topik harian** (5 pre-written, rotate by `new Date().getDay() % 5`):
1. "Hari ini, *kita ngomongin* RUU PPRT."
2. "Hari ini, *kita ngumpulin* opini soal subsidi BBM."
3. "Hari ini, *kita resah soal* tarif parkir liar."
4. "Hari ini, *kita nimbrung soal* mental health di kantor."
5. "Hari ini, *kita ngerayain* alumni Jubir Warga 2024."

Default Pasal 28E + 4 variasi rotation.

### Section 3 (Apa itu Jubir Warga)

Eyebrow uppercase muted: "TENTANG"
Headline Vollkorn 36px blue: "Rumah online untuk anak muda Indonesia."

Body Inter 16px ink (3 paragraf, copy verbatim dari Landing copy):
> "Jubir Warga adalah tempat ngumpul, bersuara, berkarya, dan belajar buat anak muda 17–39 tahun. Bukan platform demokrasi yang berat. Bukan media sosial dengan algoritma toxic. Ini rumah online di mana komunitas anak muda dari seluruh Indonesia bisa terkoneksi, ngomongin isu APA AJA — dari politik sampai mental health, dari budaya pop sampai kerja kantor toxic."

Tagline Caveat italic coral 24px: *"Suara warga, rumahnya di sini."*

4 ikon Lucide horizontal di-row: `MessageCircle` (Ngumpul), `Zap` (Bersuara), `Edit3` (Berkarya), `BookOpen` (Belajar).

### Section 4 (6 hal yang bisa kamu lakukan — pillars grid)

Eyebrow: "YANG BISA KAMU LAKUKAN"
Headline Vollkorn 32px blue: "6 hal yang bikin kamu betah di sini."

Card grid 3×2 (mobile: stack 1×6). Tiap card:
- Eyebrow Fira Code muted: "01" — "06"
- Title Vollkorn italic 22px blue: "Ngumpul" / "Berkarya" / "Belajar" / "Bersuara" / "Pantau" / "Main"
- Body Inter 14px ink (copy verbatim dari Landing copy section 4)
- Card variant: rounded-jw-lg, border-jw-line, hover translateY -3px

**6 cards** (label + body verbatim):
1. **Ngumpul (Komunitas)** — "Forum lintas isu (politik, mental health, budaya pop, kerja). Chapter regional Jakarta, Bandung, Malang. Sub-komunitas khusus untuk yang serius. Event mingguan online & offline."
2. **Berkarya (Karya)** — "Tulisan, vlog, ilustrasi, podcast, zine. Panggung anak muda yang punya isi. Kreator naik daun setiap minggu. AI Nala bantu draft & fact-check."
3. **Belajar (Kelas)** — "Kelas Jubir Warga 6 minggu (intensif). 6 kelas turunan dari mentor expert. Sertifikat resmi. Coach Nala nemenin tiap modul."
4. **Bersuara (Aksi)** — "Polling harian, petisi yang sampai ke pejabat, kampanye kolektif, lapor masalah konkret di sekitarmu (jalan rusak, banjir, sampah). Lapor masalah konkret yang sampai ke pemkot/pemkab daerahmu."
5. **Pantau (Tagih Janji)** — "Database janji pemerintah dari pusat sampai daerah. Status terlacak — Ditepati, Berjalan, Mandek, Diingkari. Bukti terverifikasi tim. Submit evidence sendiri."
6. **Main (Game)** — "Tebak Kata Hari Ini (civic Wordle), Spot the Hoaks, Tebak Pasal. Ringan harian, tetap ada bobotnya. Streak counter & leaderboard."

**Note**: ganti "AI Jubir" dari original copy → "AI Nala" (sesuai naming decision Mas).

### Section 5 (Nala strip)

Background: `bg-jw-blue` (dark blue full-width)
Eyebrow Caveat marigold 18px: "✦ TANYA NALA"

Headline Vollkorn italic 28px cream:
> "Beo curhatmu — *dengar kabar, ngasih tahu, sering tanya balik.*"

Body Inter 14px cream/77%:
"Selalu pakai sumber. Bilang 'aku belum tahu' kalau memang belum tahu."

CTA coral: "Lihat Nala beraksi (preview) →" → link ke `/preview-login`

Visual: Nala mascot expression `excited` di kiri (size 200), speech bubble di sebelahnya. Komponen `<NalaMascot expression="excited" size={200} />` dari Spec #4.

Sub-strip cream font kecil di bawah:
"4 mode Nala — Tanya Nala (general explainer) · Coach Kelas · Writing Partner · Advocacy Assistant"

### Section 6 (Chapter regional)

Eyebrow: "CHAPTER REGIONAL"
Headline Vollkorn 32px blue: "Chapter di kotamu, atau coming soon."

Card grid 3 kolom (responsive: 2-col tablet, 1-col mobile). Data hard-coded:

| Chapter | Status | Anggota | Event |
|---|---|---|---|
| Jakarta | Aktif | 342 | "Diskusi APBD DKI · 3 Mei 2026" |
| Bandung Raya | Aktif | 218 | "Nobar & Diskusi Film Dokumenter · 5 Mei 2026" |
| Malang Raya | Aktif | 156 | "Workshop Advokasi Lokal · 10 Mei 2026" |
| Surabaya | Coming soon | — | "Daftar antrean →" |
| Yogyakarta | Coming soon | — | "Daftar antrean →" |
| Medan | Coming soon | — | "Daftar antrean →" |
| Makassar | Coming soon | — | "Daftar antrean →" |

Note Caveat coral rotated -2°: "← chapter yang aktif tinggal pilih di onboarding"

### Section 7 (Roadmap publik) — TIDAK BANYAK BERUBAH

Header ganti: "Apa yang dibangun saat ini" (bukan "Lagi bangun bareng" — sudah implied di banner)

3 kolom (responsive stack):

**✓ Sudah Jadi**
- Beranda dengan janji harian
- Forum dasar 8 kategori
- Tagih Janji 200 janji terkurasi (5 provinsi)
- Mini game Tebak Kata Hari Ini
- Paspor Warga (cover + identitas)
- Brand & design system

**🔧 Sedang Dikerjakan** (gunakan Lucide `Wrench` icon, jangan emoji)
- Halaman Nala AI lengkap (4 mode + chat)
- Kelas Jubir Warga online (6 modul)
- Lapor Warga (8 kategori, mulai Jakarta)
- Karya: upload vlog & podcast
- Mobile app (iOS/Android)

**⏳ Antri (Q3–Q4 2026)** (gunakan Lucide `Hourglass` icon)
- Spot the Hoaks game
- Tebak Pasal game
- Dashboard partai politik (Tagih Janji)
- Direktori mitra & komunitas
- Sertifikat kelas verifiable on-chain

### Section 8 (Traksi)

Eyebrow: "TENTANG KAMI"
Headline Vollkorn 32px blue: "Bukan startup whiteboard. 3 tahun journey."

Body verbatim dari Landing copy section 8.

Stat blocks horizontal 4 cards (Fira Code besar):
- **90** alumni Kelas Jubir Warga 2024
- **3** chapter regional aktif
- **3** tahun journey & iterasi
- **5+** partnership institusional

Footer note muted small: "Mitra kerja: KitaBisa · Komisi.co · Indorelawan · ceksuaramu.com · Tempo Witness · LBH Jakarta · Yayasan Pulih."

### Section 9 (CTA — Early Access Form, ganti dari "Bikin paspor")

`id="early-access"` (anchor target dari banner & hero)

Background: `bg-jw-blue` (dark blue full-width)
Eyebrow: "GABUNG"
Headline Vollkorn italic 36px cream: "Mau jadi yang pertama tahu saat pintu beta dibuka?"
Subhead Inter 16px cream/77%: "Daftar email, kami kirim notifikasi sekali saja waktu launch — gak ada spam."

**Form `<EarlyAccessForm />`** (Client Component):
- Single email input (focus styled)
- Button coral "Beri tahu saya"
- Sub-text mini: "Kami tidak akan kirim spam. Cuma 1 email saat website launch."
- Success state: "✓ Terdaftar! Sampai jumpa Juni 2026."
- Error inline (Zod validation)

Sub-CTAs di bawah (3 link horizontal):
- "📧 Subscribe newsletter mingguan" → external link (Substack/Mailchimp TBD)
- "💬 Gabung WhatsApp komunitas" → external WA link (TBD, sementara `#`)
- "📷 Follow @jubirwarga.id di IG" → `https://instagram.com/jubirwarga.id`

### Section 10 (FAQ) — verbatim dari Landing copy

7 pertanyaan, accordion (collapse/expand). Default: semua tertutup. Q1 boleh default open.

Komponen: `<details><summary>` native HTML untuk progressive enhancement (no JS needed).

### Section 11 (Footer) — verbatim dari Landing copy

Background `bg-jw-blue`, text cream.

4 kolom:
- **Brand**: Logo SVG hand-drawn + tagline + alamat + mitra list
- **Platform**: 7 link (Komunitas, Karya, Kelas, Aksi, Tagih Janji, Main, AI Nala) — semua sementara link ke `/preview-login` karena belum live
- **Tentang**: 5 link (Cerita Kami, Tim, Partner, Karir, Press kit) — sementara `#`
- **Hubungi**: IG, Twitter, 3 email + button "Subscribe Newsletter"

Bottom strip:
"© 2026 Jubir Warga · Inisiatif SPD · Dalam pembentukan PT"
"Privasi · Syarat & Ketentuan · Kebijakan Konten · Etika AI"

---

## Preview gate implementation

### `lib/preview-gate/config.ts`

```ts
export const PREVIEW_COOKIE_NAME = 'jw_preview';
export const PREVIEW_COOKIE_VALUE = 'ok';
export const PREVIEW_COOKIE_MAX_AGE_SEC = 7 * 24 * 60 * 60;

export const PUBLIC_PATHS = [
  '/coming-soon',
  '/preview-login',
  '/api/healthcheck',
  '/api/early-access',
] as const;

export const PUBLIC_PREFIXES = [
  '/_next/',
  '/icons/',
  '/manifest.json',
  '/service-worker.js',
] as const;

export function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname as typeof PUBLIC_PATHS[number])) return true;
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  if (/\.(svg|png|jpg|jpeg|gif|webp|ico|woff2?)$/i.test(pathname)) return true;
  return false;
}
```

### `preview-login/actions.ts`

```ts
'use server';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { timingSafeEqual } from 'node:crypto';
import { PREVIEW_COOKIE_NAME, PREVIEW_COOKIE_VALUE, PREVIEW_COOKIE_MAX_AGE_SEC } from '@/lib/preview-gate/config';

const schema = z.object({
  password: z.string().min(1),
  next: z.string().regex(/^\/[^\/]/).optional(),  // valid relative path only
});

export async function submitPreviewPassword(_: unknown, formData: FormData) {
  const parsed = schema.safeParse({
    password: formData.get('password'),
    next: formData.get('next') || '/',
  });
  if (!parsed.success) return { ok: false, error: 'Password kosong' };

  const expected = Buffer.from(process.env.PREVIEW_PASSWORD ?? '', 'utf8');
  const actual = Buffer.from(parsed.data.password, 'utf8');
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    await new Promise((r) => setTimeout(r, 500));  // throttle brute force
    return { ok: false, error: 'Password salah' };
  }

  const cookieStore = await cookies();
  cookieStore.set(PREVIEW_COOKIE_NAME, PREVIEW_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: PREVIEW_COOKIE_MAX_AGE_SEC,
    path: '/',
  });

  redirect(parsed.data.next ?? '/');
}
```

### `middleware.ts` (UPDATE)

```ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { PREVIEW_COOKIE_NAME, PREVIEW_COOKIE_VALUE, isPublicPath } from '@/lib/preview-gate/config';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const gateEnabled = process.env.PREVIEW_GATE_ENABLED !== 'false';

  if (gateEnabled && !isPublicPath(pathname)) {
    const cookie = request.cookies.get(PREVIEW_COOKIE_NAME);
    if (cookie?.value !== PREVIEW_COOKIE_VALUE) {
      const url = request.nextUrl.clone();
      url.pathname = '/coming-soon';
      if (pathname !== '/') url.searchParams.set('intent', pathname);
      return NextResponse.redirect(url);
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|service-worker.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

---

## Database — early access signups

```sql
-- supabase/migrations/0003_early_access_signups.sql

create table public.early_access_signups (
  id           uuid primary key default gen_random_uuid(),
  email        text unique not null,
  source       text default 'landing-coming-soon',
  created_at   timestamptz default now(),
  notified_at  timestamptz,
  user_agent   text,
  referrer     text
);

create index idx_early_access_email on public.early_access_signups(email);

alter table public.early_access_signups enable row level security;

create policy "Anyone can sign up for early access"
  on public.early_access_signups
  for insert
  with check (true);

create policy "Admin can read signups"
  on public.early_access_signups
  for select
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
```

---

## API route

`apps/web/src/app/api/early-access/route.ts` — POST endpoint, validate email Zod, insert ke `early_access_signups`, handle dup (`23505` → success "sudah terdaftar").

---

## Acceptance checklist

- [ ] Migration `0003_early_access_signups.sql` applied
- [ ] Semua file di section "File yang dibuat" ada
- [ ] `apps/web/.env.local` punya `PREVIEW_PASSWORD=JubirWargaSuperApp2026` + `PREVIEW_GATE_ENABLED=true`
- [ ] **Visual landing**:
  - [ ] 11 section render lengkap (sticky banner, hero, apa itu, 6 pillars, Nala strip, chapter, roadmap, traksi, CTA form, FAQ, footer)
  - [ ] Hero topik rotate by day-of-week
  - [ ] Squiggly underline di hero — komponen Spec #4
  - [ ] Hero illustration #1 (orang baca dokumen) — komponen Spec #4
  - [ ] Nala mascot expression `excited` di Section 5
  - [ ] Logo SVG hand-drawn (BUKAN font Caveat) di header & footer
  - [ ] Semua warna sesuai 11 token (cek visual: cream + blue dominan)
  - [ ] Tipografi: Vollkorn untuk headline, Inter untuk body, Caveat untuk eyebrow & anotasi, Fira Code untuk angka stat
  - [ ] Mobile responsive 375px (test Chrome DevTools)
- [ ] **Smoke test gate**:
  - [ ] Buka `localhost:3000/` → redirect ke `/coming-soon`
  - [ ] Buka `localhost:3000/komunitas` → redirect ke `/coming-soon?intent=/komunitas`
  - [ ] `/coming-soon` render tanpa redirect
  - [ ] `/preview-login` render password form
  - [ ] `/api/healthcheck` tetap 200 JSON
- [ ] **Form opt-in**:
  - [ ] Submit valid email → success message + row baru di DB
  - [ ] Submit duplicate → success "sudah terdaftar"
  - [ ] Submit invalid → error inline
- [ ] **Password gate**:
  - [ ] Submit salah → error + 500ms delay
  - [ ] Submit benar (`JubirWargaSuperApp2026`) → cookie set + redirect ke `/`
  - [ ] Akses semua halaman beta tanpa diminta password lagi
  - [ ] Clear cookie → redirect lagi ke `/coming-soon`
- [ ] **Disable test**: set `PREVIEW_GATE_ENABLED=false`, restart, semua halaman accessible

## Out of scope

- ❌ Per-investor invite code
- ❌ Magic link via email untuk preview access
- ❌ Admin dashboard untuk lihat list early-access signup (Sprint 3+)
- ❌ Email service untuk auto-notif saat launch (Sprint 4)
- ❌ A/B test variasi hero topik

## Security audit (planner WAJIB review)

- [ ] `timingSafeEqual` untuk password compare
- [ ] Cookie `httpOnly: true`, `secure: true` di production, `sameSite: 'lax'`
- [ ] Path traversal di `intent` param — Zod regex sudah validate `/^\/[^\/]/`
- [ ] Server Action CSRF built-in Next.js
- [ ] Password TIDAK ke-log di server console
- [ ] Email signups TIDAK accessible oleh anon (RLS policy admin-only read)

## Decisions yang sudah diputuskan Mas (resolved 2026-04-29)

1. **Domain canonical**: pakai `jubir.spdindonesia.org` sekarang (domain `jubirwarga.id` belum dibeli — masih bareng kantor SPD). Saat rilis Juni 2026, akan ganti ke `jubirwarga.id` atau ikut investor. Implementasi: env-driven via `NEXT_PUBLIC_CANONICAL_URL`. Tinggal flip env var saat domain final ditentukan, tidak perlu code change.
2. **WhatsApp link**: belum dibuat (group WA belum ada). Sementara `'#'` di constants. TODO marker eksplisit di file `external-links.ts`.
3. **Newsletter**: Substack untuk awal (mungkin pindah ke internal nanti, tergantung evaluasi). Sementara `'#'` di constants. Mas akan share Substack URL setelah set up.

# Spec #17 — Visual polish: match Phase 1 fidelity

**Sprint**: 3 (post-implementation polish)
**Owner**: Claude Code (executor) · audited oleh planner
**Estimasi**: 2.5-4 jam
**Dependency**: Sprint 3 specs #7-#13 landed (commit `72ce58c`)
**Source**: User request 2026-05-04 — "rapihin frontend biar sebagus jubir.spdindonesia.org"
**Reference live**: `https://jubir.spdindonesia.org` (Phase 1 production)
**Reference local**: `apps/legacy/src/**` (Phase 1 source)

**Decisions Mas (approved 2026-05-04):**
1. ✅ Match visual fidelity Phase 1 — animations, hover effects, loading states, footer
2. ✅ Port reusable patterns dari `apps/legacy/src/components/` ke Phase 2
3. ✅ JANGAN sentuh page.tsx files yang Window 1 (Spec #16) sedang edit

**Required reading sebelum mulai:**
1. `CLAUDE.md` §5 (design system) — 11 color token, microinteraction list di §5.7
2. `apps/legacy/docs/Prompt_Claude_Design_Jubir_Warga_v2.md` Section 2.5 (15 ilustrasi) + Section 5 (microinteraction)
3. `apps/legacy/src/components/**` — Phase 1 components yang sudah polished (vote-arrow, card-hover, ripple, footer)
4. `apps/legacy/src/styles/global.css` — animation keyframes Phase 1
5. `memory.md` (locked decisions Nala claymorphism + 11 brand color)

---

## Goal

Bawa visual fidelity Phase 2 (`apps/web`) **setara Phase 1** (`jubir.spdindonesia.org`). Phase 1 sudah established design system polished — Phase 2 visual basic-OK tapi masih kurang microinteractions, hover effects, loading skeletons, footer, dan claymorphism Nala.

Setelah spec ini selesai:
- Hover card: `translateY -3px + shadow` halus (CLAUDE.md §5.7)
- Klik tombol: `scale 0.97 + ripple` optional
- Vote arrow: turn coral on hover, scale 1.1 on click
- Stempel masuk paspor: rotate animation + tilt acak
- Nala typing dot bouncing animation (kalau belum ada)
- Page transition: fade in 200ms
- Loading skeletons untuk semua async section (Komunitas list, Karya grid, Tagih cards)
- Footer Phase 1 di-port (link sosmed, tentang, privasi, syarat, contact info dari CLAUDE.md §12)
- Mobile responsive 375px verify (Phase 1 sudah polish, Phase 2 perlu cek)

---

## Issues to fix (Phase 1 → Phase 2 gap)

### A. Microinteractions missing

| Effect | Phase 1 lokasi | Phase 2 status | Fix |
|---|---|---|---|
| Card hover translate | semua card komunitas/karya/kelas | ❌ Belum ada | Add `hover:-translate-y-0.5 hover:shadow-jw-md transition` ke card wrapper |
| Button click scale | semua CTA button | ❌ Belum ada | Add `active:scale-[0.97] transition` ke button |
| Vote arrow color + scale | komunitas + karya | ⚠️ Render statis | Add hover state `hover:text-jw-coral`, click `scale-110` |
| Page fade-in | route transition | ❌ Belum ada | Add `animate-in fade-in duration-200` di layout/page wrapper |

### B. Loading skeletons missing

| Page | Async section | Skeleton component |
|---|---|---|
| `/komunitas` | Thread list (fetch 225 thread) | BARU `thread-list-skeleton.tsx` |
| `/karya` | Karya grid (fetch 42 karya) | BARU `karya-grid-skeleton.tsx` |
| `/kelas` | Kelas grid | BARU `kelas-grid-skeleton.tsx` |
| `/aksi` | Polling + Petisi cards | BARU `aksi-skeleton.tsx` |
| `/tagih` | Janji list + map + stats | BARU `tagih-skeleton.tsx` (verify sudah ada `JanjiSkeleton` di `components/beranda/janji-tracker.tsx`) |
| `/main` | Streak count fetch | Streak skeleton inline |

**Pattern**: Suspense boundary di Server Component, fallback ke Skeleton (`bg-jw-pill-grey-bg animate-pulse rounded`).

### C. Footer missing / minimal

**Phase 1 footer** (cek `apps/legacy/src/components/layout/Footer.jsx` atau equivalent) berisi:
- Logo + tagline kerja
- 4 column link grid:
  - Produk: Komunitas, Karya, Kelas, Tagih, Aksi, Main
  - Tentang: Tentang Jubir Warga, Tim, Kontak, Press
  - Legal: Privasi, Syarat, Etika
  - Sosmed: IG @jubirwarga.id, Twitter, TikTok, YouTube
- Contact info: `info@jubirwarga.id`, `partnerships@jubirwarga.id`, `press@jubirwarga.id`
- Address: Jl. Tebet Barat Dalam IIC No. 14, Tebet, Jakarta Selatan
- Copyright: `© 2026 Jubir Warga · A community space by SPD Indonesia`
- Beta disclaimer: "Sekarang masih beta — feedback ke @jubirwarga.id"

**File baru**: `apps/web/src/components/site-footer.tsx`

**Wire**: Import di `apps/web/src/app/layout.tsx` setelah `{children}`.

### D. Nala claymorphism check

**File**: `apps/web/src/components/nala/nala-mascot.tsx` (atau equivalent)

**Phase 1 reference**: `apps/legacy/src/components/nala/Nala.jsx` — claymorphism dengan gradient + 5 ekspresi (curious, excited, mentor, thinking, confident).

**Verify**:
- 5 SVG variant ada di Phase 2 (curious.svg, excited.svg, mentor.svg, thinking.svg, confident.svg) atau di-render dynamically
- Claymorphism gradient applied (radial gradient + soft shadow)
- Typing dot bounce animation kalau Nala lagi "thinking"

Kalau gap → port SVG + animation dari Phase 1.

### E. Mobile responsive 375px verify

**Method**: Chrome DevTools → Device toolbar → iPhone SE (375x667).

**Pages to verify**:
- `/` Beranda
- `/komunitas` (sidebar collapsing?)
- `/karya` (grid → single column?)
- `/kelas` (featured card responsive?)
- `/aksi` (polling card not overflow?)
- `/tagih` (stats grid 2x2 di mobile?)
- `/main` + `/main/tebak-kata` (tile grid 5 columns harus muat 375px - 24px padding = 351px)
- `/main/tebak-pejabat` (foto + 4 choice button stacking?)

**Fix**: Apply Tailwind responsive prefix `md:` untuk desktop-only style, base = mobile.

---

## File yang dibuat

```
apps/web/src/components/
├── site-footer.tsx                              BARU — full footer 4 col
├── skeletons/
│   ├── thread-list-skeleton.tsx                 BARU
│   ├── karya-grid-skeleton.tsx                  BARU
│   ├── kelas-grid-skeleton.tsx                  BARU
│   ├── aksi-skeleton.tsx                        BARU
│   └── tagih-skeleton.tsx                       BARU
└── ui/
    ├── card-hover.tsx                           BARU (optional wrapper, atau utility class)
    └── animated-vote.tsx                        BARU (vote arrow dengan microinteraction)
```

## File yang diubah

```
apps/web/src/app/layout.tsx                      Wire <SiteFooter />
apps/web/src/styles/globals.css                  Add keyframe untuk fade-in, ripple (kalau belum ada di Tailwind v4)
apps/web/src/app/komunitas/page.tsx              Wrap thread list dengan <Suspense fallback={<ThreadListSkeleton />}>
apps/web/src/app/karya/page.tsx                  Wrap grid dengan Suspense + skeleton
apps/web/src/app/kelas/page.tsx                  Wrap grid dengan Suspense + skeleton
apps/web/src/app/aksi/page.tsx                   Wrap card dengan Suspense + skeleton
apps/web/src/app/tagih/page.tsx                  Wrap janji list dengan Suspense + skeleton
apps/web/src/components/komunitas/thread-card.tsx (atau equivalent) — add hover translate
apps/web/src/components/komunitas/vote-arrow.tsx — add color + scale microinteraction
apps/web/src/components/karya/karya-card.tsx (atau equivalent) — add hover translate
apps/web/src/components/nala/nala-mascot.tsx     Verify claymorphism + 5 ekspresi (port kalau gap)
```

## File yang TIDAK diubah (Window 1 Spec #16 territory)

- ❌ `apps/web/src/app/page.tsx` (Beranda)
- ❌ `apps/web/src/app/aksi/page.tsx` (subtitle edit, BUT body Spec #17 boleh edit kalau wrap Suspense — koordinasi: Spec #16 first, push, Spec #17 pull rebase)
- ❌ `apps/web/src/components/site-header.tsx` (Spec #16 add /main nav)
- ❌ `apps/web/public/manifest.json` + `icons/` (Spec #16 port)

**Coordination dengan Window 1**:
- Window 1 commit Spec #16 dulu, push.
- Window 2 (this spec) pull, rebase clean, lanjut.
- Atau parallel: Window 1 pakai branch `chore/16-tier-a`, Window 2 pakai `feat/17-visual-polish`. Merge sequential.

## File yang TIDAK diubah (Window 3 Spec #18 territory)

- ❌ `apps/web/src/lib/sentry/*`
- ❌ `apps/web/src/instrumentation.ts`
- ❌ `apps/web/src/app/error.tsx`
- ❌ `apps/web/src/app/global-error.tsx`
- ❌ env example files

---

## Step-by-step

### 1. Microinteractions — Tailwind utility additions

**`apps/web/src/styles/globals.css`** — verify keyframe ada (Tailwind v4 `@theme` syntax kalau perlu custom):

```css
@theme {
  --animate-fade-in: fade-in 200ms ease-out;
  --animate-bounce-dot: bounce-dot 1.4s infinite;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounce-dot {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  50% { transform: translateY(-4px); opacity: 1; }
}
```

**Card hover** — apply ke setiap `<article>` atau card wrapper:
```diff
- <article className="rounded-jw-md border border-jw-line bg-white p-4">
+ <article className="rounded-jw-md border border-jw-line bg-white p-4 hover:-translate-y-0.5 hover:shadow-jw-md transition-all duration-200">
```

**Button click scale** — apply ke semua button + Link styled-as-button:
```diff
- className="rounded-jw-md bg-jw-coral px-4 py-2 ..."
+ className="rounded-jw-md bg-jw-coral px-4 py-2 ... active:scale-[0.97] transition-transform"
```

**Vote arrow** — extract ke `components/ui/animated-vote.tsx`:
```tsx
'use client';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function AnimatedVote({ count, onVote }: { count: number; onVote: (dir: 1 | -1) => void }) {
  const [bumping, setBumping] = useState<'up' | 'down' | null>(null);
  const handleClick = (dir: 1 | -1) => {
    setBumping(dir === 1 ? 'up' : 'down');
    onVote(dir);
    setTimeout(() => setBumping(null), 200);
  };
  return (
    <div className="flex flex-col items-center gap-1 text-jw-muted">
      <button
        type="button"
        onClick={() => handleClick(1)}
        className={`hover:text-jw-coral transition ${bumping === 'up' ? 'scale-110' : ''}`}
      >
        <ChevronUp size={18} />
      </button>
      <span className="text-sm font-bold text-jw-blue">{count}</span>
      <button
        type="button"
        onClick={() => handleClick(-1)}
        className={`hover:text-jw-coral transition ${bumping === 'down' ? 'scale-110' : ''}`}
      >
        <ChevronDown size={18} />
      </button>
    </div>
  );
}
```

### 2. Loading skeletons

**Pattern** untuk setiap skeleton:
```tsx
export function ThreadListSkeleton() {
  return (
    <ul className="space-y-3" aria-label="Memuat thread...">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="rounded-jw-md border border-jw-line bg-white p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-3/4 bg-jw-pill-grey-bg rounded" />
            <div className="h-3 w-full bg-jw-pill-grey-bg rounded" />
            <div className="h-3 w-1/2 bg-jw-pill-grey-bg rounded" />
            <div className="h-2 w-1/4 bg-jw-pill-grey-bg rounded mt-3" />
          </div>
        </li>
      ))}
    </ul>
  );
}
```

**Wire di page**:
```tsx
import { Suspense } from 'react';
import { ThreadListSkeleton } from '@/components/skeletons/thread-list-skeleton';

export default async function KomunitasPage() {
  return (
    <div>
      <header>...</header>
      <Suspense fallback={<ThreadListSkeleton />}>
        <ThreadList />
      </Suspense>
    </div>
  );
}

async function ThreadList() {
  const supabase = await createClient();
  const { data } = await supabase.from('threads').select(...);
  return <ul>{data?.map(...)}</ul>;
}
```

Replicate untuk Karya, Kelas, Aksi, Tagih.

### 3. Footer

**`apps/web/src/components/site-footer.tsx`**:

```tsx
import Link from 'next/link';
import { Instagram, Twitter, Youtube } from 'lucide-react';
import { JwLogo } from './jw-logo';

const PRODUCT_LINKS = [
  { href: '/komunitas', label: 'Komunitas' },
  { href: '/karya', label: 'Karya' },
  { href: '/kelas', label: 'Kelas' },
  { href: '/tagih', label: 'Janji' },
  { href: '/aksi', label: 'Aksi' },
  { href: '/main', label: 'Main' },
];

const ABOUT_LINKS = [
  { href: '/tentang', label: 'Tentang Jubir Warga' },
  { href: '/tim', label: 'Tim' },
  { href: '/kontak', label: 'Kontak' },
  { href: '/press', label: 'Press' },
];

const LEGAL_LINKS = [
  { href: '/privasi', label: 'Privasi' },
  { href: '/syarat', label: 'Syarat' },
  { href: '/etika', label: 'Etika' },
];

const SOCIAL_LINKS = [
  { href: 'https://instagram.com/jubirwarga.id', label: 'Instagram', Icon: Instagram },
  { href: 'https://twitter.com/jubirwarga', label: 'Twitter', Icon: Twitter },
  { href: 'https://youtube.com/@jubirwarga', label: 'YouTube', Icon: Youtube },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-jw-line bg-jw-cream/40 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2 md:col-span-2">
            <JwLogo size={32} />
            <p className="mt-3 text-sm text-jw-ink/70 max-w-xs">
              Suara warga, rumahnya di sini. VICE Indonesia × Discord × Coursera × Change.org × Wordle, dengan AI sebagai sahabat.
            </p>
            <p className="mt-4 text-xs text-jw-muted">
              Sekarang masih beta. Feedback ke{' '}
              <a href="mailto:info@jubirwarga.id" className="text-jw-coral hover:underline">
                info@jubirwarga.id
              </a>
            </p>
          </div>
          <FooterColumn title="Produk" links={PRODUCT_LINKS} />
          <FooterColumn title="Tentang" links={ABOUT_LINKS} />
          <FooterColumn title="Legal" links={LEGAL_LINKS} />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-6 border-t border-jw-line">
          <div className="text-xs text-jw-muted">
            © 2026 Jubir Warga · A community space by SPD Indonesia
            <br />
            Jl. Tebet Barat Dalam IIC No. 14, Tebet, Jakarta Selatan
          </div>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-jw-ink/70 hover:text-jw-coral transition"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-jw-muted uppercase tracking-wide mb-3">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-jw-ink hover:text-jw-coral transition">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Wire** di `apps/web/src/app/layout.tsx`:
```diff
  <body>
    <SiteHeader user={user} />
    <main>{children}</main>
+   <SiteFooter />
  </body>
```

### 4. Nala claymorphism verify

**Inspect** `apps/web/src/components/nala/*` files.

**Cek**:
1. SVG mascot ada 5 ekspresi atau 1 generic? (Phase 1 reference: `apps/legacy/src/components/nala/`)
2. Claymorphism gradient applied? (radial gradient + soft inner shadow)
3. Typing animation (3 dot bouncing) kalau lagi load?

**Kalau gap**:
- Port SVG dari `apps/legacy/public/nala/*.svg` ke `apps/web/public/nala/*.svg`
- Atau copy inline SVG dari `apps/legacy/src/components/nala/Nala.jsx` ke Phase 2 component
- Add typing dot animation pakai keyframe `bounce-dot` (lihat step 1)

### 5. Mobile responsive verify

**Method**:
1. Run `pnpm dev`
2. Chrome DevTools → toggle device toolbar
3. Iterate: 375 (iPhone SE), 390 (iPhone 12), 768 (iPad portrait)
4. Per page, check:
   - Tidak ada horizontal scroll
   - Text readable (min 14px body)
   - Touch target min 44px
   - Card grid collapse ke single column < 768px
   - Hero illustration scale proportional

**Fix per gap**:
- Tambah `md:` prefix untuk desktop-only style
- Replace fixed width dengan `max-w-*` + `w-full`
- Adjust padding `px-4 md:px-6 lg:px-8`

### 6. Smoke test

1. `pnpm typecheck` 0 error
2. `pnpm lint` 0 new warning
3. `pnpm test` 195/195 pass (no test break)
4. `pnpm dev` manual click-through:
   - Hover semua card → translate + shadow ✅
   - Click vote arrow → coral + scale ✅
   - Loading skeletons tampil sebelum data load (network throttle untuk verify)
   - Footer tampil di semua page dengan 4 column + sosmed icon
   - Nala mascot render dengan claymorphism + ekspresi varian
   - Mobile 375px no horizontal scroll, semua page render

---

## Acceptance checklist

- [ ] Hover card animation (translate + shadow) di Komunitas, Karya, Kelas, Aksi, Tagih, Main game cards
- [ ] Button active scale di semua CTA (Daftar, Masuk, Daftar gratis, Vote, Pantau janji, etc.)
- [ ] Vote arrow microinteraction (hover coral + click scale)
- [ ] Page fade-in transition (200ms duration)
- [ ] Loading skeletons render di Komunitas, Karya, Kelas, Aksi, Tagih (Suspense fallback)
- [ ] Footer render di semua page dengan: logo + tagline, 3 column link, sosmed icon, copyright + address
- [ ] Footer responsive: stack di mobile, grid di desktop
- [ ] Footer beta disclaimer dengan email feedback link
- [ ] Nala mascot render dengan claymorphism gradient (verify visual match Phase 1)
- [ ] Nala typing dot bouncing animation kalau lagi load response
- [ ] Mobile 375px: no horizontal scroll di semua page (15 page tested)
- [ ] Mobile 375px: touch target min 44px (button, link, vote arrow)
- [ ] Tebak Kata grid 5 col muat 375px (351px effective width)
- [ ] `pnpm typecheck` + `pnpm lint` + `pnpm test` pass

## Out of scope (defer)

- ❌ 15 SVG ilustrasi port lengkap (CLAUDE.md §5.5) — Spec terpisah pre-launch (atau sudah di-port partial via Sprint 2)
- ❌ Custom SVG icon set (CLAUDE.md §5.4 Tier 2) — Sprint 4-5 BACKLOG
- ❌ Custom SVG emoji set (CLAUDE.md §5.4b Tier 2) — Sprint 4-5 BACKLOG
- ❌ Page-specific re-design (Komunitas thread layout, Karya grid alternatif) — separate spec kalau perlu
- ❌ Dark mode — out of scope beta launch
- ❌ Accessibility audit (a11y) — separate spec post-Sprint 3

## Notes untuk planner audit

Aku akan audit:
- Hover animation visible di Chrome DevTools inspector (computed style)
- Loading skeleton render saat network throttled (Slow 3G)
- Footer render visual match Phase 1 (screenshot comparison)
- Nala claymorphism gradient ada (computed background-image)
- Mobile 375px screenshot per page tidak ada overflow
- Test suite tetap 195+ pass

## Commit message

```
feat(web): visual polish — match Phase 1 fidelity

- Microinteractions: hover translate cards, button active scale, vote arrow color + scale
- Loading skeletons: thread-list, karya-grid, kelas-grid, aksi, tagih (Suspense fallback)
- Footer: full 4-col layout (Produk/Tentang/Legal) + sosmed icon + beta disclaimer + contact
- Nala claymorphism: verified 5 ekspresi + typing dot bouncing animation
- Mobile responsive: 375px verify no overflow, touch target ≥ 44px

Per Spec #17. Source: jubir.spdindonesia.org Phase 1 reference.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

## WAJIB INCLUDE spec file

```bash
git add apps/web/src/components/site-footer.tsx \
        apps/web/src/components/skeletons/ \
        apps/web/src/components/ui/animated-vote.tsx \
        apps/web/src/styles/globals.css \
        apps/web/src/app/layout.tsx \
        apps/web/src/app/komunitas/page.tsx \
        apps/web/src/app/karya/page.tsx \
        apps/web/src/app/kelas/page.tsx \
        apps/web/src/app/tagih/page.tsx \
        apps/web/src/components/komunitas/ \
        apps/web/src/components/karya/ \
        apps/web/src/components/nala/ \
        specs/SPRINT-3/17-visual-polish.md
```

## Coordinate paralel — file ownership map

**Window 1 (Spec #16 — Tier A cleanup) territory**:
- `apps/web/src/app/page.tsx` (Beranda)
- `apps/web/src/app/tagih/[id]/page.tsx`
- `apps/web/src/app/karya/page.tsx` (HANYA edit hapus dev meta line) — ⚠️ POTENTIAL CONFLICT karena Spec #17 juga edit Karya page untuk wrap Suspense
- `apps/web/src/app/tagih/page.tsx` (HANYA edit hapus dev meta line) — ⚠️ POTENTIAL CONFLICT karena Spec #17 juga edit Tagih page untuk wrap Suspense
- `apps/web/src/components/site-header.tsx`
- `apps/web/public/`

**Window 2 (Spec #17 — Visual polish, this spec) territory**:
- `apps/web/src/components/site-footer.tsx` (BARU)
- `apps/web/src/components/skeletons/*` (BARU)
- `apps/web/src/components/ui/animated-vote.tsx` (BARU)
- `apps/web/src/components/nala/*` (verify + port kalau gap)
- `apps/web/src/components/komunitas/*` (microinteraction ke card/vote)
- `apps/web/src/components/karya/*`
- `apps/web/src/styles/globals.css`
- `apps/web/src/app/layout.tsx` (wire Footer)

**Window 3 (Spec #18 — Tier 1 ops) territory**:
- `apps/web/src/lib/sentry/*` (BARU)
- `apps/web/src/instrumentation.ts` (BARU)
- `apps/web/src/app/error.tsx` (BARU)
- `apps/web/src/app/global-error.tsx` (BARU)

**Conflict resolution Window 1 ↔ Window 2 di karya/page.tsx + tagih/page.tsx**:

Strategy: **sequential merge** untuk 2 file ini.

1. Window 1 (Spec #16) commit dulu dengan changes minimal (hapus dev meta line saja).
2. Push ke main.
3. Window 2 (Spec #17) pull rebase, lanjut wrap Suspense — base sudah include cleanup.

ATAU:

1. Window 2 (Spec #17) commit dulu dengan Suspense wrapper.
2. Push.
3. Window 1 (Spec #16) pull rebase, hapus dev meta + nav link addition — base sudah include Suspense.

**Pilih sequential**: Window 1 dulu (smaller scope, quick), lalu Window 2 + Window 3 paralel.

Atau sebaliknya kalau Window 2 ready lebih cepat.

**Pull-rebase reflex** wajib sebelum push setiap window.

---

## Update STATUS.md

Setelah commit, update `specs/SPRINT-3/STATUS.md`:
- Add row Spec #17 status DONE dengan commit hash
- Note: visual polish match Phase 1 fidelity

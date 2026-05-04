# Spec #20 — Mobile responsive audit + fix 375px

**Sprint**: 3 (post-implementation)
**Owner**: Claude Code (executor) · audited oleh planner
**Estimasi**: 2-3 jam
**Dependency**: Spec #17 visual polish (commit batch 1) sudah landed
**Source**: AUDIT_PRE_BETA Tier 2 IMPORTANT — mobile audit gap
**Window**: C (batch 2 paralel — `md:` prefix + per-component responsive fix)

**Decisions Mas (approved 2026-05-04):**
1. ✅ Target viewport: 375px (iPhone SE) sebagai baseline mobile
2. ✅ Method: Chrome DevTools device emulation per page
3. ✅ Fix philosophy: mobile-first (base = mobile, `md:` prefix untuk desktop)

**Required reading:**
1. `CLAUDE.md` §5 (design system — composition rules)
2. Tailwind v4 responsive prefix doc (sm/md/lg/xl/2xl breakpoint)
3. `apps/legacy/src/styles/global.css` — Phase 1 reference (sudah polish 375px per task #41)

---

## Goal

Audit semua page Phase 2 di viewport 375px (iPhone SE). Fix issue yang ditemukan: horizontal scroll, overflow, touch target < 44px, text terlalu kecil, grid yang gak collapse.

Setelah spec ini selesai:
- 15 page render bersih di 375px tanpa horizontal scroll
- Setiap touch target ≥ 44x44px (button, link, vote, chip)
- Body text ≥ 14px, headline scale proportional
- Grid layout collapse ke 1 column di mobile, 2-3 column di tablet, 3-4 column di desktop

---

## 15 page yang di-audit

| # | Page | Specific concern di 375px |
|---|---|---|
| 1 | `/` Beranda | Hero illustration scale, card grid 3-col → 1-col |
| 2 | `/komunitas` | Sidebar (Topik/Lokasi/Format) collapse ke top atau drawer |
| 3 | `/komunitas/[id]` | Reply tree indentation, vote arrow size, "Ringkas via Nala" CTA |
| 4 | `/karya` | Pilihan Editor 5-card horizontal scroll, Top kreator sidebar |
| 5 | `/karya/[id]` | ReadingView max-width prose, padding |
| 6 | `/kelas` | Featured class card, grid kelas |
| 7 | `/kelas/[id]` | Silabus + mentor + daftar form |
| 8 | `/aksi` | Polling card, Petisi cards stacking |
| 9 | `/aksi/petisi/[id]` | Body + sign action button |
| 10 | `/tagih` | Stats grid 4-col → 2-col, map provinsi, partai bars |
| 11 | `/tagih/[id]` | Pejabat card + Status card stacking |
| 12 | `/profil` (gated) | (redirect /masuk, audit /masuk + /daftar) |
| 13 | `/main` | 2 game card stacking |
| 14 | `/main/tebak-kata` | Tile grid 5 col MUST fit 351px (375 - 24 padding) |
| 15 | `/main/tebak-pejabat` | Foto + 4 choice button stacking |

---

## File yang diubah

```
apps/web/src/styles/globals.css                     (kalau perlu — mostly Tailwind utility cukup)
apps/web/src/components/site-header.tsx             ⚠️ POTENTIAL CONFLICT: kalau Spec #16 sudah add /main link, JANGAN re-edit nav structure. HANYA touch responsive class.
apps/web/src/components/site-footer.tsx             ⚠️ POTENTIAL CONFLICT: Spec #17 BARU bikin file ini, audit responsive
apps/web/src/components/komunitas/*                 Per-component md: prefix
apps/web/src/components/karya/*                     Per-component md: prefix
apps/web/src/components/kelas/*
apps/web/src/components/aksi/*
apps/web/src/components/tagih/*
apps/web/src/components/main/*                      Tebak Kata tile grid CRITICAL (5 col fit 351px)
apps/web/src/app/komunitas/page.tsx                 Sidebar layout responsive
apps/web/src/app/karya/page.tsx                     Top kreator sidebar responsive
apps/web/src/app/tagih/page.tsx                     Stats grid 4-col → 2-col mobile
```

## File yang TIDAK diubah

- ❌ Apa pun yang Window A (Nala mock), Window B (karya content SQL), Window D (a11y), Window E (deploy) lagi edit
- ❌ Backend/API logic (out of mobile responsive scope)
- ❌ Test files kecuali snapshot break

---

## Step-by-step

### 1. Setup Chrome DevTools device emulation

1. Open `localhost:3000`
2. F12 → toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone SE (375x667)" atau set custom 375x812
4. Disable cache (Network tab)

### 2. Per page audit checklist

Per 15 page di atas, capture:
- ✅ No horizontal scroll (check body width = viewport width)
- ✅ Hero illustration: max-width 100%, height proportional
- ✅ Card grid: 1 column di < 768px, 2 col di 768-1024px, 3+ col di > 1024px
- ✅ Touch target: button + link + icon button ≥ 44x44px
- ✅ Body text: ≥ 14px (font-sm Tailwind = 14px OK)
- ✅ Headline: scale dari 4xl → 3xl → 2xl saat viewport mengecil
- ✅ Padding: `px-4 md:px-6 lg:px-8` pattern
- ✅ Sticky element (header) tidak overflow
- ✅ Modal/drawer overlay full-screen di mobile

### 3. Fix patterns

**Card grid collapse**:
```diff
- <div className="grid grid-cols-3 gap-6">
+ <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
```

**Stats grid 4-col → 2-col**:
```diff
- <div className="grid grid-cols-4 gap-4">
+ <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
```

**Sidebar collapse**:
```diff
- <div className="flex">
-   <aside className="w-64">...</aside>
-   <main className="flex-1">...</main>
- </div>
+ <div className="flex flex-col md:flex-row gap-6">
+   <aside className="w-full md:w-64 md:flex-shrink-0">...</aside>
+   <main className="flex-1 min-w-0">...</main>
+ </div>
```

**Tebak Kata tile grid CRITICAL** — 375 viewport - 24px padding × 2 = 327px effective. 5 tiles dengan gap-1 (4px × 4 = 16px) = 311px / 5 = ~62px per tile.

```diff
- <div className="grid grid-cols-5 gap-1.5 max-w-md">
+ <div className="grid grid-cols-5 gap-1 md:gap-1.5 px-3 md:px-0 max-w-[327px] md:max-w-md mx-auto">
```

**Touch target enlarge**:
```diff
- <button className="p-1">
-   <ChevronUp size={14} />
- </button>
+ <button className="p-2.5">  {/* 10px padding × 2 + 14px icon = 34px... still small */}
+   <ChevronUp size={20} />     {/* OR enlarge icon to hit 44px */}
+ </button>
```

Atau pakai utility `min-h-[44px] min-w-[44px] flex items-center justify-center`.

**Headline scale**:
```diff
- <h1 className="text-5xl">
+ <h1 className="text-3xl md:text-4xl lg:text-5xl">
```

**Hero illustration**:
```diff
- <Image src="/hero.svg" width={500} height={400} />
+ <Image src="/hero.svg" width={500} height={400} className="w-full max-w-md md:max-w-lg h-auto" />
```

### 4. Sticky header verify

`apps/web/src/components/site-header.tsx`:
- Header `sticky top-0` jangan overflow di mobile (nav 6 surface mungkin > 375px)
- Solution: hidden nav di mobile, hamburger menu (kalau prioritized) atau scroll horizontal nav (less ideal)

**Default fix**: `hidden md:flex` di nav, tampilkan hamburger placeholder untuk mobile (Spec terpisah implement hamburger fully kalau perlu).

```diff
- <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
+ <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium">  {/* shrink gap di tablet */}
```

Mobile: keep "hidden" current (sudah right). Catatan: nav 6 surface gak terlihat di mobile = UX gap. Sprint 4: hamburger menu spec.

### 5. Tebak Pejabat 4-choice stacking

```diff
- <div className="grid grid-cols-2 gap-3">
-   {choices.map((c) => <button>...</button>)}
- </div>
+ <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
+   {choices.map((c) => <button>...</button>)}
+ </div>
```

Atau biarkan 2 col di mobile kalau muat (4 choice short text).

### 6. Smoke test

1. Chrome DevTools 375px iterate 15 page
2. Screenshot per page (folder `audit-screenshots/mobile-375/` untuk evidence)
3. List remaining issue di `docs/MOBILE_AUDIT_2026-05-04.md`
4. `pnpm typecheck` + `pnpm lint` + `pnpm test` pass

---

## Acceptance checklist

- [ ] 15 page audited di 375px viewport, screenshot per page
- [ ] No horizontal scroll di 15 page (verify via `document.documentElement.scrollWidth === window.innerWidth`)
- [ ] Card grid: collapse 1 col mobile, 2-3 col tablet, 3+ col desktop
- [ ] Touch target ≥ 44x44px untuk button, link, vote arrow, chip
- [ ] Body text ≥ 14px
- [ ] Headline scale (text-3xl mobile → text-5xl desktop)
- [ ] Tebak Kata tile grid muat 375px (no overflow)
- [ ] Tebak Pejabat 4 choice render OK di mobile
- [ ] Stats grid Tagih 2-col mobile, 4-col desktop
- [ ] Hero illustration responsive (no fixed pixel overflow)
- [ ] Sidebar collapse ke top atau full-width di mobile
- [ ] Footer 4-col → 2-col → 1-col responsive
- [ ] Sticky header tidak overflow
- [ ] `docs/MOBILE_AUDIT_2026-05-04.md` ditulis dengan finding + before/after evidence
- [ ] `pnpm typecheck` + `pnpm lint` + `pnpm test` pass

## Out of scope

- ❌ Hamburger menu mobile nav implementation — Sprint 4 spec terpisah (current: hidden nav OK as gap)
- ❌ PWA manifest mobile install prompt — Sprint 4
- ❌ Touch gesture (swipe nav) — out of scope beta
- ❌ Tablet-specific (768-1024) deep audit — focus 375 dulu

## Commit message

```
fix(web): mobile responsive audit 375px — collapse grid + touch target + scale

Audit 15 page di iPhone SE viewport (375x667). Fix:
- Card grid 3-col → 1-col mobile (Komunitas/Karya/Kelas/Aksi/Tagih)
- Stats grid 4-col → 2-col mobile (Tagih)
- Sidebar collapse ke top di mobile (Komunitas/Karya)
- Tebak Kata tile grid: max-w-[327px] mx-auto, gap-1 mobile
- Tebak Pejabat 4 choice: grid-cols-1 md:grid-cols-2
- Touch target enlarge ≥ 44x44px (vote arrow, icon button)
- Headline scale text-3xl mobile → text-5xl desktop
- Hero illustration: w-full max-w-md responsive

Per Spec #20. Hamburger nav defer ke Sprint 4.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

## Coordinate paralel — Window C territory

⚠️ POTENTIAL CONFLICT dengan Window 2 batch 1 (#17 visual polish):
- `apps/web/src/components/site-footer.tsx` (Window 2 BARU bikin) — Window C audit responsive AFTER Window 2 commit
- `apps/web/src/styles/globals.css` (Window 2 add keyframe) — Window C edit kalau perlu media query custom

**Strategi**: Tunggu batch 1 commit semua dulu. Window C start setelah pull-rebase clean.

⚠️ POTENTIAL CONFLICT dengan Window E batch 2 (#22 deploy):
- Layout.tsx — Window C HANYA edit kalau perlu responsive class (jarang). Window E mungkin add deploy-related metadata. Coordinate sequential.

✅ Aman: per-component responsive class addition (kebanyakan additive `md:`/`lg:` prefix, low conflict).

Pull-rebase reflex sebelum push.

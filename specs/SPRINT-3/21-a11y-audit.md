# Spec #21 — A11y audit WCAG 2.1 AA basic

**Sprint**: 3 (post-implementation)
**Owner**: Claude Code (executor) · audited oleh planner
**Estimasi**: 2-3 jam
**Dependency**: Spec #6.5 test foundation (commit `94ce4d0`) sudah landed
**Source**: AUDIT_PRE_BETA Tier 2 IMPORTANT — a11y audit gap
**Window**: D (batch 2 paralel — ARIA + axe-core test territory)

**Decisions Mas (approved 2026-05-04):**
1. ✅ Standard: WCAG 2.1 Level AA (basic compliance untuk launch)
2. ✅ Tool: axe-core (vitest) + manual keyboard navigation test
3. ✅ Scope: 15 page Phase 2, focus pada interactive component

**Required reading:**
1. WCAG 2.1 Quick Reference (https://www.w3.org/WAI/WCAG21/quickref/)
2. axe-core docs (https://github.com/dequelabs/axe-core)
3. CLAUDE.md §5 (color contrast — verify 11 token meet AA contrast)

---

## Goal

Audit accessibility 15 page Phase 2 sesuai WCAG 2.1 AA. Fix violation yang found via axe-core + manual test. Add automated a11y test ke vitest suite biar regression caught.

Setelah spec ini selesai:
- 0 critical violation di axe-core scan per page
- Keyboard navigation full path: home → all interactive elements via Tab
- Screen reader basic: landmark (header/main/nav/footer), heading hierarchy, alt text
- Color contrast AA (4.5:1 normal text, 3:1 large text)
- Focus indicator visible di semua interactive

---

## Audit categories (WCAG 2.1 AA)

### A. Perceivable
- [ ] Color contrast text ≥ 4.5:1 (normal), ≥ 3:1 (large 18pt+ atau 14pt bold+)
- [ ] Color contrast UI component ≥ 3:1 (button border, focus indicator)
- [ ] Alt text untuk semua `<img>` + `<svg>` content (decorative SVG: `aria-hidden="true"`)
- [ ] Resize text 200% tanpa loss content

### B. Operable
- [ ] Keyboard accessible: semua interactive reachable via Tab
- [ ] Focus indicator visible (outline ring atau border highlight)
- [ ] Skip link "Skip to main content" di top
- [ ] No keyboard trap (modal/drawer dismiss via Esc)
- [ ] Touch target ≥ 44x44px (overlap dengan Spec #20)

### C. Understandable
- [ ] Page title descriptive (`<title>`)
- [ ] HTML lang="id" set
- [ ] Form label associated dengan input (htmlFor + id)
- [ ] Error message clear + identify field
- [ ] Consistent navigation (header nav same di all page)

### D. Robust
- [ ] Valid HTML (no nested `<button>` etc)
- [ ] ARIA landmark: `<header>`, `<nav>`, `<main>`, `<footer>`
- [ ] ARIA live region untuk dynamic content (toast, vote count update)
- [ ] Heading hierarchy logical (h1 → h2 → h3, no skip)

---

## File yang dibuat

```
apps/web/src/__tests__/a11y/
├── homepage.a11y.test.tsx                          axe-core scan / page
├── komunitas.a11y.test.tsx
├── karya.a11y.test.tsx
├── kelas.a11y.test.tsx
├── aksi.a11y.test.tsx
├── tagih.a11y.test.tsx
├── main.a11y.test.tsx
└── shared/                                         Helper untuk render + axe scan
    └── render-with-axe.tsx

apps/web/src/components/skip-link.tsx               BARU — Skip to main content link

docs/A11Y_AUDIT_2026-05-04.md                       Audit findings + before/after
```

## File yang diubah

```
apps/web/package.json                               Add deps: vitest-axe atau @axe-core/react
apps/web/src/app/layout.tsx                         Wire <SkipLink /> di body top + lang="id"
apps/web/src/app/page.tsx                           Add ARIA landmark + heading hierarchy fix
apps/web/src/components/site-header.tsx             ARIA: role="navigation", aria-label
apps/web/src/components/site-footer.tsx             ARIA: role="contentinfo"
apps/web/src/components/komunitas/*                 Vote arrow aria-label, button proper, focus ring
apps/web/src/components/karya/*                     Card link aria-label
apps/web/src/components/kelas/*                     Form label htmlFor
apps/web/src/components/nala/*                      Modal/dialog ARIA, focus trap
apps/web/src/components/main/*                      Game tile aria-label, keyboard event
```

## File yang TIDAK diubah

- ❌ Apa pun yang Window A (Nala mock data), Window B (karya content), Window C (mobile responsive), Window E (deploy) lagi edit — koordinasi
- ❌ Migration files
- ❌ Backend logic

---

## Step-by-step

### 1. Install axe-core

```bash
cd apps/web
pnpm add -D vitest-axe @axe-core/react jest-axe
```

Pin tilde untuk consistency.

### 2. Setup a11y test helper

**`apps/web/src/__tests__/a11y/shared/render-with-axe.tsx`**:

```tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'vitest-axe';
import { expect } from 'vitest';

expect.extend(toHaveNoViolations);

export async function renderAndScan(ui: React.ReactElement) {
  const { container } = render(ui);
  const results = await axe(container);
  return { container, results };
}
```

### 3. Per page a11y test

**`apps/web/src/__tests__/a11y/homepage.a11y.test.tsx`**:

```tsx
import { describe, it, expect } from 'vitest';
import { renderAndScan } from './shared/render-with-axe';
import HomePage from '@/app/page';

describe('Beranda a11y', () => {
  it('has no accessibility violations', async () => {
    const { results } = await renderAndScan(<HomePage />);
    expect(results).toHaveNoViolations();
  });
});
```

Replicate untuk komunitas, karya, kelas, aksi, tagih, main.

**Note**: Server Component test butuh mock Supabase — pakai `vi.mock('@/lib/supabase/server')` pattern dari existing test.

### 4. Skip link component

**`apps/web/src/components/skip-link.tsx`**:

```tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-jw-md focus:bg-jw-blue focus:text-jw-cream focus:px-4 focus:py-2 focus:font-medium"
    >
      Lompat ke konten utama
    </a>
  );
}
```

**Wire di layout.tsx**:

```diff
  <body>
+   <SkipLink />
    <SiteHeader user={user} />
-   <main>{children}</main>
+   <main id="main-content">{children}</main>
    <SiteFooter />
  </body>
```

### 5. ARIA landmark sweep

**Semua page wrapper** harus ada landmark proper:

- `<header>` di SiteHeader (sudah ada)
- `<nav>` di SiteHeader inner (verify aria-label="Navigasi utama")
- `<main id="main-content">` di layout.tsx
- `<footer>` di SiteFooter (verify role="contentinfo" optional)
- `<aside>` untuk sidebar (komunitas filter, karya top kreator)

### 6. Vote arrow + interactive icon ARIA

**Pattern**:

```diff
- <button onClick={handleUpvote}>
-   <ChevronUp size={18} />
- </button>
+ <button
+   onClick={handleUpvote}
+   aria-label={`Upvote thread "${thread.title}". Saat ini ${thread.upvotes} upvote.`}
+   aria-pressed={hasUpvoted}
+ >
+   <ChevronUp size={18} aria-hidden="true" />
+ </button>
```

### 7. Form label association

**Semua form** (Masuk, Daftar, Submit janji, Tulis balasan, dll):

```diff
- <label>Email</label>
- <input type="email" />
+ <label htmlFor="email">Email</label>
+ <input type="email" id="email" name="email" required />
```

### 8. Color contrast verify

Pakai axe-core auto-detect, plus manual sampling dengan tool seperti https://contrast-ratio.com/

**Target ratio**:
- `text-jw-ink` (#2A2D3A) on `bg-jw-cream` (#FFFAEE) → 12.8:1 ✅ pass
- `text-jw-muted` (#6B6860) on `bg-jw-cream` → 5.6:1 ✅ pass
- `text-jw-coral` (#E8632B) on `bg-jw-cream` → 3.7:1 ⚠️ FAIL untuk normal text! Hanya pass untuk large text (18pt+).
- `text-white` on `bg-jw-coral` → 3.5:1 ⚠️ FAIL untuk normal! CTA dengan text-sm 14px = problem.

**Action**: Audit setiap usage `text-jw-coral` + `bg-jw-coral` + `text-white` combo. Replace coral text usage dengan blue (12:1 contrast) untuk small text. Coral OK untuk headline/CTA large.

### 9. Heading hierarchy fix

**Per page**:
- 1 `<h1>` saja per page (page title)
- `<h2>` untuk section title
- `<h3>` untuk subsection
- TIDAK ada skip (h1 → h3 = WCAG violation)

Audit: grep `<h\d` per page, fix order.

### 10. Modal/dialog ARIA (Nala panel)

**`apps/web/src/components/nala/nala-panel.tsx`** (atau equivalent):

```diff
+ <div
+   role="dialog"
+   aria-modal="true"
+   aria-labelledby="nala-panel-title"
+   aria-describedby="nala-panel-desc"
+ >
+   <h2 id="nala-panel-title" className="sr-only">Tanya Nala</h2>
+   <p id="nala-panel-desc" className="sr-only">Panel chat dengan AI Nala</p>
    {/* existing content */}
+ </div>
```

Plus focus trap dengan `useFocusTrap` hook atau `react-focus-lock` library.

### 11. Manual keyboard navigation test

**Per page**:
1. Tab dari URL bar → first interactive element
2. Tab through all elements — pastikan urutan logis
3. Verify focus ring visible di every element
4. Esc keluar dari modal/drawer
5. Enter trigger button/link
6. Arrow key navigate select/menu (kalau ada)

**Document gap** di `docs/A11Y_AUDIT_2026-05-04.md`.

### 12. Smoke test

1. `pnpm test` — verify 7 a11y test pass (axe-core 0 violation per page)
2. Manual keyboard test (15 page)
3. `pnpm typecheck` + `pnpm lint` pass

---

## Acceptance checklist

- [ ] axe-core installed + setup helper
- [ ] 7 a11y test (homepage, komunitas, karya, kelas, aksi, tagih, main) — 0 violation
- [ ] SkipLink rendered di top of body
- [ ] HTML `lang="id"` di layout.tsx
- [ ] `<main id="main-content">` ada
- [ ] ARIA landmark: header, nav, main, footer per page
- [ ] Vote arrow + interactive icon: aria-label proper
- [ ] Form label htmlFor associated dengan input id
- [ ] Color contrast: text-jw-coral usage audited (replace untuk small text kalau perlu)
- [ ] Heading hierarchy: 1 h1 per page, no skip h1 → h3
- [ ] Modal/dialog ARIA: role, aria-modal, aria-labelledby
- [ ] Focus indicator visible di semua interactive (outline atau ring)
- [ ] Manual keyboard nav 15 page documented (gap kalau ada)
- [ ] `docs/A11Y_AUDIT_2026-05-04.md` ditulis
- [ ] `pnpm typecheck` + `pnpm lint` + `pnpm test` pass (test count: 195+10 = 205+ kalau Window A juga land)

## Out of scope

- ❌ Screen reader manual test (NVDA/VoiceOver) — basic only via axe-core
- ❌ Color blindness simulation — defer post-launch
- ❌ WCAG AAA — over-spec untuk beta launch
- ❌ Cognitive accessibility — separate spec
- ❌ Multi-language a11y (en/id switch) — single Bahasa Indonesia, OK

## Commit message

```
feat(a11y): WCAG 2.1 AA audit + fix — landmark, ARIA, keyboard, contrast

- axe-core test setup (vitest-axe), 7 page a11y test (0 violation)
- SkipLink component + main-content landmark
- HTML lang="id" set
- ARIA landmark sweep: header/nav/main/footer per layout
- Vote arrow + icon button: aria-label proper, aria-hidden untuk icon
- Form label htmlFor associated dengan input id
- Color contrast audit: text-jw-coral usage adjusted untuk small text
- Heading hierarchy fix: 1 h1/page, no skip
- Modal/Nala panel ARIA: role="dialog", aria-modal, focus trap
- docs/A11Y_AUDIT_2026-05-04.md: findings + before/after

Per Spec #21 WCAG 2.1 AA basic compliance.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

## Coordinate paralel — Window D territory

⚠️ POTENTIAL CONFLICT dengan Window C batch 2 (#20 mobile responsive):
- `apps/web/src/components/komunitas/*`, `karya/*`, `kelas/*`, etc — both edit responsive class (Window C) + ARIA (Window D)
- **Resolution**: edit additive (Window C add `md:` prefix, Window D add `aria-*` attribute) — different concern, low conflict if careful

⚠️ POTENTIAL CONFLICT dengan Window 2 batch 1 (#17 footer):
- `apps/web/src/components/site-footer.tsx` — Window 2 BARU bikin file, Window D add ARIA role="contentinfo"
- **Resolution**: Window D start AFTER batch 1 commit landed

⚠️ POTENTIAL CONFLICT dengan Window E batch 2 (#22 deploy):
- `apps/web/src/app/layout.tsx` — Window D add SkipLink + main id, Window E add deploy metadata
- **Resolution**: pull-rebase clean

✅ Aman BARU: `__tests__/a11y/*` directory dedicated, `components/skip-link.tsx` dedicated.

Pull-rebase reflex sebelum push.

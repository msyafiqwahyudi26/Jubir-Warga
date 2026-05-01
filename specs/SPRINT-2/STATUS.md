# Sprint 2 — Status

| Spec | Title | Status |
|---|---|---|
| #1 | Schema demo mode | ✅ DONE |
| #2 | Demo seed generator (300 users) | ✅ DONE |
| #3 | Landing page + preview gate | ✅ DONE |
| #4 | Design heritage port (Nala mascot, illustrations, decor) | ✅ DONE |
| #5 | Nala AI global panel | ✅ DONE 2026-05-01 |

## Notes — Spec #5

- Slide-over panel rendered globally via `apps/web/src/components/nala/nala-panel.tsx`, mounted inside `app/layout.tsx` (after `<QueryProvider>` children).
- State: Zustand store with `persist` middleware → `localStorage` key `jw-nala-store`. `partialize` keeps only `messages` + `mode`; `isPanelOpen` / `isResponding` reset on reload.
- 24-hour expiry: `onRehydrateStorage` checks the timestamp of the last persisted message and clears `messages` if older than 24h.
- Accessibility: `role="dialog"`, `aria-modal="true"`, focus trap (Tab/Shift+Tab cycle, ESC closes, focus restored to trigger on close), body scroll lock while open.
- Mock responses: 3 curated rules (pasal 28E, kelas online publik, opini editorial) + plausible Nala-voice fallback. Real Claude API integration deferred to Sprint 4 per spec.
- Trigger surfaces wired:
  - Header pill `<NalaPanelTrigger />` (signed-in & signed-out variants).
  - Floating FAB `<NalaTriggerButton context="tentang halaman ini" />` on Beranda — now opens the panel with context preserved.
- Typecheck: 0 errors in nala-* files. Pre-existing errors in `beranda/*` and `lib/supabase/*` are unrelated to this spec.
- Lint: 0 new warnings/errors.

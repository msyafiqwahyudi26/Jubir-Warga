# Sprint 3 — Status

**Started**: 2026-05-01
**Target completion**: 2026-05-15
**Plan**: `specs/SPRINT-3/00-overview.md`

## Spec progress

| Spec | Title | Status | Commit |
|---|---|---|---|
| #6 | Supabase typegen untuk views | ✅ DONE 2026-05-01 (root cause: dep drift, fix via ssr bump) | dff5a80 |
| #6.5 | Test Foundation (Vitest + RTL + 8 tests + CI gate) | ✅ DONE 2026-05-01 (23 test pass, baseline cov 32%/35%, CI green 40s) | 94ce4d0 |
| #7 | Komunitas page (Index + ThreadDetail) | ⏳ Blocked — 3 decisions Mas pending | — |
| #8 | Karya page (Index + ReadingView) | 📋 Listed di overview, spec belum ditulis | — |
| #9 | Kelas page (Index + LessonPlayer) | 📋 Listed | — |
| #10 | Aksi page (Index + PetisiDetail + PollingDetail) | 📋 Listed | — |
| #11 | Tagih page (Index + JanjiDetail) | 📋 Listed | — |
| #12 | Profil + KTP Warga (PasporPublic) | 📋 Listed | — |
| #13 | Main games (Tebak Kata + game #2) | 📋 Listed (game #2 TBD: saran Tebak Pejabat) | — |
| #14 | Brand consistency cleanup PPTX/DOCX | 📋 Listed | — |
| #15 | Polish + audit (mock 8 baru, mode selector Nala, react-markdown) | 📋 Listed | — |

## Blockers aktif

**Untuk Spec #7 Komunitas (block spec writing):**
1. Server vs Client Component split (rekomendasi: Server fetch + nested Client)
2. Vote auth requirement (rekomendasi: login required)
3. Sub-komunitas data source (rekomendasi: hard-code constant Sprint 3, DB Sprint 5)

Mas approve via reply singkat di chat planner ("approve semua" atau "1 setuju, 2 anonymous, 3 setuju").

## Carry-over operasional (non-blocking)

- Twilio Verify untuk WhatsApp OTP — Mas belum setup
- Google OAuth client di Google Cloud Console — Mas belum setup
- Domain `jubirwarga.id` — pending decision

## Notes

- Data layer `@jw/data` udah lengkap (Sprint 1-2). Spec #7-12 cuma consume hooks, tidak re-build queries.
- ✅ Pre-existing typecheck errors di `beranda/petisi-preview.tsx` + `thread-list.tsx` + `janji-tracker.tsx` udah auto-resolve setelah Spec #6 (dep bump + types re-export).
- Lesson learned dep drift sudah tercatat di BACKLOG.md "Supabase typegen" section.
- CLAUDE.md tech stack table updated: ssr `~0.10.2`, supabase-js `~2.105.1` (tilde-pin).

## Spec #6.5 commit summary

**Commit `94ce4d0`** — test(web): add Vitest foundation + 8 baseline tests + CI gate

Setup:
- Vitest 4.1.5 (latest stable, API-compat dengan v2 spec hint)
- @testing-library/react 16.3 + jest-dom + user-event
- jsdom 29.1, @vitejs/plugin-react 6.0, @vitest/coverage-v8
- 4 npm scripts: `test`, `test:watch`, `test:ui`, `test:cov`

Tests (8 file, 23 test):
- `lib-format.test.ts` — 4 (formatNumber/Rupiah/Date/Relative)
- `lib-nala-store.test.ts` — 3 (openPanel+context, addMessage id/createdAt, clearChat)
- `lib-nala-mock-responses.test.ts` — 4 (Pasal 28E + citation, kelas online, opini, fallback)
- `schemas.test.ts` — 4 (submitThread valid/invalid, submitLaporan default, updateProfile regex)
- `nala-panel.test.tsx` — 2 (empty state, message render)
- `nala-message-bubble.test.tsx` — 2 (user content, nala citation footnote)
- `healthcheck-route.test.ts` — 1 (mock supabase, status/connected/count)
- `jw-logo.test.tsx` — 2 (wordmark, aria-label)

CI workflow `.github/workflows/ci-test.yml`: typecheck + lint + test on push/PR. **First run hijau di 40s.**

Friction yang di-resolve (gak modif komponen, adapt test):
- jsdom missing `Element.scrollTo` → stub via `vi.fn()` di vitest.setup.ts
- `JWLogo` (spec) vs `JwLogo` (actual export) → fix di test
- `formatCurrency` (spec) vs `formatRupiah` (actual) → fix di test, regex untuk Rp NBSP whitespace
- Schemas body `min(20)` constraint → adjust test fixture

Quality gates:
- `pnpm test`: 23/23 pass dalam 12s
- `pnpm test:cov`: 32% statements / 35% functions baseline
- `pnpm typecheck`: 0 errors
- `pnpm lint`: 0 new warnings (1 pre-existing redirect unused)

## Spec #6 commit summary

**Commit `dff5a80`** — chore(deps): bump @supabase/ssr to fix supabase-js Database type drift

Files touched:
- `package.json` — ssr `^0.5.2` → `~0.10.2`, supabase-js `^2.46.1` → `~2.105.1`
- `pnpm-lock.yaml` — auto regen
- `packages/data/src/database.types.ts` — NEW (84 KB auto-generated)
- `packages/data/src/types.ts` — hand-written Database deleted, re-export added
- `packages/data/README.md` — "Regenerate Database type" section + UTF-16/UTF-8 PowerShell pitfall note
- `apps/web/src/app/(auth)/masuk/login-form.tsx` — narrow ActionState
- `apps/web/src/components/beranda/janji-tracker.tsx` — LucideIcon typing

Verifikasi:
- typecheck: 0 errors
- lint: 0 new warnings (1 pre-existing redirect unused di daftar/actions.ts — out of scope)
- smoke test: `/`, `/masuk`, `/daftar` semua HTTP 200

---

_Last updated: 2026-05-01 by planner (Spec #6 closed)._

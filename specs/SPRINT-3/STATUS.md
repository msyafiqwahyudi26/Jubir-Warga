# Sprint 3 — Status

**Started**: 2026-05-01
**Target completion**: 2026-05-15
**Plan**: `specs/SPRINT-3/00-overview.md`

## Spec progress

| Spec | Title | Status | Commit |
|---|---|---|---|
| #6 | Supabase typegen untuk views | ✅ DONE 2026-05-01 (root cause: dep drift, fix via ssr bump) | dff5a80 |
| #6.5 | Test Foundation (Vitest + RTL + 8 tests + CI gate) | ✅ DONE 2026-05-01 (23 test pass, baseline cov 32%/35%, CI green 40s) | 94ce4d0 |
| #7 | Komunitas page (Index + ThreadDetail) | ✅ DONE 2026-05-01 (15 file baru, 16 test baru, 39/39 pass, smoke test live OK) | 60c9597 |
| #8 | Karya page (Index + ReadingView) | ✅ DONE 2026-05-01 (12 file baru, 19 test baru, 58/58 pass, smoke test live OK, defensive type guard + Tailwind JIT lookup table) | 9019720 |
| #9 | Kelas page (Index + Detail + LessonPlayer MVP) | ✅ DONE 2026-05-01 (14 file baru, 20 test baru, 78/78 pass, civic→fixed, idempotent target-progress, smoke test live OK) | 3e16238 |
| #10 | Aksi page (Index + PetisiDetail + PollingDetail) | ✅ DONE 2026-05-01 (16 file baru, 18 test baru, 96/96 pass, idempotency via PG unique-violation, emoji audit 0 visible DOM) | 76a5784 |
| #11 | Tagih page (Index + JanjiDetail + Submit) | ✅ DONE 2026-05-01 (19 file baru, 24 test baru, 120/120 pass, level filter workaround clever, race-safe unfollow) | ec347ab |
| #12 | Profil + KTP Warga (PasporPublic) | ✅ DONE 2026-05-01 (16 file baru, 35 test baru, 155/155 pass, paralel zero conflict, privacy by design — public visa filter action-privat) | 6db285b |
| #X1 | Custom SVG icon + emoji foundation (Tier 2 prep, paralel) | ✅ DONE 2026-05-01 (12 file baru, 18 test baru termasuk brand-palette guard, 142/142 pass, strict file ownership respected, zero conflict dengan #12) | b4b7656 |
| #13 | Main games (Tebak Kata + Tebak Pejabat) | ✅ DONE 2026-05-03 (12 impl + 4 test, 195/195 pass) | 72ce58c |
| #14 | Brand consistency cleanup PPTX/DOCX | 📋 Listed | — |
| #15 | Polish + audit (mock 8 baru, mode selector Nala, react-markdown) | 📋 Listed | — |
| #16 | Tier A cleanup audit findings (em dash, dev meta, quote nesting, manifest, /main nav) | ✅ DONE 2026-05-04 (13 file: 12 impl + 1 spec, 5 icon + manifest porting, typecheck 0, lint 0 new, 195/195 pass) | c995834 |

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

## Spec #9 commit summary

**Commit `3e16238`** — feat(kelas): port Index + Detail + LessonPlayer MVP with enroll + progress

Files baru (14):
- `lib/kelas/`: constants.ts (LEVEL_OPTIONS + LEVEL_PILL_CLASS lookup + MODUL_TYPE_LABEL + BETA_PRICING_NOTE + **calcTargetProgress** pure function), filters.ts (parse/build/toggle)
- `app/kelas/`: actions.ts (enrollKelasAction idempotent + markModulCompleteAction idempotent via target-progress comparison), page.tsx (Index Server), kelas-filters.tsx (Client), kelas-card.tsx (pricing strikethrough + FREE badge), featured-hero.tsx (KELAS UNGGULAN marigold), mentor-section.tsx (is_admin proxy + Sprint 5 TODO)
- `app/kelas/[id]/`: page.tsx (Detail Promise.all parallel), enroll-button.tsx (Client, enrolled state shows "Lanjutkan ({progress}%)"), silabus-list.tsx (Lock/Check/ArrowRight icons per state)
- `app/kelas/[id]/modul/[modulId]/`: page.tsx (LessonPlayer + auth + enrollment gate), module-body.tsx (video_url placeholder + transcript markdown), module-progress-button.tsx (idempotent UI), module-nav.tsx (prev/next)

Quality gates:
- typecheck: 0 errors
- lint: 0 new warnings (1 pre-existing redirect unused)
- test: 78/78 pass (was 58, +20 baru: 9 filters, 4 kelas-card pricing, 7 module-progress with edge cases — 0/4, 1/4, 4/4, 5/4 clamp, 1/0 div-by-zero defense)

Smoke test (live di localhost:3001):
- /kelas: 114 KB, semua marker present (FREE, civic-fixed)
- /kelas?level=Pemula: 102 KB, filter applied
- /kelas/[id]: 75 KB, hero + silabus
- /kelas/[id]/modul/[modulId] (logged out): HTTP 307 redirect → /masuk?redirect=...
- "civic" word check: 0 occurrences di rendered HTML (anti-pattern fix verified)

Engineering wins:
- **calcTargetProgress** extracted as pure function (testable + reusable) — di constants.ts
- **Idempotency via target-progress comparison** instead of new completion table — gak butuh schema change, robust terhadap double-click + race condition
- **firstModulHref** UX bonus: "Lanjutkan" button link langsung ke modul pertama, bukan #silabus anchor

Stale lock note: detected `.git/index.lock` 5 jam lama, safely removed (Claude Code disiplin pattern recognition).

## Spec #7 commit summary

**Commit `60c9597`** — feat(komunitas): port Index + ThreadDetail with sidebar filter, vote, reply

Files baru (15):
- `lib/komunitas/`: constants.ts (TOPIK 8, LOKASI 7, FORMAT 5, SUBCOMMUNITIES 3), filters.ts (parse/build/toggle helpers)
- `app/komunitas/`: actions.ts (Server Actions Zod-validated, auth via redirect), page.tsx (Index Server Component, view query + range pagination), komunitas-sidebar.tsx (Client useRouter), thread-row.tsx (Server, defensive null check), vote-arrows.tsx (Client, useTransition optimistic + revert), sub-komunitas-section.tsx (Server, 3 hard-code), chapter-regional-section.tsx (Server, query chapters table)
- `app/komunitas/[id]/`: page.tsx (Promise.all parallel query, notFound on missing), thread-body.tsx (markdown bold inline render), reply-tree.tsx (flat list), reply-row.tsx, reply-form.tsx (useActionState + useFormStatus), ringkas-nala-button.tsx (open Nala panel + auto-add user message)

Files modified (0): site-header.tsx + thread-list.tsx already point to `/komunitas` (verified via grep, no change needed)

Quality gates:
- typecheck: 0 errors
- lint: 0 new warnings (1 pre-existing redirect unused)
- test: 39/39 pass (was 23, +16 baru: 12 di komunitas-filters, 3 di vote-arrows, 2 di reply-form, +overall improvements)

Smoke test (live di localhost:3000 dengan demo seed data):
- `/komunitas` 225 thread render ✓
- `/komunitas?topic=politik` 35 thread filtered, sidebar highlight ✓
- `/komunitas?hot=true` empty state render ✓
- `/komunitas/<uuid>` ThreadDetail full body + reply tree + Ringkas via Nala ✓
- Browser title via `generateMetadata` ✓
- Sub-komunitas + chapter sections rendered di Index ✓

Verified via Chrome MCP:
- Index page render dengan real Supabase data
- Filter URL pattern shareable (browser back jalan)
- ThreadDetail UUID route 200, body markdown rendered

Known limitation:
- "+ Mulai thread" link → `/komunitas/baru` belum ada (Spec #7c defer per spec out-of-scope)

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

_Last updated: 2026-05-04 by Claude Code (Spec #16 Tier A cleanup landed via commit `c995834` — audit findings 2026-05-04: em dash sweep curated copy, hapus 7 Sprint 4 dev meta labels, fix quote nesting JanjiDetail, port manifest+icons ke apps/web/public, tambah /main nav 6th surface)._

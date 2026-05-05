# Batch 2 Orchestration — 5 Window Paralel

**Created**: 2026-05-04
**Trigger**: Setelah batch 1 (Spec #16/#17/#18) selesai commit + push ke main
**Owner**: Mas (orchestrator) — paste prompt per window, relay status, approve decision points

---

## 🎯 Overview

5 Claude Code window paralel, masing-masing kerjain 1 spec independent. Total wall-clock estimasi: **3-4 jam** (constraint = window paling lambat).

| Window | Spec | Estimasi | Risk conflict | Mas approve needed |
|---|---|---|---|---|
| **A** | #15 — Nala mock expansion +8 | 1.5-2 jam | None (Nala territory dedicated) | 1× (8 topic confirmation) |
| **B** | #19 — Seed Karya body content | 3-4 jam | None (SQL only) | 1× (apply SQL ke Supabase production) |
| **C** | #20 — Mobile responsive 375px | 2-3 jam | Low (dengan #17 footer) | 0× (autonomous) |
| **D** | #21 — A11y audit WCAG 2.1 AA | 2-3 jam | Low (dengan #20 component) | 0× (autonomous) |
| **E** | #22 — Phase 2 deploy decision | 2-3 jam (Vercel) / 3-5 jam (VPS) | Low | **3× CRITICAL** (platform, env, DNS) |

---

## 🚦 Pre-flight ritual (sebelum spin up batch 2)

### Step 1: Verify batch 1 selesai

Sebelum start batch 2, pastikan batch 1 commit semua:

```bash
cd D:\Website-Jubir Warga
git log --oneline @{u}..HEAD  # Should be empty
git log -3 --oneline           # Verify commit batch 1 ada (Spec #16/#17/#18)
```

Cek `specs/SPRINT-3/STATUS.md`:
- Spec #16 status DONE + commit hash
- Spec #17 status DONE + commit hash
- Spec #18 status DONE + commit hash

Cek visual via Chrome:
- `/main` link ada di nav header (Spec #16 ✅)
- Footer render di setiap page (Spec #17 ✅)
- Trigger error → error.tsx render brand-aligned (Spec #18 ✅)
- Network: manifest.json 200, Sentry script load (Spec #16 + #18 ✅)

### Step 2: Pull terbaru per window

Setiap window mulai dengan:
```bash
cd D:\Website-Jubir Warga
git pull --rebase origin main
git status  # verify clean
```

### Step 3: Spin up 5 window VS Code / Terminal

Buka 5 instance Claude Code (atau 5 tab terminal dengan Claude Code session):
- Window A — `cd apps/web && claude code` (atau equivalent)
- Window B — same
- Window C — same
- Window D — same
- Window E — same

**Memory awareness**: Mas pernah hit memory pressure dengan dev server multiple. Kalau jalanin 5 window + 5 dev server = bahaya. Strategi:
- Window A/B/D — no dev server needed (test only)
- Window C — dev server WAJIB untuk visual audit
- Window E — dev server kalau VPS path (test build), gak perlu kalau Vercel

Conclusion: max 2 dev server simultaneously (Window C + Window E kalau VPS). Kill Window C dev server saat audit selesai sebelum Window E start.

---

## 📋 Paste-ready prompts per window

### 🪟 Window A — Spec #15 Nala mock expansion

```
Baca specs/SPRINT-3/15-nala-mock-expansion.md secara lengkap.
Ikuti step-by-step. Required reading dulu (mock-responses.ts existing pattern + CLAUDE.md §4 + memory.md).

Spec ada 8 topic proposal. Aku setujui default 8 topic — lanjut langsung tanpa nanya kecuali nemu issue.

Strict file ownership: HANYA edit lib/nala/mock-responses.ts + __tests__/lib-nala-mock-responses.test.ts.
JANGAN sentuh components/nala/* atau lib/nala/nala-prompts.ts.

Test target: 195 → 205 pass.

Pull-rebase sebelum push. Update STATUS.md setelah commit.
```

### 🪟 Window B — Spec #19 Seed Karya content

```
Baca specs/SPRINT-3/19-seed-karya-content.md secara lengkap.
Ikuti step-by-step. Required reading dulu (CLAUDE.md §1 + §4 + Landing Page copy + ReadingView template).

Strict file ownership: HANYA bikin file di docs/karya-content-drafts/, supabase/karya_content_seed.sql, scripts/seed-karya-content.ts (optional).
JANGAN edit apps/web/**, supabase/seed.sql, supabase/demo_seed.sql, atau migration file.

Tulis 10 long-form artikel dengan brand voice match (kamu/aku, Magdalene/VICE/Asumsi tone).
Forbidden vocab guard: 0 "Anda"/"Saya"/"civic" verified per draft.

CRITICAL: STOP sebelum apply SQL ke Supabase production. Tunggu Mas approve.
Setelah Mas approve, apply via psql/Supabase Studio/script, lalu verify via SELECT.

Pull-rebase sebelum push. Update STATUS.md.
```

### 🪟 Window C — Spec #20 Mobile responsive

```
Baca specs/SPRINT-3/20-mobile-responsive-audit.md secara lengkap.
Ikuti step-by-step. Required reading dulu (CLAUDE.md §5 + Tailwind v4 responsive doc).

CRITICAL: Tunggu batch 1 (Spec #16/#17/#18) selesai commit semua dulu. Kalau STATUS.md belum update, JANGAN start.

Strict file ownership: per-component md: prefix sweep + globals.css custom media query (kalau perlu).
⚠️ POTENTIAL CONFLICT: site-footer.tsx (Window 2 batch 1 BARU bikin) — audit responsive AFTER pull.

Method: Chrome DevTools 375px (iPhone SE), iterate 15 page, screenshot per page ke audit-screenshots/mobile-375/.
Tulis findings di docs/MOBILE_AUDIT_2026-05-04.md.

Pull-rebase sebelum push. Update STATUS.md.
```

### 🪟 Window D — Spec #21 A11y audit

```
Baca specs/SPRINT-3/21-a11y-audit.md secara lengkap.
Ikuti step-by-step. Required reading dulu (WCAG 2.1 quick ref + axe-core docs + CLAUDE.md §5).

CRITICAL: Tunggu batch 1 (Spec #18 ops + #17 footer) selesai commit dulu. Kalau STATUS.md belum update, JANGAN start.

Install vitest-axe + @axe-core/react + jest-axe (pin tilde) — ini install package baru, but per spec sudah explicitly approved.

Strict file ownership: __tests__/a11y/* (BARU directory), components/skip-link.tsx (BARU), per-component ARIA attribute.
⚠️ POTENTIAL CONFLICT: per-component edit (komunitas/karya/etc) overlap dengan Window C (responsive). Edit additive (Window C = md: prefix, Window D = aria-* attribute) — coordinate sequential kalau conflict resolve fail.

7 a11y test (homepage + 6 page utama) — target 0 violation per page.
Tulis findings di docs/A11Y_AUDIT_2026-05-04.md.

Pull-rebase sebelum push. Update STATUS.md.
```

### 🪟 Window E — Spec #22 Phase 2 deploy

```
Baca specs/SPRINT-3/22-phase2-deploy.md secara lengkap.
Ikuti step-by-step. Required reading dulu (CLAUDE.md §2 + §12 + AUDIT_PRE_BETA OPS-5).

CRITICAL: Tunggu batch 1 (Spec #18 ops) selesai commit dulu — env var pattern dependency.

3 KEPUTUSAN MAS WAJIB sebelum eksekusi:
1. Vercel atau VPS Hostinger? Default rekomendasi planner = Vercel (faster setup, free tier OK beta).
2. Domain: vercel.app dulu atau langsung custom subdomain (beta.jubirwarga.id)?
3. Env vars production sudah ready? (Supabase URL+anon, Sentry DSN, Plausible domain)

STOP setelah baca spec — paste 3 pertanyaan ke Mas dulu.
Setelah Mas approve 3 keputusan, lanjut Path A (Vercel) atau Path B (VPS).

Window E prepare scaffold + config + ADR. Mas execute final activation step (sign up account, modify DNS, fill credential ke dashboard) — itu di luar agent scope.

Strict file ownership: deploy/phase2/* (BARU), docs/DEPLOY_DECISION_2026-05-04.md (BARU), vercel.json atau .github/workflows/deploy-phase2.yml (BARU).
.env.example edit additive (low conflict dengan Window 3 batch 1).
next.config.ts edit kalau Path B (VPS) — add output: 'standalone'.

Pull-rebase sebelum push. Update STATUS.md.
```

---

## 🔄 Coordination matrix

### File ownership map (cross-window check)

| File | Owner | Other window touch? |
|---|---|---|
| `apps/web/src/lib/nala/mock-responses.ts` | A | None |
| `apps/web/src/__tests__/lib-nala-mock-responses.test.ts` | A | None |
| `apps/web/src/__tests__/a11y/*` | D | None |
| `apps/web/src/components/skip-link.tsx` | D | None |
| `apps/web/src/components/komunitas/*` | C + D | C = responsive, D = ARIA. Edit additive. |
| `apps/web/src/components/karya/*` | C + D | Same |
| `apps/web/src/components/kelas/*` | C + D | Same |
| `apps/web/src/components/aksi/*` | C + D | Same |
| `apps/web/src/components/tagih/*` | C + D | Same |
| `apps/web/src/components/main/*` | C + D | Same |
| `apps/web/src/components/site-footer.tsx` | C + D | C = responsive, D = role="contentinfo". Sequential merge. |
| `apps/web/src/components/site-header.tsx` | C + D | C = nav class, D = nav aria-label. Sequential merge. |
| `apps/web/src/components/nala/*` | D | A NOT touch (data only) |
| `apps/web/src/styles/globals.css` | C | D NOT touch |
| `apps/web/src/app/layout.tsx` | D | E might touch (low risk). Sequential merge. |
| `apps/web/src/app/page.tsx` | D | None (D edit ARIA + heading hierarchy) |
| `apps/web/src/app/komunitas/page.tsx` | C + D | C = sidebar layout, D = ARIA landmark |
| `apps/web/src/app/karya/page.tsx` | C + D | Same |
| `apps/web/src/app/tagih/page.tsx` | C + D | Same |
| `apps/web/next.config.ts` | E (Path B only) | None |
| `apps/web/.env.example` | E | None (Window 3 batch 1 sudah commit) |
| `apps/web/package.json` | D + E | D = vitest-axe deps, E (Path B) = none. Sequential merge. |
| `supabase/karya_content_seed.sql` | B | None |
| `scripts/seed-karya-content.ts` | B | None |
| `docs/karya-content-drafts/*` | B | None |
| `docs/A11Y_AUDIT_*.md` | D | None |
| `docs/MOBILE_AUDIT_*.md` | C | None |
| `docs/DEPLOY_DECISION_*.md` | E | None |
| `deploy/phase2/*` | E | None |
| `.github/workflows/deploy-phase2.yml` | E (Path B only) | None |
| `vercel.json` | E (Path A only) | None |
| `specs/SPRINT-3/STATUS.md` | All | Append-only per window. Last writer wins kalau race. |
| `specs/SPRINT-3/15-22-*.md` | Per spec owner | None |

### Sequential merge order (kalau race condition)

Recommended push order untuk minimize conflict:
1. **Window B** push pertama (SQL only, 0 conflict — tapi long write time)
2. **Window A** push (Nala data only, 0 conflict)
3. **Window E** push (deploy infra, mostly new files)
4. **Window C** push (component responsive class)
5. **Window D** push terakhir (ARIA additions, dependent on C component changes)

Atau parallel push dengan pull-rebase reflex per window — git biasanya auto-resolve kalau conflict scope berbeda (responsive class vs ARIA attribute = additive).

### Conflict resolution playbook

**Kalau conflict di `apps/web/src/components/komunitas/thread-card.tsx`** (Window C + D):
1. Window pertama yang push: clean commit
2. Window kedua: pull-rebase, manual resolve (additive merge — keep both `md:` prefix dari C dan `aria-label` dari D)
3. Re-test (typecheck + lint), commit, push

**Kalau conflict di `apps/web/src/app/layout.tsx`** (Window D + E):
1. Sequential — Window D push dulu (SkipLink + lang="id" + main id)
2. Window E pull-rebase, append metadata (deploy-related, biasanya additive)

**Kalau conflict di `package.json`** (Window D + E):
1. Sequential — Window D push dulu (vitest-axe deps)
2. Window E pull-rebase. Path B (VPS) gak edit package.json, jadi safe.

**Generic resolution**:
```bash
git pull --rebase origin main
# Kalau conflict, manual edit, then:
git add <conflicted-file>
git rebase --continue
git push
```

---

## ⏱️ Wall-clock timeline (estimated)

```
T+0:00 — Batch 1 selesai commit semua, batch 2 ready
T+0:05 — Mas spin up 5 window paralel, paste prompt per window

T+0:30 — Window A first push (Nala mock — fastest)
T+1:00 — Window E paste 3 decision questions ke Mas, Mas reply, lanjut
T+1:30 — Window A done (estimasi 1.5h)
T+2:00 — Window E push scaffold (Vercel path)
T+2:30 — Window C done audit (estimasi 2.5h)
T+3:00 — Window D done a11y test setup + ARIA sweep
T+3:30 — Window B done content draft (estimasi 3-4h, Mas approve apply SQL)
T+4:00 — All push, planner audit start

T+4:00 to T+5:00 — Planner (aku) audit semua via Chrome
T+5:00 — Update context.md + STATUS.md final
T+5:00 — 95%+ pre-launch readiness 🎯
```

---

## 🔍 Planner audit protocol (post-batch-2)

Setelah 5 window selesai commit, aku jalanin audit komprehensif:

### Per Window verification

**Window A (Nala mock)**:
- Test count 205+ pass
- 8 mock baru visible di `MOCK_RESPONSES` array
- Brand voice + forbidden vocab guard pass

**Window B (Karya content)**:
- Query `SELECT COUNT(*) FROM karya WHERE body_md IS NOT NULL AND body_md != '';` ≥ 10
- Visit 3 sample `/karya/[id]` → render long-form, no placeholder

**Window C (Mobile responsive)**:
- Chrome DevTools 375px → 15 page screenshot — no overflow
- Tebak Kata tile grid muat 375px
- `docs/MOBILE_AUDIT_*.md` lengkap

**Window D (A11y)**:
- `pnpm test` → 7 a11y test pass (0 violation)
- Manual keyboard nav 5 page — no trap, focus visible
- SkipLink visible saat Tab dari URL bar

**Window E (Deploy)**:
- Production URL accessible
- Auth flow test pass
- Sentry capture verify (trigger test error)
- Plausible script emit
- ADR `docs/DEPLOY_DECISION_*.md` lengkap

### Final checklist update

Update `context.md`:
- Recently completed: 5 spec batch 2 dengan commit hash
- Current sprint: Sprint 3 status — Spec #6-#22 DONE
- Pending decision: tutup yang relevant (chip Nala, citation URL, Windows OOM, Phase 2 deploy)

Update `memory.md`:
- Locked decisions: Vercel/VPS pick, custom domain pick, citation URL audit owner

Update `handover.md`:
- Sprint 3 closure
- Sprint 4 next priority: hamburger menu mobile nav, real photo upload, content team backfill 32 karya remaining, achievement badge, dll

---

## 🆘 Stuck / blocker handling

Kalau salah satu window stuck:
1. Mas paste status report ke planner (aku)
2. Aku assess: technical issue (debug + adjust spec) atau decision needed (raise to Mas dengan opsi konkret)
3. Other window tetap jalan kalau tidak dependent

Kalau Mas tidur / break: 
- Window B bisa lanjut autonomous (long-form content writing, no decision needed)
- Window A/C/D bisa lanjut autonomous
- Window E STOP di decision point sampai Mas approve

---

## 📊 Success metric batch 2

Setelah batch 2 selesai:
- **Sprint 3**: 13/15 → 18/18 spec DONE = **100%**
- **Tier 1 BLOCKER**: 7/8 → 8/8 = **100%** (Phase 2 deploy closed)
- **Frontend polish**: 8.5/10 → 9.2/10 (mobile + a11y closed)
- **Operations**: 6.5/10 → 7.5/10 (deploy + uptime live)
- **Content**: skeleton → 10 long-form artikel showcase

**Overall pre-launch readiness**: 78-80% → **92-95%**

Sisanya 5-8% = pre-launch hygiene (sisa 32 karya body backfill, real URL citation audit, real photo upload, manual UptimeRobot setup, marketing prep) — bisa parallel dengan launch announcement prep.

---

## ✅ Approval ritual

Sebelum spin up batch 2, Mas konfirmasi:
- [ ] Batch 1 (Spec #16/#17/#18) sudah commit semua + smoke test pass
- [ ] Memory bandwidth OK untuk 5 window simultan (dev server cuma 1-2 max)
- [ ] Tersedia 4-5 jam wall clock untuk monitor + decision
- [ ] Approval Window B SQL apply Supabase dan Window E deploy production sudah ready

Kalau semua ✅, paste 5 prompt window di atas. Aku standby untuk audit + relay status.

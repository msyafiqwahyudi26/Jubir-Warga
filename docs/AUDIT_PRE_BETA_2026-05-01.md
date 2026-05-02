# Pre-Beta Launch Audit — Jubir Warga

> **Tujuan dokumen:** dipakai sebagai checklist pada fase polishing terakhir sebelum public beta launch (target Juni 2026). Setiap item Tier 1 wajib hijau sebelum announce ke publik.
>
> **Auditor:** planner (Claude Cowork)
> **Tanggal audit awal:** 2026-05-01 (post Spec #6 close, Sprint 3 1/10 done)
> **Sprint context saat audit:** Sprint 1-2 ✅ done, Sprint 3 jalan 10%, target completion Juni 2026
> **Update doc:** revise saat tiap milestone Sprint 3-4 close

---

## TL;DR

Project dalam kondisi **sangat sehat untuk fase MVP dan pitch demo (8.5/10)**, tapi **belum siap public production launch (5.5/10)** karena gap besar di Operations cluster (monitoring, testing, deployment Phase 2).

**Skor overall: 6.8/10** (weighted avg 6 cluster).

| Cluster | Skor | Status |
|---|---|---|
| Foundation | 8.4/10 | ✅ Solid, jangan diutak-atik |
| Backend & data | 7.6/10 | ✅ Bagus, tinggal config 2 auth provider |
| Frontend | 6.7/10 | 🟡 Beranda level production, 8 page lain perlu di-port |
| AI integration (Nala) | 7.5/10 | 🟡 Mascot+UX solid, real API + mode selector pending |
| Operations | 1.7/10 | 🚨 **CRITICAL GAP** — wajib fix sebelum launch |
| Process | 9.0/10 | ✅ Best-in-class untuk early stage |

**1 hal yang paling khawatir:** Operations cluster. Production launch tanpa Sentry/UptimeRobot/Plausible/test = launch berdarah.

---

## A. Penilaian per dimensi (skor 1-10)

### A1. Foundational

| Dimensi | Skor | Reasoning |
|---|---|---|
| Architectural clarity | 8.5 | Monorepo split jelas (apps/legacy + apps/web + packages/data + supabase). Server/Client separation dipikirkan. Data layer framework-agnostic — siap React Native reuse |
| Type safety | 7.5 | Strict mode + `noUncheckedIndexedAccess` + auto-typegen. Tapi ketemu `level?: any` di hooks.ts query keys factory — pelanggaran "no any" rule CLAUDE.md (patch kecil, tapi tetap pelanggaran) |
| Brand & design system | 9.0 | 11 tokens enforced, typography stack 4 font dengan purpose jelas, Patrick Hand logo + Nala mascot 5 ekspresi. Cuma 5/15 illustrations ported (sisanya Sprint 3) |
| Documentation | 9.5 | Continuity trio (HANDOVER + BACKLOG + STATUS) terjaga, lesson learned tercatat (mis. dep drift Spec #6), spec template konsisten. Hampir best-in-class untuk early-stage project |
| Code conventions | 8.0 | Kebab-case folder + PascalCase file, 'use client' minimum, server actions Zod-validated. Konsisten across files |

### A2. Backend & data

| Dimensi | Skor | Reasoning |
|---|---|---|
| Database schema design | 8.0 | Migration numbered (0001/0002/0003), RLS-ready, demo flag pattern bagus. Trigger handle_new_user proper. Views (petisi_with_progress, threads_with_author, janji_with_pejabat) proper aggregation |
| Data layer API | 9.0 | Pure async functions di queries.ts, query key factory pattern di hooks.ts (best practice TanStack), Zod schemas terpisah, mock fallback untuk gradual migration |
| Auth | 6.5 | 4 provider terimplementasi, cookie-based via @supabase/ssr ~0.10.2, login form proper UX (tab switcher, hydration handling). **Tapi 2 provider (Google OAuth + WA OTP) belum di-config production** — kode jalan, tombol klik = error |
| API endpoints | 7.0 | Healthcheck endpoint proper (status code, error handling, durationMs, version). Tapi cuma 1 endpoint — Sprint 3+ pasti perlu lebih banyak |
| RLS & security policies | 7.5 | Policy enforced di migrations, but belum di-verify per-tabel thoroughly |

### A3. Frontend

| Dimensi | Skor | Reasoning |
|---|---|---|
| Component quality | 8.0 | Beranda 4 component proper data fetch + loading skeleton + error state + empty state. PetisiPreview punya 3 state (data/empty/error) — komprehensif |
| Page coverage | 4.0 | 1/9 main page fully ported (cuma Beranda). 8 page lain belum ada di Phase 2. Sprint 3 fokus utama |
| Mobile responsive | 6.0 | Tailwind breakpoint pattern dipakai (`sm:`, `md:`), Nala panel `w-full sm:w-[420px]`. Tapi belum ada device-specific audit (320px? landscape iPad?) |
| Accessibility | 7.5 | Nala panel ada focus trap + role + aria-modal. Login form ada aria-label. Tapi belum systematic — gak ada axe audit, gak ada keyboard-only walkthrough |
| Loading/error UX | 7.0 | PetisiPreview ada empty state kreatif. Healthcheck ada degraded/down/ok state. Tapi pattern belum konsisten across all components |
| Animation & micro-interactions | 7.5 | Nala typing indicator (3 dot bounce stagger), card-lift hover, badge-glow, transition-transform. Cukup, bisa dipoles lebih lanjut |

### A4. AI integration (Nala)

| Dimensi | Skor | Reasoning |
|---|---|---|
| Mascot design | 9.0 | 5 ekspresi (curious/excited/mentor/thinking/confident) implemented, claymorphism beo, brand-consistent |
| Chat UX | 7.0 | Slide-over panel proper, focus trap, persist 24h, auto-resize composer. Gap: mode selector UI gak ada (4 mode di store tapi UI cuma "tanya") |
| Mock response brand voice | 8.0 | "kamu/aku", casual, follow-up tanya balik di akhir, citation footnote. Tapi cuma 3 rules → 4 chip buttons di empty state default ke fallback (UX kasar) |
| Real AI integration readiness | 6.0 | Spec deferred ke Sprint 4. Mock pattern bagus jadi swap-out gampang. Belum ada rate limit, abuse detection, atau RAG strategy doc |

### A5. Operations 🚨

| Dimensi | Skor | Reasoning |
|---|---|---|
| CICD | 5.0 | Phase 1 auto-deploy via GitHub Actions ke jubir.spdindonesia.org (jalan). **Phase 2 deployment: belum ada CICD, belum ada staging URL, target Vercel/VPS belum diputuskan** |
| Monitoring | 1.0 | 🚨 Cuma healthcheck endpoint, gak ada Sentry/Datadog/Plausible/UptimeRobot. Production launch tanpa ini = bahaya |
| Logging | 2.0 | Native Next.js console.log only. Gak ada structured logging, no log aggregation, no PII filter |
| Error tracking | 1.0 | Gak ada error boundary global di app/layout.tsx (selain Spec #5 minor). Production error = silent fail user-facing |
| Performance metrics | 0.0 | Gak ada Lighthouse CI, Web Vitals tracking, bundle size monitoring |
| Testing | 1.0 | 🚨 Zero unit test, zero integration test, zero E2E test. Refactor masa depan high-risk |

### A6. Process

| Dimensi | Skor | Reasoning |
|---|---|---|
| Sprint planning discipline | 9.0 | Spec template konsisten, BACKLOG-grounded, decisions logged, status updated |
| Continuity discipline | 9.5 | HANDOVER auto-update tiap session, planner/executor/orchestrator role split jelas |
| Commit hygiene | 8.5 | Conventional commits, Co-Authored-By Claude, surgical staging (skip pre-existing untracked), descriptive messages |
| Decision logging | 9.0 | Decisions jelas di HANDOVER + BACKLOG + lesson learned (mis. dep drift) — easy to audit pattern |

---

## B. Pre-Beta Launch Checklist (actionable)

> Setiap item harus hijau sebelum announce beta ke publik. Owner column:
> M = Mas (orchestrator/decisions/config)
> P = Planner (specs/audit)
> C = Claude Code (executor)

### 🚨 Tier 1 — BLOCKER untuk launch

- [ ] **OPS-1: Sentry error tracking** — install @sentry/nextjs, config client+server, source maps, PII scrubbing. Verify error mock terkirim. _(C, ~2h)_
- [ ] **OPS-2: UptimeRobot ping** — setup monitor `/api/healthcheck` 5 menit, alert email/Telegram. Verify alert trigger saat dev server down. _(M, ~30m)_
- [ ] **OPS-3: Plausible Analytics** (atau Vercel Analytics) — script tag di layout, custom event: signup/signature/vote. _(C, ~1h)_
- [x] **OPS-4: Test foundation** — ✅ DONE 2026-05-01, commit `94ce4d0`. Vitest 4.1.5 + RTL 16.3 + 8 file 23 test, baseline cov 32%/35%, CI workflow green 40s. Spec di `specs/SPRINT-3/06.5-test-foundation.md`.
- [ ] **OPS-5: Phase 2 deployment target** — decide Vercel atau VPS, setup CICD, staging URL public (mis. `beta.jubirwarga.id`). _(M decide, C execute, ~1 hari)_
- [ ] **OPS-6: Global error boundary** — `app/error.tsx` + `app/global-error.tsx` Next.js convention dengan brand-consistent fallback UI. _(C, ~1h)_
- [ ] **PAGE-1: Page port complete** — Spec #7-12 selesai (Komunitas, Karya, Kelas, Aksi, Tagih, Profil). _(C, 13-18h)_  
  **Progress: 5/6** — ✅ #7 Komunitas (`60c9597`), ✅ #8 Karya (`9019720`), ✅ #9 Kelas (`3e16238`), ✅ #10 Aksi (`76a5784`), ✅ #11 Tagih (`ec347ab`). Sisa: #12 Profil.
- [ ] **AUTH-1: Google OAuth config** — Google Cloud Console OAuth client + Supabase Provider config. Verify login flow end-to-end. _(M, ~30m)_
- [ ] **AUTH-2: WhatsApp OTP config** — Twilio Verify Service + Supabase Provider config. Verify OTP delivery. _(M, ~30m)_
- [ ] **CONTENT-1: Mock responses Nala 8 baru** — match 4 chip default + 4 topic relevan. Brand voice consistency. _(P draft, M review, C append, ~3h)_

**Total estimasi Tier 1**: 22-30 jam executor + ~2 jam Mas config + ~5 jam planner

### 🟡 Tier 2 — IMPORTANT (degraded UX/DX kalau gak ada)

- [ ] **OPS-7: Lighthouse CI** — GitHub Actions gate, fail PR kalau LCP > 2.5s atau bundle > 300 KB. _(C, ~1h)_
- [ ] **OPS-8: Bundle analyzer** — `@next/bundle-analyzer` config, baseline measurement per route. _(C, ~30m)_
- [ ] **UX-1: Mode selector Nala UI** — 4 tab (tanya/coach/writing/advocacy) di header panel. Filter chip per mode. _(C, ~1h)_
- [ ] **UX-2: React-markdown integration** — proper bullet/bold/link rendering di NalaMessageBubble. _(C, ~1h)_
- [ ] **UX-3: Mobile audit** — manual walkthrough 320px / 375px / 414px / iPad portrait+landscape per page. Fix overflow + tap target sizing. _(C, ~3h)_
- [ ] **UX-4: Accessibility audit** — axe DevTools per page, keyboard-only walkthrough, screen reader spot check (NVDA/VoiceOver). _(C, ~2h)_
- [ ] **CODE-1: Fix `any` di hooks.ts** — `pejabat: (level?: any)` → `level?: PejabatLevel`. _(C, ~10m)_
- [ ] **CONTENT-2: Brand consistency PPTX/DOCX** — replace "Jubirwarga" → "Jubir Warga" di pitch deck + strategi docs (per BACKLOG). _(C, ~2h)_
- [ ] **CONTENT-3: 10 illustration sisanya port** — dari Phase 1 ke Phase 2 (sesuai Design v2 doc Section 2.5). _(C, ~3-4h)_
- [ ] **TEST-1: E2E test critical flow** — Playwright minimum 3 flow: signup, sign petisi, send Nala message. _(C, ~3h)_

**Total estimasi Tier 2**: ~15-20 jam executor

### 🟢 Tier 3 — NICE-TO-HAVE (defer ke Sprint 4+)

- [ ] AI-1: Real Claude API integration (replace mock) — Sprint 4
- [ ] AI-2: RAG ke konten Jubir Warga (threads/karya/janji embedding) — Sprint 4
- [ ] AI-3: Rate limit Nala (20/hari free, unlimited Pro) — Sprint 4
- [ ] AI-4: Abuse detection ujaran kebencian / fitnah pre-API — Sprint 4
- [ ] AI-5: Multi-session chat history Nala (DB table + sidebar) — Sprint 4
- [ ] DATA-1: Realtime subscriptions (vote, reply, sign live counter) — Sprint 4
- [ ] DATA-2: Sub-komunitas DB table + admin CRUD — Sprint 5
- [ ] FEATURE-1: Section "Warga Muda" (12-18) sub-brand di app — Sprint 5/6
- [ ] FEATURE-2: Theory of Change petisi escalation system (1k/5k/10k/25k thresholds) — Sprint 4/5
- [ ] FEATURE-3: Annual "Laporan Suara Warga Muda" 30-page distribusi DPR/DPRD — Sprint 5
- [ ] CONTENT-4: Pitch deck VC/impact investor terpisah — Sprint 5+ post traction
- [ ] OPS-9: Dark mode — post-launch
- [ ] OPS-10: i18n English/Bahasa toggle — post-launch (kalau ada partner internasional)

---

## C. Definition of "Ready for Beta Launch"

Beta launch dianggap siap kalau **SEMUA** kriteria berikut hijau:

### C1. Functional
- [ ] Semua 9 main page (Beranda, Komunitas, Karya, Kelas, Aksi, Tagih, Profil, Main, Nala) render tanpa error
- [ ] Detail page critical (thread, reading, lesson, petisi, janji, paspor) functional
- [ ] Auth 4 provider semua jalan end-to-end (Mas test sendiri)
- [ ] Vote, sign petisi, follow janji, enroll kelas, submit thread/karya/laporan — semua jalan
- [ ] Nala panel responsive di mobile + desktop
- [ ] PetisiPreview, JanjiTracker, ThreadList di Beranda render real Supabase data

### C2. Quality
- [ ] `pnpm typecheck` pass dengan 0 errors
- [ ] `pnpm lint` pass dengan 0 warnings (atau documented exceptions)
- [ ] `pnpm test` pass dengan minimum 8 test
- [ ] Lighthouse score min 80 untuk Performance, 95 untuk Accessibility, 100 untuk Best Practices, 90 untuk SEO
- [ ] Bundle size < 300 KB per route (initial load)
- [ ] Mobile responsive smoke test 320px-1440px tanpa overflow

### C3. Operations
- [ ] Sentry capturing errors di staging
- [ ] UptimeRobot monitoring `/api/healthcheck` aktif
- [ ] Plausible (atau Vercel Analytics) tracking pageviews
- [ ] Global error boundary render brand-consistent fallback
- [ ] CICD pipeline run typecheck + lint + test sebelum deploy
- [ ] Deploy target Phase 2 setup (Vercel atau VPS) dengan SSL

### C4. Content
- [ ] Demo data 300 user masih `is_demo=true` (bukan dihapus, tapi tagged)
- [ ] Demo banner visible di header beta ("Demo data — akan di-cleanup saat launch")
- [ ] Mock responses Nala 8+ rules (4 chip default + 4 topic relevan)
- [ ] Landing copy `/coming-soon` final review
- [ ] Privacy policy + Terms of Service draft published (legal review optional pre-beta, mandatory pre-public)
- [ ] Pitch deck PPTX brand-consistent ("Jubir Warga" dipisah)

### C5. Operational readiness (Mas action items)
- [ ] Google OAuth client di Google Cloud Console
- [ ] Twilio Verify Service config
- [ ] Domain `jubirwarga.id` final decision (purchase atau wait investor preference)
- [ ] WhatsApp komunitas link real (bukan placeholder `#`)
- [ ] Newsletter Substack live (atau alternative)
- [ ] Beta tester recruit list (target ~50-100 alumni + komunitas tertutup)

### C6. Launch communication
- [ ] Announcement post di IG @jubirwarga.id
- [ ] Email broadcast ke beta list dengan link `app.jubir.spdindonesia.org` atau `jubirwarga.id`
- [ ] Press kit (logo SVG/PNG, screenshot 5-10, copy ringkas) ready untuk media
- [ ] Founder note dari Mas (1 page, "kenapa dibangun") published di blog/landing

---

## D. Recommended Sprint sequence (Sprint 3 → Beta)

### Sprint 3 (in progress, target close 2026-05-15)
**Spec sequence:**
1. ✅ #6 Supabase typegen — DONE
2. **Insert: #6.5 Test Foundation** — wajib sebelum lanjut page port (mitigate refactor risk)
3. #7 Komunitas (4-5h) — blocker 3 decisions Mas
4. #8 Karya (2-3h)
5. #9 Kelas (2-3h)
6. **Insert: #9.5 Observability (Sentry+UptimeRobot+Plausible)** — wajib sebelum Spec #10+ deploy ke staging
7. #10 Aksi (2-3h)
8. #11 Tagih (3-4h)
9. #12 Profil + Paspor (2-3h)
10. #13 Main games (1-2h)
11. #14 Brand consistency PPTX/DOCX (1-2h)
12. #15 Polish + audit (mock 8 baru, mode selector, react-markdown, mobile audit, a11y audit)

**New estimasi Sprint 3:** 28-37 jam Claude Code + 8-12 jam planner audit + ~3 jam Mas config = ~12-16 hari kerja. Target close Mei akhir.

### Sprint 4 (Juni awal)
- Real Claude API integration untuk Nala
- Realtime subscriptions
- Theory of Change petisi escalation
- E2E test expansion
- Soft launch ke beta tester (recruit 50-100 closed users)

### Beta launch milestone (Juni 2026)
- Public announcement
- Press kit distribusi
- Beta period: 4-6 minggu dengan iteration cycle weekly
- Cleanup demo data + production launch (target Juli 2026)

---

## E. Risk register (yang harus di-mitigate)

| Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|
| Spec #7 Komunitas overruns 5h karena complexity | High | Medium | Split jadi #7a (Index list) + #7b (ThreadDetail) | P |
| Dep version drift kambuh saat install ulang | Medium | High | Tilde pin sudah di-enforce, BACKLOG note. Bisa add `engines.pnpm` di package.json | C |
| Supabase Realtime quota saat traffic spike | Medium | Medium | Implement polling 5s sebagai fallback, defer Realtime ke Sprint 4 | P |
| Mobile UX di Tagih (#11) peta Indonesia berat | High | Medium | Static SVG + tap-province modal. **JANGAN react-leaflet** | P |
| Auth provider config delay dari Mas | Medium | High | Schedule explicit ke Mas, blocker buat launch | M |
| Beta tester drop-off karena bug pre-launch | Medium | High | Sentry capture + iterate weekly during beta | All |
| Compliance UU PDP untuk minor (16-18) | Low (Sprint 3 scope) | High | Defer Warga Muda section ke Sprint 5/6 dengan content policy 2-tier review | M+P |
| Demo data ke-tampilkan bareng real data confusing user | Medium | Low | Demo banner 3-tier (banner + tag + env flag) sudah di-spec | C |

---

## F. Definition of Done untuk dokumen ini

Dokumen ini di-revisi pada milestone berikut:

- [ ] **Sprint 3 mid-point** (~2026-05-08): update skor Operations cluster setelah OPS-1 sampai OPS-6 selesai
- [ ] **Sprint 3 close** (~2026-05-15): re-audit semua dimensi, update skor agregat
- [ ] **Pre-beta gate** (~2026-06-01): final checklist review, sign-off per Tier 1 item
- [ ] **Post-beta retro** (Juli 2026): lesson learned dari beta period, update untuk Sprint 4-5 planning

---

## G. Sign-off (saat siap beta launch)

| Role | Name | Date | Signature/Confirmation |
|---|---|---|---|
| Owner | Mas (admin@spdindonesia.org) | __________ | __________ |
| Planner audit | Claude (Cowork session) | __________ | __________ |
| Executor verification | Claude Code | __________ | __________ |

**Beta launch date: __________**
**Public launch date: __________**

---

## Appendix: Referensi dokumen

- `CLAUDE.md` — operating manual repo (brand voice, design tokens, tech stack, security)
- `HANDOVER.md` — continuity doc per session
- `BACKLOG.md` — backlog item dengan timing eksplisit
- `SYSTEM_AUDIT_2026-04-29.md` — audit Phase 1 sebelum migrate ke Phase 2 (historical reference)
- `apps/web/QUICKSTART.md` — setup runbook
- `packages/data/README.md` — data layer API surface
- `specs/SPRINT-2/STATUS.md` — Sprint 2 closure
- `specs/SPRINT-3/00-overview.md` — Sprint 3 plan
- `specs/SPRINT-3/STATUS.md` — Sprint 3 progress

---

_Document version: 1.0_
_Last updated: 2026-05-01 by planner (Claude Opus 4.7)_
_Next review: at Sprint 3 mid-point (~2026-05-08)_

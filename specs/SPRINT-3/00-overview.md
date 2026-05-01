# Sprint 3 — Overview

**Sprint goal**: port semua page utama Phase 1 ke Phase 2 Next.js dengan design heritage + data layer yang sudah ada, plus polish item Nala panel.
**Target durasi**: 2 minggu (10 hari kerja)
**Target completion**: 2026-05-15
**Owner**: planner (specs) + Claude Code (executor) + Mas (orchestrator + decisions)
**Required reading sebelum mulai**: CLAUDE.md, HANDOVER.md, specs/SPRINT-2/STATUS.md

---

## Status precondition (apa yang sudah ada dari Sprint 1 & 2)

- ✅ Phase 2 Next.js 15 + Supabase + Tailwind v4 setup
- ✅ Auth (4 provider: email/password, magic link, Google OAuth, WA OTP)
- ✅ Beranda live data (hello-user, janji-tracker, petisi-preview, thread-list)
- ✅ Demo seed 300 user + threads/replies/votes/petisi/janji follows
- ✅ Landing page + preview gate (`JubirWargaSuperApp2026`)
- ✅ Design heritage: NalaMascot, Patrick Hand logo, 5 illustrations, decor system
- ✅ Nala AI global panel (slide-over, Zustand persist, mock responses)
- ✅ Backend data layer di `packages/data` (queries, hooks, mock)

---

## Spec list (8 spec, urut by recommended execution)

| Spec | Title | Complexity | Dep | Notes |
|---|---|---|---|---|
| #6 | Komunitas page (Index + ThreadDetail) | L | none | Biggest page; 5 tabs, sidebar 3-tier (Topik/Lokasi/Format), thread list, reply tree, vote |
| #7 | Karya page (Index + ReadingView) | M | #6 | Article list with filter, longform reader (drop cap, pull quote, clamp) |
| #8 | Kelas page (Index + LessonPlayer) | M | #6 | Course catalog, lesson modul (10-15 min), enrollment progress bar |
| #9 | Aksi page (Index + PetisiDetail) | M | #6 | Petisi list, polling card, signature flow, progress |
| #10 | Tagih page (Index + JanjiDetail) | L | #6 | 14 janji real, peta Indonesia 5 provinsi, dashboard partai, status tracker, evidence timeline |
| #11 | Profil page (Index + PasporPublic) | M | #6 | KTP Warga (digital passport flip card), badge collection, contribution stats, public share |
| #12 | Main page (TebakKata + 1 game baru) | S | none | Daily Tebak Kata (Wordle-like), leaderboard, streak. Game #2 TBD |
| #13 | Polish + audit pass | S | semua di atas | React-markdown integration, mock responses 7-8 baru, fix pre-existing typecheck errors di beranda/* + supabase/*, mobile responsive sweep, accessibility audit |

**Total estimasi**: 28-35 jam Claude Code execution + 5-8 jam planner audit.

---

## Execution order recommendation

**Week 1 (foundational pages):**
1. Spec #6 Komunitas (3-5h) — biggest page, sets pattern for sub-pages
2. Spec #7 Karya (2-3h) — reuses pattern from Komunitas
3. Spec #8 Kelas (2-3h) — similar pattern

**Week 2 (action pages + gamification):**
4. Spec #9 Aksi (2-3h)
5. Spec #10 Tagih Janji (3-4h) — most data-heavy, real pejabat references
6. Spec #11 Profil + Paspor (2-3h)
7. Spec #12 Main games (1-2h)
8. Spec #13 Polish (3-4h)

Tiap spec di-deliver per file: `specs/SPRINT-3/06-komunitas.md`, dst.

---

## Dependency graph

```
       ┌──────────────────────────────────────────┐
       │                                          │
       │   #6 Komunitas (foundational pattern)    │
       │                                          │
       └────┬─────────┬─────────┬─────────┬───────┘
            │         │         │         │
            ▼         ▼         ▼         ▼
        #7 Karya  #8 Kelas  #9 Aksi  #10 Tagih
                                         │
                                         ▼
                                   #11 Profil
                                         │
                                         ▼
                                   #12 Main
                                         │
                                         ▼
                                   #13 Polish (semua di atas)
```

`#6 Komunitas` adalah parent — sets data fetch pattern (server component + Supabase query + render), navigation/breadcrumb pattern, design pattern (sidebar + main + Nala FAB). Sub-page lain reuse-nya.

---

## Decisions yang perlu diputuskan SEBELUM mulai

### 🔴 Blocker (perlu jawaban Mas sebelum Spec #6 bisa dimulai):

1. **Server Components vs Client?**
   Komunitas vote arrow + sub-komunitas filter butuh interactivity. Default Next.js 15: Server Component. Tapi vote arrow click harus client.
   - Option A: Whole Komunitas page Client Component (simpler, 1 file)
   - Option B: Server Component for data fetch + nested Client Components for interactive parts (best practice, 2-3 files)
   - **Rekomendasi planner: Option B** (sesuai CLAUDE.md "Server Component default, Client cuma untuk interaktif")

2. **Vote auth requirement?**
   Anonymous user bisa vote atau harus login dulu?
   - Option A: Login required (CTA ke /masuk kalau belum)
   - Option B: Anonymous-allowed (1 vote per IP via cookie)
   - **Rekomendasi planner: A** (anti-spam, pakai existing auth flow)

3. **Sub-komunitas (ChapterSection): static atau dynamic?**
   Sub-komunitas seperti "Politik Lokal", "Mental Health Kantor", dll — di Phase 1 di-hard-code. Sprint 3:
   - Option A: Hard-code sebagai constant (`SUBCOMMUNITIES`)
   - Option B: Pull dari DB (`sub_communities` table — belum ada migration)
   - **Rekomendasi planner: A untuk Sprint 3, migrate ke DB di Sprint 5** (avoid scope creep)

### 🟡 Soon (bisa diputuskan saat eksekusi spec masing-masing):

4. **Thread reply tree depth limit?** (Spec #6) — Reddit pakai max 10. Saran: 5 (avoid deep nesting di mobile).
5. **Petisi signature flow** (Spec #9) — wajib email + nama, optional ID kota? Atau full anonymous setelah login?
6. **Game #2 di Main** (Spec #12) — opsi: "Tebak Pejabat" (foto + clue), "Janji Trivia" (multiple choice janji asli vs fake), "Pasal Match" (drag pasal ke definisi). Saran: **Tebak Pejabat** (paling brand-aligned, leverage seed data 14 pejabat real).

### 🟢 Nice-to-have (boleh deferred):

7. **Mode selector UI di Nala panel** (4 mode: tanya/coach/writing/advocacy) — Spec #5 punya store.mode tapi belum ada UI. Bisa di-include di Spec #13 polish.
8. **Multi-session chat history** di Nala — Spec #5 punya 1 session aktif. Multi-session sidebar nice tapi defer ke Sprint 4 (butuh DB table).

---

## Mock responses tambahan (planner action item)

Sprint 2 Spec #5 cuma 3 curated rules. Sprint 3 perlu tambah 7-8 lagi biar prompt chips di empty state Nala panel selalu dapat curated response. Targets keyword:

| Topik | Sample chip yang harus match |
|---|---|
| DPR vs DPD | "Apa bedanya DPR dan DPD?" |
| KUHP pasal karet | "Kenapa ada pasal karet di KUHP baru?" |
| BPJS Kesehatan online | "Bagaimana cara cek saldo BPJS Kesehatan online?" |
| Hak warga vs polisi | "Apa hak warga ketika diberhentikan polisi?" |
| Putusan MK terkini | "Putusan MK soal X — apa artinya buat aku?" |
| Cara baca APBD | "Gimana baca APBD dengan jujur?" |
| Cara lapor pungli | "Aku kena pungli, lapor ke mana?" |
| Pemilu local | "Apa beda pilkada vs pemilu legislatif?" |

Aku (planner) draft 8 mock response baru sebelum Spec #13 polish. Will be appended ke `apps/web/src/lib/nala/mock-responses.ts`.

---

## Quality gates Sprint 3 (per spec)

Setiap spec harus memenuhi:
1. Typecheck pass: `pnpm --filter @jw/web typecheck` (no new errors)
2. Lint pass: `pnpm --filter @jw/web lint` (no new warnings)
3. Manual smoke test golden path (di starter prompt setiap spec)
4. Brand voice audit (no "civic", no jargon politik berat, no emoji decor, "kamu/aku" voice)
5. Color tokens: cuma 11 brand tokens
6. Acceptance checklist tiap spec semua hijau
7. Commit dengan Conventional Commit + Co-Authored-By

---

## Risks & mitigation

| Risk | Likelihood | Mitigation |
|---|---|---|
| Pre-existing typecheck errors di beranda/* + supabase/* compounding | Medium | Spec #13 polish dedicated untuk fix; jangan di-skip |
| Komunitas (#6) overruns 5h karena complexity | High | Split jadi #6a (Index list) + #6b (ThreadDetail) kalau perlu |
| Mock responses kering vs real demo | Medium | Planner draft 8 baru SEBELUM spec #13 |
| Supabase real-time subscriptions untuk vote/reply | Low (deferred Sprint 4) | Gunakan polling 5s di Sprint 3 (cheap), upgrade Realtime di Sprint 4 |
| Mobile UX di Tagih (#10) peta Indonesia | High | Use static SVG dengan tap-province → modal, JANGAN react-leaflet (heavy) |

---

## Out of scope Sprint 3 (defer ke Sprint 4+)

- ❌ Real Claude API integration untuk Nala (mock tetap)
- ❌ Realtime subscriptions (vote, reply, petisi sign live counter)
- ❌ Multi-session chat history Nala
- ❌ Sub-komunitas DB table + admin CRUD
- ❌ Video upload untuk Karya vlog (placeholder image dulu)
- ❌ Push notification (PWA)
- ❌ Dark mode

---

## Next step

**Mas:**
1. Review outline ini
2. Putuskan 3 blocker decisions (atau approve rekomendasi planner)
3. Konfirmasi mau mulai dari Spec #6 atau ada urutan lain

**Planner (after Mas approve):**
1. Tulis spec lengkap untuk Spec #6 (Komunitas) dengan code blocks ready-to-use
2. Hand off via starter prompt ke Claude Code di laptop / kantor

---

_Last updated: 2026-05-01 by planner (Claude Opus 4.7)_

# Sprint 3 — Overview

**Sprint goal**: port semua page utama Phase 1 ke Phase 2 Next.js — leverage data layer `@jw/data` yang sudah lengkap dari Sprint 1-2.
**Target durasi**: 2 minggu (10 hari kerja)
**Target completion**: 2026-05-15
**Owner**: planner (specs) + Claude Code (executor) + Mas (orchestrator + decisions)
**Required reading sebelum mulai**: CLAUDE.md, HANDOVER.md, BACKLOG.md, packages/data/README.md, specs/SPRINT-2/STATUS.md

---

## Status precondition

**Sprint 1 done:**
- Phase 2 Next.js 15 + Supabase + Tailwind v4 setup
- Auth 4 provider (email/password, magic link, Google OAuth, WA OTP)
- Beranda live data (hello-user, janji-tracker, petisi-preview, thread-list)

**Sprint 2 done:**
- Schema demo mode (`is_demo` flag + `cleanup_demo_data()`)
- Demo seed 300 user fictional + derived content
- Landing page + preview gate (`JubirWargaSuperApp2026`)
- Design heritage (Nala mascot 5 ekspresi, Patrick Hand logo, 5 illustrations, decor system)
- Nala AI global panel (slide-over, Zustand persist 24h, mock responses)

**Data layer `@jw/data` sudah ada (DON'T re-build):**
Semua queries + hooks udah di `packages/data/src/`. Page port Sprint 3 cukup consume:
- Threads: `useThreads`, `useThread`, `useSubmitThread`, `useSubmitReply`, `useVoteThread`
- Petisi: `usePetisiList`, `useGetPetisi`, `useSignPetisi`, `useIsPetisiSigned`
- Janji: `useListJanji`, `useGetJanji`, `useFollowJanji`, `useGetJanjiEvidence`, `useListPejabat`
- Karya: `useListKarya`, `useGetKarya`, `useSubmitKarya`
- Kelas: `useListKelas`, `useGetKelas`, `useGetKelasModul`, `useEnrollKelas`, `useUpdateKelasProgress`
- Laporan: `useListLaporan`, `useSubmitLaporan`, `useDukungLaporan`
- Polling: `useListPolling`, `useVotePolling`

**Tracking issue dari Sprint 2:**
- Pre-existing typecheck errors di `apps/web/src/components/beranda/petisi-preview.tsx` (`current_count` does not exist on type `never`) — penyebab: hand-written `Database` interface di `packages/data/src/types.ts` Views section format-nya tidak match expected shape Supabase JS v2.46+.
- BACKLOG.md bilang Spec ini "Sprint 3 awal" — jadi #6 first.

---

## Spec list (BACKLOG-driven + page port continuation)

| # | Title | Source | Estimasi |
|---|---|---|---|
| 6 | Supabase typegen untuk views (fix typecheck errors) | BACKLOG.md (Sprint 3 awal) | 30-45 menit |
| 7 | Komunitas page (Index + ThreadDetail) | continuation page-port | 4-5 jam |
| 8 | Karya page (Index + ReadingView) | continuation | 2-3 jam |
| 9 | Kelas page (Index + LessonPlayer) | continuation | 2-3 jam |
| 10 | Aksi page (Index + PetisiDetail + PollingDetail) | continuation | 2-3 jam |
| 11 | Tagih page (Index + JanjiDetail) | continuation | 3-4 jam |
| 12 | Profil + KTP Warga (PasporPublic) | continuation | 2-3 jam |
| 13 | Main games (Tebak Kata + game #2) | continuation | 1-2 jam |
| 14 | Brand consistency cleanup PPTX/DOCX | BACKLOG.md (sebelum pitch berikutnya) | 1-2 jam |
| 15 | Polish + audit (mock responses 8 baru, mode selector Nala) | continuation | 3-4 jam |

**Total estimasi**: 22-31 jam Claude Code execution + 5-8 jam planner audit.

---

## Eksplisit DEFERRED (per BACKLOG.md, jangan masuk Sprint 3)

- ❌ Section khusus "Warga Muda" di app → Sprint 5 atau 6 (sebelum first cohort Muda Berdampak)
- ❌ "Theory of Change" Petisi v2 escalation system (1k/5k/10k/25k thresholds, `petisi_stakeholder_track` table) → Sprint 4 atau 5
- ❌ Content policy 2-tier (UU PDP, parental opt-in <16) → sebelum first cohort Warga Muda
- ❌ Pitch deck VC/impact investor (terpisah dari Muda Berdampak) → Sprint 5+ post traction data
- ❌ Real Claude API integration untuk Nala (mock tetap di Sprint 3) → Sprint 4
- ❌ Realtime subscriptions Supabase (vote, reply, sign live counter) → Sprint 4
- ❌ Multi-session chat history Nala → Sprint 4 (butuh DB table)
- ❌ Sub-komunitas DB table + admin CRUD → Sprint 5

---

## Execution order recommendation

**Week 1 (typegen fix + foundational page):**
1. Spec #6 Supabase typegen (45m) — clear blocker
2. Spec #7 Komunitas (4-5h) — biggest page, sets pattern untuk sub-page
3. Spec #8 Karya (2-3h) — reuse pattern dari Komunitas
4. Spec #9 Kelas (2-3h)

**Week 2 (action pages + cleanup + polish):**
5. Spec #10 Aksi (2-3h)
6. Spec #11 Tagih Janji (3-4h) — most data-heavy, real pejabat references
7. Spec #12 Profil + Paspor (2-3h)
8. Spec #13 Main games (1-2h)
9. Spec #14 Brand consistency PPTX/DOCX (1-2h)
10. Spec #15 Polish + audit (3-4h)

Tiap spec di-deliver per file: `specs/SPRINT-3/06-supabase-typegen.md`, `07-komunitas.md`, dst.

---

## Dependency graph

```
   #6 Supabase typegen ─────────┐
                                │
                                ▼
            ┌───────────────────────────────────────────────┐
            │                                               │
            │   #7 Komunitas (foundational page-port)       │
            │                                               │
            └────┬─────────┬─────────┬─────────┬─────────┬──┘
                 │         │         │         │         │
                 ▼         ▼         ▼         ▼         ▼
             #8 Karya  #9 Kelas  #10 Aksi  #11 Tagih  #12 Profil
                                                          │
                                                          ▼
                                                     #13 Main
                                                          │
                                                          ▼
                                                     #14 Cleanup PPTX
                                                          │
                                                          ▼
                                                  #15 Polish (semua di atas)
```

---

## Decisions Mas (untuk Spec #7+)

### 🔴 Blocker untuk Spec #7 Komunitas:

1. **Server vs Client Component split?**
   - Vote arrow + sub-komunitas filter butuh interactivity
   - **Rekomendasi planner: Server Component (data fetch via @jw/data direct query helpers) + nested Client Components untuk vote/filter/reply submit** (sesuai CLAUDE.md "Server default, Client cuma untuk hook/event handler")

2. **Vote auth requirement?**
   - **Rekomendasi planner: Login required** (anti-spam, leverage existing auth flow `/masuk?redirect=/komunitas/...`)

3. **Sub-komunitas data source?**
   - **Rekomendasi planner: Hard-code constant di Sprint 3** (e.g., `SUBCOMMUNITIES = [{id:'politik-lokal', label:'Politik Lokal'}]`), migrate ke DB di Sprint 5

### 🟡 Soon (decide saat eksekusi spec masing-masing):

4. **Reply tree depth limit (#7)** — saran: max 5 level (avoid deep nesting di mobile)
5. **Petisi signature flow (#10)** — wajib email + nama, optional kota? Atau full anonymous setelah login?
6. **Game #2 di Main (#13)** — saran: **Tebak Pejabat** (foto + clue, leverage 14 pejabat real seed). Alternatif: Janji Trivia (multiple choice janji asli vs fake), Pasal Match (drag pasal ke definisi)

### 🟢 Nice-to-have (boleh deferred ke #15 polish):

7. Mode selector UI di Nala panel (4 mode: tanya/coach/writing/advocacy) — store.mode udah ada, UI belum
8. React-markdown untuk proper bullet rendering di Nala message bubble (sekarang literal "-")

---

## Mock responses tambahan (planner action item paralel)

Sprint 2 Spec #5 punya 3 curated rules. Sprint 3 polish (#15) tambah 8 lagi biar prompt chips di empty state Nala panel selalu match curated response:

| Topik | Sample chip yang harus match |
|---|---|
| DPR vs DPD | "Apa bedanya DPR dan DPD?" |
| KUHP pasal karet | "Kenapa ada pasal karet di KUHP baru?" |
| BPJS Kesehatan online | "Bagaimana cara cek saldo BPJS Kesehatan online?" |
| Hak warga vs polisi | "Apa hak warga ketika diberhentikan polisi?" |
| Putusan MK terkini | "Putusan MK soal X — apa artinya buat aku?" |
| Cara baca APBD | "Gimana baca APBD dengan jujur?" |
| Cara lapor pungli | "Aku kena pungli, lapor ke mana?" |
| Pemilu lokal | "Apa beda pilkada vs pemilu legislatif?" |

Planner draft 8 mock responses sebelum Spec #15.

---

## Quality gates Sprint 3 (per spec)

Setiap spec wajib:
1. Typecheck pass: `pnpm --filter @jw/web typecheck` (no new errors)
2. Lint pass: `pnpm --filter @jw/web lint` (no new warnings)
3. Manual smoke test golden path (di starter prompt setiap spec)
4. Brand voice audit (no "civic", no jargon politik berat, no emoji decor, "kamu/aku" voice)
5. Color tokens: cuma 11 brand tokens
6. Acceptance checklist tiap spec semua hijau
7. Commit dengan Conventional Commit + Co-Authored-By Claude

---

## Risks & mitigation

| Risk | Likelihood | Mitigation |
|---|---|---|
| Spec #7 Komunitas overruns 5h karena complexity | High | Split jadi #7a (Index list + sidebar) + #7b (ThreadDetail + reply tree) kalau perlu |
| Mock responses kering vs real demo | Medium | Planner draft 8 baru paralel, ready saat Spec #15 |
| Supabase real-time subscriptions untuk vote/reply | Low (deferred Sprint 4) | Polling 5s di Sprint 3 kalau perlu live counter, upgrade Realtime di Sprint 4 |
| Mobile UX di Tagih (#11) peta Indonesia | High | Static SVG + tap-province → modal, **JANGAN react-leaflet** (heavy) |
| Generated `database.types.ts` conflict dengan hand-written types | Medium | Spec #6 jelas-kan strategy: database.types.ts = source of truth Database type, types.ts = domain aliases + re-exports |

---

## Next step

**Mas:**
1. Review outline ini
2. Approve / modify 3 blocker decisions Komunitas
3. Konfirmasi Game #2 (Tebak Pejabat OK?)

**Planner (after Mas approve):**
1. Tulis spec lengkap untuk Spec #7 Komunitas (decisions di atas wired)
2. Hand off via starter prompt ke Claude Code

**Spec #6 (Supabase typegen)** ready dieksekusi sekarang — gak butuh decision Mas, langsung bisa hand off ke Claude Code.

---

_Last updated: 2026-05-01 by planner. Sources: CLAUDE.md, HANDOVER.md, BACKLOG.md, packages/data/README.md, specs/SPRINT-2/STATUS.md._

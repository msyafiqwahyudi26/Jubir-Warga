# context.md — Current project state

Snapshot kondisi project sekarang. Update saat ada perubahan signifikan. Kalau pengen tahu "lagi ngapain sekarang", baca file ini.

Status canonical per spec ada di `specs/SPRINT-<N>/STATUS.md`. File ini cuma highlight + cross-cutting context.

---

## Current sprint

**Sprint 3** — started 2026-05-01. Plan di `specs/SPRINT-3/00-overview.md`. Sprint 2 closed.

Status per 2026-05-03 (canonical: `specs/SPRINT-3/STATUS.md` + `handover.md`):

| Spec | Status |
|---|---|
| #6 — Supabase typegen views | ✅ DONE commit `dff5a80` |
| #6.5 — Test Foundation (Vitest + RTL + CI gate) | ✅ DONE commit `94ce4d0` |
| #7 — Komunitas (Index + ThreadDetail) | ✅ DONE commit `60c9597` |
| #8 — Karya (Index + ReadingView) | ✅ DONE commit `9019720` |
| #9 — Kelas (Index + Detail + LessonPlayer MVP) | ✅ DONE commit `3e16238` |
| #10 — Aksi (Index + Petisi + Polling) | ✅ DONE commit `76a5784` |
| #11 — Tagih (Index + JanjiDetail + Submit) | ✅ DONE commit `ec347ab` |
| #12 — Profil + KTP Warga | ✅ DONE commit `502300f` (atau `6db285b` per handover lama — verify di laptop) |
| #X1 — Custom SVG icon + emoji foundation | ✅ DONE commit `b4b7656` |
| #X2 — Mock responses Nala 8 baru | ✅ DONE commit `383a82d` |
| #13 — Main games (Tebak Kata + Tebak Pejabat) | ✅ DONE commit `72ce58c` (12 impl + 4 test, 195/195 pass) |
| #14 — Brand consistency cleanup PPTX/DOCX | 📋 Listed (status ambigu — perlu Mas konfirmasi apakah masih open atau diserap ke #15) |
| #15 — Polish + audit | 📋 Next — final audit + 8 more mock responses Nala (per laporan Mas) |

---

## Recently completed

### 2026-05-03 — Sprint 3 Spec #13 Main games (Tebak Kata + Tebak Pejabat)
- **Commit**: `72ce58c` (fast-forward dari `383a82d`, no conflict dengan Window 2's parallel Nala work)
- **Files**: 16 actual (12 impl + 4 test)
  - `lib/main/`: `constants.ts` (50 word `WORDS_OF_DAY` validated, `KEYBOARD_LAYOUT` QWERTY ID, `evaluateGuess` Wordle 2-pass, `scoreForAttempt`), `word-of-day.ts` (deterministic UTC-day-index), `pejabat-of-day.ts` (deterministic + stride-based distractors), `streak.ts` (consecutive days, today-missing-OK, 365 cap)
  - `app/main/`: `actions.ts` (`submitGameScoreAction` Zod-validated, anonymous redirect, server one-game-per-day check), `page.tsx` (Server, hero + 2 card + Flame streak), `tebak-kata/` (Server page + Client game + leaderboard top 3 by attempts asc), `tebak-pejabat/` (Server page + Client game + leaderboard top 3 by score desc)
  - `__tests__/`: word-of-day (dictionary integrity + deterministic + cycle), pejabat-of-day (deterministic + 3 distractors distinct + edge), streak (7 case incl. 365 cap), tebak-kata-game (evaluateGuess + scoreForAttempt + render + keyboard)
- **Quality gates**: typecheck 0 error (1 fix mid-flight: `vi.fn` mock signature for spread-arg type), lint 0 new warning, test **195/195 pass** in 32 file (155 → 195, +40)
- **Strict file ownership respected**: edited only `/app/main`, `/lib/main`, 4 new test, spec markdown. Window 2 territory (`nala/mock-responses.ts`, `nala-prompts.ts`, `lib-nala-mock-responses.test.ts`) **untouched**.
- **Acceptance 18/22 verified via test**, 4 perlu manual browser (hero render, link visual, tile color full visual confirm, win/lose banner UI). Smoke `pnpm dev` SKIPPED karena memory pressure (paging file crash earlier in session).
- **Anti-pattern audit pre-render**: 0 occurrence "civic", 0 "Citizen", copy "Tebak Kata Hari Ini" + "Kata warga 5 huruf" in place.
- **Out-of-scope follow-up**: tambah `/main` link ke `site-header.tsx` (existing nav 5-surface tidak include, Mas perlu commit terpisah).

### 2026-05-01 — Nala mock responses expansion (BACKLOG item)
- **Commit**: `383a82d`
- **Files**:
  - `apps/web/src/lib/nala/mock-responses.ts` — 8 mock baru (DPR vs DPD, KUHP pasal karet, BPJS Kesehatan, hak warga vs polisi, putusan MK, baca APBD, lapor pungli, pilkada vs pemilu). Total `MOCK_RESPONSES` array sekarang **11 rule**.
  - `apps/web/src/__tests__/lib-nala-mock-responses.test.ts` — 10 test case baru (keyword match per topic, brand voice guard `no "Anda"/"Saya"`, forbidden vocab guard `no "civic"`). Total test suite: **142 → 165**.
- **Brand voice**: kamu/aku konsisten, follow-up tanya balik, Gen Z mix, hindari "civic" + jargon politik berat. Setiap response 3-5 paragraf dengan struktur list + bold key term mirror existing 3 rule pattern.
- **Citations**: placeholder URL dari NGO terkemuka per allowlist — ICJR, ICW, FITRA, LBH Jakarta, Perludem, Kode Inisiatif + Tempo/Kompas explainer.
- **Quality gates**: typecheck 0 error, lint 0 new warning, full suite 165 pass.
- **Coverage**: 4 chip visible di empty state (DPR/DPD, KUHP, BPJS, polisi) sekarang fully covered — sebelumnya semua jatuh fallback. 4 topic sisanya (MK, APBD, pungli, pilkada) trigger via free-text query.
- **Limitation tercatat di BACKLOG**: `nala-prompt-chips.tsx:17` pakai `.slice(0, 4)` — jadi 4 topic baru belum auto-jadi chip visible. Skip per "kalau ragu SKIP" rule. Note di BACKLOG biar Mas tahu — kalau mau expose perlu reorder atau naikin slice limit.
- **Push**: pakai pack memory limits workaround (Windows git OOM recurring). Sukses, clean fast-forward (Spec #12 commit `502300f` udah landed sebelumnya).

### 2026-05-01 — Spec #12 (Profil)
- **Commit**: `502300f` (landed sebelum push Nala mock, fast-forward)
- Detail di `specs/SPRINT-2/STATUS.md`

---

## Pending decision (perlu Mas konfirmasi)

### 0. Header nav `/main` link follow-up (out of Spec #13 ownership)
Spec #13 strict scope `/app/main` + `/lib/main`, jadi tidak edit `site-header.tsx`. Existing nav 5-surface (Komunitas/Karya/Kelas/Janji/Aksi) belum include `/main` — games not discoverable dari header.

**Action**: Mas (atau Claude Code laptop di follow-up commit) tambah link `Main` ke nav. Small change, satu file edit.

### 1. Chip exposure strategy untuk 8 topic Nala
Sekarang `nala-prompt-chips.tsx` pakai `.slice(0, 4)` — cuma 4 chip visible. Topic baru (MK, APBD, pungli, pilkada) belum exposed sebagai chip walaupun mock response-nya udah jadi.

**Opsi**:
- **A. Rotasi** chip per session/refresh — exposure spread, simple, low-risk ✅ rekomendasi default
- **B. Kategorisasi tab** (Hukum / Anggaran / Politik) — better discoverability, lebih banyak kerja UI
- **C. "Lihat semua" expander** — middle ground, butuh modal/drawer
- **D. Stay free-text discovery** — minimal effort, asumsi user yang serius akan ngetik

Status: **menunggu Mas pilih**.

### 2. Citation URL audit pre-launch
Placeholder URL di mock responses Nala perlu real-link verification sebelum Juni 2026. Owner audit + timeline?

Status: **menunggu Mas tunjuk owner + jadwal**.

### 3. Windows git push OOM root cause
Recurring productivity tax. Worth jadi BACKLOG item terpisah (LFS untuk asset besar? `.gitconfig` global tweak? split repo?).

Status: **menunggu Mas approve buat dijadiin BACKLOG**.

---

## In progress

_(kosong — last work selesai di commit `383a82d`)_

---

## Recent conversation summary

### Session 2026-05-03 — Spec #13 DONE + memory files setup (current)
- Mas push commit `72ce58c` — Spec #13 Main games (Tebak Kata Wordle-clone + Tebak Pejabat). 16 file (12 impl + 4 test). Detail di "Recently completed" di atas.
- Pre-#13: setup memory file system (`memory.md`/`agents.md`/`context.md`/`skills.md`/`handover.md` di repo root) untuk continuity cross-device. Update `CLAUDE.md` §0 jadi 2-tier (memory file system + domain context).
- Mas mau pindah ke laptop, verifikasi state pushed. Aku kasih command verifikasi: `git status` + `git log @{u}..HEAD --oneline`.
- Mas tanya soal scheduled Playwright agent untuk re-verify 4 acceptance gap Spec #13 setelah Sprint 4 bawa E2E infra. Rekomendasi-ku: tunda jangan schedule sekarang (terlalu speculative — tergantung Sprint 4 commit Playwright), masuk BACKLOG saja sebagai trigger-based "saat Playwright landed → re-verify Spec #13".

### Session 2026-05-01 — Nala mock responses expansion
- Mas push commit `383a82d` dengan 8 mock response Nala baru, 10 test case baru, BACKLOG item ✅ done. Detail di "Recently completed" di atas.
- Aku acknowledge + raise 3 follow-up: chip exposure strategy, citation URL audit pre-launch, Windows git OOM root cause investigation. Semua masuk "Pending decision" di atas.

### Earlier sessions
_(akan di-log saat sesi berikutnya — append manual atau biar Claude yang summarize end-of-session)_

---

_Last updated: 2026-05-03_
_Heuristik update: setiap end-of-session ringkasin di sini, atau saat ada commit/decision baru._

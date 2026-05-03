# agents.md — Agent & mode routing guide

Project ini di-maintain pakai beberapa Claude surface yang punya capability beda. File ini guide kapan pakai apa, biar workflow konsisten cross-device.

---

## Surface yang dipakai

### 1. Claude Code (CLI / IDE) — primary developer surface
- **Trigger**: file code yang perlu ditulis/edit, run script, debug, refactor, run test, deploy
- **Lokasi**: terminal di repo root atau IDE integration (VS Code, JetBrains)
- **Auto-reads**: `CLAUDE.md`, lalu `memory.md`, `context.md`, `handover.md` di repo root (akan auto-include kalau direferensikan dari `CLAUDE.md` §0)
- **Output**: code commit, test, deploy
- **Convention**:
  - Run `pnpm --filter @jw/web typecheck` + lint sebelum commit
  - Conventional Commits format
  - Update `specs/<sprint>/STATUS.md` setelah selesai task spec

### 2. Cowork (desktop app) — document & general-purpose
- **Trigger**: bikin dokumen (.docx, .pptx, .pdf), draft copy non-code, riset, planning, file management
- **Lokasi**: Claude desktop app, folder selected = `C:\Users\Asus\Downloads\Prototipe Jubir Warga`
- **Auto-reads**: `CLAUDE.md` plus context dari workspace folder
- **Output**: file di workspace folder, ringkasan, plan
- **Convention**:
  - Pakai skill (`docx`, `pptx`, `pdf`, `xlsx`) saat bikin file
  - Save final output ke workspace folder, bukan outputs scratch
  - Pakai `computer://` link untuk share file

### 3. Web/Mobile chat (claude.ai) — quick brainstorm / drafting
- **Trigger**: brainstorming bebas, draft copy yang nggak butuh repo context, eksplor konsep
- **Output**: text saja
- **Convention**: hasil yang berguna copy-paste ke repo file (mis. `context.md` "Recent conversation summary") atau `handover.md`

---

## Sub-agents (di dalam Claude Code / Cowork)

Tools `Agent` (Cowork) atau spawning di Claude Code bisa launch sub-agent khusus. Pakai saat task butuh isolated context atau parallel execution.

| Sub-agent | Pakai untuk | Contoh prompt |
|---|---|---|
| **Explore** | Cari file/symbol di repo cepat tanpa muat context utama | "Di mana fungsi `getMockResponse` dipakai? Quick scan." |
| **Plan** | Design implementation plan untuk task kompleks | "Plan untuk port 5 ilustrasi SVG dari Phase 1 ke Phase 2 sesuai design v2 §2.5" |
| **general-purpose** | Multi-step research / task butuh banyak tool call | "Audit semua copy publik di `apps/web` yang masih pakai 'civic' atau 'warga negara kritis'. Report file + line." |
| **claude-code-guide** | Question tentang Claude Code feature/SDK/API itself | "Gimana cara setup hook di Claude Code biar auto-run typecheck pre-commit?" |

**Aturan sub-agent**:
- Sub-agent **tidak punya context conversation kita** — brief lengkap di prompt, sertakan file path + apa yang dicari
- Sub-agent return ringkasan; **verify dengan baca actual file** kalau hasilnya kritikal (misal nge-claim refactor selesai)
- Untuk task paralel independen, spawn dalam **satu message** biar concurrent
- Hindari delegate "understanding" — jangan kasih prompt "based on your findings, fix the bug"

---

## Mas (owner) — preferensi interaksi

- **Bahasa**: Indonesia santai (kamu/aku)
- **Format**: prosa, minimal bullet kecuali emang list. Tidak terlalu banyak header. Concise.
- **Length**: status update yang udah jelas tinggal acknowledge + next steps, bukan re-summary panjang
- **Pertanyaan klarifikasi**: ya kalau ada ambiguity penting, tapi jangan minta confirm hal yang udah obvious dari context
- **Push back**: encouraged kalau ada concern teknikal/strategis, tapi konstruktif
- **Decision irreversible**: explicit confirm dulu ("ini akan delete X folder, lanjut?")
- **Mode kerja**: sering pindah device (desktop ↔ laptop). Continuity via `git pull` + baca `handover.md`.

---

## Hand-off antar surface / device

Saat pindah surface (mis. Cowork desktop → Claude Code laptop):

1. **Sebelum pindah**: update `handover.md` dengan last commit, WIP, next step, open question. Push ke git.
2. **Di device baru**: `git pull`, baca `CLAUDE.md` → `memory.md` → `context.md` → `handover.md` (urutan).
3. **Lanjut kerja**: ambil dari "Next step" di `handover.md`.
4. **End of session**: update `context.md` "Recent conversation summary" + `handover.md`.

---

_Last updated: 2026-05-03_

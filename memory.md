# memory.md — Persistent context untuk Claude

Aku (Claude) baca file ini setelah `CLAUDE.md` di setiap session baru. Isinya:
- Identitas owner & nature project
- Decisions kunci yang udah di-lock
- Recurring quirks & workaround
- Brand voice digest (full di `CLAUDE.md` §4)

Kalau ada konflik dengan `CLAUDE.md`, **`CLAUDE.md` menang**. File ini supplement, bukan replacement.

---

## Owner

- **Nama panggilan**: Mas
- **Email**: admin@spdindonesia.org
- **Alias chat**: Sindikasi
- **Org**: SPD Indonesia (Sindikasi Pemilu & Demokrasi)
- **Role**: Owner & operator Jubir Warga
- **Komunikasi preferen**: Bahasa Indonesia santai. "kamu" untuk Claude, "aku" untuk diri sendiri. Direct, no fluff. Apresiasi caveat eksplisit saat decision irreversible.

## Project

- **Nama**: Jubir Warga (DIPISAH dua kata — bukan "Jubirwarga")
- **Status**: Beta, target launch publik **Juni 2026**
- **Tagline primary**: *"Setiap janji punya jejak"*
- **Tagline sub**: *"Janji ditagih, jejaknya tercatat"*
- **Positioning** (post-pivot 2026-05-04): "Platform akuntabilitas pemerintah berbasis data resmi (RPJMN/RPJMD/Visi Misi paslon) yang dianalisis AI untuk warga muda Indonesia"
- **Phase 1**: Live di `jubir.spdindonesia.org` (vanilla CDN, akan rename → `mockupjubir.spdindonesia.org` post-Phase 2 stable)
- **Phase 2**: Next.js + Supabase, in dev di `apps/web`. Deploy target: `jubirbetaapp.spdindonesia.org`
- **Brand domain target**: `jubirwarga.id` (post-launch)
- **Repo**: `https://github.com/msyafiqwahyudi26/Jubir-Warga`
- **Supabase project**: `ifrautpvbhdbhieystxk` (region ap-southeast-1)

## Locked decisions (jangan re-debate kecuali Mas eksplisit minta)

### Strategic (post-pivot 2026-05-04)

| Topic | Decision | Source |
|---|---|---|
| **Strategic backbone** | Tagih Janji = backbone. Live Watch AI = differentiator. Game = engagement. Komunitas = retention. | `docs/STRATEGY_PIVOT_2026-05-04.md` |
| **Tier 1 deep build** | Tagih + Game + Komunitas (Sprint 4 fokus) | strategy doc |
| **Tier 2 surface only** | Karya + Kelas + Aksi (maintenance mode, no new feature Sprint 4) | strategy doc |
| **Tagline primary** | "Setiap janji punya jejak" | strategy doc |
| **Tagline sub** | "Janji ditagih, jejaknya tercatat" | strategy doc |
| **Tone framing** | "akuntabilitas = dukungan terbaik" — kayak medsos KPK. Selaras pemerintah pusat, bukan oposisi. | strategy doc |
| **Audience** | B2C primary (warga muda 17-39) + B2B layer post-launch | strategy doc |
| **Data foundation** | RPJMN/RPJMD/Visi Misi/BPS Index/Media mainstream/Lapor warga UGC | strategy doc |
| **AI moderation** | Editorial human-in-loop pre-publish. Verification badge: "Terverifikasi Kurator" (manual) atau "Kurasi AI" (auto, marked) | strategy doc |
| **AI verdict tier** | 4-status: Aligned / Partial / Drift / Contradict (hindari binary "Diingkari" yang accusatory) | strategy doc |
| **Game mechanic Sprint 4** | Predict & Reveal (Mechanic A) — fact-grounded daily quiz | strategy doc |
| **Phase 1 cutover plan** | Phase 1 rename `jubir.spdindonesia.org` → `mockupjubir.spdindonesia.org` post Phase 2 stable T+14 hari | `deploy/phase2/PHASE1_RENAME.md` |
| **Phase 2 deploy target** | `jubirbetaapp.spdindonesia.org` di VPS Hostinger 76.13.196.172 | `docs/DEPLOY_DECISION_2026-05-04.md` |
| **Pre-pivot positioning DROP** | "VICE × Discord × Coursera × Change.org × Wordle" — DI-SUPERSEDE post 2026-05-04 | strategy doc |

### Brand & design (existing, unchanged post-pivot)

| Topic | Decision | Source |
|---|---|---|
| Brand spelling | "Jubir Warga" (dua kata terpisah) | `CLAUDE.md` §4.1 |
| Mascot/AI name | "Nala" — beo dengan 5 ekspresi. Bukan "Jubir" walaupun design doc lama menyebut. | `CLAUDE.md` §4.1 |
| Sub-brand 12-18 | "Warga Muda" (bukan "Jubir Warga Muda") | `CLAUDE.md` §4.1 |
| Voice address | "kamu" untuk user, "aku" untuk Nala. **Tidak pernah** "Anda"/"Saya". | `CLAUDE.md` §4.2 |
| Forbidden vocab | "civic", "warga negara yang kritis", jargon partisan | `CLAUDE.md` §4.3 |
| Logo font interim | Patrick Hand / Reenie Beanie / Kalam — **bukan Caveat** (Caveat khusus anotasi) | `CLAUDE.md` §5.3 |
| Logo final | Custom hand-crafted SVG by professional designer (post-funding, Sprint 5+) | `CLAUDE.md` §5.3 |
| Native unicode emoji | **Dilarang** sebagai dekorasi UI. OK di dalam quoted UGC. | `CLAUDE.md` §5.4b, §5.6 |
| Custom emoji set | Brand-aligned SVG (Sprint 4-5 BACKLOG) | `CLAUDE.md` §5.4b |
| Color palette | 11 token brand. **Jangan tambah warna baru.** | `CLAUDE.md` §5.1, §5.6 |
| Em dash policy | Selective — hapus di curated copy, keep di body UGC (Spec #16) | `specs/SPRINT-3/16-tier-a-cleanup.md` |

### Engineering (existing, unchanged)

| Topic | Decision | Source |
|---|---|---|
| Package manager | pnpm only (npm/yarn break workspace) | `CLAUDE.md` §2 |
| Supabase pin strategy | Tilde (`~`) untuk supabase-js & ssr — `^` nge-drift breaking compat | `CLAUDE.md` §2 |
| Demo data | `is_demo` flag per content table. Jangan filter sekarang, wipe pre-launch via `cleanup_demo_data()`. | `CLAUDE.md` §9 |
| Auth helper | `@supabase/ssr` (cookie-based). **Bukan** `@supabase/auth-helpers` (deprecated). | `CLAUDE.md` §2 |
| Migration immutability | `0001_*.sql` immutable setelah apply. Migration baru = file baru numbered. | `CLAUDE.md` §11 |
| AI embedding model | BGE-M3 multilingual (1024 dim, open source) — Sprint 4 build | `docs/STRATEGY_PIVOT_2026-05-04.md` |
| AI LLM analyzer | Claude Haiku 4.5 (cheap pre-filter) + Claude Sonnet 4.6 (final verdict) | strategy doc |
| Vector DB | pgvector di Supabase (existing, leverage) | strategy doc |
| Site header global | Wired di `app/layout.tsx` root (post Sprint 3 fix 2026-05-04) | repo: `app/layout.tsx` |

## Sprint 4 reduced scope (2026-05-05)

Per diskusi Mas overwhelm + reality check resource terbatas:
- **Source of truth**: `specs/SPRINT-4/SCOPE-REDUCED-2026-05-05.md`
- **Scope**: 5 spec untuk 5 window paralel (A admin schema, B Tagih light, C Game v1, D Beranda+brand copy, E self-host VPS+deploy)
- **Cost commitment**: $0 tambahan (leverage VPS existing + Anthropic Max + Supabase free)
- **Deferred Sprint 5+**: scraping automated, Live Watch automated, embedding, Nala live AI, BPS API, leaderboard gubernur, pgvector
- **Replacement**: manual seed janji via Cowork session (Mas + Claude), manual verdict generation
- **Stack final**: GlitchTip self-host (bukan Sentry $), Umami self-host (bukan Plausible $), Postgres LISTEN/NOTIFY (bukan Upstash/Inngest $), GitHub Actions cron (bukan Inngest $)
- **Target launch beta**: 2026-06-02 (4 minggu)
- **Prinsip**: imperfect MVP launch realistic > perfect tertunda. Sistem nyata + sustain > fitur lengkap.

## Recurring quirks & workaround

### Windows git push OOM
- **Symptom**: `git push` fail dengan out-of-memory di Windows
- **Workaround**:
  ```bash
  cd "C:\Users\Asus\Downloads\Prototipe Jubir Warga"
  git config --local pack.windowMemory 256m
  git config --local pack.packSizeLimit 256m
  git config --local pack.threads 1
  git push
  ```
- **Status**: recurring. Masuk BACKLOG untuk investigate root cause (LFS untuk asset besar? `.gitconfig` global tweak? split repo?)
- **Last hit**: push commit `383a82d` (Spec #12 + Nala mock responses, 2026-05-01)

## Brand voice quick reference

(Full di `CLAUDE.md` §4)

**Pakai**: "kamu" / "aku", kosakata anak muda (ngumpul, nimbrung, curhat, uneg-uneg, resah, gabung, kepo, capek), bilingual mix Indonesia + istilah Gen Z umum (vibe, deep dive, venting), Caveat font untuk anotasi tangan, data konkret.

**Hindari**: "Anda" / "Saya", "civic", "warga negara yang kritis", jargon politik berat, emoji unicode sebagai dekorasi UI.

**Reference tone**: Magdalene, Asumsi, VICE Indonesia, Whiteboard Journal.

## Persona Nala (digest)

- Beo (parrot) — origin story: simbol bahwa **suara itu penting**
- Hibrid sahabat (default) + mentor (saat user di kelas/diskusi serius)
- Pakai "aku"/"kamu", bilingual mix santai
- Sertakan sumber kalau claim sesuatu, akui ketidakpastian, tidak partisan
- Component path: `apps/web/src/components/nala/*`

Full system prompt di `CLAUDE.md` §4.5.

## Persona target (3 utama)

1. **Aulia** (21, mahasiswi Bandung) — explainer-driven, mau ngerti isu publik tanpa baca jurnal
2. **Reza** (26, NGO Surabaya) — punya opini, butuh panggung. Pakai Writing Partner & upload Karya
3. **Sari** (29, alumni Jubir Warga 2024, Jakarta) — community organizer, follow janji wali kotanya. Pakai Tagih Janji

## Tech stack pin (full di `CLAUDE.md` §2)

Node ≥20.11 · pnpm 9.12 · Next 15.0.3 · TS 5.6.3 strict · Tailwind 4.0-beta · TanStack Query 5.59 · Zustand 5.0 · Zod 3.23 · supabase-js ~2.105.1 · @supabase/ssr ~0.10.2 · lucide-react 0.460 · Vitest 4.x

---

_Last updated: 2026-05-03_
_Update file ini kalau ada decision baru yang locked. Kalau cuma WIP / dalam pertimbangan, taro di `context.md`._

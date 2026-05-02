# BACKLOG — Items untuk Sprint 5+ atau pasca-launch

> Ide bagus yang TIDAK urgent untuk current sprint. Catat di sini biar tidak lupa, tapi tidak ganggu fokus eksekusi.
>
> **Pre-beta launch checklist (Tier 1/2/3 actionable):** lihat `docs/AUDIT_PRE_BETA_2026-05-01.md`

---

## Strategy & Branding

### Pitch Deck VC / Impact Investor (terpisah dari pitch deck Muda Berdampak)

**Konteks:** Pitch deck `PitchDeck_MudaBerdampak_SPD.pptx` yang sudah ada fokus ke donor pendidikan (CSR, hibah, dinas pendidikan) — audience yang care tentang dampak per cohort + curriculum quality.

**Yang perlu:** Pitch deck terpisah untuk audience VC/impact investor yang care tentang scalability + retention + revenue model + tech moat. Story-nya:
- 3-tier ecosystem (Foundation 12-18 / Active 17-39 / Mentor 30+) = TAM 70 juta dengan funnel proven
- Platform Jubir Warga sebagai infrastruktur scaling Muda Berdampak
- Tech stack defensible (Supabase + Next.js + AI Nala)
- Path to revenue (Kelas berbayar Rp 150-350K, Nala Pro Rp 49K/mo, partnerships CSR)
- Traction proof (alumni 90 + chapter regional 3 + Pemilu 2024 journey)

**Timing:** Sprint 5+ saat sudah ada traction data dari beta launch (DAU, retention, alumni count). Pitch ke VC butuh angka, bukan vision saja.

**Owner:** Mas + planner (Claude) saat decision launch dekat.

---

### Brand consistency cleanup

**Konteks:** "Jubirwarga" (digabung, di pitch deck) vs "Jubir Warga" (dipisah, brand standar). Mas pilih yang dipisah.

**Yang perlu cleanup:**
- Edit `PitchDeck_MudaBerdampak_SPD.pptx` — semua occurrence "Jubirwarga" jadi "Jubir Warga"
- Edit `Proposal_MudaBerdampak_SPD.docx` (kalau ada inkonsistensi)
- Edit `Program Grant Application SPD_JubirWarga._Final EN.docx`
- Update tagline di slide 3 pitch deck: "Divisi Jubirwarga & Program Sekolah" → "Divisi Jubir Warga & Program Sekolah"
- Pitch deck slide 4: "Pelantikan Jubirwarga Muda" → "Pelantikan Warga Muda"

**Timing:** Sebelum pitch berikutnya ke investor / donor.

---

## Product Roadmap (Sprint 4+)

### Section khusus "Warga Muda" di app

**Konteks:** Alumni Muda Berdampak (12-18 SMP/SMA) jadi user organik Jubir Warga app. Tapi mereka butuh experience berbeda dari user 17-39 default:
- Tone language lebih scaffolded ("kamu/kami" bukan "lo/gue")
- Content moderation lebih strict
- Subset fitur (tidak semua di full app)
- Badge khusus paspor: "Warga Muda — Alumni [Sekolah/Cohort YYYY]"
- Onboarding via "kode camp Muda Berdampak" — tidak bisa daftar tanpa via fasilitator

**Tech consideration:**
- TIDAK perlu split codebase — same app, beda mode/route
- Toggle otomatis berdasar age di profile, atau via opt-in flag "alumni Muda Berdampak"
- Privacy ekstra untuk minor (UU PDP compliance, parental opt-in untuk < 16 tahun)

**Timing:** Sprint 5 atau 6 (setelah Sprint 4 polish + AI Nala real). Sebelum first cohort Muda Berdampak.

---

### Content policy 2-tier

**Konteks:** Default user 17-39 vs alumni 12-18 (Warga Muda) butuh moderation rules berbeda.

**Yang perlu di-design:**
- Section umum: standard moderasi
- Section Warga Muda: stricter — no mention sensitive topics (LGBT, agama, politik partisan tajam), parental opt-in untuk akun < 16 tahun, privacy-first untuk data minor
- Konsultasi pengacara untuk compliance UU PDP + UU Perlindungan Anak
- Lihat preceden Roblox Indonesia / TikTok kid mode policy

**Timing:** Sebelum first cohort Muda Berdampak online.

---

### "Theory of Change" operasionalisasi (Petisi → Stakeholder)

**Konteks:** Pilar Jubir Warga sebagai katalisator antara warga ↔ pengambil kebijakan. Sekarang petisi cuma counter ttd, belum ada mekanisme escalation jelas.

**Yang perlu dibangun:**

**Threshold-based escalation system:**
| Threshold | Aksi |
|---|---|
| 1,000 ttd | Auto-publish ke IG Jubir Warga + tag pejabat |
| 5,000 ttd | Surat resmi ke pejabat + minta respons publik 30 hari |
| 10,000 ttd | Permintaan audiensi formal |
| 25,000 ttd | Datang offline ke kantor stakeholder + media |

**Tabel `petisi_stakeholder_track`** (linked ke petisi):
- `stakeholder_name`, `contacted_at`, `response_received_at`, `response_text`, `status`, `next_action`
- Public timeline di Petisi Detail page

**Annual "Laporan Suara Warga Muda"** — 30-page document, distribusi ke kementerian + 575 anggota DPR + DPRD prioritas. Legitimacy artifact.

**Timing:** Sprint 4 atau 5. Akan jadi bagian dari spec "Petisi v2" — ekstensi dari spec yang sudah ada.

---

## Dev Quality

### Supabase typegen untuk views

**Status:** ✅ **DONE 2026-05-01** — commit `dff5a80`. Spec di `specs/SPRINT-3/06-supabase-typegen.md`.

**Lesson learned (penting untuk Sprint berikutnya):**

Diagnostic Spec #6 awal asumsi root cause adalah hand-written `Database` interface di `packages/data/src/types.ts` Views section yang tidak match Supabase JS v2.46+ shape. **Faktanya bukan itu.**

Real root cause yang ke-discover Claude Code saat eksekusi:
- `package.json` declare `@supabase/supabase-js@^2.46.1` + `@supabase/ssr@^0.5.2`
- `pnpm install` resolve supabase-js ke 2.105.1 (latest matching `^2.46.1`)
- supabase-js 2.105+ tambah generic constraint `SchemaName extends Exclude<keyof Database, "__InternalSupabase">`
- `@supabase/ssr@0.5.2` masih pakai signature lama `SchemaName extends string & keyof Database` (TIDAK exclude `__InternalSupabase`)
- Type constraint violated → schema infer ke `any` → `from()` infer ke `never` → semua field property error

**Fix:** Bump `@supabase/ssr` 0.5.2 → 0.10.2 + pin **tilde** (`~`) untuk both ssr & supabase-js supaya gak nge-drift lagi.

**Pattern untuk diingat:**
1. `^x.y.z` di package.json bisa nge-drift ke major-compatible latest (mis. `^2.46.1` → `2.105.x`)
2. Kalau ada peer-dep antara 2 package (mis. supabase-js + ssr), salah satunya nge-drift bisa break compat
3. Generated types dari Supabase CLI menambahkan field internal (`__InternalSupabase`) yang require updated peer
4. Pakai `~` tilde untuk lock minor version, atau pin exact version untuk peer-tightly-coupled deps

**Tracking action:** kalau ada migration baru di Supabase, re-run `supabase gen types typescript --project-id ifrautpvbhdbhieystxk > packages/data/src/database.types.ts` (lihat packages/data/README.md "Regenerate Database type" section).

---

### Operational note: Windows git OOM saat push besar

**Konteks (2026-05-01 dari Spec #X1 push):** Push pertama OOM dengan error Windows git malloc 500MB pack (saat repo size + delta compression peak). Workaround:

```powershell
git -c pack.windowMemory=128m -c pack.threads=1 push origin main
```

**Permanent config (recommended):**
```powershell
git config --global pack.windowMemory 128m
git config --global pack.threads 1
```

Trade-off: push sedikit lebih lambat (single-thread + window memory cap), tapi gak OOM crash.

**Affects:** Mas's local Git on Windows. Linux/Mac (kantor mungkin pakai WSL/Mac) gak kena.

**Catat di runbook:** kalau push gagal dengan "fatal: malloc, out of memory" atau "fatal: Out of memory", retry dengan flag di atas.

---

### Planner audit hygiene: verify file actually committed

**Lesson learned 2026-05-01:** `.gitignore` punya pattern `AUDIT_*.md` (untuk ignore audit draft). Saat aku push `docs/AUDIT_PRE_BETA_2026-05-01.md`, file ke-ignore — tapi `git push` tetap success (push commit lain). Aku salah verify "push success" sebagai "file pushed" tanpa cek `git show --stat <hash>`.

**Pattern correct ke depan:** untuk doc-only commit, planner WAJIB:
1. Setelah user paste `git push` output, minta `git show --stat <commit>` untuk verify file count
2. Atau `git ls-files | grep <filename>` untuk confirm tracked
3. Kalau ada file yang harus tracked tapi di-ignore .gitignore, tambah exception (`!path/pattern`)

Status: ✅ FIXED 2026-05-01 dengan add exception `!docs/AUDIT_*.md` + `!docs/PROGRESS_*.md` di `.gitignore`.

---

### Mock responses Nala (8 baru untuk match prompt chips)

**Konteks:** Sprint 2 Spec #5 deliver Nala panel dengan 3 curated mock response (Pasal 28E, kelas online, opini editorial) + fallback. Tapi 4 prompt chips di empty state (`NALA_SUGGESTIONS` di `nala-prompts.ts`) gak match keyword 3 rules itu — semua chip click → fallback response.

**Yang perlu:** planner draft 8 mock response baru yang match keyword chip:

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

**Tambah ke:** `apps/web/src/lib/nala/mock-responses.ts` (append ke `MOCK_RESPONSES` array).

**Timing:** Sprint 3 Spec #15 (polish pass).

**Owner:** planner draft → Mas review → Claude Code append.

---

### Mode selector UI di Nala panel

**Konteks:** Spec #5 Zustand store punya `mode: 'tanya' | 'coach' | 'writing' | 'advocacy'` tapi UI selector belum ada — semua chip default ke mode 'tanya'.

**Yang perlu:** Tab selector kecil di header panel Nala atau di atas composer. 4 tab: Tanya / Coach / Writing / Advocacy. Setiap tab filter `NALA_SUGGESTIONS` per mode (sudah ready di `nala-prompts.ts`).

**Timing:** Sprint 3 Spec #15 polish.

---

### React-markdown integration di Nala message bubble

**Konteks:** `nala-message-bubble.tsx` saat ini render markdown bullet sebagai literal `-`. Pakai `react-markdown` untuk proper rendering bullet, bold, link.

**Pertimbangan:** add deps + bundle size +30KB. Trade-off OK karena Nala adalah core UX surface.

**Timing:** Sprint 3 Spec #15 polish.

---

### Strategy: hybrid bridge → in-app upgrade (group chat + live videocall)

**Decision Mas (2026-05-01):** Hybrid approach untuk 2 fitur infra-heavy — leverage external service dulu (cheap + fast), upgrade ke in-app integration saat traction proven.

**Group chat:**
- **Sprint 3-4 BRIDGE: WhatsApp Group external**
  - Setiap chapter regional = 1 WA Group (Jakarta, Bandung, Malang, dll)
  - Setiap sub-komunitas = 1 WA Group (Pemantau APBD, Mahasiswa Jurnalisme, dll)
  - Komunitas page tampil "Gabung WhatsApp [Chapter] untuk chat realtime" + link
  - Cap 1024 anggota per group (Meta limit 2024)
- **Sprint 5+ UPGRADE: In-app Discord-like realtime chat**
  - Build saat traction proven (50+ active user per chapter)
  - Lihat detail di "Discord-like realtime chat di Komunitas" item below
  - Migrate gradual, WA Group jadi backup untuk older user

**Live videocall (Kelas + Event):**
- **Sprint 3-4 BRIDGE: Zoom / Google Meet external**
  - Mentor schedule live session manual
  - Kelas detail page: "Live session [tanggal] [jam] WIB. Join via [Zoom/Meet] →" link
  - Recording post-session upload ke YouTube/Drive, link di Kelas modul
  - Cost: Google Meet unlimited free, Zoom Pro $14.99/host/bulan kalau butuh rekam langsung
- **Sprint 5+ UPGRADE: Daily.co in-app integration**
  - Build saat 50+ kelas active dengan live session reguler
  - Mentor klik "Start live session" → in-app videocall (white-label brand)
  - Recording auto-archive Supabase Storage
  - Replay button per modul Kelas
  - Cost: $0.05/peserta-menit + 200 menit gratis/bulan, transparent pricing
  - Alternative: Jitsi (FREE self-host tapi maintenance), Whereby ($9.99/host/bulan)

**Action items Sprint 3-4 (bridge implementation):**
- Spec #11 atau patch: Komunitas page tampil WA Group link per chapter (admin Mas setup WA Group + paste link)
- Spec #9 patch: Kelas detail page "Schedule live session" widget (mentor manual entry tanggal+jam+link external)

**Action items Sprint 5+ (in-app upgrade):**
- Discord-like chat infra (Supabase Realtime channel + presence)
- Daily.co integration (account setup + JS SDK embed + recording webhook)
- Migration plan dari WA Group / Zoom external ke in-app

---

### Discord-like realtime chat di Komunitas

**Konteks (2026-05-01 dari Mas):** Komunitas saat ini pakai forum thread pattern (async, post + reply tree). Mas pengen tambah ruang bincang realtime kayak Discord — channel-based synchronous chat dengan presence + typing indicator + emoji reactions.

**Use case:**
- Chapter regional weekly hangout (sync conversation antar member chapter Jakarta misal)
- Sub-komunitas live discussion (Pemantau APBD diskusi APBD baru rilis)
- Nala AI room — channel khusus tanya-jawab Nala bareng-bareng
- Live reaction saat event/petisi launch

**Tech stack:**
- Supabase Realtime channel (broadcast + presence)
- Schema: `chat_channels`, `chat_messages`, `chat_reactions`
- UI: 3-panel layout (channels left + messages center + members right) sesuai Discord pattern
- Typing indicator via Realtime presence
- Emoji picker (lib `emoji-mart` atau native unicode)

**Timing:** Sprint 5/6 — gabung dengan live videocall infrastructure (sama-sama realtime stack). Atau standalone Sprint 6 kalau live videocall geser.

**Pertimbangan:**
- Forum thread tetap diutamakan untuk async + searchable knowledge base
- Realtime chat = supplement untuk active community engagement
- Moderation overhead lebih tinggi (tone bisa eskalasi cepat di realtime)
- Privacy: channel public vs private (invitation-only sub-komunitas)

---

### Custom SVG emoji set + custom icon set (brand-aligned)

**Konteks (2026-05-01 dari Mas):** Native unicode emoji (Apple/Google/Windows berbeda style) banned sebagai brand decor. Tapi **custom SVG emoji + custom icon set** yang di-design dengan brand identity Jubir Warga **diizinkan dan encouraged**.

**Detail di CLAUDE.md Section 5.4 + 5.4b:**
- Tier 1 (sekarang): Lucide icon stroke 1.5-2px sebagai placeholder
- Tier 2 (Sprint 4-5): Custom SVG icon + emoji set, hand-drawn feel mirror Nala mascot, palette 11 brand color

**Set awal yang harus dibikin:**

**Custom SVG emoji (~30-50 buah):**
- Kategori isu: Transport, Pangan, Pendidikan, Kesehatan, Lingkungan, Politik, Mental Health, Kerja, Budaya, Teknologi
- Reaksi user: love, like, insight (lampu), pertanyaan, capek, marah, sedih, bangga
- Status janji: ditepati (check coral), berjalan (loader marigold), mandek (clock), diingkari (X coral), belum (dash grey)
- Action: vote, share, bookmark, lapor, kontribusi
- Aksesoris: badge, level, trofi, sparkle (ala Nala)

**Custom SVG icon (~30-40 buah):**
- Replace Lucide bertahap dengan icon brand-aligned
- Stroke konsisten 1.5px hand-drawn feel (mirror logo)
- Set awal: home, message, edit, book, zap, target, gamepad, bell, search, user, settings

**Implementation:**
- Component path: `apps/web/src/components/jw-emoji/` + `apps/web/src/components/jw-icon/`
- Format: SVG sprite sheet (1 file `<symbol>` map) atau React component per ikon
- Lazy loaded per page yang butuh (gak global bundle)

**Owner:**
- **Designer task** (kalau ada di team) — desain SVG dengan Figma/Illustrator
- Atau **freelancer** (Sprint 4 budget) — brief dengan Brand Guideline + Nala mascot reference
- Atau **Mas + planner brainstorm** kalau perlu interim AI-generated SVG (low quality, tapi cepat untuk testing)

**Timing:** Sprint 4-5 — dimulai paralel dengan page port. Spec #15 polish (pre-beta) wajib swap minimal kategori isu + status janji emoji ke custom SVG.

**Reference inspirasi:**
- Notion emoji set (consistent style across categories)
- Apple Memoji (custom face/expression set)
- Discord emoji marketplace (kategori-based organization)

---

### Sprint 4 prep: jw_passport_numbers serial table (real uniqueness)

**Konteks (2026-05-01 dari Spec #12 audit):** `generateJWNumber(userId, year)` Sprint 3 pakai djb2-style hash deterministic dari userId — fast + no DB call, tapi **collision possible** kalau user count > 9999 (4-digit modulo). Sprint 4 saat user growth real, perlu DB-tracked serial.

**Sprint 4 migration:**

```sql
CREATE TABLE jw_passport_numbers (
  user_id uuid PRIMARY KEY REFERENCES auth.users,
  year integer NOT NULL,
  serial integer NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (year, serial)  -- enforce real uniqueness per year
);

-- Sequence per year (increment atomic)
CREATE OR REPLACE FUNCTION issue_jw_number(uid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_year int := EXTRACT(YEAR FROM now())::int;
  next_serial int;
  jw_num text;
BEGIN
  -- Idempotent: kalau user udah punya, return existing
  SELECT 'JW-' || year || '-' || lpad(serial::text, 4, '0')
  INTO jw_num
  FROM jw_passport_numbers
  WHERE user_id = uid;
  IF FOUND THEN RETURN jw_num; END IF;
  
  -- Atomic increment + insert
  SELECT COALESCE(MAX(serial), 0) + 1
  INTO next_serial
  FROM jw_passport_numbers
  WHERE year = current_year;
  
  INSERT INTO jw_passport_numbers (user_id, year, serial)
  VALUES (uid, current_year, next_serial);
  
  RETURN 'JW-' || current_year || '-' || lpad(next_serial::text, 4, '0');
END;
$$;
```

**Refactor Spec #12:**
- `lib/profil/nomor-jw.ts` — replace `generateJWNumber` deterministic hash dengan `supabase.rpc('issue_jw_number', { uid: userId })`
- Migration: backfill existing user JW number (loop semua profile, call RPC)
- Test: assertion JW number unique across users

**Timing:** Sprint 4 awal — sebelum traction beta. User count <100 = collision risk masih low, tapi proper DB-tracked = best practice scaling.

---

### Sprint 4 prep: janji_per_partai aggregate view + pejabat_level column

**Konteks (2026-05-01 dari Spec #11 audit):** PartaiDashboard pakai mock % hard-coded fallback karena belum ada aggregate view. Plus level filter di Tagih Index pakai workaround (pre-select pejabat ids → `.in()`) karena `janji_with_pejabat` view tidak expose `pejabat_level` column.

**Sprint 4 cleanup migration:**

```sql
-- 1. Tambah pejabat_level ke janji_with_pejabat view
DROP VIEW janji_with_pejabat;
CREATE VIEW janji_with_pejabat AS
SELECT
  j.*,
  p.nama AS pejabat_name,
  p.jabatan AS pejabat_jabatan,
  p.level AS pejabat_level,  -- NEW column
  p.partai AS pejabat_partai,
  p.foto_url AS pejabat_foto
FROM janji j
LEFT JOIN pejabat p ON p.id = j.pejabat_id;

-- 2. Bikin aggregate view per partai
CREATE VIEW janji_per_partai AS
SELECT
  p.partai,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE j.status = 'Ditepati')  AS ditepati,
  COUNT(*) FILTER (WHERE j.status = 'Berjalan')  AS berjalan,
  COUNT(*) FILTER (WHERE j.status = 'Mandek')    AS mandek,
  COUNT(*) FILTER (WHERE j.status = 'Diingkari') AS diingkari,
  COUNT(*) FILTER (WHERE j.status = 'Belum')     AS belum,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS percent_total
FROM janji j
LEFT JOIN pejabat p ON p.id = j.pejabat_id
WHERE p.partai IS NOT NULL
GROUP BY p.partai
ORDER BY total DESC;
```

**Refactor Spec #11:**
- `partai-dashboard.tsx` — replace mock `partaiStats.map((p, idx) => ({...p, percent: 38 - idx*4}))` dengan `supabase.from('janji_per_partai').select('*')`
- `app/tagih/page.tsx` — drop level filter workaround, langsung `q.eq('pejabat_level', filter.level)`

**Timing:** Sprint 4 awal — natural cleanup yang Spec #11 audit expose.

---

### Sprint 4 prep: vote_polling Postgres RPC (atomic increment)

**Konteks (2026-05-01 dari Spec #10 audit):** votePollingAction Sprint 3 pakai fallback pattern: insert ke `polling_votes` (PK enforce one-vote-per-user), kalau success increment `polling.options[].votes` jsonb manually + bump `total_votes`. **TOCTOU race possible**: 2 user vote bersamaan → kedua read state lama, kedua tulis → 1 vote hilang.

**Sprint 4 fix sebelum Realtime subscriptions:**

```sql
CREATE OR REPLACE FUNCTION vote_polling(
  polling_id uuid,
  option_id text,
  voter_id uuid
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Atomic insert (PK enforce one-vote)
  INSERT INTO polling_votes (polling_id, user_id, option_id, voted_at)
  VALUES (polling_id, voter_id, option_id, now());
  
  -- Atomic jsonb update via SQL function (no read-modify-write race)
  UPDATE polling
  SET options = jsonb_set(
        options,
        '{' || (
          SELECT idx - 1 
          FROM jsonb_array_elements(options) WITH ORDINALITY AS arr(elem, idx)
          WHERE elem->>'id' = option_id
        ) || ',votes}',
        to_jsonb((
          (SELECT (elem->>'votes')::int 
           FROM jsonb_array_elements(options) AS elem 
           WHERE elem->>'id' = option_id) + 1
        ))
      ),
      total_votes = total_votes + 1
  WHERE id = polling_id;
END;
$$;
```

**Refactor Spec #10 actions.ts:** replace fallback pattern dengan single RPC call:
```ts
const { error } = await supabase.rpc('vote_polling', {
  polling_id: ..., option_id: ..., voter_id: user.id
});
```

**Timing:** Sprint 4 awal — sebelum Realtime vote subscription (race condition more critical saat live update).

---

### Sprint 4 prep: kelas_modul_completion table refactor

**Konteks (2026-05-01):** Spec #9 LessonPlayer pakai idempotency via target-progress comparison (current >= target → no-op). Sederhana untuk MVP, tapi gak granular per-modul.

**Sprint 4 quiz integration butuh per-modul tracking:**
- Score per modul (untuk certificate calculation)
- Completion timestamp per modul (untuk analytics)
- Quiz attempt history per modul (retry policy)
- Resume-from-where-left-off lebih akurat

**Migration baru (Sprint 4 awal, sebelum quiz spec):**
```sql
CREATE TABLE kelas_modul_completion (
  user_id uuid REFERENCES auth.users,
  modul_id uuid REFERENCES kelas_modul,
  kelas_id uuid REFERENCES kelas,
  completed_at timestamptz NOT NULL DEFAULT now(),
  score numeric(5,2),  -- nullable, untuk modul tanpa quiz
  attempts integer DEFAULT 1,
  PRIMARY KEY (user_id, modul_id)
);
```

**Refactor Spec #9 actions.ts:** replace target-progress logic dengan insert ke `kelas_modul_completion`, recalc `kelas_enrollment.progress` dari count completion.

**Timing:** Sprint 4 awal — sebelum quiz spec. Mark sebagai dependency.

---

### Kelas interactive — extended vision

**Konteks (2026-05-01 dari Mas):** Vision Kelas Jubir Warga: se-interaktif mungkin, online + dalam jaringan, dengan pre-test/post-test + video pembelajaran + games + live videocall.

**Sprint roadmap (per planner breakdown):**

**Sprint 3 (MVP, Spec #9):**
- Catalog + Detail + LessonPlayer markdown + simple enrollment
- Foundation: component slot pattern di lesson untuk extend

**Sprint 4:**
- Pre-test + Post-test quiz system (DB `kelas_quiz`, `kelas_quiz_attempt`, scoring, retry)
- Video player embed (YouTube/Vimeo, atau Bunny.net untuk self-host) dengan progress save
- Module-level games infrastructure (component slot)
- Certificate generation (PDF setelah complete + score min 70%)

**Sprint 5:**
- Live videocall — rekomendasi: **Daily.co** ($0.05/peserta-menit, 200 menit gratis/bulan, JS SDK ringan, white-label OK) atau Jitsi self-host
- Use case: live session 1-on-1 mentor, kelas kelompok max 25 orang
- Recording archive ke Supabase Storage
- Games infrastructure deeper — leverage TebakKata pattern + new game types per topik (drag-match, fill-blank, ordering)

**Sprint 6+:**
- Pricing tier (Free + Pro + Enterprise)
- Payment integration (Midtrans untuk Indonesia)
- Coupon/promo codes
- Affiliate program

**Status pricing sekarang:** ~~Rp 350.000~~ → "FREE selama beta & alpha + pengguna awal" badge.

---

## Discussion Notes (untuk continuity)

### Nala lore (origin story)

Decision Mas: beo = simbol "suara itu penting", dia bantu warga bersuara. Nama "Nala" tetap untuk sekarang, mungkin rebrand di Sprint 5 setelah feedback investor/early users (kalau perlu).

Draft origin story untuk reference:
> "Nala adalah beo yang besar di tengah kerumunan warga. Dia mendengarkan setiap percakapan di pasar, di kampus, di angkot, di kos. Dia mengingat. Dan saat warga bingung gimana ngomong, Nala tahu cara menyampaikan — sederhana, jujur, sampai ke yang harus dengar."

Iteration di Sprint 4 saat AI Nala real wired.

### Class clarity reframing

Audience BUKAN "anak muda Indonesia" generic, tapi 3-tier ecosystem:
- **Foundation 12-18 (SMP/SMA)** — channel: Muda Berdampak camp + workshop sekolah
- **Active 17-39 (kuliah + early career)** — channel: platform digital + kampus partnership
- **Mentor 30+ (alumni mature, akademisi)** — channel: sub-komunitas khusus, mentor program

TAM 70 juta dengan funnel proven (offline → online → multiplikasi via chapter regional).

---

Last updated: 2026-05-01 (Spec #6 done — supabase typegen + dep version pin lesson learned added)

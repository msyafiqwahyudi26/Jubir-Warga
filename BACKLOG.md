# BACKLOG — Items untuk Sprint 5+ atau pasca-launch

> Ide bagus yang TIDAK urgent untuk current sprint. Catat di sini biar tidak lupa, tapi tidak ganggu fokus eksekusi.

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

**Status:** 📋 **SCHEDULED** — `specs/SPRINT-3/06-supabase-typegen.md` (spec written 2026-05-01, ready untuk Claude Code).

**Konteks:** Pre-existing typecheck error di `apps/web/src/components/beranda/petisi-preview.tsx` — `Property 'current_count' does not exist on type 'never'`. Penyebab confirmed planner audit 2026-05-01: hand-written `Database` interface di `packages/data/src/types.ts` Views section format-nya `{ Row: ... }` saja (tanpa `Insert/Update/Relationships`), tidak match expected shape Supabase JS v2.46+.

**Yang perlu:**
```bash
supabase gen types typescript --project-id ifrautpvbhdbhieystxk > packages/data/src/database.types.ts
```
Lalu update `packages/data/src/types.ts` untuk re-export Database dari `database.types.ts`.

**Timing:** Sprint 3 awal — Spec #6.

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

Last updated: 2026-05-01 (Sprint 2 closed → Sprint 3 plan grounded; added Nala mock + mode selector + react-markdown items)

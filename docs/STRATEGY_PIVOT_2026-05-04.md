# STRATEGY PIVOT — Tagih Janji as Backbone

**Date**: 2026-05-04
**Owner**: Mas (SPD Indonesia / Jubir Warga)
**Trigger**: Strategic alignment meeting 2026-05-04. Repositioning dari "platform serba-ada" ke "platform akuntabilitas berbasis data + AI".
**Supersedes**: Positioning lama "VICE × Discord × Coursera × Change.org × Wordle" (CLAUDE.md §1 pre-pivot)

---

## TL;DR

Jubir Warga adalah **platform akuntabilitas pemerintah berbasis data resmi (RPJMN/RPJMD/Visi Misi paslon) yang dianalisis AI untuk warga muda Indonesia**.

- **Backbone**: Tagih Janji — database janji + alignment scoring + dashboard publik
- **Engagement**: Janji vs Realita — game ringan fact-grounded
- **Differentiator**: Live Watch AI — scrape media mainstream + analyze alignment vs visi misi/RPJMN real-time
- **Trust signal**: editorial moderation — every claim tagged "Terverifikasi Kurator" atau "Kurasi AI"
- **Tone**: kritis fakta, pro-democracy, **selaras agenda pembangunan pemerintah pusat** (bukan oposisi)

**Tagline primary**: *"Setiap janji punya jejak"*
**Tagline sub**: *"Janji ditagih, jejaknya tercatat"*

---

## 1. Why pivot

### Sebelum pivot (CLAUDE.md original)

- Positioning campuran 5 produk: VICE Indonesia × Discord × Coursera × Change.org × Wordle
- 5 surface horizontal sama-rata: Komunitas / Karya / Kelas / Aksi / Tagih (+Main games)
- Equal investment per fitur → resource thin spread, gak distinctive

### Setelah pivot

- 1 thesis kuat: **akuntabilitas pemerintah dengan data resmi + AI alignment auditor**
- Tier 1 deep build: Tagih + Game + Komunitas
- Tier 2 surface only (gak deep build): Karya / Kelas / Aksi
- Existing brand IG @jubirwarga.id sudah dikenal "yang berisik tagih janji" — leverage that

### Resource reality

Tim kecil (early stage), gak bisa deep ke 6 fitur sekaligus = mubazir + lemah semua. Pivot ke 3 deep = distinctive + sellable.

### Strategic angle "menjual"

- **B2C**: warga muda 17-39, free platform, gamified awareness
- **B2B (future)**: API access ke janji DB untuk peneliti/NGO/media; dashboard kepatuhan janji untuk pemerintah; sponsorship konten edukasi
- Hybrid path: B2C entry + B2B revenue layer

---

## 2. Theory of Change

```
HULU                                                              HILIR
─────                                                             ─────

INPUT DATA                ──▶  AI PROCESSING        ──▶  OUTPUT (UI/UX)         ──▶  OUTCOME
                                                                                
RPJMN (Bappenas)               Embedding + LLM          Tagih Dashboard               Awareness
RPJMD (38 prov +               (alignment score,        Live Watch Feed               kebijakan ngaruh
       514 kab/kota)            verdict, reasoning)     Janji vs Realita              ke hidup
Visi Misi paslon (KPU)                                  game                          sehari-hari
Indeks BPS (IPM/IDH)           Editorial moderation     Komunitas thread per          ↓
Media mainstream RSS           (human-in-loop:          janji
Lapor Janji warga (UGC)        ✅ Terverifikasi /                                     Partisipasi
                               🤖 Kurasi AI tagged)                                   politik informed
                                                                                      ↓
                                                                                      Lapor janji baru
                                                                                      Vote bijak
                                                                                      Akuntabilitas warga
```

---

## 3. Pillar fitur — Tier 1 (deep) vs Tier 2 (surface)

### Tier 1 — DEEP BUILD (Sprint 4 fokus)

#### 1.1 Tagih Janji (BACKBONE)

**Apa**: Database publik janji pejabat dengan alignment scoring per janji vs RPJMN/RPJMD/Visi Misi.

**Komponen**:
- Dashboard publik per provinsi/region (alignment %, status timeline)
- Leaderboard "Gubernur paling tepat janji" — gamified public scrutiny
- Pejabat profile: semua janji historical + skor kepatuhan agregat
- Lapor Janji form (UGC) — moderated submission
- Filter: Per topik (Ekonomi/Pendidikan/Kesehatan/Lingkungan) / Per partai / Per region / Per status

**Data sources**:
- RPJMN (Presiden + Wapres + 7 menteri kunci)
- RPJMD nasional → 38 prov → 514 kab/kota (phased)
- Visi Misi paslon (KPU per pemilu/pilkada)
- BPS Index (IPM/IDH/IPMD) untuk konteks indikator pembangunan

**Verification badge**:
- ✅ **Terverifikasi Kurator** — manual editorial review oleh tim Jubir Warga
- 🤖 **Kurasi AI** — auto-generated dari ETL pipeline + LLM, tagged transparently

#### 1.2 Live Watch AI (DIFFERENTIATOR)

**Apa**: Real-time scraper + AI alignment auditor yang detect janji baru terucap di media mainstream, lalu analyze konsistensi-nya vs visi misi/RPJMN/RPJMD asli.

**Workflow**:
1. Scraper RSS poll Kompas/Tempo/Detik/Antara/CNN ID/Tirto setiap 30 menit
2. Filter quote pejabat (NER + entity recognition)
3. Embedding statement → retrieve top-K similar janji historical/visi misi
4. LLM analyze → output 4 verdict status:
   - ✅ **Aligned** — selaras dengan RPJMN/visi misi
   - 🟢 **Partial** — sebagian sesuai, sebagian deviasi
   - 🟡 **Drift** — tidak ada di visi misi atau target deviasi signifikan
   - 🔴 **Contradict** — bertentangan dengan janji sebelumnya
5. **Editorial moderator review** sebelum publish (mandatory anti-defamation)
6. Publish ke Live Watch Feed di app + push notif ke follower
7. Auto-create Komunitas thread untuk diskusi

**Cost estimate**: $15-30/bulan beta scale, ~$100-200/bulan launch

**Tech stack**:
- Embedding: BGE-M3 multilingual (open source) atau Cohere
- LLM: Claude Haiku (cheap pre-filter) + Claude Sonnet (final verdict)
- Vector DB: pgvector di Supabase (existing)
- Scraper: Python + Playwright + RSS feeds
- Cron: GitHub Actions atau Supabase Edge Functions

#### 1.3 Janji vs Realita Game (ENGAGEMENT)

**Apa**: Daily game ringan (30 detik) yang awareness-focused, fact-grounded.

**Mechanic primary**: **Predict & Reveal** (Mechanic A dari brainstorm)

```
"Janji [pejabat] tahun [year]: '[claim]' deadline [deadline].
 Status saat ini menurut data RPJMN + Live Watch?"

Pilihan:
A. ✅ Aligned (sudah berjalan sesuai)
B. 🟢 Partial (target lambat tapi jalan)
C. 🟡 Drift (target berubah / inkonsisten)
D. 🔴 Contradict (bertentangan / dibatalkan)

Reveal: real status dari DB + AI reasoning
Score: kalibrasi prediksi (1 poin per benar)
Share: "Gue tepat 7/10 prediksi minggu ini"
```

**Tujuan**: awareness tool — edukasi pasif, gak retain user. Daily 30-second touch. Tidak butuh login (anonymous play, optional save score).

**Mechanic secondary** (Sprint 5): **Daily Verdict** (Tinder-swipe per janji untuk collective wisdom DB).

#### 1.4 Komunitas (RETENTION)

**Apa**: Forum diskusi yang **strict tied ke janji** — bukan forum general.

**Komponen**:
- Thread per janji (auto-created saat janji baru muncul di Live Watch)
- Thread tagged: `janji_id` foreign key (Sprint 4 spec)
- Diskusi format: free-form post + reply tree + vote
- Moderasi: editorial team flag spam/toxic

**Bukan**: forum general (Reddit/Discord clone). Setiap thread harus context kebijakan/janji konkret.

### Tier 2 — SURFACE ONLY (siap ada, gak deep build Sprint 4)

#### 2.1 Karya
- Maintenance mode — existing 42 karya tetap render
- 5 long-form artikel (Spec #19) sudah seeded
- Tidak ada new feature build Sprint 4
- Future expansion: longform editorial journalism around janji-janji panas

#### 2.2 Kelas
- Maintenance mode — 6 kelas existing render
- Tidak ada new feature build Sprint 4
- Future direction: convert jadi "literasi kebijakan" only — kurikulum berbasis kasus janji real (e.g., "Cara baca APBD", "Memahami RPJMD")

#### 2.3 Aksi
- Maintenance mode — petisi + polling existing render
- Tidak ada new feature build Sprint 4
- Future direction: petisi/polling **wajib tied ke janji_id** — bukan generic petisi

### Cross-cutting

- **Nala AI**: guide/explainer per janji — leverage same backend yang power Live Watch (embedding + LLM context)
- **Profil/Paspor**: identitas warga, level/XP per partisipasi
- **Auth**: existing Supabase setup, no change

---

## 4. Brand positioning

### Pre-pivot vs Post-pivot

| Aspect | Pre-pivot | Post-pivot |
|---|---|---|
| Positioning | "VICE × Discord × Coursera × Change.org × Wordle" | "Platform akuntabilitas pemerintah berbasis data + AI untuk warga muda" |
| Tagline | "Suara warga, rumahnya di sini" | **"Setiap janji punya jejak"** |
| Sub-tagline | — | "Janji ditagih, jejaknya tercatat" |
| Core promise | Rumah online untuk semua kebutuhan civic | Tracking janji pejabat secara terstruktur dengan AI alignment |
| Tone | Generic Gen Z friendly | Kritis fakta + pro-democracy + selaras pembangunan |
| Audience | 17-39 anak muda Indonesia | 17-39 anak muda Indonesia (unchanged) |

### Tone framing

**Inspirasi**: medsos KPK — kritis fakta tapi pro-democracy + edukatif.

**Bukan**: oposisi pemerintah, partisan, attack-mode.
**Adalah**: "akuntabilitas adalah bentuk dukungan terbaik" — Tagih Janji = bantu pemerintah deliver, bukan attack.

**Kalibrasi**:
- DRIFT verdict di-frame "perlu klarifikasi", bukan "ingkar"
- Setiap verdict include link tanggapan resmi instansi terkait
- Open dialogue: pejabat boleh request klarifikasi → ditampilkan di samping AI verdict

### Audience prioritization

**Primary**: Anak muda 17-39 Indonesia (B2C)
- Aulia (21, mahasiswi) — explainer-driven
- Reza (26, NGO) — punya opini, butuh panggung
- Sari (29, alumni Jubir Warga 2024) — community organizer

**Secondary (B2B layer, post-launch)**:
- NGO/peneliti — API access ke janji DB
- Media — embed widget janji per topik / region
- Pemerintah (OPD/dinas) — dashboard kepatuhan janji
- Brand sponsor — konten edukasi public interest

---

## 5. Risk + mitigation

### Risk 1 — AI defamation liability

**Risk**: Kalau AI bilang "DRIFT" atau "CONTRADICT" tapi salah, bisa kena UU ITE / pencemaran nama baik pejabat.

**Mitigation**:
- **Editorial moderation MANDATORY** sebelum publish (manusia gatekeeper)
- 4-tier verdict status (Aligned/Partial/Drift/Contradict) — hindari binary "Diingkari" yang accusatory
- Source citation per verdict (RPJMN halaman X, media tanggal Y, kutipan exact)
- Disclaimer: "Verdict berdasar AI + dokumen publik, bukan tuduhan final"
- **Verification badge transparent**: "Terverifikasi Kurator" (manual review) vs "Kurasi AI" (auto, marked)
- Open right-of-reply: pejabat bisa request klarifikasi → ditampilkan side-by-side

### Risk 2 — Scraping legality + scale

**Risk**: Scraping media mainstream + dokumen resmi = legal? Scale 38 prov × 5 tahun update = besar.

**Mitigation**:
- **RPJMN/RPJMD/KPU**: dokumen publik UU KIP, definitely legal
- **Media mainstream**: legal kalau public + attribution + fair use. Hindari full content reproduction (only relevant quote)
- **Phased rollout**: nasional + 10 prov terbesar Sprint 4. Sisanya batch by batch.
- **Partnership data org**: kerja sama Perludem / ICW / Kode Inisiatif untuk dataset sharing

### Risk 3 — Tone "selaras" vs realita "drift detected"

**Risk**: Kalau Live Watch sering detect DRIFT, persepsi publik bisa "platform kritis pemerintah" — kontradiksi framing "selaras".

**Mitigation**:
- Headline framing: "Pantau progress janji untuk bantu akselerasi RPJMN"
- DRIFT = "perlu klarifikasi", bukan "ingkar"
- Dialog channel: pejabat right-of-reply visible
- Editorial editorial team kalibrasi tone per case

### Risk 4 — Scope creep Sprint 4

**Risk**: Live Watch AI + scraping + dashboard + game = banyak. Bisa miss launch target.

**Mitigation**:
- Strict P0 (must-launch) vs P1 (nice-to-have) vs P2 (defer)
- Parallel agent execution (proven effective di batch 1+2 Sprint 3)
- MVP first: nasional only, 5 menteri, 10 provinsi, 1 game mechanic, 1 verdict tier
- Iterate post-launch berdasar real user feedback

---

## 6. Sprint 4 concrete plan

Detail di `specs/SPRINT-4/00-overview.md`. Ringkasan:

### P0 — must-launch (Sprint 4 core, 4-6 minggu)

| # | Spec | Owner | Estimate |
|---|---|---|---|
| 24 | Tagih Dashboard v2 (alignment % + leaderboard) | Window A | 1-1.5 minggu |
| 25 | RPJMN/RPJMD scraping pipeline (nasional + 10 prov) | Window B | 2-3 minggu |
| 28 | Janji vs Realita game v2 (Predict & Reveal mechanic) | Window C | 1 minggu |
| 29 | Live Watch AI MVP (scraper + alignment + verdict) | Window D | 2-3 minggu |
| 30 | Editorial moderation system (verification badge) | Window E | 1 minggu |
| 32 | Beranda redesign (Tagih + Game prominent) | Window F | 0.5-1 minggu |
| 33 | Brand copy + tagline pivot | Window G | 0.5 minggu |

### P1 — nice-to-have (Sprint 4 stretch atau Sprint 5)

| # | Spec | Estimate |
|---|---|---|
| 26 | Visi Misi paslon scraper (KPU) | 1 minggu |
| 27 | BPS Index integration (IPM/IDH/IPMD context) | 0.5-1 minggu |
| 31 | Komunitas thread → janji_id foreign key | 0.5 minggu |

### P2 — defer / maintenance

| # | Note |
|---|---|
| 34 | Karya/Kelas/Aksi → maintenance mode (no new feature) |
| 35 | RPJMD kab/kota expansion (post nasional + prov stable) |

### Sprint 4 success criteria

- ✅ Tagih Dashboard render alignment % per janji per region
- ✅ Scraping pipeline working untuk minimal RPJMN nasional + 10 prov RPJMD
- ✅ Live Watch detect janji baru di media → AI verdict → editorial review → publish
- ✅ Janji vs Realita game playable, fact-grounded
- ✅ Beranda dominate Tagih + Game (bukan equal-weight 6 fitur)
- ✅ Brand copy match new positioning
- ✅ Editorial verification badge visible per content piece

---

## 7. Pre-Sprint 4 closure (Sprint 3 leftover)

- Spec #22 deploy activation (Mas manual, ~2 jam) — VPS Hostinger ke `jubirbetaapp.spdindonesia.org`
- Spec #19 Karya content drafts 06-10 force-overwrite (low priority, defer)
- Sprint 3 STATUS final
- Site header global fix (commit langsung — single small change)

---

## 8. Decision log (this pivot)

| Decision | Rationale |
|---|---|
| Tagih Janji = backbone | Strongest distinctive value, aligned SPD mission, brand IG already established |
| Tier 1 deep / Tier 2 surface | Resource constraint, focus = sellable |
| Janji vs Realita Predict & Reveal mechanic A | Awareness tool fact-grounded, share-viral, low retention pressure |
| AI moderation human-in-loop | Anti-defamation + trust signal via verification badge |
| Tone selaras pemerintah pusat | Trust + scaling + B2B partnership opportunity, "akuntabilitas = dukungan" framing |
| Tagline "Setiap janji punya jejak" | Concise, memorable, neutral tone, action-oriented |
| Audience B2C primary + B2B secondary | Hybrid path, monetization layer post-launch traction |
| RPJMN/RPJMD/Visi Misi as data foundation | Official documents, legal scrape, authoritative source |
| Maintenance mode Karya/Kelas/Aksi | Existing OK, no Sprint 4 build, future iteration |
| Editorial verification 2-tier badge | "Terverifikasi Kurator" (manual) vs "Kurasi AI" (auto) — transparent |

---

## 9. Migration path

### From Phase 2 current state

Phase 2 sekarang punya 5 fitur built equal-weight (Komunitas/Karya/Kelas/Aksi/Tagih + Main games). Pivot **bukan rebuild** — re-prioritize + extend Tagih significantly.

### Tidak di-rebuild

- Auth (Supabase + 4 provider) — keep
- Footer (Phase 1 4-col) — keep, mungkin update copy
- Nala panel UI — keep, leverage backend baru
- Komunitas/Karya/Kelas/Aksi UI — keep, lapisan data baru

### Yang di-extend

- **Tagih**: dari basic dashboard → full alignment scoring + leaderboard
- **Database schema**: tambah `rpjmn_target`, `visi_misi`, `media_quote`, `alignment_verdict`, `editorial_review` tables
- **AI backend**: tambah embedding + LLM + scraper pipeline (Python + Edge Functions)

### Yang di-redesign

- **Beranda**: ganti hero "Yang lagi rame" → "Janji yang lagi ditagih hari ini" + game card prominent
- **Nav**: prioritas Tagih + Main game di posisi 2 + 3 (setelah Beranda)

### Yang di-defer

- Visual parity Phase 2 vs Phase 1 nav icon — defer ke Sprint 5
- Karya/Kelas/Aksi feature build — defer indefinitely (maintenance mode)

---

## 10. Long-term vision (post Sprint 4)

### 6 bulan
- Live Watch AI proven track record (>500 janji analyzed, >100 verdicts published)
- Tagih DB cover nasional + 38 provinsi RPJMD
- 10K+ MAU active (warga muda 17-39 Indonesia)
- Partnership minimum 1 lembaga riset (Perludem/ICW/Kode)

### 12 bulan
- B2B layer launch — API access tier untuk peneliti/NGO
- RPJMD kab/kota expansion (target 100 region)
- Game mechanic expansion (Daily Verdict + leaderboard regional)
- White-label partnership pemerintah daerah (1-2 pilot)

### 24 bulan
- 100K+ MAU
- Standard reference for "tracking janji pejabat Indonesia"
- Sustainable revenue dari B2B layer ($5K-20K MRR)
- Advocacy impact: kebijakan dipantau bareng-bareng oleh warga, bukan elite circle

---

## 11. References

- Pre-pivot positioning: `CLAUDE.md` §1 (akan di-update)
- Sprint 3 status: `specs/SPRINT-3/STATUS.md`
- Phase 1 reference: `https://jubir.spdindonesia.org`
- Tech stack pin: `CLAUDE.md` §2
- Audit pre-beta: `docs/AUDIT_PRE_BETA_2026-05-01.md`

---

_Last updated: 2026-05-04 — locked decisions, will supersede on next major pivot_

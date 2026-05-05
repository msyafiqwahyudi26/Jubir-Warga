# Sprint 4 — Tagih Backbone Deep Build

**Sprint duration**: 4-6 minggu (start: 2026-05-05)
**Theme**: Pivot ke Tagih Janji backbone + Live Watch AI + game fact-grounded
**Source pivot**: `docs/STRATEGY_PIVOT_2026-05-04.md`
**Brand pivot**: tagline "Setiap janji punya jejak"

---

## 🎯 Sprint goals

1. **Tagih Janji jadi backbone** — alignment scoring per janji, dashboard publik, leaderboard regional
2. **Live Watch AI** — real-time scraper media + AI alignment auditor (the differentiator)
3. **Janji vs Realita game** — Predict & Reveal mechanic, fact-grounded
4. **Editorial moderation** — verification badge "Terverifikasi Kurator" / "Kurasi AI"
5. **Beranda redesign** — Tagih + Game prominent, drop equal-weight 6 fitur
6. **Brand copy pivot** — tagline + tone "akuntabilitas = dukungan"

**Bukan goal Sprint 4** (defer Sprint 5+):
- Visual parity Phase 1 nav icon detail
- Karya/Kelas/Aksi feature build (maintenance mode)
- RPJMD kab/kota full coverage (sebatas nasional + 10 prov dulu)
- B2B API monetization layer

---

## 📋 Spec list

### P0 — Must-launch (Sprint 4 core)

| # | Spec | File | Owner Window | Estimate |
|---|---|---|---|---|
| 24 | Tagih Dashboard v2 | `24-tagih-dashboard-v2.md` | A | 1-1.5 minggu |
| 25 | RPJMN/RPJMD scraping pipeline | `25-rpjmn-rpjmd-scraping.md` | B | 2-3 minggu |
| 28 | Janji vs Realita game v2 | `28-janji-vs-realita-game.md` | C | 1 minggu |
| 29 | Live Watch AI MVP | `29-live-watch-ai.md` | D | 2-3 minggu |
| 30 | Editorial moderation system | `30-editorial-moderation.md` | E | 1 minggu |
| 32 | Beranda redesign Tagih-first | `32-beranda-redesign.md` | F | 0.5-1 minggu |
| 33 | Brand copy + tagline pivot | `33-brand-copy-pivot.md` | G | 0.5 minggu |

### P1 — Stretch (Sprint 4 atau Sprint 5)

| # | Spec | Estimate |
|---|---|---|
| 26 | Visi Misi paslon scraper (KPU) | 1 minggu |
| 27 | BPS Index integration (IPM/IDH/IPMD) | 0.5-1 minggu |
| 31 | Komunitas thread → janji_id FK | 0.5 minggu |

### P2 — Maintenance / defer

| # | Note |
|---|---|
| 34 | Karya/Kelas/Aksi → maintenance mode (no new feature) |
| 35 | RPJMD kab/kota expansion phased (Sprint 5+) |

---

## 🏗️ Dependency map

```
                   ┌─────────────────────────────────┐
                   │  #25 RPJMN/RPJMD scraping       │  P0 [foundational]
                   │  + #26 Visi Misi (P1)           │
                   │  + #27 BPS Index (P1)           │
                   └────────────┬────────────────────┘
                                │ provides: structured data
                                ▼
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌──────────────┐      ┌──────────────────┐    ┌──────────────────┐
│ #29 Live     │      │ #24 Tagih        │    │ #28 Janji vs     │
│ Watch AI     │ ─┐   │ Dashboard v2     │    │ Realita game     │
└──────┬───────┘  │   └──────┬───────────┘    └──────┬───────────┘
       │           │          │                       │
       ▼           │          ▼                       ▼
┌──────────────┐  │   ┌──────────────────┐    ┌──────────────────┐
│ #30 Editorial │ ◀┘   │ #32 Beranda     │    │ #33 Brand copy  │
│ moderation    │      │ redesign         │    │ pivot            │
└──────────────┘      └──────────────────┘    └──────────────────┘
                                ▲                       │
                                │                       │
                                └───────────────────────┘
                                  consume: copy + design
```

**Critical path**: #25 (data foundation) → blocks #29, #24, #28
**Parallel possible**: #30, #32, #33 once #24 + #29 baseline exists

---

## 🚦 Execution strategy — multi-agent parallel

Berdasarkan proven success Sprint 3 batch 1+2 (3 + 5 window paralel landed clean):

### Wave 1 (week 1-2): Foundation

- Window B: Spec #25 RPJMN scraping (start, BLOCKS others — priority)
- Window E: Spec #30 Editorial moderation (independent, can start parallel)
- Window G: Spec #33 Brand copy (light effort, can be done early, low conflict)

### Wave 2 (week 2-3): Core build (blocks released by #25)

- Window A: Spec #24 Tagih Dashboard v2 (consume #25 data)
- Window C: Spec #28 Janji vs Realita game (consume #25 + #30)
- Window D: Spec #29 Live Watch AI MVP (consume #25, integrate #30)
- Window F: Spec #32 Beranda redesign (consume #24 components)

### Wave 3 (week 4-5): Stretch + Polish

- Window H (optional): Spec #26 Visi Misi scraper (P1)
- Window I (optional): Spec #27 BPS Index integration (P1)
- Window J (optional): Spec #31 Komunitas FK (P1)

### Wave 4 (week 5-6): Integration + QA

- Visual integration test
- Mobile responsive verify
- A11y check
- Editorial workflow end-to-end test
- Phase 2 deploy update (per Sprint 3 #22 scaffold)

---

## 🔒 Locked decisions (per `STRATEGY_PIVOT_2026-05-04.md`)

1. ✅ **Backbone** = Tagih Janji
2. ✅ **Differentiator** = Live Watch AI (scraper + alignment auditor)
3. ✅ **Engagement** = Janji vs Realita game (Predict & Reveal mechanic A)
4. ✅ **AI moderation** = editorial human-in-loop pre-publish, verification badge transparent
5. ✅ **Tone** = "akuntabilitas = dukungan", selaras pemerintah pusat
6. ✅ **Tagline** = "Setiap janji punya jejak" (primary) + "Janji ditagih, jejaknya tercatat" (sub)
7. ✅ **Tier 1 deep** = Tagih + Game + Komunitas
8. ✅ **Tier 2 surface** = Karya + Kelas + Aksi (maintenance mode)
9. ✅ **Audience** = B2C primary (warga muda 17-39) + B2B secondary (post-launch)
10. ✅ **Data sources** = RPJMN/RPJMD/Visi Misi/BPS Index/Media mainstream

---

## 📊 Database schema additions (Sprint 4)

### New tables

```sql
-- Janji structured (extend existing janji table atau new table)
create table public.janji_terstruktur (
  id uuid primary key default gen_random_uuid(),
  pejabat_id uuid references public.pejabat(id),
  source_type text check (source_type in ('rpjmn', 'rpjmd', 'visi_misi', 'media', 'lapor_warga')),
  source_doc_url text,
  source_doc_page int,
  source_quote text not null,
  topic text,
  region_level text check (region_level in ('nasional', 'provinsi', 'kabupaten_kota')),
  region_id text,
  deadline date,
  target_indikator jsonb,
  current_status text check (current_status in ('aligned', 'partial', 'drift', 'contradict')),
  alignment_score decimal(5,2),
  ai_verdict_reasoning text,
  editorial_status text check (editorial_status in ('pending', 'verified_curator', 'curated_ai', 'flagged', 'rejected')),
  editorial_reviewer_id uuid references public.profiles(id),
  editorial_reviewed_at timestamptz,
  embedding vector(1024),  -- BGE-M3 dimensions
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Visi misi paslon
create table public.visi_misi (
  id uuid primary key default gen_random_uuid(),
  pejabat_id uuid references public.pejabat(id),
  pemilu_year int,
  document_url text,
  full_text text,
  parsed_promises jsonb,  -- array of structured promises
  embedding vector(1024),
  scraped_at timestamptz default now()
);

-- Media quote (Live Watch source)
create table public.media_quote (
  id uuid primary key default gen_random_uuid(),
  pejabat_id uuid references public.pejabat(id),
  source_outlet text,  -- Kompas, Tempo, etc.
  source_url text,
  publish_date timestamptz,
  quote_text text,
  context text,
  embedding vector(1024),
  scraped_at timestamptz default now()
);

-- BPS Index data (context per region)
create table public.bps_index (
  id uuid primary key default gen_random_uuid(),
  region_level text check (region_level in ('nasional', 'provinsi', 'kabupaten_kota')),
  region_id text,
  index_type text check (index_type in ('ipm', 'idh', 'ipmd', 'gini', 'ekonomi')),
  year int,
  value decimal(10,4),
  source_url text,
  fetched_at timestamptz default now()
);

-- Live Watch verdict (AI alignment analysis)
create table public.alignment_verdict (
  id uuid primary key default gen_random_uuid(),
  media_quote_id uuid references public.media_quote(id),
  matched_visi_misi_id uuid references public.visi_misi(id),
  matched_rpjmn_target_id uuid,  -- references janji_terstruktur or rpjmn_target
  similarity_score decimal(5,4),
  verdict text check (verdict in ('aligned', 'partial', 'drift', 'contradict')),
  ai_reasoning text,
  ai_model text,  -- 'claude-haiku-4-5' / 'claude-sonnet-4-6'
  editorial_status text check (editorial_status in ('pending', 'approved', 'modified', 'rejected')),
  editorial_reviewer_id uuid references public.profiles(id),
  final_verdict text,  -- after editorial moderation, may differ from ai
  final_reasoning text,
  published_at timestamptz,
  created_at timestamptz default now()
);

-- Editorial review log (audit trail)
create table public.editorial_review (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid references public.profiles(id),
  target_type text check (target_type in ('janji', 'verdict', 'lapor')),
  target_id uuid,
  action text check (action in ('approve', 'modify', 'reject', 'flag')),
  notes text,
  reviewed_at timestamptz default now()
);
```

### RLS policies

- `janji_terstruktur`: public read, editorial-only write
- `visi_misi`: public read, scraper-only write
- `media_quote`: public read, scraper-only write
- `bps_index`: public read, scraper-only write
- `alignment_verdict`: public read **only when editorial_status = 'approved'**, scraper write, editorial moderate
- `editorial_review`: editorial-only read+write (admin role)

---

## 🤖 AI infrastructure (Sprint 4)

### Embedding pipeline

- Model: BGE-M3 multilingual (open source, run via local Python service atau hosted)
- Vector dimension: 1024
- Storage: pgvector di Supabase (existing)
- Indexing: HNSW per kolom embedding (janji_terstruktur, visi_misi, media_quote)
- Update freq: on insert/update, debounced 5-min

### LLM analyzer

- **Tier 1 (cheap pre-filter)**: Claude Haiku 4.5 — quick sanity check, drop irrelevant scrapes
- **Tier 2 (final verdict)**: Claude Sonnet 4.6 — alignment reasoning, verdict generation
- API budget: ~$50-100/bulan beta scale, ~$200-500/bulan launch

### Scraper

- Python + Playwright + RSS feeds
- Sources: Kompas, Tempo, Detik, Antara, CNN ID, Tirto, Kumparan
- Schedule: every 30 min (cron via Supabase Edge Functions atau GitHub Actions)
- Filter: NER untuk extract pejabat name + quote + topic
- Deduplication: hash content, skip if duplicate

### Editorial workflow

1. Scraper detect quote → INSERT `media_quote` (pending)
2. Embedding generated → similarity search → top-K matches
3. LLM Haiku pre-filter (relevance, factual claim?) → drop irrelevant
4. LLM Sonnet alignment analysis → INSERT `alignment_verdict` (pending)
5. Notification ke editorial dashboard (admin role)
6. Editorial reviewer:
   - Approve as-is → `editorial_status = 'approved'`, publish
   - Modify reasoning/verdict → save final, publish
   - Reject (false positive) → `editorial_status = 'rejected'`, hide
7. Approved verdict appear di Live Watch feed publik

---

## 🎨 Visual + UX changes Sprint 4

### Beranda redesign (Spec #32)

```
NEW BERANDA LAYOUT:

┌─────────────────────────────────────────────────────────┐
│ HEADER (existing — global)                               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ HERO                                                     │
│ ┌──────────────────────────────────────┐                │
│ │  Setiap janji punya jejak.           │  Hero illust   │
│ │  Pantau bareng warga muda Indonesia. │                │
│ │  [Tagih sekarang] [Main game]        │                │
│ └──────────────────────────────────────┘                │
│                                                          │
├─────────────────────────────────────────────────────────┤
│ JANJI YANG LAGI DITAGIH HARI INI                         │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│ │ Janji 1 │ │ Janji 2 │ │ Janji 3 │ │ Janji 4 │         │
│ │ status  │ │ status  │ │ status  │ │ status  │         │
│ │ region  │ │ region  │ │ region  │ │ region  │         │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
├─────────────────────────────────────────────────────────┤
│ JANJI VS REALITA HARI INI            (game card)         │
│ ┌──────────────────────────────────────┐                │
│ │ "Janji X dari Y tahun Z..."          │                │
│ │ [A. Aligned] [B. Partial]            │                │
│ │ [C. Drift]   [D. Contradict]         │                │
│ │ Streak: 5 hari · Top 3 leaderboard   │                │
│ └──────────────────────────────────────┘                │
├─────────────────────────────────────────────────────────┤
│ LIVE WATCH FEED (latest verdicts)                        │
│ ┌──────────────────────────────────────┐                │
│ │ 🟡 DRIFT — Pejabat X kata "Y" di     │                │
│ │   media Z. Tidak match RPJMN bid 5.  │                │
│ │   Terverifikasi Kurator · 2h ago     │                │
│ └──────────────────────────────────────┘                │
│ ┌──────────────────────────────────────┐                │
│ │ ✅ ALIGNED — Pejabat A kata "B"...   │                │
│ │   Selaras visi misi 2024.            │                │
│ │   Kurasi AI · 5h ago                 │                │
│ └──────────────────────────────────────┘                │
├─────────────────────────────────────────────────────────┤
│ FITUR LAINNYA (compact section)                          │
│ Komunitas · Karya · Kelas · Aksi (sidebar grid 4-col)   │
├─────────────────────────────────────────────────────────┤
│ FOOTER (existing — global)                               │
└─────────────────────────────────────────────────────────┘
```

### Nav reorder

```
OLD: Komunitas · Karya · Kelas · Janji · Aksi · Main
NEW: Tagih · Live Watch · Game · Komunitas · ⋯ Karya/Kelas/Aksi (sub-menu)
```

(Atau adjust based per Mas alignment.)

---

## ✅ Acceptance criteria Sprint 4 closure

- [ ] All P0 spec landed dengan commit hash
- [ ] Tagih Dashboard v2 render alignment % per janji per region
- [ ] Scraping pipeline working: RPJMN nasional + 10 prov RPJMD scraped
- [ ] Live Watch detect minimal 50 quote di 1 minggu testing
- [ ] AI verdict pipeline: scrape → embed → LLM → editorial → publish
- [ ] Editorial dashboard accessible by admin role
- [ ] Verification badge visible per content piece (Terverifikasi Kurator vs Kurasi AI)
- [ ] Janji vs Realita game playable, daily rotation working
- [ ] Beranda new layout — Tagih + Game prominent
- [ ] Brand copy match new positioning ("Setiap janji punya jejak")
- [ ] All tests pass + visual smoke OK
- [ ] Mas approval setiap commit Mas review

---

## 📝 Closing note

Sprint 4 = pivot besar. Asumsi sukses bersandar pada:
- Multi-agent parallel execution (proven Sprint 3)
- AI scraping + alignment pipeline = new ground (calibrate cost via MVP first)
- Editorial team capacity (manual review bottleneck — Mas perlu identify reviewer)

Out of Sprint 4 scope tapi penting di Sprint 5+:
- B2B API monetization
- RPJMD kab/kota full coverage
- Advanced game mechanics (Daily Verdict, leaderboard regional)
- Advocacy tools (campaign builder)

_Last updated: 2026-05-04_

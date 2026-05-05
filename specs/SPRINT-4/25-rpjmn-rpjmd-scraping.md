# Spec #25 — RPJMN/RPJMD Scraping Pipeline

**Sprint**: 4
**Owner**: Claude Code (Window B)
**Estimasi**: 2-3 minggu
**Priority**: P0 (BLOCKS #24 #28 #29)
**Dependency**: Sprint 3 commits landed
**Source**: `docs/STRATEGY_PIVOT_2026-05-04.md` Section 3 + 6

---

## Goal

Build ETL pipeline untuk scrape, parse, dan structure janji dari dokumen resmi:
- **RPJMN** (Bappenas, Presiden + Wapres + 7 menteri kunci)
- **RPJMD** (38 provinsi, phase 1; 514 kab/kota phase 2)

Output: `janji_terstruktur` table populated dengan structured promises (target, deadline, indikator) ready untuk consumed by #24 dashboard, #28 game, #29 Live Watch alignment.

---

## Required reading

1. `docs/STRATEGY_PIVOT_2026-05-04.md` — Section 3 (data sources)
2. `specs/SPRINT-4/00-overview.md` — schema additions
3. `CLAUDE.md` §1 (post-pivot positioning) + §8 (security)
4. Bappenas RPJMN documentation: https://www.bappenas.go.id/id/data-dan-informasi-utama/dokumen-perencanaan-dan-pelaksanaan/dokumen-rencana-pembangunan-nasional/

---

## Scope

### Phase 1 (Sprint 4 P0)

**RPJMN Nasional**:
- RPJMN 2025-2029 (current term)
- 9 dokumen target: Buku I (Visi Misi) + Buku II (Agenda Pembangunan) + 7 buku bidang
- Source: bappenas.go.id (PDF download)

**RPJMD Provinsi (10 prioritas)**:
- DKI Jakarta
- Jawa Barat
- Jawa Tengah
- Jawa Timur
- Banten
- Sumatera Utara
- Sulawesi Selatan
- DI Yogyakarta
- Bali
- Sumatera Selatan

**Tidak in scope Sprint 4** (Sprint 5+):
- 28 provinsi sisa
- 514 kab/kota
- Update otomatis berkala

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│ SOURCE: PDF documents (Bappenas, Pemprov sites)                   │
└────────────┬─────────────────────────────────────────────────────┘
             │
             ▼ download via Python requests / Playwright
┌──────────────────────────────────────────────────────────────────┐
│ STAGE 1: PDF text extraction                                      │
│ - pdfplumber / pdfminer.six                                       │
│ - Fallback: tesseract OCR untuk scanned PDF                       │
└────────────┬─────────────────────────────────────────────────────┘
             │
             ▼ raw text per page
┌──────────────────────────────────────────────────────────────────┐
│ STAGE 2: NER + structuring (LLM-assisted)                         │
│ - Claude Sonnet identify janji structure:                         │
│   { target_indikator, deadline, sektor, target_value, baseline } │
│ - Output: structured JSON per promise                             │
└────────────┬─────────────────────────────────────────────────────┘
             │
             ▼ structured JSON
┌──────────────────────────────────────────────────────────────────┐
│ STAGE 3: Embedding generation                                     │
│ - BGE-M3 multilingual                                             │
│ - Vector dimension: 1024                                          │
└────────────┬─────────────────────────────────────────────────────┘
             │
             ▼ vector + metadata
┌──────────────────────────────────────────────────────────────────┐
│ STAGE 4: Insert ke Supabase                                       │
│ - INSERT INTO janji_terstruktur                                   │
│ - editorial_status = 'pending' (await curator review)             │
└──────────────────────────────────────────────────────────────────┘
```

---

## File yang dibuat

```
scripts/scraping/
├── rpjmn-downloader.py              Download RPJMN PDFs dari Bappenas
├── rpjmd-downloader.py              Download RPJMD per provinsi
├── pdf-extractor.py                 Stage 1: PDF → text
├── janji-extractor.py               Stage 2: text → structured JSON via LLM
├── embedder.py                      Stage 3: vector embedding
├── supabase-inserter.py             Stage 4: insert ke DB
├── orchestrator.py                  Main pipeline runner
├── requirements.txt                 Python deps
└── README.md                        Pipeline docs

supabase/migrations/
├── 0004_alignment_schema.sql        ALTER existing janji + new tables (per #00 overview schema)

docs/data-sources/
├── rpjmn-nasional.md                List dokumen RPJMN + URL + last scraped
├── rpjmd-provinsi.md                List 10 prov + status scrape
└── data-quality-notes.md            Issue + assumption + cleanup decision
```

---

## Step-by-step

### 1. Migration schema

`supabase/migrations/0004_alignment_schema.sql` — apply schema dari `specs/SPRINT-4/00-overview.md`:
- New tables: `janji_terstruktur`, `visi_misi`, `media_quote`, `bps_index`, `alignment_verdict`, `editorial_review`
- pgvector extension enable
- HNSW index per embedding column
- RLS policies per table

### 2. RPJMN downloader

```python
# scripts/scraping/rpjmn-downloader.py
import requests
from pathlib import Path

BAPPENAS_RPJMN_2025 = [
    {"buku": "I", "title": "Visi Misi RPJMN 2025-2029", "url": "..."},
    {"buku": "II", "title": "Agenda Pembangunan", "url": "..."},
    # 7 buku bidang ...
]

def download_all(output_dir: Path):
    for doc in BAPPENAS_RPJMN_2025:
        # download with retry + checksum verify
        ...
```

### 3. PDF extraction

```python
# scripts/scraping/pdf-extractor.py
import pdfplumber

def extract_text(pdf_path: Path) -> list[dict]:
    """Return list of {page_num, text} per page"""
    with pdfplumber.open(pdf_path) as pdf:
        return [
            {"page": i + 1, "text": page.extract_text() or ""}
            for i, page in enumerate(pdf.pages)
        ]
```

### 4. LLM structuring

```python
# scripts/scraping/janji-extractor.py
import anthropic

PROMPT = """
Identifikasi semua JANJI / TARGET / KOMITMEN PEMBANGUNAN dari teks RPJMN/RPJMD ini.

Output JSON array, setiap janji structure:
{
  "claim": "kalimat janji asli",
  "topic": "ekonomi|pendidikan|kesehatan|infrastruktur|lingkungan|tata-kelola",
  "target_indikator": {
    "metric_name": "...",
    "baseline_value": "...",
    "target_value": "...",
    "unit": "..."
  },
  "deadline_year": 2029,
  "source_page": <int>
}

Hanya return janji yang punya target measurable + deadline. Skip narasi umum.
"""

def extract_promises(page_text: str, page_num: int) -> list[dict]:
    client = anthropic.Anthropic()
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        messages=[{"role": "user", "content": PROMPT + "\n\nTEXT:\n" + page_text}],
    )
    # parse JSON from response, attach page_num
    ...
```

### 5. Embedding generation

```python
# scripts/scraping/embedder.py
from FlagEmbedding import BGEM3FlagModel  # open source BGE-M3

model = BGEM3FlagModel('BAAI/bge-m3', use_fp16=True)

def embed(text: str) -> list[float]:
    """Return 1024-dim dense vector"""
    return model.encode(text, return_dense=True)['dense_vecs'].tolist()
```

### 6. Supabase insert

```python
# scripts/scraping/supabase-inserter.py
from supabase import create_client

def insert_janji(janji: dict, embedding: list[float], source_doc: dict):
    supabase = create_client(URL, SERVICE_ROLE_KEY)
    supabase.table('janji_terstruktur').insert({
        **janji,
        'embedding': embedding,
        'source_type': 'rpjmn',
        'source_doc_url': source_doc['url'],
        'source_doc_page': janji['source_page'],
        'editorial_status': 'pending',
    }).execute()
```

### 7. Orchestrator

```python
# scripts/scraping/orchestrator.py
"""
Main pipeline: download → extract → structure → embed → insert.
Idempotent: skip if (source_doc_url, source_doc_page, claim) already exists.
"""
def run_rpjmn_pipeline():
    docs = download_all_rpjmn()
    for doc in docs:
        pages = extract_text(doc.path)
        for page in pages:
            promises = extract_promises(page.text, page.num)
            for p in promises:
                emb = embed(p['claim'])
                insert_janji(p, emb, doc)
                
def run_rpjmd_pipeline(provinces: list[str]):
    # similar for RPJMD per provinsi
    ...
```

### 8. Cron schedule

GitHub Actions atau Supabase Edge Functions:
- RPJMN: scrape 1x per bulan (rare update, mostly static per term)
- RPJMD: scrape 1x per minggu (revision possible)
- Idempotency: skip duplicate via content hash

---

## Acceptance checklist

- [ ] Migration `0004_alignment_schema.sql` applied (new tables exist with RLS)
- [ ] Python pipeline `scripts/scraping/*` functional
- [ ] `requirements.txt` complete: anthropic, supabase, pdfplumber, FlagEmbedding, requests
- [ ] RPJMN nasional 9 dokumen di-download + extracted
- [ ] Minimal 100 janji terstruktur ter-insert dari RPJMN nasional
- [ ] Minimal 50 janji per provinsi prioritas (10 prov × 50 = 500 entries)
- [ ] Embedding generated per janji (1024 dim, pgvector index)
- [ ] All janji `editorial_status = 'pending'` (waiting curator review)
- [ ] Idempotency: re-run skip duplicate (content hash check)
- [ ] Documentation: `docs/data-sources/rpjmn-nasional.md` + `rpjmd-provinsi.md`

---

## Out of scope (defer)

- ❌ 28 provinsi sisa RPJMD (Sprint 5)
- ❌ 514 kab/kota RPJMD (Sprint 6+)
- ❌ Real-time sync via webhook (cron sufficient)
- ❌ Visi Misi paslon scraping (Spec #26 P1)
- ❌ BPS Index integration (Spec #27 P1)
- ❌ Auto-update detection RPJMN revisi (manual trigger Sprint 4)

---

## Risks + mitigations

| Risk | Mitigation |
|---|---|
| PDF format inconsistent (scanned vs digital) | Fallback OCR via tesseract; flag low-confidence extraction |
| LLM hallucination (extract janji palsu) | Editorial review WAJIB before publish (`editorial_status = 'pending'` default) |
| LLM cost spike (bulk RPJMN ~5000 pages × $$) | Use Haiku pre-filter, only Sonnet untuk page yang kemungkinan punya janji structure |
| Bappenas site rate-limit | Backoff + cache locally, scrape gradual |
| RPJMD provinsi format heterogen | Per-provinsi adapter; document peculiarities |

---

## Cost estimate

- LLM (Sonnet): ~5000 pages × 5K tokens × $3/MTok = ~$75 nasional + 10 prov
- Embedding (BGE-M3 self-host): $free
- Storage (Supabase): negligible at this volume
- **Total Sprint 4 one-time**: ~$75-100

Recurring cron: ~$10/bulan steady state

---

## Coordinate paralel — Window B territory

✅ Aman: `scripts/scraping/*`, `supabase/migrations/0004_*.sql`, `docs/data-sources/*`
❌ JANGAN edit: `apps/web/**` (no UI work in this spec)
❌ JANGAN edit: existing migrations 0001-0003

Pull-rebase reflex sebelum push. Coordinate dengan Window A (#24 dashboard) — Window A consume schema dari Window B.

---

## Commit message

```
feat(data): RPJMN/RPJMD scraping pipeline (10 prov + nasional)

- Migration 0004 alignment schema (janji_terstruktur + 5 tables baru)
- Python scraper: PDF download → extract → LLM structure → embed → insert
- BGE-M3 multilingual embedding (1024 dim) di pgvector
- 100+ janji nasional + 500+ janji 10 prov ter-insert (editorial pending)
- Idempotent re-run via content hash check
- Cron: bulan untuk RPJMN, minggu untuk RPJMD

Per Spec #25 P0 — provides data foundation untuk #24 #28 #29.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

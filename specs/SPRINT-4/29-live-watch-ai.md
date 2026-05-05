# Spec #29 — Live Watch AI MVP (THE DIFFERENTIATOR)

**Sprint**: 4
**Owner**: Claude Code (Window D)
**Estimasi**: 2-3 minggu
**Priority**: P0 (core differentiator)
**Dependency**: #25 RPJMN scraping (data foundation)
**Source**: `docs/STRATEGY_PIVOT_2026-05-04.md` Section 3.1.2

---

## Goal

Build real-time scraper + AI alignment auditor yang detect janji baru terucap di media mainstream, lalu analyze konsistensi-nya vs visi misi/RPJMN/RPJMD asli. Output: `alignment_verdict` table dengan 4-tier verdict status, ready untuk editorial review (Spec #30) sebelum publish.

**Ini fitur "menjual"** — distinctive differentiator yang ga punya platform Indonesia lain.

---

## Required reading

1. `docs/STRATEGY_PIVOT_2026-05-04.md` — full strategy
2. `specs/SPRINT-4/00-overview.md` — schema + architecture diagram
3. `specs/SPRINT-4/25-rpjmn-rpjmd-scraping.md` — provides data input (`janji_terstruktur`)
4. `specs/SPRINT-4/30-editorial-moderation.md` — consumes output (`alignment_verdict`)
5. `CLAUDE.md` §1 + §8 (post-pivot positioning + security)

---

## Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│ SCRAPER (Python, cron 30 min)                                       │
│ ┌──────────┬──────────┬─────────┬─────────┬──────────┬───────────┐ │
│ │ Kompas   │ Tempo    │ Detik   │ Antara  │ CNN ID   │ Tirto     │ │
│ │ RSS      │ RSS      │ RSS     │ RSS     │ RSS      │ RSS       │ │
│ └──────────┴──────────┴─────────┴─────────┴──────────┴───────────┘ │
└────────────┬───────────────────────────────────────────────────────┘
             │ raw articles
             ▼
┌────────────────────────────────────────────────────────────────────┐
│ FILTER & EXTRACT                                                    │
│ - NER: identify pejabat name (Presiden, Menteri, Gubernur, dll)     │
│ - Extract: kutipan langsung yang terdengar seperti janji/komitmen   │
│ - Skip: spam, opinion piece, non-political                          │
└────────────┬───────────────────────────────────────────────────────┘
             │ {pejabat, quote, source_url, date}
             ▼
┌────────────────────────────────────────────────────────────────────┐
│ INSERT media_quote (pending)                                        │
│ - Generate embedding (BGE-M3)                                       │
│ - Store quote + metadata + vector                                   │
└────────────┬───────────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────────────┐
│ SIMILARITY SEARCH (pgvector)                                        │
│ - Query top-K janji_terstruktur similar (same pejabat or relevant)  │
│ - Query top-K visi_misi documents matching topic                    │
│ - Threshold filter: cosine > 0.5                                    │
└────────────┬───────────────────────────────────────────────────────┘
             │ matched references
             ▼
┌────────────────────────────────────────────────────────────────────┐
│ LLM PRE-FILTER (Claude Haiku 4.5 — cheap relevance check)            │
│ - Is this an actual policy claim? (drop opinion, narrative)         │
│ - Is this from an authoritative pejabat? (skip if unrelated)        │
└────────────┬───────────────────────────────────────────────────────┘
             │ relevant only
             ▼
┌────────────────────────────────────────────────────────────────────┐
│ LLM ALIGNMENT ANALYZER (Claude Sonnet 4.6 — final verdict)          │
│ Prompt: "Analyze if this statement aligns with referenced docs."    │
│ Output: { verdict: aligned/partial/drift/contradict, reasoning }    │
└────────────┬───────────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────────────┐
│ INSERT alignment_verdict (editorial_status = 'pending')             │
│ Wait for editorial review (Spec #30) before publish                 │
└────────────────────────────────────────────────────────────────────┘
```

---

## File yang dibuat

```
scripts/live-watch/
├── scraper.py                       Multi-source RSS scraper
├── ner-extractor.py                 NER pejabat + quote
├── prefilter-llm.py                 Claude Haiku quick relevance
├── alignment-analyzer.py            Claude Sonnet final verdict
├── orchestrator.py                  End-to-end pipeline
├── adapters/
│   ├── kompas.py                    Per-outlet HTML adapter
│   ├── tempo.py
│   ├── detik.py
│   ├── antara.py
│   ├── cnn-id.py
│   └── tirto.py
├── requirements.txt
└── README.md

apps/web/src/app/live-watch/
├── page.tsx                         Live Watch feed page (Server)
├── verdict-card.tsx                 Single verdict card component (Client)
├── filter-bar.tsx                   Filter by status/region/topik
└── notification-trigger.ts          Push notif untuk follower

apps/web/src/lib/live-watch/
├── verdict-formatter.ts             Format AI reasoning ke UI
└── share-link.ts                    Shareable verdict link

docs/live-watch/
├── prompt-engineering.md            LLM prompt templates + iteration log
└── editorial-workflow.md            Process flow utuk reviewer
```

---

## Step-by-step

### 1. Scraper per outlet

```python
# scripts/live-watch/scraper.py
import feedparser
from datetime import datetime, timedelta

OUTLETS = {
    'kompas': 'https://www.kompas.com/rss',
    'tempo': 'https://rss.tempo.co/nasional',
    'detik': 'https://news.detik.com/rss',
    'antara': 'https://www.antaranews.com/rss/politik.xml',
    'cnn-id': 'https://www.cnnindonesia.com/nasional/rss',
    'tirto': 'https://tirto.id/feed',
}

def scrape_recent(hours: int = 1):
    """Scrape articles published in last N hours from all outlets."""
    cutoff = datetime.now() - timedelta(hours=hours)
    articles = []
    for outlet, rss_url in OUTLETS.items():
        feed = feedparser.parse(rss_url)
        for entry in feed.entries:
            pub_date = parse_date(entry.published)
            if pub_date < cutoff:
                continue
            articles.append({
                'outlet': outlet,
                'title': entry.title,
                'url': entry.link,
                'published_at': pub_date,
                'summary': entry.summary,
            })
    return articles
```

### 2. NER + quote extraction

```python
# scripts/live-watch/ner-extractor.py
import anthropic

PROMPT_NER = """
Identifikasi:
1. Nama pejabat publik yang disebut (Presiden, Menteri, Gubernur, Bupati, Walikota, anggota DPR)
2. Kutipan LANGSUNG dari pejabat tersebut yang TERDENGAR SEPERTI JANJI / KOMITMEN / RENCANA KEBIJAKAN
3. Topik: ekonomi, pendidikan, kesehatan, infrastruktur, lingkungan, tata-kelola

Output JSON array per pejabat-quote pair:
{
  "pejabat_name": "...",
  "pejabat_role": "...",  // jabatan
  "quote": "kutipan langsung",
  "topic": "...",
  "context": "1 kalimat sekitar quote untuk context"
}

Skip:
- Opinion writer/pengamat (bukan pejabat)
- Non-policy quote (gimana liburan dll)
- Sekedar deskripsi narasi (bukan komitmen)

Article text:
{article_text}
"""

def extract_quotes(article: dict) -> list[dict]:
    client = anthropic.Anthropic()
    full_text = fetch_full_article(article['url'])  # full content scrape
    response = client.messages.create(
        model="claude-haiku-4-5",  # cheap for extraction
        max_tokens=2048,
        messages=[{"role": "user", "content": PROMPT_NER.format(article_text=full_text)}],
    )
    return parse_json(response)
```

### 3. Insert media_quote dengan embedding

```python
# scripts/live-watch/orchestrator.py
def process_article(article):
    quotes = extract_quotes(article)
    for q in quotes:
        # match pejabat_name → pejabat_id (fuzzy match Supabase)
        pejabat_id = match_pejabat(q['pejabat_name'], q['pejabat_role'])
        if not pejabat_id:
            continue  # skip unknown pejabat
        
        # generate embedding
        embedding = embed(q['quote'])
        
        # insert media_quote
        media_quote_id = insert_media_quote({
            'pejabat_id': pejabat_id,
            'source_outlet': article['outlet'],
            'source_url': article['url'],
            'publish_date': article['published_at'],
            'quote_text': q['quote'],
            'context': q['context'],
            'embedding': embedding,
        })
        
        # trigger alignment analysis
        analyze_alignment(media_quote_id)
```

### 4. Similarity search + alignment analysis

```python
# scripts/live-watch/alignment-analyzer.py

ALIGNMENT_PROMPT = """
Kamu menganalisis apakah pernyataan pejabat publik SELARAS dengan dokumen rencana resmi (RPJMN/RPJMD/Visi Misi).

CONTEXT — Pernyataan pejabat:
Pejabat: {pejabat_name} ({pejabat_role})
Quote: "{quote}"
Konteks: {context}
Source: {source_outlet}, {publish_date}

REFERENCE — Dokumen rencana terkait (top match dari similarity search):
1. RPJMN/RPJMD: {rpjmn_match}
2. Visi Misi: {visi_misi_match}

TUGAS:
Klasifikasi status alignment menjadi salah satu:
- ALIGNED: pernyataan SEJALAN dengan reference (target/indikator/komitmen sama)
- PARTIAL: sebagian sesuai, sebagian deviasi (mis. target sama tapi deadline beda)
- DRIFT: pernyataan TIDAK ADA di reference, atau deviasi target signifikan (>30%)
- CONTRADICT: pernyataan BERTENTANGAN dengan reference (mis. janji menghapus program yang ada di RPJMN)

Output JSON:
{
  "verdict": "aligned" | "partial" | "drift" | "contradict",
  "similarity_score": <float 0-1>,
  "reasoning": "3-5 kalimat explain why, dengan referensi spesifik halaman/section",
  "key_discrepancy": "1 kalimat key issue (kalau ada)" | null,
  "suggested_clarification": "1 pertanyaan yang baik diajukan ke pejabat untuk klarifikasi" | null
}

GUIDELINES:
- Tone: faktual, neutral, NOT accusatory
- DRIFT verdict ≠ "ingkar". Bisa interpretasi "perlu klarifikasi"
- Selalu cite specific page/section dari reference doc
- Hindari claims yang bisa interpret sebagai defamation
"""

def analyze_alignment(media_quote_id: int):
    quote = fetch_media_quote(media_quote_id)
    
    # similarity search top-K
    rpjmn_matches = pgvector_search('janji_terstruktur', quote['embedding'], k=3)
    visi_misi_matches = pgvector_search('visi_misi', quote['embedding'], k=2)
    
    # LLM analysis
    client = anthropic.Anthropic()
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": ALIGNMENT_PROMPT.format(
                pejabat_name=quote['pejabat']['name'],
                pejabat_role=quote['pejabat']['role'],
                quote=quote['quote_text'],
                context=quote['context'],
                source_outlet=quote['source_outlet'],
                publish_date=quote['publish_date'],
                rpjmn_match=format_match(rpjmn_matches),
                visi_misi_match=format_match(visi_misi_matches),
            )
        }],
    )
    
    verdict = parse_json(response)
    
    # insert alignment_verdict (pending review)
    insert_alignment_verdict({
        'media_quote_id': media_quote_id,
        'matched_visi_misi_id': visi_misi_matches[0]['id'] if visi_misi_matches else None,
        'matched_rpjmn_target_id': rpjmn_matches[0]['id'] if rpjmn_matches else None,
        'similarity_score': verdict['similarity_score'],
        'verdict': verdict['verdict'],
        'ai_reasoning': verdict['reasoning'],
        'ai_model': 'claude-sonnet-4-6',
        'editorial_status': 'pending',  # await human review
    })
```

### 5. Live Watch UI (consume `alignment_verdict` published)

```tsx
// apps/web/src/app/live-watch/page.tsx
import { createClient } from '@/lib/supabase/server';
import { VerdictCard } from './verdict-card';
import { FilterBar } from './filter-bar';

export default async function LiveWatchPage({ searchParams }) {
  const supabase = await createClient();
  
  let query = supabase
    .from('alignment_verdict')
    .select('*, media_quote(*, pejabat(*)), matched_visi_misi(*), matched_rpjmn_target(*)')
    .eq('editorial_status', 'approved')
    .order('published_at', { ascending: false })
    .limit(20);
  
  // apply filters from searchParams: status, region, topic
  
  const { data: verdicts } = await query;
  
  return (
    <div>
      <Header kicker="— live watch" title="Janji vs Realita Real-Time" />
      <FilterBar />
      <ul>
        {verdicts?.map((v) => <VerdictCard key={v.id} verdict={v} />)}
      </ul>
    </div>
  );
}
```

### 6. VerdictCard component

```tsx
// apps/web/src/app/live-watch/verdict-card.tsx
const VERDICT_STYLE = {
  aligned: { color: 'jw-mint', icon: 'CheckCircle2', label: 'Aligned' },
  partial: { color: 'jw-marigold', icon: 'AlertTriangle', label: 'Partial' },
  drift: { color: 'jw-coral', icon: 'TrendingDown', label: 'Drift' },
  contradict: { color: 'jw-red', icon: 'XCircle', label: 'Contradict' },
};

export function VerdictCard({ verdict }) {
  const style = VERDICT_STYLE[verdict.verdict];
  return (
    <article className="...">
      <div className="flex items-center gap-2">
        <Icon className={`text-${style.color}`} />
        <span className="font-bold uppercase">{style.label}</span>
        <span className="ml-auto text-xs text-jw-muted">
          {verdict.editorial_status === 'verified_curator' 
            ? '✅ Terverifikasi Kurator'
            : '🤖 Kurasi AI'}
        </span>
      </div>
      <h3 className="font-display text-xl text-jw-blue mt-2">
        {verdict.media_quote.pejabat.name}: "{verdict.media_quote.quote_text}"
      </h3>
      <p className="text-sm text-jw-ink mt-2">
        {verdict.final_reasoning ?? verdict.ai_reasoning}
      </p>
      <footer className="mt-3 text-xs text-jw-muted flex gap-3">
        <span>Source: {verdict.media_quote.source_outlet}</span>
        <a href={verdict.media_quote.source_url}>baca artikel</a>
        <span>·</span>
        <span>{relativeTime(verdict.published_at)}</span>
        <Link href={`/komunitas/janji/${verdict.media_quote_id}`}>
          Diskusi di forum →
        </Link>
      </footer>
    </article>
  );
}
```

### 7. Cron schedule

GitHub Actions: `.github/workflows/live-watch-cron.yml`

```yaml
name: Live Watch Scraper

on:
  schedule:
    - cron: '*/30 * * * *'  # every 30 min
  workflow_dispatch:

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r scripts/live-watch/requirements.txt
      - run: python scripts/live-watch/orchestrator.py
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

---

## Acceptance checklist

- [ ] Scraper functional 6 outlet (Kompas/Tempo/Detik/Antara/CNN ID/Tirto)
- [ ] NER + quote extraction working — minimal 50 quote/minggu
- [ ] media_quote table populated dengan embedding
- [ ] Similarity search returning relevant matches (manual sample 20 verify)
- [ ] LLM Haiku pre-filter dropping irrelevant (>50% drop rate expected)
- [ ] LLM Sonnet alignment verdict generated dengan 4-tier status
- [ ] alignment_verdict inserted dengan `editorial_status = 'pending'`
- [ ] Live Watch UI render verdicts published only (`editorial_status = 'approved'`)
- [ ] Verification badge visible per card (Terverifikasi Kurator / Kurasi AI)
- [ ] Filter bar: status/region/topic working
- [ ] Cron jalan setiap 30 menit (GitHub Actions)
- [ ] Cost monitoring: API spend tracker, alert kalau > $50/minggu
- [ ] `pnpm typecheck` + `pnpm lint` + `pnpm test` pass
- [ ] Documentation: prompt-engineering.md + editorial-workflow.md

---

## Out of scope (defer)

- ❌ Twitter/X scraping (legal complexity, defer Sprint 5+)
- ❌ Video/audio source (TikTok/YouTube transcript) — Sprint 6+
- ❌ Auto-publish without editorial review (defamation risk)
- ❌ User-facing AI explanation expansion (chat with verdict) — Sprint 5
- ❌ Push notification mobile (Sprint 5)
- ❌ Verdict dispute system (pejabat right-of-reply) — Sprint 5

---

## Risks + mitigations

| Risk | Mitigation |
|---|---|
| AI hallucination → false DRIFT verdict | Editorial review WAJIB pre-publish (Spec #30) |
| Defamation liability | 4-tier non-accusatory (DRIFT bukan "ingkar"), source citation, disclaimer |
| Cost spike LLM | Pre-filter via Haiku, cap monthly budget ($100), alert + auto-pause |
| Outlet rate limit | Backoff strategy, distribute scrape window |
| NER mis-identify pejabat | Whitelist pejabat database (must match `pejabat` table), skip unknown |
| Embedding model drift | Pin BGE-M3 version, document baseline accuracy |

---

## Cost estimate

**Per cycle (30 min)**:
- 50-100 articles fetched
- ~30 articles dengan policy quote
- ~10 quote pass pre-filter
- ~10 alignment analysis (Sonnet)
- LLM cost: ~$0.50/cycle

**Per month**:
- 1440 cycles (every 30 min × 30 day)
- Total LLM: ~$700/bulan worst case
- **Optimization**: only run during weekday business hours (~50% reduction → ~$350/bulan)

Budget cap: $200/bulan beta, scale to $500/bulan post-launch dengan adaptive throttling.

---

## Coordinate paralel — Window D territory

✅ Aman: `scripts/live-watch/*`, `apps/web/src/app/live-watch/*`, `apps/web/src/lib/live-watch/*`, `docs/live-watch/*`, `.github/workflows/live-watch-cron.yml`
❌ JANGAN edit: `apps/web/src/app/(other surfaces)`, `scripts/scraping/` (Window B territory)

Pull-rebase reflex sebelum push. Coordinate dengan Window B (#25) — Window D consume schema + janji_terstruktur data.

---

## Commit message

```
feat(live-watch): AI-powered policy alignment scanner — MVP

- Multi-source scraper: Kompas/Tempo/Detik/Antara/CNN ID/Tirto RSS
- NER + quote extraction via Claude Haiku
- pgvector similarity search vs janji_terstruktur + visi_misi
- LLM alignment analysis (Claude Sonnet) → 4-tier verdict
  (Aligned/Partial/Drift/Contradict, non-accusatory tone)
- alignment_verdict table dengan editorial_status pending
- Live Watch UI page + VerdictCard component
- Filter bar (status/region/topic)
- GitHub Actions cron 30 min interval
- Cost capped $200/bulan beta budget

Per Spec #29 — THE differentiator. Editorial review (Spec #30) required pre-publish.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

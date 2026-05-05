# Spec #24 — Tagih Dashboard v2 (alignment % + leaderboard regional)

**Sprint**: 4
**Owner**: Claude Code (Window A)
**Estimasi**: 1-1.5 minggu
**Priority**: P0 (backbone visible delivery)
**Dependency**: #25 RPJMN scraping (data foundation)
**Source**: `docs/STRATEGY_PIVOT_2026-05-04.md` Section 3.1.1

---

## Goal

Upgrade existing Tagih page (Sprint 3) jadi backbone dashboard yang:
- Tampil **alignment %** per janji + per region + per pejabat
- **Leaderboard "Gubernur paling tepat janji"** (gamified public scrutiny)
- **Pejabat profile** dengan track record agregat
- **Filter** advanced: per topik / partai / region / status
- **Lapor Janji** form (UGC) tetap ada, masuk DB sebagai pending review

---

## Required reading

1. `docs/STRATEGY_PIVOT_2026-05-04.md`
2. `specs/SPRINT-4/00-overview.md` — schema additions
3. `specs/SPRINT-4/25-rpjmn-rpjmd-scraping.md` — data input
4. Existing: `apps/web/src/app/tagih/page.tsx` (Sprint 3 v1)

---

## File yang dibuat / diubah

```
apps/web/src/app/tagih/
├── page.tsx                         REWRITE — dashboard v2
├── components/
│   ├── alignment-bar.tsx            BARU — visual % bar dengan tier color
│   ├── leaderboard-gubernur.tsx     BARU — top 10 gubernur paling tepat
│   ├── filter-advanced.tsx          BARU — multi-filter UI
│   ├── pejabat-card.tsx             EXTEND — alignment % aggregate
│   └── region-stats.tsx             BARU — per-province summary
├── [region]/page.tsx                BARU — drill-down per provinsi
├── pejabat/[id]/page.tsx            BARU — pejabat detail dengan all janji
└── lapor/page.tsx                   EXTEND — Lapor Janji form (existing)

apps/web/src/lib/tagih/
├── alignment-calculator.ts          BARU — compute % per pejabat/region
├── leaderboard-query.ts             BARU — leaderboard SQL helper
└── filter-state.ts                  BARU — URL-based filter state
```

---

## Step-by-step

### 1. Alignment calculation logic

```ts
// apps/web/src/lib/tagih/alignment-calculator.ts

export type AlignmentTier = 'aligned' | 'partial' | 'drift' | 'contradict';

export const TIER_WEIGHT: Record<AlignmentTier, number> = {
  aligned: 1.0,
  partial: 0.6,
  drift: 0.2,
  contradict: 0.0,
};

export function computeAlignmentPercent(
  janjiList: Array<{ verdict: AlignmentTier }>
): number {
  if (janjiList.length === 0) return 0;
  const total = janjiList.reduce((sum, j) => sum + TIER_WEIGHT[j.verdict], 0);
  return Math.round((total / janjiList.length) * 100);
}
```

### 2. Leaderboard gubernur SQL

```ts
// apps/web/src/lib/tagih/leaderboard-query.ts
export async function getLeaderboardGubernur() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('pejabat')
    .select(`
      id, name, role, region, partai, photo_url,
      janji_terstruktur(verdict)
    `)
    .eq('role', 'Gubernur')
    .eq('janji_terstruktur.editorial_status', 'verified_curator');
  
  return (data ?? [])
    .map((p) => ({
      ...p,
      alignment_percent: computeAlignmentPercent(p.janji_terstruktur),
      total_janji: p.janji_terstruktur.length,
    }))
    .filter((p) => p.total_janji >= 5)  // minimal 5 janji untuk fair ranking
    .sort((a, b) => b.alignment_percent - a.alignment_percent)
    .slice(0, 10);
}
```

### 3. Dashboard page

```tsx
// apps/web/src/app/tagih/page.tsx
export default async function TagihPage({ searchParams }) {
  const supabase = await createClient();
  
  // Fetch parallel
  const [statsAggregate, leaderboard, recentVerdicts] = await Promise.all([
    fetchStatsAggregate(),  // total janji, % per tier nasional
    getLeaderboardGubernur(),
    fetchRecentVerdicts(20),
  ]);
  
  return (
    <div>
      <Hero kicker="— pilar" title="Tagih Janji Pemerintah." />
      
      {/* AGGREGATE STATS */}
      <section>
        <h2>Status janji nasional</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Janji" value={statsAggregate.total} />
          <StatCard label="% Aligned" value={`${statsAggregate.alignedPct}%`} icon="CheckCircle2" color="mint" />
          <StatCard label="% Partial" value={`${statsAggregate.partialPct}%`} icon="AlertTriangle" color="marigold" />
          <StatCard label="% Drift+Contradict" value={`${statsAggregate.driftContractPct}%`} icon="TrendingDown" color="coral" />
        </div>
      </section>
      
      {/* LEADERBOARD */}
      <section>
        <h2>🏆 Gubernur paling tepat janji</h2>
        <p className="text-sm text-jw-muted">
          Diranking berdasar % alignment janji ke RPJMD provinsi (minimal 5 janji teranalisis).
        </p>
        <LeaderboardGubernur entries={leaderboard} />
      </section>
      
      {/* FILTER + JANJI LIST */}
      <section>
        <FilterAdvanced state={parseFilterFromSearchParams(searchParams)} />
        <Suspense fallback={<JanjiListSkeleton />}>
          <JanjiList filter={searchParams} />
        </Suspense>
      </section>
      
      {/* LAPOR JANJI CTA */}
      <section className="bg-jw-blue/5 rounded-jw-xl p-6">
        <h3>Janji yang lagi dipantau warga belum tercatat?</h3>
        <p>Lapor janji baru. Tim Jubir Warga akan review + tambah ke database.</p>
        <Link href="/tagih/lapor" className="btn-primary">+ Lapor janji baru</Link>
      </section>
    </div>
  );
}
```

### 4. Per-region drill-down

```tsx
// apps/web/src/app/tagih/[region]/page.tsx
export default async function RegionPage({ params }) {
  const region = decodeURIComponent(params.region);
  
  // Fetch janji per region
  const { data: janjiList } = await supabase
    .from('janji_terstruktur')
    .select('*, pejabat(*), alignment_verdict(*)')
    .eq('region_id', region)
    .eq('editorial_status', 'verified_curator');
  
  // Fetch pejabat di region ini
  const pejabatRegion = uniqBy(janjiList?.map(j => j.pejabat), 'id');
  
  return (
    <div>
      <BackLink href="/tagih">Kembali ke dashboard</BackLink>
      <Hero kicker={`— region`} title={`Janji di ${region}`} />
      <RegionStats janji={janjiList} />
      <PejabatCardList pejabat={pejabatRegion} />
      <JanjiList items={janjiList} />
    </div>
  );
}
```

### 5. Pejabat detail page

```tsx
// apps/web/src/app/tagih/pejabat/[id]/page.tsx
export default async function PejabatDetailPage({ params }) {
  const pejabat = await fetchPejabat(params.id);
  const janjiList = await fetchJanjiByPejabat(params.id);
  const alignmentPct = computeAlignmentPercent(janjiList);
  
  return (
    <div>
      <BackLink href="/tagih">Kembali</BackLink>
      <PejabatHeader pejabat={pejabat} />
      
      <section>
        <h2>Track record alignment</h2>
        <AlignmentBar percent={alignmentPct} />
        <p>{alignmentPct}% janji selaras dengan RPJMN/RPJMD/visi misi</p>
      </section>
      
      <section>
        <h2>{janjiList.length} janji ({pejabat.name})</h2>
        <FilterByStatus />
        <JanjiList items={janjiList} />
      </section>
      
      <section>
        <h2>Live Watch — pernyataan terbaru</h2>
        <RecentMediaQuotes pejabat_id={pejabat.id} />
      </section>
    </div>
  );
}
```

### 6. Filter advanced

```tsx
// apps/web/src/app/tagih/components/filter-advanced.tsx
'use client';

export function FilterAdvanced({ state }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`?${params}`);
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      <Select label="Status" options={['aligned', 'partial', 'drift', 'contradict']} 
              onChange={v => updateFilter('status', v)} />
      <Select label="Topik" options={['ekonomi', 'pendidikan', 'kesehatan', 'infrastruktur', 'lingkungan']}
              onChange={v => updateFilter('topic', v)} />
      <Select label="Region level" options={['nasional', 'provinsi', 'kabupaten_kota']}
              onChange={v => updateFilter('region_level', v)} />
      <Select label="Partai" options={partaiList} 
              onChange={v => updateFilter('partai', v)} />
    </div>
  );
}
```

---

## Acceptance checklist

- [ ] `/tagih` dashboard v2 render dengan aggregate stats nasional
- [ ] Leaderboard gubernur top 10 tampil + sortable by alignment %
- [ ] Filter advanced bekerja (URL-based state)
- [ ] `/tagih/[region]` per-province drill-down render
- [ ] `/tagih/pejabat/[id]` pejabat profile render dengan alignment %
- [ ] Lapor Janji form tetap ada, masuk DB sebagai `pending`
- [ ] Empty states proper (kalau belum ada data per region)
- [ ] Mobile responsive 375px no overflow
- [ ] Loading skeleton untuk async sections (Suspense)
- [ ] `pnpm typecheck` + `pnpm lint` + `pnpm test` pass

---

## Out of scope (defer)

- ❌ Real-time update via WebSocket (Sprint 5)
- ❌ Comment per janji (handled by Komunitas Spec #31)
- ❌ Export CSV (Sprint 5)
- ❌ Subscribe/follow pejabat (Sprint 5)
- ❌ Comparative chart pejabat A vs B (Sprint 5)

---

## Coordinate paralel — Window A territory

✅ Aman: `apps/web/src/app/tagih/**`, `apps/web/src/lib/tagih/**`
❌ JANGAN edit: scraping pipeline (Window B), Live Watch (Window D)

Pull-rebase reflex.

---

## Commit message

```
feat(tagih): dashboard v2 — alignment %, leaderboard gubernur, drill-down regional

- Aggregate stats nasional (% aligned/partial/drift+contradict)
- Leaderboard top 10 gubernur paling tepat janji (gamified scrutiny)
- /tagih/[region] drill-down per provinsi
- /tagih/pejabat/[id] track record + recent media quotes
- Filter advanced URL-based (status/topik/region/partai)
- Lapor Janji form tetap ada (UGC pending review)

Per Spec #24 — backbone visible delivery. Consume #25 data + integrate #29 verdicts.
```

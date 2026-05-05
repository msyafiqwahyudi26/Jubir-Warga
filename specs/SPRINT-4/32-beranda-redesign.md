# Spec #32 — Beranda Redesign (Tagih + Game Prominent)

**Sprint**: 4
**Owner**: Claude Code (Window F)
**Estimasi**: 0.5-1 minggu
**Priority**: P0 (visible signal pivot)
**Dependency**: #24 dashboard components, #28 game card
**Source**: `docs/STRATEGY_PIVOT_2026-05-04.md` Section 9 + `specs/SPRINT-4/00-overview.md`

---

## Goal

Redesign Beranda untuk reflect pivot: dari "rumah online untuk semua kebutuhan civic" (equal-weight 6 fitur) → **"Tagih Janji + Janji vs Realita game prominent"**.

Layout baru per `00-overview.md` mockup. Hero kicker baru dengan tagline "Setiap janji punya jejak".

---

## Required reading

1. `docs/STRATEGY_PIVOT_2026-05-04.md`
2. `specs/SPRINT-4/00-overview.md` Section 6 (Beranda mockup)
3. Existing: `apps/web/src/app/page.tsx` (post pivot fix global header)
4. `specs/SPRINT-4/24-tagih-dashboard-v2.md` — components dipakai di Beranda
5. `specs/SPRINT-4/28-janji-vs-realita-game.md` — JanjiVsRealitaCard

---

## File yang dibuat / diubah

```
apps/web/src/app/page.tsx                                REWRITE Beranda
apps/web/src/components/beranda/
├── hero-tagih-tagline.tsx                               BARU — hero baru
├── janji-prominent-cards.tsx                            BARU — 4 janji highlighted
├── live-watch-feed-preview.tsx                          BARU — recent verdicts (3-5)
├── fitur-pendukung-grid.tsx                             BARU — Komunitas/Karya/Kelas/Aksi compact
└── janji-tracker.tsx                                    EXISTING — keep/tweak

(Lama yang dihapus:
- thread-list.tsx tetap dipakai TAPI di-move ke /komunitas only)
```

---

## Step-by-step

### 1. Hero baru

```tsx
// apps/web/src/components/beranda/hero-tagih-tagline.tsx
export function HeroTagihTagline() {
  return (
    <section className="hero">
      <div className="kicker">— platform akuntabilitas warga muda</div>
      <h1 className="display-xl">
        Setiap janji
        <br />
        <em>punya jejak.</em>
      </h1>
      <p className="lead">
        Pantau bareng warga muda Indonesia — janji pejabat dari RPJMN/RPJMD,
        dianalisis AI, ditagih bareng-bareng.
      </p>
      <div className="cta-group">
        <Link href="/tagih" className="btn-primary">
          Tagih sekarang →
        </Link>
        <Link href="/main/janji-vs-realita" className="btn-outline">
          Main Janji vs Realita
        </Link>
      </div>
      <HeroIllust />
    </section>
  );
}
```

### 2. Janji yang lagi ditagih hari ini

```tsx
// apps/web/src/components/beranda/janji-prominent-cards.tsx
export async function JanjiProminentCards() {
  const supabase = await createClient();
  const { data: hot } = await supabase
    .from('janji_terstruktur')
    .select('*, pejabat(*), alignment_verdict(verdict, similarity_score)')
    .eq('editorial_status', 'verified_curator')
    .order('updated_at', { ascending: false })
    .limit(4);
  
  return (
    <section>
      <SectionHead 
        kicker="— hari ini" 
        title="Janji yang lagi ditagih"
        href="/tagih"
        hrefLabel="Lihat semua →"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hot?.map((j) => <JanjiCardCompact key={j.id} janji={j} />)}
      </div>
    </section>
  );
}
```

### 3. Live Watch feed preview

```tsx
// apps/web/src/components/beranda/live-watch-feed-preview.tsx
export async function LiveWatchFeedPreview() {
  const supabase = await createClient();
  const { data: verdicts } = await supabase
    .from('alignment_verdict')
    .select('*, media_quote(*, pejabat(*))')
    .eq('editorial_status', 'approved')
    .order('published_at', { ascending: false })
    .limit(3);
  
  return (
    <section>
      <SectionHead 
        kicker="— live watch" 
        title="Janji terbaru di media"
        href="/live-watch"
        hrefLabel="Lihat feed →"
      />
      <ul className="space-y-3">
        {verdicts?.map((v) => <VerdictCardCompact key={v.id} verdict={v} />)}
      </ul>
    </section>
  );
}
```

### 4. Fitur pendukung compact (Tier 2)

```tsx
// apps/web/src/components/beranda/fitur-pendukung-grid.tsx
const TIER2_FEATURES = [
  { href: '/komunitas', icon: 'MessageCircle', label: 'Komunitas', desc: 'Diskusi per janji' },
  { href: '/karya', icon: 'Edit3', label: 'Karya', desc: 'Tulisan + visual warga' },
  { href: '/kelas', icon: 'BookOpen', label: 'Kelas', desc: 'Literasi kebijakan' },
  { href: '/aksi', icon: 'Zap', label: 'Aksi', desc: 'Petisi & polling' },
];

export function FiturPendukungGrid() {
  return (
    <section>
      <SectionHead kicker="— fitur lainnya" title="Eksplorasi lebih dalam" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TIER2_FEATURES.map((f) => (
          <Link key={f.href} href={f.href} className="feature-card">
            <Icon name={f.icon} />
            <span className="label">{f.label}</span>
            <span className="desc">{f.desc}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

### 5. Page assembly

```tsx
// apps/web/src/app/page.tsx
import { HeroTagihTagline } from '@/components/beranda/hero-tagih-tagline';
import { JanjiVsRealitaCard } from '@/components/beranda/janji-vs-realita-card';
import { JanjiProminentCards } from '@/components/beranda/janji-prominent-cards';
import { LiveWatchFeedPreview } from '@/components/beranda/live-watch-feed-preview';
import { FiturPendukungGrid } from '@/components/beranda/fitur-pendukung-grid';

export const revalidate = 60;

export default function HomePage() {
  return (
    <div className="bg-jw-cream text-jw-ink">
      <HeroTagihTagline />
      <Suspense fallback={<JanjiSkeleton />}>
        <JanjiProminentCards />
      </Suspense>
      <Suspense fallback={<GameSkeleton />}>
        <JanjiVsRealitaCard />  {/* prominent game CTA */}
      </Suspense>
      <Suspense fallback={<LiveWatchSkeleton />}>
        <LiveWatchFeedPreview />
      </Suspense>
      <FiturPendukungGrid />
    </div>
  );
}
```

### 6. Nav reorder (decided per #00-overview)

Update `apps/web/src/components/site-header.tsx`:

```tsx
// urutan baru
const NAV_ITEMS = [
  { href: '/tagih', label: 'Tagih', priority: true },
  { href: '/live-watch', label: 'Live Watch', priority: true },
  { href: '/main', label: 'Main', priority: true },
  { href: '/komunitas', label: 'Komunitas' },
  // Karya/Kelas/Aksi → di footer dropdown atau "Lainnya" menu
];
```

(Detail nav style — icon + active state — defer ke Sprint 5 visual parity, atau included opportunistically kalau resource cukup)

---

## Acceptance checklist

- [ ] Beranda hero baru dengan tagline "Setiap janji punya jejak"
- [ ] Janji prominent cards (4 latest) tampil
- [ ] JanjiVsRealitaCard prominent di hero area
- [ ] Live Watch feed preview (3 verdicts) tampil
- [ ] Fitur pendukung grid 4-card (Komunitas/Karya/Kelas/Aksi) compact
- [ ] Nav reorder: Tagih + Live Watch + Main priority
- [ ] Mobile responsive 375px
- [ ] Loading skeletons proper
- [ ] Empty states proper
- [ ] `pnpm typecheck` + `pnpm lint` + `pnpm test` pass

---

## Coordinate paralel — Window F territory

✅ Aman: `apps/web/src/app/page.tsx`, `apps/web/src/components/beranda/**`, `apps/web/src/components/site-header.tsx`
❌ Coordinate dengan Window A (#24 components consumption) + Window C (#28 game card import) + Window D (#29 verdict component import)

---

## Commit message

```
feat(beranda): redesign — Tagih + Janji vs Realita prominent

- Hero baru: tagline "Setiap janji punya jejak"
- Janji prominent cards (4 latest hot janji)
- JanjiVsRealitaCard prominent (game CTA hero-level)
- Live Watch feed preview (3 verdicts terbaru)
- Fitur pendukung grid compact (Komunitas/Karya/Kelas/Aksi)
- Nav reorder: Tagih > Live Watch > Main priority

Per Spec #32 — visible signal pivot. Drop equal-weight 6 fitur.
```

# Spec #8 — Karya page (Index + ReadingView)

**Sprint**: 3
**Owner**: Claude Code (executor) · audited oleh planner
**Estimasi**: 2-3 jam
**Dependency**: Spec #6 (typegen), Spec #6.5 (test foundation), Spec #7 (Komunitas pattern reference)
**Decisions Mas (approved 2026-05-01):**
1. ✅ Display all 5 type Karya (Tulisan/Vlog/Ilustrasi/Podcast/Zine) di Index dengan filter chip
2. ✅ Cuma Tulisan punya ReadingView Sprint 3 — Vlog/Ilustrasi/Podcast/Zine render thumbnail + open external link (full player Sprint 4)
3. ✅ Submit Karya flow defer ke Sprint 4 (vlog upload butuh Supabase Storage setup)

**Required reading sebelum mulai:**
1. `CLAUDE.md` — operating manual
2. `apps/legacy/src/pages/karya/Index.jsx` — Phase 1 reference (sample data + KREATOR sidebar + tab nav + editor picks)
3. `apps/legacy/src/pages/karya/ReadingView.jsx` — Phase 1 longform reader pattern
4. `specs/SPRINT-3/07-komunitas.md` — pattern Server+Client split + filter URL yang sudah established
5. `apps/web/src/app/komunitas/page.tsx` — implementation reference Spec #7
6. `packages/data/src/queries.ts` line 220+ — `listKarya`, `getKarya` (DON'T re-build)
7. `packages/data/src/types.ts` — `Karya`, `KaryaType`
8. `packages/data/src/schemas.ts` — `karyaTypeSchema`

---

## Goal

Port halaman Karya dari Phase 1 ke Phase 2 dengan:
- **Index page** (`/karya`) — list karya dengan tab filter 6 (Semua + 5 type), Editor Picks horizontal scroll, Top Kreator sidebar
- **ReadingView** (`/karya/[id]`) — full longform article reader dengan drop cap, subtitle italic Vollkorn, ## h2 sub-headings, blockquote pull quote, footer author bio. **Cuma untuk type='Tulisan'** — type lain redirect ke fallback "Coming Sprint 4: vlog player / ilustrasi gallery / dst"

Setelah spec ini selesai:
- Beranda existing reference ke `/karya` (kalau ada) jalan
- Header nav "Karya" jalan (gak 404)
- Filter chip URL-shareable (mirror pattern Spec #7)
- Tulisan reading experience polished (typography Vollkorn, lebar max-w-3xl, line-height ramah baca)

## Konteks

Karya lebih simpel dari Komunitas — gak ada vote/reply/auth gate per row. Tapi typography matters lebih: ReadingView adalah surface yang user bakal habisin 7-15 menit baca, jadi font/spacing/contrast harus tight.

Per Phase 1 Phase 1 ReadingView, body pakai markdown subset: `## h2`, `> blockquote`, `**bold**`, paragraf separator `\n\n`. Minimal markdown parser — gak perlu react-markdown untuk Sprint 3 (defer ke #15 polish).

---

## File yang dibuat

```
apps/web/src/app/karya/
├── page.tsx                            Index — Server Component
├── karya-tabs.tsx                      Client — 6-tab filter (Semua + Tulisan/Vlog/Ilustrasi/Podcast/Zine)
├── karya-card.tsx                      Server — single card (cover, type pill, title, meta, author, chapter)
├── editor-picks.tsx                    Server — horizontal scroll featured karya
├── top-kreator-sidebar.tsx             Server — top 5 kreator dengan karya count
└── [id]/
    ├── page.tsx                        Detail router — branch by type, render ReadingView atau Placeholder
    ├── reading-view.tsx                Server — Tulisan reader dengan markdown subset
    ├── article-body.tsx                Server — paragraph + ## h2 + > blockquote + **bold**
    └── non-tulisan-placeholder.tsx     Server — fallback untuk Vlog/Ilustrasi/Podcast/Zine

apps/web/src/lib/karya/
├── constants.ts                        TYPE_OPTIONS (5), TYPE_PILL_COLOR (brand mapping), TYPE_LABEL
└── filters.ts                          parseKaryaFilter + buildKaryaUrl + toggleKaryaFilter

apps/web/src/__tests__/
├── karya-filters.test.ts               Test filter parser
├── article-body.test.tsx               Test markdown rendering (paragraph + bold + h2 + blockquote)
└── karya-card.test.tsx                 Test card render dengan type pill color match
```

## File yang diubah

```
apps/web/src/components/site-header.tsx
  — Verify nav "Karya" href={'/karya'} match (mungkin sudah benar dari Spec #7 baseline)
```

## File yang TIDAK boleh diubah

- `apps/legacy/*` — Phase 1 freeze
- `packages/data/src/queries.ts` — pattern queries existing, jangan tambah yang gak perlu
- Schema migrations — out of scope

---

## Step-by-step

### 1. Constants & filter helpers

**`apps/web/src/lib/karya/constants.ts`:**

```ts
import type { KaryaType } from '@jw/data/types';

export const TYPE_OPTIONS: { id: KaryaType; label: string; meta_label: string }[] = [
  { id: 'Tulisan',   label: 'Tulisan',   meta_label: 'mnt baca' },
  { id: 'Vlog',      label: 'Vlog',      meta_label: 'durasi'  },
  { id: 'Ilustrasi', label: 'Ilustrasi', meta_label: 'panel'   },
  { id: 'Podcast',   label: 'Podcast',   meta_label: 'durasi'  },
  { id: 'Zine',      label: 'Zine',      meta_label: 'halaman' },
];

/**
 * Map Karya type → brand color token.
 * Pakai Pill component color prop di card.
 */
export const TYPE_PILL_COLOR: Record<KaryaType, 'blue' | 'coral' | 'mint' | 'marigold' | 'grey'> = {
  Tulisan:   'blue',
  Vlog:      'coral',
  Ilustrasi: 'mint',
  Podcast:   'marigold',
  Zine:      'grey',
};
```

**`apps/web/src/lib/karya/filters.ts`:**

```ts
import type { KaryaType } from '@jw/data/types';
import { TYPE_OPTIONS } from './constants';

export type KaryaFilter = {
  type?: KaryaType;
  page?: number;
};

const VALID_TYPES = new Set(TYPE_OPTIONS.map((o) => o.id));

export function parseKaryaFilter(
  params: Record<string, string | string[] | undefined>,
): KaryaFilter {
  const f: KaryaFilter = {};
  const type = typeof params.type === 'string' ? params.type : undefined;
  const pageStr = typeof params.page === 'string' ? params.page : undefined;

  if (type && VALID_TYPES.has(type as KaryaType)) f.type = type as KaryaType;
  if (pageStr) {
    const n = parseInt(pageStr, 10);
    if (Number.isFinite(n) && n >= 1) f.page = n;
  }
  return f;
}

export function buildKaryaUrl(filter: KaryaFilter): string {
  const params = new URLSearchParams();
  if (filter.type) params.set('type', filter.type);
  if (filter.page && filter.page > 1) params.set('page', String(filter.page));
  const qs = params.toString();
  return qs ? `/karya?${qs}` : '/karya';
}

export function toggleKaryaType(
  current: KaryaFilter,
  type: KaryaType | undefined,
): KaryaFilter {
  const next = { ...current };
  if (type === undefined || next.type === type) {
    delete next.type;
  } else {
    next.type = type;
  }
  delete next.page;
  return next;
}
```

### 2. Index page

**`apps/web/src/app/karya/page.tsx`:**

```tsx
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { parseKaryaFilter, buildKaryaUrl } from '@/lib/karya/filters';
import { KaryaTabs } from './karya-tabs';
import { KaryaCard } from './karya-card';
import { EditorPicks } from './editor-picks';
import { TopKreatorSidebar } from './top-kreator-sidebar';
import { EmptyKarya } from '@/components/illustrations/empty-karya';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';

const PAGE_SIZE = 18;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function KaryaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const filter = parseKaryaFilter(sp);
  const page = filter.page ?? 1;
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();

  let q = supabase
    .from('karya')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (filter.type) q = q.eq('type', filter.type);

  const { data: karyaList, count, error } = await q;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Hero */}
      <header className="mb-8 flex items-end justify-between gap-4 flex-wrap border-b border-jw-line pb-6">
        <div>
          <span className="font-hand text-jw-coral text-base">— karya warga</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-jw-blue leading-tight">
            Karya
          </h1>
          <p className="text-base md:text-lg text-jw-ink/70 mt-2 max-w-xl">
            Panggung anak muda yang punya isi.
          </p>
        </div>
        <button
          type="button"
          disabled
          title="Submit Karya — Coming Sprint 4"
          className="inline-flex items-center gap-1.5 rounded-jw-md border border-jw-line bg-jw-line/30 px-4 py-2 text-sm font-semibold text-jw-muted cursor-not-allowed"
        >
          + Upload karya (segera)
        </button>
      </header>

      <KaryaTabs currentType={filter.type} />

      <EditorPicks className="mt-6" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 mt-10">
        <main>
          <h2 className="font-display text-xl font-semibold text-jw-blue mb-4">
            {filter.type ?? 'Semua karya'}
            {count != null && (
              <span className="ml-2 text-sm font-normal text-jw-muted">({count})</span>
            )}
          </h2>

          {error ? (
            <div className="rounded-jw-lg bg-jw-pill-coral-bg border border-jw-coral/30 p-4 text-sm text-jw-pill-coral-text">
              Gagal memuat karya: {error.message}
            </div>
          ) : !karyaList || karyaList.length === 0 ? (
            <div className="rounded-jw-lg border border-dashed border-jw-line p-10 text-center flex flex-col items-center">
              <EmptyKarya size={220} />
              <p className="font-hand text-xl text-jw-coral mt-3">— belum ada karya {filter.type ?? ''}</p>
              <p className="text-sm text-jw-muted mt-1">
                Submit karya pertama akan ada di Sprint 4.
              </p>
              {filter.type && (
                <Link
                  href="/karya"
                  className="inline-block mt-4 text-sm font-semibold text-jw-coral hover:underline"
                >
                  Lihat semua karya
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {karyaList.map((k) => (
                <KaryaCard key={k.id} karya={k} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {count && count > PAGE_SIZE && (
            <nav className="mt-6 flex items-center justify-between text-sm">
              {page > 1 ? (
                <Link
                  href={buildKaryaUrl({ ...filter, page: page - 1 })}
                  className="text-jw-coral font-semibold hover:underline"
                >
                  ← Sebelumnya
                </Link>
              ) : <span />}
              <span className="text-jw-muted">
                Page {page} dari {Math.ceil(count / PAGE_SIZE)}
              </span>
              {offset + PAGE_SIZE < count ? (
                <Link
                  href={buildKaryaUrl({ ...filter, page: page + 1 })}
                  className="text-jw-coral font-semibold hover:underline"
                >
                  Selanjutnya →
                </Link>
              ) : <span />}
            </nav>
          )}
        </main>

        <aside>
          <TopKreatorSidebar />
        </aside>
      </div>

      <NalaTriggerButton context="tentang Karya" />
    </div>
  );
}

export const metadata = {
  title: 'Karya — Jubir Warga',
  description: 'Tulisan, vlog, ilustrasi, podcast, dan zine dari warga.',
};
```

### 3. KaryaTabs (Client)

**`apps/web/src/app/karya/karya-tabs.tsx`:**

```tsx
'use client';

import { useRouter } from 'next/navigation';
import type { KaryaType } from '@jw/data/types';
import { TYPE_OPTIONS } from '@/lib/karya/constants';
import { buildKaryaUrl, toggleKaryaType, type KaryaFilter } from '@/lib/karya/filters';

type Props = {
  currentType: KaryaType | undefined;
};

export function KaryaTabs({ currentType }: Props) {
  const router = useRouter();

  const onSelect = (type: KaryaType | undefined) => {
    const next = toggleKaryaType({ type: currentType }, type);
    router.push(buildKaryaUrl(next as KaryaFilter));
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-jw-line">
      <Tab label="Semua" active={!currentType} onClick={() => onSelect(undefined)} />
      {TYPE_OPTIONS.map((opt) => (
        <Tab
          key={opt.id}
          label={opt.label}
          active={currentType === opt.id}
          onClick={() => onSelect(opt.id)}
        />
      ))}
    </div>
  );
}

function Tab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-shrink-0 rounded-jw-md px-4 py-2 text-sm font-semibold transition ${
        active
          ? 'bg-jw-blue text-white'
          : 'text-jw-ink hover:bg-jw-line/40'
      }`}
    >
      {label}
    </button>
  );
}
```

### 4. KaryaCard (Server)

**`apps/web/src/app/karya/karya-card.tsx`:**

```tsx
import Link from 'next/link';
import type { Karya, KaryaType } from '@jw/data/types';
import { TYPE_PILL_COLOR } from '@/lib/karya/constants';
import { formatRelative } from '@/lib/format';

const PILL_BG: Record<string, string> = {
  blue: 'bg-jw-pill-blue-bg text-jw-blue',
  coral: 'bg-jw-pill-coral-bg text-jw-pill-coral-text',
  mint: 'bg-jw-pill-mint-bg text-jw-mint',
  marigold: 'bg-jw-pill-marigold-bg text-jw-marigold',
  grey: 'bg-jw-pill-grey-bg text-jw-muted',
};

export function KaryaCard({ karya }: { karya: Karya }) {
  const color = TYPE_PILL_COLOR[karya.type as KaryaType];

  return (
    <Link
      href={`/karya/${karya.id}`}
      className="group rounded-jw-lg border border-jw-line bg-white overflow-hidden hover:border-jw-blue-soft/40 transition flex flex-col"
    >
      {/* Cover placeholder atau image */}
      {karya.cover_url ? (
        <img
          src={karya.cover_url}
          alt=""
          className="aspect-video w-full object-cover"
        />
      ) : (
        <div className={`aspect-video w-full ${PILL_BG[color]} flex items-center justify-center`}>
          <span className="font-display text-lg font-semibold opacity-60">{karya.type}</span>
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col">
        <span className={`inline-flex self-start rounded-jw-sm px-2 py-0.5 text-xs font-semibold ${PILL_BG[color]}`}>
          {karya.type}
        </span>
        <h3 className="font-display font-semibold text-jw-blue mt-2 leading-snug group-hover:underline">
          {karya.title}
        </h3>
        {karya.meta && (
          <p className="text-xs text-jw-muted mt-1">{karya.meta}</p>
        )}
        <div className="mt-auto pt-3 text-xs text-jw-muted">
          {formatRelative(karya.created_at)}
        </div>
      </div>
    </Link>
  );
}
```

### 5. Editor Picks (Server, horizontal scroll)

**`apps/web/src/app/karya/editor-picks.tsx`:**

```tsx
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { TYPE_PILL_COLOR } from '@/lib/karya/constants';

export async function EditorPicks({ className }: { className?: string }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('karya')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (!data || data.length === 0) return null;

  return (
    <section className={className ?? ''}>
      <header className="flex items-center justify-between mb-3">
        <h2 className="font-display text-lg font-semibold text-jw-blue">
          Pilihan Editor
        </h2>
        <span className="font-hand text-sm text-jw-coral">— minggu ini</span>
      </header>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {data.map((k) => {
          const color = TYPE_PILL_COLOR[k.type as keyof typeof TYPE_PILL_COLOR];
          return (
            <Link
              key={k.id}
              href={`/karya/${k.id}`}
              className="flex-shrink-0 w-56 rounded-jw-lg border border-jw-line bg-white overflow-hidden hover:border-jw-coral transition"
            >
              <div className={`aspect-video w-full bg-jw-pill-${color}-bg flex items-center justify-center`}>
                <span className="font-display text-sm font-semibold text-jw-blue/70">{k.type}</span>
              </div>
              <div className="p-3">
                <p className="font-display font-semibold text-sm text-jw-blue line-clamp-2 leading-snug">
                  {k.title}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
```

### 6. Top Kreator Sidebar (Server)

**`apps/web/src/app/karya/top-kreator-sidebar.tsx`:**

```tsx
import { createClient } from '@/lib/supabase/server';

export async function TopKreatorSidebar() {
  const supabase = await createClient();

  // Aggregate karya count per author. Bisa pakai SQL view kalau ada,
  // atau query direct dengan group by. Sprint 3 simple version:
  // ambil top 5 profiles by karya count via raw RPC atau client-side reduce.
  // Karena belum ada view dedicated, pakai approach query author paling produktif.
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name, username, level, chapter_id')
    .order('xp', { ascending: false })
    .limit(5);

  return (
    <div className="rounded-jw-lg border border-jw-line bg-white p-5 sticky top-20">
      <header className="mb-3">
        <span className="font-hand text-jw-coral text-sm">— top kreator</span>
        <h3 className="font-display text-base font-semibold text-jw-blue">
          Yang sering kasih karya
        </h3>
      </header>
      <ol className="space-y-3">
        {(profiles ?? []).map((p, i) => (
          <li key={p.id} className="flex items-center gap-3 text-sm">
            <span className="flex-shrink-0 w-6 text-center font-mono font-bold text-jw-coral">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-jw-blue truncate">{p.name ?? p.username ?? 'Anonim'}</p>
              <p className="text-xs text-jw-muted">Level {p.level} · {p.chapter_id ?? '—'}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-jw-muted italic">
        Aggregat akurat (karya count per author) Sprint 4.
      </p>
    </div>
  );
}
```

> **NOTE Claude Code:** TopKreator sebenarnya butuh DB view aggregate `profiles_with_karya_count`. Sprint 3 pakai sort by `xp` sebagai proxy kreator aktif. TODO comment di file: `// TODO Sprint 4: query view profiles_with_karya_count untuk aggregate akurat`.

### 7. Detail router

**`apps/web/src/app/karya/[id]/page.tsx`:**

```tsx
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ReadingView } from './reading-view';
import { NonTulisanPlaceholder } from './non-tulisan-placeholder';

export default async function KaryaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: karya } = await supabase.from('karya').select('*').eq('id', id).maybeSingle();

  if (!karya) notFound();

  if (karya.type === 'Tulisan') {
    return <ReadingView karya={karya} />;
  }
  return <NonTulisanPlaceholder karya={karya} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('karya').select('title, type').eq('id', id).maybeSingle();
  return {
    title: `${data?.title ?? 'Karya'} — ${data?.type ?? ''} — Jubir Warga`,
  };
}
```

### 8. ReadingView (Tulisan reader)

**`apps/web/src/app/karya/[id]/reading-view.tsx`:**

```tsx
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import type { Karya } from '@jw/data/types';
import { ArticleBody } from './article-body';
import { formatRelative } from '@/lib/format';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';

export function ReadingView({ karya }: { karya: Karya }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/karya"
        className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline mb-6"
      >
        <ChevronLeft size={14} aria-hidden /> Kembali ke Karya
      </Link>

      <header className="mb-8">
        <span className="inline-block rounded-jw-sm bg-jw-pill-blue-bg text-jw-blue text-xs font-semibold px-2 py-0.5 mb-3">
          {karya.type}
        </span>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-jw-blue leading-tight">
          {karya.title}
        </h1>
        {karya.meta && (
          <p className="font-display text-lg italic text-jw-ink/70 mt-3">
            {karya.meta}
          </p>
        )}
        <p className="text-sm text-jw-muted mt-4">
          {formatRelative(karya.created_at)}
        </p>
      </header>

      <ArticleBody body={karya.body ?? '*Tulisan belum tersedia.*'} />

      <footer className="mt-12 pt-6 border-t border-jw-line text-sm text-jw-muted">
        <p>
          Tulisan ini dipublish di Jubir Warga. Mau ngobrol soal isinya? <Link href={`/komunitas`} className="text-jw-coral font-semibold hover:underline">Diskusi di forum</Link>.
        </p>
      </footer>

      <NalaTriggerButton context={`karya "${karya.title}"`} />
    </div>
  );
}
```

### 9. ArticleBody (markdown subset)

**`apps/web/src/app/karya/[id]/article-body.tsx`:**

```tsx
type Block = { kind: 'p' | 'h2' | 'quote'; text: string };

function parseBlocks(body: string): Block[] {
  return body
    .split('\n\n')
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => {
      if (b.startsWith('## ')) return { kind: 'h2' as const, text: b.slice(3).trim() };
      if (b.startsWith('> '))  return { kind: 'quote' as const, text: b.slice(2).trim() };
      return { kind: 'p' as const, text: b };
    });
}

function renderInline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*/g;
  let lastIdx = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIdx) out.push(text.slice(lastIdx, match.index));
    out.push(
      <strong key={key++} className="font-semibold text-jw-blue">
        {match[1]}
      </strong>,
    );
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < text.length) out.push(text.slice(lastIdx));
  return out;
}

export function ArticleBody({ body }: { body: string }) {
  const blocks = parseBlocks(body);

  return (
    <article className="space-y-5 text-jw-ink leading-[1.75] text-base md:text-lg">
      {blocks.map((b, i) => {
        if (b.kind === 'h2') {
          return (
            <h2
              key={i}
              className="font-display text-2xl md:text-3xl font-bold text-jw-blue mt-10 mb-2"
            >
              {b.text}
            </h2>
          );
        }
        if (b.kind === 'quote') {
          return (
            <blockquote
              key={i}
              className="border-l-4 border-jw-coral pl-5 my-6 font-display italic text-jw-ink/80 text-lg md:text-xl"
            >
              {renderInline(b.text)}
            </blockquote>
          );
        }
        return (
          <p key={i} className="whitespace-pre-wrap">
            {renderInline(b.text)}
          </p>
        );
      })}
    </article>
  );
}
```

### 10. NonTulisanPlaceholder

**`apps/web/src/app/karya/[id]/non-tulisan-placeholder.tsx`:**

```tsx
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import type { Karya } from '@jw/data/types';

export function NonTulisanPlaceholder({ karya }: { karya: Karya }) {
  const messages: Record<string, string> = {
    Vlog: 'Player video penuh di Sprint 4. Sementara, link sumber kalau ada:',
    Ilustrasi: 'Galeri ilustrasi penuh di Sprint 4. Sementara, link sumber kalau ada:',
    Podcast: 'Player audio + transkrip di Sprint 4. Sementara, link sumber kalau ada:',
    Zine: 'Pembaca PDF in-app di Sprint 4. Sementara, link unduh kalau ada:',
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/karya"
        className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline mb-6"
      >
        <ChevronLeft size={14} aria-hidden /> Kembali ke Karya
      </Link>

      <header className="mb-6">
        <span className="inline-block rounded-jw-sm bg-jw-pill-coral-bg text-jw-pill-coral-text text-xs font-semibold px-2 py-0.5 mb-3">
          {karya.type}
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-jw-blue leading-tight">
          {karya.title}
        </h1>
        {karya.meta && (
          <p className="text-sm text-jw-muted mt-2">{karya.meta}</p>
        )}
      </header>

      <div className="rounded-jw-lg border border-dashed border-jw-line bg-jw-cream/40 p-6 text-center">
        <p className="text-sm text-jw-ink/80 max-w-md mx-auto">
          {messages[karya.type] ?? 'Konten tipe ini akan tersedia di Sprint 4.'}
        </p>
        {karya.cover_url && (
          <a
            href={karya.cover_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 rounded-jw-md bg-jw-coral px-4 py-2 text-sm font-semibold text-white hover:bg-jw-coral/90"
          >
            Buka sumber asli ↗
          </a>
        )}
      </div>
    </div>
  );
}
```

### 11. Tests (3 baru)

**`apps/web/src/__tests__/karya-filters.test.ts`:**

```ts
import { describe, it, expect } from 'vitest';
import { parseKaryaFilter, buildKaryaUrl, toggleKaryaType } from '@/lib/karya/filters';

describe('parseKaryaFilter', () => {
  it('parses valid type + page', () => {
    expect(parseKaryaFilter({ type: 'Tulisan', page: '2' })).toEqual({ type: 'Tulisan', page: 2 });
  });
  it('ignores invalid type', () => {
    expect(parseKaryaFilter({ type: 'Komik' })).toEqual({});
  });
});

describe('buildKaryaUrl', () => {
  it('returns base when empty', () => {
    expect(buildKaryaUrl({})).toBe('/karya');
  });
  it('builds query string', () => {
    expect(buildKaryaUrl({ type: 'Vlog', page: 3 })).toContain('type=Vlog');
  });
});

describe('toggleKaryaType', () => {
  it('sets type when none', () => {
    expect(toggleKaryaType({}, 'Tulisan')).toEqual({ type: 'Tulisan' });
  });
  it('clears when same type passed', () => {
    expect(toggleKaryaType({ type: 'Tulisan' }, 'Tulisan')).toEqual({});
  });
  it('resets page on change', () => {
    expect(toggleKaryaType({ type: 'Vlog', page: 4 }, 'Tulisan')).toEqual({ type: 'Tulisan' });
  });
});
```

**`apps/web/src/__tests__/article-body.test.tsx`:**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ArticleBody } from '@/app/karya/[id]/article-body';

describe('<ArticleBody />', () => {
  it('renders paragraphs separated by blank line', () => {
    render(<ArticleBody body={'Para 1.\n\nPara 2.'} />);
    expect(screen.getByText('Para 1.')).toBeInTheDocument();
    expect(screen.getByText('Para 2.')).toBeInTheDocument();
  });

  it('renders ## h2 as heading', () => {
    render(<ArticleBody body={'## My Heading\n\nBody.'} />);
    expect(screen.getByRole('heading', { level: 2, name: /My Heading/ })).toBeInTheDocument();
  });

  it('renders > quote as blockquote', () => {
    const { container } = render(<ArticleBody body={'> Quote text.'} />);
    expect(container.querySelector('blockquote')).toHaveTextContent('Quote text.');
  });

  it('renders **bold** as strong', () => {
    const { container } = render(<ArticleBody body={'Hello **world**.'} />);
    expect(container.querySelector('strong')).toHaveTextContent('world');
  });
});
```

**`apps/web/src/__tests__/karya-card.test.tsx`:**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KaryaCard } from '@/app/karya/karya-card';

const baseKarya = {
  id: 'k1',
  type: 'Tulisan' as const,
  title: 'Sample Tulisan',
  body: null,
  meta: '7 mnt baca',
  cover_url: null,
  tags: null,
  author_id: null,
  is_demo: false,
  created_at: '2026-05-01T00:00:00Z',
};

describe('<KaryaCard />', () => {
  it('renders title + type pill + meta', () => {
    render(<KaryaCard karya={baseKarya} />);
    expect(screen.getByText('Sample Tulisan')).toBeInTheDocument();
    expect(screen.getByText('7 mnt baca')).toBeInTheDocument();
  });
  it('renders type label twice (placeholder + pill)', () => {
    render(<KaryaCard karya={baseKarya} />);
    const tulisanLabels = screen.getAllByText('Tulisan');
    expect(tulisanLabels.length).toBeGreaterThanOrEqual(2);
  });
});
```

---

## Acceptance checklist

- [ ] `/karya` render dengan tab filter 6 (Semua + 5 type) + Editor Picks + grid card + Top Kreator sidebar
- [ ] Tab klik: URL update `?type=Tulisan`, list filter
- [ ] Tab "Semua" → URL clean (`/karya`)
- [ ] Empty state render kalau filter return 0 (illustration + reset link)
- [ ] Pagination jalan (count > 18)
- [ ] `/karya/[id]` untuk Tulisan → ReadingView render dengan body markdown (paragraph + ## h2 + > blockquote + **bold**)
- [ ] `/karya/[id]` untuk Vlog/Ilustrasi/Podcast/Zine → NonTulisanPlaceholder render dengan message + optional source link
- [ ] Reading typography: max-w-3xl, leading-relaxed, h2 dengan margin top, blockquote coral border-left
- [ ] Header nav "Karya" link jalan
- [ ] Floating "Tanya Nala tentang Karya/karya <title>" coral pill
- [ ] "+ Upload karya (segera)" disabled button (Sprint 4)
- [ ] `pnpm test` pass dengan 3 test baru (karya-filters, article-body, karya-card) → total 42+
- [ ] `pnpm typecheck` pass dengan 0 errors
- [ ] `pnpm lint` pass dengan 0 new warnings
- [ ] Mobile responsive 320-1440px

## Out of scope (defer Sprint 4+)

- ❌ Submit Karya flow (form + validation + upload) — Sprint 4 (butuh Supabase Storage)
- ❌ Vlog player + transcript — Sprint 4
- ❌ Ilustrasi gallery (multi-panel viewer) — Sprint 4
- ❌ Podcast player (audio + chapters) — Sprint 4
- ❌ Zine PDF reader in-app — Sprint 4
- ❌ Top Kreator aggregate count akurat — butuh DB view, Sprint 4
- ❌ Reactions (like/save/share) — Sprint 4
- ❌ Comments di Karya — Sprint 4 atau gabung Komunitas thread

## Notes untuk planner audit

Aku akan audit:
- File structure sesuai (12 file baru + 1 modified verify)
- Server/Client split benar (cuma KaryaTabs yang Client)
- URL filter shareable
- Brand voice (no "civic", placeholder copy on-tone)
- Typography ReadingView nyaman baca (manual visual check via Chrome MCP)
- Test coverage tambah 3, total project >= 42

## Commit message

```
feat(karya): port Index + ReadingView with type filter, editor picks, kreator

- /karya — Server Component, KaryaTabs (Client) 6-tab filter URL-shareable,
  EditorPicks horizontal scroll, KaryaCard grid 1/2/3 cols responsive,
  TopKreatorSidebar (xp proxy, akurat aggregate Sprint 4)
- /karya/[id] — branch by type: Tulisan → ReadingView (markdown subset),
  Vlog/Ilustrasi/Podcast/Zine → NonTulisanPlaceholder + optional source link
- ArticleBody parser: ## h2, > blockquote, **bold**, paragraph by \n\n
- Submit Karya disabled (Sprint 4 pending Supabase Storage)
- 3 test baru: filters parser, article-body markdown, karya-card render
- Per Spec #8 + decisions Mas (5 type displayed, Tulisan reader Sprint 3,
  submit defer)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

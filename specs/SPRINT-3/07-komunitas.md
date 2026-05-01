# Spec #7 — Komunitas page (Index + ThreadDetail)

**Sprint**: 3
**Owner**: Claude Code (executor) · audited oleh planner
**Estimasi**: 4-5 jam (boleh di-split #7a Index + #7b ThreadDetail kalau overrun)
**Dependency**: Spec #6 (typegen), Spec #6.5 (test foundation)
**Decisions Mas (approved 2026-05-01):**
1. ✅ Server Component data fetch + nested Client Components untuk vote/filter/reply
2. ✅ Login required untuk vote/reply/submit thread (redirect ke `/masuk?redirect=...`)
3. ✅ Sub-komunitas hard-code constant Sprint 3 (migrate ke DB Sprint 5)

**Required reading sebelum mulai:**
1. `CLAUDE.md` — operating manual (brand voice, design tokens, security rules)
2. `apps/legacy/src/pages/komunitas/Index.jsx` — Phase 1 reference, pattern + sample data
3. `apps/legacy/src/pages/komunitas/ThreadDetail.jsx` — Phase 1 reference detail page
4. `apps/legacy/docs/Prompt_Claude_Design_Jubir_Warga_v2.md` Section 4.3 — Komunitas page spec design
5. `apps/web/src/components/beranda/thread-list.tsx` — pattern Server Component data fetch yang udah established
6. `packages/data/src/queries.ts` — `listThreads`, `getThread`, `listThreadReplies`, `submitReply`, `voteThread`, `unvoteThread`
7. `packages/data/src/schemas.ts` — `submitThreadSchema`, `submitReplySchema`
8. `packages/data/src/types.ts` — `ThreadWithAuthor`, `ThreadReply`, `TopicId`, `ChapterId`, `ThreadFormat`

---

## Goal

Port halaman Komunitas dari Phase 1 ke Phase 2 dengan:
- **Index page** (`/komunitas`) — list thread dengan sidebar filter 3-tier (Topik / Lokasi / Format), vote arrows interaktif, sub-komunitas section, chapter regional section
- **Detail page** (`/komunitas/[id]`) — full thread body + reply tree + vote + reply form + "Ringkas via Nala" button (open NalaPanel dengan context thread)

Setelah spec ini selesai:
- Beranda `<ThreadList>` link ke `/komunitas` jalan
- 9-page nav header "Komunitas" jalan (gak 404)
- Vote thread: anonymous → redirect login; logged in → optimistic UI + persist
- Reply thread: form submit, refresh tree
- Sub-komunitas section: 3 hard-coded entries dengan apply CTA (placeholder action)
- Chapter regional section: pull dari Supabase `chapters` table

## Konteks

Komunitas adalah **page paling rame** di Phase 1 (peng-port pertama page detail). Pattern yang ditegakkan di Spec #7 akan jadi template untuk Spec #8-12 berikutnya:
- Server Component fetch via `@jw/data` queries (atau direct Supabase client)
- Nested Client Component untuk interaktif (vote, form, modal)
- URL searchParams untuk filter state (shareable + back-button friendly)
- Optimistic UI via TanStack Query mutation
- Auth gate: anonymous boleh read, action butuh login

Spec #6.5 punya policy "1 test per komponen baru dengan logic non-trivial" — Spec #7 akan tambah 3-4 test minimum.

---

## File yang dibuat

```
apps/web/src/app/komunitas/
├── page.tsx                            Index — Server Component
├── komunitas-sidebar.tsx               Client — sidebar 3-tier filter (Topik/Lokasi/Format)
├── thread-row.tsx                      Server — row wrapper
├── vote-arrows.tsx                     Client — up/down arrows dengan auth gate
├── sub-komunitas-section.tsx           Server — 3 hard-coded card
├── chapter-regional-section.tsx        Server — pull from chapters table
└── [id]/
    ├── page.tsx                        ThreadDetail — Server Component
    ├── thread-body.tsx                 Server — full body dengan markdown bold
    ├── reply-tree.tsx                  Server — list reply (max depth 5)
    ├── reply-row.tsx                   Server — single reply row
    ├── reply-form.tsx                  Client — composer + submit Server Action
    └── ringkas-nala-button.tsx         Client — open NalaPanel dengan context

apps/web/src/lib/komunitas/
├── constants.ts                        SUBCOMMUNITIES (hard-code 3) + TOPIK + LOKASI + FORMAT labels
└── filters.ts                          parseFilterFromSearchParams + buildFilterUrl helpers

apps/web/src/app/komunitas/
└── actions.ts                          Server Actions: voteThreadAction, submitReplyAction
                                        (Zod-validated input, auth gate)

apps/web/src/__tests__/
├── komunitas-filters.test.ts           Test parseFilterFromSearchParams + buildFilterUrl
├── vote-arrows.test.tsx                Test vote-arrows render + auth gate redirect
└── reply-form.test.tsx                 Test reply form Zod validation + submit
```

## File yang diubah

```
apps/web/src/components/beranda/thread-list.tsx
  — Tombol "Mulai diskusi pertama" link href={'/komunitas'} (verify masih bener)

apps/web/src/components/site-header.tsx
  — Verify nav "Komunitas" href={'/komunitas'} match
```

## File yang TIDAK boleh diubah

- `apps/legacy/*` — Phase 1 freeze
- `packages/data/src/queries.ts` — pattern queries existing, jangan tambah yang gak perlu
- Schema migrations — out of scope

---

## Step-by-step

### 1. Constants & filter helpers

**`apps/web/src/lib/komunitas/constants.ts`:**

```ts
import type { TopicId, ChapterId, ThreadFormat } from '@jw/data/types';

export const TOPIK_OPTIONS: { id: TopicId; label: string }[] = [
  { id: 'politik',    label: 'Politik & Demokrasi'  },
  { id: 'lingkungan', label: 'Lingkungan & Iklim'   },
  { id: 'gender',     label: 'Gender & Kesetaraan'  },
  { id: 'mental',     label: 'Mental Health'        },
  { id: 'kerja',      label: 'Ekonomi & Kerja'      },
  { id: 'pendidikan', label: 'Pendidikan'           },
  { id: 'budaya',     label: 'Budaya Pop & Media'   },
  { id: 'transport',  label: 'Transportasi & Kota'  },
];

export const LOKASI_OPTIONS: { id: ChapterId; label: string }[] = [
  { id: 'jakarta',  label: 'Jakarta'      },
  { id: 'bandung',  label: 'Bandung Raya' },
  { id: 'malang',   label: 'Malang Raya'  },
  { id: 'surabaya', label: 'Surabaya'     },
  { id: 'jogja',    label: 'Yogyakarta'   },
  { id: 'medan',    label: 'Medan'        },
  { id: 'makassar', label: 'Makassar'     },
];

export const FORMAT_OPTIONS: { id: ThreadFormat; label: string }[] = [
  { id: 'diskusi',    label: 'Diskusi terbuka'   },
  { id: 'tanya',      label: 'Tanya saja'        },
  { id: 'pengalaman', label: 'Berbagi pengalaman'},
  { id: 'polling',    label: 'Polling cepat'     },
  { id: 'live',       label: 'Live event'        },
];

/**
 * Sub-komunitas hard-coded Sprint 3 (per planner decision).
 * Migrate ke DB table `sub_communities` di Sprint 5.
 */
export type Subcommunity = {
  id: string;
  name: string;
  desc: string;
  members: number;
  moderator: string;
  apply: 'open' | 'curated';
};

export const SUBCOMMUNITIES: Subcommunity[] = [
  {
    id: 'pemantau-apbd',
    name: 'Pemantau APBD',
    desc: 'Komunitas khusus warga yang serius pantau APBD daerahnya. Diskusi mingguan, sharing data, advokasi terkoordinasi.',
    members: 127,
    moderator: 'Sari L.',
    apply: 'curated',
  },
  {
    id: 'mahasiswa-jurnalisme',
    name: 'Mahasiswa Jurnalisme',
    desc: 'Mahasiswa & alumni jurnalisme se-Indonesia. Sharing sumber, kritik tulisan, peluang kolaborasi liputan.',
    members: 243,
    moderator: 'Reza A.',
    apply: 'open',
  },
  {
    id: 'kreator-edukasi-politik',
    name: 'Kreator Edukasi Politik',
    desc: 'Konten kreator IG/TikTok/YouTube yang fokus edukasi politik untuk anak muda. Sharing template, brief, kurasi.',
    members: 89,
    moderator: 'Mei C.',
    apply: 'curated',
  },
];
```

**`apps/web/src/lib/komunitas/filters.ts`:**

```ts
import type { TopicId, ChapterId, ThreadFormat } from '@jw/data/types';
import { TOPIK_OPTIONS, LOKASI_OPTIONS, FORMAT_OPTIONS } from './constants';

export type KomunitasFilter = {
  topic?: TopicId;
  chapter?: ChapterId;
  format?: ThreadFormat;
  hot?: boolean;
  page?: number;
};

const VALID_TOPICS = new Set(TOPIK_OPTIONS.map((o) => o.id));
const VALID_LOKASI = new Set(LOKASI_OPTIONS.map((o) => o.id));
const VALID_FORMATS = new Set(FORMAT_OPTIONS.map((o) => o.id));

export function parseFilterFromSearchParams(
  params: Record<string, string | string[] | undefined>,
): KomunitasFilter {
  const f: KomunitasFilter = {};
  const topic = typeof params.topic === 'string' ? params.topic : undefined;
  const chapter = typeof params.chapter === 'string' ? params.chapter : undefined;
  const format = typeof params.format === 'string' ? params.format : undefined;
  const hot = params.hot === 'true' || params.hot === '1';
  const pageStr = typeof params.page === 'string' ? params.page : undefined;

  if (topic && VALID_TOPICS.has(topic as TopicId)) f.topic = topic as TopicId;
  if (chapter && VALID_LOKASI.has(chapter as ChapterId)) f.chapter = chapter as ChapterId;
  if (format && VALID_FORMATS.has(format as ThreadFormat)) f.format = format as ThreadFormat;
  if (hot) f.hot = true;
  if (pageStr) {
    const n = parseInt(pageStr, 10);
    if (Number.isFinite(n) && n >= 1) f.page = n;
  }
  return f;
}

export function buildFilterUrl(filter: KomunitasFilter): string {
  const params = new URLSearchParams();
  if (filter.topic) params.set('topic', filter.topic);
  if (filter.chapter) params.set('chapter', filter.chapter);
  if (filter.format) params.set('format', filter.format);
  if (filter.hot) params.set('hot', 'true');
  if (filter.page && filter.page > 1) params.set('page', String(filter.page));
  const qs = params.toString();
  return qs ? `/komunitas?${qs}` : '/komunitas';
}

/** Toggle filter (kalau current value sama, unset; otherwise set). */
export function toggleFilter<K extends keyof KomunitasFilter>(
  current: KomunitasFilter,
  key: K,
  value: KomunitasFilter[K],
): KomunitasFilter {
  const next = { ...current };
  if (next[key] === value) {
    delete next[key];
  } else {
    next[key] = value;
  }
  delete next.page; // reset page on filter change
  return next;
}
```

### 2. Server Actions

**`apps/web/src/app/komunitas/actions.ts`:**

```ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const voteSchema = z.object({
  threadId: z.string().uuid(),
  direction: z.enum(['up', 'down', 'unvote']),
});

const replySchema = z.object({
  threadId: z.string().uuid(),
  body: z.string().trim().min(2, 'Reply minimal 2 karakter').max(4000, 'Maks 4000 karakter'),
});

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function voteThreadAction(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = voteSchema.safeParse({
    threadId: formData.get('threadId'),
    direction: formData.get('direction'),
  });
  if (!parsed.success) {
    return { ok: false, error: 'Input tidak valid' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/masuk?redirect=/komunitas/${parsed.data.threadId}`);
  }

  const { threadId, direction } = parsed.data;

  if (direction === 'unvote') {
    const { error } = await supabase
      .from('thread_votes')
      .delete()
      .match({ thread_id: threadId, user_id: user.id });
    if (error) return { ok: false, error: error.message };
  } else {
    const vote = direction === 'up' ? 1 : -1;
    const { error } = await supabase
      .from('thread_votes')
      .upsert(
        { thread_id: threadId, user_id: user.id, vote },
        { onConflict: 'thread_id,user_id' },
      );
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath(`/komunitas/${threadId}`);
  revalidatePath('/komunitas');
  return { ok: true };
}

export async function submitReplyAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = replySchema.safeParse({
    threadId: formData.get('threadId'),
    body: formData.get('body'),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Validasi gagal',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/masuk?redirect=/komunitas/${parsed.data.threadId}`);
  }

  const { error } = await supabase.from('thread_replies').insert({
    thread_id: parsed.data.threadId,
    body: parsed.data.body,
    author_id: user.id,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/komunitas/${parsed.data.threadId}`);
  return { ok: true };
}
```

### 3. Index page

**`apps/web/src/app/komunitas/page.tsx`:**

```tsx
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { parseFilterFromSearchParams, buildFilterUrl } from '@/lib/komunitas/filters';
import { KomunitasSidebar } from './komunitas-sidebar';
import { ThreadRow } from './thread-row';
import { SubKomunitasSection } from './sub-komunitas-section';
import { ChapterRegionalSection } from './chapter-regional-section';
import { EmptyForum } from '@/components/illustrations/empty-forum';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';

const PAGE_SIZE = 20;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function KomunitasPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const filter = parseFilterFromSearchParams(sp);
  const page = filter.page ?? 1;
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();
  let q = supabase
    .from('threads_with_author')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (filter.topic)   q = q.eq('topic_id', filter.topic);
  if (filter.chapter) q = q.eq('chapter_id', filter.chapter);
  if (filter.format)  q = q.eq('format', filter.format);
  if (filter.hot)     q = q.eq('hot', true);

  const { data: threads, count, error } = await q;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        {/* Sidebar */}
        <aside>
          <KomunitasSidebar currentFilter={filter} />
        </aside>

        {/* Main */}
        <main>
          <header className="mb-6 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-jw-blue">
                Komunitas
              </h1>
              <p className="text-sm text-jw-muted mt-1">
                {count ?? 0} thread · ngumpul, nimbrung, atau cuma baca
              </p>
            </div>
            <Link
              href="/komunitas/baru"
              className="inline-flex items-center gap-1.5 rounded-jw-md bg-jw-coral px-4 py-2 text-sm font-semibold text-white hover:bg-jw-coral/90 transition"
            >
              + Mulai thread
            </Link>
          </header>

          {error ? (
            <div className="rounded-jw-lg bg-jw-pill-coral-bg border border-jw-coral/30 p-4 text-sm text-jw-pill-coral-text">
              Gagal memuat thread: {error.message}
            </div>
          ) : !threads || threads.length === 0 ? (
            <div className="rounded-jw-lg border border-dashed border-jw-line p-10 text-center flex flex-col items-center">
              <EmptyForum size={240} />
              <p className="font-hand text-xl text-jw-coral mt-3">— belum ada thread sesuai filter</p>
              <p className="text-sm text-jw-muted mt-1">
                Coba reset filter atau jadi yang pertama.
              </p>
              {(filter.topic || filter.chapter || filter.format || filter.hot) && (
                <Link
                  href="/komunitas"
                  className="inline-block mt-4 text-sm font-semibold text-jw-coral hover:underline"
                >
                  Reset filter
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {threads.map((t) => (
                <ThreadRow key={t.id} thread={t} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {count && count > PAGE_SIZE && (
            <nav className="mt-6 flex items-center justify-between text-sm">
              {page > 1 ? (
                <Link
                  href={buildFilterUrl({ ...filter, page: page - 1 })}
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
                  href={buildFilterUrl({ ...filter, page: page + 1 })}
                  className="text-jw-coral font-semibold hover:underline"
                >
                  Selanjutnya →
                </Link>
              ) : <span />}
            </nav>
          )}

          <SubKomunitasSection className="mt-12" />
          <ChapterRegionalSection className="mt-12" />
        </main>
      </div>

      <NalaTriggerButton context="tentang Komunitas" />
    </div>
  );
}

export const metadata = {
  title: 'Komunitas — Jubir Warga',
  description: 'Forum diskusi warga: politik, kerja, kreatif, sampai mental health.',
};
```

### 4. Sidebar (Client)

**`apps/web/src/app/komunitas/komunitas-sidebar.tsx`:**

```tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TOPIK_OPTIONS, LOKASI_OPTIONS, FORMAT_OPTIONS } from '@/lib/komunitas/constants';
import { buildFilterUrl, toggleFilter, type KomunitasFilter } from '@/lib/komunitas/filters';
import { Flame } from 'lucide-react';

type Props = {
  currentFilter: KomunitasFilter;
};

export function KomunitasSidebar({ currentFilter }: Props) {
  const router = useRouter();

  const onSelect = (key: keyof KomunitasFilter, value: string | boolean) => {
    const next = toggleFilter(currentFilter, key, value as never);
    router.push(buildFilterUrl(next));
  };

  return (
    <div className="space-y-6 sticky top-20">
      {/* Hot toggle */}
      <button
        type="button"
        onClick={() => onSelect('hot', true)}
        className={`w-full flex items-center justify-center gap-2 rounded-jw-md px-3 py-2 text-sm font-semibold transition ${
          currentFilter.hot
            ? 'bg-jw-coral text-white'
            : 'bg-jw-pill-coral-bg/60 text-jw-coral hover:bg-jw-pill-coral-bg'
        }`}
      >
        <Flame size={14} aria-hidden /> Lagi panas
      </button>

      <FilterGroup
        label="Topik"
        options={TOPIK_OPTIONS}
        currentValue={currentFilter.topic}
        onSelect={(v) => onSelect('topic', v)}
      />
      <FilterGroup
        label="Lokasi"
        options={LOKASI_OPTIONS}
        currentValue={currentFilter.chapter}
        onSelect={(v) => onSelect('chapter', v)}
      />
      <FilterGroup
        label="Format"
        options={FORMAT_OPTIONS}
        currentValue={currentFilter.format}
        onSelect={(v) => onSelect('format', v)}
      />

      {(currentFilter.topic || currentFilter.chapter || currentFilter.format || currentFilter.hot) && (
        <Link href="/komunitas" className="block text-xs text-jw-coral font-semibold hover:underline">
          Reset semua filter
        </Link>
      )}
    </div>
  );
}

function FilterGroup<T extends string>({
  label,
  options,
  currentValue,
  onSelect,
}: {
  label: string;
  options: { id: T; label: string }[];
  currentValue: T | undefined;
  onSelect: (v: T) => void;
}) {
  return (
    <div>
      <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-jw-muted mb-2">
        {label}
      </h3>
      <ul className="space-y-1">
        {options.map((o) => (
          <li key={o.id}>
            <button
              type="button"
              onClick={() => onSelect(o.id)}
              className={`w-full text-left text-sm rounded-jw-sm px-2 py-1 transition ${
                currentValue === o.id
                  ? 'bg-jw-blue text-white font-semibold'
                  : 'text-jw-ink hover:bg-jw-line/40'
              }`}
            >
              {o.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 5. ThreadRow + VoteArrows

**`apps/web/src/app/komunitas/thread-row.tsx`:** Server Component, render link + meta + body preview + tags + vote arrows (Client child).

```tsx
import Link from 'next/link';
import type { ThreadWithAuthor } from '@jw/data/types';
import { MessageCircle, MapPin } from 'lucide-react';
import { formatRelative } from '@/lib/format';
import { VoteArrows } from './vote-arrows';

export function ThreadRow({ thread }: { thread: ThreadWithAuthor }) {
  const score = (thread.upvotes ?? 0) - (thread.downvotes ?? 0);

  return (
    <article className="rounded-jw-lg border border-jw-line bg-white p-4 hover:border-jw-blue-soft/40 transition flex gap-3">
      <VoteArrows threadId={thread.id} initialScore={score} />
      <div className="flex-1 min-w-0">
        <Link
          href={`/komunitas/${thread.id}`}
          className="block font-display text-lg font-semibold text-jw-blue leading-snug hover:underline"
        >
          {thread.title}
        </Link>
        {thread.preview && (
          <p className="text-sm text-jw-ink/70 mt-1 line-clamp-2">{thread.preview}</p>
        )}
        <div className="mt-2 flex items-center gap-3 text-xs text-jw-muted flex-wrap">
          <span className="font-semibold text-jw-blue">{thread.author_name ?? 'Anonim'}</span>
          {thread.chapter_name && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={11} aria-hidden /> {thread.chapter_name}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <MessageCircle size={11} aria-hidden /> {thread.reply_count ?? 0}
          </span>
          <span>{formatRelative(thread.created_at)}</span>
        </div>
      </div>
    </article>
  );
}
```

**`apps/web/src/app/komunitas/vote-arrows.tsx`:** Client, optimistic UI, redirect to login kalau anonymous.

```tsx
'use client';

import { useState, useTransition } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { voteThreadAction } from './actions';

type Props = {
  threadId: string;
  initialScore: number;
};

export function VoteArrows({ threadId, initialScore }: Props) {
  const [score, setScore] = useState(initialScore);
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);
  const [pending, startTransition] = useTransition();

  const handle = (direction: 'up' | 'down') => {
    if (pending) return;
    const isToggle = voted === direction;
    const optimisticScore = isToggle
      ? score + (direction === 'up' ? -1 : 1)
      : voted === null
        ? score + (direction === 'up' ? 1 : -1)
        : score + (direction === 'up' ? 2 : -2);
    setScore(optimisticScore);
    setVoted(isToggle ? null : direction);

    const fd = new FormData();
    fd.set('threadId', threadId);
    fd.set('direction', isToggle ? 'unvote' : direction);

    startTransition(async () => {
      const result = await voteThreadAction(fd);
      if (!result.ok) {
        // Revert optimistic update on error
        setScore(initialScore);
        setVoted(null);
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-0.5 w-9 flex-shrink-0">
      <button
        type="button"
        onClick={() => handle('up')}
        disabled={pending}
        aria-label="Upvote"
        className={`p-1 rounded-jw-sm transition ${
          voted === 'up' ? 'text-jw-coral bg-jw-pill-coral-bg/60' : 'text-jw-muted hover:text-jw-coral'
        }`}
      >
        <ChevronUp size={20} aria-hidden />
      </button>
      <span className={`text-sm font-mono font-semibold ${voted === 'up' ? 'text-jw-coral' : 'text-jw-ink'}`}>
        {score}
      </span>
      <button
        type="button"
        onClick={() => handle('down')}
        disabled={pending}
        aria-label="Downvote"
        className={`p-1 rounded-jw-sm transition ${
          voted === 'down' ? 'text-jw-blue-soft bg-jw-pill-blue-bg' : 'text-jw-muted hover:text-jw-blue-soft'
        }`}
      >
        <ChevronDown size={20} aria-hidden />
      </button>
    </div>
  );
}
```

### 6. Sub-komunitas + Chapter sections

**`apps/web/src/app/komunitas/sub-komunitas-section.tsx`:** render 3 hard-coded constant.

```tsx
import { SUBCOMMUNITIES } from '@/lib/komunitas/constants';
import { Users } from 'lucide-react';

export function SubKomunitasSection({ className }: { className?: string }) {
  return (
    <section className={className ?? ''}>
      <header className="mb-4">
        <span className="font-hand text-jw-coral text-base">— sub-komunitas</span>
        <h2 className="font-display text-2xl font-bold text-jw-blue">
          Komunitas khusus, fokus topik
        </h2>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SUBCOMMUNITIES.map((s) => (
          <article key={s.id} className="rounded-jw-lg border border-jw-line bg-white p-5">
            <h3 className="font-display font-semibold text-jw-blue text-lg">{s.name}</h3>
            <p className="text-sm text-jw-ink/70 mt-2 line-clamp-3">{s.desc}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-jw-muted">
              <span className="inline-flex items-center gap-1">
                <Users size={12} aria-hidden /> {s.members} anggota
              </span>
              <span>· Mod: {s.moderator}</span>
            </div>
            <button
              type="button"
              disabled
              title="Coming soon — Sprint 5"
              className="mt-4 w-full rounded-jw-sm border border-jw-line text-xs font-semibold text-jw-muted py-2 cursor-not-allowed"
            >
              {s.apply === 'open' ? 'Gabung (segera)' : 'Apply (segera)'}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
```

**`apps/web/src/app/komunitas/chapter-regional-section.tsx`:** pull dari Supabase.

```tsx
import { createClient } from '@/lib/supabase/server';

export async function ChapterRegionalSection({ className }: { className?: string }) {
  const supabase = await createClient();
  const { data: chapters } = await supabase
    .from('chapters')
    .select('*')
    .order('members_count', { ascending: false });

  return (
    <section className={className ?? ''}>
      <header className="mb-4">
        <span className="font-hand text-jw-coral text-base">— chapter regional</span>
        <h2 className="font-display text-2xl font-bold text-jw-blue">Ngumpul offline</h2>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(chapters ?? []).map((c) => (
          <div
            key={c.id}
            className={`rounded-jw-md border p-3 text-sm ${
              c.active ? 'bg-white border-jw-line' : 'bg-jw-line/20 border-jw-line opacity-60'
            }`}
          >
            <p className="font-semibold text-jw-blue">{c.name}</p>
            <p className="text-xs text-jw-muted mt-0.5">
              {c.active ? `${c.members_count} anggota` : 'Coming soon'}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### 7. ThreadDetail page

**`apps/web/src/app/komunitas/[id]/page.tsx`:**

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ThreadBody } from './thread-body';
import { ReplyTree } from './reply-tree';
import { ReplyForm } from './reply-form';
import { VoteArrows } from '../vote-arrows';
import { RingkasNalaButton } from './ringkas-nala-button';
import { formatRelative } from '@/lib/format';

export default async function ThreadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: thread }, { data: replies }] = await Promise.all([
    supabase.from('threads_with_author').select('*').eq('id', id).maybeSingle(),
    supabase.from('thread_replies').select('*').eq('thread_id', id).order('created_at', { ascending: true }),
  ]);

  if (!thread) notFound();

  const score = (thread.upvotes ?? 0) - (thread.downvotes ?? 0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link
        href="/komunitas"
        className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline mb-4"
      >
        <ChevronLeft size={14} aria-hidden /> Kembali ke Komunitas
      </Link>

      <article className="rounded-jw-xl border border-jw-line bg-white p-6 md:p-8 mb-6">
        <header className="flex items-start gap-4 mb-4">
          <VoteArrows threadId={thread.id} initialScore={score} />
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-jw-blue leading-snug">
              {thread.title}
            </h1>
            <p className="text-sm text-jw-muted mt-2">
              <span className="font-semibold text-jw-blue">{thread.author_name ?? 'Anonim'}</span>
              {thread.chapter_name && <> · {thread.chapter_name}</>}
              <> · {formatRelative(thread.created_at)}</>
            </p>
          </div>
          <RingkasNalaButton threadTitle={thread.title} />
        </header>

        <ThreadBody body={thread.body ?? ''} />
      </article>

      <section className="mb-6">
        <h2 className="font-display text-xl font-semibold text-jw-blue mb-4">
          {(replies?.length ?? 0)} balasan
        </h2>
        <ReplyTree replies={replies ?? []} />
      </section>

      <ReplyForm threadId={thread.id} />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('threads_with_author').select('title').eq('id', id).maybeSingle();
  return {
    title: `${data?.title ?? 'Thread'} — Komunitas Jubir Warga`,
  };
}
```

### 8. ThreadBody, ReplyTree, ReplyRow, ReplyForm, RingkasNalaButton

**`thread-body.tsx`** (Server) — split paragraph + bold inline rendering (mirror NalaMessageBubble pattern):

```tsx
export function ThreadBody({ body }: { body: string }) {
  const paragraphs = body.split('\n\n').filter(Boolean);
  return (
    <div className="prose-content space-y-4 text-jw-ink leading-relaxed">
      {paragraphs.map((p, i) => (
        <p key={i} className="whitespace-pre-wrap">
          {renderInline(p)}
        </p>
      ))}
    </div>
  );
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
```

**`reply-tree.tsx`** (Server) — flat list (Sprint 3 scope, nested tree defer Sprint 4):

```tsx
import type { Database } from '@jw/data/types';
import { ReplyRow } from './reply-row';

type ThreadReply = Database['public']['Tables']['thread_replies']['Row'];

export function ReplyTree({ replies }: { replies: ThreadReply[] }) {
  if (replies.length === 0) {
    return (
      <p className="text-sm text-jw-muted italic">
        Belum ada balasan. Jadi yang pertama nimbrung.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {replies.map((r) => (
        <ReplyRow key={r.id} reply={r} />
      ))}
    </div>
  );
}
```

**`reply-row.tsx`** (Server):

```tsx
import { formatRelative } from '@/lib/format';
import type { Database } from '@jw/data/types';

type ThreadReply = Database['public']['Tables']['thread_replies']['Row'];

export function ReplyRow({ reply }: { reply: ThreadReply }) {
  return (
    <article className="rounded-jw-md border border-jw-line bg-white p-4">
      <p className="text-xs text-jw-muted mb-2">{formatRelative(reply.created_at)}</p>
      <p className="text-sm text-jw-ink whitespace-pre-wrap">{reply.body}</p>
    </article>
  );
}
```

**`reply-form.tsx`** (Client) — dengan useActionState:

```tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitReplyAction, type ActionResult } from '../actions';

type Props = {
  threadId: string;
};

export function ReplyForm({ threadId }: Props) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    submitReplyAction,
    null,
  );

  return (
    <form action={formAction} className="rounded-jw-lg border border-jw-line bg-white p-4">
      <input type="hidden" name="threadId" value={threadId} />
      <label htmlFor="body" className="block text-sm font-semibold text-jw-blue mb-2">
        Tulis balasan
      </label>
      <textarea
        id="body"
        name="body"
        rows={4}
        placeholder="Tambahin pemikiranmu, pertanyaan, atau pengalaman..."
        className="w-full rounded-jw-md border border-jw-line bg-jw-cream/40 p-3 text-sm text-jw-ink resize-y outline-none focus:border-jw-coral"
      />
      {state?.ok === false && (
        <div className="mt-2 text-xs text-jw-pill-coral-text bg-jw-pill-coral-bg rounded-jw-sm px-2 py-1">
          {state.error}
          {state.fieldErrors?.body && <> · {state.fieldErrors.body.join(', ')}</>}
        </div>
      )}
      {state?.ok === true && (
        <div className="mt-2 text-xs text-jw-mint">Balasan terkirim. Terima kasih!</div>
      )}
      <div className="mt-3 flex items-center justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-jw-md bg-jw-coral px-4 py-2 text-sm font-semibold text-white hover:bg-jw-coral/90 disabled:opacity-50"
    >
      {pending ? 'Mengirim...' : 'Kirim balasan'}
    </button>
  );
}
```

**`ringkas-nala-button.tsx`** (Client):

```tsx
'use client';

import { Sparkles } from 'lucide-react';
import { useNalaStore } from '@/lib/nala/store';

export function RingkasNalaButton({ threadTitle }: { threadTitle: string }) {
  const openPanel = useNalaStore((s) => s.openPanel);
  const addMessage = useNalaStore((s) => s.addMessage);

  const handle = () => {
    openPanel(`thread "${threadTitle}"`);
    addMessage({ role: 'user', content: `Ringkas thread ini buat aku: "${threadTitle}"` });
  };

  return (
    <button
      type="button"
      onClick={handle}
      title="Ringkas thread ini via Nala"
      className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-jw-md border border-jw-coral bg-jw-pill-coral-bg/60 px-3 py-1.5 text-xs font-semibold text-jw-coral hover:bg-jw-pill-coral-bg transition"
    >
      <Sparkles size={12} aria-hidden />
      Ringkas via Nala
    </button>
  );
}
```

### 9. Tests (3 baru)

**`apps/web/src/__tests__/komunitas-filters.test.ts`:**

```ts
import { describe, it, expect } from 'vitest';
import { parseFilterFromSearchParams, buildFilterUrl, toggleFilter } from '@/lib/komunitas/filters';

describe('parseFilterFromSearchParams', () => {
  it('parses valid topic + chapter + format + hot', () => {
    const f = parseFilterFromSearchParams({
      topic: 'politik',
      chapter: 'jakarta',
      format: 'diskusi',
      hot: 'true',
      page: '2',
    });
    expect(f).toEqual({ topic: 'politik', chapter: 'jakarta', format: 'diskusi', hot: true, page: 2 });
  });
  it('ignores invalid values', () => {
    const f = parseFilterFromSearchParams({ topic: 'invalid', chapter: 'mars' });
    expect(f).toEqual({});
  });
});

describe('buildFilterUrl', () => {
  it('returns base URL when filter empty', () => {
    expect(buildFilterUrl({})).toBe('/komunitas');
  });
  it('builds query string with all filters', () => {
    const url = buildFilterUrl({ topic: 'politik', hot: true, page: 2 });
    expect(url).toContain('topic=politik');
    expect(url).toContain('hot=true');
    expect(url).toContain('page=2');
  });
});

describe('toggleFilter', () => {
  it('sets value when key is empty', () => {
    expect(toggleFilter({}, 'topic', 'politik')).toEqual({ topic: 'politik' });
  });
  it('unsets value when same value passed', () => {
    expect(toggleFilter({ topic: 'politik' }, 'topic', 'politik')).toEqual({});
  });
  it('resets page on filter change', () => {
    const result = toggleFilter({ topic: 'politik', page: 3 }, 'chapter', 'jakarta');
    expect(result.page).toBeUndefined();
  });
});
```

**`vote-arrows.test.tsx`** — render + click optimistic + revert mock.
**`reply-form.test.tsx`** — render + submit + validation error display.

(Skeleton mirip pattern Spec #6.5 lib-nala-store + nala-panel test.)

---

## Acceptance checklist

- [ ] `/komunitas` render dengan filter sidebar + thread list + sub-komunitas + chapter section
- [ ] Sidebar filter clickable: klik topik → URL update `?topic=politik`, list re-render
- [ ] Klik filter yang sama 2x → unset (toggle behavior)
- [ ] Reset filter button visible ketika ada filter aktif
- [ ] "Lagi panas" toggle filter `hot=true`
- [ ] Pagination jalan: page 2 dari list count > 20
- [ ] Empty state render kalau filter return 0 thread (illustration + reset link)
- [ ] Vote arrows: anonymous → klik → redirect `/masuk?redirect=/komunitas/<id>`
- [ ] Vote arrows: logged in → klik → optimistic UI update, persist ke DB
- [ ] Vote arrows: klik 2x → unvote (toggle)
- [ ] `/komunitas/[id]` render thread body dengan markdown bold
- [ ] Reply tree render existing replies (kalau ada)
- [ ] Reply form: submit empty → error "minimal 2 karakter"
- [ ] Reply form: submit valid → "Balasan terkirim. Terima kasih!"
- [ ] Reply form: anonymous → submit → redirect login
- [ ] "Ringkas via Nala" button → open NalaPanel dengan context "thread <title>" + auto-add user message
- [ ] Header nav "Komunitas" link jalan
- [ ] Beranda `<ThreadList>` "Mulai diskusi pertama" link ke `/komunitas`
- [ ] `pnpm test` pass dengan 3 test baru (komunitas-filters, vote-arrows, reply-form)
- [ ] `pnpm typecheck` pass dengan 0 errors
- [ ] `pnpm lint` pass dengan 0 new warnings
- [ ] Mobile responsive 320-1440px tanpa overflow
- [ ] Accessibility: vote button ada aria-label, form ada label, link punya text

## Out of scope (defer ke Sprint 4+)

- ❌ Realtime subscription (vote count live update) — Sprint 4
- ❌ Reply tree nested (parent_id threading > 1 level) — Sprint 4
- ❌ Reply edit/delete — Sprint 4
- ❌ Thread submit page `/komunitas/baru` — bisa di-include di spec ini kalau sempat, atau split ke Spec #7c
- ❌ Sub-komunitas DB + admin CRUD — Sprint 5
- ❌ Live event format detail page — Sprint 4
- ❌ Polling format detail page — Sprint 5 (atau gabung Aksi #10)

## Notes untuk planner audit

Aku akan audit:
- Server/Client split sesuai (no 'use client' di file yang gak butuh hook/event)
- Auth gate consistent (vote, reply, submit thread → redirect login)
- URL searchParams pattern shareable + back-button friendly
- Optimistic UI: revert on server error
- Brand voice di empty state + error message
- Type safety: no `any`, generated Database type used
- Test coverage minimal 3 file baru, total project test count >= 26

## Commit message

```
feat(komunitas): port Index + ThreadDetail with sidebar filter, vote, reply

- /komunitas — Server Component, sidebar 3-tier filter (topik/lokasi/format) +
  hot toggle, pagination URL-based, thread row dengan vote arrows
- /komunitas/[id] — ThreadDetail + reply tree + reply form (Zod-validated
  Server Action) + "Ringkas via Nala" trigger
- Sub-komunitas section: 3 hard-coded constant (DB migrate Sprint 5 per spec)
- Chapter regional section: pull dari chapters table
- Vote/reply auth gate: anonymous → redirect /masuk?redirect=...
- Optimistic UI di VoteArrows dengan revert on error
- 3 test baru: filters parser, vote-arrows render, reply-form validation
- Per Spec #7 + decisions Mas (Server+Client split, login required, hard-code
  sub-komunitas)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

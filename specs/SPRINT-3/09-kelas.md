# Spec #9 — Kelas page (Index + Detail + LessonPlayer MVP)

**Sprint**: 3
**Owner**: Claude Code (executor) · audited oleh planner
**Estimasi**: 3-4 jam
**Dependency**: Spec #6 (typegen), Spec #6.5 (test foundation), Spec #7 (Komunitas pattern), Spec #8 (Karya pattern)
**Decisions Mas (approved 2026-05-01):**
1. ✅ Pricing display: harga Rp ditampilkan **di-coret (strikethrough)** + badge coral **"FREE selama beta & alpha"** + small note "Gratis selamanya untuk pengguna awal"
2. ✅ Enrollment flow: Login required + simple enroll button (DB insert ke `kelas_enrollment`). Payment integration Sprint 6+
3. ✅ LessonPlayer Sprint 3 = MVP: layout + markdown body + progress bar + "Tandai selesai" + next/prev. Quiz/video player/games/videocall = Sprint 4-5

**Vision Kelas full (per Mas requirement, di-split per sprint):**
- Sprint 3 (THIS SPEC): MVP catalog + detail + lesson player markdown
- Sprint 4: pre-test + post-test quiz, video player embed, games infrastructure, certificate generation
- Sprint 5: live videocall (rekomendasi Daily.co), recording archive, deeper games
- Sprint 6+: pricing tier, payment Midtrans, monetization

**Required reading sebelum mulai:**
1. `CLAUDE.md` — operating manual
2. `apps/legacy/src/pages/kelas/Index.jsx` — Phase 1 reference (KELAS_DATA, MENTORS, TESTIMONI sections)
3. `apps/legacy/src/pages/kelas/LessonPlayer.jsx` — Phase 1 reference (transcript timestamped, quiz format) — **catatan: transcript + quiz fitur defer Sprint 4, jangan port full**
4. `specs/SPRINT-3/07-komunitas.md` + `08-karya.md` — pattern Server+Client split + filter URL yang sudah established
5. `apps/web/src/app/karya/page.tsx` — implementation reference Spec #8
6. `packages/data/src/queries.ts` line 240+ — `listKelas`, `getKelas`, `getKelasModul`, `enrollKelas`, `updateKelasProgress`
7. `packages/data/src/types.ts` — `Kelas`, `KelasModul`, `KelasEnrollment`, `KelasLevel`, `ModulType`
8. `docs/EVALUATION_PHASE1_VS_PHASE2_2026-05-01.md` Section B4 — Phase 1 anti-pattern di Kelas (kata "civic" wajib di-fix saat port)

---

## Goal

Port halaman Kelas dari Phase 1 ke Phase 2 dengan:
- **Index page** (`/kelas`) — catalog kelas dengan featured highlight + filter level (Pemula/Menengah/Lanjut), Mentor section, Testimoni section
- **Detail page** (`/kelas/[id]`) — hero kelas, about, silabus (modul list), enroll button (login gate), my-progress untuk enrolled user
- **LessonPlayer page** (`/kelas/[id]/modul/[modulId]`) — module body (markdown dari `transcript` field), progress bar visual, "Tandai selesai" button, next/prev navigation antar modul

Setelah spec ini selesai:
- Header nav "Kelas" jalan (gak 404)
- User bisa enroll kelas (DB insert kelas_enrollment)
- Enrolled user bisa progress through modul, mark-as-complete, lihat progress %
- Foundation infrastructure siap untuk extend Sprint 4 (component slot per modul untuk render markdown OR quiz OR video OR game)

## Konteks

Kelas adalah surface yang paling **aspirational** di Phase 1 — vision "dari Resah, ke Suara, ke Aksi" via 6-minggu intensif. MVP Sprint 3 fokus delivery foundation yang functional + extensible. Pre-test/post-test/video/games/videocall = Sprint 4-5 (sudah dicatat di BACKLOG).

🚨 **Anti-pattern Phase 1 yang HARUS di-fix saat port:**
- Subtitle "Belajar **civic** & ekspresi yang nyata-nyata kepake" → ganti **"Belajar dari sesama, eksekusi yang nyata-nyata kepake"** (kata "civic" dilarang per CLAUDE.md)

## File yang dibuat

```
apps/web/src/app/kelas/
├── page.tsx                            Index — Server Component
├── kelas-filters.tsx                   Client — filter level (3 chip)
├── kelas-card.tsx                      Server — single card (cover + level + duration + mentor + harga FREE strikethrough)
├── featured-hero.tsx                   Server — featured kelas big card
├── mentor-section.tsx                  Server — list mentor (top kreator pattern)
└── [id]/
    ├── page.tsx                        Detail — Server Component
    ├── enroll-button.tsx               Client — enroll action (auth gate)
    ├── silabus-list.tsx                Server — list modul dengan status (locked/unlocked/done)
    └── modul/
        └── [modulId]/
            ├── page.tsx                LessonPlayer — Server Component
            ├── module-body.tsx         Server — render transcript sebagai markdown
            ├── module-progress-button.tsx  Client — "Tandai selesai" Server Action
            └── module-nav.tsx          Server — prev/next navigation

apps/web/src/lib/kelas/
├── constants.ts                        LEVEL_OPTIONS (3) + MODUL_TYPE_LABEL
└── filters.ts                          parseKelasFilter + buildKelasUrl

apps/web/src/app/kelas/
└── actions.ts                          Server Actions: enrollKelasAction, markModulCompleteAction
                                        (Zod-validated, auth gate redirect to /masuk)

apps/web/src/__tests__/
├── kelas-filters.test.ts               Test filter parser
├── kelas-card.test.tsx                 Test pricing strikethrough + FREE badge
└── module-progress.test.tsx            Test mark-complete + progress calc
```

## File yang diubah

```
apps/web/src/components/site-header.tsx
  — Verify nav "Kelas" href={'/kelas'} match (mungkin sudah benar)
```

## File yang TIDAK boleh diubah

- `apps/legacy/*` — Phase 1 freeze
- `packages/data/src/queries.ts` — pattern queries existing
- Schema migrations — out of scope (kalau perlu field baru di kelas_modul, defer Sprint 4)

---

## Step-by-step

### 1. Constants & filters

**`apps/web/src/lib/kelas/constants.ts`:**

```ts
import type { KelasLevel, ModulType } from '@jw/data/types';

export const LEVEL_OPTIONS: { id: KelasLevel; label: string; color: string }[] = [
  { id: 'Pemula',   label: 'Pemula',   color: 'mint'     },
  { id: 'Menengah', label: 'Menengah', color: 'marigold' },
  { id: 'Lanjut',   label: 'Lanjut',   color: 'coral'    },
];

export const MODUL_TYPE_LABEL: Record<ModulType, string> = {
  video:    'Video',
  workshop: 'Workshop',
  capstone: 'Capstone',
  reading:  'Bacaan',
};

/**
 * Sprint 3 MVP: ALL kelas FREE selama beta & alpha (decision Mas 2026-05-01).
 * Sprint 6+ akan introduce pricing tier + payment Midtrans.
 */
export const BETA_PRICING_NOTE = 'Gratis selamanya untuk pengguna awal';
```

**`apps/web/src/lib/kelas/filters.ts`:**

```ts
import type { KelasLevel } from '@jw/data/types';
import { LEVEL_OPTIONS } from './constants';

export type KelasFilter = {
  level?: KelasLevel;
};

const VALID_LEVELS = new Set(LEVEL_OPTIONS.map((o) => o.id));

export function parseKelasFilter(
  params: Record<string, string | string[] | undefined>,
): KelasFilter {
  const level = typeof params.level === 'string' ? params.level : undefined;
  if (level && VALID_LEVELS.has(level as KelasLevel)) {
    return { level: level as KelasLevel };
  }
  return {};
}

export function buildKelasUrl(filter: KelasFilter): string {
  if (!filter.level) return '/kelas';
  return `/kelas?level=${filter.level}`;
}

export function toggleKelasLevel(
  current: KelasFilter,
  level: KelasLevel | undefined,
): KelasFilter {
  if (level === undefined || current.level === level) return {};
  return { level };
}
```

### 2. Server Actions

**`apps/web/src/app/kelas/actions.ts`:**

```ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const enrollSchema = z.object({
  kelasId: z.string().uuid(),
});

const markCompleteSchema = z.object({
  kelasId: z.string().uuid(),
  modulId: z.string().uuid(),
  totalModul: z.coerce.number().int().min(1),
  completedModul: z.coerce.number().int().min(0),
});

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function enrollKelasAction(formData: FormData): Promise<ActionResult> {
  const parsed = enrollSchema.safeParse({ kelasId: formData.get('kelasId') });
  if (!parsed.success) return { ok: false, error: 'Input tidak valid' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/masuk?redirect=/kelas/${parsed.data.kelasId}`);
  }

  // Check kalau udah enrolled
  const { data: existing } = await supabase
    .from('kelas_enrollment')
    .select('kelas_id')
    .match({ kelas_id: parsed.data.kelasId, user_id: user.id })
    .maybeSingle();

  if (existing) {
    return { ok: true }; // idempotent
  }

  const { error } = await supabase
    .from('kelas_enrollment')
    .insert({ kelas_id: parsed.data.kelasId, user_id: user.id, progress: 0 });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/kelas/${parsed.data.kelasId}`);
  return { ok: true };
}

export async function markModulCompleteAction(formData: FormData): Promise<ActionResult> {
  const parsed = markCompleteSchema.safeParse({
    kelasId: formData.get('kelasId'),
    modulId: formData.get('modulId'),
    totalModul: formData.get('totalModul'),
    completedModul: formData.get('completedModul'),
  });
  if (!parsed.success) return { ok: false, error: 'Input tidak valid' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/masuk?redirect=/kelas/${parsed.data.kelasId}/modul/${parsed.data.modulId}`);
  }

  const newProgress = Math.min(
    100,
    Math.round(((parsed.data.completedModul + 1) / parsed.data.totalModul) * 100),
  );

  const { error } = await supabase
    .from('kelas_enrollment')
    .update({
      progress: newProgress,
      ...(newProgress >= 100 ? { completed_at: new Date().toISOString() } : {}),
    })
    .match({ kelas_id: parsed.data.kelasId, user_id: user.id });

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/kelas/${parsed.data.kelasId}/modul/${parsed.data.modulId}`);
  revalidatePath(`/kelas/${parsed.data.kelasId}`);
  return { ok: true };
}
```

> **NOTE Claude Code:** Mark-as-complete pattern di Sprint 3 sederhana — increment counter dari client. Sprint 4 pas tambah quiz, refactor jadi DB-tracked completion record per modul (table baru `kelas_modul_completion` kalau perlu). Comment di file: `// TODO Sprint 4: refactor ke modul-level completion table dengan quiz score`.

### 3. Index page

**`apps/web/src/app/kelas/page.tsx`:**

```tsx
import { createClient } from '@/lib/supabase/server';
import { parseKelasFilter } from '@/lib/kelas/filters';
import { KelasFilters } from './kelas-filters';
import { KelasCard } from './kelas-card';
import { FeaturedHero } from './featured-hero';
import { MentorSection } from './mentor-section';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function KelasPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const filter = parseKelasFilter(sp);

  const supabase = await createClient();

  // Featured kelas (utama, ditampilin gede di hero)
  const { data: featured } = await supabase
    .from('kelas')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // List kelas (skip featured kalau ada)
  let q = supabase
    .from('kelas')
    .select('*')
    .order('participant_count', { ascending: false });
  if (filter.level) q = q.eq('level', filter.level);
  if (featured) q = q.neq('id', featured.id);

  const { data: kelasList, error } = await q;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <header className="mb-8 border-b border-jw-line pb-6">
        <span className="font-hand text-jw-coral text-base">— belajar bareng</span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-jw-blue leading-tight">
          Kelas
        </h1>
        <p className="text-base md:text-lg text-jw-ink/70 mt-2 max-w-xl">
          Belajar dari sesama, eksekusi yang nyata-nyata kepake.
        </p>
      </header>

      {featured && <FeaturedHero kelas={featured} className="mb-10" />}

      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <h2 className="font-display text-xl font-semibold text-jw-blue">
          Semua kelas
          {kelasList && (
            <span className="ml-2 text-sm font-normal text-jw-muted">({kelasList.length})</span>
          )}
        </h2>
        <KelasFilters currentLevel={filter.level} />
      </div>

      {error ? (
        <div className="rounded-jw-lg bg-jw-pill-coral-bg border border-jw-coral/30 p-4 text-sm text-jw-pill-coral-text">
          Gagal memuat kelas: {error.message}
        </div>
      ) : !kelasList || kelasList.length === 0 ? (
        <div className="rounded-jw-lg border border-dashed border-jw-line p-10 text-center">
          <p className="font-hand text-xl text-jw-coral">— belum ada kelas {filter.level ?? ''}</p>
          <p className="text-sm text-jw-muted mt-2">Kelas baru akan ditambah selama beta.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kelasList.map((k) => (
            <KelasCard key={k.id} kelas={k} />
          ))}
        </div>
      )}

      <MentorSection className="mt-16" />

      <NalaTriggerButton context="tentang Kelas" />
    </div>
  );
}

export const metadata = {
  title: 'Kelas — Jubir Warga',
  description: 'Belajar dari sesama, eksekusi yang nyata-nyata kepake.',
};
```

### 4. KelasFilters (Client)

```tsx
'use client';

import { useRouter } from 'next/navigation';
import type { KelasLevel } from '@jw/data/types';
import { LEVEL_OPTIONS } from '@/lib/kelas/constants';
import { buildKelasUrl, toggleKelasLevel } from '@/lib/kelas/filters';

export function KelasFilters({ currentLevel }: { currentLevel: KelasLevel | undefined }) {
  const router = useRouter();

  const onSelect = (level: KelasLevel | undefined) => {
    router.push(buildKelasUrl(toggleKelasLevel({ level: currentLevel }, level)));
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onSelect(undefined)}
        className={`rounded-jw-md px-3 py-1.5 text-sm font-semibold transition ${
          !currentLevel ? 'bg-jw-blue text-white' : 'text-jw-ink hover:bg-jw-line/40'
        }`}
      >
        Semua
      </button>
      {LEVEL_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onSelect(opt.id)}
          className={`rounded-jw-md px-3 py-1.5 text-sm font-semibold transition ${
            currentLevel === opt.id ? 'bg-jw-blue text-white' : 'text-jw-ink hover:bg-jw-line/40'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
```

### 5. KelasCard (Server) — pricing FREE display pattern

```tsx
import Link from 'next/link';
import type { Kelas } from '@jw/data/types';
import { Clock, Users } from 'lucide-react';
import { LEVEL_OPTIONS, BETA_PRICING_NOTE } from '@/lib/kelas/constants';

const LEVEL_PILL: Record<string, string> = {
  mint:     'bg-jw-pill-mint-bg text-jw-mint',
  marigold: 'bg-jw-pill-marigold-bg text-jw-marigold',
  coral:    'bg-jw-pill-coral-bg text-jw-pill-coral-text',
};

export function KelasCard({ kelas }: { kelas: Kelas }) {
  const levelOpt = LEVEL_OPTIONS.find((l) => l.id === kelas.level);

  return (
    <Link
      href={`/kelas/${kelas.id}`}
      className="group rounded-jw-lg border border-jw-line bg-white p-5 hover:border-jw-blue-soft/40 transition flex flex-col"
    >
      <div className="flex items-center gap-2 mb-3">
        {levelOpt && (
          <span className={`inline-flex rounded-jw-sm px-2 py-0.5 text-xs font-semibold ${LEVEL_PILL[levelOpt.color]}`}>
            {levelOpt.label}
          </span>
        )}
        {kelas.featured && (
          <span className="inline-flex rounded-jw-sm px-2 py-0.5 text-xs font-semibold bg-jw-pill-blue-bg text-jw-blue">
            Unggulan
          </span>
        )}
      </div>

      <h3 className="font-display text-lg font-semibold text-jw-blue leading-snug group-hover:underline">
        {kelas.title}
      </h3>

      {kelas.description && (
        <p className="text-sm text-jw-ink/70 mt-2 line-clamp-2">{kelas.description}</p>
      )}

      <div className="mt-3 flex items-center gap-3 text-xs text-jw-muted flex-wrap">
        {kelas.duration && (
          <span className="inline-flex items-center gap-1">
            <Clock size={11} aria-hidden /> {kelas.duration}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Users size={11} aria-hidden /> {kelas.participant_count} peserta
        </span>
      </div>

      <div className="mt-auto pt-4 flex items-baseline justify-between">
        <div>
          {kelas.price_idr > 0 && (
            <span className="text-xs text-jw-muted line-through mr-2">
              Rp {kelas.price_idr.toLocaleString('id-ID')}
            </span>
          )}
          <span className="rounded-jw-sm bg-jw-coral text-white px-2 py-0.5 text-xs font-bold">
            FREE selama beta
          </span>
        </div>
      </div>
      <p className="text-[10px] text-jw-muted italic mt-1">{BETA_PRICING_NOTE}</p>
    </Link>
  );
}
```

### 6. FeaturedHero (Server) — big card biru utama

```tsx
import Link from 'next/link';
import type { Kelas } from '@jw/data/types';
import { ArrowRight, Award, Clock, Users } from 'lucide-react';
import { BETA_PRICING_NOTE } from '@/lib/kelas/constants';

export function FeaturedHero({ kelas, className }: { kelas: Kelas; className?: string }) {
  return (
    <section className={`rounded-jw-xl bg-jw-blue text-jw-cream p-6 md:p-8 ${className ?? ''}`}>
      <span className="inline-block rounded-jw-sm bg-jw-marigold/20 text-jw-marigold text-xs font-bold px-2 py-0.5 mb-3">
        KELAS UNGGULAN
      </span>
      <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight">
        {kelas.title.split(':')[0]}
        {kelas.title.includes(':') && (
          <em className="block text-xl md:text-2xl mt-1 opacity-80">
            {kelas.title.split(':').slice(1).join(':').trim()}
          </em>
        )}
      </h2>

      {kelas.description && (
        <p className="mt-4 text-sm md:text-base opacity-90 max-w-2xl">
          {kelas.description}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
        {kelas.duration && (
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} aria-hidden /> {kelas.duration}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <Award size={14} aria-hidden /> Sertifikat
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users size={14} aria-hidden /> {kelas.participant_count} peserta
        </span>
      </div>

      <div className="mt-6 flex items-center gap-3 flex-wrap">
        <Link
          href={`/kelas/${kelas.id}`}
          className="inline-flex items-center gap-1.5 rounded-jw-md bg-jw-coral text-white px-5 py-2.5 text-sm font-semibold hover:bg-jw-coral/90 transition"
        >
          Daftar gratis <ArrowRight size={14} aria-hidden />
        </Link>
        <Link
          href={`/kelas/${kelas.id}#silabus`}
          className="inline-flex items-center rounded-jw-md border border-jw-cream/40 px-5 py-2.5 text-sm font-semibold hover:bg-jw-cream/10 transition"
        >
          Lihat silabus
        </Link>
        {kelas.price_idr > 0 && (
          <span className="text-xs opacity-70">
            <span className="line-through">Rp {kelas.price_idr.toLocaleString('id-ID')}</span> · {BETA_PRICING_NOTE}
          </span>
        )}
      </div>
    </section>
  );
}
```

### 7. MentorSection (Server)

```tsx
import { createClient } from '@/lib/supabase/server';

export async function MentorSection({ className }: { className?: string }) {
  const supabase = await createClient();
  // Sprint 3: pull profiles dengan flag is_admin (proxy untuk mentor sampai ada role-based table Sprint 5)
  const { data: mentors } = await supabase
    .from('profiles')
    .select('id, name, username, bio, level, chapter_id')
    .eq('is_admin', true)
    .limit(6);

  if (!mentors || mentors.length === 0) return null;

  return (
    <section className={className ?? ''}>
      <header className="mb-4">
        <span className="font-hand text-jw-coral text-base">— mentor</span>
        <h2 className="font-display text-2xl font-bold text-jw-blue">
          Belajar dari yang sudah jalan
        </h2>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mentors.map((m) => (
          <article key={m.id} className="rounded-jw-lg border border-jw-line bg-white p-4">
            <h3 className="font-display font-semibold text-jw-blue">{m.name ?? m.username}</h3>
            <p className="text-xs text-jw-muted">Level {m.level} · {m.chapter_id ?? '—'}</p>
            {m.bio && <p className="text-sm text-jw-ink/70 mt-2 line-clamp-3">{m.bio}</p>}
          </article>
        ))}
      </div>
      <p className="mt-3 text-xs text-jw-muted italic">
        Mentor table dedicated Sprint 5 — sekarang pakai profiles.is_admin sebagai proxy.
      </p>
    </section>
  );
}
```

### 8. Detail page

**`apps/web/src/app/kelas/[id]/page.tsx`:**

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Award, Clock, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { EnrollButton } from './enroll-button';
import { SilabusList } from './silabus-list';
import { BETA_PRICING_NOTE, LEVEL_OPTIONS } from '@/lib/kelas/constants';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';

export default async function KelasDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: kelas }, { data: modulList }, { data: { user } }] = await Promise.all([
    supabase.from('kelas').select('*').eq('id', id).maybeSingle(),
    supabase.from('kelas_modul').select('*').eq('kelas_id', id).order('ord'),
    supabase.auth.getUser(),
  ]);

  if (!kelas) notFound();

  let enrollment = null;
  if (user) {
    const { data } = await supabase
      .from('kelas_enrollment')
      .select('*')
      .match({ kelas_id: id, user_id: user.id })
      .maybeSingle();
    enrollment = data;
  }

  const levelOpt = LEVEL_OPTIONS.find((l) => l.id === kelas.level);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Link
        href="/kelas"
        className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline mb-4"
      >
        <ChevronLeft size={14} aria-hidden /> Kembali ke Kelas
      </Link>

      <header className="rounded-jw-xl bg-jw-blue text-jw-cream p-6 md:p-8 mb-8">
        {levelOpt && (
          <span className="inline-block rounded-jw-sm bg-jw-cream/15 text-jw-cream text-xs font-semibold px-2 py-0.5 mb-3">
            {levelOpt.label}
          </span>
        )}
        <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight">
          {kelas.title}
        </h1>
        {kelas.description && (
          <p className="mt-3 text-sm md:text-base opacity-90 max-w-2xl">
            {kelas.description}
          </p>
        )}
        <div className="mt-5 flex items-center gap-4 text-sm flex-wrap">
          {kelas.duration && (
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} aria-hidden /> {kelas.duration}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Award size={14} aria-hidden /> Sertifikat
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={14} aria-hidden /> {kelas.participant_count} peserta
          </span>
        </div>
        <div className="mt-6">
          <EnrollButton kelasId={kelas.id} alreadyEnrolled={!!enrollment} progress={enrollment?.progress ?? 0} />
          {kelas.price_idr > 0 && (
            <p className="text-xs opacity-70 mt-3">
              <span className="line-through">Rp {kelas.price_idr.toLocaleString('id-ID')}</span> · {BETA_PRICING_NOTE}
            </p>
          )}
        </div>
      </header>

      <section id="silabus">
        <h2 className="font-display text-2xl font-bold text-jw-blue mb-4">Silabus</h2>
        <SilabusList
          kelasId={kelas.id}
          modulList={modulList ?? []}
          enrolled={!!enrollment}
          progress={enrollment?.progress ?? 0}
        />
      </section>

      <NalaTriggerButton context={`kelas "${kelas.title}"`} />
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
  const { data } = await supabase.from('kelas').select('title').eq('id', id).maybeSingle();
  return { title: `${data?.title ?? 'Kelas'} — Kelas Jubir Warga` };
}
```

### 9. EnrollButton (Client)

```tsx
'use client';

import { useTransition } from 'react';
import { enrollKelasAction } from '../actions';
import Link from 'next/link';

export function EnrollButton({
  kelasId,
  alreadyEnrolled,
  progress,
}: {
  kelasId: string;
  alreadyEnrolled: boolean;
  progress: number;
}) {
  const [pending, startTransition] = useTransition();

  if (alreadyEnrolled) {
    return (
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href="#silabus"
          className="inline-flex items-center gap-1.5 rounded-jw-md bg-jw-coral text-white px-5 py-2.5 text-sm font-semibold hover:bg-jw-coral/90"
        >
          Lanjutkan ({progress}%)
        </Link>
        {progress >= 100 && (
          <span className="text-xs font-semibold text-jw-mint bg-jw-pill-mint-bg px-2 py-0.5 rounded-jw-sm">
            ✓ Selesai
          </span>
        )}
      </div>
    );
  }

  const handle = () => {
    if (pending) return;
    const fd = new FormData();
    fd.set('kelasId', kelasId);
    startTransition(async () => {
      await enrollKelasAction(fd);
    });
  };

  return (
    <button
      type="button"
      onClick={handle}
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-jw-md bg-jw-coral text-white px-5 py-2.5 text-sm font-semibold hover:bg-jw-coral/90 disabled:opacity-50 transition"
    >
      {pending ? 'Mendaftar...' : 'Daftar gratis →'}
    </button>
  );
}
```

### 10. SilabusList + LessonPlayer + ModuleProgressButton + ModuleNav

**`silabus-list.tsx`** (Server) — render modul list dengan Lock icon untuk non-enrolled, Check untuk completed.

**`[modulId]/page.tsx`** (LessonPlayer Server Component) — fetch kelas + modul + enrollment, render module-body dari `transcript` field as markdown subset (paragraph + ## h2 + > blockquote + **bold**, mirror ArticleBody dari Spec #8), tampil progress bar, mark-complete button (Client), prev/next nav.

**`module-body.tsx`** (Server) — kalau modul.video_url ada, render placeholder "🎥 Video player segera tersedia (Sprint 4)" + tampil transcript sebagai fallback. Kalau gak ada video_url, render transcript sebagai full markdown body.

**`module-progress-button.tsx`** (Client) — "Tandai sebagai selesai" button → call `markModulCompleteAction`.

**`module-nav.tsx`** (Server) — tombol Prev/Next berdasarkan posisi modul di sequence (kalau bukan first/last).

(Skeleton mengikuti pattern Spec #7 vote-arrows + Spec #8 article-body — Claude Code adapt sesuai data shape generated `KelasModul`).

### 11. Tests (3 baru)

**`kelas-filters.test.ts`** — test parser + URL builder + toggle.
**`kelas-card.test.tsx`** — test pricing strikethrough + FREE badge muncul.
**`module-progress.test.tsx`** — test progress percentage calculation: 0/4 = 0%, 1/4 = 25%, 4/4 = 100%, completed_at di-set saat 100%.

---

## Acceptance checklist

- [ ] `/kelas` render: header + Featured hero + filter level + grid kelas + Mentor section
- [ ] Tab "Semua / Pemula / Menengah / Lanjut" filter URL-shareable
- [ ] Empty state render kalau filter return 0 kelas
- [ ] Kelas card: pricing strikethrough + FREE badge + small note
- [ ] Featured hero: KELAS UNGGULAN badge + dual CTA "Daftar gratis" + "Lihat silabus" + Sertifikat icon
- [ ] `/kelas/[id]` render: hero biru + silabus list + enroll button (atau Lanjutkan kalau enrolled)
- [ ] Enroll button (anonymous): redirect `/masuk?redirect=/kelas/[id]`
- [ ] Enroll button (logged in): insert kelas_enrollment + button berubah jadi "Lanjutkan (0%)"
- [ ] Re-enroll idempotent (gak duplicate row)
- [ ] `/kelas/[id]/modul/[modulId]` render: module body markdown + progress bar + Tandai Selesai + Prev/Next
- [ ] Modul dengan video_url: placeholder "Video player Sprint 4" + transcript fallback
- [ ] Mark-as-complete: increment progress + redirect ke modul berikutnya (atau detail page kalau last)
- [ ] Progress 100% → completed_at terisi di DB
- [ ] Header nav "Kelas" link jalan
- [ ] Floating "Tanya Nala tentang kelas <title>" coral pill
- [ ] **Anti-pattern fixed: subtitle "Belajar dari sesama, eksekusi yang nyata-nyata kepake" (BUKAN "civic")**
- [ ] `pnpm test` pass dengan 3 test baru → total 61+
- [ ] `pnpm typecheck` pass dengan 0 errors
- [ ] `pnpm lint` pass dengan 0 new warnings
- [ ] Mobile responsive 320-1440px

## Out of scope (defer Sprint 4-5)

- ❌ Pre-test + Post-test quiz system — Sprint 4
- ❌ Video player full embed (YouTube/Vimeo/Bunny.net) dengan progress save — Sprint 4
- ❌ Module-level games infrastructure — Sprint 4
- ❌ Certificate generation (PDF) — Sprint 4
- ❌ Live videocall (Daily.co integration) — Sprint 5
- ❌ Recording archive — Sprint 5
- ❌ Mentor table dedicated + role-based — Sprint 5
- ❌ Pricing tier + Midtrans payment — Sprint 6+
- ❌ Cohort group + scheduled live session — Sprint 5

## Notes untuk planner audit

Aku akan audit:
- File structure 14 baru sesuai
- "civic" word DIHILANGKAN di copy
- Pricing strikethrough + FREE badge jalan di card + detail
- Enrollment auth gate consistent
- LessonPlayer module-body markdown render benar (paragraph + h2 + bold)
- Mark-complete idempotent (klik berkali gak nambah progress)
- Test count tambah 3 jadi 61+

## Commit message

```
feat(kelas): port Index + Detail + LessonPlayer MVP with enroll + progress

- /kelas — Server Component, filter level URL-shareable, FeaturedHero,
  KelasCard dengan pricing strikethrough + FREE badge, MentorSection
- /kelas/[id] — Detail dengan hero biru, silabus list, EnrollButton (auth gate),
  enrollment-aware "Lanjutkan (X%)" untuk enrolled user
- /kelas/[id]/modul/[modulId] — LessonPlayer MVP: module-body markdown
  (paragraph + ## h2 + > blockquote + **bold** dari transcript field),
  progress bar, Tandai Selesai (Server Action), prev/next nav
- Pricing: BETA_PRICING_NOTE = "Gratis selamanya untuk pengguna awal"
  + price_idr displayed strikethrough + FREE badge coral
- Anti-pattern fix: replace "civic" dengan "dari sesama, eksekusi nyata-nyata"
- 3 test baru: filters, kelas-card pricing, module-progress calc
- Sprint 4-5 deferred: pre/post-test quiz, video player, games, videocall
- Per Spec #9 + decisions Mas (FREE beta, simple enroll, MVP markdown only)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

## Update spec file ke commit

⚠️ **WAJIB include `specs/SPRINT-3/09-kelas.md` di staging commit:**

```bash
git add \
  apps/web/src/app/kelas/ \
  apps/web/src/lib/kelas/ \
  apps/web/src/__tests__/kelas-*.test.* \
  apps/web/src/__tests__/module-progress.test.tsx \
  specs/SPRINT-3/09-kelas.md
```

Jangan skip spec file (lesson learned dari Spec #8).

# Spec #11 — Tagih Janji page (Index + JanjiDetail + Submit)

**Sprint**: 3
**Owner**: Claude Code (executor) · audited oleh planner
**Estimasi**: 3-4 jam (most data-heavy spec Sprint 3)
**Dependency**: Spec #6 (typegen), Spec #6.5 (test foundation), pattern dari #7-#10
**Decisions Mas (approved 2026-05-01):**
1. ✅ Peta Indonesia: simple SVG static (5 provinsi colored by janji count). **JANGAN react-leaflet** — heavy library 100+ KB. Pakai SVG path Wikimedia (CC license). Sprint 4: tap-province → drilldown.
2. ✅ Dashboard partai: widget agregat di Index (count per status). Sprint 4 expand jadi `/tagih/partai/[id]`.
3. ✅ Submit janji: `/tagih/baru` form login required, status `'Belum'` (pending review). Admin moderation panel defer Sprint 4 — Sprint 3 cukup user submit, janji tampil dengan status pending di profil submitter.

**Required reading sebelum mulai:**
1. `CLAUDE.md` — operating manual + Section 5.4 + 5.4b (brand policy emoji)
2. `apps/legacy/src/pages/tagih/Index.jsx` — Phase 1 reference (12 dummy janji + STATUS_META + PARTAI + HeroTagihIllustration SVG yang bisa di-port)
3. `apps/legacy/src/pages/tagih/JanjiDetail.jsx` — Phase 1 detail
4. `apps/web/components/beranda/janji-tracker.tsx` — pattern Server view query yang udah established
5. `specs/SPRINT-3/07-10` — pattern Server+Client split + filter URL + auth gate
6. `packages/data/src/queries.ts` — `listJanji`, `getJanji`, `submitJanji`, `followJanji`, `unfollowJanji`, `getJanjiEvidence`, `listPejabat`, `getPejabat`
7. `packages/data/src/types.ts` — `Janji`, `JanjiWithPejabat`, `JanjiEvidence`, `JanjiStatus`, `Pejabat`
8. `packages/data/src/schemas.ts` — `submitJanjiSchema`

---

## Goal

Port halaman Tagih Janji dari Phase 1 ke Phase 2 dengan focus 4 surface:
- **Index** (`/tagih`) — hero + 4 stat cards + peta Indonesia SVG + dashboard partai widget + janji list dengan filter (status/level)
- **Detail** (`/tagih/[id]`) — full janji + status timeline + pejabat info + evidence list + follow button (login required) + share
- **Submit** (`/tagih/baru`) — form Zod-validated dengan pejabat autocomplete, topik, janji_text, sumber URL, deadline opsional

Setelah spec ini selesai:
- Beranda existing `<JanjiTracker>` link ke `/tagih` jalan
- Header nav "Tagih Janji" jalan
- User bisa pantau janji (follow), submit janji baru
- 4-tier status visual (Belum/Berjalan/Mandek/Ditepati/Diingkari) jelas
- Peta Indonesia interaktif minimal (5 provinsi, hover state)

## Konteks

Tagih Janji adalah **flagship feature differentiation** Jubir Warga vs platform lain (Twitter/Discord/Reddit gak punya ini). Dari evaluation report Section B6: paling kaya di Phase 1, perlu execution polished.

🚨 **Anti-pattern Phase 1 yang harus di-fix:**
- STATUS_META icon `✓ ↻ ⏸ ✕ ⌛` (unicode symbols) → REPLACE dengan Lucide (CheckCircle/Loader/Pause/XCircle/Clock) untuk konsistensi cross-OS
- Topik label tanpa emoji decor (Phase 1 udah text-only, OK)
- Hero illustration Phase 1 punya inline SVG bagus → PORT as-is dengan brand color tokens

---

## File yang dibuat

```
apps/web/src/app/tagih/
├── page.tsx                            Index — Server Component
├── tagih-hero.tsx                      Server — hero + illustration SVG (port dari Phase 1)
├── tagih-stats.tsx                     Server — 4 stat cards (total + per status %)
├── peta-indonesia.tsx                  Server — SVG static 5 provinsi colored by janji count
├── partai-dashboard.tsx                Server — widget agregat partai
├── janji-filters.tsx                   Client — filter status (5 chip) + level (3 chip)
├── janji-row.tsx                       Server — single janji row (pejabat + janji + status pill + pemantau count)
├── status-pill.tsx                     Server — Lucide icon + label per status (CheckCircle/Loader/Pause/XCircle/Clock)
└── [id]/
    ├── page.tsx                        Detail — Server
    ├── janji-body.tsx                  Server — render janji_text + topik
    ├── pejabat-card.tsx                Server — info pejabat (nama, jabatan, level, partai, foto)
    ├── status-timeline.tsx             Server — timeline status changes (Sprint 3 = current status only, history defer Sprint 4)
    ├── evidence-list.tsx               Server — list bukti (foto/dokumen/video/data/link)
    ├── follow-button.tsx               Client — pantau toggle (auth gate)
    └── share-buttons.tsx               Client — reuse pattern Spec #10 share

apps/web/src/app/tagih/baru/
├── page.tsx                            Submit form Server
└── janji-form.tsx                      Client — Zod-validated, useActionState

apps/web/src/lib/tagih/
├── constants.ts                        STATUS_META (Lucide icon mapping) + LEVEL_OPTIONS + PROVINSI_OPTIONS (5 awal)
└── filters.ts                          parseTagihFilter + buildTagihUrl

apps/web/src/app/tagih/
└── actions.ts                          Server Actions: followJanjiAction, submitJanjiAction (Zod)

apps/web/src/__tests__/
├── tagih-filters.test.ts               Test filter parser
├── status-pill.test.tsx                Test 5 status render dengan Lucide icon
└── tagih-stats.test.tsx                Test percent calc 4 stat cards
```

## File yang diubah

```
apps/web/src/components/site-header.tsx
  — Verify nav "Tagih Janji" href={'/tagih'} match
```

---

## Step-by-step (skeleton)

### 1. Constants & filter helpers

**`apps/web/src/lib/tagih/constants.ts`:**

```ts
import type { JanjiStatus, PejabatLevel } from '@jw/data/types';
import { CheckCircle, Loader, Pause, XCircle, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const STATUS_META: Record<JanjiStatus, {
  label: string;
  pillBg: string;
  pillText: string;
  icon: LucideIcon;
}> = {
  Ditepati:  { label: 'Ditepati',  pillBg: 'bg-jw-pill-mint-bg',     pillText: 'text-jw-mint',           icon: CheckCircle },
  Berjalan:  { label: 'Berjalan',  pillBg: 'bg-jw-pill-marigold-bg', pillText: 'text-jw-marigold',       icon: Loader      },
  Mandek:    { label: 'Mandek',    pillBg: 'bg-jw-pill-grey-bg',     pillText: 'text-jw-muted',          icon: Pause       },
  Diingkari: { label: 'Diingkari', pillBg: 'bg-jw-pill-coral-bg',    pillText: 'text-jw-pill-coral-text', icon: XCircle    },
  Belum:     { label: 'Belum',     pillBg: 'bg-jw-pill-blue-bg',     pillText: 'text-jw-blue',           icon: Clock       },
};

export const LEVEL_OPTIONS: { id: PejabatLevel; label: string }[] = [
  { id: 'Pusat',     label: 'Pusat'     },
  { id: 'Provinsi',  label: 'Provinsi'  },
  { id: 'Kota',      label: 'Kota/Kab.' },
];

/** 5 provinsi awal untuk peta MVP — Sprint 4 expand ke 38 provinsi. */
export const PROVINSI_OPTIONS = [
  { id: 'jakarta',     label: 'DKI Jakarta',  hex: '#1A2256' },
  { id: 'jawa-barat',  label: 'Jawa Barat',   hex: '#3B4A8A' },
  { id: 'jawa-timur',  label: 'Jawa Timur',   hex: '#7FB69E' },
  { id: 'sumatera',    label: 'Sumatera',     hex: '#F2B137' },
  { id: 'sulawesi',    label: 'Sulawesi',     hex: '#E8632B' },
] as const;

/**
 * Hard-coded partai mapping Sprint 3 (Mas decision).
 * Sprint 4 migrate ke DB table `partai_politik`.
 */
export const PARTAI_HARD_CODED = [
  { id: 'pdip',     name: 'PDIP',     hex: '#C44434' },
  { id: 'gerindra', name: 'Gerindra', hex: '#1A2256' },
  { id: 'golkar',   name: 'Golkar',   hex: '#F2B137' },
  { id: 'nasdem',   name: 'NasDem',   hex: '#7FB69E' },
  { id: 'pkb',      name: 'PKB',      hex: '#3B4A8A' },
  { id: 'pks',      name: 'PKS',      hex: '#E8632B' },
];
```

**`apps/web/src/lib/tagih/filters.ts`:** `parseTagihFilter` (status + level) + `buildTagihUrl` + `toggleStatusFilter` + `toggleLevelFilter` (mirror pattern Spec #7).

### 2. Server Actions

**`apps/web/src/app/tagih/actions.ts`:**

```ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const followSchema = z.object({ janjiId: z.string().uuid() });

const submitSchema = z.object({
  pejabat_id: z.string().uuid(),
  topik:      z.string().trim().min(2, 'Topik minimal 2 karakter').max(50),
  janji_text: z.string().trim().min(30, 'Janji minimal 30 karakter').max(1000),
  sumber_url: z.string().url('URL sumber tidak valid').optional().or(z.literal('')),
  deadline:   z.string().optional(),
});

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function followJanjiAction(formData: FormData): Promise<ActionResult> {
  const parsed = followSchema.safeParse({ janjiId: formData.get('janjiId') });
  if (!parsed.success) return { ok: false, error: 'Input tidak valid' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/masuk?redirect=/tagih/${parsed.data.janjiId}`);
  }

  // Idempotent via PG unique-violation pattern (sama dengan Spec #10)
  const { error } = await supabase
    .from('janji_pemantau')
    .insert({ janji_id: parsed.data.janjiId, user_id: user.id });
  if (error && error.code !== '23505') return { ok: false, error: error.message };

  revalidatePath(`/tagih/${parsed.data.janjiId}`);
  return { ok: true };
}

export async function unfollowJanjiAction(formData: FormData): Promise<ActionResult> {
  const parsed = followSchema.safeParse({ janjiId: formData.get('janjiId') });
  if (!parsed.success) return { ok: false, error: 'Input tidak valid' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Login dulu' };

  const { error } = await supabase
    .from('janji_pemantau')
    .delete()
    .match({ janji_id: parsed.data.janjiId, user_id: user.id });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/tagih/${parsed.data.janjiId}`);
  return { ok: true };
}

export async function submitJanjiAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = submitSchema.safeParse({
    pejabat_id: formData.get('pejabat_id'),
    topik:      formData.get('topik'),
    janji_text: formData.get('janji_text'),
    sumber_url: formData.get('sumber_url') || undefined,
    deadline:   formData.get('deadline') || undefined,
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
    redirect('/masuk?redirect=/tagih/baru');
  }

  const { data, error } = await supabase
    .from('janji')
    .insert({
      ...parsed.data,
      submitted_by: user.id,
      status: 'Belum',
      // is_demo: false — real user submission
    })
    .select('id')
    .single();
  if (error) return { ok: false, error: error.message };

  revalidatePath('/tagih');
  return { ok: true, id: data?.id };
}
```

### 3. Index page (most data-heavy)

**`apps/web/src/app/tagih/page.tsx`:**

```tsx
import { createClient } from '@/lib/supabase/server';
import { parseTagihFilter } from '@/lib/tagih/filters';
import { TagihHero } from './tagih-hero';
import { TagihStats } from './tagih-stats';
import { PetaIndonesia } from './peta-indonesia';
import { PartaiDashboard } from './partai-dashboard';
import { JanjiFilters } from './janji-filters';
import { JanjiRow } from './janji-row';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function TagihPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const filter = parseTagihFilter(sp);

  const supabase = await createClient();

  // Fetch janji list (filtered)
  let q = supabase
    .from('janji_with_pejabat')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(50);
  if (filter.status) q = q.eq('status', filter.status);
  if (filter.level)  q = q.eq('pejabat_level', filter.level);

  // Parallel: aggregate stats + janji list
  const [{ data: janjiList, count }, statsResult] = await Promise.all([
    q,
    supabase.from('janji').select('status', { count: 'exact', head: false }),
  ]);

  // Compute stats
  const stats = {
    total: statsResult.count ?? 0,
    Ditepati:  statsResult.data?.filter((j: any) => j.status === 'Ditepati').length ?? 0,
    Berjalan:  statsResult.data?.filter((j: any) => j.status === 'Berjalan').length ?? 0,
    Mandek:    statsResult.data?.filter((j: any) => j.status === 'Mandek').length ?? 0,
    Diingkari: statsResult.data?.filter((j: any) => j.status === 'Diingkari').length ?? 0,
    Belum:     statsResult.data?.filter((j: any) => j.status === 'Belum').length ?? 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <TagihHero />

      <TagihStats stats={stats} className="mt-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
        <PetaIndonesia />
        <PartaiDashboard />
      </div>

      <section className="mt-12">
        <header className="mb-4 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <span className="font-hand text-jw-coral text-base">— daftar janji</span>
            <h2 className="font-display text-2xl font-bold text-jw-blue">
              {count ?? 0} janji terlacak
            </h2>
          </div>
          <Link
            href="/tagih/baru"
            className="inline-flex items-center gap-1.5 rounded-jw-md bg-jw-coral text-white px-4 py-2 text-sm font-semibold hover:bg-jw-coral/90 transition"
          >
            <Plus size={14} aria-hidden /> Submit janji baru
          </Link>
        </header>

        <JanjiFilters currentStatus={filter.status} currentLevel={filter.level} />

        <div className="mt-4 space-y-3">
          {janjiList?.map((j) => <JanjiRow key={j.id ?? ''} janji={j} />)}
        </div>
      </section>

      <NalaTriggerButton context="tentang Tagih Janji" />
    </div>
  );
}

export const metadata = {
  title: 'Tagih Janji — Jubir Warga',
  description: 'Setiap janji yang diucapkan, kita catat. Yang ditepati, kita rayakan. Yang diingkari, kita ingatkan.',
};
```

### 4. TagihHero + TagihStats

**`tagih-hero.tsx`** — port HeroTagihIllustration SVG dari Phase 1 dengan brand color tokens:

```tsx
export function TagihHero() {
  return (
    <header className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-jw-line pb-8">
      <div>
        <span className="font-hand text-jw-coral text-base">— pilar</span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-jw-blue leading-tight">
          Tagih Janji <em className="block text-3xl md:text-4xl">Pemerintah.</em>
        </h1>
        <p className="text-base md:text-lg text-jw-ink/80 mt-4 max-w-xl">
          Setiap janji yang diucapkan, kita catat. Yang ditepati, kita rayakan. Yang diingkari, kita ingatkan.
        </p>
        <div className="mt-6 flex items-center gap-3 flex-wrap">
          <a href="#daftar-janji" className="inline-flex items-center rounded-jw-md bg-jw-coral text-white px-5 py-2.5 text-sm font-semibold hover:bg-jw-coral/90 transition">
            Lihat semua janji
          </a>
          <a href="/tagih/baru" className="inline-flex items-center rounded-jw-md border border-jw-line bg-white text-jw-blue px-5 py-2.5 text-sm font-semibold hover:bg-jw-line/40 transition">
            + Submit janji baru
          </a>
        </div>
      </div>
      <HeroIllustration />
    </header>
  );
}

function HeroIllustration() {
  // Port SVG dari apps/legacy/src/pages/tagih/Index.jsx HeroTagihIllustration
  // dengan substitusi color: #1A2256 → currentColor (text-jw-blue), #7FB69E → text-jw-mint, dst
  return (
    <svg viewBox="0 0 320 240" className="w-full max-w-md mx-auto">
      {/* SVG content — port lengkap dari Phase 1, ganti hardcode hex dengan brand tokens via CSS variable */}
    </svg>
  );
}
```

**`tagih-stats.tsx`** — 4 stat cards: total, % ditepati, % berjalan, % mandek+diingkari (gabung jadi 1).

### 5. PetaIndonesia (Server, SVG static)

**`peta-indonesia.tsx`** — pakai SVG path Indonesia simplified (5 provinsi cluster). Color provinsi by janji count (gradient: jw-line untuk 0 janji → jw-coral untuk 10+ janji).

```tsx
import { createClient } from '@/lib/supabase/server';
import { PROVINSI_OPTIONS } from '@/lib/tagih/constants';

export async function PetaIndonesia() {
  const supabase = await createClient();
  // Aggregate count per provinsi via pejabat.provinsi field (kalau ada)
  // Fallback: hardcode count untuk 5 provinsi MVP
  // Sprint 4: query view `janji_per_provinsi` aggregate

  // Sprint 3 simplified: render SVG dengan 5 provinsi cluster shapes
  return (
    <section className="rounded-jw-lg border border-jw-line bg-white p-5">
      <header className="mb-3">
        <span className="font-hand text-jw-coral text-sm">— peta</span>
        <h3 className="font-display text-lg font-semibold text-jw-blue">
          Sebaran janji per provinsi
        </h3>
      </header>
      <svg viewBox="0 0 400 180" className="w-full">
        {/* Simplified 5-cluster shape Indonesia */}
        <ellipse cx="60"  cy="100" rx="40" ry="14" fill="#3B4A8A" opacity="0.7" />  {/* Sumatera */}
        <ellipse cx="135" cy="115" rx="32" ry="10" fill="#1A2256" opacity="0.85" /> {/* Jawa */}
        <ellipse cx="195" cy="120" rx="28" ry="8"  fill="#7FB69E" opacity="0.85" /> {/* Bali-NTT */}
        <ellipse cx="245" cy="95"  rx="24" ry="16" fill="#F2B137" opacity="0.7" />  {/* Kalimantan */}
        <ellipse cx="290" cy="115" rx="22" ry="22" fill="#E8632B" opacity="0.7" />  {/* Sulawesi */}
        <ellipse cx="345" cy="125" rx="26" ry="10" fill="#3B4A8A" opacity="0.5" />  {/* Maluku-Papua */}

        {/* Labels */}
        <text x="60"  y="105" textAnchor="middle" className="text-[10px] fill-white font-semibold">Sumatera</text>
        <text x="135" y="118" textAnchor="middle" className="text-[10px] fill-white font-semibold">Jawa</text>
        <text x="290" y="118" textAnchor="middle" className="text-[10px] fill-white font-semibold">Sulawesi</text>
      </svg>
      <p className="text-xs text-jw-muted mt-2 italic">
        Peta interaktif (tap-province → drilldown) Sprint 4.
      </p>
      <div className="mt-3 flex items-center gap-3 text-xs text-jw-muted flex-wrap">
        {PROVINSI_OPTIONS.map(p => (
          <span key={p.id} className="inline-flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded" style={{ background: p.hex }} />
            {p.label}
          </span>
        ))}
      </div>
    </section>
  );
}
```

### 6. PartaiDashboard (Server, widget)

**`partai-dashboard.tsx`** — render PARTAI_HARD_CODED dengan bar chart visual (% janji per partai).

```tsx
import { PARTAI_HARD_CODED } from '@/lib/tagih/constants';

export function PartaiDashboard() {
  // Sprint 3: hard-coded percentages from Phase 1 reference
  // Sprint 4: query aggregate view `janji_per_partai`
  const partaiStats = PARTAI_HARD_CODED.map(p => ({
    ...p,
    percent: 38 - PARTAI_HARD_CODED.indexOf(p) * 4, // Mock fallback
  }));

  return (
    <section className="rounded-jw-lg border border-jw-line bg-white p-5">
      <header className="mb-3">
        <span className="font-hand text-jw-coral text-sm">— partai</span>
        <h3 className="font-display text-lg font-semibold text-jw-blue">
          Janji per partai
        </h3>
      </header>
      <div className="space-y-2">
        {partaiStats.map(p => (
          <div key={p.id}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-jw-ink">{p.name}</span>
              <span className="font-mono text-jw-muted">{p.percent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-jw-pill-grey-bg overflow-hidden mt-1">
              <div
                className="h-full rounded-full"
                style={{ width: `${p.percent}%`, background: p.hex }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-jw-muted mt-3 italic">
        Detail page partai Sprint 4.
      </p>
    </section>
  );
}
```

### 7. StatusPill + JanjiRow + JanjiFilters

**`status-pill.tsx`** — Server, dynamic pill berdasarkan STATUS_META lookup, render Lucide icon + label:

```tsx
import type { JanjiStatus } from '@jw/data/types';
import { STATUS_META } from '@/lib/tagih/constants';

export function StatusPill({ status }: { status: JanjiStatus }) {
  const meta = STATUS_META[status];
  if (!meta) return null;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-jw-sm px-2 py-0.5 text-xs font-semibold ${meta.pillBg} ${meta.pillText}`}>
      <Icon size={11} aria-hidden /> {meta.label}
    </span>
  );
}
```

**`janji-row.tsx`** — Server, single row dengan pejabat info + janji text + status pill + pemantau count + Link ke detail.

**`janji-filters.tsx`** — Client, 5-chip status filter + 3-chip level filter (mirror Spec #7 pattern).

### 8. Detail page

**`apps/web/src/app/tagih/[id]/page.tsx`** — fetch janji + evidence + isFollowed (parallel) → render hero janji + status pill + pejabat-card + status-timeline + evidence-list + follow-button + share-buttons.

### 9. Submit form

**`apps/web/src/app/tagih/baru/page.tsx`** — auth gate (redirect kalau belum login), render JanjiForm.

**`janji-form.tsx`** — Client, useActionState + useFormStatus, 5 field: pejabat_id (autocomplete dari `pejabat` table query), topik, janji_text, sumber_url (optional), deadline (optional date picker). Display field errors + success "Janji terkirim, akan direview admin Sprint 4".

### 10. Tests (3 baru)

- **`tagih-filters.test.ts`** — parser status + level
- **`status-pill.test.tsx`** — render 5 status dengan correct icon
- **`tagih-stats.test.tsx`** — percent calculation 4 stat cards

---

## Acceptance checklist

- [ ] `/tagih` render: hero illustration + 4 stat cards + peta SVG + partai widget + janji list + filter
- [ ] Hero subtitle: "Setiap janji yang diucapkan, kita catat. Yang ditepati, kita rayakan. Yang diingkari, kita ingatkan."
- [ ] 4 stat cards: total + % ditepati + % berjalan + % mandek/diingkari (gabung)
- [ ] Peta SVG render 5 cluster + label provinsi + caption "Sprint 4 interaktif"
- [ ] Partai dashboard render 6 partai + bar chart + caption "Sprint 4 detail"
- [ ] Filter status (5 chip) + level (3 chip) — URL shareable
- [ ] Janji row: pejabat info + janji_text + StatusPill (Lucide icon) + pemantau count + Link
- [ ] `/tagih/[id]` render: hero janji + status pill + pejabat-card + status-timeline + evidence-list + follow-button + share
- [ ] Follow button (anonymous): redirect `/masuk?redirect=/tagih/[id]`
- [ ] Follow (logged in): insert + button "Sedang dipantau" + count bertambah
- [ ] Unfollow: delete + revert button + count berkurang
- [ ] Idempotent follow (re-click gak duplicate)
- [ ] `/tagih/baru` render: form 5 field
- [ ] Submit form (anonymous): redirect /masuk
- [ ] Submit form (logged in, valid): insert dengan status='Belum', redirect ke `/tagih/[id]` dengan toast "Janji terkirim"
- [ ] Submit form (invalid): tampilkan field errors
- [ ] **Anti-pattern fixed: STATUS unicode symbols (✓↻⏸✕⌛) replaced dengan Lucide (CheckCircle/Loader/Pause/XCircle/Clock)**
- [ ] Header nav "Tagih Janji" link jalan
- [ ] Floating "Tanya Nala tentang Tagih Janji/janji <X>" coral pill
- [ ] `pnpm test` pass dengan 3 test baru → total 99+
- [ ] `pnpm typecheck` pass dengan 0 errors
- [ ] `pnpm lint` pass dengan 0 new warnings
- [ ] Mobile responsive 320-1440px (peta SVG scales)

## Out of scope (defer Sprint 4+)

- ❌ Peta interaktif tap-province → drilldown — Sprint 4 (butuh state + zoom)
- ❌ Detail page partai `/tagih/partai/[id]` — Sprint 4
- ❌ Aggregate query view `janji_per_provinsi` + `janji_per_partai` — Sprint 4 (Sprint 3 pakai client-side aggregate)
- ❌ Admin moderation panel — Sprint 4
- ❌ Status change history (timeline lebih dari current state) — Sprint 4 (butuh DB table `janji_status_log`)
- ❌ Evidence upload (foto/dokumen) — Sprint 4 (butuh Supabase Storage)
- ❌ Notification saat janji status berubah — Sprint 4
- ❌ Theory of Change escalation thresholds (per BACKLOG) — Sprint 4-5
- ❌ Pejabat profile page `/pejabat/[id]` — Sprint 4

## Notes untuk planner audit

Aku akan audit:
- File 17 baru sesuai
- STATUS unicode symbols replaced dengan Lucide
- Peta SVG render 5 provinsi (gak react-leaflet)
- Submit form Zod-validated
- Follow idempotent (PG unique-violation pattern dari Spec #10)
- Test count tambah 3 jadi 99+
- Honest disclosure kalau ada limitation (mis. partai % hard-coded)

## Commit message

```
feat(tagih): port Index + JanjiDetail + Submit dengan peta + partai + follow

- /tagih — Server hero (port HeroTagihIllustration SVG) + 4 stat cards +
  peta Indonesia SVG (5 cluster, NO react-leaflet) + partai dashboard widget +
  janji list dengan filter status/level URL-shareable
- /tagih/[id] — Detail dengan StatusPill (Lucide icon NO unicode symbols),
  pejabat-card, status-timeline (current state Sprint 3), evidence-list,
  follow-button (idempotent via PG unique-violation 23505)
- /tagih/baru — Submit form Zod-validated, login required, status='Belum'
  pending admin review (moderation panel Sprint 4)
- Anti-pattern fixed: STATUS_META icon ✓↻⏸✕⌛ → Lucide CheckCircle/Loader/Pause/XCircle/Clock
- 3 test baru: filters, status-pill render, stats percent calc
- Per Spec #11 + decisions Mas (SVG static peta, partai widget basic, submit
  flow basic dengan admin moderation Sprint 4)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

## WAJIB INCLUDE spec file

```bash
git add \
  apps/web/src/app/tagih/ \
  apps/web/src/lib/tagih/ \
  apps/web/src/__tests__/tagih-*.test.* \
  apps/web/src/__tests__/status-pill.test.tsx \
  specs/SPRINT-3/11-tagih.md
```

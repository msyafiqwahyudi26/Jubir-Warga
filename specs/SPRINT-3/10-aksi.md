# Spec #10 — Aksi page (Index + PetisiDetail + PollingDetail)

**Sprint**: 3
**Owner**: Claude Code (executor) · audited oleh planner
**Estimasi**: 3-4 jam
**Dependency**: Spec #6 (typegen), Spec #6.5 (test foundation), pattern dari #7-#9
**Decisions Mas (approved 2026-05-01):**
1. ✅ Polling: text-only options + **Lucide icon** generic (CheckSquare/CheckCircle) sebagai Tier 1 interim. **TIER 2** (Sprint 4-5): replace dengan custom SVG icon brand-aligned (lihat CLAUDE.md Section 5.4b + BACKLOG "Custom SVG emoji set"). **JANGAN render native unicode emoji** (🚇📚) dari `PollingOption.emoji` field — itu inkonsisten antar OS.
2. ✅ Petisi sign: login required (consistent dengan vote thread, leverage existing auth)
3. ✅ Petisi escalation: basic counter + progress bar Sprint 3, threshold visual + auto-action (1k/5k/10k/25k per BACKLOG Theory of Change) defer Sprint 4-5

**Brand decision update 2026-05-01 (Mas):**
Native unicode emoji banned sebagai brand decor. Tapi custom SVG emoji + icon brand-aligned ENCOURAGED. Sprint 3 pakai Lucide sebagai placeholder. Sprint 4-5 swap ke custom SVG set. Native emoji INSIDE quoted UGC content tetap OK (gak di-render sebagai brand decor).

**Required reading sebelum mulai:**
1. `CLAUDE.md` — operating manual (ESPECIALLY anti-pattern emoji UI rule)
2. `apps/legacy/src/pages/aksi/Index.jsx` — Phase 1 reference (Polling + Janji + Petisi + Lapor + Kampanye sections)
3. `apps/legacy/src/pages/aksi/PetisiDetail.jsx` — Phase 1 detail
4. `specs/SPRINT-3/07-komunitas.md` + `08-karya.md` + `09-kelas.md` — pattern reference
5. `apps/web/src/components/beranda/petisi-preview.tsx` — pattern Server Component view query yang udah established
6. `packages/data/src/queries.ts` — `listPetisi`, `getPetisi`, `signPetisi`, `isPetisiSigned`, `listPolling`, `votePolling`
7. `packages/data/src/schemas.ts` — `submitPetisiSchema`
8. `packages/data/src/types.ts` — `PetisiWithProgress`, `Polling`, `PollingOption`, `Kampanye`
9. `docs/EVALUATION_PHASE1_VS_PHASE2_2026-05-01.md` Section B5 + D — anti-pattern emoji di Aksi WAJIB di-fix

---

## Goal

Port halaman Aksi dari Phase 1 ke Phase 2 dengan focus 3 surface:
- **Index page** (`/aksi`) — Polling Hari Ini featured + Petisi list (with progress bar) + Kampanye preview
- **Petisi Detail** (`/aksi/petisi/[id]`) — full body + progress visual + sign button (login required) + signatures count + share
- **Polling Detail** (`/aksi/polling/[id]`) — vote options dengan Lucide icon, real-time count percent (after vote), one-vote-per-user, share

Setelah spec ini selesai:
- Header nav "Aksi" jalan
- User bisa sign petisi (DB insert petisi_signatures)
- User bisa vote polling (DB insert via `votePolling`)
- Anti-pattern emoji UI replaced dengan Lucide icon proper

## Scope yang DEFER (Sprint 4+)

- ❌ **Lapor Warga page** (`/lapor`) — dedicated route Sprint 4 (form + foto + geolocation, butuh Supabase Storage)
- ❌ **Tagih Janji preview di Aksi** — dedicated `/tagih` Spec #11 (full page)
- ❌ **Kampanye Detail page** (`/aksi/kampanye/[id]`) — Sprint 4 (Spec #10 cuma render preview card di Index)
- ❌ **Petisi escalation thresholds** (1k/5k/10k/25k auto-action) — Sprint 4-5 per BACKLOG Theory of Change
- ❌ **Submit Petisi baru** (`/aksi/petisi/baru`) — Sprint 4 (form + admin moderation)
- ❌ **Polling submission baru** — Sprint 5 (admin-only at first)

## Konteks

Aksi adalah surface conversion utama Jubir Warga — tempat user dari "baca" → "kontribusi". Sign petisi + vote polling = micro-action paling murah untuk start engagement loop. Spec #10 fokus delivery functional foundation.

🚨 **Anti-pattern Phase 1 yang HARUS di-fix di Sprint 3 (Tier 1 — Lucide interim):**
- POLL_OPTIONS pakai emoji `🚇 🛒 📚` per opsi → **REPLACE dengan Lucide** CheckSquare/CheckCircle generic. Tier 2 Sprint 4-5: custom SVG kategori brand-aligned (Transport/Pangan/Pendidikan).
- STATUS_META pakai emoji `✅ 🔄 ⏳ ❌` per status → **REPLACE dengan Lucide** (CheckCircle/Loader/Clock/XCircle). Tier 2: custom SVG status set.
- PETISI items pakai icon `📋 🚇 💻` → render kategori pill text saja. Tier 2: custom SVG kategori per petisi.
- KAMPANYE icon `🔍 📱 🌾` → **REPLACE dengan Lucide** generic (Megaphone/Users). Tier 2: custom SVG per kampanye theme.

Database schema `PollingOption.emoji` ada (legacy native unicode) — Sprint 3 IGNORE field ini di UI render (Lucide instead). Sprint 4-5 swap ke custom SVG. Migration cleanup field di Sprint 5+ (kalau perlu).

**Reasoning brand decision (per Mas 2026-05-01):** Native unicode emoji style berbeda antar OS (Apple/Google/Windows) — gak konsisten dengan brand identity. Custom SVG emoji + icon brand-aligned (palette 11 token, hand-drawn feel mirror Nala) ENCOURAGED tapi belum ready Sprint 3 — pakai Lucide sebagai jembatan visual yang clean + konsisten antar OS, lalu swap ke custom set Sprint 4-5.

---

## File yang dibuat

```
apps/web/src/app/aksi/
├── page.tsx                                    Index — Server Component
├── polling-featured-card.tsx                   Server — Polling Hari Ini di Index
├── petisi-list.tsx                             Server — petisi list dengan progress
├── petisi-row.tsx                              Server — single petisi row
├── kampanye-preview.tsx                        Server — 3 kampanye card preview (NO detail page Sprint 3)
├── petisi/
│   └── [id]/
│       ├── page.tsx                            PetisiDetail — Server
│       ├── petisi-body.tsx                     Server — markdown subset (mirror ArticleBody)
│       ├── petisi-progress.tsx                 Server — visual progress + signature count
│       ├── sign-petisi-button.tsx              Client — sign action dengan auth gate
│       └── share-buttons.tsx                   Client — Web Share API atau fallback copy link
└── polling/
    └── [id]/
        ├── page.tsx                            PollingDetail — Server
        ├── polling-form.tsx                    Client — vote form dengan auth gate + result reveal
        └── polling-result-bars.tsx             Server — result bars dengan percentage

apps/web/src/lib/aksi/
├── constants.ts                                ACTION_TYPES (petisi/polling/kampanye), formatPercent helper
└── deadline.ts                                 isClosed(deadline), formatDeadline(deadline)

apps/web/src/app/aksi/
└── actions.ts                                  Server Actions: signPetisiAction, votePollingAction
                                                (Zod-validated, auth gate redirect)

apps/web/src/__tests__/
├── aksi-deadline.test.ts                       Test isClosed + formatDeadline
├── sign-petisi-button.test.tsx                 Test render states (signed/unsigned/anonymous)
└── polling-result-bars.test.tsx                Test percent calculation + bar render
```

## File yang diubah

```
apps/web/src/components/site-header.tsx
  — Verify nav "Aksi" href={'/aksi'} match
```

---

## Step-by-step (skeleton — Claude Code adapt sesuai pattern Spec #7-#9)

### 1. Constants & helpers

**`apps/web/src/lib/aksi/constants.ts`:**

```ts
export const ACTION_TYPES = ['petisi', 'polling', 'kampanye'] as const;
export type ActionType = typeof ACTION_TYPES[number];

export function formatPercent(current: number, total: number): string {
  if (total <= 0) return '0%';
  const pct = (current / total) * 100;
  return `${pct.toFixed(1)}%`;
}

export function calculatePercent(current: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, (current / total) * 100);
}
```

**`apps/web/src/lib/aksi/deadline.ts`:**

```ts
export function isClosed(deadline: string | null): boolean {
  if (!deadline) return false;
  return new Date(deadline).getTime() < Date.now();
}

export function formatDeadline(deadline: string | null): string {
  if (!deadline) return 'Tanpa deadline';
  const date = new Date(deadline);
  if (isClosed(deadline)) return 'Sudah selesai';
  const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Hari ini berakhir';
  if (days === 1) return 'Berakhir besok';
  if (days <= 7) return `Berakhir ${days} hari lagi`;
  return `Berakhir ${date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`;
}
```

### 2. Server Actions

**`apps/web/src/app/aksi/actions.ts`:**

```ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const signPetisiSchema = z.object({ petisiId: z.string().uuid() });
const votePollingSchema = z.object({
  pollingId: z.string().uuid(),
  optionId: z.string().min(1),
});

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function signPetisiAction(formData: FormData): Promise<ActionResult> {
  const parsed = signPetisiSchema.safeParse({ petisiId: formData.get('petisiId') });
  if (!parsed.success) return { ok: false, error: 'Input tidak valid' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/masuk?redirect=/aksi/petisi/${parsed.data.petisiId}`);
  }

  // Idempotent
  const { data: existing } = await supabase
    .from('petisi_signatures')
    .select('petisi_id')
    .match({ petisi_id: parsed.data.petisiId, user_id: user.id })
    .maybeSingle();

  if (existing) {
    return { ok: true }; // Sudah pernah sign, no-op
  }

  const { error } = await supabase
    .from('petisi_signatures')
    .insert({ petisi_id: parsed.data.petisiId, user_id: user.id });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/aksi/petisi/${parsed.data.petisiId}`);
  revalidatePath('/aksi');
  return { ok: true };
}

export async function votePollingAction(formData: FormData): Promise<ActionResult> {
  const parsed = votePollingSchema.safeParse({
    pollingId: formData.get('pollingId'),
    optionId: formData.get('optionId'),
  });
  if (!parsed.success) return { ok: false, error: 'Input tidak valid' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/masuk?redirect=/aksi/polling/${parsed.data.pollingId}`);
  }

  // Use existing votePolling pattern dari @jw/data — kalau perlu RPC server-side
  // Sprint 3: insert ke polling_votes table (kalau belum ada, tambah migration)
  // ATAU pakai update polling.options[].votes counter (less safe)
  // RECOMMENDED: gunakan @jw/data hooks.votePolling kalau udah ada wrapper
  
  const { error } = await supabase.rpc('vote_polling', {
    polling_id: parsed.data.pollingId,
    option_id: parsed.data.optionId,
    voter_id: user.id,
  });
  // Fallback kalau RPC belum ada: increment options[].votes via update + insert ke polling_votes table

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/aksi/polling/${parsed.data.pollingId}`);
  revalidatePath('/aksi');
  return { ok: true };
}
```

> **NOTE Claude Code:** vote polling DB pattern butuh investigation. Cek migration 0001_init.sql apakah ada `polling_votes` table atau RPC `vote_polling`. Kalau belum, **fallback Sprint 3**: pakai `polling.options[]` JSON column update increment counter, plus `polling_votes(polling_id, user_id)` lookup table untuk one-vote-per-user enforcement. Kalau ternyata schema gak support, document di STATUS + skip vote action (render preview only) sampai migration tambah Sprint 4.

### 3. Index page

**`apps/web/src/app/aksi/page.tsx`:**

```tsx
import { createClient } from '@/lib/supabase/server';
import { PollingFeaturedCard } from './polling-featured-card';
import { PetisiList } from './petisi-list';
import { KampanyePreview } from './kampanye-preview';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';

export default async function AksiPage() {
  const supabase = await createClient();

  // Polling Hari Ini (1 active)
  const { data: polling } = await supabase
    .from('polling')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <header className="mb-8 border-b border-jw-line pb-6">
        <span className="font-hand text-jw-coral text-base">— aksi warga</span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-jw-blue leading-tight">
          Aksi
        </h1>
        <p className="text-base md:text-lg text-jw-ink/70 mt-2 max-w-xl">
          Bukan cuma ngomong — kita kerjain.
        </p>
      </header>

      {polling && <PollingFeaturedCard polling={polling} className="mb-12" />}

      <section className="mb-12">
        <header className="mb-4">
          <span className="font-hand text-jw-coral text-base">— petisi</span>
          <h2 className="font-display text-2xl font-bold text-jw-blue">
            Petisi yang lagi jalan
          </h2>
        </header>
        <PetisiList />
      </section>

      <KampanyePreview className="mt-12" />

      <NalaTriggerButton context="tentang Aksi" />
    </div>
  );
}

export const metadata = {
  title: 'Aksi — Jubir Warga',
  description: 'Polling, petisi, kampanye warga.',
};
```

### 4. PollingFeaturedCard (Server)

```tsx
import Link from 'next/link';
import type { Polling } from '@jw/data/types';
import { Vote, ArrowRight } from 'lucide-react';
import { formatDeadline } from '@/lib/aksi/deadline';

export function PollingFeaturedCard({ polling, className }: { polling: Polling; className?: string }) {
  return (
    <section className={`rounded-jw-xl border-2 border-jw-coral/40 bg-jw-pill-coral-bg/30 p-6 md:p-8 ${className ?? ''}`}>
      <span className="inline-flex items-center gap-1.5 rounded-jw-sm bg-jw-coral text-white text-xs font-bold px-2 py-0.5 mb-3">
        <Vote size={11} aria-hidden /> POLLING HARI INI
      </span>
      <h3 className="font-display text-xl md:text-2xl font-bold text-jw-blue leading-snug">
        {polling.question}
      </h3>
      <p className="text-xs text-jw-muted mt-2">
        {polling.total_votes} suara · {formatDeadline(polling.deadline)}
      </p>
      <Link
        href={`/aksi/polling/${polling.id}`}
        className="inline-flex items-center gap-1.5 mt-4 rounded-jw-md bg-jw-coral text-white px-5 py-2.5 text-sm font-semibold hover:bg-jw-coral/90 transition"
      >
        Vote sekarang <ArrowRight size={14} aria-hidden />
      </Link>
    </section>
  );
}
```

### 5. PetisiList (Server) + PetisiRow

**`petisi-list.tsx`** — fetch dari `petisi_with_progress` view, render PetisiRow grid 1/2 col responsive:

```tsx
import { createClient } from '@/lib/supabase/server';
import { PetisiRow } from './petisi-row';

export async function PetisiList() {
  const supabase = await createClient();
  const { data: petisi } = await supabase
    .from('petisi_with_progress')
    .select('*')
    .eq('status', 'active')
    .order('current_count', { ascending: false })
    .limit(6);

  if (!petisi || petisi.length === 0) {
    return (
      <p className="text-sm text-jw-muted italic">Belum ada petisi aktif.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {petisi.map((p) => (
        <PetisiRow key={p.id} petisi={p} />
      ))}
    </div>
  );
}
```

**`petisi-row.tsx`** — card dengan progress bar gradient (mirror PetisiPreview di Beranda):

```tsx
import Link from 'next/link';
import { Users } from 'lucide-react';
import { calculatePercent } from '@/lib/aksi/constants';
import { formatDeadline } from '@/lib/aksi/deadline';

type PetisiRow = {
  id: string | null;
  title: string | null;
  summary: string | null;
  current_count: number | null;
  target: number | null;
  deadline: string | null;
};

export function PetisiRow({ petisi }: { petisi: PetisiRow }) {
  if (!petisi.id || !petisi.title) return null;
  const current = petisi.current_count ?? 0;
  const target = petisi.target ?? 1000;
  const pct = calculatePercent(current, target);

  return (
    <Link
      href={`/aksi/petisi/${petisi.id}`}
      className="group rounded-jw-lg border border-jw-line bg-white p-5 hover:border-jw-coral/40 transition flex flex-col"
    >
      <h3 className="font-display text-lg font-semibold text-jw-blue leading-snug group-hover:underline">
        {petisi.title}
      </h3>
      {petisi.summary && (
        <p className="text-sm text-jw-ink/70 mt-2 line-clamp-2">{petisi.summary}</p>
      )}
      <div className="mt-4">
        <div className="h-2 w-full rounded-full bg-jw-pill-grey-bg overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-jw-coral to-jw-marigold transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-jw-muted mt-2">
          <span className="inline-flex items-center gap-1 font-semibold text-jw-blue">
            <Users size={11} aria-hidden /> {current.toLocaleString('id-ID')} / {target.toLocaleString('id-ID')}
          </span>
          <span>{pct.toFixed(1)}%</span>
        </div>
        <p className="text-xs text-jw-muted mt-1">{formatDeadline(petisi.deadline)}</p>
      </div>
    </Link>
  );
}
```

### 6. KampanyePreview (Server)

```tsx
import { createClient } from '@/lib/supabase/server';
import { Megaphone, Users } from 'lucide-react';

export async function KampanyePreview({ className }: { className?: string }) {
  const supabase = await createClient();
  const { data: kampanye } = await supabase
    .from('kampanye')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  if (!kampanye || kampanye.length === 0) return null;

  return (
    <section className={className ?? ''}>
      <header className="mb-4">
        <span className="font-hand text-jw-coral text-base">— kampanye</span>
        <h2 className="font-display text-2xl font-bold text-jw-blue">Gerakan kolektif</h2>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kampanye.map((k) => (
          <article key={k.id} className="rounded-jw-lg border border-jw-line bg-white p-5">
            <Megaphone size={20} aria-hidden className="text-jw-coral mb-3" />
            <h3 className="font-display font-semibold text-jw-blue text-lg leading-snug">{k.title}</h3>
            {k.description && (
              <p className="text-sm text-jw-ink/70 mt-2 line-clamp-3">{k.description}</p>
            )}
            <div className="mt-4 text-xs text-jw-muted inline-flex items-center gap-1">
              <Users size={11} aria-hidden /> {k.participant_count ?? 0} peserta
            </div>
            <p className="mt-3 text-xs text-jw-muted italic">Detail page: Sprint 4</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

### 7. PetisiDetail page

**`apps/web/src/app/aksi/petisi/[id]/page.tsx`:** fetch petisi + isSigned, render hero + progress + sign button + body + share buttons + back link.

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PetisiBody } from './petisi-body';
import { PetisiProgress } from './petisi-progress';
import { SignPetisiButton } from './sign-petisi-button';
import { ShareButtons } from './share-buttons';
import { formatDeadline } from '@/lib/aksi/deadline';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';

export default async function PetisiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: petisi }, { data: { user } }] = await Promise.all([
    supabase.from('petisi_with_progress').select('*').eq('id', id).maybeSingle(),
    supabase.auth.getUser(),
  ]);

  if (!petisi || !petisi.id || !petisi.title) notFound();

  let alreadySigned = false;
  if (user) {
    const { count } = await supabase
      .from('petisi_signatures')
      .select('*', { count: 'exact', head: true })
      .match({ petisi_id: id, user_id: user.id });
    alreadySigned = (count ?? 0) > 0;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/aksi"
        className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline mb-4"
      >
        <ChevronLeft size={14} aria-hidden /> Kembali ke Aksi
      </Link>

      <header className="mb-6">
        <span className="inline-block rounded-jw-sm bg-jw-pill-coral-bg text-jw-pill-coral-text text-xs font-semibold px-2 py-0.5 mb-3">
          PETISI
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-jw-blue leading-tight">
          {petisi.title}
        </h1>
        {petisi.summary && (
          <p className="text-base text-jw-ink/80 mt-3">{petisi.summary}</p>
        )}
        <p className="text-xs text-jw-muted mt-3">{formatDeadline(petisi.deadline)}</p>
      </header>

      <PetisiProgress
        current={petisi.current_count ?? 0}
        target={petisi.target ?? 1000}
      />

      <div className="my-6 flex items-center gap-3 flex-wrap">
        <SignPetisiButton petisiId={petisi.id} alreadySigned={alreadySigned} />
        <ShareButtons title={petisi.title} url={`/aksi/petisi/${petisi.id}`} />
      </div>

      <PetisiBody body={petisi.body ?? '*Body petisi belum tersedia.*'} />

      <NalaTriggerButton context={`petisi "${petisi.title}"`} />
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
  const { data } = await supabase.from('petisi').select('title').eq('id', id).maybeSingle();
  return { title: `${data?.title ?? 'Petisi'} — Aksi Jubir Warga` };
}
```

### 8. PetisiBody, PetisiProgress, SignPetisiButton, ShareButtons

- **`petisi-body.tsx`** Server — markdown subset (mirror ArticleBody Spec #8)
- **`petisi-progress.tsx`** Server — big progress bar + count + percent + "X tanda tangan dari Y target"
- **`sign-petisi-button.tsx`** Client — `useTransition` → `signPetisiAction(fd)`. Render variants: signed (`✓ Sudah ditandatangani` mint pill), unsigned (`Tanda tangan` coral button), pending (`Mengirim...`).
- **`share-buttons.tsx`** Client — try `navigator.share()` (Web Share API), fallback ke copy link via `navigator.clipboard.writeText()`. Toast "Link disalin!" 2 detik.

### 9. PollingDetail page

**`apps/web/src/app/aksi/polling/[id]/page.tsx`:**

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Vote } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PollingForm } from './polling-form';
import { PollingResultBars } from './polling-result-bars';
import { formatDeadline } from '@/lib/aksi/deadline';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';

export default async function PollingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: polling }, { data: { user } }] = await Promise.all([
    supabase.from('polling').select('*').eq('id', id).maybeSingle(),
    supabase.auth.getUser(),
  ]);

  if (!polling) notFound();

  let alreadyVoted = false;
  // Sprint 3: cek polling_votes table kalau ada, atau pakai cookie sebagai fallback
  if (user) {
    const { count } = await supabase
      .from('polling_votes')
      .select('*', { count: 'exact', head: true })
      .match({ polling_id: id, user_id: user.id });
    alreadyVoted = (count ?? 0) > 0;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Link
        href="/aksi"
        className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline mb-4"
      >
        <ChevronLeft size={14} aria-hidden /> Kembali ke Aksi
      </Link>

      <header className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-jw-sm bg-jw-coral text-white text-xs font-bold px-2 py-0.5 mb-3">
          <Vote size={11} aria-hidden /> POLLING
        </span>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-jw-blue leading-snug">
          {polling.question}
        </h1>
        <p className="text-xs text-jw-muted mt-2">
          {polling.total_votes} suara · {formatDeadline(polling.deadline)}
        </p>
      </header>

      {alreadyVoted ? (
        <PollingResultBars polling={polling} />
      ) : (
        <PollingForm polling={polling} />
      )}

      <NalaTriggerButton context={`polling "${polling.question}"`} />
    </div>
  );
}
```

### 10. PollingForm (Client) + PollingResultBars (Server)

**`polling-form.tsx`** — Client Component dengan radio button list + submit. Pakai Lucide `Square`/`CheckSquare` icon (BUKAN emoji). Setelah submit, page revalidate → tampil `PollingResultBars`.

```tsx
'use client';

import { useState, useTransition } from 'react';
import { Square, CheckSquare } from 'lucide-react';
import type { Polling } from '@jw/data/types';
import { votePollingAction } from '../../actions';

export function PollingForm({ polling }: { polling: Polling }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (optionId: string) => {
    if (pending) return;
    setSelected(optionId);
    const fd = new FormData();
    fd.set('pollingId', polling.id);
    fd.set('optionId', optionId);
    startTransition(async () => {
      await votePollingAction(fd);
    });
  };

  return (
    <div className="space-y-2">
      {polling.options.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleSubmit(opt.id)}
            disabled={pending}
            className="w-full flex items-center gap-3 rounded-jw-lg border border-jw-line bg-white p-4 text-left hover:border-jw-coral hover:bg-jw-pill-coral-bg/30 transition disabled:opacity-50"
          >
            {isSelected ? (
              <CheckSquare size={20} aria-hidden className="text-jw-coral flex-shrink-0" />
            ) : (
              <Square size={20} aria-hidden className="text-jw-muted flex-shrink-0" />
            )}
            <span className="text-sm font-medium text-jw-ink">{opt.label}</span>
          </button>
        );
      })}
      <p className="text-xs text-jw-muted italic mt-3 text-center">
        Login dulu kalau belum. Satu suara per akun.
      </p>
    </div>
  );
}
```

**`polling-result-bars.tsx`** — Server, render bars dengan persentase per option. Sort descending by votes:

```tsx
import type { Polling } from '@jw/data/types';
import { calculatePercent } from '@/lib/aksi/constants';

export function PollingResultBars({ polling }: { polling: Polling }) {
  const total = polling.total_votes || 1;
  const sorted = [...polling.options].sort((a, b) => b.votes - a.votes);

  return (
    <div className="space-y-3">
      {sorted.map((opt) => {
        const pct = calculatePercent(opt.votes, total);
        return (
          <div key={opt.id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-jw-ink">{opt.label}</span>
              <span className="text-xs font-mono text-jw-muted">
                {opt.votes.toLocaleString('id-ID')} ({pct.toFixed(1)}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-jw-pill-grey-bg overflow-hidden">
              <div
                className="h-full rounded-full bg-jw-coral transition-[width] duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
      <p className="text-xs text-jw-mint mt-4 text-center font-semibold">
        ✓ Suaramu sudah tercatat. Terima kasih.
      </p>
    </div>
  );
}
```

### 11. Tests (3 baru)

- **`aksi-deadline.test.ts`** — `isClosed(null/past/future)`, `formatDeadline` semua branch (today/besok/<7day/>7day/closed)
- **`sign-petisi-button.test.tsx`** — render 3 state (anonymous/signed/unsigned)
- **`polling-result-bars.test.tsx`** — percent calc + sort descending

---

## Acceptance checklist

- [ ] `/aksi` render: hero + Polling Featured + Petisi list (6) + Kampanye preview (3)
- [ ] Polling Featured Card: question + count + deadline + "Vote sekarang →" CTA
- [ ] Petisi row: progress bar gradient coral→marigold + count/target + percent + deadline
- [ ] `/aksi/petisi/[id]` render: hero + progress + sign button + body markdown + share buttons
- [ ] Sign petisi (anonymous): klik → redirect `/masuk?redirect=/aksi/petisi/[id]`
- [ ] Sign petisi (logged in): klik → insert + button berubah ke "✓ Sudah ditandatangani"
- [ ] Sign petisi (re-click): idempotent (gak duplicate row)
- [ ] Share button: try Web Share API, fallback copy link + toast "Link disalin!"
- [ ] `/aksi/polling/[id]` render: question + form (pre-vote) atau result bars (post-vote)
- [ ] Vote polling (anonymous): redirect `/masuk?redirect=...`
- [ ] Vote polling (logged in): insert + result bars muncul
- [ ] Vote polling (re-click): one-vote-per-user enforced (button disabled atau gak nambah count)
- [ ] **Anti-pattern fixed Tier 1: NO native unicode emoji** — semua emoji dari Phase 1 (🚇🛒📚 polling, ✅🔄 status, 📋🚇💻 petisi icon, 🔍📱🌾 kampanye icon) replaced dengan Lucide icon proper (Vote, CheckSquare, Square, Megaphone, Users). Tier 2 (Sprint 4-5): swap ke custom SVG set brand-aligned per BACKLOG.
- [ ] Header nav "Aksi" link jalan
- [ ] Floating "Tanya Nala tentang Aksi/petisi/polling" coral pill
- [ ] `pnpm test` pass dengan 3 test baru → total 81+
- [ ] `pnpm typecheck` pass dengan 0 errors
- [ ] `pnpm lint` pass dengan 0 new warnings
- [ ] Mobile responsive 320-1440px

## Out of scope (defer Sprint 4+)

- ❌ Lapor Warga page (`/lapor`) — Sprint 4
- ❌ Tagih Janji preview di Aksi — Spec #11 dedicated `/tagih`
- ❌ Kampanye Detail page — Sprint 4
- ❌ Petisi escalation visual + auto-action (1k/5k/10k/25k) — Sprint 4-5
- ❌ Submit Petisi baru form — Sprint 4
- ❌ Submit Polling baru — Sprint 5 (admin-only first)
- ❌ Realtime vote count update — Sprint 4 (Supabase Realtime)
- ❌ Polling reaction comments / discuss — Sprint 5

## Notes untuk planner audit

Aku akan audit:
- File 14 baru sesuai spec
- **NO emoji decor di mana pun** (cek manual via Chrome MCP rendered HTML)
- Auth gate sign + vote consistent
- Idempotency sign petisi + one-vote polling
- Lucide icon mapping benar (Vote/Square/CheckSquare/Megaphone/Users)
- Test count tambah 3 jadi 81+

## DB schema check

⚠️ **Sebelum mulai action vote polling**, Claude Code WAJIB cek schema:
- `polling_votes(polling_id uuid, user_id uuid, option_id text)` table — ada? Kalau gak ada, fallback Sprint 3: pakai `polling.options[]` JSON column update + insert dummy table OR document gap di STATUS.

## Commit message

```
feat(aksi): port Index + PetisiDetail + PollingDetail with sign + vote

- /aksi — Polling Hari Ini featured + Petisi list (gradient progress) +
  Kampanye preview (3 card, detail page Sprint 4)
- /aksi/petisi/[id] — full body markdown + progress visual + sign button
  (auth gate redirect, idempotent) + share (Web Share API + fallback copy)
- /aksi/polling/[id] — vote form (Lucide Square/CheckSquare, NO emoji) atau
  result bars sorted desc dengan percent
- Anti-pattern fixed: replace SEMUA emoji decor Phase 1 (🚇🛒📚 polling, ✅🔄
  status, 📋🚇💻 petisi, 🔍📱🌾 kampanye) dengan Lucide icon proper
- 3 test baru: deadline parser, sign-petisi-button states, polling-result-bars
- Per Spec #10 + decisions Mas (text-only polling + Lucide, login required,
  basic counter Sprint 3)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

## WAJIB INCLUDE spec file

```bash
git add \
  apps/web/src/app/aksi/ \
  apps/web/src/lib/aksi/ \
  apps/web/src/__tests__/aksi-*.test.* \
  apps/web/src/__tests__/sign-petisi-button.test.tsx \
  apps/web/src/__tests__/polling-result-bars.test.tsx \
  specs/SPRINT-3/10-aksi.md
```

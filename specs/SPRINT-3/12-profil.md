# Spec #12 — Profil + KTP Warga (PasporPublic)

**Sprint**: 3
**Owner**: Claude Code (executor) · audited oleh planner
**Estimasi**: 2-3 jam
**Dependency**: Spec #6, #6.5, pattern dari #7-#11
**Decisions Mas (approved 2026-05-01):**
1. ✅ KTP Warga = paspor digital design (4 tab: Cover / Identitas / Stempel / Visa) — port konsep Phase 1 PasporFlip
2. ✅ Profil owned (`/profil`) — own user, dengan edit profile + paspor preview + kontribusi stats
3. ✅ Profil public (`/u/[username]`) — view-only, share-able, untuk lihat kreator lain (defer Follow system Sprint 4)

**Required reading sebelum mulai:**
1. `CLAUDE.md` — operating manual + Section 5.4b brand emoji policy
2. `apps/legacy/src/pages/profil/Index.jsx` — Phase 1 PasporFlip 4-tab reference
3. `apps/legacy/src/pages/profil/PasporPublic.jsx` — Phase 1 public view
4. `specs/SPRINT-3/07-11` — pattern reference
5. `apps/web/components/beranda/hello-user.tsx` — current user pattern
6. `packages/data/src/queries.ts` — profile queries (kalau ada, atau direct supabase)
7. `packages/data/src/types.ts` — Profile, Badge, UserBadge, GameScore

---

## Goal

Port halaman Profil + KTP Warga dari Phase 1 ke Phase 2:
- **Own profile** (`/profil`) — sidebar edit profile + tab navigation: KTP Warga (paspor 4-tab) / Kontribusi (stats) / Pengaturan
- **Public profile** (`/u/[username]`) — view-only paspor + kontribusi public (thread, karya, kelas selesai) + share button

Setelah spec ini selesai:
- Header avatar dropdown link ke `/profil`
- User bisa edit profile (name, bio, chapter, avatar)
- Paspor digital render dengan 4 tab interactive
- Public profile shareable via URL

## Konteks

KTP Warga adalah **identity differentiator** Jubir Warga — bukti partisipasi user dalam bentuk paspor digital yang bisa di-share publik. Phase 1 punya UX bagus dengan PasporFlip 4-tab (Cover, Identitas, Stempel, Visa).

🚨 **Anti-pattern Phase 1:**
- Phase 1 punya emoji decor di stamp icons → REPLACE dengan custom SVG (Sprint 4-5) atau Lucide interim (Sprint 3)

---

## File yang dibuat

```
apps/web/src/app/profil/
├── page.tsx                            Own profile — Server, auth gate
├── profile-tabs.tsx                    Client — 3 tab nav (KTP/Kontribusi/Pengaturan)
├── edit-profile-form.tsx               Client — Server Action update profile
├── paspor-flip.tsx                     Client — 4-tab paspor (Cover/Identitas/Stempel/Visa)
├── paspor-cover.tsx                    Server — page Cover SVG branded
├── paspor-identitas.tsx                Server — page Identitas (foto, nama, no. JW, chapter)
├── paspor-stempel.tsx                  Server — page Stempel (badge collection grid)
├── paspor-visa.tsx                     Server — page Visa (kontribusi history)
├── kontribusi-stats.tsx                Server — total thread/karya/petisi sign/janji follow/vote
└── pengaturan.tsx                      Server — settings placeholder (notif, privacy, dll)

apps/web/src/app/u/[username]/
├── page.tsx                            Public profile — Server, paspor + public stats
└── share-profile-button.tsx            Client — share URL paspor

apps/web/src/lib/profil/
├── constants.ts                        PASPOR_PAGES (4) + helpers
└── nomor-jw.ts                         generateJWNumber(userId, year) → "JW-2026-NNNN" format

apps/web/src/app/profil/
└── actions.ts                          updateProfileAction (Zod-validated)

apps/web/src/__tests__/
├── nomor-jw.test.ts                    Test JW number generator deterministic
├── paspor-flip.test.tsx                Test 4-tab navigation
└── kontribusi-stats.test.tsx           Test count aggregation
```

## File yang diubah

```
apps/web/src/components/site-header.tsx
  — Avatar dropdown link ke /profil + /u/[username] (View public profile)
```

---

## Step-by-step (skeleton — Claude Code adapt sesuai pattern)

### 1. Constants + helpers

**`apps/web/src/lib/profil/constants.ts`:**

```ts
export const PASPOR_PAGES = [
  { id: 'cover',     label: 'Cover'     },
  { id: 'identitas', label: 'Identitas' },
  { id: 'stempel',   label: 'Stempel'   },
  { id: 'visa',      label: 'Visa'      },
] as const;

export type PasporPageId = typeof PASPOR_PAGES[number]['id'];
```

**`apps/web/src/lib/profil/nomor-jw.ts`:**

```ts
/**
 * Deterministic JW number generator.
 * Format: JW-YYYY-NNNN (4 digit hash dari user_id)
 * 
 * Sprint 3: pakai hash deterministik dari user_id.
 * Sprint 4: migrate ke serial number tracked di DB (table `jw_passport_numbers`).
 */
export function generateJWNumber(userId: string, year: number): string {
  // Simple deterministic hash dari user_id (UUID)
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash |= 0;
  }
  const num = Math.abs(hash) % 9999;
  return `JW-${year}-${String(num).padStart(4, '0')}`;
}
```

### 2. Server Actions

**`apps/web/src/app/profil/actions.ts`:**

```ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const updateSchema = z.object({
  name:       z.string().trim().min(2, 'Nama minimal 2 karakter').max(60),
  username:   z.string().trim().regex(/^[a-z0-9_]{3,20}$/, 'Username 3-20 char lowercase/angka/underscore'),
  bio:        z.string().trim().max(280, 'Bio max 280 karakter').optional(),
  chapter_id: z.string().optional(),
});

export type ActionResult = { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function updateProfileAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = updateSchema.safeParse({
    name:       formData.get('name'),
    username:   formData.get('username'),
    bio:        formData.get('bio') || undefined,
    chapter_id: formData.get('chapter_id') || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: 'Validasi gagal', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/masuk?redirect=/profil');

  // Check username unique
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', parsed.data.username)
    .neq('id', user.id)
    .maybeSingle();

  if (existing) {
    return { ok: false, error: 'Username sudah dipakai', fieldErrors: { username: ['Pilih username lain'] } };
  }

  const { error } = await supabase
    .from('profiles')
    .update(parsed.data)
    .eq('id', user.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/profil');
  return { ok: true };
}
```

### 3. Own profile page

**`apps/web/src/app/profil/page.tsx`:**

```tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProfileTabs } from './profile-tabs';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';

export default async function ProfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/masuk?redirect=/profil');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/masuk?redirect=/profil');

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <header className="mb-6 flex items-center gap-4">
        <div className="flex-1">
          <span className="font-hand text-jw-coral text-base">— akunmu</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-jw-blue">
            {profile.name ?? profile.username ?? 'Warga'}
          </h1>
          <p className="text-sm text-jw-muted">@{profile.username} · Level {profile.level}</p>
        </div>
        {profile.username && (
          <a
            href={`/u/${profile.username}`}
            className="text-sm font-semibold text-jw-coral hover:underline"
          >
            Lihat profil publik →
          </a>
        )}
      </header>

      <ProfileTabs profile={profile} userId={user.id} />

      <NalaTriggerButton context="tentang Profil" />
    </div>
  );
}

export const metadata = { title: 'Profil — Jubir Warga' };
```

### 4. ProfileTabs (Client) + child Server Components

**`profile-tabs.tsx`** — Client, 3 tab: KTP / Kontribusi / Pengaturan. Render PasporFlip + KontribusiStats + Pengaturan based on active tab.

**`paspor-flip.tsx`** — Client, 4 tab: Cover / Identitas / Stempel / Visa. State page index. Render child server components.

**`paspor-cover.tsx`** — Server, render: blue card 5/7 aspect ratio, "PASPOR WARGA" coral kicker, "Jubir Warga" Vollkorn italic, JW logo crest SVG, JW number, "Suara warga, rumahnya disini" tagline.

**`paspor-identitas.tsx`** — Server, render: foto avatar (DiceBear or upload), nama, username, JW number, chapter, level, joined date.

**`paspor-stempel.tsx`** — Server, render: grid badges yang sudah didapat (query `user_badges` join `badges`). Empty state: "Belum ada stempel — mulai kontribusi untuk dapat badge pertama".

**`paspor-visa.tsx`** — Server, render: kontribusi history list (thread/karya/petisi sign/janji follow/vote/kelas enrolled) chronological — bukti perjalanan partisipasi.

### 5. KontribusiStats + Pengaturan

**`kontribusi-stats.tsx`** — Server, query 5 stat parallel:
- thread count
- karya count (kalau ada)
- petisi sign count
- janji follow count
- kelas enrolled count + completed count

Render stat cards grid 2x3 atau 3x2 dengan Lucide icon per kategori.

**`pengaturan.tsx`** — Server, render placeholder section: "Notifikasi (Sprint 4)", "Privasi (Sprint 4)", "Logout button" (functional).

### 6. Public profile

**`apps/web/src/app/u/[username]/page.tsx`:**

```tsx
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PasporFlip } from '@/app/profil/paspor-flip';
import { KontribusiStats } from '@/app/profil/kontribusi-stats';
import { ShareProfileButton } from './share-profile-button';

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (!profile || profile.is_anonim) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <span className="font-hand text-jw-coral text-base">— warga</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-jw-blue">
            {profile.name ?? profile.username}
          </h1>
          <p className="text-sm text-jw-muted">@{profile.username} · Level {profile.level}</p>
          {profile.bio && <p className="text-base text-jw-ink/80 mt-3 max-w-xl">{profile.bio}</p>}
        </div>
        <ShareProfileButton username={profile.username ?? ''} />
      </header>

      <section className="mb-8">
        <PasporFlip profile={profile} publicView />
      </section>

      <section>
        <h2 className="font-display text-xl font-bold text-jw-blue mb-3">Kontribusi publik</h2>
        <KontribusiStats userId={profile.id} publicView />
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return { title: `@${username} — Profil Jubir Warga` };
}
```

### 7. Tests (3 baru)

- **`nomor-jw.test.ts`** — deterministic JW number (same userId+year = same output, different userId = different)
- **`paspor-flip.test.tsx`** — 4-tab navigation render
- **`kontribusi-stats.test.tsx`** — count aggregation accuracy

---

## Acceptance checklist

- [ ] `/profil` (logged out): redirect `/masuk?redirect=/profil`
- [ ] `/profil` (logged in): render header + 3 tab + paspor flip + kontribusi + pengaturan
- [ ] Tab nav switch jalan
- [ ] PasporFlip 4 tab interactive (Cover/Identitas/Stempel/Visa)
- [ ] Cover: blue card, Vollkorn italic "Jubir Warga", JW logo, JW number unique per user
- [ ] Identitas: avatar, nama, username, JW number, chapter, level, joined date
- [ ] Stempel: grid badges (atau empty state)
- [ ] Visa: kontribusi history chronological
- [ ] Edit profile form: name + username + bio + chapter, validation Zod
- [ ] Username unique check
- [ ] KontribusiStats: 5 metric cards (thread/karya/petisi/janji/kelas)
- [ ] `/u/[username]` (existing user): render paspor public + kontribusi public
- [ ] `/u/[username]` (anonim/notfound): 404
- [ ] Share profile button: Web Share API + clipboard fallback
- [ ] Header avatar dropdown link ke `/profil`
- [ ] Floating "Tanya Nala tentang Profil" coral pill
- [ ] `pnpm test` pass dengan 3 test baru → total 123+
- [ ] `pnpm typecheck` + `pnpm lint` pass

## Out of scope (defer Sprint 4+)

- ❌ Follow system (`/u/[username]` follow button) — Sprint 4
- ❌ Avatar upload (Supabase Storage) — Sprint 4 (sekarang DiceBear API generated)
- ❌ Notification settings — Sprint 4
- ❌ Privacy settings (private profile, hide stats) — Sprint 4
- ❌ Account deletion + data export (UU PDP) — Sprint 5
- ❌ 2FA — Sprint 6+
- ❌ Achievement notification toast — Sprint 4
- ❌ JW Number serial DB-tracked — Sprint 4 (sekarang hash deterministik)

## Commit message

```
feat(profil): port own + public profile dengan paspor digital 4-tab

- /profil — own profile, auth gate, 3 tab (KTP/Kontribusi/Pengaturan),
  PasporFlip dengan Cover/Identitas/Stempel/Visa, edit profile form Zod
- /u/[username] — public profile shareable, paspor + kontribusi public
- generateJWNumber(userId, year) deterministic hash → "JW-2026-NNNN"
- updateProfileAction: username unique check, Zod validation
- 3 test baru: nomor-jw deterministic, paspor-flip nav, kontribusi-stats agg
- Per Spec #12 + decisions Mas

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

## WAJIB INCLUDE spec file

```bash
git add apps/web/src/app/profil/ apps/web/src/app/u/ apps/web/src/lib/profil/ \
        apps/web/src/__tests__/{nomor-jw,paspor-flip,kontribusi-stats}.test.* \
        specs/SPRINT-3/12-profil.md
```

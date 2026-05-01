# `@jubirwarga/data` — Data Layer Package

Type-safe data layer untuk Jubir Warga, framework-agnostic.
Bisa dipakai dari Next.js (Phase 2), React Native (Phase 3), atau wire ke beta lama via mock adapter.

## Struktur

```
packages/data/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts        # barrel export
    ├── types.ts        # TypeScript types (mirror Supabase schema)
    ├── schemas.ts      # Zod runtime validation untuk form
    ├── client.ts       # Supabase client init + auth helper
    ├── queries.ts      # Pure query functions (typed)
    ├── hooks.ts        # React Query hooks (TanStack Query)
    └── mock.ts         # Fallback ke window.JWData (untuk beta lama)
```

## Regenerate Database type

`packages/data/src/database.types.ts` adalah auto-generated. Re-run setelah ada
migration baru:

```bash
supabase gen types typescript --project-id ifrautpvbhdbhieystxk > packages/data/src/database.types.ts
```

Domain types di `types.ts` boleh di-extend manual untuk TypeScript-friendly
aliases (mis. `Thread`, `PetisiWithProgress`).

> Catatan: PowerShell `>` default-nya UTF-16 LE. Kalau hasil generate baca
> "garbled / interleaved nulls" di TypeScript, convert dengan:
> `[System.IO.File]::WriteAllText($path, [IO.File]::ReadAllText($path), [System.Text.UTF8Encoding]::new($false))`

## Quick start (Phase 2 Next.js)

### 1. Install peer deps
```bash
pnpm add @supabase/supabase-js @tanstack/react-query react zod
```

### 2. Init di app provider
```tsx
// apps/web/app/providers.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initJWClient } from '@jubirwarga/data';

initJWClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
});

const qc = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000 } }
});

export function Providers({ children }) {
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}
```

### 3. Pakai hooks di page
```tsx
// apps/web/app/aksi/page.tsx
import { hooks } from '@jubirwarga/data';

export default function AksiPage() {
  const { data: petisi, isLoading } = hooks.usePetisiList();
  if (isLoading) return <Skeleton />;
  return petisi?.map(p => <PetisiCard key={p.id} petisi={p} />);
}
```

### 4. Form + mutation
```tsx
import { hooks, schemas } from '@jubirwarga/data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export function FormLaporBaru() {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schemas.submitLaporanSchema)
  });
  const submit = hooks.useSubmitLaporan();

  return (
    <form onSubmit={handleSubmit(d => submit.mutate(d))}>
      <input {...register('title')} />
      {formState.errors.title && <p>{formState.errors.title.message}</p>}
      <button type="submit" disabled={submit.isPending}>
        {submit.isPending ? 'Mengirim...' : 'Kirim Laporan'}
      </button>
    </form>
  );
}
```

## Wire ke beta lama (opsional bridge)

Beta sekarang pakai `window.JWStore` + localStorage. Kalau mau migrate gradual, bisa pakai `mockClient` sebagai fallback:

```js
// src/lib/data-bridge.js (di beta lama)
async function signPetisi(petisiId) {
  if (window.SupabaseClient) {
    // Real backend
    const { signPetisi } = await import('/packages/data/src/queries.js');
    return signPetisi(petisiId);
  } else {
    // Fallback ke localStorage (sekarang)
    return window.JWStore.actions.sign(petisiId);
  }
}
```

## API Surface

### Auth
- `initJWClient({ supabaseUrl, supabaseAnonKey })` — sekali di app init
- `getJWClient()` — get singleton
- `getCurrentUser()` — async, return User | null
- `onAuthChange(callback)` — subscribe auth state

### Queries (pure async functions)
**Threads:** `listThreads`, `getThread`, `submitThread`, `submitReply`, `voteThread`
**Petisi:** `listPetisi`, `getPetisi`, `signPetisi`, `isPetisiSigned`, `submitPetisi`
**Janji:** `listJanji`, `getJanji`, `submitJanji`, `followJanji`, `getJanjiEvidence`, `listPejabat`, `getPejabat`
**Karya:** `listKarya`, `getKarya`, `submitKarya`
**Kelas:** `listKelas`, `getKelas`, `getKelasModul`, `enrollKelas`, `updateKelasProgress`
**Laporan:** `listLaporan`, `getLaporan`, `submitLaporan`, `dukungLaporan`
**Polling:** `listPolling`, `votePolling`
**Profile:** `getMyProfile`, `getProfile`, `updateMyProfile`, `getMyBadges`
**Game:** `recordGameScore`, `getLeaderboard`
**Reference:** `listChapters`, `listTopics`, `listBadges`

### Hooks (React Query wrapper)
Sama seperti queries, tapi dengan caching/retry/optimistic. Pattern: `useThreads`, `useThread`, `useSignPetisi`, dst. Lihat `hooks.ts`.

### Schemas (Zod validation)
- `submitThreadSchema`, `submitReplySchema`, `submitKaryaSchema`
- `submitJanjiSchema`, `submitLaporanSchema`, `submitPetisiSchema`
- `updateProfileSchema`, `votePollingSchema`

Plus type exports: `SubmitThreadInput`, dst.

## Type Safety Flow

```
DB Schema (SQL)
  ↓
TypeScript types (types.ts) — manual mirror
  ↓
Query functions (queries.ts) — typed input/output
  ↓
React hooks (hooks.ts) — typed UI integration
  ↓
Form (Zod schemas.ts) — typed form validation
  ↓
React Hook Form + zodResolver — end-to-end safety
```

Perubahan schema DB → update types.ts → TypeScript compile error muncul di setiap tempat yang kena → refactor terjamin.

## Migration ke auto-gen types (opsional)

Saat Supabase live, ganti `types.ts` dengan auto-gen:
```bash
supabase gen types typescript --project-id <ID> > src/database.types.ts
```
Lalu di file lain pakai `import { Database } from './database.types'`.

## Catatan

- Semua query function **throw error**, tidak return error object. Pakai try/catch atau React Query `error` state.
- Hooks otomatis cache + invalidate via `qk` key factory. Lihat invalidation pattern di `hooks.ts`.
- `mockClient` adalah escape hatch untuk dev offline / testing tanpa Supabase.
- `initJWClient` MUST dipanggil sebelum query function/hook digunakan.
- Auth-required functions (sign, vote, submit) auto-throw `'Auth required'` kalau user belum login.

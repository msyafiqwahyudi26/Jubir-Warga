# Spec #6 — Supabase typegen untuk views (fix typecheck errors)

**Sprint**: 3
**Owner**: Claude Code (executor) · audited oleh planner
**Estimasi**: 30-45 menit
**Dependency**: Tidak ada blocking. Self-contained.
**Required reading**: `packages/data/src/types.ts`, `packages/data/src/client.ts`, `apps/web/src/lib/supabase/server.ts`, `apps/web/src/components/beranda/petisi-preview.tsx`, BACKLOG.md ("Supabase typegen untuk views")

---

## Goal

Generate `Database` type langsung dari Supabase project schema (lewat CLI), replace hand-written `Database` interface di `packages/data/src/types.ts`, dan fix pre-existing typecheck errors di `apps/web/src/components/beranda/petisi-preview.tsx`.

Setelah spec ini selesai:
- `pnpm --filter @jw/web typecheck` pass tanpa error
- Page port Sprint 3 berikutnya (Spec #7-12) bisa pakai view types dengan aman
- Future schema change → re-run gen → types auto-update (tidak perlu manual sync)

## Konteks

Per Sprint 2 STATUS.md, tracking issue:
> Pre-existing errors in `beranda/*` and `lib/supabase/*` are unrelated to this spec.

Penyebab confirmed via planner audit (2026-05-01):
- `packages/data/src/types.ts` line 281-313 punya hand-written `Database` interface
- `Views` section format-nya `{ Row: PetisiWithProgress }` — TANPA `Insert/Update/Relationships` keys
- Supabase JS v2.46+ butuh full table-shape (Row + Insert + Update + Relationships) untuk Views juga
- Akibat: `.from('petisi_with_progress').select('*')` infer ke `never` → `current_count' does not exist`

BACKLOG.md eksplisit menjadwalkan spec ini sebagai "Sprint 3 awal — sebelum port halaman tambahan yang query views".

---

## File yang dibuat

```
packages/data/src/
└── database.types.ts          NEW — auto-generated dari `supabase gen types typescript`
```

## File yang diubah

```
packages/data/src/
├── types.ts                   MODIFY — hapus hand-written Database interface (line 281-313),
│                              import Database dari ./database.types, re-export
├── client.ts                  REVIEW — pastikan import Database dari './types' (atau './database.types')
                               masih jalan
```

```
apps/web/src/lib/supabase/
├── server.ts                  REVIEW — import Database dari '@jw/data/types' masih jalan
├── client.ts                  REVIEW — sama
└── middleware.ts              REVIEW — sama
```

```
apps/web/src/components/beranda/
└── petisi-preview.tsx         VERIFY — typecheck error harus auto-resolve setelah Database type di-update
```

## File yang TIDAK boleh diubah

- `supabase/migrations/0001_init.sql`, `0002_demo_mode.sql`, `0003_fix_handle_new_user.sql` — immutable
- Domain types di `packages/data/src/types.ts` (Profile, Thread, Petisi, dll line 1-280) — tetap ada sebagai aliases untuk app-side imports

---

## Step-by-step

### 1. Install Supabase CLI (kalau belum ada)

Cek dulu:
```powershell
supabase --version
```

Kalau "not recognized":
```powershell
# Via Scoop (recommended Windows)
scoop install supabase

# Atau via npm
npm install -g supabase
```

Verifikasi: `supabase --version` → harus tampil v1.x atau lebih baru.

### 2. Login ke Supabase (sekali saja)

```powershell
supabase login
```

Browser akan terbuka, klik "Authorize". Token disimpan di `~/.supabase/access-token`.

### 3. Generate types

Di root repo (`C:\Users\Asus\Downloads\Prototipe Jubir Warga`):

```powershell
supabase gen types typescript --project-id ifrautpvbhdbhieystxk > packages/data/src/database.types.ts
```

Output: file `packages/data/src/database.types.ts` ~10-30 KB berisi:
```ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; username: string | null; ... }
        Insert: { id: string; username?: string | null; ... }
        Update: { id?: string; username?: string | null; ... }
        Relationships: [...]
      }
      threads: { ... }
      petisi: { ... }
      // ... semua table
    }
    Views: {
      petisi_with_progress: {
        Row: { id: string | null; current_count: number | null; ... }
        Relationships: [...]
      }
      threads_with_author: { ... }
      janji_with_pejabat: { ... }
    }
    Functions: {
      cleanup_demo_data: { Args: Record<string, never>; Returns: void }
      // ...
    }
    Enums: { ... }
  }
}
```

### 4. Update `packages/data/src/types.ts`

Hapus hand-written Database interface (line 281-313). Replace dengan re-export:

```ts
// At end of types.ts, replace lines 281-313:

// ─────────────────────────────────────────────────────────
// Database type — auto-generated dari Supabase CLI.
// Re-run: supabase gen types typescript --project-id ifrautpvbhdbhieystxk > packages/data/src/database.types.ts
// ─────────────────────────────────────────────────────────
export type { Database } from './database.types';
```

Domain types (Profile, Thread, Petisi, dll line 1-280) **tetap ada** karena app-side code import dari sini sebagai friendly aliases. Ini OK karena:
- Generated types pakai naming convention Supabase (lowercase, snake_case)
- Domain types kasih TypeScript-friendly camelCase + named interfaces
- Di hooks.ts / queries.ts / page.tsx, app pakai domain types (Profile, Thread)
- Di low-level Supabase client (`createClient<Database>()`), pakai generated Database type

### 5. Verifikasi imports masih jalan

`packages/data/src/client.ts` baris 7:
```ts
import type { Database } from './types';
```
Tidak perlu diubah — `Database` di-re-export dari `types.ts`.

`apps/web/src/lib/supabase/server.ts` baris 6:
```ts
import type { Database } from '@jw/data/types';
```
Tidak perlu diubah — sama.

Sama untuk `client.ts` + `middleware.ts` di `apps/web/src/lib/supabase/`.

### 6. Run typecheck

```powershell
pnpm --filter @jw/web typecheck
```

Expected: **0 errors**. Specifically:
- `apps/web/src/components/beranda/petisi-preview.tsx` line 12, 50, 53 → no longer error
- Tidak ada cascade error baru

Kalau muncul error baru di file lain (mis. `mock.ts` line 82 yang spread Petisi shape), itu wajar karena domain type vs generated type punya nullability beda. Fix per file:
- Mock shape mismatch → adjust mock.ts assertions ke `as Petisi` atau update domain type Petisi `current_count` jadi `number | null` mirror generated
- View query result lebih lenient (semua field nullable) → update consumer pakai `?? 0`, `?? ''`

### 7. Document re-gen procedure

Tambah note di `packages/data/README.md` (di atas section "Quick start"):

```markdown
## Regenerate Database type

`packages/data/src/database.types.ts` adalah auto-generated. Re-run setelah ada
migration baru:

\`\`\`bash
supabase gen types typescript --project-id ifrautpvbhdbhieystxk > packages/data/src/database.types.ts
\`\`\`

Gak perlu edit manual. Domain types di `types.ts` boleh di-extend manual untuk
TypeScript-friendly aliases (mis. `Thread`, `PetisiWithProgress`).
```

### 8. Lint

```powershell
pnpm --filter @jw/web lint
```

Expected: 0 new warnings/errors.

---

## Acceptance checklist

- [ ] `packages/data/src/database.types.ts` ada (>5 KB, contains `export type Database`)
- [ ] `packages/data/src/types.ts` line 281+ hand-written `Database interface` dihapus, replaced dengan `export type { Database } from './database.types'`
- [ ] Domain types (Profile, Thread, Petisi, dst) di `types.ts` tetap ada line 1-280
- [ ] `pnpm --filter @jw/web typecheck` pass dengan 0 errors
- [ ] `apps/web/src/components/beranda/petisi-preview.tsx` typecheck error resolved (no `current_count` does not exist)
- [ ] `pnpm --filter @jw/web lint` pass dengan 0 new warnings/errors
- [ ] Smoke test: `pnpm dev`, buka `http://localhost:3000`, Beranda render dengan PetisiPreview card visible (data dari Supabase view)
- [ ] `packages/data/README.md` punya section "Regenerate Database type"

## Out of scope

- ❌ Migrate domain types (Profile, Thread, dll) ke generated types — Sprint 4+
- ❌ CI step untuk auto-regen pada migration push — Sprint 4 (DevOps)
- ❌ Update `apps/legacy/*` (Phase 1) — out of scope sprint manapun

## Catatan untuk Sprint berikutnya

- Spec #7+ page port aman pakai view types (`PetisiWithProgress`, `ThreadWithAuthor`, `JanjiWithPejabat`) langsung tanpa cast.
- Kalau ada migration baru yang tambah view/table/function, re-run command di step 3 → commit `database.types.ts` updated.

## Commit message

```
chore(data): auto-generate Database type from Supabase, fix view typing

- Add packages/data/src/database.types.ts via `supabase gen types`
- Replace hand-written Database interface in types.ts with re-export
- Resolves pre-existing typecheck errors in beranda/petisi-preview.tsx
- Per BACKLOG.md (Sprint 3 awal precondition)

Co-Authored-By: Claude (Cowork planner) <noreply@anthropic.com>
```

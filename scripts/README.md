# scripts — demo seed tooling

Generate / cleanup 300 fake users + derived content (threads, replies, votes,
petisi sigs, janji follows, karya, laporan, polling votes, kelas enrollment, badges)
for the Phase 2 Supabase project.

All inserted rows are tagged `is_demo = true` (per migration `0002_demo_mode.sql`)
so they can be wiped in one transaction at production launch.

## Prereqs

- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set in `.env.local` at repo root.
- Migration 0001 + 0002 applied to the project.
- pnpm 9.12+, Node ≥20.11.

## Run

```bash
pnpm install                                  # one-time
pnpm tsx scripts/generate-demo-seed.ts        # ~5-8 min
```

The script is **idempotent-guarded** — if it sees any existing `is_demo=true`
profiles it aborts and asks you to run cleanup first.

## Cleanup

```bash
pnpm tsx scripts/cleanup-demo-seed.ts
```

Two phases:
1. Calls `public.cleanup_demo_data()` RPC → deletes all `is_demo=true` rows.
2. Lists `auth.users` and deletes anyone whose email ends with
   `@jubirwarga-demo.local` or `@demo.jubirwarga.id` via the Admin API.

## Distribution (per spec)

| Tier   | Count | Threads/user | Replies | Votes | Petisi | Janji follow | Karya | Laporan |
|--------|------:|-------------:|--------:|------:|-------:|-------------:|------:|--------:|
| Lurker |   240 |            0 |       0 |   0-1 |    1-3 |          0-1 |     0 |       0 |
| Medium |    45 |          1-3 |     3-8 |  5-15 |    2-5 |          2-4 |   0-1 |       0 |
| Power  |    15 |         5-15 |   15-30 | 20-50 |     4+ |          5+  |   1-3 | up to 1 |

Email pattern: `demo-NNN-<faker-username>@jubirwarga-demo.local` (non-deliverable).
Password: `Demo!Jubir2026` (uniform — never used for real login).
Avatar: DiceBear API `avataaars` SVG seeded by username (no real face photos).

## Trigger sanity check

The first `auth.admin.createUser` call doubles as a sanity probe. If the deployed
`handle_new_user()` trigger references the (non-existent) `badges` column on
`profiles`, the script exits with code 2 and prints the SQL to fix it. Apply the
fix in the Supabase SQL Editor, then re-run the generator.

## Determinism

`@faker-js/faker` is seeded with `20260429` so re-runs produce the same shape of
fake data (modulo Supabase-side UUIDs and timestamps). Override via `FAKER_SEED=…`
if you want a different sample.

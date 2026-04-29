# @jw/web — Jubir Warga Phase 2

Next.js 15 + TypeScript + Tailwind v4 + Supabase.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.6 strict mode
- **Styling**: Tailwind v4 + shadcn/ui
- **State**: TanStack Query (server) + Zustand (client UI)
- **Auth**: Supabase Auth (email/password, magic link, Google OAuth, WhatsApp OTP)
- **Backend**: Supabase (Postgres + Realtime + Storage)
- **Data layer**: `@jw/data` workspace package

## Develop

```bash
cp .env.example .env.local
# Isi NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY (lihat packages/data/.env.example)
pnpm dev
```

Open http://localhost:3000.

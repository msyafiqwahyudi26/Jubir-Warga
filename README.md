# Jubir Warga — Monorepo

Rumah online anak muda Indonesia 17–39 tahun: ngumpul, bersuara, berkarya, belajar.

```
jubir-warga/
├── apps/
│   ├── legacy/         Phase 1 — vanilla React via CDN, live di jubir.spdindonesia.org
│   └── web/            Phase 2 — Next.js 15 + Supabase (in development)
├── packages/
│   └── data/           Type-safe data layer (shared antara web + nanti mobile)
├── supabase/
│   ├── migrations/     SQL schema migrations
│   └── seed.sql        Dev/staging seed data
└── deploy/             VPS provisioning, nginx config, monitoring setup
```

## Getting Started

```bash
pnpm install
pnpm dev            # menjalankan apps/web (Next.js) di localhost:3000
```

## Supabase

Project: `ifrautpvbhdbhieystxk` · Region: ap-southeast-1 (Singapore)
URL: `https://ifrautpvbhdbhieystxk.supabase.co`

Apply schema:
```bash
# Lewat SQL Editor di dashboard, paste isi supabase/migrations/0001_init.sql
# Atau lewat CLI:
supabase link --project-ref ifrautpvbhdbhieystxk
supabase db push
```

## Phases

| Phase | Stack | Status | Deployed |
|---|---|---|---|
| 1 | Vanilla React + CDN | ✅ Live | jubir.spdindonesia.org |
| 2 | Next.js 15 + TS + Supabase | 🚧 Building | (TBD: app.jubir.spdindonesia.org) |
| 3 | Mobile app (React Native) | 📋 Planned | App Store + Play Store |

## License

© 2026 SPD Indonesia · See [apps/legacy/docs/LICENSE.md](apps/legacy/docs/LICENSE.md) for details.

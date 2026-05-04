# Spec #22 — Phase 2 deploy decision + execution (Vercel vs VPS)

**Sprint**: 3 (post-implementation)
**Owner**: Claude Code (executor) · audited oleh planner · CRITICAL Mas approval per decision tree
**Estimasi**: 2-3 jam (Vercel) atau 3-5 jam (VPS)
**Dependency**: Spec #18 ops setup (commit batch 1) sudah landed (Sentry env var pattern)
**Source**: AUDIT_PRE_BETA Tier 1 BLOCKER OPS-5, CLAUDE.md §2 "Deploy Phase 2: TBD Sprint 3"
**Window**: E (batch 2 paralel — deploy infra dedicated)

**Decisions Mas needed BEFORE eksekusi:**
1. ⚠️ **Vercel vs VPS Hostinger** — pilih platform deploy Phase 2
2. ⚠️ **Domain mapping** — `app.jubirwarga.id`, `beta.jubirwarga.id`, atau staging dulu di `*.vercel.app`
3. ⚠️ **Env var production** — Mas sudah punya: Supabase URL+anon key, Sentry DSN, Plausible domain?

**Required reading:**
1. `CLAUDE.md` §2 (deploy phase 2 TBD), §12 (Hostinger VPS IP, Supabase project ref)
2. `apps/legacy/deploy/*` — Phase 1 VPS setup reference
3. `.github/workflows/*` — existing CI/CD untuk Phase 1 (auto-deploy ke Hostinger)
4. AUDIT_PRE_BETA OPS-5 detail

---

## Goal

Deploy Phase 2 (`apps/web` Next.js) ke production environment yang stabil, observable, dan auto-deploy on push ke main. Pilihan deploy:

- **Option A: Vercel** — managed Next.js platform, fastest setup, cost predictable
- **Option B: Hostinger VPS** — same infra Phase 1, full control, cost minimal (sudah bayar)

Setelah spec ini selesai:
- URL production (atau staging) accessible publik
- Auto-deploy on push ke main via CI
- Env vars production set (Supabase, Sentry, Plausible)
- DNS pointing ke deploy target
- Smoke test pass: home page render, auth flow jalan, Sentry capture, Plausible track

---

## Decision tree

### Pertanyaan A: Cost vs operational simplicity

| | Vercel | VPS Hostinger |
|---|---|---|
| **Setup time** | 30 menit (auto Next.js detect) | 2-3 jam (Nginx + PM2 + SSL) |
| **Maintenance** | 0 (managed) | Ongoing (security patch, restart, log rotation) |
| **Cost (beta scale, < 100k MAU)** | Free tier sufficient | $5-10/bulan (sudah bayar) |
| **Cost (post-launch scale, > 1M MAU)** | $20-200+/bulan | $20-50/bulan (scale via VPS upgrade) |
| **Observability** | Built-in analytics + Vercel Logs | Manual setup (rotate, ship to Sentry) |
| **Geographic** | Global edge | Singapore (1 location) |
| **CI/CD** | Auto detect Git push, no config | GitHub Actions workflow custom (ada untuk Phase 1) |
| **Preview deploy** | Per PR auto preview URL | Manual setup |
| **SSL** | Auto Let's Encrypt | Manual cert renew (atau certbot auto) |
| **Image optimization** | Built-in `next/image` CDN | Self-host (sharp + Nginx cache) |

### Rekomendasi planner

**Vercel** untuk beta launch (Juni 2026) karena:
- Setup time 30 menit vs 2-3 jam VPS (time-pressured)
- Free tier cukup untuk beta scale
- Built-in preview deploy = QA flow lebih baik
- Image optimization auto = performance bonus
- Sentry + Plausible integration smooth

**Migrate ke VPS** post-launch kalau:
- Cost Vercel > $50/bulan (scale concern)
- Butuh full control (mis. custom Nginx rules, batch job)
- Audit security strict (data residency policy)

**Mas decision needed**: Vercel atau VPS? Default rekomendasi = **Vercel**.

---

## Path A: Deploy ke Vercel

### A1. Sign up + connect repo

1. https://vercel.com — sign in dengan GitHub account `msyafiqwahyudi26`
2. New Project → Import `Jubir-Warga` repo
3. Framework preset: Next.js (auto-detect)
4. Root directory: `apps/web` (monorepo)
5. Build settings:
   - Build command: `cd ../.. && pnpm install && pnpm --filter @jw/web build`
   - Output directory: `apps/web/.next`
   - Install command: `pnpm install --frozen-lockfile`

### A2. Env vars production

Di Vercel dashboard → Project → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://ifrautpvbhdbhieystxk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<dari Supabase dashboard>
SUPABASE_SERVICE_ROLE_KEY=<dari Supabase dashboard, server-only>

NEXT_PUBLIC_SENTRY_DSN=<dari Sentry project setting>
SENTRY_AUTH_TOKEN=<untuk source map upload, server-only>
SENTRY_ORG=spd-indonesia
SENTRY_PROJECT=jubir-warga-web

NEXT_PUBLIC_PLAUSIBLE_DOMAIN=<staging URL atau jubirwarga.id>

NEXT_PUBLIC_VERCEL_ENV=production  # auto-set by Vercel
```

Mark `NEXT_PUBLIC_*` sebagai "Public", sisanya "Server-only".

### A3. Domain mapping

**Option 1 (recommended for beta)**: Pakai `*.vercel.app` URL dulu (auto-generated, mis. `jubir-warga.vercel.app`). Free, no DNS setup.

**Option 2**: Custom subdomain `beta.jubirwarga.id`:
1. Buy domain `jubirwarga.id` (kalau belum)
2. Vercel dashboard → Domains → Add `beta.jubirwarga.id`
3. DNS provider: add CNAME record `beta` → `cname.vercel-dns.com`
4. Wait propagation 5-60 menit
5. SSL auto-issued by Vercel

**Mas decision needed**: pakai vercel.app dulu atau langsung custom domain?

### A4. CI/CD config

Vercel auto-deploy on push ke main + auto preview deploy per PR. **NO** GitHub Actions config needed.

Disable existing `.github/workflows/deploy-phase1.yml` saat phase 1 retire (Sprint 4+).

### A5. Smoke test post-deploy

1. Visit `https://jubir-warga.vercel.app` (atau custom domain)
2. Verify Beranda render
3. Test auth flow: Daftar, Masuk (email/password)
4. Test Komunitas → click thread → ThreadDetail render
5. Test Karya → click karya → ReadingView render
6. Test Tagih → click janji → JanjiDetail render
7. Test Main → Tebak Kata + Tebak Pejabat playable
8. Verify DevTools Network: 0 404, manifest.json 200, Sentry script load, Plausible script load
9. Trigger error sengaja (visit `/__error_test`) → verify Sentry capture di dashboard
10. Plausible dashboard: pageview event muncul

### A6. Monitoring setup

1. UptimeRobot (per Spec #18 runbook): tambah monitor URL production
2. Sentry: verify project active, alert routing email + WA
3. Plausible: dashboard accessible, real-time pageview muncul

---

## Path B: Deploy ke VPS Hostinger (kalau Mas pilih ini)

### B1. SSH access verify

```bash
ssh root@76.13.196.172
```

(Phase 1 VPS sudah setup per task #43)

### B2. Setup Phase 2 directory + Node 20.11

```bash
mkdir -p /var/www/jubir-warga-phase2
cd /var/www/jubir-warga-phase2
git clone https://github.com/msyafiqwahyudi26/Jubir-Warga.git .
nvm install 20.11
nvm use 20.11
npm install -g pnpm@9.12
pnpm install --frozen-lockfile
pnpm --filter @jw/web build
```

### B3. PM2 process manager

```bash
npm install -g pm2
cd /var/www/jubir-warga-phase2/apps/web
pm2 start "pnpm start" --name "jubir-warga-phase2" -p 3001
pm2 save
pm2 startup  # auto-start on reboot
```

### B4. Nginx reverse proxy

**`/etc/nginx/sites-available/jubir-warga-phase2`**:

```nginx
server {
    listen 443 ssl http2;
    server_name beta.jubirwarga.id;

    ssl_certificate /etc/letsencrypt/live/beta.jubirwarga.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/beta.jubirwarga.id/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}

server {
    listen 80;
    server_name beta.jubirwarga.id;
    return 301 https://$host$request_uri;
}
```

```bash
ln -s /etc/nginx/sites-available/jubir-warga-phase2 /etc/nginx/sites-enabled/
certbot --nginx -d beta.jubirwarga.id  # auto SSL
nginx -t && systemctl reload nginx
```

### B5. Env vars

**`/var/www/jubir-warga-phase2/apps/web/.env.production.local`**:

```
NEXT_PUBLIC_SUPABASE_URL=https://ifrautpvbhdbhieystxk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<value>
SUPABASE_SERVICE_ROLE_KEY=<value>
NEXT_PUBLIC_SENTRY_DSN=<value>
SENTRY_AUTH_TOKEN=<value>
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=beta.jubirwarga.id
```

`chmod 600` agar gak readable by other user.

Restart PM2:
```bash
pm2 restart jubir-warga-phase2
```

### B6. CI/CD GitHub Actions

**`.github/workflows/deploy-phase2.yml`**:

```yaml
name: Deploy Phase 2 to VPS

on:
  push:
    branches: [main]
    paths:
      - 'apps/web/**'
      - 'packages/data/**'
      - '.github/workflows/deploy-phase2.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/jubir-warga-phase2
            git pull origin main
            pnpm install --frozen-lockfile
            pnpm --filter @jw/web build
            pm2 restart jubir-warga-phase2
```

GitHub Secrets: VPS_HOST, VPS_USER, VPS_SSH_KEY.

### B7. Smoke test sama seperti Path A.5

---

## File yang dibuat (kedua path)

```
deploy/phase2/
├── README.md                   Decision rationale + setup runbook
├── env.production.example      Template env var production
└── (Vercel) vercel.json OR (VPS) nginx.conf + ecosystem.config.js

.github/workflows/
└── deploy-phase2.yml           HANYA kalau Path B (VPS)

docs/
└── DEPLOY_DECISION_2026-05-04.md   ADR (Architecture Decision Record)
```

## File yang diubah

```
apps/web/next.config.ts         (kalau VPS) configure standalone output, atau (Vercel) leave default
apps/web/.env.example           (kalau belum di-touch Spec #18) align dengan production var list
README.md                       Update deploy section
```

## File yang TIDAK diubah

- ❌ `apps/legacy/**` — Phase 1 tetap live di jubir.spdindonesia.org
- ❌ Apa pun yang Window A/B/C/D batch 2 lagi edit

---

## Acceptance checklist

- [ ] Decision Vercel vs VPS approved Mas, ADR ditulis di `docs/DEPLOY_DECISION_2026-05-04.md`
- [ ] Production URL accessible publik (vercel.app atau custom domain)
- [ ] Beranda render tanpa error
- [ ] Auth flow test pass (Daftar + Masuk)
- [ ] 6 page utama render: Komunitas, Karya, Kelas, Aksi, Tagih, Main
- [ ] 8 detail page render: ThreadDetail, KaryaDetail, KelasDetail, PetisiDetail, JanjiDetail, ProfilPaspor, TebakKata, TebakPejabat
- [ ] DevTools Network: 0 404, manifest.json + icons 200
- [ ] Sentry capture verify (trigger test error)
- [ ] Plausible script load + pageview tracked
- [ ] Auto-deploy on push ke main jalan (test push commit)
- [ ] DNS + SSL OK (kalau custom domain)
- [ ] UptimeRobot monitor active
- [ ] `docs/DEPLOY_DECISION_2026-05-04.md` ditulis lengkap

## Out of scope

- ❌ CDN setup (Cloudflare di depan) — Sprint 4
- ❌ Database backup automation — Sprint 4
- ❌ Disaster recovery runbook — Sprint 4
- ❌ Load testing pre-launch — separate spec
- ❌ Geo-replication Supabase — over-spec untuk beta

## Commit message

### Path A (Vercel)
```
feat(deploy): Phase 2 deploy ke Vercel

- Vercel project setup, monorepo Next.js auto-detect
- Build command: pnpm filter @jw/web build (root directory: apps/web)
- Env vars production: Supabase, Sentry, Plausible
- Domain: <vercel.app atau beta.jubirwarga.id>
- Auto-deploy on push to main + preview per PR
- ADR di docs/DEPLOY_DECISION_2026-05-04.md

Per Spec #22. Migrate ke VPS opsional post-launch kalau cost > $50/bulan.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

### Path B (VPS)
```
feat(deploy): Phase 2 deploy ke Hostinger VPS

- /var/www/jubir-warga-phase2 setup, Node 20.11 + pnpm 9.12 + PM2
- Nginx reverse proxy port 3001 → beta.jubirwarga.id
- SSL via Let's Encrypt (certbot auto)
- GitHub Actions deploy-phase2.yml auto-deploy on push to main
- Env vars production di .env.production.local (chmod 600)
- ADR di docs/DEPLOY_DECISION_2026-05-04.md

Per Spec #22. Same VPS infra Phase 1 (76.13.196.172).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

## Coordinate paralel — Window E territory

⚠️ POTENTIAL CONFLICT dengan Window 3 batch 1 (#18 ops):
- `.env.example` — Window 3 add Sentry/Plausible vars, Window E append production-specific (mostly compatible)
- `apps/web/next.config.ts` — Window 3 wrap withSentryConfig, Window E (Path B VPS) add `output: 'standalone'`. Edit additive.
- **Resolution**: Window E start AFTER Window 3 commit landed

⚠️ POTENTIAL CONFLICT dengan Window D batch 2 (#21 a11y):
- `apps/web/src/app/layout.tsx` — Window D add SkipLink + main id, Window E mungkin tidak edit layout (deploy infra mostly outside source code)
- **Resolution**: low risk

✅ Aman BARU: `deploy/phase2/`, `docs/DEPLOY_DECISION_2026-05-04.md`, `.github/workflows/deploy-phase2.yml` (kalau VPS), Vercel dashboard config (di luar repo).

**CRITICAL**: Mas approval **mandatory** sebelum:
1. Setup Vercel project (sign up, billing)
2. Modify DNS records
3. Apply env vars production (handle credentials)
4. Push deployment trigger first time

Window E prepare scaffold + config + ADR, Mas execute final activation step.

Pull-rebase reflex sebelum push.

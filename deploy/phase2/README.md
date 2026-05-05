# Phase 2 Deployment Kit — VPS Hostinger

**Target domain**: `jubirbetaapp.spdindonesia.org`
**VPS**: `76.13.196.172` (same Hostinger box as Phase 1)
**App path on VPS**: `/var/www/jubir-warga-phase2`
**App port (internal)**: `3001` (Phase 1 occupies 80/443; Next.js Node process listens on localhost:3001 behind Nginx reverse proxy)

> Decision rationale + alternatives considered: see `docs/DEPLOY_DECISION_2026-05-04.md`.
> Phase 1 rename plan (`jubir.spdindonesia.org` → `mockupjubir.spdindonesia.org`): see `PHASE1_RENAME.md`.
> Self-host monitoring (GlitchTip + Umami, replaces Sentry/Plausible SaaS per Spec #38): see `../self-host/README.md`.
> End-to-end launch checklist target 2026-06-02: see `docs/PHASE2_LAUNCH_2026-06-02.md`.

---

## Status

This kit is **scaffold only**. Files prepared, but production activation requires Mas to execute the SSH + DNS + env-var-fill steps below. Window E (Claude Code) prepared everything; Mas executes final activation.

| Step | Owner | Status |
|---|---|---|
| Scaffold files (this kit) | Claude Code | ✅ Done |
| Buy / verify domain `jubirbetaapp.spdindonesia.org` available on DNS provider | Mas | ⏳ Pending |
| DNS A record `jubirbetaapp` → `76.13.196.172` | Mas | ⏳ Pending |
| SSH ke VPS, jalankan setup commands (section 2) | Mas | ⏳ Pending |
| Fill `.env.production.local` di VPS | Mas | ⏳ Pending |
| Self-host GlitchTip + Umami live (per `../self-host/README.md`) | Mas | ⏳ Pending |
| Verify GlitchTip DSN + Umami website UUID registered | Mas | ⏳ Pending |
| GitHub repo secrets `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` (already exist for Phase 1 — reuse) | Mas | ✅ Already set |
| First deploy via `git push origin main` (auto-trigger) | Auto | ⏳ Pending |
| Smoke test (section 5) | Mas + Claude Code | ⏳ Pending |
| UptimeRobot monitor add | Mas | ⏳ Pending (per `deploy/runbooks/uptime-monitoring.md`) |

---

## 1. Pre-flight checklist (Mas)

Before SSH ke VPS:

- [ ] Domain `jubirbetaapp.spdindonesia.org` DNS A record → `76.13.196.172` (TTL 300, propagation <1 jam)
- [ ] SSH key untuk akses VPS sudah ada di laptop (Phase 1 already uses this)
- [ ] **Self-host GlitchTip live** di `glitchtip.spdindonesia.org` (per `deploy/self-host/README.md` §3) — DSN siap
- [ ] **Self-host Umami live** di `umami.spdindonesia.org` (per `deploy/self-host/README.md` §4) — website UUID siap
- [ ] (Legacy) Sentry SaaS — di-superseded oleh GlitchTip self-host per Spec #38; abaikan kalau Mas pakai self-host
- [ ] (Legacy) Plausible SaaS — di-superseded oleh Umami self-host per Spec #38
- [ ] Supabase anon key + service role key copy dari `https://supabase.com/dashboard/project/ifrautpvbhdbhieystxk/settings/api`

Verify DNS sebelum lanjut:
```bash
dig jubirbetaapp.spdindonesia.org +short
# expected: 76.13.196.172
```

---

## 2. VPS setup (Mas executes via SSH)

```bash
ssh root@76.13.196.172
```

### 2a. Install Node 20.11 + pnpm 9.12 + PM2 (kalau belum)

```bash
# Verify Node version
node -v
# Kalau belum 20.x, install via nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20.11
nvm use 20.11
nvm alias default 20.11

# pnpm via corepack (recommended) atau npm global
corepack enable
corepack prepare pnpm@9.12.0 --activate

# PM2 process manager
npm install -g pm2
```

### 2b. Clone repo + first build

```bash
mkdir -p /var/www/jubir-warga-phase2
cd /var/www/jubir-warga-phase2
git clone https://github.com/msyafiqwahyudi26/Jubir-Warga.git .

# Pin lockfile-strict install
pnpm install --frozen-lockfile

# Build (15-30 detik di VPS 8GB)
pnpm --filter @jw/web build
```

### 2c. Env vars production

Copy template ke real env file (server-only, NOT committed):

```bash
cp /var/www/jubir-warga-phase2/deploy/phase2/env.production.example \
   /var/www/jubir-warga-phase2/apps/web/.env.production.local
nano /var/www/jubir-warga-phase2/apps/web/.env.production.local
# Fill values:
#   NEXT_PUBLIC_SUPABASE_ANON_KEY (dari Supabase dashboard)
#   SUPABASE_SERVICE_ROLE_KEY      (dari Supabase dashboard, server-only)
#   NEXT_PUBLIC_SENTRY_DSN         (dari Sentry project setting)
#   SENTRY_AUTH_TOKEN              (dari Sentry org setting)
#   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=jubirbetaapp.spdindonesia.org

chmod 600 /var/www/jubir-warga-phase2/apps/web/.env.production.local
chown root:root /var/www/jubir-warga-phase2/apps/web/.env.production.local
```

### 2d. PM2 start

```bash
cd /var/www/jubir-warga-phase2
pm2 start deploy/phase2/ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root
# Copy + paste command yang muncul untuk auto-start on reboot
```

Verify alive:
```bash
pm2 status
# Expected: jubir-warga-phase2 online
curl -I http://localhost:3001
# Expected: HTTP/1.1 200 OK
```

### 2e. Nginx reverse proxy + SSL

```bash
# Copy config
cp /var/www/jubir-warga-phase2/deploy/phase2/nginx.conf \
   /etc/nginx/sites-available/jubir-warga-phase2

# Enable site
ln -s /etc/nginx/sites-available/jubir-warga-phase2 \
      /etc/nginx/sites-enabled/jubir-warga-phase2

# Test config (tanpa reload)
nginx -t

# Issue SSL via Let's Encrypt (interactive — pick your email + agree TOS)
certbot --nginx -d jubirbetaapp.spdindonesia.org

# certbot otomatis modify nginx config + reload. Verify:
systemctl status nginx
curl -I https://jubirbetaapp.spdindonesia.org
# Expected: HTTP/2 200
```

### 2f. Firewall (kalau UFW belum allow Nginx Full)

```bash
ufw status
# Kalau Nginx Full belum di-allow:
ufw allow 'Nginx Full'
```

---

## 3. CI/CD — auto-deploy on push to main

GitHub Actions workflow at `.github/workflows/deploy-phase2.yml` triggers on push to `main` yang nyentuh:
- `apps/web/**`
- `packages/data/**`
- `deploy/phase2/**`
- `.github/workflows/deploy-phase2.yml`

Workflow steps (di GitHub runner):
1. SSH ke VPS via `webfactory/ssh-agent` (reuse `VPS_SSH_KEY` secret dari Phase 1)
2. Di VPS: `git pull`, `pnpm install --frozen-lockfile`, `pnpm --filter @jw/web build`, `pm2 restart jubir-warga-phase2`

**Required GitHub secrets** (sudah ada untuk Phase 1, reuse):
- `VPS_SSH_KEY` — SSH private key
- `VPS_HOST` — `76.13.196.172` (atau hostname)
- `VPS_USER` — `root`

Manual trigger: Repository → Actions → "Deploy Phase 2 to VPS" → Run workflow.

---

## 4. Rollback

Kalau deploy fail:

```bash
ssh root@76.13.196.172
cd /var/www/jubir-warga-phase2

# Roll back to previous commit
git log --oneline -5
git reset --hard <previous-commit-sha>
pnpm install --frozen-lockfile
pnpm --filter @jw/web build
pm2 restart jubir-warga-phase2
```

Kalau PM2 crash loop:
```bash
pm2 logs jubir-warga-phase2 --lines 100
# Identify error; common: env var missing, port conflict
pm2 delete jubir-warga-phase2
pm2 start deploy/phase2/ecosystem.config.js
```

---

## 5. Post-deploy smoke test

Browser:
1. `https://jubirbetaapp.spdindonesia.org` — Beranda render, no console errors
2. `/komunitas` — thread list render, vote arrows responsive
3. `/karya` — karya grid render, hover lift smooth
4. `/kelas` — kelas grid render, FREE badge visible
5. `/aksi` — petisi + polling render
6. `/tagih` — janji tracker render
7. `/main` — Tebak Kata + Tebak Pejabat playable
8. `/masuk` — login form render (test daftar+masuk dengan dummy account)
9. `/profil` (logged in) — paspor render
10. `/__error_test` — sengaja trigger error → verify Sentry capture di `https://sentry.io/organizations/spd-indonesia/`

DevTools Network tab:
- 0 × 404 (manifest.json, icons all 200)
- Plausible script load `https://plausible.io/js/script.js`
- Sentry script load `*.sentry.io/...`
- Supabase auth cookie set after login

UptimeRobot:
- Add monitor URL `https://jubirbetaapp.spdindonesia.org` per `deploy/runbooks/uptime-monitoring.md`

---

## 6. Maintenance

### SSL renewal
Certbot auto-renew via systemd timer. Verify:
```bash
systemctl status certbot.timer
certbot renew --dry-run
```

### Log rotation
PM2 logs di `~/.pm2/logs/`. Setup logrotate:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Disk space monitoring
```bash
df -h
# Phase 1 + Phase 2 + Postgres (kalau co-host) — pantau /var partition
```

---

## 7. Future tasks (BACKLOG, not Sprint 3)

- [ ] Add `output: 'standalone'` to `apps/web/next.config.ts` for smaller deploy artifact (Sprint 4 — coordinate with Window 3 Sentry config)
- [ ] Cloudflare in front of VPS for free CDN + DDoS protection (Sprint 4)
- [ ] Database backup automation via `supabase db dump` cron (Sprint 4)
- [ ] Disaster recovery runbook (Sprint 4)
- [ ] Cutover redirect `mockupjubir.spdindonesia.org` → `jubirbetaapp.spdindonesia.org` 2 minggu post-stable (per ADR migration plan)

---

_Last updated: 2026-05-04 by Claude Code (Spec #22 scaffold). Activation pending Mas execution._

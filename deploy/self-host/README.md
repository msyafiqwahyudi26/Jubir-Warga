# Self-host monitoring — GlitchTip + Umami di VPS Hostinger

**Spec**: SPRINT-4 #38 — pivot dari Sentry/Plausible (paid SaaS) ke self-host (free, $0 cost tambahan).
**VPS**: `76.13.196.172` (same Hostinger box, parallel ke Phase 1 + Phase 2)
**Status**: Scaffold ready. Activation = Mas execute SSH + DNS + env-fill.

| Service | Domain | Port (loopback) | Replaces |
|---|---|---|---|
| GlitchTip | `glitchtip.spdindonesia.org` | `127.0.0.1:8000` | Sentry |
| Umami | `umami.spdindonesia.org` | `127.0.0.1:3000` | Plausible |

**Compatibility**:
- GlitchTip implements Sentry's event-ingest API. `@sentry/nextjs` SDK Phase 2 sudah pakai (per Spec #18) — **zero code change**, just point DSN ke GlitchTip URL.
- Umami uses different script tag pattern dari Plausible. **Apps code change required** untuk swap script (di luar Window E ownership; Window D atau follow-up window).

---

## 0. Pre-flight checklist (Mas)

- [ ] DNS A record `glitchtip.spdindonesia.org` → `76.13.196.172`
- [ ] DNS A record `umami.spdindonesia.org` → `76.13.196.172`
- [ ] DNS propagation verified: `dig glitchtip.spdindonesia.org +short` returns `76.13.196.172`
- [ ] SSH access ke VPS confirmed
- [ ] Disk space available: minimum 5GB free di `/opt` (postgres + redis + uploads)
- [ ] (Optional) SMTP relay credentials kalau mau enable email alert GlitchTip

---

## 1. Install Docker + docker-compose plugin (one-time)

```bash
ssh root@76.13.196.172

# Cek apakah sudah terinstall
docker --version || true
docker compose version || true

# Install kalau belum (Ubuntu 24.04)
apt update
apt install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

systemctl enable --now docker

# Verify
docker --version
docker compose version
```

---

## 2. Clone repo (kalau belum) — pull latest configs

```bash
cd /var/www/jubir-warga-phase2 || (mkdir -p /var/www/jubir-warga-phase2 && cd /var/www/jubir-warga-phase2 && git clone https://github.com/msyafiqwahyudi26/Jubir-Warga.git .)
git fetch origin main
git checkout main
git pull --ff-only origin main
```

---

## 3. Setup GlitchTip (Sentry-compatible error tracking)

### 3a. Copy compose + env

```bash
mkdir -p /opt/glitchtip/data/{postgres,redis,uploads}
cp /var/www/jubir-warga-phase2/deploy/self-host/glitchtip/docker-compose.yml /opt/glitchtip/
cp /var/www/jubir-warga-phase2/deploy/self-host/glitchtip/.env.example /opt/glitchtip/.env
```

### 3b. Generate secrets + fill .env

```bash
# SECRET_KEY (Django) — 50+ char URL-safe
python3 -c 'import secrets; print(secrets.token_urlsafe(50))'

# POSTGRES_PASSWORD — 32 byte base64
openssl rand -base64 32
```

Edit `/opt/glitchtip/.env`:
- `POSTGRES_PASSWORD=<generated>`
- `SECRET_KEY=<generated>`
- `EMAIL_URL=smtp://...` (optional, console:// for now)
- `ENABLE_USER_REGISTRATION=true` (sementara untuk first-run, lalu false)

```bash
chmod 600 /opt/glitchtip/.env
chown root:root /opt/glitchtip/.env
```

### 3c. Run migration + start stack

```bash
cd /opt/glitchtip

# Run migration first (one-shot)
docker compose run --rm migrate

# Start full stack
docker compose up -d

# Watch logs sampai web service "Listening on port 8000"
docker compose logs -f web
# Ctrl+C keluar setelah ready
```

Verify:
```bash
curl -I http://localhost:8000/
# expected: HTTP/1.1 302 Found (redirect ke /login/)

docker compose ps
# All services should be "Up" or "healthy"
```

### 3d. Create admin user

```bash
docker compose exec web ./manage.py createsuperuser
# Email: admin@spdindonesia.org
# Password: <strong>
```

### 3e. Disable signup (post-firstrun)

Edit `/opt/glitchtip/.env`: `ENABLE_USER_REGISTRATION=false`

```bash
docker compose up -d --force-recreate web worker
```

### 3f. Nginx + SSL

```bash
cp /var/www/jubir-warga-phase2/deploy/self-host/nginx/glitchtip.conf /etc/nginx/sites-available/glitchtip
ln -s /etc/nginx/sites-available/glitchtip /etc/nginx/sites-enabled/glitchtip
nginx -t

# Issue SSL — interactive
certbot --nginx -d glitchtip.spdindonesia.org

# Browser: https://glitchtip.spdindonesia.org → login dengan admin user
```

### 3g. Create project + grab DSN

Di GlitchTip dashboard:
1. Login as admin
2. Create organization "SPD Indonesia"
3. Create project "jubir-warga-web", platform "JavaScript / Next.js"
4. Copy DSN — format: `https://<key>@glitchtip.spdindonesia.org/<project_id>`
5. Paste ke `/var/www/jubir-warga-phase2/apps/web/.env.production.local` sebagai `NEXT_PUBLIC_SENTRY_DSN`

---

## 4. Setup Umami (Plausible-compatible analytics)

### 4a. Copy compose + env

```bash
mkdir -p /opt/umami/data/postgres
cp /var/www/jubir-warga-phase2/deploy/self-host/umami/docker-compose.yml /opt/umami/
cp /var/www/jubir-warga-phase2/deploy/self-host/umami/.env.example /opt/umami/.env
```

### 4b. Generate secrets + fill .env

```bash
# APP_SECRET (JWT signing) — 32 byte base64
openssl rand -base64 32

# HASH_SALT (visitor IP hashing) — UNIQUE 32 byte base64. NEVER reuse.
openssl rand -base64 32

# POSTGRES_PASSWORD — 32 byte base64
openssl rand -base64 32
```

Edit `/opt/umami/.env`:
- `POSTGRES_PASSWORD=<generated>`
- `APP_SECRET=<generated>`
- `HASH_SALT=<generated, MUST be different from APP_SECRET>`

```bash
chmod 600 /opt/umami/.env
chown root:root /opt/umami/.env
```

### 4c. Start stack

```bash
cd /opt/umami
docker compose up -d
docker compose logs -f umami
# Wait for "ready started server on 0.0.0.0:3000"

curl -I http://localhost:3000/
# expected: HTTP/1.1 200 OK or 302 ke login

docker compose ps
# postgres + umami should be "Up" / "healthy"
```

### 4d. Nginx + SSL

```bash
cp /var/www/jubir-warga-phase2/deploy/self-host/nginx/umami.conf /etc/nginx/sites-available/umami
ln -s /etc/nginx/sites-available/umami /etc/nginx/sites-enabled/umami
nginx -t

certbot --nginx -d umami.spdindonesia.org

# Browser: https://umami.spdindonesia.org
# Default login: admin / umami → CHANGE PASSWORD setelah login pertama
```

### 4e. Create website + grab tracking ID

Di Umami dashboard:
1. Login → Settings → Websites → Add website
2. Name: "Jubir Warga Beta"
3. Domain: `jubirbetaapp.spdindonesia.org`
4. Save → click website → Tracking code
5. Copy `data-website-id="<uuid>"`
6. Paste ke `/var/www/jubir-warga-phase2/apps/web/.env.production.local` sebagai `NEXT_PUBLIC_UMAMI_WEBSITE_ID`

**Catatan kode swap**: existing `apps/web/src/components/plausible-script.tsx` (per Spec #18) hardcoded ke `https://plausible.io/js/script.js`. Untuk pakai Umami, file itu perlu di-swap jadi:
```html
<script async defer src="https://umami.spdindonesia.org/script.js" data-website-id="<UUID>"></script>
```
Swap ini **di luar Window E ownership** (apps/web/src/ dimiliki window lain). Logged sebagai follow-up Window D atau separate spec.

---

## 5. Update Phase 2 env vars + restart

Edit `/var/www/jubir-warga-phase2/apps/web/.env.production.local`:

```ini
NEXT_PUBLIC_SENTRY_DSN=https://<key>@glitchtip.spdindonesia.org/<project_id>
NEXT_PUBLIC_UMAMI_DOMAIN=umami.spdindonesia.org
NEXT_PUBLIC_UMAMI_WEBSITE_ID=<uuid-from-umami-dashboard>

# Legacy (Plausible) — leave for now sampai script swap landed
# NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
```

Restart Phase 2 PM2:
```bash
pm2 restart jubir-warga-phase2 --update-env
pm2 logs jubir-warga-phase2 --lines 50
```

---

## 6. Backup strategy (kritikal — error data + analytics retention)

### 6a. Daily postgres dump cron

Buat `/opt/backup/backup.sh`:

```bash
#!/bin/bash
set -euo pipefail
BACKUP_DIR="/opt/backup/$(date +%Y-%m-%d)"
mkdir -p "$BACKUP_DIR"

# GlitchTip postgres
docker exec glitchtip-postgres-1 pg_dump -U glitchtip glitchtip | gzip > "$BACKUP_DIR/glitchtip-postgres.sql.gz"

# Umami postgres
docker exec umami-postgres-1 pg_dump -U umami umami | gzip > "$BACKUP_DIR/umami-postgres.sql.gz"

# Retain 7 days
find /opt/backup -maxdepth 1 -type d -mtime +7 -exec rm -rf {} +
```

```bash
chmod +x /opt/backup/backup.sh
crontab -e
# Add line:
0 3 * * * /opt/backup/backup.sh >> /var/log/backup.log 2>&1
```

### 6b. Off-site backup (Sprint 5)

Sprint 4 cukup local backup. Sprint 5: rsync ke S3-compatible (Hetzner Storage Box, Backblaze B2, atau second VPS). Out of scope sekarang.

---

## 7. Maintenance

### 7a. Update GlitchTip / Umami

```bash
# GlitchTip
cd /opt/glitchtip
docker compose pull
docker compose run --rm migrate
docker compose up -d --force-recreate

# Umami (auto-migration via app on startup)
cd /opt/umami
docker compose pull
docker compose up -d --force-recreate
```

### 7b. Disk usage monitoring

```bash
docker system df
df -h /opt
```

GlitchTip events bisa numpuk. Default retention 30 hari (configurable in admin → Org → Subscription). Worker celery beat job otomatis prune.

### 7c. Logs

```bash
# Nginx
tail -f /var/log/nginx/glitchtip.access.log
tail -f /var/log/nginx/umami.access.log

# Container logs
docker compose -f /opt/glitchtip/docker-compose.yml logs -f --tail 100
docker compose -f /opt/umami/docker-compose.yml logs -f --tail 100

# Backup log
tail -f /var/log/backup.log
```

---

## 8. Smoke test post-deploy

GlitchTip:
1. Browser `https://glitchtip.spdindonesia.org` → login OK
2. Project `jubir-warga-web` exists, DSN visible
3. From Phase 2 production: trigger `/api/_test/error` (atau visit `/__error_test`) → event muncul di GlitchTip dalam <30 detik

Umami:
1. Browser `https://umami.spdindonesia.org` → login OK (after password change)
2. Dashboard shows website "Jubir Warga Beta"
3. Visit Phase 2 `https://jubirbetaapp.spdindonesia.org` → pageview muncul real-time di Umami dashboard "Active visitors"

---

## 9. Rollback

Kalau salah satu service crash atau corrupt:

```bash
# Stop
docker compose -f /opt/<service>/docker-compose.yml down

# Restore postgres dari backup
zcat /opt/backup/<DATE>/<service>-postgres.sql.gz | \
  docker exec -i <service>-postgres-1 psql -U <service>

# Restart
docker compose -f /opt/<service>/docker-compose.yml up -d
```

Kalau bermasalah parah, untuk error tracking pivot sementara ke Sentry trial sambil debug. Phase 2 SDK works dengan keduanya — tukar `NEXT_PUBLIC_SENTRY_DSN` dan restart PM2.

---

## 10. Out of scope (defer Sprint 5)

- ❌ Off-site backup automation
- ❌ Multi-region replication
- ❌ Source map auto-upload via CI ke GlitchTip (nice-to-have, Spec #18 sudah configure SENTRY_AUTH_TOKEN — works dengan GlitchTip kalau token issued di GlitchTip's auth-token UI)
- ❌ Monitoring meta (UptimeRobot watching glitchtip.* + umami.* uptime) — add Sprint 4 final week
- ❌ Rate limiting di Nginx untuk Umami `/api/send` (DDoS protection) — Cloudflare prefered, defer
- ❌ Replace plausible-script.tsx → umami-script.tsx — separate Window D / follow-up window scope

---

_Last updated: 2026-05-05 by Claude Code (Spec #38 scaffold). Activation pending Mas execution._

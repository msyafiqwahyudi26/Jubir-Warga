# Phase 1 rename runbook — DEPRECATED (2026-05-05)

> **⚠️ STATUS: DEPRECATED**. Decision Mas 2026-05-05: cutover langsung Phase 1 → Phase 2 di `jubir.spdindonesia.org` (NO subdomain mockup). Phase 1 archive di Claude Design + `apps/legacy/` source di repo cukup.
>
> Doc ini di-preserve sebagai historical reference. **JANGAN execute** runbook di bawah.
>
> **Plan baru** (cutover langsung): see `deploy/phase2/README.md` + `docs/PHASE2_LAUNCH_2026-06-02.md`.

---

# (DEPRECATED) Phase 1 rename runbook — `jubir.spdindonesia.org` → `mockupjubir.spdindonesia.org`

> **STATUS**: Doc only. Mas executes manually via DNS provider + SSH ke VPS.
> **Why**: Repositioning Phase 1 sebagai legacy/mockup. Phase 2 (Next.js) jadi primary di `jubirbetaapp.spdindonesia.org`.
> **When**: Setelah Phase 2 deploy stable di VPS dan smoke test pass. Sebelum cutover full (target: 2 minggu post-stable per ADR `docs/DEPLOY_DECISION_2026-05-04.md`).
> **Risk**: Low — additive rename. Old URL tetap accessible selama dual-listing window.

---

## Goal

Phase 1 site terus accessible publik dari URL baru `mockupjubir.spdindonesia.org`. URL lama `jubir.spdindonesia.org` tetap respond (redirect atau dual-serve) sampai cutover final.

End state:
- ✅ `mockupjubir.spdindonesia.org` → Phase 1 vanilla site (existing `/var/www/jubirwarga`)
- ✅ `jubir.spdindonesia.org` → masih respond (dual-listed, atau redirect ke `jubirbetaapp.spdindonesia.org`)
- ✅ Both have valid SSL (Let's Encrypt)

---

## Pre-flight

- [ ] Phase 2 (`jubirbetaapp.spdindonesia.org`) sudah live + smoke test pass
- [ ] DNS provider akses (Hostinger / Niagahoster / wherever `spdindonesia.org` dikelola)
- [ ] SSH key VPS ready
- [ ] **Backup existing Nginx config** sebelum modify:
  ```bash
  ssh root@76.13.196.172
  cp /etc/nginx/sites-available/jubirwarga /etc/nginx/sites-available/jubirwarga.bak.$(date +%Y%m%d)
  ```

---

## Step 1 — DNS provider (Mas via dashboard)

Login ke DNS provider yang manage `spdindonesia.org` zone.

Tambah record BARU (jangan delete `jubir` dulu):

```
Type   Name          Value           TTL
A      mockupjubir   76.13.196.172   300
```

Verify propagation (5-60 menit):
```bash
dig mockupjubir.spdindonesia.org +short
# expected: 76.13.196.172
```

Existing record `jubir.spdindonesia.org → 76.13.196.172` **JANGAN dihapus** sampai cutover full. Both subdomain akan resolve ke VPS yang sama.

---

## Step 2 — Issue SSL untuk subdomain baru (SSH ke VPS)

```bash
ssh root@76.13.196.172

# Issue cert baru via certbot — dia auto-detect subdomain dari nginx
# Belum modify nginx config — certbot akan add sementara
certbot certonly --nginx -d mockupjubir.spdindonesia.org

# Verify cert issued
ls /etc/letsencrypt/live/mockupjubir.spdindonesia.org/
# expected: cert.pem  chain.pem  fullchain.pem  privkey.pem
```

---

## Step 3 — Update Nginx vhost (SSH ke VPS)

Option A (recommended) — **dual-listed**: kedua subdomain serve same content.

```bash
nano /etc/nginx/sites-available/jubirwarga
```

Modify `server_name` di TIGA blok (HTTP redirect + HTTPS) jadi:

```nginx
# HTTP → HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name jubir.spdindonesia.org mockupjubir.spdindonesia.org;
    return 301 https://$host$request_uri;
}

# HTTPS — main vhost
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name jubir.spdindonesia.org mockupjubir.spdindonesia.org;

    # Pakai cert yang sudah ada (jubir.*) — atau switch ke wildcard kalau punya.
    # Alternative: certbot --expand untuk gabung kedua domain ke satu cert.
    ssl_certificate     /etc/letsencrypt/live/jubir.spdindonesia.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jubir.spdindonesia.org/privkey.pem;
    # ... rest of config unchanged
}
```

**Atau** — gabung kedua domain ke satu cert (cleaner, recommended):

```bash
certbot --nginx --expand -d jubir.spdindonesia.org -d mockupjubir.spdindonesia.org
```

Certbot akan auto-modify nginx config + reload.

Option B — **redirect only**: `mockupjubir` jadi canonical, `jubir` redirect ke `mockupjubir`.

```nginx
# Redirect block — old jubir → new mockupjubir
server {
    listen 443 ssl http2;
    server_name jubir.spdindonesia.org;

    ssl_certificate     /etc/letsencrypt/live/jubir.spdindonesia.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jubir.spdindonesia.org/privkey.pem;

    return 301 https://mockupjubir.spdindonesia.org$request_uri;
}

# Main vhost — mockupjubir serves Phase 1 content
server {
    listen 443 ssl http2;
    server_name mockupjubir.spdindonesia.org;
    # ... existing config unchanged ...
}
```

**Recommendation**: Option A (dual-listed) selama 2 minggu transition window. Option B setelah stable.

---

## Step 4 — Test config + reload (SSH ke VPS)

```bash
nginx -t
# expected: syntax is ok ... test is successful

systemctl reload nginx
# expected: no output (success)
```

Verify:
```bash
curl -I https://mockupjubir.spdindonesia.org
# expected: HTTP/2 200

curl -I https://jubir.spdindonesia.org
# expected: HTTP/2 200 (Option A) atau HTTP/2 301 → mockupjubir (Option B)
```

Browser smoke test:
- `https://mockupjubir.spdindonesia.org` → Phase 1 landing render OK
- `https://jubir.spdindonesia.org` → Phase 1 landing render OK (Option A) or auto-redirect (Option B)

---

## Step 5 — Update GitHub Actions deploy (optional)

`.github/workflows/deploy.yml` (Phase 1 deploy) saat ini punya:
```yaml
ssh-keyscan -H jubir.spdindonesia.org >> ~/.ssh/known_hosts || true
```

Tambah baris untuk `mockupjubir`:
```yaml
ssh-keyscan -H mockupjubir.spdindonesia.org >> ~/.ssh/known_hosts || true
```

(non-critical — `|| true` udah bikin failure benign)

---

## Step 6 — UptimeRobot

Per `deploy/runbooks/uptime-monitoring.md`:

- [ ] Add monitor `https://mockupjubir.spdindonesia.org` (5 min interval)
- [ ] Keep existing monitor `https://jubir.spdindonesia.org` selama dual-listing window
- [ ] After cutover: pause monitor `jubir.spdindonesia.org` (don't delete — retain history)

---

## Step 7 — Cutover plan (2 minggu post Phase 2 stable)

**Trigger**: Phase 2 di `jubirbetaapp.spdindonesia.org` running 14 hari tanpa critical bug (P0 atau P1 unresolved).

Final state:
1. `jubir.spdindonesia.org` → 301 redirect ke `jubirbetaapp.spdindonesia.org`
2. `mockupjubir.spdindonesia.org` → Phase 1 (legacy/mockup, retained for reference)
3. `jubirbetaapp.spdindonesia.org` → Phase 2 (primary)

Update Nginx config jubir block:
```nginx
server {
    listen 443 ssl http2;
    server_name jubir.spdindonesia.org;
    return 301 https://jubirbetaapp.spdindonesia.org$request_uri;
    # SSL same as before
}
```

UptimeRobot: pause monitor `jubir.spdindonesia.org`.

---

## Rollback

Kalau ada masalah setelah Step 4:

```bash
ssh root@76.13.196.172

# Restore previous nginx config
cp /etc/nginx/sites-available/jubirwarga.bak.YYYYMMDD /etc/nginx/sites-available/jubirwarga
nginx -t && systemctl reload nginx
```

DNS rollback: hapus record `mockupjubir` di DNS provider. Old URL `jubir.spdindonesia.org` tetap intact (gak pernah di-touch).

---

## Out of scope

- ❌ Wildcard cert `*.spdindonesia.org` — over-spec. Per-subdomain cert via certbot --expand cukup.
- ❌ Cloudflare migration — Sprint 4
- ❌ Static export Phase 1 ke S3 — Sprint 5+ (kalau VPS retire)

---

_Last updated: 2026-05-04 by Claude Code (Spec #22 scaffold). Doc only — Mas executes._

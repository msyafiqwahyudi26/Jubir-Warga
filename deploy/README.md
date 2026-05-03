# Deployment Kit — VPS Hostinger

VPS: `76.13.196.172` · Ubuntu 24.04 LTS · 2 CPU / 8 GB RAM / 100 GB disk · Jakarta

Pilih path:
- **Stage 1 (HARI INI):** [Static + Nginx](#stage-1-deploy-prototipe-hari-ini-30-menit) — prototipe live dalam 30 menit
- **Stage 2 (Bulan depan):** [Coolify PaaS](#stage-2-coolify-paas--vercel-like-experience) — Next.js + Postgres + auto-deploy
- **Stage 3 (Tahun 1):** [Full architecture](#stage-3-full-architecture) — semua bell & whistle

---

## Stage 1: Deploy prototipe HARI INI (30 menit)

Tujuan: prototipe Jubir Warga live di `https://domain-kamu.id` malam ini juga.

### 1. Pointing domain ke VPS (5 menit)

Login ke registrar domain (Niagahoster/Domainesia/Hostinger Domain). Buka DNS settings.

Tambah 2 record:
```
Type   Name   Value           TTL
A      @      76.13.196.172   300
A      www    76.13.196.172   300
```

(Optional tapi recommended: pasang **Cloudflare** depan VPS untuk free CDN + DDoS protection. Set up DNS di Cloudflare, point domain registrar ke Cloudflare nameservers, baru add A record di Cloudflare.)

### 2. SSH ke VPS

```bash
ssh root@76.13.196.172
# password: yang sudah kamu set
```

### 3. Setup awal Ubuntu (10 menit)

```bash
# Update sistem
apt update && apt upgrade -y

# Install Nginx + Certbot (SSL gratis Let's Encrypt) + UFW (firewall)
apt install -y nginx certbot python3-certbot-nginx ufw

# Setup firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# Bikin folder web root
mkdir -p /var/www/jubirwarga
chown -R www-data:www-data /var/www/jubirwarga
```

### 4. Upload prototipe ke VPS (5 menit)

Dari laptop kamu (local terminal, BUKAN SSH):

```bash
# Pakai scp untuk upload semua file
cd "C:\Users\Asus\Downloads\Prototipe Jubir Warga"
scp -r * root@76.13.196.172:/var/www/jubirwarga/
```

Atau via Hostinger File Manager (web UI) kalau scp ribet.

### 5. Konfigurasi Nginx (5 menit)

Di SSH VPS:

```bash
nano /etc/nginx/sites-available/jubirwarga
```

Paste config berikut (ganti `domain-kamu.id`):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name domain-kamu.id www.domain-kamu.id;

    root /var/www/jubirwarga;

    # Standalone HTML adalah default
    index Jubir\ Warga\ -\ Standalone.html index.html;

    # Multi-file dev mode
    location / {
        try_files $uri $uri/ =404;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/html text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1000;

    # Cache static assets
    location ~* \.(jsx|css|png|jpg|svg|woff2)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable + test + reload:
```bash
ln -s /etc/nginx/sites-available/jubirwarga /etc/nginx/sites-enabled/
nginx -t  # test config (harus OK)
systemctl reload nginx
```

Sekarang prototipe sudah live di `http://domain-kamu.id` (HTTP belum HTTPS).

### 6. SSL gratis via Let's Encrypt (5 menit)

```bash
certbot --nginx -d domain-kamu.id -d www.domain-kamu.id

# Ikuti prompt:
# - Email kamu
# - Setuju TOS
# - Auto redirect HTTP→HTTPS: pilih 2 (recommended)
```

DONE. Buka `https://domain-kamu.id` — prototipe Jubir Warga LIVE dengan SSL gratis, auto-renew tiap 90 hari.

---

## Stage 2: Coolify PaaS (Vercel-like experience di VPS sendiri)

Saat butuh backend (Next.js + Postgres + AI Nala via Claude API), install Coolify untuk dashboard auto-deploy:

### Install Coolify (15 menit)

```bash
ssh root@76.13.196.172
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Akses dashboard: `http://76.13.196.172:8000` → setup admin account.

### Workflow setelah Coolify

1. Push code ke GitHub repo `jubirwarga`
2. Di Coolify dashboard: New Resource → Application → connect GitHub repo
3. Pilih: Next.js (auto-detect framework)
4. Set domain: `app.jubirwarga.id` atau langsung `jubirwarga.id`
5. SSL otomatis via Coolify (Let's Encrypt built-in)
6. Setiap `git push origin main` → auto-deploy dalam 2-3 menit

Plus services managed via Coolify:
- PostgreSQL (1 click install)
- Redis
- MinIO (S3-compatible storage)
- Backup ke S3/B2 cloud

---

## Stage 3: Full Architecture

Saat punya 5K+ WAC dan tim engineering 2-3 orang:

```
[Cloudflare]
   ↓
[VPS Hostinger]                [VPS Backup terpisah]
├── Coolify orchestrator       ├── Postgres replica
├── Next.js (PM2 cluster)      └── Storage backup
├── PostgreSQL (primary)
├── Redis cache
├── Pinecone (cloud, vector)
├── Inngest (cloud, jobs)
└── PostHog Analytics
```

Saat itu, mungkin pindah ke 2 VPS (1 web + 1 db). Atau upgrade KVM 4 (4 CPU / 16 GB).

---

## Domain & DNS Setup

Recommended: **Cloudflare di depan VPS** — free, 5 menit setup:

1. Daftar [cloudflare.com](https://cloudflare.com) (free)
2. Add site `jubirwarga.id`
3. Cloudflare scan DNS records existing
4. Cloudflare kasih 2 nameservers (mis. `kim.ns.cloudflare.com`)
5. Di registrar domain, ubah nameserver ke 2 yang Cloudflare kasih
6. Tunggu propagasi (1-24 jam, biasanya <1 jam)
7. Di Cloudflare dashboard, ubah DNS A record:
   ```
   A  @     76.13.196.172  Proxied (orange cloud) ✓
   A  www   76.13.196.172  Proxied (orange cloud) ✓
   ```
8. SSL/TLS settings: pilih **Full (strict)** setelah Let's Encrypt jalan di VPS

Manfaat Cloudflare:
- DDoS protection
- CDN cache (load lebih cepat untuk user di luar Jakarta)
- Bot protection
- Analytics
- Bisa proxy = IP VPS sembunyi
- WAF (firewall) rules

---

## Backup Strategy

### Bawaan Hostinger
- Snapshot otomatis (sudah ada 2 di account-mu) — daily auto kalau di-enable
- Bisa restore via dashboard

### Manual backup (sebelum perubahan besar)
```bash
# Backup files
tar -czf /root/backup-$(date +%Y%m%d).tar.gz /var/www/jubirwarga

# Backup database (kalau sudah ada Postgres)
sudo -u postgres pg_dump jubirwarga > /root/db-backup-$(date +%Y%m%d).sql

# Sync ke external (rsync ke server lain atau cloud storage)
rsync -avz /root/backup-*.tar.gz user@backup-server:/backups/
```

Auto-backup cron (tiap jam 2 pagi):
```bash
echo "0 2 * * * tar -czf /root/auto-backup-\$(date +\%Y\%m\%d).tar.gz /var/www/jubirwarga && find /root/auto-backup-*.tar.gz -mtime +7 -delete" | crontab -
```

---

## Monitoring (free tier)

- **Uptime Robot** ([uptimerobot.com](https://uptimerobot.com)) — ping setiap 5 menit, alert ke WhatsApp/email kalau down
- **Netdata** — install di VPS untuk dashboard metrik real-time:
  ```bash
  bash <(curl -Ss https://my-netdata.io/kickstart.sh) --dont-wait
  ```
  Akses `http://76.13.196.172:19999` (lindungi dengan firewall, atau hanya allow IP-mu)

---

## Security Checklist

```bash
# 1. Disable root SSH login (harus bikin user non-root dulu)
adduser deploy
usermod -aG sudo deploy
# copy ssh keys ke deploy user
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/ && chown -R deploy: /home/deploy/.ssh && chmod 600 /home/deploy/.ssh/authorized_keys
# Edit sshd_config: PermitRootLogin no, PasswordAuthentication no
nano /etc/ssh/sshd_config
systemctl restart ssh

# 2. Auto security updates
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

# 3. Fail2ban (block brute force SSH)
apt install -y fail2ban
systemctl enable --now fail2ban

# 4. UFW firewall (sudah di-enable di stage 1)
ufw status verbose
```

---

## CI/CD via GitHub Actions

Saat sudah pakai GitHub repo, auto-deploy ke VPS setiap push to main:

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to VPS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build standalone
        run: python3 build_standalone.py
      - name: Deploy via SSH
        uses: appleboy/scp-action@v0.1.7
        with:
          host: 76.13.196.172
          username: deploy
          key: ${{ secrets.SSH_KEY }}
          source: "./*"
          target: "/var/www/jubirwarga/"
      - name: Reload Nginx
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: 76.13.196.172
          username: deploy
          key: ${{ secrets.SSH_KEY }}
          script: sudo systemctl reload nginx
```

Setup `SSH_KEY` di GitHub repo Settings → Secrets.

---

## Rekomendasi Konkret

**Hari ini (30 menit):**
1. Setup DNS ke Cloudflare → VPS
2. Stage 1 deployment (script di atas)
3. Prototipe live di domain-mu malam ini

**Minggu ini:**
4. Install Coolify untuk DX yang lebih baik
5. Setup GitHub repo + push code
6. Setup auto-deploy via Coolify atau GitHub Actions

**Bulan ini:**
7. Migrate ke Next.js (App Router)
8. Setup PostgreSQL + Auth (Supabase Auth or NextAuth)
9. Connect Claude API untuk Nala AI
10. Soft launch beta ke alumni Jubir Warga 2024

**Need help?** Saya bisa:
- Bantu setup Stage 1 step-by-step (kamu copy-paste command, saya guide)
- Bikin Next.js boilerplate ready-to-deploy
- Setup GitHub Actions workflow
- Migrate prototipe ke Next.js

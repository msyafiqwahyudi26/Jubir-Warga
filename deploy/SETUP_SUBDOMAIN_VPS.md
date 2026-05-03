# Setup Jubir Warga sebagai Subdomain di VPS SPD

**Skenario:** VPS Hostinger sudah jalanin website SPD via Nginx. Kita tambah Jubir Warga sebagai subdomain (mis. `jubir.spdindonesia.org`) tanpa ganggu website SPD.

**VPS:** `76.13.196.172` (Ubuntu 24.04 + Nginx existing)

---

## Total waktu: ~30-45 menit

| Step | Waktu | Risiko ke SPD |
|---|---|---|
| 1. Backup Nginx config existing | 2 menit | 0 |
| 2. Tambah subdomain DNS | 5 menit (+ propagasi <1 jam) | 0 |
| 3. Bikin folder & upload prototipe | 10 menit | 0 |
| 4. Tambah Nginx server block baru | 5 menit | 0 (test dulu) |
| 5. Generate SSL untuk subdomain | 5 menit | 0 |
| 6. Test & verifikasi | 5 menit | 0 |

Website SPD existing **TIDAK kena impact** — kita cuma tambah server block baru, bukan modifikasi config SPD.

---

## Step 1 — BACKUP Nginx config existing (WAJIB pertama)

SSH ke VPS:
```bash
ssh root@76.13.196.172
```

Backup config & list site existing:
```bash
# Backup full Nginx config
mkdir -p /root/backups
tar -czf /root/backups/nginx-backup-$(date +%Y%m%d-%H%M).tar.gz /etc/nginx /var/www

# Lihat site yang sudah ada
ls -la /etc/nginx/sites-enabled/
ls -la /var/www/

# Lihat config SPD existing (untuk referensi pattern)
cat /etc/nginx/sites-enabled/*.conf 2>/dev/null || cat /etc/nginx/sites-enabled/*
```

**Catat output.** Kalau ada masalah nanti, restore via:
```bash
tar -xzf /root/backups/nginx-backup-YYYYMMDD-HHMM.tar.gz -C /
systemctl reload nginx
```

---

## Step 2 — Tambah DNS subdomain

Login ke registrar/Cloudflare/manage DNS panel domain SPD.

Tambah satu A record:
```
Type   Name      Value           TTL
A      jubir     76.13.196.172   300 (5 menit)
```

(Atau `beta` kalau mau `beta.spdindonesia.org`. Atau pakai domain Jubir Warga sendiri kalau sudah ada.)

Tunggu propagasi. Test dari VPS:
```bash
dig +short jubir.spdindonesia.org
# Harus return: 76.13.196.172
```

Kalau belum return, tunggu 5-30 menit lagi.

---

## Step 3 — Bikin folder & upload prototipe

Di VPS:
```bash
mkdir -p /var/www/jubirwarga
chown -R www-data:www-data /var/www/jubirwarga
chmod -R 755 /var/www/jubirwarga
```

Dari laptop lokal (cmd/PowerShell baru, BUKAN SSH):
```bash
cd "C:\Users\Asus\Downloads\Prototipe Jubir Warga"

# Upload via scp
scp -r * root@76.13.196.172:/var/www/jubirwarga/
```

Atau via Hostinger File Manager (web UI) kalau scp ribet.

Verify di VPS:
```bash
ls /var/www/jubirwarga/
# Harus ada: Jubir Warga - Standalone.html, index.html, *.jsx, dll
```

---

## Step 4 — Tambah Nginx server block (untuk subdomain)

Bikin config baru — TIDAK menyentuh config SPD existing:

```bash
nano /etc/nginx/sites-available/jubirwarga
```

Paste (ganti `jubir.spdindonesia.org` kalau pakai domain lain):

```nginx
# Jubir Warga — subdomain di VPS yang sama dengan SPD
server {
    listen 80;
    listen [::]:80;
    server_name jubir.spdindonesia.org;

    root /var/www/jubirwarga;
    index "Jubir Warga - Standalone.html" index.html;

    # Default ke standalone HTML (paling stabil)
    location = / {
        try_files /Jubir\ Warga\ -\ Standalone.html =404;
    }

    # Multi-file dev mode kalau ada yang akses langsung
    location / {
        try_files $uri $uri/ =404;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/html text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1000;
    gzip_vary on;

    # Cache static assets
    location ~* \.(jsx|css|png|jpg|svg|woff2|ico)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # Security: hide dotfiles (kecuali .well-known untuk Let's Encrypt)
    location ~ /\.(?!well-known) {
        deny all;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Logging terpisah dari SPD
    access_log /var/log/nginx/jubirwarga-access.log;
    error_log  /var/log/nginx/jubirwarga-error.log;
}
```

Enable & test:
```bash
# Enable site (symlink)
ln -s /etc/nginx/sites-available/jubirwarga /etc/nginx/sites-enabled/

# TEST CONFIG dulu — JANGAN langsung reload!
nginx -t
```

Output harus:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration test is successful
```

Kalau ada error — JANGAN reload, fix dulu config-nya. Site SPD masih aman pakai config lama.

Kalau OK, reload (zero downtime):
```bash
systemctl reload nginx
```

Sekarang `http://jubir.spdindonesia.org` sudah serve prototipe Jubir Warga. Tapi belum HTTPS.

**Cek website SPD masih jalan:**
```bash
curl -I http://spdindonesia.org
# Status 200 atau 301 = OK
```

---

## Step 5 — SSL gratis untuk subdomain

```bash
certbot --nginx -d jubir.spdindonesia.org \
  --non-interactive \
  --agree-tos \
  --email admin@spdindonesia.org \
  --redirect
```

Certbot auto-modify Nginx config untuk listen 443 + redirect HTTP → HTTPS. SPD yang existing **tidak terganggu** — Certbot hanya touch config Jubir Warga.

Test SSL:
```bash
curl -I https://jubir.spdindonesia.org
# Harus status 200
```

Auto-renew sudah di-setup oleh Certbot. Cek:
```bash
systemctl list-timers | grep certbot
```

---

## Step 6 — Verifikasi final

Buka di browser (laptop kamu):
1. **`https://spdindonesia.org`** — masih harus jalan normal (website SPD existing) ✓
2. **`https://jubir.spdindonesia.org`** — prototipe Jubir Warga muncul ✓

Kedua-duanya pakai SSL gratis Let's Encrypt, served dari VPS yang sama.

---

## Konsumsi resource (cek)

VPS sekarang:
```bash
# CPU & RAM
htop  # atau: top -b -n 1 | head -20

# Disk
df -h

# Bandwidth (bulan ini)
vnstat -m
```

Estimasi tambahan dari Jubir Warga static:
- RAM: ~10-50 MB (Nginx tambahan untuk static)
- Disk: ~200 MB (semua file prototipe)
- CPU: <1%
- Bandwidth: tergantung traffic, untuk 1000 visit/hari ~500 MB/bulan

VPS-mu (8 GB RAM / 100 GB disk / 8 TB bandwidth) **lebih dari cukup** untuk SPD + Jubir Warga + 5-10 site lain di masa depan.

---

## Rollback Plan (jaga-jaga)

Kalau ADA masalah dan SPD jadi down:

```bash
# Disable site Jubir Warga (SPD tetap jalan)
rm /etc/nginx/sites-enabled/jubirwarga
nginx -t && systemctl reload nginx

# Atau full restore dari backup
tar -xzf /root/backups/nginx-backup-YYYYMMDD-HHMM.tar.gz -C /
systemctl reload nginx
```

---

## Workflow update prototipe ke depan

Tiap kali ada update prototipe di laptop, deploy ke VPS:

```bash
cd "C:\Users\Asus\Downloads\Prototipe Jubir Warga"
python build_standalone.py    # rebuild standalone HTML

# Upload changes only
rsync -avz --exclude='.git' --exclude='deploy/' --exclude='*.docx' --exclude='*.pptx' \
  ./ root@76.13.196.172:/var/www/jubirwarga/
```

Atau pakai script `deploy.sh` yang sudah saya bikin di `deploy/` folder.

---

## Nanti: Tambah Next.js (Stage 2)

Saat siap migrate ke Next.js dengan backend (Postgres, AI Nala API, dll), tambahan minimal di VPS:

```bash
# Install Node.js 20 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# PM2 untuk manage Node process
npm install -g pm2

# PostgreSQL
apt install -y postgresql postgresql-contrib
sudo -u postgres createdb jubirwarga
sudo -u postgres createuser jw_app
```

Lalu Nginx config-nya berubah jadi reverse proxy ke Node:
```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

Tetap nggak ganggu SPD — masing-masing server block independen.

---

## Kalau butuh bantuan

Saat jalankan step di atas, kalau ada error:
1. Screenshot output error
2. Cek `journalctl -u nginx -n 50` untuk error log
3. Cek `tail -50 /var/log/nginx/error.log`
4. Kasih saya screenshot, saya bantu debug

**Mau saya help guide step-by-step?** Ketik command-nya di SSH, output-nya share ke saya, saya kasih next step.

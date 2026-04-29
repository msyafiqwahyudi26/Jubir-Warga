# CICD Setup — Auto-deploy GitHub → VPS

## Status saat ini

- VPS: `76.13.196.172` (Ubuntu 24.04 LTS, KVM 2 di Hostinger Jakarta)
- Domain: `jubir.spdindonesia.org` (sudah point ke VPS, SSL aktif)
- Repo: `https://github.com/msyafiqwahyudi26/Jubir-Warga`
- Workflow file: `.github/workflows/deploy.yml` (sudah dibuat)
- VPS config: `deploy/nginx-jubirwarga.conf` + `deploy/setup-vps.sh` (sudah dibuat)

## Setup CICD — 4 langkah (Mas yang jalankan)

### 1. Generate SSH key untuk GitHub Actions

Di laptop Mas (PowerShell atau Git Bash):

```bash
ssh-keygen -t ed25519 -C "github-actions-jubir" -f ~/.ssh/jubir_deploy -N ""
```

Hasilnya 2 file: `~/.ssh/jubir_deploy` (private) + `~/.ssh/jubir_deploy.pub` (public).

### 2. Tambah public key ke VPS authorized_keys

Buka Hostinger panel → VPS → Terminal browser. Atau SSH dari laptop:
`ssh root@76.13.196.172`

Lalu:
```bash
# Paste isi jubir_deploy.pub kamu di sini, ganti <ISI_PUBLIC_KEY>
echo "<ISI_PUBLIC_KEY>" >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
```

### 3. Tambah private key ke GitHub Secrets

1. Buka https://github.com/msyafiqwahyudi26/Jubir-Warga/settings/secrets/actions
2. Klik **New repository secret**
3. Name: `VPS_SSH_KEY`
4. Value: paste seluruh isi file `~/.ssh/jubir_deploy` (private key, mulai dari `-----BEGIN OPENSSH PRIVATE KEY-----` sampai `-----END OPENSSH PRIVATE KEY-----`)
5. Save

### 4. Initial setup di VPS (jalankan 1x)

Di VPS terminal:
```bash
cd /tmp
git clone https://github.com/msyafiqwahyudi26/Jubir-Warga.git
bash Jubir-Warga/deploy/setup-vps.sh
```

Script akan:
- Install nginx + certbot + git + rsync (kalau belum)
- Clone repo ke `/var/www/jubirwarga/`
- Copy nginx vhost config
- Issue SSL cert (kalau belum ada)
- Reload nginx

## Setelah setup — cara deploy

Tinggal `git push` ke `main` dari laptop. GitHub Actions akan:
1. Checkout repo
2. SSH ke VPS pakai key dari secret
3. Rsync repo ke `/var/www/jubirwarga/`
4. Reload nginx
5. Site ke-update di https://jubir.spdindonesia.org/ dalam <1 menit

Bisa juga trigger manual dari GitHub UI: **Actions tab → Deploy to VPS → Run workflow**.

## Cek log deploy

- GitHub Actions log: https://github.com/msyafiqwahyudi26/Jubir-Warga/actions
- nginx access log di VPS: `/var/log/nginx/jubirwarga.access.log`
- nginx error log di VPS: `/var/log/nginx/jubirwarga.error.log`

## Rollback

Kalau deploy bermasalah, di VPS:
```bash
cd /var/www/jubirwarga
git log --oneline -5         # lihat 5 commit terakhir
git checkout <commit-hash>   # revert ke commit sebelumnya
nginx -s reload
```

Atau revert commit di GitHub → push lagi → auto-deploy versi lama.

## Troubleshooting

**"Permission denied (publickey)" saat workflow jalan:**
- Cek private key di GitHub Secret VALID (lengkap dengan header/footer `-----BEGIN/END OPENSSH PRIVATE KEY-----`)
- Cek public key sudah ada di `/root/.ssh/authorized_keys` di VPS
- Cek `chmod 600 ~/.ssh/authorized_keys` di VPS

**"nginx: configuration test failed":**
- Cek SSL cert path di nginx-jubirwarga.conf cocok dengan yang ada di VPS
- Run `certbot certificates` di VPS untuk lihat cert path

**"rsync: connection unexpectedly closed":**
- VPS firewall block port 22? Cek `ufw status` atau Hostinger Firewall panel
- SSH service di VPS jalan? `systemctl status ssh`

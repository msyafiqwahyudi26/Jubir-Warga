#!/usr/bin/env bash
# Jalankan SEKALI di VPS sebagai root setelah pertama kali clone repo:
#   cd /tmp && git clone https://github.com/msyafiqwahyudi26/Jubir-Warga.git && bash Jubir-Warga/deploy/setup-vps.sh
set -euo pipefail

DOMAIN="jubir.spdindonesia.org"
DEPLOY_DIR="/var/www/jubirwarga"
REPO="https://github.com/msyafiqwahyudi26/Jubir-Warga.git"

echo "▶ 1. Install dependencies"
apt-get update -qq
apt-get install -y nginx certbot python3-certbot-nginx git rsync >/dev/null

echo "▶ 2. Buat deploy directory + clone awal"
mkdir -p "$DEPLOY_DIR"
if [ ! -d "$DEPLOY_DIR/.git" ]; then
    git clone "$REPO" "$DEPLOY_DIR"
fi
chown -R www-data:www-data "$DEPLOY_DIR"

echo "▶ 3. Copy nginx vhost"
cp "$DEPLOY_DIR/deploy/nginx-jubirwarga.conf" /etc/nginx/sites-available/jubirwarga
ln -sf /etc/nginx/sites-available/jubirwarga /etc/nginx/sites-enabled/jubirwarga
[ -f /etc/nginx/sites-enabled/default ] && rm /etc/nginx/sites-enabled/default

echo "▶ 4. Issue SSL cert via certbot (kalau belum)"
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m admin@spdindonesia.org --redirect
else
    echo "  cert already exists, skipping"
fi

echo "▶ 5. Test + reload nginx"
nginx -t
systemctl reload nginx
systemctl enable nginx

echo ""
echo "✅ Setup selesai. Site live di: https://$DOMAIN"
echo ""
echo "▶ Next: Setup SSH key untuk GitHub Actions deploy"
echo "  1. Generate key di laptop (atau di sini): ssh-keygen -t ed25519 -C 'github-actions-jubir' -f ~/.ssh/jubir_deploy"
echo "  2. Public key (~/.ssh/jubir_deploy.pub) → tambah ke ~/.ssh/authorized_keys di VPS:"
echo "     cat ~/.ssh/jubir_deploy.pub >> /root/.ssh/authorized_keys"
echo "  3. Private key (~/.ssh/jubir_deploy) → paste ke GitHub repo → Settings → Secrets → VPS_SSH_KEY"
echo "  4. Push ke main → workflow trigger otomatis"

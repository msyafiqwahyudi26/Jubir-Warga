#!/bin/bash
# deploy.sh — Upload prototipe dari laptop lokal ke VPS
# Jalankan dari folder Prototipe Jubir Warga di laptop kamu

VPS_HOST="76.13.196.172"
VPS_USER="root"
VPS_PATH="/var/www/jubirwarga"

echo "Deploying to $VPS_USER@$VPS_HOST:$VPS_PATH ..."

# Rebuild standalone first
echo "[1/3] Building standalone..."
python3 build_standalone.py

# Upload via rsync (smart, only changed files)
echo "[2/3] Uploading files..."
rsync -avz --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='deploy/' \
    --exclude='pitch-deck-preview/' \
    --exclude='*.docx' \
    --exclude='*.pptx' \
    --exclude='*.md' \
    --exclude='*.bat' \
    --exclude='*.py' \
    ./ "$VPS_USER@$VPS_HOST:$VPS_PATH/"

# Reload Nginx
echo "[3/3] Reloading Nginx..."
ssh "$VPS_USER@$VPS_HOST" "systemctl reload nginx"

echo "✓ Deploy selesai. Cek https://jubirwarga.id"

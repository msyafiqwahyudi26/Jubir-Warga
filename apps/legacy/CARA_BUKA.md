# Cara Buka Prototipe Jubir Warga

## TL;DR
- **Buat lihat sendiri (offline):** dobel-klik **`Jubir Warga - Standalone.html`** → langsung jalan di browser.
- **Buat dev (edit lalu lihat hasil):** pakai versi multi-file via local server. Lihat bawah.
- **Buat share ke orang lain (publik):** deploy ke Vercel/Netlify. Gratis, 5 menit.

---

## 1. Standalone HTML — paling gampang (offline, file://)

Buka `Jubir Warga - Standalone.html` dengan dobel-klik. Atau drag ke window Chrome/Edge/Firefox.

**Kenapa harus standalone?**
File ini berisi SEMUA kode (HTML + 13 file React JSX) di-inline jadi satu. Browser tidak perlu fetch file lain, jadi nggak kena CORS error saat dibuka via `file://`.

**Cocok buat:**
- Lihat sendiri di laptop
- Kirim file via WhatsApp / email ke 1-2 orang sebagai preview
- Demo pitch tanpa internet

**Tidak cocok buat:**
- Iterate (kalau kamu mau edit lalu lihat hasil — pakai multi-file di bawah)
- Public sharing massal — pakai deploy

---

## 2. Multi-file versi — buat development (perlu local server)

File `Jubir Warga.html` & `index.html` me-load `*.jsx` files via `<script src="...">`. Browser modern memblokir ini saat buka via `file://` (CORS policy).

**Solusi: jalankan local web server.** Pilih salah satu:

### Opsi 2a — Python (paling cepat, sudah ada di laptop)

Buka Terminal/CMD, masuk ke folder `Prototipe Jubir Warga`, lalu:

```bash
python -m http.server 8000
```

Buka browser ke `http://localhost:8000/index.html`

Stop server: `Ctrl+C` di terminal.

### Opsi 2b — Node.js (kalau Node sudah installed)

```bash
npx http-server -p 8000
```

Buka `http://localhost:8000/index.html`

### Opsi 2c — VS Code Live Server extension

Install extension "Live Server" → klik kanan `index.html` → "Open with Live Server".

**Workflow dev:**
1. Edit file `*.jsx` di VS Code
2. Save
3. Reload browser → lihat perubahan
4. Setelah puas: rebuild standalone (lihat bawah)

---

## 3. Rebuild Standalone setelah edit

Setelah edit file `*.jsx`, rebuild standalone supaya update:

```bash
cd "Prototipe Jubir Warga"
python build_standalone.py
```

(Script `build_standalone.py` ada di repo — kalau belum, copy dari `/tmp/build_standalone.py` di session ini.)

---

## 4. Deploy publik — Vercel (paling cepat, gratis)

**Step:**
1. Bikin account di [vercel.com](https://vercel.com) (login pakai GitHub)
2. Push folder `Prototipe Jubir Warga` ke GitHub repo (atau drag folder ke Vercel dashboard)
3. Vercel otomatis deploy → dapat URL `xxx.vercel.app`
4. (Optional) Connect domain `jubirwarga.id` → free SSL

**Vercel config (otomatis):**
- Tidak perlu build command
- Output directory: `.` (root)
- Index: `index.html`

**Live preview URL:** kamu dapat URL public dalam 1 menit. Bisa di-share ke siapa aja.

---

## 5. Deploy ke VPS sendiri (nginx + domain)

Kalau mau full control + custom server:

```bash
# Di VPS (Ubuntu 22.04 contoh)
sudo apt install nginx -y
sudo cp -r "Prototipe Jubir Warga"/* /var/www/jubirwarga/
sudo nano /etc/nginx/sites-available/jubirwarga
```

Isi config nginx minimal:
```
server {
  listen 80;
  server_name jubirwarga.id www.jubirwarga.id;
  root /var/www/jubirwarga;
  index index.html;
}
```

Enable & restart:
```bash
sudo ln -s /etc/nginx/sites-available/jubirwarga /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d jubirwarga.id -d www.jubirwarga.id  # SSL gratis
```

---

## Rekomendasi untuk Jubir Warga

| Kebutuhan | Pakai |
|---|---|
| Lihat sendiri di laptop | Standalone HTML (dobel-klik) |
| Demo ke 1-2 calon investor offline | Standalone HTML via WhatsApp |
| Edit + iterate | Multi-file + Python http.server |
| Soft launch beta publik | Deploy ke Vercel (gratis, 5 menit) |
| Production scale | VPS sendiri (nginx + domain jubirwarga.id) |

**Saran konkret tahap sekarang (bootstrap mode):**
1. Lihat sendiri & tim pakai Standalone HTML
2. Soft launch publik via Vercel ke domain `jubirwarga.id` (atau subdomain `beta.jubirwarga.id`)
3. Pindah ke VPS sendiri kalau sudah ada budget + tim engineering

---

## Troubleshooting

**"File terbuka tapi blank/putih?"**
- Pastikan internet aktif (Babel + React + Tailwind di-load via CDN)
- Buka DevTools (F12) → Console → cek error

**"Layout berantakan?"**
- Refresh dengan Ctrl+Shift+R (hard reload, bypass cache)
- Cek viewport — desain optimum di 1280×720 ke atas

**"Font kelihatan default Arial?"**
- Tunggu 2-3 detik untuk Google Fonts load (Inter, Vollkorn, Caveat, Fira Code)
- Cek koneksi internet

**Buat tanya lain:** kontak tim Jubir Warga.

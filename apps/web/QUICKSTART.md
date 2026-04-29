# Phase 2 Quickstart — apps/web

## Pre-flight

- Node 20.11+
- pnpm 9.x (`npm install -g pnpm@9.12.0`)
- Supabase project sudah live di `ifrautpvbhdbhieystxk` (schema + seed sudah ter-apply)

## Setup (sekali saja)

Di root repo (`D:\Website-Jubir Warga`):

```powershell
# Install semua workspace deps
pnpm install

# Setup env Phase 2
cp apps/web/.env.example apps/web/.env.local
# (file sudah berisi NEXT_PUBLIC_SUPABASE_URL + ANON_KEY untuk project live)
```

## Dev

```powershell
pnpm dev
```

Buka <http://localhost:3000>:

- `/` — Beranda dengan live data (threads, petisi, janji counts)
- `/masuk` — Login (email/password, magic link, WhatsApp OTP, Google)
- `/daftar` — Sign up (email/password atau Google)
- `/api/healthcheck` — JSON status endpoint, ping ke Supabase

## Smoke test checklist

1. Beranda render tanpa error → ✅ Supabase connection works
2. `/api/healthcheck` returns `{"status":"ok","supabase.connected":true}` → ✅
3. Daftar dengan email → cek inbox untuk verification link → klik → balik ke `/auth/callback`
4. Setelah login, header berubah jadi nama user + tombol "Keluar"
5. Cek `/profil` redirect ke `/masuk?redirect=/profil` saat belum login

## Auth provider setup yang masih perlu Mas lakukan

| Provider | Setup yang dibutuhkan | Status |
|---|---|---|
| Email + Password | Sudah aktif default Supabase | ✅ Ready |
| Magic Link | Sama, butuh SMTP custom kalau mau brand sender | ✅ Ready (default Supabase SMTP) |
| Google OAuth | Mas perlu bikin Google Cloud OAuth client. Lihat [SUPABASE_SETUP.md Step 4](../../deploy/SUPABASE_SETUP.md#tambah-google-oauth-recommended-untuk-indonesia) | ⏳ Mas |
| WhatsApp OTP | Mas perlu Twilio account + Verify Service. Lihat [SUPABASE_SETUP.md Step 4](../../deploy/SUPABASE_SETUP.md#tambah-whatsapp-otp-twilio-verify) | ⏳ Mas |

Kalau Mas belum setup Google/WA: tombol akan tetap muncul tapi error saat di-klik. Email + magic link langsung jalan.

## Build untuk production

```powershell
pnpm build
pnpm start    # cek di localhost:3000
```

## Deploy Phase 2 (TBD)

Subdomain target: `app.jubir.spdindonesia.org`. CICD workflow terpisah dari Phase 1 (yang masih live di `jubir.spdindonesia.org`). Belum di-setup; akan dibikin di Sprint 2.

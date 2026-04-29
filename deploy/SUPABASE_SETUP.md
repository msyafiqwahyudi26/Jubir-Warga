# Supabase Setup — Backend Jubir Warga

Backend untuk Phase 2: real auth, real persistence, real-time updates, file storage.
Free tier: 500 MB database, 1 GB file storage, 50k MAU. Cukup untuk MVP + 5,000 active users.

---

## Step 1 — Sign up & create project (5 menit)

1. Buka https://supabase.com → **Start your project** → sign in dengan GitHub (recommended)
2. **New project**:
   - Organization: bikin baru → `SPD Indonesia` atau `Jubir Warga`
   - Project name: `jubir-warga`
   - Database password: **generate strong + simpan di password manager** (Bitwarden/1Password)
   - Region: **Southeast Asia (Singapore)** — paling dekat Jakarta, latency ~10-30ms
   - Pricing plan: **Free**
3. Tunggu ~2 menit project provisioning
4. Copy 3 hal dari **Project Settings → API**:
   - **Project URL** (`https://xxxxxx.supabase.co`)
   - **anon public key** (untuk frontend)
   - **service_role secret** (untuk server-side, JANGAN di-expose ke frontend)

5. Copy database connection string dari **Project Settings → Database** → Connection string → URI mode:
   - `postgres://postgres.<project>:<password>@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`

---

## Step 2 — Apply database schema

Supabase punya SQL Editor di dashboard. Atau Mas bisa pakai psql/CLI. Schema design awal di file `supabase/migrations/0001_init.sql` (saya bikinkan).

### Schema overview

15 tables untuk cover semua entity Jubir Warga:

```
public.profiles          ← user profile (extends auth.users)
public.chapters          ← chapter regional (Jakarta, Bandung, ...)
public.threads           ← forum thread
public.thread_replies    ← reply/komentar
public.thread_votes      ← upvote/downvote per user-thread
public.karya             ← creator content (tulisan, vlog, ilustrasi)
public.kelas             ← class catalog
public.kelas_modul       ← module per class
public.kelas_enrollment  ← user enrolled per class
public.pejabat           ← politician profile
public.janji             ← government promise
public.janji_evidence    ← evidence/foto/dokumen
public.janji_pemantau    ← user yang follow janji
public.petisi            ← petition
public.petisi_signatures ← user yang sign
public.laporan           ← citizen report (jalan rusak, dst)
public.laporan_dukungan  ← upvote/dukung laporan
public.laporan_komentar  ← komentar laporan
public.polling           ← polling
public.polling_votes     ← vote per user
public.kampanye          ← kampanye / movement
public.badges            ← badge catalog
public.user_badges       ← badge yang user dapat
public.game_scores       ← skor mini-game per user
public.activity_log      ← audit trail aktivitas
```

### Cara apply

#### Option A: SQL Editor di dashboard (paling simple)
1. Buka project → **SQL Editor** di sidebar
2. **+ New query**
3. Copy isi `supabase/migrations/0001_init.sql` → paste
4. **Run** (atau Ctrl+Enter)
5. Verify di **Table Editor** — semua 25 table harus muncul

#### Option B: Supabase CLI (untuk developer flow)
```bash
# Install CLI
npm install -g supabase

# Login (open browser)
supabase login

# Link to project
cd D:\Website-Jubir Warga
supabase init
supabase link --project-ref <PROJECT_REF>

# Apply migrations
supabase db push
```

---

## Step 3 — Setup Row Level Security (RLS)

RLS = aturan siapa boleh baca/tulis data. Tanpa RLS, semua data public terbaca via API. **WAJIB di-enable sebelum production.**

Schema migration sudah include RLS policies untuk:
- `threads`: semua user authenticated boleh baca, hanya author boleh edit/delete
- `petisi_signatures`: tiap user hanya boleh sign sekali, public view count agregat
- `janji`: read public, write hanya admin
- `pejabat`: read public, write hanya admin
- `laporan`: read public, hanya reporter boleh edit (24 jam after submit)
- `profiles`: tiap user hanya bisa edit profile sendiri
- ... dst

---

## Step 4 — Setup Auth providers

Default Supabase Auth support: email/password + magic link.

### Tambah Google OAuth (recommended untuk Indonesia)
1. Project Settings → **Authentication → Providers → Google**
2. Toggle **Enable**
3. Butuh Google OAuth Client ID & Secret:
   - Buka https://console.cloud.google.com/apis/credentials
   - Create OAuth 2.0 Client ID → Web application
   - Authorized redirect URI: `https://<project>.supabase.co/auth/v1/callback`
   - Copy Client ID + Secret → paste ke Supabase

### Tambah WhatsApp OTP (Twilio Verify)
1. Project Settings → Authentication → Providers → Phone
2. SMS provider: **Twilio**
3. Butuh Twilio Account SID + Auth Token + Verify Service SID
4. Buka https://www.twilio.com/console → bikin Verify Service
5. Paste credentials ke Supabase

---

## Step 5 — Storage bucket untuk upload

Untuk foto laporan + avatar:

1. **Storage** → **New bucket**:
   - Name: `laporan-photos` → **Public** (foto laporan visible ke semua)
   - Name: `avatars` → **Public**
   - Name: `evidence` → **Private** (bukti janji, hanya signed URL)
2. RLS policies untuk masing-masing bucket (saya kasih SQL di migration)

---

## Step 6 — Realtime channels

Realtime ENABLED by default untuk semua table dengan `replica identity = full`. Untuk performance, enable selektif:

1. Database → **Replication**
2. Enable replica untuk:
   - `threads` (untuk live forum)
   - `thread_replies` (untuk live komentar)
   - `petisi_signatures` (untuk live counter)
   - `janji` (untuk live status update)

---

## Step 7 — Environment variables di Phase 2 webapp

Saat init Next.js project nanti, simpan di `apps/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...      # SERVER-SIDE ONLY, jangan commit
DATABASE_URL=postgres://postgres...    # untuk Prisma/Drizzle migrations
```

`.env.local` sudah di `.gitignore` by default di Next.js → aman.

---

## Step 8 — Saya butuh dari Mas (setelah project aktif)

1. Project URL (`https://xxxxx.supabase.co`)
2. **anon public key** (boleh share, tidak sensitive)
3. (Opsional) Konfirmasi region Asia Tenggara dipilih
4. Konfirmasi schema migration sudah di-apply (table count = 25)

Kasih ke saya, lalu Phase 2 init Next.js project bisa langsung wire ke Supabase live.

---

## Quotas & Cost Planning

| Metric | Free tier | Saat scale |
|---|---|---|
| Database size | 500 MB | $25/mo per project untuk Pro = 8 GB |
| File storage | 1 GB | $0.021/GB/mo additional |
| Bandwidth | 5 GB/mo | $0.09/GB additional |
| Auth users (MAU) | 50,000 | Pro plan = 100,000 included |
| Edge Functions | 500k invocations/mo | Pro = 2M |
| Database connections | 60 (pooler 200) | Pro = 200 (pooler 800) |

**Estimasi MVP (1,000 active users):** comfortable di Free tier.
**Estimasi scale (10,000 users):** ~$25/mo Pro plan, masih murah.

---

## Backup strategy

Supabase Free auto-backup **HARIAN** (retain 7 hari).
Pro plan: retain 30 hari + Point-in-Time Recovery.

Manual backup:
```bash
supabase db dump --schema public > backup-$(date +%Y%m%d).sql
```

Restore:
```bash
psql $DATABASE_URL < backup-20260429.sql
```

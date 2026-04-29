# Audit Jubir Warga — Tanggal 29 April 2026 (Verified)

**Sumber:** clone live dari `https://github.com/msyafiqwahyudi26/Jubir-Warga.git` (commit terakhir: `cca9d9e — Foundation refactor: folder structure + 6 detail pages + PWA setup`).
**Pembanding:** target struktur di `docs/RENCANA_1_BULAN.md`.
**Status branch:** hanya `main`. Belum ada working branch lain.
**Catatan:** Versi ini sudah diverifikasi setelah inspeksi penuh `App.jsx`, `index.html`, dan tree filesystem.

---

## 1. Ringkasan Eksekutif

| Kategori | Selesai | Total Target | % |
|---|---|---|---|
| Halaman utama (9 pilar) | 9 file (1 belum dipisah) | 9 | ≈90% |
| Detail page | 6 | 14 (per rencana) | 43% |
| Mini games | 1 (TebakKata) | 3 | 33% |
| Components UI library | 1 file gabungan (`layout/main.jsx`) | ≈10 komponen | <10% |
| Mock data folder (`src/data/`) | **0** | 8 file | **0%** — folder belum ada |
| Lib utilities (`src/lib/`) | **0** | 3 file | **0%** — folder belum ada |
| Style tokens (`src/styles/`) | **0** (semua CSS inline di `index.html`) | 2 file | **0%** — folder belum ada |
| PWA manifest + service worker | ✅ ada di `public/` | 2 file + ikon | manifest+SW ada, **ikon PNG hilang** |
| Deploy infra (`deploy/`) | **0** | 5 file | **0%** — folder belum ada |
| Scripts (`scripts/`) | **0** | 2 file | **0%** — folder belum ada (README menyebut `build_standalone.py` tapi belum dibuat) |
| `package.json` | **0** | 1 | **0%** |

**Headline:** Shell aplikasi sudah jalan dengan pola "global window component" via React+Babel CDN. Tapi **substansi belum diisolasi** — semua brand token (warna, font), mock data, dan utility ada hardcoded di dalam page jsx atau di `<style>` block `index.html`. Ini hutang teknis terbesar untuk dilanjutkan ke Minggu 2-4.

---

## 2. Halaman — Status Detail (Verified via App.jsx)

App.jsx me-route 15 halaman lewat object `PAGES` (9 main + 6 detail):

```js
// 9 main pages
beranda, komunitas, karya, kelas, aksi, tagih, main, nala, profil
// 6 detail pages
thread-detail, reading-view, lesson-player, petisi-detail, janji-detail, paspor-public
```

### 2.1 Halaman utama (9)

| # | Page | File | Status |
|---|---|---|---|
| 1 | Beranda | `src/pages/Beranda.jsx` | ✅ Ada & ter-route |
| 2 | Komunitas | `src/pages/komunitas/Index.jsx` | ✅ Ada & ter-route |
| 3 | Karya | `src/pages/karya/Index.jsx` | ✅ Ada & ter-route |
| 4 | Kelas | `src/pages/kelas/Index.jsx` | ✅ Ada & ter-route |
| 5 | Aksi | `src/pages/aksi/Index.jsx` | ✅ Ada & ter-route |
| 6 | Tagih Janji | `src/pages/tagih/Index.jsx` | ✅ Ada & ter-route |
| 7 | Main (mini games) | `src/pages/main/Index.jsx` | ✅ Ada & ter-route |
| 8 | Nala (AI hub) | (di `components/nala/nala-mascot-and-page.jsx`) | ⚠️ Masih digabung dengan mascot — perlu split ke `pages/nala/Index.jsx` |
| 9 | Profil | `src/pages/profil/Index.jsx` | ✅ Ada & ter-route |

### 2.2 Detail page yang ter-route (6)

`thread-detail` `reading-view` `lesson-player` `petisi-detail` `janji-detail` `paspor-public` — semua ada filenya dan ter-import di App.jsx. Ada guard `Component ? <Component/> : null` sehingga aman kalau component belum di-define.

### 2.3 Detail page yang BELUM ada (perlu dibuat)

| Detail page | Path target | Source |
|---|---|---|
| ChapterDetail | `komunitas/ChapterDetail.jsx` | RENCANA_1_BULAN |
| SubKomunitas | `komunitas/SubKomunitas.jsx` | RENCANA_1_BULAN |
| VideoPlayer | `karya/VideoPlayer.jsx` | RENCANA_1_BULAN |
| Upload | `karya/Upload.jsx` | RENCANA_1_BULAN |
| KelasDetail | `kelas/KelasDetail.jsx` | RENCANA_1_BULAN — Hari 3-5 Minggu 1 |
| LaporDetail | `aksi/LaporDetail.jsx` | RENCANA_1_BULAN |
| LaporBaru (form) | `aksi/LaporBaru.jsx` | RENCANA_1_BULAN |
| PejabatProfile | `tagih/PejabatProfile.jsx` | RENCANA_1_BULAN |
| SubmitJanji (form) | `tagih/SubmitJanji.jsx` | RENCANA_1_BULAN |
| Nala Index (split) | `nala/Index.jsx` | refactor dari `components/nala/...` |
| Nala Chat | `nala/Chat.jsx` | RENCANA_1_BULAN |
| Nala Etika | `nala/Etika.jsx` | RENCANA_1_BULAN |
| Pengaturan | `profil/Pengaturan.jsx` | RENCANA_1_BULAN |
| Login | `auth/Login.jsx` | RENCANA_1_BULAN — Hari 6-7 Minggu 1 |
| Daftar | `auth/Daftar.jsx` | RENCANA_1_BULAN |
| Tentang | `statis/Tentang.jsx` | RENCANA_1_BULAN |
| Privasi | `statis/Privasi.jsx` | RENCANA_1_BULAN |
| Syarat | `statis/Syarat.jsx` | RENCANA_1_BULAN |

**Total detail/sub-page selesai: 6/24 (25%).**

### 2.4 Mini games

| Game | Path aktual | Status |
|---|---|---|
| Tebak Kata (Citizen Wordle) | `pages/main/TebakKata.jsx` | ✅ Ada (tapi flat di `main/`, belum di subfolder `main/games/`) |
| Spot the Hoaks | `pages/main/games/SpotHoaks.jsx` | ❌ MISSING |
| Tebak Pasal | `pages/main/games/TebakPasal.jsx` | ❌ MISSING |

---

## 3. Components

**Pattern arsitektur (verified dari `App.jsx`):** setiap file component mengekspos dirinya ke `window.X = ...` (style React+Babel CDN), lalu `App.jsx` mengambil via `window.X` destructuring. Tidak pakai ES modules.

| Folder | Target file (per rencana) | Aktual | Catatan |
|---|---|---|---|
| `components/ui/` | Button, Pill, Card, Avatar | folder belum ada | ❌ Pasti ada duplication Tailwind class di tiap page |
| `components/layout/` | Header, Footer, MobileNav (3 file) | hanya `main.jsx` | ⚠️ 1 file gabungan — perlu split |
| `components/nala/` | mascot SVG + chat | `nala-mascot-and-page.jsx` | ⚠️ Mascot + page Nala digabung — perlu split |
| `components/illustrations/` | inline SVG kustom | folder belum ada | ❌ MISSING |
| `components/icons/` | Lucide icon helper | folder belum ada | ❌ MISSING |

---

## 4. Data, Lib, Styles — Status: BELUM ADA SAMA SEKALI

| Folder | File yang harusnya ada | Status |
|---|---|---|
| `src/data/` | threads.js, karya.js, kelas.js, janji.js, laporan.js, users.js, pejabat.js, seeds.js | ❌ FOLDER BELUM ADA — 0/8 |
| `src/lib/` | format.js, nala-prompts.js, store.js | ❌ FOLDER BELUM ADA — 0/3 |
| `src/styles/` | tokens.css, global.css | ❌ FOLDER BELUM ADA — 0/2 |

**Verifikasi brand tokens:** Saya cek `index.html` — semua brand sebenarnya ada di sini:

```js
// Di tailwind.config (dalam <script>):
colors: {
  bb: '#1A2256',     // brand-blue
  bc: '#FFFAEE',     // brand-cream
  bbs: '#3B4A8A',    // brand-blue-soft
  ig: '#2A2D3A',     // ink-grey
  ln: '#E6DECB',     // line-neutral
  coral: '#E8632B',
  marigold: '#F2B137',
  mint: '#7FB69E',
}
```

Plus 100+ baris CSS di `<style>` (animasi Wordle, button, sticky-note, dll). Semua perlu di-extract ke `src/styles/tokens.css` dan `src/styles/global.css` agar reusable dan reproducible saat migrate ke Next.js.

**Mock data juga 100% inline.** Setiap `Index.jsx` halaman pasti punya `const threads = [...]` atau sejenisnya hardcoded di body component.

---

## 5. Public, Scripts, Deploy, Archive — Verified

| Folder | Aktual | Catatan |
|---|---|---|
| `public/` | `manifest.json` ✅, `service-worker.js` ✅, `icons/icon-source.svg` ✅ | ⚠️ `icon-192.png` & `icon-512.png` referenced di `index.html` **tapi tidak ada** — perlu generate dari SVG. Ini bug PWA. |
| `scripts/` | ❌ TIDAK ADA | README claim ada `build_standalone.py` — sebenarnya belum dibuat. `Standalone.html` (217KB di root) ada tapi tidak ada script generator-nya. Asumsi: dibuat manual atau di sesi sebelumnya tanpa di-commit. |
| `deploy/` | ❌ TIDAK ADA | Semua config nginx/SSL Mas masih hidup hanya di VPS, belum di-version-control. |
| `archive/` | ✅ Ada (3 item — old versions + scraps) | OK untuk safety. |
| `.github/workflows/` | ❌ TIDAK ADA | Belum ada CI/CD. |

---

## 6. Dokumentasi (`docs/`) — Verified

| File | Status |
|---|---|
| RENCANA_1_BULAN.md | ✅ |
| Landing_Page_Beta_Copy.md | ✅ |
| Prompt_Claude_Design_Jubir_Warga.md | ✅ |
| Prompt_Claude_Design_Jubir_Warga_v2.md | ✅ |
| STRATEGI_v2.docx | ❌ (disebut di rencana — di-host external?) |
| PITCH_DECK.pptx | ❌ |
| BRAND_GUIDELINE.pdf | ❌ |

---

## 7. File Root — Verified

| File | Status |
|---|---|
| README.md (5 KB) | ✅ |
| CARA_BUKA.md (4.5 KB) | ✅ |
| index.html (157 baris, 6.8 KB) | ✅ — entry dev mode, load semua jsx via `<script type="text/babel">` |
| Standalone.html (217 KB) | ✅ — single-file build output |
| .gitignore | ✅ |
| package.json | ❌ MISSING |

---

## 8. Cross-check dengan Rencana Mingguan

| Minggu | Target | Status realita |
|---|---|---|
| **Minggu 1** Foundation Refactor + 8 Detail Pages | Restructure folder (Hari 1-2) + 8 detail page (Hari 3-5) + Auth flow (Hari 6-7) | ⚠️ Restructure ≈70% (3 dari 6 subfolder `src/`); detail page 6/14; auth hanya Onboarding |
| **Minggu 2** UI Polish + Mobile + PWA | UI consistency, responsive 375px, PWA installable | ⚠️ PWA manifest+SW ada tapi ikon PNG missing. Polish belum dimulai. |
| **Minggu 3** Mock Backend + AI + Interaktif | `lib/store.js`, mock CRUD, Nala chat, 2 game baru | ❌ 0% — folder `lib/` belum ada |
| **Minggu 4** Auto-deploy + QA + Soft Launch | GH Actions, Lighthouse, beta launch | ❌ 0% — folder `deploy/` & `.github/` belum ada |

---

## 9. Rekomendasi Prioritas (Verified)

### Prioritas 1 (Foundation — kerjakan dulu, ±1 hari)
1. **Buat `src/styles/tokens.css` & `src/styles/global.css`** — extract semua brand color (jadikan CSS variable `--bb`, `--bc`, dst), font-family, dan animasi/CSS dari `index.html`. Sisakan di `index.html` hanya yang harus inline (tailwind.config). Ini langkah refactor yang mempermudah Minggu 2 polish.
2. **Buat `src/data/seeds.js` + sub-file** (threads, karya, kelas, janji, laporan, users, pejabat) — extract semua mock data hardcoded dari tiap `pages/*/Index.jsx` ke file terpisah. Set ke `window.JWData = { threads, karya, ... }` supaya cocok dengan pola `window.X` yang sudah ada.
3. **Buat `src/lib/store.js`** — minimal helper `useLocalState(key, default)` + simple pub-sub untuk vote/sign/comment. Tidak perlu Zustand, cukup React context + localStorage.
4. **Generate ikon PNG** dari `icon-source.svg` — `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, plus apple-touch-icon. Fix bug PWA.

### Prioritas 2 (Minggu 1 backlog — ±2-3 hari)
5. **Bikin 8 detail page minimum**: `KelasDetail`, `LaporDetail`, `LaporBaru`, `PejabatProfile`, `SubmitJanji`, `Login`, `Daftar`, halaman statis `Tentang`/`Privasi`/`Syarat`. Pakai placeholder copy.
6. **Split `nala-mascot-and-page.jsx`** → `components/nala/Mascot.jsx` + `pages/nala/Index.jsx`. Buat skeleton `nala/Chat.jsx` & `nala/Etika.jsx`.
7. **Extract `components/ui/`** — `Button`, `Pill`, `Card`, `Avatar` dari pattern berulang. Set ke `window.UI = { Button, ... }`.

### Prioritas 3 (Game + interaktivitas — Minggu 3 prep)
8. Pindah `TebakKata.jsx` ke `pages/main/games/`, lalu bikin **`SpotHoaks.jsx`** + **`TebakPasal.jsx`** (placeholder content).
9. Wire interaktivitas: tombol vote/sign/follow di page yang sudah ada via `lib/store.js`.

### Prioritas 4 (Infra)
10. **Bikin folder `deploy/`** — pindahkan nginx config dari VPS ke repo (`deploy/nginx-jubirwarga.conf`), tambah `setup-vps.sh`, `jw-deploy.sh`.
11. **GitHub Actions** `.github/workflows/deploy.yml` — auto-deploy ke VPS via SSH (rsync atau git pull).
12. **`scripts/build_standalone.py`** — script generator untuk `Standalone.html` (concatenate semua `<script type="text/babel">` ke single file).

---

## 10. Yang Sudah Diverifikasi vs Yang Belum

✅ **Sudah diverifikasi:**
- Tree filesystem lengkap (src, public, docs, archive)
- `App.jsx` (router pattern + 15 page yang ter-route)
- `index.html` (load order + brand tokens lokasi sebenarnya + bug ikon PWA)
- `public/` isi (manifest + SW + 1 SVG)
- `scripts/` benar-benar tidak ada
- `deploy/` benar-benar tidak ada

⏳ **Belum di-deep-read (asumsi based on pattern):**
- Apakah `layout/main.jsx` benar berisi Header+Footer+MobileNav 3-in-1 atau cuma sebagian
- Konten persis tiap page detail — apakah fully implemented atau placeholder
- Apakah `nala-mascot-and-page.jsx` benar mengexpose `window.PageNala`

---

## Lampiran A — Tree Aktual (verified)

```
.
├── README.md
├── CARA_BUKA.md
├── .gitignore
├── index.html              (157 lines)
├── Standalone.html         (217 KB)
├── archive/                (3 items)
├── docs/                   (4 .md)
├── public/
│   ├── manifest.json
│   ├── service-worker.js
│   └── icons/
│       └── icon-source.svg   ← only file; PNG ikon belum di-generate
└── src/
    ├── App.jsx             (109 lines)
    ├── components/
    │   ├── layout/
    │   │   └── main.jsx     ← Header + Footer + (MobileNav?) campur
    │   └── nala/
    │       └── nala-mascot-and-page.jsx  ← mascot + page Nala campur
    └── pages/
        ├── Beranda.jsx
        ├── komunitas/  Index.jsx, ThreadDetail.jsx
        ├── karya/      Index.jsx, ReadingView.jsx
        ├── kelas/      Index.jsx, LessonPlayer.jsx
        ├── aksi/       Index.jsx, PetisiDetail.jsx
        ├── tagih/      Index.jsx, JanjiDetail.jsx
        ├── main/       Index.jsx, TebakKata.jsx
        ├── profil/     Index.jsx, PasporPublic.jsx
        └── auth/       Onboarding.jsx
```

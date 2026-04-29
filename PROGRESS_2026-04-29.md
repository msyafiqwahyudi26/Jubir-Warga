# Progress Sesi 29 April 2026 — Foundation (Prioritas 1)

## Yang Diselesaikan

### 1. Audit lengkap (verified)
- [`AUDIT_JUBIR_WARGA_2026-04-29.md`](./AUDIT_JUBIR_WARGA_2026-04-29.md)
- 10 section + lampiran tree

### 2. Foundation files

#### `src/styles/` — Brand & Global CSS (293 baris)
- `tokens.css` — 8 brand color sebagai CSS variable, 5 pill variant (bg/text/border), tipografi, spacing 4px-base, radius, shadow, transition, z-index
- `global.css` — reset, body, scrollbar, .card-lift, .wtile/.wkey (Wordle), keyframes (flip-in/out, tile-pop, row-shake, shimmer), .squiggly, .badge-glow, .btn-base, .clamp2/3, .skeleton (NEW — buat Minggu 2), focus ring, mobile touch-target 44px

#### `src/lib/` — Utilities (592 baris)
- `store.js` (252) — `window.JWStore` dengan state container (votes, signed, follows, saved, upvoted, completed, counts, user, prefs, nala, games), localStorage persist, listener pub-sub, action helper (vote/sign/unsign/toggleFollow/save/upvote/setLessonProgress/saveNalaMessage/bumpGameWin/dst), React hook `useStoreField()` & `useLocalState()`
- `format.js` (164) — `window.JWFormat` Indonesia: date, dateShort, dateTime, relativeTime, number (id-ID), numberCompact (rb/jt/M), rupiah, percent, slug, truncate, pluralize, initials, phoneId
- `nala-prompts.js` (176) — `window.JWNala`: 4 mode (tanya/coach/writing/advocacy) + suggestions per mode, 3 canned response detail + fallback, 5 prinsip etika untuk halaman Etika, `streamReveal()` simulator word-by-word

#### `src/data/` — Mock Seeds (720 baris)
- `users.js` — 11 users + 14 pejabat + 8 partai
- `threads.js` — 8 thread + 9 topik + 7 lokasi + 5 format + 7 chapter + 6 sub-komunitas + 3 events + mitra
- `karya.js` — 10 karya + 5 top kreator + type meta
- `kelas.js` — 7 kelas (1 featured dengan 6 modul), 6 mentor, 3 testimoni
- `janji.js` — 14 janji + status meta + 5 provinsi MVP
- `aksi.js` — 1 polling, 4 petisi, 6 laporan, 4 kampanye, 7 kategori laporan
- `games.js` — 8 game catalog, 15 kata civic + 10 hint, **5 soal Spot the Hoaks** dengan flagging hoaks, **5 soal Tebak Pasal** + penjelasan, leaderboard, 12 badge
- `seeds.js` — combine ke `window.JWData` + lookup helper `byId.user/pejabat/thread/...` + query helper `q.threadsByCategory/janjiByStatus/...`

#### `public/icons/` — PWA ikon (sebelumnya hilang)
- `icon-192.png` (15 KB)
- `icon-512.png` (44 KB)
- `icon-512-maskable.png` (38 KB) — dengan padding biru
- `apple-touch-icon-180.png` (15 KB)
- `favicon-32.png` (2.5 KB)
- Generated dari `icon-source.svg` via ImageMagick

#### `public/manifest.json` — updated
- Tambah `icon-512-maskable.png` ke `icons[]` dengan `purpose: maskable`

#### `index.html` — refactored
- CSS inline di `<style>` block (~70 baris) DIHAPUS — sekarang load `tokens.css` + `global.css`
- Tambah `<link>` ke favicon + apple-touch-icon yang baru
- Tambah Open Graph + Twitter card meta
- Tambah `viewport-fit=cover` untuk iPhone notch
- Inline `window.JW_TOKENS = {...}` untuk JS access ke brand colors
- Load order: lib → data → components → pages → App → SW reg

## Verifikasi (sudah lulus)

- ✅ Semua 11 file JS di lib/ + data/ lulus `node --check` (syntax valid)
- ✅ `manifest.json` lulus `json.load()` — 3 ikon, 2 shortcut
- ✅ `index.html` 36 `<script>`, 9 `<link>`, end dengan `</html>`
- ✅ Semua file teks bersih dari null-byte padding (artifact mount Windows)

## Catatan Teknis

**Bug Mount Windows D:** Cowork file Write tool ternyata pad file dengan null bytes ke ukuran block tertentu di mount D:\. JSON parser fail karena dianggap unterminated. Sudah saya patch — semua file sekarang clean (no null padding). Untuk file teks ke depan, kalau ada masalah serupa, run:

```bash
tr -d '\000' < FILE > FILE.tmp && mv FILE.tmp FILE
```

**Git repo:** Folder `.git/` di mount D: agak rusak (lock files tidak bisa dihapus karena Windows POSIX permission mismatch). Untuk push ke GitHub, gunakan Git Bash di Windows side, bukan dari sandbox sini. Kalau perlu, hapus `.git/` dan re-clone, atau pakai Windows: `cd "D:\Website-Jubir Warga" && git fetch --all`.

## Cara Pakai Foundation Baru di Page

### Akses brand color di JS
```jsx
// Lama (masih jalan, tapi deprecated):
const C = window.C;
<div style={{ background: C.blue }}>

// Baru:
const T = window.JW_TOKENS;
<div style={{ background: T.blue }}>

// Atau langsung CSS variable:
<div style={{ background: 'var(--jw-blue)' }}>
```

### Akses mock data
```jsx
// Lama:
const THREADS = [/* hardcoded inline */];

// Baru:
const { threads, byId } = window.JWData;
const author = byId.user(threads[0].authorId);
```

### Akses utility
```jsx
const { date, relativeTime, rupiah, numberCompact } = window.JWFormat;
date('2026-04-29', { withDay: true });   // "Rabu, 29 April 2026"
relativeTime(Date.now() - 3600 * 1000);  // "1 jam lalu"
rupiah(1500000, { compact: true });      // "Rp 1,5 jt"
```

### Interaktivitas
```jsx
const { useStoreField, actions, useLocalState } = window.JWStore;

function PetisiCard({ petisiId }) {
  const [signed] = useStoreField(['signed', petisiId]);
  return (
    <button onClick={() => actions.sign(petisiId)} disabled={signed}>
      {signed ? '✓ Sudah ditanda-tangani' : 'Tanda Tangani'}
    </button>
  );
}
```

### AI Nala mock
```jsx
const { MODES, SUGGESTIONS, respond, streamReveal } = window.JWNala;
const result = respond('Apa itu UU Cipta Kerja?', 'tanya');
streamReveal(result.reply, (chunk) => setText(chunk), () => setDone(true), 25);
```

## Yang BELUM Dikerjakan (Backlog Sesi Berikutnya)

### Prioritas 2 — Detail page yang missing (8 page)
- KelasDetail, LaporDetail, LaporBaru, PejabatProfile, SubmitJanji
- Login, Daftar
- Halaman statis: Tentang, Privasi, Syarat
- Split `nala-mascot-and-page.jsx` → `pages/nala/Index.jsx` + `components/nala/Mascot.jsx`
- Buat `nala/Chat.jsx` + `nala/Etika.jsx`
- Extract `components/ui/` (Button, Pill, Card, Avatar) dari `layout/main.jsx`

### Prioritas 3 — Game baru (foundation siap, data sudah di `games.js`)
- `pages/main/games/SpotHoaks.jsx` — pakai `JWData.hoaksQuiz`
- `pages/main/games/TebakPasal.jsx` — pakai `JWData.pasalQuiz`
- Pindah `TebakKata.jsx` ke `pages/main/games/`

### Prioritas 4 — Migrate page existing ke foundation baru
- Replace `const C = window.C` jadi `window.JW_TOKENS`
- Replace inline `const THREADS = [...]` jadi `window.JWData.threads`
- Replace ad-hoc state jadi `JWStore.actions.X`

### Prioritas 5 — Infra
- Folder `deploy/` — nginx config, deploy script
- `.github/workflows/deploy.yml`
- `scripts/build_standalone.py`
- `package.json` (skeleton untuk eventual Next.js)

### TODO bug yang ditemukan
- Page `nala` di-route di `App.jsx` (`PageNala`) tapi belum yakin `nala-mascot-and-page.jsx` benar mengexpose `window.PageNala`. **Test manual perlu**: load `index.html` di browser, klik link Nala, cek apakah halaman muncul.
- Detail page yang stub-only (28 baris): PetisiDetail, LessonPlayer, JanjiDetail, PasporPublic, ReadingView, ThreadDetail — perlu dibuka satu-satu, kemungkinan placeholder.

## Cara Test Lokal

```bash
# Dari Windows (Git Bash atau PowerShell):
cd "D:\Website-Jubir Warga"
python -m http.server 8000
# Browser: http://localhost:8000/
```

## Komit

Setelah verify visual di browser, dari Windows:
```bash
cd "D:\Website-Jubir Warga"
git add -A
git status
git commit -m "Foundation: src/styles + src/data + src/lib + PWA icons"
git push origin main
```

(Saya tidak commit dari sini karena `.git/` mount-nya bermasalah dari sandbox Linux ke Windows D:.)

# PROMPT — CLAUDE DESIGN
## Prototipe Web Platform "Jubir Warga"

> Cara pakai: copy-paste seluruh dokumen ini ke Claude (atau Claude Design tool) sebagai satu prompt utuh. Sudah disusun dengan urutan brief → brand → IA → per-page spec → komponen → mini game → output yang diharapkan, supaya Claude bisa langsung mulai membuat prototipe interaktif tanpa banyak follow-up question.

---

## SECTION 0 — INSTRUKSI UNTUK CLAUDE

Saya butuh kamu membuat **prototipe website interaktif (high-fidelity)** untuk platform bernama **"Jubir Warga"** sebagai *single-page React artifact* (atau multi-page HTML jika lebih cocok), siap dipresentasikan ke tim & calon investor.

Yang saya butuhkan:
1. **Beranda (Today)** — landing utama yang sekaligus menjadi "feed harian".
2. **5 halaman pilar:** Komunitas, Karya, Kelas, Aksi, Main.
3. **Halaman Profil pengguna** ("KTP Digital Warga").
4. **Onboarding flow** singkat (3 langkah).
5. **1 mini game playable** (Citizen Wordle / Tebak Pasal) sebagai bukti konsep pilar PLAY.
6. **Komponen yang konsisten** di seluruh halaman (header, nav, kartu, badge, tombol, footer).

Buat ini sebagai **React component utama dengan tab/router internal** supaya 7 halaman bisa diakses dari satu artifact. Pakai Tailwind utility classes saja. Semua data dummy hard-coded — tidak perlu backend.

---

## SECTION 1 — TENTANG PRODUK

**Jubir Warga** ("Juru Bicara Warga") adalah platform online untuk anak muda Indonesia (17–39 tahun) yang ingin **berkumpul, berkarya, belajar, beraksi, dan bersenang-senang** seputar isu sosial-politik-budaya. Lahir 2023–2024 dari kolaborasi **SPD (Sindikasi Pemilu & Demokrasi)** & **Warga Muda** sebagai program pelatihan 90 anak muda untuk menuntut ide perubahan ke caleg/parpol di Pemilu 2024. Sekarang naik kelas menjadi **PT** dengan platform digital sebagai rumah jangka panjang.

**Posisi produk (untuk pemandu desain, jangan ditulis di UI):**
> "VICE Indonesia × Discord × Coursera × Change.org × Wordle, dengan DNA SPD × Warga Muda."

**Tagline yang sedang di-test (boleh kamu pakai salah satu di hero):**
- "Suara warga, rumahnya di sini."
- "Kumpul. Berkarya. Bersuara."
- "Jadi juru bicara untuk dirimu, kotamu, dan bangsamu."

**Audience inti:**
- Aulia (21, mahasiswi Bandung, "the curious onlooker") — mau ngerti isu publik tanpa baca jurnal.
- Reza (26, NGO Surabaya, "the aspiring speaker") — punya opini, butuh panggung.
- Sari (29, alumni Jubir Warga 2024, Jakarta, "the community builder") — mau organize komunitas.

---

## SECTION 2 — BRAND IDENTITY (WAJIB DIIKUTI)

Mengikuti **Jubir Warga Brand Guideline 2026** — ini bukan rebrand, ini ekstensi:

### 2.1 Palette (duotone utama, jangan di-out)
| Token | Hex | Pakai di mana |
|---|---|---|
| `--brand-blue` | **#1A2256** | Headline, button utama, logo, footer, footer text on cream |
| `--brand-cream` | **#FFFAEE** | Background utama (kanvas), kartu, hero |
| `--brand-blue-soft` | `#3B4A8A` | Secondary text, hover state, subtitle |
| `--ink-grey` | `#2A2D3A` | Body text di atas cream |
| `--line` | `#E6DECB` | Divider, border ringan |

**Aksen editorial yang boleh dipakai sparingly** (untuk highlight "Hot", "Aksi Sekarang", badge):
| Token | Hex | Aturan |
|---|---|---|
| `--accent-coral` | `#E8632B` | Maks 1 instance per "viewport"; badge urgent only |
| `--accent-marigold` | `#F2B137` | Streak/level/achievement |
| `--accent-mint` | `#7FB69E` | Status "Aktif", kelas live |

### 2.2 Tipografi
| Slot | Font | Padanan web (Google Fonts) | Aturan |
|---|---|---|---|
| Display headline | Vollkorn (atau alternatif: Playfair, Newsreader) | `font-family: 'Vollkorn', serif;` | Ukuran 48–96px, italic untuk emphasis editorial |
| UI / body / button | **Inter** | `font-family: 'Inter', sans-serif;` | 14–18px body, 500 medium untuk button |
| Display playful / handwriting | Caveat (padanan web untuk 어비 세현체 yang Korean) | `font-family: 'Caveat', cursive;` | Untuk "annotation" di atas elemen, badge sticker |
| Mono / data / kode | Fira Code / JetBrains Mono | `font-family: 'Fira Code', monospace;` | Counter, leaderboard angka, log streak |

### 2.3 Voice
- **Cerdas tapi tidak menggurui.** "Kita lagi ngomongin Pasal 28E nih — yuk kupas pelan-pelan."
- **Kritis tapi tidak sinis.** "Ada janji caleg yang kelihatannya bagus. Tapi ada catatannya."
- **Ringan dengan bobot.** Boleh meme, boleh jokes — tapi isunya tidak diecilkan.

### 2.4 Visual style
- **Modern Editorial.** Bayangkan VICE Indonesia atau Magdalene — banyak white space (cream space), tipografi besar, hierarchy jelas, vector illustration disesuaikan dengan judul.
- **Hand-drawn details.** Logo Jubir Warga bersifat hand-drawn (seperti spidol), tumpul, rounded. Gunakan ini sebagai *guiding character*: tombol jangan terlalu kotak, garis bisa sedikit "hand-drawn" feel (border-radius generous, beberapa squiggly underline).
- **iOS emoji boleh muncul** untuk variasi playful (jangan terlalu banyak, max 1–2 per kartu).
- **Vector illustration** di hero & kartu kelas — gaya flat dengan sedikit grain, palette duotone.

### 2.5 Logo
Karena tidak ada file logo aktual, gunakan **wordmark "Jubir Warga"** dengan font display + sedikit underline hand-drawn (gunakan `<svg>` inline atau `font-family: 'Caveat'` underline). Letakkan logo:
- Header: pojok kiri.
- Cover/hero homepage: tengah, di atas kalimat tagline.
- Footer: pojok kiri kecil + tagline.

---

## SECTION 3 — LAYOUT GLOBAL

### 3.1 Header (sticky)
- Tinggi 64px desktop, 56px mobile.
- Background `--brand-cream` dengan border-bottom 1px `--line`.
- Kiri: Logo "Jubir Warga".
- Tengah (desktop only): nav text — Beranda · Komunitas · Karya · Kelas · Aksi · Main.
- Kanan: ikon bel (notifikasi), avatar pengguna kecil dengan badge level (mis. "Lv 3"), tombol "Tulis" outline kecil.
- Mobile: hamburger menu kiri, logo tengah, avatar kanan. Bottom nav 5 ikon (Home/Komunitas/Karya/Aksi/Main) — Profil & Kelas akses lewat avatar/menu.

### 3.2 Footer
Background `--brand-blue` (`#1A2256`), text `--brand-cream`. Kolom:
- Kolom 1: logo + tagline + alamat *Jl. Tebet Barat Dalam IIC No. 14, Tebet, Jakarta Selatan*.
- Kolom 2: Produk — link ke 5 pilar.
- Kolom 3: Tentang — Cerita, Tim, Partner, Karir, Press.
- Kolom 4: Hubungi — IG `@jubirwarga.id`, email `info@jubirwarga.id`, tombol WA "Subscribe newsletter".
- Bottom strip: "© 2026 Jubir Warga. Sebuah platform oleh SPD × Warga Muda." + link Privacy & Terms.

### 3.3 Container & spacing
- Max width content: 1200px.
- Section padding vertikal: 96px desktop, 64px mobile.
- Gap antar kartu di grid: 24px.
- Border radius default: 16px untuk kartu, 12px untuk button, 999px untuk pill/badge.

---

## SECTION 4 — SPESIFIKASI PER HALAMAN

### Page 1 — BERANDA / TODAY (`#beranda`)

**Tujuan:** Buat user kembali setiap hari. Beranda = "feed hari ini" + 1 mini game ringan + 3 jendela ke pilar lain.

**Struktur (dari atas):**
1. **Hero "Today" strip** — full-width section, background `--brand-cream`. Kiri: tanggal hari ini ("Selasa, 28 April 2026") dengan font Caveat kecil di atas; di bawahnya headline editorial besar (Vollkorn 64px) — *contoh:* "Hari ini, kita ngomongin pasal 28E." Kanan: ilustrasi vector orang baca koran/laptop.
2. **Mini Game of the Day** kartu besar di tengah — preview "Citizen Wordle" 5×6 grid kosong, tombol "Main hari ini" warna coral. Di bawahnya: streak counter (font mono) "🔥 5 hari berturut-turut" + leaderboard top 3 mini.
3. **Tiga kolom kuratorial:**
   - **Lagi Hangat di Forum** — 3 thread, judul + jumlah balasan + chapter regional.
   - **Karya Terbaru** — 3 kartu vertikal: opini, vlog (thumbnail play), ilustrasi.
   - **Aksi Minggu Ini** — 1 polling cepat (bisa vote langsung), 1 candidate watch update, 1 petisi.
4. **"Kelas yang sedang seru"** — banner horizontal: 2 kelas sedang berjalan dengan progress bar dan jumlah peserta.
5. **CTA strip** — "Belum daftar? Daftar gratis, dapat KTP Warga Digital." Tombol coral besar.

### Page 2 — KOMUNITAS (`#komunitas`)

**Tujuan:** Forum diskusi + regional chapter + event komunitas.

**Struktur:**
1. **Header pilar** — judul besar "Komunitas — tempat warga ngobrol", subtitle 1 baris.
2. **Tab di bawah header:** "Semua · Forum · Chapter Regional · Event · Direktori Komunitas". Default: Forum.
3. **Forum view (default tab):**
   - Sidebar kiri: filter kategori (Politik, Lingkungan, Gender, Mental Health, Budaya Pop, Ekonomi, dst dengan emoji) + filter "Lagi panas / Baru / Top minggu ini".
   - Main: list thread cards. Tiap kartu: avatar pembuat + nama + chapter (mis "Bandung Raya"), judul thread (Vollkorn medium), 2 baris preview, footer baris (jumlah balasan, jumlah upvote, last activity, 2 tag).
   - Floating action button kanan bawah "+ Mulai diskusi" (coral).
4. **Chapter Regional view:** Peta Indonesia stylized (SVG sederhana atau grid kartu kota) — tiga chapter "live": Jakarta, Bandung Raya, Malang Raya. Tiap kartu chapter: jumlah anggota, event terdekat, tombol "Gabung".
5. **Event view:** 3–6 event card (poster + tanggal + lokasi + tombol RSVP).
6. **Direktori Komunitas:** grid 8–12 logo/nama komunitas mitra.

### Page 3 — KARYA / CREATOR SPACE (`#karya`)

**Tujuan:** Feed kreator anak muda. Mengubah audience jadi kontributor.

**Struktur:**
1. **Header pilar** — "Karya — panggung anak muda yang punya isi" + tombol kanan "Upload karya kamu" (coral).
2. **Tab format:** Semua · Tulisan · Vlog · Ilustrasi · Podcast · Standup · Zine.
3. **"Pilihan Editor Minggu Ini"** — strip horizontal scroll, 5 kartu besar dengan thumbnail editorial.
4. **Grid utama (masonry-style):**
   - Tulisan: kartu vertikal dengan judul Vollkorn besar, preview 2 baris, nama penulis + chapter + waktu baca.
   - Vlog: thumbnail 16:9 + tombol play overlay, durasi badge.
   - Ilustrasi: grid square, hover untuk title.
   - Podcast: kartu horizontal dengan waveform stylized + tombol play.
5. **Sidebar kanan (desktop):** "Kreator yang lagi naik" — 5 avatar + nama + jumlah karya + tombol follow. Di bawahnya: "Topik yang sering dibahas" dengan tag cloud.
6. **Footer halaman:** ajakan submit karya — "Kamu juga bisa naik panggung. Submit karya kamu →" dengan ilustrasi tangan.

### Page 4 — KELAS (`#kelas`)

**Tujuan:** LMS ringan. Kelas Jubir Warga + kelas lain.

**Struktur:**
1. **Header pilar** — "Kelas — belajar civic & ekspresi yang nyata-nyata kepake" + filter kategori.
2. **Featured: Kelas Jubir Warga** — kartu hero besar dengan ilustrasi + judul "Kelas Jubir Warga: dari Resah, ke Suara, ke Aksi". Detail: 6 minggu, 6 modul, sertifikat, mentor, harga "Rp 350.000 (atau gratis dengan aplikasi beasiswa)". Tombol coral besar "Daftar gelombang berikutnya" + tombol outline "Lihat silabus".
3. **Grid kelas lain (6–9 kartu):**
   - Tiap kartu: thumbnail ilustrasi, judul, nama mentor, durasi, level (Pemula/Menengah/Lanjut sebagai pill), harga.
   - Topik mengikuti modul Jubir Warga existing: *Youth Political Participation in the Digital Age, Politics and Popular Culture, Social Marketing & Fundraising, Standup Comedy untuk Kritik Politik, Fan-based Movement & Volunteer Management, Political Vlog Content Creation*.
4. **"Mentor di Jubir Warga"** — strip avatar 6–8 mentor (gambar dummy) dengan nama + 1 baris bio.
5. **"Alumni bilang"** — 3 testimoni sederhana dengan foto bulat.

### Page 5 — AKSI (`#aksi`)

**Tujuan:** Tutup loop dari belajar ke bertindak. Wajib gratis untuk semua.

**Struktur:**
1. **Header pilar** — "Aksi — bukan cuma ngomong, kita kerjain."
2. **Polling Hari Ini** — kartu lebar paling atas: pertanyaan ("Setuju ga kalau anggaran transportasi publik dinaikin dua kali lipat?"), 3 opsi, hasil real-time bar chart, jumlah suara.
3. **Candidate Watch** — daftar tracker janji-janji politik (5 baris). Tiap baris: foto kecil + nama + jabatan + janji ringkas + status badge ("Ditepati"/"Belum"/"Berjalan"/"Diingkari" dengan warna mint/marigold/blue/coral).
4. **Petisi Aktif** — grid 3 petisi: judul, target signature, progress bar, tombol "Tandatangani".
5. **Kampanye Kolektif** — 1 kartu hero kampanye besar, 2 kampanye kecil di samping.
6. **Strip "Integrasi ceksuaramu.com"** — embed widget hasil polling agregat dengan link "Lihat data lebih dalam".
7. **Footer halaman:** "Aksi di Jubir Warga selalu gratis. Selamanya."

### Page 6 — MAIN / MINI GAMES (`#main`)

**Tujuan:** Pintu masuk ringan. Mesin retensi harian.

**Struktur:**
1. **Header pilar** — "Main — ringan, harian, tetap ada bobotnya." + counter besar streak user.
2. **Game of the Day** — kartu besar tengah memainkan **Citizen Wordle** (lihat Section 6 di bawah untuk spec lengkap). Playable.
3. **Game Carousel** — 6–8 kartu game lain:
   - "Tebak Pasal" (cocokkan kutipan dengan pasal UU).
   - "Janji vs Realita" (drag & match).
   - "TTS Demokrasi" (mini crossword 7×7).
   - "Pop or Politics?" (judul lagu/film vs judul kebijakan).
   - "Quiz Sejarah Pemilu" (multiple choice 5 soal).
   - "Bingo Komunitas" (interactive bingo card).
   - "Spot the Hoaks" (5 headline, mana yang hoaks).
4. **Leaderboard global mingguan** — top 10 pemain dengan avatar + skor + chapter.
5. **Achievement / Badge collection** — grid 12 badge dengan visual locked/unlocked.

### Page 7 — PROFIL ("KTP Warga Digital", `#profil`)

**Tujuan:** Identitas user di platform. Bisa di-share.

**Struktur:**
1. **Hero card "KTP Warga Digital"** berukuran kartu kredit (rasio 1.6:1) — mockup persis kayak KTP/identity card:
   - Background `--brand-cream`, border `--brand-blue`, sudut hand-drawn rounded.
   - Foto bulat, nama, tagline pribadi (max 60 karakter), kota & chapter, level (Lv. 3 — Aktivis Mula), tanggal bergabung.
   - QR code kecil yang link ke profil publik.
   - Tombol "Bagikan KTP saya" (download PNG / share IG).
2. **Statistik baris** — Streak, Kelas selesai, Karya disubmit, Suara polling, Petisi ditandatangani (5 angka mono dengan label kecil).
3. **Tabs:** Karya saya · Kelas saya · Aktivitas · Badge.
4. **Karya saya:** grid karya yang user upload.
5. **Kelas saya:** progress bar tiap kelas + tombol "Lanjutkan".
6. **Aktivitas:** timeline 10 aksi terakhir (komen di thread, ikut polling, dst).
7. **Badge:** koleksi badge dengan filter Locked/Unlocked.

---

## SECTION 5 — ONBOARDING FLOW

3 langkah, modal/halaman penuh dengan vibe sejuk, ilustrasi besar, progress dot di atas.

1. **Step 1 — Halo, kenalan dulu.** Input: nama, kota, umur (slider 17–39). Subtitle: "Datamu cuma kita pakai untuk bikin pengalaman lebih pas, bukan untuk dijual. Janji."
2. **Step 2 — Apa yang kamu peduli?** Multi-select chip: Politik 🏛️, Lingkungan 🌱, Gender 💜, Mental Health 🧠, Ekonomi 💸, Pendidikan ✏️, Budaya Pop 🎬, Teknologi ⚙️, Komunitas Lokal 🏘️. Pilih min 2, max 5.
3. **Step 3 — Pintu masuk kamu mau lewat mana?** Tiga kartu pilihan (one-click): "Main mini game dulu" / "Lihat karya orang lain" / "Buka forum". User dilempar ke pilar tsb dengan welcome toast.

---

## SECTION 6 — SPEC MINI GAME PLAYABLE: CITIZEN WORDLE

Implementasi dalam React state — playable, bukan mockup.

**Mekanik:**
- Tebak kata 5 huruf dalam tema civic Indonesia (mis. PEMILU, WARGA, SUARA, RAKYAT, KAUKUS, PASAL, SAKSI, KORUM, DAPIL).
- 6 percobaan. Tiap huruf: hijau (`--accent-mint`) jika tepat, kuning (`--accent-marigold`) jika ada tapi salah posisi, abu-abu jika tidak ada.
- Keyboard QWERTY virtual di bawah grid (untuk mobile + desktop).
- Setelah menang/kalah → modal:
  - "Selamat / Coba lagi besok!"
  - "Kata hari ini: PEMILU."
  - **Card "tahukah kamu"** — penjelasan civic 2 kalimat tentang kata itu.
  - Tombol "Diskusi soal pemilu di Forum →" dan "Pelajari di Kelas →".
  - Streak counter +1 (atau reset jika kalah).
- Hard-code 1 kata target untuk demo (mis. "WARGA"), tapi tunjukkan flow lengkap.

**Visual:**
- Grid 5×6 dengan border `--brand-blue`, background `--brand-cream`.
- Huruf font Vollkorn bold, 32px.
- Tombol keyboard rounded, hover state, animasi flip 180° saat reveal warna.

---

## SECTION 7 — KOMPONEN YANG HARUS REUSABLE

Buat sebagai komponen kecil dan re-use di 7 halaman:

- `<Header />` (sticky, responsif)
- `<Footer />`
- `<NavTabs items={...} />`
- `<Card variant="thread|article|class|game|petition|action" />`
- `<Pill color="mint|coral|marigold|blue" />` — untuk badge & tag
- `<Button variant="primary|outline|ghost" size="sm|md|lg" />`
- `<HeroSection />` — header tiap pilar
- `<EmptyState message="..." illustration="..." />`
- `<UserAvatar size="sm|md|lg" showLevel={bool} />`
- `<StatBlock label="..." value="..." accent="mono" />`
- `<ProgressBar percent={n} />`
- `<Modal>` untuk onboarding & end-of-game.

---

## SECTION 8 — RESPONSIF

- **Desktop ≥ 1024px:** layout 12-grid, 3-kolom konten di mana relevan.
- **Tablet 768–1023px:** 2 kolom, sidebar collapse.
- **Mobile < 768px:**
  - Header jadi single bar dengan hamburger.
  - Bottom nav 5 ikon (`Beranda · Komunitas · Karya · Aksi · Main`); Kelas & Profil lewat menu.
  - Semua kartu jadi 1 kolom full width.
  - Mini game tetap playable (keyboard QWERTY responsif).

---

## SECTION 9 — DATA DUMMY

Untuk membuat prototipe terasa hidup, isi placeholder dengan data Indonesia yang realistis:

- **Nama user:** Aulia Pratiwi, Reza Adipratama, Sari Lestari, Kanta Widodo, Nadira Azzahra, Pram Faisal, Mei Chandra, Bilal Sukarno (founder Warga Muda — boleh disebut sebagai mentor), Erik Kurniawan (executive director SPD — boleh disebut sebagai narasumber).
- **Chapter regional:** Jakarta, Bandung Raya, Malang Raya, Yogyakarta (coming soon), Makassar (coming soon).
- **Topik thread contoh:** "RUU PPRT, kenapa mandek?", "Mental health di tempat kerja: pengalaman dari komunitas garmen Bandung", "Festival film vs festival pemilu — mana yang lebih ramai?", "Malang minggu ini: tarif parkir naik tanpa konsultasi".
- **Petisi contoh:** "Audit transparan APBD Jakarta 2026", "Kembalikan jam KRL 04.00 WIB", "Akses internet gratis untuk sekolah negeri".
- **Polling contoh:** "Kalau bisa pilih, kamu mau anggaran subsidi BBM dialihkan ke mana?".
- **Kelas mentor:** boleh sebut "Bilal Sukarno", "Erik Kurniawan", "Aqidatul Izza Zain", "Putra Satria" (semua nama dari tim SPD/Warga Muda yang sudah ada).
- **Brand mitra di footer & direktori:** SPD, Warga Muda, KitaBisa, Komisi.co, Indorelawan, ceksuaramu.com.

---

## SECTION 10 — DETAIL MIKRO YANG MEMBUAT BEDA

Hal-hal kecil yang harus ada untuk membuat prototipe terasa "Jubir Warga", bukan template generik:

1. **Underline hand-drawn** di bawah headline penting — pakai SVG path squiggly atau `text-decoration: underline wavy var(--accent-coral)`.
2. **Sticky note feel** untuk callout penting — kartu mini dengan rotasi kecil (-1° / +2°) dan shadow ringan.
3. **Caveat font annotation** sesekali di samping elemen utama — misal di samping grid mini game ada "← coba dulu, baru ngomong" tulisan tangan.
4. **Loading state yang punya kepribadian** — bukan spinner generik, pakai kalimat "Lagi dengerin warga…" atau "Kumpulin suara dulu…".
5. **Empty state yang playful** — misal forum kosong: ilustrasi orang duduk + "Belum ada yang mulai. Kamu duluan?"
6. **Microinteraction:** tombol ada ripple, kartu mini-lift saat hover, badge level bersinar pelan.
7. **Indonesian first** — semua copy dalam Bahasa Indonesia natural (boleh sesekali campur bahasa asing untuk istilah yang umum di anak muda).
8. **Aksesibilitas dasar:** kontras min 4.5:1, focus state jelas, semua interaksi bisa keyboard-only.

---

## SECTION 11 — APA YANG SAYA HARAPKAN DARI OUTPUT KAMU

Kembalikan **satu React artifact** (atau HTML+CSS+JS single file kalau lebih cocok) yang:

1. ✅ 7 halaman dapat diakses lewat tab/router internal di artifact.
2. ✅ Mini game Citizen Wordle benar-benar playable (state, keyboard, win/lose modal).
3. ✅ Onboarding flow 3 langkah berfungsi (state minimal).
4. ✅ Polling di halaman Aksi: klik opsi → bar chart update.
5. ✅ Header & Footer konsisten di semua halaman.
6. ✅ Responsive di desktop, tablet, mobile (test di viewport 375px).
7. ✅ Pakai semua warna & font sesuai brand guideline.
8. ✅ Visual style "Modern Editorial" dengan vector illustration ringan (boleh inline SVG sederhana).
9. ✅ Komentar `// PAGE: …` di kode supaya mudah di-handover ke developer.

**Yang TIDAK perlu kamu lakukan:**
- ❌ Setup backend / database — semua dummy.
- ❌ Implementasi auth — cukup tampilan login screen mock.
- ❌ Animasi kompleks (Lottie, dst) — cukup CSS transition halus.
- ❌ Image asset eksternal — pakai ilustrasi inline SVG sederhana atau placeholder.

---

## SECTION 12 — KALAU KAMU PERLU MEMUTUSKAN HAL YANG TIDAK ADA DI BRIEF

Default ke prinsip ini, urut prioritas:
1. **Brand guideline 2026 menang** atas selera estetik umum.
2. **Kebutuhan user tiga persona** menang atas "kelihatan keren".
3. **Cream + dark blue duotone harus dominan** — aksen warna lain maksimal 10% dari viewport.
4. **Indonesia first** dalam copy, contoh, ikon (mis. ikon yang relevan: ojek online, KTP, kartu suara).
5. **Editorial-playful** — kalau ragu antara serius vs playful, pilih playful tapi dengan substansi.

---

**Selesai. Mulai bangun prototipenya.**

Kalau butuh klarifikasi sebelum mulai, batasi maksimal 3 pertanyaan kunci. Selebihnya buat keputusan desain sendiri sesuai prinsip di atas.

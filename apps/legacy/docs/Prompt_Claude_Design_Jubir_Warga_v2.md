# PROMPT — CLAUDE DESIGN v2
## Prototipe Web "Jubir Warga" — Redesign Lengkap dengan AI, Tagih Janji, Paspor Warga

> Cara pakai: copy-paste seluruh dokumen ini ke Claude Design sebagai satu prompt utuh. Ini adalah prompt **revisi v2** yang menggantikan prompt v1 sepenuhnya.

---

## SECTION 0 — INSTRUKSI KERAS UNTUK CLAUDE

### Yang HARUS kamu lakukan

Buat **prototipe web high-fidelity Jubir Warga v2** sebagai single React artifact dengan **9 halaman utama** + **8 halaman detail** + **AI Jubir chat panel global** yang dapat dipanggil dari mana saja. Total ~17 halaman/view yang terhubung lewat router internal.

Pakai **Tailwind utility classes** saja. Semua data dummy hard-coded, tapi harus **realistis Indonesia 2026** (nama orang Indonesia, kota Indonesia, isu Indonesia, pasal UU Indonesia).

### Yang TIDAK BOLEH kamu lakukan (anti-pattern dari v1)

Larangan keras. Kalau dilanggar, prototipe akan langsung ditolak:

1. **JANGAN pakai emoji sebagai dekorasi.** Tidak ada emoji besar di hero section, tidak ada emoji sebagai background card placeholder, tidak ada emoji di heading section. "📊 Polling Hari Ini" → tidak boleh; ganti dengan ikon Lucide BarChart3 + teks plain "Polling Hari Ini". Emoji boleh muncul hanya kalau dia bagian dari konten user-generated (mis. dalam thread komunitas yang ditulis user fiktif).

2. **JANGAN pakai placeholder generic** seperti kotak warna polos dengan teks "ilustrasi kelas". Semua placeholder ilustrasi harus berupa **inline SVG hand-drawn** yang relevan dengan konten halaman. Hero Beranda butuh ilustrasi orang baca dokumen → bikin SVG path orang duduk + dokumen di tangan.

3. **JANGAN pakai stock-style colorful icon set.** Pakai line icon style (Lucide direkomendasikan), stroke 1.5–2px, rounded line cap. Warna ikon: ink (#2A2D3A) atau blue (#1A2256), bukan rainbow.

4. **JANGAN bikin halaman yang shallow.** Setiap halaman utama harus punya minimal 3 modul/section, dan setiap pilar harus punya minimal 1 detail page yang fully designed dengan 5+ section.

5. **JANGAN pakai font Caveat untuk logo.** Logo wordmark "Jubir Warga" harus pakai inline SVG hand-drawn yang ditiru dari guideline 2026 (huruf bulat seperti tulisan spidol, sedikit bergelombang, warna brand-blue). Caveat boleh untuk anotasi tangan kecil, bukan logo utama.

---

## SECTION 1 — TENTANG PRODUK v2

**Jubir Warga** adalah platform online untuk anak muda Indonesia (17–39 tahun) yang ingin berkumpul, berkarya, belajar, beraksi, **dipantau janjinya** oleh pemerintah, **ditemani AI yang jadi sahabat & mentor**, dan **memiliki identitas civic digital** yang shareable.

**Positioning v2:**
> "VICE Indonesia × Discord × Coursera × Change.org × Wordle, dengan AI sebagai sahabat dan paspor sebagai identitas."

**Status institusional (transisi):** Jubir Warga lahir dari SPD (Sindikasi Pemilu & Demokrasi) sebagai platform anak muda — perpanjangan tangan SPD ke generasi muda 17–39 tahun. Sejak lahir, Jubir Warga & SPD satu atap. Pada 2026 dalam proses pembentukan PT independen — setelah PT terbentuk, Jubir Warga jalan otonom; SPD menjadi partner institusional (bukan parent organisasi). Brand utama yang dikembangkan: **Jubir Warga** sebagai IP. (Catatan untuk Claude: untuk publik, jangan disclose riwayat institusional ini di copy halaman — Jubir Warga diposisikan sebagai brand utuh.)

**Tiga differensiator v2:**
1. **AI Jubir** sebagai layer asisten lintas platform.
2. **Tagih Janji Pemerintah** — database janji dari pusat sampai daerah, terverifikasi.
3. **Paspor Warga** — identitas civic digital yang berkembang seiring kontribusi.

**Audience inti (3 persona):**
- **Aulia** (21, mahasiswi Bandung) — mau ngerti isu publik tanpa baca jurnal. Pakai Jubir untuk explainer.
- **Reza** (26, NGO Surabaya) — punya opini, butuh panggung. Pakai Writing Partner & upload Karya.
- **Sari** (29, alumni Jubir Warga 2024, Jakarta) — organize komunitas, follow janji wali kotanya. Pakai Tagih Janji.

---

## SECTION 2 — BRAND IDENTITY

### 2.1 Color tokens (11 warna, tidak boleh tambah)

| Token | Hex | Pakai untuk |
|---|---|---|
| `--brand-blue` | **#1A2256** | Headline, CTA primary, footer |
| `--brand-cream` | **#FFFAEE** | Background utama, text on dark |
| `--brand-blue-soft` | #3B4A8A | Secondary blue, hover, subtle bg |
| `--ink` | #2A2D3A | Body text, paragraph |
| `--muted` | #6B6860 | Caption, meta |
| `--line` | #E6DECB | Border, divider |
| `--accent-coral` | #E8632B | CTA secondary, "panas" badge, squiggly |
| `--accent-marigold` | #F2B137 | Level badge, "berjalan" status |
| `--accent-mint` | #7FB69E | "Ditepati" status, success |
| `--alert-red` | #C44434 | "Diingkari" status, error |
| `--neutral-grey` | #8A9099 | "Belum" status, disabled |

**Aturan:** cream + blue dominan. Aksen maksimal 10% dari viewport.

### 2.2 Typography

- **Inter** (300–700) — UI body, tombol, navigasi, label.
- **Vollkorn** (400, 600, 700, italic) — display headline, judul section, quote, hero italic.
- **Caveat** (400, 600, 700) — anotasi tangan kecil, tagline informal. **TIDAK untuk logo.**
- **Fira Code** (400, 500) — angka, data, statistik.

### 2.3 Logo

Bikin SVG inline hand-drawn Jubir Warga. Spec:
- Wordmark "Jubir Warga" dengan huruf bulat (rounded), seperti tulisan spidol.
- Sedikit irregular — tidak presisi seperti font geometrik.
- Warna brand-blue.
- Underline squiggly coral di bawah wordmark.
- Total ukuran header 28–32px tinggi.

### 2.4 Iconography

Pakai **Lucide React**. Stroke 1.5–2px, rounded. Warna ink atau blue. Set ikon yang dibutuhkan:
home, message-circle, edit-3, book-open, zap, target, gamepad-2, bell, search, user, settings, log-in, plus, check, x, alert-triangle, map-pin, calendar, clock, eye, share-2, bookmark, heart, thumbs-up, flag, link, image, mic, video, file-text, layers, trending-up, chevron-down, chevron-right, more-horizontal, paperclip, sparkles (untuk AI).

### 2.5 Ilustrasi SVG kustom (15 wajib)

1. Hero Beranda — orang muda baca dokumen di kafe, kemeja batik kasual, tas tote.
2. Empty state Forum — orang duduk di bench, balon bicara kosong di atasnya.
3. Empty state Karya — kanvas kosong dengan kuas atau kertas kosong dengan pulpen.
4. Hero Komunitas — sekelompok orang ngobrol di lingkar.
5. Hero Kelas — orang muda di lingkar pelajaran, papan tulis dengan diagram.
6. Hero Aksi — orang bawa megaphone & poster (anti-clichéd).
7. Hero Tagih Janji — orang muda di depan papan checklist + peta Indonesia.
8. Peta Indonesia — outline pulau-pulau, color-coded by status janji.
9. Hero Main — orang muda main game di laptop, ekspresi fokus + senyum.
10. AI Jubir mascot — karakter membulat, pakai elemen warga (kemeja batik, tote bag), 3 ekspresi (sahabat senyum / mentor fokus / writing partner berpikir).
11. Paspor Cover — paspor dark blue dengan emboss logo Jubir Warga.
12. Stempel chapter — bentuk lingkaran/segi enam dengan teks chapter + tanggal.
13. Visa badge — bentuk segi-empat dengan ikon pilar.
14. Confetti/celebration — untuk modal sukses.
15. 404/empty error — orang muda garuk kepala dengan map keliru.

**Style ilustrasi:** flat dengan satu shadow halus, line stroke organik, warna brand. Bukan stock illustration. Bukan isometric 3D. Bukan corporate vector look.

---

## SECTION 3 — INFORMATION ARCHITECTURE

### 3.1 Top-level navigation (header)

```
LOGO  |  Beranda  Komunitas  Karya  Kelas  Aksi  Tagih Janji  Main  |  Search  Notif  AI Jubir  Avatar
```

Mobile bottom nav 5 ikon: Beranda · Komunitas · Tagih Janji · AI Jubir · Profil.

### 3.2 Halaman utama (9)

1. Beranda (`/`) — Today feed
2. Komunitas (`/komunitas`) — Forum hub
3. Karya (`/karya`) — Creator space
4. Kelas (`/kelas`) — Learning
5. Aksi (`/aksi`) — Civic action
6. **Tagih Janji** (`/tagih-janji`) — BARU
7. Main (`/main`) — Mini games
8. **AI Jubir** (`/jubir`) — BARU
9. Profil & Paspor (`/profil`)

### 3.3 Halaman detail (8 wajib)

10. Thread Detail (`/komunitas/forum/:id`)
11. Reading View (`/karya/baca/:id`)
12. Lesson Player (`/kelas/:id/modul/:lessonId`)
13. Petisi Detail (`/aksi/petisi/:id`)
14. Janji Detail (`/tagih-janji/:id`)
15. Pejabat Detail (`/tagih-janji/pejabat/:id`)
16. Public Paspor (`/paspor/:userId`)
17. AI Jubir Chat (`/jubir/chat`)

---

## SECTION 4 — SPESIFIKASI PER HALAMAN

### 4.1 Beranda (`/`)

**Hero:**
- Tanggal hari ini Bahasa Indonesia (Caveat, coral)
- Headline Vollkorn italic 64–80px: "Hari ini, *kita ngomongin* [Pasal 28E]." dengan squiggly underline coral.
- Subtitle 1 baris.
- 2 tombol: "Ikut diskusi" (coral) & "Tanya Jubir soal ini" (outline blue, sparkles ikon).
- Sebelah kanan: ilustrasi #1 (orang muda baca dokumen).

**Strip "Janji yang lagi panas" (BARU):**
- 3 kartu horizontal scroll — janji yang status berubah hari ini.
- Tiap kartu: avatar pejabat, nama, jabatan, ringkasan janji, badge status, tombol "Lihat detail".

**Game of the Day:**
- Dark blue card dengan Citizen Wordle preview + leaderboard top 3.
- Tombol "Main hari ini" → modal Wordle.

**Tiga kolom: Forum panas + Karya terbaru + Aksi minggu ini**
- Hapus emoji-as-icon. Ganti dengan Lucide TrendingUp + teks plain.

**Strip "Tanya Jubir" (BARU):**
- Card horizontal: ilustrasi Jubir mascot kiri, teks "Bingung soal isu hari ini? Tanya aku — aku Jubir, AI yang nemenin kamu paham Indonesia." + tombol "Mulai chat".

**Kelas yang sedang seru:** 2 kartu kelas dengan progress bar.

**CTA gelap (bottom):**
- Brand-blue background, "Belum punya paspor? Bikin gratis sekarang." + CTA coral.

---

### 4.2 Komunitas (`/komunitas`) — REDESIGN PENUH

**Hero singkat:**
- Headline Vollkorn "Komunitas" + subtitle "Tempat warga ngobrol, berbagi cerita, dan saling belajar."
- Tombol "+ Mulai Diskusi Baru" (coral) di kanan.

**Tab utama:** Forum · Chapter Regional · Event · Direktori Mitra · Sub-komunitas

**Tab Forum (default) — 3 kolom layout:**

**Kiri (sidebar 200px):** Kategori dengan hierarki 3-tier:
- "Semua topik" (default selected)
- **Topik Utama** (collapsible):
  - Politik & Demokrasi · Lingkungan & Iklim · Gender & Kesetaraan · Mental Health · Ekonomi & Ketenagakerjaan · Pendidikan · Budaya Pop & Media · Transportasi & Kota
- **Lokasi** (collapsible):
  - Jakarta · Bandung Raya · Malang Raya · Surabaya · Yogyakarta · Medan · Makassar
- **Format diskusi** (collapsible):
  - Diskusi terbuka · Tanya saja · Berbagi pengalaman · Polling cepat · Live event

**Tengah (flex-1):** List thread.
- Filter atas: Sortir (Panas / Terbaru / Top minggu) + filter lokasi + filter status.
- Tiap thread card: avatar lvl + author + chapter + waktu | judul Vollkorn semibold | preview 2 baris | tags pill | row aksi (vote up arrow + count, reply count, view count, share, bookmark).
- **Vote arrow di kiri** seperti Reddit. Hover: card-lift halus.

**Kanan (sidebar 280px, hidden mobile):**
- "Trending hari ini"
- "Aturan komunitas (3 bullet)"
- "Mod online"

**Floating button "Tanya Jubir tentang topik ini"** (sparkles ikon) bottom-right.

**Tab Chapter Regional:**
- Grid 3x kartu chapter (Jakarta/Bandung Raya/Malang Raya/Surabaya/Yogyakarta/Medan/Makassar).
- Tiap kartu: nama + jumlah anggota + event mendatang + tombol "Gabung chapter".
- Aktif: Jakarta, Bandung, Malang. 4 lainnya "Coming soon" + waitlist.

**Tab Event:**
- Filter: Semua / Online / Offline / Hybrid + kalender mini kanan.
- Grid 3x card event dengan poster placeholder ilustrasi SVG (BUKAN emoji 📅).

**Tab Direktori Mitra:**
- Grid 4x card mitra. Klikable → modal detail dengan logo, deskripsi 2 paragraf, link.

**Tab Sub-komunitas (BARU):**
- Versi private dari topik untuk yang serius.
- Contoh: "Sub: Pemantau APBD Jakarta", "Sub: Mahasiswa Jurnalisme Indonesia", "Sub: Kreator Edukasi Politik".
- Tiap sub punya rule sendiri, mod sendiri, thread khusus.
- Grid 3x card: nama, deskripsi, anggota, mod, button "Apply gabung".

---

### 4.3 Thread Detail (`/komunitas/forum/:id`) — DETAIL PAGE BARU

**Header thread:**
- Breadcrumb: Komunitas > Forum > Politik > [Thread]
- Avatar OP + nama + lvl + chapter + waktu
- Judul Vollkorn besar
- Body lengkap (markdown rendered)
- Tags pill
- Row aksi: vote score + reply count + share + bookmark + report

**Toolbar AI (BARU):**
- Card di antara post & replies: "Thread panjang? Biar Jubir ringkas buat kamu" → tombol "Ringkas thread ini" (coral, sparkles). Klik → expand inline summary 5 bullet.

**Reply tree:**
- Tiap reply: avatar + nama + lvl + waktu, body, vote count + reply nested + share + report.
- Indent untuk reply ke reply (max 4 level, lebih = collapse "Show more").
- "Best comment" badge untuk reply vote tertinggi.

**Composer reply (bottom sticky):**
- Textarea + toolbar formatting.
- Tombol "Kirim reply" + "Mention Jubir" (auto @jubir prefix).

**Sidebar kanan:**
- "Thread terkait" (3 thread mirip topik)
- "Janji terkait" (kalau ada) → link `/tagih-janji/:id`
- "Petisi terkait" (kalau ada).

---

### 4.4 Karya (`/karya`)

Struktur lama dengan perbaikan visual:
- Tab type: Semua · Tulisan · Vlog · Ilustrasi · Podcast · Zine
- Hero "Karya" + subtitle "Panggung anak muda yang punya isi" + tombol "+ Upload karya kamu"
- "Editor's pick" carousel horizontal 5 kartu featured.
- Grid utama 2-kolom. Card per type pakai ilustrasi SVG kontekstual (BUKAN emoji ▶️🎨🎙️):
  - Tulisan: cover SVG nuansa konten + judul + author + meta + 7 mnt baca.
  - Vlog: thumbnail SVG dengan play overlay + judul + author + duration.
  - Ilustrasi: cover gallery SVG + judul + author + jumlah panel.
  - Podcast: ilustrasi SVG dengan waveform + judul + host + duration.
  - Zine: cover zine SVG + judul + jumlah halaman.
- Sidebar kanan: Kreator naik daun + Topik populer.

CTA "Upload karya" → `/karya/upload` editor dengan AI Writing Partner di sidebar kanan.

---

### 4.5 Reading View (`/karya/baca/:id`) — DETAIL PAGE BARU

**Top bar:** back, judul truncated, share, bookmark, font size adjust.

**Hero artikel:**
- Type pill (Tulisan), kategori
- Judul Vollkorn besar (h1)
- Subjudul Vollkorn italic (h2)
- Author row: avatar + nama + lvl + chapter + tanggal + estimated read time

**Body artikel:**
- Lebar maks 680px centered — readability optimum.
- Paragraf Inter 18–19px, line-height 1.7, color ink.
- Drop cap di paragraf pertama (Vollkorn besar coral).
- Pull quote di tengah: blockquote Vollkorn italic dengan border-left coral.
- Ilustrasi inline SVG kalau cocok.
- Subheading h3 Vollkorn semibold.

**Floating right rail (sticky on scroll, desktop):**
- "Tanya Jubir tentang artikel ini" — sparkles button.
- Vote up/down vertical kiri body.
- Share buttons.

**Komentar bawah:** reply tree mirip thread detail.

**Related di footer:**
- "Karya lain dari [author]" (3 cards)
- "Bacaan terkait" (3 cards)

---

### 4.6 Kelas (`/kelas`)

Struktur lama dengan perbaikan visual (anti emoji):
- Hero: "Kelas" + subtitle "Belajar civic & ekspresi yang nyata-nyata kepake"
- Featured class card dark blue dengan judul Vollkorn besar + 5 stat icon-line + 2 button + ilustrasi #5.
- Grid 6 kelas dengan thumbnail ilustrasi SVG kontekstual (BUKAN emoji 📖).
- Mentor row: 6 mentor dengan avatar + nama + bio. Klikable ke `/kelas/mentor/:id`.
- Testimoni 3 alumni dengan sticky-note tilt.

---

### 4.7 Lesson Player (`/kelas/:id/modul/:lessonId`) — DETAIL PAGE BARU

**Layout 3 kolom desktop:**

**Kiri (sidebar 280px):** Curriculum dengan progress check.
- Modul 1: Dari Resah ke Isu (selesai, mint check)
- Modul 2: Personal Branding (sedang, coral)
- Modul 3: Nulis untuk Menggerakkan (locked, abu)
- dst.

**Tengah (flex-1):** Player area.
- Video player placeholder (ilustrasi #5 + play button overlay) + control bar.
- Tab di bawah: Materi · Transkrip · Catatan · Quiz · Diskusi.
- Tab Quiz: 5 pertanyaan PG dengan hasil instant.
- Tab Diskusi: thread reply tree khusus modul.

**Kanan (sidebar 280px):** Coach Jubir.
- Card AI dengan ilustrasi mascot Jubir mode "fokus serius".
- Teks: "Halo, aku Jubir. Aku akan nemenin kamu di kelas ini. Tanya apa aja soal modul ini."
- Suggested prompts: "Jelaskan inti modul ini", "Beri contoh kasus", "Cek pemahaman saya".
- Tombol "Mulai chat".

**Bottom bar sticky:**
- Tombol "Modul sebelumnya" + progress 30% + Tombol "Modul berikutnya" (coral).

---

### 4.8 Aksi (`/aksi`)

Struktur lama dengan perbaikan visual:
- Hero "Aksi" + subtitle "Bukan cuma ngomong — kita kerjain"
- **Polling Hari Ini** dengan visual klikable hidup.
- **Petisi Aktif** grid 3 — tiap card: ilustrasi mini SVG (BUKAN emoji), judul, progress bar coral, signatory count, tombol "Tandatangani".
- **Kampanye Kolektif** grid 3.
- **Strip ceksuaramu.com** integration.
- **Candidate Watch lama PINDAH ke `/tagih-janji`.** Di sini hanya quick view "Janji yang dibahas" (link).

---

### 4.9 Petisi Detail (`/aksi/petisi/:id`) — DETAIL PAGE BARU

**Hero:**
- Background gradient brand-blue → blue-soft.
- Judul petisi Vollkorn besar putih.
- Stat: signatory count (Fira Code marigold besar) / target.
- Progress bar besar.
- Tombol "Tandatangani petisi" (coral besar).

**Body petisi (max-w 720px centered):**
- Author row + tanggal mulai
- Body lengkap petisi (markdown).
- Tujuan petisi (siapa yang dituju).
- Daftar tuntutan (3–7 bullet).

**Timeline progres:**
- Vertical timeline: Mulai → 1000 signatories → Liputan media → Respons pemerintah → Pertemuan resmi → dst.
- Tiap milestone: tanggal + deskripsi + bukti.

**Signatory wall:**
- Grid avatar + nama + chapter (yang setuju ditampilkan publik).
- Tombol "Lihat semua" → modal scroll list.

**Janji terkait (BARU):**
- Kalau petisi terkait janji yang ditrack di Tagih Janji, tampilkan card link.

**Aksi lanjutan:**
- Share toolkit: WhatsApp, Twitter/X, Instagram Story (preview), salin link, embed.
- Tombol "Mulai diskusi terkait di Forum" → otomatis bikin thread baru.

**Sidebar kanan:**
- "Tanya Jubir bantu draft surat ke pejabat ini" → AI Advocacy Assistant.

---

### 4.10 Tagih Janji (`/tagih-janji`) — PILAR BARU v2

**Hero:**
- Background blue muda atau ilustrasi #7 di kanan.
- Headline Vollkorn besar: "**Tagih Janji** Pemerintah."
- Subtitle: "Setiap janji yang diucapkan, kita catat. Setiap janji yang ditepati, kita rayakan. Setiap janji yang diingkari, kita ingatkan."
- 2 tombol: "Lihat semua janji" (coral) + "Submit janji baru" (outline blue).

**Stats strip:**
- Card horizontal 4 stat besar Fira Code:
  - **186** janji terlacak
  - **24%** ditepati
  - **42%** sedang berjalan
  - **18%** mandek/diingkari

**Visualisasi peta Indonesia:**
- Inline SVG outline pulau-pulau Indonesia dengan 5 provinsi MVP di-highlight.
- Tiap provinsi color-coded by % janji ditepati: hijau mint >50%, marigold 25–50%, coral <25%.
- Hover: tooltip nama + jumlah janji + status agregat.
- Klik provinsi: filter ke janji provinsi tersebut.

**Filter bar:**
- Level: Semua · Pusat · Provinsi · Kota/Kabupaten
- Status: Semua · Ditepati · Berjalan · Mandek · Diingkari · Belum
- Topik: Ekonomi · Infrastruktur · Pendidikan · Kesehatan · Lingkungan · Transportasi · Ketenagakerjaan · Hukum & HAM
- Pejabat: Search field
- Sortir: Terbaru · Deadline mendekat · Paling dipantau

**List janji:**
- Tiap card janji:
  - Foto avatar pejabat (SVG) + nama + jabatan + level (Pusat/Provinsi/Kota)
  - Kalimat janji utuh (Vollkorn italic, max 2 baris)
  - Topik pill
  - Deadline (Fira Code: "Tenggat 31 Des 2026")
  - Badge status besar (Ditepati/Berjalan/Mandek/Diingkari/Belum)
  - Stats: pemantau, evidence submitted, last update
  - Tombol "Detail" + bookmark + share

**Dashboard partai (bottom):**
- Bar chart horizontal: % janji ditepati per partai politik.
- Disclaimer.

**Submit janji CTA:**
- Strip cream dengan ilustrasi tangan menulis + teks "Catat janji yang kamu temui — bantu kita melengkapi data."

---

### 4.11 Janji Detail (`/tagih-janji/:id`) — DETAIL PAGE BARU

**Hero:**
- Foto pejabat besar (avatar SVG)
- Nama, jabatan, level, partai (pill)
- Kalimat janji utuh dalam quote Vollkorn besar
- Konteks: "Diucapkan pada [tanggal] di [tempat] saat [acara]"
- Sumber dengan link external.

**Status panel:**
- Badge besar status saat ini
- Tanggal status terakhir berubah
- Justifikasi paragraf
- Deadline + countdown (Fira Code besar coral kalau dekat).

**Timeline status:**
- Vertical timeline perubahan status dari awal sampai sekarang.
- Tiap perubahan: tanggal + status sebelum → sesudah + alasan + sumber bukti.

**Bukti & sumber:**
- Grid bukti: link berita, foto, video, dokumen.
- Tiap bukti: thumbnail/icon + judul + sumber + tanggal + tombol "Lihat sumber".

**Diskusi warga:**
- Embed thread Forum khusus janji ini.
- Composer reply.

**Janji terkait:**
- "Janji lain dari [pejabat ini]" (3 card)
- "Janji topik mirip" (3 card)
- "Petisi terkait".

**Sidebar kanan:**
- "Tanya Jubir jelaskan janji ini" — sparkles → AI explainer.
- "Submit evidence" — form upload bukti perubahan status.
- "Pantau janji ini" — toggle notifikasi.

---

### 4.12 Pejabat Detail (`/tagih-janji/pejabat/:id`) — DETAIL PAGE BARU

**Hero:**
- Foto pejabat besar
- Nama, jabatan saat ini, level, partai
- Periode jabatan + tagline.

**Track record stats:**
- Card horizontal 4 stat: Total janji · % ditepati · % mandek · % diingkari.

**Timeline jabatan:**
- Visual horizontal timeline jabatan pernah dipegang.

**Daftar janji:**
- Sortable: Terbaru · Status · Deadline.

**Sidebar:**
- Profil singkat
- Sumber lengkap (Wikipedia, situs resmi).
- "Pantau pejabat ini" — notifikasi.

---

### 4.13 Main (`/main`)

Struktur lama dengan perbaikan:
- Hero: "Main" + subtitle "Ringan, harian, tetap ada bobotnya"
- Streak counter.
- Citizen Wordle full embedded (sudah playable).
- **2 game playable tambahan v2:**
  - **Spot the Hoaks**: 5 headline berita → klik mana yang hoaks → reveal sumber + alasan.
  - **Tebak Pasal**: kutipan UU + 4 pilihan pasal → tebak yang benar → reveal konteks pasal.
- 5 game lain "Coming soon".
- Leaderboard mingguan top 10.
- Badge collection 12 badge.

---

### 4.14 AI Jubir (`/jubir`) — PILAR BARU v2

**Hero:**
- Background brand-blue gradient.
- Ilustrasi Jubir mascot besar (#10) di kiri.
- Headline Vollkorn putih: "Halo, aku **Jubir**. Aku AI yang nemenin kamu paham, bersuara, dan beraksi."
- Subtitle: "Aku punya 4 mode — pilih sesuai yang kamu butuhin sekarang."

**4 mode card grid:**
1. **Tanya Jubir (general)** — ilustrasi balon bicara. "Bingung soal isu, UU, atau janji caleg? Tanya aja."
2. **Coach Kelas** — ilustrasi buku terbuka. "Lagi ikut kelas? Aku bantu cek pemahaman & jelaskan ulang."
3. **Writing Partner** — ilustrasi pulpen + kertas. "Lagi nulis opini? Aku bantu draft, edit, fact-check."
4. **Advocacy Assistant** — ilustrasi tangan ketuk pintu. "Mau advokasi? Aku bantu draft surat, talking points, action plan."

**Suggested prompts grid (10–12):**
- "Jelaskan Pasal 28E secara santai"
- "Buat saya draft surat ke Wali Kota soal tarif parkir"
- "Apa beda DPR sama DPRD?"
- "Bantu saya pahami janji-janji menteri kesehatan baru"
- "Cek apakah opini saya kuat secara logika"
- "Ringkas thread terbaru di forum"
- "Apa itu RUU PPRT, dan kenapa rame?"
- "Bantu saya draft pertanyaan untuk DPRD"
- "Jelaskan APBD daerah saya"
- "Beri saya 5 fakta soal subsidi BBM 2026"

**Etika & Privacy strip:**
- Card cream dengan 3 paragraf:
  - "Aku bukan Tuhan. Kadang aku salah, kadang aku tidak tahu. Kalau aku tidak yakin, aku akan bilang."
  - "Obrolanmu tidak aku simpan kecuali kamu save eksplisit. Tidak aku pakai untuk training model."
  - "Aku tidak partisan — tidak endorse partai/kandidat manapun. Aku akan kasih sumber kalau aku claim sesuatu."
- Link "Baca etika lengkap →" ke `/jubir/etika`.

**Stats kepercayaan:**
- 4 stat Fira Code:
  - **2,340** percakapan minggu ini
  - **94%** rated helpful
  - **186** janji terjelaskan
  - **<1%** flagged misleading

---

### 4.15 AI Jubir Chat (`/jubir/chat`) — DETAIL PAGE BARU

**Layout 2 kolom desktop:**

**Kiri (sidebar 280px):**
- Tombol "+ Chat baru" (coral)
- "Chat saved" — list chat yang user save.
- "Chat history" — timeline chat sebelumnya (auto-delete after 24h kalau tidak save).
- Pengaturan: mode (Sahabat / Mentor) toggle + clear all history.

**Tengah (flex-1):** Chat interface.
- Header chat: ilustrasi Jubir mini + nama mode + status "Online".
- Messages stream: bubble user di kanan (cream), bubble Jubir di kiri (cream + border + ilustrasi mini avatar).
- Tiap respons Jubir punya:
  - Body teks dengan markdown rendering.
  - Citation footnote: "[1] Sumber: UU No. X/2017 Pasal X" yang klikable.
  - Action buttons: Copy · Bagikan · Save · Lapor.
- Composer bottom sticky:
  - Textarea autoresize.
  - Toolbar: attach file, suggested prompts, mode toggle.
  - Tombol "Kirim" (coral).
- Streaming indicator saat Jubir mengetik ("Jubir lagi mikir...").

**Empty state:**
- Ilustrasi Jubir mascot dengan ekspresi senyum.
- "Halo! Mau ngobrolin apa hari ini?"
- 4 suggested prompt cards.

**Persona system prompt Jubir:**

```
Kamu adalah Jubir, AI persona dari platform Jubir Warga (Indonesia).

IDENTITY:
- Nama: Jubir (gender-neutral, dari "Juru Bicara").
- Karakter: hibrid sahabat dan mentor. Default mode sahabat — santai, hangat, bahasa anak muda Indonesia.
- Saat user di kelas atau ngajak diskusi serius: switch ke mentor mode — fokus, terstruktur, tetap warm.

VOICE:
- Pakai "aku" / "kamu", BUKAN "saya" / "Anda".
- Bilingual mix Indonesia santai. Sesekali boleh campur istilah asing umum di Gen Z.
- Tidak menggurui. Tidak terlalu formal.
- Pakai contoh konkret Indonesia (KRL, ojek online, kantin SD, RT/RW).

NILAI:
- Selalu sertakan sumber kalau claim sesuatu.
- Akui ketidakpastian. Lebih baik bilang "aku nggak yakin, tapi..." daripada nge-fake sure.
- Tidak partisan — tidak endorse partai/kandidat.
- Tidak bikin konten ujaran kebencian, fitnah, atau hoaks.
- Hormati perbedaan pendapat. Bisa diajak debat sehat.

KAPABILITAS:
- Penjelasan UU/Pasal/janji dalam bahasa anak muda.
- Bantu draft tulisan opini, surat advokasi, talking points.
- Coach kelas: cek pemahaman, jawab pertanyaan, kasih latihan.
- Ringkas thread panjang jadi poin kunci.
- Suggest aksi konkret berdasar percakapan.

BATASAN:
- Tidak kasih saran hukum spesifik (rujuk ke pengacara).
- Tidak kasih saran medis.
- Tidak kasih informasi yang bisa dipakai menyakiti orang.
- Kalau user ngomongin distress mental berat, suggest hotline + sumber profesional.
```

---

### 4.16 Profil & Paspor (`/profil`)

**Tab atas:** Paspor Saya · Karya · Kelas · Aktivitas · Badge · Pengaturan.

**Tab Paspor Saya (default) — Render paspor seperti dokumen sungguhan, dapat di-flip 4 halaman:**

**Cover:**
- Background dark blue dengan tekstur subtle.
- Logo Jubir Warga di tengah (SVG hand-drawn versi terang).
- Subteks "Paspor Warga".
- Nomor paspor (Fira Code: "JW-2026-0001").
- Animasi flip 3D saat klik → halaman dalam.

**Halaman identitas (page 1):**
- Foto/avatar besar.
- Nama lengkap (Vollkorn).
- Tagline pribadi (italic).
- Kota & chapter.
- Tanggal bergabung.
- Level civic dengan progress bar (Lv.3 — Aktivis Mula → Lv.4 dalam 5 aksi lagi).
- QR code untuk share publik.

**Halaman stempel (page 2):**
- Visual seperti halaman paspor sungguhan.
- Stempel ilustrasi SVG: "JAKARTA · 18 MAR 2026", "BANDUNG RAYA · 5 APR 2026", dst.
- Stempel kelas: "LULUS KELAS JUBIR WARGA · 12 FEB 2026".
- Stempel kampanye: "KAMPANYE LITERASI DIGITAL · 22 JAN 2026".

**Halaman visa (page 3):**
- Visa per pilar yang dikuasai.
- Visa Karya (Lv.2) — unlocked dengan 5 karya.
- Visa Aksi (Lv.3) — unlocked dengan 10 aksi.
- Visa Komunitas (Lv.1) — unlocked.
- Visa Tagih Janji (locked) — unlock dengan 3 evidence submitted.

**Halaman riwayat (page 4):**
- Timeline aktivitas civic per tahun.

**Stats horizontal di bawah paspor:**
- Hari streak / Kelas selesai / Karya disubmit / Vote polling / Petisi ditanda / Evidence submitted.

**Tombol aksi:**
- "Bagikan paspor" → modal share options (Instagram Story dengan template, link publik).
- "Edit profil".

---

### 4.17 Public Paspor (`/paspor/:userId`) — DETAIL PAGE BARU

Versi publik paspor user yang dapat dilihat siapa saja:
- Paspor view (read-only).
- Quote pribadi user.
- "Karya terbaik" (top 3 karya yang user pin).
- "Aktivitas terkini" (10 aktivitas publik).
- Tombol "Follow" (kalau bukan paspor sendiri).
- Tombol "Share paspor ini".

Tujuan: shareable di bio Instagram, CV, LinkedIn.

---

## SECTION 5 — PASPOR WARGA — DETAIL DESIGN

### 5.1 Anatomi visual

- **Cover:** persegi panjang ratio 5:7 (seperti paspor sungguhan), warna dark blue, ornamen border halus, logo Jubir Warga gold/cream emboss tengah.
- **Halaman dalam:** background cream dengan texture subtle paper.
- **Stempel:** rotasi acak antara -8° dan +8°, warna coral atau marigold, sedikit "berdarah" seperti tinta sungguhan.
- **Visa:** persegi yang lebih kecil daripada stempel, bordered, dengan ikon pilar.

### 5.2 Mekanisme level civic (10 level)

| Level | Nama | Unlock |
|---|---|---|
| 1 | Warga Baru | Bergabung |
| 2 | Warga Aktif | 10 aktivitas dalam 30 hari |
| 3 | Aktivis Mula | 1 karya + 1 petisi + 1 kelas |
| 4 | Aktivis Konsisten | Aktif rutin 3 bulan |
| 5 | Jubir Warga | Lulus Kelas Jubir Warga + 5 karya + facilitate diskusi |
| 6 | Jubir Senior | Mentor di kelas + verifikator Tagih Janji |
| 7 | Jubir Master | Aktif >1 tahun + dampak terukur |
| 8 | Penggerak | Founding member chapter regional |
| 9 | Civic Champion | Recognition dari tim Jubir Warga |
| 10 | Legenda | Impact level nasional, partner resmi |

### 5.3 Share template Instagram Story

Saat user klik "Share paspor", modal preview Instagram Story 9:16:
- Background dark blue dengan ornamen.
- Paspor user di tengah.
- Subtitle "Ini paspor warga digital saya. Bikin punyamu di jubirwarga.id"
- Tombol "Save image" + "Share to IG Story".

---

## SECTION 6 — KOMPONEN SISTEM

### 6.1 Komponen yang harus ada

`<Logo />` `<Header />` `<Footer />` `<NavTabs />` `<Sidebar />` `<HeroSection />` `<Card />` `<ThreadCard />` `<KaryaCard />` `<KelasCard />` `<AksiCard />` `<JanjiCard />` `<UserAvatar />` `<Pill />` `<Button />` `<ProgressBar />` `<StatBlock />` `<Timeline />` `<Modal />` `<AIPanel />` `<JubirMascot />` `<Paspor />` `<Stempel />` `<Visa />` `<EmptyState />` `<LoadingState />` `<Toast />`

### 6.2 Microinteractions

- Hover card: card-lift halus (translateY -3px + shadow).
- Klik tombol: scale 0.97 + ripple optional.
- Vote arrow: turn coral on hover, scale 1.1 on click.
- Stempel masuk paspor: rotate animation + tilt acak.
- AI Jubir typing: dot bouncing animation.
- Page transition: fade in 200ms.

### 6.3 Mobile responsive

- Mobile bottom nav 5 ikon.
- Header collapse: logo + search icon + AI button + hamburger.
- Sidebar 3-kolom collapse jadi single column dengan tab swipe.
- Forum sidebar kategori: dropdown atas.
- Paspor: tetap visible, swipe horizontal antar halaman.
- AI chat: full screen modal di mobile.

---

## SECTION 7 — DATA DUMMY

### 7.1 Pejabat Tagih Janji (37 janji untuk seed)

**Pusat (12 janji):**
- Presiden RI: 5 (ekonomi, infrastruktur, korupsi, pendidikan, lingkungan).
- Menteri Keuangan: 3 (fiskal, subsidi, reformasi pajak).
- Menteri Kominfo: 2 (literasi digital, regulasi medsos).
- Pimpinan DPR RI: 2 (RUU PPRT, transparansi anggaran).

**Provinsi DKI (5):**
- Gubernur DKI: 4 (transportasi, banjir, RTH, ekonomi UMKM).
- Pimpinan DPRD DKI: 1 (audit APBD).

**Provinsi Jabar (5):**
- Gubernur Jabar: 3 (pendidikan vokasi, infrastruktur, lingkungan).
- Wali Kota Bandung: 2 (transportasi, RTH).

**Provinsi Jatim (7):**
- Gubernur Jatim: 3 (UMKM, infrastruktur, kesehatan).
- Wali Kota Surabaya: 2 (banjir, transportasi).
- Bupati Malang: 2 (parkir, pelayanan publik).

**Provinsi Sumut (4):**
- Gubernur Sumut: 2 (infrastruktur, pendidikan).
- Wali Kota Medan: 2 (sampah, transportasi).

**Provinsi Sulsel (4):**
- Gubernur Sulsel: 2 (kesehatan, ekonomi pesisir).
- Wali Kota Makassar: 2 (banjir, RTH).

Kalimat janji harus realistis dan plausible (BUKAN parodi/satire).

### 7.2 Nama user dummy

Aulia Pratiwi · Reza Adipratama · Sari Lestari · Kanta Widodo · Nadira Azzahra · Pram Faisal · Mei Chandra · Bilal Sukarno · Erik Kurniawan · Aqidatul Izza Zain · Putra Satria · Adnan Maghribbi · Fauzan Ahmar · Lisa Safitri.

### 7.3 Topik thread forum (10 contoh)

1. RUU PPRT, kenapa mandek terus setelah 20 tahun?
2. Tarif parkir naik tanpa konsultasi warga — pengalaman dari Malang
3. Mental health di tempat kerja garmen Bandung
4. Festival film vs festival pemilu — mana yang lebih ramai?
5. Integrasi transportasi Jakarta: janji MRT vs realita koneksi bus
6. Beasiswa LPDP — apakah masih relevan untuk anak muda 2026?
7. Banjir Surabaya tahun ini: bedanya dengan tahun lalu
8. AI dan jurnalisme — siapa yang harus disalahkan kalau hoaks?
9. Pertanian organik di Jogja — pengalaman komunitas Bantul
10. Petani Sulsel dan harga gabah: cerita dari Maros

---

## SECTION 8 — TARGET OUTPUT

Kembalikan **single React artifact** yang berisi:

✅ 9 halaman utama + 8 detail page = 17 view yang dapat dinavigasi via internal router.
✅ AI Jubir chat panel global (slide dari kanan) — dapat dipanggil dari mana saja via tombol header.
✅ Citizen Wordle playable.
✅ Spot the Hoaks playable.
✅ Tebak Pasal playable.
✅ Polling Aksi: klik → bar update real-time.
✅ Petisi: tandatangani → progress bar update.
✅ Tagih Janji: peta Indonesia interaktif, filter functional.
✅ Paspor flip 3D interaktif (4 halaman swipeable).
✅ AI persona Jubir mock-implemented dengan suggested prompts (response pakai data dummy plausible — boleh hard-coded skenario respons untuk demo).
✅ Onboarding 3-step.
✅ Header & Footer konsisten.
✅ Mobile responsive (test 375px).
✅ Semua warna sesuai palette 11 token.
✅ Semua tipografi sesuai brand (Inter / Vollkorn / Caveat / Fira Code).
✅ **Logo SVG hand-drawn (BUKAN font Caveat).**
✅ **Minimum 15 ilustrasi SVG kustom hand-drawn (BUKAN emoji, BUKAN placeholder kotak).**
✅ Iconography line konsisten (Lucide atau custom).
✅ Komentar `// PAGE: …` & `// COMPONENT: …` di kode untuk handover ke developer.

**Yang TIDAK perlu:**
- ❌ Backend / database — semua dummy.
- ❌ Auth real — onboarding mock cukup.
- ❌ AI real — pakai pre-defined response untuk demo.
- ❌ Animasi 3D kompleks — paspor flip pakai CSS transform sederhana cukup.

---

## SECTION 9 — KRITERIA SUKSES

Prototipe v2 dianggap berhasil kalau:

1. **Visual:** Tidak ada emoji sebagai dekorasi UI. Semua ilustrasi adalah SVG kustom. Logo asli SVG hand-drawn, bukan font.
2. **Depth:** Setiap pilar punya minimal 1 detail page. Detail page punya 5+ section yang substantial.
3. **AI:** Jubir terasa hadir di seluruh platform. Minimal 5 trigger point AI di halaman berbeda.
4. **Tagih Janji:** Database 30+ janji terisi, peta Indonesia interaktif, detail janji lengkap dengan timeline.
5. **Paspor:** Identitas civic memorable, dapat di-share, ada progression mechanic.
6. **Brand:** Konsisten dengan guideline 2026 — palette, tipografi, "merakyat tapi tertata".
7. **Substance:** Setiap halaman bisa dijawab "kenapa user mau ke sini, bukan ke media sosial biasa?" dengan jelas.

---

## SECTION 10 — KALAU KAMU PERLU MEMUTUSKAN HAL YANG TIDAK ADA DI BRIEF

Default ke prinsip ini, urut prioritas:

1. **Substansi sebelum gloss.** Kalau ragu antara "fitur lebih banyak" vs "fitur sedikit tapi mendalam" — pilih yang mendalam.
2. **Anti emoji-as-decoration menang** atas selera "biar lucu". Pakai ilustrasi SVG kustom.
3. **Brand guideline 2026 menang** atas selera estetik umum.
4. **Indonesia first** dalam copy, contoh, ikon, ilustrasi.
5. **AI Jubir bukan gimmick** — harus terasa berguna, bukan asal tempel.
6. **Tagih Janji harus serius** — civic accountability is sacred. Tidak boleh kelihatan main-main.

---

**Selesai. Mulai bangun prototipe v2.**

Kalau butuh klarifikasi sebelum mulai, batasi maksimal 3 pertanyaan kunci. Selebihnya buat keputusan desain sendiri sesuai prinsip di atas.

Estimasi panjang artifact yang diharapkan: **3,000–5,000 baris kode** (vs v1 yang ~2,000). Tidak masalah kalau panjang — yang penting setiap halaman/detail page substantial dan visual tidak shortcut emoji.

> Terakhir, ingat: ini bukan tentang bikin prototipe yang "kelihatan keren". Ini tentang bikin prototipe yang membuktikan Jubir Warga layak dipercaya untuk mengelola percakapan civic Indonesia. Setiap detail harus bisa dipertanggungjawabkan ke 90 alumni Jubir Warga 2024 yang akan jadi user awal.

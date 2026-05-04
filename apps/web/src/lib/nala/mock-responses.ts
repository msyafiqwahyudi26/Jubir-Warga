import type { Citation } from './types';

type MockResponseRule = {
  keywords: string[];
  response: string;
  citations?: Citation[];
};

export const MOCK_RESPONSES: MockResponseRule[] = [
  {
    keywords: ['pasal 28e', 'kebebasan beragama', 'hak ekspresi', '28e'],
    response: `Pasal 28E itu salah satu pasal HAM di UUD 1945. Isinya menjamin tiga hal utama:

1. **Kebebasan memeluk agama dan beribadah** sesuai keyakinan masing-masing
2. **Kebebasan berserikat, berkumpul, dan menyatakan pendapat**
3. **Hak meyakini kepercayaan, menyatakan pikiran dan sikap** sesuai hati nurani

Konkretnya: kalau kamu mau bikin podcast politik, demo damai, atau pindah agama — pasal ini yang melindungi. Tapi praktiknya [1] sering ada gap antara teks konstitusi dan realita lapangan, terutama di kasus yang melibatkan isu sensitif.

Mau aku jelasin contoh kasus terkini, atau kamu pengen tau bedanya 28E sama 28I?`,
    citations: [
      {
        index: 1,
        title: 'Laporan Kebebasan Berekspresi 2025',
        url: 'https://example.org/laporan-kebebasan-2025',
      },
    ],
  },
  {
    keywords: [
      'kelas online',
      'kelas publik',
      'belajar online',
      'kursus',
      'workshop',
    ],
    response: `Kelas online publik di Jubir Warga itu ruang belajar bareng — bukan kuliah satu arah. Tiap kelas biasanya punya tiga elemen:

- **Modul singkat** (10-15 menit baca + video) — kamu bisa selesaikan kapan aja
- **Diskusi terpandu** — facilitator dari komunitas alumni Warga Muda atau praktisi lapangan
- **Aksi mini** di akhir — bukan ujian, tapi sesuatu yang bisa kamu eksekusi di lingkunganmu

Topik yang lagi rame: literasi anggaran daerah, baca putusan MK buat pemula, dan dasar advokasi RT/RW. Pendaftarannya gratis selama beta [1].

Kamu lagi nyari topik tertentu, atau pengen aku rekomendasiin kelas yang cocok buat pemula?`,
    citations: [
      {
        index: 1,
        title: 'Katalog Kelas Beta — Jubir Warga',
        url: 'https://jubirwarga.id/kelas',
      },
    ],
  },
  {
    keywords: [
      'opini',
      'tulis opini',
      'editorial',
      'op-ed',
      'menulis',
      'draft tulisan',
    ],
    response: `Opini editorial yang nyangkut itu biasanya punya empat bagian, dan urutannya penting:

1. **Kail di paragraf pertama** — angka, anekdot, atau pertanyaan yang bikin pembaca berhenti scroll
2. **Klaim utama** — satu kalimat yang gampang dikutip; ini "tesis" kamu
3. **Bukti + nuansa** — 2-3 paragraf, campur data dengan suara orang yang kena dampak
4. **Tindakan konkret** — apa yang harus berubah, oleh siapa, kapan

Hindari jargon NGO ("masyarakat sipil", "ekosistem demokrasi") di paragraf pembuka — ganti dengan bahasa yang dipakai temenmu di WhatsApp. Sumber primer (UU, putusan MK, BPS) selalu menang dibanding sumber sekunder [1].

Kamu udah punya topik, atau mau brainstorm dulu? Kalau udah ada draft, aku bisa bantu cek struktur.`,
    citations: [
      {
        index: 1,
        title: 'Panduan Menulis Opini — Jubir Warga Writing Lab',
        url: 'https://jubirwarga.id/karya/panduan-opini',
      },
    ],
  },
  {
    keywords: ['dpr', 'dpd', 'perbedaan dpr dpd', 'dpd ri', 'dpr dan dpd'],
    response: `Singkatnya: keduanya sama-sama duduk di Senayan, tapi peran dan cara terpilihnya beda jauh.

**DPR (Dewan Perwakilan Rakyat)** dipilih lewat partai politik. Setiap anggota mewakili daerah pemilihan, tapi loyalitas politiknya ke partai. Tugas utama: bikin UU, bahas APBN bareng pemerintah, dan ngawasin eksekutif. Kalau kamu bayangin parlemen "klasik" — itu DPR.

**DPD (Dewan Perwakilan Daerah)** dipilih perorangan, non-partisan, 4 orang per provinsi. Tugasnya lebih sempit: kasih masukan ke DPR soal UU yang nyangkut otonomi daerah, sumber daya alam, hubungan pusat-daerah, dan APBN. DPD gak punya hak veto — pendapatnya bersifat pertimbangan [1].

Analogi gampangnya: DPR itu "ruang adu kepentingan partai", DPD itu "ruang aspirasi provinsi". Keduanya gabung di MPR untuk hal-hal seremonial kayak pelantikan presiden.

Mau aku jelasin kenapa banyak orang bilang DPD "kurang gigi", atau kamu pengen tau cara kontak anggota DPD provinsi kamu?`,
    citations: [
      {
        index: 1,
        title: 'Profil Lembaga DPR & DPD — Tempo Explainer',
        url: 'https://example.org/tempo-explainer-dpr-dpd',
      },
    ],
  },
  {
    keywords: [
      'kuhp',
      'pasal karet',
      'kuhp baru',
      'pasal 218',
      'pasal 240',
      'pidana',
    ],
    response: `KUHP baru (UU 1/2023) berlaku efektif 2026, gantiin warisan kolonial Belanda yang udah dipakai hampir seabad. Banyak hal positif: dekriminalisasi sebagian, pendekatan keadilan restoratif, dan rumusan yang lebih modern.

Tapi sejumlah pasal disorot sebagai "karet" karena rumusannya bisa diperluas tafsirnya:

- **Pasal 218–220** — penghinaan presiden/wakil presiden (delik aduan, ancaman 3 tahun)
- **Pasal 240–241** — penghinaan pemerintah yang sah, bisa dipakai di ranah online
- **Pasal 256** — demonstrasi tanpa pemberitahuan
- **Pasal 263–264** — penyebaran "berita bohong" yang menimbulkan keonaran

Kekhawatirannya: pasal-pasal ini bisa dipakai buat ngehambat kritik publik, jurnalisme investigatif, atau aksi damai [1]. Pemerintah bilang ada batasan delik aduan + ada Mahkamah Konstitusi sebagai pengaman terakhir.

Mau kita zoom in ke pasal mana yang paling kena dampak ke publikasi sosmed, atau kamu lagi nyusun statement keberatan untuk komunitas kamu?`,
    citations: [
      {
        index: 1,
        title: 'Catatan Atas KUHP Baru — ICJR & koalisi masyarakat sipil',
        url: 'https://example.org/icjr-catatan-kuhp-2023',
      },
    ],
  },
  {
    keywords: [
      'bpjs',
      'bpjs kesehatan',
      'saldo bpjs',
      'cek bpjs',
      'tunggakan bpjs',
    ],
    response: `Cara paling cepet via **Mobile JKN** (gratis di Play Store / App Store). Setelah login pakai NIK + password:

1. **Cek status aktif** — masuk menu "Peserta", liat tab status. Kalau tertunggak, bakal merah
2. **Cek tunggakan** — menu "Premi" atau "Pembayaran"; nominal + bulan tertunggak muncul jelas
3. **Bayar / cicil** — bisa langsung dari app via virtual account, GoPay/OVO/DANA, atau Indomaret/Alfamart

Alternatif tanpa app: ketik **NOMORKARTU** kirim SMS ke 087775500400, atau cek di [https://bpjs-kesehatan.go.id](https://example.org/bpjs-cek-online) → menu "Layanan Peserta" [1]. Untuk PBI (Penerima Bantuan Iuran) yang preminya dibayar pemerintah, status bisa dicek di kantor cabang atau lewat Pendamping Sosial.

Tips: kalau status non-aktif karena nunggak, ada program REHAB (cicil 24 bulan) sejak 2022. Tanya CS 165 detailnya.

Kamu lagi cek punya sendiri, anggota keluarga, atau bantu tetangga? Aku bisa bantu uraikan langkah lebih spesifik.`,
    citations: [
      {
        index: 1,
        title: 'Panduan Cek Iuran BPJS — Kompas',
        url: 'https://example.org/kompas-panduan-bpjs',
      },
    ],
  },
  {
    keywords: [
      'polisi',
      'ditilang',
      'diberhentikan polisi',
      'razia',
      'hak warga',
    ],
    response: `Penting tau ini sebelum kena di lapangan — biar kepala dingin dan gak bayar yang gak perlu.

**Hak kamu saat dihentikan/razia:**

- **Minta surat tugas / surat perintah razia** — wajib ada, kalau gak ada kamu boleh tanya "atas dasar apa?" tanpa nada nantangin
- **Tanya identitas petugas** — nama, pangkat, kesatuan. Polisi wajib pakai atribut lengkap (Perkap 8/2009)
- **Diam itu hak** — kamu gak wajib jawab pertanyaan investigatif tanpa pendamping hukum, kecuali identitas dasar
- **Tilang resmi → slip biru/merah, bukan "damai" di tempat** — slip biru = kamu akui pelanggaran (bayar di bank), slip merah = kamu sidang di pengadilan
- **Rekam video / minta saksi** — gak ilegal, kecuali di area khusus (objek vital negara)

Kalau merasa diperas atau diintimidasi, catat nama + jam + lokasi + nomor kendaraan polisi. Lapor ke **Propam Polri** (110) atau **Komnas HAM** (021-3925230) — bisa anonim [1]. LBH terdekat juga bantu pendampingan gratis.

Mau aku breakdown skenario spesifik (razia motor, dipanggil ke kantor polisi tanpa surat), atau bantu drafting laporan ke Propam?`,
    citations: [
      {
        index: 1,
        title: 'Panduan Hak Warga di Hadapan Aparat — LBH Jakarta',
        url: 'https://example.org/lbh-jakarta-panduan-hak-warga',
      },
    ],
  },
  {
    keywords: [
      'mk',
      'mahkamah konstitusi',
      'putusan mk',
      'judicial review',
      'uji materi',
    ],
    response: `Putusan MK itu kelihatannya berat (PDF ratusan halaman, bahasa hukum), tapi ada cara baca cepetnya:

1. **Halaman pertama: amar putusan** — itu inti. "Mengabulkan", "Menolak", atau "Tidak dapat diterima". Cari kata kunci ini dulu sebelum nyemplung ke pertimbangan
2. **"Pendapat hakim"** — kadang ada dissenting opinion (hakim yang gak setuju). Ini emas, karena ngasih konteks debat internal
3. **Cek tanggal mulai berlaku** — putusan MK biasanya berlaku sejak diucapkan, kecuali ditunda
4. **Implikasi praktis** — apakah pasal yang diuji "dinyatakan tidak berlaku", atau "berlaku dengan syarat (conditionally constitutional)"? Ini beda jauh efeknya

Buat publik, sumber tafsir paling akurat: [Mahkamah Konstitusi sendiri](https://example.org/mk-arsip-putusan), Kode Inisiatif, atau ICJR yang rajin nulis explainer akademis [1]. Hindari ngandelin headline media tabloid — sering gak presisi.

Mau bahas putusan spesifik yang lagi kamu pelajari, atau aku jelasin kenapa "bersyarat konstitusional" sering bikin debat?`,
    citations: [
      {
        index: 1,
        title: 'Panduan Membaca Putusan MK — Kode Inisiatif',
        url: 'https://example.org/kode-inisiatif-baca-putusan-mk',
      },
    ],
  },
  {
    keywords: [
      'apbd',
      'anggaran daerah',
      'pemantau apbd',
      'transparansi anggaran',
      'baca apbd',
    ],
    response: `APBD itu duit kota/kabupaten kamu — ratusan miliar sampai triliun per tahun. Sayangnya jarang yang mau nyemplung baca. Pendekatan tiga lapis biar gak overwhelm:

**Lapis 1 — gambaran umum:** cari ringkasan di website pemda (biasanya format "APBD dalam Angka" / infografis). Liat tiga rasio:
- Belanja pegawai vs pelayanan publik (ideal: pegawai < 30%)
- Rasio belanja modal (infrastruktur, ideal: > 25%)
- Defisit / surplus

**Lapis 2 — drill down per OPD:** download dokumen DPA (Dokumen Pelaksanaan Anggaran) per dinas. Cari nominal yang anomali — mis. dinas pariwisata kabupaten gak punya pantai dapat 50 miliar.

**Lapis 3 — realisasi vs perencanaan:** akhir tahun, bandingkan alokasi vs penyerapan. Penyerapan rendah = perencanaan/eksekusi bermasalah, biasanya isu lebih penting daripada nominalnya [1].

Tools bantu: [Cek APBD](https://example.org/cek-apbd) (FITRA), Open Data DKI/Bandung/Surabaya kalau kotamu salah satu yang udah open. Kalau pemdamu gak transparan, itu sendiri udah temuan.

Mau aku bantu interpretasi APBD kota tertentu, atau drafting permintaan informasi via UU KIP?`,
    citations: [
      {
        index: 1,
        title: 'Panduan Pemantauan APBD untuk Warga — Seknas FITRA',
        url: 'https://example.org/fitra-panduan-apbd',
      },
    ],
  },
  {
    keywords: [
      'pungli',
      'pungutan liar',
      'lapor pungli',
      'korupsi',
      'kpk',
    ],
    response: `Lapor pungli itu hak kamu — dan ada beberapa kanal yang bisa dipakai sesuai skala kasus. Pilih yang paling relevan:

**Skala kecil (RT/RW, layanan publik harian):**
- **Saber Pungli** — call 193, atau lapor.go.id, atau saberpungli.id. Tim ini gabungan polri/jaksa/inspektorat, fokus pungli sehari-hari
- **Ombudsman RI** — ombudsman.go.id, gratis, fokus maladministrasi pelayanan publik

**Skala menengah-besar (proyek pemerintah, pejabat):**
- **KPK** — kpk.go.id/kws atau call 198. Threshold biasanya kerugian negara > 1 miliar atau melibatkan penyelenggara negara
- **Kejaksaan / Polri Tipikor** — paralel jalur

**Tips biar laporanmu kuat:**
- Dokumentasi: bukti foto/video, kuitansi (kalau ada), nama oknum + jabatan, tanggal + lokasi
- Saksi minimal 1 (idealnya 2) yang bersedia kasih keterangan
- Identitas pelapor bisa dirahasiakan — UU 13/2006 + LPSK kasih perlindungan saksi & pelapor [1]

Penting: jangan rekayasa atau palsukan bukti — lebih merugikan diri sendiri.

Kamu lagi hadapi kasus tertentu? Aku bisa bantu draft laporan tanpa nyebut detail sensitif yang bisa identify kamu.`,
    citations: [
      {
        index: 1,
        title: 'Mekanisme Pelaporan Korupsi — Indonesia Corruption Watch',
        url: 'https://example.org/icw-mekanisme-lapor',
      },
    ],
  },
  {
    keywords: [
      'pilkada',
      'pemilu',
      'perbedaan pemilu pilkada',
      'pilpres',
      'pileg',
      'pemilu legislatif',
    ],
    response: `Sering ketuker — wajar, KPU bikin tiga jadwal yang konsep dasarnya sama tapi ranahnya beda. Cheatsheet cepet:

**Pemilu Nasional (5 tahunan, serentak):**
- **Pilpres** — pilih presiden + wakil presiden. 1 surat suara
- **Pileg DPR RI** — pilih anggota parlemen pusat. Caleg per dapil
- **Pileg DPD RI** — pilih perwakilan provinsi (4 orang/provinsi, non-partai)
- **Pileg DPRD provinsi & kabupaten/kota** — anggota parlemen daerah

Yang paling baru semuanya gabung di 1 hari, 5 surat suara — itu yang bikin pusing pas di TPS.

**Pilkada (Pemilihan Kepala Daerah, 5 tahunan, beda jadwal):**
- Gubernur + Wakil Gubernur (provinsi)
- Bupati / Walikota + Wakil (kabupaten/kota)

Sejak 2024, pilkada serentak nasional digelar bareng — tapi tetap pisah dari Pemilu nasional [1].

**Beda paling kerasa:** pemilu nasional ngurusin "siapa yang bikin UU + jalankan negara di pusat", pilkada ngurusin "siapa yang ngurusin urusan harian kamu — jalan rusak, sampah, izin usaha". Pilkada sering dampaknya lebih cepet kena ke kehidupan harian.

Mau breakdown sistem pencalonan (jalur partai vs independen), atau cara ngecek caleg/calon di dapil kamu?`,
    citations: [
      {
        index: 1,
        title: 'Sistem Pemilu Indonesia — Perludem Explainer',
        url: 'https://example.org/perludem-sistem-pemilu',
      },
    ],
  },
  // ── Batch 2 (Spec #15 — topic 12-19) ─────────────────────────
  {
    keywords: [
      'tanah ulayat',
      'konflik agraria',
      'reformasi agraria',
      'hgu',
      'land grab',
      'sengketa tanah',
    ],
    response: `Konflik tanah di Indonesia itu salah satu PR struktural yang umurnya udah berdekade. Skalanya gede: KPA mencatat ratusan kasus aktif tiap tahun, mayoritas antara warga vs perusahaan perkebunan, tambang, atau properti.

**Akar masalahnya tiga lapis:**

- **Tumpang tindih izin** — satu plot bisa punya HGU (Hak Guna Usaha), izin tambang, dan klaim adat sekaligus. Sertifikat sering kalah lawan SK Menteri yang lebih baru
- **Tanah ulayat (adat) belum diakui penuh** — UU Pokok Agraria 1960 sebenarnya mengakui, tapi peta wilayah adat masih banyak yang belum ditetapkan resmi
- **Asimetri akses hukum** — perusahaan punya pengacara + birokrasi, warga sering cuma punya bukti turun-temurun + foto kopi sertifikat luntur

**Kalau lingkar kamu kena:**
- Dokumentasikan riwayat tanah (foto satelit lama, kesaksian tetua, peta partisipatif)
- Hubungi **KPA** atau **AMAN** untuk pendampingan — gratis untuk komunitas
- Kalau melibatkan kawasan hutan atau lingkungan, **Walhi** punya jaringan provinsi [1]

Soal "reformasi agraria" yang dijanjiin (target 9 juta hektar): realisasinya jauh dari target, dan banyak yang dipertanyakan kualitasnya — apakah yang dibagi memang lahan konflik, atau lahan yang udah lama dikuasai warga.

Kamu lagi pelajari kasus tertentu, atau pengen tau cara cek status HGU di kawasan kamu lewat data publik?`,
    citations: [
      {
        index: 1,
        title: 'Catatan Akhir Tahun Konflik Agraria — Konsorsium Pembaruan Agraria',
        url: 'https://example.org/kpa-catahu-agraria',
      },
    ],
  },
  {
    keywords: [
      'cipta kerja',
      'omnibus',
      'outsourcing',
      'pesangon',
      'uu ck',
    ],
    response: `UU Cipta Kerja (Omnibus) itu paket besar yang ngubah puluhan UU sekaligus — dari ketenagakerjaan, lingkungan, sampai izin usaha. Buat pekerja muda, dampaknya kebanyakan di sisi ketenagakerjaan.

**Yang berubah signifikan untuk pekerja:**

- **Outsourcing diperluas** — pra-Cipta Kerja, outsourcing dibatasi 5 jenis pekerjaan (cleaning, security, dll). Sekarang prinsipnya semua jenis pekerjaan bisa di-outsource, kecuali yang masuk "core business"
- **Pesangon dikurangi** — dari max 32x upah jadi 25x. Skema PHK lebih longgar untuk pengusaha
- **PKWT (kontrak) diperpanjang** — dulu max 3 tahun, sekarang bisa 5 tahun. Status karyawan tetap jadi makin susah dicapai
- **Upah minimum** — mekanisme kenaikan dipatok ke formula PP 51/2023, sering lebih rendah dari survei kebutuhan hidup layak

**Kontroversi utama:**
- Proses pengesahan dianggap cacat formil (MK 2021 minta perbaikan, lalu disahkan ulang via Perppu 2/2022)
- Konsultasi publik dinilai minim — terutama di RUU yang awal
- Banyak buruh, akademisi, dan LBH bilang ini "race to the bottom" untuk bargaining position pekerja [1]

Pemerintah bilang ini buat tarik investasi + buka lapangan kerja. Apakah berhasil? Data investasi naik, tapi kualitas kerja (job security, social protection) jadi pertanyaan terpisah.

Mau aku breakdown hak kamu kalau di-PHK setelah Cipta Kerja, atau gimana cara baca PKWT supaya gak kena jebakan?`,
    citations: [
      {
        index: 1,
        title: 'Kertas Kebijakan UU Cipta Kerja — LBH Jakarta',
        url: 'https://example.org/lbh-jakarta-uu-cipta-kerja',
      },
    ],
  },
  {
    keywords: [
      'rth',
      'ruang terbuka hijau',
      'trotoar',
      'taman kota',
      'ruang publik',
    ],
    response: `RTH (Ruang Terbuka Hijau) di kota-kota besar Indonesia masih jauh di bawah standar. UU 26/2007 minta minimal 30% (20% publik + 10% privat), tapi realita di Jakarta sekitar 9-10%, Bandung 12%, Surabaya 13%. Yang punya angka mendekati target cuma kota-kota kecil.

**Kenapa ini penting?**

- **Termal & kesehatan** — RTH cukup bikin suhu kota turun 2-4°C, polusi PM2.5 lebih rendah, asma + heat stroke berkurang
- **Sosial** — taman, trotoar, alun-alun = tempat warga ketemu, anak main, lansia jalan. Kota tanpa ruang publik = kota yang cuma rumah-mall-kantor
- **Ekologis** — RTH serap air hujan, kurangi banjir; penting buat kota yang udah konsolidasi tertutup beton

**Yang sering jadi tantangan:**

- **Trotoar** — sering dianggap "ruang sisa", padahal ini RTH paling demokratis. PKL, parkir liar, motor naik trotoar bikin krisis ruang publik harian
- **Privatisasi** — taman besar di kota dijaga, tapi sering "berbayar" lewat tiket masuk atau diatur kode dress, bikin gak inklusif
- **Konversi** — RTH jadi mall, jalan tol, perumahan. Sekali hilang, hampir mustahil dikembalikan

Cara kamu ikut intervensi: laporan via **Lapor.go.id** untuk trotoar bermasalah, dorong RDTR (Rencana Detail Tata Ruang) yang prowarga, ikut konsultasi publik perubahan zonasi [1]. Komunitas seperti **Rujak Center for Urban Studies** rajin ngumpulin data + advokasi.

Mau kita zoom ke kota kamu — gimana cara cek persentase RTH-nya, atau kasus konversi taman yang lagi rame?`,
    citations: [
      {
        index: 1,
        title: 'Studi Ruang Publik Kota Indonesia — Rujak Center for Urban Studies',
        url: 'https://example.org/rujak-rth-kota',
      },
    ],
  },
  {
    keywords: [
      'sisdiknas',
      'ukt',
      'guru honorer',
      'ppdb',
      'zonasi',
      'kuliah mahal',
    ],
    response: `Sektor pendidikan Indonesia lagi di persimpangan: rencana revisi UU Sisdiknas, UKT yang naik tiap tahun, isu guru honorer yang gak kunjung selesai, dan PPDB zonasi yang setiap musim kontroversi.

**UKT (Uang Kuliah Tunggal):**
- UKT idealnya proporsional ke pendapatan keluarga (golongan 1-8). Praktiknya: banyak kampus golongan 1-2 jarang diisi, mahasiswa kelas menengah bawah masuk golongan 4-5
- **UKT naik 2024** — banyak PTN naikin sampai 100%+, dipicu pengurangan subsidi negara. Sebagian dirollback setelah protes mahasiswa, tapi tren strukturalnya tetap naik
- Beasiswa KIP-K + LPDP punya kuota terbatas; banyak yang gak ke-cover

**Guru honorer:**
- Sekitar 1 juta guru honorer dengan upah Rp 200rb-1jt/bulan, tanpa BPJS
- Janji "satu juta guru P3K" jalan, tapi seleksi tiap tahun bikin stres + ada yang berkali-kali gak lolos walau udah mengabdi 15+ tahun
- Krisisnya: tanpa honorer, banyak sekolah pelosok gak bisa jalan; dengan honorer, sistem upah bermasalah secara struktural [1]

**PPDB Zonasi:**
- Niat: pemerataan kualitas sekolah biar gak terpusat di "sekolah favorit"
- Praktik: orang tua "geser KK" (titipkan anak ke alamat dekat sekolah favorit), ada manipulasi titik koordinat, sekolah pinggiran tetap kekurangan murid
- Solusi yang sering didorong: pemerataan kualitas guru + fasilitas, bukan cuma tweak rumus zonasi

Yang bisa kamu lakuin: dorong transparansi kebijakan kampus atau sekolahmu via mahasiswa atau OSIS, ikut audiens pansus DPR kalau revisi Sisdiknas, baca kertas posisi **PGRI** atau **FSGI** yang biasa kasih kritik substantif.

Mau bahas isu spesifik (UKT kampus tertentu, kasus zonasi 2026), atau kamu lagi advokasi sebagai pengajar atau mahasiswa?`,
    citations: [
      {
        index: 1,
        title: 'Kertas Posisi Reformasi Pendidikan — Federasi Serikat Guru Indonesia',
        url: 'https://example.org/fsgi-kertas-posisi-pendidikan',
      },
    ],
  },
  {
    keywords: [
      'kesehatan mental',
      'kesehatan jiwa',
      'psikolog',
      'konseling',
      'mental health',
    ],
    response: `Akses kesehatan mental di Indonesia masih timpang banget. Per data Riskesdas + IPK, ratio psikolog ke populasi sekitar 1:90.000 — jauh dari standar WHO. Stigma + biaya bikin banyak orang tahan lama sebelum cari bantuan.

**Lapisan akses (dari paling murah ke profesional):**

- **Hotline darurat** — bantuan cepat untuk krisis. Beberapa yang gratis: **119 ext 8** (Kemenkes), **Into the Light**, **Yayasan Pulih**. Bukan terapi, tapi triage + rujukan
- **Puskesmas + BPJS** — sejak 2019, BPJS cover layanan psikolog (10x sesi/tahun) lewat rujukan dari Puskesmas atau RS Tipe C. Banyak yang gak tau ini ada — bisa hemat jutaan
- **Praktik mandiri** — Rp 200rb-800rb per sesi (psikolog), Rp 500rb-2jt (psikiater untuk obat). Banyak yang accept QRIS atau cicilan
- **Online platform** — Riliv, Halodoc, Get Happy. Lebih murah + accessible, tapi cocoknya untuk konseling ringan, bukan trauma berat

**Tanda mesti escalate ke profesional:**
- Gangguan tidur lebih dari 2 minggu
- Pikiran menyakiti diri atau orang lain
- Aktivitas harian (kerja, kuliah, makan) terganggu signifikan
- Substance use jadi koping utama [1]

**Penting:** aku gak bisa kasih saran medis spesifik. Kalau lagi krisis, please reach out ke hotline sekarang — bukan nanti.

Stigma kerasa banget di Indonesia ("kurang iman", "kurang piknik"), padahal kondisi mental sama medisnya kayak diabetes atau asma — butuh treatment, bukan judgment.

Kamu lagi cari resource buat diri sendiri, atau bantu temen atau keluarga? Aku bisa bantu nyari layanan terdekat berdasarkan kota.`,
    citations: [
      {
        index: 1,
        title: 'Panduan Akses Kesehatan Mental Indonesia — Into the Light',
        url: 'https://example.org/intothelight-panduan-akses',
      },
    ],
  },
  {
    keywords: [
      'uu pdp',
      'data pribadi',
      'kebocoran data',
      'privasi data',
      'kominfo',
    ],
    response: `UU PDP (UU 27/2022 tentang Pelindungan Data Pribadi) berlaku efektif Oktober 2024. Indonesia akhirnya punya kerangka hukum untuk privacy, mirip GDPR di Eropa — walau implementasinya masih banyak PR.

**Hak kamu sebagai pemilik data:**

- **Hak akses** — kamu boleh minta tau data apa aja yang dikumpulin platform tentang kamu
- **Hak penghapusan** — minta data dihapus (right to be forgotten), kecuali ada kepentingan hukum
- **Hak portabilitas** — minta data kamu di-export dalam format yang bisa dipindah ke layanan lain
- **Hak menolak** — opt out dari profiling, iklan target, atau pemrosesan otomatis
- **Hak ganti rugi** — kalau data bocor karena kelalaian pengelola

**Yang bisa kamu lakuin sekarang:**
- Cek **privacy settings** di app yang kamu pakai sehari-hari (gojek, shopee, IG, dll)
- Jangan kasih NIK, KK, atau foto KTP ke "lomba berhadiah" atau aplikasi pinjol abal
- Kalau dapat OTP yang gak kamu request, ada yang lagi nyobain login. Ganti password
- Kalau kena breach (data bocor di Have I Been Pwned), ganti password + aktifkan 2FA

**Pertanyaan terbuka:**
- Otoritas Penyelenggara Data Pribadi (lembaga independen yang harusnya enforce UU PDP) belum sepenuhnya beroperasi
- Kebocoran data Kominfo, BPJS, dan kependudukan = sinyal bahwa enforcement masih lemah
- UU ITE pasal 27 masih dipakai paralel buat content moderation, bikin tumpang tindih [1]

Resource lebih lanjut: **ELSAM**, **ICT Watch**, **SAFEnet** rajin advokasi privacy + digital rights.

Mau aku bantu cara filing complaint kalau data kamu bocor, atau breakdown apa yang harus dilakuin platform menurut UU PDP?`,
    citations: [
      {
        index: 1,
        title: 'Kertas Kebijakan UU PDP & Hak Digital — ELSAM',
        url: 'https://example.org/elsam-uu-pdp-hak-digital',
      },
    ],
  },
  {
    keywords: [
      'uu ite',
      'kriminalisasi jurnalis',
      'kebebasan pers',
      'lbh pers',
      'pasal 27 ite',
      'pasal 28 ite',
    ],
    response: `UU ITE udah lama jadi senjata yang bisa dipake dua arah. Niat awalnya transaksi elektronik, tapi pasal-pasal "karet"-nya sering dipake buat kriminalisasi kritik publik, jurnalis, atau warga biasa yang posting di sosmed.

**Pasal yang paling sering dipake:**

- **Pasal 27 ayat 3** — pencemaran nama baik atau penghinaan via elektronik. Threshold rendah, ancaman 4 tahun
- **Pasal 28 ayat 2** — ujaran kebencian SARA. Sering tafsirannya melebar ke kritik institusi
- **Pasal 29** — ancaman kekerasan via elektronik

UU ITE direvisi 2024 (jadi UU 1/2024) — beberapa pasal "diperhalus", penalty diturunin, ada arahan ke restorative justice. Tapi pasal-pasal pokoknya tetap ada.

**Buat jurnalis & content creator:**
- **UU Pers (40/1999)** secara prinsip lebih kuat dari UU ITE untuk produk jurnalistik. Hak Jawab + Dewan Pers harus dipake dulu sebelum pidana
- Praktiknya: pelapor sering pilih jalur ITE buat bypass mekanisme pers
- **AJI Indonesia** + **LBH Pers** punya hotline darurat untuk jurnalis yang dilaporkan atau dipidana [1]

**Tips kalau kamu posting kritik publik:**
- Sertakan sumber + bukti (link, screenshot, kutipan asli)
- Hindari label personal ("dia maling", "dia korup") — ganti dengan deskripsi tindakan + dasar bukti
- Jangan posting saat emosi — draft, tahan 24 jam, baca lagi
- Kalau dilaporkan, jangan langsung respons sendiri — kontak LBH dulu

UU ITE bukan alasan buat self-censor habis-habisan, tapi awareness penting biar kritik kamu sustain — bukan dipotong jadi kriminalisasi.

Mau bahas case study (kasus yang lagi rame, kasus serupa kamu), atau kita drafting kritik publik yang aman tapi tetap punya gigi?`,
    citations: [
      {
        index: 1,
        title: 'Catatan Kasus UU ITE & Kebebasan Pers — Aliansi Jurnalis Independen',
        url: 'https://example.org/aji-catatan-uu-ite',
      },
    ],
  },
  {
    keywords: [
      'transisi energi',
      'pltu',
      'batu bara',
      'krisis iklim',
      'paris agreement',
      'energi bersih',
    ],
    response: `Transisi energi di Indonesia itu pertarungan tiga arah: komitmen iklim global (Paris Agreement, NDC), realita ekonomi (batu bara masih export andalan + supply listrik 60%+ dari PLTU), dan tekanan publik (polusi udara Jakarta + komunitas terdampak tambang).

**Komitmen vs realita:**

- **Net Zero 2060** target Indonesia (lebih lama dari banyak negara: AS 2050, EU 2050)
- **JETP (Just Energy Transition Partnership)** — komitmen $20 miliar dari G7 untuk percepatan, tapi disbursement-nya lambat + ada concern soal "fair share"
- **Pensiun PLTU** — direncanakan 2040-2055, tapi banyak PLTU baru (captive power untuk smelter nikel) tetep dibangun
- **Kapasitas EBT (Energi Baru Terbarukan)** — masih sekitar 13% dari total bauran, target RUEN 23% tahun 2025 [1]

**Yang sering jadi blind spot:**

- **"Energi hijau"** untuk kendaraan listrik — kalau pembangkitnya batu bara, mobil listrik masih dirty. Net effect baru positif kalau mix EBT-nya tinggi
- **Komunitas terdampak** — relokasi tambang, gangguan mata pencaharian nelayan dekat PLTU, masalah air bersih. Adaptasi sering tertinggal
- **Subsidi BBM + listrik** — masih besar, sebagian jatuh ke kelas menengah-atas yang punya mobil pribadi. Realokasi ke transportasi publik bisa langsung kurangi emisi

**Yang bisa kamu lakuin:**
- Audit jejak karbon harian (commute, listrik, makanan)
- Push perusahaan, kampus, atau kantor kamu untuk RE100 (100% renewable)
- Ikut advokasi via **Walhi**, **Trend Asia**, atau **IESR** — semua punya kanal partisipasi publik

Soal "transisi adil": pertanyaannya bukan cuma seberapa cepet pensiun PLTU, tapi siapa yang tanggung biayanya. Pekerja tambang, petani sawit, nelayan harus jadi bagian solusi, bukan kena dampak terus.

Mau breakdown kebijakan iklim Indonesia spesifik, atau kita bahas cara baca laporan emisi perusahaan biar gak greenwashing?`,
    citations: [
      {
        index: 1,
        title: 'Laporan Status Transisi Energi Indonesia — Institute for Essential Services Reform',
        url: 'https://example.org/iesr-status-transisi-energi',
      },
    ],
  },
];

export function getMockResponse(userMessage: string): {
  content: string;
  citations: Citation[];
} {
  const normalized = userMessage.toLowerCase();
  const match = MOCK_RESPONSES.find((rule) =>
    rule.keywords.some((kw) => normalized.includes(kw)),
  );
  if (match) {
    return { content: match.response, citations: match.citations ?? [] };
  }

  return {
    content: `Hmm, pertanyaan menarik. Aku lagi dalam mode beta — belum punya akses ke sumber lengkap untuk topik ini. Tapi aku bisa kasih beberapa arah eksplorasi:

- Cek thread komunitas terkait di /komunitas
- Lihat kelas yang relevan di /kelas
- Atau kamu bisa post pertanyaan ini di forum, biar warga lain bantu jawab

Kalau kamu mau, aku bisa bantu draft pertanyaan supaya jelas dulu sebelum dikirim?`,
    citations: [],
  };
}

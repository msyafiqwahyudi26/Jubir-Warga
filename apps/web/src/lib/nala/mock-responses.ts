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

// ─────────────────────────────────────────────────────────
// Jubir Warga — Mock Game Data (Wordle, Spot Hoaks, Pasal)
// ─────────────────────────────────────────────────────────

(function (global) {
  'use strict';

  // ── Tebak Kata (Citizen Wordle) ──────────────────────
  const CIVIC_WORDS = [
    'WARGA','SUARA','PASAL','SAKSI','DAPIL',
    'KORUM','DEBAT','CALON','NEGRI','HUKUM',
    'KAMUS','REZIM','PARTI','PEMUS','APBD',
  ];

  const CIVIC_HINTS = {
    WARGA: 'Kita semua, penduduk negara.',
    SUARA: 'Apa yang dipakai untuk memilih.',
    PASAL: 'Bagian dari Undang-Undang.',
    SAKSI: 'Yang menyaksikan jalannya pemilu.',
    DAPIL: 'Wilayah pemilihan.',
    KORUM: 'Jumlah minimal anggota untuk rapat sah.',
    DEBAT: 'Adu argumen di panggung.',
    CALON: 'Yang sedang berlomba untuk dipilih.',
    NEGRI: 'Bumi yang kita tinggali bersama.',
    HUKUM: 'Aturan yang mengikat.',
  };

  // ── Spot the Hoaks (5 headline) ──────────────────────
  // Setiap soal: 4 headline, 1 hoaks. Player klik mana yang hoaks.
  const HOAKS_QUIZ = [
    {
      id: 'h-001',
      headlines: [
        { text: 'BPS rilis data inflasi April 2026 sebesar 2,87%, terendah dalam 12 bulan',  hoaks: false, source: 'BPS resmi' },
        { text: 'Pemerintah hapus seluruh subsidi BBM pertalite mulai 1 Mei 2026',            hoaks: true,  reason: 'Tidak pernah ada pengumuman resmi. Pertalite tetap bersubsidi.' },
        { text: 'KAI buka rute kereta cepat Jakarta-Bandung hingga Yogyakarta',               hoaks: false, source: 'KAI press release Q1 2026' },
        { text: 'Bank Indonesia pertahankan suku bunga acuan di 6%',                          hoaks: false, source: 'Rilis BI April 2026' },
      ],
    },
    {
      id: 'h-002',
      headlines: [
        { text: 'Vaksin COVID-19 menyebabkan magnet menempel di lengan',                   hoaks: true,  reason: 'Dibantah Kementerian Kesehatan dan WHO sejak 2021.' },
        { text: 'PT KAI siapkan tambahan 200 KRL Jabodetabek tahun 2026',                  hoaks: false, source: 'KAI Annual Report 2025' },
        { text: 'KPU rilis daftar pemilih sementara 2029',                                 hoaks: false, source: 'KPU' },
        { text: 'Anggaran IKN 2026 mencapai Rp 40,6 triliun',                              hoaks: false, source: 'APBN 2026' },
      ],
    },
    {
      id: 'h-003',
      headlines: [
        { text: 'WhatsApp akan mulai berbayar Rp 50.000/bulan di Indonesia',                hoaks: true,  reason: 'Hoax recurring. Meta tegaskan WhatsApp tetap gratis untuk personal.' },
        { text: 'Pemerintah luncurkan aplikasi PeduliLindungi versi 2.0',                   hoaks: false, source: 'Kemenkes' },
        { text: 'Inflasi pangan Maret 2026 capai 5,2%',                                     hoaks: false, source: 'BPS' },
        { text: 'IDR menguat ke level 14.800 per USD di Q1 2026',                           hoaks: false, source: 'Bank Indonesia' },
      ],
    },
    {
      id: 'h-004',
      headlines: [
        { text: 'BPJS Kesehatan akan dihapus pada 2027',                                    hoaks: true,  reason: 'Tidak ada UU/Perpres yang menghapus BPJS Kesehatan.' },
        { text: 'KPK tahan tersangka kasus suap proyek jalan tol',                          hoaks: false, source: 'KPK' },
        { text: 'Kemenkes tambah 50 RS rujukan kanker di luar Jawa',                        hoaks: false, source: 'Kemenkes' },
        { text: 'OJK terbitkan aturan baru tentang pinjol legal',                           hoaks: false, source: 'OJK' },
      ],
    },
    {
      id: 'h-005',
      headlines: [
        { text: 'Microsoft akan pindahkan kantor pusatnya ke Jakarta',                      hoaks: true,  reason: 'Tidak ada pengumuman resmi Microsoft. Kantor pusat tetap di Redmond.' },
        { text: 'Telkomsel merilis paket data unlimited untuk pelajar',                     hoaks: false, source: 'Telkomsel press' },
        { text: 'Indonesia jadi tuan rumah ASEAN Summit 2027',                              hoaks: false, source: 'Kemlu' },
        { text: 'BPS umumkan penurunan tingkat pengangguran terbuka',                       hoaks: false, source: 'BPS' },
      ],
    },
  ];

  // ── Tebak Pasal ─────────────────────────────────────
  // Setiap soal: kutipan UU/pasal, player tebak dari 4 pilihan.
  const PASAL_QUIZ = [
    {
      id: 'pq-001',
      kutipan: '"Setiap orang berhak atas pengakuan, jaminan, perlindungan, dan kepastian hukum yang adil serta perlakuan yang sama di hadapan hukum."',
      pilihan: [
        { label: 'UUD 1945 Pasal 27 ayat (1)',    benar: false },
        { label: 'UUD 1945 Pasal 28D ayat (1)',   benar: true  },
        { label: 'UU HAM Pasal 17',               benar: false },
        { label: 'KUHP Pasal 134',                benar: false },
      ],
      penjelasan: 'Pasal 28D ayat (1) — bagian dari amandemen kedua tentang HAM. Sering disebut sebagai "due process of law".',
    },
    {
      id: 'pq-002',
      kutipan: '"Kemerdekaan menyatakan pikiran dan sikap sesuai dengan hati nuraninya."',
      pilihan: [
        { label: 'UUD 1945 Pasal 28E ayat (2)',   benar: true  },
        { label: 'UUD 1945 Pasal 28F',            benar: false },
        { label: 'UU HAM Pasal 23',               benar: false },
        { label: 'TAP MPR No. XVII',              benar: false },
      ],
      penjelasan: 'Pasal 28E ayat (2) — kebebasan berpendapat. Dasar hukum demonstrasi & opini publik.',
    },
    {
      id: 'pq-003',
      kutipan: '"Setiap orang berhak untuk berkomunikasi dan memperoleh informasi untuk mengembangkan pribadi dan lingkungan sosialnya."',
      pilihan: [
        { label: 'UUD 1945 Pasal 28F',            benar: true  },
        { label: 'UU KIP Pasal 4',                benar: false },
        { label: 'UU ITE Pasal 27',               benar: false },
        { label: 'UU Pers Pasal 4',               benar: false },
      ],
      penjelasan: 'Pasal 28F — hak atas informasi. Dasar konstitusional UU Keterbukaan Informasi Publik.',
    },
    {
      id: 'pq-004',
      kutipan: '"Perekonomian nasional diselenggarakan berdasar atas demokrasi ekonomi dengan prinsip kebersamaan, efisiensi berkeadilan..."',
      pilihan: [
        { label: 'UUD 1945 Pasal 33 ayat (4)',    benar: true  },
        { label: 'UUD 1945 Pasal 34 ayat (1)',    benar: false },
        { label: 'UU Cipta Kerja Pasal 5',        benar: false },
        { label: 'TAP MPR No. IX/2001',           benar: false },
      ],
      penjelasan: 'Pasal 33 ayat (4) — hasil amandemen 4. Prinsip ekonomi Pancasila yang sering dijadikan rujukan kebijakan.',
    },
    {
      id: 'pq-005',
      kutipan: '"Fakir miskin dan anak-anak yang terlantar dipelihara oleh negara."',
      pilihan: [
        { label: 'UUD 1945 Pasal 33 ayat (3)',    benar: false },
        { label: 'UUD 1945 Pasal 34 ayat (1)',    benar: true  },
        { label: 'UU 11/2009 Pasal 1',            benar: false },
        { label: 'UUD 1945 Pasal 31 ayat (4)',    benar: false },
      ],
      penjelasan: 'Pasal 34 ayat (1) — kewajiban negara terhadap warga termiskin. Dasar program bantuan sosial.',
    },
  ];

  // ── Game catalog (untuk Main page) ──────────────────
  const GAMES = [
    { id: 'tebak-kata',  title: 'Tebak Kata',         desc: 'Citizen Wordle — kata civic 5 huruf', icon: '🔠', soon: false },
    { id: 'spot-hoaks',  title: 'Spot the Hoaks',     desc: '4 headline, mana yang hoaks?',         icon: '🔍', soon: false },
    { id: 'tebak-pasal', title: 'Tebak Pasal',        desc: 'Cocokkan kutipan UU dengan pasalnya',  icon: '⚖️', soon: false },
    { id: 'janji',       title: 'Janji vs Realita',   desc: 'Drag & match janji politik',           icon: '🤝', soon: true  },
    { id: 'tts',         title: 'TTS Demokrasi',      desc: 'Crossword 7×7 tema demokrasi',         icon: '✏️', soon: true  },
    { id: 'pop',         title: 'Pop or Politics?',   desc: 'Judul lagu/film vs judul kebijakan',   icon: '🎬', soon: true  },
    { id: 'quiz',        title: 'Quiz Sejarah Pemilu',desc: '5 soal pilihan ganda sejarah pemilu',  icon: '📜', soon: true  },
    { id: 'bingo',       title: 'Bingo Komunitas',    desc: 'Interactive bingo card',               icon: '🎯', soon: true  },
  ];

  const LEADERBOARD = [
    { userId: 'u-sari',   score: 2840 },
    { userId: 'u-bilal',  score: 2710 },
    { userId: 'u-kanta',  score: 2560 },
    { userId: 'u-nadira', score: 2340 },
    { userId: 'u-reza',   score: 2190 },
    { userId: 'u-aulia',  score: 1980 },
    { userId: 'u-pram',   score: 1870 },
    { userId: 'u-mei',    score: 1720 },
    { userId: 'u-erik',   score: 1640 },
    { userId: 'u-putra',  score: 1590 },
  ];

  const BADGES = [
    { id: 'b-warga-baru',  name: 'Warga Baru',     desc: 'Bergabung',                icon: '🌱' },
    { id: 'b-streak-3',    name: 'Tebak 3 Hari',   desc: '3-day Wordle streak',      icon: '🔥' },
    { id: 'b-aktivis',     name: 'Aktivis Mula',   desc: 'Tanda tangani 1 petisi',   icon: '✍️' },
    { id: 'b-penulis',     name: 'Penulis',        desc: 'Submit 1 karya',           icon: '✏️' },
    { id: 'b-forum-star',  name: 'Forum Star',     desc: 'Thread 50+ balasan',       icon: '⭐' },
    { id: 'b-scholar',     name: 'Civic Scholar',  desc: 'Selesaikan 1 kelas',       icon: '🎓' },
    { id: 'b-streak-7',    name: 'Streak 7',       desc: '7 hari berturut',          icon: '🌟' },
    { id: 'b-voter',       name: 'Voter',          desc: 'Vote di 10 polling',       icon: '🗳️' },
    { id: 'b-penggerak',   name: 'Penggerak',      desc: 'Ajak 3 teman gabung',      icon: '🤝' },
    { id: 'b-jubir',       name: 'Jubir Sejati',   desc: 'Lulus kelas Jubir Warga',  icon: '🏆' },
    { id: 'b-100',         name: '100 Aksi',       desc: '100 aksi selesai',         icon: '💯' },
    { id: 'b-og',          name: 'OG Warga',       desc: 'Bergabung sejak 2024',     icon: '👑' },
  ];

  global.JWGames        = GAMES;
  global.JWCivicWords   = CIVIC_WORDS;
  global.JWCivicHints   = CIVIC_HINTS;
  global.JWHoaksQuiz    = HOAKS_QUIZ;
  global.JWPasalQuiz    = PASAL_QUIZ;
  global.JWLeaderboard  = LEADERBOARD;
  global.JWBadges       = BADGES;
})(window);

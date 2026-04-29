// ─────────────────────────────────────────────────────────
// Jubir Warga — Mock Users & Pejabat
//
// Source of truth untuk identitas yang dirujuk di thread,
// karya, kelas, paspor, dll.
//
// Replace di Phase 2 dengan auth.users dari Supabase.
// ─────────────────────────────────────────────────────────

(function (global) {
  'use strict';

  const USERS = [
    { id: 'u-sari',    name: 'Sari Lestari',     chapter: 'Jakarta',      level: 4, xp: 1280, badges: ['Warga Baru','Aktivis Mula','Forum Star'],          bio: 'Pemerhati ketenagakerjaan & PRT.' },
    { id: 'u-kanta',   name: 'Kanta Widodo',     chapter: 'Malang Raya',  level: 2, xp:  410, badges: ['Warga Baru'],                                       bio: 'Mahasiswa, suka pantau APBD lokal.' },
    { id: 'u-nadira',  name: 'Nadira Azzahra',   chapter: 'Bandung Raya', level: 3, xp:  830, badges: ['Warga Baru','Aktivis Mula','Penulis'],              bio: 'Researcher & community organizer.' },
    { id: 'u-reza',    name: 'Reza Adipratama',  chapter: 'Surabaya',     level: 3, xp:  790, badges: ['Warga Baru','Penulis'],                              bio: 'Mahasiswa jurnalisme.' },
    { id: 'u-pram',    name: 'Pram Faisal',      chapter: 'Surabaya',     level: 4, xp: 1540, badges: ['Warga Baru','Penulis','Forum Star'],                bio: 'Ilustrator & advokat hak buruh.' },
    { id: 'u-mei',     name: 'Mei Chandra',      chapter: 'Bandung Raya', level: 3, xp:  670, badges: ['Warga Baru','Penulis'],                              bio: 'Konten kreator IG/TikTok.' },
    { id: 'u-bilal',   name: 'Bilal Sukarno',    chapter: 'Jakarta',      level: 6, xp: 3210, badges: ['Warga Baru','Penulis','Civic Scholar','Penggerak'], bio: 'Co-founder Warga Muda.' },
    { id: 'u-erik',    name: 'Erik Kurniawan',   chapter: 'Jakarta',      level: 7, xp: 4810, badges: ['Warga Baru','Civic Scholar','Penggerak','OG Warga'],bio: 'Executive Director SPD.' },
    { id: 'u-aulia',   name: 'Aulia Pratiwi',    chapter: 'Bandung Raya', level: 3, xp:  560, badges: ['Warga Baru','Tebak 3 Hari','Aktivis Mula'],          bio: 'Aktivis lingkungan kampus.', isMe: true },
    { id: 'u-putra',   name: 'Putra Satria',     chapter: 'Jakarta',      level: 5, xp: 2150, badges: ['Warga Baru','Penulis','Forum Star'],                bio: 'Komika & pemerhati kebijakan.' },
    { id: 'u-aqida',   name: 'Aqidatul Izza Z.', chapter: 'Yogyakarta',   level: 5, xp: 2080, badges: ['Warga Baru','Civic Scholar'],                       bio: 'Researcher politik & komunikasi.' },
  ];

  const PEJABAT = [
    { id: 'p-jokok',     nama: 'Joko K.',         jabatan: 'Presiden RI',          partai: 'Independen', dapil: 'Nasional',     level: 'Pusat',    skor: 64, jumlahJanji: 12, ditepati: 4, mandek: 5, diingkari: 1, berjalan: 2 },
    { id: 'p-pramonoa',  nama: 'Pramono A.',      jabatan: 'Gubernur DKI Jakarta', partai: 'PDIP',       dapil: 'DKI',           level: 'Provinsi', skor: 72, jumlahJanji:  8, ditepati: 3, mandek: 1, diingkari: 0, berjalan: 4 },
    { id: 'p-srimul',    nama: 'Sri Mulyani',     jabatan: 'Menkeu RI',            partai: 'Independen', dapil: 'Nasional',     level: 'Pusat',    skor: 58, jumlahJanji:  6, ditepati: 2, mandek: 3, diingkari: 0, berjalan: 1 },
    { id: 'p-aniesb',    nama: 'Anies B.',        jabatan: 'Eks Gub. DKI',         partai: 'NasDem',     dapil: 'DKI',           level: 'Provinsi', skor: 51, jumlahJanji:  9, ditepati: 2, mandek: 4, diingkari: 1, berjalan: 2 },
    { id: 'p-ridwank',   nama: 'Ridwan K.',       jabatan: 'Eks Gub. Jabar',       partai: 'Golkar',     dapil: 'Jabar',         level: 'Provinsi', skor: 81, jumlahJanji: 11, ditepati: 7, mandek: 1, diingkari: 0, berjalan: 3 },
    { id: 'p-khofifah',  nama: 'Khofifah',        jabatan: 'Gubernur Jawa Timur',  partai: 'PKB',        dapil: 'Jatim',         level: 'Provinsi', skor: 69, jumlahJanji:  7, ditepati: 3, mandek: 1, diingkari: 0, berjalan: 3 },
    { id: 'p-bobbyn',    nama: 'Bobby N.',        jabatan: 'Wali Kota Medan',      partai: 'Gerindra',   dapil: 'Medan',         level: 'Kota',     skor: 42, jumlahJanji:  5, ditepati: 1, mandek: 2, diingkari: 1, berjalan: 1 },
    { id: 'p-dannyp',    nama: 'Danny P.',        jabatan: 'Wali Kota Makassar',   partai: 'NasDem',     dapil: 'Makassar',      level: 'Kota',     skor: 55, jumlahJanji:  4, ditepati: 1, mandek: 1, diingkari: 0, berjalan: 2 },
    { id: 'p-edyr',      nama: 'Edy R.',          jabatan: 'Eks Gub. Sumut',       partai: 'PDIP',       dapil: 'Sumut',         level: 'Provinsi', skor: 60, jumlahJanji:  6, ditepati: 2, mandek: 2, diingkari: 0, berjalan: 2 },
    { id: 'p-andis',     nama: 'Andi Sudirman',   jabatan: 'Gubernur Sulsel',      partai: 'PKS',        dapil: 'Sulsel',        level: 'Provinsi', skor: 76, jumlahJanji:  5, ditepati: 3, mandek: 0, diingkari: 0, berjalan: 2 },
    { id: 'p-eric',      nama: 'Eri C.',          jabatan: 'Wali Kota Surabaya',   partai: 'PDIP',       dapil: 'Surabaya',      level: 'Kota',     skor: 49, jumlahJanji:  6, ditepati: 1, mandek: 3, diingkari: 0, berjalan: 2 },
    { id: 'p-sanusi',    nama: 'Sanusi',          jabatan: 'Bupati Malang',        partai: 'Golkar',     dapil: 'Malang',        level: 'Kota',     skor: 38, jumlahJanji:  4, ditepati: 1, mandek: 1, diingkari: 1, berjalan: 1 },
    { id: 'p-ridwans',   nama: 'Ridwan Suryadi',  jabatan: 'Anggota DPR',          partai: 'PDIP',       dapil: 'DKI Jakarta III',level: 'Pusat',   skor: 65, jumlahJanji:  3, ditepati: 1, mandek: 0, diingkari: 0, berjalan: 2 },
    { id: 'p-anisap',    nama: 'Anisa Putri',     jabatan: 'Wali Kota Jakut',      partai: 'Golkar',     dapil: 'Jakarta Utara', level: 'Kota',     skor: 78, jumlahJanji:  3, ditepati: 2, mandek: 0, diingkari: 0, berjalan: 1 },
  ];

  const PARTAI = [
    { id: 'pdip',     name: 'PDIP',     pct: 38, color: '#C44434' },
    { id: 'gerindra', name: 'Gerindra', pct: 32, color: '#1A2256' },
    { id: 'golkar',   name: 'Golkar',   pct: 28, color: '#F2B137' },
    { id: 'nasdem',   name: 'NasDem',   pct: 24, color: '#7FB69E' },
    { id: 'pkb',      name: 'PKB',      pct: 18, color: '#3B4A8A' },
    { id: 'pks',      name: 'PKS',      pct: 14, color: '#E8632B' },
    { id: 'demokrat', name: 'Demokrat', pct: 12, color: '#1665C0' },
    { id: 'ppp',      name: 'PPP',      pct:  8, color: '#0B6B3A' },
  ];

  global.JWUsers   = USERS;
  global.JWPejabat = PEJABAT;
  global.JWPartai  = PARTAI;
})(window);

// ─────────────────────────────────────────────────────────
// Jubir Warga — Mock Janji Politik (Tagih Janji)
// ─────────────────────────────────────────────────────────

(function (global) {
  'use strict';

  const JANJI = [
    { id: 'j-001', pejabatId: 'p-jokok',    topik: 'Ekonomi',         status: 'Berjalan',  janji: '"Kami akan turunkan harga BBM 30% dalam 100 hari pertama."',                deadline: '31 Des 2026', pemantau: 1284, evidenceCount: 3 },
    { id: 'j-002', pejabatId: 'p-pramonoa', topik: 'Transportasi',    status: 'Berjalan',  janji: '"Tambah 50 km jalur sepeda baru sebelum akhir 2026."',                     deadline: '31 Des 2026', pemantau:  612, evidenceCount: 2 },
    { id: 'j-003', pejabatId: 'p-srimul',   topik: 'Ekonomi',         status: 'Mandek',    janji: '"Subsidi BBM dialihkan ke transportasi publik massal."',                    deadline: '30 Jun 2027', pemantau:  893, evidenceCount: 1 },
    { id: 'j-004', pejabatId: 'p-aniesb',   topik: 'Lingkungan',      status: 'Mandek',    janji: '"Ruang terbuka hijau 30% di Jakarta dalam masa jabatan."',                  deadline: '31 Mar 2027', pemantau:  847, evidenceCount: 4 },
    { id: 'j-005', pejabatId: 'p-ridwank',  topik: 'Pendidikan',      status: 'Ditepati',  janji: '"Bangun 1.000 sekolah vokasi di Jawa Barat."',                              deadline: 'Selesai',     pemantau:  621, evidenceCount: 5 },
    { id: 'j-006', pejabatId: 'p-khofifah', topik: 'UMKM',            status: 'Berjalan',  janji: '"Akses kredit Rp10 juta untuk 100.000 UMKM Jatim."',                        deadline: '30 Jun 2027', pemantau:  412, evidenceCount: 2 },
    { id: 'j-007', pejabatId: 'p-bobbyn',   topik: 'Sampah',          status: 'Diingkari', janji: '"Atasi sampah Medan dalam 1 tahun."',                                       deadline: '30 Apr 2026', pemantau:  298, evidenceCount: 3 },
    { id: 'j-008', pejabatId: 'p-dannyp',   topik: 'Banjir',          status: 'Belum',     janji: '"Bebas banjir di 5 titik kritis Makassar."',                                deadline: '31 Des 2027', pemantau:  156, evidenceCount: 0 },
    { id: 'j-009', pejabatId: 'p-edyr',     topik: 'Lingkungan',      status: 'Berjalan',  janji: '"Tanam 1 juta pohon di Sumut sebelum 2027."',                               deadline: '31 Des 2026', pemantau:  178, evidenceCount: 1 },
    { id: 'j-010', pejabatId: 'p-andis',    topik: 'Kesehatan',       status: 'Ditepati',  janji: '"Tambah 50 puskesmas di pesisir Sulsel."',                                  deadline: 'Selesai',     pemantau:  234, evidenceCount: 4 },
    { id: 'j-011', pejabatId: 'p-eric',     topik: 'Banjir',          status: 'Mandek',    janji: '"Atasi banjir 10 titik kritis Surabaya 2026."',                             deadline: '31 Des 2026', pemantau:  567, evidenceCount: 2 },
    { id: 'j-012', pejabatId: 'p-sanusi',   topik: 'Pelayanan',       status: 'Diingkari', janji: '"Konsultasi publik sebelum naikkan tarif parkir."',                         deadline: '15 Apr 2026', pemantau:   89, evidenceCount: 3 },
    { id: 'j-013', pejabatId: 'p-ridwans',  topik: 'Ketenagakerjaan', status: 'Berjalan',  janji: '"Dorong revisi UU PPRT selesai sebelum akhir 2025."',                       deadline: '31 Des 2025', pemantau:  340, evidenceCount: 1 },
    { id: 'j-014', pejabatId: 'p-anisap',   topik: 'Keamanan',        status: 'Ditepati',  janji: '"Tambah 50 titik CCTV di kawasan padat hunian."',                            deadline: 'Selesai',     pemantau:  187, evidenceCount: 2 },
  ];

  const STATUS_META = {
    Ditepati:  { color: 'mint',     bgHex: '#7FB69E', textHex: '#2C7A5C', icon: '✓' },
    Berjalan:  { color: 'marigold', bgHex: '#F2B137', textHex: '#9A6500', icon: '↻' },
    Mandek:    { color: 'grey',     bgHex: '#8A9099', textHex: '#525860', icon: '⏸' },
    Diingkari: { color: 'coral',    bgHex: '#E8632B', textHex: '#B84A1A', icon: '✕' },
    Belum:     { color: 'blue',     bgHex: '#3B4A8A', textHex: '#1A2256', icon: '⌛' },
  };

  // 5 provinsi MVP — peta interaktif
  const PROVINSI_MVP = [
    { id: 'sumut',  name: 'Sumatera Utara',  x:  70, y: 130, ditepatiPct: 50, count: 4 },
    { id: 'dki',    name: 'DKI Jakarta',     x: 165, y: 165, ditepatiPct: 40, count: 5 },
    { id: 'jabar',  name: 'Jawa Barat',      x: 175, y: 170, ditepatiPct: 60, count: 5 },
    { id: 'jatim',  name: 'Jawa Timur',      x: 200, y: 175, ditepatiPct: 35, count: 7 },
    { id: 'sulsel', name: 'Sulawesi Selatan',x: 270, y: 165, ditepatiPct: 55, count: 4 },
  ];

  global.JWJanji        = JANJI;
  global.JWJanjiStatus  = STATUS_META;
  global.JWProvinsiMVP  = PROVINSI_MVP;
})(window);

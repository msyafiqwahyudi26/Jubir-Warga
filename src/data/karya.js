// ─────────────────────────────────────────────────────────
// Jubir Warga — Mock Karya (Creator Space)
// ─────────────────────────────────────────────────────────

(function (global) {
  'use strict';

  const KARYA = [
    { id: 'k-001', type: 'Tulisan',   authorId: 'u-reza',     time: '3j', meta: '7 mnt',   featured: true,  views: 1240,
      title: 'Lima Alasan Pemuda Masih Apatis terhadap Pemilu Lokal',
      tags: ['Pemilu','Pemuda','Apatisme'] },
    { id: 'k-002', type: 'Vlog',      authorId: 'u-mei',      time: '1h', meta: '12:34',   featured: true,  views: 3450,
      title: 'Ngobrol sama Ibu PKL soal APBD — ternyata mereka lebih paham dari yang kita kira',
      tags: ['APBD','Lokal','Wawancara'] },
    { id: 'k-003', type: 'Ilustrasi', authorId: 'u-pram',     time: '5j', meta: '6 panel', featured: false, views:  890,
      title: 'Kenapa Suara Kita Bisa Hilang — dalam 6 panel visual',
      tags: ['Pemilu','Visual'] },
    { id: 'k-004', type: 'Tulisan',   authorId: 'u-kanta',    time: '2h', meta: '12 mnt',  featured: false, views:  670,
      title: 'Demokrasi Deliberatif: Teori yang Bisa Kita Coba di RT/RW',
      tags: ['Demokrasi','Lokal','Teori'] },
    { id: 'k-005', type: 'Podcast',   authorId: 'u-nadira',   time: '1h', meta: '45:22',   featured: false, views: 1120,
      title: 'Obrolan Pagi: Gerakan Pemuda & Pemilu 2029',
      tags: ['Pemilu 2029','Pemuda','Gerakan'] },
    { id: 'k-006', type: 'Tulisan',   authorId: 'u-sari',     time: '6h', meta: '15 mnt',  featured: false, views:  830,
      title: 'Catatan dari Dapur RUU: Bagaimana Sebuah Pasal Bisa Berubah',
      tags: ['Legislasi','PPRT'] },
    { id: 'k-007', type: 'Vlog',      authorId: 'u-bilal',    time: '3h', meta: '18:07',   featured: false, views: 2210,
      title: 'Satu Hari Jadi Pemantau Pemilu di TPS',
      tags: ['Pemilu','Pemantauan'] },
    { id: 'k-008', type: 'Zine',      authorId: 'u-bilal',    time: '2h', meta: '24 hal',  featured: false, views:  540,
      title: 'Zine: "Warga Bersuara" — Koleksi Suara dari 3 Kota',
      tags: ['Zine','Multi Kota'] },
    { id: 'k-009', type: 'Ilustrasi', authorId: 'u-pram',     time: '1d', meta: '4 panel', featured: false, views:  410,
      title: 'Cerita Banjir Surabaya — dari Kacamata Anak SMP',
      tags: ['Banjir','Surabaya','Pendidikan'] },
    { id: 'k-010', type: 'Tulisan',   authorId: 'u-aulia',    time: '2d', meta: '5 mnt',   featured: false, views:  234,
      title: 'Kenapa Saya Akhirnya Mau Datang ke TPS',
      tags: ['Pemilu','Refleksi'] },
  ];

  const TYPE_PILL = { Tulisan: 'blue', Vlog: 'coral', Ilustrasi: 'mint', Podcast: 'marigold', Zine: 'grey' };
  const TYPE_ICON = { Tulisan: '📄',   Vlog: '▶️',     Ilustrasi: '🎨',   Podcast: '🎙️',     Zine: '📖'   };

  // Top kreator (subset of users sorted by karya count)
  const TOP_KREATOR = [
    { id: 'u-bilal',   karyaCount: 23 },
    { id: 'u-erik',    karyaCount: 31 },
    { id: 'u-pram',    karyaCount: 12 },
    { id: 'u-nadira',  karyaCount: 15 },
    { id: 'u-mei',     karyaCount:  8 },
  ];

  // Bg hue palette untuk thumbnail placeholder ilustrasi
  const BG_HUES = [210, 20, 160, 240, 280, 35, 185, 320];

  global.JWKarya       = KARYA;
  global.JWKaryaTypes  = { TYPE_PILL, TYPE_ICON, BG_HUES };
  global.JWTopKreator  = TOP_KREATOR;
})(window);

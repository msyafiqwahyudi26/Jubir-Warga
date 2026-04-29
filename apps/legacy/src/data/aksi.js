// ─────────────────────────────────────────────────────────
// Jubir Warga — Mock Aksi (Polling, Petisi, Kampanye)
// ─────────────────────────────────────────────────────────

(function (global) {
  'use strict';

  const POLLING = [
    { id: 'pol-001',
      pertanyaan: 'Subsidi BBM mau dialihkan ke mana? (max 1 pilihan)',
      deadline: '30 Mei 2026',
      totalSuara: 4327,
      options: [
        { id: 'a', label: 'Transportasi publik & KRL', emoji: '🚇', votes: 1820 },
        { id: 'b', label: 'Subsidi pangan & sembako',  emoji: '🛒', votes: 1430 },
        { id: 'c', label: 'Beasiswa pendidikan',       emoji: '📚', votes: 1077 },
      ] },
  ];

  const PETISI = [
    { id: 'pt-001', icon: '📋', target: 20000, current: 14230, deadline: '15 Jun 2026', initiatorId: 'u-bilal',
      title:   'Audit Transparan APBD Jakarta 2026',
      summary: 'Mendesak Pemprov DKI buka audit lengkap pengeluaran APBD 2026, akses publik, dan format machine-readable.',
      tags: ['Transparansi','APBD','Jakarta'] },
    { id: 'pt-002', icon: '🚇', target: 10000, current:  7340, deadline: '20 Mei 2026', initiatorId: 'u-pram',
      title:   'Kembalikan Jam KRL 04.00 WIB',
      summary: 'Jadwal KRL paling pagi dimajukan ke 04.00 WIB untuk pekerja shift pagi & ibu-ibu pasar tradisional.',
      tags: ['Transportasi','KRL'] },
    { id: 'pt-003', icon: '💻', target: 50000, current: 31890, deadline: '30 Jul 2026', initiatorId: 'u-erik',
      title:   'Akses Internet Gratis untuk Sekolah Negeri',
      summary: 'Setiap sekolah negeri di Indonesia dapat akses internet minimum 50 Mbps gratis sepanjang tahun ajaran.',
      tags: ['Pendidikan','Digital'] },
    { id: 'pt-004', icon: '🌳', target:  5000, current:  3210, deadline: '12 Jun 2026', initiatorId: 'u-aulia',
      title:   'Hentikan Penebangan Pohon di Jl. Soekarno-Hatta Bandung',
      summary: 'Jalur hijau yang melindungi pejalan kaki & sepeda terancam pelebaran jalan. Kami minta moratorium dulu.',
      tags: ['Lingkungan','Bandung'] },
  ];

  const LAPORAN = [
    { id: 'lp-001', kategori: 'Jalan',    judul: 'Lubang besar di Jl. Tebet Barat dekat halte',          lokasi: 'Jakarta · Tebet',     waktu: '2j', status: 'Diterima',         dukungan:  24, reporterId: 'u-aulia' },
    { id: 'lp-002', kategori: 'Banjir',   judul: 'Banjir setiap hujan di Kel. Antapani',                 lokasi: 'Bandung · Antapani',  waktu: '5j', status: 'Ditindaklanjuti',  dukungan:  87, reporterId: 'u-mei'   },
    { id: 'lp-003', kategori: 'Sampah',   judul: 'Sampah menumpuk dekat SDN 03 Sukun',                   lokasi: 'Malang · Sukun',      waktu: '1h', status: 'Diterima',         dukungan:  12, reporterId: 'u-kanta' },
    { id: 'lp-004', kategori: 'Listrik',  judul: 'Lampu jalan mati 2 minggu di Tj. Duren',               lokasi: 'Jakarta · Tj. Duren', waktu: '2h', status: 'Selesai',          dukungan:  45, reporterId: 'u-sari'  },
    { id: 'lp-005', kategori: 'Layanan',  judul: 'Pelayanan KTP lambat di Disdukcapil Surabaya Selatan', lokasi: 'Surabaya',            waktu: '1h', status: 'Ditindaklanjuti',  dukungan: 156, reporterId: 'u-reza'  },
    { id: 'lp-006', kategori: 'Drainase', judul: 'Drainase mampet di Kel. Petisah Tengah',               lokasi: 'Medan · Petisah',     waktu: '4h', status: 'Diterima',         dukungan:  33, reporterId: 'u-pram'  },
  ];

  const KAMPANYE = [
    { id: 'kp-001', icon: '🔍', participants: 1243, featured: true,
      title: 'Gerakan 1000 Warga Pantau APBD',
      desc:  'Bergabunglah memantau penggunaan anggaran daerahmu bersama komunitas.' },
    { id: 'kp-002', icon: '📱', participants: 456, featured: false,
      title: 'Literasi Digital Desa 2026',
      desc:  'Bantu warga desa pahami informasi dan cegah hoaks online.' },
    { id: 'kp-003', icon: '🌾', participants: 789, featured: false,
      title: 'Kawal Reforma Agraria',
      desc:  'Pantau distribusi lahan dan sengketa agraria di daerahmu.' },
    { id: 'kp-004', icon: '🚲', participants: 312, featured: false,
      title: 'Jakarta Ramah Sepeda 2027',
      desc:  'Audit & advokasi 200 km jalur sepeda yang dijanjikan Pemprov.' },
  ];

  const LAPORAN_KATEGORI = [
    { id: 'jalan',    label: 'Jalan',    icon: '🛣️' },
    { id: 'banjir',   label: 'Banjir',   icon: '🌊' },
    { id: 'sampah',   label: 'Sampah',   icon: '🗑️' },
    { id: 'listrik',  label: 'Listrik',  icon: '💡' },
    { id: 'layanan',  label: 'Layanan',  icon: '🏛️' },
    { id: 'drainase', label: 'Drainase', icon: '💧' },
    { id: 'lain',     label: 'Lain',     icon: '📌' },
  ];

  global.JWPolling          = POLLING;
  global.JWPetisi           = PETISI;
  global.JWLaporan          = LAPORAN;
  global.JWKampanye         = KAMPANYE;
  global.JWLaporanKategori  = LAPORAN_KATEGORI;
})(window);

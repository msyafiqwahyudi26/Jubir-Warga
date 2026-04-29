// ─────────────────────────────────────────────────────────
// Jubir Warga — Mock Forum Threads + Categories + Chapters
// ─────────────────────────────────────────────────────────

(function (global) {
  'use strict';

  const THREADS = [
    { id: 't-001', authorId: 'u-sari',     hot: true,  upvotes: 128, downvotes:  4, replies: 42, time: '2j',
      title:   'RUU PPRT, kenapa mandek terus setelah 20 tahun?',
      preview: 'Udah hampir dua dekade RUU PPRT digodok, tapi sampai sekarang masih jalan di tempat. Apa yang bikin macet? Saya coba rekap dari awal...',
      cat: 'politik', loc: 'jakarta', fmt: 'diskusi' },
    { id: 't-002', authorId: 'u-kanta',    hot: false, upvotes:  67, downvotes:  8, replies: 28, time: '4j',
      title:   'Tarif parkir naik tanpa konsultasi warga — cerita dari Malang',
      preview: 'Minggu lalu Pemkot Malang naikin tarif parkir hampir 2x lipat. Warga baru tau dari tempel pengumuman. Ini pengalaman teman-teman di sini.',
      cat: 'lokal', loc: 'malang', fmt: 'pengalaman' },
    { id: 't-003', authorId: 'u-nadira',   hot: true,  upvotes: 234, downvotes:  6, replies: 67, time: '6j',
      title:   'Mental health di tempat kerja garmen Bandung: cerita yang jarang didengar',
      preview: 'Saya mewawancarai 12 pekerja garmen soal kondisi mental health mereka. Hasilnya mengejutkan dan menyedihkan sekaligus — perlu dibaca semua.',
      cat: 'mental', loc: 'bandung', fmt: 'pengalaman' },
    { id: 't-004', authorId: 'u-reza',     hot: false, upvotes:  45, downvotes:  3, replies: 19, time: '1h',
      title:   'Festival film vs festival pemilu — mana yang lebih ramai?',
      preview: 'Perbandingan partisipasi di dua event yang hampir bersamaan di Surabaya bulan lalu. Data-datanya bikin mikir ulang soal prioritas warga kita.',
      cat: 'budaya', loc: 'surabaya', fmt: 'diskusi' },
    { id: 't-005', authorId: 'u-pram',     hot: true,  upvotes: 189, downvotes: 11, replies: 54, time: '3h',
      title:   'Integrasi transportasi Jakarta: janji MRT vs kenyataan koneksi bus',
      preview: 'Sudah 5 tahun MRT beroperasi. Saya cek janji integrasi transportasi yang dulu digembar-gemborkan. Ini hasilnya — dengan data dan foto.',
      cat: 'transport', loc: 'jakarta', fmt: 'diskusi' },
    { id: 't-006', authorId: 'u-mei',      hot: false, upvotes:  78, downvotes:  5, replies: 23, time: '5h',
      title:   'Curhat: kerja di startup yang ngomong work-life balance tapi WA jam 11 malam',
      preview: 'Sharing pengalaman sambil tanya, ini wajar atau memang toxic? Industri startup di Bandung lagi gimana ya?',
      cat: 'kerja', loc: 'bandung', fmt: 'pengalaman' },
    { id: 't-007', authorId: 'u-bilal',    hot: false, upvotes:  92, downvotes:  2, replies: 31, time: '8h',
      title:   'Cara saya kawal anggaran kelurahan dalam 30 menit per minggu',
      preview: 'Rutinitas sederhana yang bisa siapa saja lakukan. Cuma butuh website kelurahan + Spreadsheets. Saya share template-nya di akhir.',
      cat: 'politik', loc: 'jakarta', fmt: 'pengalaman' },
    { id: 't-008', authorId: 'u-aulia',    hot: false, upvotes:  56, downvotes:  4, replies: 14, time: '12h',
      title:   'Sungai dekat kampus saya berubah warna lagi — siapa yang harus saya laporkan?',
      preview: 'Bingung mau kemana. Pak RW bilang ke kelurahan, kelurahan bilang ke DLH. DLH-nya susah dihubungi. Yang udah pernah lapor, ada saran?',
      cat: 'lingkungan', loc: 'bandung', fmt: 'tanya' },
  ];

  const TOPIK_UTAMA = [
    { id: 'politik',    label: 'Politik & Demokrasi'    },
    { id: 'lingkungan', label: 'Lingkungan & Iklim'      },
    { id: 'gender',     label: 'Gender & Kesetaraan'     },
    { id: 'mental',     label: 'Mental Health'           },
    { id: 'kerja',      label: 'Ekonomi & Kerja'         },
    { id: 'pendidikan', label: 'Pendidikan'              },
    { id: 'budaya',     label: 'Budaya Pop & Media'      },
    { id: 'transport',  label: 'Transportasi & Kota'     },
    { id: 'lokal',      label: 'Isu Lokal'               },
  ];

  const LOKASI = [
    { id: 'jakarta',  label: 'Jakarta'      },
    { id: 'bandung',  label: 'Bandung Raya' },
    { id: 'malang',   label: 'Malang Raya'  },
    { id: 'surabaya', label: 'Surabaya'     },
    { id: 'jogja',    label: 'Yogyakarta'   },
    { id: 'medan',    label: 'Medan'        },
    { id: 'makassar', label: 'Makassar'     },
  ];

  const FORMAT = [
    { id: 'diskusi',     label: 'Diskusi terbuka'    },
    { id: 'tanya',       label: 'Tanya saja'         },
    { id: 'pengalaman',  label: 'Berbagi pengalaman' },
    { id: 'polling',     label: 'Polling cepat'      },
    { id: 'live',        label: 'Live event'         },
  ];

  const CHAPTERS = [
    { id: 'jakarta',  name: 'Jakarta',      members: 342, event: 'Diskusi APBD DKI · 3 Mei 2026',                active: true  },
    { id: 'bandung',  name: 'Bandung Raya', members: 218, event: 'Nobar & Diskusi Film Dokumenter · 5 Mei 2026', active: true  },
    { id: 'malang',   name: 'Malang Raya',  members: 156, event: 'Workshop Advokasi Lokal · 10 Mei 2026',        active: true  },
    { id: 'surabaya', name: 'Surabaya',     members: 0,   event: 'Coming soon · Daftar antrean',                 active: false },
    { id: 'jogja',    name: 'Yogyakarta',   members: 0,   event: 'Coming soon · Daftar antrean',                 active: false },
    { id: 'medan',    name: 'Medan',        members: 0,   event: 'Coming soon · Daftar antrean',                 active: false },
    { id: 'makassar', name: 'Makassar',     members: 0,   event: 'Coming soon · Daftar antrean',                 active: false },
  ];

  const SUB_KOMUNITAS = [
    { id: 'sk-apbd',     name: 'Pemantau APBD',           desc: 'Komunitas khusus warga yang serius pantau APBD daerahnya. Diskusi mingguan, sharing data, advokasi terkoordinasi.', anggota: 127, modId: 'u-sari',    apply: 'curated' },
    { id: 'sk-jurnalis', name: 'Mahasiswa Jurnalisme',    desc: 'Mahasiswa & alumni jurnalisme se-Indonesia. Sharing sumber, kritik tulisan, peluang kolaborasi liputan.',          anggota: 243, modId: 'u-reza',    apply: 'open'    },
    { id: 'sk-edu',      name: 'Kreator Edukasi Politik', desc: 'Konten kreator IG/TikTok/YouTube yang fokus edukasi politik untuk anak muda. Sharing template, brief, kurasi.',     anggota:  89, modId: 'u-mei',     apply: 'curated' },
    { id: 'sk-prt',      name: 'PRT & Perlindungan',      desc: 'Komunitas advokasi pekerja rumah tangga & UU PPRT. Diskusi kebijakan, kasus konkret, kolaborasi dengan ILO.',       anggota:  54, modId: 'u-sari',    apply: 'curated' },
    { id: 'sk-mental',   name: 'Mental Health di Kerja',  desc: 'Curhat, sharing, dan advokasi soal kondisi mental health di tempat kerja Indonesia. Safe space, moderated heavily.',anggota: 312, modId: 'u-nadira',  apply: 'open'    },
    { id: 'sk-2029',     name: 'Pemerhati Pemilu 2029',   desc: 'Awalan untuk advokasi & pemantauan Pemilu 2029. Cocok yang sudah aktif di 2024 atau baru mau mulai.',               anggota: 178, modId: 'u-erik',    apply: 'curated' },
  ];

  const EVENTS = [
    { id: 'e-001', title: 'Diskusi Publik: RUU PPRT dan Masa Depan PRT Indonesia', date: '3 Mei 2026',  loc: 'Jakarta + Online', type: 'Hybrid'  },
    { id: 'e-002', title: 'Workshop: Nulis Opini yang Dibaca Orang Banyak',        date: '7 Mei 2026',  loc: 'Bandung',          type: 'Offline' },
    { id: 'e-003', title: 'Jubir Warga Live: Ngobrol Bareng Caleg Pilihan',        date: '10 Mei 2026', loc: 'Online',           type: 'Online'  },
  ];

  const MITRA = [
    'SPD', 'KitaBisa', 'Komisi.co', 'Indorelawan',
    'ceksuaramu.com', 'Yayasan Pulih', 'LBH Jakarta', 'Tempo Witness',
  ];

  global.JWThreads      = THREADS;
  global.JWTopikUtama   = TOPIK_UTAMA;
  global.JWLokasi       = LOKASI;
  global.JWThreadFormat = FORMAT;
  global.JWChapters     = CHAPTERS;
  global.JWSubKomunitas = SUB_KOMUNITAS;
  global.JWEvents       = EVENTS;
  global.JWMitra        = MITRA;
})(window);

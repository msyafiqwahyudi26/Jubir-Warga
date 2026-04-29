// ─────────────────────────────────────────────────────────
// Jubir Warga — Mock Kelas (LMS) + Mentors + Testimoni
// ─────────────────────────────────────────────────────────

(function (global) {
  'use strict';

  const KELAS = [
    { id: 'kls-001', title: 'Kelas Jubir Warga: dari Resah ke Suara ke Aksi', mentorId: 'u-bilal',  dur: '6 minggu', level: 'Menengah', harga: 'Rp 350.000', peserta: 124, progress: 68, featured: true,
      desc: 'Program 6 minggu intensif untuk mengubah kepedulianmu jadi tindakan nyata. Dari menulis opini, membangun kampanye, sampai advokasi langsung ke pengambil kebijakan.',
      modul: [
        { id: 'm-1', title: 'Resah ke Pertanyaan',     dur: '90 mnt', tipe: 'video' },
        { id: 'm-2', title: 'Mendengar Tanpa Setuju',  dur: '90 mnt', tipe: 'video' },
        { id: 'm-3', title: 'Riset Cepat & Sumber',    dur: '120 mnt', tipe: 'workshop' },
        { id: 'm-4', title: 'Menulis Opini Publik',    dur: '90 mnt', tipe: 'video' },
        { id: 'm-5', title: 'Kampanye Sederhana',      dur: '120 mnt', tipe: 'workshop' },
        { id: 'm-6', title: 'Audiensi & Negosiasi',    dur: '180 mnt', tipe: 'capstone' },
      ],
    },
    { id: 'kls-002', title: 'Youth Political Participation in the Digital Age',     mentorId: 'u-erik',   dur: '4 minggu', level: 'Pemula',   harga: 'Rp 200.000', peserta: 234 },
    { id: 'kls-003', title: 'Politics and Popular Culture: Meme, Musik, dan Makna', mentorId: 'u-aqida',  dur: '3 minggu', level: 'Pemula',   harga: 'Gratis',     peserta: 567 },
    { id: 'kls-004', title: 'Social Marketing & Fundraising untuk Gerakan Sosial',  mentorId: 'u-bilal',  dur: '5 minggu', level: 'Menengah', harga: 'Rp 250.000', peserta: 189 },
    { id: 'kls-005', title: 'Standup Comedy untuk Kritik Politik',                   mentorId: 'u-putra',  dur: '2 minggu', level: 'Pemula',   harga: 'Rp 150.000', peserta: 312 },
    { id: 'kls-006', title: 'Fan-based Movement & Volunteer Management',             mentorId: 'u-nadira', dur: '4 minggu', level: 'Menengah', harga: 'Rp 200.000', peserta: 145 },
    { id: 'kls-007', title: 'Political Vlog Content Creation',                       mentorId: 'u-mei',    dur: '3 minggu', level: 'Pemula',   harga: 'Rp 175.000', peserta: 298 },
  ];

  const MENTORS = [
    { id: 'u-bilal',  name: 'Bilal Sukarno',     bio: 'Co-founder Warga Muda, aktivis demokrasi anak muda.' },
    { id: 'u-erik',   name: 'Erik Kurniawan',    bio: 'Executive Director SPD, peneliti pemilu & demokrasi.' },
    { id: 'u-aqida',  name: 'Aqidatul Izza Z.',  bio: 'Political communication researcher & trainer.' },
    { id: 'u-putra',  name: 'Putra Satria',      bio: 'Komika sekaligus pemerhati kebijakan publik.' },
    { id: 'u-nadira', name: 'Nadira Azzahra',    bio: 'Community organizer & volunteer management expert.' },
    { id: 'u-mei',    name: 'Mei Chandra',       bio: 'Content creator & digital campaigner.' },
  ];

  const TESTIMONI = [
    { id: 'tm-001', name: 'Aulia Pratiwi',  kota: 'Bandung',  level: 'Aktivis Mula',
      text: 'Kelas ini bikin saya berani nulis opini pertama saya. Sekarang sudah ada 3 tulisan di platform!' },
    { id: 'tm-002', name: 'Kanta Widodo',   kota: 'Malang',   level: 'Warga Aktif',
      text: 'Metodenya praktis banget. Minggu pertama langsung bisa dipake buat advokasi masalah parkir di kampung saya.' },
    { id: 'tm-003', name: 'Reza Adipratama',kota: 'Surabaya', level: 'Jubir Warga',
      text: 'Mentornya oke, materinya relevan, komunitas alumni-nya masih aktif sampai sekarang.' },
  ];

  const LEVEL_COLOR = { Pemula: 'mint', Menengah: 'marigold', Lanjut: 'coral' };
  const KELAS_HUES  = [210, 160, 20, 280, 35, 185, 240];

  global.JWKelas        = KELAS;
  global.JWMentors      = MENTORS;
  global.JWTestimoni    = TESTIMONI;
  global.JWKelasMeta    = { LEVEL_COLOR, KELAS_HUES };
})(window);

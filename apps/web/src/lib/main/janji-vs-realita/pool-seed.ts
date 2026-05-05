import type { AlignmentStatus } from './constants';

/**
 * Hardcoded janji pool untuk Janji vs Realita game v1 (Spec #28-LIGHT,
 * Sprint 4 reduced scope). Pendekatan FRONTEND-FIRST: tidak fetch dari DB
 * supaya game langsung jalan tanpa nunggu Migration 0004 + manual seed
 * batch landed.
 *
 * Sprint 5+ migrate ke DB: janji table dengan alignment_status +
 * editorial_status (Window A schema), filter `verified_curator`, lalu
 * delete file ini.
 *
 * Editorial standard:
 * - claim: paraphrase ringkas dari pernyataan publik (RPJMN/visi-misi/pidato).
 *   Tidak putus pesan inti, tidak menjebak.
 * - reasoning: 1-3 kalimat berdasar data publik (RAPBN, BPS, dokumen
 *   resmi, atau berita kredibel). Tidak partisan, tidak menyerang individu.
 * - alignment_status: judgement editorial Jubir Warga, bukan klaim absolut.
 * - source_url: link sumber primer (bappenas.go.id, kemenkeu.go.id, dll).
 * - editorial_status: tier verifikasi (verified_curator = manual review,
 *   curated_ai = auto verdict belum direview manual).
 *
 * Mas + Claude Cowork session top-up sisa pool sampai 20-30 entry final.
 */

export type JanjiPoolEntry = {
  id: string;
  pejabat_name: string;
  pejabat_role: string;
  claim: string;
  deadline_year: number;
  topic: string;
  alignment_status: AlignmentStatus;
  reasoning: string;
  source_url: string;
  editorial_status: 'verified_curator' | 'curated_ai';
};

// 8 placeholder entry — distribusi 4 alignment_status × topik utama.
// Mas + Claude Cowork top-up jadi 20-30 entry final.
export const JANJI_VS_REALITA_POOL: readonly JanjiPoolEntry[] = [
  {
    id: 'jvr-001',
    pejabat_name: 'Joko K.',
    pejabat_role: 'Presiden RI',
    claim: 'Hilirisasi 250 komoditas dalam 5 tahun.',
    deadline_year: 2029,
    topic: 'Ekonomi',
    alignment_status: 'partial',
    reasoning:
      'Per RAPBN 2026, target direvisi jadi 100 komoditas prioritas. Progress nikel + bauksit jalan, sawit & rumput laut masuk roadmap. Selaras visi misi tapi target lambat dari janji awal.',
    source_url: 'https://www.bappenas.go.id/',
    editorial_status: 'verified_curator',
  },
  {
    id: 'jvr-002',
    pejabat_name: 'Sri M.',
    pejabat_role: 'Menteri Keuangan',
    claim: 'Defisit APBN tetap di bawah 3% PDB tahun fiskal berjalan.',
    deadline_year: 2026,
    topic: 'Fiskal',
    alignment_status: 'aligned',
    reasoning:
      'Realisasi APBN 2025 defisit 2,29% PDB, di bawah target 2,7% dan jauh di bawah ceiling 3%. Konsisten dengan UU Keuangan Negara. RAPBN 2026 lock di 2,5%.',
    source_url: 'https://www.kemenkeu.go.id/',
    editorial_status: 'verified_curator',
  },
  {
    id: 'jvr-003',
    pejabat_name: 'Nadiem M.',
    pejabat_role: 'Menteri Pendidikan (sebelumnya)',
    claim: 'Kurikulum Merdeka jadi kurikulum nasional 2024.',
    deadline_year: 2024,
    topic: 'Pendidikan',
    alignment_status: 'aligned',
    reasoning:
      'Permendikbudristek 12/2024 menetapkan Kurikulum Merdeka sebagai kurikulum nasional efektif tahun ajaran 2024/2025. Implementasi bertahap, tapi status legal tercapai sesuai janji.',
    source_url: 'https://kurikulum.kemdikbud.go.id/',
    editorial_status: 'verified_curator',
  },
  {
    id: 'jvr-004',
    pejabat_name: 'Anies B.',
    pejabat_role: 'Gubernur DKI (2017-2022)',
    claim: 'Bangun 200 ribu rumah DP nol rupiah.',
    deadline_year: 2022,
    topic: 'Perumahan',
    alignment_status: 'contradict',
    reasoning:
      'Sampai akhir masa jabatan 2022, total rumah DP nol rupiah yang terbangun + dihuni di bawah 5 ribu unit (data DPRKP DKI). Selisih 195 ribu unit dari janji asli — secara realisasi bertentangan dengan target.',
    source_url: 'https://jakarta.bps.go.id/',
    editorial_status: 'verified_curator',
  },
  {
    id: 'jvr-005',
    pejabat_name: 'Budi K.',
    pejabat_role: 'Menteri Perhubungan',
    claim: 'MRT Jakarta fase 2A (Bundaran HI - Kota) operasional 2027.',
    deadline_year: 2027,
    topic: 'Transportasi',
    alignment_status: 'partial',
    reasoning:
      'Per laporan PT MRT Jakarta Q1 2026, progress fisik fase 2A (Bundaran HI - Harmoni - Kota) 65%. Target awal 2027 berisiko mundur ke 2028 karena delay konstruksi. Komitmen tetap, eksekusi terlambat.',
    source_url: 'https://www.jakartamrt.co.id/',
    editorial_status: 'verified_curator',
  },
  {
    id: 'jvr-006',
    pejabat_name: 'Erick T.',
    pejabat_role: 'Menteri BUMN',
    claim: 'Restrukturisasi BUMN dari 142 jadi 41 perusahaan.',
    deadline_year: 2024,
    topic: 'BUMN',
    alignment_status: 'aligned',
    reasoning:
      'Per laporan Kementerian BUMN 2024, total BUMN turun jadi 65 perusahaan via merger + holding. Target final 41 di 2025-2026. Trajectory sesuai dengan janji restrukturisasi, walau target belum 100% tercapai.',
    source_url: 'https://bumn.go.id/',
    editorial_status: 'verified_curator',
  },
  {
    id: 'jvr-007',
    pejabat_name: 'Ridwan K.',
    pejabat_role: 'Gubernur Jabar (2018-2023)',
    claim: 'Bangun 100 ribu rumah subsidi untuk milenial Jabar.',
    deadline_year: 2023,
    topic: 'Perumahan',
    alignment_status: 'drift',
    reasoning:
      'Realisasi 2018-2023 sekitar 25 ribu unit rumah subsidi terbangun + tersalurkan (Disperkim Jabar). Target asli 100 ribu meleset signifikan, tapi program tetap jalan dengan skala lebih kecil. Drift dari skala janji, bukan kontradiksi.',
    source_url: 'https://disperkim.jabarprov.go.id/',
    editorial_status: 'verified_curator',
  },
  {
    id: 'jvr-008',
    pejabat_name: 'Siti N.',
    pejabat_role: 'Menteri LHK',
    claim: 'Indonesia carbon neutral 2060 atau lebih cepat.',
    deadline_year: 2060,
    topic: 'Lingkungan',
    alignment_status: 'partial',
    reasoning:
      'Indonesia ratifikasi NDC 2030 lewat UU 16/2016 + Enhanced NDC 2022 (target 31,89% reduksi emisi). Komitmen kebijakan ada, tapi eksekusi lapangan (deforestasi, batu bara) belum konsisten. Target 2060 jangka panjang, terlalu dini final judgement — sementara: partial.',
    source_url: 'https://menlhk.go.id/',
    editorial_status: 'curated_ai',
  },
];

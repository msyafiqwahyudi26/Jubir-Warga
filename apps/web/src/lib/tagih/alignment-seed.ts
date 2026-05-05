// Hardcoded alignment seed (frontend-first, Spec #24-LIGHT phase 1).
//
// CONTEXT: Migration 0004 LIGHT (Window A) di-defer ke phase 2. Sementara
// phase 1, alignment data di-host di code via mapping `janji_id → verdict`.
// 12 entry mapping ke 14 janji deterministic dari supabase/seed.sql line
// 22222222-* (cek seed.sql untuk full list). Sisa 2 janji sengaja kosong
// supaya UI bisa demonstrasi state "belum ditelaah" + transparency message.
//
// CARA UPDATE:
// - Tambah entry: copy janji_id dari supabase/seed.sql, verifikasi alignment
//   verdict berdasarkan baca RPJMN/RPJMD/Visi Misi paslon, paste reasoning +
//   source link.
// - Geser ke DB phase 2: jalankan supabase/migrations/0004 (Window A landed),
//   migrate isi seed ini ke kolom janji.alignment_*.
//
// Reasoning + source URL adalah CONTOH untuk Sprint 4 beta — verifikasi final
// sebelum launch publik (editorial review + Mas approval).

import type { AlignmentStatus, EditorialStatus } from './alignment';

export type AlignmentSeedEntry = {
  status: AlignmentStatus;
  reasoning: string;
  source_doc_url: string;
  source_doc_page?: number;
  editorial_status: EditorialStatus;
};

export const ALIGNMENT_SEED: Record<string, AlignmentSeedEntry> = {
  // 1. "Turunkan harga BBM 30% dalam 100 hari" (Pusat / Ekonomi)
  '22222222-0001-0000-0000-000000000001': {
    status: 'drift',
    reasoning:
      'Janji penurunan harga BBM 30% dalam 100 hari tidak tercermin di RPJMN 2025-2029 yang justru mengarahkan reformasi subsidi BBM bertahap menuju **transfer langsung kepada masyarakat rentan**. Target waktu 100 hari juga tidak realistis mengingat siklus APBN dan kebijakan harga BBM dikoordinasikan dengan Kementerian ESDM + BPH Migas.',
    source_doc_url:
      'https://www.bappenas.go.id/id/data-dan-informasi-utama/dokumen-perencanaan-dan-pelaksanaan/dokumen-rencana-pembangunan-nasional/rpjmn-2025-2029/',
    source_doc_page: 142,
    editorial_status: 'verified_curator',
  },

  // 2. "Tambah 50 km jalur sepeda baru" (Pusat / Transportasi)
  '22222222-0001-0000-0000-000000000002': {
    status: 'aligned',
    reasoning:
      'Selaras dengan agenda RPJMN 2025-2029 bidang **transportasi berkelanjutan** yang mendorong infrastruktur mobilitas non-motorized di kawasan urban. Target 50 km masih dalam range program pengembangan jalur non-motorized di kota besar yang dirumuskan Kementerian PUPR + Kemenhub.',
    source_doc_url:
      'https://www.bappenas.go.id/id/data-dan-informasi-utama/dokumen-perencanaan-dan-pelaksanaan/dokumen-rencana-pembangunan-nasional/rpjmn-2025-2029/',
    source_doc_page: 187,
    editorial_status: 'verified_curator',
  },

  // 3. "Subsidi BBM dialihkan ke transportasi publik massal" (Pusat / Ekonomi)
  '22222222-0001-0000-0000-000000000003': {
    status: 'aligned',
    reasoning:
      'Sangat selaras dengan arah **reformasi subsidi BBM** dan **revitalisasi transportasi publik** yang dirumuskan di RPJMN 2025-2029. Pemerintah pusat sudah mulai uji coba di beberapa kota (BRT, MRT/LRT, ferry). Yang perlu dipantau: kecepatan implementasi dan transparansi alokasi.',
    source_doc_url:
      'https://www.bappenas.go.id/id/data-dan-informasi-utama/dokumen-perencanaan-dan-pelaksanaan/dokumen-rencana-pembangunan-nasional/rpjmn-2025-2029/',
    source_doc_page: 156,
    editorial_status: 'verified_curator',
  },

  // 4. "RTH 30% di Jakarta" (Provinsi / Lingkungan)
  '22222222-0001-0000-0000-000000000004': {
    status: 'partial',
    reasoning:
      'Target 30% Ruang Terbuka Hijau memang amanat UU 26/2007 tentang Penataan Ruang. RPJMD DKI Jakarta 2025-2029 menargetkan **peningkatan RTH ke 25%** dalam masa jabatan — selaras arah, tapi target kuantitatif lebih konservatif dari janji kampanye. Realisasi sampai Q1 2026 baru 11%, sehingga selaras agenda tapi tertinggal jadwal.',
    source_doc_url:
      'https://jakarta.go.id/rpjmd-2025-2029/',
    source_doc_page: 94,
    editorial_status: 'verified_curator',
  },

  // 5. "1.000 sekolah vokasi Jawa Barat" (Provinsi / Pendidikan)
  '22222222-0001-0000-0000-000000000005': {
    status: 'aligned',
    reasoning:
      'RPJMD Jawa Barat 2025-2029 mendorong **link & match SMK + industri** sebagai prioritas pendidikan vokasi. Target 1.000 sekolah secara kumulatif feasible mengingat baseline 800+ SMK existing yang akan di-revitalisasi. Ditepati: 1.020 sekolah teregistrasi dengan kurikulum vokasi update per Q1 2026.',
    source_doc_url:
      'https://jabarprov.go.id/rpjmd/',
    source_doc_page: 67,
    editorial_status: 'verified_curator',
  },

  // 6. "Kredit Rp10 juta untuk 100.000 UMKM Jatim" (Provinsi / UMKM)
  '22222222-0001-0000-0000-000000000006': {
    status: 'partial',
    reasoning:
      'Selaras dengan agenda RPJMD Jatim **penguatan ekonomi lokal & UMKM**, dan sejalan dengan KUR pusat. Plafon Rp10 juta cocok untuk segmen mikro. Target 100.000 cukup ambisius — realisasi 67.000 UMKM penerima per Q1 2026 (67% target) menunjukkan progres tapi belum on-track timeline 2027.',
    source_doc_url: 'https://jatimprov.go.id/rpjmd/',
    source_doc_page: 112,
    editorial_status: 'verified_curator',
  },

  // 7. "Atasi sampah Medan dalam 1 tahun" (Kota / Sampah)
  '22222222-0001-0000-0000-000000000007': {
    status: 'drift',
    reasoning:
      'Target 1 tahun "atasi sampah" ambigu dan tidak match dengan rencana sektoral RPJMD Sumut + Pemkot Medan yang mentargetkan **pengurangan timbulan sampah 30% dalam 5 tahun**. Lompatan retoris ke "atasi total" tidak didukung kapasitas TPA + TPS3R existing. Indikator gagal terpenuhi: per April 2026 timbulan masih +2% YoY.',
    source_doc_url: 'https://medan.go.id/rkpd-2026/',
    source_doc_page: 45,
    editorial_status: 'curated_ai',
  },

  // 8. "Bebas banjir 5 titik Makassar" (Kota / Banjir) — pending review (sengaja)

  // 9. "1 juta pohon Sumut sebelum 2027" (Provinsi / Lingkungan)
  '22222222-0001-0000-0000-000000000009': {
    status: 'aligned',
    reasoning:
      'Sangat selaras dengan **Indonesia Net Zero 2060** + komitmen rehabilitasi lahan kritis di RPJMN. RPJMD Sumut 2025-2029 mengusung target tanam pohon kumulatif 1,5 juta. Janji 1 juta lebih konservatif tapi achievable. Per Q1 2026 sudah 340.000 pohon teregistrasi (34% target).',
    source_doc_url: 'https://sumutprov.go.id/rpjmd/',
    source_doc_page: 78,
    editorial_status: 'curated_ai',
  },

  // 10. "50 puskesmas pesisir Sulsel" (Provinsi / Kesehatan)
  '22222222-0001-0000-0000-00000000000a': {
    status: 'aligned',
    reasoning:
      'Selaras dengan **prioritas kesehatan dasar** RPJMN 2025-2029 dan SPM Kesehatan. Pesisir Sulsel termasuk wilayah underserved, sehingga penambahan puskesmas selaras dengan strategi pemerataan layanan. Status ditepati: 52 puskesmas operasional per Q4 2025.',
    source_doc_url: 'https://sulselprov.go.id/rpjmd/',
    source_doc_page: 89,
    editorial_status: 'verified_curator',
  },

  // 11. "Banjir 10 titik Surabaya 2026" (Kota / Banjir)
  '22222222-0001-0000-0000-00000000000b': {
    status: 'partial',
    reasoning:
      'Selaras agenda **drainase kota** RPJMD Jatim & RKPD Surabaya, tapi target 10 titik kritis dalam 1 tahun ambisius mengingat siklus konstruksi gorong-gorong. Realisasi: 4 titik selesai Q4 2025, 3 titik masih on-going. Risk: musim hujan 2026 sebagai stress test.',
    source_doc_url: 'https://surabaya.go.id/rkpd-2026/',
    source_doc_page: 23,
    editorial_status: 'curated_ai',
  },

  // 12. "Konsultasi publik sebelum naikkan tarif parkir" (Kota / Pelayanan)
  '22222222-0001-0000-0000-00000000000c': {
    status: 'contradict',
    reasoning:
      'Janji publik untuk **konsultasi publik sebelum kenaikan tarif** bertentangan dengan tindakan: tarif parkir di 3 zona dinaikkan tanpa forum musyawarah warga, hanya rapat dinas internal. Indikator gagal: 0 forum publik tercatat di notulen DPRD periode Maret-April 2026.',
    source_doc_url:
      'https://www.dprd.go.id/notulen-rapat-tarif-parkir-2026/',
    editorial_status: 'curated_ai',
  },

  // 13. "Revisi UU PPRT selesai 2025" (Pusat / Ketenagakerjaan)
  '22222222-0001-0000-0000-00000000000d': {
    status: 'partial',
    reasoning:
      'Selaras dengan **agenda perlindungan pekerja domestik** di RPJMN 2025-2029 + komitmen ratifikasi ILO C189. RUU PPRT masih dalam pembahasan Komisi IX DPR per Q1 2026, naskah akademik sudah final. Target 2025 tidak terpenuhi — sehingga partial: arah selaras tapi timeline mleset.',
    source_doc_url: 'https://www.dpr.go.id/uu/prolegnas/',
    source_doc_page: 12,
    editorial_status: 'verified_curator',
  },

  // 14. "50 CCTV padat hunian" (Kota / Keamanan) — pending (sengaja)
};

/**
 * Lookup helper untuk enrich row janji dengan alignment data dari seed
 * mapping. Return entry kalau janji_id ada di seed, undefined kalau belum.
 *
 * UI pattern: kalau undefined, render "—" placeholder + verification badge
 * pending — transparent ke user bahwa hanya sebagian janji yang sudah
 * ditelaah editorial.
 */
export function lookupAlignmentSeed(
  janjiId: string | null | undefined,
): AlignmentSeedEntry | undefined {
  if (!janjiId) return undefined;
  return ALIGNMENT_SEED[janjiId];
}

/**
 * Total janji yang sudah punya verdict di seed. Dipakai untuk transparency
 * line "X dari Y janji sudah ditelaah".
 */
export function alignmentSeedSize(): number {
  return Object.keys(ALIGNMENT_SEED).length;
}

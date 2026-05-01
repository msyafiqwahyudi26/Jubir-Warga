import type { TopicId, ChapterId, ThreadFormat } from '@jw/data/types';

export const TOPIK_OPTIONS: { id: TopicId; label: string }[] = [
  { id: 'politik', label: 'Politik & Demokrasi' },
  { id: 'lingkungan', label: 'Lingkungan & Iklim' },
  { id: 'gender', label: 'Gender & Kesetaraan' },
  { id: 'mental', label: 'Mental Health' },
  { id: 'kerja', label: 'Ekonomi & Kerja' },
  { id: 'pendidikan', label: 'Pendidikan' },
  { id: 'budaya', label: 'Budaya Pop & Media' },
  { id: 'transport', label: 'Transportasi & Kota' },
];

export const LOKASI_OPTIONS: { id: ChapterId; label: string }[] = [
  { id: 'jakarta', label: 'Jakarta' },
  { id: 'bandung', label: 'Bandung Raya' },
  { id: 'malang', label: 'Malang Raya' },
  { id: 'surabaya', label: 'Surabaya' },
  { id: 'jogja', label: 'Yogyakarta' },
  { id: 'medan', label: 'Medan' },
  { id: 'makassar', label: 'Makassar' },
];

export const FORMAT_OPTIONS: { id: ThreadFormat; label: string }[] = [
  { id: 'diskusi', label: 'Diskusi terbuka' },
  { id: 'tanya', label: 'Tanya saja' },
  { id: 'pengalaman', label: 'Berbagi pengalaman' },
  { id: 'polling', label: 'Polling cepat' },
  { id: 'live', label: 'Live event' },
];

// Sub-komunitas hard-coded Sprint 3 (planner decision). Migrate ke DB Sprint 5.
export type Subcommunity = {
  id: string;
  name: string;
  desc: string;
  members: number;
  moderator: string;
  apply: 'open' | 'curated';
};

export const SUBCOMMUNITIES: Subcommunity[] = [
  {
    id: 'pemantau-apbd',
    name: 'Pemantau APBD',
    desc: 'Komunitas khusus warga yang serius pantau APBD daerahnya. Diskusi mingguan, sharing data, advokasi terkoordinasi.',
    members: 127,
    moderator: 'Sari L.',
    apply: 'curated',
  },
  {
    id: 'mahasiswa-jurnalisme',
    name: 'Mahasiswa Jurnalisme',
    desc: 'Mahasiswa & alumni jurnalisme se-Indonesia. Sharing sumber, kritik tulisan, peluang kolaborasi liputan.',
    members: 243,
    moderator: 'Reza A.',
    apply: 'open',
  },
  {
    id: 'kreator-edukasi-politik',
    name: 'Kreator Edukasi Politik',
    desc: 'Konten kreator IG/TikTok/YouTube yang fokus edukasi politik untuk anak muda. Sharing template, brief, kurasi.',
    members: 89,
    moderator: 'Mei C.',
    apply: 'curated',
  },
];

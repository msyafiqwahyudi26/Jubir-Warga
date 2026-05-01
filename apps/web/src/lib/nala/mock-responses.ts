import type { Citation } from './types';

type MockResponseRule = {
  keywords: string[];
  response: string;
  citations?: Citation[];
};

export const MOCK_RESPONSES: MockResponseRule[] = [
  {
    keywords: ['pasal 28e', 'kebebasan beragama', 'hak ekspresi', '28e'],
    response: `Pasal 28E itu salah satu pasal HAM di UUD 1945. Isinya menjamin tiga hal utama:

1. **Kebebasan memeluk agama dan beribadah** sesuai keyakinan masing-masing
2. **Kebebasan berserikat, berkumpul, dan menyatakan pendapat**
3. **Hak meyakini kepercayaan, menyatakan pikiran dan sikap** sesuai hati nurani

Konkretnya: kalau kamu mau bikin podcast politik, demo damai, atau pindah agama — pasal ini yang melindungi. Tapi praktiknya [1] sering ada gap antara teks konstitusi dan realita lapangan, terutama di kasus yang melibatkan isu sensitif.

Mau aku jelasin contoh kasus terkini, atau kamu pengen tau bedanya 28E sama 28I?`,
    citations: [
      {
        index: 1,
        title: 'Laporan Kebebasan Berekspresi 2025',
        url: 'https://example.org/laporan-kebebasan-2025',
      },
    ],
  },
  {
    keywords: [
      'kelas online',
      'kelas publik',
      'belajar online',
      'kursus',
      'workshop',
    ],
    response: `Kelas online publik di Jubir Warga itu ruang belajar bareng — bukan kuliah satu arah. Tiap kelas biasanya punya tiga elemen:

- **Modul singkat** (10-15 menit baca + video) — kamu bisa selesaikan kapan aja
- **Diskusi terpandu** — facilitator dari komunitas alumni Warga Muda atau praktisi lapangan
- **Aksi mini** di akhir — bukan ujian, tapi sesuatu yang bisa kamu eksekusi di lingkunganmu

Topik yang lagi rame: literasi anggaran daerah, baca putusan MK buat pemula, dan dasar advokasi RT/RW. Pendaftarannya gratis selama beta [1].

Kamu lagi nyari topik tertentu, atau pengen aku rekomendasiin kelas yang cocok buat pemula?`,
    citations: [
      {
        index: 1,
        title: 'Katalog Kelas Beta — Jubir Warga',
        url: 'https://jubirwarga.id/kelas',
      },
    ],
  },
  {
    keywords: [
      'opini',
      'tulis opini',
      'editorial',
      'op-ed',
      'menulis',
      'draft tulisan',
    ],
    response: `Opini editorial yang nyangkut itu biasanya punya empat bagian, dan urutannya penting:

1. **Kail di paragraf pertama** — angka, anekdot, atau pertanyaan yang bikin pembaca berhenti scroll
2. **Klaim utama** — satu kalimat yang gampang dikutip; ini "tesis" kamu
3. **Bukti + nuansa** — 2-3 paragraf, campur data dengan suara orang yang kena dampak
4. **Tindakan konkret** — apa yang harus berubah, oleh siapa, kapan

Hindari jargon NGO ("masyarakat sipil", "ekosistem demokrasi") di paragraf pembuka — ganti dengan bahasa yang dipakai temenmu di WhatsApp. Sumber primer (UU, putusan MK, BPS) selalu menang dibanding sumber sekunder [1].

Kamu udah punya topik, atau mau brainstorm dulu? Kalau udah ada draft, aku bisa bantu cek struktur.`,
    citations: [
      {
        index: 1,
        title: 'Panduan Menulis Opini — Jubir Warga Writing Lab',
        url: 'https://jubirwarga.id/karya/panduan-opini',
      },
    ],
  },
];

export function getMockResponse(userMessage: string): {
  content: string;
  citations: Citation[];
} {
  const normalized = userMessage.toLowerCase();
  const match = MOCK_RESPONSES.find((rule) =>
    rule.keywords.some((kw) => normalized.includes(kw)),
  );
  if (match) {
    return { content: match.response, citations: match.citations ?? [] };
  }

  return {
    content: `Hmm, pertanyaan menarik. Aku lagi dalam mode beta — belum punya akses ke sumber lengkap untuk topik ini. Tapi aku bisa kasih beberapa arah eksplorasi:

- Cek thread komunitas terkait di /komunitas
- Lihat kelas yang relevan di /kelas
- Atau kamu bisa post pertanyaan ini di forum, biar warga lain bantu jawab

Kalau kamu mau, aku bisa bantu draft pertanyaan supaya jelas dulu sebelum dikirim?`,
    citations: [],
  };
}

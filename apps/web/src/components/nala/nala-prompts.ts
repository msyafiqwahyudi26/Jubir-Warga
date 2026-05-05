// Ported from apps/legacy/src/lib/nala-prompts.js — full schema MODES + SUGGESTIONS + ETIKA.
// CANNED responses + respond()/streamReveal() intentionally NOT ported: they will be
// replaced by Claude API calls in Spec #5.

import type { NalaExpression } from './nala-mascot';

// Spec #33 — Nala system prompt anchored to dual-layer brand positioning
// (Mas clarification 2026-05-05). Used by future Claude API integration
// (Spec #5+); current panel ships mock responses but this prompt is canonical
// for the brand voice + platform context.
export const NALA_SYSTEM_PROMPT = `Kamu adalah Nala, AI persona dari platform Jubir Warga (Indonesia).

IDENTITY:
- Nama: Nala — beo (parrot) yang jadi sahabat warga digital.
- Karakter: hibrid sahabat dan mentor. Default mode sahabat — santai, hangat, bahasa anak muda Indonesia.
- Saat user di kelas atau ngajak diskusi serius: switch ke mentor mode — fokus, terstruktur, tetap warm.

PLATFORM CONTEXT (dual-layer):
- Jubir Warga = rumah online warga muda Indonesia 17–39 tahun: tempat ngumpul,
  bersuara, berkarya, belajar.
- Brand-wide tagline: "Suara warga, rumahnya di sini."
- Ekosistem 6 fitur: Komunitas (forum), Karya (tulisan/vlog/zine warga), Kelas
  (literasi kebijakan), Aksi (petisi/polling/kampanye), Tagih Janji (database
  janji pejabat + alignment AI), Main (game harian).
- SPRINT SAAT INI lagi spotlight Tagih Janji — "Setiap janji punya jejak."
  Tagih bukan pengganti ekosistem, cuma yang lagi dapet panggung utama.
- Tone keseluruhan: kritis fakta, pro-democracy, selaras agenda pembangunan
  pemerintah pusat. Bukan oposisi. Bukan partisan. "Akuntabilitas adalah
  bentuk dukungan terbaik."

VOICE:
- Pakai "aku" / "kamu", BUKAN "saya" / "Anda".
- Bilingual mix Indonesia santai. Sesekali boleh campur istilah asing umum di Gen Z.
- Tidak menggurui. Tidak terlalu formal.
- Pakai contoh konkret Indonesia (KRL, ojek online, kantin SD, RT/RW).
- Tetap Gen Z hangat — bukan platform akuntabilitas serius-only.

NILAI:
- Selalu sertakan sumber kalau claim sesuatu — mention page RPJMN/RPJMD spesifik kalau relevan.
- Akui ketidakpastian. Lebih baik bilang "aku nggak yakin, tapi..." daripada nge-fake sure.
- Tidak partisan — tidak endorse partai/kandidat.
- Tidak bikin konten ujaran kebencian, fitnah, atau hoaks.
- Hormati perbedaan pendapat. Bisa diajak debat sehat.

KAPABILITAS:
- Penjelasan UU/Pasal/janji dalam bahasa anak muda.
- Bantu warga baca dokumen RPJMN/RPJMD + visi misi paslon.
- Coach kelas: cek pemahaman, jawab pertanyaan, kasih latihan.
- Ringkas thread panjang jadi poin kunci.
- Suggest aksi konkret berdasar percakapan (lapor janji, ikut diskusi, share karya, dll).

BATASAN:
- Tidak kasih saran hukum spesifik (rujuk ke pengacara).
- Tidak kasih saran medis.
- Tidak kasih informasi yang bisa dipakai menyakiti orang.
- Kalau user ngomongin distress mental berat, suggest hotline + sumber profesional.
- Verdict AI di Tagih Janji = analisis dokumen publik, BUKAN tuduhan final. Tone non-accusatory.
` as const;

export type NalaModeId = 'tanya' | 'coach' | 'writing' | 'advocacy';

export type NalaMode = {
  id: NalaModeId;
  /** Short label for tabs / chips. */
  label: string;
  /** Descriptor under the label on Page Nala. */
  sub: string;
  /** One-line tagline shown on mode card. */
  tagline: string;
  /** Placeholder text in the chat input field. */
  placeholder: string;
  /** Mascot expression to surface when this mode is hovered/active. */
  expression: NalaExpression;
  /** Brand pill color used for the mode chip / accent. */
  color: 'blue' | 'mint' | 'coral' | 'marigold';
};

export const NALA_MODES: readonly NalaMode[] = [
  {
    id: 'tanya',
    label: 'Tanya',
    sub: 'general explainer',
    tagline: 'Tanya apa saja seputar isu publik & demokrasi.',
    placeholder: 'Misal: Apa itu UU Cipta Kerja?',
    expression: 'curious',
    color: 'blue',
  },
  {
    id: 'coach',
    label: 'Coach',
    sub: 'tutor personal',
    tagline: 'Bantu refleksi & rencana aksi pribadi.',
    placeholder: 'Misal: Aku ragu mau ikut demo, gimana ya?',
    expression: 'mentor',
    color: 'mint',
  },
  {
    id: 'writing',
    label: 'Writing',
    sub: 'editor & fact-check',
    tagline: 'Bantu nulis surat, opini, atau caption.',
    placeholder: 'Misal: Bantu draft surat ke DPRD soal banjir.',
    expression: 'thinking',
    color: 'coral',
  },
  {
    id: 'advocacy',
    label: 'Advocacy',
    sub: 'draft surat & talking points',
    tagline: 'Strategi kampanye & narasi gerakan.',
    placeholder: 'Misal: Cara framing isu transportasi publik.',
    expression: 'confident',
    color: 'marigold',
  },
] as const;

export type NalaPrompt = {
  id: string;
  mode: NalaModeId;
  text: string;
};

export const NALA_SUGGESTIONS: readonly NalaPrompt[] = [
  // tanya — 5
  { id: 'tanya-1', mode: 'tanya', text: 'Apa bedanya DPR dan DPD?' },
  { id: 'tanya-2', mode: 'tanya', text: 'Kenapa ada pasal karet di KUHP baru?' },
  { id: 'tanya-3', mode: 'tanya', text: 'Bagaimana cara cek saldo BPJS Kesehatan online?' },
  { id: 'tanya-4', mode: 'tanya', text: 'Apa hak warga ketika diberhentikan polisi?' },
  { id: 'tanya-5', mode: 'tanya', text: 'Bedanya ormas dengan LSM?' },

  // coach — 4
  { id: 'coach-1', mode: 'coach', text: 'Aku capek lihat berita hoaks terus, gimana cara filter info?' },
  { id: 'coach-2', mode: 'coach', text: 'Mau aktif di RT/RW tapi malu, ada saran?' },
  { id: 'coach-3', mode: 'coach', text: 'Gimana cara ngobrolin politik sama keluarga tanpa berantem?' },
  { id: 'coach-4', mode: 'coach', text: 'Aku merasa suaraku gak didengar, masih relevan vote?' },

  // writing — 4
  { id: 'writing-1', mode: 'writing', text: 'Bantu draft surat keberatan ke pengembang yang ngeruk lahan.' },
  { id: 'writing-2', mode: 'writing', text: 'Tulisin opini singkat soal kenapa pajak harus transparan.' },
  { id: 'writing-3', mode: 'writing', text: 'Caption IG buat ajakan ikut audiensi DPR.' },
  { id: 'writing-4', mode: 'writing', text: 'Email follow-up ke ombudsman soal laporan yang macet.' },

  // advocacy — 4
  { id: 'advocacy-1', mode: 'advocacy', text: 'Framing untuk isu hak ojol yang gak menyinggung kelas menengah.' },
  { id: 'advocacy-2', mode: 'advocacy', text: 'Strategi 30 hari kampanye lokal soal sampah.' },
  { id: 'advocacy-3', mode: 'advocacy', text: 'Cara approach jurnalis untuk story isu kita.' },
  { id: 'advocacy-4', mode: 'advocacy', text: 'Bikin one-pager untuk meyakinkan anggota DPRD.' },
] as const;

/** Filter helper — returns prompts for a single mode, in declaration order. */
export function getPromptsByMode(mode: NalaModeId): NalaPrompt[] {
  return NALA_SUGGESTIONS.filter((p) => p.mode === mode);
}

/** Lookup a mode by id. Returns the tanya default if id unknown (defensive). */
export function getMode(id: NalaModeId): NalaMode {
  return NALA_MODES.find((m) => m.id === id) ?? NALA_MODES[0]!;
}

export type NalaEtikaPrinciple = {
  title: string;
  body: string;
};

export const NALA_ETIKA: readonly NalaEtikaPrinciple[] = [
  {
    title: 'Aku bukan pengganti ahli.',
    body:
      'Untuk keputusan hukum, medis, atau finansial yang penting, konsultasikan ke profesional bersertifikat. Aku bantu memahami konteks, bukan memberi nasihat akhir.',
  },
  {
    title: 'Aku bisa salah.',
    body:
      'Data latihku ada batas waktu, dan aku bisa "mengarang" detail. Kalau kamu butuh angka atau pasal spesifik, cek sumber primer (UU, putusan MK, BPS, dst.).',
  },
  {
    title: 'Aku tidak netral mutlak.',
    body:
      'Aku berpijak pada nilai konstitusi dan HAM. Aku tidak memberi platform untuk kebencian rasial, agama, atau ajakan kekerasan. Tapi soal kebijakan, aku usahakan menyajikan multi-perspektif.',
  },
  {
    title: 'Datamu privat.',
    body:
      'Percakapan kamu disimpan lokal di browser sendiri (localStorage). Tidak ada server Jubir Warga yang mengingatnya — kecuali kamu sadar mengirim sebagai laporan publik.',
  },
  {
    title: 'Aku tidak menggantikan komunitas.',
    body:
      'Yang paling tahu masalah kamu adalah kamu dan tetangga kamu. Aku alat bantu, bukan substitusi musyawarah.',
  },
] as const;

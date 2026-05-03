// 50 kata 5-huruf Indonesia, brand-relevant: politik dasar, partisipasi,
// komunitas, hukum, kerja, hidup sehari-hari. Semua valid + tidak slang berat.
// Sprint 4 expand jadi 365+ kata via DB table `daily_word_dictionary` biar
// admin bisa rotate / banned / override.
export const WORDS_OF_DAY: string[] = [
  // Politik & demokrasi
  'WARGA',
  'PILIH',
  'SUARA',
  'JANJI',
  'LAPOR',
  'HUKUM',
  'PASAL',
  'KETUA',
  'CALON',
  'KALAH',
  'DEBAT',
  'LURAH',
  'BAKAL',
  'KAWAN',
  'LAWAN',
  // Aksi & komunitas
  'GERAK',
  'TANYA',
  'BALAS',
  'MASUK',
  'PESAN',
  'PANEL',
  'RUKUN',
  'TEMAN',
  'KAKAK',
  'BAPAK',
  // Hukum & bukti
  'SAKSI',
  'BUKTI',
  'DENDA',
  'KASUS',
  'BENAR',
  'GANTI',
  // Media
  'KORAN',
  'MEDIA',
  'RADIO',
  // Hidup sehari-hari
  'TANAH',
  'RUMAH',
  'PAGAR',
  'JALAN',
  'PASAR',
  'BURUH',
  'HARGA',
  'TARIF',
  'AGAMA',
  'HIDUP',
  'DAMAI',
  'USAHA',
  'HASIL',
  'PARAH',
  'BELAS',
  'MURID',
  'NILAI',
  'MARAH',
];

export const KEYBOARD_LAYOUT: string[][] = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

export const MAX_ATTEMPTS = 6;
export const WORD_LENGTH = 5;

export type TileState = 'correct' | 'present' | 'absent' | 'empty' | 'pending';

/**
 * Compare a guess against the answer and return per-tile state.
 * Two-pass to handle duplicate letters correctly (Wordle algorithm):
 * mark exact matches first, then check remaining letters for "present".
 */
export function evaluateGuess(
  guess: string,
  answer: string,
): TileState[] {
  const result: TileState[] = Array.from({ length: WORD_LENGTH }, () => 'absent');
  const remaining: (string | null)[] = answer.split('');

  // Pass 1: correct (green).
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) {
      result[i] = 'correct';
      remaining[i] = null;
    }
  }
  // Pass 2: present (yellow).
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === 'correct') continue;
    const idx = remaining.indexOf(guess[i] ?? '');
    if (idx >= 0) {
      result[i] = 'present';
      remaining[idx] = null;
    }
  }
  return result;
}

/** Score formula: 100 - (10 * attempt-index). First-try win = 90 max. */
export function scoreForAttempt(attempt: number): number {
  // attempt is 1-based. 1 → 90, 2 → 80, ... 6 → 40.
  return Math.max(0, 100 - 10 * attempt);
}

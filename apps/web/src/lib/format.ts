/**
 * Helpers untuk format data Indonesia.
 * (Mirror dari apps/legacy/src/lib/format.js, type-safe edition)
 */

export function formatNumber(n: number | null | undefined): string {
  if (n === null || n === undefined) return '0';
  return n.toLocaleString('id-ID');
}

export function formatRupiah(n: number | null | undefined): string {
  if (n === null || n === undefined) return 'Rp0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(n);
}

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const;
const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
] as const;

export function formatDate(input: string | Date | null | undefined, opts?: { withDay?: boolean }) {
  if (!input) return '';
  const d = typeof input === 'string' ? new Date(input) : input;
  if (isNaN(d.getTime())) return '';
  const day = opts?.withDay ? `${HARI[d.getDay()]}, ` : '';
  return `${day}${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

/** "2j", "5h", "3 mgg lalu" */
export function formatRelative(input: string | Date | null | undefined): string {
  if (!input) return '';
  const d = typeof input === 'string' ? new Date(input) : input;
  if (isNaN(d.getTime())) return '';
  const now = Date.now();
  const diff = now - d.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'baru saja';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}j`;
  const day = Math.floor(hour / 24);
  if (day < 7) return `${day}h`;
  const wk = Math.floor(day / 7);
  if (wk < 4) return `${wk}mgg`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo}bln`;
  const yr = Math.floor(day / 365);
  return `${yr}thn`;
}

export function pluralize(n: number, singular: string, plural?: string): string {
  // Bahasa Indonesia tidak punya plural form, tapi kadang kita pakai "orang/orang-orang"
  return `${formatNumber(n)} ${plural ?? singular}`;
}

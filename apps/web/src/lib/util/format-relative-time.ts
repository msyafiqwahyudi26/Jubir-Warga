/**
 * formatRelativeTime — relative time string Bahasa Indonesia singkat.
 *
 * Per Spec #34 visual parity Wave 1, step 5.
 *
 * Output unit (descending granularity):
 *   < 1 menit → "baru saja"
 *   < 60 menit → "Xmnt lalu"
 *   < 24 jam  → "Xj lalu"
 *   < 30 hari → "Xh lalu"
 *   < 12 bulan → "Xb lalu"
 *   else      → "Xt lalu" (tahun)
 *
 * Future date (timestamp di masa depan) → "sebentar lagi" (defensive,
 * jarang terjadi tapi mungkin dari clock skew client/server).
 *
 * Pure function — testable, no I/O. Pakai Date.now() saat dipanggil
 * (caller bisa override via `now` param untuk testing deterministic).
 */
export function formatRelativeTime(
  date: Date | string | number,
  now: number = Date.now(),
): string {
  const ts = date instanceof Date ? date.getTime() : new Date(date).getTime();
  if (Number.isNaN(ts)) return '—';

  const diffMs = now - ts;
  if (diffMs < 0) return 'sebentar lagi';
  if (diffMs < 60_000) return 'baru saja';

  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 60) return `${diffMin}mnt lalu`;

  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}j lalu`;

  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `${diffD}h lalu`;

  const diffM = Math.floor(diffD / 30);
  if (diffM < 12) return `${diffM}b lalu`;

  return `${Math.floor(diffM / 12)}t lalu`;
}

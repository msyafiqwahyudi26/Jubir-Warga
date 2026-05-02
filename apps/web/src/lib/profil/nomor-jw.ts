/**
 * Deterministic JW passport number generator.
 * Format: JW-YYYY-NNNN (4-digit hash of user_id).
 *
 * Sprint 3: hash-based — same userId+year always returns same number.
 * Sprint 4: migrate to DB-tracked serial table `jw_passport_numbers`
 * (real uniqueness guarantee + collision detection).
 */
export function generateJWNumber(userId: string, year: number): string {
  // 32-bit string hash (djb2-style) folded into a 4-digit window.
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash |= 0;
  }
  const num = Math.abs(hash) % 10000;
  return `JW-${year}-${String(num).padStart(4, '0')}`;
}

export function currentJWYear(): number {
  return new Date().getFullYear();
}

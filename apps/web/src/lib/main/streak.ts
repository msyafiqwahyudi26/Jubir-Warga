type ScoreEntry = {
  played_at: string | null;
};

/**
 * Consecutive-days streak counter. Today missing is OK (streak from
 * yesterday backward); skip a day in the past resets streak.
 */
export function calculateStreak(
  scores: readonly ScoreEntry[],
  now: Date = new Date(),
): number {
  if (scores.length === 0) return 0;

  const dates = new Set<string>();
  for (const s of scores) {
    if (!s.played_at) continue;
    const d = new Date(s.played_at);
    if (Number.isNaN(d.getTime())) continue;
    dates.add(d.toISOString().slice(0, 10));
  }
  if (dates.size === 0) return 0;

  let streak = 0;
  let started = false;
  for (let offset = 0; offset < 365; offset++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - offset);
    const key = d.toISOString().slice(0, 10);
    if (dates.has(key)) {
      streak++;
      started = true;
    } else if (started) {
      break;
    } else if (offset > 0) {
      // Today not played yet, but yesterday onward broken — exit.
      break;
    }
    // offset === 0 and today not played: keep scanning backward.
  }
  return streak;
}

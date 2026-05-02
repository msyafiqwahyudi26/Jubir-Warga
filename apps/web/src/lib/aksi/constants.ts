export const ACTION_TYPES = ['petisi', 'polling', 'kampanye'] as const;
export type ActionType = (typeof ACTION_TYPES)[number];

export function calculatePercent(current: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, (current / total) * 100);
}

export function formatPercent(current: number, total: number): string {
  return `${calculatePercent(current, total).toFixed(1)}%`;
}

// Hand-written PollingOption shape from @jw/data — kept here as a local
// adapter type because the generated `polling.options` column is `Json`
// (unparsed). Kept minimal: the fields we actually render.
export type PollingOptionVM = {
  id: string;
  label: string;
  votes: number;
  // emoji intentionally NOT typed — Sprint 3 ignores the legacy native-unicode
  // emoji field per brand policy. Tier 2 (Sprint 4-5) custom SVG icon set.
};

export function parsePollingOptions(raw: unknown): PollingOptionVM[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry): PollingOptionVM | null => {
      if (typeof entry !== 'object' || entry === null) return null;
      const o = entry as Record<string, unknown>;
      if (typeof o.id !== 'string' || typeof o.label !== 'string') return null;
      const votes = typeof o.votes === 'number' ? o.votes : 0;
      return { id: o.id, label: o.label, votes };
    })
    .filter((o): o is PollingOptionVM => o !== null);
}

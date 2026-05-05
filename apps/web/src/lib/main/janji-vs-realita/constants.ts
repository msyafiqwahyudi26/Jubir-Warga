// Verdict options + scoring untuk Janji vs Realita game.
// Deferred ke admin DB seed: alignment_status + editorial_status (Window A schema).

export type AlignmentStatus = 'aligned' | 'partial' | 'drift' | 'contradict';

export const ALIGNMENT_STATUSES: readonly AlignmentStatus[] = [
  'aligned',
  'partial',
  'drift',
  'contradict',
] as const;

export type VerdictOption = {
  id: AlignmentStatus;
  label: string;
  desc: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
};

// 4 verdict button — brand-aligned palette per CLAUDE.md §5.1.
// `aligned` mint, `partial` marigold, `drift` grey, `contradict` red.
export const VERDICT_OPTIONS: readonly VerdictOption[] = [
  {
    id: 'aligned',
    label: 'Aligned',
    desc: 'Janji + realita selaras. Pejabat menepati.',
    pillBg: 'bg-jw-pill-mint-bg',
    pillBorder: 'border-jw-mint',
    pillText: 'text-jw-pill-mint-text',
  },
  {
    id: 'partial',
    label: 'Partial',
    desc: 'Sebagian terealisasi. Belum penuh.',
    pillBg: 'bg-jw-pill-marigold-bg',
    pillBorder: 'border-jw-marigold',
    pillText: 'text-jw-pill-marigold-text',
  },
  {
    id: 'drift',
    label: 'Drift',
    desc: 'Realita melenceng dari janji asli.',
    pillBg: 'bg-jw-pill-grey-bg',
    pillBorder: 'border-jw-grey',
    pillText: 'text-jw-muted',
  },
  {
    id: 'contradict',
    label: 'Contradict',
    desc: 'Realita berlawanan dengan janji.',
    pillBg: 'bg-jw-pill-coral-bg',
    pillBorder: 'border-jw-red',
    pillText: 'text-jw-pill-coral-text',
  },
];

export function isAlignmentStatus(v: unknown): v is AlignmentStatus {
  return (
    typeof v === 'string' &&
    (ALIGNMENT_STATUSES as readonly string[]).includes(v)
  );
}

/**
 * Score formula. Correct = 100, wrong = 0. Bonus 0 untuk v1 (no time bonus
 * yet — Spec #28 future could add: time-to-answer bonus, streak bonus).
 */
export function scoreForGuess(correct: boolean): number {
  return correct ? 100 : 0;
}

export const STORAGE_KEY = 'jw-janji-vs-realita';

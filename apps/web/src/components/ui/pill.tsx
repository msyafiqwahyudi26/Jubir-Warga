/**
 * Pill — 7-tone semantic badge.
 *
 * Per Spec #34 visual parity Wave 1, step 3.
 * Source: docs/design-system-reference/components.jsx (Pill function).
 *
 * 7 tone variant: blue, coral, marigold, mint, red, grey, dark.
 * Reusable replacement untuk ad-hoc badge components di seluruh app.
 *
 * Tone → token mapping menggunakan brand tokens existing (lihat
 * apps/web/src/app/globals.css). "red" alias ke coral tone karena
 * `jw-red` belum di-token-ize di globals (CLAUDE.md §5.1 lists it,
 * tapi token belum ada). "dark" pakai inverted blue (cream on blue).
 */
export type PillTone =
  | 'blue'
  | 'coral'
  | 'marigold'
  | 'mint'
  | 'red'
  | 'grey'
  | 'dark';

const TONE_CLASSES: Record<PillTone, string> = {
  blue: 'bg-jw-pill-blue-bg text-jw-pill-blue-text border-jw-blue/30',
  coral: 'bg-jw-pill-coral-bg text-jw-pill-coral-text border-jw-coral/40',
  marigold:
    'bg-jw-pill-marigold-bg text-jw-pill-marigold-text border-jw-marigold/40',
  mint: 'bg-jw-pill-mint-bg text-jw-pill-mint-text border-jw-mint/40',
  // red alias ke coral — `jw-red` token belum ditambahin ke globals.
  red: 'bg-jw-pill-coral-bg text-jw-pill-coral-text border-jw-coral',
  grey: 'bg-jw-pill-grey-bg text-jw-pill-grey-text border-jw-line',
  dark: 'bg-jw-blue text-jw-cream border-jw-blue',
};

export type PillProps = {
  tone?: PillTone;
  children: React.ReactNode;
  className?: string;
};

export function Pill({ tone = 'blue', children, className = '' }: PillProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

// TODO(post-funding): replace with custom hand-crafted SVG letterforms by
// professional designer. Patrick Hand is the interim per planner decision —
// see Spec #4 Q1 (B). Do NOT switch to Caveat (CLAUDE.md 4.2 forbids it for
// the logo even though the relaxed rule allows non-Caveat hand-drawn fonts).

import { SquigglyUnderline } from './decor/squiggly-underline';

type Props = {
  size?: number;
  variant?: 'default' | 'cream';
  withSquiggly?: boolean;
  className?: string;
};

export function JwLogo({
  size = 32,
  variant = 'default',
  withSquiggly = true,
  className,
}: Props) {
  const color = variant === 'cream' ? '#FFFAEE' : '#1A2256';
  // The wordmark + squiggly stack is sized via the wordmark's font-size (= size).
  // Squiggly sits under it at a width that visually matches the wordmark
  // (~3.4× the cap height for "Jubir Warga" in Patrick Hand at most weights).
  const squigglyWidth = Math.round(size * 3.4);

  return (
    <span
      className={['inline-flex flex-col leading-none select-none', className ?? ''].join(' ')}
      aria-label="Jubir Warga"
    >
      <span
        // The font-handlogo CSS variable is set on <html> in layout.tsx.
        // Using the variable directly keeps Tailwind v4 tokenization simple.
        style={{
          fontFamily: 'var(--font-handlogo)',
          fontSize: size,
          color,
          lineHeight: 1,
          letterSpacing: '0.02em',
        }}
      >
        Jubir Warga
      </span>
      {withSquiggly && (
        <SquigglyUnderline
          width={squigglyWidth}
          color="#E8632B"
          thickness={Math.max(2, size / 14)}
          className="-mt-0.5"
        />
      )}
    </span>
  );
}

// TODO(Sprint 5+): tambah variant prop `diverse?: boolean` yang include
// detail keberagaman Indonesia — kerudung, topi/snapback, kemeja batik pattern.
// Outline-only style tetap. Refer Mas (owner) untuk approval style sebelum implement.

type Props = {
  size?: number | { width: number; height: number };
  className?: string;
  ariaLabel?: string;
};

/**
 * MVP-style outline illustration: orang muda baca dokumen di kafe.
 *
 * Style anchor for the other 4 illustrations in Spec #4 — keep this consistent:
 *   • Stroke jw-blue, 1.8px, rounded line caps + joins
 *   • Soft cream fills only for "paper" surfaces (paper, mug body)
 *   • One coral highlight detail per piece (here: a marker line on the doc)
 *   • One ground shadow as the only filled non-paper element
 */
export function HeroBacaDokumen({
  size = 280,
  className,
  ariaLabel = 'Ilustrasi orang muda baca dokumen sambil ngopi',
}: Props) {
  const width = typeof size === 'number' ? size : size.width;
  const height = typeof size === 'number' ? Math.round(size * 0.75) : size.height;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 280 210"
      role="img"
      aria-label={ariaLabel}
      className={className}
    >
      {/* Ground shadow */}
      <ellipse cx="140" cy="198" rx="108" ry="5" fill="#1A2256" opacity="0.10" />

      <g stroke="#1A2256" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Person — head + hair */}
        <circle cx="118" cy="60" r="22" fill="#FFFAEE" />
        <path d="M97 56 Q100 36 118 32 Q138 36 140 56" />

        {/* Shoulders + arms forward holding doc */}
        <path d="M96 84 Q100 108 92 145 L92 170 M141 84 Q137 108 144 145 L144 170" />
        <path d="M104 116 Q116 110 128 116" />

        {/* Document (cream paper) — 3 lines + one coral highlight */}
        <rect x="84" y="118" width="78" height="52" rx="3" fill="#FFFAEE" />
        <path d="M96 134 H148 M96 146 H142 M96 158 H132" />

        {/* Coffee mug + steam */}
        <path d="M198 148 V172 Q198 178 204 178 H228 Q234 178 234 172 V148 Z" fill="#FFFAEE" />
        <path d="M234 154 Q243 154 243 162 Q243 170 234 170" />
        <path d="M210 140 Q207 134 211 128 M222 140 Q219 134 223 128" opacity="0.55" />

        {/* Table edge */}
        <path d="M28 178 H252" opacity="0.35" />
      </g>

      {/* Coral highlighter on the middle doc line — accent detail */}
      <path
        d="M96 146 H142"
        stroke="#E8632B"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

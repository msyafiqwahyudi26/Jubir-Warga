// TODO(Sprint 5+): tambah variant prop `diverse?: boolean` yang include
// detail keberagaman Indonesia — kerudung, topi/snapback, kemeja batik pattern.
// Outline-only style tetap. Refer Mas (owner) untuk approval style sebelum implement.

type Props = {
  size?: number | { width: number; height: number };
  className?: string;
  ariaLabel?: string;
};

/** Easel kosong + kuas tergeletak. Untuk empty state Karya. */
export function EmptyKarya({
  size = 280,
  className,
  ariaLabel = 'Ilustrasi kanvas kosong di atas easel dengan kuas tergeletak',
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
      <ellipse cx="140" cy="198" rx="100" ry="5" fill="#1A2256" opacity="0.10" />

      <g stroke="#1A2256" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Easel — A-frame legs */}
        <path d="M84 188 L122 38" />
        <path d="M196 188 L158 38" />
        {/* Easel back support stick */}
        <path d="M140 38 L156 188" opacity="0.45" />
        {/* Top peak knot */}
        <circle cx="140" cy="36" r="3" fill="#1A2256" />

        {/* Canvas — empty cream rectangle with cross-bar shelf below */}
        <rect x="98" y="58" width="84" height="98" rx="3" fill="#FFFAEE" />
        <path d="M88 156 L192 156" />

        {/* Brush lying tilted at the foot of the easel */}
        <path d="M100 178 L168 168" />
        <path d="M168 168 L186 162" stroke="#E8632B" strokeWidth="6" opacity="0.55" strokeLinecap="round" />
      </g>

      {/* Coral punctum — single dab on canvas, suggestion of "ide pertama" */}
      <circle cx="148" cy="100" r="3" fill="#E8632B" opacity="0.55" />
    </svg>
  );
}

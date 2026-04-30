// TODO(Sprint 5+): tambah variant prop `diverse?: boolean` yang include
// detail keberagaman Indonesia — kerudung, topi/snapback, kemeja batik pattern.
// Outline-only style tetap. Refer Mas (owner) untuk approval style sebelum implement.

type Props = {
  size?: number | { width: number; height: number };
  className?: string;
  ariaLabel?: string;
};

/** Orang muda garuk kepala, peta dipegang miring. Vibe bingung-tapi-lucu. */
export function Error404({
  size = 280,
  className,
  ariaLabel = 'Ilustrasi orang muda kebingungan dengan peta yang terbalik',
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
      <ellipse cx="140" cy="198" rx="86" ry="5" fill="#1A2256" opacity="0.10" />

      <g stroke="#1A2256" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Head + small ponytail bump */}
        <circle cx="116" cy="62" r="22" fill="#FFFAEE" />
        <path d="M138 60 Q146 62 146 68" />

        {/* Body shoulders + torso */}
        <path d="M96 86 Q98 116 96 158 L96 188 M138 86 Q138 116 140 158 L140 188" />

        {/* Arm scratching head — curved up to top of head */}
        <path d="M96 92 Q72 88 78 56 Q86 44 104 48" />

        {/* Other arm holding the map, extended forward-right */}
        <path d="M138 100 Q160 96 174 110" />

        {/* Map — rotated rectangle, slightly skewed (held upside-down) */}
        <g transform="rotate(-14 198 130)">
          <rect x="170" y="100" width="68" height="56" rx="2" fill="#FFFAEE" />
          {/* Squiggly route lines inside the map */}
          <path d="M180 116 Q196 124 184 134 Q172 142 192 152" opacity="0.5" />
          <path d="M212 110 Q204 126 222 138 Q230 144 218 150" opacity="0.5" />
        </g>
      </g>

      {/* Coral punctum — "X marks the wrong spot" on the rotated map */}
      <g transform="rotate(-14 198 130)">
        <path
          d="M204 124 L214 134 M214 124 L204 134"
          stroke="#E8632B"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>

      {/* Question mark above head */}
      <text
        x="158"
        y="42"
        fontFamily="var(--font-hand)"
        fontSize="28"
        fill="#E8632B"
        opacity="0.7"
        transform="rotate(8 158 42)"
      >
        ?
      </text>
    </svg>
  );
}

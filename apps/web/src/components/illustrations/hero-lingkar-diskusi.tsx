// TODO(Sprint 5+): tambah variant prop `diverse?: boolean` yang include
// detail keberagaman Indonesia — kerudung, topi/snapback, kemeja batik pattern.
// Outline-only style tetap. Refer Mas (owner) untuk approval style sebelum implement.

type Props = {
  size?: number | { width: number; height: number };
  className?: string;
  ariaLabel?: string;
};

/** 4 orang ngumpul nimbrung lingkaran, 1 punya speech bubble (...). */
export function HeroLingkarDiskusi({
  size = 280,
  className,
  ariaLabel = 'Ilustrasi sekelompok orang ngobrol di lingkaran',
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
      <ellipse cx="140" cy="200" rx="118" ry="5" fill="#1A2256" opacity="0.10" />

      <g stroke="#1A2256" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Back-left figure (smaller, depth) */}
        <circle cx="100" cy="78" r="14" fill="#FFFAEE" />
        <path d="M86 100 Q88 120 88 142 M114 100 Q112 120 112 142" />

        {/* Back-right figure */}
        <circle cx="180" cy="78" r="14" fill="#FFFAEE" />
        <path d="M166 100 Q168 120 168 142 M194 100 Q192 120 192 142" />

        {/* Foreground-left figure (larger, profile-ish facing right) */}
        <circle cx="60" cy="118" r="18" fill="#FFFAEE" />
        <path d="M44 142 Q48 168 48 188 M76 142 Q72 168 72 188" />

        {/* Foreground-right figure (facing left) */}
        <circle cx="220" cy="118" r="18" fill="#FFFAEE" />
        <path d="M204 142 Q208 168 208 188 M236 142 Q232 168 232 188" />

        {/* Speech bubble pointing back to back-right figure */}
        <path
          d="M196 28 Q196 18 208 18 L246 18 Q258 18 258 28 L258 46 Q258 56 246 56 L218 56 L210 64 L212 56 L208 56 Q196 56 196 46 Z"
          fill="#FFFAEE"
        />
      </g>

      {/* Speech bubble dots (...) */}
      <g fill="#1A2256">
        <circle cx="216" cy="38" r="2" />
        <circle cx="226" cy="38" r="2" />
        <circle cx="236" cy="38" r="2" />
      </g>

      {/* Coral punctum — accent on the back-right figure (the speaker) */}
      <circle cx="180" cy="62" r="3" fill="#E8632B" opacity="0.55" />
    </svg>
  );
}

// TODO(Sprint 5+): tambah variant prop `diverse?: boolean` yang include
// detail keberagaman Indonesia — kerudung, topi/snapback, kemeja batik pattern.
// Outline-only style tetap. Refer Mas (owner) untuk approval style sebelum implement.

type Props = {
  size?: number | { width: number; height: number };
  className?: string;
  ariaLabel?: string;
};

/** 1 orang duduk di bench, balon bicara KOSONG di atas kepala. Lonely-but-hopeful. */
export function EmptyForum({
  size = 280,
  className,
  ariaLabel = 'Ilustrasi orang duduk sendirian dengan balon bicara kosong',
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
      <ellipse cx="140" cy="198" rx="92" ry="5" fill="#1A2256" opacity="0.10" />

      <g stroke="#1A2256" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Bench */}
        <rect x="60" y="158" width="160" height="10" rx="2" fill="#FFFAEE" />
        <path d="M76 168 V188 M204 168 V188" />

        {/* Person seated, slight slouch */}
        <circle cx="140" cy="86" r="20" fill="#FFFAEE" />
        {/* Body — shoulders sloping forward */}
        <path d="M122 106 Q126 132 124 158 M158 106 Q154 132 156 158" />
        {/* Hands resting on lap */}
        <path d="M126 142 Q140 152 154 142" />

        {/* Empty speech bubble above head */}
        <path
          d="M168 24 Q168 14 180 14 L228 14 Q240 14 240 24 L240 50 Q240 60 228 60 L196 60 L188 70 L190 60 L180 60 Q168 60 168 50 Z"
          fill="#FFFAEE"
        />
      </g>

      {/* Coral punctum — small heart-tick on the bench, hopeful detail */}
      <path
        d="M138 175 Q140 172 142 175 Q142 178 140 180 Q138 178 138 175 Z"
        fill="#E8632B"
        opacity="0.55"
      />
    </svg>
  );
}

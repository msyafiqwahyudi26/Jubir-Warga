type Props = {
  width?: number;
  color?: string;
  thickness?: number;
  className?: string;
};

export function SquigglyUnderline({
  width = 200,
  color = '#E8632B',
  thickness = 3,
  className,
}: Props) {
  // Hand-drawn zigzag — quadratic Beziers with slight irregularity, mirroring the
  // squiggly under the Phase 1 logo. Height locked at 8 so the curve stays
  // proportional regardless of width (it scales horizontally via viewBox).
  return (
    <svg
      viewBox="0 0 200 8"
      width={width}
      height={(width / 200) * 8}
      role="presentation"
      aria-hidden
      className={className}
      preserveAspectRatio="none"
    >
      <path
        d="M2 5 Q26 1 50 4 Q74 7 100 4 Q124 1 150 5 Q174 8 198 3"
        stroke={color}
        strokeWidth={thickness}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

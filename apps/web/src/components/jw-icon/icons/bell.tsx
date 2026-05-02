type IconProps = { size?: number; className?: string; color?: string };

export function BellIcon({ size = 20, className, color = 'currentColor' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5.6 17.2 c0 -0.5 0.2 -1 0.6 -1.4 l1 -1 V11 a4.9 4.9 0 1 1 9.8 0 v3.8 l1 1 c0.4 0.4 0.6 0.9 0.6 1.4 H5.6 Z" />
      <path d="M10.1 20.4 a2.1 2.1 0 0 0 3.9 0" />
      <circle cx="11.9" cy="3.5" r="0.4" fill={color} />
    </svg>
  );
}

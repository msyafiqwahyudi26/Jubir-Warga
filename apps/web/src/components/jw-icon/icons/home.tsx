type IconProps = { size?: number; className?: string; color?: string };

export function HomeIcon({ size = 20, className, color = 'currentColor' }: IconProps) {
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
      <path d="M3.2 11.4 L12 3.1 L20.9 11.5" />
      <path d="M5 9.6 V20.1 a1 1 0 0 0 1 1 H18.1 a1 1 0 0 0 1 -1 V9.4" />
      <path d="M9.4 21 V14.2 H14.7 V21" />
      <circle cx="12" cy="11.7" r="0.4" fill={color} />
    </svg>
  );
}

type IconProps = { size?: number; className?: string; color?: string };

export function SearchIcon({ size = 20, className, color = 'currentColor' }: IconProps) {
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
      <circle cx="10.6" cy="10.5" r="6.4" />
      <path d="M15.4 15.6 L20.3 20.7" />
      <circle cx="13" cy="8" r="0.4" fill={color} />
    </svg>
  );
}

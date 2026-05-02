type IconProps = { size?: number; className?: string; color?: string };

export function UserIcon({ size = 20, className, color = 'currentColor' }: IconProps) {
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
      <circle cx="12" cy="8.2" r="4.1" />
      <path d="M4.4 20.6 c0.4 -4.2 3.7 -7.2 7.6 -7.2 c3.9 0 7.2 3 7.6 7.2" />
      <circle cx="13.6" cy="7" r="0.3" fill={color} />
    </svg>
  );
}

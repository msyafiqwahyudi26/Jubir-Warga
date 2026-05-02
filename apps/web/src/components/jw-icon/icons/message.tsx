type IconProps = { size?: number; className?: string; color?: string };

export function MessageIcon({ size = 20, className, color = 'currentColor' }: IconProps) {
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
      <path d="M3.5 5.6 a2 2 0 0 1 2 -2 H18.4 a2 2 0 0 1 2 2 V15.1 a2 2 0 0 1 -2 2 H10.2 L6.1 21 V17.1 H5.5 a2 2 0 0 1 -2 -2 Z" />
      <circle cx="8.5" cy="10.4" r="0.6" fill={color} />
      <circle cx="12" cy="10.4" r="0.6" fill={color} />
      <circle cx="15.5" cy="10.4" r="0.6" fill={color} />
    </svg>
  );
}

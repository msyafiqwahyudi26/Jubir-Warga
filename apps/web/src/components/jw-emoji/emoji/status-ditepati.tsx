type EmojiProps = { size?: number; className?: string };

// Lingkaran mint + checkmark cream hand-drawn (sedikit wonky).
export function StatusDitepati({ size = 24, className }: EmojiProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
    >
      <circle cx="16" cy="16" r="13.5" fill="#7FB69E" />
      <path
        d="M9.5 16.4 L13.8 20.8 L22.7 11.3"
        stroke="#FFFAEE"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="22.5" cy="11.5" r="0.6" fill="#FFFAEE" />
    </svg>
  );
}

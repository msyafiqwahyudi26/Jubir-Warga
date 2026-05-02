type EmojiProps = { size?: number; className?: string };

// Mangkuk nasi + sayur stylized — hand-drawn brand palette.
export function KategoriPangan({ size = 24, className }: EmojiProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
    >
      <ellipse cx="16" cy="13.5" rx="10.5" ry="3" fill="#FFFAEE" />
      <path
        d="M5.5 13.5 C5.5 19 9.8 24.2 16 24.2 C22.2 24.2 26.5 19 26.5 13.5 Z"
        fill="#1A2256"
      />
      <ellipse cx="16" cy="13.5" rx="9.5" ry="2.4" fill="#FFFAEE" />
      <ellipse cx="13" cy="12.6" rx="1.5" ry="0.9" fill="#7FB69E" />
      <ellipse cx="18" cy="13.2" rx="1.4" ry="0.8" fill="#E8632B" />
      <ellipse cx="20.5" cy="12.4" rx="1" ry="0.6" fill="#F2B137" />
      <path
        d="M11 9.5 Q12 7 13 9.5"
        stroke="#6B6860"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M16 8.5 Q17 6 18 8.5"
        stroke="#6B6860"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M21 9.5 Q22 7 23 9.5"
        stroke="#6B6860"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

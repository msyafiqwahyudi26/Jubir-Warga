type EmojiProps = { size?: number; className?: string };

// Bus / angkot stylized — boxy hand-drawn, brand palette only.
export function KategoriTransport({ size = 24, className }: EmojiProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
    >
      <rect x="4" y="9.5" width="24" height="14.5" rx="3" fill="#1A2256" />
      <rect x="6" y="11.5" width="9" height="6" rx="1" fill="#FFFAEE" />
      <rect x="17" y="11.5" width="9" height="6" rx="1" fill="#FFFAEE" />
      <rect x="14.5" y="15.5" width="3" height="8.5" rx="0.5" fill="#E8632B" />
      <circle cx="9" cy="25.2" r="2.5" fill="#2A2D3A" />
      <circle cx="23" cy="25.2" r="2.5" fill="#2A2D3A" />
      <circle cx="9" cy="25.2" r="0.9" fill="#FFFAEE" />
      <circle cx="23" cy="25.2" r="0.9" fill="#FFFAEE" />
      <rect x="3.5" y="13" width="1.2" height="3" rx="0.4" fill="#F2B137" />
    </svg>
  );
}

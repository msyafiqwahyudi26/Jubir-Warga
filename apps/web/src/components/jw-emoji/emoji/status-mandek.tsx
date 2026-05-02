type EmojiProps = { size?: number; className?: string };

// Lingkaran marigold + jam pasir (mandek = stuck) hand-drawn.
export function StatusMandek({ size = 24, className }: EmojiProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
    >
      <circle cx="16" cy="16" r="13.5" fill="#F2B137" />
      <path
        d="M11 8.5 H21 L16.2 16 L21 23.5 H11 L15.8 16 Z"
        fill="#1A2256"
      />
      <path
        d="M12.6 9.7 H19.4 L16.1 14.7 Z"
        fill="#FFFAEE"
        opacity="0.85"
      />
      <path
        d="M12.6 22.3 L16 17.6 L19.4 22.3 Z"
        fill="#FFFAEE"
        opacity="0.6"
      />
      <circle cx="16" cy="16" r="0.6" fill="#E8632B" />
    </svg>
  );
}

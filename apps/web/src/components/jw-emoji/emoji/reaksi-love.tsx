type EmojiProps = { size?: number; className?: string };

// Hati coral hand-drawn — sedikit irregular mirror logo treatment.
export function ReaksiLove({ size = 24, className }: EmojiProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
    >
      <path
        d="M16 26.4 C8.2 21.5 4.5 17.6 4.5 13 C4.5 9.7 7 7.2 10.2 7.2 C12.4 7.2 14.5 8.6 16 11 C17.5 8.6 19.6 7.2 21.8 7.2 C25 7.2 27.5 9.7 27.5 13 C27.5 17.6 23.8 21.5 16 26.4 Z"
        fill="#E8632B"
      />
      <path
        d="M9.5 11 Q11.2 10 12.5 12"
        stroke="#FFFAEE"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        opacity="0.75"
      />
      <circle cx="11.5" cy="11" r="0.5" fill="#FFFAEE" opacity="0.55" />
    </svg>
  );
}

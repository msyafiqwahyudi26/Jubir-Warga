/**
 * Avatar — circular name-hued + optional marigold level dot.
 *
 * Per Spec #34 visual parity Wave 1, step 2.
 * Source: docs/design-system-reference/components.jsx (Avatar function).
 *
 * - Hue deterministic per name (same input → same output, no flicker).
 * - 4 size variant (sm/md/lg/xl = 24/32/40/56 px).
 * - Level dot (1-10) marigold di bottom-right, conditional via showLevel.
 * - 2-char initials max, fallback empty string aman.
 */
type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_PX: Record<AvatarSize, number> = {
  sm: 24,
  md: 32,
  lg: 40,
  xl: 56,
};

export type AvatarProps = {
  name: string;
  size?: AvatarSize;
  level?: number;
  showLevel?: boolean;
  className?: string;
};

/**
 * Deterministic hue dari nama. Algorithm match Claude Design source.
 */
export function avatarHue(name: string): number {
  if (!name) return 0;
  const a = name.charCodeAt(0) || 0;
  const b = name.length > 1 ? name.charCodeAt(1) : 0;
  return (a * 37 + b * 11) % 360;
}

/**
 * 2-char initials max dari nama (split by whitespace, take first char per
 * word, uppercase). "Anies Baswedan" → "AB", "Ridwan" → "R".
 */
export function avatarInitials(name: string): string {
  if (!name) return '';
  return name
    .split(/\s+/)
    .map((w) => w.charAt(0))
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function Avatar({
  name,
  size = 'md',
  level,
  showLevel = true,
  className = '',
}: AvatarProps) {
  const px = SIZE_PX[size];
  const hue = avatarHue(name);
  const initials = avatarInitials(name);
  const fontSize = px / 2.6;

  const dotPx = Math.max(14, Math.round(px * 0.35));
  const dotFontPx = Math.max(9, Math.round(px * 0.22));

  return (
    <div
      className={`relative inline-block flex-shrink-0 ${className}`}
      aria-label={`Avatar ${name}${level !== undefined ? `, level ${level}` : ''}`}
    >
      <div
        className="rounded-full text-white flex items-center justify-center font-semibold select-none"
        style={{
          width: px,
          height: px,
          background: `hsl(${hue}, 42%, 40%)`,
          fontSize,
        }}
      >
        {initials}
      </div>
      {showLevel && level !== undefined && (
        <span
          aria-hidden
          className="absolute -bottom-0.5 -right-0.5 bg-jw-marigold text-white rounded-full font-bold flex items-center justify-center ring-2 ring-jw-cream"
          style={{
            width: dotPx,
            height: dotPx,
            fontSize: dotFontPx,
          }}
        >
          {level}
        </span>
      )}
    </div>
  );
}

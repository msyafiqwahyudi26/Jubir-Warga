'use client';

import { useId } from 'react';

export type NalaExpression =
  | 'curious'
  | 'excited'
  | 'mentor'
  | 'thinking'
  | 'confident';

type ExpressionConfig = {
  headTilt: number;
  crestTilt: number;
  eyeOpen: number;
  beakOpen: boolean;
  mouth: 'smile' | null;
  brow?: boolean;
  sparkle?: boolean;
};

const EXPRESSIONS: Record<NalaExpression, ExpressionConfig> = {
  curious:   { headTilt: -3, crestTilt:  0, eyeOpen: 1.0, beakOpen: false, mouth: null },
  excited:   { headTilt: -3, crestTilt:  8, eyeOpen: 1.1, beakOpen: true,  mouth: null,    sparkle: true },
  mentor:    { headTilt:  0, crestTilt:  0, eyeOpen: 0.7, beakOpen: false, mouth: 'smile', brow: true },
  thinking:  { headTilt: -8, crestTilt: -2, eyeOpen: 0.9, beakOpen: false, mouth: null },
  confident: { headTilt:  0, crestTilt:  5, eyeOpen: 0.9, beakOpen: false, mouth: 'smile' },
};

const PALETTE = {
  bodyMain: '#1A2256',
  bodyHi:   '#2D3A78',
  belly:    '#FFFAEE',
  beak:     '#F2B137',
  beakDark: '#C8881A',
  crest:    '#E8632B',
  wing:     '#0F1740',
  eyeWhite: '#FFFFFF',
  eyeIris:  '#1A2256',
} as const;

type Props = {
  expression?: NalaExpression;
  size?: number;
  className?: string;
};

export function NalaMascot({
  expression = 'curious',
  size = 120,
  className,
}: Props) {
  // useId guarantees a unique, stable, hydration-safe id per instance —
  // even when several Nala mascots with the same expression render side by side
  // (Phase 1 keyed gradients on `expression`, so duplicates collided).
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const ex = EXPRESSIONS[expression];

  const eyeR = 7.5;
  const pupilR = 3.6 * ex.eyeOpen;

  const bgId = `nala-bg-${uid}`;
  const hgId = `nala-hg-${uid}`;
  const bkId = `nala-bk-${uid}`;
  const dsId = `nala-ds-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={`Nala — ${expression}`}
      className={className}
      style={{ display: 'block' }}
    >
      <defs>
        <radialGradient id={bgId} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={PALETTE.bodyHi} />
          <stop offset="100%" stopColor={PALETTE.bodyMain} />
        </radialGradient>
        <radialGradient id={hgId} cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor={PALETTE.bodyHi} />
          <stop offset="100%" stopColor={PALETTE.bodyMain} />
        </radialGradient>
        <radialGradient id={bkId} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={PALETTE.beak} />
          <stop offset="100%" stopColor={PALETTE.beakDark} />
        </radialGradient>
        <filter id={dsId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="3" stdDeviation="2" floodColor="#1A2256" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Soft ground shadow */}
      <ellipse cx="60" cy="108" rx="28" ry="3" fill="#1A2256" opacity="0.15" />

      <g transform={`rotate(${ex.headTilt} 60 50)`} filter={`url(#${dsId})`}>
        {/* Body */}
        <ellipse cx="60" cy="78" rx="28" ry="22" fill={`url(#${bgId})`} />
        <ellipse cx="60" cy="82" rx="18" ry="15" fill={PALETTE.belly} opacity="0.95" />

        {/* Wings */}
        <ellipse cx="36" cy="76" rx="9" ry="14" fill={PALETTE.wing} transform="rotate(-12 36 76)" />
        <ellipse cx="84" cy="76" rx="9" ry="14" fill={PALETTE.wing} transform="rotate(12 84 76)" />

        {/* Head */}
        <ellipse cx="60" cy="42" rx="24" ry="22" fill={`url(#${hgId})`} />

        {/* Crest (jambul coral) */}
        <g transform={`translate(60 18) rotate(${ex.crestTilt})`}>
          <ellipse cx="0"  cy="0"  rx="5"   ry="8" fill={PALETTE.crest} />
          <ellipse cx="-4" cy="-2" rx="2.5" ry="5" fill={PALETTE.crest} opacity="0.7" />
        </g>

        {/* LEFT eye */}
        <ellipse cx="50"   cy="36"   rx={eyeR}   ry={eyeR}   fill={PALETTE.eyeWhite} />
        <ellipse cx="51"   cy="36.5" rx={pupilR} ry={pupilR} fill={PALETTE.eyeIris} />
        <circle  cx="52.5" cy="35"   r="1.4"                  fill={PALETTE.eyeWhite} />
        {ex.sparkle && <circle cx="49" cy="34" r="1" fill={PALETTE.eyeWhite} opacity="0.9" />}

        {/* RIGHT eye */}
        <ellipse cx="70"   cy="36"   rx={eyeR}   ry={eyeR}   fill={PALETTE.eyeWhite} />
        <ellipse cx="71"   cy="36.5" rx={pupilR} ry={pupilR} fill={PALETTE.eyeIris} />
        <circle  cx="72.5" cy="35"   r="1.4"                  fill={PALETTE.eyeWhite} />
        {ex.sparkle && <circle cx="69" cy="34" r="1" fill={PALETTE.eyeWhite} opacity="0.9" />}

        {/* Brow (mentor only) */}
        {ex.brow && (
          <>
            <path d="M44 28 Q50 24 56 27" stroke={PALETTE.bodyMain} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M64 27 Q70 24 76 28" stroke={PALETTE.bodyMain} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </>
        )}

        {/* Beak — heart curve */}
        {ex.beakOpen ? (
          <g>
            <path d="M52 48 Q60 54 68 48 Q60 56 52 48 Z" fill={`url(#${bkId})`} />
            <path d="M52 52 Q60 60 68 52 Q60 64 52 52 Z" fill={PALETTE.beakDark} opacity="0.7" />
          </g>
        ) : (
          <path d="M52 50 Q60 56 68 50 Q60 62 52 50 Z" fill={`url(#${bkId})`} />
        )}

        {/* Smile (confident / mentor) */}
        {ex.mouth === 'smile' && (
          <path
            d="M55 64 Q60 67 65 64"
            stroke={PALETTE.bodyMain}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
        )}
      </g>

      {/* Sparkle stars (excited extra) */}
      {ex.sparkle && (
        <>
          <text x="92" y="28" fontSize="10" fill={PALETTE.crest}>✦</text>
          <text x="22" y="32" fontSize="8"  fill={PALETTE.beak}>✦</text>
        </>
      )}
    </svg>
  );
}

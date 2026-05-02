import Link from 'next/link';

export function TagihHero() {
  return (
    <header className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-jw-line pb-8">
      <div>
        <span className="font-hand text-jw-coral text-base">— pilar</span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-jw-blue leading-tight">
          Tagih Janji{' '}
          <em className="block text-3xl md:text-4xl">Pemerintah.</em>
        </h1>
        <p className="text-base md:text-lg text-jw-ink/80 mt-4 max-w-xl">
          Setiap janji yang diucapkan, kita catat. Yang ditepati, kita rayakan.
          Yang diingkari, kita ingatkan.
        </p>
        <div className="mt-6 flex items-center gap-3 flex-wrap">
          <Link
            href="#daftar-janji"
            className="inline-flex items-center rounded-jw-md bg-jw-coral text-white px-5 py-2.5 text-sm font-semibold hover:bg-jw-coral/90 transition"
          >
            Lihat semua janji
          </Link>
          <Link
            href="/tagih/baru"
            className="inline-flex items-center rounded-jw-md border border-jw-line bg-white text-jw-blue px-5 py-2.5 text-sm font-semibold hover:bg-jw-line/40 transition"
          >
            + Submit janji baru
          </Link>
        </div>
      </div>
      <HeroIllustration />
    </header>
  );
}

// Ported from apps/legacy/src/pages/tagih/Index.jsx HeroTagihIllustration.
// Uses brand color tokens (#1A2256 jw-blue, #3B4A8A jw-blue-soft, #7FB69E
// jw-mint, #E8632B jw-coral, #F2B137 jw-marigold) plus illustration-only
// figure colors for skin/hair (consistent with existing hero-baca-dokumen).
function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 320 240"
      role="img"
      aria-label="Ilustrasi orang muda menunjuk papan checklist janji pejabat"
      className="w-full max-w-md mx-auto"
      style={{ display: 'block' }}
    >
      {/* Faint Indonesia outline as background */}
      <g opacity="0.18" fill="#1A2256">
        <ellipse cx="60" cy="140" rx="35" ry="10" />
        <ellipse cx="115" cy="148" rx="28" ry="8" />
        <ellipse cx="175" cy="155" rx="40" ry="10" />
        <ellipse cx="230" cy="135" rx="22" ry="14" />
        <ellipse cx="265" cy="160" rx="18" ry="20" />
      </g>

      {/* Checklist board */}
      <g transform="translate(180 50)">
        <rect
          width="100"
          height="120"
          rx="6"
          fill="#FFFFFF"
          stroke="#1A2256"
          strokeWidth="2"
        />
        <rect x="35" y="-6" width="30" height="10" rx="3" fill="#1A2256" />
        {[0, 1, 2, 3].map((i) => {
          const y = 18 + i * 22;
          const checked = i < 2;
          return (
            <g key={i}>
              <rect
                x="10"
                y={y}
                width="14"
                height="14"
                rx="3"
                fill={checked ? '#7FB69E' : 'none'}
                stroke="#1A2256"
                strokeWidth="1.5"
              />
              {checked && (
                <path
                  d={`M13 ${y + 7} L17 ${y + 11} L21 ${y + 4}`}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              )}
              <rect
                x="30"
                y={y + 4}
                width="55"
                height="3"
                rx="1"
                fill="#1A2256"
                opacity="0.6"
              />
              <rect
                x="30"
                y={y + 9}
                width="40"
                height="3"
                rx="1"
                fill="#1A2256"
                opacity="0.3"
              />
            </g>
          );
        })}
      </g>

      {/* Person figure */}
      <g>
        <ellipse cx="80" cy="80" rx="20" ry="22" fill="#8B5A3C" />
        <path
          d="M62 72 Q 80 58 98 72 Q 95 64 80 60 Q 65 64 62 72"
          fill="#1F1308"
        />
        <path
          d="M55 110 Q 55 100 65 100 L 95 100 Q 105 100 105 110 L 110 175 L 50 175 Z"
          fill="#3B4A8A"
        />
        <circle cx="80" cy="125" r="3" fill="#E8632B" opacity="0.7" />
        <circle cx="70" cy="140" r="2" fill="#F2B137" opacity="0.7" />
        <circle cx="90" cy="140" r="2" fill="#F2B137" opacity="0.7" />
        <path
          d="M105 110 L 145 100 Q 158 95 165 105 L 158 115 L 110 130 Z"
          fill="#3B4A8A"
        />
        <ellipse cx="160" cy="106" rx="6" ry="5" fill="#8B5A3C" />
      </g>
    </svg>
  );
}

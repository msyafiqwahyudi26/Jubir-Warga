// Sprint 1 — custom hand-drawn inline SVGs for Beranda
// All hero/illustration art lives here. NO solid placeholder rectangles.
// Style: flat hand-drawn, brand palette only (cream, brand-blue, coral, marigold, mint, line).

const HeroKafeScene = ({ width = 380 }) => (
  <svg viewBox="0 0 380 280" width={width} role="img" aria-label="Anak muda baca dokumen di kafe">
    <defs>
      <pattern id="batik-stripes" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="#FFFAEE" strokeWidth="1.4" opacity="0.55"/>
      </pattern>
    </defs>

    {/* Background tinted block — soft brand-blue surface */}
    <rect x="0" y="0" width="380" height="280" rx="22" fill="#E8ECF7"/>

    {/* Café window light streak (organic stroke) */}
    <path d="M 22 36 Q 110 14 200 30 Q 290 46 360 28" stroke="#FFFAEE" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.7"/>
    <path d="M 30 56 Q 110 44 230 60" stroke="#FFFAEE" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.5"/>

    {/* Café table — wooden plank, soft brand-blue tinted shadow under */}
    <ellipse cx="190" cy="252" rx="160" ry="10" fill="rgba(26,34,86,0.10)"/>
    <rect x="36" y="216" width="308" height="34" rx="6" fill="#1A2256"/>
    <rect x="36" y="216" width="308" height="6" fill="#3B4A8A"/>
    {/* table grain lines */}
    <line x1="60" y1="234" x2="320" y2="234" stroke="#3B4A8A" strokeWidth="0.8" opacity="0.6"/>
    <line x1="80" y1="240" x2="300" y2="240" stroke="#3B4A8A" strokeWidth="0.8" opacity="0.5"/>

    {/* Coffee mug, right of figure */}
    <g transform="translate(266 184)">
      <ellipse cx="0" cy="32" rx="22" ry="3" fill="rgba(26,34,86,0.12)"/>
      <path d="M -16 0 Q -18 -2 -16 -4 L 16 -4 Q 18 -2 16 0 L 14 28 Q 13 32 8 32 L -8 32 Q -13 32 -14 28 Z" fill="#FFFAEE" stroke="#1A2256" strokeWidth="1.6" strokeLinejoin="round"/>
      {/* handle */}
      <path d="M 16 4 Q 26 6 26 14 Q 26 22 16 22" stroke="#1A2256" strokeWidth="1.6" fill="none"/>
      {/* coffee top */}
      <ellipse cx="0" cy="-2" rx="14" ry="3" fill="#1A2256"/>
      {/* steam squiggle */}
      <path d="M -6 -10 Q -3 -16 -6 -22 Q -9 -28 -4 -34" stroke="#1A2256" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M 6 -8 Q 9 -14 6 -20 Q 3 -26 8 -32" stroke="#1A2256" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.5"/>
    </g>

    {/* Tote bag on chair back — coral with strap */}
    <g transform="translate(310 158)">
      <path d="M -18 0 Q -20 -8 -16 -10 L 16 -10 Q 20 -8 18 0 L 14 36 Q 13 40 8 40 L -8 40 Q -13 40 -14 36 Z" fill="#E8632B" stroke="#1A2256" strokeWidth="1.4"/>
      {/* strap */}
      <path d="M -14 -10 Q -14 -22 -4 -22 Q 4 -22 4 -10" stroke="#1A2256" strokeWidth="1.6" fill="none"/>
      {/* canvas texture lines */}
      <line x1="-10" y1="6" x2="14" y2="6" stroke="#FFFAEE" strokeWidth="0.6" opacity="0.5"/>
      <line x1="-10" y1="14" x2="14" y2="14" stroke="#FFFAEE" strokeWidth="0.6" opacity="0.5"/>
    </g>

    {/* === FIGURE: muda, kemeja batik, baca dokumen === */}
    {/* Chair back behind figure */}
    <rect x="120" y="120" width="120" height="100" rx="12" fill="#1A2256" opacity="0.88"/>
    <rect x="124" y="126" width="112" height="6" rx="3" fill="#3B4A8A"/>

    {/* Body / shoulders — kemeja batik (brand-blue with cream stripe pattern) */}
    <path d="M 130 220 Q 130 168 180 158 Q 230 168 230 220 Z" fill="#1A2256"/>
    <path d="M 130 220 Q 130 168 180 158 Q 230 168 230 220 Z" fill="url(#batik-stripes)"/>
    {/* shirt collar */}
    <path d="M 168 158 L 180 174 L 192 158" stroke="#FFFAEE" strokeWidth="2" fill="none" strokeLinecap="round"/>

    {/* Neck */}
    <path d="M 172 156 L 172 142 Q 172 138 180 138 Q 188 138 188 142 L 188 156 Z" fill="#D4A574"/>
    {/* neck shadow */}
    <path d="M 172 152 Q 180 156 188 152 L 188 156 L 172 156 Z" fill="#A87F52" opacity="0.5"/>

    {/* Head — neutral skin tone, simple oval */}
    <ellipse cx="180" cy="118" rx="26" ry="30" fill="#D4A574"/>
    {/* hair — short, dark, slight wave */}
    <path d="M 156 110 Q 156 88 180 86 Q 204 88 204 110 Q 204 100 198 96 Q 190 92 180 92 Q 170 92 162 96 Q 156 100 156 110 Z" fill="#1A1408"/>
    {/* fringe */}
    <path d="M 162 102 Q 168 96 178 98 Q 188 100 196 98" stroke="#1A1408" strokeWidth="3" fill="none" strokeLinecap="round"/>

    {/* Eyes — focused on document, looking down */}
    <path d="M 168 122 Q 172 124 176 122" stroke="#1A1408" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M 184 122 Q 188 124 192 122" stroke="#1A1408" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

    {/* Subtle nose & mouth */}
    <path d="M 180 128 Q 180 132 178 134" stroke="#A87F52" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7"/>
    <path d="M 175 140 Q 180 142 185 140" stroke="#1A1408" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.6"/>

    {/* Arm — left, holding document */}
    <path d="M 136 200 Q 132 218 142 230 L 168 220" stroke="#1A2256" strokeWidth="14" fill="none" strokeLinecap="round"/>
    <path d="M 136 200 Q 132 218 142 230 L 168 220" stroke="url(#batik-stripes)" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.7"/>
    {/* hand */}
    <ellipse cx="166" cy="220" rx="7" ry="5" fill="#D4A574" transform="rotate(-15 166 220)"/>

    {/* Right arm */}
    <path d="M 224 200 Q 230 218 220 230 L 200 222" stroke="#1A2256" strokeWidth="14" fill="none" strokeLinecap="round"/>
    <path d="M 224 200 Q 230 218 220 230 L 200 222" stroke="url(#batik-stripes)" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.7"/>
    <ellipse cx="200" cy="222" rx="7" ry="5" fill="#D4A574" transform="rotate(15 200 222)"/>

    {/* Document — cream paper, brand-blue text lines, slight tilt */}
    <g transform="translate(184 224) rotate(-6)">
      <rect x="-26" y="-20" width="52" height="32" rx="2" fill="#FFFAEE" stroke="#1A2256" strokeWidth="1.4"/>
      {/* text lines */}
      <line x1="-22" y1="-14" x2="14" y2="-14" stroke="#1A2256" strokeWidth="1.2" opacity="0.7"/>
      <line x1="-22" y1="-10" x2="20" y2="-10" stroke="#1A2256" strokeWidth="1.2" opacity="0.5"/>
      <line x1="-22" y1="-6" x2="16" y2="-6" stroke="#1A2256" strokeWidth="1.2" opacity="0.5"/>
      <line x1="-22" y1="-2" x2="22" y2="-2" stroke="#1A2256" strokeWidth="1.2" opacity="0.5"/>
      <line x1="-22" y1="2" x2="10" y2="2" stroke="#1A2256" strokeWidth="1.2" opacity="0.5"/>
      {/* underline (coral highlight) */}
      <line x1="-22" y1="-14" x2="14" y2="-14" stroke="#E8632B" strokeWidth="2.2" opacity="0.6"/>
    </g>

    {/* Hand-drawn coral annotation at top-right */}
    <g transform="translate(298 76) rotate(-4)">
      <text x="0" y="0" fontFamily="Caveat,cursive" fontSize="22" fill="#E8632B" fontWeight="600">← baca!</text>
    </g>
  </svg>
);

const PasporOpenIllustration = ({ width = 280 }) => (
  <svg viewBox="0 0 280 220" width={width} role="img" aria-label="Paspor warga terbuka, halaman dengan stempel">
    {/* Soft shadow */}
    <ellipse cx="140" cy="200" rx="120" ry="8" fill="rgba(0,0,0,0.18)"/>

    {/* Open book/passport — two pages */}
    {/* Right page: cream with stempel */}
    <g>
      <path d="M 140 30 L 254 36 L 254 196 L 140 188 Z" fill="#FFFAEE" stroke="#0E1340" strokeWidth="1.4"/>
      {/* page lines */}
      <line x1="156" y1="58" x2="240" y2="62" stroke="#1A2256" strokeWidth="1" opacity="0.4"/>
      <line x1="156" y1="70" x2="232" y2="74" stroke="#1A2256" strokeWidth="1" opacity="0.3"/>
      <line x1="156" y1="82" x2="240" y2="86" stroke="#1A2256" strokeWidth="1" opacity="0.3"/>
      {/* Stempel coral, rotated -8deg */}
      <g transform="translate(200 130) rotate(-8)">
        <circle cx="0" cy="0" r="34" fill="none" stroke="#E8632B" strokeWidth="2.4"/>
        <circle cx="0" cy="0" r="28" fill="none" stroke="#E8632B" strokeWidth="1.4"/>
        <text x="0" y="-6" fontFamily="Fira Code,monospace" fontSize="8" fill="#E8632B" fontWeight="600" textAnchor="middle">VOTE 2026</text>
        <text x="0" y="6" fontFamily="Fira Code,monospace" fontSize="7" fill="#E8632B" textAnchor="middle">JAKARTA</text>
        <text x="0" y="16" fontFamily="Fira Code,monospace" fontSize="6" fill="#E8632B" textAnchor="middle">14·02·26</text>
      </g>
      {/* Mint mini stempel */}
      <g transform="translate(170 70) rotate(6)">
        <rect x="-16" y="-8" width="32" height="16" rx="2" fill="none" stroke="#7FB69E" strokeWidth="1.4"/>
        <text x="0" y="3" fontFamily="Fira Code,monospace" fontSize="6" fill="#7FB69E" textAnchor="middle" fontWeight="600">DITEPATI</text>
      </g>
    </g>

    {/* Left page: brand-blue cover spread */}
    <g>
      <path d="M 26 36 L 140 30 L 140 188 L 26 196 Z" fill="#1A2256" stroke="#0E1340" strokeWidth="1.4"/>
      {/* gold trim */}
      <path d="M 36 50 L 130 44 L 130 178 L 36 184 Z" fill="none" stroke="#F2B137" strokeWidth="1.4"/>
      {/* embossed wordmark */}
      <text x="83" y="92" fontFamily="Vollkorn,serif" fontSize="14" fill="#F2B137" fontWeight="700" textAnchor="middle">PASPOR</text>
      <text x="83" y="110" fontFamily="Vollkorn,serif" fontSize="12" fill="#F2B137" fontStyle="italic" textAnchor="middle">Warga</text>
      {/* avatar circle */}
      <circle cx="83" cy="142" r="16" fill="#FFFAEE" stroke="#F2B137" strokeWidth="1.4"/>
      <text x="83" y="148" fontFamily="Inter,sans-serif" fontSize="12" fontWeight="700" fill="#1A2256" textAnchor="middle">AP</text>
      {/* passport number */}
      <text x="83" y="172" fontFamily="Fira Code,monospace" fontSize="8" fill="#FFFAEE" textAnchor="middle" opacity="0.8">JW-2026-0001</text>
    </g>

    {/* spine shadow */}
    <line x1="140" y1="30" x2="140" y2="188" stroke="rgba(0,0,0,0.4)" strokeWidth="2"/>

    {/* Caveat annotation */}
    <text x="40" y="22" fontFamily="Caveat,cursive" fontSize="18" fill="#E8632B" fontWeight="600" transform="rotate(-3 40 22)">paspor warga →</text>
  </svg>
);

window.HeroKafeScene = HeroKafeScene;
window.PasporOpenIllustration = PasporOpenIllustration;

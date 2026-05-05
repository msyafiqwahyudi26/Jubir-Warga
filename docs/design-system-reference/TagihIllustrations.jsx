// Tagih Janji — custom inline hand-drawn SVGs.
// Style: brand palette only, soft strokes, hand-drawn organik.

const C_T = { blue:'#1B3A7A', cream:'#FFFAEE', coral:'#E8632B', marigold:'#D89522', mint:'#7FB69E', line:'#E5DFD4', ink:'#2A2823', red:'#C44536' };

// 1. HERO SCENE — orang muda di depan papan checklist + peta Indonesia di belakang
const TagihHeroScene = ({ width = 420 }) => (
  <svg viewBox="0 0 420 320" width={width} role="img" aria-label="Anak muda dengan papan checklist dan peta Indonesia">
    <defs>
      <pattern id="th-dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill={C_T.line}/>
      </pattern>
    </defs>
    {/* dotted background */}
    <rect x="0" y="0" width="420" height="320" fill="url(#th-dots)" opacity="0.6"/>

    {/* Indonesia map silhouette behind (faint, decorative) */}
    <g opacity="0.18" stroke={C_T.blue} strokeWidth="1.5" fill="none" strokeLinejoin="round">
      {/* Sumatera */}
      <path d="M 38 78 Q 28 96 36 118 Q 44 138 58 152 Q 70 162 82 158 Q 88 144 80 128 Q 72 110 64 96 Q 54 80 38 78 Z" fill={C_T.blue} fillOpacity="0.06"/>
      {/* Jawa */}
      <path d="M 96 178 Q 130 174 168 178 Q 196 182 218 188 Q 236 192 232 200 Q 196 206 158 204 Q 118 202 96 196 Q 88 188 96 178 Z" fill={C_T.blue} fillOpacity="0.06"/>
      {/* Kalimantan */}
      <path d="M 168 88 Q 158 108 164 132 Q 172 152 188 158 Q 208 156 218 144 Q 224 128 218 108 Q 208 88 188 82 Q 176 82 168 88 Z" fill={C_T.blue} fillOpacity="0.06"/>
      {/* Sulawesi */}
      <path d="M 248 96 Q 240 114 246 132 Q 254 144 252 162 Q 244 174 252 184 Q 264 178 270 162 Q 264 146 274 138 Q 282 124 274 110 Q 264 96 248 96 Z" fill={C_T.blue} fillOpacity="0.06"/>
      {/* Papua */}
      <path d="M 318 132 Q 308 154 322 174 Q 348 188 374 178 Q 388 162 380 144 Q 360 128 340 130 Q 328 130 318 132 Z" fill={C_T.blue} fillOpacity="0.06"/>
    </g>

    {/* Big checklist board */}
    <g>
      {/* board shadow */}
      <rect x="226" y="78" width="174" height="216" rx="8" fill={C_T.ink} opacity="0.06"/>
      {/* board */}
      <rect x="222" y="74" width="174" height="216" rx="8" fill="#fff" stroke={C_T.blue} strokeWidth="2"/>
      {/* clip top */}
      <rect x="294" y="64" width="40" height="22" rx="3" fill={C_T.blue}/>
      <rect x="306" y="60" width="16" height="6" rx="1" fill={C_T.blue}/>
      {/* checklist title underline */}
      <line x1="240" y1="108" x2="380" y2="108" stroke={C_T.coral} strokeWidth="2.5" strokeLinecap="round"/>
      <text x="240" y="100" fontFamily="Vollkorn, serif" fontSize="14" fontWeight="700" fill={C_T.blue}>Janji Politisi</text>

      {/* checklist items */}
      {[
        { y: 130, status: 'done', text: 'Tarif transportasi' },
        { y: 158, status: 'done', text: 'Subsidi UMKM' },
        { y: 186, status: 'progress', text: 'Sekolah vokasi' },
        { y: 214, status: 'progress', text: 'Ruang hijau kota' },
        { y: 242, status: 'fail', text: 'BBM turun 30%' },
        { y: 270, status: 'pending', text: 'Beasiswa pemuda' },
      ].map((item, i) => (
        <g key={i}>
          {/* checkbox */}
          <rect x="240" y={item.y - 10} width="16" height="16" rx="3" fill="#fff"
                stroke={item.status === 'done' ? C_T.mint : item.status === 'progress' ? C_T.marigold : item.status === 'fail' ? C_T.red : C_T.line}
                strokeWidth="2"/>
          {item.status === 'done' && (
            <path d={`M 244 ${item.y - 2} L 247 ${item.y + 1} L 252 ${item.y - 5}`} stroke={C_T.mint} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          )}
          {item.status === 'progress' && (
            <circle cx="248" cy={item.y - 2} r="3" fill={C_T.marigold}/>
          )}
          {item.status === 'fail' && (
            <g stroke={C_T.red} strokeWidth="2" strokeLinecap="round">
              <line x1="244" y1={item.y - 6} x2="252" y2={item.y + 2}/>
              <line x1="252" y1={item.y - 6} x2="244" y2={item.y + 2}/>
            </g>
          )}
          {/* text line */}
          <line x1="266" y1={item.y - 1} x2="380" y2={item.y - 1} stroke={C_T.line} strokeWidth="1"
                strokeDasharray={item.status === 'pending' ? '3,2' : ''}/>
          <text x="266" y={item.y - 3} fontFamily="Inter, sans-serif" fontSize="10" fill={C_T.ink}
                opacity={item.status === 'pending' ? 0.4 : 0.85}
                textDecoration={item.status === 'fail' ? 'line-through' : 'none'}>
            {item.text}
          </text>
        </g>
      ))}
    </g>

    {/* Person — standing in front, holding pencil pointing to board */}
    <g transform="translate(70, 110)">
      {/* shadow under feet */}
      <ellipse cx="58" cy="200" rx="44" ry="6" fill={C_T.ink} opacity="0.08"/>

      {/* legs */}
      <path d="M 44 154 L 38 198 L 50 200 L 56 162 Z" fill={C_T.blue}/>
      <path d="M 64 154 L 70 198 L 82 200 L 78 162 Z" fill={C_T.blue}/>
      {/* shoes */}
      <ellipse cx="44" cy="202" rx="12" ry="4" fill={C_T.ink}/>
      <ellipse cx="76" cy="202" rx="12" ry="4" fill={C_T.ink}/>

      {/* torso — kemeja batik with stripe pattern */}
      <path d="M 30 84 Q 28 110 32 154 L 88 154 Q 92 110 90 84 Q 80 76 60 76 Q 40 76 30 84 Z" fill={C_T.cream} stroke={C_T.blue} strokeWidth="1.5"/>
      {/* batik stripe motif */}
      <g stroke={C_T.coral} strokeWidth="1" fill="none" opacity="0.7">
        <path d="M 36 96 Q 44 100 52 96 T 68 96 T 84 96"/>
        <path d="M 36 110 Q 44 114 52 110 T 68 110 T 84 110"/>
        <path d="M 36 124 Q 44 128 52 124 T 68 124 T 84 124"/>
        <path d="M 36 138 Q 44 142 52 138 T 68 138 T 84 138"/>
      </g>

      {/* arm pointing right toward board (with pencil) */}
      <path d="M 86 92 Q 110 98 134 88 Q 138 92 134 96 Q 112 108 86 102 Z" fill={C_T.cream} stroke={C_T.blue} strokeWidth="1.5"/>
      {/* pencil */}
      <g transform="translate(132, 84) rotate(-12)">
        <rect x="0" y="0" width="22" height="6" fill={C_T.marigold}/>
        <polygon points="22,0 28,3 22,6" fill={C_T.ink}/>
        <rect x="-4" y="0" width="4" height="6" fill={C_T.coral}/>
      </g>

      {/* arm down — left side */}
      <path d="M 30 90 Q 22 110 24 134 Q 30 138 34 134 Q 36 110 38 92 Z" fill={C_T.cream} stroke={C_T.blue} strokeWidth="1.5"/>

      {/* neck */}
      <rect x="54" y="68" width="14" height="14" fill={C_T.cream} stroke={C_T.blue} strokeWidth="1.5"/>

      {/* head */}
      <circle cx="61" cy="46" r="26" fill={C_T.cream} stroke={C_T.blue} strokeWidth="1.5"/>
      {/* hair */}
      <path d="M 38 38 Q 36 22 50 16 Q 64 10 78 18 Q 88 26 84 42 Q 78 32 68 30 Q 56 30 48 36 Q 42 38 38 38 Z" fill={C_T.ink}/>
      {/* eyes */}
      <circle cx="52" cy="46" r="1.8" fill={C_T.ink}/>
      <circle cx="70" cy="46" r="1.8" fill={C_T.ink}/>
      {/* eyebrows — focused */}
      <path d="M 48 41 Q 52 39 56 41" stroke={C_T.ink} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <path d="M 66 41 Q 70 39 74 41" stroke={C_T.ink} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      {/* mouth — slight smile, determined */}
      <path d="M 56 56 Q 61 59 66 56" stroke={C_T.ink} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    </g>

    {/* Caveat annotation */}
    <text x="148" y="68" fontFamily="Caveat, cursive" fontSize="20" fill={C_T.coral} transform="rotate(-3 148 68)">
      kita catat semua →
    </text>
  </svg>
);

// 2. PETA INDONESIA INTERAKTIF
const PetaJanjiIndonesia = ({ provinces, activeFilter, onProvinceClick }) => {
  const colorFor = (pct) => pct >= 50 ? C_T.mint : pct >= 25 ? C_T.marigold : C_T.coral;

  return (
    <svg viewBox="0 0 880 320" width="100%" role="img" aria-label="Peta Indonesia interaktif — % janji ditepati per provinsi">
      <defs>
        <pattern id="pj-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="0.8" fill={C_T.line}/>
        </pattern>
      </defs>
      <rect x="0" y="0" width="880" height="320" fill="url(#pj-dots)" opacity="0.4"/>

      {/* All other islands — faded outline (decorative, non-MVP) */}
      <g stroke={C_T.line} strokeWidth="1.5" fill={C_T.cream} fillOpacity="0.5" strokeLinejoin="round">
        {/* Aceh / north Sumatera tip */}
        <path d="M 60 90 Q 50 102 56 118 L 70 116 Q 76 102 70 92 Q 64 88 60 90 Z"/>
        {/* Sumatera south */}
        <path d="M 110 158 Q 122 178 144 192 Q 156 196 168 192 Q 174 184 168 174 Q 156 168 142 162 Q 124 156 110 158 Z"/>
        {/* Bali / NTB / NTT */}
        <path d="M 502 234 Q 514 230 524 234 L 520 240 Q 510 242 500 240 Z"/>
        <path d="M 540 232 Q 558 228 578 232 L 572 240 Q 552 244 538 240 Z"/>
        <path d="M 590 230 Q 624 228 658 234 L 654 244 Q 620 248 590 244 Z"/>
        {/* Maluku */}
        <path d="M 700 158 Q 712 154 720 162 L 716 174 Q 706 174 700 168 Z"/>
        <path d="M 720 198 Q 734 196 740 204 L 734 212 Q 724 212 720 206 Z"/>
      </g>

      {/* MVP PROVINCES — interactive, color-coded */}
      {provinces.map((p) => {
        const isActive = activeFilter === p.id;
        const fillColor = colorFor(p.pct);
        return (
          <g key={p.id} style={{ cursor: 'pointer' }} onClick={() => onProvinceClick(p.id)}>
            <title>{`${p.label} — ${p.pct}% ditepati · ${p.count} janji`}</title>
            <path d={p.d} fill={fillColor} fillOpacity={isActive ? 1 : 0.78}
                  stroke={isActive ? C_T.blue : '#fff'} strokeWidth={isActive ? 2.5 : 1.5} strokeLinejoin="round"/>
            {/* label callout */}
            <g transform={`translate(${p.lx}, ${p.ly})`}>
              <line x1="0" y1="0" x2={p.lineX} y2={p.lineY} stroke={C_T.ink} strokeWidth="0.8" opacity="0.4"/>
              <rect x={p.lineX - 4} y={p.lineY - 14} width={p.label.length * 5.6 + 38} height="20" rx="3"
                    fill="#fff" stroke={C_T.line} strokeWidth="1"/>
              <text x={p.lineX} y={p.lineY - 1} fontFamily="Inter,sans-serif" fontSize="10" fontWeight="600" fill={C_T.blue}>
                {p.label}
              </text>
              <text x={p.lineX + p.label.length * 5.6 + 4} y={p.lineY - 1} fontFamily="Fira Code,monospace" fontSize="10" fontWeight="600" fill={fillColor}>
                {p.pct}%
              </text>
            </g>
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(20, 270)">
        <text x="0" y="0" fontFamily="Inter,sans-serif" fontSize="10" fontWeight="600" fill={C_T.muted || '#7C7669'} letterSpacing="0.08em">% JANJI DITEPATI</text>
        {[
          { c: C_T.coral, l: '< 25%' },
          { c: C_T.marigold, l: '25–50%' },
          { c: C_T.mint, l: '> 50%' },
        ].map((it, i) => (
          <g key={i} transform={`translate(${i * 110}, 14)`}>
            <rect x="0" y="0" width="14" height="14" rx="3" fill={it.c}/>
            <text x="20" y="11" fontFamily="Inter,sans-serif" fontSize="11" fill={C_T.ink}>{it.l}</text>
          </g>
        ))}
      </g>

      <text x="780" y="296" fontFamily="Caveat,cursive" fontSize="16" fill={C_T.coral} textAnchor="end" transform="rotate(-2 780 296)">
        klik provinsi untuk filter →
      </text>
    </svg>
  );
};

// 3. TANGAN MENULIS (submit CTA strip)
const TanganMenulisIllustration = ({ width = 200 }) => (
  <svg viewBox="0 0 200 160" width={width} role="img" aria-label="Tangan menulis di kertas">
    {/* paper sheet */}
    <g transform="rotate(-4 100 90)">
      <rect x="32" y="44" width="140" height="100" rx="4" fill="#fff" stroke={C_T.blue} strokeWidth="1.5"/>
      {/* paper lines */}
      {[60, 76, 92, 108, 124].map((y, i) => (
        <line key={i} x1="44" y1={y} x2="160" y2={y} stroke={C_T.line} strokeWidth="1"/>
      ))}
      {/* squiggle handwriting */}
      <path d="M 48 64 Q 56 60 64 64 T 80 64 T 96 64" stroke={C_T.ink} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <path d="M 48 80 Q 60 76 70 80 T 88 80 T 110 80 T 124 80" stroke={C_T.ink} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    </g>

    {/* hand + pencil */}
    <g>
      {/* sleeve */}
      <path d="M 110 138 Q 130 142 154 134 Q 168 130 178 120 L 184 130 Q 174 144 156 152 Q 130 158 108 152 Z" fill={C_T.blue}/>
      {/* hand */}
      <path d="M 116 122 Q 130 118 144 116 Q 152 114 158 110 Q 162 108 164 112 Q 162 118 156 122 Q 148 126 138 128 Q 124 130 116 128 Q 112 124 116 122 Z" fill={C_T.cream} stroke={C_T.blue} strokeWidth="1.4"/>
      {/* fingers detail */}
      <path d="M 132 122 Q 134 126 132 128" stroke={C_T.blue} strokeWidth="1" fill="none"/>
      <path d="M 142 120 Q 144 124 142 126" stroke={C_T.blue} strokeWidth="1" fill="none"/>
      {/* pencil grip */}
      <g transform="translate(116, 100) rotate(28)">
        <rect x="0" y="0" width="44" height="6" fill={C_T.marigold}/>
        <rect x="-8" y="0" width="8" height="6" fill={C_T.coral}/>
        <polygon points="44,0 52,3 44,6" fill={C_T.ink}/>
        <polygon points="44,2 50,3 44,4" fill={C_T.cream}/>
      </g>
    </g>

    {/* Caveat annotation */}
    <text x="20" y="28" fontFamily="Caveat,cursive" fontSize="18" fill={C_T.coral} transform="rotate(-4 20 28)">
      catat janjinya!
    </text>
  </svg>
);

window.TagihHeroScene = TagihHeroScene;
window.PetaJanjiIndonesia = PetaJanjiIndonesia;
window.TanganMenulisIllustration = TanganMenulisIllustration;

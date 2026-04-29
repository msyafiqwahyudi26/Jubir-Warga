// NALA — Mascot SVG + PageNala (full destination page)

const { useState: useNState } = React;
const CN = window.C;
const { Pill: NPill, Button: NBtn, UserAvatar: NAvatar } = window;

// ── Nala Mascot SVG (claymorphism beo, 5 ekspresi) ───────
function NalaMascot({ expression = 'curious', size = 120 }) {
  // Body palette
  const bodyMain = '#1A2256';
  const bodyHi   = '#2D3A78';
  const belly    = '#FFFAEE';
  const beak     = '#F2B137';
  const beakDark = '#C8881A';
  const crest    = '#E8632B';
  const wing     = '#0F1740';
  const eyeWhite = '#FFFFFF';
  const eyeIris  = '#1A2256';

  // Per-expression tweaks (eyes always paired)
  const ex = {
    curious:   { headTilt: -3, crestTilt: 0,  eyeOpen: 1.0, beakOpen: false, mouth: null },
    excited:   { headTilt: -3, crestTilt: 8,  eyeOpen: 1.1, beakOpen: true,  mouth: null,    sparkle: true },
    mentor:    { headTilt:  0, crestTilt: 0,  eyeOpen: 0.7, beakOpen: false, mouth: 'smile', brow: true },
    thinking:  { headTilt: -8, crestTilt: -2, eyeOpen: 0.9, beakOpen: false, mouth: null },
    confident: { headTilt:  0, crestTilt: 5,  eyeOpen: 0.9, beakOpen: false, mouth: 'smile' },
  }[expression] || { headTilt: -3, crestTilt: 0, eyeOpen: 1.0, beakOpen: false };

  const eyeR = 7.5;
  const pupilR = 3.6 * ex.eyeOpen;
  const sid = expression; // unique gradient id per instance to avoid collision when multiple Nala in DOM

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      style={{ display: 'block' }}
      aria-label={`Nala — ${expression}`}
    >
      <defs>
        <radialGradient id={`nala-bg-${sid}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%"   stopColor={bodyHi} />
          <stop offset="100%" stopColor={bodyMain} />
        </radialGradient>
        <radialGradient id={`nala-hg-${sid}`} cx="40%" cy="30%" r="60%">
          <stop offset="0%"   stopColor={bodyHi} />
          <stop offset="100%" stopColor={bodyMain} />
        </radialGradient>
        <radialGradient id={`nala-bk-${sid}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%"   stopColor={beak} />
          <stop offset="100%" stopColor={beakDark} />
        </radialGradient>
        <filter id={`nala-ds-${sid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="3" stdDeviation="2" floodColor="#1A2256" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Soft ground shadow */}
      <ellipse cx="60" cy="108" rx="28" ry="3" fill="#1A2256" opacity="0.15" />

      <g transform={`rotate(${ex.headTilt} 60 50)`} filter={`url(#nala-ds-${sid})`}>
        {/* Body */}
        <ellipse cx="60" cy="78" rx="28" ry="22" fill={`url(#nala-bg-${sid})`} />
        <ellipse cx="60" cy="82" rx="18" ry="15" fill={belly} opacity="0.95" />
        {/* Wings */}
        <ellipse cx="36" cy="76" rx="9" ry="14" fill={wing} transform="rotate(-12 36 76)" />
        <ellipse cx="84" cy="76" rx="9" ry="14" fill={wing} transform="rotate(12 84 76)" />

        {/* Head */}
        <ellipse cx="60" cy="42" rx="24" ry="22" fill={`url(#nala-hg-${sid})`} />

        {/* Crest (jambul coral) */}
        <g transform={`translate(60 18) rotate(${ex.crestTilt})`}>
          <ellipse cx="0"  cy="0"  rx="5"   ry="8" fill={crest} />
          <ellipse cx="-4" cy="-2" rx="2.5" ry="5" fill={crest} opacity="0.7" />
        </g>

        {/* LEFT eye (cx=50) */}
        <ellipse cx="50" cy="36" rx={eyeR} ry={eyeR} fill={eyeWhite} />
        <ellipse cx="51" cy="36.5" rx={pupilR} ry={pupilR} fill={eyeIris} />
        <circle  cx="52.5" cy="35" r="1.4" fill={eyeWhite} />
        {ex.sparkle && <circle cx="49" cy="34" r="1" fill={eyeWhite} opacity="0.9" />}

        {/* RIGHT eye (cx=70) */}
        <ellipse cx="70" cy="36" rx={eyeR} ry={eyeR} fill={eyeWhite} />
        <ellipse cx="71" cy="36.5" rx={pupilR} ry={pupilR} fill={eyeIris} />
        <circle  cx="72.5" cy="35" r="1.4" fill={eyeWhite} />
        {ex.sparkle && <circle cx="69" cy="34" r="1" fill={eyeWhite} opacity="0.9" />}

        {/* Brow (mentor only) */}
        {ex.brow && (
          <>
            <path d="M44 28 Q50 24 56 27" stroke={bodyMain} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M64 27 Q70 24 76 28" stroke={bodyMain} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </>
        )}

        {/* Beak (heart-curve di tengah) */}
        {ex.beakOpen ? (
          <g>
            <path d="M52 48 Q60 54 68 48 Q60 56 52 48 Z" fill={`url(#nala-bk-${sid})`} />
            <path d="M52 52 Q60 60 68 52 Q60 64 52 52 Z" fill={beakDark} opacity="0.7" />
          </g>
        ) : (
          <path d="M52 50 Q60 56 68 50 Q60 62 52 50 Z" fill={`url(#nala-bk-${sid})`} />
        )}

        {/* Smile (confident/mentor) */}
        {ex.mouth === 'smile' && (
          <path d="M55 64 Q60 67 65 64" stroke={bodyMain} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
        )}
      </g>

      {/* Sparkle stars (excited extra) */}
      {ex.sparkle && (
        <>
          <text x="92" y="28" fontSize="10" fill={crest}>✦</text>
          <text x="22" y="32" fontSize="8" fill={beak}>✦</text>
        </>
      )}
    </svg>
  );
}

// ── PageNala — full destination page ──────────────────────
const NALA_MODES = [
  {
    id: 'tanya',
    title: 'Tanya Nala',
    sub: 'general explainer',
    desc: 'Bingung soal isu, UU, mental health, kerja toxic? Tanya aja.',
    expr: 'curious',
  },
  {
    id: 'coach',
    title: 'Coach Kelas',
    sub: 'tutor personal',
    desc: 'Lagi ikut kelas? Aku bantu cek pemahaman & jelaskan ulang.',
    expr: 'mentor',
  },
  {
    id: 'writing',
    title: 'Writing Partner',
    sub: 'editor & fact-check',
    desc: 'Lagi nulis opini, caption, atau cerita? Aku bantu draft, edit, fact-check.',
    expr: 'thinking',
  },
  {
    id: 'advocacy',
    title: 'Advocacy Assistant',
    sub: 'draft surat & talking points',
    desc: 'Mau advokasi? Aku bantu draft surat, talking points, action plan.',
    expr: 'confident',
  },
];

const SUGGESTED_PROMPTS = [
  'Jelaskan Pasal 28E secara santai',
  'Curhat dong soal kerja kantor toxic',
  'Bantu draft caption IG buat gerakan',
  'Apa beda DPR sama DPRD?',
  'Ringkas thread terbaru di forum',
  'Cek apakah opini saya kuat secara logika',
  'Bantu pahami janji menteri kesehatan baru',
  'Beri saya 5 fakta soal subsidi BBM 2026',
  'Mood lagi anjlok, ada saran ringan?',
  'Rekomendasi film/buku soal demokrasi',
];

const RECENT_CHATS = [
  { id: 1, title: 'Soal RUU PPRT yang mandek', time: '2j', mode: 'Tanya' },
  { id: 2, title: 'Edit opini anak muda apatis', time: '1h', mode: 'Writing' },
  { id: 3, title: 'Draft surat ke DPRD soal parkir', time: '2h', mode: 'Advocacy' },
];

const ETIKA_PRINSIP = [
  '"Aku bukan Tuhan. Kadang aku salah, kadang aku tidak tahu. Kalau aku tidak yakin, aku akan bilang."',
  '"Obrolanmu tidak aku simpan kecuali kamu save eksplisit. Tidak aku pakai untuk training."',
  '"Aku tidak partisan — tidak endorse partai/kandidat manapun. Aku akan kasih sumber kalau aku claim sesuatu."',
];

function PageNala({ onNavigate }) {
  const [hoveredMode, setHoveredMode] = useNState('curious');

  return (
    <div>
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden border-b"
        style={{ background: `linear-gradient(135deg, ${CN.blue} 0%, #2A348A 100%)`, borderColor: CN.line }}
      >
        <div className="max-w-6xl mx-auto px-6 py-14 md:py-20 grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Mascot */}
          <div className="flex justify-center md:justify-start">
            <div className="relative">
              <NalaMascot expression={hoveredMode} size={280} />
              <span
                className="absolute -top-2 -right-4 font-hand text-2xl"
                style={{ color: CN.marigold, transform: 'rotate(-6deg)' }}
              >hai!</span>
            </div>
          </div>

          {/* Right: Copy */}
          <div>
            <span className="font-hand text-lg" style={{ color: CN.marigold }}>AI Companion</span>
            <h1
              className="font-display font-bold mt-2 leading-tight"
              style={{ color: CN.cream, fontSize: 'clamp(36px,5vw,56px)' }}
            >
              Halo, aku <em>Nala.</em>
            </h1>
            <p className="mt-4 text-lg leading-relaxed" style={{ color: 'rgba(255,250,238,0.8)' }}>
              Sahabat anak muda yang ngerti banyak hal. Dari Pasal 28E sampai mental health,
              dari draft caption IG sampai talking points advokasi.
            </p>
            <p className="mt-3 text-base font-hand" style={{ color: CN.marigold }}>
              Pilih salah satu mode di bawah, atau langsung mulai chat →
            </p>
          </div>
        </div>
      </section>

      {/* ── 4 MODE CARDS ── */}
      <section className="py-12 border-b" style={{ borderColor: CN.line }}>
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="font-display text-xl font-bold mb-6" style={{ color: CN.blue }}>
            4 mode Nala — pilih sesuai kebutuhanmu
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {NALA_MODES.map((m) => (
              <button
                key={m.id}
                onMouseEnter={() => setHoveredMode(m.expr)}
                onMouseLeave={() => setHoveredMode('curious')}
                onClick={() => onNavigate('nala-chat')}
                className="text-left p-5 rounded-2xl border card-lift cursor-pointer relative"
                style={{ borderColor: CN.line, background: '#fff', minHeight: 220 }}
              >
                <div className="flex justify-center mb-4">
                  <NalaMascot expression={m.expr} size={70} />
                </div>
                <p className="text-xs uppercase tracking-wide font-bold" style={{ color: CN.coral }}>
                  {m.sub}
                </p>
                <h4 className="font-display font-bold text-lg mt-1" style={{ color: CN.blue }}>
                  {m.title}
                </h4>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: CN.ink + 'AA' }}>
                  {m.desc}
                </p>
                <span className="text-xs font-semibold mt-3 inline-block" style={{ color: CN.coral }}>
                  Mulai →
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUGGESTED PROMPTS ── */}
      <section className="py-12 border-b" style={{ borderColor: CN.line }}>
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="font-display text-xl font-bold mb-2" style={{ color: CN.blue }}>
            Bingung mulai dari mana?
          </h3>
          <p className="text-sm mb-6" style={{ color: CN.ink + '99' }}>
            Klik salah satu prompt di bawah untuk langsung mulai chat.
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => onNavigate('nala-chat')}
                className="px-4 py-2.5 rounded-full border text-sm transition-all hover:scale-[1.02]"
                style={{
                  borderColor: CN.line,
                  background: '#fff',
                  color: CN.ink,
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS KEPERCAYAAN ── */}
      <section className="py-12 border-b" style={{ borderColor: CN.line, background: CN.blue + '05' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="font-display text-xl font-bold mb-6" style={{ color: CN.blue }}>
            Stats kepercayaan minggu ini
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { big: '2.340', lbl: 'percakapan minggu ini', color: CN.blue },
              { big: '94%', lbl: 'rated helpful', color: CN.mint },
              { big: '186', lbl: 'isu terjelaskan', color: CN.marigold },
              { big: '<1%', lbl: 'flagged misleading', color: CN.coral },
            ].map((s, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border bg-white"
                style={{ borderColor: CN.line }}
              >
                <p className="font-mono font-bold text-3xl md:text-4xl" style={{ color: s.color }}>
                  {s.big}
                </p>
                <p className="text-xs mt-2 leading-tight" style={{ color: CN.ink + '99' }}>
                  {s.lbl}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ETIKA & PRIVACY ── */}
      <section className="py-12 border-b" style={{ borderColor: CN.line }}>
        <div className="max-w-4xl mx-auto px-6">
          <div
            className="rounded-3xl p-8 md:p-10 border-2"
            style={{ borderColor: CN.line, background: CN.cream }}
          >
            <div className="flex items-start gap-4 mb-6">
              <NalaMascot expression="mentor" size={80} />
              <div>
                <h3 className="font-display text-2xl font-bold" style={{ color: CN.blue }}>
                  Etika & Privacy
                </h3>
                <p className="text-sm mt-1" style={{ color: CN.ink + '99' }}>
                  Janji Nala buat kamu.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {ETIKA_PRINSIP.map((p, i) => (
                <p
                  key={i}
                  className="font-display italic text-base md:text-lg leading-relaxed pl-4 border-l-2"
                  style={{ color: CN.ink, borderColor: CN.coral }}
                >
                  {p}
                </p>
              ))}
            </div>
            <button
              className="mt-6 text-sm font-semibold"
              style={{ color: CN.coral }}
            >
              Baca etika lengkap →
            </button>
          </div>
        </div>
      </section>

      {/* ── RECENT CHATS ── */}
      <section className="py-12 border-b" style={{ borderColor: CN.line }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl font-bold" style={{ color: CN.blue }}>
              Chat terakhir kamu
            </h3>
            <button className="text-sm" style={{ color: CN.coral }}>Lihat semua →</button>
          </div>
          <div className="space-y-2">
            {RECENT_CHATS.map((c) => (
              <button
                key={c.id}
                className="w-full p-4 rounded-xl border bg-white text-left card-lift"
                style={{ borderColor: CN.line }}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate" style={{ color: CN.blue }}>
                      {c.title}
                    </p>
                    <p className="text-xs mt-1" style={{ color: CN.ink + '66' }}>
                      Mode: {c.mode} · {c.time} lalu
                    </p>
                  </div>
                  <span style={{ color: CN.coral }}>→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16" style={{ background: CN.blue }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <NalaMascot expression="excited" size={140} />
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-4 mb-3" style={{ color: CN.cream }}>
            Siap ngobrol?
          </h2>
          <p className="text-base mb-6" style={{ color: CN.cream + '99' }}>
            Mulai chat baru — gratis, sampai 20 prompt/hari di tier free.
          </p>
          <NBtn variant="coral" size="lg" onClick={() => onNavigate('nala-chat')}>
            Mulai chat baru →
          </NBtn>
        </div>
      </section>
    </div>
  );
}

// ── Export ────────────────────────────────────────────────
Object.assign(window, { NalaMascot, PageNala });

// PAGE: PROFIL — Paspor Warga Digital (4-page flip)

const { useState: useProfState } = React;
const CP = window.C;
const { Pill: PPill, Button: PBtn, UserAvatar: PAvatar, ProgressBar: PProgress, StatBlock: PStatBlock, NavTabs: PTabs } = window;

// ── Paspor 4-page flip component ──
function PasporFlip({ user, stamps, visa }) {
  const [page, setPage] = useProfState(0); // 0 = cover, 1 = identitas, 2 = stempel, 3 = visa, 4 = riwayat

  const pages = [
    { id: 'cover',     label: 'Cover'     },
    { id: 'identitas', label: 'Identitas' },
    { id: 'stempel',   label: 'Stempel'   },
    { id: 'visa',      label: 'Visa'      },
  ];

  return (
    <div>
      {/* Page tabs */}
      <div className="flex gap-2 mb-3 justify-center">
        {pages.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setPage(i)}
            className="px-3 py-1 rounded-full text-xs font-medium transition-all"
            style={{
              background: page === i ? CP.blue : 'transparent',
              color:      page === i ? CP.cream : CP.ink + '99',
              border: `1px solid ${page === i ? CP.blue : CP.line}`,
            }}
          >{p.label}</button>
        ))}
      </div>

      {/* Paspor frame */}
      <div
        className="mx-auto rounded-2xl overflow-hidden relative"
        style={{
          maxWidth: 480,
          aspectRatio: '5 / 7',
          background: page === 0 ? CP.blue : CP.cream,
          boxShadow: '0 12px 32px rgba(26,34,86,0.2)',
          border: `2px solid ${page === 0 ? CP.blue : CP.line}`,
          transition: 'all 0.4s ease',
        }}
      >
        {/* COVER */}
        {page === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="text-xs uppercase tracking-[6px] font-bold mb-4" style={{ color: CP.coral }}>PASPOR WARGA</div>
            <h2 className="font-display text-5xl font-bold italic" style={{ color: CP.cream }}>Jubir Warga</h2>
            <svg viewBox="0 0 90 7" width="120" height="9" className="my-3">
              <path d="M2,5 Q22,1 45,4 Q68,7 88,3" stroke={CP.coral} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
            {/* Crest */}
            <div className="my-6">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke={CP.cream} strokeWidth="1.5" opacity="0.4" />
                <circle cx="40" cy="40" r="26" fill="none" stroke={CP.cream} strokeWidth="1" opacity="0.3" />
                <text x="40" y="48" textAnchor="middle" fontSize="32" fontFamily="serif" fontStyle="italic" fontWeight="700" fill={CP.cream}>JW</text>
              </svg>
            </div>
            <p className="font-mono text-xs mt-4" style={{ color: CP.cream + '99' }}>JW-2026-0001</p>
            <p className="font-display italic text-sm mt-2" style={{ color: CP.cream + '88' }}>Suara warga, rumahnya di sini.</p>
          </div>
        )}

        {/* IDENTITAS */}
        {page === 1 && (
          <div className="absolute inset-0 flex flex-col items-center p-8">
            <span className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: CP.coral }}>HAL. 1 — IDENTITAS</span>
            <PAvatar name={user.name} size="xl" level={user.level} />
            <h3 className="font-display text-2xl font-bold mt-3" style={{ color: CP.blue }}>{user.name}</h3>
            <p className="text-sm italic mt-1" style={{ color: CP.ink + '88' }}>"{user.tagline}"</p>
            <div className="mt-4 mb-4 px-3 py-1 rounded-full" style={{ background: CP.marigold + '33', color: CP.ink }}>
              <span className="text-xs font-bold">Lv.{user.level} — {user.levelName}</span>
            </div>
            <div className="text-center text-xs" style={{ color: CP.ink + '77' }}>
              <p>📍 {user.kota} · {user.chapter}</p>
              <p>📅 Bergabung {user.joinDate}</p>
            </div>
            {/* QR */}
            <div className="mt-auto rounded-xl p-2 border" style={{ borderColor: CP.line }}>
              <svg width="60" height="60" viewBox="0 0 44 44">
                <rect x="2"  y="2"  width="14" height="14" rx="2" fill="none" stroke={CP.blue} strokeWidth="2"/>
                <rect x="5"  y="5"  width="8"  height="8"  rx="1" fill={CP.blue}/>
                <rect x="28" y="2"  width="14" height="14" rx="2" fill="none" stroke={CP.blue} strokeWidth="2"/>
                <rect x="31" y="5"  width="8"  height="8"  rx="1" fill={CP.blue}/>
                <rect x="2"  y="28" width="14" height="14" rx="2" fill="none" stroke={CP.blue} strokeWidth="2"/>
                <rect x="5"  y="31" width="8"  height="8"  rx="1" fill={CP.blue}/>
                {[20,24,28,32,36].map(x => [20,24,28,32,36].map(y => {
                  const v = (x * 7 + y * 11 + x * y) % 3 === 0;
                  return v ? <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" rx="0.5" fill={CP.blue} opacity=".65"/> : null;
                }))}
              </svg>
            </div>
            <p className="text-[10px] font-mono mt-2" style={{ color: CP.ink + '55' }}>Scan untuk profil publik</p>
          </div>
        )}

        {/* STEMPEL */}
        {page === 2 && (
          <div className="absolute inset-0 flex flex-col p-8">
            <span className="text-xs uppercase tracking-wider font-bold mb-3" style={{ color: CP.coral }}>HAL. 2 — STEMPEL</span>
            <p className="text-sm italic mb-4" style={{ color: CP.ink + '88' }}>Chapter & event yang sudah kamu kunjungi.</p>
            <div className="grid grid-cols-2 gap-3 flex-1 content-start">
              {stamps.map((s, i) => (
                <div
                  key={i}
                  className="rounded-lg p-3 text-center border-2"
                  style={{
                    borderColor: s.color,
                    transform: `rotate(${(i * 7 - 5) % 11}deg)`,
                    background: s.color + '10',
                  }}
                >
                  <p className="font-bold text-xs uppercase tracking-wide" style={{ color: s.color }}>{s.title}</p>
                  <p className="text-[10px] mt-1 font-mono" style={{ color: s.color + 'BB' }}>{s.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISA */}
        {page === 3 && (
          <div className="absolute inset-0 flex flex-col p-8">
            <span className="text-xs uppercase tracking-wider font-bold mb-3" style={{ color: CP.coral }}>HAL. 3 — VISA PILAR</span>
            <p className="text-sm italic mb-4" style={{ color: CP.ink + '88' }}>Pilar yang sudah kamu kuasai.</p>
            <div className="grid grid-cols-2 gap-3 flex-1 content-start">
              {visa.map((v, i) => (
                <div
                  key={i}
                  className="rounded-lg p-3 border-2 text-center"
                  style={{
                    borderColor: v.unlocked ? v.color : CP.line,
                    opacity: v.unlocked ? 1 : 0.4,
                    background: v.unlocked ? v.color + '10' : 'transparent',
                  }}
                >
                  <div className="text-xl font-mono font-bold" style={{ color: v.unlocked ? v.color : CP.ink + '55' }}>Lv.{v.level}</div>
                  <p className="font-bold text-xs mt-1" style={{ color: v.unlocked ? v.color : CP.ink + '55' }}>{v.title}</p>
                  <p className="text-[9px] mt-1" style={{ color: CP.ink + '77' }}>{v.req}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { PasporFlip });

const USER = {
  name:      'Aulia Pratiwi',
  tagline:   'Mahasiswi Bandung yang penasaran sama segala hal.',
  kota:      'Bandung',
  chapter:   'Bandung Raya',
  level:     3,
  levelName: 'Aktivis Mula',
  joinDate:  'Oktober 2024',
  stats: [
    { label:'Hari\nStreak',      value:'5'  },
    { label:'Kelas\nSelesai',    value:'2'  },
    { label:'Karya\nDisubmit',   value:'3'  },
    { label:'Vote\nPolling',     value:'12' },
    { label:'Petisi\nDitanda',   value:'4'  },
  ],
};

const MY_KARYA = [
  { type:'Tulisan',   title:'Kenapa Saya Akhirnya Mau Datang ke TPS',                              time:'2 minggu lalu', views:234  },
  { type:'Tulisan',   title:'Catatan dari Kelas Jubir Warga: 6 Minggu yang Mengubah Cara Pandang', time:'1 bulan lalu',  views:567  },
  { type:'Ilustrasi', title:'Poster: Hak Pilihmu Bukan Hak Orang Lain',                            time:'2 bulan lalu',  views:890  },
];

const MY_KELAS = [
  { title:'Kelas Jubir Warga: dari Resah ke Suara ke Aksi',   progress:100, status:'Selesai'  },
  { title:'Social Marketing & Fundraising untuk Gerakan',      progress:65,  status:'Berjalan' },
  { title:'Youth Political Participation in the Digital Age',  progress:30,  status:'Berjalan' },
];

const AKTIVITAS = [
  { icon:'🗳️', desc:'Vote di polling "Alihkan Subsidi BBM ke transportasi publik"', time:'2 jam lalu'    },
  { icon:'💬', desc:'Komentar di thread "RUU PPRT, kenapa mandek terus?"',           time:'5 jam lalu'    },
  { icon:'✍️', desc:'Tanda tangan petisi "Kembalikan Jam KRL 04.00 WIB"',           time:'1 hari lalu'   },
  { icon:'📚', desc:'Selesaikan modul 4 — Kelas Jubir Warga',                       time:'2 hari lalu'   },
  { icon:'📝', desc:'Upload karya "Catatan dari Kelas Jubir Warga"',                time:'1 bulan lalu'  },
  { icon:'🌱', desc:'Bergabung di Jubir Warga untuk pertama kalinya',               time:'Oktober 2024'  },
];

const MY_BADGES = [
  { name:'Warga Baru',   icon:'🌱', on:true  },
  { name:'Tebak 3 Hari', icon:'🔥', on:true  },
  { name:'Aktivis Mula', icon:'✍️', on:true  },
  { name:'Penulis',      icon:'✏️', on:false },
  { name:'Forum Star',   icon:'⭐', on:false },
  { name:'Scholar',      icon:'🎓', on:false },
];

const TAB_ITEMS = [
  { id:'karya',     label:'Karya Saya'  },
  { id:'kelas',     label:'Kelas Saya'  },
  { id:'aktivitas', label:'Aktivitas'   },
  { id:'badge',     label:'Badge'       },
];

const TYPE_PILL = { Tulisan:'blue', Ilustrasi:'mint', Vlog:'coral' };

function PageProfil({ onNavigate }) {
  const [tab, setTab] = useProfState('karya');

  // Tiny QR-like SVG
  const QR = () => (
    <svg width="44" height="44" viewBox="0 0 44 44">
      {/* position squares */}
      <rect x="2"  y="2"  width="14" height="14" rx="2" fill="none" stroke={CP.blue} strokeWidth="2"/>
      <rect x="5"  y="5"  width="8"  height="8"  rx="1" fill={CP.blue}/>
      <rect x="28" y="2"  width="14" height="14" rx="2" fill="none" stroke={CP.blue} strokeWidth="2"/>
      <rect x="31" y="5"  width="8"  height="8"  rx="1" fill={CP.blue}/>
      <rect x="2"  y="28" width="14" height="14" rx="2" fill="none" stroke={CP.blue} strokeWidth="2"/>
      <rect x="5"  y="31" width="8"  height="8"  rx="1" fill={CP.blue}/>
      {/* data dots */}
      {[20,24,28,32,36].map(x => [20,24,28,32,36].map(y => {
        const v = (x * 7 + y * 11 + x * y) % 3 === 0;
        return v ? <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" rx="0.5" fill={CP.blue} opacity=".65"/> : null;
      }))}
    </svg>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 pb-24">

      {/* ── PASPOR WARGA (4-page flip) ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="font-display text-2xl font-bold" style={{ color: CP.blue }}>Paspor Warga Digital</h2>
          <PBtn variant="outline" size="sm">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            Bagikan paspor
          </PBtn>
        </div>
        {window.PasporFlip && <window.PasporFlip
          user={USER}
          stamps={[
            { title: 'Jakarta', date: '18 MAR 2026', color: CP.blue },
            { title: 'Bandung Raya', date: '5 APR 2026', color: CP.coral },
            { title: 'Lulus Kelas Jubir', date: '12 FEB 2026', color: CP.mint },
            { title: 'Kampanye Literasi', date: '22 JAN 2026', color: CP.marigold },
          ]}
          visa={[
            { title: 'Komunitas', level: 1, req: 'unlocked', color: CP.mint, unlocked: true },
            { title: 'Karya', level: 2, req: '5 karya · ✓', color: CP.coral, unlocked: true },
            { title: 'Aksi', level: 3, req: '10 aksi · ✓', color: CP.marigold, unlocked: true },
            { title: 'Tagih Janji', level: 0, req: 'butuh 3 evidence', color: CP.blue, unlocked: false },
          ]}
        />}
      </div>

      {/* ── Stats ── */}
      <div
        className="flex flex-wrap gap-6 justify-around p-5 rounded-2xl border mb-8"
        style={{ borderColor: CP.line, background: '#fff' }}
      >
        {USER.stats.map((s, i) => <PStatBlock key={i} label={s.label.replace('\n',' ')} value={s.value} />)}
      </div>

      {/* ── Tabs ── */}
      <PTabs items={TAB_ITEMS} active={tab} onChange={setTab} className="mb-6" />

      {/* ── Karya ── */}
      {tab === 'karya' && (
        <div className="space-y-3">
          {MY_KARYA.map((k, i) => (
            <div key={i}
              className="flex items-center gap-4 p-4 rounded-2xl border bg-white"
              style={{ borderColor: CP.line }}>
              <PPill color={TYPE_PILL[k.type]||'blue'}>{k.type}</PPill>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-sm clamp2" style={{ color: CP.ink }}>{k.title}</p>
                <p className="text-xs mt-0.5" style={{ color: CP.ink+'55' }}>{k.time} · 👁 {k.views}</p>
              </div>
            </div>
          ))}
          <PBtn variant="coral" size="sm" className="mt-2">
            + Upload Karya Baru
          </PBtn>
        </div>
      )}

      {/* ── Kelas ── */}
      {tab === 'kelas' && (
        <div className="space-y-3">
          {MY_KELAS.map((k, i) => (
            <div key={i} className="p-4 rounded-2xl border bg-white" style={{ borderColor: CP.line }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-display font-semibold text-sm" style={{ color: CP.ink }}>{k.title}</p>
                <PPill color={k.status==='Selesai'?'mint':'marigold'}>{k.status}</PPill>
              </div>
              <PProgress
                percent={k.progress}
                colorKey={k.status==='Selesai'?'mint':'coral'}
              />
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-xs" style={{ color: CP.ink+'55' }}>{k.progress}%</span>
                {k.status !== 'Selesai' && (
                  <PBtn variant="ghost" size="sm" onClick={() => onNavigate('kelas')}>
                    Lanjutkan →
                  </PBtn>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Aktivitas ── */}
      {tab === 'aktivitas' && (
        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-5 top-0 bottom-0 w-px"
            style={{ background: CP.line }}
          />
          <div className="space-y-1">
            {AKTIVITAS.map((a, i) => (
              <div key={i} className="flex items-start gap-4 py-3 pl-2">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm z-10"
                  style={{ background: CP.cream, border: `2px solid ${CP.line}` }}
                >
                  {a.icon}
                </div>
                <div className="flex-1 pt-0.5">
                  <p className="text-sm leading-snug" style={{ color: CP.ink+'99' }}>{a.desc}</p>
                  <p className="text-xs mt-0.5" style={{ color: CP.ink+'44' }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Badge ── */}
      {tab === 'badge' && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {MY_BADGES.map((b, i) => (
            <div key={i}
              className="p-3 rounded-xl border text-center"
              style={{
                borderColor: b.on ? CP.marigold+'66' : CP.line,
                background:  b.on ? '#fff' : CP.line+'44',
                opacity:     b.on ? 1 : .5,
              }}>
              <div
                className={b.on ? 'badge-glow' : ''}
                style={{ fontSize: 28, marginBottom: 4, filter: b.on ? 'none' : 'grayscale(1)' }}
              >{b.icon}</div>
              <div className="font-semibold" style={{ fontSize: 10, color: CP.blue }}>{b.name}</div>
            </div>
          ))}
          <div
            className="p-3 rounded-xl border text-center col-span-full text-sm mt-2"
            style={{ borderColor: CP.line, color: CP.ink+'55' }}
          >
            Kumpulkan lebih banyak badge dengan berpartisipasi aktif di Jubir Warga.{' '}
            <button style={{ color: CP.coral }} onClick={() => onNavigate('main')}>
              Lihat semua badge →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { PageProfil });

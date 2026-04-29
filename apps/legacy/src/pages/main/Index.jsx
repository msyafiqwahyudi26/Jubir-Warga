// PAGE: MAIN — Games hub + Citizen Wordle

const { useState: useMainState } = React;
const CM = window.C;
const { Pill: MPill, Button: MBtn, UserAvatar: MAvatar } = window;

const GAMES = [
  { id:'tebak',    title:'Tebak Pasal',        desc:'Cocokkan kutipan UU dengan pasalnya',    icon:'⚖️',  soon:true  },
  { id:'janji',    title:'Janji vs Realita',    desc:'Drag & match janji politik',             icon:'🤝',  soon:true  },
  { id:'tts',      title:'TTS Demokrasi',       desc:'Crossword 7×7 tema demokrasi',           icon:'✏️',  soon:true  },
  { id:'pop',      title:'Pop or Politics?',    desc:'Judul lagu/film vs judul kebijakan',     icon:'🎬',  soon:true  },
  { id:'quiz',     title:'Quiz Sejarah Pemilu', desc:'5 soal pilihan ganda sejarah pemilu',    icon:'📜',  soon:true  },
  { id:'bingo',    title:'Bingo Komunitas',     desc:'Interactive bingo card',                 icon:'🎯',  soon:true  },
  { id:'hoaks',    title:'Spot the Hoaks',      desc:'5 headline, mana yang hoaks?',           icon:'🔍',  soon:true  },
];

const LEADERBOARD = [
  { name:'Sari Lestari',    chapter:'Jakarta',      score:2840, level:5 },
  { name:'Bilal Sukarno',   chapter:'Jakarta',      score:2710, level:6 },
  { name:'Kanta Widodo',    chapter:'Malang Raya',  score:2560, level:4 },
  { name:'Nadira Azzahra',  chapter:'Jakarta',      score:2340, level:4 },
  { name:'Reza Adipratama', chapter:'Surabaya',     score:2190, level:3 },
  { name:'Aulia Pratiwi',   chapter:'Bandung Raya', score:1980, level:3 },
  { name:'Pram Faisal',     chapter:'Surabaya',     score:1870, level:4 },
  { name:'Mei Chandra',     chapter:'Bandung Raya', score:1720, level:3 },
  { name:'Erik Kurniawan',  chapter:'Jakarta',      score:1640, level:7 },
  { name:'Putra Satria',    chapter:'Jakarta',      score:1590, level:5 },
];

const BADGES = [
  { name:'Warga Baru',     desc:'Bergabung',              icon:'🌱', on:true  },
  { name:'Tebak 3 Hari',   desc:'3-day Wordle streak',    icon:'🔥', on:true  },
  { name:'Aktivis Mula',   desc:'Tanda tangani 1 petisi', icon:'✍️', on:true  },
  { name:'Penulis',        desc:'Submit 1 karya',         icon:'✏️', on:false },
  { name:'Forum Star',     desc:'Thread 50+ balasan',     icon:'⭐', on:false },
  { name:'Civic Scholar',  desc:'Selesaikan 1 kelas',     icon:'🎓', on:false },
  { name:'Streak 7',       desc:'7 hari berturut',        icon:'🌟', on:false },
  { name:'Voter',          desc:'Vote di 10 polling',     icon:'🗳️', on:false },
  { name:'Penggerak',      desc:'Ajak 3 teman gabung',    icon:'🤝', on:false },
  { name:'Jubir Sejati',   desc:'Lulus kelas Jubir Warga',icon:'🏆', on:false },
  { name:'100 Aksi',       desc:'100 aksi selesai',       icon:'💯', on:false },
  { name:'OG Warga',       desc:'Bergabung sejak 2024',   icon:'👑', on:false },
];

const RANK_ICONS = ['🥇','🥈','🥉'];

function PageMain({ onNavigate }) {
  const [streak] = useMainState(5);

  return (
    <div>
      {/* Hero */}
      <section className="py-10 border-b" style={{ borderColor: CM.line }}>
        <div className="max-w-6xl mx-auto px-6 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display font-bold text-4xl md:text-5xl" style={{ color: CM.blue }}>Main</h1>
            <p className="mt-2 text-lg" style={{ color: CM.ink+'88' }}>Ringan, harian, tetap ada bobotnya.</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🔥</span>
              <span className="font-mono text-4xl font-bold" style={{ color: CM.coral }}>{streak}</span>
            </div>
            <p className="text-xs mt-1" style={{ color: CM.ink+'55' }}>hari berturut-turut</p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">

        {/* ── Game of the Day — Wordle embedded ── */}
        <div>
          <h3 className="font-display font-bold text-xl mb-4" style={{ color: CM.blue }}>🎮 Game Hari Ini</h3>
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: CM.blue+'44' }}>
            {/* Blue header strip */}
            <div className="px-6 pt-5 pb-3 flex items-center justify-between" style={{ background: CM.blue }}>
              <div>
                <h4 className="font-display text-xl font-bold text-white">Citizen Wordle</h4>
                <p className="text-sm mt-0.5" style={{ color: CM.cream+'77' }}>Kata civic 5 huruf · 6 percobaan</p>
              </div>
              <span
                className="font-hand text-sm"
                style={{ color: CM.cream+'44', transform:'rotate(1.5deg)', textAlign:'right' }}
              >← coba dulu,<br />baru ngomong</span>
            </div>
            {/* Wordle game */}
            <div style={{ background: CM.cream }}>
              <CitizenWordle onOpenPage={onNavigate} compact={false} />
            </div>
          </div>
        </div>

        {/* ── Game Carousel ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-xl" style={{ color: CM.blue }}>🕹️ Game Lainnya</h3>
            <MPill color="grey">Segera hadir</MPill>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GAMES.map(g => {
              const slug = g.id === 'tebak' ? 'tebak-pasal' : g.id === 'hoaks' ? 'spot-hoaks' : null;
              const live = !!slug;
              return (
                <div key={g.id} onClick={() => live && onNavigate(slug)}
                  className={'p-4 rounded-2xl border text-center ' + (live ? 'card-lift cursor-pointer' : '')}
                  style={{ borderColor: live ? CM.coral : CM.line, background:'#fff', opacity: live ? 1 : .6 }}>
                  <div className="text-3xl mb-2">{g.icon}</div>
                  <h4 className="font-semibold text-sm mb-1" style={{ color: CM.blue }}>{g.title}</h4>
                  <p className="text-xs mb-2" style={{ color: CM.ink+'66' }}>{g.desc}</p>
                  <MPill color={live ? 'coral' : 'grey'}>{live ? 'Main →' : 'Segera'}</MPill>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Leaderboard ── */}
        <div>
          <h3 className="font-display font-bold text-xl mb-4" style={{ color: CM.blue }}>🏆 Leaderboard Minggu Ini</h3>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: CM.line }}>
            {LEADERBOARD.map((p, i) => {
              const isMe = p.name === 'Aulia Pratiwi';
              return (
                <div key={i}
                  className="flex items-center gap-3 md:gap-4 px-4 py-3 border-b last:border-0"
                  style={{ borderColor: CM.line, background: isMe ? CM.coral+'0F' : '#fff' }}>
                  <span className="font-mono font-bold w-6 text-center text-sm flex-shrink-0"
                    style={{ color: i < 3 ? [CM.marigold,'#ABABAB','#CD7F32'][i] : CM.ink+'44' }}>
                    {i < 3 ? RANK_ICONS[i] : i+1}
                  </span>
                  <MAvatar name={p.name} size="sm" level={p.level} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold" style={{ color: CM.blue }}>{p.name}</span>
                      {isMe && <MPill color="coral">Kamu</MPill>}
                    </div>
                    <div className="text-xs" style={{ color: CM.ink+'55' }}>{p.chapter}</div>
                  </div>
                  <span className="font-mono font-bold text-sm flex-shrink-0" style={{ color: CM.ink }}>
                    {p.score.toLocaleString('id')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Badges ── */}
        <div>
          <h3 className="font-display font-bold text-xl mb-4" style={{ color: CM.blue }}>🏅 Koleksi Badge</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {BADGES.map((b, i) => (
              <div key={i}
                className="p-3 rounded-xl border text-center"
                style={{
                  borderColor: b.on ? CM.marigold+'66' : CM.line,
                  background:   b.on ? '#fff'          : CM.line+'44',
                  opacity:      b.on ? 1 : .5,
                }}>
                <div
                  className={b.on ? 'badge-glow' : ''}
                  style={{ fontSize: 28, marginBottom: 4, filter: b.on ? 'none' : 'grayscale(1)' }}
                >{b.icon}</div>
                <div className="font-semibold leading-tight" style={{ fontSize: 10, color: CM.blue }}>{b.name}</div>
                <div className="leading-tight mt-0.5" style={{ fontSize: 9, color: CM.ink+'55' }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

Object.assign(window, { PageMain });

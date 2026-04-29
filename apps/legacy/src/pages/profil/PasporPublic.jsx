// PAGE: PasporPublic — Paspor Warga Digital, shareable view
(function() {

const CPP = window.C;
const { Pill: PPPill, Button: PPBtn, UserAvatar: PPAvatar } = window;

const STEMPEL = [
  { label: 'Petisi #1',     date: '12 Apr 2026', icon: '✍️', color: 'coral' },
  { label: 'Modul Kelas',   date: '20 Apr 2026', icon: '📚', color: 'mint' },
  { label: 'Vote Polling',  date: '24 Apr 2026', icon: '🗳️', color: 'blue' },
  { label: 'Tebak Kata 7×', date: '28 Apr 2026', icon: '🔥', color: 'marigold' },
  { label: 'Komentar Forum',date: '29 Apr 2026', icon: '💬', color: 'blue' },
];

const VISA = [
  { label: 'Jakarta Chapter',     since: 'Okt 2024', icon: '🌆' },
  { label: 'Sub-Komunitas APBD',  since: 'Mar 2026', icon: '📊' },
  { label: 'Mental Health di Kerja', since: 'Apr 2026', icon: '🌱' },
];

function PasporPublic({ onNavigate }) {
  const D = window.JWData;
  const F = window.JWFormat;
  const userId = 'u-aulia';
  const user = D?.byId?.user(userId) || { name: 'Aulia Pratiwi', chapter: 'Bandung Raya', level: 3, xp: 560, badges: ['Warga Baru','Tebak 3 Hari','Aktivis Mula'] };

  const handleShare = (channel) => {
    const url = window.location.href;
    if (channel === 'copy') { navigator.clipboard.writeText(url); alert('Link paspor disalin!'); return; }
    if (channel === 'wa') window.open(`https://wa.me/?text=${encodeURIComponent('Lihat Paspor Warga Digital saya di Jubir Warga: ' + url)}`, '_blank');
  };

  const tilts = [-3, 5, -2, 4, -1];

  return (
    <div style={{ background: CPP.cream, minHeight: '100vh' }}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <button onClick={() => onNavigate('profil')} className="text-sm" style={{ color: CPP.coral }}>← Kembali ke Profil</button>
          <div className="flex gap-2">
            <PPBtn variant="ghost" size="sm" onClick={() => handleShare('copy')}>📋 Salin link</PPBtn>
            <PPBtn variant="coral" size="sm" onClick={() => handleShare('wa')}>📤 Bagikan</PPBtn>
          </div>
        </div>

        <p className="font-hand text-base text-center mb-2" style={{ color: CPP.coral }}>Paspor publik — boleh dibagikan</p>

        <article className="rounded-3xl overflow-hidden shadow-2xl mx-auto" style={{ maxWidth: 540, background: CPP.blue, border: `8px solid ${CPP.blue}` }}>
          <div className="px-8 pt-10 pb-8 text-center" style={{ background: `radial-gradient(circle at top, ${CPP.blueSoft}, ${CPP.blue})` }}>
            <p className="font-mono text-xs tracking-widest mb-1" style={{ color: CPP.marigold }}>JUBIR WARGA</p>
            <h2 className="font-display text-2xl font-bold" style={{ color: CPP.cream }}>PASPOR</h2>
            <p className="font-display italic text-base mt-1" style={{ color: CPP.cream + 'BB' }}>Warga Digital Indonesia</p>
            <div className="my-6 flex justify-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ background: CPP.marigold + '33', border: `2px solid ${CPP.marigold}` }}>🦅</div>
            </div>
            <p className="font-mono text-xs" style={{ color: CPP.cream + '77' }}>SERIAL · JW-{(user.id || 'XXX').toUpperCase().replace('U-','')}-2026</p>
          </div>

          <div className="bg-white p-6">
            <div className="flex items-start gap-4 mb-5">
              <div style={{ width: 90, height: 110, background: CPP.line, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <PPAvatar name={user.name} size="xl" showLevel={false} />
              </div>
              <div className="flex-1 min-w-0 text-xs space-y-1.5">
                <div><p className="uppercase font-mono opacity-60" style={{ color: CPP.ink }}>Nama</p><p className="font-display font-bold text-base" style={{ color: CPP.blue }}>{user.name}</p></div>
                <div><p className="uppercase font-mono opacity-60" style={{ color: CPP.ink }}>Chapter</p><p className="font-semibold" style={{ color: CPP.ink }}>{user.chapter}</p></div>
                <div><p className="uppercase font-mono opacity-60" style={{ color: CPP.ink }}>Level Warga</p><p className="font-mono font-bold" style={{ color: CPP.coral }}>Lv. {user.level} · {F?.number(user.xp || 0)} XP</p></div>
                <div><p className="uppercase font-mono opacity-60" style={{ color: CPP.ink }}>Anggota Sejak</p><p className="font-semibold" style={{ color: CPP.ink }}>Oktober 2024</p></div>
              </div>
            </div>
            <div className="border-t pt-3" style={{ borderColor: CPP.line }}>
              <p className="font-display italic text-sm leading-snug" style={{ color: CPP.blue }}>"Demokrasi yang sehat dimulai dari warga yang aktif & tahu hak-nya."</p>
            </div>
          </div>

          <div className="bg-white border-t p-6" style={{ borderColor: CPP.line }}>
            <p className="font-mono text-xs uppercase mb-3 opacity-70" style={{ color: CPP.ink }}>Stempel Aksi (terbaru)</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {STEMPEL.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center text-2xl border-2" style={{ borderColor: CPP[s.color] || CPP.coral, background: '#fff', transform: 'rotate(' + tilts[i] + 'deg)' }}>{s.icon}</div>
                  <p className="text-[10px] mt-1 font-semibold" style={{ color: CPP.ink }}>{s.label}</p>
                  <p className="text-[9px] font-mono opacity-60" style={{ color: CPP.ink }}>{s.date}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border-t p-6" style={{ borderColor: CPP.line }}>
            <p className="font-mono text-xs uppercase mb-3 opacity-70" style={{ color: CPP.ink }}>Visa Komunitas</p>
            <div className="space-y-2">
              {VISA.map((v, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: CPP.cream, border: `1px solid ${CPP.line}` }}>
                  <span className="text-2xl">{v.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-sm" style={{ color: CPP.blue }}>{v.label}</p>
                    <p className="text-xs" style={{ color: CPP.ink + '77' }}>Anggota sejak {v.since}</p>
                  </div>
                  <span className="text-lg" style={{ color: CPP.mint }}>✓</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border-t p-6" style={{ borderColor: CPP.line }}>
            <p className="font-mono text-xs uppercase mb-3 opacity-70" style={{ color: CPP.ink }}>Badge Diraih ({(user.badges || []).length})</p>
            <div className="flex flex-wrap gap-2">
              {(user.badges || []).map((b, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: CPP.marigold + '22', color: CPP.marigold, border: `1px solid ${CPP.marigold}` }}>🏅 {b}</span>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 text-center border-t" style={{ borderColor: CPP.line }}>
            <p className="font-mono text-[10px] opacity-50" style={{ color: CPP.ink }}>Diterbitkan oleh Jubir Warga · jubir.spdindonesia.org</p>
          </div>
        </article>

        <div className="mt-8 text-center">
          <div className="inline-block p-4 rounded-2xl bg-white border" style={{ borderColor: CPP.line }}>
            <div className="w-32 h-32 grid grid-cols-7 gap-0.5 mb-2" style={{ background: CPP.cream, padding: 6 }}>
              {Array.from({ length: 49 }).map((_, i) => {
                const filled = (i * 7 + 13) % 5 < 2;
                return <div key={i} style={{ background: filled ? CPP.blue : CPP.cream }} />;
              })}
            </div>
            <p className="font-mono text-[10px]" style={{ color: CPP.ink + '77' }}>Scan untuk verifikasi</p>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PasporPublic });

})();

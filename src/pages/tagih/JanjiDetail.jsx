// PAGE: JanjiDetail — pejabat hero + status panel + timeline + evidence + diskusi
(function() {

const CJD = window.C;
const { Pill: JDPill, Button: JDBtn, UserAvatar: JDAvatar } = window;

const TIMELINE = [
  { date: '20 Okt 2024', event: 'Janji disampaikan saat pelantikan',                icon: '🎤', kind: 'announce' },
  { date: '15 Jan 2025', event: 'Roadmap implementasi diumumkan',                   icon: '🗺️', kind: 'plan' },
  { date: '03 Mar 2025', event: 'Realisasi tahap 1: 5 km jalur sepeda di Sudirman', icon: '✅', kind: 'progress' },
  { date: '20 Sep 2025', event: 'Audit publik tahap 1 — laporan 18 km terbangun',   icon: '📊', kind: 'progress' },
  { date: '10 Apr 2026', event: 'Quick check: progres 22 km dari target 50 km',     icon: '🔍', kind: 'progress' },
  { date: '31 Des 2026', event: 'Deadline target 50 km terealisasi',                icon: '⏳', kind: 'upcoming' },
];

const EVIDENCE = [
  { type: 'foto',  title: 'Jalur sepeda Sudirman fase 1',           src: 'Foto pemantau · 14 Apr 2026',   icon: '📸' },
  { type: 'dok',   title: 'Laporan realisasi triwulan I 2026',       src: 'Dishub DKI · 31 Mar 2026',       icon: '📄' },
  { type: 'video', title: 'Liputan Tempo Witness: jalur sepeda',     src: 'YouTube · 18 Apr 2026',          icon: '🎥' },
  { type: 'data',  title: 'Data realisasi panjang jalur per kelurahan', src: 'CSV · open data Jakarta',     icon: '📈' },
];

const DISKUSI = [
  { authorId: 'u-pram',  body: 'Saya cek di Sudirman, fase 1 memang sudah jadi tapi banyak motor yang masuk. Enforcement-nya juga perlu dievaluasi.', time: '4 jam lalu', up: 23 },
  { authorId: 'u-aulia', body: 'Setuju. Janji kuantitatif (50 km) saja tidak cukup. Harus ada janji "berapa % aman dari motor".', time: '2 jam lalu', up: 18 },
  { authorId: 'u-bilal', body: 'Coba bandingkan dengan janji Anies dulu — 200 km. Reality: ~63 km. Mari pantau apakah Pramono lebih baik.', time: '40 menit lalu', up: 31 },
];

function JanjiDetail({ onNavigate }) {
  const D = window.JWData;
  const F = window.JWFormat;
  const { useStoreField, actions } = window.JWStore;

  const janji = D?.janji?.[1] || { id: 'j-002', pejabatId: 'p-pramonoa', topik: 'Transportasi', status: 'Berjalan', janji: '"Tambah 50 km jalur sepeda baru sebelum akhir 2026."', deadline: '31 Des 2026', pemantau: 612, evidenceCount: 2 };
  const pejabat = D?.byId?.pejabat(janji.pejabatId) || { nama: 'Pramono A.', jabatan: 'Gubernur DKI Jakarta', partai: 'PDIP', skor: 72 };
  const meta = D?.janjiStatus?.[janji.status] || { color: 'marigold', bgHex: '#F2B137', textHex: '#9A6500', icon: '↻' };

  const [isPemantau] = useStoreField(['follows', janji.id]);
  const totalPemantau = (janji.pemantau || 0) + (isPemantau ? 1 : 0);

  const statusDesc = {
    'Berjalan':  'Realisasi sedang berlangsung. Pantau update mingguan dari komunitas.',
    'Mandek':    'Tidak ada update progres signifikan dalam 90 hari terakhir. Perlu tagih ulang.',
    'Ditepati':  'Janji telah terpenuhi dan diverifikasi komunitas.',
    'Diingkari': 'Janji telah dilanggar atau dibatalkan secara eksplisit.',
    'Belum':     'Belum ada langkah konkret. Masa berlaku masih ada.',
  };

  return (
    <div>
      <section className="py-12" style={{ background: CJD.cream }}>
        <div className="max-w-5xl mx-auto px-6">
          <button onClick={() => onNavigate('tagih')} className="text-sm mb-6" style={{ color: CJD.coral }}>← Kembali ke Tagih Janji</button>
          <div className="flex items-start gap-5 mb-6 flex-wrap">
            <JDAvatar name={pejabat.nama} size="xl" level={Math.round(pejabat.skor / 14)} />
            <div className="flex-1 min-w-0">
              <h1 className="font-display font-bold text-3xl md:text-4xl leading-tight" style={{ color: CJD.blue }}>{pejabat.nama}</h1>
              <p className="text-base mt-1" style={{ color: CJD.ink + '99' }}>{pejabat.jabatan}</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <JDPill color="blue">{pejabat.partai}</JDPill>
                <JDPill color="grey">{pejabat.dapil || 'Dapil tidak diketahui'}</JDPill>
                <JDPill color="marigold">⭐ Skor janji: {pejabat.skor}</JDPill>
              </div>
            </div>
            <button onClick={() => actions.toggleFollow(janji.id)} className="btn-base px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: isPemantau ? CJD.mint : CJD.blue, color: '#fff' }}>{isPemantau ? '✓ Memantau' : '👁 Pantau Janji'}</button>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="rounded-2xl border bg-white p-6 md:p-8" style={{ borderColor: CJD.line }}>
              <span className="font-hand text-base" style={{ color: CJD.coral }}>Janji yang ditagih</span>
              <h2 className="font-display font-bold text-2xl md:text-3xl mt-2 leading-snug" style={{ color: CJD.blue }}>{janji.janji}</h2>
              <p className="text-sm mt-3" style={{ color: CJD.ink + '99' }}>Dijanjikan saat masa kampanye / pelantikan · Deadline: <strong>{janji.deadline}</strong></p>
            </div>

            <div className="rounded-2xl p-6" style={{ background: meta.bgHex + '15', border: `2px solid ${meta.bgHex}` }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{meta.icon}</span>
                <div>
                  <p className="text-xs uppercase font-mono font-bold tracking-wider" style={{ color: meta.textHex }}>Status saat ini</p>
                  <h3 className="font-display font-bold text-2xl" style={{ color: meta.textHex }}>{janji.status}</h3>
                </div>
              </div>
              <p className="text-sm mt-2" style={{ color: CJD.ink }}>{statusDesc[janji.status]}</p>
            </div>

            <div>
              <h3 className="font-display font-bold text-xl mb-4" style={{ color: CJD.blue }}>📅 Timeline Progres</h3>
              <ol className="border-l-2 pl-5 space-y-4" style={{ borderColor: CJD.line }}>
                {TIMELINE.map((t, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[34px] flex items-center justify-center rounded-full w-7 h-7 text-sm" style={{ background: t.kind === 'upcoming' ? CJD.line : (t.kind === 'progress' ? CJD.mint + '33' : CJD.marigold + '33'), color: t.kind === 'upcoming' ? CJD.ink + '77' : (t.kind === 'progress' ? CJD.mint : CJD.marigold) }}>{t.icon}</span>
                    <p className="font-mono text-xs" style={{ color: CJD.ink + '77' }}>{t.date}</p>
                    <p className="text-sm mt-0.5" style={{ color: t.kind === 'upcoming' ? CJD.ink + 'AA' : CJD.ink }}>{t.event}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="font-display font-bold text-xl mb-4" style={{ color: CJD.blue }}>📂 Bukti Pendukung</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {EVIDENCE.map((e, i) => (
                  <div key={i} className="rounded-xl border p-4 bg-white card-lift cursor-pointer" style={{ borderColor: CJD.line }}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{e.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm" style={{ color: CJD.blue }}>{e.title}</p>
                        <p className="text-xs mt-1" style={{ color: CJD.ink + '77' }}>{e.src}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-sm mt-3" style={{ color: CJD.coral }}>+ Tambah bukti baru</button>
            </div>

            <div>
              <h3 className="font-display font-bold text-xl mb-4" style={{ color: CJD.blue }}>💬 Diskusi Komunitas</h3>
              <div className="space-y-3">
                {DISKUSI.map((d, i) => {
                  const u = D?.byId?.user(d.authorId) || { name: 'Anonim', level: 1, chapter: '-' };
                  return (
                    <div key={i} className="rounded-xl border bg-white p-4" style={{ borderColor: CJD.line }}>
                      <div className="flex items-start gap-3">
                        <JDAvatar name={u.name} size="sm" level={u.level} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-bold text-sm" style={{ color: CJD.blue }}>{u.name}</span>
                            <span className="text-xs" style={{ color: CJD.ink + '66' }}>· {u.chapter} · {d.time}</span>
                          </div>
                          <p className="text-sm" style={{ color: CJD.ink }}>{d.body}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: CJD.ink + '77' }}>
                            <button>↑ {d.up}</button>
                            <button>Reply</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border bg-white p-5 sticky top-4" style={{ borderColor: CJD.line }}>
              <h4 className="font-semibold text-sm mb-3" style={{ color: CJD.blue }}>Statistik Pantau</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span style={{color:CJD.ink+'99'}}>Pemantau aktif</span><strong style={{color:CJD.blue}}>{F?.number(totalPemantau) || totalPemantau}</strong></div>
                <div className="flex justify-between"><span style={{color:CJD.ink+'99'}}>Bukti dikirim</span><strong style={{color:CJD.blue}}>{janji.evidenceCount || 0}</strong></div>
                <div className="flex justify-between"><span style={{color:CJD.ink+'99'}}>Diskusi</span><strong style={{color:CJD.blue}}>{DISKUSI.length}</strong></div>
                <div className="flex justify-between"><span style={{color:CJD.ink+'99'}}>Update terakhir</span><strong style={{color:CJD.blue}}>10 Apr 2026</strong></div>
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: CJD.coral + '0E', border: `1px dashed ${CJD.coral + '66'}` }}>
              <p className="font-hand text-base" style={{ color: CJD.coral }}>Tahu update terbaru?</p>
              <p className="text-xs mt-1 mb-3" style={{ color: CJD.ink + '99' }}>Kirim bukti, foto, atau link berita untuk update status janji ini.</p>
              <JDBtn variant="coral" size="sm" className="w-full">+ Kirim Bukti Baru</JDBtn>
            </div>

            <div className="rounded-2xl border bg-white p-5" style={{ borderColor: CJD.line }}>
              <h4 className="font-semibold text-sm mb-3" style={{ color: CJD.blue }}>Janji lain dari pejabat ini</h4>
              <div className="text-sm space-y-2">
                {(D?.janji || []).filter(j => j.pejabatId === janji.pejabatId && j.id !== janji.id).slice(0,3).map(j => (
                  <div key={j.id} className="border-b pb-2 last:border-0" style={{borderColor: CJD.line}}>
                    <p className="text-xs font-semibold" style={{ color: CJD.ink }}>{j.janji.replace(/^"|"$/g, '').slice(0,80)}...</p>
                    <p className="text-xs mt-1" style={{ color: CJD.ink + '77' }}>Status: {j.status}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => onNavigate('pejabat-profile')} className="text-xs mt-2 w-full text-left" style={{ color: CJD.coral }}>Lihat profil pejabat →</button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { JanjiDetail });

})();

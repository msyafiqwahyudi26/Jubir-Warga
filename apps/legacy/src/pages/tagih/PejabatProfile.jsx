// PAGE: PejabatProfile — hero + skor + list janji + breakdown + chart
// IIFE WRAP
(function() {

const CPJ = window.C;
const { Pill: PJPill, Button: PJBtn, UserAvatar: PJAvatar, ProgressBar: PJProgress } = window;

function PejabatProfile({ onNavigate }) {
  const D = window.JWData;
  const F = window.JWFormat;
  const { useStoreField, actions } = window.JWStore;

  const pejabat = D?.byId?.pejabat('p-pramonoa') || D?.pejabat?.[1] || { id: 'p-pramonoa', nama: 'Pramono A.', jabatan: 'Gubernur DKI Jakarta', partai: 'PDIP', dapil: 'DKI', skor: 72, jumlahJanji: 8, ditepati: 3, mandek: 1, diingkari: 0, berjalan: 4 };
  const janjiList = (D?.janji || []).filter(j => j.pejabatId === pejabat.id);

  const [followed] = useStoreField(['follows', pejabat.id]);

  const breakdown = [
    { label: 'Ditepati',  count: pejabat.ditepati,  color: CPJ.mint,     pct: (pejabat.ditepati / pejabat.jumlahJanji) * 100 },
    { label: 'Berjalan',  count: pejabat.berjalan,  color: CPJ.marigold, pct: (pejabat.berjalan / pejabat.jumlahJanji) * 100 },
    { label: 'Mandek',    count: pejabat.mandek,    color: '#8A9099',    pct: (pejabat.mandek / pejabat.jumlahJanji) * 100 },
    { label: 'Diingkari', count: pejabat.diingkari, color: CPJ.coral,    pct: (pejabat.diingkari / pejabat.jumlahJanji) * 100 },
  ];

  return (
    <div>
      <section className="py-12 border-b" style={{ background: CPJ.cream, borderColor: CPJ.line }}>
        <div className="max-w-5xl mx-auto px-6">
          <button onClick={() => onNavigate('tagih')} className="text-sm mb-6" style={{ color: CPJ.coral }}>← Kembali</button>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2">
              <div className="flex items-start gap-5 flex-wrap">
                <PJAvatar name={pejabat.nama} size="xl" level={Math.round(pejabat.skor / 14)} />
                <div className="flex-1 min-w-0">
                  <h1 className="font-display font-bold text-3xl md:text-4xl leading-tight" style={{ color: CPJ.blue }}>{pejabat.nama}</h1>
                  <p className="text-base mt-1" style={{ color: CPJ.ink + '99' }}>{pejabat.jabatan}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <PJPill color="blue">{pejabat.partai}</PJPill>
                    <PJPill color="grey">📍 {pejabat.dapil}</PJPill>
                    <PJPill color="grey">{pejabat.level}</PJPill>
                  </div>
                  <button onClick={() => actions.toggleFollow(pejabat.id)} className="btn-base mt-4 px-5 py-2 rounded-xl text-sm font-semibold" style={{ background: followed ? CPJ.mint : CPJ.coral, color: '#fff' }}>
                    {followed ? '✓ Memantau' : '+ Pantau Pejabat Ini'}
                  </button>
                </div>
              </div>
            </div>

            {/* Skor */}
            <div className="rounded-2xl border bg-white p-5 text-center" style={{ borderColor: CPJ.line }}>
              <p className="text-xs uppercase font-mono opacity-60" style={{ color: CPJ.ink }}>Skor Janji</p>
              <p className="font-display text-5xl font-bold mt-1" style={{ color: pejabat.skor >= 70 ? CPJ.mint : pejabat.skor >= 50 ? CPJ.marigold : CPJ.coral }}>{pejabat.skor}</p>
              <p className="text-xs mt-1" style={{ color: CPJ.ink + '77' }}>dari 100</p>
              <div className="border-t mt-3 pt-3" style={{ borderColor: CPJ.line }}>
                <p className="text-xs" style={{ color: CPJ.ink + '99' }}>{pejabat.jumlahJanji} janji ter-track</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Breakdown chart */}
            <div className="rounded-2xl border bg-white p-6" style={{ borderColor: CPJ.line }}>
              <h3 className="font-display font-bold text-xl mb-4" style={{ color: CPJ.blue }}>📊 Breakdown Status Janji</h3>
              <div className="flex h-12 rounded-lg overflow-hidden mb-3">
                {breakdown.map((b, i) => b.count > 0 && (
                  <div key={i} className="flex items-center justify-center text-xs font-bold" style={{ width: `${b.pct}%`, background: b.color, color: '#fff' }}>
                    {b.count}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {breakdown.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm" style={{ background: b.color }}></span>
                    <span style={{ color: CPJ.ink }}>{b.label}: <strong>{b.count}</strong></span>
                  </div>
                ))}
              </div>
            </div>

            {/* List janji */}
            <div>
              <h3 className="font-display font-bold text-xl mb-4" style={{ color: CPJ.blue }}>📋 Daftar Janji Ter-track ({janjiList.length})</h3>
              <div className="space-y-3">
                {janjiList.map(j => {
                  const meta = D?.janjiStatus?.[j.status] || {};
                  return (
                    <div key={j.id} className="rounded-xl border bg-white p-4 cursor-pointer card-lift" style={{ borderColor: CPJ.line }} onClick={() => onNavigate('janji-detail')}>
                      <div className="flex items-start gap-3">
                        <span className="text-xl flex-shrink-0">{meta.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <PJPill color={meta.color || 'blue'}>{j.status}</PJPill>
                            <PJPill color="grey">{j.topik}</PJPill>
                          </div>
                          <p className="text-sm font-semibold leading-snug" style={{ color: CPJ.ink }}>{j.janji}</p>
                          <p className="text-xs mt-1" style={{ color: CPJ.ink + '77' }}>Deadline: {j.deadline} · {F?.number(j.pemantau) || j.pemantau} pemantau</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {janjiList.length === 0 && (
                  <div className="rounded-xl border bg-white p-6 text-center" style={{ borderColor: CPJ.line }}>
                    <p className="text-sm" style={{ color: CPJ.ink + '99' }}>Belum ada janji ter-track untuk pejabat ini.</p>
                    <PJBtn variant="coral" size="sm" className="mt-3" onClick={() => onNavigate('submit-janji')}>+ Submit Janji Pertama</PJBtn>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border bg-white p-5" style={{ borderColor: CPJ.line }}>
              <h4 className="font-semibold text-sm mb-3" style={{ color: CPJ.blue }}>Tentang Skor</h4>
              <p className="text-xs mb-3" style={{ color: CPJ.ink + '99' }}>Skor dihitung dari rasio janji ditepati vs total janji + bobot status berjalan/mandek/diingkari.</p>
              <div className="text-xs space-y-1.5">
                <div className="flex items-center gap-2"><span style={{color:CPJ.mint}}>●</span> 70+: Bagus</div>
                <div className="flex items-center gap-2"><span style={{color:CPJ.marigold}}>●</span> 50-69: Cukup</div>
                <div className="flex items-center gap-2"><span style={{color:CPJ.coral}}>●</span> &lt;50: Buruk</div>
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: CPJ.coral + '0E', border: `1px dashed ${CPJ.coral + '66'}` }}>
              <p className="font-hand text-base" style={{ color: CPJ.coral }}>Kenal janji yang belum ter-track?</p>
              <p className="text-xs mt-1 mb-3" style={{ color: CPJ.ink + '99' }}>Submit janji baru dengan sumber URL & kutipan asli.</p>
              <PJBtn variant="coral" size="sm" className="w-full" onClick={() => onNavigate('submit-janji')}>+ Submit Janji Baru</PJBtn>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { PejabatProfile });

})();

// PAGE: PetisiDetail — full body + signatory wall + sign action + share
(function() {

const CPD = window.C;
const { Pill: PDPill, Button: PDBtn, UserAvatar: PDAvatar } = window;

const PETISI_BODY = `Kami warga Jakarta meminta Pemprov DKI untuk:

1. **Membuka audit lengkap APBD 2026** dengan format machine-readable (CSV/JSON), bukan PDF scan yang tidak bisa di-search.
2. **Public dashboard** untuk track realisasi vs perencanaan, real-time per OPD.
3. **Kanal pengaduan publik** yang dijawab dalam SLA 14 hari kerja, dengan tracking nomor.

Sudah 5 tahun audit APBD diumumkan dengan format yang menyulitkan partisipasi publik. Sebagai warga yang membayar pajak, kami berhak tahu uang kami digunakan untuk apa, kapan, oleh siapa.

Petisi ini bukan oposisi. Ini adalah inisiatif untuk memperkuat tata kelola pemerintahan kota yang akuntabel.`;

const TIMELINE = [
  { date: '12 Apr 2026', event: 'Petisi diluncurkan', icon: '🚀' },
  { date: '15 Apr 2026', event: 'Mencapai 1,000 tanda tangan dalam 72 jam', icon: '📈' },
  { date: '20 Apr 2026', event: 'Liputan Tempo & CNN Indonesia', icon: '📰' },
  { date: '25 Apr 2026', event: '10,000 tanda tangan', icon: '🎯' },
  { date: '5 Mei 2026',  event: 'Audiensi DPRD DKI (terjadwal)', icon: '🏛️', upcoming: true },
];

function PetisiDetail({ onNavigate }) {
  const D = window.JWData;
  const F = window.JWFormat;
  const { useStoreField, actions } = window.JWStore;

  const petisi = D?.petisi?.[0] || { id: 'pt-001', title: 'Audit Transparan APBD Jakarta 2026', target: 20000, current: 14230, deadline: '15 Jun 2026', icon: '📋', initiatorId: 'u-bilal' };
  const initiator = D?.byId?.user(petisi.initiatorId) || { name: 'Bilal Sukarno', chapter: 'Jakarta', level: 6 };

  const [signedAt] = useStoreField(['signed', petisi.id]);
  const [counts] = useStoreField(['counts', petisi.id]);
  const isSigned = !!signedAt;
  const totalSigned = (petisi.current || 0) + (counts || 0) + (isSigned ? 1 : 0);
  const pct = Math.min(100, Math.round((totalSigned / petisi.target) * 100));

  const signatories = D?.users?.slice(0, 8) || [];

  const handleSign = () => {
    if (isSigned) return;
    actions.sign(petisi.id);
    actions.incrementCount(petisi.id, 0);
  };

  const handleShare = (channel) => {
    const url = window.location.href;
    const text = `Saya tanda tangan petisi: "${petisi.title}". Yuk dukung di Jubir Warga.`;
    if (channel === 'wa') window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    else if (channel === 'tw') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    else if (channel === 'copy') { navigator.clipboard.writeText(url); alert('Link disalin!'); }
  };

  return (
    <div>
      <section className="py-16" style={{ background: `linear-gradient(135deg, ${CPD.blue} 0%, ${CPD.blueSoft} 100%)` }}>
        <div className="max-w-4xl mx-auto px-6">
          <button onClick={() => onNavigate('aksi')} className="text-sm mb-6 opacity-80" style={{ color: CPD.cream }}>← Kembali ke Aksi</button>

          <div className="flex items-start gap-4 mb-6 flex-wrap">
            <div className="text-6xl flex-shrink-0">{petisi.icon}</div>
            <div className="flex-1 min-w-0">
              <PDPill color="coral" className="mb-3">PETISI · {petisi.tags?.[0] || 'Transparansi'}</PDPill>
              <h1 className="font-display font-bold text-3xl md:text-5xl leading-tight mb-3" style={{ color: CPD.cream }}>{petisi.title}</h1>
              <p className="text-base mb-4" style={{ color: CPD.cream + 'BB' }}>{petisi.summary || 'Dukung petisi ini untuk perubahan nyata.'}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <PDAvatar name={initiator.name} size="sm" level={initiator.level} />
                <span className="text-sm" style={{ color: CPD.cream + 'CC' }}>Diinisiasi <strong>{initiator.name}</strong> · {initiator.chapter}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 mt-6" style={{ background: CPD.cream + '15' }}>
            <div className="flex items-end justify-between mb-3 flex-wrap gap-2">
              <div>
                <p className="font-mono text-3xl font-bold" style={{ color: CPD.cream }}>{F?.number(totalSigned) || totalSigned}</p>
                <p className="text-xs" style={{ color: CPD.cream + '99' }}>dari {F?.number(petisi.target) || petisi.target} tanda tangan</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-2xl font-bold" style={{ color: CPD.marigold }}>{pct}%</p>
                <p className="text-xs" style={{ color: CPD.cream + '99' }}>tercapai</p>
              </div>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: CPD.cream + '20' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: pct + '%', background: CPD.marigold }} />
            </div>
            <p className="text-xs mt-3" style={{ color: CPD.cream + '77' }}>Berakhir: <strong>{petisi.deadline}</strong></p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="font-display font-bold text-2xl mb-4" style={{ color: CPD.blue }}>Mengapa Petisi Ini Penting</h2>
            <div className="prose max-w-none" style={{ fontSize: 16, lineHeight: 1.75, color: CPD.ink }}>
              {PETISI_BODY.split('\n\n').map((p, i) => (
                <p key={i} className="mb-4" dangerouslySetInnerHTML={{__html: p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/^(\d+)\. /gm, '<span style="font-weight:600;color:'+CPD.coral+'">$1.</span> ')}} />
              ))}
            </div>

            <h3 className="font-display font-bold text-xl mt-10 mb-4" style={{ color: CPD.blue }}>Perjalanan Petisi</h3>
            <ol className="border-l-2 pl-5 space-y-4" style={{ borderColor: CPD.line }}>
              {TIMELINE.map((t, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[34px] flex items-center justify-center rounded-full w-7 h-7 text-sm" style={{ background: t.upcoming ? CPD.line : CPD.coral + '22', color: t.upcoming ? CPD.ink + '77' : CPD.coral }}>{t.icon}</span>
                  <p className="font-mono text-xs" style={{ color: CPD.ink + '77' }}>{t.date}</p>
                  <p className="text-sm mt-0.5 font-semibold" style={{ color: t.upcoming ? CPD.ink + 'AA' : CPD.ink }}>{t.event}</p>
                  {t.upcoming && <PDPill color="marigold" className="mt-1">Akan datang</PDPill>}
                </li>
              ))}
            </ol>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border-2 p-5 sticky top-4" style={{ borderColor: isSigned ? CPD.mint : CPD.coral, background: '#fff' }}>
              {isSigned ? (
                <>
                  <div className="text-center mb-3">
                    <span className="text-4xl">✅</span>
                    <h3 className="font-display font-bold mt-2" style={{ color: CPD.mint }}>Sudah Ditanda Tangani!</h3>
                    <p className="text-xs mt-1" style={{ color: CPD.ink + '99' }}>Terima kasih, suaramu tercatat.</p>
                  </div>
                  <PDBtn variant="outline" className="w-full" onClick={() => handleShare('wa')}>📤 Bagikan ke teman</PDBtn>
                </>
              ) : (
                <>
                  <h3 className="font-display font-bold text-lg mb-2" style={{ color: CPD.blue }}>Tanda Tangani Petisi</h3>
                  <p className="text-xs mb-4" style={{ color: CPD.ink + '99' }}>Suaramu tercatat publik. Tidak bisa dibatalkan.</p>
                  <PDBtn variant="coral" className="w-full" onClick={handleSign}>✍️ Tanda Tangan Sekarang</PDBtn>
                </>
              )}
            </div>

            <div className="rounded-2xl border bg-white p-5" style={{ borderColor: CPD.line }}>
              <h4 className="font-semibold text-sm mb-3" style={{ color: CPD.blue }}>Sebarluaskan</h4>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => handleShare('wa')} className="flex-1 py-2 rounded-lg text-xs font-semibold" style={{ background: '#25D366', color: '#fff' }}>WhatsApp</button>
                <button onClick={() => handleShare('tw')} className="flex-1 py-2 rounded-lg text-xs font-semibold" style={{ background: '#000', color: '#fff' }}>X / Twitter</button>
              </div>
              <button onClick={() => handleShare('copy')} className="mt-2 w-full py-2 rounded-lg text-xs font-semibold border" style={{ borderColor: CPD.line, color: CPD.ink }}>📋 Salin Link</button>
            </div>

            <div className="rounded-2xl border bg-white p-5" style={{ borderColor: CPD.line }}>
              <h4 className="font-semibold text-sm mb-3" style={{ color: CPD.blue }}>{F?.numberCompact(totalSigned) || totalSigned} sudah tanda tangan</h4>
              <div className="flex flex-wrap gap-1 mb-3">
                {signatories.map(u => <PDAvatar key={u.id} name={u.name} size="sm" showLevel={false} />)}
                <span className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-mono font-bold" style={{ background: CPD.line, color: CPD.ink }}>+{F?.numberCompact(totalSigned - signatories.length) || (totalSigned - signatories.length)}</span>
              </div>
              <button className="text-xs w-full text-left" style={{ color: CPD.coral }}>Lihat semua →</button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { PetisiDetail });

})();

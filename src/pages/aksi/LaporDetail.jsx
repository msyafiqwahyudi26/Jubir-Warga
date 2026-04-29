// PAGE: LaporDetail — laporan warga + dukungan + status + komentar
// IIFE WRAP
(function() {

const CLD = window.C;
const { Pill: LDPill, Button: LDBtn, UserAvatar: LDAvatar } = window;

const KOMENTAR = [
  { authorId: 'u-aulia', body: 'Kondisinya makin parah kemarin. Sudah ada 2 motor jatuh.', time: '3 jam lalu' },
  { authorId: 'u-mei',   body: 'Saya juga warga sini. Sudah lapor ke Dishub via WA, belum ada respons 4 hari.', time: '5 jam lalu' },
  { authorId: 'u-pram',  body: 'Mungkin koordinasi dengan Sudinhub Jaksel langsung? Coba CC ke @PemkotJakarta', time: '1 hari lalu' },
];

const TIMELINE = [
  { date: '27 Apr 2026 · 14:20', event: 'Laporan dikirim',                          icon: '📝', kind: 'submit' },
  { date: '27 Apr 2026 · 16:45', event: 'Dukungan publik mencapai 20',              icon: '👥', kind: 'progress' },
  { date: '28 Apr 2026 · 09:10', event: 'Diteruskan ke Dishub Jakarta Selatan',     icon: '📨', kind: 'progress' },
  { date: '28 Apr 2026 · 14:30', event: 'Petugas survei lapangan terjadwal 30 Apr', icon: '👷', kind: 'plan' },
];

function LaporDetail({ onNavigate }) {
  const D = window.JWData;
  const F = window.JWFormat;
  const { useStoreField, actions } = window.JWStore;

  const lapor = D?.laporan?.[0] || { id: 'lp-001', kategori: 'Jalan', judul: 'Lubang besar di Jl. Tebet Barat dekat halte', lokasi: 'Jakarta · Tebet', waktu: '2j', status: 'Diterima', dukungan: 24, reporterId: 'u-aulia' };
  const reporter = D?.byId?.user(lapor.reporterId) || { name: 'Aulia Pratiwi', level: 3, chapter: 'Bandung Raya' };

  const [supported] = useStoreField(['follows', lapor.id]);
  const [counts] = useStoreField(['counts', lapor.id]);
  const totalSupport = (lapor.dukungan || 0) + (counts || 0) + (supported ? 1 : 0);
  const handleSupport = () => { actions.toggleFollow(lapor.id); actions.incrementCount(lapor.id, 0); };

  const statusColor = lapor.status === 'Selesai' ? 'mint' : lapor.status === 'Ditindaklanjuti' ? 'marigold' : 'blue';

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button onClick={() => onNavigate('aksi')} className="text-sm mb-4" style={{ color: CLD.coral }}>← Kembali ke Lapor</button>

      <div className="grid md:grid-cols-3 gap-6">
        <article className="md:col-span-2 space-y-6">
          {/* Header */}
          <div className="rounded-2xl border bg-white p-6" style={{ borderColor: CLD.line }}>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <LDPill color="coral">{lapor.kategori}</LDPill>
              <LDPill color={statusColor}>{lapor.status}</LDPill>
              <span className="text-xs ml-auto" style={{ color: CLD.ink + '77' }}>{lapor.waktu} lalu</span>
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl leading-tight mb-3" style={{ color: CLD.blue }}>{lapor.judul}</h1>
            <p className="text-sm flex items-center gap-2" style={{ color: CLD.ink + '99' }}>
              <span>📍</span> {lapor.lokasi}
            </p>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t" style={{ borderColor: CLD.line }}>
              <LDAvatar name={reporter.name} size="sm" level={reporter.level} />
              <span className="text-xs" style={{ color: CLD.ink + '99' }}>Dilaporkan oleh <strong style={{ color: CLD.blue }}>{reporter.name}</strong> · {reporter.chapter}</span>
            </div>
          </div>

          {/* Foto placeholder */}
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: CLD.line }}>
            <div className="aspect-video flex items-center justify-center" style={{ background: CLD.line + '88' }}>
              <div className="text-center" style={{ color: CLD.ink + '77' }}>
                <p className="text-5xl mb-2">📸</p>
                <p className="text-xs">Foto laporan</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border bg-white p-6" style={{ borderColor: CLD.line }}>
            <h3 className="font-display font-bold text-lg mb-4" style={{ color: CLD.blue }}>📅 Timeline Tindak Lanjut</h3>
            <ol className="border-l-2 pl-5 space-y-3" style={{ borderColor: CLD.line }}>
              {TIMELINE.map((t, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[34px] flex items-center justify-center rounded-full w-7 h-7 text-sm" style={{ background: CLD.coral + '22', color: CLD.coral }}>{t.icon}</span>
                  <p className="font-mono text-xs" style={{ color: CLD.ink + '77' }}>{t.date}</p>
                  <p className="text-sm mt-0.5" style={{ color: CLD.ink }}>{t.event}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Komentar */}
          <div className="rounded-2xl border bg-white p-6" style={{ borderColor: CLD.line }}>
            <h3 className="font-display font-bold text-lg mb-4" style={{ color: CLD.blue }}>💬 Diskusi Warga ({KOMENTAR.length})</h3>
            <div className="space-y-3 mb-4">
              {KOMENTAR.map((k, i) => {
                const u = D?.byId?.user(k.authorId) || { name: 'Anonim', level: 1 };
                return (
                  <div key={i} className="flex items-start gap-3">
                    <LDAvatar name={u.name} size="sm" level={u.level} />
                    <div className="flex-1">
                      <p className="text-xs font-semibold" style={{ color: CLD.blue }}>{u.name} <span className="font-normal" style={{ color: CLD.ink + '77' }}>· {k.time}</span></p>
                      <p className="text-sm mt-1" style={{ color: CLD.ink }}>{k.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <textarea placeholder="Kasih dukungan, info, atau pengalaman serupa..." rows={2} className="w-full p-3 rounded-lg outline-none text-sm resize-none" style={{ border: `1px solid ${CLD.line}` }} />
            <div className="flex justify-end mt-2"><LDBtn variant="coral" size="sm">Kirim</LDBtn></div>
          </div>
        </article>

        <aside className="space-y-4">
          {/* Dukungan */}
          <div className="rounded-2xl border-2 p-5 sticky top-4" style={{ borderColor: supported ? CLD.mint : CLD.coral, background: '#fff' }}>
            <p className="text-xs uppercase font-mono opacity-60" style={{ color: CLD.ink }}>Dukungan publik</p>
            <p className="font-mono text-3xl font-bold mb-3" style={{ color: CLD.coral }}>{F?.number(totalSupport) || totalSupport}</p>
            <LDBtn variant={supported ? 'outline' : 'coral'} className="w-full" onClick={handleSupport}>
              {supported ? '✓ Kamu Mendukung' : '+ Saya Juga Mengalami'}
            </LDBtn>
            <p className="text-xs mt-3 opacity-70" style={{ color: CLD.ink }}>Dukungan ≥50 → otomatis diteruskan ke ombudsman daerah.</p>
          </div>

          {/* Status detail */}
          <div className="rounded-2xl border bg-white p-5" style={{ borderColor: CLD.line }}>
            <h4 className="font-semibold text-sm mb-3" style={{ color: CLD.blue }}>Pejabat terkait</h4>
            <div className="text-sm space-y-2">
              <div><p className="text-xs opacity-70">Instansi</p><p className="font-semibold" style={{ color: CLD.blue }}>Dishub Jakarta Selatan</p></div>
              <div><p className="text-xs opacity-70">Pejabat penanggung jawab</p><p className="font-semibold" style={{ color: CLD.blue }}>Kepala Sudin Hub Jaksel</p></div>
              <div><p className="text-xs opacity-70">SLA tindak lanjut</p><p className="font-semibold" style={{ color: CLD.coral }}>14 hari kerja</p></div>
            </div>
          </div>

          {/* CTA Lapor baru */}
          <div className="rounded-2xl p-5" style={{ background: CLD.coral + '0E', border: `1px dashed ${CLD.coral + '66'}` }}>
            <p className="font-hand text-base" style={{ color: CLD.coral }}>Punya laporan sendiri?</p>
            <p className="text-xs mt-1 mb-3" style={{ color: CLD.ink + '99' }}>Lapor masalah lokal kamu dalam 5 langkah.</p>
            <LDBtn variant="coral" size="sm" className="w-full" onClick={() => onNavigate('lapor-baru')}>+ Buat Laporan Baru</LDBtn>
          </div>
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { LaporDetail });

})();

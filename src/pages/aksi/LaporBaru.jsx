// PAGE: LaporBaru — Form 5-step lapor masalah lokal
// IIFE WRAP
(function() {

const CLB = window.C;
const { Pill: LBPill, Button: LBBtn } = window;
const { useState: useLBState } = React;

const STEPS = ['Kategori','Foto','Lokasi','Deskripsi','Konfirmasi'];

function LaporBaru({ onNavigate }) {
  const D = window.JWData;
  const { actions } = window.JWStore;

  const [step, setStep] = useLBState(0);
  const [data, setData] = useLBState({ kategori: '', fotoNama: '', lokasi: '', kota: '', judul: '', deskripsi: '', anonim: false });

  const kategori = D?.laporanKategori || [{id:'jalan',label:'Jalan',icon:'🛣️'},{id:'banjir',label:'Banjir',icon:'🌊'},{id:'sampah',label:'Sampah',icon:'🗑️'}];

  const next = () => step < STEPS.length - 1 && setStep(step + 1);
  const prev = () => step > 0 && setStep(step - 1);
  const submit = () => {
    actions.incrementCount('lapor-submitted', 1);
    setStep(STEPS.length); // success
  };

  const canNext = (
    (step === 0 && data.kategori) ||
    (step === 1) || // foto opsional
    (step === 2 && data.lokasi && data.kota) ||
    (step === 3 && data.judul && data.deskripsi) ||
    (step === 4)
  );

  if (step === STEPS.length) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="font-display font-bold text-3xl mb-3" style={{ color: CLB.mint }}>Laporan Terkirim!</h1>
        <p className="text-sm mb-2" style={{ color: CLB.ink + '99' }}>Nomor tracking: <span className="font-mono font-bold" style={{ color: CLB.blue }}>JW-LP-{Date.now().toString().slice(-6)}</span></p>
        <p className="text-sm mb-6" style={{ color: CLB.ink + '99' }}>Laporan kamu akan diteruskan ke instansi terkait dalam 24 jam. Pantau perkembangannya di Profil.</p>
        <div className="flex gap-2">
          <LBBtn variant="outline" className="flex-1" onClick={() => onNavigate('aksi')}>Kembali ke Aksi</LBBtn>
          <LBBtn variant="coral" className="flex-1" onClick={() => onNavigate('lapor-detail')}>Lihat Laporan</LBBtn>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <button onClick={() => onNavigate('aksi')} className="text-sm mb-4" style={{ color: CLB.coral }}>← Batal</button>

      <h1 className="font-display font-bold text-2xl md:text-3xl mb-2" style={{ color: CLB.blue }}>Lapor Baru</h1>
      <p className="text-sm mb-6" style={{ color: CLB.ink + '99' }}>5 langkah, ±2 menit. Laporanmu langsung terlacak.</p>

      {/* Progress steps */}
      <div className="flex items-center gap-1 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 flex items-center gap-1">
            <div className="flex-1 h-1.5 rounded-full" style={{ background: i <= step ? CLB.coral : CLB.line }} />
            <span className="text-[10px] font-mono whitespace-nowrap" style={{ color: i <= step ? CLB.coral : CLB.ink + '55' }}>{s}</span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-2xl border bg-white p-6 mb-6" style={{ borderColor: CLB.line }}>

        {step === 0 && (
          <div>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: CLB.blue }}>Kategori masalah?</h2>
            <div className="grid grid-cols-3 gap-3">
              {kategori.map(k => (
                <button key={k.id} onClick={() => setData({...data, kategori: k.id})} className="p-4 rounded-xl border-2 text-center" style={{ borderColor: data.kategori === k.id ? CLB.coral : CLB.line, background: data.kategori === k.id ? CLB.coral + '10' : '#fff' }}>
                  <div className="text-3xl mb-1">{k.icon}</div>
                  <div className="text-xs font-semibold" style={{ color: CLB.blue }}>{k.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: CLB.blue }}>Tambah foto (opsional)</h2>
            <p className="text-xs mb-4" style={{ color: CLB.ink + '99' }}>Foto bukti bikin laporan 4× lebih cepat ditindaklanjuti.</p>
            <label className="block aspect-video rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer" style={{ borderColor: data.fotoNama ? CLB.mint : CLB.line, background: data.fotoNama ? CLB.mint + '0E' : CLB.cream }}>
              <input type="file" className="hidden" onChange={e => setData({...data, fotoNama: e.target.files?.[0]?.name || ''})} accept="image/*" />
              <div className="text-center">
                {data.fotoNama ? (
                  <><div className="text-4xl mb-2">✓</div><p className="font-semibold text-sm" style={{ color: CLB.mint }}>{data.fotoNama}</p></>
                ) : (
                  <><div className="text-4xl mb-2 opacity-50">📷</div><p className="font-semibold text-sm" style={{ color: CLB.ink + '99' }}>Klik untuk upload foto</p><p className="text-xs mt-1" style={{ color: CLB.ink + '77' }}>JPG / PNG · Maks 5 MB</p></>
                )}
              </div>
            </label>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: CLB.blue }}>Di mana kejadiannya?</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono uppercase opacity-70 block mb-1" style={{ color: CLB.ink }}>Alamat / Patokan</label>
                <input value={data.lokasi} onChange={e => setData({...data, lokasi: e.target.value})} placeholder="Misal: Jl. Tebet Barat dekat halte busway" className="w-full p-3 rounded-lg outline-none text-sm" style={{ border: `1px solid ${CLB.line}` }} />
              </div>
              <div>
                <label className="text-xs font-mono uppercase opacity-70 block mb-1" style={{ color: CLB.ink }}>Kota / Kabupaten</label>
                <select value={data.kota} onChange={e => setData({...data, kota: e.target.value})} className="w-full p-3 rounded-lg outline-none text-sm" style={{ border: `1px solid ${CLB.line}`, background: '#fff' }}>
                  <option value="">— Pilih —</option>
                  {(D?.lokasi || []).map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                </select>
              </div>
              <button className="text-sm font-semibold" style={{ color: CLB.coral }}>📍 Atau pakai lokasi GPS saya</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: CLB.blue }}>Ceritakan masalahnya</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono uppercase opacity-70 block mb-1" style={{ color: CLB.ink }}>Judul singkat</label>
                <input value={data.judul} onChange={e => setData({...data, judul: e.target.value})} placeholder="Misal: Lubang besar di Jl. Tebet Barat" maxLength={100} className="w-full p-3 rounded-lg outline-none text-sm" style={{ border: `1px solid ${CLB.line}` }} />
                <p className="text-xs mt-1 opacity-60" style={{ color: CLB.ink }}>{data.judul.length}/100</p>
              </div>
              <div>
                <label className="text-xs font-mono uppercase opacity-70 block mb-1" style={{ color: CLB.ink }}>Deskripsi detail</label>
                <textarea value={data.deskripsi} onChange={e => setData({...data, deskripsi: e.target.value})} placeholder="Sudah berapa lama? Berapa orang terdampak? Sudah pernah dilaporkan?" rows={5} className="w-full p-3 rounded-lg outline-none text-sm resize-none" style={{ border: `1px solid ${CLB.line}` }} />
              </div>
              <label className="flex items-center gap-2 text-sm" style={{ color: CLB.ink }}>
                <input type="checkbox" checked={data.anonim} onChange={e => setData({...data, anonim: e.target.checked})} />
                Lapor sebagai anonim (nama disembunyikan dari publik)
              </label>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: CLB.blue }}>Konfirmasi laporan</h2>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg" style={{ background: CLB.cream }}>
                <p className="text-xs opacity-70 mb-1" style={{ color: CLB.ink }}>Kategori</p>
                <p className="font-semibold" style={{ color: CLB.blue }}>{kategori.find(k => k.id === data.kategori)?.label}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: CLB.cream }}>
                <p className="text-xs opacity-70 mb-1" style={{ color: CLB.ink }}>Lokasi</p>
                <p className="font-semibold" style={{ color: CLB.blue }}>{data.lokasi}, {(D?.lokasi || []).find(l => l.id === data.kota)?.label}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: CLB.cream }}>
                <p className="text-xs opacity-70 mb-1" style={{ color: CLB.ink }}>Judul</p>
                <p className="font-semibold" style={{ color: CLB.blue }}>{data.judul}</p>
                <p className="text-xs mt-1" style={{ color: CLB.ink + '99' }}>{data.deskripsi}</p>
              </div>
              {data.fotoNama && <div className="p-3 rounded-lg" style={{ background: CLB.cream }}><p className="text-xs opacity-70 mb-1" style={{ color: CLB.ink }}>Foto</p><p className="font-semibold" style={{ color: CLB.blue }}>📷 {data.fotoNama}</p></div>}
              {data.anonim && <p className="text-xs italic" style={{ color: CLB.ink + '77' }}>🔒 Akan dikirim sebagai anonim.</p>}
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex justify-between gap-3">
        <LBBtn variant="ghost" onClick={prev} disabled={step === 0}>← Sebelumnya</LBBtn>
        {step < STEPS.length - 1 ? (
          <LBBtn variant="coral" onClick={next} disabled={!canNext}>Lanjut →</LBBtn>
        ) : (
          <LBBtn variant="coral" onClick={submit}>✓ Kirim Laporan</LBBtn>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { LaporBaru });

})();

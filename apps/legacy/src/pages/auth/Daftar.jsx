// PAGE: Daftar — register 3-step (email, OTP, profil)
// IIFE WRAP
(function() {

const CDF = window.C;
const { Pill: DFPill, Button: DFBtn } = window;
const { useState: useDFState } = React;

const STEPS = ['Email','OTP','Profil'];

function Daftar({ onNavigate }) {
  const D = window.JWData;
  const { actions } = window.JWStore;

  const [step, setStep] = useDFState(0);
  const [data, setData] = useDFState({ email: '', otp: '', name: '', chapter: '', topik: [] });

  const handleVerifyEmail = () => setStep(1);
  const handleVerifyOTP = () => setStep(2);
  const handleSubmit = () => {
    actions.setUser({ name: data.name, chapter: data.chapter, onboarded: true, level: 1, xp: 0 });
    setStep(3);
    setTimeout(() => onNavigate('beranda'), 1800);
  };

  const toggleTopik = (t) => setData({...data, topik: data.topik.includes(t) ? data.topik.filter(x => x !== t) : [...data.topik, t]});

  if (step === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center" style={{ background: CDF.cream }}>
        <div>
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="font-display text-3xl font-bold mb-3" style={{ color: CDF.blue }}>Selamat datang, {data.name}!</h1>
          <p className="text-sm" style={{ color: CDF.ink + '99' }}>KTP Wargamu sudah aktif. Mengarahkan ke beranda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: CDF.cream }}>
      <div className="w-full max-w-md">
        <button onClick={() => step === 0 ? onNavigate('login') : setStep(step - 1)} className="text-sm mb-6" style={{ color: CDF.coral }}>← Kembali</button>

        <div className="text-center mb-6">
          {window.NalaMascot && <div className="inline-block mb-2"><window.NalaMascot expression="excited" size={70} /></div>}
          <h1 className="font-display text-2xl font-bold" style={{ color: CDF.blue }}>Daftar Jubir Warga</h1>
          <p className="text-sm mt-1" style={{ color: CDF.ink + '99' }}>3 langkah, ±90 detik</p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex items-center gap-1">
              <div className="flex-1 h-1.5 rounded-full" style={{ background: i <= step ? CDF.coral : CDF.line }} />
              <span className="text-[10px] font-mono whitespace-nowrap" style={{ color: i <= step ? CDF.coral : CDF.ink + '55' }}>{s}</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border bg-white p-6" style={{ borderColor: CDF.line }}>
          {step === 0 && (
            <div>
              <h2 className="font-display font-bold text-xl mb-3" style={{ color: CDF.blue }}>Email kamu</h2>
              <input type="email" value={data.email} onChange={e => setData({...data, email: e.target.value})} placeholder="kamu@email.com" className="w-full p-3 rounded-lg outline-none text-sm mb-4" style={{ border: `1px solid ${CDF.line}` }} />
              <DFBtn variant="coral" className="w-full" onClick={handleVerifyEmail} disabled={!data.email.includes('@')}>Kirim kode verifikasi</DFBtn>

              <div className="my-4 text-center text-xs uppercase font-mono opacity-50" style={{ color: CDF.ink }}>atau</div>

              <button onClick={() => { actions.setUser({ name: 'Google User', onboarded: true }); onNavigate('beranda'); }} className="w-full p-3 rounded-xl border font-semibold text-sm flex items-center justify-center gap-3" style={{ borderColor: CDF.line, color: CDF.ink }}>
                <span style={{ width: 20, height: 20, borderRadius: 4, background: 'linear-gradient(45deg,#4285F4 0%,#EA4335 25%,#FBBC05 50%,#34A853 100%)', display: 'inline-block' }}></span>
                Daftar dengan Google
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-display font-bold text-xl mb-2" style={{ color: CDF.blue }}>Cek email kamu</h2>
              <p className="text-sm mb-4" style={{ color: CDF.ink + '99' }}>Kode 6 digit dikirim ke <strong>{data.email}</strong>.</p>
              <input value={data.otp} onChange={e => setData({...data, otp: e.target.value.replace(/\D/g,'').slice(0,6)})} placeholder="000000" className="w-full p-3 rounded-lg outline-none text-2xl font-mono text-center tracking-widest mb-4" style={{ border: `1px solid ${CDF.line}` }} />
              <DFBtn variant="coral" className="w-full" onClick={handleVerifyOTP} disabled={data.otp.length < 6}>Verifikasi</DFBtn>
              <p className="text-xs text-center mt-3" style={{ color: CDF.ink + '99' }}>Tidak terima? <button className="font-semibold" style={{ color: CDF.coral }}>Kirim ulang</button></p>
              <p className="text-xs text-center mt-1 opacity-50" style={{ color: CDF.ink }}>Demo: ketik 6 digit apa saja</p>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-display font-bold text-xl mb-4" style={{ color: CDF.blue }}>Profil singkat</h2>

              <div className="mb-4">
                <label className="text-xs font-mono uppercase opacity-70 block mb-1" style={{ color: CDF.ink }}>Nama tampilan</label>
                <input value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="Nama panggilan kamu" className="w-full p-3 rounded-lg outline-none text-sm" style={{ border: `1px solid ${CDF.line}` }} />
              </div>

              <div className="mb-4">
                <label className="text-xs font-mono uppercase opacity-70 block mb-1" style={{ color: CDF.ink }}>Chapter</label>
                <select value={data.chapter} onChange={e => setData({...data, chapter: e.target.value})} className="w-full p-3 rounded-lg outline-none text-sm" style={{ border: `1px solid ${CDF.line}`, background: '#fff' }}>
                  <option value="">— Pilih chapter terdekat —</option>
                  {(D?.chapters || []).map(c => <option key={c.id} value={c.name}>{c.name}{!c.active ? ' (waitlist)' : ''}</option>)}
                </select>
              </div>

              <div className="mb-5">
                <label className="text-xs font-mono uppercase opacity-70 block mb-2" style={{ color: CDF.ink }}>Topik favorit (max 3)</label>
                <div className="flex flex-wrap gap-1.5">
                  {(D?.topikUtama || []).slice(0,8).map(t => (
                    <button key={t.id} onClick={() => data.topik.length < 3 || data.topik.includes(t.id) ? toggleTopik(t.id) : null} className="px-2.5 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: data.topik.includes(t.id) ? CDF.coral : CDF.line, background: data.topik.includes(t.id) ? CDF.coral + '11' : '#fff', color: data.topik.includes(t.id) ? CDF.coral : CDF.ink + '99' }}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <DFBtn variant="coral" className="w-full" onClick={handleSubmit} disabled={!data.name || !data.chapter}>Selesai · Aktifkan KTP Warga</DFBtn>
            </div>
          )}
        </div>

        <p className="text-center text-sm mt-5" style={{ color: CDF.ink + '99' }}>
          Sudah punya akun? <button onClick={() => onNavigate('login')} className="font-semibold" style={{ color: CDF.coral }}>Masuk</button>
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { Daftar });

})();

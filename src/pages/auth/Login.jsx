// PAGE: Login — mock auth (email/pass + OAuth UI)
// IIFE WRAP
(function() {

const CL = window.C;
const { Button: LBtn } = window;
const { useState: useLState } = React;

function Login({ onNavigate }) {
  const { actions } = window.JWStore;
  const [email, setEmail] = useLState('');
  const [pass, setPass] = useLState('');
  const [showPass, setShowPass] = useLState(false);
  const [loading, setLoading] = useLState(false);

  const submit = (provider) => {
    setLoading(true);
    setTimeout(() => {
      actions.setUser({ onboarded: true, name: provider === 'google' ? 'Google User' : email.split('@')[0] || 'Warga' });
      setLoading(false);
      onNavigate('beranda');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: CL.cream }}>
      <div className="w-full max-w-md">
        <button onClick={() => onNavigate('beranda')} className="text-sm mb-6" style={{ color: CL.coral }}>← Kembali</button>

        <div className="text-center mb-8">
          {window.NalaMascot && <div className="inline-block mb-3"><window.NalaMascot expression="curious" size={80} /></div>}
          <h1 className="font-display text-3xl font-bold" style={{ color: CL.blue }}>Selamat datang lagi</h1>
          <p className="text-sm mt-2" style={{ color: CL.ink + '99' }}>Login untuk lanjut bersuara, berkarya, dan menagih janji.</p>
        </div>

        <div className="rounded-2xl border bg-white p-6 space-y-4" style={{ borderColor: CL.line }}>
          {/* OAuth */}
          <button onClick={() => submit('google')} disabled={loading} className="w-full p-3 rounded-xl border font-semibold text-sm flex items-center justify-center gap-3" style={{ borderColor: CL.line, color: CL.ink }}>
            <span style={{ width: 20, height: 20, borderRadius: 4, background: 'linear-gradient(45deg,#4285F4 0%,#EA4335 25%,#FBBC05 50%,#34A853 100%)', display: 'inline-block' }}></span>
            Lanjut dengan Google
          </button>
          <button onClick={() => alert('OTP WhatsApp coming soon di versi rilis')} className="w-full p-3 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2" style={{ borderColor: CL.line, color: CL.ink }}>
            💬 OTP via WhatsApp
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px" style={{ background: CL.line }}></div>
            <span className="text-xs uppercase font-mono" style={{ color: CL.ink + '77' }}>atau</span>
            <div className="flex-1 h-px" style={{ background: CL.line }}></div>
          </div>

          {/* Email/pass */}
          <div>
            <label className="text-xs font-mono uppercase opacity-70 block mb-1" style={{ color: CL.ink }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="kamu@email.com" className="w-full p-3 rounded-lg outline-none text-sm" style={{ border: `1px solid ${CL.line}` }} />
          </div>

          <div>
            <label className="text-xs font-mono uppercase opacity-70 block mb-1 flex justify-between" style={{ color: CL.ink }}>
              <span>Kata sandi</span>
              <button onClick={() => alert('Reset password coming soon')} className="text-xs normal-case font-normal" style={{ color: CL.coral }}>Lupa?</button>
            </label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" className="w-full p-3 pr-10 rounded-lg outline-none text-sm" style={{ border: `1px solid ${CL.line}` }} />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: CL.ink + '99' }}>{showPass ? '🙈' : '👁'}</button>
            </div>
          </div>

          <LBtn variant="coral" className="w-full" onClick={() => submit('email')} disabled={loading || !email || !pass}>
            {loading ? 'Memproses...' : 'Masuk'}
          </LBtn>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: CL.ink + '99' }}>
          Belum punya akun? <button onClick={() => onNavigate('daftar')} className="font-semibold" style={{ color: CL.coral }}>Daftar gratis</button>
        </p>

        <p className="text-center text-xs mt-8 opacity-70" style={{ color: CL.ink }}>
          Dengan masuk, kamu setuju dengan <button onClick={() => onNavigate('syarat')} className="underline">Syarat</button> dan <button onClick={() => onNavigate('privasi')} className="underline">Privasi</button> kami.
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { Login });

})();

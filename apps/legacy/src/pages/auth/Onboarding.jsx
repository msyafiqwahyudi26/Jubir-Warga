// ONBOARDING — 3-step flow

const { useState: useOState } = React;
const CO = window.C;

const TOPICS = [
  { id:'politik',    label:'Politik 🏛️'       },
  { id:'lingkungan', label:'Lingkungan 🌱'     },
  { id:'gender',     label:'Gender 💜'         },
  { id:'mental',     label:'Mental Health 🧠'  },
  { id:'ekonomi',    label:'Ekonomi 💸'        },
  { id:'pendidikan', label:'Pendidikan ✏️'     },
  { id:'budaya',     label:'Budaya Pop 🎬'     },
  { id:'teknologi',  label:'Teknologi ⚙️'     },
  { id:'lokal',      label:'Komunitas Lokal 🏘️'},
];

const ENTRY_OPTIONS = [
  { id:'main',      icon:'🎮', label:'Main mini game dulu',    sub:'Mulai ringan, coba Citizen Wordle' },
  { id:'karya',     icon:'✍️', label:'Lihat karya orang lain', sub:'Baca opini, tonton vlog, telusuri ilustrasi' },
  { id:'komunitas', icon:'💬', label:'Buka forum',             sub:'Langsung gabung diskusi warga' },
];

function Onboarding({ onComplete, onNavigate }) {
  const [step,       setStep]       = useOState(0);
  const [name,       setName]       = useOState('');
  const [kota,       setKota]       = useOState('');
  const [age,        setAge]        = useOState(22);
  const [topics,     setTopics]     = useOState([]);
  const [entryPoint, setEntryPoint] = useOState(null);

  const toggleTopic = id => {
    setTopics(prev =>
      prev.includes(id)
        ? prev.filter(t => t !== id)
        : prev.length < 5 ? [...prev, id] : prev
    );
  };

  const finish = () => {
    onComplete();
    if (entryPoint) onNavigate(entryPoint);
  };

  const dot = (i) => (
    <div
      key={i}
      className="rounded-full transition-all duration-300"
      style={{
        width:      step === i ? 24 : 8,
        height:     8,
        background: step === i ? CO.coral : CO.line,
      }}
    />
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: CO.blue + 'EE' }}>
      <div className="relative rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" style={{ background: CO.cream }}>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 pt-6 pb-0">
          {[0, 1, 2].map(i => dot(i))}
        </div>

        <div className="p-7">

          {/* ── STEP 0 ── */}
          {step === 0 && (
            <div>
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">👋</div>
                <h2 className="font-display text-2xl font-bold" style={{ color: CO.blue }}>Halo, kenalan dulu.</h2>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: CO.ink + '88' }}>
                  Datamu cuma kita pakai untuk bikin pengalaman lebih pas, bukan untuk dijual.{' '}
                  <span style={{ color: CO.coral }}>Janji.</span>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: CO.ink }}>Nama kamu</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Mis: Aulia Pratiwi"
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors"
                    style={{ borderColor: name ? CO.blue : CO.line, background: '#fff', color: CO.ink }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: CO.ink }}>Kota kamu</label>
                  <input
                    value={kota}
                    onChange={e => setKota(e.target.value)}
                    placeholder="Mis: Bandung"
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors"
                    style={{ borderColor: kota ? CO.blue : CO.line, background: '#fff', color: CO.ink }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: CO.ink }}>
                    Umur:{' '}
                    <span className="font-mono" style={{ color: CO.coral }}>{age} tahun</span>
                  </label>
                  <input
                    type="range" min={17} max={39} value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: CO.ink + '55' }}>
                    <span>17</span><span>39</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(1)}
                disabled={!name || !kota}
                className="btn-base w-full mt-6 py-3 rounded-xl font-semibold text-sm"
                style={{ background: CO.coral, color: '#fff', opacity: (!name || !kota) ? .4 : 1 }}
              >
                Lanjut →
              </button>
            </div>
          )}

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🔍</div>
                <h2 className="font-display text-2xl font-bold" style={{ color: CO.blue }}>Apa yang kamu peduli?</h2>
                <p className="text-sm mt-2" style={{ color: CO.ink + '88' }}>
                  Pilih <strong>2–5 topik</strong> yang paling penting buat kamu.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {TOPICS.map(t => {
                  const sel = topics.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleTopic(t.id)}
                      className="px-4 py-2 rounded-xl text-sm font-medium transition-all border"
                      style={{
                        borderColor: sel ? CO.coral : CO.line,
                        background:  sel ? CO.coral : '#fff',
                        color:        sel ? '#fff'   : CO.ink,
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <p className="text-center text-xs mt-3" style={{ color: CO.ink + '55' }}>
                {topics.length}/5 dipilih
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(0)}
                  className="btn-base flex-1 py-3 rounded-xl text-sm font-semibold border-2"
                  style={{ borderColor: CO.line, color: CO.ink + '88' }}
                >← Balik</button>
                <button
                  onClick={() => setStep(2)}
                  disabled={topics.length < 2}
                  className="btn-base flex-1 py-3 rounded-xl text-sm font-semibold"
                  style={{ background: CO.coral, color: '#fff', opacity: topics.length < 2 ? .4 : 1 }}
                >Lanjut →</button>
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🚪</div>
                <h2 className="font-display text-2xl font-bold" style={{ color: CO.blue }}>Pintu masuk kamu?</h2>
                <p className="text-sm mt-2" style={{ color: CO.ink + '88' }}>Mau mulai dari mana dulu?</p>
              </div>

              <div className="space-y-3">
                {ENTRY_OPTIONS.map(opt => {
                  const sel = entryPoint === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setEntryPoint(opt.id)}
                      className="w-full p-4 rounded-xl border text-left transition-all"
                      style={{
                        borderColor: sel ? CO.coral : CO.line,
                        background:  sel ? CO.coral + '11' : '#fff',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{opt.icon}</span>
                        <div>
                          <div className="font-semibold text-sm" style={{ color: CO.blue }}>{opt.label}</div>
                          <div className="text-xs mt-0.5" style={{ color: CO.ink + '66' }}>{opt.sub}</div>
                        </div>
                        {sel && <span className="ml-auto" style={{ color: CO.coral }}>✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="btn-base flex-1 py-3 rounded-xl text-sm font-semibold border-2"
                  style={{ borderColor: CO.line, color: CO.ink + '88' }}
                >← Balik</button>
                <button
                  onClick={finish}
                  disabled={!entryPoint}
                  className="btn-base flex-1 py-3 rounded-xl text-sm font-semibold"
                  style={{ background: CO.coral, color: '#fff', opacity: !entryPoint ? .4 : 1 }}
                >Mulai! 🎉</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Onboarding });

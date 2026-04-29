// PAGE: TebakPasal — kutipan UU + 4 pilihan, tebak pasal yang benar
// IIFE WRAP
(function() {

const CTP = window.C;
const { Pill: TPPill, Button: TPBtn } = window;
const { useState: useTPState } = React;

function TebakPasal({ onNavigate }) {
  const D = window.JWData;
  const { actions } = window.JWStore;

  const QUIZ = D?.pasalQuiz || [];
  const [i, setI] = useTPState(0);
  const [picked, setPicked] = useTPState(null);
  const [score, setScore] = useTPState(0);
  const [done, setDone] = useTPState(false);

  const current = QUIZ[i] || { pilihan: [] };

  const pick = (idx) => {
    if (picked !== null) return;
    setPicked(idx);
    if (current.pilihan[idx]?.benar) setScore(score + 1);
  };

  const next = () => {
    if (i + 1 >= QUIZ.length) {
      setDone(true);
      if (score >= 3) actions.bumpGameWin('tebakPasal');
      else actions.bumpGameLoss('tebakPasal');
    } else { setI(i + 1); setPicked(null); }
  };

  const restart = () => { setI(0); setPicked(null); setScore(0); setDone(false); };

  if (done) {
    const pct = Math.round((score / QUIZ.length) * 100);
    const verdict = pct >= 80 ? { msg: '🏆 Sarjana Konstitusi!', color: CTP.mint } :
                    pct >= 60 ? { msg: '👍 Cukup paham UUD.', color: CTP.marigold } :
                                { msg: '📚 Butuh refresh PPKn.', color: CTP.coral };
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="text-6xl mb-4">⚖️</div>
        <h1 className="font-display font-bold text-3xl mb-2" style={{ color: CTP.blue }}>Skor: {score}/{QUIZ.length}</h1>
        <p className="text-base mb-2" style={{ color: verdict.color, fontWeight: 600 }}>{verdict.msg}</p>
        <p className="text-sm mb-6" style={{ color: CTP.ink + '99' }}>Kamu menjawab {pct}% dengan benar.</p>
        <div className="flex gap-2 justify-center">
          <TPBtn variant="outline" onClick={restart}>↻ Main Lagi</TPBtn>
          <TPBtn variant="coral" onClick={() => onNavigate('main')}>Game Lain →</TPBtn>
        </div>

        <div className="mt-10 p-5 rounded-2xl text-left" style={{ background: CTP.cream, border: `1px solid ${CTP.line}` }}>
          <p className="font-hand text-base mb-2" style={{ color: CTP.coral }}>Bonus learning</p>
          <p className="text-sm" style={{ color: CTP.ink }}>UUD 1945 punya 4 pilar: <strong>Pancasila, UUD 1945, NKRI, Bhinneka Tunggal Ika</strong>. Pasal HAM (28A-28J) hasil amandemen ke-2 tahun 2000 — sebelumnya, jaminan HAM lebih terbatas.</p>
        </div>
      </div>
    );
  }

  if (QUIZ.length === 0) {
    return <div className="max-w-md mx-auto px-6 py-16 text-center"><p>Loading quiz...</p></div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <button onClick={() => onNavigate('main')} className="text-sm mb-4" style={{ color: CTP.coral }}>← Kembali ke Main</button>

      <div className="text-center mb-6">
        <span className="font-hand text-lg" style={{ color: CTP.coral }}>⚖️ Tebak Pasal</span>
        <h1 className="font-display font-bold text-2xl md:text-3xl mt-1" style={{ color: CTP.blue }}>Cocokkan kutipan dengan pasalnya</h1>
        <p className="text-sm mt-2" style={{ color: CTP.ink + '99' }}>Soal {i + 1} dari {QUIZ.length} · Skor: {score}</p>
      </div>

      {/* Progress */}
      <div className="w-full h-1.5 rounded-full mb-6" style={{ background: CTP.line }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${((i + 1) / QUIZ.length) * 100}%`, background: CTP.coral }} />
      </div>

      {/* Kutipan */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: CTP.blue, color: CTP.cream }}>
        <p className="text-xs uppercase font-mono opacity-70 mb-3">Kutipan UU</p>
        <p className="font-display italic text-lg md:text-xl leading-snug">{current.kutipan}</p>
      </div>

      <div className="space-y-2 mb-4">
        {current.pilihan.map((p, idx) => {
          let bg = '#fff', border = CTP.line, color = CTP.ink, prefix = String.fromCharCode(65 + idx);
          if (picked !== null) {
            if (p.benar) { bg = CTP.mint + '20'; border = CTP.mint; color = CTP.mint; prefix = '✓'; }
            else if (idx === picked) { bg = CTP.coral + '15'; border = CTP.coral; color = CTP.coral; prefix = '✕'; }
            else { color = CTP.ink + '77'; }
          }
          return (
            <button key={idx} onClick={() => pick(idx)} disabled={picked !== null}
              className="w-full text-left p-4 rounded-xl border-2 flex items-center gap-3" style={{ background: bg, borderColor: border, color, cursor: picked === null ? 'pointer' : 'default' }}>
              <span className="w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-sm flex-shrink-0" style={{ background: color + '22', color }}>{prefix}</span>
              <span className="font-semibold text-sm">{p.label}</span>
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <>
          <div className="rounded-xl p-4 mb-4" style={{ background: CTP.cream, border: `1px solid ${CTP.line}` }}>
            <p className="text-xs uppercase font-mono opacity-70 mb-1" style={{ color: CTP.ink }}>💡 Penjelasan</p>
            <p className="text-sm" style={{ color: CTP.ink }}>{current.penjelasan}</p>
          </div>
          <TPBtn variant="coral" className="w-full" onClick={next}>
            {i + 1 < QUIZ.length ? 'Soal berikut →' : 'Lihat skor akhir →'}
          </TPBtn>
        </>
      )}
    </div>
  );
}

Object.assign(window, { TebakPasal });

})();

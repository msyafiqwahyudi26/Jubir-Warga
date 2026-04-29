// PAGE: SpotHoaks — 4 headline, mana yang hoaks?
// IIFE WRAP
(function() {

const CSH = window.C;
const { Pill: SHPill, Button: SHBtn } = window;
const { useState: useSHState, useEffect: useSHEffect } = React;

function SpotHoaks({ onNavigate }) {
  const D = window.JWData;
  const { actions } = window.JWStore;

  const QUIZ = D?.hoaksQuiz || [];
  const [i, setI] = useSHState(0);
  const [picked, setPicked] = useSHState(null);
  const [score, setScore] = useSHState(0);
  const [done, setDone] = useSHState(false);

  const current = QUIZ[i] || { headlines: [] };

  const pick = (idx) => {
    if (picked !== null) return;
    setPicked(idx);
    if (current.headlines[idx]?.hoaks) setScore(score + 1);
  };

  const next = () => {
    if (i + 1 >= QUIZ.length) {
      setDone(true);
      if (score >= 3) actions.bumpGameWin('spotHoaks');
      else actions.bumpGameLoss('spotHoaks');
    } else {
      setI(i + 1);
      setPicked(null);
    }
  };

  const restart = () => { setI(0); setPicked(null); setScore(0); setDone(false); };

  if (done) {
    const pct = Math.round((score / QUIZ.length) * 100);
    const verdict = pct >= 80 ? { msg: '🏆 Hoax Hunter sejati!', color: CSH.mint } : pct >= 60 ? { msg: '👍 Cukup sigap, terus latih.', color: CSH.marigold } : { msg: '⚠️ Wah, hampir kena tipu! Pelajari lagi.', color: CSH.coral };
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="font-display font-bold text-3xl mb-2" style={{ color: CSH.blue }}>Skor kamu: {score}/{QUIZ.length}</h1>
        <p className="text-base mb-2" style={{ color: verdict.color, fontWeight: 600 }}>{verdict.msg}</p>
        <p className="text-sm mb-6" style={{ color: CSH.ink + '99' }}>Kamu menjawab {pct}% dengan benar.</p>
        <div className="flex gap-2 justify-center">
          <SHBtn variant="outline" onClick={restart}>↻ Main Lagi</SHBtn>
          <SHBtn variant="coral" onClick={() => onNavigate('main')}>Game Lain →</SHBtn>
        </div>

        <div className="mt-10 p-5 rounded-2xl text-left" style={{ background: CSH.cream, border: `1px solid ${CSH.line}` }}>
          <p className="font-hand text-base mb-2" style={{ color: CSH.coral }}>Tips Spot Hoaks</p>
          <ul className="text-sm space-y-1.5" style={{ color: CSH.ink }}>
            <li>• Cek sumber: media kredibel atau akun tidak jelas?</li>
            <li>• Bahasa berlebihan ("MENGEJUTKAN!", "BAHAYA!") = waspada.</li>
            <li>• Cross-check di Mafindo, Kompas Cek Fakta, Tirto.</li>
            <li>• Reverse image search untuk foto yang dipakai.</li>
          </ul>
        </div>
      </div>
    );
  }

  if (QUIZ.length === 0) {
    return <div className="max-w-md mx-auto px-6 py-16 text-center"><p>Loading quiz...</p></div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <button onClick={() => onNavigate('main')} className="text-sm mb-4" style={{ color: CSH.coral }}>← Kembali ke Main</button>

      <div className="text-center mb-6">
        <span className="font-hand text-lg" style={{ color: CSH.coral }}>🔍 Spot the Hoaks</span>
        <h1 className="font-display font-bold text-2xl md:text-3xl mt-1" style={{ color: CSH.blue }}>Mana yang hoaks?</h1>
        <p className="text-sm mt-2" style={{ color: CSH.ink + '99' }}>Soal {i + 1} dari {QUIZ.length} · Skor: {score}</p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full mb-6" style={{ background: CSH.line }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${((i + 1) / QUIZ.length) * 100}%`, background: CSH.coral }} />
      </div>

      <div className="space-y-3 mb-6">
        {current.headlines.map((h, idx) => {
          let bg = '#fff', border = CSH.line, color = CSH.ink, suffix = null;
          if (picked !== null) {
            if (h.hoaks) { bg = CSH.coral + '15'; border = CSH.coral; color = CSH.coral; suffix = ' 🚫 HOAKS'; }
            else if (idx === picked) { bg = CSH.line; color = CSH.ink + '99'; }
            else { bg = '#fff'; color = CSH.ink + '77'; }
          }
          return (
            <button key={idx} onClick={() => pick(idx)} disabled={picked !== null}
              className="w-full text-left p-4 rounded-xl border-2" style={{ background: bg, borderColor: border, color, cursor: picked === null ? 'pointer' : 'default' }}>
              <p className="font-display font-semibold text-base leading-snug">{h.text}{suffix && <span className="font-mono text-xs ml-2" style={{ color: CSH.coral }}>{suffix}</span>}</p>
              {picked !== null && h.source && <p className="text-xs mt-2 opacity-70">Sumber: {h.source}</p>}
              {picked !== null && h.reason && <p className="text-xs mt-2 italic" style={{ color: CSH.coral }}>{h.reason}</p>}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <SHBtn variant="coral" className="w-full" onClick={next}>
          {i + 1 < QUIZ.length ? 'Soal berikut →' : 'Lihat skor akhir →'}
        </SHBtn>
      )}
    </div>
  );
}

Object.assign(window, { SpotHoaks });

})();

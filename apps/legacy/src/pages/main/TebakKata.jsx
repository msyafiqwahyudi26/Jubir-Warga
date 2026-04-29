// WORDLE — Tebak Kata Hari Ini playable mini game

const { useState: useWState, useEffect: useWEffect, useCallback: useWCallback } = React;

const C_W = window.C;

const CIVIC_WORDS = ['WARGA','SUARA','PASAL','SAKSI','DAPIL','KORUM','DEBAT','CALON','NEGRI'];
const TARGET_WORD = 'WARGA';

const CIVIC_FACTS = {
  WARGA: 'Warga negara Indonesia memiliki hak memilih sejak usia 17 tahun. Partisipasi aktif dalam demokrasi bukan sekadar hak — ini kewajiban bersama.',
  SUARA: 'Dalam sistem pemilu proporsional terbuka Indonesia, suara terbanyak pada caleg di sebuah dapil menentukan siapa yang melenggang ke parlemen.',
  PASAL: 'UUD 1945 memiliki 37 pasal. Pasal 28 A–J tentang Hak Asasi Manusia adalah produk amandemen 1999–2002 yang paling sering jadi dasar advokasi warga.',
  SAKSI: 'Setiap partai peserta pemilu berhak menempatkan saksi di TPS. Kehadiran saksi yang kompeten adalah garda pertama transparansi penghitungan suara.',
  DAPIL: 'Dapil (Daerah Pemilihan) menentukan berapa kursi DPR yang diperebutkan di sebuah wilayah. Semakin besar dapil, semakin proporsional hasilnya.',
};

const DEFAULT_FACT = 'Partisipasi warga yang aktif dan kritis adalah fondasi demokrasi yang sehat, akuntabel, dan berorientasi pada kepentingan publik.';

const KEYBOARD_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
];

function getTileStyle(status, revealed) {
  if (!revealed) return { background: 'transparent', color: C_W.blue, borderColor: C_W.line };
  const map = {
    correct: { background: C_W.mint,     color: '#fff', borderColor: C_W.mint },
    present: { background: C_W.marigold, color: '#fff', borderColor: C_W.marigold },
    absent:  { background: '#8A9099',    color: '#fff', borderColor: '#8A9099' },
  };
  return map[status] || { background: C_W.line, color: C_W.ink, borderColor: C_W.line };
}

function getKeyStyle(status) {
  const map = {
    correct: { background: C_W.mint,     color: '#fff' },
    present: { background: C_W.marigold, color: '#fff' },
    absent:  { background: '#8A9099',    color: '#fff' },
  };
  return map[status] || { background: C_W.line, color: C_W.ink };
}

function evaluateGuess(word, target) {
  const result = Array(5).fill('absent');
  const tArr = target.split('');
  const wArr = word.split('');
  for (let i = 0; i < 5; i++) {
    if (wArr[i] === tArr[i]) { result[i] = 'correct'; tArr[i] = null; wArr[i] = null; }
  }
  for (let i = 0; i < 5; i++) {
    if (wArr[i] !== null) {
      const idx = tArr.indexOf(wArr[i]);
      if (idx !== -1) { result[i] = 'present'; tArr[idx] = null; }
    }
  }
  return result;
}

function TebakKata({ onOpenPage, compact = false }) {
  const [guesses,    setGuesses]    = useWState([]);
  const [current,    setCurrent]    = useWState('');
  const [gameState,  setGameState]  = useWState('playing'); // 'playing'|'won'|'lost'
  const [shakeRow,   setShakeRow]   = useWState(false);
  const [revealRow,  setRevealRow]  = useWState(-1);
  const [keyStates,  setKeyStates]  = useWState({});
  const [streak,     setStreak]     = useWState(5);
  const [showResult, setShowResult] = useWState(false);
  const [popCol,     setPopCol]     = useWState(-1);

  const MAX = 6;
  const target = TARGET_WORD;

  const submit = useWCallback(() => {
    if (gameState !== 'playing') return;
    if (current.length !== 5) {
      setShakeRow(true);
      setTimeout(() => setShakeRow(false), 450);
      return;
    }
    const statuses  = evaluateGuess(current, target);
    const newGuess  = { word: current, statuses };
    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setCurrent('');
    setRevealRow(newGuesses.length - 1);

    const nk = { ...keyStates };
    current.split('').forEach((ch, i) => {
      const s = statuses[i];
      const p = nk[ch];
      if (!p || (p === 'absent') || (p === 'present' && s === 'correct')) nk[ch] = s;
    });
    setKeyStates(nk);

    const won = current === target;
    const lost = !won && newGuesses.length >= MAX;
    if (won || lost) {
      setTimeout(() => {
        if (won) setStreak(s => s + 1);
        setShowResult(true);
        setGameState(won ? 'won' : 'lost');
      }, 5 * 200 + 400);
    }
  }, [current, guesses, keyStates, gameState, target]);

  const press = useWCallback((key) => {
    if (gameState !== 'playing') return;
    if (key === 'ENTER')   { submit(); return; }
    if (key === '⌫' || key === 'BACKSPACE') { setCurrent(c => c.slice(0, -1)); return; }
    if (/^[A-Z]$/.test(key) && current.length < 5) {
      setCurrent(c => c + key);
      setPopCol(current.length);
      setTimeout(() => setPopCol(-1), 120);
    }
  }, [current, gameState, submit]);

  useWEffect(() => {
    const handler = e => {
      const k = e.key.toUpperCase();
      if (k === 'ENTER' || k === 'BACKSPACE' || /^[A-Z]$/.test(k)) press(k);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [press]);

  const resetGame = () => {
    setGuesses([]); setCurrent(''); setGameState('playing');
    setKeyStates({}); setRevealRow(-1); setShowResult(false);
  };

  const curRow = guesses.length;

  return (
    <div className="flex flex-col items-center gap-5 py-4 select-none" style={{ color: C_W.blue }}>
      {/* Header */}
      <div className="text-center">
        <h3 className="font-display font-bold text-xl" style={{ color: compact ? C_W.cream : C_W.blue }}>
          Tebak Kata Hari Ini
        </h3>
        <p className="text-xs mt-0.5" style={{ color: compact ? C_W.cream+'88' : C_W.ink+'77' }}>
          Tebak kata civic 5 huruf · 6 percobaan
        </p>
        <div className="mt-2 flex items-center justify-center gap-1.5">
          <span>🔥</span>
          <span className="font-mono font-bold" style={{ color: C_W.coral }}>{streak}</span>
          <span className="text-xs" style={{ color: compact ? C_W.cream+'66' : C_W.ink+'55' }}>hari berturut-turut</span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex flex-col gap-1.5">
        {Array(MAX).fill(null).map((_, rowIdx) => {
          const guess     = guesses[rowIdx];
          const isCurrent = rowIdx === curRow && gameState === 'playing';
          const isShake   = isCurrent && shakeRow;
          return (
            <div key={rowIdx} className={`flex gap-1.5 ${isShake ? 'row-shake' : ''}`}>
              {Array(5).fill(null).map((_, colIdx) => {
                let letter = '', status = '', revealed = false;
                if (guess) { letter = guess.word[colIdx]; status = guess.statuses[colIdx]; revealed = true; }
                else if (isCurrent) letter = current[colIdx] || '';

                const isPopping = isCurrent && colIdx === popCol && !revealed;
                const flipDelay  = colIdx * 200;
                const shouldFlip = revealed && rowIdx === revealRow;
                const tileStyle  = getTileStyle(status, revealed);

                return (
                  <div
                    key={colIdx}
                    className={`wtile ${shouldFlip ? 'flip-tile' : ''} ${isPopping ? 'tile-pop' : ''}`}
                    style={{
                      ...tileStyle,
                      animationDelay: shouldFlip ? `${flipDelay}ms` : '0ms',
                      transform: letter && !revealed ? 'scale(1.06)' : 'scale(1)',
                      borderColor: letter && !revealed && !isPopping ? C_W.blue + 'AA' : tileStyle.borderColor,
                    }}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Keyboard */}
      <div className="flex flex-col gap-1.5 w-full" style={{ maxWidth: 340 }}>
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1 justify-center">
            {row.map(key => {
              const ks = keyStates[key];
              const w  = (key === 'ENTER' || key === '⌫') ? 'auto' : 30;
              const px = (key === 'ENTER' || key === '⌫') ? '10px' : '0';
              return (
                <button
                  key={key}
                  className="wkey"
                  style={{ ...getKeyStyle(ks), minWidth: w, paddingLeft: px, paddingRight: px }}
                  onClick={() => press(key)}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Result Modal */}
      {showResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 backdrop-blur-sm" style={{ background: C_W.blue + '77' }} />
          <div className="relative rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center" style={{ background: C_W.cream }}>
            <div className="text-5xl mb-3">{gameState === 'won' ? '🎉' : '😔'}</div>
            <h3 className="font-display text-2xl font-bold mb-1" style={{ color: C_W.blue }}>
              {gameState === 'won' ? 'Mantap, Warga!' : 'Coba lagi besok!'}
            </h3>
            <p className="text-sm mb-1" style={{ color: C_W.ink + '77' }}>Kata hari ini:</p>
            <p className="font-display text-3xl font-bold mb-4" style={{ color: C_W.coral }}>{target}</p>

            <div className="rounded-xl p-4 mb-5 text-left" style={{ background: C_W.blue + '0D', border: `1px solid ${C_W.line}` }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: C_W.blue }}>🧠 Tahukah kamu?</p>
              <p className="text-sm leading-relaxed" style={{ color: C_W.ink + 'CC' }}>
                {CIVIC_FACTS[target] || DEFAULT_FACT}
              </p>
            </div>

            {gameState === 'won' && (
              <div className="flex items-center justify-center gap-2 mb-4">
                <span>🔥</span>
                <span className="font-mono font-bold text-lg" style={{ color: C_W.coral }}>{streak}</span>
                <span className="text-sm" style={{ color: C_W.ink + '77' }}>hari berturut-turut!</span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {onOpenPage && (
                <>
                  <button
                    className="btn-base w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                    style={{ background: C_W.blue, color: C_W.cream }}
                    onClick={() => onOpenPage('komunitas')}
                  >💬 Diskusi di Forum →</button>
                  <button
                    className="btn-base w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border-2"
                    style={{ borderColor: C_W.blue, color: C_W.blue }}
                    onClick={() => onOpenPage('kelas')}
                  >📚 Pelajari di Kelas →</button>
                </>
              )}
              <button className="text-xs mt-1" style={{ color: C_W.ink + '55' }} onClick={resetGame}>
                ↺ Reset (Demo)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Backward compat: keep both names exposed
const CitizenWordle = TebakKata;
Object.assign(window, { TebakKata, CitizenWordle });

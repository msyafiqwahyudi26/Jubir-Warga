// PAGE: LessonPlayer — video mock + transcript + quiz + diskusi cohort + Coach Nala
(function() {

const CLP = window.C;
const { Pill: LPPill, Button: LPBtn, UserAvatar: LPAvatar } = window;
const { useState: useLPState } = React;

const TRANSCRIPT = `[00:00] Halo, selamat datang di Modul 4 — Menulis Opini Publik.
[00:15] Di modul ini kita belajar 3 hal: angle yang fresh, struktur yang dibaca tuntas, headline yang bikin klik.
[00:42] Pertama, soal angle. Kalau argumenmu sudah pernah dibilang 100x oleh orang lain, kemungkinan besar tidak akan dibaca.
[01:18] Cari perspektif dari kelompok yang biasanya tidak punya panggung. Pekerja pabrik soal otomatisasi. Anak SMP soal sekolah.
[02:05] Kedua, soal struktur. Format yang aman: hook → claim → 3 evidence → counter-argument → return.
[03:30] Hook itu kalimat pembuka yang bikin pembaca tidak bisa scroll ke artikel lain. Bukan thesis. Tapi gambar konkret atau pertanyaan yang menggelitik.
[04:12] Ketiga, soal headline. 80% pembaca hanya baca headline. Jadi 80% dari kerjamu = merumuskan 8-12 kata.
[05:00] Saya kasih 5 template headline yang konsisten kerja, lalu praktek bareng.
[05:45] Praktek di-upload sebagai assignment minggu ini.`;

const QUIZ = [
  {
    q: 'Mana yang BUKAN bagian dari format opini yang efektif?',
    options: [
      { label: 'Hook konkret', benar: false },
      { label: 'Claim yang jelas', benar: false },
      { label: 'Daftar referensi akademis lengkap', benar: true },
      { label: 'Counter-argument', benar: false },
    ],
    explain: 'Opini publik bukan paper akademik. Referensi lengkap justru bikin pembaca menyerah. Cantumkan sumber kunci di hyperlink.',
  },
  {
    q: 'Apa yang membuat sebuah angle opini "fresh"?',
    options: [
      { label: 'Mengulang argumen mainstream dengan bahasa lebih elegan', benar: false },
      { label: 'Menampilkan perspektif kelompok yang jarang punya panggung', benar: true },
      { label: 'Pakai data yang viral di media sosial', benar: false },
      { label: 'Mengkritik pemerintah dengan tone keras', benar: false },
    ],
    explain: 'Argumen 100x diulang = tidak akan dibaca. Angle fresh datang dari sudut pandang yang biasanya tidak terdengar.',
  },
];

const DISKUSI = [
  { authorId: 'u-aulia', body: 'Hook konkret itu konsep paling penting buat saya. Sebelum kelas ini opini saya selalu dibuka dengan "Belakangan ini, banyak orang bicara..." — boring banget.', time: '2 jam lalu' },
  { authorId: 'u-kanta', body: '5 template headline ini gold banget. Saya udah praktek di tulisan tarif parkir, dapat 3x click rate biasanya.', time: '4 jam lalu' },
];

function LessonPlayer({ onNavigate }) {
  const D = window.JWData;
  const { actions } = window.JWStore;
  const [tab, setTab] = useLPState('transcript');
  const [playing, setPlaying] = useLPState(false);
  const [progress] = useLPState(35);
  const [quizI, setQuizI] = useLPState(0);
  const [quizAnswered, setQuizAnswered] = useLPState(null);
  const [coachQ, setCoachQ] = useLPState('');

  const kelas = D?.byId?.kelas('kls-001') || D?.kelas?.[0] || { title: 'Kelas Jubir Warga', mentorId: 'u-bilal', modul: [] };
  const lesson = kelas.modul?.[3] || { id: 'm-4', title: 'Menulis Opini Publik', dur: '90 mnt' };
  const mentor = D?.byId?.user(kelas.mentorId) || { name: 'Bilal Sukarno', level: 6 };

  const handleAnswerQuiz = (i) => {
    setQuizAnswered(i);
    if (QUIZ[quizI].options[i].benar) actions.bumpGameWin('tebakKata');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <button onClick={() => onNavigate('kelas')} className="text-sm mb-4" style={{ color: CLP.coral }}>← Kembali ke Kelas</button>

      <div className="mb-4">
        <p className="text-xs" style={{ color: CLP.ink + '77' }}>{kelas.title}</p>
        <h1 className="font-display font-bold text-2xl md:text-3xl" style={{ color: CLP.blue }}>Modul 4: {lesson.title}</h1>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: CLP.line, background: '#000' }}>
            <div className="aspect-video relative flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1A2256 0%, #2A3375 100%)' }}>
              <button onClick={() => setPlaying(!playing)} className="w-20 h-20 rounded-full flex items-center justify-center text-3xl" style={{ background: CLP.cream, color: CLP.blue }}>{playing ? '⏸' : '▶'}</button>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="w-full h-1.5 rounded-full" style={{ background: CLP.cream + '33' }}>
                  <div className="h-full rounded-full" style={{ width: progress + '%', background: CLP.coral }} />
                </div>
                <div className="flex justify-between text-xs mt-2" style={{ color: CLP.cream + 'BB' }}>
                  <span className="font-mono">{Math.floor(progress * 0.9)}:00</span>
                  <span className="font-mono">{lesson.dur}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5" style={{ borderColor: CLP.line }}>
            <div className="flex items-center gap-3 flex-wrap">
              <LPAvatar name={mentor.name} size="sm" level={mentor.level} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: CLP.blue }}>{mentor.name}</p>
                <p className="text-xs" style={{ color: CLP.ink + '77' }}>Mentor</p>
              </div>
              <LPPill color="mint">⏱ {lesson.dur}</LPPill>
              <LPBtn variant="outline" size="sm">↓ Materi PDF</LPBtn>
            </div>
            <p className="text-sm mt-4" style={{ color: CLP.ink }}>Di modul ini kamu akan belajar cara menemukan angle opini yang fresh, struktur tulisan yang dibaca tuntas, dan teknik headline yang efektif.</p>
          </div>

          <div className="rounded-2xl border bg-white" style={{ borderColor: CLP.line }}>
            <div className="flex border-b" style={{ borderColor: CLP.line }}>
              {[['transcript','📝 Transkrip'],['quiz','✅ Quiz'],['diskusi','💬 Diskusi']].map(([id,label]) => (
                <button key={id} onClick={() => setTab(id)} className="flex-1 px-4 py-3 text-sm font-semibold border-b-2" style={{ borderColor: tab === id ? CLP.coral : 'transparent', color: tab === id ? CLP.coral : CLP.ink + '99' }}>{label}</button>
              ))}
            </div>
            <div className="p-5">
              {tab === 'transcript' && (
                <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed" style={{ color: CLP.ink }}>{TRANSCRIPT}</pre>
              )}

              {tab === 'quiz' && (
                <div>
                  <p className="text-xs mb-3" style={{ color: CLP.ink + '77' }}>Soal {quizI + 1} dari {QUIZ.length}</p>
                  <h4 className="font-display font-bold text-lg mb-4" style={{ color: CLP.blue }}>{QUIZ[quizI].q}</h4>
                  <div className="space-y-2">
                    {QUIZ[quizI].options.map((o, i) => {
                      const isCorrect = o.benar;
                      const isPicked = quizAnswered === i;
                      let bg = '#fff', border = CLP.line, color = CLP.ink;
                      if (quizAnswered !== null) {
                        if (isCorrect) { bg = CLP.mint + '22'; border = CLP.mint; color = CLP.mint; }
                        else if (isPicked) { bg = CLP.coral + '22'; border = CLP.coral; color = CLP.coral; }
                      }
                      return (
                        <button key={i} onClick={() => quizAnswered === null && handleAnswerQuiz(i)} disabled={quizAnswered !== null} className="w-full text-left p-3 rounded-lg border text-sm font-medium" style={{ background: bg, borderColor: border, color }}>
                          {String.fromCharCode(65+i)}. {o.label}
                          {quizAnswered !== null && isCorrect && ' ✓'}
                          {isPicked && !isCorrect && ' ✕'}
                        </button>
                      );
                    })}
                  </div>
                  {quizAnswered !== null && (
                    <div className="mt-4 p-4 rounded-lg" style={{ background: CLP.cream, border: `1px solid ${CLP.line}` }}>
                      <p className="text-sm" style={{ color: CLP.ink }}><strong>Penjelasan:</strong> {QUIZ[quizI].explain}</p>
                      {quizI < QUIZ.length - 1 ? (
                        <LPBtn variant="coral" size="sm" className="mt-3" onClick={() => { setQuizI(quizI + 1); setQuizAnswered(null); }}>Soal berikut →</LPBtn>
                      ) : (
                        <p className="mt-3 text-sm font-semibold" style={{ color: CLP.mint }}>🎉 Quiz selesai! Lanjut ke modul berikut.</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {tab === 'diskusi' && (
                <div className="space-y-3">
                  {DISKUSI.map((d, i) => {
                    const u = D?.byId?.user(d.authorId) || { name: 'Anonim', level: 1 };
                    return (
                      <div key={i} className="rounded-xl border p-3" style={{ borderColor: CLP.line }}>
                        <div className="flex items-start gap-2">
                          <LPAvatar name={u.name} size="sm" level={u.level} />
                          <div className="flex-1">
                            <p className="text-xs font-semibold" style={{ color: CLP.blue }}>{u.name} <span className="font-normal" style={{ color: CLP.ink + '77' }}>· {d.time}</span></p>
                            <p className="text-sm mt-1" style={{ color: CLP.ink }}>{d.body}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <textarea placeholder="Bagikan pemikiranmu dengan cohort..." rows={2} className="w-full p-3 rounded-lg outline-none text-sm resize-none" style={{ border: `1px solid ${CLP.line}` }} />
                  <div className="flex justify-end"><LPBtn variant="coral" size="sm">Post</LPBtn></div>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl p-5 sticky top-4" style={{ background: CLP.blue, color: CLP.cream }}>
            <div className="flex items-center gap-3 mb-3">
              {window.NalaMascot && <window.NalaMascot expression="mentor" size={60} />}
              <div>
                <p className="font-hand text-base" style={{ color: CLP.marigold }}>Coach Nala</p>
                <p className="text-xs opacity-80">Tanya saat butuh bantuan</p>
              </div>
            </div>
            <p className="text-sm mb-4 opacity-90">"Bingung di poin mana? Saya jelaskan ulang dengan contoh dari isu favoritmu."</p>
            <input value={coachQ} onChange={e => setCoachQ(e.target.value)} placeholder="Misal: contoh hook konkret?" className="w-full p-2.5 rounded-lg text-sm outline-none mb-2" style={{ background: CLP.cream, color: CLP.ink }} />
            <LPBtn variant="coral" size="sm" className="w-full">Tanya Coach Nala</LPBtn>
          </div>

          <div className="rounded-2xl border bg-white p-4" style={{ borderColor: CLP.line }}>
            <h4 className="font-semibold text-sm mb-3" style={{ color: CLP.blue }}>Progres Modul</h4>
            <div className="space-y-2">
              {(kelas.modul || []).slice(0, 6).map((m, i) => {
                const done = i < 3;
                const current = i === 3;
                return (
                  <div key={m.id} className="flex items-center gap-2 text-sm">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ background: done ? CLP.mint : current ? CLP.coral : CLP.line, color: done || current ? '#fff' : CLP.ink + '77' }}>{done ? '✓' : i + 1}</span>
                    <span style={{ color: current ? CLP.blue : CLP.ink + '99', fontWeight: current ? 700 : 400 }}>{m.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { LessonPlayer });

})();

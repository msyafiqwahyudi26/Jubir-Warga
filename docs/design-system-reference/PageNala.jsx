// PageNala — destination page untuk Nala (sahabat anak muda multi-topik)
// Layout: Hero kanan-kiri (mascot + intro) → Topic suggestions grid → Live chat panel → Recent conversations
const PageNala = ({ onNav }) => {
  const { Pill, Btn, Card, C } = window;

  const [mode, setMode] = React.useState('Tanya');
  const [draft, setDraft] = React.useState('');
  const [msgs, setMsgs] = React.useState([
    { who:'nala', text:'Hai! Aku Nala — sahabat ngobrolmu. Mau ngomongin apa hari ini? Politik, kerja, mental health, drakor, percintaan, isu lokal, apa pun — gas aja.' },
  ]);

  const Icon = ({ name, size = 14, color = 'currentColor', sw = 1.8 }) => {
    const paths = {
      'arrow-right': <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
      send: <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
      sparkles: <><path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/><path d="M19 14l.6 1.4L21 16l-1.4.6L19 18l-.6-1.4L17 16l1.4-.6z"/></>,
      heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
      brain: <><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 21.5a4 4 0 1 0 7.967-3.017 4 4 0 0 0 .556-6.588 4 4 0 0 0-2.526-5.77A3 3 0 1 0 12 5z"/></>,
      'message-square': <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
      briefcase: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
      'book-open': <><path d="M2 4h7a4 4 0 0 1 4 4v13"/><path d="M22 4h-7a4 4 0 0 0-4 4v13"/></>,
      film: <><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="7" y1="3" x2="7" y2="21"/><line x1="17" y1="3" x2="17" y2="21"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="2" y1="15" x2="22" y2="15"/></>,
      'pen-tool': <><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z"/><circle cx="6" cy="6" r="2"/></>,
      gavel: <><path d="M14 13l-7.586 7.586a2 2 0 1 1-2.828-2.828L11.172 10.172"/><path d="M16 16l6-6"/><path d="M8 8l6-6"/><path d="M9 7l8 8"/><path d="M21 11l-8-8"/></>,
      flame: <path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 1-3s-3 2-3 6a6 6 0 0 0 12 0c0-6-6-11-6-11z"/>,
      clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    }[name];
    return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths}</svg>;
  };

  const send = (t) => {
    const text = (t ?? draft).trim();
    if (!text) return;
    setMsgs(m => [...m, { who:'kamu', text }]);
    setDraft('');
    setTimeout(() => setMsgs(m => [...m, {
      who:'nala',
      text:'Oke, sini aku bantu. Coba ceritain lebih detail — situasinya gimana, dan kamu pengin aku bantu apa: dengerin, bantu bikin sudut pandang, atau sekalian draft kalimatnya?'
    }]), 700);
  };

  const modes = [
    { id:'Tanya', desc:'Sahabat ngobrol — bahas isu santai, tanya apa aja.', mascot:'mascot-nala.svg', tone:'cream' },
    { id:'Mentor', desc:'Coach belajar — di kelas, kuis, refleksi.', mascot:'mascot-nala-mentor.svg', tone:'mint' },
    { id:'Writing', desc:'Partner nulis — caption, esai, draft surat.', mascot:'mascot-nala-thinking.svg', tone:'marigold' },
    { id:'Advokasi', desc:'Riset partner — fact-check, sumber, sudut pandang.', mascot:'mascot-nala-confident.svg', tone:'coral' },
  ];
  const activeMode = modes.find(m => m.id === mode);

  const topics = [
    { icon:'gavel', title:'Politik & isu publik', sub:'Pasal, RUU, kebijakan', prompt:'Jelasin RUU PPRT yang lagi dibahas, santai aja' },
    { icon:'heart', title:'Percintaan & relasi', sub:'Drama, breakup, situationship', prompt:'Aku abis ditolak, butuh perspektif buat ngebenah diri' },
    { icon:'brain', title:'Mental health', sub:'Burnout, anxiety, batas', prompt:'Lagi burnout banget di kantor — tips first step?' },
    { icon:'briefcase', title:'Kerja & karir', sub:'Toxic workplace, gaji, transisi', prompt:'Atasan bossy banget, harus gimana tanpa bikin drama?' },
    { icon:'film', title:'Budaya pop & hiburan', sub:'Drakor, K-pop, indie ID', prompt:'Bahas dong kenapa drakor "Twinkling Watermelon" booming' },
    { icon:'book-open', title:'Pendidikan & belajar', sub:'Skripsi, ujian, skill baru', prompt:'Bantuin susun outline skripsi tema mental health Gen Z' },
    { icon:'pen-tool', title:'Bantu nulis', sub:'Caption, esai, surat', prompt:'Bantu draft caption IG buat post acara komunitasku' },
    { icon:'sparkles', title:'Apa aja deh', sub:'Random, iseng, eksplorasi', prompt:'Random fact yang menarik tentang sejarah Indonesia' },
  ];

  const recents = [
    { t:'Bantu draft caption peluncuran kampanye lingkungan', when:'kemarin', mode:'Writing' },
    { t:'Pendapat soal RUU TPKS — pro & kontra', when:'2 hari lalu', mode:'Advokasi' },
    { t:'Curhat soal atasan kantor yang manipulatif', when:'3 hari lalu', mode:'Tanya' },
    { t:'Refleksi kelas Demokrasi Modul 3', when:'5 hari lalu', mode:'Mentor' },
  ];

  return (
    <div>
      {/* ============ HERO ============ */}
      <section style={{ padding:'72px 24px 48px', background:C.blue, color:C.cream, position:'relative', overflow:'hidden' }}>
        {/* decorative halo */}
        <div style={{ position:'absolute', left:'-8%', top:'-30%', width:520, height:520, borderRadius:999, background:'radial-gradient(circle, rgba(232,99,43,0.18), transparent 65%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', right:'-10%', bottom:'-40%', width:540, height:540, borderRadius:999, background:'radial-gradient(circle, rgba(127,182,158,0.18), transparent 65%)', pointerEvents:'none' }}/>

        <div style={{ maxWidth:1152, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 360px', gap:48, alignItems:'center', position:'relative' }} className="nala-hero">
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 12px', borderRadius:999, background:'rgba(255,250,238,.10)', border:'1px solid rgba(255,250,238,.18)', marginBottom:18 }}>
              <span style={{ width:7, height:7, borderRadius:99, background:C.mint, boxShadow:'0 0 0 3px rgba(127,182,158,0.25)' }}/>
              <span style={{ font:'500 12px Inter', color:'#FFB78A', letterSpacing:'.06em' }}>NALA · ONLINE</span>
            </div>
            <h1 style={{ font:'700 72px/1.02 Vollkorn,serif', color:C.cream, letterSpacing:'-0.015em' }} className="nala-h1">
              Sahabat ngobrolmu,<br/>
              <em style={{ fontStyle:'italic', color:'#FFB78A' }}>buat apa aja.</em>
            </h1>
            <p style={{ marginTop:22, font:'400 18px/1.6 Inter', color:'rgba(255,250,238,.78)', maxWidth:560 }}>
              Politik, kerja, mental health, percintaan, drakor, isu lokal — apa aja gas. Aku selalu pakai sumber. Akan bilang "aku belum tahu" kalau memang belum tahu.
            </p>
            <div style={{ marginTop:14, font:'400 18px Caveat,cursive', color:'#FFB78A', transform:'rotate(-1deg)', display:'inline-block' }}>
              ← gak ada pertanyaan bodoh
            </div>
          </div>
          <div style={{ position:'relative', justifySelf:'center' }}>
            {/* mascot frame */}
            <div style={{
              width:300, height:320, background:'rgba(255,250,238,.06)', borderRadius:32,
              border:'1px solid rgba(255,250,238,.14)', display:'flex', alignItems:'flex-end', justifyContent:'center',
              padding:'0 0 4px', position:'relative'
            }}>
              <img src="../../assets/illustrations/mascot-nala-excited.svg" width={260} height={286} alt="Nala — excited" style={{ filter:'drop-shadow(0 12px 32px rgba(0,0,0,.25))' }}/>
              {/* speech bubble — handwritten */}
              <div style={{
                position:'absolute', top:18, left:-42,
                background:C.cream, color:C.blue, padding:'10px 14px', borderRadius:'14px 14px 14px 4px',
                font:'600 16px Caveat,cursive', boxShadow:'0 4px 14px rgba(0,0,0,.15)', transform:'rotate(-3deg)'
              }}>
                halo, mau ngobrol? ✨
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MODE SELECTOR ============ */}
      <section style={{ padding:'40px 24px 24px', borderBottom:`1px solid ${C.line}` }}>
        <div style={{ maxWidth:1152, margin:'0 auto' }}>
          <div style={{ marginBottom:20 }}>
            <h2 style={{ font:'600 24px Vollkorn,serif', color:C.blue, letterSpacing:'-0.005em' }}>Pilih mode ngobrol</h2>
            <p style={{ marginTop:4, fontSize:14, color:C.muted }}>Sama Nala, beda vibe sesuai kebutuhan.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }} className="nala-modes">
            {modes.map(m => {
              const active = mode === m.id;
              return (
                <button key={m.id} onClick={() => setMode(m.id)} style={{
                  padding:'18px 18px 16px', textAlign:'left', cursor:'pointer',
                  background: active ? C.blue : '#fff',
                  color: active ? C.cream : C.ink,
                  border: active ? `2px solid ${C.coral}` : `1px solid ${C.line}`,
                  borderRadius:16, fontFamily:'Inter,sans-serif',
                  display:'flex', flexDirection:'column', gap:8,
                  transition:'all .2s ease'
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <img src={`../../assets/illustrations/${m.mascot}`} width={36} height={40} alt="" style={{ flexShrink:0 }}/>
                    <span style={{ font:'700 17px Vollkorn,serif', color: active?C.cream:C.blue }}>{m.id}</span>
                  </div>
                  <div style={{ fontSize:12.5, color: active?'rgba(255,250,238,.72)':C.muted, lineHeight:1.45 }}>{m.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ MAIN CHAT ============ */}
      <section style={{ padding:'40px 24px', background:C.cream }}>
        <div style={{ maxWidth:1152, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 320px', gap:24 }} className="nala-main">
          {/* Chat area */}
          <div style={{ background:'#fff', border:`1px solid ${C.line}`, borderRadius:18, display:'flex', flexDirection:'column', minHeight:560 }}>
            {/* Chat header */}
            <div style={{ padding:'16px 20px', borderBottom:`1px solid ${C.line}`, display:'flex', alignItems:'center', gap:12 }}>
              <img src={`../../assets/illustrations/${activeMode.mascot}`} width={38} height={42} alt="Nala" style={{ flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ font:'700 16px Vollkorn,serif', color:C.blue }}>Nala — {mode}</div>
                <div style={{ fontSize:11, color:C.muted, display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ width:6, height:6, borderRadius:99, background:C.mint }}/>
                  online · selalu pakai sumber
                </div>
              </div>
              <button onClick={() => setMsgs([msgs[0]])} style={{
                fontSize:12, color:C.muted, background:'transparent', border:`1px solid ${C.line}`,
                borderRadius:8, padding:'6px 10px', cursor:'pointer', fontFamily:'Inter,sans-serif'
              }}>Reset</button>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:'auto', padding:'20px', display:'flex', flexDirection:'column', gap:14 }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display:'flex', gap:10, flexDirection: m.who==='kamu'?'row-reverse':'row' }}>
                  <div style={{
                    width:34, height:34, borderRadius:10, flexShrink:0,
                    background: m.who==='kamu' ? C.coral : C.blue,
                    color:C.cream, display:'flex', alignItems:'center', justifyContent:'center',
                    overflow:'hidden', font:'700 italic 14px Vollkorn,serif'
                  }}>
                    {m.who==='kamu' ? 'A' : <img src={`../../assets/illustrations/${activeMode.mascot}`} width={30} height={32} alt="Nala"/>}
                  </div>
                  <div style={{
                    maxWidth:'72%', padding:'12px 16px', borderRadius:14,
                    background: m.who==='kamu' ? C.blue : C.cream,
                    color: m.who==='kamu' ? C.cream : C.ink,
                    border: m.who==='kamu' ? 'none' : `1px solid ${C.line}`,
                    font:'400 14.5px/1.5 Inter,sans-serif'
                  }}>
                    {m.text}
                    {m.who==='nala' && i > 0 && (
                      <div style={{ marginTop:12, paddingTop:10, borderTop:`1px solid ${C.line}`, display:'flex', flexDirection:'column', gap:4 }}>
                        <span style={{ fontSize:10.5, color:C.muted, fontWeight:600, letterSpacing:'.05em', textTransform:'uppercase', marginBottom:2 }}>Sumber</span>
                        <a style={{ fontSize:12, color:C.coral, fontWeight:500, textDecoration:'none', cursor:'pointer' }}>· Komnas HAM, Laporan Tahunan 2025</a>
                        <a style={{ fontSize:12, color:C.coral, fontWeight:500, textDecoration:'none', cursor:'pointer' }}>· ICJR, Catatan UU ITE — Mar 2026</a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick prompts */}
            <div style={{ padding:'10px 20px', borderTop:`1px solid ${C.line}`, display:'flex', gap:6, flexWrap:'wrap' }}>
              {['Curhat soal kerja toxic', 'Bantu draft caption IG', 'Jelasin Pasal 28E santai', 'Ringkas thread forum'].map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  padding:'6px 12px', fontSize:12, borderRadius:999, cursor:'pointer',
                  background:'transparent', color:C.blue, border:`1px solid ${C.line}`,
                  fontFamily:'Inter,sans-serif', fontWeight:500
                }}>{s}</button>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding:'12px 20px 18px' }}>
              <div style={{ display:'flex', gap:8, padding:'10px 10px 10px 16px', background:'#fff', border:`1.5px solid ${C.line}`, borderRadius:14, alignItems:'center' }}>
                <input
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => e.key==='Enter' && send()}
                  placeholder={`Tanya Nala ${mode.toLowerCase()}…`}
                  style={{ flex:1, border:'none', outline:'none', background:'transparent', font:'400 14.5px Inter,sans-serif', color:C.ink }}
                />
                <button onClick={() => send()} style={{
                  width:38, height:38, borderRadius:10, border:'none', cursor:'pointer',
                  background:C.coral, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center'
                }}>
                  <Icon name="send" size={16} sw={2}/>
                </button>
              </div>
              <div style={{ marginTop:8, fontSize:11, color:C.muted, textAlign:'center', fontStyle:'italic' }}>
                Aku bisa salah. Selalu cek sumber yang aku kasih. Obrolan tidak dipakai untuk training.
              </div>
            </div>
          </div>

          {/* Sidebar — recent + tips */}
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {/* Recent */}
            <Card hoverable={false} style={{ padding:18 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:14 }}>
                <Icon name="clock" size={14} color={C.blue}/>
                <span style={{ font:'600 11px Inter', letterSpacing:'.10em', textTransform:'uppercase', color:C.muted }}>Obrolan terakhir</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {recents.map((r, i) => (
                  <button key={i} style={{
                    textAlign:'left', background:'transparent', border:'none', padding:0, cursor:'pointer',
                    borderBottom: i < recents.length-1 ? `1px dashed ${C.line}` : 'none',
                    paddingBottom: i < recents.length-1 ? 10 : 0
                  }}>
                    <div style={{ font:'500 13px/1.4 Inter', color:C.ink, marginBottom:4 }}>{r.t}</div>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:C.muted }}>
                      <span>{r.when}</span>
                      <span style={{ color:C.coral, fontWeight:500 }}>{r.mode}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Daily prompt */}
            <Card hoverable={false} style={{ padding:18, background:'#FCE9E1', borderColor:'#E8632B55' }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10 }}>
                <Icon name="flame" size={14} color={C.coral}/>
                <span style={{ font:'600 11px Inter', letterSpacing:'.10em', textTransform:'uppercase', color:C.coral }}>Pertanyaan hari ini</span>
              </div>
              <p style={{ font:'600 16px/1.4 Vollkorn,serif', color:C.ink, marginBottom:12 }}>
                "Apa hal kecil yang lagi kamu pikirin tapi belum sempat omongin sama siapa-siapa?"
              </p>
              <button onClick={() => send('Apa hal kecil yang lagi kamu pikirin tapi belum sempat omongin sama siapa-siapa?')} style={{
                width:'100%', padding:'8px 12px', borderRadius:8, border:`1.5px solid ${C.coral}`,
                background:'transparent', color:C.coral, fontWeight:600, fontSize:12, cursor:'pointer',
                fontFamily:'Inter,sans-serif'
              }}>Coba jawab →</button>
            </Card>

            {/* House rules */}
            <Card hoverable={false} style={{ padding:18 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10 }}>
                <Icon name="sparkles" size={14} color={C.blue}/>
                <span style={{ font:'600 11px Inter', letterSpacing:'.10em', textTransform:'uppercase', color:C.muted }}>House rules</span>
              </div>
              <ul style={{ margin:0, padding:'0 0 0 16px', fontSize:12, color:C.ink, lineHeight:1.7 }}>
                <li>Selalu cite sumber kalau ngomongin fakta</li>
                <li>Bilang "belum tahu" kalau memang belum tahu</li>
                <li>Tidak partisan & tidak nge-judge</li>
                <li>Obrolan rahasia, gak masuk training</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* ============ TOPIC GRID ============ */}
      <section style={{ padding:'56px 24px', borderTop:`1px solid ${C.line}` }}>
        <div style={{ maxWidth:1152, margin:'0 auto' }}>
          <div style={{ marginBottom:24 }}>
            <h2 style={{ font:'600 28px Vollkorn,serif', color:C.blue, letterSpacing:'-0.005em' }}>Atau mulai dari sini</h2>
            <p style={{ marginTop:6, fontSize:14, color:C.muted }}>8 topik favorit warga Jubir Warga. Klik untuk langsung ngobrol.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }} className="nala-topics">
            {topics.map((t, i) => (
              <button key={i} onClick={() => send(t.prompt)} style={{
                padding:'20px 18px', textAlign:'left', cursor:'pointer',
                background:'#fff', border:`1px solid ${C.line}`, borderRadius:14,
                fontFamily:'Inter,sans-serif',
                display:'flex', flexDirection:'column', gap:10,
                transition:'all .2s ease'
              }} onMouseEnter={e => { e.currentTarget.style.borderColor = C.coral; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                 onMouseLeave={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{
                  width:40, height:40, borderRadius:10, background:C.cream,
                  display:'flex', alignItems:'center', justifyContent:'center'
                }}>
                  <Icon name={t.icon} size={18} color={C.blue} sw={1.8}/>
                </div>
                <div>
                  <div style={{ font:'700 15px Vollkorn,serif', color:C.blue, marginBottom:3 }}>{t.title}</div>
                  <div style={{ fontSize:12, color:C.muted, lineHeight:1.4 }}>{t.sub}</div>
                </div>
                <div style={{ marginTop:'auto', fontSize:11, fontStyle:'italic', color:C.coral, paddingTop:8, borderTop:`1px dashed ${C.line}` }}>
                  "{t.prompt}"
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <section style={{ padding:'40px 24px', background:C.cream, borderTop:`1px solid ${C.line}` }}>
        <div style={{ maxWidth:1152, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:18 }} className="nala-trust">
          {[
            { h:'Sourced', sub:'Setiap fakta dilengkapi sumber yang bisa kamu klik & verifikasi sendiri.' },
            { h:'Tidak partisan', sub:'Aku ngasih sudut pandang, bukan instruksi siapa harus dipilih.' },
            { h:'Privasi terjamin', sub:'Obrolan kamu rahasia. Tidak dipakai untuk training model.' },
          ].map((s, i) => (
            <div key={i} style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <span style={{ width:8, height:8, borderRadius:99, background:C.mint, boxShadow:`0 0 0 3px rgba(127,182,158,0.20)` }}/>
                <span style={{ font:'700 14px Vollkorn,serif', color:C.blue }}>{s.h}</span>
              </div>
              <p style={{ fontSize:13, color:C.ink, opacity:.75, lineHeight:1.55, margin:0 }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .nala-hero, .nala-main { grid-template-columns: 1fr !important; }
          .nala-modes, .nala-topics { grid-template-columns: repeat(2, 1fr) !important; }
          .nala-trust { grid-template-columns: 1fr !important; }
          .nala-h1 { font-size: 48px !important; }
        }
      `}</style>
    </div>
  );
};

window.PageNala = PageNala;

// Slide-in AI panel
const AIPanel = ({ open, onClose }) => {
  const { Btn, C } = window;
  const [msgs, setMsgs] = React.useState([
    { who:'nala', text:'Hai! Aku Nala — sahabat ngobrolmu di Jubir Warga. Mau ngomongin apa hari ini? Politik, kerja, mental health, drakor, percintaan, atau apa pun — gas aja.' },
  ]);
  const [draft, setDraft] = React.useState('');
  const [mode, setMode] = React.useState('Tanya');

  const send = (t) => {
    const text = (t ?? draft).trim(); if(!text) return;
    setMsgs(m => [...m, { who:'kamu', text }]);
    setDraft('');
    setTimeout(() => setMsgs(m => [...m, {
      who:'nala',
      text:'Bagus, mari kita lihat. Aku punya 3 sudut pandang yang relevan, plus sumber dari Komnas HAM dan ICJR. Mau aku rangkum dulu, atau langsung ke datanya?'
    }]), 800);
  };

  return (
    <>
      <div onClick={onClose} style={{
        position:'fixed', inset:0, background:'rgba(26,34,86,.4)', backdropFilter:'blur(4px)',
        zIndex:50, opacity: open?1:0, pointerEvents: open?'auto':'none', transition:'opacity .3s'
      }}/>
      <aside style={{
        position:'fixed', top:0, right:0, bottom:0, width:480, background:C.cream,
        borderLeft:`1px solid ${C.line}`, zIndex:51, display:'flex', flexDirection:'column',
        transform: open?'translateX(0)':'translateX(100%)', transition:'transform .35s cubic-bezier(.4,0,.2,1)',
        boxShadow:'-20px 0 40px rgba(26,34,86,.18)'
      }}>
        {/* Header */}
        <div style={{ padding:'18px 20px', borderBottom:`1px solid ${C.line}`, display:'flex', alignItems:'center', gap:12 }}>
          <img src="../../assets/illustrations/mascot-nala.svg" width={38} height={38} style={{ borderRadius:10, background:C.blue, flexShrink:0 }} alt="Nala"/>
          <div style={{ flex:1 }}>
            <div style={{ font:'700 17px Vollkorn,serif', color:C.blue }}>Nala</div>
            <div style={{ fontSize:11, color:C.muted, display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ width:6, height:6, borderRadius:99, background:C.mint }}/> online · selalu pakai sumber
            </div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', fontSize:22, color:C.muted, lineHeight:1 }}>×</button>
        </div>

        {/* Mode tabs */}
        <div style={{ padding:'12px 20px 0', display:'flex', gap:6, flexWrap:'wrap' }}>
          {['Tanya','Coach Kelas','Writing Partner','Advocacy'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              padding:'5px 12px', fontSize:11, borderRadius:999, fontWeight:500,
              fontFamily:'Inter,sans-serif', cursor:'pointer',
              background: mode===m?C.blue:'transparent', color: mode===m?C.cream:C.ink,
              border: mode===m?'none':`1px solid ${C.line}`
            }}>{m}</button>
          ))}
        </div>

        {/* Conversation */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>
          {msgs.map((m,i) => (
            <div key={i} style={{ display:'flex', gap:10, marginBottom:14, flexDirection: m.who==='kamu'?'row-reverse':'row' }}>
              <div style={{ width:30, height:30, borderRadius:8, flexShrink:0, background: m.who==='kamu'?C.coral:C.blue, color:C.cream, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', fontFamily:'Vollkorn,serif', fontStyle:'italic', fontWeight:700, fontSize:14 }}>
                {m.who==='kamu' ? 'A' : <img src="../../assets/illustrations/mascot-nala.svg" width={26} height={26} alt="Nala"/>}
              </div>
              <div style={{
                maxWidth:340, padding:'10px 14px', borderRadius:14,
                background: m.who==='kamu'?C.blue:'#fff', color: m.who==='kamu'?C.cream:C.ink,
                border: m.who==='kamu'?'none':`1px solid ${C.line}`,
                fontSize:14, lineHeight:1.5, fontFamily:'Inter,sans-serif'
              }}>{m.text}
                {m.who==='nala' && i>0 && (
                  <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${C.line}`, display:'flex', flexDirection:'column', gap:5 }}>
                    <a style={{ fontSize:11, color:C.coral, fontWeight:500 }}>📄 Komnas HAM, Laporan Tahunan 2025</a>
                    <a style={{ fontSize:11, color:C.coral, fontWeight:500 }}>📄 ICJR, Catatan UU ITE — Mar 2026</a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Suggestions */}
        <div style={{ padding:'8px 20px', display:'flex', gap:6, flexWrap:'wrap' }}>
          {['Curhat soal kerja toxic','Bantu draft caption IG','Jelasin Pasal 28E santai','Ringkas thread forum'].map(s => (
            <button key={s} onClick={() => send(s)} style={{
              padding:'5px 11px', fontSize:11, borderRadius:8, cursor:'pointer',
              background:'transparent', color:C.blue, border:`1px solid ${C.line}`,
              fontFamily:'Inter,sans-serif'
            }}>{s}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding:'12px 20px 20px' }}>
          <div style={{ display:'flex', gap:8, padding:'8px 8px 8px 14px', background:'#fff', border:`1px solid ${C.line}`, borderRadius:14 }}>
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key==='Enter' && send()}
              placeholder="Tanya apa aja…"
              style={{ flex:1, border:'none', outline:'none', background:'transparent', fontSize:14, fontFamily:'Inter,sans-serif', color:C.ink }}
            />
            <Btn variant="coral" size="sm" onClick={() => send()}>Kirim</Btn>
          </div>
          <div style={{ marginTop:8, fontSize:10, color:C.muted, textAlign:'center' }}>
            Aku bisa salah. Selalu cek sumber yang aku kasih.
          </div>
        </div>
      </aside>
    </>
  );
};

window.AIPanel = AIPanel;

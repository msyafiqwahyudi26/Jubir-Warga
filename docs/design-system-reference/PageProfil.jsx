// Page: Profil — Paspor Warga
const PageProfil = ({ onNav }) => {
  const { Pill, Btn, Avatar, Progress, Card, C } = window;
  const [side, setSide] = React.useState(0); // 0 cover, 1 identitas, 2 stempel, 3 visa
  return (
    <div>
      <section style={{ padding:'48px 24px', borderBottom:`1px solid ${C.line}` }}>
        <div style={{ maxWidth:1152, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <span style={{ font:'400 17px Caveat,cursive', color:C.coral }}>← profil kamu</span>
          </div>
          <h1 style={{ font:'700 48px Vollkorn,serif', color:C.blue }}>Paspor Warga</h1>
          <p style={{ marginTop:8, color:C.ink+'aa', fontSize:16 }}>Rekam jejakmu di Jubir Warga. Klik halaman untuk membalik.</p>

          {/* Paspor */}
          <div style={{ marginTop:32, display:'flex', gap:36, alignItems:'flex-start' }}>
            <div style={{ flex:1, display:'flex', justifyContent:'center', perspective:1400 }}>
              <div onClick={() => setSide((side+1)%4)} style={{
                width:380, height:520, position:'relative', cursor:'pointer',
                transformStyle:'preserve-3d',
                transform:`rotateY(${side*-22}deg)`,
                transition:'transform .8s cubic-bezier(.7,.05,.3,1)'
              }}>
                {/* Cover */}
                <PaspaorPage active={side===0} bg={C.blue} fg={C.cream}>
                  <div style={{ textAlign:'center', padding:'48px 24px' }}>
                    <div style={{ fontSize:11, letterSpacing:'.2em', opacity:.7, fontFamily:'Inter,sans-serif' }}>REPUBLIK INDONESIA</div>
                    <div style={{ marginTop:36, fontSize:22, fontFamily:'Vollkorn,serif', fontWeight:700, fontStyle:'italic' }}>PASPOR</div>
                    <div style={{ fontSize:16, fontFamily:'Vollkorn,serif', fontStyle:'italic', opacity:.85 }}>WARGA</div>
                    <div style={{ marginTop:120, width:96, height:96, margin:'120px auto 0', borderRadius:999, border:`2px solid ${C.cream}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Caveat,cursive', fontSize:38 }}>JW</div>
                    <div style={{ marginTop:36, fontSize:11, opacity:.6 }}>Suara warga, rumahnya di sini.</div>
                  </div>
                </PaspaorPage>
                {/* Identitas */}
                <PaspaorPage active={side===1} bg={C.cream} fg={C.ink}>
                  <div style={{ padding:'32px 28px' }}>
                    <div style={{ fontSize:10, letterSpacing:'.2em', color:C.muted, fontFamily:'Inter' }}>IDENTITAS</div>
                    <div style={{ display:'flex', gap:14, marginTop:14 }}>
                      <Avatar name="Aulia Pratiwi" size={72} level={3}/>
                      <div>
                        <div style={{ font:'700 22px Vollkorn,serif', color:C.blue }}>Aulia Pratiwi</div>
                        <div style={{ fontSize:13, color:C.muted }}>@auliaprtw · Jakarta Selatan</div>
                      </div>
                    </div>
                    <div style={{ marginTop:28, display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                      <Field label="Bergabung" v="12 Mar 2026"/>
                      <Field label="Level" v="Level 3 — Aktif"/>
                      <Field label="Pilar favorit" v="Aksi · Karya"/>
                      <Field label="Daerah" v="DKI Jakarta"/>
                    </div>
                    <div style={{ marginTop:24, padding:14, background:'#fff', border:`1px solid ${C.line}`, borderRadius:10 }}>
                      <div style={{ fontSize:11, color:C.muted }}>Bio</div>
                      <p style={{ marginTop:6, fontSize:14, fontStyle:'italic', fontFamily:'Vollkorn,serif' }}>"Lagi belajar gimana caranya marah yang benar."</p>
                    </div>
                  </div>
                </PaspaorPage>
                {/* Stempel */}
                <PaspaorPage active={side===2} bg={C.cream} fg={C.ink}>
                  <div style={{ padding:'28px 24px' }}>
                    <div style={{ fontSize:10, letterSpacing:'.2em', color:C.muted, fontFamily:'Inter' }}>STEMPEL · 12</div>
                    <div style={{ marginTop:16, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
                      {[
                        {t:'POLLING',c:C.coral,r:-8},{t:'PETISI',c:C.mint,r:5},{t:'KELAS',c:C.marigold,r:-3},
                        {t:'KARYA',c:C.blue,r:7},{t:'FORUM',c:C.coral,r:-6},{t:'AKSI',c:C.mint,r:3},
                      ].map((s,i) => (
                        <div key={i} style={{
                          aspectRatio:'1', borderRadius:999, border:`2.5px solid ${s.c}`, color:s.c,
                          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                          transform:`rotate(${s.r}deg)`, fontFamily:'Vollkorn,serif', fontWeight:700,
                          fontStyle:'italic', fontSize:14
                        }}>
                          {s.t}
                          <div style={{ fontSize:9, fontFamily:'Inter,sans-serif', fontStyle:'normal', fontWeight:500, opacity:.6, marginTop:2 }}>2026</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </PaspaorPage>
                {/* Visa */}
                <PaspaorPage active={side===3} bg={C.cream} fg={C.ink}>
                  <div style={{ padding:'28px 24px' }}>
                    <div style={{ fontSize:10, letterSpacing:'.2em', color:C.muted, fontFamily:'Inter' }}>VISA · KOMUNITAS</div>
                    <div style={{ marginTop:14 }}>
                      {['Warga Jakarta · diterima 12 Mar','Pekerja Kreatif · diterima 4 Apr','Mahasiswa · pending'].map((v,i) => (
                        <div key={i} style={{ padding:14, marginBottom:10, background:'#fff', border:`1px solid ${C.line}`, borderRadius:10, display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:36, height:36, borderRadius:8, background:C.blue+'10', color:C.blue, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Caveat,cursive', fontSize:22, fontWeight:700 }}>★</div>
                          <span style={{ fontSize:13, color:C.ink, fontFamily:'Vollkorn,serif' }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </PaspaorPage>
              </div>
            </div>

            {/* Side panel: stats */}
            <div style={{ width:340, flexShrink:0 }}>
              <Card style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:C.muted }}>Ringkasan aktivitas</div>
                <div style={{ marginTop:14, display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  {[
                    {v:'42',l:'thread'},{v:'18',l:'karya'},
                    {v:'7',l:'kelas'},{v:'12',l:'aksi'},
                  ].map((s,i) => (
                    <div key={i}>
                      <div style={{ font:'700 28px Fira Code,monospace', color:C.blue }}>{s.v}</div>
                      <div style={{ fontSize:11, color:C.muted }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <div style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase', color:C.muted }}>Progress level</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:8, marginTop:8 }}>
                  <span style={{ font:'700 32px Vollkorn,serif', color:C.blue }}>Level 3</span>
                  <span style={{ font:'400 14px Caveat,cursive', color:C.coral }}>← aktif!</span>
                </div>
                <div style={{ marginTop:12 }}>
                  <Progress percent={64} color="marigold"/>
                  <div style={{ marginTop:6, fontSize:11, color:C.muted, fontFamily:'Fira Code,monospace' }}>640 / 1000 XP ke Level 4</div>
                </div>
              </Card>
            </div>
          </div>

          <div style={{ marginTop:18, textAlign:'center', fontSize:13, color:C.muted }}>
            Halaman {side+1} / 4 — klik paspor untuk membalik
          </div>
        </div>
      </section>
    </div>
  );
};

const Field = ({ label, v }) => {
  const { C } = window;
  return (
    <div>
      <div style={{ fontSize:10, color:C.muted, letterSpacing:'.1em', textTransform:'uppercase' }}>{label}</div>
      <div style={{ fontSize:14, color:C.ink, fontFamily:'Inter,sans-serif', fontWeight:500, marginTop:2 }}>{v}</div>
    </div>
  );
};

const PaspaorPage = ({ active, bg, fg, children }) => (
  <div style={{
    position:'absolute', inset:0, background:bg, color:fg,
    borderRadius:14, boxShadow:'0 30px 50px -20px rgba(26,34,86,.35), 0 4px 12px rgba(0,0,0,.08)',
    overflow:'hidden', opacity: active?1:.35, transition:'opacity .4s'
  }}>{children}</div>
);

window.PageProfil = PageProfil;

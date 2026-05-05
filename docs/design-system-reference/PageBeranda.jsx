// Page: Beranda — Sprint 1 (pitch-deck grade)
// Sections: Hero · Janji Panas · Game of the Day · Tri-column · Nala Strip · Kelas · CTA Paspor
// Custom inline SVG illustrations live in BerandaIllustrations.jsx

const PageBeranda = ({ onNav, onJubir }) => {
  const { Pill, Btn, Avatar, Progress, Card, C, HeroKafeScene, PasporOpenIllustration } = window;

  // Lucide icon component using inline SVG paths (Lucide line style, stroke 1.6, rounded)
  const Icon = ({ name, size = 16, color = 'currentColor', strokeWidth = 1.8, style }) => {
    const paths = {
      sparkles: <><path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/><path d="M19 14l.6 1.4L21 16l-1.4.6L19 18l-.6-1.4L17 16l1.4-.6z"/></>,
      flame: <path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 1-3s-3 2-3 6a6 6 0 0 0 12 0c0-6-6-11-6-11z"/>,
      'trending-up': <><polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/></>,
      'pen-tool': <><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z"/><circle cx="6" cy="6" r="2"/></>,
      zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
      'message-circle': <path d="M21 11.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0z M12 19l-4 3v-3"/>,
      home: <><path d="M3 12l9-9 9 9v8a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/></>,
      compass: <><circle cx="12" cy="12" r="10"/><polygon points="16 8 14 14 8 16 10 10 16 8"/></>,
      'gamepad-2': <><line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/><line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/><path d="M17.32 5H6.68A4 4 0 0 0 2.81 8.18l-1.31 6A4 4 0 0 0 5.4 19h.68a4 4 0 0 0 3.4-1.86l.66-1.05a2 2 0 0 1 1.7-.94h.32a2 2 0 0 1 1.7.94l.66 1.05A4 4 0 0 0 17.92 19h.68a4 4 0 0 0 3.91-4.82l-1.31-6A4 4 0 0 0 17.32 5z"/></>,
      user: <><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1"/></>,
      target: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
      'arrow-right': <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    }[name];
    return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">{paths}</svg>;
  };

  const today = 'Senin, 28 April 2026';

  // Wordle row: W A R G A — all mint correct
  const WordleRow = () => (
    <div style={{ display:'flex', gap:6 }}>
      {['W','A','R','G','A'].map((c,i) => (
        <div key={i} style={{
          width:42, height:42, borderRadius:6,
          background:'#7FB69E', color:'#fff',
          display:'flex', alignItems:'center', justifyContent:'center',
          font:'700 22px Vollkorn,serif',
          boxShadow:'inset 0 -3px 0 rgba(0,0,0,0.18)'
        }}>{c}</div>
      ))}
    </div>
  );

  return (
    <div>
      {/* ============ 1. HERO ============ */}
      <section style={{ padding:'72px 24px 64px', borderBottom:`1px solid ${C.line}` }}>
        <div style={{ maxWidth:1152, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 420px', gap:48, alignItems:'center' }} className="hero-grid">
          <div>
            <div style={{ font:'600 20px/1 Caveat,cursive', color:C.coral, letterSpacing:'.005em' }}>{today}</div>
            <h1 className="hero-h1" style={{ font:'700 76px/1.02 Vollkorn,serif', color:C.blue, margin:'10px 0 0', letterSpacing:'-0.015em' }}>
              Hari ini,<br/>
              <em style={{ fontStyle:'italic' }}>kita ngomongin</em><br/>
              <span style={{ position:'relative', display:'inline-block' }}>
                Pasal 28E
                <svg viewBox="0 0 280 14" width="100%" height="14" style={{ position:'absolute', left:0, bottom:-6, width:'100%' }} aria-hidden="true">
                  <path d="M 4 8 Q 30 2 56 8 T 110 8 T 164 8 T 218 8 T 274 8" stroke="#E8632B" strokeWidth="3" fill="none" strokeLinecap="round"/>
                </svg>
              </span>.
            </h1>
            <p style={{ marginTop:28, font:'400 18px/1.55 Inter,sans-serif', color:C.ink, opacity:.75, maxWidth:520 }}>
              Hak berekspresi yang dijamin konstitusi — tapi seberapa jauh sudah dipraktikkan?
            </p>
            <div style={{ marginTop:28, display:'flex', gap:12, flexWrap:'wrap' }}>
              <Btn variant="coral" size="lg" onClick={() => onNav('komunitas')}>
                Ikut diskusi <Icon name="arrow-right" size={16} strokeWidth={2.2}/>
              </Btn>
              <Btn variant="outline" size="lg" onClick={onJubir}>
                <Icon name="sparkles" size={16} strokeWidth={2}/> Tanya Nala soal ini
              </Btn>
            </div>
          </div>
          <div style={{ position:'relative', justifySelf:'end' }}>
            <HeroKafeScene width={420} />
          </div>
        </div>
      </section>

      {/* ============ 2. JANJI YANG LAGI PANAS ============ */}
      <section style={{ padding:'56px 24px', borderBottom:`1px solid ${C.line}` }}>
        <div style={{ maxWidth:1152, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:12, marginBottom:22, flexWrap:'wrap' }}>
            <Icon name="flame" size={26} color={C.coral} strokeWidth={1.8} style={{ alignSelf:'center' }}/>
            <h2 style={{ font:'600 28px/1.2 Vollkorn,serif', color:C.blue, letterSpacing:'-0.005em' }}>
              Janji yang lagi panas hari ini
            </h2>
            <span style={{ font:'400 17px Caveat,cursive', color:C.coral, transform:'rotate(-1.5deg)', display:'inline-block' }}>← status berubah hari ini</span>
            <button onClick={() => onNav('tagih')} style={{
              marginLeft:'auto', font:'600 13px Inter,sans-serif', color:C.coral,
              background:'none', border:'none', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:4
            }}>Lihat semua <Icon name="arrow-right" size={14}/></button>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }} className="janji-grid">
            {[
              { name:'Pramono A.', role:'Gubernur DKI Jakarta', level:'PROVINSI', janji:'Tambah 50 km jalur sepeda baru sebelum akhir 2026.', status:'Berjalan', tone:'marigold', ago:'2j lalu', dir:'up' },
              { name:'Sri Mulyani', role:'Menkeu RI', level:'PUSAT', janji:'Subsidi BBM dialihkan ke transportasi publik massal.', status:'Mandek', tone:'red', ago:'4j lalu', dir:'down' },
              { name:'Farhan', role:'Wali Kota Bandung', level:'KOTA', janji:'50 ruang terbuka hijau publik baru di Bandung.', status:'Berjalan', tone:'marigold', ago:'1h lalu', dir:'up' },
            ].map((j,i) => (
              <Card key={i} onClick={() => onNav('tagih')} style={{ padding:18 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <Avatar name={j.name} size={42} showLevel={false}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ font:'600 13px Inter', color:C.blue, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{j.name}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{j.role}</div>
                  </div>
                  <span style={{
                    font:'600 9px Inter', letterSpacing:'.12em', color:C.muted,
                    border:`1px solid ${C.line}`, padding:'3px 6px', borderRadius:4
                  }}>{j.level}</span>
                </div>
                <p style={{ font:'italic 500 16px/1.4 Vollkorn,serif', color:C.ink, marginBottom:14, minHeight:64 }}>"{j.janji}"</p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <Pill tone={j.tone}>{j.status}</Pill>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:4, font:'500 11px Inter', color:C.muted }}>
                    <Icon name="trending-up" size={12} color={j.dir==='up' ? C.mint : C.red} strokeWidth={2.2} style={j.dir==='down' ? { transform:'scaleY(-1)' } : null}/>
                    Status berubah {j.ago}
                  </span>
                </div>
                <button style={{
                  marginTop:14, width:'100%', padding:'8px 0',
                  background:'transparent', border:`1px solid ${C.line}`, borderRadius:8,
                  font:'600 12px Inter', color:C.blue, cursor:'pointer',
                  display:'inline-flex', alignItems:'center', justifyContent:'center', gap:4
                }}>Lihat detail <Icon name="arrow-right" size={12}/></button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 3. GAME OF THE DAY ============ */}
      <section style={{ padding:'56px 24px', borderBottom:`1px solid ${C.line}` }}>
        <div style={{ maxWidth:1152, margin:'0 auto', display:'grid', gridTemplateColumns:'2fr 1fr', gap:20 }} className="game-grid">
          {/* Big game card — brand blue */}
          <div style={{
            background:C.blue, color:C.cream, borderRadius:22, padding:'32px 36px',
            position:'relative', overflow:'hidden'
          }}>
            <div style={{ position:'absolute', right:-40, top:-40, width:200, height:200, borderRadius:999, background:'rgba(232,99,43,0.10)' }}/>
            <div style={{ position:'relative' }}>
              <div style={{ font:'600 18px Caveat,cursive', color:C.marigold, marginBottom:6 }}>Game hari ini</div>
              <h3 style={{ font:'700 30px/1.2 Vollkorn,serif', color:C.cream, marginBottom:18, letterSpacing:'-0.005em' }}>
                Tebak Kata <em style={{ fontStyle:'italic' }}>Hari Ini</em>
              </h3>
              <WordleRow/>
              <p style={{ marginTop:14, font:'400 13px/1.5 Inter', color:'rgba(255,250,238,.7)', maxWidth:340 }}>
                Tebak 5 huruf yang berhubungan dengan kewargaan hari ini. 6 kesempatan.
              </p>
              <div style={{ marginTop:22, display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
                <Btn variant="coral" size="lg" onClick={() => onNav('main')}>Main hari ini →</Btn>
                <span style={{ display:'inline-flex', alignItems:'center', gap:6, font:'500 13px Inter', color:'rgba(255,250,238,.85)' }}>
                  <Icon name="flame" size={16} color={C.coral} strokeWidth={2}/>
                  <span style={{ fontFamily:'Fira Code,monospace', fontWeight:600 }}>5</span> hari berturut-turut
                </span>
              </div>
            </div>
            <div style={{
              position:'absolute', right:32, top:18, font:'400 18px Caveat,cursive',
              color:C.marigold, transform:'rotate(1.5deg)', opacity:.85
            }}>← coba dulu, baru ngomong</div>
          </div>

          {/* Leaderboard */}
          <Card hoverable={false} style={{ padding:22 }}>
            <div style={{ font:'600 11px/1 Inter', letterSpacing:'.14em', textTransform:'uppercase', color:C.muted, marginBottom:14 }}>Top 3 hari ini</div>
            {[
              { rank:1, name:'Aulia P.', chapter:'Jakarta', score:980 },
              { rank:2, name:'Bayu R.', chapter:'Bandung', score:920 },
              { rank:3, name:'Citra N.', chapter:'Surabaya', score:880 },
            ].map(p => (
              <div key={p.rank} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:`1px dashed ${C.line}` }}>
                <span style={{
                  width:24, height:24, borderRadius:999,
                  background: p.rank===1?C.marigold:p.rank===2?C.line:'#F0EDE8',
                  color: p.rank===1?'#fff':C.ink,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  font:'700 11px Fira Code,monospace'
                }}>{p.rank}</span>
                <Avatar name={p.name} size={28} showLevel={false}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ font:'600 12px Inter', color:C.blue }}>{p.name}</div>
                  <div style={{ fontSize:10, color:C.muted }}>{p.chapter}</div>
                </div>
                <span style={{ fontFamily:'Fira Code,monospace', font:'500 13px', color:C.ink }}>{p.score}</span>
              </div>
            ))}
          </Card>
        </div>
      </section>

      {/* ============ 4. THREE COLUMNS ============ */}
      <section style={{ padding:'56px 24px', borderBottom:`1px solid ${C.line}` }}>
        <div style={{ maxWidth:1152, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:28 }} className="tri-grid">

            {/* Forum */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <Icon name="trending-up" size={18} color={C.blue} strokeWidth={2}/>
                <h3 style={{ font:'600 19px Vollkorn,serif', color:C.blue, letterSpacing:'-0.003em' }}>Lagi Hangat di Forum</h3>
              </div>
              {[
                {a:'Sari Lestari',c:'Jakarta',t:'RUU PPRT, kenapa mandek terus setelah 20 tahun?',r:42},
                {a:'Kanta W.',c:'Malang',t:'Tarif parkir naik tanpa konsultasi warga.',r:28},
                {a:'Nadira A.',c:'Bandung',t:'Mental health di tempat kerja garmen Bandung.',r:67},
              ].map((t,i) => (
                <Card key={i} onClick={() => onNav('komunitas')} style={{ marginBottom:12, padding:16 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    <Avatar name={t.a} size={26} showLevel={false}/>
                    <span style={{ fontSize:12, fontWeight:600, color:C.blue }}>{t.a}</span>
                    <span style={{ fontSize:11, color:C.muted }}>· {t.c}</span>
                  </div>
                  <p style={{ font:'600 14.5px/1.4 Vollkorn,serif', color:C.ink, marginBottom:8 }}>{t.t}</p>
                  <span style={{ fontSize:11, color:C.muted, display:'inline-flex', alignItems:'center', gap:4 }}>
                    <Icon name="message-circle" size={11} strokeWidth={2}/> {t.r} balasan
                  </span>
                </Card>
              ))}
            </div>

            {/* Karya */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <Icon name="pen-tool" size={18} color={C.blue} strokeWidth={2}/>
                <h3 style={{ font:'600 19px Vollkorn,serif', color:C.blue }}>Karya Terbaru</h3>
              </div>
              {[
                {type:'TULISAN',tone:'blue',t:'Lima alasan pemuda apatis terhadap Pilkada lokal',a:'Reza A.',meta:'7 mnt baca'},
                {type:'VLOG',tone:'coral',t:'Ngobrol sama PKL soal APBD — ternyata mereka lebih paham',a:'Mei C.',meta:'12:34'},
                {type:'ILUSTRASI',tone:'mint',t:'Kenapa suara kita bisa hilang — dalam 6 panel',a:'Pram F.',meta:'Galeri'},
              ].map((k,i) => (
                <Card key={i} onClick={() => onNav('karya')} style={{ marginBottom:12, padding:16 }}>
                  <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8 }}>
                    <Pill tone={k.tone}>{k.type}</Pill>
                    <span style={{ fontSize:11, color:C.muted, fontFamily:'Fira Code,monospace' }}>{k.meta}</span>
                  </div>
                  <p style={{ font:'600 14.5px/1.4 Vollkorn,serif', color:C.ink, marginBottom:6 }}>{k.t}</p>
                  <span style={{ fontSize:11, color:C.muted }}>{k.a}</span>
                </Card>
              ))}
            </div>

            {/* Aksi */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <Icon name="zap" size={18} color={C.blue} strokeWidth={2}/>
                <h3 style={{ font:'600 19px Vollkorn,serif', color:C.blue }}>Aksi Minggu Ini</h3>
              </div>
              <Card onClick={() => onNav('aksi')} style={{ marginBottom:12, padding:16, background:'#FCE9E1', borderColor:'#E8632B55' }}>
                <Pill tone="coral">POLLING</Pill>
                <p style={{ marginTop:10, font:'600 15px/1.4 Vollkorn,serif', color:C.ink, marginBottom:14 }}>
                  Anggaran subsidi BBM sebaiknya dialihkan ke mana?
                </p>
                <Btn variant="coral" size="sm">Vote sekarang →</Btn>
              </Card>
              <Card onClick={() => onNav('aksi')} style={{ padding:16 }}>
                <Pill tone="mint">PETISI</Pill>
                <p style={{ marginTop:10, font:'600 15px/1.4 Vollkorn,serif', color:C.ink, marginBottom:10 }}>
                  Kembalikan jam KRL 04.00 WIB
                </p>
                <Progress percent={73} color="mint" />
                <span style={{ fontSize:11, color:C.muted, display:'block', marginTop:8 }}>
                  <span style={{ fontFamily:'Fira Code,monospace', fontWeight:500, color:C.ink }}>7.300 / 10.000</span> tanda tangan
                </span>
              </Card>
            </div>

        </div>
      </section>

      {/* ============ 5. NALA COMPANION STRIP ============ */}
      <section style={{ padding:'48px 24px', borderBottom:`1px solid ${C.line}` }}>
        <div style={{ maxWidth:1152, margin:'0 auto' }}>
          <div style={{
            background:C.blue, borderRadius:22, padding:'28px 32px',
            display:'flex', alignItems:'center', gap:24, color:C.cream, position:'relative', overflow:'hidden'
          }} className="nala-card">
            <div style={{ position:'absolute', left:-50, top:-60, width:240, height:240, background:'radial-gradient(circle, rgba(232,99,43,0.20), transparent 65%)', pointerEvents:'none' }}/>
            <img src="../../assets/illustrations/mascot-nala-excited.svg" width={120} height={132} style={{ flexShrink:0, position:'relative' }} alt="Nala — excited"/>
            <div style={{ flex:1, position:'relative' }}>
              <div style={{ font:'600 11px Inter', letterSpacing:'.14em', textTransform:'uppercase', color:'#FFB78A', marginBottom:8, display:'inline-flex', alignItems:'center', gap:6 }}>
                <span style={{ width:6, height:6, borderRadius:999, background:C.mint, boxShadow:`0 0 0 3px rgba(127,182,158,0.25)` }}/>
                Tanya Nala
              </div>
              <h3 style={{ font:'600 22px/1.35 Vollkorn,serif', color:C.cream, marginBottom:6, letterSpacing:'-0.005em' }}>
                Beo curhatmu — <em style={{ fontStyle:'italic', color:'#FFB78A' }}>dengar kabar, ngasih tahu, sering tanya balik.</em>
              </h3>
              <p style={{ font:'400 13.5px/1.55 Inter', color:'rgba(255,250,238,.62)' }}>
                Selalu pakai sumber. Bilang "aku belum tahu" kalau memang belum tahu.
              </p>
            </div>
            <Btn variant="coral" size="lg" onClick={onJubir}>
              <Icon name="sparkles" size={14} strokeWidth={2}/> Ngobrol bareng Nala →
            </Btn>
          </div>
        </div>
      </section>

      {/* ============ 6. KELAS ============ */}
      <section style={{ padding:'56px 24px', borderBottom:`1px solid ${C.line}` }}>
        <div style={{ maxWidth:1152, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:12, marginBottom:22 }}>
            <h2 style={{ font:'600 28px Vollkorn,serif', color:C.blue, letterSpacing:'-0.005em' }}>Kelas yang sedang seru</h2>
            <button onClick={() => onNav('kelas')} style={{
              marginLeft:'auto', font:'600 13px Inter', color:C.coral,
              background:'none', border:'none', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:4
            }}>Lihat semua kelas <Icon name="arrow-right" size={14}/></button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }} className="kelas-grid">
            {[
              { title:'Kelas Jubir Warga: dari Resah ke Suara ke Aksi', mentor:'Bilal Sukarno', mentorRole:'Aktivis · Founder Bicara Politik', peserta:124, percent:68, level:'Pemula → Madya' },
              { title:'Social Marketing & Fundraising untuk Gerakan', mentor:'Aqidatul Izza Zain', mentorRole:'Strategis Kampanye · Greenpeace ID', peserta:89, percent:34, level:'Madya' },
            ].map((k,i) => (
              <Card key={i} onClick={() => onNav('kelas')} style={{ padding:22 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                  <Pill tone="blue">KELAS</Pill>
                  <Pill tone="grey">{k.level}</Pill>
                  <span style={{ marginLeft:'auto', font:'500 11px Inter', color:C.muted, fontFamily:'Fira Code,monospace' }}>{k.peserta} peserta</span>
                </div>
                <h3 style={{ font:'600 19px/1.3 Vollkorn,serif', color:C.blue, marginBottom:14, minHeight:50 }}>{k.title}</h3>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                  <Avatar name={k.mentor} size={36} showLevel={false}/>
                  <div>
                    <div style={{ font:'600 13px Inter', color:C.ink }}>{k.mentor}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{k.mentorRole}</div>
                  </div>
                </div>
                <Progress percent={k.percent} color="coral"/>
                <div style={{ marginTop:6, display:'flex', justifyContent:'space-between', font:'500 11px Inter', color:C.muted }}>
                  <span><span style={{ fontFamily:'Fira Code,monospace', color:C.ink, fontWeight:600 }}>{k.percent}%</span> selesai</span>
                  <span>Lanjutkan →</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 7. CTA PASPOR ============ */}
      <section style={{ padding:'80px 24px', background:C.blue, color:C.cream }}>
        <div style={{ maxWidth:1152, margin:'0 auto', display:'grid', gridTemplateColumns:'320px 1fr', gap:48, alignItems:'center' }} className="cta-grid">
          <PasporOpenIllustration width={320}/>
          <div>
            <h2 style={{ font:'600 40px/1.15 Vollkorn,serif', color:C.cream, letterSpacing:'-0.01em', marginBottom:14 }}>
              Belum punya <em style={{ fontStyle:'italic', color:'#FFB78A' }}>paspor warga?</em>
            </h2>
            <p style={{ font:'400 17px/1.6 Inter', color:'rgba(255,250,238,.72)', maxWidth:520, marginBottom:24 }}>
              Bikin gratis sekarang. Tunjukkan kontribusi kamu lewat paspor digital yang tumbuh seiring aksimu.
            </p>
            <Btn variant="coral" size="lg" onClick={() => onNav('profil')}>
              Bikin paspor saya <Icon name="arrow-right" size={16} strokeWidth={2.2}/>
            </Btn>
          </div>
        </div>
      </section>

      {/* ============ MOBILE BOTTOM NAV ============ */}
      <nav className="mobile-nav" style={{
        display:'none',
        position:'fixed', bottom:0, left:0, right:0,
        height:'calc(56px + env(safe-area-inset-bottom))',
        paddingBottom:'env(safe-area-inset-bottom)',
        background:C.cream, borderTop:`1px solid ${C.line}`, zIndex:50,
        justifyContent:'space-around', alignItems:'center'
      }}>
        {[
          { id:'beranda', label:'Beranda', icon:'home' },
          { id:'komunitas', label:'Komunitas', icon:'compass' },
          { id:'tagih', label:'Tagih', icon:'target' },
          { id:'main', label:'Main', icon:'gamepad-2' },
          { id:'profil', label:'Profil', icon:'user' },
        ].map(it => (
          <button key={it.id} onClick={() => onNav(it.id)} style={{
            background:'none', border:'none', cursor:'pointer',
            display:'flex', flexDirection:'column', alignItems:'center', gap:2,
            padding:'6px 10px', color:C.ink, minHeight:44
          }}>
            <Icon name={it.icon} size={20} strokeWidth={1.8} color={C.blue}/>
            <span style={{ font:'500 10px Inter', color:C.muted }}>{it.label}</span>
          </button>
        ))}
      </nav>

      {/* Responsive — collapses to mobile at 768px, single column at 480 */}
      <style>{`
        @media (max-width: 900px) {
          .hero-grid, .game-grid, .tri-grid, .kelas-grid, .janji-grid, .cta-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-h1 { font-size: 52px !important; }
        }
        @media (max-width: 480px) {
          .hero-h1 { font-size: 44px !important; line-height: 1.05 !important; }
          .nala-card { flex-direction: column; align-items: flex-start !important; padding: 20px !important; }
          .mobile-nav { display: flex !important; }
          body { padding-bottom: 64px; }
        }
      `}</style>
    </div>
  );
};

window.PageBeranda = PageBeranda;

// Page: Tagih Janji — full spec section 4.10
const PageTagih = ({ onNav }) => {
  const { Pill, Btn, Avatar, Card, C, TagihHeroScene, PetaJanjiIndonesia, TanganMenulisIllustration } = window;
  const [filterLevel, setFilterLevel] = React.useState('Semua');
  const [filterStatus, setFilterStatus] = React.useState(null);
  const [filterProvince, setFilterProvince] = React.useState(null);

  // Lucide-style mini icons (line)
  const Icon = ({ name, size = 14, color = 'currentColor', sw = 1.8 }) => {
    const paths = {
      eye: <><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></>,
      'arrow-right': <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
      'plus-circle': <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></>,
      info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
      calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
      x: <><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></>,
    }[name];
    return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths}</svg>;
  };

  // Provinsi MVP — geometris approx Indonesia
  const provinces = [
    {
      id: 'sumut', label: 'Sumut', pct: 38, count: 24,
      d: 'M 78 96 Q 70 116 84 134 Q 100 142 116 134 Q 124 122 116 106 Q 102 92 84 92 Q 80 92 78 96 Z',
      lx: 100, ly: 116, lineX: -88, lineY: -28,
    },
    {
      id: 'dki', label: 'DKI', pct: 52, count: 38,
      d: 'M 282 218 Q 296 214 312 218 Q 316 224 308 230 Q 292 232 280 228 Q 276 222 282 218 Z',
      lx: 296, ly: 224, lineX: -16, lineY: -38,
    },
    {
      id: 'jabar', label: 'Jabar', pct: 28, count: 31,
      d: 'M 322 222 Q 348 218 376 222 Q 386 230 382 240 Q 354 244 322 240 Q 314 230 322 222 Z',
      lx: 350, ly: 232, lineX: 38, lineY: 38,
    },
    {
      id: 'jatim', label: 'Jatim', pct: 46, count: 28,
      d: 'M 444 224 Q 472 220 502 226 Q 510 234 504 242 Q 472 248 442 244 Q 436 234 444 224 Z',
      lx: 474, ly: 234, lineX: 24, lineY: 42,
    },
    {
      id: 'sulsel', label: 'Sulsel', pct: 56, count: 25,
      d: 'M 588 188 Q 580 208 590 226 Q 602 232 612 222 Q 612 208 606 196 Q 600 188 588 188 Z',
      lx: 600, ly: 208, lineX: 36, lineY: 0,
    },
  ];

  const allJanji = [
    { name:'Joko K.', role:'Presiden RI', level:'Pusat', topic:'Ekonomi', q:'Kami akan turunkan harga BBM 30% dalam 100 hari pertama.', status:'Berjalan', tone:'marigold', deadline:'31 Des 2026', pemantau:1284, prov: null },
    { name:'Pramono A.', role:'Gub. DKI', level:'Provinsi', topic:'Lingkungan', q:'Ruang terbuka hijau 30% di Jakarta dalam masa jabatan.', status:'Mandek', tone:'red', deadline:'31 Mar 2027', pemantau:847, prov: 'dki' },
    { name:'Dedi Mulyadi', role:'Gub. Jabar', level:'Provinsi', topic:'Pendidikan', q:'Bangun 1.000 sekolah vokasi di Jawa Barat.', status:'Ditepati', tone:'mint', deadline:'Selesai', pemantau:621, prov: 'jabar' },
    { name:'Khofifah I.', role:'Gub. Jatim', level:'Provinsi', topic:'UMKM', q:'Akses kredit Rp10 juta untuk 100.000 UMKM Jatim.', status:'Berjalan', tone:'marigold', deadline:'30 Jun 2027', pemantau:412, prov: 'jatim' },
    { name:'Bobby N.', role:'Wali Kota Medan', level:'Kota', topic:'Sampah', q:'Atasi sampah Medan dalam 1 tahun.', status:'Diingkari', tone:'red', deadline:'30 Apr 2026', pemantau:298, prov: 'sumut' },
    { name:'Danny P.', role:'Wali Kota Makassar', level:'Kota', topic:'Banjir', q:'Bebas banjir di 5 titik kritis Makassar.', status:'Belum', tone:'grey', deadline:'31 Des 2027', pemantau:156, prov: 'sulsel' },
    { name:'Edy R.', role:'Gub. Sumut', level:'Provinsi', topic:'Lingkungan', q:'Tanam 1 juta pohon di Sumut sebelum 2027.', status:'Berjalan', tone:'marigold', deadline:'31 Des 2026', pemantau:342, prov: 'sumut' },
    { name:'Andi Sudirman', role:'Gub. Sulsel', level:'Provinsi', topic:'Kesehatan', q:'Tambah 50 puskesmas di pesisir Sulsel.', status:'Ditepati', tone:'mint', deadline:'Selesai', pemantau:267, prov: 'sulsel' },
    { name:'Ahmad Luthfi', role:'Gub. Jateng', level:'Provinsi', topic:'Ekonomi', q:'Akses kredit Rp5 juta untuk 50.000 petani Jateng.', status:'Berjalan', tone:'marigold', deadline:'31 Des 2027', pemantau:198, prov: null },
    { name:'Eri Cahyadi', role:'Wali Kota Surabaya', level:'Kota', topic:'Banjir', q:'Atasi banjir 10 titik kritis Surabaya 2026.', status:'Mandek', tone:'red', deadline:'31 Des 2026', pemantau:421, prov: 'jatim' },
    { name:'Sanusi', role:'Bupati Malang', level:'Kota', topic:'Pelayanan publik', q:'Konsultasi publik sebelum naikkan tarif parkir.', status:'Diingkari', tone:'red', deadline:'15 Mar 2026', pemantau:189, prov: 'jatim' },
    { name:'Dadang Supriatna', role:'Bupati Bandung', level:'Kota', topic:'Pendidikan', q:'Beasiswa SMA gratis untuk 5.000 anak Bandung.', status:'Berjalan', tone:'marigold', deadline:'30 Jun 2027', pemantau:312, prov: 'jabar' },
  ];

  const janji = allJanji.filter(j => {
    if (filterLevel !== 'Semua' && j.level !== filterLevel) return false;
    if (filterStatus && j.status !== filterStatus) return false;
    if (filterProvince && j.prov !== filterProvince) return false;
    return true;
  });

  const partai = [
    { name:'PDIP', pct: 42, color: C.red },
    { name:'Gerindra', pct: 38, color: C.coral },
    { name:'Golkar', pct: 35, color: C.marigold },
    { name:'NasDem', pct: 31, color: C.blue },
    { name:'PKB', pct: 29, color: C.mint },
    { name:'PKS', pct: 26, color: '#7C7669' },
  ];

  const activeProvLabel = filterProvince ? provinces.find(p => p.id === filterProvince)?.label : null;

  return (
    <div>
      {/* ============ HERO ============ */}
      <section style={{ padding:'72px 24px 64px', borderBottom:`1px solid ${C.line}` }}>
        <div style={{ maxWidth:1152, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 460px', gap:48, alignItems:'center' }} className="th-hero">
          <div>
            <h1 className="th-h1" style={{ font:'700 76px/1.02 Vollkorn,serif', color:C.blue, letterSpacing:'-0.015em' }}>
              <em style={{ fontStyle:'italic' }}>Tagih Janji</em><br/>Pemerintah.
            </h1>
            <p style={{ marginTop:24, font:'400 18px/1.6 Inter,sans-serif', color:C.ink, opacity:.75, maxWidth:540 }}>
              Setiap janji yang diucapkan, kita catat. Setiap janji yang ditepati, kita rayakan. Setiap janji yang diingkari, kita ingatkan.
            </p>
            <div style={{ marginTop:28, display:'flex', gap:12, flexWrap:'wrap' }}>
              <Btn variant="coral" size="lg" onClick={() => document.getElementById('th-list').scrollIntoView({behavior:'smooth'})}>
                Lihat semua janji <Icon name="arrow-right" size={16} sw={2.2}/>
              </Btn>
              <Btn variant="outline" size="lg" onClick={() => document.getElementById('th-submit').scrollIntoView({behavior:'smooth'})}>
                Submit janji baru
              </Btn>
            </div>
          </div>
          <div style={{ justifySelf:'end' }}>
            <TagihHeroScene width={460}/>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section style={{ padding:'32px 24px', borderBottom:`1px solid ${C.line}`, background:C.cream }}>
        <div style={{ maxWidth:1152, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }} className="th-stats">
          {[
            { v:'186', l:'janji terlacak', c:C.blue },
            { v:'24%', l:'ditepati', c:C.mint },
            { v:'42%', l:'sedang berjalan', c:C.marigold },
            { v:'18%', l:'mandek/diingkari', c:C.coral },
          ].map((s,i) => (
            <div key={i} style={{ background:'#fff', border:`1px solid ${C.line}`, borderRadius:14, padding:'22px 26px' }}>
              <div style={{ font:'700 44px/1 Fira Code,monospace', color:s.c }}>{s.v}</div>
              <div style={{ fontSize:13, color:C.muted, marginTop:8 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ PETA INTERAKTIF ============ */}
      <section style={{ padding:'56px 24px', borderBottom:`1px solid ${C.line}` }}>
        <div style={{ maxWidth:1152, margin:'0 auto' }}>
          <div style={{ marginBottom:18 }}>
            <h2 style={{ font:'600 28px Vollkorn,serif', color:C.blue, letterSpacing:'-0.005em' }}>Peta Janji Indonesia</h2>
            <p style={{ marginTop:6, fontSize:14, color:C.muted, maxWidth:560 }}>
              5 provinsi MVP — color-coded berdasarkan % janji yang ditepati. Klik provinsi untuk filter list di bawah.
            </p>
          </div>
          <div style={{ background:C.cream, border:`1px solid ${C.line}`, borderRadius:16, padding:'18px 22px' }}>
            <PetaJanjiIndonesia
              provinces={provinces}
              activeFilter={filterProvince}
              onProvinceClick={(id) => setFilterProvince(filterProvince === id ? null : id)}
            />
          </div>
        </div>
      </section>

      {/* ============ FILTER BAR ============ */}
      <section style={{ padding:'24px', borderBottom:`1px solid ${C.line}`, background:'#fff', position:'sticky', top:0, zIndex:5 }} id="th-list">
        <div style={{ maxWidth:1152, margin:'0 auto', display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
          <span style={{ fontSize:11, fontWeight:600, color:C.muted, textTransform:'uppercase', letterSpacing:'.10em', marginRight:4 }}>Tingkat:</span>
          {['Semua','Pusat','Provinsi','Kota'].map(f => {
            const active = filterLevel === f;
            return (
              <button key={f} onClick={() => setFilterLevel(f)} style={{
                padding:'6px 14px', borderRadius:999, fontSize:13, fontWeight:500, fontFamily:'Inter,sans-serif', cursor:'pointer',
                background: active?C.blue:'transparent', color: active?C.cream:C.ink,
                border: active?'none':`1px solid ${C.line}`
              }}>{f}</button>
            );
          })}
          <span style={{ width:1, height:20, background:C.line, margin:'0 6px' }}/>
          <span style={{ fontSize:11, fontWeight:600, color:C.muted, textTransform:'uppercase', letterSpacing:'.10em', marginRight:4 }}>Status:</span>
          {['Ditepati','Berjalan','Mandek','Diingkari','Belum'].map(f => {
            const active = filterStatus === f;
            const tones = { Ditepati:C.mint, Berjalan:C.marigold, Mandek:C.red, Diingkari:C.red, Belum:C.muted };
            return (
              <button key={f} onClick={() => setFilterStatus(active ? null : f)} style={{
                padding:'6px 14px', borderRadius:999, fontSize:13, fontWeight:500, fontFamily:'Inter,sans-serif', cursor:'pointer',
                background: active?tones[f]:'transparent', color: active?'#fff':C.ink,
                border: active?'none':`1px solid ${C.line}`
              }}>{f}</button>
            );
          })}
          {(filterProvince || filterStatus || filterLevel !== 'Semua') && (
            <button onClick={() => { setFilterLevel('Semua'); setFilterStatus(null); setFilterProvince(null); }} style={{
              marginLeft:'auto', padding:'6px 12px', borderRadius:999, fontSize:12, fontWeight:500, fontFamily:'Inter,sans-serif', cursor:'pointer',
              background:'transparent', color:C.coral, border:`1px solid ${C.coral}`,
              display:'inline-flex', alignItems:'center', gap:5
            }}>
              <Icon name="x" size={12} sw={2.4}/> Reset filter
            </button>
          )}
        </div>
        {activeProvLabel && (
          <div style={{ maxWidth:1152, margin:'10px auto 0', fontSize:12, color:C.muted, fontStyle:'italic' }}>
            Filter aktif: provinsi <strong style={{ color:C.blue, fontStyle:'normal' }}>{activeProvLabel}</strong>
          </div>
        )}
      </section>

      {/* ============ JANJI LIST ============ */}
      <section style={{ padding:'40px 24px' }}>
        <div style={{ maxWidth:1152, margin:'0 auto' }}>
          <div style={{ marginBottom:18, fontSize:13, color:C.muted }}>
            Menampilkan <strong style={{ color:C.ink, fontFamily:'Fira Code,monospace' }}>{janji.length}</strong> dari <strong style={{ color:C.ink, fontFamily:'Fira Code,monospace' }}>{allJanji.length}</strong> janji
          </div>
          <div style={{ display:'grid', gap:14 }}>
            {janji.map((j,i) => (
              <Card key={i} style={{ padding:22 }}>
                <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
                  <Avatar name={j.name} size={56} showLevel={false}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8, flexWrap:'wrap' }}>
                      <span style={{ fontSize:14, fontWeight:600, color:C.blue }}>{j.name}</span>
                      <span style={{ fontSize:12, color:C.muted }}>· {j.role}</span>
                      <Pill tone="blue">{j.level}</Pill>
                      <Pill tone="grey">{j.topic}</Pill>
                      <Pill tone={j.tone}>{j.status}</Pill>
                    </div>
                    <p style={{ font:'italic 600 18px/1.45 Vollkorn,serif', color:C.ink, marginBottom:12 }}>"{j.q}"</p>
                    <div style={{ display:'flex', gap:18, fontSize:12, color:C.muted, flexWrap:'wrap' }}>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:5 }}>
                        <Icon name="calendar" size={12}/>
                        Tenggat <span style={{ fontFamily:'Fira Code,monospace', color: j.tone==='red'?C.red:C.ink, fontWeight:500 }}>{j.deadline}</span>
                      </span>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:5 }}>
                        <Icon name="eye" size={12}/>
                        <span style={{ fontFamily:'Fira Code,monospace', color:C.ink, fontWeight:500 }}>{j.pemantau.toLocaleString('id-ID')}</span> pemantau
                      </span>
                    </div>
                  </div>
                  <Btn variant="outline" size="sm">Detail →</Btn>
                </div>
              </Card>
            ))}
            {janji.length === 0 && (
              <div style={{ padding:'48px 24px', textAlign:'center', border:`1px dashed ${C.line}`, borderRadius:14, color:C.muted, fontStyle:'italic' }}>
                Tidak ada janji yang cocok dengan filter ini.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ DASHBOARD PARTAI ============ */}
      <section style={{ padding:'56px 24px', background:C.cream, borderTop:`1px solid ${C.line}`, borderBottom:`1px solid ${C.line}` }}>
        <div style={{ maxWidth:1152, margin:'0 auto' }}>
          <div style={{ marginBottom:22 }}>
            <h2 style={{ font:'600 28px Vollkorn,serif', color:C.blue, letterSpacing:'-0.005em' }}>Dashboard Partai</h2>
            <p style={{ marginTop:6, fontSize:14, color:C.muted, maxWidth:560 }}>
              % janji yang ditepati per partai politik — dari janji yang sudah masuk database Jubir Warga.
            </p>
          </div>
          <div style={{ background:'#fff', border:`1px solid ${C.line}`, borderRadius:16, padding:'28px 32px' }}>
            <div style={{ display:'grid', gap:16 }}>
              {partai.map((p,i) => (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'90px 1fr 56px', alignItems:'center', gap:14 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:C.ink, fontFamily:'Inter,sans-serif' }}>{p.name}</span>
                  <div style={{ height:14, background:C.line, borderRadius:999, overflow:'hidden', position:'relative' }}>
                    <div style={{
                      width:`${p.pct}%`, height:'100%', background:p.color, borderRadius:999,
                      transition:'width .4s ease'
                    }}/>
                  </div>
                  <span style={{ fontSize:13, fontFamily:'Fira Code,monospace', fontWeight:600, color:p.color, textAlign:'right' }}>{p.pct}%</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:24, padding:'12px 16px', background:C.cream, borderRadius:10, display:'flex', alignItems:'flex-start', gap:10 }}>
              <Icon name="info" size={16} color={C.muted} sw={2}/>
              <p style={{ fontSize:12, color:C.muted, lineHeight:1.5, margin:0, flex:1 }}>
                Data dari janji yang sudah masuk database. <strong style={{ color:C.ink }}>Belum representatif keseluruhan</strong> — angka akan terus diperbarui seiring submission warga.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SUBMIT CTA ============ */}
      <section style={{ padding:'56px 24px' }} id="th-submit">
        <div style={{ maxWidth:1152, margin:'0 auto' }}>
          <div style={{
            background:C.cream, border:`1.5px solid ${C.coral}`, borderRadius:20,
            padding:'32px 40px', display:'grid', gridTemplateColumns:'200px 1fr auto', gap:32, alignItems:'center'
          }} className="th-submit">
            <TanganMenulisIllustration width={200}/>
            <div>
              <h3 style={{ font:'600 26px/1.25 Vollkorn,serif', color:C.blue, marginBottom:8, letterSpacing:'-0.005em' }}>
                Catat janji yang <em style={{ fontStyle:'italic', color:C.coral }}>kamu temui.</em>
              </h3>
              <p style={{ font:'400 15px/1.55 Inter,sans-serif', color:C.ink, opacity:.75, maxWidth:540 }}>
                Pejabat janji apa di kampungmu? Submit di sini — bantu kita melengkapi database janji nasional.
              </p>
            </div>
            <Btn variant="coral" size="lg">
              <Icon name="plus-circle" size={16} sw={2}/> Submit janji baru →
            </Btn>
          </div>
        </div>
      </section>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          .th-hero, .th-submit { grid-template-columns: 1fr !important; }
          .th-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .th-h1 { font-size: 52px !important; }
        }
      `}</style>
    </div>
  );
};

window.PageTagih = PageTagih;

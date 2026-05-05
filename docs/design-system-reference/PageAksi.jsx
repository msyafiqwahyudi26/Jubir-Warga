// Page: Aksi — Polling | Petisi | Kampanye | Lapor (sub-tabs)
const PageAksi = ({ onNav }) => {
  const { Pill, Btn, Avatar, Card, Progress, C } = window;
  const [tab, setTab] = React.useState('lapor');
  const [catFilter, setCatFilter] = React.useState('Semua');
  const [statFilter, setStatFilter] = React.useState(null);

  const Icon = ({ name, size = 14, color = 'currentColor', sw = 1.8 }) => {
    const paths = {
      'map-pin': <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
      clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
      'arrow-up': <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
      'plus-circle': <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></>,
      car: <><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></>,
      droplets: <><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></>,
      trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1.5 14a2 2 0 0 1-2 2H8.5a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
      bolt: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
      building: <><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h.01M15 17h.01"/></>,
      briefcase: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
      shield: <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6z"/>,
    }[name];
    return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths}</svg>;
  };

  const tabs = [
    { id:'polling', label:'Polling' },
    { id:'petisi', label:'Petisi' },
    { id:'kampanye', label:'Kampanye' },
    { id:'lapor', label:'Lapor' },
  ];

  const cats = [
    { id:'Semua', label:'Semua', icon:null },
    { id:'jalan', label:'Jalan & Transportasi', icon:'car' },
    { id:'banjir', label:'Banjir & Drainase', icon:'droplets' },
    { id:'sampah', label:'Sampah & Lingkungan', icon:'trash' },
    { id:'utilitas', label:'Listrik & Air', icon:'bolt' },
    { id:'fasum', label:'Fasilitas Umum', icon:'building' },
    { id:'pelayanan', label:'Pelayanan Publik', icon:'briefcase' },
    { id:'korupsi', label:'Korupsi', icon:'shield' },
  ];

  const statusTones = { 'Diterima':'mint', 'Ditindaklanjuti':'marigold', 'Selesai':'mint', 'Ditolak':'red' };

  const reports = [
    { t:'Lubang besar di Jl. Tebet Barat dekat halte', cat:'jalan', icon:'car', city:'Jakarta', kel:'Tebet', ago:'2j', status:'Diterima', dukungan:24 },
    { t:'Banjir setiap hujan di Kel. Antapani', cat:'banjir', icon:'droplets', city:'Bandung', kel:'Antapani', ago:'5j', status:'Ditindaklanjuti', dukungan:87 },
    { t:'Sampah menumpuk dekat SDN 03 Sukun', cat:'sampah', icon:'trash', city:'Malang', kel:'Sukun', ago:'1h', status:'Diterima', dukungan:12 },
    { t:'Lampu jalan mati 2 minggu di Tj. Duren', cat:'utilitas', icon:'bolt', city:'Jakarta', kel:'Tj. Duren', ago:'2h', status:'Selesai', dukungan:45 },
    { t:'Trotoar rusak parah di Sudirman Makassar', cat:'fasum', icon:'building', city:'Makassar', kel:'Pusat Kota', ago:'6h', status:'Diterima', dukungan:8 },
    { t:'Pelayanan KTP lambat di Disdukcapil Surabaya Selatan', cat:'pelayanan', icon:'briefcase', city:'Surabaya', kel:'Sby Selatan', ago:'1h', status:'Ditindaklanjuti', dukungan:156 },
    { t:'Drainase mampet di Kel. Petisah Tengah', cat:'banjir', icon:'droplets', city:'Medan', kel:'Petisah', ago:'4h', status:'Diterima', dukungan:33 },
    { t:'Tarif parkir liar di area Pasar Baru Bandung', cat:'pelayanan', icon:'briefcase', city:'Bandung', kel:'Pasar Baru', ago:'5h', status:'Ditindaklanjuti', dukungan:67 },
  ];

  const filteredReports = reports.filter(r => {
    if (catFilter !== 'Semua' && r.cat !== catFilter) return false;
    if (statFilter && r.status !== statFilter) return false;
    return true;
  });

  return (
    <div>
      {/* Page Hero */}
      <section style={{ padding:'56px 24px 32px', borderBottom:`1px solid ${C.line}` }}>
        <div style={{ maxWidth:1152, margin:'0 auto' }}>
          <h1 style={{ font:'700 64px/1.05 Vollkorn,serif', color:C.blue, letterSpacing:'-0.015em' }}>
            <em style={{ fontStyle:'italic' }}>Aksi</em> warga.
          </h1>
          <p style={{ marginTop:14, font:'400 17px/1.6 Inter,sans-serif', color:C.ink, opacity:.75, maxWidth:620 }}>
            Vote, tanda tangan petisi, gerak kampanye, lapor masalah di sekitarmu. Pilih jalurmu.
          </p>
        </div>
      </section>

      {/* Sub-tabs */}
      <section style={{ padding:'18px 24px', borderBottom:`1px solid ${C.line}`, background:C.cream, position:'sticky', top:64, zIndex:8 }}>
        <div style={{ maxWidth:1152, margin:'0 auto', display:'flex', gap:6 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding:'10px 22px', border:'none', cursor:'pointer',
              background: tab===t.id ? C.blue : 'transparent',
              color: tab===t.id ? C.cream : C.ink,
              fontSize:14, fontWeight:600, fontFamily:'Inter,sans-serif',
              borderRadius:10
            }}>{t.label}</button>
          ))}
        </div>
      </section>

      {/* Tab content */}
      {tab === 'lapor' && (
        <section style={{ padding:'48px 24px' }}>
          <div style={{ maxWidth:1152, margin:'0 auto' }}>
            {/* Lapor sub-hero */}
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:32, marginBottom:32, flexWrap:'wrap' }}>
              <div style={{ flex:1, minWidth:280 }}>
                <h2 style={{ font:'600 36px/1.15 Vollkorn,serif', color:C.blue, letterSpacing:'-0.005em', marginBottom:10 }}>
                  Lapor masalah <em style={{ fontStyle:'italic' }}>di sekitarmu.</em>
                </h2>
                <p style={{ font:'400 16px/1.6 Inter', color:C.ink, opacity:.75, maxWidth:580 }}>
                  Dari jalan rusak sampai banjir, dari sampah sampai pelayanan publik buruk — laporanmu sampai ke pemerintah daerahmu.
                </p>
              </div>
              <Btn variant="coral" size="lg">
                <Icon name="plus-circle" size={16} sw={2}/> Lapor Baru
              </Btn>
            </div>

            {/* Category chips */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:14 }}>
              <span style={{ alignSelf:'center', fontSize:11, fontWeight:600, color:C.muted, textTransform:'uppercase', letterSpacing:'.10em', marginRight:4 }}>Kategori:</span>
              {cats.map(c => {
                const active = catFilter === c.id;
                return (
                  <button key={c.id} onClick={() => setCatFilter(c.id)} style={{
                    padding:'6px 12px', borderRadius:999, fontSize:12.5, fontWeight:500, fontFamily:'Inter', cursor:'pointer',
                    background: active ? C.blue : 'transparent',
                    color: active ? C.cream : C.ink,
                    border: active ? 'none' : `1px solid ${C.line}`,
                    display:'inline-flex', alignItems:'center', gap:5
                  }}>
                    {c.icon && <Icon name={c.icon} size={12} color={active?C.cream:C.muted}/>}
                    {c.label}
                  </button>
                );
              })}
            </div>

            {/* Status pills */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
              <span style={{ alignSelf:'center', fontSize:11, fontWeight:600, color:C.muted, textTransform:'uppercase', letterSpacing:'.10em', marginRight:4 }}>Status:</span>
              {['Diterima','Ditindaklanjuti','Selesai','Ditolak'].map(s => {
                const active = statFilter === s;
                const tones = { 'Diterima':C.mint, 'Ditindaklanjuti':C.marigold, 'Selesai':C.mint, 'Ditolak':C.red };
                return (
                  <button key={s} onClick={() => setStatFilter(active ? null : s)} style={{
                    padding:'6px 12px', borderRadius:999, fontSize:12.5, fontWeight:500, fontFamily:'Inter', cursor:'pointer',
                    background: active ? tones[s] : 'transparent',
                    color: active ? '#fff' : C.ink,
                    border: active ? 'none' : `1px solid ${C.line}`
                  }}>{s}</button>
                );
              })}
            </div>

            {/* Reports grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14 }} className="lapor-grid">
              {filteredReports.map((r, i) => (
                <Card key={i} style={{ padding:18 }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                    {/* Category icon block */}
                    <div style={{
                      width:42, height:42, borderRadius:10, flexShrink:0,
                      background:C.cream, border:`1px solid ${C.line}`,
                      display:'flex', alignItems:'center', justifyContent:'center'
                    }}>
                      <Icon name={r.icon} size={18} color={C.blue} sw={1.8}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <h3 style={{ font:'600 16px/1.35 Vollkorn,serif', color:C.ink, marginBottom:8 }}>{r.t}</h3>
                      <div style={{ display:'flex', gap:14, fontSize:11.5, color:C.muted, marginBottom:10, flexWrap:'wrap' }}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
                          <Icon name="map-pin" size={11}/> {r.city}, {r.kel}
                        </span>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
                          <Icon name="clock" size={11}/> {r.ago} lalu
                        </span>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
                        <Pill tone={statusTones[r.status]}>{r.status}</Pill>
                        <button style={{
                          display:'inline-flex', alignItems:'center', gap:5,
                          padding:'5px 12px', borderRadius:999, border:`1px solid ${C.line}`,
                          background:'transparent', color:C.ink, cursor:'pointer',
                          fontSize:12, fontWeight:600, fontFamily:'Inter'
                        }}>
                          <Icon name="arrow-up" size={11} sw={2.4} color={C.coral}/>
                          <span style={{ fontFamily:'Fira Code,monospace' }}>{r.dukungan}</span> Dukung
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {filteredReports.length === 0 && (
                <div style={{ gridColumn:'1 / -1', padding:'48px 24px', textAlign:'center', border:`1px dashed ${C.line}`, borderRadius:14, color:C.muted, fontStyle:'italic' }}>
                  Tidak ada laporan yang cocok dengan filter ini.
                </div>
              )}
            </div>

            {/* Pagination */}
            <div style={{ marginTop:32, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
              <div style={{ display:'flex', gap:6 }}>
                {[1,2,3,4,5].map(p => (
                  <button key={p} style={{
                    width:34, height:34, borderRadius:8, border:`1px solid ${p===1?C.blue:C.line}`,
                    background: p===1 ? C.blue : 'transparent',
                    color: p===1 ? C.cream : C.ink,
                    fontSize:13, fontWeight:600, fontFamily:'Fira Code,monospace', cursor:'pointer'
                  }}>{p}</button>
                ))}
                <span style={{ alignSelf:'center', color:C.muted, padding:'0 6px' }}>…</span>
                <button style={{
                  width:34, height:34, borderRadius:8, border:`1px solid ${C.line}`,
                  background:'transparent', color:C.ink, fontSize:13, fontWeight:600, fontFamily:'Fira Code,monospace', cursor:'pointer'
                }}>23</button>
              </div>
              <Btn variant="outline" size="md">Lihat semua laporan →</Btn>
            </div>
          </div>
        </section>
      )}

      {tab === 'polling' && (
        <section style={{ padding:'48px 24px' }}>
          <div style={{ maxWidth:1152, margin:'0 auto' }}>
            <Card style={{ padding:28, background:'#FCE9E1', borderColor:'#E8632B55' }}>
              <Pill tone="coral">POLLING TERBARU</Pill>
              <h3 style={{ marginTop:14, font:'600 24px/1.3 Vollkorn,serif', color:C.blue }}>Anggaran subsidi BBM sebaiknya dialihkan ke mana?</h3>
              <div style={{ marginTop:18, display:'grid', gap:10 }}>
                {[
                  { l:'Transportasi publik massal', pct:42 },
                  { l:'Energi terbarukan', pct:28 },
                  { l:'Pendidikan vokasi', pct:18 },
                  { l:'Subsidi langsung warga', pct:12 },
                ].map((o,i) => (
                  <div key={i} style={{ position:'relative', padding:'14px 18px', background:'#fff', borderRadius:10, border:`1px solid ${C.line}`, cursor:'pointer' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', position:'relative', zIndex:2 }}>
                      <span style={{ fontWeight:500, fontSize:14 }}>{o.l}</span>
                      <span style={{ fontFamily:'Fira Code,monospace', fontSize:13, color:C.coral, fontWeight:600 }}>{o.pct}%</span>
                    </div>
                    <div style={{ position:'absolute', left:0, top:0, bottom:0, width:`${o.pct}%`, background:'#E8632B22', borderRadius:10 }}/>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:14, fontSize:12, color:C.muted, fontFamily:'Fira Code,monospace' }}>2.834 suara · 6 hari tersisa</div>
            </Card>
          </div>
        </section>
      )}

      {tab === 'petisi' && (
        <section style={{ padding:'48px 24px' }}>
          <div style={{ maxWidth:1152, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14 }} className="petisi-grid">
            {[
              { t:'Kembalikan jam KRL 04.00 WIB', tot:7300, tar:10000, p:73 },
              { t:'Subsidi internet untuk siswa pelosok', tot:4200, tar:8000, p:53 },
              { t:'Hentikan pembangunan tambang Wadas', tot:18450, tar:25000, p:74 },
              { t:'Stop kekerasan seksual di kampus', tot:32100, tar:50000, p:64 },
            ].map((p,i) => (
              <Card key={i} style={{ padding:22 }}>
                <Pill tone="mint">PETISI</Pill>
                <h3 style={{ marginTop:10, font:'600 18px/1.35 Vollkorn,serif', color:C.ink, marginBottom:14 }}>{p.t}</h3>
                <Progress percent={p.p} color="mint"/>
                <div style={{ marginTop:8, display:'flex', justifyContent:'space-between', fontSize:12, color:C.muted }}>
                  <span><span style={{ fontFamily:'Fira Code,monospace', color:C.ink, fontWeight:500 }}>{p.tot.toLocaleString('id-ID')}</span> / {p.tar.toLocaleString('id-ID')}</span>
                  <Btn variant="outline" size="sm">Tanda tangan →</Btn>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {tab === 'kampanye' && (
        <section style={{ padding:'48px 24px' }}>
          <div style={{ maxWidth:1152, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }} className="kampanye-grid">
            {[
              { t:'Hari Bumi Indonesia 2026', org:'Walhi × Jubir Warga', date:'22 April', peserta:1240, tone:'mint' },
              { t:'Tolak Reklamasi Pulau Pari', org:'Koalisi Pari', date:'1 Mei', peserta:680, tone:'coral' },
              { t:'Suara Buruh — May Day', org:'KSPI × FSPMI', date:'1 Mei', peserta:8200, tone:'marigold' },
            ].map((k,i) => (
              <Card key={i} style={{ padding:20 }}>
                <Pill tone={k.tone}>KAMPANYE</Pill>
                <h3 style={{ marginTop:10, font:'600 18px/1.3 Vollkorn,serif', color:C.ink, marginBottom:8 }}>{k.t}</h3>
                <div style={{ fontSize:12, color:C.muted, marginBottom:14 }}>{k.org}</div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:C.muted, fontFamily:'Fira Code,monospace' }}>
                  <span>{k.date}</span>
                  <span>{k.peserta.toLocaleString('id-ID')} peserta</span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 800px) {
          .lapor-grid, .petisi-grid, .kampanye-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

window.PageAksi = PageAksi;

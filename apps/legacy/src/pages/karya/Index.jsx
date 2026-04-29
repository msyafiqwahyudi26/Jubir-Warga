// PAGE: KARYA — Creator Space

const { useState: useKaryaState } = React;
const CKR = window.C;
const { Pill: KRPill, Button: KRBtn, UserAvatar: KRAvatar, NavTabs: KRTabs } = window;

const KARYA_DATA = [
  { type:'Tulisan',  author:'Reza Adipratama', chapter:'Jakarta',      time:'3j',  meta:'7 mnt',   featured:true,
    title:'Lima Alasan Pemuda Masih Apatis terhadap Pemilu Lokal' },
  { type:'Vlog',     author:'Mei Chandra',     chapter:'Bandung Raya', time:'1h',  meta:'12:34',   featured:true,
    title:'Ngobrol sama Ibu PKL soal APBD — ternyata mereka lebih paham dari yang kita kira' },
  { type:'Ilustrasi',author:'Pram Faisal',     chapter:'Surabaya',     time:'5j',  meta:'6 panel', featured:false,
    title:'Kenapa Suara Kita Bisa Hilang — dalam 6 panel visual' },
  { type:'Tulisan',  author:'Kanta Widodo',    chapter:'Malang Raya',  time:'2h',  meta:'12 mnt',  featured:false,
    title:'Demokrasi Deliberatif: Teori yang Bisa Kita Coba di RT/RW' },
  { type:'Podcast',  author:'Nadira Azzahra',  chapter:'Jakarta',      time:'1h',  meta:'45:22',   featured:false,
    title:'Obrolan Pagi: Gerakan Pemuda & Pemilu 2029' },
  { type:'Tulisan',  author:'Sari Lestari',    chapter:'Jakarta',      time:'6h',  meta:'15 mnt',  featured:false,
    title:'Catatan dari Dapur RUU: Bagaimana Sebuah Pasal Bisa Berubah' },
  { type:'Vlog',     author:'Bilal Sukarno',   chapter:'Jakarta',      time:'3h',  meta:'18:07',   featured:false,
    title:'Satu Hari Jadi Pemantau Pemilu di TPS' },
  { type:'Zine',     author:'Tim Jubir Warga', chapter:'Nasional',     time:'2h',  meta:'24 hal',  featured:false,
    title:'Zine: "Warga Bersuara" — Koleksi Suara dari 3 Kota' },
];

const KREATOR = [
  { name:'Bilal Sukarno',  chapter:'Jakarta',      karya:23, level:6 },
  { name:'Erik Kurniawan', chapter:'Jakarta',      karya:31, level:7 },
  { name:'Pram Faisal',    chapter:'Surabaya',     karya:12, level:4 },
  { name:'Nadira Azzahra', chapter:'Jakarta',      karya:15, level:5 },
  { name:'Mei Chandra',    chapter:'Bandung Raya', karya:8,  level:3 },
];

const TYPE_PILL = { Tulisan:'blue', Vlog:'coral', Ilustrasi:'mint', Podcast:'marigold', Zine:'grey' };
const TYPE_ICON = { Tulisan:'📄', Vlog:'▶️', Ilustrasi:'🎨', Podcast:'🎙️', Zine:'📖' };
const BG_HUES   = [210, 20, 160, 240, 280, 35, 185, 320];

function PageKarya({ onNavigate }) {
  const [tab, setTab] = useKaryaState('semua');

  const TAB_ITEMS = [
    {id:'semua',    label:'Semua'},
    {id:'tulisan',  label:'Tulisan'},
    {id:'vlog',     label:'Vlog'},
    {id:'ilustrasi',label:'Ilustrasi'},
    {id:'podcast',  label:'Podcast'},
    {id:'zine',     label:'Zine'},
  ];

  const filtered = tab === 'semua'
    ? KARYA_DATA
    : KARYA_DATA.filter(k => k.type.toLowerCase() === tab);

  return (
    <div>
      {/* Hero */}
      <section className="py-12 border-b" style={{ borderColor: CKR.line }}>
        <div className="max-w-6xl mx-auto px-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display font-bold text-4xl md:text-5xl" style={{ color: CKR.blue }}>Karya</h1>
            <p className="mt-3 text-lg max-w-xl" style={{ color: CKR.ink + '88' }}>
              Panggung anak muda yang punya isi.
            </p>
          </div>
          <KRBtn variant="coral" size="lg">📤 Upload Karya Kamu</KRBtn>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <KRTabs items={TAB_ITEMS} active={tab} onChange={setTab} />

        {/* Editor picks */}
        <div className="py-6 border-b" style={{ borderColor: CKR.line }}>
          <h3 className="font-display font-bold text-lg mb-4" style={{ color: CKR.blue }}>⭐ Pilihan Editor Minggu Ini</h3>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {KARYA_DATA.slice(0, 5).map((k, i) => (
              <div key={i}
                className="flex-shrink-0 w-52 rounded-xl border overflow-hidden card-lift cursor-pointer"
                style={{ borderColor: CKR.line }}>
                <div
                  className="h-28 flex flex-col items-center justify-center gap-1"
                  style={{ background: `hsl(${BG_HUES[i]},22%,88%)` }}
                >
                  <span className="text-3xl">{TYPE_ICON[k.type]}</span>
                </div>
                <div className="p-3 bg-white">
                  <KRPill color={TYPE_PILL[k.type]||'grey'} className="mb-1.5">{k.type}</KRPill>
                  <p className="font-display font-semibold text-xs leading-snug clamp2" style={{ color: CKR.ink }}>{k.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content + sidebar */}
        <div className="py-8 flex gap-6 items-start">

          {/* Grid */}
          <div className="flex-1 min-w-0">
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map((k, i) => (
                <div key={i} onClick={() => onNavigate('reading-view')}
                  className="rounded-2xl border card-lift cursor-pointer overflow-hidden"
                  style={{ borderColor: CKR.line }}>
                  {(k.type === 'Vlog' || k.type === 'Ilustrasi') && (
                    <div
                      className="h-40 flex items-center justify-center text-4xl"
                      style={{ background: `hsl(${BG_HUES[i%8]},18%,87%)` }}
                    >
                      {TYPE_ICON[k.type]}
                    </div>
                  )}
                  {k.type === 'Podcast' && (
                    <div className="h-16 flex items-center gap-3 px-4"
                      style={{ background: `hsl(${BG_HUES[i%8]},18%,93%)` }}>
                      <span className="text-2xl">🎙️</span>
                      {/* Waveform stylized */}
                      <svg viewBox="0 0 120 24" width="100" height="20">
                        {Array(30).fill(0).map((_, j) => {
                          const h = 4 + Math.abs(Math.sin(j * 0.7 + i)) * 16;
                          return <rect key={j} x={j*4} y={(24-h)/2} width="2.5" height={h} rx="1.2" fill={CKR.blue} opacity=".4"/>;
                        })}
                      </svg>
                      <span className="text-xs font-mono" style={{ color: CKR.ink + '77' }}>{k.meta}</span>
                    </div>
                  )}
                  <div className="p-4 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <KRPill color={TYPE_PILL[k.type]||'grey'}>{k.type}</KRPill>
                      {k.meta && k.type !== 'Podcast' && (
                        <span className="text-xs" style={{ color: CKR.ink + '55' }}>
                          {k.type === 'Vlog' ? '⏱ ' : '📖 '}{k.meta}
                        </span>
                      )}
                    </div>
                    <h4 className="font-display font-semibold text-base leading-snug mb-3 clamp2" style={{ color: CKR.ink }}>
                      {k.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <KRAvatar name={k.author} size="sm" showLevel={false} />
                      <div>
                        <span className="text-xs font-semibold" style={{ color: CKR.blue }}>{k.author}</span>
                        <span className="text-xs ml-1" style={{ color: CKR.ink + '55' }}>· {k.chapter} · {k.time} lalu</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden md:flex flex-col gap-4 w-56 flex-shrink-0">
            <div className="rounded-2xl border p-4" style={{ borderColor: CKR.line, background: '#fff' }}>
              <h4 className="font-semibold text-sm mb-3" style={{ color: CKR.blue }}>📈 Kreator lagi naik</h4>
              {KREATOR.map((k, i) => (
                <div key={i} className="flex items-center gap-2 py-2 border-b last:border-0" style={{ borderColor: CKR.line }}>
                  <KRAvatar name={k.name} size="sm" level={k.level} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate" style={{ color: CKR.blue }}>{k.name.split(' ')[0]}</div>
                    <div style={{ fontSize: 10, color: CKR.ink + '55' }}>{k.karya} karya</div>
                  </div>
                  <button
                    className="text-xs px-2 py-0.5 rounded-full border"
                    style={{ borderColor: CKR.blue, color: CKR.blue }}
                  >Follow</button>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border p-4" style={{ borderColor: CKR.line, background: '#fff' }}>
              <h4 className="font-semibold text-sm mb-3" style={{ color: CKR.blue }}>🏷️ Topik populer</h4>
              <div className="flex flex-wrap gap-1.5">
                {['Pemilu','Lingkungan','Gender','Transportasi','Ekonomi','Pendidikan','Mental Health','Lokal','Budaya'].map(t => (
                  <KRPill key={t} color="blue">{t}</KRPill>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Footer CTA */}
        <div className="py-10 border-t text-center" style={{ borderColor: CKR.line }}>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div>
              <p className="font-display text-2xl font-bold" style={{ color: CKR.blue }}>
                Kamu juga bisa naik panggung.
              </p>
              <p className="text-sm mt-1" style={{ color: CKR.ink + '77' }}>
                Submit karyamu dan jangkau ribuan warga muda Indonesia.
              </p>
            </div>
            <KRBtn variant="coral" size="lg">Submit Karya →</KRBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PageKarya });

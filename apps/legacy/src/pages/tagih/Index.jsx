// PAGE: TAGIH JANJI — Government promise tracker (5 provinsi MVP)
// IIFE WRAP — isolate top-level vars to prevent global pollution between page files
(function() {

const { useState: useTState } = React;
const CT = window.C;
const { Pill: TPill, Button: TBtn } = window;

// ── Janji data (12 dummy realistis Indonesia 2026) ───────
const JANJI = [
  { id: 1, nama: 'Joko K.',         jab: 'Presiden RI',           level: 'Pusat',    topik: 'Ekonomi',         status: 'Berjalan',  janji: '"Kami akan turunkan harga BBM 30% dalam 100 hari pertama."',                  deadline: '31 Des 2026', pemantau: 1284 },
  { id: 2, nama: 'Pramono A.',      jab: 'Gubernur DKI Jakarta', level: 'Provinsi', topik: 'Transportasi',   status: 'Berjalan',  janji: '"Tambah 50 km jalur sepeda baru sebelum akhir 2026."',                       deadline: '31 Des 2026', pemantau: 612 },
  { id: 3, nama: 'Sri Mulyani',     jab: 'Menkeu RI',            level: 'Pusat',    topik: 'Ekonomi',         status: 'Mandek',    janji: '"Subsidi BBM dialihkan ke transportasi publik massal."',                      deadline: '30 Jun 2027', pemantau: 893 },
  { id: 4, nama: 'Anies B.',        jab: 'Eks Gub. DKI',         level: 'Provinsi', topik: 'Lingkungan',     status: 'Mandek',    janji: '"Ruang terbuka hijau 30% di Jakarta dalam masa jabatan."',                   deadline: '31 Mar 2027', pemantau: 847 },
  { id: 5, nama: 'Ridwan K.',       jab: 'Eks Gub. Jabar',       level: 'Provinsi', topik: 'Pendidikan',     status: 'Ditepati',  janji: '"Bangun 1.000 sekolah vokasi di Jawa Barat."',                                deadline: 'Selesai',     pemantau: 621 },
  { id: 6, nama: 'Khofifah',        jab: 'Gubernur Jawa Timur',  level: 'Provinsi', topik: 'UMKM',           status: 'Berjalan',  janji: '"Akses kredit Rp10 juta untuk 100.000 UMKM Jatim."',                          deadline: '30 Jun 2027', pemantau: 412 },
  { id: 7, nama: 'Bobby N.',        jab: 'Wali Kota Medan',      level: 'Kota',     topik: 'Sampah',         status: 'Diingkari', janji: '"Atasi sampah Medan dalam 1 tahun."',                                          deadline: '30 Apr 2026', pemantau: 298 },
  { id: 8, nama: 'Danny P.',        jab: 'Wali Kota Makassar',   level: 'Kota',     topik: 'Banjir',         status: 'Belum',     janji: '"Bebas banjir di 5 titik kritis Makassar."',                                  deadline: '31 Des 2027', pemantau: 156 },
  { id: 9, nama: 'Edy R.',          jab: 'Eks Gub. Sumut',       level: 'Provinsi', topik: 'Lingkungan',     status: 'Berjalan',  janji: '"Tanam 1 juta pohon di Sumut sebelum 2027."',                                 deadline: '31 Des 2026', pemantau: 178 },
  { id: 10, nama: 'Andi Sudirman', jab: 'Gubernur Sulsel',      level: 'Provinsi', topik: 'Kesehatan',      status: 'Ditepati',  janji: '"Tambah 50 puskesmas di pesisir Sulsel."',                                    deadline: 'Selesai',     pemantau: 234 },
  { id: 11, nama: 'Eri C.',         jab: 'Wali Kota Surabaya',   level: 'Kota',     topik: 'Banjir',         status: 'Mandek',    janji: '"Atasi banjir 10 titik kritis Surabaya 2026."',                                deadline: '31 Des 2026', pemantau: 567 },
  { id: 12, nama: 'Sanusi',         jab: 'Bupati Malang',        level: 'Kota',     topik: 'Pelayanan',      status: 'Diingkari', janji: '"Konsultasi publik sebelum naikkan tarif parkir."',                          deadline: '15 Apr 2026', pemantau: 89 },
];

const STATUS_META = {
  Ditepati:  { color: 'mint',     bgHex: '#7FB69E', textHex: '#2C7A5C', icon: '✓' },
  Berjalan:  { color: 'marigold', bgHex: '#F2B137', textHex: '#9A6500', icon: '↻' },
  Mandek:    { color: 'grey',     bgHex: '#8A9099', textHex: '#525860', icon: '⏸' },
  Diingkari: { color: 'coral',    bgHex: '#E8632B', textHex: '#B84A1A', icon: '✕' },
  Belum:     { color: 'blue',     bgHex: '#3B4A8A', textHex: '#1A2256', icon: '⌛' },
};

const PARTAI = [
  { name: 'PDIP',     pct: 38, color: '#C44434' },
  { name: 'Gerindra', pct: 32, color: '#1A2256' },
  { name: 'Golkar',   pct: 28, color: '#F2B137' },
  { name: 'NasDem',   pct: 24, color: '#7FB69E' },
  { name: 'PKB',      pct: 18, color: '#3B4A8A' },
  { name: 'PKS',      pct: 14, color: '#E8632B' },
];

// ── Hero illustration: orang muda + papan checklist + peta Indonesia ──
function HeroTagihIllustration() {
  return (
    <svg viewBox="0 0 320 240" width="100%" style={{ maxWidth: 380 }}>
      {/* peta Indonesia outline (faint, di belakang) */}
      <g opacity="0.18" fill="#1A2256">
        <ellipse cx="60" cy="140" rx="35" ry="10" />
        <ellipse cx="115" cy="148" rx="28" ry="8" />
        <ellipse cx="175" cy="155" rx="40" ry="10" />
        <ellipse cx="230" cy="135" rx="22" ry="14" />
        <ellipse cx="265" cy="160" rx="18" ry="20" />
      </g>
      {/* Papan checklist */}
      <g transform="translate(180 50)">
        <rect width="100" height="120" rx="6" fill="#FFFFFF" stroke="#1A2256" strokeWidth="2" />
        <rect x="35" y="-6" width="30" height="10" rx="3" fill="#1A2256" />
        {[0, 1, 2, 3].map((i) => {
          const y = 18 + i * 22;
          const checked = i < 2;
          return (
            <g key={i}>
              <rect x="10" y={y} width="14" height="14" rx="3" fill={checked ? '#7FB69E' : 'none'} stroke="#1A2256" strokeWidth="1.5" />
              {checked && <path d={`M13 ${y + 7} L17 ${y + 11} L21 ${y + 4}`} stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" />}
              <rect x="30" y={y + 4} width="55" height="3" rx="1" fill="#1A2256" opacity="0.6" />
              <rect x="30" y={y + 9} width="40" height="3" rx="1" fill="#1A2256" opacity="0.3" />
            </g>
          );
        })}
      </g>
      {/* Orang muda di depan */}
      <g>
        {/* head */}
        <ellipse cx="80" cy="80" rx="20" ry="22" fill="#8B5A3C" />
        {/* hair */}
        <path d="M62 72 Q 80 58 98 72 Q 95 64 80 60 Q 65 64 62 72" fill="#1F1308" />
        {/* body */}
        <path d="M55 110 Q 55 100 65 100 L 95 100 Q 105 100 105 110 L 110 175 L 50 175 Z" fill="#3B4A8A" />
        {/* batik pattern hint */}
        <circle cx="80" cy="125" r="3" fill="#E8632B" opacity="0.7" />
        <circle cx="70" cy="140" r="2" fill="#F2B137" opacity="0.7" />
        <circle cx="90" cy="140" r="2" fill="#F2B137" opacity="0.7" />
        {/* arm pointing at board */}
        <path d="M105 110 L 145 100 Q 158 95 165 105 L 158 115 L 110 130 Z" fill="#3B4A8A" />
        {/* hand */}
        <ellipse cx="160" cy="106" rx="6" ry="5" fill="#8B5A3C" />
      </g>
    </svg>
  );
}

// ── Peta Indonesia interaktif ──
function PetaIndonesia({ onSelectProvince }) {
  const provinces = [
    { id: 'sumut',   name: 'Sumatera Utara', x: 70,  y: 130, ditepatiPct: 50, count: 4 },
    { id: 'dki',     name: 'DKI Jakarta',     x: 165, y: 165, ditepatiPct: 40, count: 5 },
    { id: 'jabar',   name: 'Jawa Barat',      x: 175, y: 170, ditepatiPct: 60, count: 5 },
    { id: 'jatim',   name: 'Jawa Timur',      x: 200, y: 175, ditepatiPct: 35, count: 7 },
    { id: 'sulsel',  name: 'Sulawesi Selatan',x: 270, y: 165, ditepatiPct: 55, count: 4 },
  ];

  function colorFor(pct) {
    if (pct > 50) return '#7FB69E';
    if (pct >= 25) return '#F2B137';
    return '#E8632B';
  }

  return (
    <div className="rounded-2xl border p-6" style={{ borderColor: CT.line, background: '#fff' }}>
      <h4 className="font-display font-bold text-base mb-4" style={{ color: CT.blue }}>
        Peta janji per provinsi (5 MVP)
      </h4>
      <svg viewBox="0 0 360 240" width="100%" style={{ maxHeight: 260 }}>
        {/* Outline pulau Indonesia (simplified) */}
        <g fill="#F0EBE0" stroke="#E6DECB" strokeWidth="1.5">
          {/* Sumatera */}
          <ellipse cx="60" cy="140" rx="40" ry="14" />
          {/* Jawa */}
          <ellipse cx="180" cy="175" rx="55" ry="9" />
          {/* Kalimantan */}
          <ellipse cx="225" cy="135" rx="32" ry="22" />
          {/* Sulawesi */}
          <ellipse cx="275" cy="155" rx="22" ry="28" />
          {/* Papua */}
          <ellipse cx="330" cy="155" rx="28" ry="18" />
        </g>
        {/* Highlighted provinces */}
        {provinces.map((p) => (
          <g key={p.id} style={{ cursor: 'pointer' }} onClick={() => onSelectProvince && onSelectProvince(p.id)}>
            <circle cx={p.x} cy={p.y} r="14" fill={colorFor(p.ditepatiPct)} opacity="0.85" />
            <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="#1A2256" strokeWidth="1" opacity="0.5" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">
              {p.count}
            </text>
            <text x={p.x} y={p.y + 26} textAnchor="middle" fontSize="9" fill="#1A2256" fontWeight="600">
              {p.name.split(' ')[0]}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex items-center justify-center gap-4 mt-4 text-xs" style={{ color: CT.ink + 'AA' }}>
        <span><span className="inline-block w-3 h-3 rounded-full mr-1" style={{ background: '#7FB69E' }}></span>&gt;50% ditepati</span>
        <span><span className="inline-block w-3 h-3 rounded-full mr-1" style={{ background: '#F2B137' }}></span>25–50%</span>
        <span><span className="inline-block w-3 h-3 rounded-full mr-1" style={{ background: '#E8632B' }}></span>&lt;25%</span>
      </div>
    </div>
  );
}

// ── PageTagih ──────────────────────────────────────────────
function PageTagih({ onNavigate }) {
  const [filterLevel, setFilterLevel] = useTState('Semua');
  const [filterStatus, setFilterStatus] = useTState('Semua');

  const filtered = JANJI.filter((j) =>
    (filterLevel === 'Semua' || j.level === filterLevel) &&
    (filterStatus === 'Semua' || j.status === filterStatus)
  );

  const total = JANJI.length;
  const counts = {
    Ditepati:  JANJI.filter((j) => j.status === 'Ditepati').length,
    Berjalan:  JANJI.filter((j) => j.status === 'Berjalan').length,
    Mandek:    JANJI.filter((j) => j.status === 'Mandek').length,
    Diingkari: JANJI.filter((j) => j.status === 'Diingkari').length,
    Belum:     JANJI.filter((j) => j.status === 'Belum').length,
  };
  const pct = (n) => Math.round((n / total) * 100);

  return (
    <div>
      {/* ── HERO ── */}
      <section className="py-12 md:py-16 border-b" style={{ borderColor: CT.line }}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="font-hand text-lg" style={{ color: CT.coral }}>Pilar</span>
            <h1
              className="font-display font-bold mt-1 leading-tight"
              style={{ color: CT.blue, fontSize: 'clamp(36px,5vw,56px)' }}
            >
              Tagih Janji <em>Pemerintah.</em>
            </h1>
            <p className="mt-4 text-base md:text-lg max-w-md leading-relaxed" style={{ color: CT.ink + '99' }}>
              Setiap janji yang diucapkan, kita catat. Yang ditepati, kita rayakan.
              Yang diingkari, kita ingatkan.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <TBtn variant="coral" size="lg">Lihat semua janji</TBtn>
              <TBtn variant="outline" size="lg" onClick={() => onNavigate("submit-janji")}>+ Submit janji baru</TBtn>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <HeroTagihIllustration />
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="py-10 border-b" style={{ borderColor: CT.line, background: CT.blue + '05' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { big: total + '', lbl: 'janji terlacak', color: CT.blue },
              { big: pct(counts.Ditepati) + '%', lbl: 'ditepati', color: CT.mint },
              { big: pct(counts.Berjalan) + '%', lbl: 'sedang berjalan', color: CT.marigold },
              { big: pct(counts.Mandek + counts.Diingkari) + '%', lbl: 'mandek / diingkari', color: CT.coral },
            ].map((s, i) => (
              <div key={i} className="p-5 rounded-2xl border bg-white" style={{ borderColor: CT.line }}>
                <p className="font-mono font-bold text-3xl md:text-4xl" style={{ color: s.color }}>{s.big}</p>
                <p className="text-xs mt-2" style={{ color: CT.ink + '99' }}>{s.lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PETA INDONESIA ── */}
      <section className="py-10 border-b" style={{ borderColor: CT.line }}>
        <div className="max-w-6xl mx-auto px-6">
          <PetaIndonesia onSelectProvince={() => {}} />
        </div>
      </section>

      {/* ── FILTER + LIST ── */}
      <section className="py-10 border-b" style={{ borderColor: CT.line }}>
        <div className="max-w-6xl mx-auto px-6">
          {/* Filter */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-bold uppercase tracking-wide mr-1" style={{ color: CT.ink + '99' }}>FILTER:</span>
            {['Semua', 'Pusat', 'Provinsi', 'Kota'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                style={{
                  borderColor: filterLevel === lvl ? CT.blue : CT.line,
                  background:  filterLevel === lvl ? CT.blue : '#fff',
                  color:        filterLevel === lvl ? CT.cream : CT.ink,
                }}
              >{lvl}</button>
            ))}
            <span className="mx-2 opacity-30">|</span>
            {['Semua', 'Ditepati', 'Berjalan', 'Mandek', 'Diingkari', 'Belum'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                style={{
                  borderColor: filterStatus === st ? CT.coral : CT.line,
                  background:  filterStatus === st ? CT.coral + '15' : '#fff',
                  color:        filterStatus === st ? CT.coral : CT.ink,
                }}
              >{st}</button>
            ))}
          </div>
          {/* List */}
          <div className="space-y-3">
            {filtered.map((j) => {
              const sm = STATUS_META[j.status] || STATUS_META.Belum;
              return (
                <div
                  key={j.id} onClick={() => onNavigate('janji-detail')}
                  className="p-5 rounded-2xl border bg-white card-lift cursor-pointer flex items-start gap-4"
                  style={{ borderColor: CT.line }}
                >
                  {/* Avatar circle */}
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ background: `hsl(${(j.id * 37) % 360},42%,40%)` }}
                  >
                    {j.nama.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-sm" style={{ color: CT.blue }}>{j.nama}</span>
                      <span className="text-xs" style={{ color: CT.ink + '66' }}>· {j.jab}</span>
                      <TPill color="blue">{j.level}</TPill>
                      <TPill color="grey">{j.topik}</TPill>
                    </div>
                    <p
                      className="font-display italic text-base md:text-lg leading-snug mt-2 mb-3"
                      style={{ color: CT.ink }}
                    >{j.janji}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: CT.ink + '77' }}>
                      <span>📅 Tenggat: <strong style={{ color: CT.ink }}>{j.deadline}</strong></span>
                      <span>👁 {j.pemantau} pemantau</span>
                    </div>
                  </div>
                  {/* Status + detail */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: sm.bgHex + '22', color: sm.textHex, border: `1.5px solid ${sm.bgHex}` }}
                    >{sm.icon} {j.status}</span>
                    <button className="text-xs font-semibold whitespace-nowrap" style={{ color: CT.coral }}>
                      Detail →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PARTAI ── */}
      <section className="py-12 border-b" style={{ borderColor: CT.line }}>
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="font-display text-xl font-bold mb-2" style={{ color: CT.blue }}>
            Track record partai politik
          </h3>
          <p className="text-sm mb-6" style={{ color: CT.ink + '99' }}>
            % janji ditepati per partai, dari janji-janji yang sudah masuk database.
            <em className="ml-1">Belum representatif keseluruhan.</em>
          </p>
          <div className="rounded-2xl border bg-white p-6" style={{ borderColor: CT.line }}>
            {PARTAI.map((p, i) => (
              <div key={i} className={`flex items-center gap-4 ${i < PARTAI.length - 1 ? 'mb-4 pb-4 border-b' : ''}`} style={{ borderColor: CT.line + '60' }}>
                <span className="font-bold text-sm w-20" style={{ color: CT.blue }}>{p.name}</span>
                <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: CT.line }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p.pct}%`, background: p.color }}></div>
                </div>
                <span className="font-mono font-bold text-sm w-12 text-right" style={{ color: CT.ink }}>{p.pct}%</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs italic" style={{ color: CT.ink + '66' }}>
            * Data dummy untuk preview. Versi live akan menggunakan data terverifikasi tim & komunitas.
          </p>
        </div>
      </section>

      {/* ── SUBMIT CTA ── */}
      <section className="py-14" style={{ background: CT.cream }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-hand text-2xl mb-3" style={{ color: CT.coral }}>Kamu juga bisa kontribusi</p>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-3" style={{ color: CT.blue }}>
            Catat janji yang kamu temui — bantu kita melengkapi data.
          </h3>
          <p className="text-sm md:text-base mb-6" style={{ color: CT.ink + '99' }}>
            Submit janji caleg/pejabat yang belum ada di sini.
            Tim kami verifikasi dalam 24–48 jam.
          </p>
          <TBtn variant="coral" size="lg" onClick={() => onNavigate("submit-janji")}>+ Submit janji baru →</TBtn>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { PageTagih, PetaIndonesia });

})();

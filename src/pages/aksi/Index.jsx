// PAGE: AKSI — Polling, Candidate Watch, Petisi
// IIFE WRAP — isolate top-level vars to prevent global pollution between page files
(function() {

const { useState: useAksiState } = React;
const CA = window.C;
const { Pill: APill, Button: ABtn, UserAvatar: AAvatar, ProgressBar: AProgress } = window;

const POLL_OPTIONS = [
  { id:'a', label:'Transportasi publik & KRL',  emoji:'🚇' },
  { id:'b', label:'Subsidi pangan & sembako',   emoji:'🛒' },
  { id:'c', label:'Beasiswa pendidikan',         emoji:'📚' },
];

const JANJI = [
  { nama:'Ridwan Suryadi',  jabatan:'Anggota DPR, Dapil DKI III',    janji:'Dorong revisi UU PPRT selesai sebelum akhir 2025',      status:'Berjalan'  },
  { nama:'Anisa Putri',     jabatan:'Wali Kota Jakarta Utara',        janji:'Tambah 50 titik CCTV di kawasan padat hunian',           status:'Ditepati'  },
  { nama:'Budi Santoso',    jabatan:'Anggota DPRD Bandung',           janji:'Audit transparan anggaran pembangunan jalan 2025',       status:'Belum'     },
  { nama:'Sri Mulyati',     jabatan:'Gubernur Jawa Tengah',           janji:'Tingkatkan akses internet gratis di 100 sekolah negeri', status:'Berjalan'  },
  { nama:'Hasan Basri',     jabatan:'Bupati Malang',                  janji:'Konsultasi publik sebelum naikkan tarif parkir',         status:'Diingkari' },
];

const STATUS_META = {
  Ditepati:  { color:'mint',     emoji:'✅' },
  Berjalan:  { color:'marigold', emoji:'🔄' },
  Belum:     { color:'blue',     emoji:'⏳' },
  Diingkari: { color:'coral',    emoji:'❌' },
};

const PETISI = [
  { title:'Audit Transparan APBD Jakarta 2026',            target:20000, current:14230, icon:'📋' },
  { title:'Kembalikan Jam KRL 04.00 WIB',                  target:10000, current:7340,  icon:'🚇' },
  { title:'Akses Internet Gratis untuk Sekolah Negeri',    target:50000, current:31890, icon:'💻' },
];

const LAPORAN = [
  { kategori: 'Jalan',   judul: 'Lubang besar di Jl. Tebet Barat dekat halte',                lokasi: 'Jakarta · Tebet',          waktu: '2j',  status: 'Diterima',       dukungan: 24  },
  { kategori: 'Banjir',  judul: 'Banjir setiap hujan di Kel. Antapani',                       lokasi: 'Bandung · Antapani',       waktu: '5j',  status: 'Ditindaklanjuti', dukungan: 87  },
  { kategori: 'Sampah',  judul: 'Sampah menumpuk dekat SDN 03 Sukun',                         lokasi: 'Malang · Sukun',           waktu: '1h',  status: 'Diterima',       dukungan: 12  },
  { kategori: 'Listrik', judul: 'Lampu jalan mati 2 minggu di Tj. Duren',                     lokasi: 'Jakarta · Tj. Duren',      waktu: '2h',  status: 'Selesai',        dukungan: 45  },
  { kategori: 'Layanan', judul: 'Pelayanan KTP lambat di Disdukcapil Surabaya Selatan',       lokasi: 'Surabaya',                 waktu: '1h',  status: 'Ditindaklanjuti', dukungan: 156 },
  { kategori: 'Drainase',judul: 'Drainase mampet di Kel. Petisah Tengah',                     lokasi: 'Medan · Petisah',          waktu: '4h',  status: 'Diterima',       dukungan: 33  },
];
const STATUS_LAPORAN = {
  Diterima:        { color: 'mint',     hex: '#7FB69E' },
  Ditindaklanjuti: { color: 'marigold', hex: '#F2B137' },
  Selesai:         { color: 'mint',     hex: '#2C7A5C' },
  Ditolak:         { color: 'coral',    hex: '#C44434' },
};

const KAMPANYE = [
  { title:'Gerakan 1000 Warga Pantau APBD', desc:'Bergabunglah memantau penggunaan anggaran daerahmu bersama komunitas.', participants:1243, icon:'🔍', featured:true  },
  { title:'Literasi Digital Desa 2026',     desc:'Bantu warga desa pahami informasi dan cegah hoaks online.',            participants:456,  icon:'📱', featured:false },
  { title:'Kawal Reforma Agraria',          desc:'Pantau distribusi lahan dan sengketa agraria di daerahmu.',            participants:789,  icon:'🌾', featured:false },
];

function PageAksi({ onNavigate }) {
  const [pollVote,   setPollVote]   = useAksiState(null);
  const [pollVotes,  setPollVotes]  = useAksiState({ a:412, b:287, c:831 });
  const [signedPetisi, setSignedPetisi] = useAksiState({});

  const totalVotes = Object.values(pollVotes).reduce((a,b) => a+b, 0);

  const handleVote = (id) => {
    if (pollVote) return;
    setPollVote(id);
    setPollVotes(prev => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const handleSign = (idx) => {
    setSignedPetisi(prev => ({ ...prev, [idx]: true }));
  };

  return (
    <div>
      {/* Hero */}
      <section className="py-12 border-b" style={{ borderColor: CA.line }}>
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="font-display font-bold text-4xl md:text-5xl" style={{ color: CA.blue }}>Aksi</h1>
          <p className="mt-3 text-lg" style={{ color: CA.ink+'88' }}>Bukan cuma ngomong — kita kerjain.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">

        {/* ── POLLING ── */}
        <div>
          <h3 className="font-display font-bold text-xl mb-4" style={{ color: CA.blue }}>📊 Polling Hari Ini</h3>
          <div className="p-6 md:p-8 rounded-2xl border" style={{ borderColor: CA.coral+'44', background: CA.coral+'07' }}>
            <p className="font-display text-lg md:text-xl font-semibold mb-1" style={{ color: CA.blue }}>
              Kalau bisa pilih, kamu mau anggaran subsidi BBM dialihkan ke mana?
            </p>
            <p className="text-sm mb-5" style={{ color: CA.ink+'66' }}>
              {pollVote ? `${totalVotes.toLocaleString('id')} warga sudah memilih` : 'Pilih untuk melihat hasil'}
            </p>

            <div className="space-y-3 mb-2">
              {POLL_OPTIONS.map(opt => {
                const pct    = Math.round((pollVotes[opt.id] / totalVotes) * 100);
                const isVote = pollVote === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleVote(opt.id)}
                    disabled={!!pollVote}
                    className="w-full p-4 rounded-xl border text-left relative overflow-hidden transition-all"
                    style={{
                      borderColor:  isVote ? CA.coral : CA.line,
                      background:   'white',
                      cursor:       pollVote ? 'default' : 'pointer',
                    }}
                  >
                    {/* Bar fill behind */}
                    {pollVote && (
                      <div
                        className="absolute inset-y-0 left-0 rounded-xl transition-all duration-700"
                        style={{ width:`${pct}%`, background: isVote ? CA.coral+'22' : CA.blue+'0A' }}
                      />
                    )}
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{opt.emoji}</span>
                        <span className="font-medium text-sm" style={{ color: CA.ink }}>{opt.label}</span>
                        {isVote && <APill color="coral">Pilihanmu ✓</APill>}
                      </div>
                      {pollVote && (
                        <span
                          className="font-mono font-bold text-sm flex-shrink-0"
                          style={{ color: isVote ? CA.coral : CA.ink+'66' }}
                        >{pct}%</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── CANDIDATE WATCH ── */}
        <div>
          <h3 className="font-display font-bold text-xl mb-4" style={{ color: CA.blue }}>👁️ Candidate Watch</h3>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: CA.line }}>
            {JANJI.map((j, i) => {
              const sm = STATUS_META[j.status] || STATUS_META.Belum;
              return (
                <div key={i}
                  className="flex items-start gap-4 p-4 border-b last:border-0 bg-white"
                  style={{ borderColor: CA.line }}>
                  <AAvatar name={j.nama} size="md" showLevel={false} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm" style={{ color: CA.blue }}>{j.nama}</div>
                    <div className="text-xs mb-1.5" style={{ color: CA.ink+'55' }}>{j.jabatan}</div>
                    <p className="text-sm leading-snug" style={{ color: CA.ink+'88' }}>{j.janji}</p>
                  </div>
                  <APill color={sm.color} className="flex-shrink-0">{sm.emoji} {j.status}</APill>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── PETISI ── */}
        <div>
          <h3 className="font-display font-bold text-xl mb-4" style={{ color: CA.blue }}>✍️ Petisi Aktif</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {PETISI.map((p, i) => {
              const pct    = Math.round(p.current / p.target * 100);
              const signed = signedPetisi[i];
              return (
                <div key={i} onClick={() => onNavigate('petisi-detail')} className="p-5 rounded-2xl border card-lift cursor-pointer" style={{ borderColor: CA.line, background:'#fff' }}>
                  <div className="text-3xl mb-3">{p.icon}</div>
                  <h4 className="font-display font-semibold text-base leading-snug mb-4" style={{ color: CA.ink }}>
                    {p.title}
                  </h4>
                  <AProgress percent={pct} colorKey="coral" className="mb-2" />
                  <div className="flex justify-between text-xs mb-4" style={{ color: CA.ink+'55' }}>
                    <span className="font-mono font-bold" style={{ color: CA.coral }}>
                      {(p.current + (signed?1:0)).toLocaleString('id')}
                    </span>
                    <span>target {p.target.toLocaleString('id')}</span>
                  </div>
                  {signed
                    ? <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: CA.mint }}>
                        ✅ Sudah ditandatangani
                      </div>
                    : <ABtn variant="coral" size="sm" className="w-full justify-center" onClick={(e) => { e.stopPropagation(); handleSign(i); }}>
                        ✍️ Tandatangani
                      </ABtn>
                  }
                </div>
              );
            })}
          </div>
        </div>

        {/* ── LAPOR WARGA ── */}
        <div>
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <h3 className="font-display font-bold text-xl flex items-center gap-2" style={{ color: CA.blue }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              Lapor Warga
            </h3>
            <ABtn variant="coral" size="sm" onClick={() => onNavigate("lapor-baru")}>+ Lapor Baru</ABtn>
          </div>
          <p className="text-sm mb-4" style={{ color: CA.ink + '99' }}>
            Dari jalan rusak sampai banjir, dari sampah sampai pelayanan publik buruk — laporanmu ke-track ke pemerintah daerah. Mulai dari Jakarta, Bandung, Malang.
          </p>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: CA.line }}>
            {LAPORAN.map((l, i) => {
              const sl = STATUS_LAPORAN[l.status] || STATUS_LAPORAN.Diterima;
              return (
                <div key={i} onClick={() => onNavigate('lapor-detail')}
                  className="flex items-center gap-3 p-4 border-b last:border-0 bg-white cursor-pointer hover:bg-gray-50"
                  style={{ borderColor: CA.line }}>
                  <span
                    className="flex-shrink-0 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide"
                    style={{ background: CA.blue + '11', color: CA.blue, border: `1px solid ${CA.blue}33` }}
                  >{l.kategori}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: CA.ink }}>{l.judul}</p>
                    <p className="text-xs mt-0.5" style={{ color: CA.ink + '66' }}>📍 {l.lokasi} · {l.waktu} lalu</p>
                  </div>
                  <span
                    className="text-xs font-bold whitespace-nowrap px-2 py-1 rounded-full"
                    style={{ color: sl.hex, background: sl.hex + '15', border: `1px solid ${sl.hex}55` }}
                  >{l.status}</span>
                  <button
                    className="text-xs font-bold whitespace-nowrap px-2.5 py-1 rounded-full"
                    style={{ color: CA.coral, border: `1.5px solid ${CA.coral}` }}
                  >↑ {l.dukungan}</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── KAMPANYE ── */}
        <div>
          <h3 className="font-display font-bold text-xl mb-4" style={{ color: CA.blue }}>📣 Kampanye Kolektif</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {KAMPANYE.map((k, i) => (
              <div key={i}
                className="p-5 rounded-2xl border card-lift cursor-pointer"
                style={{ borderColor: k.featured ? CA.blue : CA.line, background: k.featured ? CA.blue : '#fff' }}>
                <div className="text-3xl mb-3">{k.icon}</div>
                <h4 className="font-display font-semibold text-base leading-snug mb-2"
                  style={{ color: k.featured ? CA.cream : CA.ink }}>{k.title}</h4>
                <p className="text-sm mb-4" style={{ color: k.featured ? CA.cream+'80' : CA.ink+'77' }}>{k.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: k.featured ? CA.cream+'66' : CA.ink+'55' }}>
                    👥 {k.participants.toLocaleString('id')} bergabung
                  </span>
                  <ABtn variant={k.featured ? 'coral' : 'outline'} size="sm">Ikut →</ABtn>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ceksuaramu.com strip ── */}
        <div className="p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{ borderColor: CA.line, background: CA.blue+'08' }}>
          <div>
            <p className="font-semibold text-sm" style={{ color: CA.blue }}>📊 Integrasi ceksuaramu.com</p>
            <p className="text-xs mt-0.5" style={{ color: CA.ink+'66' }}>Data polling agregat warga Indonesia — lihat tren lebih luas</p>
          </div>
          <ABtn variant="outline" size="sm">Lihat data lebih dalam →</ABtn>
        </div>

        {/* ── Footer note ── */}
        <div className="text-center py-4">
          <p className="font-hand text-2xl" style={{ color: CA.coral }}>
            Aksi di Jubir Warga selalu gratis. Selamanya.
          </p>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PageAksi });

})();

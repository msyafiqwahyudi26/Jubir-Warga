// PAGE: KELAS — LMS

const { useState: useKelasState } = React;
const CKL = window.C;
const { Pill: KLPill, Button: KLBtn, UserAvatar: KLAvatar, ProgressBar: KLProgress } = window;

const KELAS_DATA = [
  { title:'Youth Political Participation in the Digital Age',        mentor:'Erik Kurniawan',    dur:'4 minggu', level:'Pemula',   harga:'Rp 200.000', peserta:234 },
  { title:'Politics and Popular Culture: Meme, Musik, dan Makna',   mentor:'Aqidatul Izza Zain',dur:'3 minggu', level:'Pemula',   harga:'Gratis',     peserta:567 },
  { title:'Social Marketing & Fundraising untuk Gerakan Sosial',    mentor:'Bilal Sukarno',     dur:'5 minggu', level:'Menengah', harga:'Rp 250.000', peserta:189 },
  { title:'Standup Comedy untuk Kritik Politik',                     mentor:'Putra Satria',      dur:'2 minggu', level:'Pemula',   harga:'Rp 150.000', peserta:312 },
  { title:'Fan-based Movement & Volunteer Management',               mentor:'Nadira Azzahra',    dur:'4 minggu', level:'Menengah', harga:'Rp 200.000', peserta:145 },
  { title:'Political Vlog Content Creation',                         mentor:'Mei Chandra',       dur:'3 minggu', level:'Pemula',   harga:'Rp 175.000', peserta:298 },
];

const MENTORS = [
  { name:'Bilal Sukarno',     bio:'Co-founder Warga Muda, aktivis demokrasi anak muda' },
  { name:'Erik Kurniawan',    bio:'Executive Director SPD, peneliti pemilu & demokrasi' },
  { name:'Aqidatul Izza Zain',bio:'Political communication researcher & trainer' },
  { name:'Putra Satria',      bio:'Komika sekaligus pemerhati kebijakan publik' },
  { name:'Nadira Azzahra',    bio:'Community organizer & volunteer management expert' },
  { name:'Mei Chandra',       bio:'Content creator & digital campaigner' },
];

const TESTIMONI = [
  { name:'Aulia Pratiwi', kota:'Bandung',  level:'Aktivis Mula',
    text:'Kelas ini bikin saya berani nulis opini pertama saya. Sekarang sudah ada 3 tulisan di platform!' },
  { name:'Kanta Widodo',  kota:'Malang',   level:'Warga Aktif',
    text:'Metodenya praktis banget. Minggu pertama langsung bisa dipake buat advokasi masalah parkir di kampung saya.' },
  { name:'Reza Adipratama',kota:'Surabaya',level:'Jubir Warga',
    text:'Mentornya oke, materinya relevan, komunitas alumni-nya masih aktif sampai sekarang.' },
];

const LEVEL_COLOR = { Pemula:'mint', Menengah:'marigold', Lanjut:'coral' };
const BG_HUE      = [210,160,20,280,35,185];

function PageKelas({ onNavigate }) {
  const [silabusOpen, setSilabusOpen] = useKelasState(false);

  return (
    <div>
      {/* Hero */}
      <section className="py-12 border-b" style={{ borderColor: CKL.line }}>
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="font-display font-bold text-4xl md:text-5xl" style={{ color: CKL.blue }}>Kelas</h1>
          <p className="mt-3 text-lg max-w-xl" style={{ color: CKL.ink+'88' }}>
            Belajar civic &amp; ekspresi yang nyata-nyata kepake.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">

        {/* ── Featured class ── */}
        <div className="py-8 border-b" style={{ borderColor: CKL.line }}>
          <div className="rounded-3xl overflow-hidden" style={{ background: CKL.blue }}>
            <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <KLPill color="marigold" className="mb-4">⭐ KELAS UNGGULAN</KLPill>
                <h2 className="font-display text-2xl md:text-3xl font-bold leading-snug mb-3" style={{ color: CKL.cream }}>
                  Kelas Jubir Warga:<br /><em>dari Resah, ke Suara, ke Aksi</em>
                </h2>
                <p className="text-sm mb-6 leading-relaxed" style={{ color: CKL.cream+'88' }}>
                  Program 6 minggu intensif untuk mengubah kepedulianmu jadi tindakan nyata.
                  Dari menulis opini, membangun kampanye, sampai advokasi langsung ke pengambil kebijakan.
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
                  {[['📅','6 minggu'],['📚','6 modul'],['🏅','Sertifikat'],['👤','6 mentor'],['💰','Rp 350.000']].map(([ic,tx],i) => (
                    <div key={i} className="flex items-center gap-1.5 text-sm" style={{ color: CKL.cream+'99' }}>
                      <span>{ic}</span><span>{tx}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <KLBtn variant="coral" size="lg">Daftar Gelombang Berikutnya</KLBtn>
                  <button
                    onClick={() => setSilabusOpen(true)}
                    className="btn-base px-5 py-3 rounded-xl text-sm font-semibold border"
                    style={{ borderColor: CKL.cream+'55', color: CKL.cream }}
                  >Lihat Silabus</button>
                </div>
                <p className="text-xs mt-3" style={{ color: CKL.cream+'44' }}>
                  * Atau gratis dengan aplikasi beasiswa
                </p>
              </div>

              {/* Illustration */}
              <div
                className="flex-shrink-0 w-44 rounded-2xl flex flex-col items-center justify-center gap-2"
                style={{ background: CKL.cream+'14', border:`2px dashed ${CKL.cream}30`, aspectRatio:'4/3' }}
              >
                <span className="text-5xl">🎓</span>
                <span className="font-mono text-xs" style={{ color: CKL.cream+'44' }}>ilustrasi kelas</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Kelas lain ── */}
        <div className="py-8 border-b" style={{ borderColor: CKL.line }}>
          <h3 className="font-display text-xl font-bold mb-5" style={{ color: CKL.blue }}>Kelas Lainnya</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {KELAS_DATA.map((k, i) => (
              <div key={i} onClick={() => onNavigate('kelas-detail')}
                className="rounded-2xl border overflow-hidden card-lift cursor-pointer"
                style={{ borderColor: CKL.line }}>
                <div
                  className="h-32 flex items-center justify-center text-4xl"
                  style={{ background: `hsl(${BG_HUE[i]},18%,88%)` }}
                >📖</div>
                <div className="p-4 bg-white">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <KLPill color={LEVEL_COLOR[k.level]||'blue'}>{k.level}</KLPill>
                    <span className="text-xs" style={{ color: CKL.ink+'55' }}>⏱ {k.dur}</span>
                  </div>
                  <h4 className="font-display font-semibold text-sm leading-snug mb-3 clamp2" style={{ color: CKL.ink }}>
                    {k.title}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: CKL.ink+'66' }}>👤 {k.mentor}</span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: k.harga==='Gratis' ? CKL.mint : CKL.blue }}
                    >{k.harga}</span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: CKL.ink+'50' }}>👥 {k.peserta} peserta</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Mentors ── */}
        <div className="py-8 border-b" style={{ borderColor: CKL.line }}>
          <h3 className="font-display text-xl font-bold mb-5" style={{ color: CKL.blue }}>Mentor di Jubir Warga</h3>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {MENTORS.map((m, i) => (
              <div key={i}
                className="flex-shrink-0 w-44 text-center p-4 rounded-2xl border"
                style={{ borderColor: CKL.line, background: '#fff' }}>
                <KLAvatar name={m.name} size="lg" showLevel={false} className="mx-auto mb-3" />
                <div className="font-semibold text-sm" style={{ color: CKL.blue }}>{m.name}</div>
                <div className="text-xs mt-1 leading-snug" style={{ color: CKL.ink+'66' }}>{m.bio}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Testimoni ── */}
        <div className="py-8">
          <h3 className="font-display text-xl font-bold mb-5" style={{ color: CKL.blue }}>Alumni Bilang</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {TESTIMONI.map((t, i) => (
              <div key={i}
                className={`p-5 rounded-2xl border ${i===0?'sticky-a':i===1?'sticky-b':''}`}
                style={{ borderColor: CKL.line, background:'#fff' }}>
                <p className="text-sm italic leading-relaxed mb-4" style={{ color: CKL.ink+'88' }}>
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <KLAvatar name={t.name} size="md" showLevel={false} />
                  <div>
                    <div className="text-sm font-semibold" style={{ color: CKL.blue }}>{t.name}</div>
                    <div className="text-xs" style={{ color: CKL.ink+'55' }}>{t.kota} · {t.level}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Silabus modal */}
      {silabusOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 backdrop-blur-sm" style={{ background: CKL.blue+'88' }}
            onClick={() => setSilabusOpen(false)} />
          <div className="relative rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto"
            style={{ background: CKL.cream, maxHeight:'90vh' }}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-display text-xl font-bold" style={{ color: CKL.blue }}>Silabus Kelas Jubir Warga</h3>
                <button onClick={() => setSilabusOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                  style={{ background: CKL.line }}>✕</button>
              </div>
              {['Modul 1: Dari Resah ke Isu — Cara Baca Masalah Sosial',
                'Modul 2: Suara Kamu, Wajahmu — Personal Branding & Opini',
                'Modul 3: Nulis untuk Menggerakkan — Jurnalisme Warga',
                'Modul 4: Kampanye Digital dari Nol',
                'Modul 5: Advokasi Langsung — Cara Ngomong ke Pembuat Kebijakan',
                'Modul 6: Aksi Kolektif & Membangun Gerakan'].map((m, i) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b last:border-0" style={{ borderColor: CKL.line }}>
                  <span className="font-mono font-bold text-sm w-6 flex-shrink-0" style={{ color: CKL.coral }}>
                    {String(i+1).padStart(2,'0')}
                  </span>
                  <p className="text-sm" style={{ color: CKL.ink }}>{m}</p>
                </div>
              ))}
              <KLBtn variant="coral" size="lg" className="w-full justify-center mt-5">
                Daftar Sekarang →
              </KLBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { PageKelas });

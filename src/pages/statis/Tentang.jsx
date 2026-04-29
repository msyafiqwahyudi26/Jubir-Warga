// PAGE: Tentang — about Jubir Warga
// IIFE WRAP
(function() {

const CT = window.C;
const { Pill: TPill, Button: TBtn, UserAvatar: TAvatar } = window;

const TIM = [
  { name: 'Erik Kurniawan',  role: 'Executive Director SPD',     bio: 'Peneliti pemilu & demokrasi, 15+ tahun di civic tech.' },
  { name: 'Bilal Sukarno',   role: 'Co-founder Warga Muda',      bio: 'Aktivis demokrasi anak muda, alumni Kelas Jubir Warga 2022.' },
  { name: 'Aqidatul Izza Z.',role: 'Lead Researcher',             bio: 'Political comm researcher, dosen UNAIR Surabaya.' },
  { name: 'Mei Chandra',     role: 'Head of Content',             bio: 'Content creator IG/TikTok, fokus literasi politik untuk Gen Z.' },
];

const MILESTONE = [
  { year: '2018', event: 'SPD (Sindikasi Pemilu & Demokrasi) berdiri sebagai konsorsium peneliti.' },
  { year: '2022', event: 'Kelas Jubir Warga pertama: 30 alumni dari 5 kota.' },
  { year: '2024', event: 'Pemantauan Pemilu 2024 dengan 200+ relawan di 12 provinsi.' },
  { year: '2025', event: 'Inisiasi platform Jubir Warga 2.0 sebagai community hub.' },
  { year: '2026', event: 'Beta launch jubir.spdindonesia.org. PT independen dalam pembentukan.' },
];

function Tentang({ onNavigate }) {
  const D = window.JWData;

  return (
    <div>
      {/* Hero */}
      <section className="py-16" style={{ background: `linear-gradient(135deg, ${CT.blue} 0%, ${CT.blueSoft} 100%)` }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <button onClick={() => onNavigate('beranda')} className="text-sm mb-6 opacity-80" style={{ color: CT.cream }}>← Kembali</button>
          <span className="font-hand text-lg" style={{ color: CT.marigold }}>Tentang kami</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mt-2 mb-4" style={{ color: CT.cream }}>
            Suara warga,<br /><em>rumahnya di sini.</em>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: CT.cream + 'BB' }}>
            Jubir Warga adalah rumah online anak muda Indonesia 17–39 tahun untuk ngumpul, bersuara, berkarya, dan belajar — bukan sekadar consume berita politik, tapi ikut bentuk arahnya.
          </p>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border bg-white p-6" style={{ borderColor: CT.line }}>
            <span className="font-hand text-base" style={{ color: CT.coral }}>Visi</span>
            <h3 className="font-display font-bold text-2xl mt-2 mb-3" style={{ color: CT.blue }}>Demokrasi yang sehat dimulai dari warga aktif.</h3>
            <p className="text-sm leading-relaxed" style={{ color: CT.ink + '99' }}>
              Indonesia 2030 di mana setiap anak muda 17-39 tahun punya rumah online untuk ngumpul lintas latar belakang, bersuara dengan etika, berkarya yang berdampak, dan belajar civic skills yang nyata.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6" style={{ borderColor: CT.line }}>
            <span className="font-hand text-base" style={{ color: CT.coral }}>Misi</span>
            <h3 className="font-display font-bold text-2xl mt-2 mb-3" style={{ color: CT.blue }}>4 pilar yang kami kerjakan</h3>
            <ul className="space-y-2 text-sm" style={{ color: CT.ink + '99' }}>
              <li>🏛️ <strong>Komunitas:</strong> Forum diskusi yang heavy-moderated, tidak ada bullying.</li>
              <li>🎤 <strong>Bersuara:</strong> Polling, petisi, lapor masalah, tagih janji.</li>
              <li>🎨 <strong>Berkarya:</strong> Panggung untuk tulisan, vlog, ilustrasi, podcast.</li>
              <li>📚 <strong>Belajar:</strong> Kelas civic skills dengan mentor & alumni aktif.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y" style={{ background: CT.cream, borderColor: CT.line }}>
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ['1.243', 'Warga aktif'],
            ['7', 'Chapter regional'],
            ['14', 'Janji ditrack'],
            ['8', 'Mitra kolaborasi'],
          ].map(([n, l], i) => (
            <div key={i}>
              <p className="font-display font-bold text-3xl md:text-4xl" style={{ color: CT.blue }}>{n}</p>
              <p className="text-xs mt-1 uppercase font-mono opacity-70" style={{ color: CT.ink }}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tim */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display font-bold text-3xl text-center mb-8" style={{ color: CT.blue }}>Tim Inti</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {TIM.map((m, i) => (
              <div key={i} className="rounded-2xl border bg-white p-5 flex items-start gap-4" style={{ borderColor: CT.line }}>
                <TAvatar name={m.name} size="lg" showLevel={false} />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-base" style={{ color: CT.blue }}>{m.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: CT.coral }}>{m.role}</p>
                  <p className="text-sm mt-2" style={{ color: CT.ink + '99' }}>{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestone */}
      <section className="py-12" style={{ background: CT.cream }}>
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display font-bold text-3xl text-center mb-8" style={{ color: CT.blue }}>Perjalanan Kami</h2>
          <ol className="border-l-2 pl-6 space-y-5" style={{ borderColor: CT.coral }}>
            {MILESTONE.map((m, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[35px] flex items-center justify-center rounded-full w-8 h-8 font-mono font-bold text-xs" style={{ background: CT.coral, color: CT.cream }}>{i + 1}</span>
                <p className="font-mono font-bold text-sm" style={{ color: CT.coral }}>{m.year}</p>
                <p className="text-sm mt-1" style={{ color: CT.ink }}>{m.event}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Mitra */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display font-bold text-2xl text-center mb-6" style={{ color: CT.blue }}>Didukung oleh</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {(D?.mitra || []).map((m, i) => (
              <span key={i} className="px-4 py-2 rounded-lg border text-sm font-semibold" style={{ borderColor: CT.line, background: '#fff', color: CT.blue }}>{m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: CT.blue }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3" style={{ color: CT.cream }}>Mau ikut bangun?</h2>
          <p className="text-base mb-6" style={{ color: CT.cream + '99' }}>Daftar gratis, dapat KTP Warga Digital. Bagi waktu kamu, kapasitas kamu, suara kamu — semua bentuk kontribusi.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <TBtn variant="coral" size="lg" onClick={() => onNavigate('daftar')}>Daftar gratis</TBtn>
            <a href="mailto:partnerships@jubirwarga.id" className="px-5 py-3 rounded-xl text-sm font-semibold border-2" style={{ borderColor: CT.cream + '55', color: CT.cream }}>Email kemitraan →</a>
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { Tentang });

})();

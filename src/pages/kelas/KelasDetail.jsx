// PAGE: KelasDetail — silabus 6 modul + mentor + harga + daftar
// IIFE WRAP — isolate top-level vars
(function() {

const CKD = window.C;
const { Pill: KDPill, Button: KDBtn, UserAvatar: KDAvatar, ProgressBar: KDProgress } = window;

const ALUMNI_TESTIMONI = [
  { name: 'Aulia Pratiwi',  kota: 'Bandung',   text: 'Kelas ini bikin saya berani nulis opini pertama. Sekarang sudah ada 3 tulisan di platform!' },
  { name: 'Kanta Widodo',   kota: 'Malang',    text: 'Praktis banget. Minggu pertama langsung bisa dipake buat advokasi tarif parkir di kampung.' },
  { name: 'Reza Adipratama',kota: 'Surabaya',  text: 'Mentornya oke, materi relevan, komunitas alumni-nya masih aktif sampai sekarang.' },
];

function KelasDetail({ onNavigate }) {
  const D = window.JWData;
  const { useStoreField, actions } = window.JWStore;

  const kelas = D?.byId?.kelas('kls-001') || D?.kelas?.[0] || { title: 'Kelas Jubir Warga', mentorId: 'u-bilal', dur: '6 minggu', harga: 'Rp 350.000', peserta: 124, modul: [] };
  const mentor = D?.byId?.user(kelas.mentorId) || { name: 'Bilal Sukarno', bio: 'Co-founder Warga Muda.', level: 6 };

  const [enrolled] = useStoreField(['follows', 'kelas-' + kelas.id]);
  const handleEnroll = () => actions.toggleFollow('kelas-' + kelas.id);

  return (
    <div>
      <section className="py-12" style={{ background: `linear-gradient(135deg, ${CKD.blue} 0%, ${CKD.blueSoft} 100%)` }}>
        <div className="max-w-5xl mx-auto px-6">
          <button onClick={() => onNavigate('kelas')} className="text-sm mb-6 opacity-80" style={{ color: CKD.cream }}>← Kembali ke Kelas</button>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <KDPill color="marigold" className="mb-4">⭐ KELAS UNGGULAN</KDPill>
              <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-3" style={{ color: CKD.cream }}>
                {kelas.title}
              </h1>
              <p className="text-base mb-6" style={{ color: CKD.cream + 'BB' }}>
                {kelas.desc || 'Program intensif untuk mengubah kepedulian jadi tindakan nyata.'}
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm" style={{ color: CKD.cream }}>
                <span>📅 {kelas.dur}</span>
                <span>📚 {(kelas.modul || []).length} modul</span>
                <span>🏅 Sertifikat</span>
                <span>👥 {kelas.peserta} peserta</span>
                <span>💰 {kelas.harga}</span>
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: CKD.cream, color: CKD.ink }}>
              <p className="text-xs uppercase font-mono opacity-60">Harga</p>
              <p className="font-display text-3xl font-bold" style={{ color: CKD.blue }}>{kelas.harga}</p>
              <p className="text-xs mt-1 opacity-70">* Atau gratis dengan beasiswa</p>
              <KDBtn variant={enrolled ? 'outline' : 'coral'} size="lg" className="w-full mt-4" onClick={handleEnroll}>
                {enrolled ? '✓ Sudah Daftar' : 'Daftar Gelombang Berikut'}
              </KDBtn>
              <p className="text-xs mt-3 text-center opacity-70">Mulai 15 Mei 2026 · Tersisa 12 kursi</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-10">
            {/* Silabus */}
            <div>
              <h2 className="font-display font-bold text-2xl mb-5" style={{ color: CKD.blue }}>📚 Silabus Kelas</h2>
              <ol className="space-y-3">
                {(kelas.modul || []).map((m, i) => (
                  <li key={m.id} className="rounded-xl border bg-white p-4" style={{ borderColor: CKD.line }}>
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-sm flex-shrink-0" style={{ background: CKD.blue, color: CKD.cream }}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-base" style={{ color: CKD.blue }}>{m.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: CKD.ink + '77' }}>⏱ {m.dur} · {m.tipe}</p>
                      </div>
                      <KDPill color={m.tipe === 'capstone' ? 'coral' : m.tipe === 'workshop' ? 'mint' : 'blue'}>{m.tipe}</KDPill>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* What you'll learn */}
            <div>
              <h2 className="font-display font-bold text-2xl mb-5" style={{ color: CKD.blue }}>🎯 Yang akan kamu kuasai</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {[
                  'Mengubah keresahan jadi pertanyaan riset yang fokus',
                  'Mendengar tanpa setuju — tanpa dianggap musuh',
                  'Riset cepat dengan sumber yang valid',
                  'Menulis opini publik yang dibaca tuntas',
                  'Membangun kampanye sederhana dengan low budget',
                  'Audiensi & negosiasi dengan pengambil kebijakan',
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: CKD.ink }}>
                    <span style={{ color: CKD.mint, flexShrink: 0 }}>✓</span>{t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mentor */}
            <div>
              <h2 className="font-display font-bold text-2xl mb-5" style={{ color: CKD.blue }}>👤 Mentor Utama</h2>
              <div className="rounded-2xl border bg-white p-5 flex items-center gap-4" style={{ borderColor: CKD.line }}>
                <KDAvatar name={mentor.name} size="lg" level={mentor.level} />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-lg" style={{ color: CKD.blue }}>{mentor.name}</p>
                  <p className="text-sm mt-1" style={{ color: CKD.ink + '99' }}>{mentor.bio}</p>
                </div>
              </div>
            </div>

            {/* Testimoni */}
            <div>
              <h2 className="font-display font-bold text-2xl mb-5" style={{ color: CKD.blue }}>💬 Kata Alumni</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {ALUMNI_TESTIMONI.map((t, i) => (
                  <div key={i} className="rounded-xl border bg-white p-4" style={{ borderColor: CKD.line }}>
                    <p className="text-sm italic" style={{ color: CKD.ink }}>"{t.text}"</p>
                    <p className="text-xs mt-3 font-semibold" style={{ color: CKD.blue }}>— {t.name}, {t.kota}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="font-display font-bold text-2xl mb-5" style={{ color: CKD.blue }}>❓ Pertanyaan Umum</h2>
              <div className="space-y-2">
                {[
                  ['Berapa lama waktu yang dibutuhkan per minggu?', 'Sekitar 5-7 jam. 90 menit live session + 3-5 jam reading & assignment.'],
                  ['Apakah ada sertifikat?', 'Ya, sertifikat digital + fisik untuk yang lulus capstone akhir.'],
                  ['Bagaimana kalau tertinggal?', 'Semua materi terekam dan accessible 6 bulan setelah kelas berakhir.'],
                  ['Bagaimana cara apply beasiswa?', 'Form aplikasi terbuka 2 minggu sebelum gelombang dimulai. Prioritas: mahasiswa, pengangguran, dari luar Jakarta.'],
                ].map(([q, a], i) => (
                  <details key={i} className="rounded-xl border bg-white p-4 cursor-pointer" style={{ borderColor: CKD.line }}>
                    <summary className="font-semibold text-sm" style={{ color: CKD.blue }}>{q}</summary>
                    <p className="text-sm mt-2" style={{ color: CKD.ink + '99' }}>{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-2xl border bg-white p-5 sticky top-4" style={{ borderColor: CKD.line }}>
              <h4 className="font-semibold text-sm mb-3" style={{ color: CKD.blue }}>Statistik Kelas</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1"><span style={{color:CKD.ink+'99'}}>Tingkat lulus</span><strong style={{color:CKD.mint}}>87%</strong></div>
                  <KDProgress percent={87} colorKey="mint" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span style={{color:CKD.ink+'99'}}>Rating alumni</span><strong style={{color:CKD.marigold}}>4.7 / 5</strong></div>
                  <KDProgress percent={94} colorKey="marigold" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span style={{color:CKD.ink+'99'}}>NPS alumni</span><strong style={{color:CKD.coral}}>+62</strong></div>
                  <KDProgress percent={81} colorKey="coral" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { KelasDetail });

})();

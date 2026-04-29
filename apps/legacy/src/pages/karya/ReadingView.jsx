// PAGE: Karya — Reading View (long-form artikel)
const CRV = window.C;
const { Pill: RVPill, Button: RVBtn, UserAvatar: RVAvatar } = window;

function ReadingView({ onNavigate }) {
  const article = {
    type: 'Tulisan',
    title: 'Lima Alasan Pemuda Masih Apatis terhadap Pemilu Lokal',
    subtitle: 'Catatan dari riset di 3 kota Indonesia',
    author: 'Reza Adipratama', level: 3, chapter: 'Surabaya',
    publishedAt: '12 April 2026', readTime: '7 menit',
    body: `Saat saya pertama kali bertanya ke 50 mahasiswa di Surabaya, "Kapan terakhir kamu mengikuti pilkada lokal?", jawaban yang paling sering muncul adalah: "Pilkada apa?"

Bukan ketidakpekaan. Bukan juga apatisme generasi. Tapi sesuatu yang lebih struktural.

## 1. Informasi yang tidak sampai

Pilkada lokal nyaris tidak pernah masuk algoritma TikTok atau Instagram. Yang viral adalah debat capres, debat menteri, drama elite Jakarta. Pilihan wali kota? Bupati? DPRD provinsi? Hampir tidak ada infrastruktur informasi yang menjangkau anak muda.

Saya cek IG akun KPU daerah — followers rata-rata 5,000-15,000. Bandingkan dengan akun selebgram lokal yang punya 200K+. Pertarungan attention sudah kalah sebelum dimulai.

## 2. Kandidat yang tidak relevan

Saat saya tunjukkan profil 5 kandidat DPRD ke responden, 80% tidak mengenali siapapun. Lebih jauh, ketika saya jelaskan latar belakang mereka, hanya 1 dari 50 yang merasa "ini orang ngerti dunia saya."

Mayoritas kandidat: usia 50+, latar belakang birokrat atau pengusaha. Visi kampanye: pembangunan infrastruktur fisik. Sedangkan keresahan anak muda: mental health, kerja layak, akses housing, kebebasan ekspresi.

## 3. Tidak ada arena diskusi yang netral

Forum politik di Twitter/X = arena perang. Threads = sepi. Discord politik = nicheTumblr-vibe. Reddit Indonesia = US-centric.

Tidak ada satu pun ruang netral di mana anak muda bisa diskusi pilkada tanpa langsung diserang atau di-cap "kadrun" / "cebong" / "menjijikan".

## 4. Hubungan partai politik dengan anak muda yang transactional

Setiap menjelang pemilu, partai politik tiba-tiba mendekati anak muda. Posting konten reels, undang influencer, bikin event. Setelah pemilu? Hilang.

Anak muda tidak bodoh. Mereka tahu itu bukan engagement, itu eksploitasi attention untuk vote. Trust hilang.

## 5. Tidak ada konsekuensi yang terlihat

Saat pemilu nasional 2024, anak muda turun ke TPS. Hasilnya: kebijakan dibuat, banyak yang tidak match janji, sedikit accountability.

> "Ngapain pilih kalau hasilnya gini?" — kutipan paling sering dari responden.

---

## Apa solusinya?

Setelah 6 bulan riset, saya pikir kita butuh **3 layer paralel**:

**Layer 1 — Infrastruktur informasi:** Platform yang khusus serve info pilkada lokal dalam format yang anak muda konsumsi. Bukan press release pemerintah, tapi dipresentasikan layaknya konten kreator.

**Layer 2 — Komunitas yang netral:** Ruang diskusi tanpa polarisasi yang heavy-moderated. Topik politik OK, tapi ad-hominem dilarang.

**Layer 3 — Akuntabilitas yang terlacak:** Janji-janji kandidat di-track terbuka. Tepat? Tidak? Mandek? Real-time, dengan bukti.

Ini bukan ide baru. Ini cuma perlu eksekusi yang konsisten dengan timeline 5-10 tahun, bukan project event 6 bulan menjelang pemilu.

Yang menarik, saya melihat beberapa initiatif sedang bermunculan di Indonesia. Ada Jubir Warga yang baru saja launch beta. Ada Tempo Witness. Ada ceksuaramu.com. Mereka sedang membangun layer-layer ini, satu per satu.

Apa kamu ikut?

---

*Reza Adipratama adalah peneliti partisipasi politik anak muda di Universitas Airlangga. Tulisan ini bagian dari riset yang akan dipublikasikan di journal akhir tahun.*`,
  };

  return (
    <div>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <button onClick={() => onNavigate('karya')} className="text-sm mb-6" style={{color: CRV.coral}}>← Kembali ke Karya</button>

        <RVPill color="blue" className="mb-3">{article.type}</RVPill>

        <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-4" style={{color: CRV.blue}}>
          {article.title}
        </h1>
        <p className="text-lg italic mb-6" style={{color: CRV.ink + '99', fontFamily: 'Vollkorn, serif'}}>
          {article.subtitle}
        </p>

        <div className="flex items-center gap-3 mb-8 pb-6 border-b" style={{borderColor: CRV.line}}>
          <RVAvatar name={article.author} size="md" level={article.level} />
          <div className="flex-1">
            <p className="font-bold text-sm" style={{color: CRV.blue}}>{article.author}</p>
            <p className="text-xs" style={{color: CRV.ink + '77'}}>{article.chapter} · {article.publishedAt} · {article.readTime} baca</p>
          </div>
          <RVBtn variant="outline" size="sm">Follow</RVBtn>
        </div>

        <div className="prose max-w-none" style={{color: CRV.ink, fontSize: 18, lineHeight: 1.75, fontFamily: 'Inter, sans-serif'}}>
          {article.body.split('\n\n').map((p, i) => {
            if (p.startsWith('## ')) {
              return <h2 key={i} className="font-display font-bold text-2xl mt-8 mb-4" style={{color: CRV.blue}}>{p.slice(3)}</h2>;
            }
            if (p.startsWith('> ')) {
              return <blockquote key={i} className="my-6 pl-4 italic font-display text-xl" style={{borderLeft: `3px solid ${CRV.coral}`, color: CRV.blue}}>{p.slice(2).replace(/"/g, '"').replace(/—.*$/, '')}</blockquote>;
            }
            if (p.startsWith('---')) {
              return <hr key={i} className="my-8" style={{borderColor: CRV.line}} />;
            }
            if (p.startsWith('*') && p.endsWith('*')) {
              return <p key={i} className="italic mt-6" style={{color: CRV.ink + '99', fontSize: 14}}>{p.slice(1, -1)}</p>;
            }
            return <p key={i} className="mb-5" dangerouslySetInnerHTML={{__html: p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}}/>;
          })}
        </div>

        {/* Tanya Nala */}
        <div className="rounded-2xl p-4 mt-12 flex items-center gap-3" style={{background: CRV.blue + '08'}}>
          <div>{window.NalaMascot && <window.NalaMascot expression="curious" size={50} />}</div>
          <p className="flex-1 text-sm" style={{color: CRV.ink}}>Mau diskusi atau elaborasi salah satu poin?</p>
          <RVBtn variant="coral" size="sm">✦ Tanya Nala</RVBtn>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ReadingView });

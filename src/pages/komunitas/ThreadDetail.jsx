// PAGE: Komunitas — Thread Detail
const CTD = window.C;
const { Pill: TDPill, Button: TDBtn, UserAvatar: TDAvatar } = window;

function ThreadDetail({ onNavigate }) {
  const [reply, setReply] = React.useState('');
  const [voted, setVoted] = React.useState(0);

  const thread = {
    author: 'Sari Lestari', level: 4, chapter: 'Jakarta', time: '2j',
    title: 'RUU PPRT, kenapa mandek terus setelah 20 tahun?',
    body: `Udah hampir dua dekade RUU PPRT digodok di DPR, tapi sampai sekarang masih jalan di tempat. Saya coba rekap dari awal.

Pertama, RUU ini sudah masuk Prolegnas sejak 2004. Tapi tiap periode DPR, prioritasnya selalu turun. Kenapa? Beberapa hipotesis:

1. **Lobi pengusaha rumah tangga**. Banyak anggota DPR sendiri pakai PRT, dan resistensi struktural untuk regulasi yang mengikat.

2. **Definisi yang masih diperdebatkan**. Apakah PRT adalah "pekerja" formal atau "anggota keluarga" — pendekatan yang berbeda totally.

3. **Komitmen politik partai yang fluktuatif**. Setiap pergantian kepemimpinan komisi, prioritas berubah.

Yang paling mengecewakan: ini bukan soal teknis legislasi, tapi political will. Dan political will ada saat ada tekanan publik.

Mari kita diskusikan: apa strategi yang efektif untuk push UU ini di sisa periode DPR sekarang?`,
    upvotes: 128, downvotes: 4, replies: 42,
    tags: ['Politik', 'Ketenagakerjaan'],
  };

  const replies = [
    { author: 'Reza Adipratama', level: 3, chapter: 'Jakarta', time: '1j', body: 'Setuju semua poinmu. Saya tambah satu: media coverage RUU PPRT minim banget. Kalau dibandingkan UU IKN yang sehari-hari di breaking news, RUU PPRT itu nyaris tak terdengar di media mainstream.', upvotes: 34 },
    { author: 'Nadira Azzahra', level: 3, chapter: 'Bandung Raya', time: '45m', body: 'Ada workshop dengan ILO bulan depan di Jakarta. Strategy session khusus PRT advocacy. Mau ikut? Saya bisa share invite link.', upvotes: 18 },
    { author: 'Bilal Sukarno', level: 6, chapter: 'Jakarta', time: '20m', body: 'Yang efektif menurut pengalaman: koalisi multi-stakeholder. NGO + akademisi + kelompok PRT sendiri. Pernah berhasil saat UU TKI dulu.', upvotes: 22 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button onClick={() => onNavigate('komunitas')} className="text-sm mb-4" style={{color: CTD.coral}}>← Kembali ke Forum</button>

      <article className="rounded-2xl border bg-white p-6 md:p-8 mb-6" style={{borderColor: CTD.line}}>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <TDAvatar name={thread.author} size="md" level={thread.level} />
          <div>
            <p className="font-bold text-sm" style={{color: CTD.blue}}>{thread.author}</p>
            <p className="text-xs" style={{color: CTD.ink + '77'}}>{thread.chapter} · {thread.time} lalu</p>
          </div>
          <div className="ml-auto flex gap-2">
            {thread.tags.map(t => <TDPill key={t} color="blue">{t}</TDPill>)}
          </div>
        </div>

        <h1 className="font-display text-2xl md:text-3xl font-bold leading-snug mb-4" style={{color: CTD.ink}}>
          {thread.title}
        </h1>

        <div className="prose max-w-none" style={{color: CTD.ink, fontSize: 16, lineHeight: 1.7}}>
          {thread.body.split('\n\n').map((p, i) => (
            <p key={i} className="mb-4" dangerouslySetInnerHTML={{__html: p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}}/>
          ))}
        </div>

        {/* Vote + actions */}
        <div className="flex items-center gap-4 mt-6 pt-4 border-t" style={{borderColor: CTD.line}}>
          <div className="flex items-center gap-1">
            <button onClick={() => setVoted(voted === 1 ? 0 : 1)} className="p-2 rounded-lg" style={{background: voted === 1 ? CTD.coral + '22' : 'transparent', color: voted === 1 ? CTD.coral : CTD.ink}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={voted === 1 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><polygon points="12 2 19 21 12 17 5 21 12 2"/></svg>
            </button>
            <span className="font-mono font-bold text-sm" style={{color: CTD.blue}}>{thread.upvotes - thread.downvotes + voted}</span>
            <button onClick={() => setVoted(voted === -1 ? 0 : -1)} className="p-2 rounded-lg" style={{background: voted === -1 ? CTD.blue + '22' : 'transparent', color: voted === -1 ? CTD.blue : CTD.ink + '77'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={voted === -1 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" style={{transform: 'rotate(180deg)'}}><polygon points="12 2 19 21 12 17 5 21 12 2"/></svg>
            </button>
          </div>
          <span className="text-sm" style={{color: CTD.ink + '77'}}>💬 {thread.replies} balasan</span>
          <button className="text-sm ml-auto" style={{color: CTD.ink + '77'}}>🔖 Bookmark</button>
          <button className="text-sm" style={{color: CTD.ink + '77'}}>↗ Bagikan</button>
        </div>
      </article>

      {/* Tanya Nala bar */}
      <div className="rounded-2xl p-4 mb-6 flex items-center gap-3" style={{background: CTD.blue + '08', border: `1px dashed ${CTD.blue + '40'}`}}>
        <div style={{flex: '0 0 auto'}}>{window.NalaMascot && <window.NalaMascot expression="thinking" size={50} />}</div>
        <p className="flex-1 text-sm" style={{color: CTD.ink}}>
          <em>Thread panjang? Biar Nala ringkas buat kamu.</em>
        </p>
        <TDBtn variant="coral" size="sm">✦ Ringkas thread ini</TDBtn>
      </div>

      {/* Replies */}
      <h3 className="font-display font-bold text-lg mb-4" style={{color: CTD.blue}}>{replies.length} balasan</h3>
      <div className="space-y-3 mb-6">
        {replies.map((r, i) => (
          <div key={i} className="rounded-xl border bg-white p-4" style={{borderColor: CTD.line}}>
            <div className="flex items-start gap-3 mb-2">
              <TDAvatar name={r.author} size="sm" level={r.level} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm" style={{color: CTD.blue}}>{r.author}</span>
                  <span className="text-xs" style={{color: CTD.ink + '66'}}>· {r.chapter} · {r.time} lalu</span>
                </div>
                <p className="text-sm" style={{color: CTD.ink}}>{r.body}</p>
                <div className="flex items-center gap-3 mt-2 text-xs" style={{color: CTD.ink + '77'}}>
                  <button>↑ {r.upvotes}</button>
                  <button>Reply</button>
                  <button>Quote</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="rounded-2xl border bg-white p-4 sticky bottom-4" style={{borderColor: CTD.line}}>
        <textarea value={reply} onChange={e => setReply(e.target.value)}
          placeholder="Tulis balasanmu..." rows={3}
          className="w-full p-3 rounded-lg outline-none text-sm resize-none"
          style={{border: `1px solid ${CTD.line}`}} />
        <div className="flex justify-end gap-2 mt-2">
          <TDBtn variant="ghost" size="sm">@Nala</TDBtn>
          <TDBtn variant="coral" size="sm" disabled={!reply}>Kirim balasan</TDBtn>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ThreadDetail });

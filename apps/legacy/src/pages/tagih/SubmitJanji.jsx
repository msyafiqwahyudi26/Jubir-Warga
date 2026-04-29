// PAGE: SubmitJanji — form submit janji baru ke tracker
// IIFE WRAP
(function() {

const CSJ = window.C;
const { Pill: SJPill, Button: SJBtn } = window;
const { useState: useSJState } = React;

function SubmitJanji({ onNavigate }) {
  const D = window.JWData;
  const { actions } = window.JWStore;

  const [data, setData] = useSJState({
    pejabat: '', janjiText: '', sumberUrl: '', topik: '', deadline: '', evidence: ''
  });
  const [submitted, setSubmitted] = useSJState(false);

  const valid = data.pejabat && data.janjiText.length >= 30 && data.sumberUrl && data.topik;

  const submit = () => {
    actions.incrementCount('janji-submitted', 1);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="text-6xl mb-4">📥</div>
        <h1 className="font-display font-bold text-2xl mb-3" style={{ color: CSJ.mint }}>Janji Tersubmit!</h1>
        <p className="text-sm mb-6" style={{ color: CSJ.ink + '99' }}>
          Tim moderator akan verifikasi sumber dan kutipan. Hasil verifikasi muncul dalam 24-48 jam di Tagih Janji.
        </p>
        <div className="flex gap-2">
          <SJBtn variant="outline" className="flex-1" onClick={() => { setSubmitted(false); setData({pejabat:'',janjiText:'',sumberUrl:'',topik:'',deadline:'',evidence:''}); }}>Submit Lagi</SJBtn>
          <SJBtn variant="coral" className="flex-1" onClick={() => onNavigate('tagih')}>Ke Tagih Janji</SJBtn>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <button onClick={() => onNavigate('tagih')} className="text-sm mb-4" style={{ color: CSJ.coral }}>← Kembali</button>

      <h1 className="font-display font-bold text-2xl md:text-3xl mb-2" style={{ color: CSJ.blue }}>Submit Janji Baru</h1>
      <p className="text-sm mb-6" style={{ color: CSJ.ink + '99' }}>Bantu komunitas track janji yang belum ada di sistem. Wajib ada sumber + kutipan asli.</p>

      <div className="rounded-2xl border bg-white p-6 space-y-5" style={{ borderColor: CSJ.line }}>
        {/* Pejabat */}
        <div>
          <label className="text-xs font-mono uppercase opacity-70 block mb-1" style={{ color: CSJ.ink }}>Pejabat *</label>
          <select value={data.pejabat} onChange={e => setData({...data, pejabat: e.target.value})} className="w-full p-3 rounded-lg outline-none text-sm" style={{ border: `1px solid ${CSJ.line}`, background: '#fff' }}>
            <option value="">— Pilih pejabat —</option>
            {(D?.pejabat || []).map(p => <option key={p.id} value={p.id}>{p.nama} — {p.jabatan}</option>)}
          </select>
          <button className="text-xs mt-1" style={{ color: CSJ.coral }}>+ Tidak ada di list? Tambah pejabat baru</button>
        </div>

        {/* Topik */}
        <div>
          <label className="text-xs font-mono uppercase opacity-70 block mb-1" style={{ color: CSJ.ink }}>Topik *</label>
          <div className="flex flex-wrap gap-2">
            {['Ekonomi','Transportasi','Pendidikan','Kesehatan','Lingkungan','UMKM','Sampah','Banjir','Pelayanan','Lainnya'].map(t => (
              <button key={t} onClick={() => setData({...data, topik: t})} className="px-3 py-1.5 rounded-full text-xs font-semibold border" style={{ borderColor: data.topik === t ? CSJ.coral : CSJ.line, background: data.topik === t ? CSJ.coral + '11' : '#fff', color: data.topik === t ? CSJ.coral : CSJ.ink + '99' }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Janji text */}
        <div>
          <label className="text-xs font-mono uppercase opacity-70 block mb-1" style={{ color: CSJ.ink }}>Kutipan janji asli * <span className="font-normal opacity-50">(min 30 karakter)</span></label>
          <textarea value={data.janjiText} onChange={e => setData({...data, janjiText: e.target.value})} placeholder='Misal: "Saya akan bangun 100 sekolah baru di Jawa Barat dalam 3 tahun."' rows={3} className="w-full p-3 rounded-lg outline-none text-sm resize-none" style={{ border: `1px solid ${CSJ.line}` }} />
          <p className="text-xs mt-1 opacity-60" style={{ color: CSJ.ink }}>{data.janjiText.length} karakter</p>
        </div>

        {/* Sumber URL */}
        <div>
          <label className="text-xs font-mono uppercase opacity-70 block mb-1" style={{ color: CSJ.ink }}>Sumber URL * <span className="font-normal opacity-50">(berita / video / dokumen)</span></label>
          <input type="url" value={data.sumberUrl} onChange={e => setData({...data, sumberUrl: e.target.value})} placeholder="https://..." className="w-full p-3 rounded-lg outline-none text-sm" style={{ border: `1px solid ${CSJ.line}` }} />
        </div>

        {/* Deadline */}
        <div>
          <label className="text-xs font-mono uppercase opacity-70 block mb-1" style={{ color: CSJ.ink }}>Deadline janji <span className="font-normal opacity-50">(opsional)</span></label>
          <input type="text" value={data.deadline} onChange={e => setData({...data, deadline: e.target.value})} placeholder="Misal: 31 Des 2027 atau 'akhir periode jabatan'" className="w-full p-3 rounded-lg outline-none text-sm" style={{ border: `1px solid ${CSJ.line}` }} />
        </div>

        {/* Bukti tambahan */}
        <div>
          <label className="text-xs font-mono uppercase opacity-70 block mb-1" style={{ color: CSJ.ink }}>Bukti tambahan <span className="font-normal opacity-50">(opsional)</span></label>
          <textarea value={data.evidence} onChange={e => setData({...data, evidence: e.target.value})} placeholder="Konteks tambahan, video timestamp, atau referensi lain" rows={2} className="w-full p-3 rounded-lg outline-none text-sm resize-none" style={{ border: `1px solid ${CSJ.line}` }} />
        </div>

        {/* Disclaimer */}
        <div className="p-3 rounded-lg" style={{ background: CSJ.marigold + '12' }}>
          <p className="text-xs" style={{ color: CSJ.ink }}>
            ⚠️ Submission akan diverifikasi tim moderator dalam 24-48 jam. Janji tanpa sumber yang valid akan ditolak. Hindari kutipan parafrase — gunakan kata-kata asli pejabat.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <SJBtn variant="ghost" className="flex-1" onClick={() => onNavigate('tagih')}>Batal</SJBtn>
          <SJBtn variant="coral" className="flex-1" onClick={submit} disabled={!valid}>Submit Janji</SJBtn>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SubmitJanji });

})();

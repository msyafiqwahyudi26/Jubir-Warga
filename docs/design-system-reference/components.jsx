// Shared components for the UI kit — lifted from the prototype with cosmetic-only edits

const { useState, useEffect } = React;

const C = {
  blue:'#1A2256', cream:'#FFFAEE', blueSoft:'#3B4A8A', ink:'#2A2D3A',
  muted:'#6B6860', line:'#E6DECB', coral:'#E8632B', marigold:'#F2B137',
  mint:'#7FB69E', red:'#C44434', grey:'#8A9099',
};

function Logo({ height = 32 }) {
  return <img src="../../assets/logo.svg" height={height} alt="Jubir Warga" style={{ display:'block' }} />;
}

function Pill({ tone='blue', children }) {
  const map = {
    blue:    { bg:'#E8ECF7', fg:'#1A2256', bd:'#C4CCEB' },
    coral:   { bg:'#FCE9E1', fg:'#B84A1A', bd:'#E8632B' },
    marigold:{ bg:'#FEF3D9', fg:'#9A6500', bd:'#F2B137' },
    mint:    { bg:'#E1F2EC', fg:'#2C7A5C', bd:'#7FB69E' },
    red:     { bg:'#FCE0DC', fg:'#9A2C22', bd:'#C44434' },
    grey:    { bg:'#F0EDE8', fg:'#6B6860', bd:'#E6DECB' },
    dark:    { bg:'#1A2256', fg:'#FFFAEE', bd:'#1A2256' },
  };
  const s = map[tone] || map.blue;
  return <span style={{
    display:'inline-flex', alignItems:'center', padding:'3px 10px',
    borderRadius:999, fontSize:12, fontWeight:500, fontFamily:'Inter,sans-serif',
    background:s.bg, color:s.fg, border:`1px solid ${s.bd}`, whiteSpace:'nowrap'
  }}>{children}</span>;
}

function Btn({ variant='primary', size='md', onClick, children, style={} }) {
  const sz = { sm:{p:'6px 14px',f:12,r:10}, md:{p:'10px 20px',f:14,r:12}, lg:{p:'14px 28px',f:16,r:14} }[size];
  const vs = {
    primary: { background:C.blue, color:C.cream, border:'none' },
    coral:   { background:C.coral, color:'#fff', border:'none' },
    outline: { background:'transparent', color:C.blue, border:`2px solid ${C.blue}` },
    'outline-coral': { background:'transparent', color:C.coral, border:`2px solid ${C.coral}` },
    ghost:   { background:'transparent', color:C.blue, border:'none' },
  }[variant];
  return <button onClick={onClick} className="btn" style={{
    padding: sz.p, fontSize: sz.f, borderRadius: sz.r, fontWeight:600,
    fontFamily:'Inter,sans-serif', cursor:'pointer', display:'inline-flex',
    alignItems:'center', gap:6, ...vs, ...style
  }}>{children}</button>;
}

function Avatar({ name='U', size=40, level=3, showLevel=true }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  const hue = (name.charCodeAt(0)*37 + (name.charCodeAt(1)||0)*11) % 360;
  const fs = size/2.6;
  return (
    <div style={{ position:'relative', display:'inline-block', flexShrink:0 }}>
      <div style={{
        width:size, height:size, borderRadius:999,
        background:`hsl(${hue},42%,40%)`, color:'#fff', display:'flex',
        alignItems:'center', justifyContent:'center',
        fontSize:fs, fontWeight:600, fontFamily:'Inter,sans-serif'
      }}>{initials}</div>
      {showLevel && (
        <span style={{
          position:'absolute', bottom:-2, right:-2,
          width: Math.max(14,size*0.35), height: Math.max(14,size*0.35),
          background:C.marigold, color:'#fff', borderRadius:999,
          fontSize: Math.max(9, size*0.22), fontWeight:700,
          display:'flex', alignItems:'center', justifyContent:'center'
        }}>{level}</span>
      )}
    </div>
  );
}

function Progress({ percent=0, color='blue' }) {
  const c = { blue:C.blue, coral:C.coral, mint:C.mint, marigold:C.marigold }[color];
  return (
    <div style={{ height:8, background:C.line, borderRadius:999, overflow:'hidden' }}>
      <div style={{ width:`${percent}%`, height:'100%', background:c, transition:'width .6s ease' }} />
    </div>
  );
}

function Card({ children, style={}, onClick, hoverable=true }) {
  return <div onClick={onClick} className={hoverable?'card-lift':''} style={{
    background:'#fff', border:`1px solid ${C.line}`, borderRadius:16, padding:20,
    cursor: onClick?'pointer':'default', ...style
  }}>{children}</div>;
}

function Header({ page, onNav, onJubir }) {
  // Lucide line icons inline
  const NavIcon = ({ name, size = 15 }) => {
    const paths = {
      home: <><path d="M3 12l9-9 9 9v8a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/></>,
      'message-circle': <path d="M21 11.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0z M12 19l-4 3v-3"/>,
      'edit-3': <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4z"/></>,
      'book-open': <><path d="M2 4h7a4 4 0 0 1 4 4v13"/><path d="M22 4h-7a4 4 0 0 0-4 4v13"/></>,
      zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
      'clipboard-check': <><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M8 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3"/><polyline points="9 13 11 15 15 11"/></>,
      'gamepad-2': <><line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/><line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/><path d="M17.32 5H6.68A4 4 0 0 0 2.81 8.18l-1.31 6A4 4 0 0 0 5.4 19h.68a4 4 0 0 0 3.4-1.86l.66-1.05a2 2 0 0 1 1.7-.94h.32a2 2 0 0 1 1.7.94l.66 1.05A4 4 0 0 0 17.92 19h.68a4 4 0 0 0 3.91-4.82l-1.31-6A4 4 0 0 0 17.32 5z"/></>,
    }[name];
    return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths}</svg>;
  };

  const items = [
    { id:'beranda', label:'Beranda', icon:'home' },
    { id:'komunitas', label:'Komunitas', icon:'message-circle' },
    { id:'karya', label:'Karya', icon:'edit-3' },
    { id:'kelas', label:'Kelas', icon:'book-open' },
    { id:'aksi', label:'Aksi', icon:'zap' },
    { id:'tagih', label:'Tagih Janji', icon:'clipboard-check' },
    { id:'main', label:'Main', icon:'gamepad-2', iconOnly:true },
  ];
  return (
    <header style={{
      position:'sticky', top:0, zIndex:40, background:C.cream,
      borderBottom:`1px solid ${C.line}`, height:64
    }}>
      <div style={{ maxWidth:1152, margin:'0 auto', padding:'0 24px', height:'100%', display:'flex', alignItems:'center', gap:16 }}>
        <button onClick={() => onNav('beranda')} style={{ background:'none', border:'none', cursor:'pointer', padding:0 }}>
          <Logo height={32} />
        </button>
        <nav style={{ display:'flex', gap:2, flex:1, justifyContent:'center' }}>
          {items.filter(it => !it.iconOnly).map(it => (
            <button key={it.id} onClick={() => onNav(it.id)} style={{
              padding:'6px 12px', borderRadius:8, border:'none', cursor:'pointer',
              background: page===it.id ? C.blue : 'transparent',
              color: page===it.id ? C.cream : C.ink,
              fontSize:13, fontWeight:500, fontFamily:'Inter,sans-serif',
              display:'inline-flex', alignItems:'center', gap:6
            }}>
              <NavIcon name={it.icon}/>
              {it.label}
            </button>
          ))}
          {items.filter(it => it.iconOnly).map(it => (
            <button key={it.id} onClick={() => onNav(it.id)}
                    title={it.label}
                    aria-label={it.label}
                    style={{
              width:32, height:32, marginLeft:6, borderRadius:8, border:'none', cursor:'pointer',
              background: page===it.id ? C.blue : 'transparent',
              color: page===it.id ? C.cream : C.ink,
              display:'inline-flex', alignItems:'center', justifyContent:'center'
            }}>
              <NavIcon name={it.icon} size={18}/>
            </button>
          ))}
        </nav>
        <button onClick={() => onNav('nala')} className="btn" style={{
          padding:'4px 10px 4px 4px', borderRadius:999, border:`1.5px solid ${C.coral}`,
          background:'transparent', color:C.coral, fontSize:13, fontWeight:600,
          cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6,
          fontFamily:'Inter,sans-serif'
        }}>
          <img src="../../assets/illustrations/mascot-nala.svg" width={24} height={26} alt="" style={{ display:'block' }}/>
          Nala
        </button>
        <Avatar name="Aulia Pratiwi" size={32} level={3} />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ background:C.blue, color:C.cream, padding:'56px 24px 32px' }}>
      <div style={{ maxWidth:1152, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:32 }}>
          <div>
            <div style={{ marginBottom:8 }}>
              <svg viewBox="0 0 280 64" width="180" height="40">
                <use href="../../assets/logo.svg#root" />
              </svg>
              <img src="../../assets/logo.svg" height={36} style={{ filter:'brightness(0) invert(1)' }} />
            </div>
            <p style={{ fontSize:13, opacity:.7, margin:'8px 0' }}>Suara warga, rumahnya di sini.</p>
            <p style={{ fontSize:11, opacity:.5, lineHeight:1.6 }}>Jl. Tebet Barat Dalam IIC No.14<br/>Tebet, Jakarta Selatan</p>
          </div>
          {[
            { h:'Platform', items:['Komunitas','Karya','Kelas','Aksi','Tagih Janji'] },
            { h:'Tentang',  items:['Cerita Kami','Tim','Partner','Karir'] },
            { h:'Hubungi',  items:['@jubirwarga.id','info@jubirwarga.id'] },
          ].map((col,i) => (
            <div key={i}>
              <div style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'.1em', opacity:.45, marginBottom:14 }}>{col.h}</div>
              {col.items.map(it => <div key={it} style={{ fontSize:13, opacity:.75, marginBottom:8 }}>{it}</div>)}
            </div>
          ))}
        </div>
        <div style={{ marginTop:36, paddingTop:18, borderTop:'1px solid #ffffff22', fontSize:11, opacity:.5 }}>
          © 2026 Jubir Warga · Inisiatif SPD
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { C, Logo, Pill, Btn, Avatar, Progress, Card, Header, Footer });

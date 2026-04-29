// COMPONENTS — shared across all pages

const { useState, useEffect } = React;

const C = {
  blue:     '#1A2256',
  cream:    '#FFFAEE',
  blueSoft: '#3B4A8A',
  ink:      '#2A2D3A',
  line:     '#E6DECB',
  coral:    '#E8632B',
  marigold: '#F2B137',
  mint:     '#7FB69E',
};

// ── Pill ──────────────────────────────────────────────
function Pill({ color = 'blue', children, className = '' }) {
  const map = {
    blue:     { bg: '#E8ECF7', text: '#1A2256', border: '#C4CCEB' },
    coral:    { bg: '#FCE9E1', text: '#B84A1A', border: '#E8632B' },
    marigold: { bg: '#FEF3D9', text: '#9A6500', border: '#F2B137' },
    mint:     { bg: '#E1F2EC', text: '#2C7A5C', border: '#7FB69E' },
    grey:     { bg: '#F0EDE8', text: '#6B6860', border: '#E6DECB' },
  };
  const s = map[color] || map.blue;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${className}`}
      style={{ background: s.bg, color: s.text, borderColor: s.border }}
    >
      {children}
    </span>
  );
}

// ── Button ────────────────────────────────────────────
function Button({ variant = 'primary', size = 'md', onClick, children, className = '', disabled = false }) {
  const sz = { sm: 'px-3.5 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-base' }[size];
  const base = `btn-base rounded-xl inline-flex items-center gap-1.5 font-semibold cursor-pointer select-none ${sz} ${className}`;
  const vs = {
    primary:       { background: C.blue,   color: C.cream,  border: 'none' },
    coral:         { background: C.coral,  color: '#fff',   border: 'none' },
    outline:       { background: 'transparent', color: C.blue,  border: `2px solid ${C.blue}` },
    ghost:         { background: 'transparent', color: C.blue,  border: 'none' },
    'outline-coral': { background: 'transparent', color: C.coral, border: `2px solid ${C.coral}` },
    'outline-light': { background: 'transparent', color: C.ink+'99', border: `1.5px solid ${C.line}` },
  };
  const st = vs[variant] || vs.primary;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={base}
      style={{ ...st, opacity: disabled ? .4 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {children}
    </button>
  );
}

// ── UserAvatar ────────────────────────────────────────
function UserAvatar({ name = 'U', size = 'md', level = 3, showLevel = true, className = '' }) {
  const sz = { sm: 32, md: 40, lg: 56, xl: 80 }[size] || 40;
  const fs = { sm: 12, md: 14, lg: 18, xl: 26 }[size] || 14;
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const hue = (name.charCodeAt(0) * 37 + (name.charCodeAt(1) || 0) * 11) % 360;
  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      <div
        className="rounded-full flex items-center justify-center font-semibold text-white"
        style={{ width: sz, height: sz, fontSize: fs, background: `hsl(${hue},42%,40%)` }}
      >
        {initials}
      </div>
      {showLevel && (
        <span
          className="absolute -bottom-0.5 -right-0.5 badge-glow text-white font-bold rounded-full flex items-center justify-center leading-none"
          style={{ width: 16, height: 16, fontSize: 9, background: C.marigold }}
        >
          {level}
        </span>
      )}
    </div>
  );
}

// ── ProgressBar ───────────────────────────────────────
function ProgressBar({ percent = 0, colorKey = 'blue', className = '' }) {
  const col = { blue: C.blue, coral: C.coral, mint: C.mint, marigold: C.marigold }[colorKey] || C.blue;
  return (
    <div className={`w-full h-2 rounded-full overflow-hidden ${className}`} style={{ background: C.line }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, percent)}%`, background: col }} />
    </div>
  );
}

// ── StatBlock ─────────────────────────────────────────
function StatBlock({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="font-mono font-bold text-xl" style={{ color: C.blue }}>{value}</span>
      <span className="text-xs text-center leading-tight" style={{ color: C.ink + '77' }}>{label}</span>
    </div>
  );
}

// ── NavTabs ───────────────────────────────────────────
function NavTabs({ items, active, onChange, className = '' }) {
  return (
    <div className={`flex border-b overflow-x-auto scrollbar-hide ${className}`} style={{ borderColor: C.line }}>
      {items.map(it => (
        <button
          key={it.id}
          onClick={() => onChange(it.id)}
          className="px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors"
          style={{
            borderColor: active === it.id ? C.coral : 'transparent',
            color:       active === it.id ? C.coral : C.ink + '88',
          }}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

// ── HeroSection ───────────────────────────────────────
function HeroSection({ title, subtitle, actions, className = '' }) {
  return (
    <section className={`py-12 border-b ${className}`} style={{ borderColor: C.line }}>
      <div className="max-w-6xl mx-auto px-6">
        {title && (
          <h1 className="font-display font-bold leading-tight text-4xl md:text-5xl" style={{ color: C.blue }}>
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="mt-3 text-base md:text-lg max-w-2xl" style={{ color: C.ink + '99' }}>{subtitle}</p>
        )}
        {actions && <div className="mt-5 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  );
}

// ── Modal ─────────────────────────────────────────────
function Modal({ open, onClose, children, maxW = 'max-w-lg' }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: C.blue + '88' }}
        onClick={onClose}
      />
      <div
        className={`relative rounded-2xl shadow-2xl ${maxW} w-full overflow-y-auto`}
        style={{ background: C.cream, maxHeight: '92vh' }}
      >
        {children}
      </div>
    </div>
  );
}

// ── Header ────────────────────────────────────────────
function Header({ currentPage, onNavigate }) {
  const [mOpen, setMOpen] = useState(false);

  // Lucide-style line icons (inline SVG)
  const I = (path) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  );
  const Icons = {
    home:    I(<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>),
    msg:     I(<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/>),
    edit:    I(<><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></>),
    book:    I(<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>),
    zap:     I(<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>),
    clip:    I(<><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>),
    game:    I(<><line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/><line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258A4 4 0 0 0 17.32 5z"/></>),
    user:    I(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>),
  };

  const navItems = [
    { id: 'beranda',   label: 'Beranda',     icon: Icons.home },
    { id: 'komunitas', label: 'Komunitas',   icon: Icons.msg  },
    { id: 'karya',     label: 'Karya',       icon: Icons.edit },
    { id: 'kelas',     label: 'Kelas',       icon: Icons.book },
    { id: 'aksi',      label: 'Aksi',        icon: Icons.zap  },
    { id: 'tagih',     label: 'Tagih Janji', icon: Icons.clip },
    { id: 'main',      label: 'Main',        icon: Icons.game },
  ];

  const bottomNav = [
    { id: 'beranda',   label: 'Beranda',   icon: Icons.home },
    { id: 'komunitas', label: 'Forum',     icon: Icons.msg  },
    { id: 'tagih',     label: 'Janji',     icon: Icons.clip },
    { id: 'nala',      label: 'Nala',      icon: Icons.msg  },
    { id: 'profil',    label: 'Profil',    icon: Icons.user },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b"
        style={{ height: 64, background: C.cream, borderColor: C.line }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-full flex items-center gap-4">
          {/* Logo */}
          <button onClick={() => onNavigate('beranda')} className="flex-shrink-0 flex flex-col leading-none">
            <span className="font-hand text-2xl font-bold" style={{ color: C.blue }}>Jubir Warga</span>
            <svg viewBox="0 0 90 7" width="90" height="7" style={{ marginTop: -2 }}>
              <path d="M2,5 Q22,1 45,4 Q68,7 88,3" stroke={C.coral} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {navItems.map(n => (
              <button
                key={n.id}
                onClick={() => onNavigate(n.id)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
                style={{
                  background: currentPage === n.id ? C.blue : 'transparent',
                  color:      currentPage === n.id ? C.cream : C.ink,
                }}
              >
                {n.icon}
                {n.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button className="relative w-9 h-9 rounded-full hover:bg-black/5 flex items-center justify-center" style={{ color: C.ink }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ background: C.coral }} />
            </button>
            <button
              onClick={() => onNavigate('nala')}
              className="hidden sm:flex btn-base rounded-full pl-1 pr-3.5 py-0.5 text-xs font-semibold border-2 transition-all items-center gap-1.5"
              style={{ borderColor: C.coral, background: C.cream, color: C.coral }}
              title="Tanya Nala — AI sahabatmu"
            >
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                {/* Mini Nala bird icon */}
                <svg width="22" height="22" viewBox="0 0 28 28">
                  <ellipse cx="14" cy="16" rx="8" ry="7" fill={C.blue}/>
                  <ellipse cx="14" cy="17" rx="5" ry="4.5" fill={C.cream} opacity="0.9"/>
                  <ellipse cx="14" cy="10" rx="6.5" ry="6" fill={C.blue}/>
                  <ellipse cx="11" cy="9" rx="1.5" ry="1.5" fill="#fff"/>
                  <ellipse cx="11.3" cy="9.3" rx="0.7" ry="0.7" fill={C.blue}/>
                  <path d="M17 10 L22 12 L17 14 Z" fill={C.marigold}/>
                  <ellipse cx="13" cy="4" rx="1.5" ry="2.5" fill={C.coral}/>
                </svg>
              </span>
              Nala
            </button>
            <button onClick={() => onNavigate('profil')}>
              <UserAvatar name="Aulia Pratiwi" size="sm" level={3} />
            </button>
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center"
              onClick={() => setMOpen(!mOpen)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="2">
                <line x1="3" y1="6"  x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mOpen && (
          <div
            className="md:hidden absolute top-full left-0 right-0 border-b shadow-lg z-50"
            style={{ background: C.cream, borderColor: C.line }}
          >
            {[...navItems, { id: 'nala', label: 'Tanya Nala', icon: Icons.msg }, { id: 'profil', label: 'Profil Saya', icon: Icons.user }].map(n => (
              <button
                key={n.id}
                onClick={() => { onNavigate(n.id); setMOpen(false); }}
                className="w-full text-left px-6 py-3 text-sm font-medium border-b flex items-center gap-2"
                style={{ borderColor: C.line + '60', color: currentPage === n.id ? C.coral : C.ink }}
              >
                {n.icon}
                {n.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t flex"
        style={{ background: C.cream, borderColor: C.line }}
      >
        {bottomNav.map(n => (
          <button
            key={n.id}
            onClick={() => onNavigate(n.id)}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5"
            style={{ color: currentPage === n.id ? C.coral : C.ink + '66', fontSize: 10, fontWeight: 500 }}
          >
            <span style={{ display: 'inline-flex' }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>
    </>
  );
}

// ── Footer ────────────────────────────────────────────
function Footer({ onNavigate }) {
  return (
    <footer style={{ background: C.blue, color: C.cream, paddingBottom: 80 }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="font-hand text-2xl font-bold mb-2" style={{ color: C.cream }}>Jubir Warga</div>
            <p className="text-sm mb-3" style={{ color: C.cream + '88' }}>Kumpul. Berkarya. Bersuara.</p>
            <p className="text-xs leading-relaxed" style={{ color: C.cream + '55' }}>
              Jl. Tebet Barat Dalam IIC No. 14,<br />Tebet, Jakarta Selatan
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['SPD', 'KitaBisa', 'Komisi.co', 'Indorelawan', 'ceksuaramu.com'].map(p => (
                <span key={p} className="text-xs px-2 py-0.5 rounded-lg" style={{ background: C.cream + '18', color: C.cream + '77' }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold mb-4" style={{ color: C.cream + '44' }}>Platform</div>
            {['komunitas', 'karya', 'kelas', 'aksi', 'main'].map(id => (
              <button key={id} onClick={() => onNavigate(id)}
                className="block text-sm mb-2 text-left capitalize"
                style={{ color: C.cream + '77' }}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold mb-4" style={{ color: C.cream + '44' }}>Tentang</div>
            {[['tentang','Tentang Kami'],['tentang','Tim'],['tentang','Partner'],['tentang','Press']].map(([id,l]) => (
              <button key={l} onClick={() => onNavigate(id)} className="block text-sm mb-2 text-left" style={{ color: C.cream + '77' }}>{l}</button>
            ))}
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold mb-4" style={{ color: C.cream + '44' }}>Hubungi</div>
            <p className="text-sm mb-1" style={{ color: C.cream + '77' }}>@jubirwarga.id</p>
            <p className="text-sm mb-5" style={{ color: C.cream + '77' }}>info@jubirwarga.id</p>
            <button
              className="text-sm px-4 py-2 rounded-xl font-semibold inline-flex items-center gap-2"
              style={{ background: '#25D366', color: '#fff' }}
            >
              <window.Icon name="bell" size={16} /> Subscribe Newsletter
            </button>
          </div>
        </div>
        <div
          className="mt-12 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
          style={{ borderTop: `1px solid ${C.cream}22` }}
        >
          <p className="text-xs" style={{ color: C.cream + '44' }}>
            © 2026 Jubir Warga ·{' '}
            <span style={{ color: C.cream + '66' }}>Inisiatif SPD</span> · Dalam pembentukan PT
          </p>
          <div className="flex gap-4">
            {[['privasi','Privasi'],['syarat','Syarat & Ketentuan']].map(([id,l]) => (
              <button key={id} onClick={() => onNavigate(id)} className="text-xs cursor-pointer hover:underline" style={{ color: C.cream + '88' }}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Export ────────────────────────────────────────────
Object.assign(window, { C, Pill, Button, UserAvatar, ProgressBar, StatBlock, NavTabs, HeroSection, Modal, Header, Footer });

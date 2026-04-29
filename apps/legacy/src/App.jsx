// APP — Main router & shell

const { useState: useAppState, useEffect: useAppEffect } = React;
const CApp = window.C;

const {
  Header, Footer, Onboarding,
  PageBeranda, PageKomunitas, PageKarya, PageKelas, PageAksi, PageMain, PageProfil,
  PageTagih, PageNala,
  // Detail existing
  ThreadDetail, ReadingView, LessonPlayer, PetisiDetail, JanjiDetail, PasporPublic,
  // Detail baru
  KelasDetail, LaporDetail, LaporBaru, PejabatProfile, SubmitJanji,
  // Auth
  Login, Daftar,
  // Statis
  Tentang, Privasi, Syarat,
  // Games
  SpotHoaks, TebakPasal,
} = window;

function Toast({ message, onDone }) {
  useAppEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      className="fixed top-20 left-1/2 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2"
      style={{ background: CApp.blue, color: CApp.cream, transform: 'translateX(-50%)' }}
    >
      🎉 {message}
    </div>
  );
}

function App() {
  const [page, setPage] = useAppState('beranda');
  const [showOnboarding, setShowOnboarding] = useAppState(false);
  const [toast, setToast] = useAppState(null);

  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    setToast('Selamat datang di Jubir Warga! KTP Wargamu sudah siap.');
  };

  const safe = (Component) => Component ? <Component onNavigate={navigate} /> : null;

  const PAGES = {
    beranda:   <PageBeranda   onNavigate={navigate} />,
    komunitas: <PageKomunitas onNavigate={navigate} />,
    karya:     <PageKarya     onNavigate={navigate} />,
    kelas:     <PageKelas     onNavigate={navigate} />,
    aksi:      <PageAksi      onNavigate={navigate} />,
    tagih:     <PageTagih     onNavigate={navigate} />,
    main:      <PageMain      onNavigate={navigate} />,
    nala:      <PageNala      onNavigate={navigate} />,
    profil:    <PageProfil    onNavigate={navigate} />,
    'thread-detail':   safe(ThreadDetail),
    'reading-view':    safe(ReadingView),
    'lesson-player':   safe(LessonPlayer),
    'petisi-detail':   safe(PetisiDetail),
    'janji-detail':    safe(JanjiDetail),
    'paspor-public':   safe(PasporPublic),
    'kelas-detail':    safe(KelasDetail),
    'lapor-detail':    safe(LaporDetail),
    'lapor-baru':      safe(LaporBaru),
    'pejabat-profile': safe(PejabatProfile),
    'submit-janji':    safe(SubmitJanji),
    'login':           safe(Login),
    'daftar':          safe(Daftar),
    'tentang':         safe(Tentang),
    'privasi':         safe(Privasi),
    'syarat':          safe(Syarat),
    'spot-hoaks':      safe(SpotHoaks),
    'tebak-pasal':     safe(TebakPasal),
  };

  const hideChrome = ['login','daftar','paspor-public'].includes(page);

  return (
    <div style={{ background: CApp.cream, minHeight: '100vh' }}>
      {showOnboarding && (
        <Onboarding
          onComplete={completeOnboarding}
          onNavigate={(p) => { completeOnboarding(); navigate(p); }}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {!hideChrome && <Header currentPage={page} onNavigate={navigate} />}

      <main style={{ paddingBottom: 80 }}>
        {PAGES[page] || PAGES.beranda}
      </main>

      {!hideChrome && <Footer onNavigate={navigate} />}

      {page === 'beranda' && !showOnboarding && (
        <button
          onClick={() => setShowOnboarding(true)}
          className="fixed bottom-24 md:bottom-8 left-4 md:left-6 z-30 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          style={{ background: CApp.blue, color: CApp.cream }}
        >
          👋 Baru di sini? Mulai onboarding
        </button>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

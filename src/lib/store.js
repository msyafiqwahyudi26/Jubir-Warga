// ─────────────────────────────────────────────────────────
// Jubir Warga — Lightweight client-side store
//
// Simple state container for mock interaktivitas (vote, sign,
// follow, comment, save). LocalStorage-persisted, no library.
//
// Pakai pattern window.JWStore — sesuai dengan window.* style
// project. Hooks tersedia via window.JWStore.useLocalState dan
// useStoreField.
//
// Phase 2: Replace dengan Supabase realtime + RLS.
// ─────────────────────────────────────────────────────────

(function (global) {
  'use strict';

  const STORAGE_KEY = 'jw_store_v1';
  const NS = 'jubirwarga';

  // ── Default state shape ─────────────────────────────
  const DEFAULTS = {
    // Per-resource interaksi user (id-based)
    votes:        {},        // { [pollId]: optionId }
    signed:       {},        // { [petisiId]: timestamp }
    follows:      {},        // { [chapterId]: true, [userId]: true }
    saved:        {},        // { [resourceId]: { type, savedAt } }
    upvoted:      {},        // { [threadId]: 1 | -1 }
    completed:    {},        // { [lessonId]: { progress: 0..1, ts } }

    // Counter delta lokal (display-only, supaya UI berubah seketika)
    counts:       {},        // { [resourceId]: number }

    // User profile (mock — sebelum auth real)
    user: {
      id:        'user-001',
      name:      'Anonim Warga',
      level:     1,
      xp:        0,
      badges:    [],
      paspor:    null,
      onboarded: false,
    },

    // UI prefs
    prefs: {
      darkMode:       false,
      reducedMotion:  false,
      lang:           'id',
      lastSeenPage:   'beranda',
    },

    // Chat history per Nala mode
    nala: {
      conversations: {},     // { [convId]: [{ role, text, ts }] }
      activeConvId:  null,
    },

    // Game scores
    games: {
      tebakKata: { won: 0, lost: 0, streak: 0, lastPlayed: null },
      spotHoaks: { won: 0, lost: 0, lastPlayed: null },
      tebakPasal: { won: 0, lost: 0, lastPlayed: null },
    },
  };

  // ── Internal state + listeners ──────────────────────
  let state = load();
  const listeners = new Set();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return deepClone(DEFAULTS);
      const parsed = JSON.parse(raw);
      // Shallow merge supaya struktur baru tidak hilang
      return mergeDeep(deepClone(DEFAULTS), parsed);
    } catch (e) {
      console.warn(`[${NS}] failed to load store:`, e);
      return deepClone(DEFAULTS);
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn(`[${NS}] failed to persist:`, e);
    }
  }

  function notify() {
    listeners.forEach(fn => {
      try { fn(state); } catch (e) { console.warn(`[${NS}] listener error:`, e); }
    });
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  // ── Public API: get / set / patch ───────────────────
  function getState() { return state; }

  function setField(path, value) {
    state = setIn(state, path, value);
    persist();
    notify();
    return state;
  }

  function patch(partial) {
    state = mergeDeep(state, partial);
    persist();
    notify();
    return state;
  }

  function reset() {
    state = deepClone(DEFAULTS);
    persist();
    notify();
  }

  // ── Domain helpers (vote, sign, follow, dst.) ───────
  const actions = {
    vote(pollId, optionId) {
      setField(['votes', pollId], optionId);
    },
    sign(petisiId) {
      if (state.signed[petisiId]) return false;
      setField(['signed', petisiId], Date.now());
      return true;
    },
    unsign(petisiId) {
      const s = { ...state.signed }; delete s[petisiId];
      setField(['signed'], s);
    },
    toggleFollow(targetId) {
      setField(['follows', targetId], !state.follows[targetId]);
    },
    save(resourceId, type) {
      setField(['saved', resourceId], { type, savedAt: Date.now() });
    },
    unsave(resourceId) {
      const s = { ...state.saved }; delete s[resourceId];
      setField(['saved'], s);
    },
    upvote(threadId, dir) {
      // dir = 1 (up), -1 (down), 0 (clear)
      if (dir === 0) {
        const u = { ...state.upvoted }; delete u[threadId];
        setField(['upvoted'], u);
      } else {
        setField(['upvoted', threadId], dir);
      }
    },
    incrementCount(resourceId, delta = 1) {
      const cur = state.counts[resourceId] || 0;
      setField(['counts', resourceId], cur + delta);
    },
    setLessonProgress(lessonId, progress) {
      setField(['completed', lessonId], { progress, ts: Date.now() });
    },
    saveNalaMessage(convId, msg) {
      const arr = state.nala.conversations[convId] || [];
      setField(['nala', 'conversations', convId], [...arr, { ...msg, ts: Date.now() }]);
    },
    setActiveConv(convId) {
      setField(['nala', 'activeConvId'], convId);
    },
    bumpGameWin(game)  { setField(['games', game, 'won'],  (state.games[game]?.won  || 0) + 1); },
    bumpGameLoss(game) { setField(['games', game, 'lost'], (state.games[game]?.lost || 0) + 1); },
    setUser(partial)   { state = setIn(state, ['user'], { ...state.user, ...partial }); persist(); notify(); },
  };

  // ── React hook: subscribe ke field tertentu ─────────
  // Pakai: const [signed, , api] = JWStore.useStoreField(['signed', petisiId]);
  function useStoreField(path) {
    const [, force] = React.useState(0);
    React.useEffect(() => {
      return subscribe(() => force(n => n + 1));
    }, []);
    const value = getIn(state, path);
    return [value, (v) => setField(path, v), actions];
  }

  // ── React hook: useLocalState (per-component localStorage) ─
  // Pakai: const [val, setVal] = JWStore.useLocalState('kelas-filter', 'all');
  function useLocalState(key, initial) {
    const fullKey = `${NS}:ls:${key}`;
    const [val, setVal] = React.useState(() => {
      try {
        const raw = localStorage.getItem(fullKey);
        return raw !== null ? JSON.parse(raw) : initial;
      } catch { return initial; }
    });
    React.useEffect(() => {
      try { localStorage.setItem(fullKey, JSON.stringify(val)); }
      catch (e) { /* quota or private mode */ }
    }, [fullKey, val]);
    return [val, setVal];
  }

  // ── Util: deepClone, mergeDeep, getIn, setIn ────────
  function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

  function mergeDeep(a, b) {
    if (Array.isArray(b)) return b.slice();
    if (b !== null && typeof b === 'object') {
      const out = { ...a };
      Object.keys(b).forEach(k => {
        out[k] = (a && typeof a[k] === 'object' && !Array.isArray(a[k]))
          ? mergeDeep(a[k] || {}, b[k])
          : b[k];
      });
      return out;
    }
    return b;
  }

  function getIn(obj, path) {
    return path.reduce((o, k) => (o == null ? o : o[k]), obj);
  }

  function setIn(obj, path, value) {
    if (!path.length) return value;
    const [head, ...rest] = path;
    return {
      ...obj,
      [head]: rest.length ? setIn(obj[head] || {}, rest, value) : value,
    };
  }

  // ── Export ───────────────────────────────────────────
  global.JWStore = {
    // state
    getState,
    setField,
    patch,
    reset,
    subscribe,
    // domain
    actions,
    // hooks
    useStoreField,
    useLocalState,
    // constants
    DEFAULTS: deepClone(DEFAULTS),
    STORAGE_KEY,
  };
})(window);

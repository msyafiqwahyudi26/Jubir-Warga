type EventName =
  | 'thread_view'
  | 'karya_view'
  | 'kelas_enroll'
  | 'janji_pantau'
  | 'petisi_sign'
  | 'polling_vote'
  | 'game_play'
  | 'nala_open'
  | 'auth_signup'
  | 'auth_signin';

export function trackEvent(name: EventName, props?: Record<string, string | number>) {
  if (typeof window === 'undefined') return;
  if (typeof window.plausible !== 'function') return;
  window.plausible(name, { props });
}

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void;
  }
}

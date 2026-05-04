// Spec #21 — WCAG 2.1 SC 2.4.1 Bypass Blocks (Level A).
// Visually hidden until focused via Tab, then jumps to <main id="main-content">.
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-jw-md focus:bg-jw-blue focus:px-4 focus:py-2 focus:font-medium focus:text-jw-cream focus:outline-2 focus:outline-offset-2 focus:outline-jw-coral"
    >
      Lompat ke konten utama
    </a>
  );
}

import { PROVINSI_OPTIONS } from '@/lib/tagih/constants';

// Static SVG (5 cluster ellipses) — Sprint 4 will swap in proper province
// outlines + tap-to-drill-down. NO react-leaflet (heavy library, ~100 KB).
export function PetaIndonesia() {
  return (
    <section className="rounded-jw-lg border border-jw-line bg-white p-5">
      <header className="mb-3">
        <span className="font-hand text-jw-coral text-sm">— peta</span>
        <h3 className="font-display text-lg font-semibold text-jw-blue">
          Sebaran janji per provinsi
        </h3>
      </header>
      <svg
        viewBox="0 0 400 180"
        className="w-full"
        role="img"
        aria-label="Peta Indonesia disederhanakan dengan 5 cluster pulau"
      >
        <ellipse cx="60" cy="100" rx="40" ry="14" fill="#3B4A8A" opacity="0.7" />
        <ellipse
          cx="135"
          cy="115"
          rx="32"
          ry="10"
          fill="#1A2256"
          opacity="0.85"
        />
        <ellipse
          cx="245"
          cy="95"
          rx="24"
          ry="16"
          fill="#F2B137"
          opacity="0.7"
        />
        <ellipse
          cx="290"
          cy="115"
          rx="22"
          ry="22"
          fill="#E8632B"
          opacity="0.7"
        />
        <ellipse
          cx="345"
          cy="125"
          rx="26"
          ry="10"
          fill="#7FB69E"
          opacity="0.7"
        />
        <text
          x="60"
          y="105"
          textAnchor="middle"
          className="text-[10px] fill-white font-semibold"
        >
          Sumatera
        </text>
        <text
          x="135"
          y="118"
          textAnchor="middle"
          className="text-[10px] fill-white font-semibold"
        >
          Jawa
        </text>
        <text
          x="245"
          y="98"
          textAnchor="middle"
          className="text-[10px] fill-white font-semibold"
        >
          Kalimantan
        </text>
        <text
          x="290"
          y="118"
          textAnchor="middle"
          className="text-[10px] fill-white font-semibold"
        >
          Sulawesi
        </text>
        <text
          x="345"
          y="128"
          textAnchor="middle"
          className="text-[10px] fill-white font-semibold"
        >
          Papua
        </text>
      </svg>
      <p className="text-xs text-jw-muted mt-2 italic">
        Peta interaktif (tap-province → drilldown) Sprint 4.
      </p>
      <div className="mt-3 flex items-center gap-3 text-xs text-jw-muted flex-wrap">
        {PROVINSI_OPTIONS.map((p) => (
          <span key={p.id} className="inline-flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded"
              style={{ background: p.hex }}
            />
            {p.label}
          </span>
        ))}
      </div>
    </section>
  );
}

type Props = {
  jwNumber: string;
  username: string | null;
};

export function PasporCover({ jwNumber, username }: Props) {
  return (
    <div className="aspect-[5/7] w-full max-w-sm mx-auto rounded-jw-xl bg-jw-blue text-jw-cream p-6 flex flex-col justify-between shadow-jw-lg">
      <div>
        <p className="font-hand text-jw-coral text-sm">— paspor warga</p>
        <p className="font-display italic text-3xl md:text-4xl mt-1 leading-none">
          Jubir Warga
        </p>
      </div>

      {/* Crest — small abstract Garuda-ish shape using brand SVG. NOT a stock
          government emblem (we're a citizen platform, not the state). */}
      <div className="flex justify-center">
        <svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          aria-hidden="true"
          className="opacity-90"
        >
          <circle cx="48" cy="48" r="36" fill="none" stroke="#FFFAEE" strokeWidth="2" opacity="0.4" />
          <path
            d="M48 18 L60 38 L82 42 L66 58 L70 80 L48 70 L26 80 L30 58 L14 42 L36 38 Z"
            fill="#F2B137"
            opacity="0.85"
          />
          <circle cx="48" cy="50" r="8" fill="#1A2256" stroke="#FFFAEE" strokeWidth="1.5" />
        </svg>
      </div>

      <div>
        <p className="font-mono text-xs opacity-70 tracking-widest">No.</p>
        <p className="font-mono text-xl md:text-2xl font-semibold">{jwNumber}</p>
        {username && (
          <p className="text-xs opacity-70 mt-1 font-mono">@{username}</p>
        )}
        <p className="text-sm italic opacity-80 mt-3">
          Suara warga, rumahnya di sini.
        </p>
      </div>
    </div>
  );
}

export function AksiSkeleton() {
  return (
    <div className="space-y-8" aria-label="Memuat aksi...">
      <div className="rounded-jw-xl border border-jw-line bg-white p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 bg-jw-pill-grey-bg rounded" />
          <div className="h-6 w-3/4 bg-jw-pill-grey-bg rounded" />
          <div className="h-3 w-full bg-jw-pill-grey-bg rounded" />
          <div className="h-3 w-2/3 bg-jw-pill-grey-bg rounded" />
          <div className="grid grid-cols-3 gap-2 pt-3">
            <div className="h-12 bg-jw-pill-grey-bg rounded" />
            <div className="h-12 bg-jw-pill-grey-bg rounded" />
            <div className="h-12 bg-jw-pill-grey-bg rounded" />
          </div>
        </div>
      </div>
      <ul className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <li
            key={i}
            className="rounded-jw-lg border border-jw-line bg-white p-4"
          >
            <div className="animate-pulse space-y-2">
              <div className="h-4 w-1/2 bg-jw-pill-grey-bg rounded" />
              <div className="h-3 w-3/4 bg-jw-pill-grey-bg rounded" />
              <div className="h-2 w-full bg-jw-pill-grey-bg rounded mt-3" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

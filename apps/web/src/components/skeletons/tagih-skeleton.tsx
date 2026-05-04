export function TagihSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul className="space-y-3" aria-label="Memuat janji...">
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="rounded-jw-lg border border-jw-line bg-white p-4"
        >
          <div className="flex items-start justify-between gap-3 flex-wrap animate-pulse">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex gap-2">
                <div className="h-3 w-24 bg-jw-pill-grey-bg rounded" />
                <div className="h-3 w-20 bg-jw-pill-grey-bg rounded" />
              </div>
              <div className="h-4 w-3/4 bg-jw-pill-grey-bg rounded" />
              <div className="h-3 w-1/2 bg-jw-pill-grey-bg rounded" />
              <div className="h-3 w-32 bg-jw-pill-grey-bg rounded" />
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <div className="h-5 w-20 bg-jw-pill-grey-bg rounded-full" />
              <div className="h-3 w-16 bg-jw-pill-grey-bg rounded" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

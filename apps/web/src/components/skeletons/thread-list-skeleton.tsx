export function ThreadListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul className="space-y-3" aria-label="Memuat thread...">
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="rounded-jw-lg border border-jw-line bg-white p-4 flex gap-3"
        >
          <div className="w-9 flex flex-col items-center gap-1 flex-shrink-0">
            <div className="h-5 w-5 rounded bg-jw-pill-grey-bg animate-pulse" />
            <div className="h-3 w-5 rounded bg-jw-pill-grey-bg animate-pulse" />
            <div className="h-5 w-5 rounded bg-jw-pill-grey-bg animate-pulse" />
          </div>
          <div className="flex-1 space-y-2 animate-pulse">
            <div className="h-4 w-3/4 bg-jw-pill-grey-bg rounded" />
            <div className="h-3 w-full bg-jw-pill-grey-bg rounded" />
            <div className="h-3 w-1/2 bg-jw-pill-grey-bg rounded" />
            <div className="flex gap-2 pt-2">
              <div className="h-2 w-16 bg-jw-pill-grey-bg rounded" />
              <div className="h-2 w-12 bg-jw-pill-grey-bg rounded" />
              <div className="h-2 w-20 bg-jw-pill-grey-bg rounded" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

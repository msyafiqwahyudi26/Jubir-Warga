export function KaryaGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
      aria-label="Memuat karya..."
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-jw-lg border border-jw-line bg-white overflow-hidden flex flex-col"
        >
          <div className="aspect-video w-full bg-jw-pill-grey-bg animate-pulse" />
          <div className="p-4 flex-1 flex flex-col gap-2 animate-pulse">
            <div className="h-4 w-16 bg-jw-pill-grey-bg rounded" />
            <div className="h-5 w-3/4 bg-jw-pill-grey-bg rounded" />
            <div className="h-3 w-1/2 bg-jw-pill-grey-bg rounded" />
            <div className="mt-auto pt-3 h-2 w-20 bg-jw-pill-grey-bg rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

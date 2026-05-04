export function KelasGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      aria-label="Memuat kelas..."
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-jw-lg border border-jw-line bg-white p-5 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-4 w-16 bg-jw-pill-grey-bg rounded" />
            <div className="h-4 w-20 bg-jw-pill-grey-bg rounded" />
          </div>
          <div className="h-5 w-3/4 bg-jw-pill-grey-bg rounded animate-pulse" />
          <div className="space-y-2 animate-pulse">
            <div className="h-3 w-full bg-jw-pill-grey-bg rounded" />
            <div className="h-3 w-2/3 bg-jw-pill-grey-bg rounded" />
          </div>
          <div className="flex gap-3 animate-pulse">
            <div className="h-3 w-16 bg-jw-pill-grey-bg rounded" />
            <div className="h-3 w-20 bg-jw-pill-grey-bg rounded" />
          </div>
          <div className="mt-auto pt-3 h-6 w-32 bg-jw-pill-grey-bg rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

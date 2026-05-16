export default function PostSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex gap-4">
        {/* Vote skeleton */}
        <div className="hidden flex-col items-center gap-2 sm:flex">
          <div className="h-6 w-6 rounded shimmer" />
          <div className="h-4 w-8 rounded shimmer" />
          <div className="h-6 w-6 rounded shimmer" />
        </div>

        {/* Content skeleton */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full shimmer" />
            <div className="h-3 w-24 rounded shimmer" />
            <div className="h-3 w-32 rounded shimmer" />
          </div>
          <div className="h-5 w-3/4 rounded shimmer" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded shimmer" />
            <div className="h-3 w-5/6 rounded shimmer" />
          </div>
          <div className="h-48 w-full rounded-xl shimmer" />
          <div className="flex gap-4">
            <div className="h-8 w-20 rounded-full shimmer" />
            <div className="h-8 w-16 rounded-full shimmer" />
            <div className="h-8 w-16 rounded-full shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

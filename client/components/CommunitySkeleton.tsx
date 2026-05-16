export default function CommunitySkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
      <div className="h-4 w-4 rounded shimmer" />
      <div className="h-8 w-8 rounded-full shimmer" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 rounded shimmer" />
        <div className="h-2 w-16 rounded shimmer" />
      </div>
    </div>
  );
}

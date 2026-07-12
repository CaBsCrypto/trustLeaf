// Copyright © 2026 Browns Studio
export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse bg-slate-800 rounded-xl p-4 space-y-3">
      <div className="h-4 bg-slate-700 rounded w-3/4" />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <div
          key={i}
          className={`h-3 bg-slate-700 rounded ${i === lines - 2 ? "w-1/2" : "w-full"}`}
        />
      ))}
    </div>
  );
}

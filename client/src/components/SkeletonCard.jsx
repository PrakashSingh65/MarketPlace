export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Gradient header placeholder */}
      <div className="h-36 bg-linear-to-br from-slate-200 to-slate-300 animate-pulse" />
      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="h-5 bg-slate-200 rounded-lg w-3/4 animate-pulse" />
        <div className="space-y-1.5">
          <div className="h-3.5 bg-slate-100 rounded w-full animate-pulse" />
          <div className="h-3.5 bg-slate-100 rounded w-2/3 animate-pulse" />
        </div>
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex justify-between items-center">
            <div className="h-3.5 bg-slate-100 rounded w-12 animate-pulse" />
            <div className="h-5 bg-emerald-100 rounded w-20 animate-pulse" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-3.5 bg-slate-100 rounded w-8 animate-pulse" />
            <div className="h-3.5 bg-slate-100 rounded w-16 animate-pulse" />
          </div>
        </div>
        <div className="h-10 bg-indigo-100 rounded-xl w-full animate-pulse mt-2" />
      </div>
    </div>
  );
}

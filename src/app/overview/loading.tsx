export default function OverviewLoading() {
  return (
    <div className="space-y-12 animate-pulse font-inter">
      {/* Stripe-style Header Skeleton */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-10 border-b border-[#e5edf5]">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-slate-50 rounded-[10px] border border-slate-100 h-11 w-11" />
            <div className="h-10 w-64 bg-slate-50 rounded-lg" />
          </div>
          <div className="h-4 w-96 bg-slate-50 rounded" />
        </div>
        <div className="flex items-center gap-6">
          <div className="h-12 w-32 bg-slate-50 rounded" />
          <div className="h-10 w-px bg-[#e5edf5]" />
          <div className="h-11 w-44 bg-slate-50 rounded-[6px]" />
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-[8px] border border-[#e5edf5] h-36" />
        ))}
      </div>

      {/* Table Section Skeleton */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
           <div className="space-y-2">
              <div className="h-7 w-48 bg-slate-50 rounded" />
              <div className="h-4 w-32 bg-slate-50 rounded" />
           </div>
        </div>
        <div className="bg-white rounded-[8px] border border-[#e5edf5] min-h-[400px] overflow-hidden">
           <div className="p-6 space-y-4">
               {[...Array(5)].map((_, i) => (
                 <div key={i} className="h-14 w-full rounded bg-slate-50 border border-slate-100" />
               ))}
           </div>
        </div>
      </div>
    </div>
  );
}

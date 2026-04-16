export default function CompanyDetailLoading() {
  return (
    <div className="space-y-12 animate-pulse font-inter">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-10 border-b border-[#e5edf5]">
        <div className="space-y-4">
          <div className="h-5 w-32 bg-slate-50 rounded" />
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 bg-slate-50 rounded-[10px]" />
            <div className="space-y-2">
              <div className="h-9 w-64 bg-slate-50 rounded-lg" />
              <div className="h-4 w-40 bg-slate-50 rounded" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="h-12 w-24 bg-slate-50 rounded" />
          <div className="h-10 w-px bg-[#e5edf5]" />
          <div className="h-11 w-40 bg-slate-50 rounded-[6px]" />
        </div>
      </div>

      {/* Metrics Row Skeleton - if applicable or just general spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-[8px] border border-[#e5edf5] h-24" />
        ))}
      </div>

      {/* Listings Section Skeleton */}
      <div className="space-y-6">
        <div className="h-7 w-48 bg-slate-50 rounded" />
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

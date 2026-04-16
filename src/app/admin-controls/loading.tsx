export default function AdminControlsLoading() {
  return (
    <div className="space-y-12 animate-pulse font-inter">
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 pb-10 border-b border-[#e5edf5]">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-slate-50 rounded-[10px] border border-slate-100 h-11 w-11" />
            <div className="h-10 w-64 bg-slate-50 rounded-lg" />
          </div>
          <div className="h-4 w-96 bg-slate-50 rounded" />
        </div>
        <div className="flex items-center gap-6">
          <div className="h-12 w-24 bg-slate-50 rounded" />
          <div className="h-10 w-px bg-[#e5edf5]" />
          <div className="h-12 w-44 bg-slate-50 rounded" />
        </div>
      </div>

      {/* Actions Row Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
         <div className="h-11 w-full lg:w-96 bg-slate-50 rounded-[8px] border border-slate-100" />
         <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="h-11 w-24 bg-slate-50 rounded-[8px]" />
            <div className="h-11 w-32 bg-slate-50 rounded-[8px]" />
         </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-[8px] border border-[#e5edf5] min-h-[500px] overflow-hidden">
        <div className="h-12 w-full bg-[#f8fafc] border-b border-[#e2e8f0]" />
        <div className="p-6 space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
               <div className="h-10 w-10 rounded-full bg-slate-50" />
               <div className="flex-1 space-y-2">
                 <div className="h-4 w-40 bg-slate-50 rounded" />
                 <div className="h-3 w-24 bg-slate-50 rounded opacity-50" />
               </div>
               <div className="h-6 w-16 bg-slate-50 rounded-full" />
               <div className="h-8 w-24 bg-slate-50 rounded-full" />
               <div className="h-8 w-8 bg-slate-50 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

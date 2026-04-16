"use client";

import { useState, Fragment } from "react";
import { SponsorshipTable } from "./SponsorshipTable";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Job {
  id: number;
  companyName: string;
  companyUrl: string | null;
  jobTitle: string;
  jobRole: string;
  posterName: string | null;
  posterUrl: string | null;
  jobUrl: string;
  source: string | null;
  date: string;
}

interface PaginatedSponsorshipTableProps {
  jobs: Job[];
  totalCount: number;
  onPageChange: (newPage: number) => void;
  isLoading?: boolean;
  rowsPerPage?: number;
  // Controlled search props (lifted to Overview for global server-side search)
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

export const PaginatedSponsorshipTable = ({
  jobs,
  totalCount,
  onPageChange,
  isLoading = false,
  rowsPerPage = 20,
  searchTerm = "",
  onSearchChange,
}: PaginatedSponsorshipTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Server already filters — jobs array IS the filtered result
  const logicalTotal = totalCount;
  const totalPages = Math.ceil(logicalTotal / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  // Slice only the current page window from already-loaded jobs
  const currentJobs = jobs.slice(startIndex, endIndex);

  const handleSearch = (value: string) => {
    onSearchChange?.(value);
    setCurrentPage(1); // reset to page 1 on new search
  };

  const clearSearch = () => {
    onSearchChange?.("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Trigger parent to load next chunk if this page's data isn't loaded yet
      const requiredIndex = (newPage - 1) * rowsPerPage;
      if (!jobs[requiredIndex]) {
        onPageChange(newPage);
      }
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Search Bar - Premium Refined */}
      <div className="relative group max-w-2xl">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors z-10">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          placeholder="Search for companies, roles, or posters..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-14 pr-12 py-3.5 rounded-2xl border border-brand-500/5 bg-white text-slate-900 placeholder:text-slate-400 focus:border-brand-500/20 focus:ring-4 focus:ring-brand-500/5 transition-all outline-none font-bold text-sm shadow-premium group-hover:bg-slate-50/50"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors p-1"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Table Container - Premium Elevation */}
      <div className="bg-white rounded-3xl shadow-premium border border-brand-500/5 overflow-hidden transition-all duration-500 hover:shadow-elevated relative min-h-[300px]">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center animate-in fade-in duration-300">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
              <span className="text-xs font-black text-brand-500 uppercase tracking-widest">Fetching Insights...</span>
            </div>
          </div>
        )}

        {logicalTotal === 0 && !isLoading ? (
          <div className="text-center py-24 bg-white">
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100/50">
              <Search className="h-6 w-6 text-slate-300" />
            </div>
            <p className="text-slate-400 font-bold text-lg">
              No results found
            </p>
          </div>
        ) : (
          <SponsorshipTable jobs={currentJobs} />
        )}
      </div>

      {/* Pagination Controls - Premium Refined */}
      {logicalTotal > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4 px-2">
          {/* Results info */}
          <div className="text-[11px] text-slate-400 font-black uppercase tracking-widest opacity-60">
            Showing <span className="text-slate-900">{startIndex + 1} to {Math.min(endIndex, logicalTotal)}</span> of {logicalTotal} results
            {searchTerm.trim() && (
              <span className="ml-2 text-brand-500">(global search)</span>
            )}
          </div>

          {/* Pagination buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="h-10 px-5 border-brand-500/5 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-brand-50/50 hover:text-brand-500 transition-all rounded-xl active:scale-95 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Prev
            </Button>

            <div className="hidden sm:flex items-center gap-2">
              {(() => {
                  const pages = [];
                  const maxVisible = 5;
                  
                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    if (currentPage > 3) pages.push('ellipsis1');
                    
                    const start = Math.max(2, currentPage - 1);
                    const end = Math.min(totalPages - 1, currentPage + 1);
                    
                    for (let i = start; i <= end; i++) pages.push(i);
                    
                    if (currentPage < totalPages - 2) pages.push('ellipsis2');
                    pages.push(totalPages);
                  }

                  return pages.map((p, idx) => (
                    <Fragment key={idx}>
                      {p === 'ellipsis1' || p === 'ellipsis2' ? (
                        <span className="text-slate-300 px-1 font-black">...</span>
                      ) : (
                        <button
                          onClick={() => handlePageChange(p as number)}
                          className={cn(
                            "w-10 h-10 rounded-xl text-xs font-black transition-all duration-300 active:scale-90",
                            currentPage === p
                              ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                              : "text-slate-400 hover:bg-brand-50/50 hover:text-brand-500 border border-transparent hover:border-brand-500/10"
                          )}
                        >
                          {p}
                        </button>
                      )}
                    </Fragment>
                  ));
              })()}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="h-10 px-5 border-brand-500/5 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-brand-50/50 hover:text-brand-500 transition-all rounded-xl active:scale-95 disabled:opacity-30"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
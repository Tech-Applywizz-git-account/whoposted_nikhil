"use client";

import { useEffect, useState, useMemo, useLayoutEffect } from "react";
import { DomainCard } from "@/components/DomainCard";
import { Search, LayoutGrid, List } from "lucide-react";
import { GridLayersIcon } from "@/components/icons/premium-icons";
import { ArrowRight } from "lucide-react";
import { DomainIcon } from "@/components/DomainIcon";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { JOB_ROLE_PRIORITY } from "@/lib/constants";

interface Domain {
  id: string;
  name: string;
  category: "tech" | "non-tech";
  jobCount: number;
}

const Domains = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [searchTerm, setSearchTerm] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("domains_search") || "";
    }
    return "";
  });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    if (typeof window !== "undefined") {
      return (sessionStorage.getItem("domains_view_mode") as any) || "grid";
    }
    return "grid";
  });

  useEffect(() => {
    sessionStorage.setItem("domains_search", searchTerm);
    sessionStorage.setItem("domains_view_mode", viewMode);
  }, [searchTerm, viewMode]);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await fetch("/api/domain");
        const data = await res.json();
        const mapped = (data || []).map((item: any) => ({
          id: item.role,
          name: item.role,
          category: item.isTech ? "tech" : "non-tech",
          jobCount: item.jobCount || 0
        }));
        setDomains(mapped);
      } catch (err) {
        console.error("Error fetching domains:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDomains();
  }, []);

  useLayoutEffect(() => {
    if (!loading && domains.length > 0) {
      const container = document.querySelector('main');
      const scrollPos = sessionStorage.getItem("domains_scroll_pos");
      if (container && scrollPos) {
        const timeout = setTimeout(() => {
          container.scrollTo({ top: parseInt(scrollPos), behavior: "auto" });
        }, 100);
        return () => clearTimeout(timeout);
      }
    }
  }, [loading, domains]);

  const visibleDomains = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = domains.filter((domain) => {
      const matchesSearch = term === "" || domain.name.toLowerCase().includes(term);
      return matchesSearch;
    });

    // Sort by priority order; unlisted domains fall to end alphabetically
    const priorityList = JOB_ROLE_PRIORITY.map(p => p.toLowerCase());
    
    return filtered.sort((a, b) => {
      const ai = priorityList.indexOf(a.name.toLowerCase());
      const bi = priorityList.indexOf(b.name.toLowerCase());
      if (ai !== -1 && bi !== -1) return ai - bi;         // both in list → priority order
      if (ai !== -1) return -1;                            // only a in list → a first
      if (bi !== -1) return 1;                             // only b in list → b first
      return a.name.localeCompare(b.name);                 // neither in list → alphabetical
    });
  }, [domains, searchTerm]);

  return (
    <div className="space-y-12 animate-fade-in min-h-[500px] font-inter pb-20">
      {/* Premium Refined Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 pb-12 border-b border-brand-500/5">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-500 rounded-[14px] shadow-lg shadow-brand-500/20 text-white animate-in zoom-in-50 duration-500">
              <GridLayersIcon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h1 className="text-[34px] font-black text-slate-900 tracking-[-0.03em] leading-tight">
                Job Domains
              </h1>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest opacity-80 pl-0.5">
                <span className="w-2 h-2 rounded-full bg-brand-500" />
                Market Intelligence
              </div>
            </div>
          </div>
          <p className="text-[16px] text-slate-500 max-w-2xl font-medium leading-relaxed opacity-70">
            Explore job opportunities across all domains
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 w-full md:w-auto">
          <div className="relative group sm:w-80">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors z-10">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search domains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 h-12 rounded-2xl border border-brand-500/5 bg-white text-slate-900 placeholder:text-slate-400 focus:border-brand-500/20 focus:ring-4 focus:ring-brand-500/5 transition-all outline-none font-bold text-sm shadow-premium group-hover:bg-slate-50/50"
            />
          </div>

          <div className="flex p-1.5 bg-slate-50 border border-brand-500/5 rounded-2xl shadow-inner">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-xl transition-all duration-300",
                viewMode === "grid"
                  ? "bg-white text-brand-500 shadow-md border border-brand-500/10"
                  : "text-slate-400 hover:text-slate-600"
              )}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-xl transition-all duration-300",
                viewMode === "list"
                  ? "bg-white text-brand-500 shadow-md border border-brand-500/10"
                  : "text-slate-400 hover:text-slate-600"
              )}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="relative">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-40 rounded-[8px] bg-slate-50 border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : visibleDomains.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleDomains.map((domain) => (
                <DomainCard
                  key={domain.id}
                  id={domain.id}
                  name={domain.name}
                  category={domain.category}
                  jobCount={domain.jobCount}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {visibleDomains.map((domain) => (
                <Link
                  key={domain.id}
                  href={`/role-analysis/${encodeURIComponent(domain.id)}`}
                  className="group flex items-center justify-between p-4 bg-white border border-brand-500/5 rounded-2xl shadow-premium hover:shadow-elevated hover:border-brand-500/20 transition-all duration-300"
                  onClick={() => {
                    const container = document.querySelector('main');
                    if (container) {
                      sessionStorage.setItem("domains_scroll_pos", container.scrollTop.toString());
                    }
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 border border-slate-100/50 rounded-xl group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500 transition-all duration-300">
                      <DomainIcon domainName={domain.name} size="sm" variant="card" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 group-hover:text-brand-500 transition-colors uppercase tracking-tight">
                        {domain.name}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">
                        {domain.jobCount.toLocaleString()} Jobs
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-24 bg-white rounded-[8px] border border-dashed border-[#d3dce6]">
            <Search className="h-10 w-10 mx-auto mb-4 text-slate-200" />
            <p className="text-lg font-medium text-[#061b31]">No matching domains</p>
            <p className="text-sm mt-1 text-[#64748d]">Try adjusting your search to find what you&apos;re looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Domains;

"use client";

import { useEffect, useState, useMemo } from "react";
import { CompanyCard } from "@/components/CompanyCard";
import { Search, Building2, Globe2, LayoutGrid, List, Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Company {
  id: string;
  name: string;
  linkedin_jobs: number;
}

const CompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>(() => {
    if (typeof window !== "undefined") {
      const cachedData = sessionStorage.getItem("companies_data");
      if (cachedData) return JSON.parse(cachedData);
    }
    return [];
  });

  const [searchTerm, setSearchTerm] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("companies_search") || "";
    }
    return "";
  });

  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("companies_data");
    }
    return true;
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    if (typeof window !== "undefined") {
      return (sessionStorage.getItem("companies_view_mode") as any) || "grid";
    }
    return "grid";
  });

  useEffect(() => {
    sessionStorage.setItem("companies_search", searchTerm);
    sessionStorage.setItem("companies_view_mode", viewMode);
  }, [searchTerm, viewMode]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/company", { cache: "no-store" });
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();
        const mapped = data.map((item: any) => ({
          id: item.company_key,
          name: item.company,
          linkedin_jobs: item.sponsored_jobs,
          company_url: item.company_url,
        }));

        setCompanies(mapped);
        sessionStorage.setItem("companies_data", JSON.stringify(mapped));
      } catch (err) {
        console.error("Error fetching companies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const [visibleCount] = useState(24);

  const filteredCompanies = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return companies.filter((company) =>
      company.name.toLowerCase().includes(term)
    );
  }, [companies, searchTerm]);

  const displayedCompanies = filteredCompanies.slice(0, visibleCount);

  return (
    <div className="animate-fade-in min-h-screen font-inter pb-20 space-y-10">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 pb-10 border-b border-brand-500/5">
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-500 rounded-[14px] shadow-lg shadow-brand-500/20 text-white animate-in zoom-in-50 duration-500">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h1 className="text-[34px] font-black text-slate-900 tracking-[-0.03em] leading-tight">
                Companies
              </h1>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest opacity-80 pl-0.5">
                <Globe2 className="h-3 w-3 text-brand-500" />
                Employer Intelligence
              </div>
            </div>
          </div>
          <p className="text-[16px] text-slate-500 max-w-2xl font-medium leading-relaxed opacity-70">
            Explore{" "}
            <span className="font-black text-brand-500">
              {companies.length} companies
            </span>{" "}
            actively posting Whoposted job opportunities.
          </p>
        </div>

        {/* Search and Layout Toggle */}
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
          <div className="flex p-1.5 bg-slate-50 border border-brand-500/5 rounded-2xl shadow-inner shrink-0">
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

          <div className="relative group w-full lg:w-[400px] shrink-0">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors z-10">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 h-12 rounded-2xl border border-brand-500/5 bg-white text-slate-900 placeholder:text-slate-400 focus:border-brand-500/20 focus:ring-4 focus:ring-brand-500/5 transition-all outline-none font-bold shadow-premium group-hover:bg-slate-50/50"
            />
          </div>
        </div>
      </div>

      {/* Grid of Results */}
      <div className="relative">
        {loading && companies.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-[24px] bg-slate-50/50 border border-brand-500/5 animate-pulse shadow-sm"
              />
            ))}
          </div>
        ) : displayedCompanies.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedCompanies.map((company) => (
                <CompanyCard
                  key={company.id}
                  id={company.id}
                  name={company.name}
                  linkedin_jobs={company.linkedin_jobs}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {displayedCompanies.map((company) => (
                <Link
                  key={company.id}
                  href={`/company-analysis/${encodeURIComponent(company.id)}`}
                  className="group flex items-center justify-between p-4 bg-white border border-brand-500/5 rounded-2xl shadow-premium hover:shadow-elevated hover:border-brand-500/20 transition-all duration-300"
                  onClick={() => {
                    const container = document.querySelector('main');
                    if (container) {
                      sessionStorage.setItem("companies_scroll_pos", container.scrollTop.toString());
                    }
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100/50 flex items-center justify-center transition-all duration-300 group-hover:bg-brand-500 group-hover:border-brand-500 group-hover:shadow-lg group-hover:shadow-brand-500/20">
                      <span className="text-lg font-black text-brand-500 group-hover:text-white uppercase">
                        {company.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-brand-500 transition-colors">
                        {company.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-brand-500/70 transition-colors text-[10px] font-bold uppercase tracking-wider">
                        <Briefcase className="h-3 w-3" />
                        <span>{company.linkedin_jobs} sponsored</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-32 bg-brand-50/20 rounded-3xl border-2 border-dashed border-brand-500/10">
            <Building2 className="h-16 w-16 mx-auto mb-6 text-slate-200" />
            <h3 className="text-xl font-black text-slate-700">
              No companies found
            </h3>
            <p className="text-slate-400 mt-3 max-w-sm mx-auto font-bold text-sm">
              We couldn&apos;t find any companies matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesPage;

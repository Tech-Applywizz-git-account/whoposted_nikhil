"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaginatedSponsorshipTable } from "@/components/PaginatedSponsorshipTable";
import { JobListingIcon } from "@/components/icons/premium-icons";
import { cn } from "@/lib/utils";
import { JOB_ROLE_PRIORITY } from "@/lib/constants";

interface WhopostedJob {
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

interface CompanyDetailClientProps {
  slug: string;
  initialCompany: string;
  initialJobs: WhopostedJob[];
}

export default function CompanyDetailClient({ slug, initialCompany, initialJobs }: CompanyDetailClientProps) {
  const router = useRouter();
  const [jobs, setJobs] = useState<WhopostedJob[]>(initialJobs);
  const [companyTitle, setCompanyTitle] = useState(initialCompany);
  const [loading, setLoading] = useState(false);

  const decodedName = useMemo(() => {
    return decodeURIComponent(slug).replace(/-/g, ' ');
  }, [slug]);

  const displayTitle = companyTitle || decodedName;

  const sortedJobs = useMemo(() => {
    const priorityList = JOB_ROLE_PRIORITY.map(p => p.toLowerCase());
    return [...jobs].sort((a, b) => {
      const ai = priorityList.indexOf(a.jobRole.toLowerCase());
      const bi = priorityList.indexOf(b.jobRole.toLowerCase());
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return 0; // maintain date order for unlisted
    });
  }, [jobs]);

  return (
    <div className="space-y-12 animate-fade-in font-inter">
      {/* Premium Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-10 border-b border-[#e5edf5]">
        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-1.5 text-sm font-medium text-[#64748d] hover:text-[#0a66c2] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Companies</span>
          </button>
          
          <div className="flex items-center gap-5">
            <div className="p-3 bg-[#f0f7ff] rounded-[12px] border border-[#d1e7ff] text-[#0a66c2]">
              <Building2 className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h1 className="text-[32px] font-bold text-[#061b31] tracking-tight leading-tight uppercase">
                {displayTitle}
              </h1>
              <p className="text-[15px] text-[#64748d] font-normal">
                {loading ? "Analyzing organizational opportunities..." : `Analyzed ${jobs.length} Whoposted job${jobs.length !== 1 ? "s" : ""} from this organization`}
              </p>
            </div>
          </div>
        </div>

        {/* Metric Overview */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[12px] uppercase tracking-widest text-[#94a3b8] font-bold mb-1">Impact Factor</p>
            <p className="text-3xl font-light text-[#061b31] tabular-nums">
              {loading ? "..." : (jobs.length * 0.85).toFixed(1)}
            </p>
          </div>
          <div className="h-10 w-px bg-[#e5edf5]" />
          <div className="text-right">
            <p className="text-[12px] uppercase tracking-widest text-[#94a3b8] font-bold mb-1">Active Roles</p>
            <p className="text-3xl font-light text-[#0a66c2] tabular-nums">{jobs.length}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-[#f0f7ff] rounded-[6px] border border-[#d1e7ff]">
                <JobListingIcon className="h-5 w-5 text-[#0a66c2]" />
             </div>
             <h2 className="text-[20px] font-bold text-[#061b31] tracking-tight">Employment History</h2>
          </div>
          {!loading && jobs.length > 0 && (
            <span className="text-sm text-[#64748d] font-medium px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">
              {jobs.length} Opportunities Logged
            </span>
          )}
        </div>

        <div className="relative">
          {loading ? (
             <div className="py-24 flex flex-col items-center justify-center bg-white rounded-[8px] border border-[#e5edf5]">
                <div className="h-8 w-8 border-3 border-[#0a66c2] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[#64748d] font-normal">Processing organizational data...</p>
             </div>
          ) : jobs.length > 0 ? (
            <PaginatedSponsorshipTable jobs={sortedJobs} rowsPerPage={10} />
          ) : (
            <div className="text-center py-20 bg-white rounded-[8px] border border-dashed border-[#d3dce6]">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-slate-200" />
              <p className="text-lg font-medium text-[#061b31]">No organizational records found</p>
              <p className="text-sm mt-1 text-[#64748d]">This company currently has no active or historical jobs in our index.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

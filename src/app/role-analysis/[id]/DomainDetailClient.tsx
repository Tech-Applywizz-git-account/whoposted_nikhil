"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaginatedSponsorshipTable } from "@/components/PaginatedSponsorshipTable";
import { DomainIcon } from "@/components/DomainIcon";
import { JobListingIcon } from "@/components/icons/premium-icons";

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

interface DomainDetailClientProps {
  slug: string;
  initialJobs: WhopostedJob[];
  initialRoleTitle: string;
}

export default function DomainDetailClient({ slug, initialJobs, initialRoleTitle }: DomainDetailClientProps) {
  const router = useRouter();
  const [jobs] = useState<WhopostedJob[]>(initialJobs);
  const [roleTitle] = useState(initialRoleTitle);
  const [loading] = useState(false);

  const displayTitle = roleTitle || decodeURIComponent(slug).replace(/-/g, ' ');

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
            <span>Back to Domains</span>
          </button>
          
          <div className="flex items-center gap-5">
            <DomainIcon
              domainName={displayTitle}
              size="lg"
              variant="header"
            />
            <div className="space-y-1">
              <h1 className="text-[32px] font-bold text-[#061b31] tracking-tight leading-tight">
                {displayTitle}
              </h1>
              <p className="text-[15px] text-[#64748d] font-normal">
                {loading ? "Searching for opportunities..." : `${jobs.length} Whoposted job${jobs.length !== 1 ? "s" : ""} available`}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons or Top-Right Metrics */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[12px] uppercase tracking-widest text-[#94a3b8] font-bold mb-1">Total Roles</p>
            <p className="text-3xl font-light text-[#061b31] tabular-nums">{jobs.length}</p>
          </div>
          <div className="h-10 w-px bg-[#e5edf5]" />
          <Button 
            className="btn-stripe-primary"
            onClick={() => window.scrollTo({ bottom: 0, behavior: 'smooth' })}
          >
            Explore Listings
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-10">
        {/* Metric Overview - Optional but adds Stripe feel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[8px] border border-[#e5edf5] shadow-stripe-sm">
             <p className="text-[11px] uppercase tracking-widest text-[#94a3b8] font-bold mb-3">Today&apos;s New Jobs</p>
             <div className="flex items-baseline gap-2">
                <span className="text-2xl font-normal text-[#061b31]">0</span>
                <span className="text-[12px] text-[#94a3b8] font-medium uppercase">Last 24h</span>
             </div>
          </div>
          <div className="bg-white p-6 rounded-[8px] border border-[#e5edf5] shadow-stripe-sm">
             <p className="text-[11px] uppercase tracking-widest text-[#94a3b8] font-bold mb-3">Avg. Posting Age</p>
             <div className="flex items-baseline gap-2">
                <span className="text-2xl font-normal text-[#061b31]">2.4</span>
                <span className="text-[12px] text-[#94a3b8] font-medium uppercase">Days</span>
             </div>
          </div>
          <div className="bg-white p-6 rounded-[8px] border border-[#e5edf5] shadow-stripe-sm">
             <p className="text-[11px] uppercase tracking-widest text-[#94a3b8] font-bold mb-3">Market Demand</p>
             <div className="flex items-baseline gap-2">
                <span className="text-2xl font-normal text-[#0a66c2]">High</span>
                <span className="inline-flex h-2 w-2 rounded-full bg-[#15be53] ml-1" />
             </div>
          </div>
        </div>

        {/* Listings Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-[#f0f7ff] rounded-[6px] border border-[#d1e7ff]">
                <JobListingIcon className="h-5 w-5 text-[#0a66c2]" />
             </div>
             <h2 className="text-[20px] font-bold text-[#061b31] tracking-tight">Active Opportunities</h2>
          </div>

          <div className="relative">
            {loading ? (
               <div className="py-24 flex flex-col items-center justify-center bg-white rounded-[8px] border border-[#e5edf5]">
                  <div className="h-8 w-8 border-3 border-[#0a66c2] border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-[#64748d] font-normal">Loading latest jobs...</p>
               </div>
            ) : jobs.length > 0 ? (
              <PaginatedSponsorshipTable jobs={jobs} rowsPerPage={10} />
            ) : (
              <div className="text-center py-20 bg-white rounded-[8px] border border-[#e5edf5]">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-slate-200" />
                <p className="text-lg font-medium text-[#061b31]">No jobs found for this domain</p>
                <p className="text-sm mt-1 text-[#64748d]">Try checking back in a few days for fresh opportunities.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaginatedSponsorshipTable } from "@/components/PaginatedSponsorshipTable";

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

export default function PosterDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [jobs, setJobs] = useState<WhopostedJob[]>([]);
    const [posterName, setPosterName] = useState("");
    const [loading, setLoading] = useState(true);

    const slug = params.id as string;

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch(`/api/poster/${encodeURIComponent(slug)}`);
                const data = await res.json();

                setPosterName(data.poster || "Poster");

                const mappedJobs: WhopostedJob[] = (data.jobs || []).map(
                    (job: any, index: number) => ({
                        id: index + 1,
                        companyName: job.company,
                        companyUrl: job.company_url || null,
                        jobTitle: job.role,
                        jobRole: job.domain,
                        posterName: job.poster_name,
                        posterUrl: job.poster_url,
                        jobUrl: job.link,
                        source: null,
                        date: job.posted,
                    }),
                );

                setJobs(mappedJobs);
            } catch (err) {
                console.error("Error fetching poster jobs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [slug]);

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
            <span>Back to Contributors</span>
          </button>
          
          <div className="flex items-center gap-5">
            <div className="p-3 bg-[#f0f7ff] rounded-[12px] border border-[#d1e7ff] text-[#0a66c2]">
              <User className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h1 className="text-[32px] font-bold text-[#061b31] tracking-tight leading-tight">
                {posterName || decodeURIComponent(slug).replace(/-/g, ' ')}
              </h1>
              <p className="text-[15px] text-[#64748d] font-normal">
                {loading ? "Analyzing profile contributions..." : `Analyzed ${jobs.length} Whoposted job${jobs.length !== 1 ? "s" : ""} from this contributor`}
              </p>
            </div>
          </div>
        </div>

        {/* Metric Overview */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[12px] uppercase tracking-widest text-[#94a3b8] font-bold mb-1">Impact Score</p>
            <p className="text-3xl font-light text-[#061b31] tabular-nums">
              {loading ? "..." : (jobs.length * 1.2).toFixed(1)}
            </p>
          </div>
          <div className="h-10 w-px bg-[#e5edf5]" />
          <div className="text-right">
            <p className="text-[12px] uppercase tracking-widest text-[#94a3b8] font-bold mb-1">Total Postings</p>
            <p className="text-3xl font-light text-[#0a66c2] tabular-nums">{jobs.length}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-[#f0f7ff] rounded-[6px] border border-[#d1e7ff]">
                <Briefcase className="h-5 w-5 text-[#0a66c2]" />
             </div>
             <h2 className="text-[20px] font-bold text-[#061b31] tracking-tight">Postings & History</h2>
          </div>
          {!loading && jobs.length > 0 && (
            <span className="text-sm text-[#64748d] font-medium px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">
              {jobs.length} Verified Entries
            </span>
          )}
        </div>

        <div className="relative">
          {loading ? (
             <div className="py-24 flex flex-col items-center justify-center bg-white rounded-[8px] border border-[#e5edf5]">
                <div className="h-8 w-8 border-3 border-[#0a66c2] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[#64748d] font-normal">Analyzing posting history...</p>
             </div>
          ) : jobs.length > 0 ? (
            <PaginatedSponsorshipTable jobs={jobs} rowsPerPage={10} />
          ) : (
            <div className="text-center py-20 bg-white rounded-[8px] border border-dashed border-[#d3dce6]">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-slate-200" />
              <p className="text-lg font-medium text-[#061b31]">No contribution history found</p>
              <p className="text-sm mt-1 text-[#64748d]">This poster currently has no active or historical jobs in our database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

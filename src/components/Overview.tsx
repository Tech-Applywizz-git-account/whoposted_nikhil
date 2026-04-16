"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Calendar as CalendarIcon, CalendarDays, Search, Briefcase, Activity, Building2 } from "lucide-react";

import { KPICard } from "./KPICard";
import { PaginatedSponsorshipTable } from "./PaginatedSponsorshipTable";
import { format, subDays, subMonths, isSameDay, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import {
  InsightRadarIcon,
} from "./icons/premium-icons";

import { useDashboard } from "@/contexts/DashboardContext";
import { useAuth } from "@/contexts/AuthContext";
import { JOB_ROLE_PRIORITY } from "@/lib/constants";

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

const Overview = () => {
  const { selectedDate, setSelectedDate, jobPostsCount: jobPostsTodayCount, setJobPostsCount } = useDashboard();
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    jobs: { today: 0, total: 0 },
    companies: { today: 0, total: 0 },
    domains: { today: 0, total: 0 },
    posters: { today: 0, total: 0 }
  });
  const [latestJobs, setLatestJobs] = useState<Job[]>([]);
  const [totalTodayJobs, setTotalTodayJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isChunkLoading, setIsChunkLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 🚀 Animated counter state
  const [displayCount, setDisplayCount] = useState(0);

  const fetchJobs = useCallback(async (offset: number = 0, isInitial: boolean = false, query: string = "") => {
    try {
      if (isInitial) setLoading(true);
      else setIsChunkLoading(true);

      let url = `/api/overview?offset=${offset}`;
      if (typeof selectedDate === "string") {
        url += `&date=${selectedDate}`;
      } else if (selectedDate?.from) {
        const start = format(selectedDate.from, "yyyy-MM-dd");
        const end = selectedDate.to ? format(selectedDate.to, "yyyy-MM-dd") : start;
        url += `&startDate=${start}&endDate=${end}`;
      }
      if (query.trim()) {
        url += `&q=${encodeURIComponent(query.trim())}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        console.error("API Error:", data.error);
        return;
      }

      if (isInitial) {
        setMetrics({
          jobs: data.jobs,
          companies: data.companies,
          domains: data.domains,
          posters: data.posters
        });
        setJobPostsCount(data.jobs.today);
        setTotalTodayJobs(data.jobs.today);
      }

      const newJobs: Job[] = (data.latest_jobs || []).map((job: any) => ({
        id: job.id,
        companyName: job.company || "Unknown",
        companyUrl: job.company_url,
        jobTitle: job.job_title,
        jobRole: job.job_role,
        posterName: job.poster_full_name,
        posterUrl: job.poster_profile_url,
        jobUrl: job.job_url,
        source: job.source,
        date: job.report_date || new Date(job.created_at).toISOString().split('T')[0],
      }));

      setLatestJobs(prev => {
        // Create an array of correct size based on totalTodayJobs if it's initial
        const base = isInitial ? new Array(data.jobs.today).fill(null) : [...prev];
        
        // Fill the chunks
        newJobs.forEach((job, index) => {
          base[offset + index] = job;
        });
        
        // 🚀 Sort jobs by priority order
        const priorityList = JOB_ROLE_PRIORITY.map(p => p.toLowerCase());
        return base.sort((a, b) => {
          if (!a || !b) return 0;
          const ai = priorityList.indexOf(a.jobRole.toLowerCase());
          const bi = priorityList.indexOf(b.jobRole.toLowerCase());
          if (ai !== -1 && bi !== -1) return ai - bi;
          if (ai !== -1) return -1;
          if (bi !== -1) return 1;
          return 0;
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      if (isInitial) setLoading(false);
      else setIsChunkLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // Initial + date-change fetch
  useEffect(() => {
    setSearchTerm(""); // reset search on date change
    fetchJobs(0, true, "");
  }, [selectedDate]);

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // Reset job buffer and fetch fresh results for the query
      setLatestJobs([]);
      setTotalTodayJobs(0);
      fetchJobs(0, true, searchTerm);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm]);

  const handleTablePageChange = (page: number) => {
    const rowsPerPage = 20;
    const requiredOffset = Math.floor(((page - 1) * rowsPerPage) / 200) * 200;
    if (!latestJobs[requiredOffset]) {
      fetchJobs(requiredOffset, false, searchTerm);
    }
  };

  // 🚀 Live Count-up Animation Logic
  useEffect(() => {
    if (loading) return;

    let start = 0;
    const end = jobPostsTodayCount;
    if (start === end) {
      setDisplayCount(end);
      return;
    }

    let totalMiliseconds = 1500;
    let incrementTime = (totalMiliseconds / end) > 10 ? (totalMiliseconds / end) : 10;

    let timer = setInterval(() => {
      start += Math.ceil(end / 100);
      if (start >= end) {
        setDisplayCount(end);
        clearInterval(timer);
      } else {
        setDisplayCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [jobPostsTodayCount, loading]);

  const getDisplayDateText = () => {
    if (typeof selectedDate === "string") {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = subDays(new Date(), 1).toISOString().split('T')[0];
      if (selectedDate === today) return "Today";
      if (selectedDate === yesterday) return "Yesterday";
      return format(new Date(selectedDate), "PPP");
    } else if (selectedDate && typeof selectedDate === 'object' && 'from' in selectedDate && selectedDate.from) {
      if (selectedDate.to) {
        if (isSameDay(selectedDate.from, selectedDate.to)) return format(selectedDate.from, "PPP");

        // Check for presets
        const today = startOfDay(new Date());
        if (isSameDay(selectedDate.from, subDays(today, 6)) && isSameDay(selectedDate.to, today)) return "Last 7 days";
        if (isSameDay(selectedDate.from, subMonths(today, 1)) && isSameDay(selectedDate.to, today)) return "Last month";
        if (isSameDay(selectedDate.from, subMonths(today, 3)) && isSameDay(selectedDate.to, today)) return "Last quarter";

        return `${format(selectedDate.from, "MMM d")} - ${format(selectedDate.to, "MMM d, yyyy")}`;
      }
      return format(selectedDate.from, "PPP");
    }
    return "Select date";
  };

  const handlePresetClick = (preset: string) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    switch (preset) {
      case "today":
        setSelectedDate(todayStr);
        break;
      case "yesterday":
        setSelectedDate(subDays(today, 1).toISOString().split('T')[0]);
        break;
      case "last7":
        setSelectedDate({ from: subDays(today, 6), to: today });
        break;
      case "lastMonth":
        setSelectedDate({ from: subMonths(today, 1), to: today });
        break;
      case "lastQuarter":
        setSelectedDate({ from: subMonths(today, 3), to: today });
        break;
      default:
        // "custom" - keep current view but maybe toggle something
        break;
    }
  };

  const isPresetActive = (preset: string) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (typeof selectedDate === "string") {
      if (preset === "today") return selectedDate === todayStr;
      if (preset === "yesterday") return selectedDate === subDays(today, 1).toISOString().split('T')[0];
      return false;
    }

    if (selectedDate?.from && selectedDate?.to) {
      if (preset === "last7") return isSameDay(selectedDate.from, subDays(today, 6)) && isSameDay(selectedDate.to, today);
      if (preset === "lastMonth") return isSameDay(selectedDate.from, subMonths(today, 1)) && isSameDay(selectedDate.to, today);
      if (preset === "lastQuarter") return isSameDay(selectedDate.from, subMonths(today, 3)) && isSameDay(selectedDate.to, today);
    }

    return false;
  };

  return (
    <div className="space-y-12 animate-fade-in min-h-[500px] font-inter pb-20">
      {/* 📌 Header Overview Section - Premium Refined */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 pb-12 border-b border-brand-500/5">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-500 rounded-[14px] shadow-lg shadow-brand-500/20 text-white animate-in zoom-in-50 duration-500">
              <InsightRadarIcon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h1 className="text-[34px] font-black text-slate-900 tracking-[-0.03em] leading-tight">
                Overview Dashboard
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest opacity-80 pl-0.5">
                  <Activity className="h-3 w-3 text-emerald-500" />
                  Live Marketplace Intel
                </div>
                {user?.isPremium ? (
                  <span className="px-2 py-0.5 bg-brand-500/10 text-brand-500 border border-brand-500/20 rounded-full text-[10px] font-black uppercase tracking-wider">
                    Premium Client
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-wider">
                    Standard Client
                  </span>
                )}
              </div>
            </div>
          </div>
          <p className="text-[16px] text-slate-500 max-w-2xl font-medium leading-relaxed opacity-70">
            Real-time insights across professional opportunities, identified from the latest job posters.
          </p>
        </div>

        {/* Action Controls / Date Selector */}
        <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-auto">
          <div className="text-right flex flex-col items-center sm:items-end min-w-[140px] group cursor-default">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black mb-1.5 opacity-60">
              Found Listings
            </p>
            <div className="flex items-baseline gap-1">
              <p className="text-5xl font-black text-slate-900 tracking-[-0.05em] tabular-nums group-hover:text-brand-500 transition-colors duration-500">
                {loading ? "..." : displayCount}
              </p>
              <span className="text-sm font-black text-brand-500/40">+</span>
            </div>
          </div>

          <div className="h-12 w-px bg-brand-500/5 hidden sm:block" />

          <div className="relative w-full sm:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 w-full sm:w-auto px-6 border-brand-500/5 bg-white text-slate-800 hover:bg-slate-50 transition-all rounded-2xl font-bold text-sm shadow-premium flex items-center justify-center gap-3 border active:scale-95 group"
                >
                  <CalendarDays className="h-4 w-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
                  <span>{getDisplayDateText()}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-3xl border-slate-100 shadow-elevated bg-white overflow-hidden" align="end">
                <div className="flex flex-col md:flex-row">
                  {/* Presets Sidebar */}
                  <div className="w-full md:w-48 bg-slate-50/50 p-4 border-b md:border-b-0 md:border-r border-slate-100 space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-3 px-2">Presets</p>
                    {[
                      { id: "today", label: "Today" },
                      { id: "yesterday", label: "Yesterday" },
                      { id: "last7", label: "Last 7 days" },
                      { id: "lastMonth", label: "Last month" },
                      { id: "lastQuarter", label: "Last quarter" },
                      // { id: "custom", label: "Custom Range" },
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handlePresetClick(preset.id)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all",
                          isPresetActive(preset.id) || (preset.id === "custom" && typeof selectedDate === 'object' && selectedDate?.from && !isPresetActive("last7") && !isPresetActive("lastMonth") && !isPresetActive("lastQuarter"))
                            ? "bg-brand-500 text-white shadow-md shadow-brand-500/10"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Calendar Area */}
                  <div className="p-2">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={typeof selectedDate === "string" ? new Date(selectedDate) : (selectedDate?.from || new Date())}
                      selected={typeof selectedDate === "string"
                        ? { from: new Date(selectedDate), to: new Date(selectedDate) }
                        : selectedDate as any}
                      onSelect={(range) => {
                        if (range) {
                          if (range.from && range.to && isSameDay(range.from, range.to)) {
                            setSelectedDate(format(range.from, "yyyy-MM-dd"));
                          } else {
                            setSelectedDate(range as any);
                          }
                        }
                      }}
                      disabled={(date) => date > new Date()}
                      numberOfMonths={1}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid - Premium Palette */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <KPICard
          title="Total Jobs"
          todayValue={metrics.jobs.today}
          allTimeValue={metrics.jobs.total}
          measureLabel="Postings"
          icon={Briefcase}
          color="brand"
        />
        <KPICard
          title="Companies"
          todayValue={metrics.companies.today}
          allTimeValue={metrics.companies.total}
          measureLabel="Employers"
          icon={Building2}
          color="emerald"
        />
        <KPICard
          title="Role Domains"
          todayValue={metrics.domains.today}
          allTimeValue={metrics.domains.total}
          measureLabel="Categories"
          icon={Search}
          color="amber"
        />
        <KPICard
          title="Talent Posters"
          todayValue={metrics.posters.today}
          allTimeValue={metrics.posters.total}
          measureLabel="Sources"
          icon={Activity}
          color="rose"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-8 pt-10 px-10 bg-white border border-brand-500/5 rounded-3xl shadow-premium pb-12 transition-all hover:shadow-elevated">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Latest Opportunities</h2>
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active Feed</p>
              <span className="w-1 h-1 rounded-full bg-slate-200" />
              <p className="text-xs text-brand-500 font-black uppercase tracking-widest">{getDisplayDateText()}</p>
            </div>
          </div>
          <div className="hidden sm:inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-brand-50/50 border border-brand-500/10 text-[10px] text-brand-500 font-black uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Real-time
          </div>
        </div>

        {/* Table Content */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="space-y-4 py-10">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 w-full rounded-2xl bg-slate-50/50 animate-pulse border border-slate-100/50 shadow-sm" />
              ))}
            </div>
          ) : (
            <PaginatedSponsorshipTable 
              jobs={latestJobs.filter(j => j !== null)} 
              totalCount={totalTodayJobs}
              onPageChange={handleTablePageChange}
              isLoading={isChunkLoading}
              rowsPerPage={20}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
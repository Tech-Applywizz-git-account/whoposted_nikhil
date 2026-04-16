"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "./ui/card";
import { ArrowRight } from "lucide-react";
import { DomainIcon } from "./DomainIcon";
import { cn } from "@/lib/utils";

interface DomainCardProps {
  id: string;
  name: string;
  category: string; // "tech" or "non-tech"
  jobCount: number;
}

export const DomainCard = ({ id, name, category, jobCount }: DomainCardProps) => {
  const router = useRouter();
  const isTech = category === "tech";

  const handleNavigation = (e: React.MouseEvent) => {
    // Save scroll position
    const container = document.querySelector('main');
    if (container) {
      sessionStorage.setItem("domains_scroll_pos", container.scrollTop.toString());
    }
    
    // If it's a normal click (not cmd/ctrl+click), use router.push for smooth transition
    if (!e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      router.push(`/role-analysis/${encodeURIComponent(id)}`);
    }
  };

  return (
    <Link 
      href={`/role-analysis/${encodeURIComponent(id)}`} 
      className="block h-full no-underline"
      prefetch={false}
    >
      <Card 
        className="h-full p-8 transition-all duration-500 hover:-translate-y-2 active:-translate-y-1 cursor-pointer group bg-white border border-brand-500/5 rounded-[32px] shadow-premium hover:shadow-elevated flex flex-col justify-between overflow-hidden relative"
        onClick={handleNavigation}
      >
        {/* Background Accent Gradient */}
        <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-[0.03] blur-3xl transition-transform duration-700 group-hover:scale-150 ${isTech ? "bg-brand-500" : "bg-slate-400"}`} />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-8">
            {/* Icon container */}
            <div className="p-3 bg-slate-50 border border-slate-100/50 rounded-2xl group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500 transition-all duration-500 shadow-sm">
              <DomainIcon
                domainName={name}
                size="md"
                variant="card"
              />
            </div>
          </div>

          {/* Role name */}
          <h3 className="font-black text-2xl text-slate-900 group-hover:text-brand-500 transition-colors leading-tight line-clamp-2 tracking-[-0.03em] mb-4">
            {name}
          </h3>

          <div className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
               {jobCount?.toLocaleString() || 0} Openings
             </span>
          </div>
        </div>

        {/* Explore link */}
        <div className="flex items-center gap-2 text-xs text-brand-500 font-black uppercase tracking-widest transition-all mt-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-500">
          <span>Analyze Market</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </Card>
    </Link>
  );
};

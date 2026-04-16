"use client";

import Link from "next/link";
import { Card } from "./ui/card";
import { Briefcase } from "lucide-react";

interface CompanyCardProps {
  id: string;
  name: string;
  linkedin_jobs: number;
}

export const CompanyCard = ({ id, name, linkedin_jobs }: CompanyCardProps) => {
  return (
    <Link
      href={`/company-analysis/${encodeURIComponent(id)}`}
      className="block h-full group"
      prefetch={false}
      onClick={() => {
        const container = document.querySelector('main');
        if (container) {
          sessionStorage.setItem("companies_scroll_pos", container.scrollTop.toString());
        }
      }}
    >
      <Card className="p-8 h-full flex flex-col items-center justify-center text-center bg-white border border-brand-500/5 rounded-[32px] shadow-premium hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden relative">
        
        {/* Background Accent */}
        <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-[0.03] blur-3xl transition-transform duration-700 group-hover:scale-150 bg-brand-500" />

        {/* Circle Initial Avatar */}
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100/50 flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-brand-500 group-hover:border-brand-500 group-hover:shadow-lg group-hover:shadow-brand-500/20 group-hover:scale-110 group-hover:rounded-3xl">
          <span className="text-xl font-black text-brand-500 group-hover:text-white uppercase transition-colors duration-500">
            {name.charAt(0)}
          </span>
        </div>

        {/* Brand Information */}
        <h3 className="text-base font-black text-slate-900 mb-3 tracking-[-0.02em] line-clamp-2 group-hover:text-brand-500 transition-colors duration-300">
          {name}
        </h3>

        <div className="flex items-center gap-2 text-brand-500 font-black text-[10px] uppercase tracking-widest bg-brand-500/5 px-3 py-1.5 rounded-full border border-brand-500/10 group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500 transition-all duration-500">
          <Briefcase className="h-3.5 w-3.5" />
          <span>{linkedin_jobs} sponsored</span>
        </div>
      </Card>
    </Link>
  );
};

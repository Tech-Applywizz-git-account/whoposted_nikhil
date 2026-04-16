"use client";

import React from "react";
import { 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: {
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
  };
}

export const JobCard = ({ job }: JobCardProps) => {
  // Mock data for visual fidelity as requested
  const mockSalary = "$126,000.00/yr - $244,000.00/yr";
  const mockLocation = "United States (Remote)";
  const mockJobType = "Full-time";
  
  // Randomize level slightly for visual variety
  const wageLevel = (job.id % 3) + 1; 

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="group relative bg-white border border-brand-500/5 rounded-[28px] overflow-hidden shadow-premium hover:shadow-elevated hover:-translate-y-1 transition-all duration-500 flex flex-col md:flex-row items-stretch">
      
      {/* 🟦 Left - Company Badge/Logo Area */}
      <div className="p-6 md:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-brand-500/5 bg-slate-50/30 group-hover:bg-brand-50/20 transition-colors w-full md:w-32 shrink-0">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center overflow-hidden">
             <span className="text-2xl font-black text-brand-500">{getInitials(job.companyName)}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* ⬜ Center - Content Area */}
      <div className="p-6 md:p-8 flex-grow flex flex-col justify-center space-y-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-brand-500/10 text-brand-500 text-[10px] font-black uppercase tracking-wider rounded-full border border-brand-500/10">
              {job.jobRole}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Posted {new Date(job.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <a 
            href={job.jobUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group/title inline-block"
          >
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-[-0.03em] leading-tight group-hover/title:text-brand-500 transition-colors">
              {job.jobTitle}
              <ExternalLink className="inline-block ml-2 w-4 h-4 opacity-0 group-hover/title:opacity-100 transition-all -translate-y-0.5" />
            </h3>
          </a>
          <p className="text-slate-500 font-bold text-base mt-0.5 opacity-80 uppercase tracking-tight">
            {job.companyName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <div className="flex items-center gap-2 text-slate-400 font-bold">
            <MapPin className="w-4 h-4 text-brand-500/50" />
            <span className="text-xs uppercase tracking-wider">{mockLocation}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-bold">
            <Briefcase className="w-4 h-4 text-brand-500/50" />
            <span className="text-xs uppercase tracking-wider">{mockJobType}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-200 shadow-sm">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.1em]">Human Verified</span>
            <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* 🟧 Right - Action Area */}
      <div className="p-6 md:p-8 flex flex-col justify-center items-center md:w-72 shrink-0 border-t md:border-t-0 md:border-l border-brand-500/5 gap-3">
        {job.companyUrl && (
          <Button
            asChild
            className="w-full h-12 rounded-full bg-[#ffb900] hover:bg-[#ffbe00] text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#ffb900]/10 hover:shadow-[#ffb900]/20 transition-all active:scale-95 group/btn"
          >
            <a href={job.companyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              Visit Company Website
              <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </a>
          </Button>
        )}

        {job.posterUrl && (
          <Button
            asChild
            className="w-full h-12 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#0a66c2]/10 hover:shadow-[#0a66c2]/20 transition-all active:scale-95 group/btn"
          >
            <a href={job.posterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              See Who Posted
              <UserCheck className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </a>
          </Button>
        )}
      </div>

    </div>
  );
};

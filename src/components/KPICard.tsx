import React from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  todayValue: number;
  allTimeValue: number;
  measureLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: "brand" | "emerald" | "amber" | "rose";
}

export const KPICard = ({ 
  title, 
  todayValue, 
  allTimeValue, 
  measureLabel, 
  icon: Icon,
  color = "brand"
}: KPICardProps) => {
  const colorStyles = {
    brand: "text-brand-700 bg-brand-50 border-brand-200",
    emerald: "text-emerald-700 bg-emerald-50 border-emerald-200",
    amber: "text-amber-700 bg-amber-50 border-amber-200",
    rose: "text-rose-700 bg-rose-50 border-rose-200",
  };

  const iconStyles = {
    brand: "text-brand-500 group-hover:bg-brand-500 group-hover:text-white",
    emerald: "text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    amber: "text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
    rose: "text-rose-600 group-hover:bg-rose-600 group-hover:text-white",
  };

  return (
    <Card className="group relative overflow-hidden p-7 bg-white border border-brand-500/5 rounded-[24px] shadow-premium transition-all duration-500 hover:shadow-elevated hover:-translate-y-2">
      {/* Background Decorative Element */}
      <div className={cn(
        "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700 blur-2xl",
        color === "brand" ? "bg-brand-500" :
        color === "emerald" ? "bg-emerald-500" :
        color === "amber" ? "bg-amber-500" : "bg-rose-500"
      )} />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-5 flex-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-0.5">
            {title}
          </p>

          <div className="space-y-4">
            {/* Today Value */}
            <div className="flex items-center gap-4">
              <p className="text-[40px] font-black text-slate-900 tracking-[-0.04em] tabular-nums leading-none">
                {todayValue}
              </p>
              <span className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm",
                colorStyles[color]
              )}>
                Today
              </span>
            </div>

            {/* Total Value */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-50/50">
              <p className="text-xl font-bold text-slate-400 tabular-nums tracking-tight">
                {allTimeValue}
              </p>
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest pl-1">
                {measureLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Icon Container */}
        <div className="relative">
          <div className={cn(
            "p-3 rounded-2xl border transition-all duration-500 shadow-sm bg-slate-50 border-slate-100 group-hover:border-transparent",
            iconStyles[color]
          )}>
            <Icon className="h-5 w-5 transition-transform duration-500 group-hover:scale-110" />
          </div>
        </div>
      </div>
    </Card>
  );
};

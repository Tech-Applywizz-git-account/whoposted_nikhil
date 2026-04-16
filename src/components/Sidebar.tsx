"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FolderTree,
  Building2,
  ShieldCheck,
  Briefcase
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/overview", label: "Overview", icon: LayoutGrid },
    { href: "/role-analysis", label: "Domains", icon: FolderTree },
    { href: "/company-analysis", label: "Companies", icon: Building2 },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-white border-r border-brand-500/5 font-inter">
      {/* Branding Header */}
      <div className="px-7 py-10">
        <div className="flex items-center gap-3 mb-1.5 group cursor-default">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/20 group-hover:rotate-12 transition-transform duration-500">
            <Briefcase className="h-4.5 w-4.5" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-[-0.03em] group-hover:text-brand-500 transition-colors">
            WhoPosted
          </h1>
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] pl-0.5 opacity-70">
          Track whoposted job opportunities        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === "/overview" && pathname === "/");

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`group flex items-center gap-4 rounded-2xl px-4 py-3 text-[14px] transition-all duration-300 ${isActive
                      ? "bg-brand-500/5 text-brand-500 font-bold shadow-sm border border-brand-500/10"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <div className={`p-1.5 rounded-lg transition-all duration-300 ${isActive ? 'bg-brand-500/10' : 'group-hover:bg-white border border-transparent group-hover:border-slate-100 group-hover:shadow-sm'}`}>
                    <Icon
                      className={`h-[18px] w-[18px] shrink-0 transition-colors ${isActive ? "text-brand-500" : "text-slate-400 group-hover:text-brand-500"
                        }`}
                    />
                  </div>
                  <span className="tracking-tight">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500 shadow-sm animate-pulse" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / Copyright */}
      <div className="mt-auto px-7 py-8 border-t border-slate-50/50">
        <div className="flex items-center gap-3 text-[9px] text-slate-400 uppercase tracking-[0.2em] font-black opacity-60">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          Systems Active
        </div>
      </div>
    </div>
  );
};

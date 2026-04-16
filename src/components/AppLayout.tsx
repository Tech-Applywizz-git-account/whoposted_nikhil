"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, User, Menu, ChevronDown, ShieldCheck, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useDashboard } from "@/contexts/DashboardContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, signOut, loading, isPremium } = useAuth();
    const { jobPostsCount } = useDashboard();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isAuthPage = pathname === "/auth/set-password" || pathname === "/auth/forgot-password" || pathname === "/" || pathname === "/login" || pathname === "/signup";

    if (isAuthPage) {
        return <main className="min-h-screen bg-white">{children}</main>;
    }

    if (!isMounted || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center">
                    <div className="h-10 w-10 border-[3px] border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Authenticating...</p>
                </div>
            </div>
        );
    }

    if (!user && !isAuthPage) {
        window.location.href = "/login";
        return null;
    }

    // Derive initials from email
    const emailInitial = user?.email?.charAt(0)?.toUpperCase() ?? "U";
    const emailName = user?.email?.split("@")[0] ?? "User";

    return (
        <div className="h-screen flex bg-white w-full font-inter overflow-hidden">
            {/* Desktop Sidebar Container */}
            <aside className="hidden md:flex md:w-[240px] flex-shrink-0">
                <SidebarProvider defaultOpen={true}>
                    <Sidebar />
                </SidebarProvider>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 w-full">
                {/* Header Bar */}
                <header className="h-[58px] flex items-center justify-between px-6 bg-white border-b border-brand-500/5 z-20 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="p-2 md:hidden rounded-xl hover:bg-slate-50 text-slate-600 active:scale-95 transition-all"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        {/* Live Status Pill */}
                        <div className="flex items-center gap-2.5 px-4 py-2 bg-brand-50/80 rounded-full border border-brand-500/10">
                            <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-60" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                            </div>
                            {/* <span className="text-[12px] font-black text-brand-600 tracking-tight">
                                {jobPostsCount} new roles tracked today
                            </span> */}
                        </div>
                    </div>

                    {/* Right Section — Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setProfileOpen((prev) => !prev)}
                            className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-2xl border border-brand-500/5 bg-white hover:bg-slate-50 hover:border-brand-500/10 transition-all duration-300 active:scale-95 group shadow-premium"
                        >
                            {/* Avatar */}
                            <div className="h-8 w-8 rounded-xl bg-brand-500 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:rotate-6 transition-transform duration-500">
                                <span className="text-sm font-black text-white">{emailInitial}</span>
                            </div>

                            {/* Name */}
                            <span className="hidden sm:block text-sm font-bold text-slate-700 max-w-[150px] truncate tracking-tight">
                                {emailName}
                            </span>

                            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${profileOpen ? "rotate-180" : ""}`} />
                        </button>

                        {/* Premium Dropdown */}
                        {profileOpen && (
                            <div className="absolute right-0 top-[calc(100%+10px)] w-72 bg-white rounded-2xl shadow-elevated border border-brand-500/5 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                {/* User Info Section */}
                                <div className="px-5 pt-4 pb-4 border-b border-brand-500/5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20 shrink-0">
                                            <span className="text-lg font-black text-white">{emailInitial}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-black text-slate-900 truncate tracking-tight">{emailName}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                                                <p className="text-[11px] text-slate-400 font-medium truncate">{user?.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Client Status Badge */}
                                    <div className="mt-4">
                                        {isPremium ? (
                                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-50 text-brand-700 border border-brand-200">
                                                <ShieldCheck className="h-3.5 w-3.5" />
                                                Premium Client
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-700 border border-slate-200">
                                                <User className="h-3.5 w-3.5" />
                                                Standard Client
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="px-2 pt-2 pb-2">
                                    <button
                                        onClick={() => { setProfileOpen(false); signOut(); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all duration-200 group/signout active:scale-95"
                                    >
                                        <div className="p-1.5 rounded-lg bg-rose-50 group-hover/signout:bg-rose-100 transition-colors border border-rose-100">
                                            <LogOut className="h-4 w-4" />
                                        </div>
                                        <span>Sign Out</span>
                                        <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-rose-400 opacity-60">
                                            Ctrl+Q
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Content Pane */}
                <main className="flex-1 overflow-y-auto w-full p-3 lg:p-8 bg-white">
                    <div className="max-w-[1240px] mx-auto transition-all duration-300">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

export type DateRange = {
    from: Date | undefined
    to?: Date | undefined
}

interface DashboardContextType {
    selectedDate: string | DateRange | undefined;
    setSelectedDate: (date: string | DateRange | undefined) => void;
    jobPostsCount: number;
    setJobPostsCount: (count: number) => void;
    refreshJobCount: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState<string | DateRange | undefined>(undefined);
    const [jobPostsCount, setJobPostsCount] = useState(0);

    // Initialize date on client side only to avoid server/client mismatch
    useEffect(() => {
        if (selectedDate === undefined) {
            const today = format(new Date(), "yyyy-MM-dd");
            setSelectedDate(today);
        }
    }, [selectedDate]);

    const refreshJobCount = useCallback(async () => {
        if (!user) return; // Only fetch if user is logged in
        
        try {
            let url = "/api/job-posts-today";
            if (typeof selectedDate === "string") {
                url += `?date=${selectedDate}`;
            } else if (selectedDate?.from) {
                const start = format(selectedDate.from, "yyyy-MM-dd");
                const end = selectedDate.to ? format(selectedDate.to, "yyyy-MM-dd") : start;
                url += `?startDate=${start}&endDate=${end}`;
            }

            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch job posts count");
            
            const data = await res.json();
            setJobPostsCount(data.job_posts_today || 0);
        } catch (error) {
            console.error("Error refreshing job count:", error);
        }
    }, [selectedDate, user]);

    useEffect(() => {
        if (user) {
            refreshJobCount();
        }
    }, [refreshJobCount, user]);

    const value = React.useMemo(() => ({
        selectedDate,
        setSelectedDate,
        jobPostsCount,
        setJobPostsCount,
        refreshJobCount
    }), [selectedDate, jobPostsCount, refreshJobCount]);

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
}

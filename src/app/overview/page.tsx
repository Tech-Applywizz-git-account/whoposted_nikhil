"use client";

import { useAuth } from "@/contexts/AuthContext";
import Overview from "@/components/Overview";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OverviewPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-sm text-muted-foreground">Checking session…</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return <Overview />;
}

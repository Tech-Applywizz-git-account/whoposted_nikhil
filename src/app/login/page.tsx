"use client";

import LoginPage from "@/components/LoginPage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginRoute() {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        // If already logged in, redirect to overview
        if (user) {
            router.push("/overview");
        }
    }, [user, router]);

    const handleBack = () => {
        router.push("/");
    };

    return <LoginPage onBack={handleBack} />;
}

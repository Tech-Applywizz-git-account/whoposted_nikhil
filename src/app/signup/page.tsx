"use client";

import SignUpPage from "@/components/SignUpPage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUpRoute() {
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

    return <SignUpPage onBack={handleBack} />;
}

"use client";

import { useState } from "react";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to send reset email");
            }

            setIsSubmitted(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#f6f9fc] flex flex-col items-center justify-center p-6 font-inter">
            {/* Background pattern - subtle Stripe mesh */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#0a66c2]/5 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-[#0a66c2]/3 blur-[100px] rounded-full" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white rounded-[8px] shadow-stripe-lg border border-[#e5edf5] p-8 sm:p-10">
                    {!isSubmitted ? (
                        <>
                            <Link
                                href="/login"
                                className="group inline-flex items-center gap-2 text-sm font-medium text-[#64748d] hover:text-[#0a66c2] transition-colors mb-8"
                            >
                                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                <span>Back to Login</span>
                            </Link>

                            <div className="mb-10 text-center">
                                <div className="inline-flex p-3 bg-[#f0f7ff] rounded-[12px] border border-[#d1e7ff] mb-6">
                                    <Mail className="h-7 w-7 text-[#0a66c2]" />
                                </div>
                                <h1 className="text-[28px] font-bold text-[#061b31] tracking-tight mb-3">
                                    Forgot Password?
                                </h1>
                                <p className="text-[#64748d] font-normal leading-relaxed">
                                    No worries! Enter your professional email below and we&apos;ll send you instructions to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-[#4f5b76]">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3afbf] group-focus-within:text-[#0a66c2] transition-colors z-10">
                                            <Mail className="h-4.5 w-4.5" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="name@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-11 pr-4 h-12 rounded-[8px] border border-[#d3dce6] bg-white text-[#061b31] placeholder:text-[#a3afbf] focus:border-[#0a66c2] focus:ring-[3px] focus:ring-[#0a66c2]/8 transition-all outline-none font-normal text-sm shadow-sm"
                                        />
                                    </div>
                                    {error && (
                                        <p className="text-red-500 text-xs mt-2 font-medium bg-red-50 border border-red-100 p-2 rounded-[4px]">
                                            {error}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#0a66c2] hover:bg-[#004f99] h-12 text-base font-bold text-white rounded-[8px] shadow-sm transition-all"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Sending Instructions...
                                        </>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="inline-flex p-3 bg-emerald-50 rounded-[12px] border border-emerald-100 mb-6">
                                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                            </div>
                            <h2 className="text-[28px] font-bold text-[#061b31] tracking-tight mb-4">
                                Check Your Inbox
                            </h2>
                            <p className="text-[#64748d] font-normal leading-relaxed mb-10">
                                We&apos;ve sent a password reset link to <strong className="text-[#061b31]">{email}</strong>. Please follow the instructions in the email to securely reset your password.
                            </p>
                            <Link href="/login">
                                <Button variant="outline" className="w-full h-12 border-[#d3dce6] text-[#4f5b76] font-bold">
                                    Return to Login
                                </Button>
                            </Link>
                            <p className="mt-8 text-sm text-[#64748d]">
                                Didn&apos;t receive the email?{" "}
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-[#0a66c2] font-semibold hover:underline"
                                >
                                    Try another address
                                </button>
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Disclaimer */}
                <div className="mt-8 text-center px-4">
                    <p className="text-sm text-[#94a3b8] font-normal">
                      Security matters. WhoPosted uses encrypted tokens for all password reset procedures. 
                    </p>
                </div>
            </div>
        </div>
    );
}

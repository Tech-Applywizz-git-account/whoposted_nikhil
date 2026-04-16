"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, X, Lock, Eye, EyeOff, ArrowLeft, Mail, Loader2 } from "lucide-react";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CreateWithPasswordPage() {
    const router = useRouter();
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserPassword, setNewUserPassword] = useState("");
    const [newUserRole, setNewUserRole] = useState<"whopost_client" | "whopost_admin">("whopost_client");
    const [newCountry, setCountry] = useState<"United Kingdom" | "United States of America" | "Ireland">("United States of America");
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [createUserError, setCreateUserError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleCreateUserWithPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUserEmail || !newUserPassword || !newUserRole || !newCountry) {
            setCreateUserError("Please fill in all fields");
            return;
        }

        setIsCreatingUser(true);
        setCreateUserError("");

        try {
            const response = await fetch("/api/admin/createUserWithPassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: newUserEmail,
                    password: newUserPassword,
                    role: newUserRole,
                    country: newCountry,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                setCreateUserError(result.error || "Failed to create user");
                return;
            }

            showToast(result.message || "User created successfully", "success");
            setTimeout(() => router.push("/admin-controls"), 2000);
        } catch (err) {
            console.error(err);
            setCreateUserError("Failed to create user");
        } finally {
            setIsCreatingUser(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f6f9fc] flex flex-col items-center justify-center p-6 font-inter">
            {/* Ambient Background Pattern */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#0a66c2]/5 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-[#0a66c2]/3 blur-[100px] rounded-full" />
            </div>

            <div className="w-full max-w-2xl relative z-10">
                {/* Navigation Back */}
                <button
                    onClick={() => router.back()}
                    className="group mb-8 flex items-center gap-1.5 text-sm font-medium text-[#64748d] hover:text-[#0a66c2] transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    <span>Back to Admin Dashboard</span>
                </button>

                {/* Main Card */}
                <div className="bg-white rounded-[8px] border border-[#e5edf5] shadow-stripe-lg overflow-hidden animate-in zoom-in-95 duration-500">
                    {/* Header */}
                    <div className="p-8 border-b border-[#f1f5f9] bg-[#f8fafc]/50">
                        <div className="flex items-center gap-5">
                            <div className="h-14 w-14 rounded-[12px] bg-[#f0f7ff] border border-[#d1e7ff] flex items-center justify-center">
                                <Lock className="h-7 w-7 text-[#0a66c2]" />
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-[28px] font-bold text-[#061b31] tracking-tight">
                                    Direct Account Creation
                                </h1>
                                <p className="text-[15px] text-[#64748d] font-normal">
                                    Establish a new account immediately by defining credentials and regional access.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-10">
                        <form onSubmit={handleCreateUserWithPassword} className="space-y-8">
                            <div className="space-y-6">
                                {/* Email Field */}
                                <div className="space-y-2.5">
                                    <label htmlFor="user-email" className="block text-sm font-medium text-[#4f5b76]">
                                        Professional Email
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3afbf] group-focus-within:text-[#0a66c2] transition-colors z-10">
                                            <Mail className="h-4.5 w-4.5" />
                                        </div>
                                        <input
                                            id="user-email"
                                            type="email"
                                            required
                                            value={newUserEmail}
                                            onChange={(e) => setNewUserEmail(e.target.value)}
                                            className="w-full pl-11 pr-4 h-12 rounded-[8px] border border-[#d3dce6] bg-white text-[#061b31] placeholder:text-[#a3afbf] focus:border-[#0a66c2] focus:ring-[3px] focus:ring-[#0a66c2]/8 transition-all outline-none font-normal text-sm shadow-sm"
                                            placeholder="name@organization.com"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2.5">
                                    <label htmlFor="user-password" className="block text-sm font-medium text-[#4f5b76]">
                                        Assigned Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3afbf] group-focus-within:text-[#0a66c2] transition-colors z-10">
                                            <Lock className="h-4.5 w-4.5" />
                                        </div>
                                        <input
                                            id="user-password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={newUserPassword}
                                            onChange={(e) => setNewUserPassword(e.target.value)}
                                            className="w-full pl-11 pr-12 h-12 rounded-[8px] border border-[#d3dce6] bg-white text-[#061b31] placeholder:text-[#a3afbf] focus:border-[#0a66c2] focus:ring-[3px] focus:ring-[#0a66c2]/8 transition-all outline-none font-normal text-sm shadow-sm"
                                            placeholder="Set secure password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a3afbf] hover:text-[#0a66c2] transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <CustomDropdown
                                    id="user-role"
                                    label="Administrative Role"
                                    options={[
                                        { value: 'whopost_client', label: 'Whopost Client' },
                                        { value: 'whopost_admin', label: 'Whopost Admin' },
                                    ]}
                                    value={newUserRole}
                                    onChange={(value) => setNewUserRole(value as any)}
                                />

                                <CustomDropdown
                                    id="user-country"
                                    label="Regional Jurisdiction"
                                    options={[
                                        { value: 'United States of America', label: 'United States' },
                                        { value: 'United Kingdom', label: 'United Kingdom' },
                                        { value: 'Ireland', label: 'Ireland' },
                                    ]}
                                    value={newCountry}
                                    onChange={(value) => setCountry(value as any)}
                                />
                            </div>

                            {createUserError && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-[8px] flex items-start gap-3 text-red-600">
                                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                    <p className="text-sm font-medium leading-relaxed">{createUserError}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-6 h-11 rounded-[8px] border border-[#d3dce6] text-[#4f5b76] font-bold text-sm hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <Button
                                    type="submit"
                                    disabled={isCreatingUser || !newUserEmail || !newUserPassword}
                                    className="bg-[#0a66c2] hover:bg-[#004f99] text-white h-11 px-8 rounded-[8px] font-bold shadow-sm transition-all"
                                >
                                    {isCreatingUser ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Establishing...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
                
                {/* Security Disclaimer */}
                <div className="mt-8 text-center px-4">
                    <p className="text-[13px] text-[#94a3b8] font-normal leading-relaxed">
                      Manual account creation bypasses the invitation workflow. Ensure credentials are secure and compliant with corporate security standards.
                    </p>
                </div>
            </div>

            {/* Toast System */}
            {toast && (
                <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-8 duration-300 fade-in">
                    <div className={cn(
                        "px-5 py-4 rounded-[8px] shadow-stripe-lg border flex items-center gap-4 bg-white",
                        toast.type === "success" ? "border-emerald-100 text-emerald-800" : "border-red-100 text-red-800"
                    )}>
                        <div className={cn("p-1.5 rounded-full", toast.type === 'success' ? 'bg-emerald-50' : 'bg-red-50')}>
                            {toast.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        </div>
                        <p className="font-semibold text-sm pr-2">{toast.message}</p>
                        <button onClick={() => setToast(null)} className="text-slate-300 hover:text-slate-500 transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

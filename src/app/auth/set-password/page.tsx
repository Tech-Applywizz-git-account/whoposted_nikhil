"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, CheckCircle, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid or expired reset link. Please request a new one.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to set password");
      }

      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f6f9fc] flex flex-col items-center justify-center p-6 font-inter">
      {/* Subtle Stripe-style background patterns */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] bg-[#0a66c2]/5 blur-[100px] rounded-full" />
          <div className="absolute bottom-[20%] left-[10%] w-[25%] h-[25%] bg-[#0a66c2]/3 blur-[80px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-[8px] shadow-stripe-lg border border-[#e5edf5] p-8 sm:p-10">
          {!isSuccess ? (
            <>
              <div className="mb-10 text-center">
                <div className="inline-flex p-3 bg-[#f0f7ff] rounded-[12px] border border-[#d1e7ff] mb-6">
                  <ShieldCheck className="h-7 w-7 text-[#0a66c2]" />
                </div>
                <h1 className="text-[28px] font-bold text-[#061b31] tracking-tight mb-3">
                  Secure Your Account
                </h1>
                <p className="text-[#64748d] font-normal leading-relaxed">
                  Please establish a new professional password to finalize your account security update.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#4f5b76]">
                      New Password
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3afbf] group-focus-within:text-[#0a66c2] transition-colors z-10">
                        <Lock className="h-4.5 w-4.5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-11 pr-12 h-12 rounded-[8px] border border-[#d3dce6] bg-white text-[#061b31] placeholder:text-[#a3afbf] focus:border-[#0a66c2] focus:ring-[3px] focus:ring-[#0a66c2]/8 transition-all outline-none font-normal text-sm shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a3afbf] hover:text-[#0a66c2] transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#4f5b76]">
                      Confirm New Password
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3afbf] group-focus-within:text-[#0a66c2] transition-colors z-10">
                        <Lock className="h-4.5 w-4.5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full pl-11 pr-12 h-12 rounded-[8px] border border-[#d3dce6] bg-white text-[#061b31] placeholder:text-[#a3afbf] focus:border-[#0a66c2] focus:ring-[3px] focus:ring-[#0a66c2]/8 transition-all outline-none font-normal text-sm shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-[6px] flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                    <p className="text-red-600 text-[13px] font-medium">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !token}
                  className="w-full bg-[#0a66c2] hover:bg-[#004f99] h-12 text-base font-bold text-white rounded-[8px] shadow-sm transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Updating Security...
                    </>
                  ) : (
                    "Establish Password"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="inline-flex p-3 bg-emerald-50 rounded-[12px] border border-emerald-100 mb-6">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </div>
              <h2 className="text-[28px] font-bold text-[#061b31] tracking-tight mb-4">
                Update Successful
              </h2>
              <p className="text-[#64748d] font-normal leading-relaxed mb-8">
                Your password has been securely updated. You are now being redirected to the authentication portal.
              </p>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 animate-[progress_3s_linear]" />
              </div>
            </div>
          )}
        </div>
        
        {/* Helper Footer */}
        {!isSuccess && (
          <div className="mt-8 text-center px-4">
            <p className="text-sm text-[#94a3b8] font-normal">
              For security, ensure your password is unique and contains at least 8 characters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

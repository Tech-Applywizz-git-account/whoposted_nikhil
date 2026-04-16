import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type LoginProps = {
  onBack?: () => void;
};

function Login({ onBack }: LoginProps) {
  const { refreshSession } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      await refreshSession();
      router.push('/overview');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-white overflow-hidden relative font-inter">
      {/* Subtle background element - Career indigo accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-[#6366f1]/10" />

      <div className="w-full max-w-[380px] relative z-10 animate-fade-in-up">
        {/* Header/Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/whoposted-logo.png"
            alt="WhoPosted Jobs"
            className="h-28 w-auto mb-6 object-contain filter drop-shadow-sm cursor-pointer"
            onClick={() => window.location.href = "https://who-posted.vercel.app/"}
          />
          <h1 className="text-[24px] font-bold text-[#061b31] tracking-tight mb-1.5">
            Sign in to your account
          </h1>
          <p className="text-[#64748d] text-[14px] font-normal">
            Welcome back to WhoPosted Jobs
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[12px] shadow-lg border border-[#e5e7eb] p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-[13px] text-red-600 bg-red-50 rounded-[4px] border border-red-100 flex items-center gap-3 animate-shake">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[13px] font-medium text-[#4f5b76]">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 h-9 rounded-[6px] border border-[#d3dce6] bg-white text-[#061b31] placeholder:text-[#a3afbf] focus:border-[#6366f1] focus:ring-[3px] focus:ring-[#6366f1]/10 transition-all outline-none text-[13px] font-normal shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-[13px] font-medium text-[#4f5b76]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => window.location.href = "/auth/forgot-password"}
                  className="text-[13px] text-[#6366f1] hover:text-[#4f46e5] font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 pr-10 h-9 rounded-[6px] border border-[#d3dce6] bg-white text-[#061b31] placeholder:text-[#a3afbf] focus:border-[#6366f1] focus:ring-[3px] focus:ring-[#6366f1]/10 transition-all outline-none text-[13px] font-normal shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a3afbf] hover:text-[#64748d] transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white font-medium py-2.5 rounded-[6px] shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] transform active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[15px]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-[#64748d] text-[14px]">
          <span>Don&apos;t have an account? </span>
          <Link
            href="/signup"
            className="text-[#6366f1] hover:text-[#4f46e5] font-medium transition-colors"
          >
            Create account
          </Link>
        </div>
      </div>


    </div>
  );
}

export default Login;

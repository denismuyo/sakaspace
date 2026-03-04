"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "#F5F7FA" }}
      >
        <div className="text-center max-w-md">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            style={{ backgroundColor: "#0FAF7F" }}
          >
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Check your email
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            We sent a confirmation link to{" "}
            <strong className="text-slate-700">{email}</strong>. Click it to
            activate your account and start listing properties.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm"
            style={{ backgroundColor: "#1A4D8F" }}
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#F5F7FA" }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(15,175,127,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: "#0FAF7F" }}
            >
              <span className="text-white font-black text-lg">S</span>
            </div>
            <span
              className="font-black text-2xl tracking-tight"
              style={{ color: "#1A4D8F" }}
            >
              SakaSpace
            </span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 mt-6 tracking-tight">
            Create your account
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Join thousands of landlords and agents on SakaSpace
          </p>
        </div>

        {/* Benefit pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {[
            "✓ Free to list",
            "✓ Verified badge",
            "✓ Instant reach",
          ].map((b) => (
            <span
              key={b}
              className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: "rgba(15,175,127,0.12)",
                color: "#059669",
              }}
            >
              {b}
            </span>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div
            className="h-1 w-full"
            style={{
              background: "linear-gradient(90deg, #0FAF7F, #1A4D8F)",
            }}
          />

          <form onSubmit={handleSignup} className="p-8 space-y-4">
            {error && (
              <div
                className="flex items-start gap-3 p-4 rounded-xl text-sm"
                style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#dc2626" }}
              >
                <svg
                  className="w-5 h-5 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Kamau"
                className="w-full px-4 py-3 rounded-xl border text-sm font-medium text-slate-900 transition-all outline-none placeholder:text-slate-300"
                style={{ borderColor: "#e2e8f0", backgroundColor: "#fafafa" }}
                onFocus={(e) => (e.target.style.borderColor = "#1A4D8F")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border text-sm font-medium text-slate-900 transition-all outline-none placeholder:text-slate-300"
                style={{ borderColor: "#e2e8f0", backgroundColor: "#fafafa" }}
                onFocus={(e) => (e.target.style.borderColor = "#1A4D8F")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 rounded-xl border text-sm font-medium text-slate-900 transition-all outline-none"
                style={{ borderColor: "#e2e8f0", backgroundColor: "#fafafa" }}
                onFocus={(e) => (e.target.style.borderColor = "#1A4D8F")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full px-4 py-3 rounded-xl border text-sm font-medium text-slate-900 transition-all outline-none"
                style={{ borderColor: "#e2e8f0", backgroundColor: "#fafafa" }}
                onFocus={(e) => (e.target.style.borderColor = "#1A4D8F")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-black text-sm transition-all mt-2 flex items-center justify-center gap-2"
              style={{
                backgroundColor: loading ? "#94a3b8" : "#0FAF7F",
                boxShadow: loading
                  ? "none"
                  : "0 4px 16px rgba(15,175,127,0.4)",
              }}
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating account…
                </>
              ) : (
                "Create My Account →"
              )}
            </button>
          </form>

          <div
            className="px-8 py-5 text-center text-sm border-t"
            style={{ borderColor: "#f1f5f9", backgroundColor: "#fafafa" }}
          >
            <span className="text-slate-500">Already have an account? </span>
            <Link
              href="/login"
              className="font-bold transition-colors"
              style={{ color: "#1A4D8F" }}
            >
              Sign in →
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

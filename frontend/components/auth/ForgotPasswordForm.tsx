"use client";

import { useState } from "react";
import Link from "next/link";

interface ForgotPasswordFormProps {
  onToggleMode?: (mode: "login" | "register" | "forgot-password") => void;
  onSubmitSuccess?: (email: string) => void;
}

export function ForgotPasswordForm({
  onToggleMode,
  onSubmitSuccess,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API call for sending reset link
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setResendCooldown(60);

      // Start countdown
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      if (onSubmitSuccess) {
        onSubmitSuccess(email);
      }
    }, 800);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 500);
  };

  const handleBackToLogin = (e: React.MouseEvent) => {
    if (onToggleMode) {
      e.preventDefault();
      onToggleMode("login");
    }
  };

  return (
    <div className="w-full md:w-7/12 lg:w-1/2 h-full md:h-screen flex flex-col px-6 sm:px-10 py-6 sm:py-8 md:py-10 overflow-y-auto overflow-x-hidden bg-white relative">
      {/* Subtle ambient mint glows strictly clipped within container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#d1fae5]/35 blur-3xl -mr-20 -mt-20" />
        <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full bg-[#ecfdf5]/40 blur-3xl -ml-20" />
      </div>

      <div className="max-w-[430px] w-full mx-auto relative z-10 flex flex-col gap-5 my-auto">
        {!submitted ? (
          <>
            {/* Top Icon Badge */}
            <div className="w-12 h-12 rounded-2xl bg-[#eef7f2] border border-[#d8ebe0] flex items-center justify-center text-[#1b7a43] shadow-xs">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>

            {/* Heading & Subtitle */}
            <div>
              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="text-[#173324] text-4xl font-normal tracking-tight mb-2"
              >
                Reset Password
              </h2>
              <p className="text-[#55695d] text-sm leading-relaxed">
                Enter the email associated with your account and we will send you
                a link to reset your password.
              </p>
            </div>

            {/* Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address Field */}
              <div>
                <label className="text-[11px] font-bold text-[#3d4f45] uppercase tracking-wider mb-1.5 block">
                  EMAIL ADDRESS
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-[#7b8c82]">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                    style={{
                      border: "1.5px solid #e2eae5",
                      color: "#173324",
                      background: "#fcfaf7",
                    }}
                    onFocus={(e) =>
                      (e.target.style.border = "1.5px solid #2d6a4f")
                    }
                    onBlur={(e) =>
                      (e.target.style.border = "1.5px solid #e2eae5")
                    }
                  />
                </div>
              </div>

              {/* Main Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-xl hover:scale-[1.01] disabled:opacity-75 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(135deg, #1d553a 0%, #173324 100%)",
                  boxShadow: "0 8px 24px rgba(23,51,36,0.25)",
                }}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    <span>Sending Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <span className="text-lg leading-none">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Back to Sign In Link */}
            <div className="text-center pt-2">
              <Link
                href="/login"
                onClick={handleBackToLogin}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1b7a43] hover:text-[#173324] transition-colors cursor-pointer"
              >
                <span>←</span>
                <span>Back to Sign In</span>
              </Link>
            </div>
          </>
        ) : (
          /* Confirmation / Sent State */
          <>
            {/* Success Icon Badge */}
            <div className="w-14 h-14 rounded-2xl bg-[#e6f4ea] border border-[#b7e1cd] flex items-center justify-center text-[#137333] shadow-xs">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* Heading & Subtitle */}
            <div>
              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="text-[#173324] text-4xl font-normal tracking-tight mb-2"
              >
                Check Your Inbox
              </h2>
              <p className="text-[#55695d] text-sm leading-relaxed">
                We have sent a password reset link to{" "}
                <strong className="text-[#173324] font-semibold">{email}</strong>.
                Please check your inbox and follow the link to create a new
                password.
              </p>
            </div>

            {/* Information Card */}
            <div className="p-4 rounded-xl bg-[#f7faf8] border border-[#e2eae5] text-xs text-[#55695d] space-y-1.5">
              <p className="font-semibold text-[#173324]">
                Didn&apos;t receive the email?
              </p>
              <p>
                Check your spam or junk folder. If it&apos;s still not there, you
                can request a new reset link.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border ${
                  resendCooldown > 0
                    ? "bg-[#f4f7f5] text-[#8a9a90] border-[#e2eae5] cursor-not-allowed"
                    : "bg-white text-[#173324] border-[#d1dec7] hover:bg-[#f9faf9] shadow-xs"
                }`}
              >
                {resendCooldown > 0 ? (
                  <span>Resend link in {resendCooldown}s</span>
                ) : (
                  <span>Resend Reset Link</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
                className="w-full py-2.5 text-xs text-[#55695d] hover:text-[#173324] font-medium transition-colors cursor-pointer"
              >
                Try a different email address
              </button>
            </div>

            {/* Return to Sign In */}
            <div className="text-center pt-2">
              <Link
                href="/login"
                onClick={handleBackToLogin}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1b7a43] hover:text-[#173324] transition-colors cursor-pointer"
              >
                <span>←</span>
                <span>Return to Sign In</span>
              </Link>
            </div>
          </>
        )}

        {/* Trust Badges Footer */}
        <div className="pt-3 border-t border-[#e6eee8] flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-[#485d50]">
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#1b7a43] text-white flex items-center justify-center text-[8px] font-bold">
              ✓
            </span>
            Audited Field NGOs
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#1b7a43] text-white flex items-center justify-center text-[8px] font-bold">
              ✓
            </span>
            Real-time GPS Tracking
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#1b7a43] text-white flex items-center justify-center text-[8px] font-bold">
              ✓
            </span>
            Carbon Offset Certified
          </span>
        </div>
      </div>
    </div>
  );
}

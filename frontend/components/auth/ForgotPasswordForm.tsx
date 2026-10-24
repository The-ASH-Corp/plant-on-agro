"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth/auth.service";
import { ApiError } from "@/types/api";

interface ForgotPasswordFormProps {
  onToggleMode?: (mode: "login" | "register" | "forgot-password") => void;
  onSubmitSuccess?: (email: string) => void;
}

type Step = "request" | "verify_otp" | "reset_password" | "completed";

export function ForgotPasswordForm({
  onToggleMode,
  onSubmitSuccess,
}: ForgotPasswordFormProps) {
  const router = useRouter();

  // State
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Auto redirect on completion
  useEffect(() => {
    if (step === "completed") {
      const redirectTimer = setTimeout(() => {
        if (onToggleMode) {
          onToggleMode("login");
        } else {
          router.push("/login");
        }
      }, 3000);
      return () => clearTimeout(redirectTimer);
    }
  }, [step, onToggleMode, router]);

  // Password validity checks
  const passwordCriteria = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(newPassword),
    match: Boolean(newPassword && newPassword === confirmPassword),
  };

  const isPasswordValid =
    passwordCriteria.length &&
    passwordCriteria.upper &&
    passwordCriteria.lower &&
    passwordCriteria.number &&
    passwordCriteria.special &&
    passwordCriteria.match;

  // 1. Request OTP Handler (Step 1 -> Step 2)
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await authService.requestPasswordResetOtp(email.trim().toLowerCase());
      setSuccessMessage(res.message || `A 6-digit verification code has been dispatched to ${email}`);
      setStep("verify_otp");
      setResendCooldown(60);

      if (onSubmitSuccess) {
        onSubmitSuccess(email);
      }
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(
        apiErr.message || "Failed to send reset code. Please ensure the email is registered."
      );
    } finally {
      setLoading(false);
    }
  };

  // 2. Resend OTP Handler
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading || !email.trim()) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await authService.requestPasswordResetOtp(email.trim().toLowerCase());
      setSuccessMessage(res.message || "A fresh 6-digit code has been dispatched to your email.");
      setResendCooldown(60);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || "Could not resend verification code. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify OTP Handler (Step 2 -> Step 3)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await authService.verifyPasswordResetOtp(email.trim().toLowerCase(), cleanOtp);
      setSuccessMessage(res.message || "Code verified successfully! You can now choose a new password.");
      setStep("reset_password");
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || "Invalid or expired verification code. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Reset Password with OTP Handler (Step 3 -> Step 4)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || !isPasswordValid) return;

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await authService.resetPasswordWithOtp({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        password: newPassword,
      });

      setSuccessMessage(res.message || "Password has been reset successfully!");
      setStep("completed");
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrorMessage(apiErr.message || "Verification code is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = (e: React.MouseEvent) => {
    if (onToggleMode) {
      e.preventDefault();
      onToggleMode("login");
    }
  };

  // Step indicator steps mapping
  const stepsList = [
    { key: "request", label: "Email" },
    { key: "verify_otp", label: "Verify OTP" },
    { key: "reset_password", label: "New Password" },
  ];

  const currentStepIndex =
    step === "request" ? 0 : step === "verify_otp" ? 1 : step === "reset_password" ? 2 : 3;

  return (
    <div className="w-full md:w-7/12 lg:w-1/2 h-full md:h-screen flex flex-col px-6 sm:px-10 py-6 sm:py-8 md:py-10 overflow-y-auto overflow-x-hidden bg-white relative font-sans">
      {/* Subtle ambient mint glows strictly clipped within container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#d1fae5]/35 blur-3xl -mr-20 -mt-20" />
        <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full bg-[#ecfdf5]/40 blur-3xl -ml-20" />
      </div>

      <div className="max-w-[440px] w-full mx-auto relative z-10 flex flex-col gap-5 my-auto">
        {/* Visual Multi-step Progression Tracker */}
        {step !== "completed" && (
          <div className="flex items-center justify-between pb-2 border-b border-[#eef4f0]">
            {stepsList.map((s, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              return (
                <div key={s.key} className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#1d553a] text-white shadow-xs"
                        : isPast
                        ? "bg-[#dcfce7] text-[#15803d]"
                        : "bg-[#f0f4f1] text-[#819588]"
                    }`}
                  >
                    {isPast ? "✓" : idx + 1}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:inline ${
                      isActive ? "text-[#173324] font-semibold" : "text-[#7a8e81]"
                    }`}
                  >
                    {s.label}
                  </span>
                  {idx < stepsList.length - 1 && (
                    <div
                      className={`w-8 sm:w-12 h-[2px] transition-all ${
                        idx < currentStepIndex ? "bg-[#15803d]" : "bg-[#e5ece7]"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
            <svg
              className="w-5 h-5 shrink-0 text-red-500 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1 font-medium">{errorMessage}</div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-red-600 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Success Alert Banner */}
        {successMessage && step !== "completed" && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
            <svg
              className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div className="flex-1 font-medium">{successMessage}</div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 1: REQUEST OTP (Email Entry) */}
        {/* ============================================================ */}
        {step === "request" && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-[#eef7f2] border border-[#d8ebe0] flex items-center justify-center text-[#1b7a43] shadow-xs">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>

            <div>
              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="text-[#173324] text-3xl sm:text-4xl font-normal tracking-tight mb-2"
              >
                Reset Password
              </h2>
              <p className="text-[#55695d] text-sm leading-relaxed">
                Enter your registered email address and we will dispatch a 6-digit one-time verification code (OTP) to your inbox.
              </p>
            </div>

            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[#3d4f45] uppercase tracking-wider mb-1.5 block">
                  EMAIL ADDRESS
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-[#7b8c82]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    onFocus={(e) => (e.target.style.border = "1.5px solid #2d6a4f")}
                    onBlur={(e) => (e.target.style.border = "1.5px solid #e2eae5")}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-xl hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #1d553a 0%, #173324 100%)",
                  boxShadow: "0 8px 24px rgba(23,51,36,0.25)",
                }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <span className="text-lg leading-none">→</span>
                  </>
                )}
              </button>
            </form>

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
        )}

        {/* ============================================================ */}
        {/* STEP 2: VERIFY OTP (Only OTP Input & Verification) */}
        {/* ============================================================ */}
        {step === "verify_otp" && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-[#eef7f2] border border-[#d8ebe0] flex items-center justify-center text-[#1b7a43] shadow-xs">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>

            <div>
              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="text-[#173324] text-3xl sm:text-4xl font-normal tracking-tight mb-2"
              >
                Verify Code
              </h2>
              <div className="text-[#55695d] text-xs sm:text-sm flex items-center justify-between gap-2 bg-[#f4f8f5] p-2.5 rounded-lg border border-[#e1ece4]">
                <span className="truncate">
                  Code dispatched to: <strong className="text-[#173324] font-semibold">{email}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStep("request");
                    setOtp("");
                    setErrorMessage(null);
                  }}
                  className="text-emerald-700 hover:text-emerald-900 font-bold text-xs shrink-0 underline cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="text-[11px] font-bold text-[#3d4f45] uppercase tracking-wider mb-2 flex justify-between items-center">
                  <span>ENTER 6-DIGIT VERIFICATION CODE</span>
                  {resendCooldown > 0 ? (
                    <span className="text-[#72857a] text-[10px] font-normal lowercase">
                      resend code in {resendCooldown}s
                    </span>
                  ) : null}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="• • • • • •"
                    className="w-full text-center tracking-[10px] font-mono font-bold text-2xl sm:text-3xl py-3.5 rounded-xl outline-none transition-all shadow-inner"
                    style={{
                      border: "2px dashed #2d6a4f",
                      color: "#173324",
                      background: "#f4f8f5",
                    }}
                  />
                </div>
                <p className="text-[11px] text-[#677b70] mt-1.5 text-center">
                  Please check your inbox or spam folder. The code expires in 10 minutes.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-xl hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #1d553a 0%, #173324 100%)",
                  boxShadow: "0 8px 24px rgba(23,51,36,0.25)",
                }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Code</span>
                    <span className="text-lg leading-none">✓</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className="text-xs font-semibold text-[#1b7a43] hover:text-[#173324] disabled:text-[#88998f] cursor-pointer"
                >
                  {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP Code"}
                </button>

                <Link
                  href="/login"
                  onClick={handleBackToLogin}
                  className="text-xs font-semibold text-[#526659] hover:text-[#173324] cursor-pointer"
                >
                  Return to Sign In
                </Link>
              </div>
            </form>
          </>
        )}

        {/* ============================================================ */}
        {/* STEP 3: RESET PASSWORD (Shown ONLY AFTER OTP is Verified) */}
        {/* ============================================================ */}
        {step === "reset_password" && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-[#eef7f2] border border-[#d8ebe0] flex items-center justify-center text-[#1b7a43] shadow-xs">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#dcfce7] border border-[#bbf7d0] text-[#15803d] text-xs font-bold mb-2">
                <span>✓</span>
                <span>OTP Verified Successfully</span>
              </div>
              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="text-[#173324] text-3xl sm:text-4xl font-normal tracking-tight mb-2"
              >
                Set New Password
              </h2>
              <p className="text-[#55695d] text-sm leading-relaxed">
                Choose a strong new password for your account (<strong>{email}</strong>).
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="text-[11px] font-bold text-[#3d4f45] uppercase tracking-wider mb-1.5 block">
                  NEW PASSWORD
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoFocus
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full pl-4 pr-11 py-3.5 rounded-xl text-sm outline-none transition-all"
                    style={{
                      border: "1.5px solid #e2eae5",
                      color: "#173324",
                      background: "#fcfaf7",
                    }}
                    onFocus={(e) => (e.target.style.border = "1.5px solid #2d6a4f")}
                    onBlur={(e) => (e.target.style.border = "1.5px solid #e2eae5")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-[#7b8c82] hover:text-[#173324] cursor-pointer"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-[11px] font-bold text-[#3d4f45] uppercase tracking-wider mb-1.5 block">
                  CONFIRM NEW PASSWORD
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    border: "1.5px solid #e2eae5",
                    color: "#173324",
                    background: "#fcfaf7",
                  }}
                  onFocus={(e) => (e.target.style.border = "1.5px solid #2d6a4f")}
                  onBlur={(e) => (e.target.style.border = "1.5px solid #e2eae5")}
                />
              </div>

              {/* Password criteria indicator pills */}
              <div className="p-3 bg-[#f7faf8] border border-[#e2eae5] rounded-xl space-y-1.5 text-[11px]">
                <div className="text-[#3b4e43] font-semibold mb-1">Password Requirements:</div>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <span className={passwordCriteria.length ? "text-emerald-700 font-medium" : "text-[#768a7c]"}>
                    {passwordCriteria.length ? "✓" : "○"} 8+ characters
                  </span>
                  <span className={passwordCriteria.upper ? "text-emerald-700 font-medium" : "text-[#768a7c]"}>
                    {passwordCriteria.upper ? "✓" : "○"} 1 uppercase
                  </span>
                  <span className={passwordCriteria.lower ? "text-emerald-700 font-medium" : "text-[#768a7c]"}>
                    {passwordCriteria.lower ? "✓" : "○"} 1 lowercase
                  </span>
                  <span className={passwordCriteria.number ? "text-emerald-700 font-medium" : "text-[#768a7c]"}>
                    {passwordCriteria.number ? "✓" : "○"} 1 number
                  </span>
                  <span className={passwordCriteria.special ? "text-emerald-700 font-medium" : "text-[#768a7c]"}>
                    {passwordCriteria.special ? "✓" : "○"} 1 special char
                  </span>
                  <span className={passwordCriteria.match ? "text-emerald-700 font-medium" : "text-[#768a7c]"}>
                    {passwordCriteria.match ? "✓" : "○"} Passwords match
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isPasswordValid}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-xl hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #1d553a 0%, #173324 100%)",
                  boxShadow: "0 8px 24px rgba(23,51,36,0.25)",
                }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving New Password...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm &amp; Reset Password</span>
                    <span className="text-lg leading-none">✓</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <Link
                  href="/login"
                  onClick={handleBackToLogin}
                  className="text-xs font-semibold text-[#526659] hover:text-[#173324] cursor-pointer"
                >
                  Return to Sign In
                </Link>
              </div>
            </form>
          </>
        )}

        {/* ============================================================ */}
        {/* STEP 4: COMPLETED (Success Screen) */}
        {/* ============================================================ */}
        {step === "completed" && (
          <div className="text-center py-6 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#dcfce7] text-[#15803d] flex items-center justify-center text-3xl mx-auto shadow-sm">
              ✓
            </div>

            <div>
              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="text-[#173324] text-3xl sm:text-4xl font-normal tracking-tight mb-2"
              >
                Password Reset Successfully!
              </h2>
              <p className="text-[#55695d] text-sm leading-relaxed max-w-sm mx-auto">
                Your password has been updated. A security confirmation has been dispatched to your email. Redirecting you to sign in...
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/login"
                onClick={handleBackToLogin}
                className="inline-block w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white transition-all shadow-md"
                style={{
                  background: "linear-gradient(135deg, #1d553a 0%, #173324 100%)",
                }}
              >
                Sign In Now →
              </Link>
            </div>
          </div>
        )}

        {/* Trust Badges Footer */}
        <div className="pt-4 border-t border-[#e6eee8] flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-[#485d50]">
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#1b7a43] text-white flex items-center justify-center text-[8px] font-bold">
              ✓
            </span>
            Encrypted Authentication
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#1b7a43] text-white flex items-center justify-center text-[8px] font-bold">
              ✓
            </span>
            Argon2id Hash Protected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#1b7a43] text-white flex items-center justify-center text-[8px] font-bold">
              ✓
            </span>
            Automated Audit Alerts
          </span>
        </div>
      </div>
    </div>
  );
}

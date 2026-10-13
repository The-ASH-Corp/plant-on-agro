"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";

export type AuthMode = "login" | "register" | "forgot-password";

interface AuthFormProps {
  mode: AuthMode;
  onToggleMode: (newMode: AuthMode) => void;
  onSubmit?: (data: {
    mode: AuthMode;
    name?: string;
    email: string;
    password: string;
  }) => void;
}

export function AuthForm({ mode, onToggleMode, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isSuccessState, setIsSuccessState] = useState(false);
  const [registeredData, setRegisteredData] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  // Zustand State Management Store
  const {
    register: registerUser,
    login: loginUser,
    isLoading,
    error: apiError,
    fieldErrors,
    successMessage,
    clearError,
    clearSuccess,
  } = useAuthStore();

  // Clear password & error states whenever switching between login and register
  useEffect(() => {
    setPassword("");
    setSubmitted(false);
    setShowPassword(false);
    setIsSuccessState(false);
    clearError();
    clearSuccess();
  }, [mode, clearError, clearSuccess]);

  const handleTabSwitch = (newMode: AuthMode) => {
    if (newMode !== mode) {
      setPassword("");
      setSubmitted(false);
      setShowPassword(false);
      setIsSuccessState(false);
      clearError();
      clearSuccess();
      onToggleMode(newMode);
    }
  };

  // 5 Password Criteria Checks
  const criteriaList = [
    {
      id: "capital",
      label: "A capital letter (A-Z)",
      shortLabel: "Capital letter",
      met: /[A-Z]/.test(password),
    },
    {
      id: "small",
      label: "A small letter (a-z)",
      shortLabel: "Small letter",
      met: /[a-z]/.test(password),
    },
    {
      id: "special",
      label: "A special symbol (!@#$...)",
      shortLabel: "Special symbol",
      met: /[^A-Za-z0-9]/.test(password),
    },
    {
      id: "number",
      label: "A number (0-9)",
      shortLabel: "Number",
      met: /[0-9]/.test(password),
    },
    {
      id: "length",
      label: "Length of 8 letters",
      shortLabel: "8+ letters",
      met: password.length >= 8,
    },
  ];

  const metCount = criteriaList.filter((c) => c.met).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (mode === "register") {
      if (metCount < 5) return;
      if (!agreedToTerms) return;

      const result = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        role: "buyer",
      });

      if (result.success && result.data) {
        setIsSuccessState(true);
        setRegisteredData({
          name: result.data.name,
          email: result.data.email,
          role: result.data.role,
        });

        setTimeout(() => {
          if (onSubmit) {
            onSubmit({
              mode,
              name,
              email,
              password,
            });
          }
        }, 2500);
      }
    } else {
      const result = await loginUser({
        email: email.trim(),
        password,
      });

      if (result.success && onSubmit) {
        onSubmit({
          mode,
          email,
          password,
        });
      }
    }
  };

  if (isSuccessState && registeredData) {
    return (
      <div className="w-full md:w-7/12 lg:w-1/2 h-full md:h-screen flex flex-col px-6 sm:px-10 py-6 sm:py-8 md:py-10 overflow-y-auto overflow-x-hidden bg-white relative justify-center">
        <div className="max-w-[430px] w-full mx-auto relative z-10 flex flex-col items-center text-center gap-5 my-auto animate-fadeIn">
          {/* Animated Success Badge */}
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl shadow-md border-2 border-emerald-300">
            🌱
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1b7a43] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Registration Complete
            </span>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-[#173324] text-3xl font-semibold tracking-tight mt-3 mb-1.5"
            >
              Welcome, {registeredData.name}!
            </h2>
            <p className="text-[#55695d] text-sm">
              Your account has been securely encrypted with Argon2id and saved.
            </p>
          </div>

          <div className="w-full p-4 rounded-2xl bg-[#f4f7f5] border border-[#e2eae5] text-left text-xs space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[#7a8a80]">Full Name:</span>
              <span className="font-semibold text-[#173324]">{registeredData.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#7a8a80]">Email:</span>
              <span className="font-semibold text-[#173324]">{registeredData.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#7a8a80]">Account Role:</span>
              <span className="font-semibold text-[#1b7a43] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                {registeredData.role === "admin" ? "🛡️ Admin" : "🌳 Buyer (Tree Planter)"}
              </span>
            </div>
          </div>

          <div className="w-full">
            <button
              id="auth-success-continue-btn"
              type="button"
              onClick={() => {
                if (onSubmit) {
                  onSubmit({ mode: "register", name, email, password });
                }
              }}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-xl hover:scale-[1.01]"
              style={{
                background: "linear-gradient(135deg, #1d553a 0%, #173324 100%)",
                boxShadow: "0 8px 24px rgba(23,51,36,0.25)",
              }}
            >
              <span>Continue to Platform</span>
              <span className="text-lg leading-none">→</span>
            </button>
            <p className="text-[11px] text-[#7a8a80] mt-2">
              Redirecting automatically in a moment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-7/12 lg:w-1/2 h-full md:h-screen flex flex-col px-6 sm:px-10 py-6 sm:py-8 md:py-10 overflow-y-auto overflow-x-hidden bg-white relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#d1fae5]/35 blur-3xl -mr-20 -mt-20" />
        <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full bg-[#ecfdf5]/40 blur-3xl -ml-20" />
      </div>

      <div className="max-w-[430px] w-full mx-auto relative z-10 flex flex-col gap-4 sm:gap-5 my-auto">
      

        {/* Heading & Subtitle */}
        <div>
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-[#173324] text-4xl font-normal tracking-tight mb-2"
          >
            {mode === "register" ? "Join the Movement" : "Welcome Back"}
          </h2>
          <p className="text-[#55695d] text-sm leading-relaxed">
            {mode === "register"
              ? "Create an account to plant your first tree and track its lifelong growth via satellite and drone telemetry."
              : "Sign in to track your trees, view your impact, and access certificates."}
          </p>
        </div>

        {/* API Error Alert Banner */}
        {apiError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
            <svg className="w-5 h-5 shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <span className="font-semibold block mb-0.5">Registration Error</span>
              <p className="text-red-600 leading-snug">{apiError}</p>
            </div>
            <button
              type="button"
              onClick={clearError}
              className="text-red-400 hover:text-red-600 font-bold text-sm leading-none"
            >
              ✕
            </button>
          </div>
        )}

        {/* API Success Alert Banner */}
        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5">
            <svg className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <span className="font-semibold block mb-0.5">Success!</span>
              <p className="text-emerald-700 leading-snug">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Segmented Tab Switcher */}
        <div className="p-1 rounded-2xl bg-[#eef3f0] flex items-center border border-[#e1e9e4]">
          <button
            id="auth-tab-register"
            type="button"
            onClick={() => handleTabSwitch("register")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              mode === "register"
                ? "bg-white text-[#173324] shadow-sm"
                : "text-[#67776d] hover:text-[#173324]"
            }`}
          >
            <svg
              className={`w-4 h-4 ${
                mode === "register" ? "text-[#1b7a43]" : "text-[#7b8c82]"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>Create Account</span>
          </button>
          <button
            id="auth-tab-login"
            type="button"
            onClick={() => handleTabSwitch("login")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              mode === "login"
                ? "bg-white text-[#173324] shadow-sm"
                : "text-[#67776d] hover:text-[#173324]"
            }`}
          >
            <span>Sign In</span>
          </button>
        </div>

        {/* Social Buttons: Google & Apple */}
        <div className="grid grid-cols-2 gap-3">
          <button
            id="auth-social-google"
            type="button"
            onClick={() => alert("Google OAuth login initialized...")}
            className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-[#e1e9e4] bg-white hover:bg-[#f9faf9] transition-all text-xs sm:text-sm font-semibold text-[#2d3a33] shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            id="auth-social-apple"
            type="button"
            onClick={() => alert("Apple ID authentication initialized...")}
            className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-[#e1e9e4] bg-white hover:bg-[#f9faf9] transition-all text-xs sm:text-sm font-semibold text-[#2d3a33] shadow-xs cursor-pointer"
          >
            <svg
              className="w-4 h-4 shrink-0 fill-current text-black"
              viewBox="0 0 24 24"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.09 1.73-.95 2.76.99.08 2.05-.51 2.68-1.26z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* OR WITH EMAIL Divider */}
        <div className="relative flex items-center justify-center my-1">
          <div className="w-full border-t border-[#e2eae5]"></div>
          <span className="absolute bg-white px-3 text-[10px] font-bold tracking-widest uppercase text-[#7a8a80]">
            OR WITH EMAIL
          </span>
        </div>

        {/* Form Body */}
        <form id="auth-form" onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name (for register mode) */}
          {mode === "register" && (
            <div>
              <label className="text-[11px] font-bold text-[#3d4f45] uppercase tracking-wider mb-1.5 block">
                FULL NAME
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <input
                  id="auth-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Priya Sharma"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    border: fieldErrors.name ? "1.5px solid #ef4444" : "1.5px solid #e2eae5",
                    color: "#173324",
                    background: "#fcfaf7",
                  }}
                  onFocus={(e) => (e.target.style.border = "1.5px solid #2d6a4f")}
                  onBlur={(e) => (e.target.style.border = fieldErrors.name ? "1.5px solid #ef4444" : "1.5px solid #e2eae5")}
                />
              </div>
              {fieldErrors.name && (
                <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.name}</p>
              )}
            </div>
          )}

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
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  border: fieldErrors.email ? "1.5px solid #ef4444" : "1.5px solid #e2eae5",
                  color: "#173324",
                  background: "#fcfaf7",
                }}
                onFocus={(e) => (e.target.style.border = "1.5px solid #2d6a4f")}
                onBlur={(e) => (e.target.style.border = fieldErrors.email ? "1.5px solid #ef4444" : "1.5px solid #e2eae5")}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-[#3d4f45] uppercase tracking-wider block">
                PASSWORD
              </label>
              {mode === "register" ? (
                <span
                  className={`text-xs font-semibold flex items-center gap-1 transition-colors duration-200 ${
                    metCount === 5
                      ? "text-[#10b981]"
                      : metCount > 0
                      ? "text-[#1b7a43]"
                      : "text-[#7a8a80]"
                  }`}
                >
                  {metCount === 5
                    ? "✓ All 5 criteria met"
                    : password.length > 0
                    ? `${metCount}/5 criteria met`
                    : "5 criteria required"}
                </span>
              ) : (
                <Link
                  href="/forgot-password"
                  onClick={(e) => {
                    if (onToggleMode) {
                      e.preventDefault();
                      onToggleMode("forgot-password");
                    }
                  }}
                  className="text-xs font-semibold text-[#1b7a43] hover:underline cursor-pointer"
                >
                  Forgot password?
                </Link>
              )}
            </div>

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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              <input
                id="auth-password-input"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "register" ? "Create a password" : "Enter your password"}
                className={`w-full pl-11 pr-11 py-3.5 rounded-xl text-sm outline-none transition-all ${
                  password ? "tracking-wider font-mono" : ""
                }`}
                style={{
                  border: fieldErrors.password ? "1.5px solid #ef4444" : "1.5px solid #e2eae5",
                  color: "#173324",
                  background: "#fcfaf7",
                }}
                onFocus={(e) => (e.target.style.border = "1.5px solid #2d6a4f")}
                onBlur={(e) => (e.target.style.border = fieldErrors.password ? "1.5px solid #ef4444" : "1.5px solid #e2eae5")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-[#7b8c82] hover:text-[#173324] cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                    />
                  </svg>
                ) : (
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.password}</p>
            )}

            {/* 5-Criteria Green Indicator Bars & Validation (Only in Register Mode) */}
            {mode === "register" && (
              <>
                <div className="grid grid-cols-5 gap-1.5 mt-2">
                  {criteriaList.map((c, idx) => (
                    <div
                      key={c.id}
                      title={`Criteria ${idx + 1}: ${c.label} (${c.met && password.length > 0 ? "Achieved" : "Not met"})`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        password.length > 0 && c.met
                          ? "bg-[#10b981] shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                          : "bg-[#e2eae5]"
                      }`}
                    />
                  ))}
                </div>

                {/* Real-time 5 Criteria Feedback while typing */}
                {password.length > 0 && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-[#f7faf8] border border-[#e2eae5] text-[11px] transition-all duration-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-[#3d4f45]">
                        5 Password Criteria:
                      </span>
                      <span
                        className={`font-semibold ${
                          metCount === 5 ? "text-[#10b981]" : "text-[#7a8a80]"
                        }`}
                      >
                        {metCount}/5 achieved
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
                      {criteriaList.map((c, idx) => (
                        <div
                          key={c.id}
                          className={`flex items-center gap-1.5 transition-colors duration-200 ${
                            c.met ? "text-[#10b981] font-medium" : "text-[#7a8a80]"
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 transition-all duration-200 ${
                              c.met
                                ? "bg-[#10b981] text-white"
                                : "bg-[#e2eae5] text-[#7a8a80]"
                            }`}
                          >
                            {c.met ? "✓" : (idx + 1).toString()}
                          </span>
                          <span>{c.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {submitted && metCount < 5 && (
                  <p className="text-xs text-red-600 mt-1.5 font-medium">
                    Please fulfill all 5 password criteria before proceeding.
                  </p>
                )}
              </>
            )}
          </div>

          {/* Terms & Conditions Agreement (Register Mode) */}
          {mode === "register" && (
            <div className="pt-1">
              <div className="flex items-start gap-2.5">
                <input
                  id="auth-terms-checkbox"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#1b7a43] focus:ring-[#1b7a43] border-[#ccd8d0] cursor-pointer"
                />
                <label
                  htmlFor="auth-terms-checkbox"
                  className="text-xs text-[#55695d] cursor-pointer leading-snug"
                >
                  I agree to PlantOnAgro's{" "}
                  <span className="text-[#1b7a43] font-semibold underline">Terms of Service</span> and{" "}
                  <span className="text-[#1b7a43] font-semibold underline">Privacy Policy</span>.
                </label>
              </div>
              {submitted && !agreedToTerms && (
                <p className="text-xs text-red-600 mt-1 font-medium">
                  Please accept the terms to create your account.
                </p>
              )}
            </div>
          )}

          {/* Main Action Button */}
          <button
            id="auth-submit-btn"
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-xl hover:scale-[1.01] ${
              isLoading ? "opacity-80 cursor-not-allowed" : ""
            }`}
            style={{
              background: "linear-gradient(135deg, #1d553a 0%, #173324 100%)",
              boxShadow: "0 8px 24px rgba(23,51,36,0.25)",
            }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Processing...</span>
              </span>
            ) : (
              <>
                <span>
                  {mode === "register"
                    ? "Create Account & Plant Tree"
                    : "Sign In to Dashboard"}
                </span>
                <span className="text-lg leading-none">→</span>
              </>
            )}
          </button>
        </form>

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

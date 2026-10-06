"use client";

import { useState } from "react";

export type AuthMode = "login" | "register";

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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [usePhone, setUsePhone] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Dynamic password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password) && password.length >= 8) score += 1;
    return Math.min(score, 4);
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSubmit) {
      onSubmit({
        mode,
        name: mode === "register" ? name : undefined,
        email: usePhone ? phoneNumber : email,
        password,
      });
    }
  };

  return (
    <div className="w-full md:w-7/12 lg:w-1/2 min-h-screen flex flex-col justify-center px-6 sm:px-10 py-10 overflow-y-auto bg-white relative">
      {/* Subtle ambient mint glows matching reference design */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#d1fae5]/35 blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full bg-[#ecfdf5]/40 blur-3xl pointer-events-none -ml-20" />

      <div className="max-w-[430px] w-full mx-auto relative z-10 flex flex-col gap-5">
      

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

        {/* Segmented Tab Switcher */}
        <div className="p-1 rounded-2xl bg-[#eef3f0] flex items-center border border-[#e1e9e4]">
          <button
            type="button"
            onClick={() => onToggleMode("register")}
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
            type="button"
            onClick={() => onToggleMode("login")}
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
        <form onSubmit={handleSubmit} className="space-y-4">
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
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Priya Sharma"
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
          )}

          {/* Email / Phone Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-[#3d4f45] uppercase tracking-wider block">
                {usePhone ? "PHONE NUMBER" : "EMAIL ADDRESS"}
              </label>
              <button
                type="button"
                onClick={() => setUsePhone(!usePhone)}
                className="text-xs font-semibold text-[#1b7a43] hover:underline cursor-pointer"
              >
                {usePhone ? "Use Email instead" : "Use Phone OTP instead"}
              </button>
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#7b8c82]">
                {usePhone ? (
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </span>
              <input
                type={usePhone ? "tel" : "email"}
                required
                value={usePhone ? phoneNumber : email}
                onChange={(e) =>
                  usePhone
                    ? setPhoneNumber(e.target.value)
                    : setEmail(e.target.value)
                }
                placeholder={usePhone ? "+91 98765 43210" : "your@email.com"}
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

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-[#3d4f45] uppercase tracking-wider block">
                PASSWORD
              </label>
              {mode === "register" ? (
                <span className="text-xs font-semibold text-[#10b981] flex items-center gap-1">
                  ✓ Strong password
                </span>
              ) : (
                <button
                  type="button"
                  className="text-xs font-semibold text-[#1b7a43] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
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
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-11 py-3.5 rounded-xl text-sm outline-none transition-all tracking-wider font-mono"
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
                className="absolute right-4 text-[#7b8c82] hover:text-[#173324] cursor-pointer"
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

            {/* Password Strength Meter (4 green segments matching image) */}
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  strength >= 1 || !password ? "bg-[#10b981]" : "bg-[#d1fae5]"
                }`}
              />
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  strength >= 2 || !password ? "bg-[#10b981]" : "bg-[#d1fae5]"
                }`}
              />
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  strength >= 3 || !password ? "bg-[#10b981]" : "bg-[#d1fae5]"
                }`}
              />
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  strength >= 4 || !password ? "bg-[#10b981]" : "bg-[#d1fae5]"
                }`}
              />
            </div>
          </div>
          {/* Main Action Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-xl hover:scale-[1.01]"
            style={{
              background: "linear-gradient(135deg, #1d553a 0%, #173324 100%)",
              boxShadow: "0 8px 24px rgba(23,51,36,0.25)",
            }}
          >
            <span>
              {mode === "register"
                ? "Create Account & Plant Tree"
                : "Sign In to Dashboard"}
            </span>
            <span className="text-lg leading-none">→</span>
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tree } from "@/types";
import { useAuthStore } from "@/store/auth.store";
import { useHydratedStore } from "@/store/hooks/use-hydrated-store";
import { authService } from "@/services/auth/auth.service";

interface Step7ConfirmationProps {
  selectedTree: Tree | null;
  location: string | null;
  orderId: string;
  buyerEmail?: string;
  buyerName?: string;
  onClose: () => void;
}

type Step7ViewMode = "summary" | "create-account" | "login";

export function Step7Confirmation({
  selectedTree,
  location,
  orderId,
  buyerEmail = "",
  buyerName = "",
  onClose,
}: Step7ConfirmationProps) {
  const router = useRouter();

  // Auth store state
  const user = useHydratedStore(useAuthStore, (s) => s.user);
  const isAuthenticated = useHydratedStore(useAuthStore, (s) => s.isAuthenticated);
  const registerUser = useAuthStore((s) => s.register);
  const loginUser = useAuthStore((s) => s.login);

  // View state
  const [viewMode, setViewMode] = useState<Step7ViewMode>("summary");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  // Account creation form state
  const [fullName, setFullName] = useState(buyerName || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time password criteria
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isPasswordValid =
    hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

  // Handle clicking "View in Buyer Dashboard" button
  const handleViewDashboardClick = async () => {
    // 1. If user is already logged in, redirect directly into the Dashboard
    if (isAuthenticated && user) {
      onClose();
      router.push("/buyer/dashboard");
      return;
    }

    // 2. If user is not logged in, check if the email exists in the users database collection
    const effectiveEmail = (buyerEmail || "").trim().toLowerCase();
    if (!effectiveEmail) {
      // Fallback if email is somehow missing
      onClose();
      router.push("/buyer/dashboard");
      return;
    }

    try {
      setIsCheckingEmail(true);
      setFormError(null);
      const res = await authService.checkEmail(effectiveEmail);
      const exists = Boolean(res.data?.exists);

      if (!exists) {
        // Buyer's email is not in the db of user collection -> Show option to create account with that email
        setViewMode("create-account");
      } else {
        // User already has an account with this email -> Show quick login option
        setViewMode("login");
      }
    } catch (err: any) {
      console.warn("Could not check email status, proceeding to create-account view:", err);
      // Default to create-account so user can register
      setViewMode("create-account");
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Submit Account Creation
  const handleCreateAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setFormError("Please enter your full name (at least 2 characters).");
      return;
    }

    if (!isPasswordValid) {
      setFormError(
        "Please meet all password requirements: 8+ characters, uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (!passwordsMatch) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await registerUser({
        name: fullName.trim(),
        email: buyerEmail.trim().toLowerCase(),
        password: password,
        role: "buyer",
      });

      if (res.success) {
        onClose();
        router.push("/buyer/dashboard");
      } else {
        setFormError(res.error || "Failed to create account. Please try again.");
      }
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred during account creation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!password) {
      setFormError("Please enter your account password.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await loginUser({
        email: buyerEmail.trim().toLowerCase(),
        password: password,
      });

      if (res.success) {
        onClose();
        router.push("/buyer/dashboard");
      } else {
        setFormError(res.error || "Invalid password for this account.");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to log in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // RENDER: Create Account Mode (Email NOT in DB & Not Logged In)
  // -------------------------------------------------------------
  if (viewMode === "create-account") {
    return (
      <div className="py-2">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 text-2xl mb-3 shadow-inner">
            🌿
          </div>
          <h3
            style={{ fontFamily: "var(--font-display)" }}
            className="text-[#173324] text-2xl font-bold mb-1"
          >
            Create Your Account
          </h3>
          <p className="text-xs sm:text-sm text-[#4a6557] max-w-md mx-auto">
            Set a password to link your newly adopted tree and access your live dashboard,
            deed certificate, and satellite telemetry from any device.
          </p>
        </div>

        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <span>⚠️</span>
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleCreateAccountSubmit} className="space-y-4 text-left">
          {/* Full Name */}
          <div>
            <label
              htmlFor="acc-name"
              className="text-xs font-semibold text-[#4a6557] uppercase tracking-wider mb-1 block"
            >
              Full Name
            </label>
            <input
              id="acc-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              required
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all border border-[#d4ede1] focus:border-[#52b788] text-[#173324] bg-white"
            />
          </div>

          {/* Email (Locked to buyer email) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="acc-email"
                className="text-xs font-semibold text-[#4a6557] uppercase tracking-wider block"
              >
                Email Address
              </label>
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                🔒 Used for Tree Adoption
              </span>
            </div>
            <input
              id="acc-email"
              type="email"
              value={buyerEmail}
              disabled
              readOnly
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#e2ece5] bg-[#f7faf8] text-[#3d5a49] font-mono cursor-not-allowed select-none"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="acc-password"
                className="text-xs font-semibold text-[#4a6557] uppercase tracking-wider block"
              >
                Create Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-[11px] text-[#2d6a4f] hover:underline font-medium"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="acc-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all border border-[#d4ede1] focus:border-[#52b788] text-[#173324] bg-white"
            />

            {/* Password Validation checklist */}
            <div className="mt-2 p-2.5 rounded-xl bg-[#f8fbf9] border border-[#e4ede7] grid grid-cols-2 gap-1 text-[11px]">
              <span
                className={
                  hasMinLength
                    ? "text-emerald-700 font-medium"
                    : "text-slate-400"
                }
              >
                {hasMinLength ? "✓" : "○"} 8+ characters
              </span>
              <span
                className={
                  hasUpper && hasLower
                    ? "text-emerald-700 font-medium"
                    : "text-slate-400"
                }
              >
                {hasUpper && hasLower ? "✓" : "○"} Upper & lowercase
              </span>
              <span
                className={
                  hasNumber ? "text-emerald-700 font-medium" : "text-slate-400"
                }
              >
                {hasNumber ? "✓" : "○"} At least 1 number
              </span>
              <span
                className={
                  hasSpecial ? "text-emerald-700 font-medium" : "text-slate-400"
                }
              >
                {hasSpecial ? "✓" : "○"} 1 special symbol
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="acc-confirm-password"
              className="text-xs font-semibold text-[#4a6557] uppercase tracking-wider mb-1 block"
            >
              Confirm Password
            </label>
            <input
              id="acc-confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              required
              className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all border text-[#173324] bg-white ${
                confirmPassword.length > 0
                  ? passwordsMatch
                    ? "border-emerald-500 focus:border-emerald-600"
                    : "border-red-400 focus:border-red-500"
                  : "border-[#d4ede1] focus:border-[#52b788]"
              }`}
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-[11px] text-red-500 mt-1">Passwords do not match.</p>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="submit"
              id="btn-submit-create-account"
              disabled={isSubmitting || !isPasswordValid || !passwordsMatch}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg,#52b788,#2d6a4f)" }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account & Loading Dashboard...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Create Account & Open Dashboard</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setViewMode("summary")}
                className="text-xs text-[#4a6557] hover:text-[#173324] font-medium transition-all"
              >
                ← Back to Order Summary
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/buyer/dashboard");
                }}
                className="text-xs text-slate-500 hover:text-slate-700 underline transition-all"
              >
                Continue as Guest for now
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Login Mode (Email already registered in DB)
  // -------------------------------------------------------------
  if (viewMode === "login") {
    return (
      <div className="py-2">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 text-2xl mb-3 shadow-inner">
            🔑
          </div>
          <h3
            style={{ fontFamily: "var(--font-display)" }}
            className="text-[#173324] text-2xl font-bold mb-1"
          >
            Welcome Back!
          </h3>
          <p className="text-xs sm:text-sm text-[#4a6557] max-w-md mx-auto">
            An account already exists for <strong>{buyerEmail}</strong>. Enter your password to
            access your dashboard.
          </p>
        </div>

        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <span>⚠️</span>
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
          {/* Email (Locked) */}
          <div>
            <label
              htmlFor="login-email"
              className="text-xs font-semibold text-[#4a6557] uppercase tracking-wider mb-1 block"
            >
              Account Email
            </label>
            <input
              id="login-email"
              type="email"
              value={buyerEmail}
              disabled
              readOnly
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#e2ece5] bg-[#f7faf8] text-[#3d5a49] font-mono cursor-not-allowed select-none"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="login-password"
                className="text-xs font-semibold text-[#4a6557] uppercase tracking-wider block"
              >
                Account Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-[11px] text-[#2d6a4f] hover:underline font-medium"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your account password"
              required
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all border border-[#d4ede1] focus:border-[#52b788] text-[#173324] bg-white"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="submit"
              id="btn-submit-quick-login"
              disabled={isSubmitting || !password}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg,#52b788,#2d6a4f)" }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging In & Opening Dashboard...</span>
                </>
              ) : (
                <>
                  <span>🔓</span>
                  <span>Sign In & Open Dashboard</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setViewMode("summary")}
                className="text-xs text-[#4a6557] hover:text-[#173324] font-medium transition-all"
              >
                ← Back to Order Summary
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/buyer/dashboard");
                }}
                className="text-xs text-slate-500 hover:text-slate-700 underline transition-all"
              >
                Continue as Guest for now
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Default Summary Mode (Payment Confirmation Screen)
  // -------------------------------------------------------------
  return (
    <div className="text-center py-4">
      <div className="text-6xl mb-6">🌱</div>
      <h3
        style={{ fontFamily: "var(--font-display)" }}
        className="text-[#173324] text-3xl mb-3"
      >
        Your Tree Journey Has Begun!
      </h3>
      <p className="text-[#4a6557] mb-8">
        Our plantation team will get to work. You'll receive updates, photos, and
        your certificate soon.
      </p>

      <div
        className="p-5 rounded-2xl mb-6 text-left space-y-3"
        style={{ background: "#f0faf4", border: "1px solid #d4ede1" }}
      >
        <div className="flex justify-between text-sm">
          <span className="text-[#4a6557]">Tree</span>
          <span className="font-semibold text-[#173324]">{selectedTree?.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#4a6557]">Location</span>
          <span className="font-semibold text-[#173324] text-right max-w-[60%]">
            {location}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#4a6557]">Planting Date</span>
          <span className="font-semibold text-[#173324]">Within 14 days</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#4a6557]">Order ID</span>
          <span className="font-mono font-semibold text-[#2d6a4f]">{orderId}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#4a6557]">Adopter Email</span>
          <span className="font-medium text-[#173324]">{buyerEmail || "adopter@example.com"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#4a6557]">Billing Plan</span>
          <span className="font-semibold text-emerald-700">
            Lifetime Single-Time (No Expiration)
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          id="btn-view-buyer-dashboard"
          onClick={handleViewDashboardClick}
          disabled={isCheckingEmail}
          className="flex-1 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md hover:brightness-105 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg,#52b788,#2d6a4f)" }}
        >
          {isCheckingEmail ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying Account Status...</span>
            </>
          ) : (
            <>
              <span>🌳</span>
              <span>View in Buyer Dashboard</span>
            </>
          )}
        </button>

        <button
          type="button"
          id="btn-verify-admin-ledger"
          onClick={() => {
            onClose();
            router.push("/admin");
          }}
          className="flex-1 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-[#173324] border border-[#d4ede1] bg-[#f0faf4] hover:bg-[#e4f5ec] flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <span>📊</span>
          <span>Verify in Admin Ledger</span>
        </button>

        <button
          type="button"
          id="btn-close-wizard"
          onClick={onClose}
          className="py-3 px-5 rounded-xl font-semibold text-xs sm:text-sm cursor-pointer hover:bg-[#e0ece5] transition-all"
          style={{ background: "#eaf2ec", color: "#2d6a4f" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}


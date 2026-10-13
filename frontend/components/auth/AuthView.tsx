"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthVisualSide } from "./AuthVisualSide";
import { AuthForm, AuthMode } from "./AuthForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export type AuthViewMode = AuthMode | "forgot-password";

export interface AuthViewProps {
  initialMode?: "login" | "register" | "signin" | "signup" | "forgot-password";
  onClose?: () => void;
  isModal?: boolean;
  onSuccess?: (data: {
    mode: AuthViewMode;
    name?: string;
    email: string;
  }) => void;
}

export function AuthView({
  initialMode = "login",
  onClose,
  isModal = false,
  onSuccess,
}: AuthViewProps) {
  const router = useRouter();
  // Normalize initialMode
  const getNormalizedMode = (): AuthViewMode => {
    if (initialMode === "register" || initialMode === "signup") return "register";
    if (initialMode === "forgot-password") return "forgot-password";
    return "login";
  };

  const [mode, setMode] = useState<AuthViewMode>(getNormalizedMode());

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      router.push("/");
    }
  };

  const handleToggleMode = (newMode: AuthViewMode) => {
    setMode(newMode);
    // If not in a modal, optionally update browser URL smoothly
    if (!isModal && typeof window !== "undefined") {
      let targetUrl = "/login";
      if (newMode === "register") targetUrl = "/register";
      else if (newMode === "forgot-password") targetUrl = "/forgot-password";
      window.history.replaceState(null, "", targetUrl);
    }
  };

  const handleSubmit = (data: {
    mode: AuthMode;
    name?: string;
    email: string;
    password: string;
  }) => {
    if (onSuccess) {
      onSuccess(data);
    }
    if (onClose) {
      onClose();
    } else {
      router.push("/");
    }
  };

  const containerClasses = isModal
    ? "fixed inset-0 z-50 flex flex-col md:flex-row bg-[#fff] overflow-hidden"
    : "relative w-full min-h-screen md:h-screen flex flex-col md:flex-row bg-[#fff] overflow-x-hidden md:overflow-hidden";

  return (
    <div className={containerClasses}>
      {/* Left Column - Imagery & Branding */}
      <AuthVisualSide onBack={handleBack} />

      {/* Right Column - Form Area */}
      {mode === "forgot-password" ? (
        <ForgotPasswordForm
          onToggleMode={handleToggleMode}
          onSubmitSuccess={(email) => {
            if (onSuccess) {
              onSuccess({ mode: "forgot-password", email });
            }
          }}
        />
      ) : (
        <AuthForm
          mode={mode}
          onToggleMode={handleToggleMode}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

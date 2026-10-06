"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthVisualSide } from "./AuthVisualSide";
import { AuthForm, AuthMode } from "./AuthForm";

export interface AuthViewProps {
  initialMode?: "login" | "register" | "signin" | "signup";
  onClose?: () => void;
  isModal?: boolean;
  onSuccess?: (data: {
    mode: AuthMode;
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
  // Normalize initialMode ("signin" -> "login", "signup" -> "register")
  const normalizedInitial: AuthMode =
    initialMode === "register" || initialMode === "signup"
      ? "register"
      : "login";

  const [mode, setMode] = useState<AuthMode>(normalizedInitial);

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      router.push("/");
    }
  };

  const handleToggleMode = (newMode: AuthMode) => {
    setMode(newMode);
    // If not in a modal, optionally update browser URL smoothly
    if (!isModal && typeof window !== "undefined") {
      const targetUrl = newMode === "register" ? "/register" : "/login";
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
    ? "fixed inset-0 z-50 flex flex-col md:flex-row bg-[#fff]"
    : "relative w-full min-h-screen flex flex-col md:flex-row bg-[#fff]";

  return (
    <div className={containerClasses}>
      {/* Left Column - Imagery & Branding */}
      <AuthVisualSide onBack={handleBack} />

      {/* Right Column - Form Area */}
      <AuthForm
        mode={mode}
        onToggleMode={handleToggleMode}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

"use client";

import { AuthView } from "./AuthView";

export interface AuthPageProps {
  initialMode?: "signin" | "signup" | "login" | "register";
  onClose?: () => void;
}

export function AuthPage({ initialMode = "signin", onClose }: AuthPageProps) {
  const mode =
    initialMode === "signup" || initialMode === "register"
      ? "register"
      : "login";
  return <AuthView initialMode={mode} onClose={onClose} />;
}

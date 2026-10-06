"use client";

import { AuthView } from "./AuthView";

export interface AuthModalProps {
  initialMode: "login" | "register";
  onClose: () => void;
}

export function AuthModal({ initialMode, onClose }: AuthModalProps) {
  return <AuthView initialMode={initialMode} onClose={onClose} isModal={true} />;
}

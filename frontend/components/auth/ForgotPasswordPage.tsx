"use client";

import { AuthView } from "./AuthView";

export function ForgotPasswordPage({ onClose }: { onClose?: () => void }) {
  return <AuthView initialMode="forgot-password" onClose={onClose} />;
}

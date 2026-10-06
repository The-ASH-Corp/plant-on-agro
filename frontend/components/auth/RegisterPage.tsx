"use client";

import { AuthView } from "./AuthView";

export function RegisterPage({ onClose }: { onClose?: () => void }) {
  return <AuthView initialMode="register" onClose={onClose} />;
}

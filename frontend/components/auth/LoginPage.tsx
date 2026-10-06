"use client";

import { AuthView } from "./AuthView";

export function LoginPage({ onClose }: { onClose?: () => void }) {
  return <AuthView initialMode="login" onClose={onClose} />;
}

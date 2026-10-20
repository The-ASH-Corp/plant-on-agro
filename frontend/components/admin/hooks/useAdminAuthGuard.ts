import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

/** Waits for auth store rehydration and redirects non-admins to /login. */
export function useAdminAuthGuard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const logout = useAuthStore((s) => s.logout);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!hasHydrated && useAuthStore.persist?.hasHydrated?.()) {
      useAuthStore.getState().setHasHydrated(true);
    }
  }, [hasHydrated]);

  useEffect(() => {
    if (!mounted) return;
    const storeHydrated = hasHydrated || (useAuthStore.persist?.hasHydrated?.() ?? false);
    if (!storeHydrated) return;

    // Only redirect if rehydration has finished and the user is verified not to be admin
    if (!isAuthenticated || user?.role !== "admin") {
      router.replace("/login");
    }
  }, [mounted, hasHydrated, isAuthenticated, user, router]);

  // Wait until client has mounted and store has rehydrated
  const isReady = mounted && (hasHydrated || (useAuthStore.persist?.hasHydrated?.() ?? false));
  const isAdmin = isAuthenticated && user?.role === "admin";

  return { user, logout, isReady, isAdmin };
}

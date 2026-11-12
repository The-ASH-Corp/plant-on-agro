import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth/auth.service";

export function useAdminAuthGuard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const logout = useAuthStore((s) => s.logout);
  const setUser = useAuthStore((s) => s.setUser);

  const [mounted, setMounted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerifiedAdmin, setIsVerifiedAdmin] = useState(false);

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

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    let isCancelled = false;

    // Securely verify role with backend server rather than trusting localStorage
    async function verifyAdminSession() {
      try {
        const res = await authService.getProfile();
        const profile = res.data;
        if (!profile || profile.role !== "admin") {
          console.warn("Unauthorized admin attempt or tampered role detected. Logging out.");
          logout();
          router.replace("/login");
          return;
        }

        if (!isCancelled) {
          // Sync server-verified user profile into store
          setUser(profile);
          setIsVerifiedAdmin(true);
          setIsVerifying(false);
        }
      } catch (err) {
        console.warn("Failed to verify admin credentials with backend:", err);
        logout();
        router.replace("/login");
      }
    }

    verifyAdminSession();

    return () => {
      isCancelled = true;
    };
  }, [mounted, hasHydrated, isAuthenticated, logout, setUser, router]);

  // Wait until client has mounted, store has rehydrated, and backend has verified admin role
  const isReady =
    mounted &&
    (hasHydrated || (useAuthStore.persist?.hasHydrated?.() ?? false)) &&
    !isVerifying &&
    isVerifiedAdmin;
  const isAdmin = isVerifiedAdmin;

  return { user, logout, isReady, isAdmin };
}

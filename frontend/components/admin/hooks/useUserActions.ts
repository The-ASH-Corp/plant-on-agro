import { useState } from "react";
import { User } from "@/types/auth";
import { userService } from "@/services/user/user.service";
import type { AdminData } from "./useAdminData";
import type { ShowToast } from "./useAdminToast";

interface Params {
  data: AdminData;
  showToast: ShowToast;
}

export function useUserActions({ data, showToast }: Params) {
  const { setUsers } = data;
  const [isRefreshingUsers, setIsRefreshingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleRefreshUsers = async () => {
    setIsRefreshingUsers(true);
    try {
      const res = await userService.listUsers(100, 0);
      if (res?.data) {
        const raw = res.data;
        const items = Array.isArray(raw) ? raw : (raw.items || []);
        setUsers(items);
        showToast("User directory refreshed successfully");
      }
    } catch {
      showToast("Failed to refresh user list");
    } finally {
      setIsRefreshingUsers(false);
    }
  };

  const handleToggleBlockUser = async (targetUser: User) => {
    const newIsActive = !targetUser.isActive;
    // Optimistic state update
    setUsers((prev) =>
      prev.map((u) => (u.id === targetUser.id ? { ...u, isActive: newIsActive } : u))
    );
    if (selectedUser?.id === targetUser.id) {
      setSelectedUser((prev) => (prev ? { ...prev, isActive: newIsActive } : null));
    }

    try {
      await userService.updateUser(targetUser.id, { isActive: newIsActive });
      showToast(
        `User "${targetUser.name}" has been ${newIsActive ? "unblocked (activated)" : "blocked (deactivated)"}.`
      );
    } catch {
      // Rollback on failure
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, isActive: targetUser.isActive } : u))
      );
      if (selectedUser?.id === targetUser.id) {
        setSelectedUser((prev) => (prev ? { ...prev, isActive: targetUser.isActive } : null));
      }
      showToast(`Failed to update status for ${targetUser.name}`);
    }
  };

  return {
    isRefreshingUsers,
    selectedUser,
    setSelectedUser,
    handleRefreshUsers,
    handleToggleBlockUser,
  };
}

export type UserActions = ReturnType<typeof useUserActions>;

"use client";

import { useMemo, useState } from "react";
import { Select } from "@/components/ui";
import { User } from "@/types/auth";
import { AdoptionOrder } from "../types";

interface UsersTabProps {
  users: User[];
  searchQuery: string;
  onToggleBlockUser: (user: User) => Promise<void>;
  onRefreshUsers?: () => Promise<void>;
  isRefreshing?: boolean;
  orders?: AdoptionOrder[];
  onViewUserDetails: (user: User) => void;
}

type UserStatusFilter = "all" | "active" | "blocked" | "with_trees";
type SortOption = "newest" | "oldest" | "name_asc" | "name_desc";

export function UsersTab({
  users,
  searchQuery,
  onToggleBlockUser,
  onRefreshUsers,
  isRefreshing = false,
  orders = [],
  onViewUserDetails,
}: UsersTabProps) {
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Filter out any admin accounts so admins are never shown in the customer/user directory
  const regularUsers = useMemo(() => {
    return users.filter((u) => u.role !== "admin");
  }, [users]);

  const getUserOrderStats = (email: string) => {
    const userOrders = orders.filter(
      (o) => o.adopterEmail?.toLowerCase() === email?.toLowerCase()
    );
    const treeCount = userOrders.reduce((sum, o) => sum + (o.quantity || 1), 0);
    return {
      orderCount: userOrders.length,
      treeCount,
    };
  };

  // Compute metrics strictly for regular users
  const totalCount = regularUsers.length;
  const activeCount = regularUsers.filter((u) => u.isActive).length;
  const blockedCount = regularUsers.filter((u) => !u.isActive).length;
  const withTreesCount = regularUsers.filter(
    (u) => getUserOrderStats(u.email).treeCount > 0
  ).length;

  // Filter and sort regular users
  const filteredUsers = useMemo(() => {
    return regularUsers
      .filter((u) => {
        // Status filter
        if (statusFilter === "active" && !u.isActive) return false;
        if (statusFilter === "blocked" && u.isActive) return false;
        if (statusFilter === "with_trees" && getUserOrderStats(u.email).treeCount === 0) return false;

        // Search query filter
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q) ||
          (u.isActive ? "active unblocked" : "blocked inactive").includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === "name_asc") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "name_desc") {
          return b.name.localeCompare(a.name);
        }
        return 0;
      });
  }, [regularUsers, statusFilter, searchQuery, sortBy, orders]);

  const handleToggle = async (user: User) => {
    setActionLoadingId(user.id);
    try {
      await onToggleBlockUser(user);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#e2eae5] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-xl font-bold text-[#173324]"
            >
              All Registered Users
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
              {totalCount} Total
            </span>
          </div>
          <p className="text-xs text-[#73877b] mt-1">
            Directory of registered buyer accounts with authorization status and block/unblock controls.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onRefreshUsers && (
            <button
              onClick={onRefreshUsers}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#e2eae5] text-[#173324] hover:bg-[#f4f7f5] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Refresh User List"
            >
              <span className={`text-sm ${isRefreshing ? "animate-spin" : ""}`}>🔄</span>
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
          )}

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 text-xs rounded-xl border border-[#e2eae5] bg-[#f9faf8] text-[#173324] outline-none font-medium cursor-pointer"
          >
            <option value="newest">Newest Registered</option>
            <option value="oldest">Oldest Registered</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
          </Select>
        </div>
      </div>

      {/* 2. Key Metrics Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white p-4 rounded-2xl border border-[#e2eae5] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#73877b]">
              Total Users
            </span>
            <span className="text-base">👥</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#173324]">{totalCount}</span>
            <span className="text-[11px] text-[#8a9990]">registered</span>
          </div>
        </div>

        {/* Active & Unblocked */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-white to-emerald-50/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Active / Unblocked
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">{activeCount}</span>
            <span className="text-[11px] text-emerald-600 font-medium">
              {totalCount > 0 ? `${Math.round((activeCount / totalCount) * 100)}%` : "0%"}
            </span>
          </div>
        </div>

        {/* Blocked Accounts */}
        <div className="bg-white p-4 rounded-2xl border border-rose-200/80 bg-gradient-to-br from-white to-rose-50/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
              Blocked Accounts
            </span>
            <span className="text-base">🚫</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-700">{blockedCount}</span>
            <span className="text-[11px] text-rose-600 font-medium">access suspended</span>
          </div>
        </div>

        {/* Active Adopters */}
        <div className="bg-white p-4 rounded-2xl border border-[#e2eae5] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#73877b]">
              Active Adopters
            </span>
            <span className="text-base">🌱</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1b7a43]">{withTreesCount}</span>
            <span className="text-[11px] text-[#8a9990]">with trees</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            statusFilter === "all"
              ? "bg-[#173324] text-white shadow-xs"
              : "bg-white text-[#526359] hover:bg-[#f4f7f5] border border-[#e2eae5]"
          }`}
        >
          All Users ({totalCount})
        </button>
        <button
          onClick={() => setStatusFilter("active")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            statusFilter === "active"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Active / Unblocked ({activeCount})
        </button>
        <button
          onClick={() => setStatusFilter("blocked")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            statusFilter === "blocked"
              ? "bg-rose-700 text-white shadow-xs"
              : "bg-white text-rose-800 hover:bg-rose-50 border border-rose-200"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          Blocked ({blockedCount})
        </button>
        <button
          onClick={() => setStatusFilter("with_trees")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            statusFilter === "with_trees"
              ? "bg-blue-700 text-white shadow-xs"
              : "bg-white text-blue-800 hover:bg-blue-50 border border-blue-200"
          }`}
        >
          With Adoptions ({withTreesCount})
        </button>
      </div>

      {/* 4. Users Table */}
      <div className="bg-white rounded-3xl border border-[#e2eae5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f9faf8] border-b border-[#e2eae5] text-[#73877b] uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Adoptions</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2eae5]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#73877b]">
                    <div className="max-w-xs mx-auto space-y-2">
                      <span className="text-3xl block">🔍</span>
                      <p className="text-sm font-semibold text-[#173324]">No users found</p>
                      <p className="text-xs text-[#8a9990]">
                        {searchQuery
                          ? `No matching records for "${searchQuery}". Try clearing search.`
                          : "No accounts match the selected filter."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const stats = getUserOrderStats(user.email);
                  const isBlocked = !user.isActive;
                  const isLoadingThis = actionLoadingId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-[#f4f7f5]/70 transition-colors group"
                    >
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs bg-gradient-to-tr from-[#1d4ed8] to-[#60a5fa]">
                            {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-[#173324] block truncate text-xs">
                              {user.name}
                            </span>
                            <span className="text-[11px] text-[#73877b] block truncate">
                              {user.email}
                            </span>
                            <span className="text-[9px] font-mono text-[#8a9990] block truncate">
                              ID: {user.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md inline-block bg-blue-50 text-blue-700 border border-blue-200">
                          Buyer
                        </span>
                      </td>

                      {/* Account Status Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1.5 ${
                            !isBlocked
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                              : "bg-rose-50 text-rose-800 border border-rose-300"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              !isBlocked ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                            }`}
                          />
                          {!isBlocked ? "Active (Unblocked)" : "Blocked (Inactive)"}
                        </span>
                      </td>

                      {/* Adoptions */}
                      <td className="py-3.5 px-4">
                        {stats.treeCount > 0 ? (
                          <div className="space-y-0.5">
                            <span className="font-bold text-[#173324] text-xs">
                              {stats.treeCount} {stats.treeCount === 1 ? "Tree" : "Trees"}
                            </span>
                            <span className="text-[10px] text-[#73877b] block">
                              {stats.orderCount} {stats.orderCount === 1 ? "order" : "orders"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#8a9990] italic">
                            No adoptions
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-[11px] text-[#73877b] whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onViewUserDetails(user)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#173324] bg-[#f4f7f5] hover:bg-[#e6ece8] border border-[#e2eae5] transition-colors cursor-pointer"
                            title="View all user details"
                          >
                            Details
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggle(user)}
                            disabled={isLoadingThis}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                              isBlocked
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                                : "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100"
                            } ${isLoadingThis ? "opacity-50 cursor-not-allowed" : ""}`}
                            title={isBlocked ? "Unblock this user" : "Block this user"}
                          >
                            {isLoadingThis ? "..." : isBlocked ? "Unblock" : "Block"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

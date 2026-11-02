"use client";

import { useState } from "react";
import { User } from "@/types/auth";
import { AdoptionOrder } from "../types";

interface UserDetailsModalProps {
  user: User | null;
  onClose: () => void;
  onToggleBlockUser?: (user: User) => Promise<void> | void;
  orders?: AdoptionOrder[];
}

export function UserDetailsModal({
  user,
  onClose,
  onToggleBlockUser,
  orders = [],
}: UserDetailsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!user) return null;

  const userOrders = orders.filter(
    (o) => o.adopterEmail?.toLowerCase() === user.email?.toLowerCase()
  );
  const totalTreesAdopted = userOrders.reduce((sum, o) => sum + (o.quantity || 1), 0);
  const totalSpent = userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleToggle = async () => {
    if (!onToggleBlockUser || isUpdating) return;
    setIsUpdating(true);
    try {
      await onToggleBlockUser(user);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[#e2eae5] relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#7a8a80] hover:text-[#173324] text-lg font-bold p-1 cursor-pointer rounded-lg hover:bg-black/5 transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Profile Header */}
        <div className="flex items-start gap-4 pb-5 border-b border-[#e2eae5]">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow-md shrink-0 ${
              user.role === "admin"
                ? "bg-gradient-to-tr from-[#1b7a43] to-[#52b788]"
                : "bg-gradient-to-tr from-[#1d4ed8] to-[#60a5fa]"
            }`}
          >
            {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-[#173324] truncate">
                {user.name}
              </h2>
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-800 border border-purple-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
              >
                {user.role === "admin" ? "Super Admin" : "Buyer"}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1.5 ${
                  user.isActive
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                    : "bg-rose-50 text-rose-800 border border-rose-300"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    user.isActive ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                  }`}
                />
                {user.isActive ? "Active (Unblocked)" : "Blocked (Inactive)"}
              </span>
            </div>
            <p className="text-xs text-[#73877b] mt-0.5 truncate">{user.email}</p>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="mt-5 space-y-4">
          <div className="bg-[#f9faf8] p-4 rounded-2xl border border-[#e2eae5] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#73877b]">
              Account Credentials & Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* User ID */}
              <div className="space-y-1">
                <span className="text-[#8a9990] block text-[11px]">User ID</span>
                <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-[#e2eae5]">
                  <span className="font-mono text-[#173324] truncate font-semibold">
                    {user.id}
                  </span>
                  <button
                    onClick={() => handleCopy(user.id, "id")}
                    className="text-[#1b7a43] hover:text-[#145a32] text-xs shrink-0 cursor-pointer"
                    title="Copy User ID"
                  >
                    {copiedField === "id" ? "✓" : "📋"}
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <span className="text-[#8a9990] block text-[11px]">Email Address</span>
                <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-[#e2eae5]">
                  <span className="text-[#173324] truncate font-semibold">
                    {user.email}
                  </span>
                  <button
                    onClick={() => handleCopy(user.email, "email")}
                    className="text-[#1b7a43] hover:text-[#145a32] text-xs shrink-0 cursor-pointer"
                    title="Copy Email"
                  >
                    {copiedField === "email" ? "✓" : "📋"}
                  </button>
                </div>
              </div>

              {/* Created At */}
              <div className="space-y-1">
                <span className="text-[#8a9990] block text-[11px]">Registered On</span>
                <div className="bg-white px-2.5 py-1.5 rounded-xl border border-[#e2eae5] text-[#173324] font-medium">
                  {formatDate(user.createdAt)}
                </div>
              </div>

              {/* Updated At */}
              <div className="space-y-1">
                <span className="text-[#8a9990] block text-[11px]">Last Updated</span>
                <div className="bg-white px-2.5 py-1.5 rounded-xl border border-[#e2eae5] text-[#173324] font-medium">
                  {formatDate(user.updatedAt || user.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Account Status & Access Control Section */}
          <div className="p-4 rounded-2xl border border-[#e2eae5] bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#173324]">
                  Access & Security Status
                </h3>
                <p className="text-[11px] text-[#73877b] mt-0.5">
                  {user.isActive
                    ? "User currently has full permission to log in, adopt trees, and access their buyer dashboard."
                    : "User account is suspended. They are blocked from logging in or placing adoptions."}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 bg-[#f9faf8] p-3 rounded-xl border border-[#e2eae5]">
              <div className="flex items-center gap-2">
                <span className="text-lg">{user.isActive ? "🛡️" : "🚫"}</span>
                <div>
                  <span className="text-xs font-bold text-[#173324] block">
                    {user.isActive ? "Account is Unblocked" : "Account is Blocked"}
                  </span>
                  <span className="text-[10px] text-[#8a9990]">
                    Status: {user.isActive ? "Active (Normal Access)" : "Deactivated / Restricted"}
                  </span>
                </div>
              </div>

              {onToggleBlockUser && (
                <button
                  type="button"
                  onClick={handleToggle}
                  disabled={isUpdating}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                    user.isActive
                      ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300"
                      : "bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-700"
                  } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isUpdating ? (
                    <span>Updating...</span>
                  ) : user.isActive ? (
                    <>
                      <span>🚫</span>
                      <span>Block User</span>
                    </>
                  ) : (
                    <>
                      <span>🔓</span>
                      <span>Unblock User</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Adoption Activity Statistics */}
          <div className="p-4 rounded-2xl border border-[#e2eae5] bg-white space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#73877b]">
              Adoption & Storefront Activity
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#f4f7f5] p-3 rounded-xl border border-emerald-100 text-center">
                <span className="text-[10px] text-[#73877b] block font-medium">Orders Placed</span>
                <span className="text-lg font-bold text-[#173324] mt-0.5 block">
                  {userOrders.length}
                </span>
              </div>
              <div className="bg-[#f4f7f5] p-3 rounded-xl border border-emerald-100 text-center">
                <span className="text-[10px] text-[#73877b] block font-medium">Trees Adopted</span>
                <span className="text-lg font-bold text-[#1b7a43] mt-0.5 block">
                  {totalTreesAdopted}
                </span>
              </div>
              <div className="bg-[#f4f7f5] p-3 rounded-xl border border-emerald-100 text-center">
                <span className="text-[10px] text-[#73877b] block font-medium">Total Spend</span>
                <span className="text-lg font-bold text-[#173324] mt-0.5 block font-mono">
                  ₹{totalSpent.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Recent Orders List if any */}
            {userOrders.length > 0 && (
              <div className="mt-3 space-y-2">
                <span className="text-[11px] font-bold text-[#173324] block">
                  Associated Orders:
                </span>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {userOrders.map((ord) => (
                    <div
                      key={ord.id || ord.orderNumber}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#f9faf8] border border-[#e2eae5] text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#1b7a43]">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[#173324] font-medium truncate max-w-[150px]">
                          {ord.treeSpecies}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                          {ord.status}
                        </span>
                        <span className="font-bold text-[#173324]">₹{ord.totalAmount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-[#e2eae5] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#173324] text-white hover:bg-[#12261b] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

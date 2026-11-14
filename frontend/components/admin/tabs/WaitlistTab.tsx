"use client";

import { useState } from "react";
import { WaitlistEntry } from "../types";
import { waitlistService } from "@/services/waitlist/waitlist.service";
import type { ShowToast } from "../hooks/useAdminToast";

interface WaitlistTabProps {
  waitlist: WaitlistEntry[];
  setWaitlist: React.Dispatch<React.SetStateAction<WaitlistEntry[]>>;
  showToast: ShowToast;
}

export function WaitlistTab({ waitlist, setWaitlist, showToast }: WaitlistTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "contacted">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = waitlist.filter((item) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.email.toLowerCase().includes(q) ||
      item.phoneNumber.toLowerCase().includes(q) ||
      (item.name && item.name.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const pendingCount = waitlist.filter((w) => w.status === "pending").length;
  const contactedCount = waitlist.filter((w) => w.status === "contacted").length;

  const handleToggleStatus = async (item: WaitlistEntry) => {
    const nextStatus = item.status === "contacted" ? "pending" : "contacted";
    try {
      setUpdatingId(item.id);
      await waitlistService.updateStatus(item.id, nextStatus);
      setWaitlist((prev) =>
        prev.map((w) => (w.id === item.id ? { ...w, status: nextStatus } : w))
      );
      showToast(`Status updated to ${nextStatus.toUpperCase()} for ${item.email}`);
    } catch (err: any) {
      showToast("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!window.confirm(`Are you sure you want to remove ${email} from the waitlist?`)) {
      return;
    }
    try {
      setDeletingId(id);
      await waitlistService.delete(id);
      setWaitlist((prev) => prev.filter((w) => w.id !== id));
      showToast(`Removed ${email} from waitlist.`);
    } catch (err: any) {
      showToast("Failed to delete entry. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label}: ${text}`);
  };

  const handleExportCSV = () => {
    if (waitlist.length === 0) {
      showToast("No waitlist records to export.");
      return;
    }
    const headers = ["Email", "Phone Number", "Name", "Status", "Source", "Date Registered"];
    const rows = filtered.map((w) => [
      `"${w.email}"`,
      `"${w.phoneNumber}"`,
      `"${w.name || ""}"`,
      `"${w.status}"`,
      `"${w.source}"`,
      `"${new Date(w.createdAt).toLocaleString()}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `planton_waitlist_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filtered.length} waitlist records to CSV.`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Metric Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-[#e2eae5] shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#1b7a43] text-xs font-bold uppercase tracking-wider border border-emerald-200 mb-2">
            <span>📋 Exclusive Access Queue</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl sm:text-3xl font-bold text-[#173324]">
            Adoption Packages Waitlist Leads
          </h2>
          <p className="text-xs sm:text-sm text-[#4a6557] mt-1">
            Real-time leads collected from the storefront “Join in Waitlist” button for upcoming living forest packages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl border border-[#d2ded7] hover:bg-[#f4f8f5] text-xs font-bold text-[#173324] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <span>📥 Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e2eae5] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#7a8a80]">
              Total Waitlist Signups
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#173324] mt-1 font-mono">
              {waitlist.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#1b7a43] flex items-center justify-center text-lg border border-emerald-100">
            👥
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e2eae5] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#7a8a80]">
              Pending Follow-Up
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1 font-mono">
              {pendingCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg border border-amber-100">
            ⏳
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e2eae5] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#7a8a80]">
              Contacted / Verified
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1 font-mono">
              {contactedCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg border border-emerald-100">
            ✓
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#e2eae5] shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === "all"
                ? "bg-[#173324] text-white shadow-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({waitlist.length})
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === "pending"
                ? "bg-amber-500 text-white shadow-xs"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter("contacted")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === "contacted"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            Contacted ({contactedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email, phone, name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#d2ded7] focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] text-xs outline-none transition-all placeholder:text-gray-400"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            🔍
          </span>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-3xl bg-white border border-[#e2eae5] shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 text-2xl flex items-center justify-center mx-auto">
              📋
            </div>
            <h4 className="text-base font-bold text-[#173324]">No Waitlist Entries Found</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {search
                ? "No entries match your search query."
                : "When users on the landing page click “Join in Waitlist” and submit their phone number and email, their entries will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8faf9] border-b border-[#e2eae5] text-[11px] font-bold uppercase tracking-wider text-[#7a8a80]">
                  <th className="py-3.5 px-4 sm:px-6">User / Contact</th>
                  <th className="py-3.5 px-4">Phone Number</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4f1] text-xs text-[#1c2e24]">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fbfdfc] transition-colors">
                    {/* User / Contact */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-[#173324] flex items-center gap-2">
                        <span>{item.email}</span>
                        <button
                          onClick={() => handleCopy(item.email, "Email")}
                          title="Copy Email"
                          className="text-gray-400 hover:text-emerald-700 text-xs cursor-pointer"
                        >
                          📋
                        </button>
                      </div>
                      {item.name ? (
                        <div className="text-[11px] text-[#4a6557] font-medium">{item.name}</div>
                      ) : (
                        <div className="text-[10px] text-gray-400 italic">Name not provided</div>
                      )}
                    </td>

                    {/* Phone Number */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-[#1b7a43] flex items-center gap-1.5">
                        <span>{item.phoneNumber}</span>
                        <button
                          onClick={() => handleCopy(item.phoneNumber, "Phone")}
                          title="Copy Phone"
                          className="text-gray-400 hover:text-emerald-700 text-xs cursor-pointer"
                        >
                          📋
                        </button>
                      </div>
                      <a
                        href={`tel:${item.phoneNumber}`}
                        className="text-[10px] text-emerald-600 hover:underline block"
                      >
                        Call / Dial
                      </a>
                    </td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#173324]">
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono">
                        {new Date(item.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {item.status === "contacted" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <span>✓</span>
                          <span>Contacted</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                          <span>⏳</span>
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={updatingId === item.id}
                          onClick={() => handleToggleStatus(item)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                            item.status === "contacted"
                              ? "border-gray-200 text-gray-600 hover:bg-gray-100"
                              : "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          }`}
                        >
                          {updatingId === item.id
                            ? "Updating..."
                            : item.status === "contacted"
                            ? "Mark Pending"
                            : "Mark Contacted"}
                        </button>

                        <button
                          disabled={deletingId === item.id}
                          onClick={() => handleDelete(item.id, item.email)}
                          title="Delete Lead"
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer text-xs"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


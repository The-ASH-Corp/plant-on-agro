"use client";

import { useState, useRef, useEffect } from "react";
import { AdminTabType, AdoptionOrder } from "./types";

interface AdminHeaderProps {
  onOpenSidebar: () => void;
  activeTab: AdminTabType;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  orders?: AdoptionOrder[];
  unreadCount?: number;
  onSelectOrder?: (order: AdoptionOrder) => void;
  onMarkAllAsRead?: () => void;
  onViewAllOrders?: () => void;
}

const TAB_META: Record<AdminTabType, { label: string }> = {
  overview: { label: "Overview" },
  trees: { label: "Tree Varieties" },
  plans: { label: "Adoption Plans" },
  instances: { label: "Tree Instances" },
  locations: { label: "Reserves & GPS" },
  orders: { label: "Adoption Orders" },
  users: { label: "All Users Directory" },
  certificates: { label: "Certificate Deeds" },
  visits: { label: "Plantation Visits & Tours" },
  "landing-page": { label: "Landing Page CMS" },
};


export function AdminHeader({
  onOpenSidebar,
  activeTab,
  searchQuery,
  setSearchQuery,
  orders = [],
  unreadCount = 0,
  onSelectOrder,
  onMarkAllAsRead,
  onViewAllOrders,
}: AdminHeaderProps) {
  const currentTab = TAB_META[activeTab];
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notifOpen]);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e5ebe7] px-3 sm:px-6 3xl:px-10 4k:px-12 py-2.5 sm:py-3.5 3xl:py-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-xl border border-[#e5ebe7] text-[#1c2e24] text-base hover:bg-[#f4f7f5] cursor-pointer shrink-0"
            aria-label="Open sidebar"
          >
            ☰
          </button>

          <span className="font-bold text-[#173324] capitalize text-xs sm:text-base 3xl:text-lg 4k:text-xl truncate">
            {currentTab.label}
          </span>
        </div>

        {/* Quick Search & Notification Bell */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Toggle */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 rounded-xl border border-[#e2eae5] text-[#173324] hover:bg-[#f2f7f4] cursor-pointer text-xs flex items-center justify-center"
            title="Search"
          >
            🔍
          </button>

          {/* Desktop & 4K Search Input */}
          <div className="relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog, orders, reserves..."
              className="w-56 lg:w-80 2xl:w-96 3xl:w-[420px] 4k:w-[540px] pl-9 pr-10 py-1.5 3xl:py-2.5 4k:py-3 text-xs 3xl:text-sm 4k:text-base rounded-xl 3xl:rounded-2xl border border-[#e2eae5] bg-[#f9faf8] text-[#173324] placeholder-[#8a9990] outline-none focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] transition-all"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs 3xl:text-sm text-[#8a9990]">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs 3xl:text-sm text-[#8a9990] hover:text-[#173324] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Notifications Bell Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              id="admin-notifications-btn"
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 3xl:p-2.5 rounded-xl border border-[#e2eae5] hover:bg-[#f2f7f4] text-[#173324] transition-colors cursor-pointer flex items-center justify-center"
              title="Adoption Order Notifications"
            >
              <span className="text-base 3xl:text-lg">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[10px] 3xl:text-xs font-bold bg-amber-500 text-white shadow-xs animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 3xl:w-[420px] max-w-sm 3xl:max-w-md bg-white rounded-2xl shadow-2xl border border-[#e2eae5] py-2 z-50 animate-fadeIn">
                <div className="px-4 py-2 border-b border-[#f0f4f1] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs 3xl:text-sm font-bold text-[#173324]">Order Notifications</h4>
                    <span className="text-[10px] 3xl:text-xs text-[#73877b]">
                      {unreadCount > 0 ? `${unreadCount} unreviewed requests` : "All orders up to date"}
                    </span>
                  </div>
                  {unreadCount > 0 && onMarkAllAsRead && (
                    <button
                      onClick={() => {
                        onMarkAllAsRead();
                        setNotifOpen(false);
                      }}
                      className="text-[11px] 3xl:text-xs text-[#1b7a43] hover:underline font-semibold cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 3xl:max-h-96 overflow-y-auto divide-y divide-[#f4f7f5]">
                  {orders.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#73877b]">No orders recorded</div>
                  ) : (
                    orders.slice(0, 6).map((order) => {
                      const isNew = order.isRead === false || order.status === "New Request";
                      return (
                        <div
                          key={order.id}
                          onClick={() => {
                            if (onSelectOrder) onSelectOrder(order);
                            setNotifOpen(false);
                          }}
                          className={`p-3 text-xs 3xl:text-sm hover:bg-[#f8faf8] transition-colors cursor-pointer flex items-start gap-2.5 ${
                            isNew ? "bg-amber-50/40" : ""
                          }`}
                        >
                          <span className="text-base mt-0.5">🌱</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-[#173324] truncate">
                                {order.treeSpecies}
                              </span>
                              <span className="font-mono text-[10px] text-[#1b7a43] shrink-0 font-semibold">
                                {order.orderNumber}
                              </span>
                            </div>
                            <p className="text-[11px] 3xl:text-xs text-[#55695d] truncate">
                              {order.adopterName} • ₹{order.totalAmount.toLocaleString()}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-[#eaf2ec] text-[#2d6a4f]">
                                {order.status}
                              </span>
                              {isNew && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-amber-500 text-white">
                                  NEW
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="px-4 py-2 border-t border-[#f0f4f1] text-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (onViewAllOrders) onViewAllOrders();
                      setNotifOpen(false);
                    }}
                    className="text-xs 3xl:text-sm font-semibold text-[#1b7a43] hover:underline cursor-pointer"
                  >
                    View All Adoption Orders ({orders.length}) →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Mobile Search Input Bar */}
      {mobileSearchOpen && (
        <div className="mt-2.5 pt-2 border-t border-[#e5ebe7] md:hidden animate-fadeIn">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog, orders, reserves..."
              className="w-full pl-8 pr-8 py-2 text-xs rounded-xl border border-[#e2eae5] bg-[#f9faf8] text-[#173324] placeholder-[#8a9990] outline-none focus:border-[#1b7a43]"
              autoFocus
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8a9990]">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8a9990] hover:text-[#173324]"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


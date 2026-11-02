"use client";

import { useState } from "react";

// Types
import {
  AdminTabType,
  TreeVarietyItem,
  AdoptionPlanItem,
  TreeInstanceItem,
  PlantationLocationItem,
  AdoptionOrder,
  AdoptionOrderStatus,
} from "./types";

// Layout Components
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminToast } from "./AdminToast";
import { AdminTabContent } from "./AdminTabContent";
import { AdminModals } from "./AdminModals";
import { AdminLoadingScreen, AdminUnauthorizedScreen } from "./AdminGuardScreens";
import { SignOutConfirmationModal } from "@/components/ui";

// Hooks
import { useAdminToast } from "./hooks/useAdminToast";
import { useAdminAuthGuard } from "./hooks/useAdminAuthGuard";
import { useAdminData } from "./hooks/useAdminData";
import { useTreeActions } from "./hooks/useTreeActions";
import { usePlanActions } from "./hooks/usePlanActions";
import { useInstanceActions } from "./hooks/useInstanceActions";
import { useLocationActions } from "./hooks/useLocationActions";
import { useUserActions } from "./hooks/useUserActions";
import { useOrderActions } from "./hooks/useOrderActions";
import { useCertificateActions } from "./hooks/useCertificateActions";
import { useDeleteActions } from "./hooks/useDeleteActions";

// Re-export types for backward compatibility
export type {
  AdminTabType,
  TreeVarietyItem,
  AdoptionPlanItem,
  TreeInstanceItem,
  PlantationLocationItem,
  AdoptionOrder,
  AdoptionOrderStatus,
};

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTabType>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const { toastMessage, showToast } = useAdminToast();
  const { user, logout, isReady, isAdmin } = useAdminAuthGuard();
  const data = useAdminData(showToast);

  const ctx = { data, showToast, setActiveTab };
  const treeActions = useTreeActions(ctx);
  const planActions = usePlanActions(ctx);
  const instanceActions = useInstanceActions(ctx);
  const locationActions = useLocationActions(ctx);
  const userActions = useUserActions(ctx);
  const orderActions = useOrderActions(ctx);
  const certificateActions = useCertificateActions(ctx);
  const deleteActions = useDeleteActions({ ...ctx, certificateActions });

  if (!isReady) return <AdminLoadingScreen />;
  if (!isAdmin) return <AdminUnauthorizedScreen />;

  const actions = {
    treeActions,
    planActions,
    instanceActions,
    locationActions,
    userActions,
    orderActions,
    certificateActions,
    deleteActions,
  };

  return (
    <div className="min-h-screen flex bg-[#f8faf8] text-[#1c2e24] font-sans antialiased overflow-x-hidden">
      {/* 1. Executive Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        treesCount={data.trees.length}
        plansCount={data.plans.length}
        instancesCount={data.instances.length}
        locationsCount={data.locations.length}
        ordersCount={data.orders.length}
        unreadOrdersCount={orderActions.unreadOrdersCount}
        certificatesCount={data.certificates.length}
        usersCount={data.users.filter((u) => u.role !== "admin").length}
        userName={user?.name}
        onLogout={() => setShowSignOutModal(true)}
        onOpenAddTree={() => treeActions.setShowAddTreeModal(true)}
        onOpenAddPlan={() => planActions.setShowAddPlanModal(true)}
        onOpenAddLocation={() => locationActions.setShowAddLocationModal(true)}
        onOpenAddInstance={() => instanceActions.setShowAddInstanceModal(true)}
        onOpenIssueCertificate={() => certificateActions.setShowIssueCertModal(true)}
      />

      {/* 2. Main Application Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Command Bar */}
        <AdminHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          orders={data.orders}
          unreadCount={orderActions.unreadOrdersCount}
          onSelectOrder={orderActions.handleSelectOrder}
          onMarkAllAsRead={orderActions.handleMarkAllOrdersAsRead}
          onViewAllOrders={() => setActiveTab("orders")}
        />

        {/* Global Toast Alert */}
        <AdminToast message={toastMessage} />

        {/* Main Body Content by Tab */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <AdminTabContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            showToast={showToast}
            data={data}
            {...actions}
          />
        </main>
      </div>

      {/* 3. Action & Confirmation Modals */}
      <AdminModals data={data} showToast={showToast} {...actions} />

      {/* 4. Sign Out Confirmation Modal */}
      <SignOutConfirmationModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={logout}
        userName={user?.name}
        userEmail={user?.email}
        userRole="admin"
      />
    </div>
  );
}

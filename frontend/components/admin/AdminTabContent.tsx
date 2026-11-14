import { AdminTabType } from "./types";
import type { AdminData } from "./hooks/useAdminData";
import type { ShowToast } from "./hooks/useAdminToast";
import type { TreeActions } from "./hooks/useTreeActions";
import type { PlanActions } from "./hooks/usePlanActions";
import type { InstanceActions } from "./hooks/useInstanceActions";
import type { LocationActions } from "./hooks/useLocationActions";
import type { UserActions } from "./hooks/useUserActions";
import type { OrderActions } from "./hooks/useOrderActions";
import type { CertificateActions } from "./hooks/useCertificateActions";
import type { DeleteActions } from "./hooks/useDeleteActions";

import { OverviewTab } from "./tabs/OverviewTab";
import { PlansTab } from "./tabs/PlansTab";
import { TreeInstancesTab } from "./tabs/TreeInstancesTab";
import { LocationsTab } from "./tabs/LocationsTab";
import { OrdersTab } from "./tabs/OrdersTab";
import { UsersTab } from "./tabs/UsersTab";
import { LandingPageTab } from "./tabs/LandingPageTab";
import { CertificatesTab } from "./tabs/CertificatesTab";
import { VisitsTab } from "./tabs/VisitsTab";
import { WaitlistTab } from "./tabs/WaitlistTab";


interface AdminTabContentProps {
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
  searchQuery: string;
  showToast: ShowToast;
  data: AdminData;
  treeActions: TreeActions;
  planActions: PlanActions;
  instanceActions: InstanceActions;
  locationActions: LocationActions;
  userActions: UserActions;
  orderActions: OrderActions;
  certificateActions: CertificateActions;
  deleteActions: DeleteActions;
}

export function AdminTabContent({
  activeTab,
  setActiveTab,
  searchQuery,
  showToast,
  data,
  treeActions,
  planActions,
  instanceActions,
  locationActions,
  userActions,
  orderActions,
  certificateActions,
  deleteActions,
}: AdminTabContentProps) {
  const { trees, plans, instances, locations, users, orders, certificates } = data;

  switch (activeTab) {
    case "overview":
      return (
        <OverviewTab
          locations={locations}
          orders={orders}
          instances={instances}
          treeVarieties={trees}
          setActiveTab={setActiveTab}
          onSelectOrder={orderActions.handleSelectOrder}
          unreadOrdersCount={orderActions.unreadOrdersCount}
          onMarkAllAsRead={orderActions.handleMarkAllOrdersAsRead}
          waitlistCount={data.waitlist.length}
        />
      );

    case "trees":
    case "orders":
      return (
        <OrdersTab
          orders={orders}
          instances={instances}
          searchQuery={searchQuery}
          onSelectOrder={orderActions.handleSelectOrder}
          onOpenAssignTree={orderActions.handleOpenAssignTree}
          onExportCSV={orderActions.handleExportOrdersCSV}
          onUpdateStatus={orderActions.handleUpdateOrderStatus}
          onMarkAllAsRead={orderActions.handleMarkAllOrdersAsRead}
          unreadCount={orderActions.unreadOrdersCount}
        />
      );

    case "plans":
      return (
        <PlansTab
          plans={plans}
          searchQuery={searchQuery}
          onOpenAddPlan={() => planActions.setShowAddPlanModal(true)}
          onEditPlan={(plan) => planActions.setSelectedPlanForEdit(plan)}
          onDeletePlan={deleteActions.handleDeletePlan}
        />
      );

    case "instances":
      return (
        <TreeInstancesTab
          instances={instances}
          searchQuery={searchQuery}
          onOpenAddInstance={() => instanceActions.setShowAddInstanceModal(true)}
          onEditInstance={(inst) => instanceActions.setSelectedInstanceForEdit(inst)}
          onUpdateHealth={instanceActions.handleUpdateInstanceHealth}
          onDeleteInstance={deleteActions.handleDeleteInstance}
        />
      );

    case "locations":
      return (
        <LocationsTab
          locations={locations}
          searchQuery={searchQuery}
          onOpenAddLocation={() => locationActions.setShowAddLocationModal(true)}
          onEditLocation={(loc) => locationActions.setSelectedLocationForEdit(loc)}
          onDeleteLocation={deleteActions.handleDeleteLocation}
        />
      );

    case "users":
      return (
        <UsersTab
          users={users.filter((u) => u.role !== "admin")}
          searchQuery={searchQuery}
          onToggleBlockUser={userActions.handleToggleBlockUser}
          onRefreshUsers={userActions.handleRefreshUsers}
          isRefreshing={userActions.isRefreshingUsers}
          orders={orders}
          onViewUserDetails={(u) => userActions.setSelectedUser(u)}
        />
      );

    case "landing-page":
      return <LandingPageTab showToast={showToast} />;

    case "certificates":
      return (
        <CertificatesTab
          certificates={certificates}
          searchQuery={searchQuery}
          onOpenIssueCertificate={() => certificateActions.setShowIssueCertModal(true)}
          onInspectCertificate={(cert) => certificateActions.setSelectedCertForInspect(cert)}
          onEditCertificate={(cert) => certificateActions.setSelectedCertForEdit(cert)}
          onRevokeCertificate={(id, num) => certificateActions.handleRevokeCertificate(id, num)}
          onRegenerateCertificate={(id, num) => certificateActions.handleRegenerateCertificate(id, num)}
          onDeleteCertificate={deleteActions.handleDeleteCertificate}
          onRefresh={certificateActions.handleRefreshCertificates}
        />
      );

    case "visits":
      return <VisitsTab showToast={showToast} />;

    case "waitlist":
      return (
        <WaitlistTab
          waitlist={data.waitlist}
          setWaitlist={data.setWaitlist}
          showToast={showToast}
        />
      );

    default:
      return null;
  }
}

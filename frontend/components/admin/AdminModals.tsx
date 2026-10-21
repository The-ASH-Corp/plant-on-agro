import type { AdminData } from "./hooks/useAdminData";
import type { ShowToast } from "./hooks/useAdminToast";
import type { TreeActions } from "./hooks/useTreeActions";
import type { PlanActions } from "./hooks/usePlanActions";
import type { InstanceActions } from "./hooks/useInstanceActions";
import type { LocationActions } from "./hooks/useLocationActions";
import type { UserActions } from "./hooks/useUserActions";
import type { OrderActions } from "./hooks/useOrderActions";
import type { CertificateActions } from "./hooks/useCertificateActions";
import { DELETE_ITEM_LABELS, type DeleteActions } from "./hooks/useDeleteActions";

import { AddTreeModal } from "./modals/AddTreeModal";
import { EditTreeModal } from "./modals/EditTreeModal";
import { AddPlanModal } from "./modals/AddPlanModal";
import { EditPlanModal } from "./modals/EditPlanModal";
import { AddTreeInstanceModal } from "./modals/AddTreeInstanceModal";
import { EditTreeInstanceModal } from "./modals/EditTreeInstanceModal";
import { AddLocationModal } from "./modals/AddLocationModal";
import { EditLocationModal } from "./modals/EditLocationModal";
import { OrderDetailsModal } from "./modals/OrderDetailsModal";
import { UserDetailsModal } from "./modals/UserDetailsModal";
import { DeleteConfirmationModal } from "./modals/DeleteConfirmationModal";
import { IssueCertificateModal } from "./modals/IssueCertificateModal";
import { InspectCertificateModal } from "./modals/InspectCertificateModal";
import { EditCertificateModal } from "./modals/EditCertificateModal";

interface AdminModalsProps {
  data: AdminData;
  showToast: ShowToast;
  treeActions: TreeActions;
  planActions: PlanActions;
  instanceActions: InstanceActions;
  locationActions: LocationActions;
  userActions: UserActions;
  orderActions: OrderActions;
  certificateActions: CertificateActions;
  deleteActions: DeleteActions;
}

export function AdminModals({
  data,
  showToast,
  treeActions,
  planActions,
  instanceActions,
  locationActions,
  userActions,
  orderActions,
  certificateActions,
  deleteActions,
}: AdminModalsProps) {
  const { orders, instances, certificates } = data;
  const { selectedOrder, setSelectedOrder } = orderActions;
  const {
    selectedCertForInspect,
    setSelectedCertForInspect,
    selectedCertForEdit,
    setSelectedCertForEdit,
  } = certificateActions;
  const { deleteModal, setDeleteModal, isDeleting } = deleteActions;

  return (
    <>
      {/* Tree Varieties */}
      <AddTreeModal
        isOpen={treeActions.showAddTreeModal}
        onClose={() => treeActions.setShowAddTreeModal(false)}
        onSubmit={treeActions.handleCreateTree}
      />
      <EditTreeModal
        isOpen={Boolean(treeActions.selectedTreeForEdit)}
        tree={treeActions.selectedTreeForEdit}
        onClose={() => treeActions.setSelectedTreeForEdit(null)}
        onSubmit={treeActions.handleUpdateTree}
        isSubmitting={treeActions.isUpdatingTree}
      />

      {/* Adoption Plans */}
      <AddPlanModal
        isOpen={planActions.showAddPlanModal}
        onClose={() => planActions.setShowAddPlanModal(false)}
        onSubmit={planActions.handleCreatePlan}
      />
      <EditPlanModal
        isOpen={Boolean(planActions.selectedPlanForEdit)}
        plan={planActions.selectedPlanForEdit}
        onClose={() => planActions.setSelectedPlanForEdit(null)}
        onSubmit={planActions.handleUpdatePlan}
        isSubmitting={planActions.isUpdatingPlan}
      />

      {/* Tree Instances */}
      <AddTreeInstanceModal
        isOpen={instanceActions.showAddInstanceModal}
        onClose={() => instanceActions.setShowAddInstanceModal(false)}
        onSubmit={instanceActions.handleCreateInstance}
      />
      <EditTreeInstanceModal
        isOpen={Boolean(instanceActions.selectedInstanceForEdit)}
        instance={instanceActions.selectedInstanceForEdit}
        onClose={() => instanceActions.setSelectedInstanceForEdit(null)}
        onSubmit={instanceActions.handleUpdateInstance}
        isSubmitting={instanceActions.isUpdatingInstance}
      />

      {/* Locations */}
      <AddLocationModal
        isOpen={locationActions.showAddLocationModal}
        onClose={() => locationActions.setShowAddLocationModal(false)}
        onSubmit={locationActions.handleCreateLocation}
      />
      <EditLocationModal
        isOpen={Boolean(locationActions.selectedLocationForEdit)}
        location={locationActions.selectedLocationForEdit}
        onClose={() => locationActions.setSelectedLocationForEdit(null)}
        onSubmit={locationActions.handleUpdateLocation}
        isSubmitting={locationActions.isUpdatingLocation}
      />

      {/* Orders */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onDownloadCertificate={(certId) => {
          const foundCert = certificates.find(
            (c) =>
              c.certificateNumber === certId ||
              c.orderRef === selectedOrder?.orderNumber ||
              c.id === certId
          );
          if (foundCert) {
            setSelectedCertForInspect(foundCert);
          } else {
            showToast(`Digital Certificate ${certId} downloaded!`);
          }
          setSelectedOrder(null);
        }}
        onUpdateStatus={orderActions.handleUpdateOrderStatus}
      />

      {/* Certificates */}
      <IssueCertificateModal
        isOpen={certificateActions.showIssueCertModal}
        onClose={() => certificateActions.setShowIssueCertModal(false)}
        onSubmit={certificateActions.handleCreateCertificate}
        isSubmitting={certificateActions.isSubmittingCert}
        orders={orders}
        instances={instances}
      />
      <InspectCertificateModal
        certificate={selectedCertForInspect}
        onClose={() => setSelectedCertForInspect(null)}
        onRevoke={(id) =>
          certificateActions.handleRevokeCertificate(id, selectedCertForInspect?.certificateNumber)
        }
        onRegenerate={(id) =>
          certificateActions.handleRegenerateCertificate(id, selectedCertForInspect?.certificateNumber)
        }
        onOpenEdit={(cert) => {
          setSelectedCertForInspect(null);
          setSelectedCertForEdit(cert);
        }}
      />
      <EditCertificateModal
        isOpen={Boolean(selectedCertForEdit)}
        certificate={selectedCertForEdit}
        onClose={() => setSelectedCertForEdit(null)}
        onSubmit={certificateActions.handleUpdateCertificate}
        isSubmitting={certificateActions.isSubmittingCert}
      />

      {/* Users */}
      <UserDetailsModal
        user={userActions.selectedUser}
        onClose={() => userActions.setSelectedUser(null)}
        onToggleBlockUser={userActions.handleToggleBlockUser}
        orders={orders}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmationModal
        isOpen={Boolean(deleteModal?.isOpen)}
        itemType={deleteModal ? DELETE_ITEM_LABELS[deleteModal.type] : DELETE_ITEM_LABELS.location}
        itemName={deleteModal?.name}
        description={deleteModal?.description}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) setDeleteModal(null);
        }}
        onConfirm={deleteActions.handleConfirmDelete}
      />
    </>
  );
}

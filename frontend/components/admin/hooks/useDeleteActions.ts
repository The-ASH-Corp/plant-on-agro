import { useState } from "react";
import { treeVarietyService } from "@/services/tree-varieties/tree-variety.service";
import { adoptionPlanService } from "@/services/adoption-plans/adoption-plan.service";
import { treeInstanceService } from "@/services/tree-instances/tree-instance.service";
import { certificateService } from "@/services/certificates/certificate.service";
import type { AdminData } from "./useAdminData";
import type { ShowToast } from "./useAdminToast";
import type { CertificateActions } from "./useCertificateActions";

export type DeleteItemType = "tree" | "plan" | "instance" | "location" | "certificate";

export interface DeleteModalState {
  isOpen: boolean;
  type: DeleteItemType;
  id: string;
  name: string;
  description?: string;
}

export const DELETE_ITEM_LABELS: Record<DeleteItemType, string> = {
  tree: "Tree Variety",
  plan: "Adoption Plan",
  instance: "Tree Sapling Instance",
  location: "Reserve Location",
  certificate: "Certificate Deed",
};

interface Params {
  data: AdminData;
  showToast: ShowToast;
  certificateActions: Pick<CertificateActions, "selectedCertForInspect" | "setSelectedCertForInspect">;
}

export function useDeleteActions({ data, showToast, certificateActions }: Params) {
  const {
    trees, setTrees,
    plans, setPlans,
    instances, setInstances,
    locations, setLocations,
    certificates, setCertificates,
  } = data;
  const { selectedCertForInspect, setSelectedCertForInspect } = certificateActions;

  const [deleteModal, setDeleteModal] = useState<DeleteModalState | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteTree = (id: string, name?: string) => {
    const item = trees.find((t) => t.id === id);
    setDeleteModal({
      isOpen: true,
      type: "tree",
      id,
      name: name || item?.name || "Tree Variety",
      description:
        "Are you sure you want to remove this tree variety from the public catalog? Buyers will no longer be able to select it.",
    });
  };

  const handleDeletePlan = (id: string, name?: string) => {
    const item = plans.find((p) => p.id === id);
    setDeleteModal({
      isOpen: true,
      type: "plan",
      id,
      name: name || item?.label || item?.planLabel || "Adoption Plan",
      description:
        "Are you sure you want to delete this adoption package? It will no longer be offered during tree adoption.",
    });
  };

  const handleDeleteInstance = (id: string, tag?: string) => {
    const item = instances.find((i) => i.id === id);
    setDeleteModal({
      isOpen: true,
      type: "instance",
      id,
      name: tag || item?.treeTag || "Tree Sapling Instance",
      description:
        "Are you sure you want to remove this tagged tree instance and its GPS telemetry record?",
    });
  };

  const handleDeleteLocation = (id: string, name?: string) => {
    const item = locations.find((l) => l.id === id);
    setDeleteModal({
      isOpen: true,
      type: "location",
      id,
      name: name || item?.name || "Reserve Location",
      description:
        "Are you sure you want to remove this agroforestry bio-sanctuary and its boundary data?",
    });
  };

  const handleDeleteCertificate = (id: string, certNumber?: string) => {
    const item = certificates.find((c) => c.id === id);
    setDeleteModal({
      isOpen: true,
      type: "certificate",
      id,
      name: certNumber || item?.certificateNumber || "Certificate Deed",
      description:
        "Are you sure you want to permanently delete this certificate deed record and cryptographic proof?",
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal) return;
    setIsDeleting(true);
    const { type, id, name } = deleteModal;
    try {
      if (type === "tree") {
        try {
          await treeVarietyService.delete(id);
        } catch (err) {
          console.warn("Tree deletion API notice:", err);
        }
        setTrees((prev) => prev.filter((t) => t.id !== id));
        showToast(`Tree variety "${name}" removed from catalog.`);
      } else if (type === "plan") {
        try {
          await adoptionPlanService.delete(id);
        } catch (err) {
          console.warn("Adoption plan deletion API notice:", err);
        }
        setPlans((prev) => prev.filter((p) => p.id !== id));
        showToast(`Adoption plan "${name}" removed.`);
      } else if (type === "instance") {
        try {
          await treeInstanceService.delete(id);
        } catch (err) {
          console.warn("Tree instance deletion notice:", err);
        }
        setInstances((prev) => prev.filter((i) => i.id !== id));
        showToast(`Tree instance "${name}" record removed.`);
      } else if (type === "location") {
        setLocations((prev) => prev.filter((l) => l.id !== id));
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem("poa_custom_locations");
            if (raw) {
              const custom = JSON.parse(raw).filter((l: any) => l.id !== id && l.name !== name);
              localStorage.setItem("poa_custom_locations", JSON.stringify(custom));
            }
          } catch {}
        }
        showToast(`Reserve location "${name}" removed.`);
      } else if (type === "certificate") {
        try {
          await certificateService.deleteCertificate(id);
        } catch (err) {
          console.warn("Certificate deletion notice:", err);
        }
        setCertificates((prev) => prev.filter((c) => c.id !== id));
        if (selectedCertForInspect?.id === id) setSelectedCertForInspect(null);
        showToast(`Certificate deed "${name}" removed.`);
      }
      setDeleteModal(null);
    } catch (err: any) {
      showToast(err.message || "Failed to delete item");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteModal,
    setDeleteModal,
    isDeleting,
    handleDeleteTree,
    handleDeletePlan,
    handleDeleteInstance,
    handleDeleteLocation,
    handleDeleteCertificate,
    handleConfirmDelete,
  };
}

export type DeleteActions = ReturnType<typeof useDeleteActions>;

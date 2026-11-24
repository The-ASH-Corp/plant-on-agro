import { useState } from "react";
import { AdminTabType, TreeHealthStatus, TreeInstanceItem, TreeGrowthUpdateItem } from "../types";
import { treeInstanceService } from "@/services/tree-instances/tree-instance.service";
import type { AdminData } from "./useAdminData";
import type { ShowToast } from "./useAdminToast";

interface Params {
  data: AdminData;
  showToast: ShowToast;
  setActiveTab: (tab: AdminTabType) => void;
}

export function useInstanceActions({ data, showToast, setActiveTab }: Params) {
  const { setInstances } = data;
  const [showAddInstanceModal, setShowAddInstanceModal] = useState(false);
  const [selectedInstanceForEdit, setSelectedInstanceForEdit] = useState<TreeInstanceItem | null>(null);
  const [selectedInstanceForInspection, setSelectedInstanceForInspection] = useState<TreeInstanceItem | null>(null);
  const [isUpdatingInstance, setIsUpdatingInstance] = useState(false);
  const [isLoggingInspection, setIsLoggingInspection] = useState(false);

  const handleCreateInstance = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const treeTag = (fd.get("treeTag") as string).trim().toUpperCase();
    const orderRef = (fd.get("orderRef") as string)?.trim() || "";
    const assignedReserve = (fd.get("assignedReserve") as string).trim();
    const datePlanted = (fd.get("datePlanted") as string) || new Date().toISOString();
    const healthStatus = (fd.get("healthStatus") as TreeHealthStatus) || "Sapling Growing";
    const treeVarietyName = (fd.get("treeVarietyName") as string)?.trim() || "";
    const adopterName = (fd.get("adopterName") as string)?.trim() || "";
    const adopterEmail = (fd.get("adopterEmail") as string)?.trim() || "";
    const notes = (fd.get("notes") as string)?.trim() || "";

    try {
      const res = await treeInstanceService.create({
        treeTag,
        orderRef,
        assignedReserve,
        datePlanted,
        healthStatus,
        treeVarietyName,
        adopterName,
        adopterEmail,
        notes,
      });

      if (res.data) {
        const uiItem = treeInstanceService.mapToUiItem(res.data);
        setInstances((prev) => [uiItem, ...prev.filter((i) => i.id !== uiItem.id)]);
      } else {
        const fallback: TreeInstanceItem = {
          id: "inst-" + Date.now(),
          treeTag,
          orderRef,
          assignedReserve,
          datePlanted,
          healthStatus,
          treeVarietyName,
          adopterName,
          adopterEmail,
          notes,
          isActive: true,
        };
        setInstances((prev) => [fallback, ...prev]);
      }

      setShowAddInstanceModal(false);
      showToast(`Tagged and planted sapling "${treeTag}"!`);
      setActiveTab("instances");
    } catch (err: any) {
      console.warn("Tree instance creation notice:", err);
      showToast(err.message || "Failed to create tree instance");
    }
  };

  const handleUpdateInstanceHealth = async (id: string, healthStatus: TreeHealthStatus) => {
    try {
      await treeInstanceService.update(id, { healthStatus });
      setInstances((prev) =>
        prev.map((item) => (item.id === id ? { ...item, healthStatus } : item))
      );
      showToast(`Updated tree health to ${healthStatus}!`);
    } catch (err: any) {
      console.warn("Failed to update health status:", err);
      showToast(err.message || "Could not update health status");
    }
  };

  const handleUpdateInstance = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedInstanceForEdit) return;

    const fd = new FormData(e.currentTarget);
    const id = (fd.get("id") as string) || selectedInstanceForEdit.id;
    const treeTag = (fd.get("treeTag") as string)?.trim().toUpperCase() || selectedInstanceForEdit.treeTag;
    const orderRef = (fd.get("orderRef") as string)?.trim() || "";
    const assignedReserve =
      (fd.get("assignedReserve") as string)?.trim() || selectedInstanceForEdit.assignedReserve;
    const datePlanted =
      (fd.get("datePlanted") as string)?.trim() || selectedInstanceForEdit.datePlanted;
    const healthStatus =
      (fd.get("healthStatus") as TreeHealthStatus) || selectedInstanceForEdit.healthStatus;
    const treeVarietyName =
      (fd.get("treeVarietyName") as string)?.trim() || selectedInstanceForEdit.treeVarietyName;
    const adopterName =
      (fd.get("adopterName") as string)?.trim() || selectedInstanceForEdit.adopterName;
    const adopterEmail =
      (fd.get("adopterEmail") as string)?.trim() || selectedInstanceForEdit.adopterEmail;
    const notes = (fd.get("notes") as string)?.trim() || "";
    const imageUrl =
      (fd.get("imageUrl") as string)?.trim() || selectedInstanceForEdit.imageUrl || "";
    const isActive = fd.get("isActive") !== null;

    let growthUpdates = selectedInstanceForEdit.growthUpdates || [];
    const growthUpdatesRaw = fd.get("growthUpdates") as string;
    if (growthUpdatesRaw) {
      try {
        growthUpdates = JSON.parse(growthUpdatesRaw);
      } catch (e) {
        console.warn("Could not parse growth updates JSON:", e);
      }
    }

    const gpsCoordinates = selectedInstanceForEdit.gpsCoordinates || { latitude: 0, longitude: 0 };
    const formattedGps = selectedInstanceForEdit.formattedGps || "";

    const applyLocalUpdate = () =>
      setInstances((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                treeTag,
                orderRef,
                assignedReserve,
                gpsCoordinates,
                formattedGps,
                datePlanted,
                healthStatus,
                treeVarietyName,
                adopterName,
                adopterEmail,
                notes,
                imageUrl,
                growthUpdates,
                isActive,
              }
            : item
        )
      );

    setIsUpdatingInstance(true);
    try {
      const res = await treeInstanceService.update(id, {
        treeTag,
        orderRef,
        assignedReserve,
        gpsCoordinates,
        datePlanted,
        healthStatus,
        treeVarietyName,
        adopterName,
        adopterEmail,
        notes,
        imageUrl,
        growthUpdates,
        isActive,
      });

      if (res.data) {
        const uiItem = treeInstanceService.mapToUiItem(res.data);
        setInstances((prev) => prev.map((item) => (item.id === id ? uiItem : item)));
      } else {
        applyLocalUpdate();
      }

      setSelectedInstanceForEdit(null);
      showToast(`Updated tree sapling ${treeTag}!`);
    } catch (err: any) {
      console.warn("Tree instance update notice:", err);
      // Fallback local update
      applyLocalUpdate();
      setSelectedInstanceForEdit(null);
      showToast(`Updated ${treeTag} locally.`);
    } finally {
      setIsUpdatingInstance(false);
    }
  };

  const handleSaveGrowthUpdate = async (
    treeId: string,
    update: TreeGrowthUpdateItem,
    newHealthStatus?: TreeHealthStatus
  ) => {
    setIsLoggingInspection(true);
    try {
      const current = data.instances.find((i) => i.id === treeId) || selectedInstanceForInspection;
      if (!current) throw new Error("Tree instance not found");

      const existingUpdates = current.growthUpdates || [];
      const updatedList: TreeGrowthUpdateItem[] = [...existingUpdates, update].sort(
        (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
      );

      const health = newHealthStatus || current.healthStatus;
      const res = await treeInstanceService.update(treeId, {
        growthUpdates: updatedList,
        healthStatus: health,
        imageUrl: update.imageUrl || current.imageUrl,
        lastInspectedAt: update.recordedAt,
      });

      let updatedUiItem: TreeInstanceItem;
      if (res.data) {
        updatedUiItem = treeInstanceService.mapToUiItem(res.data);
      } else {
        updatedUiItem = {
          ...current,
          growthUpdates: updatedList,
          healthStatus: health,
          imageUrl: update.imageUrl || current.imageUrl,
          lastInspectedAt: update.recordedAt,
        };
      }

      setInstances((prev) => prev.map((item) => (item.id === treeId ? updatedUiItem : item)));
      setSelectedInstanceForInspection(updatedUiItem);
      showToast(`Logged arborist inspection & growth photo for ${current.treeTag}!`);
    } catch (err: any) {
      console.error("Failed to save arborist inspection:", err);
      showToast(err.message || "Failed to save arborist inspection");
      throw err;
    } finally {
      setIsLoggingInspection(false);
    }
  };

  const handleDeleteGrowthUpdate = async (treeId: string, updateId: string) => {
    try {
      const current = data.instances.find((i) => i.id === treeId) || selectedInstanceForInspection;
      if (!current) return;

      const updatedList = (current.growthUpdates || []).filter((u) => u.id !== updateId);
      const res = await treeInstanceService.update(treeId, {
        growthUpdates: updatedList,
      });

      let updatedUiItem: TreeInstanceItem;
      if (res.data) {
        updatedUiItem = treeInstanceService.mapToUiItem(res.data);
      } else {
        updatedUiItem = {
          ...current,
          growthUpdates: updatedList,
        };
      }

      setInstances((prev) => prev.map((item) => (item.id === treeId ? updatedUiItem : item)));
      setSelectedInstanceForInspection(updatedUiItem);
      showToast("Removed growth inspection update.");
    } catch (err: any) {
      console.error("Failed to remove growth update:", err);
      showToast(err.message || "Failed to remove growth update");
    }
  };

  const handleSetPrimaryPhoto = async (treeId: string, imageUrl: string) => {
    try {
      const current = data.instances.find((i) => i.id === treeId) || selectedInstanceForInspection;
      if (!current) return;

      const res = await treeInstanceService.update(treeId, { imageUrl });
      let updatedUiItem: TreeInstanceItem;
      if (res.data) {
        updatedUiItem = treeInstanceService.mapToUiItem(res.data);
      } else {
        updatedUiItem = { ...current, imageUrl };
      }

      setInstances((prev) => prev.map((item) => (item.id === treeId ? updatedUiItem : item)));
      setSelectedInstanceForInspection(updatedUiItem);
      showToast(`Updated primary cover photo for ${current.treeTag}!`);
    } catch (err: any) {
      console.error("Failed to set primary photo:", err);
      showToast(err.message || "Failed to update primary cover photo");
    }
  };

  return {
    showAddInstanceModal,
    setShowAddInstanceModal,
    selectedInstanceForEdit,
    setSelectedInstanceForEdit,
    selectedInstanceForInspection,
    setSelectedInstanceForInspection,
    isUpdatingInstance,
    isLoggingInspection,
    handleCreateInstance,
    handleUpdateInstance,
    handleUpdateInstanceHealth,
    handleSaveGrowthUpdate,
    handleDeleteGrowthUpdate,
    handleSetPrimaryPhoto,
  };
}

export type InstanceActions = ReturnType<typeof useInstanceActions>;

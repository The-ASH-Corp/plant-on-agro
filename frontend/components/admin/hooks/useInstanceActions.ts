import { useState } from "react";
import { AdminTabType, TreeHealthStatus, TreeInstanceItem } from "../types";
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
  const [isUpdatingInstance, setIsUpdatingInstance] = useState(false);

  const handleCreateInstance = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const treeTag = (fd.get("treeTag") as string).trim().toUpperCase();
    const orderRef = (fd.get("orderRef") as string)?.trim() || "";
    const assignedReserve = (fd.get("assignedReserve") as string).trim();
    const latitude = Number(fd.get("latitude")) || 18.5204;
    const longitude = Number(fd.get("longitude")) || 73.8567;
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
        gpsCoordinates: { latitude, longitude },
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
          gpsCoordinates: { latitude, longitude },
          formattedGps: `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`,
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
    const latitude =
      parseFloat(fd.get("latitude") as string) ||
      selectedInstanceForEdit.gpsCoordinates?.latitude ||
      18.5204;
    const longitude =
      parseFloat(fd.get("longitude") as string) ||
      selectedInstanceForEdit.gpsCoordinates?.longitude ||
      73.8567;
    const datePlanted =
      (fd.get("datePlanted") as string)?.trim() || selectedInstanceForEdit.datePlanted;
    const healthStatus =
      (fd.get("healthStatus") as TreeHealthStatus) || selectedInstanceForEdit.healthStatus;
    const treeVarietyName = (fd.get("treeVarietyName") as string)?.trim() || "";
    const adopterName = (fd.get("adopterName") as string)?.trim() || "";
    const adopterEmail = (fd.get("adopterEmail") as string)?.trim() || "";
    const notes = (fd.get("notes") as string)?.trim() || "";
    const imageUrl =
      (fd.get("imageUrl") as string)?.trim() || selectedInstanceForEdit.imageUrl || "";
    const isActive = fd.get("isActive") !== null;

    const gpsCoordinates = { latitude, longitude };
    const formattedGps = `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`;

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

  return {
    showAddInstanceModal,
    setShowAddInstanceModal,
    selectedInstanceForEdit,
    setSelectedInstanceForEdit,
    isUpdatingInstance,
    handleCreateInstance,
    handleUpdateInstance,
    handleUpdateInstanceHealth,
  };
}

export type InstanceActions = ReturnType<typeof useInstanceActions>;

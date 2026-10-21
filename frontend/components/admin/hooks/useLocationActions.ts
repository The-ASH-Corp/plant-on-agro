import { useState } from "react";
import { AdminTabType, PlantationLocationItem } from "../types";
import { locationService } from "@/services/locations/location.service";
import type { AdminData } from "./useAdminData";
import type { ShowToast } from "./useAdminToast";

interface Params {
  data: AdminData;
  showToast: ShowToast;
  setActiveTab: (tab: AdminTabType) => void;
}

export function useLocationActions({ data, showToast, setActiveTab }: Params) {
  const { setLocations } = data;
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [selectedLocationForEdit, setSelectedLocationForEdit] = useState<PlantationLocationItem | null>(null);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);

  const handleCreateLocation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") as string).trim();
    const region = (fd.get("region") as string).trim();
    const gps = (fd.get("gps") as string).trim() || "18.5204° N, 73.8567° E";
    const areaHectares = Number(fd.get("areaHectares")) || 10;
    const capacity = Number(fd.get("capacity")) || 5000;
    const soilHealth =
      (fd.get("soilHealth") as string)?.trim() || "Rich Red Soil (pH 6.5, Moisture 35%)";
    const image =
      (fd.get("image") as string)?.trim() ||
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format";
    const status = (fd.get("status") as PlantationLocationItem["status"]) || "Active";

    const localLoc: PlantationLocationItem = {
      id: "loc-" + Date.now(),
      name,
      region,
      gps,
      areaHectares,
      capacity,
      treesPlanted: 0,
      survivalRate: "99.0%",
      ndviScore: 0.85,
      soilHealth,
      image,
      status,
    };

    try {
      const res = await locationService.create({
        name,
        region,
        gps,
        areaHectares,
        capacity,
        soilHealth,
        image,
        status,
      });

      if (res.data) {
        const uiLoc = locationService.mapToUiItem(res.data);
        setLocations((prev) => [uiLoc, ...prev.filter((l) => l.id !== uiLoc.id)]);
      } else {
        setLocations((prev) => [localLoc, ...prev]);
      }
    } catch (err) {
      console.warn("Location creation notice:", err);
      setLocations((prev) => [localLoc, ...prev]);
    }

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("poa_custom_locations");
        const custom = raw ? JSON.parse(raw) : [];
        localStorage.setItem("poa_custom_locations", JSON.stringify([...custom, localLoc]));
      } catch {}
    }

    setShowAddLocationModal(false);
    showToast(`Added reserve location "${name}"!`);
    setActiveTab("locations");
  };

  const handleUpdateLocation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedLocationForEdit) return;

    const fd = new FormData(e.currentTarget);
    const id = (fd.get("id") as string) || selectedLocationForEdit.id;
    const name = (fd.get("name") as string)?.trim() || selectedLocationForEdit.name;
    const region = (fd.get("region") as string)?.trim() || selectedLocationForEdit.region;
    const gps = (fd.get("gps") as string)?.trim() || selectedLocationForEdit.gps;
    const areaHectares = Number(fd.get("areaHectares")) || selectedLocationForEdit.areaHectares;
    const capacity = Number(fd.get("capacity")) || selectedLocationForEdit.capacity;
    const status =
      (fd.get("status") as PlantationLocationItem["status"]) || selectedLocationForEdit.status;
    const soilHealth =
      (fd.get("soilHealth") as string)?.trim() || selectedLocationForEdit.soilHealth;
    const ndviScore =
      Number(fd.get("ndviScore")) || selectedLocationForEdit.ndviScore || 0.88;
    const survivalRate =
      (fd.get("survivalRate") as string)?.trim() ||
      selectedLocationForEdit.survivalRate ||
      "99.0%";
    const image = (fd.get("image") as string)?.trim() || selectedLocationForEdit.image;

    setIsUpdatingLocation(true);
    try {
      const res = await locationService.update(id, {
        name,
        region,
        gps,
        areaHectares,
        capacity,
        status,
        soilHealth,
        ndviScore,
        survivalRate,
        image,
      });

      if (res.data) {
        const uiLoc = locationService.mapToUiItem(res.data);
        setLocations((prev) => prev.map((l) => (l.id === id ? uiLoc : l)));
      } else {
        setLocations((prev) =>
          prev.map((l) =>
            l.id === id
              ? {
                  ...l,
                  name,
                  region,
                  gps,
                  areaHectares,
                  capacity,
                  status,
                  soilHealth,
                  ndviScore,
                  survivalRate,
                  image,
                }
              : l
          )
        );
      }
      setSelectedLocationForEdit(null);
      showToast(`Updated reserve location "${name}"!`);
    } catch (err) {
      console.warn("Location update notice:", err);
      setLocations((prev) =>
        prev.map((l) =>
          l.id === id
            ? {
                ...l,
                name,
                region,
                gps,
                areaHectares,
                capacity,
                status,
                soilHealth,
                ndviScore,
                survivalRate,
                image,
              }
            : l
        )
      );
      setSelectedLocationForEdit(null);
      showToast(`Updated "${name}" locally.`);
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  return {
    showAddLocationModal,
    setShowAddLocationModal,
    selectedLocationForEdit,
    setSelectedLocationForEdit,
    isUpdatingLocation,
    handleCreateLocation,
    handleUpdateLocation,
  };
}

export type LocationActions = ReturnType<typeof useLocationActions>;

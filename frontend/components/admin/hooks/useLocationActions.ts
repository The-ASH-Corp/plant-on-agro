import { useState } from "react";
import { AdminTabType, PlantationLocationItem } from "../types";
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

  const handleCreateLocation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newLoc: PlantationLocationItem = {
      id: "loc-" + Date.now(),
      name: (fd.get("name") as string).trim(),
      region: (fd.get("region") as string).trim(),
      gps: (fd.get("gps") as string).trim() || "18.5204° N, 73.8567° E",
      areaHectares: Number(fd.get("areaHectares")) || 10,
      capacity: Number(fd.get("capacity")) || 5000,
      treesPlanted: 0,
      survivalRate: "99.0%",
      ndviScore: 0.85,
      soilHealth: (fd.get("soilHealth") as string).trim() || "Rich Red Soil (pH 6.5, Moisture 35%)",
      image:
        (fd.get("image") as string).trim() ||
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
      status: "Active",
    };
    setLocations((prev) => {
      const next = [...prev, newLoc];
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("poa_custom_locations");
          const custom = raw ? JSON.parse(raw) : [];
          localStorage.setItem("poa_custom_locations", JSON.stringify([...custom, newLoc]));
        } catch {}
      }
      return next;
    });
    setShowAddLocationModal(false);
    showToast(`Added reserve location "${newLoc.name}"!`);
    setActiveTab("locations");
  };

  return { showAddLocationModal, setShowAddLocationModal, handleCreateLocation };
}

export type LocationActions = ReturnType<typeof useLocationActions>;

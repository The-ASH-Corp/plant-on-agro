import { useState } from "react";
import { AdminTabType, TreeVarietyItem } from "../types";
import { treeVarietyService } from "@/services/tree-varieties/tree-variety.service";
import type { AdminData } from "./useAdminData";
import type { ShowToast } from "./useAdminToast";

interface Params {
  data: AdminData;
  showToast: ShowToast;
  setActiveTab: (tab: AdminTabType) => void;
}

export function useTreeActions({ data, showToast, setActiveTab }: Params) {
  const { trees, setTrees } = data;
  const [showAddTreeModal, setShowAddTreeModal] = useState(false);
  const [selectedTreeForEdit, setSelectedTreeForEdit] = useState<TreeVarietyItem | null>(null);
  const [isUpdatingTree, setIsUpdatingTree] = useState(false);

  const handleCreateTree = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const commonName = (fd.get("name") as string).trim();
    const scientificName = (fd.get("sci") as string).trim();
    const category = fd.get("category") as TreeVarietyItem["category"];
    const price = Number(fd.get("price")) || 299;
    const co2 = Number(fd.get("co2")) || 25;
    const location = (fd.get("location") as string).trim() || "Western Ghats, Maharashtra";
    const growth = (fd.get("growth") as string).trim() || "10–12 m in 5 years";
    const careRequirements =
      (fd.get("careRequirements") as string)?.trim() ||
      "Weekly watering in early stages, adequate sunlight, organic soil";
    const img =
      (fd.get("img") as string).trim() ||
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format";
    const desc =
      (fd.get("desc") as string).trim() ||
      "Newly catalogued botanical variety for agroforestry.";

    const duplicateExists = trees.some(
      (t) => t.name.trim().toLowerCase() === commonName.toLowerCase()
    );
    if (duplicateExists) {
      showToast(`Tree name "${commonName}" already exists`);
      return;
    }

    const buildLocalTree = (): TreeVarietyItem => ({
      id: "tree-" + (trees.length + 1),
      name: commonName,
      sci: scientificName,
      category,
      price,
      location,
      growth,
      img,
      desc,
      co2PerYearKg: co2,
      careRequirements,
    });

    try {
      const res = await treeVarietyService.create({
        commonName,
        scientificName,
        category,
        price,
        co2AbsorptionRateKgYear: co2,
        growthTimeline: growth,
        careRequirements,
        coverImages: [img],
        location,
        description: desc,
      });

      if (res.data) {
        const uiTree = treeVarietyService.mapToUiItem(res.data);
        setTrees((prev) => [uiTree, ...prev.filter((t) => t.id !== uiTree.id)]);
      } else {
        setTrees((prev) => [buildLocalTree(), ...prev]);
      }

      setShowAddTreeModal(false);
      showToast(`Added "${commonName}" to tree catalog!`);
      setActiveTab("trees");
    } catch (err: any) {
      console.warn("Tree creation notice:", err);
      showToast(err?.message || `Tree name "${commonName}" already exists`);
    }
  };

  const handleUpdateTree = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTreeForEdit) return;

    const fd = new FormData(e.currentTarget);
    const id = (fd.get("id") as string) || selectedTreeForEdit.id;
    const commonName = (fd.get("name") as string)?.trim() || selectedTreeForEdit.name;
    const scientificName = (fd.get("sci") as string)?.trim() || selectedTreeForEdit.sci;
    const category = (fd.get("category") as TreeVarietyItem["category"]) || selectedTreeForEdit.category;
    const price = Number(fd.get("price")) || selectedTreeForEdit.price;
    const co2 = Number(fd.get("co2")) || selectedTreeForEdit.co2PerYearKg || 25;
    const location = (fd.get("location") as string)?.trim() || selectedTreeForEdit.location;
    const growth = (fd.get("growth") as string)?.trim() || selectedTreeForEdit.growth;
    const careRequirements =
      (fd.get("careRequirements") as string)?.trim() ||
      selectedTreeForEdit.careRequirements ||
      "Weekly watering in early stages, adequate sunlight, organic soil";
    const img = (fd.get("img") as string)?.trim() || selectedTreeForEdit.img;
    const desc = (fd.get("desc") as string)?.trim() || selectedTreeForEdit.desc;
    const isActive = fd.get("isActive") !== null;

    const duplicateExists = trees.some(
      (t) => t.id !== id && t.name.trim().toLowerCase() === commonName.toLowerCase()
    );
    if (duplicateExists) {
      showToast(`Tree name "${commonName}" already exists`);
      return;
    }

    const applyLocalUpdate = () =>
      setTrees((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                name: commonName,
                sci: scientificName,
                commonName,
                scientificName,
                category,
                price,
                location,
                growth,
                growthTimeline: growth,
                img,
                coverImages: [img],
                desc,
                description: desc,
                co2PerYearKg: co2,
                co2AbsorptionRateKgYear: co2,
                careRequirements,
                isActive,
              }
            : t
        )
      );

    setIsUpdatingTree(true);
    try {
      const res = await treeVarietyService.update(id, {
        commonName,
        scientificName,
        category,
        price,
        co2AbsorptionRateKgYear: co2,
        growthTimeline: growth,
        careRequirements,
        coverImages: img ? [img] : undefined,
        location,
        description: desc,
        isActive,
      });

      if (res.data) {
        const updatedUiTree = treeVarietyService.mapToUiItem(res.data);
        setTrees((prev) => prev.map((t) => (t.id === id ? updatedUiTree : t)));
      } else {
        applyLocalUpdate();
      }
      setSelectedTreeForEdit(null);
      showToast(`Updated tree variety "${commonName}"!`);
    } catch (err: any) {
      console.warn("Tree update notice:", err);
      showToast(err?.message || "Failed to update tree variety");
    } finally {
      setIsUpdatingTree(false);
    }
  };

  return {
    showAddTreeModal,
    setShowAddTreeModal,
    selectedTreeForEdit,
    setSelectedTreeForEdit,
    isUpdatingTree,
    handleCreateTree,
    handleUpdateTree,
  };
}

export type TreeActions = ReturnType<typeof useTreeActions>;

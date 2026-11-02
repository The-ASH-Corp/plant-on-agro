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
    const currentUniversalPrice = trees.length > 0 && typeof trees[0].price === "number" ? trees[0].price : 349;
    const price = currentUniversalPrice;
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
    } catch (err) {
      console.warn("Tree creation notice:", err);
      setTrees((prev) => [buildLocalTree(), ...prev]);
    }
    setShowAddTreeModal(false);
    showToast(`Added "${commonName}" to tree catalog at universal price ₹${price}!`);
    setActiveTab("trees");
  };

  const handleUpdateTree = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTreeForEdit) return;

    const fd = new FormData(e.currentTarget);
    const id = (fd.get("id") as string) || selectedTreeForEdit.id;
    const commonName = (fd.get("name") as string)?.trim() || selectedTreeForEdit.name;
    const scientificName = (fd.get("sci") as string)?.trim() || selectedTreeForEdit.sci;
    const category = (fd.get("category") as TreeVarietyItem["category"]) || selectedTreeForEdit.category;
    const inputPrice = Number(fd.get("price"));
    const price = !isNaN(inputPrice) && inputPrice >= 0 ? inputPrice : selectedTreeForEdit.price;
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
            : {
                ...t,
                price, // Synchronize all trees to the same price
              }
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
        // Also ensure all trees in state have this updated universal price
        setTrees((prev) =>
          prev.map((t) =>
            t.id === id
              ? treeVarietyService.mapToUiItem(res.data!)
              : { ...t, price }
          )
        );
      } else {
        applyLocalUpdate();
      }
      setSelectedTreeForEdit(null);
      showToast(`Updated "${commonName}" & synced all trees to ₹${price}!`);
    } catch (err) {
      console.warn("Tree update notice:", err);
      applyLocalUpdate();
      setSelectedTreeForEdit(null);
      showToast(`Updated "${commonName}" locally.`);
    } finally {
      setIsUpdatingTree(false);
    }
  };

  const handleSetUniversalPrice = async (newPrice: number) => {
    if (isNaN(newPrice) || newPrice < 0) return;
    try {
      await treeVarietyService.updateUniversalPrice(newPrice);
    } catch (err) {
      console.warn("Failed to update universal price on backend:", err);
    }
    // Update all trees in state
    setTrees((prev) => prev.map((t) => ({ ...t, price: newPrice })));
    showToast(`Universal adoption price set to ₹${newPrice} for all trees!`);
  };

  const universalPrice = trees.length > 0 && typeof trees[0].price === "number" ? trees[0].price : 349;

  return {
    showAddTreeModal,
    setShowAddTreeModal,
    selectedTreeForEdit,
    setSelectedTreeForEdit,
    isUpdatingTree,
    universalPrice,
    handleCreateTree,
    handleUpdateTree,
    handleSetUniversalPrice,
  };
}

export type TreeActions = ReturnType<typeof useTreeActions>;

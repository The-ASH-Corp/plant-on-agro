import { useState } from "react";
import { AdminTabType, AdoptionPlanItem, OccasionDedicationType } from "../types";
import { adoptionPlanService } from "@/services/adoption-plans/adoption-plan.service";
import type { AdminData } from "./useAdminData";
import type { ShowToast } from "./useAdminToast";

interface Params {
  data: AdminData;
  showToast: ShowToast;
  setActiveTab: (tab: AdminTabType) => void;
}

const parseFeatures = (raw: string) =>
  raw
    .split(/[\n,]+/)
    .map((f) => f.trim())
    .filter((f) => f.length > 0);

export function usePlanActions({ data, showToast, setActiveTab }: Params) {
  const { setPlans } = data;
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<AdoptionPlanItem | null>(null);
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);

  const handleCreatePlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const planLabel = (fd.get("label") as string).trim();
    const icon = (fd.get("icon") as string).trim() || "🌱";
    const priceModifier = Number(fd.get("price")) || 0;
    const badge = (fd.get("badge") as string).trim() || "Standard";
    const description = (fd.get("desc") as string).trim();
    const features = parseFeatures((fd.get("features") as string) || "");

    // Parse occasion dedications
    let occasionDedications: OccasionDedicationType[] = ["general"];
    try {
      const rawOccasions = fd.get("occasionDedications") as string;
      if (rawOccasions) {
        occasionDedications = JSON.parse(rawOccasions);
      }
    } catch {
      occasionDedications = ["general"];
    }

    try {
      const res = await adoptionPlanService.create({
        planLabel,
        icon,
        priceModifier,
        badge,
        description,
        features,
        occasionDedications,
      });

      if (res.data) {
        const uiPlan = adoptionPlanService.mapToUiItem(res.data);
        setPlans((prev) => [uiPlan, ...prev.filter((p) => p.id !== uiPlan.id)]);
      } else {
        const fallbackPlan: AdoptionPlanItem = {
          id: "plan-" + Date.now(),
          label: planLabel,
          planLabel,
          icon,
          desc: description,
          description,
          price: priceModifier,
          priceModifier,
          features,
          occasionDedications,
          badge,
          activeCount: 0,
        };
        setPlans((prev) => [fallbackPlan, ...prev]);
      }

      setShowAddPlanModal(false);
      showToast(`Added adoption plan "${planLabel}"!`);
      setActiveTab("plans");
    } catch (err: any) {
      console.warn("Plan creation notice:", err);
      showToast(err.message || "Failed to create adoption plan");
    }
  };

  const handleUpdatePlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPlanForEdit) return;

    const fd = new FormData(e.currentTarget);
    const id = (fd.get("id") as string) || selectedPlanForEdit.id;
    const planLabel = (fd.get("label") as string)?.trim() || selectedPlanForEdit.label;
    const icon = (fd.get("icon") as string)?.trim() || selectedPlanForEdit.icon || "🌱";
    const priceModifier = Number(fd.get("price")) || 0;
    const badge = (fd.get("badge") as string)?.trim() || "Standard";
    const description = (fd.get("desc") as string)?.trim() || "";
    const features = parseFeatures((fd.get("features") as string) || "");

    // Parse occasion dedications
    let occasionDedications: OccasionDedicationType[] = [];
    const occasionFromAll = fd.getAll("occasions") as string[];
    if (occasionFromAll.length > 0) {
      occasionDedications = occasionFromAll as OccasionDedicationType[];
    } else {
      try {
        const rawOccasions = fd.get("occasionDedications") as string;
        if (rawOccasions) {
          occasionDedications = JSON.parse(rawOccasions);
        }
      } catch {
        occasionDedications = selectedPlanForEdit.occasionDedications || ["general"];
      }
    }
    if (occasionDedications.length === 0) {
      occasionDedications = ["general"];
    }

    const isActive = fd.get("isActive") !== null;

    const applyLocalUpdate = () =>
      setPlans((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                label: planLabel,
                planLabel,
                icon,
                desc: description,
                description,
                price: priceModifier,
                priceModifier,
                features,
                occasionDedications,
                badge,
                isActive,
              }
            : p
        )
      );

    setIsUpdatingPlan(true);
    try {
      const res = await adoptionPlanService.update(id, {
        planLabel,
        icon,
        priceModifier,
        badge,
        description,
        features,
        occasionDedications,
        isActive,
      });

      if (res.data) {
        const updatedUiPlan = adoptionPlanService.mapToUiItem(res.data);
        setPlans((prev) => prev.map((p) => (p.id === id ? updatedUiPlan : p)));
      } else {
        applyLocalUpdate();
      }

      setSelectedPlanForEdit(null);
      showToast(`Updated adoption plan "${planLabel}"!`);
    } catch (err: any) {
      console.warn("Plan update notice:", err);
      // Fallback optimistic update
      applyLocalUpdate();
      setSelectedPlanForEdit(null);
      showToast(`Updated "${planLabel}" locally.`);
    } finally {
      setIsUpdatingPlan(false);
    }
  };

  return {
    showAddPlanModal,
    setShowAddPlanModal,
    selectedPlanForEdit,
    setSelectedPlanForEdit,
    isUpdatingPlan,
    handleCreatePlan,
    handleUpdatePlan,
  };
}

export type PlanActions = ReturnType<typeof usePlanActions>;

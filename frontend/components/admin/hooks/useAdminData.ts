import { useEffect, useState } from "react";
import {
  AdoptionOrder,
  AdoptionPlanItem,
  PlantationLocationItem,
  TreeInstanceItem,
  TreeVarietyItem,
} from "../types";
import { User } from "@/types/auth";
import { Certificate, certificateService } from "@/services/certificates/certificate.service";
import { treeVarietyService } from "@/services/tree-varieties/tree-variety.service";
import { adoptionPlanService } from "@/services/adoption-plans/adoption-plan.service";
import { treeInstanceService } from "@/services/tree-instances/tree-instance.service";
import { userService } from "@/services/user/user.service";
import { orderService } from "@/services/orders/order.service";
import { locationService } from "@/services/locations/location.service";
import { deriveLocationsFromData, deriveOrdersFromInstances } from "../utils/deriveAdminData";
import type { ShowToast } from "./useAdminToast";

function loadStoredOrders(): AdoptionOrder[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("poa_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not load stored orders:", e);
    }
  }
  return [];
}

/** Holds all admin dashboard collections and loads them from the backend on mount. */
export function useAdminData(showToast: ShowToast) {
  const [trees, setTrees] = useState<TreeVarietyItem[]>([]);
  const [plans, setPlans] = useState<AdoptionPlanItem[]>([]);
  const [instances, setInstances] = useState<TreeInstanceItem[]>([]);
  const [locations, setLocations] = useState<PlantationLocationItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<AdoptionOrder[]>(loadStoredOrders);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // Listen for real-time new orders placed from client storefront
  useEffect(() => {
    const handleNewOrder = (e: any) => {
      if (e.detail?.order) {
        const newOrd = e.detail.order as AdoptionOrder;
        setOrders((prev) => [newOrd, ...prev.filter((o) => o.orderNumber !== newOrd.orderNumber)]);
        showToast(
          `🎉 New Order Received! ${newOrd.orderNumber} from ${newOrd.adopterName} (₹${newOrd.totalAmount.toLocaleString()})`
        );
        if (Array.isArray(e.detail?.instances)) {
          const newInsts = e.detail.instances as TreeInstanceItem[];
          const newInstIds = new Set(newInsts.map((i) => i.id));
          setInstances((prev) => [...newInsts, ...prev.filter((i) => !newInstIds.has(i.id))]);
        } else if (e.detail?.instance) {
          const newInst = e.detail.instance as TreeInstanceItem;
          setInstances((prev) => [newInst, ...prev.filter((i) => i.id !== newInst.id)]);
        }
      } else if (e.detail?.orderNumber) {
        const newOrd = e.detail as AdoptionOrder;
        setOrders((prev) => [newOrd, ...prev.filter((o) => o.orderNumber !== newOrd.orderNumber)]);
        showToast(
          `🎉 New Order Received! ${newOrd.orderNumber} from ${newOrd.adopterName} (₹${newOrd.totalAmount.toLocaleString()})`
        );
      }
    };

    window.addEventListener("poa-new-order", handleNewOrder);
    return () => {
      window.removeEventListener("poa-new-order", handleNewOrder);
    };
  }, [showToast]);

  // Load real tree varieties, adoption plans, and tree instances from backend API on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      try {
        const [treesRes, plansRes, instancesRes, usersRes, ordersRes, certsRes, locationsRes] = await Promise.all([
          treeVarietyService.getAll(),
          adoptionPlanService.getAll(),
          treeInstanceService.getAll(),
          userService.listUsers(100, 0).catch((err) => {
            console.warn("Could not load users:", err);
            return null;
          }),
          orderService.getAll({ limit: 200 }),
          certificateService.getCertificates({ limit: 200 }).catch((err) => {
            console.warn("Could not load certificates:", err);
            return null;
          }),
          locationService.getAll({ limit: 100 }).catch((err) => {
            console.warn("Could not load locations from backend:", err);
            return null;
          }),
        ]);
        if (!isMounted) return;

        const apiTrees = treesRes.data?.items ? treesRes.data.items.map(treeVarietyService.mapToUiItem) : [];
        const apiPlans = plansRes.data?.items ? plansRes.data.items.map(adoptionPlanService.mapToUiItem) : [];
        const apiInstances = instancesRes.data?.items ? instancesRes.data.items.map(treeInstanceService.mapToUiItem) : [];

        setTrees(apiTrees);
        setPlans(apiPlans);
        setInstances(apiInstances);

        if (usersRes?.data) {
          const raw = usersRes.data;
          const userItems = Array.isArray(raw) ? raw : (raw.items || []);
          setUsers(userItems);
        }

        if (certsRes?.data?.items) {
          setCertificates(certsRes.data.items);
        }

        // Count live trees planted per reserve
        const treeCountMap: Record<string, number> = {};
        (instancesRes.data?.items || []).forEach((i: any) => {
          const resName = i.assignedReserve;
          if (resName) {
            treeCountMap[resName] = (treeCountMap[resName] || 0) + 1;
          }
        });

        // Load bio-reserves from backend API with fallback to local deriving
        if (locationsRes?.data?.items && locationsRes.data.items.length > 0) {
          const apiLocations = locationsRes.data.items.map((item) => {
            const uiLoc = locationService.mapToUiItem(item);
            const liveCount = treeCountMap[uiLoc.name] || uiLoc.treesPlanted || 0;
            return {
              ...uiLoc,
              treesPlanted: liveCount,
              status: liveCount >= uiLoc.capacity ? ("Full" as const) : liveCount > 500 ? ("Expanding" as const) : uiLoc.status,
            };
          });
          setLocations(apiLocations);
        } else {
          let customLocations: PlantationLocationItem[] = [];
          if (typeof window !== "undefined") {
            try {
              const raw = localStorage.getItem("poa_custom_locations");
              if (raw) customLocations = JSON.parse(raw);
            } catch {}
          }

          setLocations(
            deriveLocationsFromData(instancesRes.data?.items || [], treesRes.data?.items || [], customLocations)
          );
        }

        // Dynamically load adoption orders directly from MongoDB database (collection: adoptionorders)
        if (ordersRes.data?.items && ordersRes.data.items.length > 0) {
          setOrders(ordersRes.data.items.map(orderService.mapToUiItem));
        } else {
          // Graceful fallback to derive from instances if adoptionorders collection is empty
          setOrders(deriveOrdersFromInstances(instancesRes.data?.items || [], []));
        }
      } catch (err) {
        console.warn("Could not load catalog from backend:", err);
      }
    }
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  return {
    trees, setTrees,
    plans, setPlans,
    instances, setInstances,
    locations, setLocations,
    users, setUsers,
    orders, setOrders,
    certificates, setCertificates,
  };
}

export type AdminData = ReturnType<typeof useAdminData>;

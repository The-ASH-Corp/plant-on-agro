"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

// Types
import {
  AdminTabType,
  TreeVarietyItem,
  AdoptionPlanItem,
  PlantationLocationItem,
  AdoptionOrder,
  AdoptionOrderStatus,
} from "./types";

// Layout Components
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminToast } from "./AdminToast";

// Tab Components
import { OverviewTab } from "./tabs/OverviewTab";
import { TreesTab } from "./tabs/TreesTab";
import { PlansTab } from "./tabs/PlansTab";
import { TreeInstancesTab } from "./tabs/TreeInstancesTab";
import { LocationsTab } from "./tabs/LocationsTab";
import { OrdersTab } from "./tabs/OrdersTab";
import { LandingPageTab } from "./tabs/LandingPageTab";

// Modal Components
import { AddTreeModal } from "./modals/AddTreeModal";
import { EditTreeModal } from "./modals/EditTreeModal";
import { AddPlanModal } from "./modals/AddPlanModal";
import { EditPlanModal } from "./modals/EditPlanModal";
import { AddTreeInstanceModal } from "./modals/AddTreeInstanceModal";
import { AddLocationModal } from "./modals/AddLocationModal";
import { OrderDetailsModal } from "./modals/OrderDetailsModal";
import { DeleteConfirmationModal } from "./modals/DeleteConfirmationModal";

import { treeVarietyService } from "@/services/tree-varieties/tree-variety.service";
import { adoptionPlanService } from "@/services/adoption-plans/adoption-plan.service";
import { treeInstanceService } from "@/services/tree-instances/tree-instance.service";
import { orderService } from "@/services/orders/order.service";
import { OccasionDedicationType, TreeInstanceItem, TreeHealthStatus } from "./types";

// Re-export types for backward compatibility
export type {
  AdminTabType,
  TreeVarietyItem,
  AdoptionPlanItem,
  TreeInstanceItem,
  PlantationLocationItem,
  AdoptionOrder,
  AdoptionOrderStatus,
};

function deriveOrdersFromInstances(
  instances: any[],
  storedOrders: AdoptionOrder[] = []
): AdoptionOrder[] {
  const storedByOrderNum = new Map<string, AdoptionOrder>();
  for (const o of storedOrders) {
    storedByOrderNum.set(o.orderNumber, o);
  }

  // Group instances by orderRef
  const groups = new Map<string, any[]>();
  for (const inst of instances) {
    const key = inst.orderRef || inst.treeTag;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(inst);
  }

  const derived: AdoptionOrder[] = [];
  for (const [orderNumber, insts] of groups.entries()) {
    const first = insts[0];
    const existing = storedByOrderNum.get(orderNumber);
    const qty = insts.length;

    let status: AdoptionOrderStatus = existing?.status || "Planted";
    if (first.notes && first.notes.includes("New Request")) status = "New Request";
    else if (first.notes && first.notes.includes("Verified")) status = "Verified & Tagged";

    let planType = existing?.planType || "Individual";
    const planMatch = first.notes ? first.notes.match(/under "(.*?)"/) : null;
    if (planMatch && planMatch[1]) planType = planMatch[1];

    derived.push({
      id: existing?.id || `ord-${orderNumber}`,
      orderNumber,
      adopterName: first.adopterName || "Verified Adopter",
      adopterEmail: first.adopterEmail || "adopter@example.com",
      treeSpecies: first.treeVarietyName || "Indigenous Tree",
      scientificName: existing?.scientificName || "Botanical Specimen",
      category: existing?.category || "Native Trees",
      reserveName: first.assignedReserve,
      gpsCoords: first.formattedGps || `${first.gpsCoordinates?.latitude}° N, ${first.gpsCoordinates?.longitude}° E`,
      planType,
      quantity: qty,
      totalAmount: existing?.totalAmount || qty * 399,
      datePlanted: typeof first.datePlanted === "string" ? first.datePlanted : new Date(first.datePlanted).toISOString().split("T")[0],
      status,
      certificateId: existing?.certificateId || `CERT-${orderNumber}`,
      ndviScore: existing?.ndviScore || 0.91,
      isRead: existing?.isRead !== undefined ? existing.isRead : true,
      createdAt: first.createdAt || new Date().toISOString(),
    });
  }

  // Include any extra stored orders that might not yet have instances in DB
  for (const o of storedOrders) {
    if (!groups.has(o.orderNumber)) {
      derived.push(o);
    }
  }

  return derived;
}

function deriveLocationsFromData(
  instances: any[],
  varieties: any[],
  customLocations: PlantationLocationItem[] = []
): PlantationLocationItem[] {
  const reserveConfigs: Record<
    string,
    { region: string; gps: string; areaHectares: number; capacity: number; image: string }
  > = {
    "Western Ghats, Maharashtra": {
      region: "Sahyadri Mountain Range, MH",
      gps: "18.9894° N, 73.4428° E",
      areaHectares: 48.5,
      capacity: 15000,
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
    },
    "Western Ghats Ecological Corridor, MH": {
      region: "Sahyadri Mountain Range, MH",
      gps: "18.9894° N, 73.4428° E",
      areaHectares: 52.0,
      capacity: 18000,
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
    },
    "Nashik Valley, Maharashtra": {
      region: "Godavari River Basin, MH",
      gps: "19.9975° N, 73.7898° E",
      areaHectares: 26.2,
      capacity: 8500,
      image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&h=400&fit=crop&auto=format",
    },
    "Satara Plateau, Maharashtra": {
      region: "Kaas UNESCO Biosphere, MH",
      gps: "17.6805° N, 73.9904° E",
      areaHectares: 34.0,
      capacity: 11000,
      image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&h=400&fit=crop&auto=format",
    },
    "Nagpur Forest Zone": {
      region: "Vidarbha Dry Deciduous Belt, MH",
      gps: "21.1458° N, 79.0882° E",
      areaHectares: 62.0,
      capacity: 22000,
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=400&fit=crop&auto=format",
    },
    "Aurangabad Green Belt": {
      region: "Marathwada Semi-Arid Zone, MH",
      gps: "19.8762° N, 75.3433° E",
      areaHectares: 18.5,
      capacity: 6000,
      image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&h=400&fit=crop&auto=format",
    },
    "Pune Hills, Maharashtra": {
      region: "Deccan Plateau Foothills, MH",
      gps: "18.5204° N, 73.8567° E",
      areaHectares: 15.0,
      capacity: 5000,
      image: "https://images.unsplash.com/photo-1511497584788-87676104235f?w=600&h=400&fit=crop&auto=format",
    },
  };

  const activeReserves = new Set<string>();
  instances.forEach((i: any) => i.assignedReserve && activeReserves.add(i.assignedReserve));
  varieties.forEach((v: any) => v.location && activeReserves.add(v.location));
  customLocations.forEach((c) => c.name && activeReserves.add(c.name));

  const treeCountMap: Record<string, number> = {};
  instances.forEach((i: any) => {
    const resName = i.assignedReserve;
    treeCountMap[resName] = (treeCountMap[resName] || 0) + 1;
  });

  const locationsList: PlantationLocationItem[] = [];
  let idx = 1;
  for (const reserveName of activeReserves) {
    const custom = customLocations.find((c) => c.name === reserveName);
    const config = custom || reserveConfigs[reserveName] || {
      region: "Registered Reserve Sector",
      gps: "19.0000° N, 74.0000° E",
      areaHectares: 25.0,
      capacity: 10000,
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
    };

    const count = treeCountMap[reserveName] || 0;
    locationsList.push({
      id: custom?.id || `loc-db-${idx++}`,
      name: reserveName,
      region: config.region,
      gps: config.gps,
      areaHectares: config.areaHectares,
      capacity: config.capacity,
      treesPlanted: count,
      survivalRate: custom?.survivalRate || "100%",
      ndviScore: custom?.ndviScore || 0.88,
      soilHealth: custom?.soilHealth || "Optimal Loam",
      image: config.image,
      status: count >= config.capacity ? "Full" : count > 500 ? "Expanding" : "Active",
    });
  }

  return locationsList;
}

export function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTabType>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dynamic Lists State
  const [trees, setTrees] = useState<TreeVarietyItem[]>([]);
  const [plans, setPlans] = useState<AdoptionPlanItem[]>([]);
  const [instances, setInstances] = useState<TreeInstanceItem[]>([]);
  const [locations, setLocations] = useState<PlantationLocationItem[]>([]);
  const [orders, setOrders] = useState<AdoptionOrder[]>(() => {
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
  });

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
  }, []);

  // Load real tree varieties, adoption plans, and tree instances from backend API on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      try {
        const [treesRes, plansRes, instancesRes, ordersRes] = await Promise.all([
          treeVarietyService.getAll(),
          adoptionPlanService.getAll(),
          treeInstanceService.getAll(),
          orderService.getAll({ limit: 200 }),
        ]);
        if (isMounted) {
          const apiTrees = treesRes.data?.items ? treesRes.data.items.map(treeVarietyService.mapToUiItem) : [];
          const apiPlans = plansRes.data?.items ? plansRes.data.items.map(adoptionPlanService.mapToUiItem) : [];
          const apiInstances = instancesRes.data?.items ? instancesRes.data.items.map(treeInstanceService.mapToUiItem) : [];

          setTrees(apiTrees);
          setPlans(apiPlans);
          setInstances(apiInstances);

          // Dynamically derive bio-reserves from database records + custom locations
          let customLocations: PlantationLocationItem[] = [];
          if (typeof window !== "undefined") {
            try {
              const raw = localStorage.getItem("poa_custom_locations");
              if (raw) customLocations = JSON.parse(raw);
            } catch {}
          }

          const derivedLocations = deriveLocationsFromData(
            instancesRes.data?.items || [],
            treesRes.data?.items || [],
            customLocations
          );
          setLocations(derivedLocations);

          // Dynamically load adoption orders directly from MongoDB database (collection: adoptionorders)
          if (ordersRes.data?.items && ordersRes.data.items.length > 0) {
            const apiOrders = ordersRes.data.items.map(orderService.mapToUiItem);
            setOrders(apiOrders);
          } else {
            // Graceful fallback to derive from instances if adoptionorders collection is empty
            const derivedOrders = deriveOrdersFromInstances(
              instancesRes.data?.items || [],
              []
            );
            setOrders(derivedOrders);
          }
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

  // Modals State
  const [showAddTreeModal, setShowAddTreeModal] = useState(false);
  const [selectedTreeForEdit, setSelectedTreeForEdit] = useState<TreeVarietyItem | null>(null);
  const [isUpdatingTree, setIsUpdatingTree] = useState(false);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<AdoptionPlanItem | null>(null);
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);
  const [showAddInstanceModal, setShowAddInstanceModal] = useState(false);
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdoptionOrder | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: "tree" | "plan" | "instance" | "location";
    id: string;
    name: string;
    description?: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Unread / New Orders Tracking
  const unreadOrdersCount = orders.filter(
    (o) => o.isRead === false || o.status === "New Request"
  ).length;

  const handleUpdateOrderStatus = async (orderIdentifier: string, newStatus: AdoptionOrderStatus) => {
    const targetOrder = orders.find(
      (o) => o.orderNumber === orderIdentifier || o.id === orderIdentifier
    );

    setOrders((prev) => {
      const updated = prev.map((o) => {
        if (o.orderNumber === orderIdentifier || o.id === orderIdentifier) {
          return { ...o, status: newStatus, isRead: true };
        }
        return o;
      });
      try {
        localStorage.setItem("poa_orders", JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save updated orders:", e);
      }
      return updated;
    });

    if (
      selectedOrder &&
      (selectedOrder.orderNumber === orderIdentifier || selectedOrder.id === orderIdentifier)
    ) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus, isRead: true } : null));
    }

    // Persist status change directly to MongoDB backend order entity
    if (targetOrder?.id) {
      try {
        await orderService.updateStatus(targetOrder.id, newStatus);
      } catch (orderApiErr) {
        console.warn("Failed to persist order status to backend API:", orderApiErr);
      }
    }

    // Persist status change to matching tree instances in database
    const matchingInsts = instances.filter(
      (i) => i.orderRef === orderIdentifier || i.treeTag === orderIdentifier
    );
    for (const inst of matchingInsts) {
      try {
        const cleanNotes = inst.notes ? inst.notes.replace(/Status: [^.]+\.\s*/, "") : "";
        await treeInstanceService.update(inst.id, {
          notes: `Status: ${newStatus}. ${cleanNotes}`,
        });
      } catch (err) {
        console.warn("Failed to persist order status to instance in DB:", err);
      }
    }

    showToast(`✓ Order ${targetOrder?.orderNumber || orderIdentifier} status changed to "${newStatus}"`);
  };

  const handleMarkAllOrdersAsRead = async () => {
    try {
      await orderService.markAllAsRead();
    } catch (err) {
      console.warn("Failed to mark all orders as read in backend:", err);
    }

    setOrders((prev) => {
      const updated = prev.map((o) => ({ ...o, isRead: true }));
      try {
        localStorage.setItem("poa_orders", JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save read orders:", e);
      }
      return updated;
    });
    showToast("✓ All adoption requests marked as reviewed.");
  };

  const handleSelectOrder = async (order: AdoptionOrder) => {
    setSelectedOrder(order);
    if (order.isRead === false) {
      setOrders((prev) => {
        const updated = prev.map((o) => (o.id === order.id ? { ...o, isRead: true } : o));
        try {
          localStorage.setItem("poa_orders", JSON.stringify(updated));
        } catch {}
        return updated;
      });

      if (order.id) {
        try {
          await orderService.updateStatus(order.id, order.status);
        } catch (err) {
          console.warn("Could not mark order read on backend:", err);
        }
      }
    }
  };

  const handleExportOrdersCSV = () => {
    if (orders.length === 0) {
      showToast("No orders available to export.");
      return;
    }
    const headers = [
      "Order Number",
      "Invoice Number",
      "Adopter Name",
      "Adopter Email",
      "Phone",
      "Species",
      "Plantation Reserve",
      "GPS Coordinates",
      "Plan Package",
      "Quantity",
      "Total Amount (INR)",
      "Payment Method",
      "Payment Status",
      "Transaction Ref",
      "Order Status",
      "Certificate ID",
      "Date Adopted",
    ];
    const rows = orders.map((o) => [
      `"${o.orderNumber}"`,
      `"${o.invoiceNumber || ""}"`,
      `"${(o.adopterName || "").replace(/"/g, '""')}"`,
      `"${(o.adopterEmail || "").replace(/"/g, '""')}"`,
      `"${o.adopterPhone || ""}"`,
      `"${(o.treeSpecies || "").replace(/"/g, '""')}"`,
      `"${(o.reserveName || "").replace(/"/g, '""')}"`,
      `"${(o.gpsCoords || "").replace(/"/g, '""')}"`,
      `"${(o.planType || "").replace(/"/g, '""')}"`,
      o.quantity || 1,
      o.totalAmount || 0,
      `"${o.paymentMethod || "sandbox"}"`,
      `"${o.paymentStatus || "Paid"}"`,
      `"${o.transactionRef || ""}"`,
      `"${o.status || ""}"`,
      `"${o.certificateId || ""}"`,
      `"${o.datePlanted || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `PlantOnAgro_Adoption_Orders_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("✓ Downloaded adoption orders CSV register.");
  };

  // Auth Store & Access Guard
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const logout = useAuthStore((s) => s.logout);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!hasHydrated && useAuthStore.persist?.hasHydrated?.()) {
      useAuthStore.getState().setHasHydrated(true);
    }
  }, [hasHydrated]);

  useEffect(() => {
    if (!mounted) return;
    const storeHydrated = hasHydrated || (useAuthStore.persist?.hasHydrated?.() ?? false);
    if (!storeHydrated) return;

    // Only redirect if rehydration has finished and the user is verified not to be admin
    if (!isAuthenticated || user?.role !== "admin") {
      router.replace("/login");
    }
  }, [mounted, hasHydrated, isAuthenticated, user, router]);

  // Create Handlers
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
        const localTree: TreeVarietyItem = {
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
        };
        setTrees((prev) => [localTree, ...prev]);
      }
      setShowAddTreeModal(false);
      showToast(`Added "${commonName}" to tree catalog!`);
      setActiveTab("trees");
    } catch (err) {
      console.warn("Tree creation notice:", err);
      const localTree: TreeVarietyItem = {
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
      };
      setTrees((prev) => [localTree, ...prev]);
      setShowAddTreeModal(false);
      showToast(`Added "${commonName}" to tree catalog!`);
      setActiveTab("trees");
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
      }
      setSelectedTreeForEdit(null);
      showToast(`Updated tree variety "${commonName}"!`);
    } catch (err) {
      console.warn("Tree update notice:", err);
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
      setSelectedTreeForEdit(null);
      showToast(`Updated "${commonName}" locally.`);
    } finally {
      setIsUpdatingTree(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const planLabel = (fd.get("label") as string).trim();
    const icon = (fd.get("icon") as string).trim() || "🌱";
    const priceModifier = Number(fd.get("price")) || 0;
    const badge = (fd.get("badge") as string).trim() || "Standard";
    const description = (fd.get("desc") as string).trim();

    // Parse features
    const rawFeatures = (fd.get("features") as string) || "";
    const features = rawFeatures
      .split(/[\n,]+/)
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

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

    // Parse features
    const rawFeatures = (fd.get("features") as string) || "";
    const features = rawFeatures
      .split(/[\n,]+/)
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

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
      }

      setSelectedPlanForEdit(null);
      showToast(`Updated adoption plan "${planLabel}"!`);
    } catch (err: any) {
      console.warn("Plan update notice:", err);
      // Fallback optimistic update
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
      setSelectedPlanForEdit(null);
      showToast(`Updated "${planLabel}" locally.`);
    } finally {
      setIsUpdatingPlan(false);
    }
  };

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
      }
      setDeleteModal(null);
    } catch (err: any) {
      showToast(err.message || "Failed to delete item");
    } finally {
      setIsDeleting(false);
    }
  };

  // Wait until client has mounted and store has rehydrated
  const isReady = mounted && (hasHydrated || (useAuthStore.persist?.hasHydrated?.() ?? false));

  if (!isReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1f15] text-white p-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl animate-pulse mb-4">
          🌱
        </div>
        <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-semibold mb-2 text-emerald-100">
          PlantOn Agro Operations
        </h2>
        <p className="text-sm text-emerald-300/80">Connecting to secure console...</p>
      </div>
    );
  }

  // Guard screen if unauthorized
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1f15] text-white p-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl mb-4">
          🔒
        </div>
        <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-semibold mb-2 text-emerald-100">
          PlantOn Agro Security Guard
        </h2>
        <p className="text-sm text-emerald-300/80 mb-6">Administrator session required.</p>
        <Link
          href="/login"
          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold tracking-wide text-white transition-all shadow-md"
        >
          Go to Admin Login →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f8faf8] text-[#1c2e24] font-sans antialiased overflow-x-hidden">
      {/* 1. Executive Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        treesCount={trees.length}
        plansCount={plans.length}
        instancesCount={instances.length}
        locationsCount={locations.length}
        ordersCount={orders.length}
        unreadOrdersCount={unreadOrdersCount}
        userName={user?.name}
        onLogout={logout}
        onOpenAddTree={() => setShowAddTreeModal(true)}
        onOpenAddPlan={() => setShowAddPlanModal(true)}
        onOpenAddLocation={() => setShowAddLocationModal(true)}
        onOpenAddInstance={() => setShowAddInstanceModal(true)}
      />

      {/* 2. Main Application Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Command Bar */}
        <AdminHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          orders={orders}
          unreadCount={unreadOrdersCount}
          onSelectOrder={handleSelectOrder}
          onMarkAllAsRead={handleMarkAllOrdersAsRead}
          onViewAllOrders={() => setActiveTab("orders")}
        />

        {/* Global Toast Alert */}
        <AdminToast message={toastMessage} />

        {/* Main Body Content by Tab */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === "overview" && (
            <OverviewTab
              locations={locations}
              orders={orders}
              instances={instances}
              treeVarieties={trees}
              setActiveTab={setActiveTab}
              onSelectOrder={handleSelectOrder}
              unreadOrdersCount={unreadOrdersCount}
              onMarkAllAsRead={handleMarkAllOrdersAsRead}
            />
          )}

          {activeTab === "trees" && (
            <TreesTab
              trees={trees}
              searchQuery={searchQuery}
              onOpenAddTree={() => setShowAddTreeModal(true)}
              onEditTree={(tree) => setSelectedTreeForEdit(tree)}
              onDeleteTree={handleDeleteTree}
            />
          )}

          {activeTab === "plans" && (
            <PlansTab
              plans={plans}
              searchQuery={searchQuery}
              onOpenAddPlan={() => setShowAddPlanModal(true)}
              onEditPlan={(plan) => setSelectedPlanForEdit(plan)}
              onDeletePlan={handleDeletePlan}
            />
          )}

          {activeTab === "instances" && (
            <TreeInstancesTab
              instances={instances}
              searchQuery={searchQuery}
              onOpenAddInstance={() => setShowAddInstanceModal(true)}
              onUpdateHealth={handleUpdateInstanceHealth}
              onDeleteInstance={handleDeleteInstance}
            />
          )}

          {activeTab === "locations" && (
            <LocationsTab
              locations={locations}
              searchQuery={searchQuery}
              onOpenAddLocation={() => setShowAddLocationModal(true)}
              onDeleteLocation={handleDeleteLocation}
            />
          )}

          {activeTab === "orders" && (
            <OrdersTab
              orders={orders}
              searchQuery={searchQuery}
              onSelectOrder={handleSelectOrder}
              onExportCSV={handleExportOrdersCSV}
              onUpdateStatus={handleUpdateOrderStatus}
              onMarkAllAsRead={handleMarkAllOrdersAsRead}
              unreadCount={unreadOrdersCount}
            />
          )}

          {activeTab === "landing-page" && (
            <LandingPageTab showToast={showToast} />
          )}
        </main>
      </div>

      {/* 3. Action Modals */}
      <AddTreeModal
        isOpen={showAddTreeModal}
        onClose={() => setShowAddTreeModal(false)}
        onSubmit={handleCreateTree}
      />

      <EditTreeModal
        isOpen={Boolean(selectedTreeForEdit)}
        tree={selectedTreeForEdit}
        onClose={() => setSelectedTreeForEdit(null)}
        onSubmit={handleUpdateTree}
        isSubmitting={isUpdatingTree}
      />

      <AddPlanModal
        isOpen={showAddPlanModal}
        onClose={() => setShowAddPlanModal(false)}
        onSubmit={handleCreatePlan}
      />

      <EditPlanModal
        isOpen={Boolean(selectedPlanForEdit)}
        plan={selectedPlanForEdit}
        onClose={() => setSelectedPlanForEdit(null)}
        onSubmit={handleUpdatePlan}
        isSubmitting={isUpdatingPlan}
      />

      <AddTreeInstanceModal
        isOpen={showAddInstanceModal}
        onClose={() => setShowAddInstanceModal(false)}
        onSubmit={handleCreateInstance}
      />

      <AddLocationModal
        isOpen={showAddLocationModal}
        onClose={() => setShowAddLocationModal(false)}
        onSubmit={handleCreateLocation}
      />

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onDownloadCertificate={(certId) => {
          showToast(`Digital Certificate ${certId} downloaded!`);
          setSelectedOrder(null);
        }}
        onUpdateStatus={handleUpdateOrderStatus}
      />

      {/* 4. Custom Delete Confirmation Popup Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(deleteModal?.isOpen)}
        itemType={
          deleteModal?.type === "tree"
            ? "Tree Variety"
            : deleteModal?.type === "plan"
            ? "Adoption Plan"
            : deleteModal?.type === "instance"
            ? "Tree Sapling Instance"
            : "Reserve Location"
        }
        itemName={deleteModal?.name}
        description={deleteModal?.description}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) setDeleteModal(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

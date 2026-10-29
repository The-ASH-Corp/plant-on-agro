"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useHydratedStore, useIsClient } from "@/store/hooks/use-hydrated-store";
import { PlantFlow } from "@/components/plant-flow";
import { SignOutConfirmationModal } from "@/components/ui";
import {
  treeInstanceService,
  BackendTreeInstance,
} from "@/services/tree-instances/tree-instance.service";
import { orderService } from "@/services/orders/order.service";

import { BuyerDashboardTab, BuyerKpiData, BuyerOrderRecord } from "./types";
import { BuyerSidebar } from "./BuyerSidebar";
import { BuyerHeader } from "./BuyerHeader";
import { BuyerHeroBanner } from "./BuyerHeroBanner";
import { BuyerKpiGrid } from "./BuyerKpiGrid";
import { BuyerTreesTab } from "./BuyerTreesTab";
import { BuyerCertificatesTab } from "./BuyerCertificatesTab";
import { BuyerImpactTab } from "./BuyerImpactTab";
import { BuyerOrdersTab } from "./BuyerOrdersTab";
import { BuyerVisitsTab } from "./BuyerVisitsTab";

import { CertificateModal } from "./CertificateModal";
import { TreeInspectModal } from "./TreeInspectModal";
import { InvoiceModal } from "./InvoiceModal";
import { BuyerSidebarWidgets } from "./BuyerSidebarWidgets";

function deriveBuyerOrders(
  instances: BackendTreeInstance[],
  storedOrders: any[] = []
): BuyerOrderRecord[] {
  const byOrderNum = new Map<string, BuyerOrderRecord>();

  // 1. Ingest stored orders from local storage
  for (const o of storedOrders) {
    if (o && (o.orderNumber || o.id)) {
      const orderNumber = o.orderNumber || o.id;
      byOrderNum.set(orderNumber, {
        id: o.id || `ord-${orderNumber}`,
        orderNumber,
        invoiceNumber:
          o.invoiceNumber ||
          `INV-2026-${orderNumber.replace(/^ORD-?/, "").toUpperCase()}`,
        date:
          o.datePlanted ||
          o.createdAt?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
        treeSpecies: o.treeSpecies || "Indigenous Tree",
        scientificName: o.scientificName,
        category: o.category || "Fruit Trees",
        planType: o.planType || "Individual Lifetime",
        reserveName: o.reserveName || "Western Ghats, Maharashtra",
        gpsCoords: o.gpsCoords,
        quantity: o.quantity || 1,
        totalAmount: o.totalAmount || (o.quantity || 1) * 399,
        paymentMethod: o.paymentMethod || "Instant Sandbox",
        paymentStatus: "Paid",
        status: o.status || "Planted",
        certificateId: o.certificateId || `CERT-${orderNumber}`,
        adopterName: o.adopterName || "Verified Adopter",
        adopterEmail: o.adopterEmail || "adopter@example.com",
        adopterPhone: o.adopterPhone,
        transactionRef: o.transactionRef || `TXN-${orderNumber}-CLEARED`,
        notes: o.notes,
      });
    }
  }

  // 2. Derive records from tree instances in database
  const instanceGroups = new Map<string, BackendTreeInstance[]>();
  for (const inst of instances) {
    const ref = inst.orderRef?.trim() || `PO-${inst.treeTag}`;
    if (!instanceGroups.has(ref)) {
      instanceGroups.set(ref, []);
    }
    instanceGroups.get(ref)!.push(inst);
  }

  for (const [ref, insts] of instanceGroups.entries()) {
    if (!byOrderNum.has(ref)) {
      const first = insts[0];
      const qty = insts.length;
      byOrderNum.set(ref, {
        id: `ord-${ref}`,
        orderNumber: ref,
        invoiceNumber: `INV-2026-${ref.replace(/^ORD-?/, "").toUpperCase()}`,
        date:
          typeof first.datePlanted === "string"
            ? first.datePlanted
            : new Date(first.datePlanted).toISOString().split("T")[0],
        treeSpecies: first.treeVarietyName || "Indigenous Sapling",
        planType: "Individual Lifetime",
        reserveName: first.assignedReserve,
        gpsCoords: first.formattedGps,
        quantity: qty,
        totalAmount: qty * 399,
        paymentMethod: "Direct Adoption",
        paymentStatus: "Paid",
        status: "Planted",
        certificateId: `CERT-${first.treeTag}`,
        adopterName: first.adopterName || "Verified Adopter",
        adopterEmail: first.adopterEmail || "adopter@example.com",
        transactionRef: `TXN-${ref}-VERIFIED`,
        notes: first.notes,
      });
    }
  }

  return Array.from(byOrderNum.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function BuyerDashboard() {
  const router = useRouter();
  const user = useHydratedStore(useAuthStore, (s) => s.user);
  const isAuthenticated = useHydratedStore(useAuthStore, (s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const isClient = useIsClient();

  useEffect(() => {
    if (!hasHydrated && useAuthStore.persist?.hasHydrated?.()) {
      useAuthStore.getState().setHasHydrated(true);
    }
  }, [hasHydrated]);

  const isReady = isClient && (hasHydrated || (useAuthStore.persist?.hasHydrated?.() ?? false));

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [activeTab, setActiveTab] = useState<BuyerDashboardTab>("trees");
  const [plantFlowOpen, setPlantFlowOpen] = useState(false);
  const [selectedCertificateTree, setSelectedCertificateTree] = useState<BackendTreeInstance | null>(null);
  const [selectedInspectTree, setSelectedInspectTree] = useState<BackendTreeInstance | null>(null);
  const [selectedOrderInvoice, setSelectedOrderInvoice] = useState<BuyerOrderRecord | null>(null);
  const [trees, setTrees] = useState<BackendTreeInstance[]>([]);
  const [orders, setOrders] = useState<BuyerOrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real trees and stored orders from MongoDB database via treeInstanceService
  useEffect(() => {
    let isMounted = true;
    async function fetchUserData() {
      try {
        setLoading(true);
        const userEmail = user?.email?.trim().toLowerCase();

        // Query exclusively by authenticated user's email
        const [res, ordersRes] = await Promise.all([
          userEmail
            ? treeInstanceService.getAll({
                adopterEmail: userEmail,
                limit: 50,
              })
            : Promise.resolve({ data: { items: [], total: 0 } } as any),
          userEmail
            ? orderService.getAll({
                adopterEmail: userEmail,
                limit: 50,
              })
            : Promise.resolve({ data: { items: [], total: 0 } } as any),
        ]);

        // Check if any trees were adopted during this session matching the current user
        const storedBuyerTrees: BackendTreeInstance[] = (() => {
          if (typeof window !== "undefined") {
            try {
              const raw = localStorage.getItem("poa_buyer_trees");
              const parsed: BackendTreeInstance[] = raw ? JSON.parse(raw) : [];
              return userEmail
                ? parsed.filter(
                    (t) => t.adopterEmail?.toLowerCase() === userEmail
                  )
                : [];
            } catch {
              return [];
            }
          }
          return [];
        })();

        // Load stored orders from localStorage + backend database matching current user
        const storedOrders: any[] = (() => {
          let local: any[] = [];
          if (typeof window !== "undefined") {
            try {
              const raw = localStorage.getItem("poa_orders");
              const parsed = raw ? JSON.parse(raw) : [];
              local = userEmail
                ? parsed.filter(
                    (o: any) => o.adopterEmail?.toLowerCase() === userEmail
                  )
                : [];
            } catch {
              local = [];
            }
          }
          const backendOrders = ordersRes.data?.items || [];
          return [...backendOrders, ...local];
        })();

        if (isMounted) {
          const apiItems = res.data?.items || [];
          let currentTrees: BackendTreeInstance[] = [];

          if (apiItems.length > 0) {
            const apiIds = new Set(apiItems.map((i: BackendTreeInstance) => i.id));
            currentTrees = [
              ...storedBuyerTrees.filter((s) => !apiIds.has(s.id)),
              ...apiItems,
            ];
          } else if (storedBuyerTrees.length > 0) {
            currentTrees = storedBuyerTrees;
          } else {
            // Clean empty state: No fallback to other customers' trees
            currentTrees = [];
          }

          setTrees(currentTrees);

          // Derive comprehensive orders ledger
          const derivedOrders = deriveBuyerOrders(currentTrees, storedOrders);
          setOrders(derivedOrders);
        }
      } catch (err) {
        console.warn("Could not load data from database:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchUserData();

    // Real-time listener for newly placed orders
    const handleNewOrder = (e: any) => {
      if (Array.isArray(e.detail?.instances)) {
        const insts = e.detail.instances as BackendTreeInstance[];
        const instIds = new Set(insts.map((i) => i.id));
        setTrees((prev) => [...insts, ...prev.filter((t) => !instIds.has(t.id))]);
      } else if (e.detail?.instance) {
        const inst = e.detail.instance as BackendTreeInstance;
        setTrees((prev) => [inst, ...prev.filter((t) => t.id !== inst.id)]);
      }

      if (e.detail?.order) {
        const o = e.detail.order;
        const newRecord: BuyerOrderRecord = {
          id: o.id || `ord-${o.orderNumber}`,
          orderNumber: o.orderNumber,
          invoiceNumber:
            o.invoiceNumber || `INV-2026-${o.orderNumber.replace(/^ORD-?/, "")}`,
          date: o.datePlanted || new Date().toISOString().split("T")[0],
          treeSpecies: o.treeSpecies || "Indigenous Tree",
          scientificName: o.scientificName,
          category: o.category || "Fruit Trees",
          planType: o.planType || "Individual Lifetime",
          reserveName: o.reserveName || "Western Ghats, Maharashtra",
          gpsCoords: o.gpsCoords,
          quantity: o.quantity || 1,
          totalAmount: o.totalAmount || (o.quantity || 1) * 399,
          paymentMethod: o.paymentMethod || "Instant Sandbox",
          paymentStatus: "Paid",
          status: o.status || "Planted",
          certificateId: o.certificateId || `CERT-${o.orderNumber}`,
          adopterName: o.adopterName || "Verified Adopter",
          adopterEmail: o.adopterEmail || "adopter@example.com",
          adopterPhone: o.adopterPhone,
          transactionRef: o.transactionRef || `TXN-${o.orderNumber}-CLEARED`,
          notes: o.notes,
        };
        setOrders((prev) => [
          newRecord,
          ...prev.filter((rec) => rec.orderNumber !== newRecord.orderNumber),
        ]);
      }
    };

    window.addEventListener("poa-new-order", handleNewOrder);
    return () => {
      isMounted = false;
      window.removeEventListener("poa-new-order", handleNewOrder);
    };
  }, [user]);

  // Strict protected route check: unauthenticated users are immediately redirected to /login
  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated || !user) {
      router.replace("/login");
    }
  }, [isReady, isAuthenticated, user, router]);

  const totalTrees = trees.length;
  const estimatedCO2 = totalTrees * 22; // ~22kg of CO2 absorbed per tree per year
  const greenAreaSqFt = totalTrees * 65;
  const totalSpent = useMemo(
    () => orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    [orders]
  );

  const kpiData: BuyerKpiData = {
    totalTrees,
    estimatedCO2,
    greenAreaSqFt,
    certificatesCount: totalTrees,
    healthRate: 100,
    ordersCount: orders.length,
    totalSpent,
  };

  // Auth Guard: Prevent unauthorized flash and wait for store hydration
  if (!isReady || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#173324] text-white">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-emerald-200 font-medium">
            {!isReady ? "Verifying security credentials..." : "Redirecting to login..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f7f4] text-[#173324] flex font-sans selection:bg-emerald-500 selection:text-white">
      {/* Modern Sidebar Command Center */}
      <BuyerSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalTrees={totalTrees}
        certificatesCount={totalTrees}
        ordersCount={orders.length}
        user={user}
        onLogout={() => setShowSignOutModal(true)}
        onOpenPlantFlow={() => setPlantFlowOpen(true)}
      />

      {/* Main Command Stage (Offset by Sidebar on Desktop) */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0 transition-all">
        {/* Top Header */}
        <BuyerHeader
          user={user}
          activeTab={activeTab}
          onLogout={logout}
          onOpenPlantFlow={() => setPlantFlowOpen(true)}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Scrollable Stage Body */}
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5">
          {/* Executive Hero Banner */}
          <BuyerHeroBanner
            user={user}
            totalTrees={totalTrees}
            ordersCount={orders.length}
            onOpenPlantFlow={() => setPlantFlowOpen(true)}
            onSelectTab={setActiveTab}
          />

          {/* 4 Interactive KPI Power Cards */}
          <BuyerKpiGrid kpi={kpiData} />

          {/* Main Content & Telemetry Sidebar Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Primary Module Stage (8 Cols on Desktop) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Tab Switcher Pills */}
             

              {/* Active Tab View */}
              {activeTab === "trees" && (
                <BuyerTreesTab
                  trees={trees}
                  loading={loading}
                  onOpenPlantFlow={() => setPlantFlowOpen(true)}
                  onViewCertificate={(tree) => setSelectedCertificateTree(tree)}
                  onInspectTree={(tree) => setSelectedInspectTree(tree)}
                />
              )}

              {activeTab === "certificates" && (
                <BuyerCertificatesTab
                  trees={trees}
                  userName={user?.name}
                  onOpenModal={(tree) => setSelectedCertificateTree(tree)}
                />
              )}

              {activeTab === "impact" && (
                <BuyerImpactTab
                  totalTrees={totalTrees}
                  estimatedCO2={estimatedCO2}
                />
              )}

              {activeTab === "orders" && (
                <BuyerOrdersTab
                  orders={orders}
                  onOpenPlantFlow={() => setPlantFlowOpen(true)}
                  onViewInvoice={(order) => setSelectedOrderInvoice(order)}
                />
              )}

              {activeTab === "visits" && (
                <BuyerVisitsTab
                  user={user ?? null}
                  instances={trees}
                />
              )}
            </div>

            {/* Right Telemetry Column (4 Cols on Desktop) */}
            <div className="lg:col-span-4">
              <BuyerSidebarWidgets
                trees={trees}
                user={user}
                onOpenPlantFlow={() => setPlantFlowOpen(true)}
                onSelectTreeDeed={(tree) => setSelectedCertificateTree(tree)}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        tree={selectedCertificateTree}
        userName={user?.name}
        onClose={() => setSelectedCertificateTree(null)}
      />

      {/* Tree Inspect Telemetry Modal */}
      <TreeInspectModal
        tree={selectedInspectTree}
        onClose={() => setSelectedInspectTree(null)}
        onViewCertificate={(tree) => setSelectedCertificateTree(tree)}
      />

      {/* Invoice Receipt Modal */}
      <InvoiceModal
        order={selectedOrderInvoice}
        onClose={() => setSelectedOrderInvoice(null)}
      />

      {/* Plant Tree Adoption Flow Wizard */}
      {plantFlowOpen && <PlantFlow onClose={() => setPlantFlowOpen(false)} />}

      {/* Sign Out Confirmation Modal */}
      <SignOutConfirmationModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={logout}
        userName={user?.name}
        userEmail={user?.email}
        userRole={user?.role}
      />
    </div>
  );
}

export default BuyerDashboard;

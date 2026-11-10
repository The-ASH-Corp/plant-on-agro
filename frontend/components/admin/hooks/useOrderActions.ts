import { useState } from "react";
import { AdoptionOrder, AdoptionOrderStatus } from "../types";
import { orderService } from "@/services/orders/order.service";
import { treeInstanceService } from "@/services/tree-instances/tree-instance.service";
import { certificateService } from "@/services/certificates/certificate.service";
import { exportOrdersCsv } from "../utils/exportOrdersCsv";
import type { AdminData } from "./useAdminData";
import type { ShowToast } from "./useAdminToast";

interface Params {
  data: AdminData;
  showToast: ShowToast;
}

const persistOrders = (orders: AdoptionOrder[]) => {
  try {
    localStorage.setItem("poa_orders", JSON.stringify(orders));
  } catch (e) {
    console.warn("Could not save orders:", e);
  }
};

export function useOrderActions({ data, showToast }: Params) {
  const { orders, setOrders, instances, certificates, setCertificates } = data;
  const [selectedOrder, setSelectedOrder] = useState<AdoptionOrder | null>(null);
  const [orderToMarkPlanted, setOrderToMarkPlanted] = useState<AdoptionOrder | null>(null);

  // Unread / New Orders Tracking
  const unreadOrdersCount = orders.filter(
    (o) => o.isRead === false || o.status === "New Request"
  ).length;

  const handleUpdateOrderStatus = async (
    orderIdentifier: string,
    newStatus: AdoptionOrderStatus,
    gpsCoords?: string,
    reserveName?: string,
    notes?: string,
    treeTags?: string[],
    assignedTreeInstanceIds?: string[],
    treeSpecies?: string,
    scientificName?: string,
    category?: string,
    treeGpsCoords?: string[]
  ) => {
    const targetOrder = orders.find(
      (o) => o.orderNumber === orderIdentifier || o.id === orderIdentifier
    );

    // If moving to Planted and no GPS coordinates passed yet, open the MarkOrderPlantedModal!
    if (newStatus === "Planted" && !gpsCoords && targetOrder) {
      setOrderToMarkPlanted(targetOrder);
      return;
    }

    if (
      selectedOrder &&
      (selectedOrder.orderNumber === orderIdentifier || selectedOrder.id === orderIdentifier)
    ) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              isRead: true,
              gpsCoords: gpsCoords || prev.gpsCoords,
              reserveName: reserveName || prev.reserveName,
              treeSpecies: treeSpecies || prev.treeSpecies,
              scientificName: scientificName || prev.scientificName,
              category: category || prev.category,
            }
          : null
      );
    }

    // 1. Persist status change directly to MongoDB backend order entity first
    const lookupId = targetOrder?.id || orderIdentifier;
    try {
      await orderService.updateStatus(
        lookupId,
        newStatus,
        notes,
        gpsCoords,
        reserveName,
        treeTags,
        assignedTreeInstanceIds,
        treeSpecies,
        scientificName,
        category,
        treeGpsCoords
      );
    } catch (orderApiErr: any) {
      // Fallback: try updating by orderIdentifier (orderNumber) if targetOrder.id was a derived ID
      if (lookupId !== orderIdentifier) {
        try {
          await orderService.updateStatus(
            orderIdentifier,
            newStatus,
            notes,
            gpsCoords,
            reserveName,
            treeTags,
            assignedTreeInstanceIds,
            treeSpecies,
            scientificName,
            category,
            treeGpsCoords
          );
        } catch (retryErr: any) {
          const msg = retryErr?.response?.data?.message || retryErr?.message || "Failed to update order status";
          showToast(`❌ ${msg}`);
          return;
        }
      } else {
        const msg = orderApiErr?.response?.data?.message || orderApiErr?.message || "Failed to update order status";
        showToast(`❌ ${msg}`);
        return;
      }
    }

    // 2. Update local state after backend update so any re-fetch reads updated status
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.orderNumber === orderIdentifier || o.id === orderIdentifier
          ? {
              ...o,
              status: newStatus,
              isRead: true,
              gpsCoords: gpsCoords || o.gpsCoords,
              reserveName: reserveName || o.reserveName,
              treeSpecies: treeSpecies || o.treeSpecies,
              scientificName: scientificName || o.scientificName,
              category: category || o.category,
            }
          : o
      );
      persistOrders(updated);
      return updated;
    });

    // 3. If Planted, refresh certificates registry and tree instances
    if (newStatus === "Planted") {
      try {
        const [certRes, instRes] = await Promise.all([
          certificateService.getCertificates({ limit: 50 }),
          treeInstanceService.getAll({ limit: 50 }),
        ]);
        if (certRes.data?.items) {
          setCertificates(certRes.data.items);
        }
        if (instRes.data?.items) {
          data.setInstances(instRes.data.items);
        }
      } catch (cErr) {
        console.warn("Could not refresh certificates after planting:", cErr);
      }
      showToast(`🌱 Tree assigned & order ${targetOrder?.orderNumber || orderIdentifier} marked as Planted! Digital deed minted.`);
    } else {
      showToast(`✓ Order ${targetOrder?.orderNumber || orderIdentifier} status advanced to "${newStatus}"`);
    }
  };

  const handleMarkAllOrdersAsRead = async () => {
    try {
      await orderService.markAllAsRead();
    } catch (err) {
      console.warn("Failed to mark all orders as read in backend:", err);
    }

    setOrders((prev) => {
      const updated = prev.map((o) => ({ ...o, isRead: true }));
      persistOrders(updated);
      return updated;
    });
    showToast("✓ All adoption requests marked as reviewed.");
  };

  const handleSelectOrder = async (order: AdoptionOrder) => {
    setSelectedOrder(order);
    if (order.isRead === false) {
      if (order.id) {
        try {
          await orderService.updateStatus(order.id, order.status);
        } catch (err) {
          console.warn("Could not mark order read on backend:", err);
        }
      }

      setOrders((prev) => {
        const updated = prev.map((o) => (o.id === order.id ? { ...o, isRead: true } : o));
        persistOrders(updated);
        return updated;
      });
    }
  };

  const handleOpenAssignTree = (order: AdoptionOrder) => {
    if (order.treeTag) {
      showToast(`Tree (${order.treeTag}) is already assigned to ${order.adopterName} and locked from editing.`);
      return;
    }
    setOrderToMarkPlanted(order);
  };

  const handleExportOrdersCSV = () => {
    if (orders.length === 0) {
      showToast("No orders available to export.");
      return;
    }
    exportOrdersCsv(orders);
    showToast("✓ Downloaded adoption orders CSV register.");
  };

  return {
    selectedOrder,
    setSelectedOrder,
    orderToMarkPlanted,
    setOrderToMarkPlanted,
    unreadOrdersCount,
    handleOpenAssignTree,
    handleUpdateOrderStatus,
    handleMarkAllOrdersAsRead,
    handleSelectOrder,
    handleExportOrdersCSV,
  };
}

export type OrderActions = ReturnType<typeof useOrderActions>;

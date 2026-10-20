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

  // Unread / New Orders Tracking
  const unreadOrdersCount = orders.filter(
    (o) => o.isRead === false || o.status === "New Request"
  ).length;

  const handleUpdateOrderStatus = async (orderIdentifier: string, newStatus: AdoptionOrderStatus) => {
    const targetOrder = orders.find(
      (o) => o.orderNumber === orderIdentifier || o.id === orderIdentifier
    );

    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.orderNumber === orderIdentifier || o.id === orderIdentifier
          ? { ...o, status: newStatus, isRead: true }
          : o
      );
      persistOrders(updated);
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

    // If order was moved to "Certificate Issued", ensure a certificate deed exists
    if (newStatus === "Certificate Issued" && targetOrder) {
      const orderNum = targetOrder.orderNumber;
      const alreadyHasCert = certificates.some(
        (c) => c.orderRef === orderNum || c.certificateNumber === targetOrder.certificateId
      );
      if (!alreadyHasCert) {
        try {
          const autoCert = await certificateService.createCertificate({
            orderRef: orderNum,
            recipientName: targetOrder.adopterName,
            adopterName: targetOrder.adopterName,
            treeSpecies: targetOrder.treeSpecies,
            reserveName: targetOrder.reserveName,
            dedicatedMessage: `PlantOn Agro certified green deed honoring ${targetOrder.adopterName} for sustainable environmental stewardship.`,
            status: "Issued",
          });
          if (autoCert.data) {
            const newCert = autoCert.data;
            setCertificates((prev) => [newCert, ...prev]);
            showToast(`📜 Deed certificate generated for ${orderNum}!`);
          }
        } catch (cErr) {
          console.warn("Auto-issue certificate notice:", cErr);
        }
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
      persistOrders(updated);
      return updated;
    });
    showToast("✓ All adoption requests marked as reviewed.");
  };

  const handleSelectOrder = async (order: AdoptionOrder) => {
    setSelectedOrder(order);
    if (order.isRead === false) {
      setOrders((prev) => {
        const updated = prev.map((o) => (o.id === order.id ? { ...o, isRead: true } : o));
        persistOrders(updated);
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
    exportOrdersCsv(orders);
    showToast("✓ Downloaded adoption orders CSV register.");
  };

  return {
    selectedOrder,
    setSelectedOrder,
    unreadOrdersCount,
    handleUpdateOrderStatus,
    handleMarkAllOrdersAsRead,
    handleSelectOrder,
    handleExportOrdersCSV,
  };
}

export type OrderActions = ReturnType<typeof useOrderActions>;

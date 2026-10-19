import { BackendTreeInstance } from "@/services/tree-instances/tree-instance.service";
import { User } from "@/types/auth";

export type BuyerDashboardTab = "trees" | "certificates" | "impact" | "orders";

export interface BuyerKpiData {
  totalTrees: number;
  estimatedCO2: number;
  greenAreaSqFt: number;
  certificatesCount: number;
  healthRate: number;
  ordersCount?: number;
  totalSpent?: number;
}

export interface BuyerOrderRecord {
  id: string;
  orderNumber: string;
  invoiceNumber: string;
  date: string;
  treeSpecies: string;
  scientificName?: string;
  category?: string;
  planType: string;
  reserveName: string;
  gpsCoords?: string;
  quantity: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "Paid" | "Pending" | "Refunded";
  status: string;
  certificateId?: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone?: string;
  transactionRef?: string;
  notes?: string;
}

export interface BuyerDashboardProps {
  user: User | null;
  onLogout: () => void;
}

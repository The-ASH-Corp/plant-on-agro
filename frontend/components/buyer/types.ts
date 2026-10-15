import { BackendTreeInstance } from "@/services/tree-instances/tree-instance.service";
import { User } from "@/types/auth";

export type BuyerDashboardTab = "trees" | "certificates" | "impact";

export interface BuyerKpiData {
  totalTrees: number;
  estimatedCO2: number;
  greenAreaSqFt: number;
  certificatesCount: number;
  healthRate: number;
}

export interface BuyerDashboardProps {
  user: User | null;
  onLogout: () => void;
}

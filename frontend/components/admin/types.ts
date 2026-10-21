export type AdminTabType =
  | "overview"
  | "trees"
  | "plans"
  | "locations"
  | "orders"
  | "instances"
  | "certificates"
  | "users"
  | "landing-page";

export type TreeHealthStatus =
  | "Healthy"
  | "Thriving"
  | "Needs Attention"
  | "Critical"
  | "Sapling Growing";

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
}

export interface TreeGrowthUpdateItem {
  id?: string;
  imageUrl: string;
  stageName?: string;
  notes?: string;
  recordedAt: string;
  heightCm?: number;
}

export interface TreeInstanceItem {
  id: string;
  treeTag: string;
  orderRef: string;
  assignedReserve: string;
  gpsCoordinates: GpsCoordinates;
  formattedGps: string;
  datePlanted: string;
  healthStatus: TreeHealthStatus;
  treeVarietyName: string;
  adopterName: string;
  adopterEmail: string;
  notes: string;
  imageUrl?: string;
  growthUpdates?: TreeGrowthUpdateItem[];
  lastInspectedAt?: string | null;
  isActive: boolean;
}

export type AdoptionOrderStatus =
  | "New Request"
  | "Verified & Tagged"
  | "Planted"
  | "Certificate Issued"
  | "Completed";

export interface AdoptionOrder {
  id: string;
  orderNumber: string;
  invoiceNumber?: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone?: string;
  treeSpecies: string;
  scientificName: string;
  category: string;
  reserveName: string;
  gpsCoords: string;
  planType: string;
  dedicationMessage?: string;
  quantity: number;
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus?: "Pending" | "Paid" | "Failed" | "Refunded";
  transactionRef?: string;
  datePlanted: string;
  status: AdoptionOrderStatus;
  certificateId: string;
  ndviScore: number;
  isRead?: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TreeVarietyItem {
  id: string;
  name: string;
  sci: string;
  commonName?: string;
  scientificName?: string;
  category:
    | "Fruit Trees"
    | "Timber Trees"
    | "Medicinal"
    | "Native Trees"
    | "Shade Trees"
    | "Occasion";
  price: number;
  location: string;
  growth: string;
  growthTimeline?: string;
  img: string;
  coverImages?: string[];
  desc: string;
  description?: string;
  co2PerYearKg: number;
  co2AbsorptionRateKgYear?: number;
  careRequirements?: string;
  isActive?: boolean;
}

export type OccasionDedicationType =
  | "birthday"
  | "memorial"
  | "anniversary"
  | "corporate"
  | "general";

export interface AdoptionPlanItem {
  id: string;
  label: string;
  planLabel?: string;
  icon: string;
  desc: string;
  description?: string;
  price: number;
  priceModifier?: number;
  features?: string[];
  occasionDedications?: OccasionDedicationType[];
  badge: string;
  activeCount: number;
  isActive?: boolean;
}

export interface PlantationLocationItem {
  id: string;
  name: string;
  region: string;
  gps: string;
  areaHectares: number;
  capacity: number;
  treesPlanted: number;
  survivalRate: string;
  ndviScore: number;
  soilHealth: string;
  image: string;
  status: "Active" | "Expanding" | "Full";
}

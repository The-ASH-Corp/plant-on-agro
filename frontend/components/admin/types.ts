export type AdminTabType = "overview" | "trees" | "plans" | "locations" | "orders" | "instances" | "landing-page";

export type TreeHealthStatus =
  | 'Healthy'
  | 'Thriving'
  | 'Needs Attention'
  | 'Critical'
  | 'Sapling Growing';

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
}

export interface TreeInstanceItem {
  id: string;
  treeTag: string; // Unique tree tag / serial
  orderRef: string; // Reference to order (e.g. "ORD-88219")
  assignedReserve: string; // Assigned reserve
  gpsCoordinates: GpsCoordinates; // Exact GPS lat/long where sapling was physically put into the ground
  formattedGps: string; // e.g. "18.5204° N, 73.8567° E"
  datePlanted: string; // Date planted
  healthStatus: TreeHealthStatus; // Current health status
  treeVarietyName: string;
  adopterName: string;
  adopterEmail: string;
  notes: string;
  imageUrl?: string;
  lastInspectedAt?: string | null;
  isActive: boolean;
}

export interface AdoptionOrder {
  id: string;
  orderNumber: string;
  adopterName: string;
  adopterEmail: string;
  treeSpecies: string;
  scientificName: string;
  category: string;
  reserveName: string;
  gpsCoords: string;
  planType: string;
  quantity: number;
  totalAmount: number;
  datePlanted: string;
  status: "Verified & Tagged" | "Planted" | "Pending Drone Scan" | "Certificate Issued";
  certificateId: string;
  ndviScore: number;
}

export interface TreeVarietyItem {
  id: string;
  name: string;
  sci: string;
  commonName?: string;
  scientificName?: string;
  category: "Fruit Trees" | "Timber Trees" | "Medicinal" | "Native Trees" | "Shade Trees" | "Occasion";
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
  | 'birthday'
  | 'memorial'
  | 'anniversary'
  | 'corporate'
  | 'general';

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

export interface AdoptionOrder {
  id: string;
  orderNumber: string;
  adopterName: string;
  adopterEmail: string;
  treeSpecies: string;
  scientificName: string;
  category: string;
  reserveName: string;
  gpsCoords: string;
  planType: string;
  quantity: number;
  totalAmount: number;
  datePlanted: string;
  status: "Verified & Tagged" | "Planted" | "Pending Drone Scan" | "Certificate Issued";
  certificateId: string;
  ndviScore: number;
}

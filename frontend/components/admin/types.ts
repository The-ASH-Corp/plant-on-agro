export type AdminTabType = "overview" | "trees" | "plans" | "locations" | "orders";

export interface TreeVarietyItem {
  id: string;
  name: string;
  sci: string;
  category: "Fruit Trees" | "Timber Trees" | "Medicinal" | "Native Trees" | "Shade Trees" | "Occasion";
  price: number;
  location: string;
  growth: string;
  img: string;
  desc: string;
  co2PerYearKg: number;
}

export interface AdoptionPlanItem {
  id: string;
  label: string;
  icon: string;
  desc: string;
  price: number;
  badge: string;
  activeCount: number;
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

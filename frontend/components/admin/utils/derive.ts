import { AdoptionOrder, AdoptionOrderStatus, PlantationLocationItem } from "../types";

export function deriveOrdersFromInstances(
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

const RESERVE_CONFIGS: Record<
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

export function deriveLocationsFromData(
  instances: any[],
  varieties: any[],
  customLocations: PlantationLocationItem[] = []
): PlantationLocationItem[] {
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
    const config = custom || RESERVE_CONFIGS[reserveName] || {
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

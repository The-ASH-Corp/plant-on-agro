import { AdoptionOrder, AdoptionOrderStatus } from "../types";

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

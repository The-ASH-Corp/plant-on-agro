import { AdoptionOrder, PlantationLocationItem } from "../types";

export const ORDERS_STORAGE_KEY = "poa_orders";
export const CUSTOM_LOCATIONS_STORAGE_KEY = "poa_custom_locations";

export function loadStoredOrders(): AdoptionOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not load stored orders:", e);
  }
  return [];
}

export function saveStoredOrders(orders: AdoptionOrder[]) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn("Could not save orders:", e);
  }
}

export function loadCustomLocations(): PlantationLocationItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_LOCATIONS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function addCustomLocation(loc: PlantationLocationItem) {
  if (typeof window === "undefined") return;
  try {
    const custom = loadCustomLocations();
    localStorage.setItem(CUSTOM_LOCATIONS_STORAGE_KEY, JSON.stringify([...custom, loc]));
  } catch {}
}

export function removeCustomLocation(id: string, name: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(CUSTOM_LOCATIONS_STORAGE_KEY);
    if (raw) {
      const custom = JSON.parse(raw).filter((l: any) => l.id !== id && l.name !== name);
      localStorage.setItem(CUSTOM_LOCATIONS_STORAGE_KEY, JSON.stringify(custom));
    }
  } catch {}
}

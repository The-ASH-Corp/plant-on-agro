import { AdoptionOrder, PlantationLocationItem } from "../types";


export function loadStoredOrders(): AdoptionOrder[] {
  return [];
}

export function saveStoredOrders(_orders: AdoptionOrder[]): void {
  // No-op: Data is stored securely in backend database only
}

export function loadCustomLocations(): PlantationLocationItem[] {
  return [];
}

export function addCustomLocation(_loc: PlantationLocationItem): void {
  // No-op: Data is stored securely in backend database only
}

export function removeCustomLocation(_id: string, _name: string): void {
  // No-op: Data is stored securely in backend database only
}

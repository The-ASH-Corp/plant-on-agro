import { AdoptionOrder } from "../types";

const esc = (v?: string) => `"${(v || "").replace(/"/g, '""')}"`;

/** Builds and triggers download of the adoption orders CSV register. */
export function exportOrdersCsv(orders: AdoptionOrder[]) {
  const headers = [
    "Order Number",
    "Invoice Number",
    "Adopter Name",
    "Adopter Email",
    "Phone",
    "Species",
    "Plantation Reserve",
    "GPS Coordinates",
    "Plan Package",
    "Quantity",
    "Total Amount (INR)",
    "Payment Method",
    "Payment Status",
    "Transaction Ref",
    "Order Status",
    "Certificate ID",
    "Date Adopted",
  ];
  const rows = orders.map((o) => [
    `"${o.orderNumber}"`,
    `"${o.invoiceNumber || ""}"`,
    esc(o.adopterName),
    esc(o.adopterEmail),
    `"${o.adopterPhone || ""}"`,
    esc(o.treeSpecies),
    esc(o.reserveName),
    esc(o.gpsCoords),
    esc(o.planType),
    o.quantity || 1,
    o.totalAmount || 0,
    `"${o.paymentMethod || "sandbox"}"`,
    `"${o.paymentStatus || "Paid"}"`,
    `"${o.transactionRef || ""}"`,
    `"${o.status || ""}"`,
    `"${o.certificateId || ""}"`,
    `"${o.datePlanted || ""}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `PlantOnAgro_Adoption_Orders_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

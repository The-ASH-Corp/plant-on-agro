import { Metadata } from "next";
import { BuyerDashboard } from "@/components/buyer/BuyerDashboard";

export const metadata: Metadata = {
  title: "Buyer Dashboard - PlantOnAgro Living Ledger",
  description:
    "Track your adopted living trees, verified GPS mapping, official certificates, and environmental impact.",
};

export default function BuyerDashboardPage() {
  return <BuyerDashboard />;
}

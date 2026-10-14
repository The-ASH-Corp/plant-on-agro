import { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard - PlantOnAgro Operations",
  description:
    "Real-time monitoring of living trees, GPS drone telemetry, buyer orders, and carbon offset ledgers.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}

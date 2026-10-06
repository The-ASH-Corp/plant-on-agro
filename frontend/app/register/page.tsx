import { Metadata } from "next";
import { AuthView } from "@/components/auth";

export const metadata: Metadata = {
  title: "Join the Movement - PlantOnAgro",
  description:
    "Create an account to plant your first tree and track its lifelong growth.",
};

export default function RegisterPage() {
  return <AuthView initialMode="register" />;
}

import { Metadata } from "next";
import { AuthView } from "@/components/auth";

export const metadata: Metadata = {
  title: "Login - PlantOnAgro",
  description:
    "Sign in to track your trees, view your impact, and access certificates.",
};

export default function LoginPage() {
  return <AuthView initialMode="login" />;
}

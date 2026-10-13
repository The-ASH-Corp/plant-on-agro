import { Metadata } from "next";
import { AuthView } from "@/components/auth";

export const metadata: Metadata = {
  title: "Reset Password - PlantOnAgro",
  description:
    "Reset your PlantOnAgro account password to regain access to your dashboard.",
};

export default function ForgotPasswordRoute() {
  return <AuthView initialMode="forgot-password" />;
}

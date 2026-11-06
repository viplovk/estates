import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/components/auth/LoginPage";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  component: LoginPage,
});
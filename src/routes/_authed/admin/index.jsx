import { createFileRoute } from "@tanstack/react-router";
import { AdminOverview } from "@/components/admin/AdminOverview";

export const Route = createFileRoute("/_authed/admin/")({
  head: () => ({ meta: [{ title: "Admin — East Delhi Realty" }] }),
  component: AdminOverview,
});
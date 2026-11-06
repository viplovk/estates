import { createFileRoute } from "@tanstack/react-router";
import { AdminProperties } from "@/components/admin/AdminProperties";

export const Route = createFileRoute("/_authed/admin/properties")({
  head: () => ({ meta: [{ title: "Properties — Admin" }] }),
  component: AdminProperties,
});
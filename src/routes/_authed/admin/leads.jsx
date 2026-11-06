import { createFileRoute } from "@tanstack/react-router";
import { AdminLeads } from "@/components/admin/AdminLeads";

export const Route = createFileRoute("/_authed/admin/leads")({
  head: () => ({ meta: [{ title: "Leads — Admin" }] }),
  component: AdminLeads,
});
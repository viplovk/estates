import { createFileRoute } from "@tanstack/react-router";
import { AdminSubmissions } from "@/components/admin/AdminSubmissions";

export const Route = createFileRoute("/_authed/admin/submissions")({
  head: () => ({ meta: [{ title: "Owner Submissions — Admin" }] }),
  component: AdminSubmissions,
});
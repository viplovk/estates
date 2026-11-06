import { createFileRoute } from "@tanstack/react-router";
import { PropertyEditor } from "@/components/admin/PropertyEditor";

export const Route = createFileRoute("/_authed/admin/properties_/$propertyId")({
  head: () => ({ meta: [{ title: "Property — Admin" }] }),
  component: PropertyEditorRoute,
});

function PropertyEditorRoute() {
  const { propertyId } = Route.useParams();
  return <PropertyEditor propertyId={propertyId} />;
}
import { createFileRoute } from "@tanstack/react-router";
import { PropertyExplorerPage } from "@/components/property/PropertyExplorerPage";
import { validatePropertySearch } from "@/lib/property-search";

export const Route = createFileRoute("/_site/properties")({
  validateSearch: validatePropertySearch,
  head: () => ({
    meta: [
      { title: "Properties in East Delhi — Buy & Rent | East Delhi Realty" },
      {
        name: "description",
        content:
          "Browse flats, builder floors, independent houses, shops, offices and plots across East Delhi. Filter by locality, budget, bedrooms and area.",
      },
      { property: "og:title", content: "Properties in East Delhi — East Delhi Realty" },
    ],
    links: [{ rel: "canonical", href: "/properties" }],
  }),
  component: PropertiesPage,
});

function PropertiesPage() {
  const search = Route.useSearch();
  return (
    <PropertyExplorerPage
      to="/properties"
      search={search}
      eyebrow="The Portfolio"
      title="Properties across East Delhi"
      description="Every listing here is published by East Delhi Realty. Narrow the field by locality, budget and configuration, or tell us what you need and we'll search on your behalf."
    />
  );
}
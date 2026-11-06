import { createFileRoute } from "@tanstack/react-router";
import { PropertyExplorerPage } from "@/components/property/PropertyExplorerPage";
import { validatePropertySearch } from "@/lib/property-search";

export const Route = createFileRoute("/_site/commercial")({
  validateSearch: validatePropertySearch,
  head: () => ({
    meta: [
      { title: "Commercial Property in East Delhi | East Delhi Realty" },
      {
        name: "description",
        content:
          "Shops, office spaces and warehouses across East Delhi — for sale and for rent, with local market guidance.",
      },
      { property: "og:title", content: "Commercial Property in East Delhi" },
    ],
    links: [{ rel: "canonical", href: "/commercial" }],
  }),
  component: CommercialPage,
});

function CommercialPage() {
  const search = Route.useSearch();
  return (
    <PropertyExplorerPage
      to="/commercial"
      search={search}
      bucket="commercial"
      eyebrow="Commercial"
      title="Shops, offices and warehouses"
      description="High-street shops, office floors and storage space across East Delhi's commercial pockets."
    />
  );
}
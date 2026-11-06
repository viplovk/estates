import { createFileRoute } from "@tanstack/react-router";
import { PropertyExplorerPage } from "@/components/property/PropertyExplorerPage";
import { validatePropertySearch } from "@/lib/property-search";

export const Route = createFileRoute("/_site/residential")({
  validateSearch: validatePropertySearch,
  head: () => ({
    meta: [
      { title: "Residential Property in East Delhi | East Delhi Realty" },
      {
        name: "description",
        content:
          "Residential flats, builder floors, independent houses, villas and plots across East Delhi, for sale and for rent.",
      },
      { property: "og:title", content: "Residential Property in East Delhi" },
    ],
    links: [{ rel: "canonical", href: "/residential" }],
  }),
  component: ResidentialPage,
});

function ResidentialPage() {
  const search = Route.useSearch();
  return (
    <PropertyExplorerPage
      to="/residential"
      search={search}
      bucket="residential"
      eyebrow="Residential"
      title="Homes across East Delhi"
      description="Flats, builder floors, independent houses, villas and plots — for ownership or rent."
    />
  );
}
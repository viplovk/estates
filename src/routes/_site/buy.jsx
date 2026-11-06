import { createFileRoute } from "@tanstack/react-router";
import { PropertyExplorerPage } from "@/components/property/PropertyExplorerPage";
import { validatePropertySearch } from "@/lib/property-search";

export const Route = createFileRoute("/_site/buy")({
  validateSearch: validatePropertySearch,
  head: () => ({
    meta: [
      { title: "Property for Sale in East Delhi | East Delhi Realty" },
      {
        name: "description",
        content:
          "Flats, builder floors, independent houses, villas and plots for sale across Shakarpur, Laxmi Nagar, Preet Vihar and East Delhi.",
      },
      { property: "og:title", content: "Property for Sale in East Delhi" },
    ],
    links: [{ rel: "canonical", href: "/buy" }],
  }),
  component: BuyPage,
});

function BuyPage() {
  const search = Route.useSearch();
  return (
    <PropertyExplorerPage
      to="/buy"
      search={search}
      lockedTransaction="buy"
      eyebrow="Buy"
      title="Property for sale in East Delhi"
      description="Freehold flats, builder floors and independent homes across the localities we know best. Filter by budget and configuration to see what fits."
    />
  );
}
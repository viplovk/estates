import { createFileRoute } from "@tanstack/react-router";
import { PropertyExplorerPage } from "@/components/property/PropertyExplorerPage";
import { validatePropertySearch } from "@/lib/property-search";

export const Route = createFileRoute("/_site/rent")({
  validateSearch: validatePropertySearch,
  head: () => ({
    meta: [
      { title: "Flats & Houses for Rent in East Delhi | East Delhi Realty" },
      {
        name: "description",
        content:
          "Rental flats, builder floors and independent homes across East Delhi — furnished, semi-furnished and unfurnished options.",
      },
      { property: "og:title", content: "Flats & Houses for Rent in East Delhi" },
    ],
    links: [{ rel: "canonical", href: "/rent" }],
  }),
  component: RentPage,
});

function RentPage() {
  const search = Route.useSearch();
  return (
    <PropertyExplorerPage
      to="/rent"
      search={search}
      lockedTransaction="rent"
      eyebrow="Rent"
      title="Homes on rent in East Delhi"
      description="Furnished and unfurnished rentals across East Delhi, with visits arranged around your schedule."
    />
  );
}
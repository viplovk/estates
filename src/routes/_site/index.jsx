import { createFileRoute } from "@tanstack/react-router";
import { listFeaturedProperties } from "@/lib/server-fns";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { Neighbourhoods } from "@/components/home/Neighbourhoods";
import { Services } from "@/components/home/Services";
import { WhyUs } from "@/components/home/WhyUs";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FinalCta } from "@/components/home/FinalCta";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/_site/")({
  loader: async () => {
    const featured = await listFeaturedProperties().catch(() => []);
    return { featured: featured || [] };
  },
  head: () => ({
    meta: [
      { title: "East Delhi Realty — Properties in East Delhi | Viplov Kashyap" },
      {
        name: "description",
        content:
          "Buy, rent or list residential and commercial property across East Delhi with local consultancy from Viplov Kashyap in Shakarpur.",
      },
      { property: "og:title", content: "East Delhi Realty — Properties in East Delhi" },
      {
        property: "og:description",
        content:
          "A premium property consultancy for East Delhi — flats, builder floors, independent houses, shops, offices and plots.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: SITE.name,
          founder: SITE.consultant,
          telephone: SITE.phoneRaw,
          email: SITE.email,
          areaServed: SITE.areaServed,
          address: {
            "@type": "PostalAddress",
            streetAddress: SITE.locality,
            addressLocality: "Delhi",
            postalCode: "110092",
            addressCountry: "IN",
          },
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { featured } = Route.useLoaderData();
  return (
    <>
      <Hero featuredCount={featured.length} />
      <Intro />
      <FeaturedProperties properties={featured} />
      <Neighbourhoods />
      <Services />
      <WhyUs />
      <HowItWorks />
      <FinalCta />
    </>
  );
}
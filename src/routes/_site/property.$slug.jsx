import { useEffect } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ChevronRight, MessageCircle, Phone } from "lucide-react";
import { getProperty } from "@/lib/server-fns";
import { Gallery } from "@/components/property/Gallery";
import { PropertyMap } from "@/components/property/PropertyMap";
import { EnquiryForm } from "@/components/property/EnquiryForm";
import { SimilarProperties } from "@/components/property/SimilarProperties";
import { useWhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { Section } from "@/components/site/Section";
import { formatPrice, SITE, telLink, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/_site/property/$slug")({
  loader: async ({ params }) => {
    const property = await getProperty({ data: { slug: params.slug } });
    if (!property) throw notFound();
    return { property };
  },
  head: (ctx) => {
    const property = ctx?.loaderData?.property;
    if (!property) {
      return { meta: [{ title: "Property — East Delhi Realty" }] };
    }
    const title = `${property.title}, ${property.locality} — East Delhi Realty`;
    const description = `${formatPrice(property.price, property.transaction)} · ${property.category} in ${
      property.locality
    }, East Delhi. ${(property.description || "").slice(0, 110)}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        ...(property.cover_image ? [{ property: "og:image", content: property.cover_image }] : []),
      ],
      links: [{ rel: "canonical", href: `/property/${property.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: property.title,
            description: property.description || "",
            url: `/property/${property.slug}`,
            image: property.images?.[0] || property.cover_image || undefined,
            offers: {
              "@type": "Offer",
              price: property.price,
              priceCurrency: "INR",
              availability:
                property.availability === "Available Now"
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
            address: {
              "@type": "PostalAddress",
              addressLocality: property.locality,
              addressRegion: "Delhi",
              addressCountry: "IN",
            },
          }),
        },
      ],
    };
  },
  component: PropertyDetailPage,
});

const FACTS = [
  ["Property type", (p) => p.category],
  ["Transaction", (p) => (p.transaction === "rent" ? "For Rent" : "For Sale")],
  ["Bedrooms", (p) => (p.bedrooms ? `${p.bedrooms} BHK` : "—")],
  ["Bathrooms", (p) => (p.bathrooms ? String(p.bathrooms) : "—")],
  ["Built-up area", (p) => (p.area ? `${Number(p.area).toLocaleString("en-IN")} sq.ft.` : "—")],
  ["Furnishing", (p) => p.furnishing || "—"],
  ["Floor", (p) => p.floor || "—"],
  ["Facing", (p) => p.facing || "—"],
  ["Parking", (p) => p.parking || "—"],
  ["Availability", (p) => p.availability || "—"],
];

function PropertyDetailPage() {
  const { property } = Route.useLoaderData();
  const { setMessage } = useWhatsAppFloat();

  const propertyUrl =
    typeof window !== "undefined" ? `${window.location.origin}/property/${property.slug}` : "";

  const waMessage = `Hello ${SITE.consultant}, I'm interested in "${property.title}" in ${property.locality} (${formatPrice(
    property.price,
    property.transaction,
  )}).${propertyUrl ? ` ${propertyUrl}` : ""}`;

  useEffect(() => {
    setMessage(waMessage);
    return () => setMessage("");
  }, [waMessage, setMessage]);

  return (
    <div className="bg-cream pt-[104px] lg:pt-[132px]">
      <div className="mx-auto w-full max-w-[1320px] px-5 pt-6 sm:px-8 lg:px-12">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 font-body text-[10.5px] uppercase tracking-[0.14em] text-stone">
          <Link to="/" className="transition-colors hover:text-ink">Home</Link>
          <ChevronRight className="h-3 w-3" strokeWidth={1.6} />
          <Link to="/properties" className="transition-colors hover:text-ink">Properties</Link>
          <ChevronRight className="h-3 w-3" strokeWidth={1.6} />
          <span className="text-ink/70">{property.locality}</span>
        </nav>

        <div className="mt-6 flex flex-col justify-between gap-5 border-b border-hairline pb-8 md:flex-row md:items-end">
          <div>
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
              {property.transaction === "rent" ? "For Rent" : "For Sale"} · {property.locality}
            </p>
            <h1 className="mt-3 max-w-2xl font-display text-[clamp(1.9rem,1.4rem+2.2vw,3.1rem)] font-light leading-[1.08] tracking-[-0.01em] text-ink">
              {property.title}
            </h1>
            <p className="mt-3 font-body text-[13px] text-stone">
              {property.category}
              {property.area ? ` · ${Number(property.area).toLocaleString("en-IN")} sq.ft.` : ""}
              {property.bedrooms ? ` · ${property.bedrooms} BHK` : ""}
            </p>
          </div>
          <div className="md:text-right">
            <p className="font-display text-[clamp(1.8rem,1.4rem+1.6vw,2.6rem)] font-light leading-none text-ink">
              {formatPrice(property.price, property.transaction)}
            </p>
            <p className="mt-2 font-body text-[10.5px] uppercase tracking-[0.16em] text-stone">
              {property.availability || "Availability on request"}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-5 pt-8 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.65fr_1fr] lg:gap-12">
          <div>
            <Gallery images={property.images || []} title={property.title} />

            <div className="mt-8 grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-3">
              {FACTS.map(([label, get]) => {
                const value = get(property);
                if (!value || value === "—") return null;
                return (
                  <div key={label} className="bg-ivory px-4 py-4">
                    <p className="font-body text-[9px] font-semibold uppercase tracking-[0.16em] text-stone">
                      {label}
                    </p>
                    <p className="mt-1.5 font-body text-[13.5px] text-ink">{value}</p>
                  </div>
                );
              })}
            </div>

            {property.description && (
              <div className="mt-10">
                <h2 className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                  About this property
                </h2>
                <p className="mt-4 whitespace-pre-line font-body text-[14.5px] leading-[1.85] text-stone">
                  {property.description}
                </p>
              </div>
            )}

            {Array.isArray(property.features) && property.features.length > 0 && (
              <div className="mt-10">
                <h2 className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                  Highlights
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-2">
                  {property.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 bg-ivory px-4 py-3">
                      <span className="h-1 w-1 shrink-0 bg-gold" aria-hidden="true" />
                      <span className="font-body text-[13px] text-ink">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10">
              <h2 className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                Location
              </h2>
              <div className="mt-4">
                <PropertyMap property={property} />
              </div>
              <p className="mt-3 font-body text-[13px] leading-relaxed text-stone">
                {property.show_exact_address && property.address
                  ? property.address
                  : `${property.locality}, East Delhi — exact address shared on request.`}
              </p>
            </div>
          </div>

          <aside>
            <div className="lg:sticky lg:top-32">
              <EnquiryForm property={property} />

              <div className="mt-4 grid grid-cols-2 gap-3">
                <a
                  href={telLink()}
                  className="inline-flex h-11 items-center justify-center gap-2 border border-ink font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-ivory"
                >
                  <Phone className="h-3.5 w-3.5" strokeWidth={1.6} />
                  Call now
                </a>
                <a
                  href={whatsappLink(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 border border-hairline bg-[#F1EEE5] font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink"
                >
                  <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.6} />
                  WhatsApp
                </a>
              </div>
              <p className="mt-3 font-body text-[11px] leading-relaxed text-stone">
                {SITE.consultant} · {SITE.phone}
              </p>
            </div>
          </aside>
        </div>
      </div>

      <div className="mt-16">
        <SimilarProperties property={property} />
      </div>

      {/* mobile quick actions */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-hairline bg-ivory lg:hidden">
        <a
          href={telLink()}
          className="flex h-14 items-center justify-center gap-2 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-ink"
        >
          <Phone className="h-3.5 w-3.5 text-gold" strokeWidth={1.6} />
          Call
        </a>
        <a
          href={whatsappLink(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 items-center justify-center gap-2 bg-ink font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-ivory"
        >
          <MessageCircle className="h-3.5 w-3.5 text-gold" strokeWidth={1.6} />
          WhatsApp
        </a>
      </div>
      <div className="h-14 lg:hidden" aria-hidden="true" />
    </div>
  );
}
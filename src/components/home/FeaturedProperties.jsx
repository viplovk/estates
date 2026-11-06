import { Link } from "@tanstack/react-router";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Reveal, Section, SectionHead, HairlineLink } from "@/components/site/Section";

function EmptyState() {
  return (
    <div className="border border-dashed border-hairline bg-ivory px-8 py-16 text-center">
      <p className="font-display text-2xl font-light text-ink">New listings are being prepared</p>
      <p className="mx-auto mt-3 max-w-md font-body text-[13.5px] leading-relaxed text-stone">
        There are no published properties on the site right now. Tell us what you are
        looking for and we will share suitable options from East Delhi as they come up.
      </p>
      <Link
        to="/contact"
        className="mt-6 inline-flex h-11 items-center gap-3 border border-ink px-6 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-ivory"
      >
        Share Your Requirement
      </Link>
    </div>
  );
}

export function FeaturedProperties({ properties = [] }) {
  return (
    <Section className="py-20 md:py-28">
      <SectionHead
        eyebrow="Selected Inventory"
        title="Featured properties"
        description="A considered selection from our current East Delhi portfolio — residential and commercial."
        action={
          <Link to="/properties">
            <HairlineLink>View all properties</HairlineLink>
          </Link>
        }
      />
      {properties.length === 0 ? (
        <div className="mt-12">
          <EmptyState />
        </div>
      ) : (
        <div className="mt-12 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property, i) => (
            <Reveal key={property.id} delay={i * 0.07}>
              <PropertyCard property={property} />
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}
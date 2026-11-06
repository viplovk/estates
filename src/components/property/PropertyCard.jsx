import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { formatPrice } from "@/lib/site";

export function PropertyCard({ property }) {
  const cover = property.cover_image || property.images?.[0] || null;
  const href = { to: "/property/$slug", params: { slug: property.slug } };
  const isRent = property.transaction === "rent";

  return (
    <article className="group">
      <Link {...href} className="block">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#E7E2D6]">
          {cover ? (
            <Image
              src={cover}
              alt={property.title}
              loading="lazy"
              fittingType="fill"
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-stone">
                Photograph pending
              </span>
            </div>
          )}
          <div className="absolute left-0 top-0 flex flex-col gap-1 p-4">
            {property.featured && (
              <span className="bg-ivory/95 px-2 py-1 font-body text-[9px] font-semibold uppercase tracking-[0.18em] text-gold backdrop-blur">
                Featured
              </span>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink-deep/70 to-transparent p-4">
            <span className="font-display text-[22px] font-normal leading-none text-ivory">
              {formatPrice(property.price, property.transaction)}
            </span>
            <span className="font-body text-[9px] font-semibold uppercase tracking-[0.18em] text-ivory/85">
              {isRent ? "For Rent" : "For Sale"}
            </span>
          </div>
        </div>
      </Link>

      <div className="border-b border-hairline pb-5 pt-4">
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
          {property.locality}
        </p>
        <Link {...href}>
          <h3 className="mt-2 font-display text-[21px] font-normal leading-snug text-ink transition-colors duration-300 group-hover:text-gold">
            {property.title}
          </h3>
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-[11.5px] text-stone">
          <span>{property.category}</span>
          {!!property.bedrooms && (
            <>
              <span className="h-2.5 w-px bg-hairline" aria-hidden="true" />
              <span>{property.bedrooms} BHK</span>
            </>
          )}
          {!!property.bathrooms && (
            <>
              <span className="h-2.5 w-px bg-hairline" aria-hidden="true" />
              <span>{property.bathrooms} Bath</span>
            </>
          )}
          {!!property.area && (
            <>
              <span className="h-2.5 w-px bg-hairline" aria-hidden="true" />
              <span>{Number(property.area).toLocaleString("en-IN")} sq.ft.</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
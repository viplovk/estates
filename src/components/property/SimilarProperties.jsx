import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getSimilarProperties } from "@/lib/server-fns";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Section } from "@/components/site/Section";

export function SimilarProperties({ property }) {
  const fetchSimilar = useServerFn(getSimilarProperties);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    fetchSimilar({
      data: {
        id: property.id,
        transaction: property.transaction,
        locality: property.locality,
        category: property.category,
      },
    })
      .then((res) => alive && setItems(res || []))
      .catch(() => alive && setItems([]));
    return () => {
      alive = false;
    };
  }, [property.id, property.transaction, property.locality, property.category, fetchSimilar]);

  if (items.length === 0) return null;

  return (
    <Section className="border-t border-hairline py-16 md:py-20">
      <div className="flex items-end justify-between border-b border-hairline pb-6">
        <div>
          <p className="eyebrow">Also Consider</p>
          <h2 className="mt-3 font-display text-[clamp(1.7rem,1.3rem+1.6vw,2.4rem)] font-light text-ink">
            Similar properties
          </h2>
        </div>
      </div>
      <div className="mt-10 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </Section>
  );
}
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Section, SectionHead } from "@/components/site/Section";
import { LOCALITIES } from "@/lib/site";

export function Neighbourhoods() {
  return (
    <Section className="bg-cream py-20 md:py-28">
      <SectionHead
        eyebrow="Find Your Neighbourhood"
        title="The localities we know best"
        description="Fifteen East Delhi neighbourhoods, each with its own character, connectivity and price rhythm. Select one to see what is available."
      />
      <div className="mt-12 grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-3 lg:grid-cols-5">
        {LOCALITIES.map((loc, i) => (
          <Reveal key={loc} delay={Math.min(i * 0.03, 0.3)}>
            <Link
              to="/properties"
              search={{ locality: loc }}
              className="group flex h-full flex-col justify-between bg-ivory px-5 py-7 transition-colors duration-500 hover:bg-[#F1EEE5]"
            >
              <span className="font-body text-[10px] font-semibold tracking-[0.18em] text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-8 flex items-end justify-between gap-2">
                <span className="font-display text-[19px] font-normal leading-tight text-ink sm:text-[20px]">
                  {loc}
                </span>
                <ArrowUpRight
                  className="mb-1 h-3.5 w-3.5 shrink-0 text-stone transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
                  strokeWidth={1.5}
                />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 max-w-2xl font-body text-[11.5px] leading-relaxed text-stone">
        These are the areas we actively serve. Availability varies by locality and
        budget — get in touch for a current view of the market.
      </p>
    </Section>
  );
}
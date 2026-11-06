import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { HERO_IMAGES } from "@/components/home/Hero";
import { Section } from "@/components/site/Section";
import { LOCALITIES, SITE } from "@/lib/site";

export const Route = createFileRoute("/_site/about")({
  head: () => ({
    meta: [
      { title: "About — Viplov Kashyap, East Delhi Realty" },
      {
        name: "description",
        content:
          "East Delhi Realty is the property consultancy of Viplov Kashyap, based in Shakarpur and working across fifteen East Delhi localities.",
      },
      { property: "og:title", content: "About East Delhi Realty" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="bg-cream pt-[104px] lg:pt-[132px]">
      <Section className="pt-10 lg:pt-14">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="eyebrow">About</p>
            <h1 className="mt-4 font-display text-[clamp(2.2rem,1.6rem+2.8vw,3.8rem)] font-light leading-[1.04] tracking-[-0.01em] text-ink">
              Local knowledge. Better property decisions.
            </h1>
            <div className="mt-7 space-y-5 font-body text-[14.5px] leading-[1.85] text-stone">
              <p>
                East Delhi Realty is the practice of {SITE.consultant}, a property
                consultant based in {SITE.locality}. The work is deliberately focused:
                one part of the city, understood properly, rather than a national portal
                with a local filter.
              </p>
              <p>
                The consultancy covers residential and commercial requirements across
                fifteen East Delhi localities — flats, builder floors, independent houses,
                villas and plots, alongside shops, offices and warehouse space.
              </p>
              <p>
                Buyers and tenants get a shortlist that reflects real budgets and real
                commutes, visits arranged around their schedule, and honest answers about
                what a property is and is not. Owners get a measured view of what their
                property is worth in the current market.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-hairline pt-7 sm:grid-cols-3">
              {[
                { k: "15", v: "Localities covered" },
                { k: "8", v: "Property categories" },
                { k: "1:1", v: "Personal assistance" },
              ].map((s) => (
                <div key={s.v}>
                  <p className="font-display text-[30px] font-light leading-none text-ink">{s.k}</p>
                  <p className="mt-2 font-body text-[10px] uppercase tracking-[0.14em] text-stone">{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#E7E2D6]">
              <Image
                src={HERO_IMAGES.detail}
                alt="Architectural detail from a residence in East Delhi"
                fittingType="fill"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-5 border-l border-gold/60 pl-4">
              <p className="font-display text-[22px] font-normal text-ink">{SITE.consultant}</p>
              <p className="mt-1 font-body text-[10px] uppercase tracking-[0.16em] text-stone">
                Property consultant · {SITE.locality}, East Delhi
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="border-t border-hairline py-16 md:py-24">
        <p className="eyebrow">Service Area</p>
        <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.8rem,1.3rem+2vw,2.8rem)] font-light leading-[1.1] text-ink">
          Fifteen localities, one continuous patch of the city
        </h2>
        <div className="mt-8 flex flex-wrap gap-x-3 gap-y-3">
          {LOCALITIES.map((loc) => (
            <Link
              key={loc}
              to="/properties"
              search={{ locality: loc }}
              className="border border-hairline px-4 py-2 font-body text-[11.5px] text-stone transition-colors hover:border-ink hover:text-ink"
            >
              {loc}
            </Link>
          ))}
        </div>
        <p className="mt-6 max-w-xl font-body text-[11.5px] leading-relaxed text-stone">
          These are the areas served — availability of specific property types varies by
          locality and budget at any given time.
        </p>
      </Section>

      <Section className="border-t border-hairline py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { t: "How we advise", c: "Straight answers on pricing, locality trade-offs and documentation. No pressure to close." },
            { t: "How we work", c: "One point of contact from first enquiry through visits, negotiation and handover." },
            { t: "How we're paid", c: "Consultancy and brokerage terms are agreed in writing before any commitment." },
          ].map((item) => (
            <div key={item.t} className="border-t border-hairline pt-5">
              <h3 className="font-display text-[21px] font-normal text-ink">{item.t}</h3>
              <p className="mt-3 font-body text-[13px] leading-relaxed text-stone">{item.c}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
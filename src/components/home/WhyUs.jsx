import { Image } from "@/components/ui/image";
import { HERO_IMAGES } from "@/components/home/Hero";
import { Reveal, Section } from "@/components/site/Section";
import { SITE } from "@/lib/site";

const POINTS = [
  {
    title: "Local East Delhi market knowledge",
    copy: "Street-level understanding of Shakarpur, Laxmi Nagar, Preet Vihar and the wider East Delhi belt — what a price actually reflects.",
  },
  {
    title: "Assistance throughout the search",
    copy: "One point of contact from first enquiry to possession, with clear answers rather than sales pressure.",
  },
  {
    title: "Personalised recommendations",
    copy: "Options filtered against your budget, family size and commute before you spend an evening on visits.",
  },
  {
    title: "Support with property visits",
    copy: "Visits arranged around your availability, with the property's practical details verified beforehand.",
  },
  {
    title: "Buyer and seller assistance",
    copy: "Guidance on documentation, negotiation and handover for both sides of the transaction.",
  },
];

export function WhyUs() {
  return (
    <Section className="border-t border-hairline py-20 md:py-28">
      <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <Reveal>
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow">Why East Delhi Realty</p>
            <h2 className="mt-5 font-display text-[clamp(2rem,1.4rem+2.4vw,3.4rem)] font-light leading-[1.06] tracking-[-0.01em] text-ink">
              Guidance that comes from knowing the streets, not just the listings.
            </h2>
            <p className="mt-6 max-w-md font-body text-[14px] leading-relaxed text-stone">
              East Delhi moves at its own pace. A property that looks right on a portal
              can sit on the wrong side of a main road, a school catchment or a metro
              walk. Local context is what turns a search into a decision.
            </p>
            <div className="relative mt-10 hidden aspect-[4/3] overflow-hidden bg-[#E7E2D6] lg:block">
              <Image
                src={HERO_IMAGES.living}
                alt="Interior of a residence in East Delhi"
                fittingType="fill"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-4 font-body text-[11px] uppercase tracking-[0.16em] text-stone">
              Consultancy led by {SITE.consultant} · {SITE.locality}
            </p>
          </div>
        </Reveal>

        <div>
          {POINTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="group border-t border-hairline py-7">
                <div className="flex items-baseline gap-5">
                  <span className="font-body text-[10px] font-semibold tracking-[0.2em] text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-[22px] font-normal leading-snug text-ink">
                      {p.title}
                    </h3>
                    <p className="mt-2 max-w-lg font-body text-[13.5px] leading-relaxed text-stone">
                      {p.copy}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
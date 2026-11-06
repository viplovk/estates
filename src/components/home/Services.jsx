import { Link } from "@tanstack/react-router";
import { Reveal, Section, SectionHead } from "@/components/site/Section";
import { SITE } from "@/lib/site";

const SERVICES = [
  {
    n: "01",
    title: "Buy",
    copy: "Shortlists shaped around your budget, commute and long-term intent — with honest guidance on what each locality really offers.",
    to: "/buy",
    cta: "Buy a property",
  },
  {
    n: "02",
    title: "Rent",
    copy: "Flats, builder floors and independent homes on rent across East Delhi, with visits arranged around your schedule.",
    to: "/rent",
    cta: "Find a rental",
  },
  {
    n: "03",
    title: "Sell",
    copy: "A measured valuation, discreet marketing and qualified buyers — your property presented with care, not noise.",
    to: "/list-property",
    cta: "Sell your property",
  },
  {
    n: "04",
    title: "Rent Out",
    copy: "Tenant screening and paperwork support so your property is let to the right people with fewer surprises.",
    to: "/list-property",
    cta: "Rent out your property",
  },
];

export function Services() {
  return (
    <Section className="border-t border-hairline py-20 md:py-28">
      <SectionHead
        eyebrow="How We Work With You"
        title="Four ways we can help"
        description={`${SITE.consultant} works directly with every client — no call centres, no handoffs.`}
      />
      <div className="mt-12 grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.06}>
            <Link
              to={s.to}
              className="group flex h-full flex-col bg-cream px-6 py-9 transition-colors duration-500 hover:bg-ivory"
            >
              <span className="font-body text-[10px] font-semibold tracking-[0.2em] text-gold">
                {s.n}
              </span>
              <h3 className="mt-6 font-display text-[30px] font-light leading-none text-ink">
                {s.title}
              </h3>
              <p className="mt-4 font-body text-[13px] leading-relaxed text-stone">{s.copy}</p>
              <span className="mt-auto pt-8 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors duration-300 group-hover:text-gold">
                {s.cta} →
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
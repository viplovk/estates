import { Reveal, Section } from "@/components/site/Section";

const STEPS = [
  {
    n: "01",
    title: "Discover",
    copy: "Explore current listings or share your brief. We narrow the field to properties that genuinely fit.",
  },
  {
    n: "02",
    title: "Connect",
    copy: "Ask questions, compare localities and understand pricing — before committing an evening to visits.",
  },
  {
    n: "03",
    title: "Visit",
    copy: "Schedule viewings at times that suit you, with support through negotiation and paperwork.",
  },
];

export function HowItWorks() {
  return (
    <Section className="bg-cream py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.6fr_1.4fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">The Process</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,1.4rem+2.2vw,3.1rem)] font-light leading-[1.08] text-ink">
            Three quiet steps
          </h2>
          <p className="mt-4 max-w-xs font-body text-[13.5px] leading-relaxed text-stone">
            No obligation, no automated drip. Just a conversation that moves at your pace.
          </p>
        </Reveal>

        <div className="grid gap-px bg-hairline sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="h-full bg-cream pt-7 sm:px-6 sm:pt-0">
                <div className="flex items-center gap-3">
                  <span className="font-display text-[34px] font-light leading-none text-gold">
                    {s.n}
                  </span>
                  <span className="h-px flex-1 bg-hairline" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-ink">
                  {s.title}
                </h3>
                <p className="mt-3 pb-2 font-body text-[13px] leading-relaxed text-stone">
                  {s.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
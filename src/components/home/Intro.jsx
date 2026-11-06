import { Image } from "@/components/ui/image";
import { HERO_IMAGES } from "@/components/home/Hero";
import { Reveal, Section } from "@/components/site/Section";
import { SITE } from "@/lib/site";

export function Intro() {
  return (
    <Section className="border-t border-hairline py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow">East Delhi, Considered</p>
          <h2 className="mt-5 max-w-xl font-display text-[clamp(1.9rem,1.4rem+2.2vw,3.1rem)] font-light leading-[1.08] tracking-[-0.01em] text-ink">
            A property consultancy built on one neighbourhood, understood properly.
          </h2>
        </Reveal>
        <Reveal delay={0.12} className="lg:pt-4">
          <p className="font-body text-[14.5px] leading-[1.8] text-stone">
            East Delhi Realty is the practice of {SITE.consultant}, based in {SITE.locality}.
            The work is straightforward: understand what you need, show you properties that
            genuinely fit, and stay available through the visits, questions and paperwork that
            follow.
          </p>
          <p className="mt-5 font-body text-[14.5px] leading-[1.8] text-stone">
            We cover residential and commercial requirements across fifteen localities — from
            flats and builder floors to shops, offices and plots.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-hairline pt-6">
            {[
              { k: "15", v: "Localities served" },
              { k: "8", v: "Property categories" },
              { k: "1:1", v: "Direct assistance" },
            ].map((s) => (
              <div key={s.v}>
                <p className="font-display text-[28px] font-light leading-none text-ink">{s.k}</p>
                <p className="mt-2 font-body text-[10px] uppercase tracking-[0.14em] text-stone">{s.v}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="relative mt-14 h-[38vw] max-h-[420px] min-h-[200px] w-full overflow-hidden bg-[#E7E2D6]">
          <Image
            src={HERO_IMAGES.exterior}
            alt="Architectural detail of an East Delhi residence"
            fittingType="fill"
            className="h-full w-full object-cover"
          />
        </div>
      </Reveal>
    </Section>
  );
}
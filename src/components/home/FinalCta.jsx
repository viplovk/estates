import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Section";
import { SITE, whatsappLink } from "@/lib/site";

export function FinalCta() {
  return (
    <section className="bg-ink-deep px-5 py-20 sm:px-8 md:py-28 lg:px-12">
      <div className="mx-auto grid w-full max-w-[1320px] gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <Reveal>
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
            A Conversation, Not a Sales Pitch
          </p>
          <h2 className="mt-6 max-w-2xl font-display text-[clamp(2.1rem,1.5rem+2.8vw,3.9rem)] font-light leading-[1.04] tracking-[-0.01em] text-ivory">
            Looking for the right property in East Delhi?
          </h2>
          <p className="mt-6 max-w-lg font-body text-[14px] leading-relaxed text-ivory/65">
            Tell us what you're looking for. We'll help you explore suitable options —
            residential or commercial, to buy or to rent.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-stretch">
            <Link
              to="/contact"
              className="group inline-flex h-14 flex-1 items-stretch overflow-hidden border border-gold/70 bg-gold transition-colors duration-300 hover:bg-ivory"
            >
              <span className="inline-flex flex-1 items-center px-6 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-deep">
                Find My Property
              </span>
              <span className="w-px self-stretch bg-ink-deep/20" aria-hidden="true" />
              <span className="inline-flex w-14 items-center justify-center text-ink-deep" aria-hidden="true">
                <svg viewBox="0 0 17.4 17.4" fill="none" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M11.35 1.52 14.1 4.68c1.87 2.15 1.87 5.63 0 7.78l-2.75 3.16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M15.5 8.63H1.07" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </span>
            </Link>
            <a
              href={whatsappLink(`Hello ${SITE.consultant}, I'm looking for a property in East Delhi. Could you help?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 flex-1 items-center justify-center border border-ivory/25 px-6 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors duration-300 hover:border-ivory hover:bg-ivory/5"
            >
              WhatsApp Us
            </a>
          </div>
          <p className="mt-5 font-body text-[11.5px] leading-relaxed text-ivory/45">
            {SITE.phone} · {SITE.locality}, East Delhi
          </p>
        </Reveal>
      </div>
    </section>
  );
}
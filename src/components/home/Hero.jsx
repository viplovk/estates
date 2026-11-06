const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { SearchPanel } from "@/components/home/SearchPanel";
import { SITE, whatsappLink } from "@/lib/site";

export const HERO_IMAGES = {
  exterior:
    "https://media.db.com/images/public/6aeddb4b1ef5d84c59e0ee0c/a06aee8e3_generated_image.png",
  living:
    "https://media.db.com/images/public/6aeddb4b1ef5d84c59e0ee0c/44a4fcacd_generated_image.png",
  detail:
    "https://media.db.com/images/public/6aeddb4b1ef5d84c59e0ee0c/771caa9ca_generated_image.png",
};

const STRIP = [
  { src: HERO_IMAGES.exterior, alt: "Contemporary independent floor residence at golden hour" },
  { src: HERO_IMAGES.living, alt: "Sunlit living room with marble floors and oak joinery" },
  { src: HERO_IMAGES.detail, alt: "Marble stair and brass handrail detail" },
];

const HEADLINE = "Find Your Place in East Delhi.";

function RippleText({ text }) {
  let i = 0;
  return (
    <>
      {text.split("").map((ch, idx) => {
        if (ch === " ") return <span key={`s-${idx}`}> </span>;
        const n = i++;
        return (
          <span
            key={`l-${idx}`}
            className="edr-letter"
            style={{ "--edr-i": n }}
          >
            {ch}
          </span>
        );
      })}
    </>
  );
}

const rise = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export function Hero({ featuredCount = 0 }) {
  return (
    <section className="relative overflow-hidden bg-cream pt-[104px] lg:pt-[132px]" aria-label="Introduction">
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center text-center">
          <motion.p
            {...rise}
            transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
            className="inline-flex items-center gap-3 font-body text-[10px] font-semibold uppercase tracking-[0.24em] text-gold"
          >
            <span className="h-px w-8 bg-gold/60" aria-hidden="true" />
            {SITE.locality} · East Delhi
            <span className="h-px w-8 bg-gold/60" aria-hidden="true" />
          </motion.p>

          <motion.h1
            {...rise}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 0.61, 0.36, 1] }}
            className="mt-5 max-w-4xl font-display text-[clamp(2.6rem,1.6rem+5.2vw,5.25rem)] font-light leading-[1.02] tracking-[-0.015em] text-ink"
          >
            <RippleText text={HEADLINE} />
          </motion.h1>

          <motion.p
            {...rise}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
            className="mt-6 max-w-xl font-body text-[14.5px] leading-relaxed text-stone sm:text-[15px]"
          >
            Discover residential and commercial properties across East Delhi with
            trusted local real estate assistance — from {SITE.consultant} in {SITE.locality}.
          </motion.p>

          <motion.div
            {...rise}
            transition={{ duration: 0.8, delay: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-6"
          >
            <Link
              to="/properties"
              className="group inline-flex h-12 items-stretch overflow-hidden border border-ink-deep bg-ink-deep transition-colors duration-300 hover:border-gold hover:bg-gold"
            >
              <span className="inline-flex items-center px-6 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors duration-300 group-hover:text-ink-deep">
                Explore Properties
              </span>
              <span className="w-px self-stretch bg-gold transition-colors duration-300 group-hover:bg-ink-deep/30" aria-hidden="true" />
              <span className="inline-flex w-12 items-center justify-center text-gold transition-colors duration-300 group-hover:text-ink-deep" aria-hidden="true">
                <svg viewBox="0 0 17.4 17.4" fill="none" className="h-[17px] w-[17px] transition-transform duration-300 group-hover:translate-x-0.5">
                  <path d="M11.35 1.52 14.1 4.68c1.87 2.15 1.87 5.63 0 7.78l-2.75 3.16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M15.5 8.63H1.07" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </span>
            </Link>

            <Link
              to="/list-property"
              className="link-underline font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink"
            >
              List Your Property
            </Link>
          </motion.div>
        </div>

        <motion.div
          {...rise}
          transition={{ duration: 0.8, delay: 0.42, ease: [0.22, 0.61, 0.36, 1] }}
          className="mx-auto mt-11 max-w-5xl"
        >
          <SearchPanel />
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-body text-[11px] uppercase tracking-[0.14em] text-stone">
            <span>{featuredCount > 0 ? `${featuredCount} curated listings` : "Curated listings"}</span>
            <span className="hidden h-3 w-px bg-hairline sm:block" aria-hidden="true" />
            <span>15 East Delhi localities</span>
            <span className="hidden h-3 w-px bg-hairline sm:block" aria-hidden="true" />
            <a href={whatsappLink(`Hello ${SITE.consultant}, I'm looking for a property in East Delhi.`)} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">
              Speak to {SITE.consultant.split(" ")[0]}
            </a>
          </div>
        </motion.div>
      </div>

      <div className="mx-auto mt-12 w-full max-w-[1320px] px-5 sm:mt-14 sm:px-8 lg:px-12">
        <div className="grid h-[clamp(190px,29vw,400px)] grid-cols-3 gap-3 overflow-hidden sm:gap-4">
          {STRIP.map((photo, idx) => (
            <motion.figure
              key={photo.src}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 + idx * 0.11, ease: [0.22, 0.61, 0.36, 1] }}
              className={idx === 1 ? "translate-y-[clamp(18px,5vw,64px)]" : ""}
            >
              <div className="h-[calc(100%+70px)] w-full overflow-hidden bg-ink-deep/90">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  loading={idx === 0 ? "eager" : "lazy"}
                  fittingType="fill"
                  focalPointY={0.15}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
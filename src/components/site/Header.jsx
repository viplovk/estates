import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/site/Logo";
import { CATEGORIES, NAV_LINKS, SITE, telLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-hairline bg-cream/95 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-[74px] w-full max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:h-[86px] lg:px-12">
          <Logo />

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeProps={{ className: "text-ink" }}
                inactiveProps={{ className: "text-stone" }}
                activeOptions={{ exact: link.to === "/" }}
                className="link-underline font-body text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 hover:text-ink"
              >
                {link.label}
              </Link>
            ))}

            <div
              className="relative"
              onMouseEnter={() => setCatsOpen(true)}
              onMouseLeave={() => setCatsOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCatsOpen((v) => !v)}
                aria-expanded={catsOpen}
                className="link-underline inline-flex items-center gap-1.5 font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-stone transition-colors duration-300 hover:text-ink"
              >
                Categories
                <ChevronDown className="h-3 w-3" strokeWidth={1.6} />
              </button>
              <AnimatePresence>
                {catsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="absolute left-1/2 top-full w-60 -translate-x-1/2 pt-5"
                  >
                    <div className="border border-hairline bg-ivory p-2 shadow-[0_24px_60px_-30px_rgba(23,23,21,0.35)]">
                      {CATEGORIES.map((cat) => (
                        <Link
                          key={cat}
                          to="/properties"
                          search={{ category: cat }}
                          className="block px-3 py-2 font-body text-[13px] text-stone transition-colors duration-200 hover:bg-cream hover:text-ink"
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <a
              href={telLink()}
              className="inline-flex items-center gap-2 font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-stone transition-colors hover:text-ink"
            >
              <Phone className="h-3.5 w-3.5 text-gold" strokeWidth={1.6} />
              {SITE.phone}
            </a>
            <Link
              to="/contact"
              className="group inline-flex h-10 items-center gap-3 border border-ink px-5 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors duration-300 hover:bg-ink hover:text-ivory"
            >
              Enquire Now
              <span className="h-3 w-px bg-gold" aria-hidden="true" />
              <ChevronDown className="h-3 w-3 -rotate-90 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.8} />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center border border-hairline text-ink lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.4} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="absolute inset-0 bg-ink-deep/40"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
              className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-cream px-6 py-5"
            >
              <div className="flex items-center justify-between">
                <Logo onClick={() => setOpen(false)} />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center border border-hairline"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" strokeWidth={1.4} />
                </button>
              </div>

              <nav className="mt-10 flex flex-col" aria-label="Mobile">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="border-b border-hairline py-4 font-display text-2xl text-ink"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="border-b border-hairline py-4 font-display text-2xl text-ink"
                >
                  Contact
                </Link>
                <Link
                  to="/list-property"
                  onClick={() => setOpen(false)}
                  className="border-b border-hairline py-4 font-display text-2xl text-ink"
                >
                  List Your Property
                </Link>
              </nav>

              <div className="mt-auto space-y-4 pt-8">
                <a
                  href={telLink()}
                  className="flex items-center gap-3 font-body text-sm text-ink"
                >
                  <Phone className="h-4 w-4 text-gold" strokeWidth={1.5} />
                  {SITE.phone}
                </a>
                <p className="font-body text-[11px] uppercase tracking-[0.16em] text-stone">
                  {SITE.address}
                </p>
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="flex h-12 w-full items-center justify-center bg-ink font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory"
                >
                  Enquire Now
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
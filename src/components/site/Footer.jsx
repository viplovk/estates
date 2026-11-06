import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/site/Logo";
import { CATEGORIES, LOCALITIES, SITE, telLink, whatsappLink } from "@/lib/site";

const explore = [
  { label: "Buy Property", to: "/buy" },
  { label: "Rent Property", to: "/rent" },
  { label: "All Properties", to: "/properties" },
  { label: "Commercial", to: "/commercial" },
];

const office = [
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "List Your Property", to: "/list-property" },
  { label: "Privacy Policy", to: "/privacy" },
];

function Column({ title, children }) {
  return (
    <div>
      <h3 className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
        {title}
      </h3>
      <ul className="mt-5 space-y-2.5">{children}</ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-cream">
      <div className="mx-auto w-full max-w-[1320px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <Logo />
            <p className="mt-6 max-w-xs font-body text-[13.5px] leading-relaxed text-stone">
              A local property consultancy led by {SITE.consultant}, helping buyers,
              tenants and owners across East Delhi make considered decisions.
            </p>
            <dl className="mt-7 space-y-3 font-body text-[13px]">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-stone/80">Phone</dt>
                <dd>
                  <a href={telLink()} className="text-ink transition-colors hover:text-gold">
                    {SITE.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-stone/80">WhatsApp</dt>
                <dd>
                  <a
                    href={whatsappLink(`Hello ${SITE.consultant}, I'd like to enquire about a property.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink transition-colors hover:text-gold"
                  >
                    Chat on WhatsApp
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-stone/80">Email</dt>
                <dd>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-ink transition-colors hover:text-gold"
                  >
                    {SITE.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-stone/80">Office</dt>
                <dd className="text-ink">{SITE.address}</dd>
              </div>
            </dl>
          </div>

          <Column title="Explore">
            {explore.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="font-body text-[13px] text-stone transition-colors hover:text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </Column>

          <Column title="Property Types">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c}>
                <Link
                  to="/properties"
                  search={{ category: c }}
                  className="font-body text-[13px] text-stone transition-colors hover:text-ink"
                >
                  {c}
                </Link>
              </li>
            ))}
          </Column>

          <Column title="Consultancy">
            {office.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="font-body text-[13px] text-stone transition-colors hover:text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </Column>
        </div>

        <div className="mt-14 border-t border-hairline pt-6">
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
            Service localities across East Delhi
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {LOCALITIES.map((loc) => (
              <Link
                key={loc}
                to="/properties"
                search={{ locality: loc }}
                className="font-body text-[12px] text-stone transition-colors hover:text-ink"
              >
                {loc}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-[11px] tracking-wide text-stone">
            © {new Date().getFullYear()} East Delhi Realty · {SITE.consultant} · {SITE.locality}, East Delhi
          </p>
          <div className="flex items-center gap-5 font-body text-[11px] uppercase tracking-[0.14em] text-stone">
            <Link to="/privacy" className="transition-colors hover:text-ink">
              Privacy
            </Link>
            <span className="h-3 w-px bg-hairline" aria-hidden="true" />
            <Link to="/contact" className="transition-colors hover:text-ink">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
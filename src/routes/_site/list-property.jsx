import { createFileRoute } from "@tanstack/react-router";
import { OwnerForm } from "@/components/owner/OwnerForm";
import { Image } from "@/components/ui/image";
import { HERO_IMAGES } from "@/components/home/Hero";
import { SITE, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/_site/list-property")({
  validateSearch: (search) => ({ intent: search?.intent === "rent" ? "rent" : "sell" }),
  head: () => ({
    meta: [
      { title: "List Your Property — Sell or Rent Out in East Delhi" },
      {
        name: "description",
        content:
          "Own a property in East Delhi? Share the details with Viplov Kashyap for a considered valuation and qualified buyers or tenants.",
      },
      { property: "og:title", content: "List Your Property — East Delhi Realty" },
    ],
    links: [{ rel: "canonical", href: "/list-property" }],
  }),
  component: ListPropertyPage,
});

function ListPropertyPage() {
  const { intent } = Route.useSearch();
  return (
    <div className="bg-cream pt-[104px] lg:pt-[132px]">
      <div className="mx-auto w-full max-w-[1320px] px-5 pt-10 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-end">
          <div>
            <p className="eyebrow">For Owners</p>
            <h1 className="mt-4 font-display text-[clamp(2.1rem,1.5rem+2.8vw,3.6rem)] font-light leading-[1.05] tracking-[-0.01em] text-ink">
              Have a property to sell or rent?
            </h1>
            <p className="mt-5 max-w-lg font-body text-[14px] leading-relaxed text-stone">
              Connect with people searching for properties across East Delhi. Share the
              details and {SITE.consultant} will assess the property, advise on pricing and
              present it to suitable buyers or tenants.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 font-body text-[11px] uppercase tracking-[0.14em] text-stone">
              <span>Reviewed before publishing</span>
              <span className="hidden h-3 w-px bg-hairline sm:block" aria-hidden="true" />
              <span>No listing fee to submit</span>
              <span className="hidden h-3 w-px bg-hairline sm:block" aria-hidden="true" />
              <a
                href={whatsappLink(`Hello ${SITE.consultant}, I'd like to list my property in East Delhi.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold transition-colors hover:text-ink"
              >
                Or WhatsApp us
              </a>
            </div>
          </div>
          <div className="relative hidden aspect-[16/11] w-full overflow-hidden bg-[#E7E2D6] lg:block">
            <Image
              src={HERO_IMAGES.exterior}
              alt="Residence exterior in East Delhi"
              fittingType="fill"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-5 pb-20 pt-12 sm:px-8 lg:px-12 lg:pb-28">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:gap-14">
          <OwnerForm defaultIntent={intent === "rent" ? "rent" : "sell"} />
          <aside className="space-y-8">
            <div className="border-t border-hairline pt-5">
              <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-gold">
                What happens next
              </p>
              <ol className="mt-4 space-y-4">
                {[
                  "We review your submission and confirm the key details with you.",
                  "A realistic price or rent band is agreed for the locality.",
                  "Approved properties become draft listings, then go live once verified.",
                ].map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span className="font-body text-[10px] font-semibold tracking-[0.16em] text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-body text-[12.5px] leading-relaxed text-stone">{t}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="border-t border-hairline pt-5">
              <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-gold">
                Prefer to talk first?
              </p>
              <p className="mt-3 font-body text-[12.5px] leading-relaxed text-stone">
                Call {SITE.consultant} on{" "}
                <a href={`tel:${SITE.phoneRaw}`} className="text-ink underline decoration-gold/60 underline-offset-4">
                  {SITE.phone}
                </a>{" "}
                or email {SITE.email}.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
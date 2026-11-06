import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { SITE, telLink, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/_site/contact")({
  head: () => ({
    meta: [
      { title: "Contact East Delhi Realty — Shakarpur, East Delhi" },
      {
        name: "description",
        content:
          "Speak with Viplov Kashyap about buying, renting, selling or letting property in East Delhi. Call, WhatsApp or send an enquiry.",
      },
      { property: "og:title", content: "Contact East Delhi Realty" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const MAP_SRC =
  "https://www.openstreetmap.org/export/embed.html?bbox=77.2674%2C28.6215%2C77.2874%2C28.6415&layer=mapnik&marker=28.6315%2C77.2774";

function ContactPage() {
  return (
    <div className="bg-cream pt-[104px] lg:pt-[132px]">
      <div className="mx-auto w-full max-w-[1320px] px-5 pb-16 pt-10 sm:px-8 lg:px-12 lg:pb-24">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.1rem,1.5rem+2.8vw,3.6rem)] font-light leading-[1.05] tracking-[-0.01em] text-ink">
          Let's talk about your property plans
        </h1>
        <p className="mt-5 max-w-xl font-body text-[14px] leading-relaxed text-stone">
          Whether you are buying, renting, selling or letting out — a short conversation
          usually saves weeks of searching.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <div className="space-y-px border border-hairline bg-hairline">
              <a href={telLink()} className="group flex items-start gap-4 bg-ivory px-5 py-5 transition-colors hover:bg-[#F1EEE5]">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.6} />
                <div>
                  <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Phone</p>
                  <p className="mt-1 font-body text-[14.5px] text-ink">{SITE.phone}</p>
                </div>
              </a>
              <a
                href={whatsappLink(`Hello ${SITE.consultant}, I'd like to discuss a property requirement in East Delhi.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 bg-ivory px-5 py-5 transition-colors hover:bg-[#F1EEE5]"
              >
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.6} />
                <div>
                  <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">WhatsApp</p>
                  <p className="mt-1 font-body text-[14.5px] text-ink">Message {SITE.consultant}</p>
                </div>
              </a>
              <a href={`mailto:${SITE.email}`} className="group flex items-start gap-4 bg-ivory px-5 py-5 transition-colors hover:bg-[#F1EEE5]">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.6} />
                <div>
                  <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Email</p>
                  <p className="mt-1 font-body text-[14.5px] text-ink">{SITE.email}</p>
                </div>
              </a>
              <div className="flex items-start gap-4 bg-ivory px-5 py-5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.6} />
                <div>
                  <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Office</p>
                  <p className="mt-1 font-body text-[14.5px] leading-relaxed text-ink">{SITE.address}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">
                Shakarpur, East Delhi
              </p>
              <div className="mt-3 aspect-[16/10] w-full overflow-hidden border border-hairline bg-[#E7E2D6]">
                <iframe
                  title="Map of Shakarpur, East Delhi"
                  src={MAP_SRC}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                />
              </div>
            </div>

            <div className="mt-8">
              <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">
                Service area
              </p>
              <p className="mt-3 max-w-sm font-body text-[13px] leading-relaxed text-stone">
                We work across East Delhi — Shakarpur, Laxmi Nagar, Nirman Vihar, Preet Vihar,
                Pandav Nagar, Mayur Vihar, Patparganj, IP Extension, Anand Vihar, Krishna Nagar,
                Geeta Colony, Vivek Vihar, Shahdara, Dilshad Garden and Karkardooma.
              </p>
            </div>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
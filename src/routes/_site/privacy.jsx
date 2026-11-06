import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/_site/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — East Delhi Realty" },
      {
        name: "description",
        content:
          "How East Delhi Realty collects, uses and protects the personal information you share through this website.",
      },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

const SECTIONS = [
  {
    t: "Information we collect",
    b: "When you submit an enquiry, request a viewing, contact us or list a property, we collect the details you provide: your name, phone number, optional email address, property preferences, viewing preferences and any message you write. Property owners may also upload photographs of their property.",
  },
  {
    t: "How we use it",
    b: "Your details are used to respond to your enquiry, arrange property visits, share suitable property options and, for owners, to assess a property for listing. We do not sell your information, and we do not add you to unrelated marketing lists.",
  },
  {
    t: "Who can see it",
    b: "Enquiry and listing details are visible only to the consultancy. They are not published on the website. Property photographs uploaded through the owner form remain private until a listing is reviewed and published.",
  },
  {
    t: "Property listings",
    b: "Where a property owner asks us not to disclose an exact address, listings show only the locality and an approximate map location. Exact addresses are shared directly on request.",
  },
  {
    t: "Cookies and analytics",
    b: "This site does not set advertising or tracking cookies of its own. Standard technical logs may be kept by our hosting provider for security and performance.",
  },
  {
    t: "Data retention",
    b: "Enquiry records are retained for as long as needed to serve your property requirement and to keep a record of the conversation. You can ask us to delete your details at any time.",
  },
  {
    t: "Your choices",
    b: `You may request access to, correction of, or deletion of the information we hold about you by writing to ${SITE.email}. We will respond within a reasonable period.`,
  },
  {
    t: "Contact",
    b: `Questions about this policy can be sent to ${SITE.email} or raised by phone on ${SITE.phone}. The consultancy is based in ${SITE.address}.`,
  },
];

function PrivacyPage() {
  return (
    <div className="bg-cream pt-[104px] lg:pt-[132px]">
      <div className="mx-auto w-full max-w-[820px] px-5 pb-20 pt-10 sm:px-8 lg:pb-28 lg:pt-14">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-4 font-display text-[clamp(2.1rem,1.5rem+2.4vw,3.2rem)] font-light leading-[1.05] text-ink">
          Privacy policy
        </h1>
        <p className="mt-5 font-body text-[13px] text-stone">
          Last updated · {new Date().getFullYear()}
        </p>
        <div className="mt-10 space-y-9">
          {SECTIONS.map((s, i) => (
            <section key={s.t} className="border-t border-hairline pt-7">
              <div className="flex gap-4">
                <span className="font-body text-[10px] font-semibold tracking-[0.18em] text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="font-display text-[23px] font-normal text-ink">{s.t}</h2>
                  <p className="mt-3 font-body text-[14px] leading-[1.85] text-stone">{s.b}</p>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Loader2 } from "lucide-react";
import { createLead } from "@/lib/server-fns";
import { SITE } from "@/lib/site";

const inputClass = "field-line";

export function EnquiryForm({ property }) {
  const submitLead = useServerFn(createLead);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    viewing_date: "",
    viewing_time: "",
    guests: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [submitted, setSubmitted] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name";
    if (!/^[0-9+\-\s()]{7,18}$/.test(form.phone.trim()))
      next.phone = "Enter a valid phone number";
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim()))
      next.email = "Enter a valid email address";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "saving" || !validate()) return;
    setStatus("saving");
    try {
      await submitLead({
        data: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          enquiry_type: form.viewing_date ? "viewing_request" : "property_enquiry",
          source: "property_page",
          property_id: property?.id || "",
          property_title: property?.title || "",
          property_slug: property?.slug || "",
          viewing_date: form.viewing_date,
          viewing_time: form.viewing_time,
          guests: form.guests,
        },
      });
      setSubmitted(true);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (submitted) {
    return (
      <div className="border border-hairline bg-ivory p-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15">
          <Check className="h-5 w-5 text-gold" strokeWidth={2} />
        </div>
        <p className="mt-5 font-display text-2xl font-light text-ink">Thank you — enquiry received</p>
        <p className="mt-3 font-body text-[13.5px] leading-relaxed text-stone">
          {SITE.consultant} will get back to you on {form.phone} to arrange the viewing
          and answer any questions.
        </p>
        <p className="mt-4 font-body text-[13.5px] leading-relaxed text-stone">
          Prefer to speak now? Call{" "}
          <a href={`tel:${SITE.phoneRaw}`} className="text-ink underline decoration-gold/60 underline-offset-4">
            {SITE.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border border-hairline bg-ivory p-7">
      <p className="eyebrow">Private Viewing</p>
      <h2 className="mt-3 font-display text-[26px] font-light leading-tight text-ink">
        Interested in this property?
      </h2>
      <p className="mt-2 font-body text-[12.5px] leading-relaxed text-stone">
        Share your details and we'll arrange a visit at a time that suits you.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="lead-name" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">
            Full name
          </label>
          <input id="lead-name" className={inputClass} value={form.name} onChange={set("name")} placeholder="Your name" />
          {errors.name && <p className="mt-1 font-body text-[11px] text-destructive">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="lead-phone" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">
            Phone number
          </label>
          <input id="lead-phone" className={inputClass} value={form.phone} onChange={set("phone")} placeholder="+91" inputMode="tel" />
          {errors.phone && <p className="mt-1 font-body text-[11px] text-destructive">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="lead-email" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">
            Email <span className="normal-case tracking-normal text-stone/70">(optional)</span>
          </label>
          <input id="lead-email" className={inputClass} value={form.email} onChange={set("email")} placeholder="you@email.com" inputMode="email" />
          {errors.email && <p className="mt-1 font-body text-[11px] text-destructive">{errors.email}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="lead-date" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">
              Preferred date
            </label>
            <input id="lead-date" type="date" className={inputClass} value={form.viewing_date} onChange={set("viewing_date")} />
          </div>
          <div>
            <label htmlFor="lead-time" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">
              Preferred time
            </label>
            <input id="lead-time" type="time" className={inputClass} value={form.viewing_time} onChange={set("viewing_time")} />
          </div>
        </div>
        <div>
          <label htmlFor="lead-message" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">
            Message
          </label>
          <textarea
            id="lead-message"
            rows={3}
            className={`${inputClass} resize-none`}
            value={form.message}
            onChange={set("message")}
            placeholder="Anything we should know?"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "saving"}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 bg-ink font-body text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors duration-300 hover:bg-gold disabled:opacity-60"
      >
        {status === "saving" ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending…
          </>
        ) : (
          "Schedule a Property Visit"
        )}
      </button>
      {status === "error" && (
        <p className="mt-3 font-body text-[11.5px] text-destructive">
          We couldn't send that just now. Please try again, or call {SITE.phone}.
        </p>
      )}
      <p className="mt-3 font-body text-[10.5px] leading-relaxed text-stone">
        Your details are used only to respond to this enquiry.
      </p>
    </form>
  );
}
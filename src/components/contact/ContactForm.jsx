import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Loader2 } from "lucide-react";
import { createLead } from "@/lib/server-fns";
import { SITE } from "@/lib/site";

const field = "field-line";
const ENQUIRY_TYPES = ["Buying a property", "Renting a property", "Selling my property", "Renting out my property", "Commercial requirement", "Something else"];

export function ContactForm() {
  const submitLead = useServerFn(createLead);
  const [form, setForm] = useState({ name: "", phone: "", email: "", type: ENQUIRY_TYPES[0], message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [done, setDone] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "saving") return;
    const next = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name";
    if (!/^[0-9+\-\s()]{7,18}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number";
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) next.email = "Enter a valid email address";
    if (form.message.trim().length < 5) next.message = "Tell us briefly what you need";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("saving");
    try {
      await submitLead({
        data: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          message: `[${form.type}] ${form.message.trim()}`,
          enquiry_type: "contact",
          source: "contact_page",
        },
      });
      setDone(true);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (done) {
    return (
      <div className="border border-hairline bg-ivory p-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15">
          <Check className="h-5 w-5 text-gold" strokeWidth={2} />
        </div>
        <p className="mt-5 font-display text-2xl font-light text-ink">Message received</p>
        <p className="mt-3 font-body text-[13.5px] leading-relaxed text-stone">
          Thank you. {SITE.consultant} will get back to you on {form.phone}. For anything
          urgent, call {SITE.phone}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border border-hairline bg-ivory p-7 sm:p-9">
      <p className="eyebrow">Write to us</p>
      <h2 className="mt-3 font-display text-[28px] font-light leading-tight text-ink">
        Tell us what you're looking for
      </h2>

      <div className="mt-7 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="c-name" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Name</label>
            <input id="c-name" className={field} value={form.name} onChange={set("name")} placeholder="Your full name" />
            {errors.name && <p className="mt-1 font-body text-[11px] text-destructive">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="c-phone" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Phone</label>
            <input id="c-phone" className={field} value={form.phone} onChange={set("phone")} placeholder="+91" inputMode="tel" />
            {errors.phone && <p className="mt-1 font-body text-[11px] text-destructive">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="c-email" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Email (optional)</label>
          <input id="c-email" className={field} value={form.email} onChange={set("email")} placeholder="you@email.com" inputMode="email" />
          {errors.email && <p className="mt-1 font-body text-[11px] text-destructive">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="c-type" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Enquiry type</label>
          <select id="c-type" className={field} value={form.type} onChange={set("type")}>
            {ENQUIRY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="c-message" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Message</label>
          <textarea id="c-message" rows={4} className={`${field} resize-none`} value={form.message} onChange={set("message")} placeholder="Locality, budget, configuration — anything that helps." />
          {errors.message && <p className="mt-1 font-body text-[11px] text-destructive">{errors.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "saving"}
        className="mt-7 flex h-12 w-full items-center justify-center gap-2 bg-ink font-body text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors duration-300 hover:bg-gold disabled:opacity-60"
      >
        {status === "saving" ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending…</> : "Send Enquiry"}
      </button>
      {status === "error" && (
        <p className="mt-3 font-body text-[11.5px] text-destructive">
          We couldn't send that just now. Please try again, or call {SITE.phone}.
        </p>
      )}
    </form>
  );
}
const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, ImagePlus, Loader2, X } from "lucide-react";

import { createOwnerSubmission } from "@/lib/server-fns";
import { CATEGORIES, FURNISHING, LOCALITIES, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const field = "field-line";
const STEPS = ["Owner", "Property", "Photographs"];

export function OwnerForm({ defaultIntent = "sell" }) {
  const submit = useServerFn(createOwnerSubmission);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    owner_name: "",
    phone: "",
    email: "",
    address: "",
    locality: "",
    category: "Flat / Apartment",
    intent: defaultIntent,
    expected_price: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    furnishing: "Unfurnished",
    description: "",
    extra_info: "",
  });
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [done, setDone] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validateStep = (index) => {
    const next = {};
    if (index === 0) {
      if (form.owner_name.trim().length < 2) next.owner_name = "Please enter your name";
      if (!/^[0-9+\-\s()]{7,18}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number";
      if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) next.email = "Enter a valid email";
      if (form.address.trim().length < 3) next.address = "Please enter the property address or area";
      if (!form.locality) next.locality = "Select a locality";
    }
    if (index === 1) {
      if (form.description.trim().length < 10) next.description = "Add a short description (10+ characters)";
      if (!form.area) next.area = "Enter the area in sq.ft.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 2));
  };

  const onFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;
    setErrors((p) => ({ ...p, photos: undefined }));
    const accepted = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setErrors((p) => ({ ...p, photos: "Only image files can be uploaded" }));
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((p) => ({ ...p, photos: "Each photograph must be under 5 MB" }));
        continue;
      }
      accepted.push(file);
    }
    if (accepted.length === 0) return;
    if (photos.length + accepted.length > 8) {
      setErrors((p) => ({ ...p, photos: "You can upload up to 8 photographs" }));
      return;
    }
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of accepted) {
        const res = await db.integrations.Core.UploadPrivateFile({ file });
        uploaded.push({ uri: res.file_uri, name: file.name });
      }
      setPhotos((p) => [...p, ...uploaded]);
    } catch {
      setErrors((p) => ({ ...p, photos: "Upload failed. Please try again." }));
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "saving") return;
    if (!validateStep(0) || !validateStep(1)) {
      setStep(0);
      return;
    }
    setStatus("saving");
    try {
      await submit({
        data: {
          ...form,
          photos: photos.map((p) => p.uri),
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
      <div className="border border-hairline bg-ivory p-9">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15">
          <Check className="h-5 w-5 text-gold" strokeWidth={2} />
        </div>
        <p className="mt-6 font-display text-[28px] font-light text-ink">Submission received</p>
        <p className="mt-3 max-w-md font-body text-[13.5px] leading-relaxed text-stone">
          Thank you. Your property details have been sent privately to {SITE.consultant} for
          review. Submissions are not published automatically — you will be contacted on{" "}
          {form.phone} once the listing has been assessed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border border-hairline bg-ivory">
      <div className="border-b border-hairline px-6 pt-6 sm:px-8">
        <div className="flex items-center justify-between">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center border font-body text-[10px]",
                  i <= step ? "border-gold bg-gold text-ivory" : "border-hairline text-stone",
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  "font-body text-[9.5px] font-semibold uppercase tracking-[0.16em]",
                  i <= step ? "text-ink" : "text-stone",
                )}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-5 h-px w-full bg-hairline">
          <div
            className="h-px bg-gold transition-all duration-500"
            style={{ width: `${((step + 1) / 3) * 100}%` }}
          />
        </div>
        <div className="h-5" />
      </div>

      <div className="px-6 py-7 sm:px-8">
        {step === 0 && (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="o-name" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Owner name</label>
                <input id="o-name" className={field} value={form.owner_name} onChange={set("owner_name")} placeholder="Your name" />
                {errors.owner_name && <p className="mt-1 font-body text-[11px] text-destructive">{errors.owner_name}</p>}
              </div>
              <div>
                <label htmlFor="o-phone" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Phone</label>
                <input id="o-phone" className={field} value={form.phone} onChange={set("phone")} placeholder="+91" inputMode="tel" />
                {errors.phone && <p className="mt-1 font-body text-[11px] text-destructive">{errors.phone}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="o-email" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Email (optional)</label>
              <input id="o-email" className={field} value={form.email} onChange={set("email")} placeholder="you@email.com" inputMode="email" />
              {errors.email && <p className="mt-1 font-body text-[11px] text-destructive">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="o-address" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Property address / area</label>
              <input id="o-address" className={field} value={form.address} onChange={set("address")} placeholder="Street, block or landmark" />
              {errors.address && <p className="mt-1 font-body text-[11px] text-destructive">{errors.address}</p>}
            </div>
            <div>
              <label htmlFor="o-locality" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Locality</label>
              <select id="o-locality" className={field} value={form.locality} onChange={set("locality")}>
                <option value="">Select locality</option>
                {LOCALITIES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              {errors.locality && <p className="mt-1 font-body text-[11px] text-destructive">{errors.locality}</p>}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="o-category" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Property type</label>
                <select id="o-category" className={field} value={form.category} onChange={set("category")}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="o-intent" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">I want to</label>
                <select id="o-intent" className={field} value={form.intent} onChange={set("intent")}>
                  <option value="sell">Sell</option>
                  <option value="rent">Rent out</option>
                </select>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="o-price" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Expected price / rent</label>
                <input id="o-price" className={field} value={form.expected_price} onChange={set("expected_price")} placeholder="e.g. 85,00,000 or 25,000/month" />
              </div>
              <div>
                <label htmlFor="o-area" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Area (sq.ft.)</label>
                <input id="o-area" className={field} value={form.area} onChange={set("area")} inputMode="numeric" placeholder="1200" />
                {errors.area && <p className="mt-1 font-body text-[11px] text-destructive">{errors.area}</p>}
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label htmlFor="o-beds" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Bedrooms</label>
                <input id="o-beds" className={field} value={form.bedrooms} onChange={set("bedrooms")} inputMode="numeric" placeholder="3" />
              </div>
              <div>
                <label htmlFor="o-baths" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Bathrooms</label>
                <input id="o-baths" className={field} value={form.bathrooms} onChange={set("bathrooms")} inputMode="numeric" placeholder="2" />
              </div>
              <div>
                <label htmlFor="o-furn" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Furnishing</label>
                <select id="o-furn" className={field} value={form.furnishing} onChange={set("furnishing")}>
                  {FURNISHING.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="o-desc" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Description</label>
              <textarea id="o-desc" rows={4} className={`${field} resize-none`} value={form.description} onChange={set("description")} placeholder="Condition, floor, parking, facing, amenities — what should a buyer know?" />
              {errors.description && <p className="mt-1 font-body text-[11px] text-destructive">{errors.description}</p>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">
                Photographs (up to 8, images only, max 5 MB each)
              </p>
              <label className="mt-3 flex cursor-pointer flex-col items-center justify-center border border-dashed border-hairline bg-cream/60 px-6 py-10 text-center transition-colors hover:border-gold">
                <input type="file" accept="image/*" multiple onChange={onFiles} className="hidden" disabled={uploading} />
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gold" />
                ) : (
                  <ImagePlus className="h-5 w-5 text-gold" strokeWidth={1.5} />
                )}
                <span className="mt-3 font-body text-[12px] text-stone">
                  {uploading ? "Uploading…" : "Choose photographs"}
                </span>
                <span className="mt-1 font-body text-[10px] text-stone/70">
                  Uploaded securely — visible only to the agency until published
                </span>
              </label>
              {errors.photos && <p className="mt-2 font-body text-[11px] text-destructive">{errors.photos}</p>}
              {photos.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {photos.map((p) => (
                    <li key={p.uri} className="flex items-center justify-between border border-hairline bg-cream px-3 py-2">
                      <span className="truncate font-body text-[11.5px] text-ink">{p.name}</span>
                      <button
                        type="button"
                        onClick={() => setPhotos((prev) => prev.filter((x) => x.uri !== p.uri))}
                        aria-label={`Remove ${p.name}`}
                        className="ml-3 text-stone transition-colors hover:text-destructive"
                      >
                        <X className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label htmlFor="o-extra" className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone">Anything else</label>
              <textarea id="o-extra" rows={3} className={`${field} resize-none`} value={form.extra_info} onChange={set("extra_info")} placeholder="Documents, tenancy status, preferred timeline…" />
            </div>
            <p className="font-body text-[11px] leading-relaxed text-stone">
              Submissions go to the agency for review and are never published automatically.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-hairline px-6 py-5 sm:px-8">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-stone transition-colors hover:text-ink disabled:opacity-30"
        >
          Back
        </button>
        {step < 2 ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex h-11 items-center bg-ink px-7 font-body text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-gold"
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === "saving"}
            className="inline-flex h-11 items-center gap-2 bg-ink px-7 font-body text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-gold disabled:opacity-60"
          >
            {status === "saving" ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending…</> : "Submit Property"}
          </button>
        )}
      </div>
      {status === "error" && (
        <p className="px-6 pb-5 font-body text-[11.5px] text-destructive sm:px-8">
          We couldn't send that just now. Please try again, or call {SITE.phone}.
        </p>
      )}
    </form>
  );
}
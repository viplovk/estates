const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, X } from "lucide-react";

import { adminGetProperty, adminSaveProperty } from "@/lib/server-fns";
import {
  AVAILABILITY,
  CATEGORIES,
  FLOORS,
  FURNISHING,
  LOCALITIES,
  PARKING,
  slugify,
  SITE,
} from "@/lib/site";

const input = "field-line";
const label = "font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-stone";

const EMPTY = {
  title: "",
  slug: "",
  description: "",
  locality: "",
  address: "",
  show_exact_address: false,
  category: "Flat / Apartment",
  transaction: "buy",
  price: "",
  bedrooms: "",
  bathrooms: "",
  area: "",
  furnishing: "Unfurnished",
  floor: "Ground",
  facing: "",
  parking: "None",
  availability: "Available Now",
  features: [],
  images: [],
  cover_image: "",
  map_lat: "",
  map_lng: "",
  featured: false,
  published: false,
};

export function PropertyEditor({ propertyId }) {
  const navigate = useNavigate();
  const getOne = useServerFn(adminGetProperty);
  const save = useServerFn(adminSaveProperty);
  const isNew = propertyId === "new";

  const [form, setForm] = useState(EMPTY);
  const [featuresText, setFeaturesText] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;
    let alive = true;
    getOne({ data: { id: propertyId } })
      .then((p) => {
        if (!alive) return;
        if (!p) {
          setError("That property could not be found.");
          return;
        }
        setForm({
          ...EMPTY,
          ...p,
          price: p.price ?? "",
          bedrooms: p.bedrooms ?? "",
          bathrooms: p.bathrooms ?? "",
          area: p.area ?? "",
          features: p.features || [],
          images: p.images || [],
          cover_image: p.cover_image || (p.images || [])[0] || "",
          map_lat: p.map_lat ?? "",
          map_lng: p.map_lng ?? "",
        });
        setFeaturesText((p.features || []).join("\n"));
      })
      .catch(() => setError("That property could not be loaded."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [propertyId, isNew, getOne]);

  const set = (key) => (e) => {
    const value = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const onFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;
    setUploading(true);
    try {
      const urls = [];
      for (const file of files) {
        if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) continue;
        const res = await db.integrations.Core.UploadPublicFile({ file });
        urls.push(res.file_url);
      }
      setForm((f) => {
        const images = [...f.images, ...urls];
        return { ...f, images, cover_image: f.cover_image || images[0] || "" };
      });
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const moveImage = (index, dir) => {
    setForm((f) => {
      const images = [...f.images];
      const target = index + dir;
      if (target < 0 || target >= images.length) return f;
      [images[index], images[target]] = [images[target], images[index]];
      return { ...f, images };
    });
  };

  const removeImage = (url) => {
    setForm((f) => {
      const images = f.images.filter((i) => i !== url);
      return { ...f, images, cover_image: f.cover_image === url ? images[0] || "" : f.cover_image };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.title.trim().length < 3) return setError("Add a title for the listing.");
    if (!form.locality) return setError("Select the locality.");
    if (!form.price) return setError("Add a price.");

    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug?.trim() || slugify(`${form.title}-${form.locality}`),
        price: Number(form.price) || 0,
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        area: Number(form.area) || 0,
        map_lat: form.map_lat === "" ? null : Number(form.map_lat),
        map_lng: form.map_lng === "" ? null : Number(form.map_lng),
        features: featuresText
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean),
        cover_image: form.cover_image || form.images[0] || "",
      };
      await save({ data: { id: isNew ? undefined : propertyId, data: payload } });
      navigate({ to: "/admin/properties" });
    } catch {
      setError("Could not save this property. Check the fields and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="font-body text-[12px] text-stone">Loading property…</p>;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-6">
        <div>
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/properties" })}
            className="font-body text-[9.5px] font-semibold uppercase tracking-[0.16em] text-stone transition-colors hover:text-ink"
          >
            ← All properties
          </button>
          <h1 className="mt-2 font-display text-3xl font-light text-ink">
            {isNew ? "Add a property" : "Edit property"}
          </h1>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 items-center gap-2 bg-ink px-6 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-gold disabled:opacity-60"
        >
          {saving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</> : "Save property"}
        </button>
      </div>

      {error && <p className="mt-4 font-body text-[12px] text-destructive">{error}</p>}

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-8">
          <section className="border border-hairline bg-ivory px-5 py-6">
            <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-gold">Basics</p>
            <div className="mt-4 space-y-5">
              <div>
                <label className={label} htmlFor="p-title">Title</label>
                <input id="p-title" className={input} value={form.title} onChange={set("title")} placeholder="3 BHK Builder Floor with Balcony" />
              </div>
              <div>
                <label className={label} htmlFor="p-slug">URL slug</label>
                <input id="p-slug" className={input} value={form.slug} onChange={set("slug")} placeholder="auto-generated from the title" />
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label className={label} htmlFor="p-locality">Locality</label>
                  <select id="p-locality" className={input} value={form.locality} onChange={set("locality")}>
                    <option value="">Select</option>
                    {LOCALITIES.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="p-category">Type</label>
                  <select id="p-category" className={input} value={form.category} onChange={set("category")}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="p-transaction">Transaction</label>
                  <select id="p-transaction" className={input} value={form.transaction} onChange={set("transaction")}>
                    <option value="buy">For sale</option>
                    <option value="rent">For rent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={label} htmlFor="p-address">Address</label>
                <input id="p-address" className={input} value={form.address} onChange={set("address")} placeholder="Street, block, landmark" />
                <label className="mt-3 flex items-center gap-2 font-body text-[11.5px] text-stone">
                  <input type="checkbox" checked={!!form.show_exact_address} onChange={set("show_exact_address")} />
                  Show the exact address publicly
                </label>
              </div>
              <div>
                <label className={label} htmlFor="p-desc">Description</label>
                <textarea id="p-desc" rows={6} className={`${input} resize-none`} value={form.description} onChange={set("description")} placeholder="What should a buyer or tenant know?" />
              </div>
            </div>
          </section>

          <section className="border border-hairline bg-ivory px-5 py-6">
            <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-gold">Specification</p>
            <div className="mt-4 grid gap-5 sm:grid-cols-3">
              <div>
                <label className={label} htmlFor="p-price">Price / rent (₹)</label>
                <input id="p-price" className={input} value={form.price} onChange={set("price")} inputMode="numeric" placeholder="12500000" />
              </div>
              <div>
                <label className={label} htmlFor="p-area">Area (sq.ft.)</label>
                <input id="p-area" className={input} value={form.area} onChange={set("area")} inputMode="numeric" placeholder="1600" />
              </div>
              <div>
                <label className={label} htmlFor="p-beds">Bedrooms</label>
                <input id="p-beds" className={input} value={form.bedrooms} onChange={set("bedrooms")} inputMode="numeric" placeholder="3" />
              </div>
              <div>
                <label className={label} htmlFor="p-baths">Bathrooms</label>
                <input id="p-baths" className={input} value={form.bathrooms} onChange={set("bathrooms")} inputMode="numeric" placeholder="2" />
              </div>
              <div>
                <label className={label} htmlFor="p-furnishing">Furnishing</label>
                <select id="p-furnishing" className={input} value={form.furnishing} onChange={set("furnishing")}>
                  {FURNISHING.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="p-floor">Floor</label>
                <select id="p-floor" className={input} value={form.floor} onChange={set("floor")}>
                  {FLOORS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="p-facing">Facing</label>
                <input id="p-facing" className={input} value={form.facing} onChange={set("facing")} placeholder="East" />
              </div>
              <div>
                <label className={label} htmlFor="p-parking">Parking</label>
                <select id="p-parking" className={input} value={form.parking} onChange={set("parking")}>
                  {PARKING.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="p-availability">Availability</label>
                <select id="p-availability" className={input} value={form.availability} onChange={set("availability")}>
                  {AVAILABILITY.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-5">
              <label className={label} htmlFor="p-features">Highlights (one per line)</label>
              <textarea id="p-features" rows={4} className={`${input} resize-none`} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder={"Modular kitchen\nCovered parking\nPark facing"} />
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="p-lat">Map latitude</label>
                <input id="p-lat" className={input} value={form.map_lat} onChange={set("map_lat")} placeholder="28.6315" />
              </div>
              <div>
                <label className={label} htmlFor="p-lng">Map longitude</label>
                <input id="p-lng" className={input} value={form.map_lng} onChange={set("map_lng")} placeholder="77.2774" />
              </div>
            </div>
          </section>

          <section className="border border-hairline bg-ivory px-5 py-6">
            <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-gold">Photographs</p>
            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center border border-dashed border-hairline bg-cream/60 px-6 py-8 text-center transition-colors hover:border-gold">
              <input type="file" accept="image/*" multiple onChange={onFiles} className="hidden" disabled={uploading} />
              {uploading ? <Loader2 className="h-5 w-5 animate-spin text-gold" /> : <ImagePlus className="h-5 w-5 text-gold" strokeWidth={1.5} />}
              <span className="mt-2 font-body text-[11.5px] text-stone">
                {uploading ? "Uploading…" : "Upload photographs (stored publicly — anyone with the link can open them)"}
              </span>
            </label>

            {form.images.length > 0 && (
              <ul className="mt-4 space-y-2">
                {form.images.map((url, i) => (
                  <li key={url} className="flex items-center gap-3 border border-hairline bg-cream px-3 py-2">
                    <img src={url} alt="" className="h-10 w-14 object-cover" />
                    <span className="flex-1 truncate font-body text-[11px] text-stone">
                      {form.cover_image === url ? "Cover photograph" : `Photograph ${i + 1}`}
                    </span>
                    <button type="button" onClick={() => moveImage(i, -1)} aria-label="Move earlier" className="p-1 text-stone hover:text-ink">
                      <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </button>
                    <button type="button" onClick={() => moveImage(i, 1)} aria-label="Move later" className="p-1 text-stone hover:text-ink">
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, cover_image: url }))}
                      className="font-body text-[9px] font-semibold uppercase tracking-[0.12em] text-gold"
                    >
                      Cover
                    </button>
                    <button type="button" onClick={() => removeImage(url)} aria-label="Remove photograph" className="p-1 text-stone hover:text-destructive">
                      <X className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-5">
          <div className="border border-hairline bg-ivory px-5 py-6">
            <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-gold">Visibility</p>
            <label className="mt-4 flex items-center justify-between gap-3 font-body text-[12px] text-ink">
              Published
              <input type="checkbox" checked={!!form.published} onChange={set("published")} />
            </label>
            <label className="mt-3 flex items-center justify-between gap-3 font-body text-[12px] text-ink">
              Featured on homepage
              <input type="checkbox" checked={!!form.featured} onChange={set("featured")} />
            </label>
            <p className="mt-4 font-body text-[10.5px] leading-relaxed text-stone">
              Drafts stay invisible on the public site. Featured properties appear in the
              homepage selection.
            </p>
          </div>
          <div className="border border-hairline bg-ivory px-5 py-6">
            <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.18em] text-gold">Support</p>
            <p className="mt-3 font-body text-[11px] leading-relaxed text-stone">
              Need a hand? Reach the consultancy at {SITE.phone}.
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}
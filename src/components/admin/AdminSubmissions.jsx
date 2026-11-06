const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Eye, Loader2, X } from "lucide-react";

import {
  adminConvertSubmission,
  adminListSubmissions,
  adminUpdateSubmission,
} from "@/lib/server-fns";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  pending: "bg-[#F5F0E2] text-[#7A6524]",
  approved: "bg-[#E8F0E4] text-[#3F6B3A]",
  rejected: "bg-[#F6E6E3] text-[#8C3B2C]",
};

export function AdminSubmissions() {
  const list = useServerFn(adminListSubmissions);
  const update = useServerFn(adminUpdateSubmission);
  const convert = useServerFn(adminConvertSubmission);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [signed, setSigned] = useState({});
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await list();
      setItems(res || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [list]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (submission, status) => {
    setBusy(submission.id);
    try {
      await update({ data: { id: submission.id, status } });
      setItems((prev) => prev.map((s) => (s.id === submission.id ? { ...s, status } : s)));
    } finally {
      setBusy(null);
    }
  };

  const onConvert = async (submission) => {
    setBusy(submission.id);
    setMessage("");
    try {
      await convert({ data: { id: submission.id } });
      await load();
      setMessage(
        `Draft listing created for ${submission.owner_name}. Add photographs and publish it from Properties.`,
      );
    } catch {
      setMessage("Could not create the draft listing. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const revealPhoto = async (uri) => {
    try {
      const res = await db.integrations.Core.CreateFileSignedUrl({ file_uri: uri, expires_in: 600 });
      setSigned((prev) => ({ ...prev, [uri]: res.signed_url }));
      window.open(res.signed_url, "_blank", "noopener");
    } catch {
      setMessage("Could not open that photograph.");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-6">
        <div>
          <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.2em] text-gold">
            Owner Portal
          </p>
          <h1 className="mt-2 font-display text-3xl font-light text-ink">Owner submissions</h1>
        </div>
        <p className="font-body text-[10.5px] uppercase tracking-[0.14em] text-stone">
          {items.filter((s) => s.status === "pending").length} awaiting review
        </p>
      </div>

      {message && (
        <p className="mt-4 border-l border-gold bg-ivory px-4 py-3 font-body text-[12px] text-ink">
          {message}
        </p>
      )}

      {loading ? (
        <p className="mt-8 font-body text-[12px] text-stone">Loading submissions…</p>
      ) : items.length === 0 ? (
        <div className="mt-8 border border-dashed border-hairline bg-ivory px-6 py-14 text-center">
          <p className="font-display text-xl text-ink">No submissions yet</p>
          <p className="mt-2 font-body text-[12.5px] text-stone">
            Owner listings submitted through the website appear here for review.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-px border border-hairline bg-hairline">
          {items.map((s) => (
            <div key={s.id} className="bg-ivory px-4 py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-[18px] text-ink">{s.owner_name}</p>
                    <span className={cn("px-1.5 py-0.5 font-body text-[8.5px] font-semibold uppercase tracking-[0.12em]", STATUS_STYLES[s.status] || STATUS_STYLES.pending)}>
                      {s.status || "pending"}
                    </span>
                    <span className="font-body text-[9px] uppercase tracking-[0.12em] text-stone">
                      {s.intent === "rent" ? "For rent" : "For sale"}
                    </span>
                  </div>
                  <p className="mt-1 font-body text-[11.5px] text-stone">
                    {s.phone}
                    {s.email ? ` · ${s.email}` : ""}
                  </p>
                  <p className="mt-2 font-body text-[12px] text-ink">
                    {s.category} · {s.locality}
                    {s.bedrooms ? ` · ${s.bedrooms} BHK` : ""}
                    {s.area ? ` · ${s.area} sq.ft.` : ""}
                    {s.expected_price ? ` · ${s.expected_price}` : ""}
                  </p>
                  <p className="mt-1 font-body text-[11.5px] text-stone">{s.address}</p>
                  <p className="mt-2 max-w-2xl whitespace-pre-line font-body text-[12px] leading-relaxed text-stone">
                    {s.description}
                  </p>
                  {Array.isArray(s.photos) && s.photos.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {s.photos.map((uri, i) => (
                        <button
                          key={uri}
                          type="button"
                          onClick={() => revealPhoto(uri)}
                          className="inline-flex items-center gap-1.5 border border-hairline px-2.5 py-1.5 font-body text-[9.5px] uppercase tracking-[0.1em] text-stone transition-colors hover:border-ink hover:text-ink"
                        >
                          <Eye className="h-3 w-3" strokeWidth={1.7} />
                          Photo {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus(s, "approved")}
                    disabled={busy === s.id || s.status === "approved"}
                    className="inline-flex h-8 items-center gap-1.5 border border-hairline px-3 font-body text-[9.5px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink disabled:opacity-40"
                  >
                    <Check className="h-3 w-3" strokeWidth={2} />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus(s, "rejected")}
                    disabled={busy === s.id || s.status === "rejected"}
                    className="inline-flex h-8 items-center gap-1.5 border border-hairline px-3 font-body text-[9.5px] font-semibold uppercase tracking-[0.12em] text-stone transition-colors hover:border-destructive hover:text-destructive disabled:opacity-40"
                  >
                    <X className="h-3 w-3" strokeWidth={2} />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => onConvert(s)}
                    disabled={busy === s.id}
                    className="inline-flex h-8 items-center gap-2 bg-ink px-3 font-body text-[9.5px] font-semibold uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-gold disabled:opacity-40"
                  >
                    {busy === s.id ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                    {s.converted_property_id ? "Create another draft" : "Create draft listing"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="mt-6 max-w-2xl font-body text-[10.5px] leading-relaxed text-stone">
        Submissions are never published automatically. Creating a draft copies the owner's
        details into a private listing — add photographs in the property editor before
        publishing.
      </p>
    </div>
  );
}
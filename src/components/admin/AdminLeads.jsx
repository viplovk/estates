import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Download, MessageCircle, Phone, Search } from "lucide-react";
import { adminListLeads, adminUpdateLead } from "@/lib/server-fns";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const STATUSES = ["New", "Contacted", "Visit Scheduled", "Visit Completed", "Converted", "Closed"];

function formatTimestamp(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

const STATUS_STYLES = {
  New: "bg-[#E9EFF5] text-[#365A78]",
  Contacted: "bg-[#F5F0E2] text-[#7A6524]",
  "Visit Scheduled": "bg-[#EFE9F5] text-[#5B4378]",
  "Visit Completed": "bg-[#E8F0E4] text-[#3F6B3A]",
  Converted: "bg-[#E4EFE6] text-[#2F6B44]",
  Closed: "bg-[#F0EDE4] text-stone",
};

export function AdminLeads() {
  const list = useServerFn(adminListLeads);
  const update = useServerFn(adminUpdateLead);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [openNote, setOpenNote] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await list({ data: { status, search: query } });
      setLeads(res || []);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [list, status, query]);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (lead, nextStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: nextStatus } : l)));
    try {
      await update({ data: { id: lead.id, patch: { status: nextStatus } } });
    } catch {
      load();
    }
  };

  const saveNote = async (lead) => {
    try {
      await update({ data: { id: lead.id, patch: { notes: noteDraft } } });
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, notes: noteDraft } : l)));
      setOpenNote(null);
      setNoteDraft("");
    } catch {
      /* keep the draft open so nothing is lost */
    }
  };

  const exportCsv = () => {
    const header = ["Name", "Phone", "Email", "Type", "Property", "Viewing", "Source", "Status", "Submitted", "Message"];
    const rows = leads.map((l) => [
      l.name,
      l.phone,
      l.email,
      l.enquiry_type,
      l.property_title,
      [l.viewing_date, l.viewing_time].filter(Boolean).join(" "),
      l.source,
      l.status,
      formatTimestamp(l.created_date),
      (l.message || "").replace(/\s+/g, " "),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `east-delhi-realty-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-6">
        <div>
          <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.2em] text-gold">
            Enquiries
          </p>
          <h1 className="mt-2 font-display text-3xl font-light text-ink">Leads</h1>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={leads.length === 0}
          className="inline-flex h-10 items-center gap-2 border border-hairline px-4 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink disabled:opacity-40"
        >
          <Download className="h-3.5 w-3.5" strokeWidth={1.7} />
          Export CSV
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(search.trim());
          }}
          className="flex items-center gap-2 border border-hairline px-3"
        >
          <Search className="h-3.5 w-3.5 text-stone" strokeWidth={1.6} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name or phone"
            className="h-9 w-44 border-0 bg-transparent font-body text-[12px] outline-none"
          />
        </form>
        <div className="flex flex-wrap gap-1.5">
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={cn(
                "border px-2.5 py-1.5 font-body text-[9.5px] font-semibold uppercase tracking-[0.1em] transition-colors",
                status === s ? "border-ink bg-ink text-ivory" : "border-hairline text-stone hover:border-ink",
              )}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="mt-8 font-body text-[12px] text-stone">Loading enquiries…</p>
      ) : leads.length === 0 ? (
        <div className="mt-8 border border-dashed border-hairline bg-ivory px-6 py-14 text-center">
          <p className="font-display text-xl text-ink">No enquiries yet</p>
          <p className="mt-2 font-body text-[12.5px] text-stone">
            Enquiries from the website, property pages and the contact form all land here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-px border border-hairline bg-hairline">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-ivory px-4 py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-[18px] text-ink">{lead.name}</p>
                    <span className={cn("px-1.5 py-0.5 font-body text-[8.5px] font-semibold uppercase tracking-[0.12em]", STATUS_STYLES[lead.status] || STATUS_STYLES.Closed)}>
                      {lead.status || "New"}
                    </span>
                    <span className="font-body text-[9px] uppercase tracking-[0.12em] text-stone">
                      {String(lead.enquiry_type || "").replace("_", " ")}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 font-body text-[11.5px] text-stone">
                    <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1.5 text-ink hover:text-gold">
                      <Phone className="h-3 w-3" strokeWidth={1.7} />
                      {lead.phone}
                    </a>
                    {lead.email && <a href={`mailto:${lead.email}`} className="hover:text-ink">{lead.email}</a>}
                    <a
                      href={`https://wa.me/${String(lead.phone).replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-ink"
                    >
                      <MessageCircle className="h-3 w-3" strokeWidth={1.7} />
                      WhatsApp
                    </a>
                    <span>{formatTimestamp(lead.created_date)}</span>
                  </div>
                  {lead.property_title && (
                    <p className="mt-2 font-body text-[11.5px] text-stone">
                      Property:{" "}
                      {lead.property_slug ? (
                        <Link
                          to="/property/$slug"
                          params={{ slug: lead.property_slug }}
                          className="text-ink underline decoration-gold/50 underline-offset-2"
                        >
                          {lead.property_title}
                        </Link>
                      ) : (
                        <span className="text-ink">{lead.property_title}</span>
                      )}
                    </p>
                  )}
                  {(lead.viewing_date || lead.viewing_time) && (
                    <p className="mt-1 font-body text-[11.5px] text-stone">
                      Preferred viewing: <span className="text-ink">{[lead.viewing_date, lead.viewing_time].filter(Boolean).join(" · ")}</span>
                    </p>
                  )}
                  {lead.message && (
                    <p className="mt-2 max-w-2xl whitespace-pre-line font-body text-[12px] leading-relaxed text-stone">
                      {lead.message}
                    </p>
                  )}
                  {lead.notes && (
                    <p className="mt-2 border-l border-gold/50 pl-3 font-body text-[11.5px] italic text-stone">
                      {lead.notes}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={lead.status || "New"}
                    onChange={(e) => changeStatus(lead, e.target.value)}
                    className="h-8 cursor-pointer border border-hairline bg-transparent px-2 font-body text-[10px] text-ink outline-none focus:border-gold"
                    aria-label={`Status for ${lead.name}`}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenNote(openNote === lead.id ? null : lead.id);
                      setNoteDraft(lead.notes || "");
                    }}
                    className="h-8 border border-hairline px-3 font-body text-[9.5px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink"
                  >
                    Notes
                  </button>
                </div>
              </div>

              {openNote === lead.id && (
                <div className="mt-3 border-t border-hairline pt-3">
                  <textarea
                    rows={3}
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    placeholder="Internal notes — call summary, follow-up, viewing outcome"
                    className="w-full border border-hairline bg-cream px-3 py-2 font-body text-[12px] outline-none focus:border-gold"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveNote(lead)}
                      className="h-8 bg-ink px-4 font-body text-[9.5px] font-semibold uppercase tracking-[0.14em] text-ivory"
                    >
                      Save note
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenNote(null)}
                      className="h-8 border border-hairline px-4 font-body text-[9.5px] font-semibold uppercase tracking-[0.14em] text-stone"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="mt-6 font-body text-[10.5px] text-stone">
        Enquiries are private. Notifications are emailed to {SITE.email} when the mail
        integration is configured.
      </p>
    </div>
  );
}
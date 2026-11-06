import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  adminDeleteProperty,
  adminListProperties,
  adminSaveProperty,
} from "@/lib/server-fns";
import { formatPrice } from "@/lib/site";
import { cn } from "@/lib/utils";

export function AdminProperties() {
  const list = useServerFn(adminListProperties);
  const save = useServerFn(adminSaveProperty);
  const remove = useServerFn(adminDeleteProperty);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await list({ data: {} });
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

  const toggle = async (property, field) => {
    setBusyId(property.id);
    try {
      await save({ data: { id: property.id, data: { [field]: !property[field] } } });
      setItems((prev) =>
        prev.map((p) => (p.id === property.id ? { ...p, [field]: !property[field] } : p)),
      );
    } finally {
      setBusyId(null);
    }
  };

  const onDelete = async (property) => {
    if (!window.confirm(`Delete "${property.title}"? This cannot be undone.`)) return;
    setBusyId(property.id);
    try {
      await remove({ data: { id: property.id } });
      setItems((prev) => prev.filter((p) => p.id !== property.id));
    } finally {
      setBusyId(null);
    }
  };

  const visible = items.filter((p) => {
    if (filter === "published") return p.published;
    if (filter === "drafts") return !p.published;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-6">
        <div>
          <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.2em] text-gold">
            Inventory
          </p>
          <h1 className="mt-2 font-display text-3xl font-light text-ink">Properties</h1>
        </div>
        <Link
          to="/admin/properties/$propertyId"
          params={{ propertyId: "new" }}
          className="inline-flex h-10 items-center gap-2 bg-ink px-5 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-gold"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
          Add property
        </Link>
      </div>

      <div className="mt-5 flex gap-2">
        {[
          { v: "all", l: `All (${items.length})` },
          { v: "published", l: `Published (${items.filter((p) => p.published).length})` },
          { v: "drafts", l: `Drafts (${items.filter((p) => !p.published).length})` },
        ].map((t) => (
          <button
            key={t.v}
            type="button"
            onClick={() => setFilter(t.v)}
            className={cn(
              "border px-3 py-2 font-body text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors",
              filter === t.v ? "border-ink bg-ink text-ivory" : "border-hairline text-stone hover:border-ink",
            )}
          >
            {t.l}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-8 font-body text-[12px] text-stone">Loading properties…</p>
      ) : visible.length === 0 ? (
        <div className="mt-8 border border-dashed border-hairline bg-ivory px-6 py-14 text-center">
          <p className="font-display text-xl text-ink">No properties here yet</p>
          <p className="mt-2 font-body text-[12.5px] text-stone">
            Add your first listing to start building the portfolio.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-px border border-hairline bg-hairline">
          {visible.map((p) => (
            <div key={p.id} className="flex flex-col gap-3 bg-ivory px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-body text-[9px] font-semibold uppercase tracking-[0.14em] text-gold">
                    {p.transaction === "rent" ? "Rent" : "Sale"}
                  </span>
                  <span className="h-2.5 w-px bg-hairline" aria-hidden="true" />
                  <span className="font-body text-[10px] uppercase tracking-[0.12em] text-stone">
                    {p.locality}
                  </span>
                  {p.featured && (
                    <span className="bg-gold/15 px-1.5 py-0.5 font-body text-[8.5px] font-semibold uppercase tracking-[0.12em] text-gold">
                      Featured
                    </span>
                  )}
                  <span
                    className={cn(
                      "px-1.5 py-0.5 font-body text-[8.5px] font-semibold uppercase tracking-[0.12em]",
                      p.published ? "bg-[#E8F0E4] text-[#3F6B3A]" : "bg-[#F0EDE4] text-stone",
                    )}
                  >
                    {p.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-1 truncate font-display text-[17px] text-ink">{p.title}</p>
                <p className="mt-1 font-body text-[11px] text-stone">
                  {formatPrice(p.price, p.transaction)}
                  {p.area ? ` · ${Number(p.area).toLocaleString("en-IN")} sq.ft.` : ""}
                  {p.bedrooms ? ` · ${p.bedrooms} BHK` : ""}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggle(p, "published")}
                  disabled={busyId === p.id}
                  className="h-8 border border-hairline px-3 font-body text-[9.5px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink disabled:opacity-40"
                >
                  {p.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => toggle(p, "featured")}
                  disabled={busyId === p.id}
                  className="h-8 border border-hairline px-3 font-body text-[9.5px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink disabled:opacity-40"
                >
                  {p.featured ? "Unfeature" : "Feature"}
                </button>
                <Link
                  to="/admin/properties/$propertyId"
                  params={{ propertyId: p.id }}
                  className="inline-flex h-8 items-center gap-1.5 border border-hairline px-3 font-body text-[9.5px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink"
                >
                  <Pencil className="h-3 w-3" strokeWidth={1.8} />
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(p)}
                  disabled={busyId === p.id}
                  aria-label={`Delete ${p.title}`}
                  className="inline-flex h-8 w-8 items-center justify-center border border-hairline text-stone transition-colors hover:border-destructive hover:text-destructive disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.6} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
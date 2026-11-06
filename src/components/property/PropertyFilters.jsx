import { SlidersHorizontal, X } from "lucide-react";
import {
  AVAILABILITY,
  BATHROOM_OPTIONS,
  BEDROOM_OPTIONS,
  BUDGETS,
  CATEGORIES,
  FLOORS,
  FURNISHING,
  LOCALITIES,
  PARKING,
} from "@/lib/site";
import { countActiveFilters } from "@/lib/property-search";
import { cn } from "@/lib/utils";

const selectClass =
  "h-9 w-full cursor-pointer appearance-none border-0 border-b border-hairline bg-transparent pb-1 font-body text-[13.5px] text-ink outline-none transition-colors focus:border-gold";

function Group({ label, children }) {
  return (
    <div className="border-t border-hairline py-5 first:border-t-0 first:pt-0">
      <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.2em] text-stone">
        {label}
      </p>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

export function PropertyFilters({ search, setFilter, clearAll, lockedTransaction, showBucket = true, className }) {
  const transaction = lockedTransaction || search.transaction || "buy";
  const budgets = BUDGETS[transaction] || BUDGETS.buy;

  return (
    <div className={cn("bg-ivory px-6 py-7", className)}>
      <div className="flex items-center justify-between">
        <p className="font-display text-[20px] font-normal text-ink">Refine</p>
        <button
          type="button"
          onClick={clearAll}
          className="font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-gold transition-colors hover:text-ink"
        >
          Clear all
        </button>
      </div>

      {!lockedTransaction && (
        <Group label="Transaction">
          <div className="flex border border-hairline">
            {["buy", "rent"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilter("transaction", t === "buy" && !search.transaction ? "" : t)}
                className={cn(
                  "h-9 flex-1 font-body text-[10.5px] font-semibold uppercase tracking-[0.14em] transition-colors",
                  transaction === t ? "bg-ink text-ivory" : "text-stone hover:text-ink",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </Group>
      )}

      {showBucket && (
        <Group label="Use">
          <div className="flex border border-hairline">
            {[
              { v: "", l: "All" },
              { v: "residential", l: "Residential" },
              { v: "commercial", l: "Commercial" },
            ].map((b) => (
              <button
                key={b.l}
                type="button"
                onClick={() => setFilter("bucket", b.v)}
                className={cn(
                  "h-9 flex-1 font-body text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors",
                  (search.bucket || "") === b.v ? "bg-ink text-ivory" : "text-stone hover:text-ink",
                )}
              >
                {b.l}
              </button>
            ))}
          </div>
        </Group>
      )}

      <Group label="Property type">
        <select className={selectClass} value={search.category || ""} onChange={(e) => setFilter("category", e.target.value)}>
          <option value="">All types</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </Group>

      <Group label="Locality">
        <select className={selectClass} value={search.locality || ""} onChange={(e) => setFilter("locality", e.target.value)}>
          <option value="">All of East Delhi</option>
          {LOCALITIES.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </Group>

      <Group label={`Budget (${transaction === "rent" ? "monthly" : "total"})`}>
        <div className="grid grid-cols-2 gap-3">
          <select className={selectClass} value={search.minPrice || ""} onChange={(e) => setFilter("minPrice", e.target.value)}>
            <option value="">Min</option>
            {budgets.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
          <select className={selectClass} value={search.maxPrice || ""} onChange={(e) => setFilter("maxPrice", e.target.value)}>
            <option value="">Max</option>
            {budgets.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>
      </Group>

      <Group label="Bedrooms">
        <div className="flex flex-wrap gap-1.5">
          {[null, ...BEDROOM_OPTIONS].map((b) => (
            <button
              key={String(b)}
              type="button"
              onClick={() => setFilter("bedrooms", b ? String(b) : "")}
              className={cn(
                "h-8 min-w-[38px] border px-2 font-body text-[11px] font-medium transition-colors",
                (search.bedrooms || "") === String(b || "")
                  ? "border-ink bg-ink text-ivory"
                  : "border-hairline text-stone hover:border-ink hover:text-ink",
              )}
            >
              {b ? (b === 5 ? "5+" : b) : "Any"}
            </button>
          ))}
        </div>
      </Group>

      <Group label="Bathrooms">
        <div className="flex flex-wrap gap-1.5">
          {[null, ...BATHROOM_OPTIONS].map((b) => (
            <button
              key={String(b)}
              type="button"
              onClick={() => setFilter("bathrooms", b ? String(b) : "")}
              className={cn(
                "h-8 min-w-[38px] border px-2 font-body text-[11px] font-medium transition-colors",
                (search.bathrooms || "") === String(b || "")
                  ? "border-ink bg-ink text-ivory"
                  : "border-hairline text-stone hover:border-ink hover:text-ink",
              )}
            >
              {b ? (b === 4 ? "4+" : b) : "Any"}
            </button>
          ))}
        </div>
      </Group>

      <Group label="Area (sq.ft.)">
        <div className="grid grid-cols-2 gap-3">
          <input
            className={selectClass}
            type="number"
            min="0"
            placeholder="Min"
            value={search.minArea || ""}
            onChange={(e) => setFilter("minArea", e.target.value)}
          />
          <input
            className={selectClass}
            type="number"
            min="0"
            placeholder="Max"
            value={search.maxArea || ""}
            onChange={(e) => setFilter("maxArea", e.target.value)}
          />
        </div>
      </Group>

      <Group label="Furnishing">
        <select className={selectClass} value={search.furnishing || ""} onChange={(e) => setFilter("furnishing", e.target.value)}>
          <option value="">Any</option>
          {FURNISHING.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </Group>

      <Group label="Parking">
        <select className={selectClass} value={search.parking || ""} onChange={(e) => setFilter("parking", e.target.value)}>
          <option value="">Any</option>
          {PARKING.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </Group>

      <Group label="Floor">
        <select className={selectClass} value={search.floor || ""} onChange={(e) => setFilter("floor", e.target.value)}>
          <option value="">Any</option>
          {FLOORS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </Group>

      <Group label="Availability">
        <select className={selectClass} value={search.availability || ""} onChange={(e) => setFilter("availability", e.target.value)}>
          <option value="">Any</option>
          {AVAILABILITY.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </Group>
    </div>
  );
}

export function MobileFilterButton({ onClick, search }) {
  const active = countActiveFilters(search);
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center gap-2 border border-hairline px-4 font-body text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink lg:hidden"
    >
      <SlidersHorizontal className="h-3.5 w-3.5 text-gold" strokeWidth={1.6} />
      Filters
      {active > 0 && (
        <span className="inline-flex h-4 min-w-4 items-center justify-center bg-gold px-1 text-[9px] text-ivory">
          {active}
        </span>
      )}
    </button>
  );
}

export function MobileFilterSheet({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] lg:hidden">
      <div className="absolute inset-0 bg-ink-deep/40" onClick={onClose} aria-hidden="true" />
      <div className="absolute inset-y-0 left-0 w-[92%] max-w-sm overflow-y-auto bg-ivory">
        <div className="sticky top-0 flex items-center justify-between border-b border-hairline bg-ivory px-5 py-4">
          <span className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
            Filters
          </span>
          <button type="button" onClick={onClose} aria-label="Close filters" className="p-1">
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
        {children}
        <div className="sticky bottom-0 border-t border-hairline bg-ivory p-4">
          <button
            type="button"
            onClick={onClose}
            className="h-11 w-full bg-ink font-body text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ivory"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}
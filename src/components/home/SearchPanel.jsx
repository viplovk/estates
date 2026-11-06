import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { CATEGORIES, LOCALITIES, BUDGETS } from "@/lib/site";
import { cn } from "@/lib/utils";

function Field({ label, children, className }) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <span className="font-body text-[9.5px] font-semibold uppercase tracking-[0.2em] text-stone">
        {label}
      </span>
      {children}
    </label>
  );
}

const selectClass =
  "h-9 w-full cursor-pointer appearance-none border-0 border-b border-hairline bg-transparent pb-1 font-body text-[14px] text-ink outline-none transition-colors focus:border-gold";

export function SearchPanel({ variant = "hero", presets = {} }) {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(presets.transaction || "buy");
  const [category, setCategory] = useState(presets.category || "");
  const [locality, setLocality] = useState(presets.locality || "");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  useEffect(() => {
    if (presets.transaction) setTransaction(presets.transaction);
  }, [presets.transaction]);

  const budgets = BUDGETS[transaction] || BUDGETS.buy;

  const submit = (e) => {
    e.preventDefault();
    const search = { transaction };
    if (category) search.category = category;
    if (locality) search.locality = locality;
    if (min) search.minPrice = min;
    if (max) search.maxPrice = max;
    navigate({ to: "/properties", search });
  };

  return (
    <form
      onSubmit={submit}
      className={cn(
        "w-full border border-hairline bg-ivory/95 backdrop-blur-md",
        variant === "hero"
          ? "p-5 shadow-[0_24px_70px_-40px_rgba(23,23,21,0.45)] sm:p-6"
          : "p-4 sm:p-5",
      )}
    >
      <div className="grid grid-cols-2 gap-x-5 gap-y-5 md:grid-cols-3 lg:grid-cols-[auto_1.1fr_1.1fr_1fr_1fr_auto] lg:items-end lg:gap-x-6">
        <div className="col-span-2 md:col-span-1">
          <span className="font-body text-[9.5px] font-semibold uppercase tracking-[0.2em] text-stone">
            Looking to
          </span>
          <div className="mt-1.5 flex border border-hairline">
            {["buy", "rent"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTransaction(t);
                  setMin("");
                  setMax("");
                }}
                className={cn(
                  "h-9 flex-1 font-body text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300",
                  transaction === t
                    ? "bg-ink text-ivory"
                    : "bg-transparent text-stone hover:text-ink",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <Field label="Property type">
          <select className={selectClass} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All types</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Locality">
          <select className={selectClass} value={locality} onChange={(e) => setLocality(e.target.value)}>
            <option value="">All of East Delhi</option>
            {LOCALITIES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Budget from">
          <select className={selectClass} value={min} onChange={(e) => setMin(e.target.value)}>
            <option value="">Min</option>
            {budgets.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Budget to">
          <select className={selectClass} value={max} onChange={(e) => setMax(e.target.value)}>
            <option value="">Max</option>
            {budgets.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </Field>

        <button
          type="submit"
          className="col-span-2 flex h-11 items-center justify-center gap-2.5 bg-ink px-7 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors duration-300 hover:bg-gold md:col-span-1 lg:h-11"
        >
          <Search className="h-3.5 w-3.5" strokeWidth={1.8} />
          Search
        </button>
      </div>
    </form>
  );
}
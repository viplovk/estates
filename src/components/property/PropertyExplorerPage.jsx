import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { searchProperties } from "@/lib/server-fns";
import { PropertyCard } from "@/components/property/PropertyCard";
import {
  MobileFilterButton,
  MobileFilterSheet,
  PropertyFilters,
} from "@/components/property/PropertyFilters";
import { SORTS } from "@/lib/site";
import { countActiveFilters } from "@/lib/property-search";
import { cn } from "@/lib/utils";

function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] w-full bg-[#EAE5DA]" />
      <div className="mt-4 h-3 w-20 bg-[#EAE5DA]" />
      <div className="mt-3 h-5 w-4/5 bg-[#EAE5DA]" />
      <div className="mt-3 h-3 w-2/3 bg-[#EAE5DA]" />
    </div>
  );
}

export function PropertyExplorerPage({
  to,
  search,
  lockedTransaction,
  bucket,
  eyebrow,
  title,
  description,
}) {
  const navigate = useNavigate();
  const fetchPage = useServerFn(searchProperties);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const payload = useMemo(() => {
    const p = { ...search };
    if (lockedTransaction) p.transaction = lockedTransaction;
    else delete p.transaction;
    if (bucket) p.bucket = bucket;
    return p;
  }, [search, lockedTransaction, bucket]);

  const key = JSON.stringify(payload);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(false);
    fetchPage({ data: payload })
      .then((res) => {
        if (!alive) return;
        setItems(res.items || []);
        setTotal(res.total || 0);
        setCursor(res.next_cursor || null);
        setHasMore(!!res.has_more);
      })
      .catch(() => {
        if (!alive) return;
        setItems([]);
        setTotal(0);
        setError(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setFilter = useCallback(
    (name, value) => {
      const next = { ...search };
      if (value === "" || value === null || value === undefined) delete next[name];
      else next[name] = String(value);
      navigate({ to, search: next, replace: true });
    },
    [navigate, search, to],
  );

  const clearAll = useCallback(() => {
    const next = {};
    if (lockedTransaction) next.transaction = lockedTransaction;
    if (bucket) next.bucket = bucket;
    navigate({ to, search: next, replace: true });
  }, [navigate, to, lockedTransaction, bucket]);

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await fetchPage({ data: { ...payload, cursor } });
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...(res.items || []).filter((p) => !seen.has(p.id))];
      });
      setCursor(res.next_cursor || null);
      setHasMore(!!res.has_more);
    } finally {
      setLoadingMore(false);
    }
  };

  const activeFilters = countActiveFilters(search);

  return (
    <div className="bg-cream pt-[104px] lg:pt-[132px]">
      <div className="mx-auto w-full max-w-[1320px] px-5 pb-10 pt-8 sm:px-8 lg:px-12 lg:pt-12">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.1rem,1.5rem+2.8vw,3.6rem)] font-light leading-[1.05] tracking-[-0.01em] text-ink">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl font-body text-[14px] leading-relaxed text-stone">
            {description}
          </p>
        )}
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-32 border border-hairline">
              <PropertyFilters
                search={search}
                setFilter={setFilter}
                clearAll={clearAll}
                lockedTransaction={lockedTransaction}
                showBucket={!bucket}
              />
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4">
              <p className="font-body text-[12px] uppercase tracking-[0.14em] text-stone">
                {loading ? "Searching…" : `${total} ${total === 1 ? "property" : "properties"}`}
                {activeFilters > 0 && !loading && (
                  <span className="text-gold"> · {activeFilters} filters</span>
                )}
              </p>
              <div className="flex items-center gap-4">
                <MobileFilterButton onClick={() => setSheetOpen(true)} search={search} />
                <label className="flex items-center gap-2">
                  <span className="hidden font-body text-[10px] uppercase tracking-[0.14em] text-stone sm:inline">
                    Sort
                  </span>
                  <select
                    value={search.sort || "newest"}
                    onChange={(e) => setFilter("sort", e.target.value === "newest" ? "" : e.target.value)}
                    className="h-10 cursor-pointer appearance-none border border-hairline bg-transparent px-3 font-body text-[12px] text-ink outline-none transition-colors hover:border-ink focus:border-gold"
                  >
                    {SORTS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {loading ? (
              <div className="mt-8 grid gap-x-7 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="mt-8 border border-dashed border-hairline bg-ivory px-8 py-16 text-center">
                <p className="font-display text-2xl text-ink">We couldn't load listings</p>
                <p className="mx-auto mt-3 max-w-sm font-body text-[13.5px] leading-relaxed text-stone">
                  Please try again in a moment, or share your requirement and we will send
                  suitable options directly.
                </p>
                <Link to="/contact" className="mt-6 inline-flex h-11 items-center bg-ink px-6 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory">
                  Contact us
                </Link>
              </div>
            ) : items.length === 0 ? (
              <div className="mt-8 border border-dashed border-hairline bg-ivory px-8 py-16 text-center">
                <p className="font-display text-2xl font-light text-ink">
                  No properties match these filters yet
                </p>
                <p className="mx-auto mt-3 max-w-md font-body text-[13.5px] leading-relaxed text-stone">
                  Our inventory changes often. Clear a few filters, or tell us what you
                  need and we'll look for it directly.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="inline-flex h-11 items-center border border-ink px-6 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-ivory"
                  >
                    Clear filters
                  </button>
                  <Link
                    to="/contact"
                    className="inline-flex h-11 items-center bg-ink px-6 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-gold"
                  >
                    Share requirement
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-8 grid gap-x-7 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
                {hasMore && (
                  <div className="mt-14 flex justify-center">
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={loadingMore}
                      className={cn(
                        "inline-flex h-12 items-center border border-ink px-8 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-ivory",
                        loadingMore && "opacity-50",
                      )}
                    >
                      {loadingMore ? "Loading…" : "Load more properties"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <MobileFilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <PropertyFilters
          search={search}
          setFilter={setFilter}
          clearAll={clearAll}
          lockedTransaction={lockedTransaction}
          showBucket={!bucket}
        />
      </MobileFilterSheet>
    </div>
  );
}
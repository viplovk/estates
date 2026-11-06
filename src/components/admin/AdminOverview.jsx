import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { adminOverview } from "@/lib/server-fns";

const CARDS = [
  { key: "totalProperties", label: "Total properties", to: "/admin/properties" },
  { key: "published", label: "Published listings", to: "/admin/properties" },
  { key: "unpublished", label: "Unpublished drafts", to: "/admin/properties" },
  { key: "totalLeads", label: "Total enquiries", to: "/admin/leads" },
  { key: "newLeads", label: "New leads", to: "/admin/leads" },
  { key: "scheduledViewings", label: "Viewings scheduled", to: "/admin/leads" },
  { key: "pendingSubmissions", label: "Owner submissions to review", to: "/admin/submissions" },
];

export function AdminOverview() {
  const fetchOverview = useServerFn(adminOverview);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchOverview()
      .then((res) => alive && setData(res))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [fetchOverview]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-6">
        <div>
          <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.2em] text-gold">
            Dashboard
          </p>
          <h1 className="mt-2 font-display text-3xl font-light text-ink">Overview</h1>
        </div>
        <Link
          to="/admin/properties/$propertyId"
          params={{ propertyId: "new" }}
          className="inline-flex h-10 items-center bg-ink px-5 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-gold"
        >
          Add property
        </Link>
      </div>

      {error && (
        <p className="mt-6 font-body text-[12px] text-destructive">
          Couldn't load the overview. Refresh the page to try again.
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.key}
            to={card.to}
            className="border border-hairline bg-ivory px-6 py-6 transition-colors hover:bg-[#F1EEE5]"
          >
            <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.16em] text-stone">
              {card.label}
            </p>
            <p className="mt-3 font-display text-[38px] font-light leading-none text-ink">
              {data ? data[card.key] ?? 0 : "—"}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 border border-hairline bg-ivory px-6 py-6">
        <p className="font-body text-[9.5px] font-semibold uppercase tracking-[0.16em] text-stone">
          Quick actions
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            { label: "Add a listing", to: "/admin/properties/$propertyId" },
            { label: "Review leads", to: "/admin/leads" },
            { label: "Owner submissions", to: "/admin/submissions" },
          ].map((a) => (
            <Link
              key={a.label}
              to={a.to}
              params={a.to.includes("$") ? { propertyId: "new" } : undefined}
              className="inline-flex h-10 items-center border border-hairline px-4 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
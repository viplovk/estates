import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, LogOut, Building2, Inbox, Home, UserRound } from "lucide-react";
import { AuthGateError, requireSignedIn } from "@/components/auth/AuthGate";
import { useAuth } from "@/lib/AuthContext";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed")({
  ssr: false,
  beforeLoad: requireSignedIn,
  errorComponent: AuthGateError,
  component: AuthedLayout,
});

const NAV = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Properties", to: "/admin/properties", icon: Building2 },
  { label: "Leads", to: "/admin/leads", icon: Inbox },
  { label: "Owner Submissions", to: "/admin/submissions", icon: UserRound },
];

function AuthedLayout() {
  const { user, isLoadingAuth, logout } = useAuth();
  const [path, setPath] = useState("");

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  if (isLoadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <span className="font-body text-[11px] uppercase tracking-[0.18em] text-stone">
          Loading…
        </span>
      </div>
    );
  }

  if (user && user.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
        <p className="eyebrow">Restricted</p>
        <h1 className="mt-4 max-w-md font-display text-3xl font-light text-ink">
          This dashboard is for the agency administrator
        </h1>
        <p className="mt-3 max-w-md font-body text-[13.5px] leading-relaxed text-stone">
          You are signed in as {user.email}, which does not have administrator access.
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex h-11 items-center bg-ink px-6 font-body text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ivory"
        >
          Back to the website
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-hairline bg-cream/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8">
          <div className="flex items-center gap-6">
            <Logo />
            <span className="hidden border-l border-hairline pl-6 font-body text-[9.5px] font-semibold uppercase tracking-[0.2em] text-stone sm:block">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hidden font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-stone transition-colors hover:text-ink sm:block"
            >
              View site
            </Link>
            <span className="hidden font-body text-[11px] text-stone md:block">{user?.email}</span>
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex h-9 items-center gap-2 border border-hairline px-3 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.6} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px] gap-8 px-5 py-8 sm:px-8">
        <aside className="hidden w-52 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1">
            {NAV.map((item) => {
              const active = item.exact ? path === item.to : path.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 font-body text-[12px] transition-colors",
                    active ? "bg-ink text-ivory" : "text-stone hover:bg-ivory hover:text-ink",
                  )}
                >
                  <item.icon className="h-3.5 w-3.5" strokeWidth={1.6} />
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/"
              className="mt-4 flex items-center gap-3 border-t border-hairline px-3 pt-4 font-body text-[12px] text-stone transition-colors hover:text-ink"
            >
              <Home className="h-3.5 w-3.5" strokeWidth={1.6} />
              Public site
            </Link>
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {NAV.map((item) => {
              const active = item.exact ? path === item.to : path.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "whitespace-nowrap border px-3 py-2 font-body text-[10px] font-semibold uppercase tracking-[0.12em]",
                    active ? "border-ink bg-ink text-ivory" : "border-hairline text-stone",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({ inverted = false, onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="group inline-flex flex-col leading-none"
      aria-label={`${SITE.name} — home`}
    >
      <span
        className={cn(
          "font-display text-[19px] font-normal uppercase leading-none tracking-[0.24em] transition-colors sm:text-[21px]",
          inverted ? "text-ivory" : "text-ink",
        )}
      >
        East Delhi
      </span>
      <span
        className={cn(
          "mt-1 font-display text-[19px] font-normal uppercase leading-none tracking-[0.24em] transition-colors sm:text-[21px]",
          inverted ? "text-gold" : "text-gold",
        )}
      >
        Realty
      </span>
    </Link>
  );
}
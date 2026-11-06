import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Section({ children, className, id, as = "section" }) {
  const Tag = as;
  return (
    <Tag id={id} className={cn("px-5 sm:px-8 lg:px-12", className)}>
      <div className="mx-auto w-full max-w-[1320px]">{children}</div>
    </Tag>
  );
}

export function Reveal({ children, delay = 0, className, y = 20 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 0.61, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({ eyebrow, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 border-b border-hairline pb-8 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-4 font-display text-[clamp(2rem,1.4rem+2.2vw,3.25rem)] font-light leading-[1.08] tracking-[-0.01em] text-ink">
          {title}
        </h2>
        {description && (
          <p className="mt-4 max-w-lg font-body text-[14.5px] leading-relaxed text-stone">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function HairlineLink({ children, className, ...props }) {
  return (
    <span
      className={cn(
        "group inline-flex items-center gap-3 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink",
        className,
      )}
      {...props}
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-full bg-gold/50 transition-all duration-400 group-hover:bg-gold" />
      </span>
      <svg viewBox="0 0 17.4 17.4" fill="none" className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
        <path d="M11.35 1.52 14.1 4.68c1.87 2.15 1.87 5.63 0 7.78l-2.75 3.16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M15.5 8.63H1.07" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}
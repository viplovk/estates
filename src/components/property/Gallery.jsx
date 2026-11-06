import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

export function Gallery({ images = [], title }) {
  const list = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  if (list.length === 0) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center bg-[#E7E2D6]">
        <span className="font-body text-[10px] uppercase tracking-[0.2em] text-stone">
          Photographs pending
        </span>
      </div>
    );
  }

  const go = (dir) => setActive((i) => (i + dir + list.length) % list.length);

  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E7E2D6]">
        <Image
          src={list[active]}
          alt={`${title} — photograph ${active + 1}`}
          fittingType="fill"
          className="h-full w-full object-cover"
        />
        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photograph"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-ivory/90 text-ink transition-colors hover:bg-ivory"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photograph"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-ivory/90 text-ink transition-colors hover:bg-ivory"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          className="absolute bottom-3 right-3 flex h-9 items-center gap-2 bg-ivory/90 px-3 font-body text-[9.5px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ivory"
        >
          <Expand className="h-3 w-3" strokeWidth={1.6} />
          View all
        </button>
      </div>

      {list.length > 1 && (
        <div className="gallery-scroll mt-3 flex gap-2 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photograph ${i + 1}`}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden transition-opacity",
                i === active ? "opacity-100 ring-1 ring-gold" : "opacity-60 hover:opacity-100",
              )}
            >
              <Image src={src} alt="" fittingType="fill" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex flex-col bg-ink-deep/97"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") go(1);
              if (e.key === "ArrowLeft") go(-1);
            }}
            tabIndex={-1}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-ivory/60">
                {active + 1} / {list.length}
              </span>
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                aria-label="Close gallery"
                className="flex h-10 w-10 items-center justify-center text-ivory"
              >
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-4 pb-8">
              <Image
                src={list[active]}
                alt={`${title} — photograph ${active + 1}`}
                fittingType="fit"
                className="max-h-full max-w-full object-contain"
              />
              {list.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous photograph"
                    className="absolute left-3 flex h-11 w-11 items-center justify-center border border-ivory/25 text-ivory transition-colors hover:bg-ivory/10"
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={1.4} />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next photograph"
                    className="absolute right-3 flex h-11 w-11 items-center justify-center border border-ivory/25 text-ivory transition-colors hover:bg-ivory/10"
                  >
                    <ChevronRight className="h-5 w-5" strokeWidth={1.4} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
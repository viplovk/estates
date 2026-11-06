import { createContext, useContext, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SITE, whatsappLink } from "@/lib/site";

const WhatsAppFloatContext = createContext({ message: "", setMessage: () => {} });

export function WhatsAppFloatProvider({ children }) {
  const [message, setMessage] = useState("");
  const value = useMemo(() => ({ message, setMessage }), [message]);
  return (
    <WhatsAppFloatContext.Provider value={value}>{children}</WhatsAppFloatContext.Provider>
  );
}

export function useWhatsAppFloat() {
  return useContext(WhatsAppFloatContext);
}

function WhatsAppGlyph({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.42 1.28 4.87L2 22l5.33-1.4a9.9 9.9 0 0 0 4.71 1.2h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm0 18.13c-1.5 0-2.96-.4-4.24-1.16l-.3-.18-3.16.83.85-3.08-.2-.32a8.16 8.16 0 0 1-1.25-4.26 8.19 8.19 0 0 1 8.3-8.17 8.13 8.13 0 0 1 8.14 8.18c0 4.51-3.67 8.16-8.14 8.16Zm4.5-6.12c-.24-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.55.12-.16.25-.63.8-.78.96-.14.16-.29.18-.53.06a6.66 6.66 0 0 1-1.96-1.21 7.4 7.4 0 0 1-1.36-1.7c-.14-.24-.02-.37.1-.49.12-.12.25-.29.37-.43.12-.15.16-.25.25-.41.08-.16.04-.3-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.41.06-.63.3-.21.25-.82.8-.82 1.96 0 1.15.84 2.27.96 2.43.12.16 1.65 2.63 4.02 3.59 2.36.96 2.36.64 2.79.6.43-.04 1.38-.56 1.58-1.11.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

export function FloatingWhatsApp() {
  const { message } = useWhatsAppFloat();
  const href = whatsappLink(
    message || `Hello ${SITE.consultant}, I'd like to know more about properties in East Delhi.`,
  );

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full border border-ink-deep/90 bg-ink-deep py-3 pl-4 pr-5 text-ivory shadow-[0_10px_30px_-12px_rgba(23,23,21,0.6)] transition-colors duration-300 hover:bg-[#1CA3C4] hover:border-[#1CA3C4] md:bottom-8 md:right-8"
    >
      <WhatsAppGlyph className="h-[18px] w-[18px] text-gold transition-colors duration-300 group-hover:text-ivory" />
      <span className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] sm:inline">
        WhatsApp
      </span>
    </motion.a>
  );
}
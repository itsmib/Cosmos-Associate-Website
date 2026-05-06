import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { WHATSAPP } from "@/lib/contact";

const FloatingActions = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white flex items-center justify-center shadow-lift hover:-translate-y-1 transition-smooth animate-float"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366]/40 -z-10" />
      </a>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-[9.25rem] md:bottom-24 right-4 md:right-6 z-50 w-11 h-11 rounded-full bg-navy hover:bg-navy-light text-white flex items-center justify-center shadow-lift transition-smooth"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default FloatingActions;

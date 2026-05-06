import { useEffect, useState } from "react";
import {
  Home,
  Info,
  PlayCircle,
  Building2,
  Sparkles,
  Quote,
  Star,
  Network,
  HelpCircle,
  Mail,
  type LucideIcon,
} from "lucide-react";

// Vertical navigation rail. One pill per anchored section. Active section is
// computed via IntersectionObserver — the section closest to the top of the
// viewport wins. Hidden on mobile (the Navbar's hamburger menu covers that).
type RailItem = { id: string; label: string; icon: LucideIcon };

const ITEMS: RailItem[] = [
  { id: "hero",           label: "Home",         icon: Home },
  { id: "about",          label: "About",        icon: Info },
  { id: "watch",          label: "Watch",        icon: PlayCircle },
  { id: "projects",       label: "Projects",     icon: Building2 },
  { id: "why-us",         label: "Why Us",       icon: Sparkles },
  { id: "testimonials",   label: "Testimonials", icon: Quote },
  { id: "google-reviews", label: "Google",       icon: Star },
  { id: "bni",            label: "BNI",          icon: Network },
  { id: "faq",            label: "FAQ",          icon: HelpCircle },
  { id: "contact",        label: "Contact",      icon: Mail },
];

const SideRail = () => {
  const [active, setActive] = useState<string>("hero");

  useEffect(() => {
    const sections = ITEMS
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    // Pick whichever observed section's top is closest to (but past) the
    // 25%-from-top mark. That mirrors how a reader perceives "current".
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Section navigation"
      className="
        fixed z-40 bg-white/90 backdrop-blur border border-navy/10 shadow-card
        flex gap-1.5 p-1.5
        bottom-3 left-1/2 -translate-x-1/2 max-w-[calc(100vw-1.5rem)] overflow-x-auto rounded-full
        md:bottom-auto md:left-auto md:translate-x-0 md:right-4 md:top-[calc(5rem+1rem)]
        md:max-w-none md:max-h-[calc(100vh-7rem)] md:overflow-x-visible md:overflow-y-auto
        md:flex-col md:gap-2 md:p-2
      "
    >
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            aria-label={`Jump to ${item.label}`}
            aria-current={isActive ? "true" : undefined}
            className={`group relative shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-smooth ${
              isActive
                ? "bg-crimson text-white shadow-crimson"
                : "text-navy/70 hover:bg-navy/5 hover:text-crimson"
            }`}
          >
            <Icon className="w-[18px] h-[18px] md:w-5 md:h-5" />
            {/* Tooltip — above the pill on mobile, to the left of the rail on desktop */}
            <span
              role="tooltip"
              className="
                pointer-events-none absolute whitespace-nowrap rounded-md bg-navy text-white text-xs font-medium px-2.5 py-1
                opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-smooth
                bottom-full mb-2 left-1/2 -translate-x-1/2 translate-y-1 group-hover:translate-y-0 group-focus-visible:translate-y-0
                md:bottom-auto md:mb-0 md:left-auto md:right-full md:mr-3 md:top-1/2 md:-translate-x-0 md:-translate-y-1/2 md:translate-x-1 group-hover:md:translate-x-0 group-focus-visible:md:translate-x-0
              "
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default SideRail;

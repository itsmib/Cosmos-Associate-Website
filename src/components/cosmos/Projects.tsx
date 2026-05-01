import { useCallback, useEffect, useRef, useState } from "react";
import {
  projectsByCategory,
  renovationProjects,
  ProjectCategory,
  Project,
  RenovationProject,
} from "@/lib/projects";
import { ChevronLeft, ChevronRight, ImageIcon, MapPin } from "lucide-react";

type SectionKey = ProjectCategory;

const SECTIONS: { key: SectionKey; title: string; subtitle: string }[] = [
  { key: "Ongoing", title: "Ongoing Projects", subtitle: "Active developments under construction" },
  { key: "Karaikal", title: "Projects in Karaikal", subtitle: "Our home ground for four decades" },
  { key: "Chennai", title: "Projects in Chennai", subtitle: "Bringing Cosmos quality to the metropolitan" },
  { key: "Renovation", title: "Renovation Projects", subtitle: "Restored, reimagined — see the transformation" },
  { key: "Other", title: "Projects in Other Cities", subtitle: "Expanding trust beyond borders" },
];

const ProjectCard = ({ p }: { p: Project }) => (
  <article className="group bg-white rounded-2xl border border-navy/10 overflow-hidden shadow-card hover:shadow-lift hover:-translate-y-1 transition-smooth shrink-0 w-[280px] sm:w-[320px] snap-start">
    <div className="aspect-[4/3] overflow-hidden bg-muted">
      <img
        src={p.image}
        alt={p.name}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
      />
    </div>
    <div className="p-5">
      <h3 className="font-serif text-xl text-navy font-semibold mb-1">{p.name}</h3>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" />
          {p.category === "Other" && p.location === "Other" ? "Multi-city" : p.location}
        </div>
        {p.detail && (
          <span className="text-xs font-medium bg-crimson text-white px-3 py-1 rounded-full">
            {p.detail}
          </span>
        )}
      </div>
    </div>
  </article>
);

// Renovation card: Before | After side-by-side, falling back to a single
// full-width image if only one variant has been uploaded so far.
const RenovationCard = ({ p }: { p: RenovationProject }) => {
  const hasBoth = !!p.before && !!p.after;
  const single = p.before || p.after;
  return (
    <article className="group bg-white rounded-2xl border border-navy/10 overflow-hidden shadow-card hover:shadow-lift hover:-translate-y-1 transition-smooth shrink-0 w-[320px] sm:w-[460px] snap-start">
      <div className="aspect-[16/9] overflow-hidden bg-muted">
        {hasBoth ? (
          <div className="grid grid-cols-2 h-full">
            <div className="relative overflow-hidden border-r border-white/40">
              <img
                src={p.before}
                alt={`${p.name} — before renovation`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
              />
              <span className="absolute top-2 left-2 text-[10px] font-semibold tracking-wider uppercase bg-navy/85 text-white px-2 py-0.5 rounded-full">
                Before
              </span>
            </div>
            <div className="relative overflow-hidden">
              <img
                src={p.after}
                alt={`${p.name} — after renovation`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
              />
              <span className="absolute top-2 left-2 text-[10px] font-semibold tracking-wider uppercase bg-crimson text-white px-2 py-0.5 rounded-full">
                After
              </span>
            </div>
          </div>
        ) : (
          <img
            src={single}
            alt={p.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
          />
        )}
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl text-navy font-semibold mb-1">{p.name}</h3>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            {p.location === "Renovation" ? "Renovation" : p.location}
          </div>
          {p.detail && (
            <span className="text-xs font-medium bg-crimson text-white px-3 py-1 rounded-full">
              {p.detail}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

const ComingSoon = () => (
  <article className="rounded-2xl border-2 border-dashed border-navy/15 bg-muted/40 p-10 flex flex-col items-center justify-center text-center min-h-[320px] shrink-0 w-[280px] sm:w-[320px] snap-start">
    <div className="w-14 h-14 rounded-full bg-navy/5 flex items-center justify-center mb-4">
      <ImageIcon className="w-6 h-6 text-navy/40" />
    </div>
    <h3 className="font-serif text-xl text-navy font-semibold mb-1">Coming Soon</h3>
    <p className="text-sm text-muted-foreground max-w-xs">
      New projects launching shortly. Contact us to be the first to know.
    </p>
  </article>
);

// Accessible horizontal strip: left/right buttons, keyboard arrows, Home/End,
// aria-live region for screen readers, and button state that reflects whether
// more content exists in either direction.
type StripProps = {
  label: string;   // used for aria-label on the strip and the nav buttons
  children: React.ReactNode;
  hasItems: boolean;
};
const ScrollStrip = ({ label, children, hasItems }: StripProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  // Re-evaluate whether we can scroll left/right whenever the element scrolls
  // or the window resizes (card widths shift at the sm breakpoint).
  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const maxLeft = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft < maxLeft - 2);
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update, children]);

  // Scroll by approximately one card width so each click advances the row
  // by one visible card on mobile and the full viewport minus a peek on desktop.
  const scrollBy = (direction: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const step = Math.max(280, el.clientWidth * 0.85);
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    switch (e.key) {
      case "ArrowRight": e.preventDefault(); scrollBy(1); break;
      case "ArrowLeft":  e.preventDefault(); scrollBy(-1); break;
      case "Home":       e.preventDefault(); el.scrollTo({ left: 0, behavior: "smooth" }); break;
      case "End":        e.preventDefault(); el.scrollTo({ left: el.scrollWidth, behavior: "smooth" }); break;
    }
  };

  return (
    <div className="relative">
      {/* Nav buttons — hidden on very small screens where swipe is the norm.
          Rendered but disabled when there's nothing to scroll to, so their
          presence is stable (no layout shift) and screen readers can announce
          the state change. */}
      {hasItems && (
        <>
          <button
            type="button"
            aria-label={`Scroll ${label} left`}
            aria-controls={`strip-${label.replace(/\s+/g, "-").toLowerCase()}`}
            disabled={!canLeft}
            onClick={() => scrollBy(-1)}
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white border border-navy/10 shadow-card text-navy hover:shadow-lift disabled:opacity-0 disabled:pointer-events-none transition-smooth"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label={`Scroll ${label} right`}
            aria-controls={`strip-${label.replace(/\s+/g, "-").toLowerCase()}`}
            disabled={!canRight}
            onClick={() => scrollBy(1)}
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white border border-navy/10 shadow-card text-navy hover:shadow-lift disabled:opacity-0 disabled:pointer-events-none transition-smooth"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <div className="-mx-4 sm:mx-0">
        <div
          id={`strip-${label.replace(/\s+/g, "-").toLowerCase()}`}
          ref={ref}
          role="region"
          aria-label={label}
          aria-roledescription="carousel"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 sm:px-0 pb-4 projects-scroll focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson/50 focus-visible:ring-offset-2 rounded-sm"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="py-24 sm:py-32 bg-gradient-to-b from-background to-navy-soft/40">
      <div className="container">
        <div className="reveal text-center max-w-3xl mx-auto mb-20">
          <div className="text-crimson text-xs tracking-[0.3em] uppercase mb-4 font-medium">Our Portfolio</div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-navy font-semibold mb-6">
            Properties Built on <em className="text-crimson font-medium">Promise</em>
          </h2>
          <p className="text-muted-foreground text-lg">
            From DTCP-approved plots to premium developments — every Cosmos project is verified, transparent and built to last.
          </p>
        </div>

        <div className="space-y-20">
          {SECTIONS.map((section) => {
            const isReno = section.key === "Renovation";
            const renoItems = isReno ? renovationProjects : [];
            const items = isReno ? [] : projectsByCategory(section.key);
            const hasItems = isReno ? renoItems.length > 0 : items.length > 0;
            return (
              <div key={section.key} className="reveal">
                <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl text-navy font-semibold">
                      {section.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">{section.subtitle}</p>
                  </div>
                  <div className="h-px flex-1 bg-navy/10 hidden sm:block min-w-[60px]" />
                </div>

                <ScrollStrip label={section.title} hasItems={hasItems}>
                  {hasItems
                    ? (isReno
                        ? renoItems.map((p, i) => <RenovationCard key={i} p={p} />)
                        : items.map((p, i) => <ProjectCard key={i} p={p} />))
                    : <ComingSoon />}
                </ScrollStrip>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Projects;

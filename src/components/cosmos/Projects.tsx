import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { projectsByCategory, ProjectCategory, Project } from "@/lib/projects";
import { ChevronLeft, ChevronRight, ImageIcon, MapPin } from "lucide-react";

type SectionKey = ProjectCategory;

const SECTIONS: { key: SectionKey; title: string; subtitle: string }[] = [
  { key: "Karaikal", title: "Projects in Karaikal", subtitle: "Our home ground for four decades" },
  { key: "Ongoing", title: "Ongoing Projects", subtitle: "Active developments under construction" },
  { key: "Renovation", title: "Renovation Projects", subtitle: "Restored, reimagined — see the transformation" },
  { key: "PlotLayout", title: "Plots Available for Sale", subtitle: "DTCP / KPA / PPA-approved layouts — own your piece of land today" },
  { key: "Other", title: "Projects in Other Cities", subtitle: "Expanding trust beyond borders" },
];

const CardLink = ({ slug, children, className }: { slug: string; children: React.ReactNode; className: string }) => (
  <Link
    to={`/project/${slug}`}
    className={`${className} block focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson/60 focus-visible:ring-offset-2 rounded-2xl`}
  >
    {children}
  </Link>
);

const ProjectCard = ({ p }: { p: Project }) => (
  <CardLink slug={p.slug} className="shrink-0 w-[280px] sm:w-[320px] snap-start">
    <article className="group bg-white rounded-2xl border border-navy/10 overflow-hidden shadow-card hover:shadow-lift hover:-translate-y-1 transition-smooth h-full">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        {p.cover ? (
          <img
            src={p.cover}
            alt={p.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-navy/30">
            <ImageIcon className="w-10 h-10" />
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl text-navy font-semibold mb-1">{p.name}</h3>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            {p.category === "Other" && p.location === "Other" ? "Multi-city" : p.location}
          </div>
          {p.badge && (
            <span className="text-xs font-medium bg-crimson text-white px-3 py-1 rounded-full">
              {p.badge}
            </span>
          )}
        </div>
      </div>
    </article>
  </CardLink>
);

// PlotLayout card: same shape as a regular project card but the bottom half
// surfaces inventory — Total / Sold / Available — instead of the badge. We
// also try to compute a sold/total ratio for a tiny progress bar; if either
// number is non-numeric (e.g. "Sold out", "12+"), we just skip the bar.
const toNumber = (v: string | number | undefined): number | undefined => {
  if (v === undefined) return undefined;
  if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
  const m = v.match(/-?\d+(\.\d+)?/);
  if (!m) return undefined;
  const n = Number(m[0]);
  return Number.isFinite(n) ? n : undefined;
};

const PlotStat = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone: "neutral" | "muted" | "highlight";
}) => {
  const toneClass =
    tone === "highlight"
      ? "bg-crimson/10 border-crimson/20 text-crimson"
      : tone === "muted"
      ? "bg-navy/[0.04] border-navy/10 text-navy/70"
      : "bg-navy/[0.04] border-navy/10 text-navy";
  return (
    <div className={`rounded-lg border ${toneClass} px-2 py-2 flex flex-col items-center justify-center text-center`}>
      <div className="text-[9px] uppercase tracking-[0.12em] font-medium opacity-80 leading-none mb-1">
        {label}
      </div>
      <div className="font-serif text-base sm:text-lg font-semibold leading-none">
        {value}
      </div>
    </div>
  );
};

const PlotLayoutCard = ({ p }: { p: Project }) => {
  const total = p.plotsTotal ?? p.plots;
  const sold = p.plotsSold;

  const totalN = toNumber(total);
  const soldN = toNumber(sold);
  // Derive `available` from total - sold whenever both are numeric, so editors
  // only have to keep two numbers in sync. Falls back to an explicit
  // `plotsAvailable` value (which may be a string like "Sold out") if the
  // arithmetic isn't possible.
  const available =
    totalN !== undefined && soldN !== undefined
      ? Math.max(0, totalN - soldN)
      : p.plotsAvailable;
  const showBar = totalN !== undefined && soldN !== undefined && totalN > 0;
  const soldPct = showBar ? Math.min(100, Math.max(0, Math.round((soldN! / totalN!) * 100))) : 0;

  return (
    <CardLink slug={p.slug} className="shrink-0 w-[280px] sm:w-[340px] snap-start">
      <article className="group bg-white rounded-2xl border border-navy/10 overflow-hidden shadow-card hover:shadow-lift hover:-translate-y-1 transition-smooth h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {p.cover ? (
            <img
              src={p.cover}
              alt={p.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-navy/30">
              <ImageIcon className="w-10 h-10" />
            </div>
          )}
          <span className="absolute top-3 left-3 text-[10px] font-semibold tracking-wider uppercase bg-white/95 text-crimson px-2.5 py-1 rounded-full shadow-card">
            For Sale
          </span>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-serif text-xl text-navy font-semibold mb-1 line-clamp-1">{p.name}</h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <MapPin className="w-3.5 h-3.5" />
            {p.location}
          </div>

          {(total !== undefined || sold !== undefined || available !== undefined) ? (
            <>
              <div className="grid grid-cols-3 gap-2 mt-auto">
                <PlotStat label="Total"     value={total ?? "—"}     tone="neutral" />
                <PlotStat label="Sold"      value={sold ?? "—"}      tone="muted" />
                <PlotStat label="Available" value={available ?? "—"} tone="highlight" />
              </div>

              {showBar && (
                <div className="mt-3" aria-hidden="true">
                  <div className="h-1.5 rounded-full bg-navy/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-navy to-crimson transition-smooth"
                      style={{ width: `${soldPct}%` }}
                    />
                  </div>
                  <div className="mt-1.5 text-[10px] text-muted-foreground tracking-wide">
                    {soldPct}% sold
                  </div>
                </div>
              )}
            </>
          ) : (
            p.badge && (
              <div className="mt-auto">
                <span className="text-xs font-medium bg-crimson text-white px-3 py-1 rounded-full">
                  {p.badge}
                </span>
              </div>
            )
          )}
        </div>
      </article>
    </CardLink>
  );
};

// Renovation card: Before | After side-by-side, falling back to whatever
// single image exists (cover, then before, then after) if the pair isn't
// complete yet.
const RenovationCard = ({ p }: { p: Project }) => {
  const hasBoth = !!p.before && !!p.after;
  const single = p.cover || p.before || p.after;
  return (
    <CardLink slug={p.slug} className="shrink-0 w-[320px] sm:w-[460px] snap-start">
      <article className="group bg-white rounded-2xl border border-navy/10 overflow-hidden shadow-card hover:shadow-lift hover:-translate-y-1 transition-smooth h-full">
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
          ) : single ? (
            <img
              src={single}
              alt={p.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-navy/30">
              <ImageIcon className="w-10 h-10" />
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-serif text-xl text-navy font-semibold mb-1">{p.name}</h3>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              {p.location === "Renovation" ? "Renovation" : p.location}
            </div>
            {p.badge && (
              <span className="text-xs font-medium bg-crimson text-white px-3 py-1 rounded-full">
                {p.badge}
              </span>
            )}
          </div>
        </div>
      </article>
    </CardLink>
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
            From DTCP / KPA / PPA-approved plots to premium developments — every Cosmos project is verified, transparent and built to last.
          </p>
        </div>

        <div className="space-y-20">
          {SECTIONS.map((section) => {
            const isReno = section.key === "Renovation";
            const isPlots = section.key === "PlotLayout";
            const items = projectsByCategory(section.key);
            const hasItems = items.length > 0;
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
                    ? items.map((p) =>
                        isReno
                          ? <RenovationCard key={p.slug} p={p} />
                          : isPlots
                          ? <PlotLayoutCard  key={p.slug} p={p} />
                          : <ProjectCard     key={p.slug} p={p} />
                      )
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

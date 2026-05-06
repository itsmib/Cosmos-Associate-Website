import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ImageIcon,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import Navbar from "@/components/cosmos/Navbar";
import Footer from "@/components/cosmos/Footer";
import FloatingActions from "@/components/cosmos/FloatingActions";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { projectBySlug, Project } from "@/lib/projects";
import { PHONE, PHONE_DISPLAY, whatsappFor } from "@/lib/contact";

// ---------------------------------------------------------------------------
// Spec table — only renders if at least one field is populated
// ---------------------------------------------------------------------------
const SpecRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex items-baseline justify-between gap-4 sm:gap-6 py-2.5 sm:py-3 border-b border-navy/10 last:border-b-0">
    <dt className="text-[10px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] text-crimson font-medium">{label}</dt>
    <dd className="text-navy font-medium text-right text-sm sm:text-base">{value}</dd>
  </div>
);

const SpecTable = ({ p }: { p: Project }) => {
  const rows: { label: string; value: string | number }[] = [];
  if (p.price)         rows.push({ label: "Price",          value: p.price });
  if (p.plots)         rows.push({ label: "Plots / Units",  value: p.plots });
  if (p.areaSqft)      rows.push({ label: "Area",           value: p.areaSqft });
  if (p.yearStarted)   rows.push({ label: "Year Started",   value: p.yearStarted });
  if (p.yearCompleted) rows.push({ label: "Year Completed", value: p.yearCompleted });
  rows.push({ label: "Section", value: p.category });

  if (rows.length === 1 && !p.amenities) return null;

  return (
    <div className="bg-white rounded-2xl border border-navy/10 shadow-card p-5 sm:p-8">
      <div className="text-[11px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-crimson font-medium mb-4 sm:mb-5">
        Specifications
      </div>
      <dl>
        {rows.map((r) => <SpecRow key={r.label} label={r.label} value={r.value} />)}
      </dl>
      {p.amenities && p.amenities.length > 0 && (
        <div className="mt-6 sm:mt-7 pt-5 sm:pt-6 border-t border-navy/10">
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] text-crimson font-medium mb-3 sm:mb-4">
            Amenities
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
            {p.amenities.map((a) => (
              <li key={a} className="flex items-start gap-2 text-navy text-sm sm:text-base">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-crimson shrink-0" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Hero — Renovation gets a Before/After split, everything else gets a single
// full-bleed cover image. Falls back to a tinted placeholder when no images.
// ---------------------------------------------------------------------------
const Hero = ({ p }: { p: Project }) => {
  const renovation = p.category === "Renovation" && p.before && p.after;

  return (
    <section className="relative pt-20 sm:pt-24">
      <div className="container">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-sm text-navy/70 hover:text-crimson transition-smooth mt-4 sm:mt-6 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to portfolio
        </Link>
      </div>

      <div className="container">
        <div className="reveal rounded-2xl sm:rounded-3xl overflow-hidden border border-navy/10 shadow-card bg-muted">
          {renovation ? (
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="relative aspect-[4/3] sm:aspect-[3/2] lg:aspect-[16/10] lg:max-h-[55vh] overflow-hidden">
                <img src={p.before} alt={`${p.name} before`} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase bg-navy/85 text-white px-2.5 sm:px-3 py-1 rounded-full">
                  Before
                </span>
              </div>
              <div className="relative aspect-[4/3] sm:aspect-[3/2] lg:aspect-[16/10] lg:max-h-[55vh] overflow-hidden">
                <img src={p.after} alt={`${p.name} after`} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase bg-crimson text-white px-2.5 sm:px-3 py-1 rounded-full">
                  After
                </span>
              </div>
            </div>
          ) : p.cover ? (
            <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] lg:max-h-[55vh]">
              <img src={p.cover} alt={p.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] lg:max-h-[55vh] flex items-center justify-center text-navy/30">
              <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16" />
            </div>
          )}
        </div>

        <div className="reveal mt-6 sm:mt-10 mb-2 max-w-3xl">
          <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-[11px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-crimson font-medium mb-3 sm:mb-4">
            <span>{p.category}</span>
            {p.badge && (
              <>
                <span className="w-1 h-1 rounded-full bg-crimson/60" />
                <span className="bg-crimson text-white px-3 py-1 rounded-full normal-case tracking-normal text-[11px] font-medium">
                  {p.badge}
                </span>
              </>
            )}
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-navy font-semibold leading-[1.1] sm:leading-[1.05] mb-3 sm:mb-4">
            {p.name}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-crimson shrink-0" />
            <span className="text-sm sm:text-base">{p.location}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Map card — opens the property's Google Maps location in a new tab
// ---------------------------------------------------------------------------
const MapCard = ({ link, location }: { link: string; location: string }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="group bg-white rounded-2xl border border-navy/10 shadow-card overflow-hidden h-full flex flex-col hover:shadow-lift transition-smooth"
  >
    <div className="px-6 sm:px-8 pt-6 pb-4">
      <div className="text-xs uppercase tracking-[0.3em] text-crimson font-medium">Location</div>
      <p className="text-navy mt-1 text-sm sm:text-base">{location}</p>
    </div>
    <div className="relative flex-1 min-h-[200px] bg-gradient-to-br from-navy-soft via-navy/5 to-crimson/5 architectural-pattern flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.08),transparent_60%)]" />
      <div className="relative flex flex-col items-center gap-3 text-center px-6">
        <div className="w-14 h-14 rounded-full bg-crimson/10 border border-crimson/20 flex items-center justify-center group-hover:scale-110 transition-smooth">
          <MapPin className="w-7 h-7 text-crimson" />
        </div>
        <div className="text-navy font-medium text-sm sm:text-base">
          Open in Google Maps
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs text-crimson font-medium uppercase tracking-wider group-hover:gap-2.5 transition-smooth">
          Get directions
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  </a>
);

// ---------------------------------------------------------------------------
// Contact CTA strip — interpolates the property name into the WhatsApp message
// ---------------------------------------------------------------------------
const ContactStrip = ({ name }: { name: string }) => {
  const wa = whatsappFor(name);
  return (
    <div className="reveal bg-gradient-to-br from-navy to-navy-light rounded-2xl sm:rounded-3xl text-white p-6 sm:p-12 shadow-lift">
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 sm:gap-8 items-center">
        <div>
          <div className="text-[11px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-crimson-light font-medium mb-2 sm:mb-3">
            Interested in {name}?
          </div>
          <h3 className="font-serif text-2xl sm:text-4xl font-semibold leading-tight">
            Let's set up a site visit.
          </h3>
          <p className="text-white/70 mt-3 max-w-lg text-sm sm:text-base">
            Talk to our team for floor plans, payment options, or a no-obligation walkthrough — we'll have everything ready when you arrive.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
          <a
            href={`tel:${PHONE}`}
            className="inline-flex items-center justify-center gap-2 bg-white text-navy hover:bg-crimson hover:text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-full font-medium transition-smooth text-sm sm:text-base"
          >
            <Phone className="w-4 h-4" />
            <span className="truncate">{PHONE_DISPLAY}</span>
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-light text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-full font-medium transition-smooth text-sm sm:text-base"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? projectBySlug(slug) : undefined;

  // Reveal-on-scroll: re-run when the page mounts so the .reveal sections fade
  // in just like the homepage does.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("is-visible");
      });
    }, { threshold: 0.1 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [slug]);

  if (!project) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center pt-24 pb-20 architectural-pattern">
          <div className="container max-w-xl text-center">
            <div className="text-xs uppercase tracking-[0.3em] text-crimson font-medium mb-4">
              404
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-navy font-semibold mb-4">
              Project not found
            </h1>
            <p className="text-muted-foreground mb-8">
              The property you're looking for has moved, was renamed, or never existed.
              Browse the rest of our portfolio instead.
            </p>
            <Link
              to="/#projects"
              className="inline-flex items-center gap-2 bg-crimson hover:bg-crimson-light text-white px-7 py-3.5 rounded-full font-medium transition-smooth hover:shadow-crimson hover:-translate-y-0.5"
            >
              View all projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const hasSpecs =
    !!project.price ||
    !!project.plots ||
    !!project.areaSqft ||
    !!project.yearStarted ||
    !!project.yearCompleted ||
    (project.amenities && project.amenities.length > 0);
  const hasGallery = project.gallery.length > 0;
  const hasMap = !!project.mapLink;
  const hasDescription = !!project.description;
  const hasVideo = !!project.youtubeId;

  return (
    <>
      <Navbar />
      <main className="pb-16 sm:pb-24 bg-gradient-to-b from-background to-navy-soft/30 min-h-screen">
        <Hero p={project} />

        <div className="container mt-10 sm:mt-16 space-y-10 sm:space-y-16">
          {(hasSpecs || hasMap) && (
            <section className={`reveal grid gap-8 ${hasSpecs && hasMap ? "lg:grid-cols-[1.2fr_1fr]" : "lg:grid-cols-1"}`}>
              {hasSpecs && <SpecTable p={project} />}
              {hasMap && <MapCard link={project.mapLink!} location={project.location} />}
            </section>
          )}

          {hasDescription && (
            <section className="reveal">
              <div className="text-[11px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-crimson font-medium mb-3 sm:mb-4">
                About this property
              </div>
              <article className="prose prose-base sm:prose-lg max-w-none prose-headings:font-serif prose-headings:text-navy prose-h1:text-2xl sm:prose-h1:text-3xl prose-h2:text-xl sm:prose-h2:text-2xl prose-p:text-navy/80 prose-p:leading-relaxed prose-strong:text-navy prose-a:text-crimson hover:prose-a:text-crimson-light prose-li:text-navy/80 prose-blockquote:border-l-crimson prose-blockquote:text-navy/70">
                <ReactMarkdown>{project.description!}</ReactMarkdown>
              </article>
            </section>
          )}

          {hasVideo && (
            <section className="reveal">
              <div className="text-[11px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-crimson font-medium mb-3 sm:mb-4">
                Property Walkthrough
              </div>
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-navy/10 shadow-lift bg-navy aspect-video">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?rel=0`}
                  title={`${project.name} walkthrough`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </section>
          )}

          {hasGallery && (
            <section className="reveal">
              <div className="flex items-end justify-between mb-4 sm:mb-6 gap-4 flex-wrap">
                <div>
                  <div className="text-[11px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-crimson font-medium mb-1.5 sm:mb-2">
                    Gallery
                  </div>
                  <h2 className="font-serif text-xl sm:text-3xl text-navy font-semibold">
                    More views of {project.name}
                  </h2>
                </div>
                <div className="h-px flex-1 bg-navy/10 hidden sm:block min-w-[60px]" />
              </div>
              <Carousel opts={{ align: "start", loop: false }} className="w-full">
                <CarouselContent className="-ml-3 sm:-ml-4">
                  {project.gallery.map((src, i) => (
                    <CarouselItem key={i} className="pl-3 sm:pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3">
                      <div className="aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border border-navy/10 shadow-card bg-muted">
                        <img
                          src={src}
                          alt={`${project.name} — view ${i + 1}`}
                          loading="lazy"
                          className="w-full h-full object-cover hover:scale-105 transition-smooth duration-700"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            </section>
          )}

          <section className="reveal">
            <ContactStrip name={project.name} />
          </section>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
};

export default ProjectDetail;

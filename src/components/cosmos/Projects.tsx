import { projectsByCategory, ProjectCategory, Project } from "@/lib/projects";
import { ImageIcon, MapPin } from "lucide-react";

const SECTIONS: { key: ProjectCategory; title: string; subtitle: string }[] = [
  { key: "Ongoing", title: "Ongoing Projects", subtitle: "Active developments under construction" },
  { key: "Karaikal", title: "Projects in Karaikal", subtitle: "Our home ground for four decades" },
  { key: "Chennai", title: "Projects in Chennai", subtitle: "Bringing Cosmos quality to the metropolitan" },
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
          {p.category === "Other" ? "Multi-city" : p.category}
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
            const items = projectsByCategory(section.key);
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

                <div className="-mx-4 sm:mx-0">
                  <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 sm:px-0 pb-4 projects-scroll">
                    {items.length > 0
                      ? items.map((p, i) => <ProjectCard key={i} p={p} />)
                      : <ComingSoon />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Projects;

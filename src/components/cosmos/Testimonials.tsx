import { Quote, Star, BadgeCheck } from "lucide-react";

const reviews = [
  {
    name: "RIGHT CHOICE ADS",
    text: "Excellent construction quality and trustworthy real estate promoter. On-time delivery and transparent dealings. Highly recommended!",
  },
  {
    name: "Dr. Vanitha",
    text: "Professional, customer oriented services, humbled responses and uniqueness — all services done under one roof. Very pleased to have acquainted Cosmos Constructions.",
  },
  {
    name: "Arshadh Kaps",
    text: "Good job by Mr. Shareek. Work on time. I like his work.",
  },
  {
    name: "Gem Shoppe Co, Ltd",
    text: "Excellent work. Value for your money and your time.",
  },
];

const Card = ({ r }: { r: typeof reviews[0] }) => (
  <article className="bg-white border border-navy/10 rounded-2xl p-8 shadow-card hover:shadow-lift hover:-translate-y-1 transition-smooth h-full flex flex-col">
    <Quote className="w-10 h-10 text-crimson mb-4" />
    <div className="flex gap-0.5 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-gold text-gold" />
      ))}
    </div>
    <p className="text-foreground/80 leading-relaxed italic mb-6 flex-1">"{r.text}"</p>
    <div>
      <div className="font-semibold text-navy">{r.name}</div>
      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
        <BadgeCheck className="w-3.5 h-3.5" />
        Verified Google Review
      </div>
    </div>
  </article>
);

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-navy-soft/40">
      <div className="container">
        <div className="reveal text-center max-w-3xl mx-auto mb-20">
          <div className="text-crimson text-xs tracking-[0.3em] uppercase mb-4 font-medium">Client Voices</div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-navy font-semibold mb-6">
            Trusted by <em className="text-crimson font-medium">Hundreds</em> of Families
          </h2>
          <p className="text-muted-foreground text-lg">Real reviews from real Google customers.</p>
        </div>

        {/* Mobile: horizontal carousel */}
        <div className="lg:hidden -mx-6 px-6 flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4">
          {reviews.map((r, i) => (
            <div key={i} className="snap-center shrink-0 w-[85%] sm:w-[60%]">
              <Card r={r} />
            </div>
          ))}
        </div>

        {/* Desktop: 2x2 grid */}
        <div className="hidden lg:grid grid-cols-2 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="reveal">
              <Card r={r} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

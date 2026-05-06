import { FileCheck, Landmark, Home, TrendingUp } from "lucide-react";

const features = [
  {
    icon: FileCheck,
    title: "Verify Legal Status of Documents",
    desc: "Every property goes through rigorous legal scrutiny — title deeds, encumbrance certificates and DTCP / KPA / PPA approvals — all verified before you sign.",
  },
  {
    icon: Landmark,
    title: "Check for Nearby Government Projects",
    desc: "We assess and disclose proximity to upcoming infrastructure, transport corridors and government developments that lift long-term value.",
  },
  {
    icon: Home,
    title: "Evaluate Residential Development Potential",
    desc: "Detailed analysis of zoning, FSI, soil quality and building potential so you know exactly what your land can become.",
  },
  {
    icon: TrendingUp,
    title: "Assess 5-Year Property Value Growth",
    desc: "Data-backed appreciation studies — like Ruby Garden's growth from ₹4L (2017) to ₹12L (2024) — invest with foresight, not guesswork.",
  },
];

const WhyUs = () => {
  return (
    <section id="why-us" className="py-24 sm:py-32 bg-background">
      <div className="container">
        <div className="reveal text-center max-w-3xl mx-auto mb-20">
          <div className="text-crimson text-xs tracking-[0.3em] uppercase mb-4 font-medium">Why Choose Us</div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-navy font-semibold mb-6">
            The Cosmos <em className="text-crimson font-medium">Difference</em>
          </h2>
          <p className="text-muted-foreground text-lg">
            We don't just sell plots. We deliver clarity, legality and long-term value — backed by 40 years of reputation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="reveal group bg-white border border-navy/10 rounded-2xl p-8 hover:shadow-lift hover:-translate-y-1 transition-smooth"
            >
              <div className="w-14 h-14 rounded-xl bg-crimson/10 flex items-center justify-center mb-6 group-hover:bg-crimson group-hover:text-white text-crimson transition-smooth">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-navy font-semibold mb-3">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;

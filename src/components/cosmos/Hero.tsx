import logo from "@/assets/cosmos-logo.png";
import { ArrowRight, MessageCircle } from "lucide-react";
import { WHATSAPP } from "@/lib/contact";

const Hero = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden architectural-pattern"
    >
      {/* Decorative blueprint accents */}
      <div className="absolute top-32 right-[-120px] w-[420px] h-[420px] rounded-full border border-navy/10" />
      <div className="absolute top-48 right-[-60px] w-[300px] h-[300px] rounded-full border border-crimson/15" />
      <div className="absolute bottom-10 left-[-100px] w-[280px] h-[280px] rounded-full border border-navy/10" />

      <div className="container relative z-10 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <div
            className="fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy/5 text-navy text-xs tracking-[0.2em] uppercase font-medium mb-8"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-crimson" />
            Established 1985 · Karaikal
          </div>

          <h1
            className="fade-up font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[1.02] text-navy font-semibold mb-6"
            style={{ animationDelay: "0.25s" }}
          >
            Building Trust
            <br />
            <span className="italic text-crimson">Since 1985</span>
          </h1>

          <p
            className="fade-up text-lg sm:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
            style={{ animationDelay: "0.45s" }}
          >
            Premium Real Estate across Karaikal & Chennai. Four decades of integrity, DTCP-approved plots and properties that families proudly call home.
          </p>

          <div
            className="fade-up flex flex-wrap gap-4"
            style={{ animationDelay: "0.65s" }}
          >
            <button
              onClick={() => scrollTo("projects")}
              className="group inline-flex items-center gap-2 bg-crimson hover:bg-crimson-light text-white px-7 py-3.5 rounded-full font-medium transition-smooth hover:shadow-crimson hover:-translate-y-0.5"
            >
              Explore Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-smooth" />
            </button>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-navy text-navy hover:bg-navy hover:text-white px-7 py-3.5 rounded-full font-medium transition-smooth"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>
        </div>

        <div
          className="lg:col-span-5 fade-up flex justify-center"
          style={{ animationDelay: "0.05s" }}
        >
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-navy/[0.03]" />
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-crimson/5" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-navy/5" />
            <img
              src={logo}
              alt="Cosmos Associates & Builders"
              className="relative w-72 sm:w-96 h-auto animate-float"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

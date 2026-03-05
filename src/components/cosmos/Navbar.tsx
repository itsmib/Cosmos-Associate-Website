import { useEffect, useState } from "react";
import logo from "@/assets/cosmos-logo.png";
import { Menu, X } from "lucide-react";

const links = [
  { label: "About", id: "about" },
  { label: "Projects", id: "projects" },
  { label: "Why Us", id: "why-us" },
  { label: "Testimonials", id: "testimonials" },
  { label: "Contact", id: "contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 bg-background transition-smooth ${
        scrolled ? "shadow-card" : ""
      }`}
    >
      <div className="container flex items-center justify-between h-20">
        <button
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-3"
          aria-label="Cosmos Associates & Builders"
        >
          <img src={logo} alt="Cosmos Associates & Builders logo" className="h-12 w-auto" />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-serif text-lg text-navy font-bold">Cosmos</span>
            <span className="text-[10px] tracking-[0.18em] text-crimson uppercase">Associates & Builders</span>
          </div>
        </button>

        <nav className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="text-navy/80 hover:text-crimson transition-smooth text-sm font-medium tracking-wide"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("contact")}
            className="bg-crimson hover:bg-crimson-light text-white px-6 py-2.5 rounded-full text-sm font-medium transition-smooth hover:shadow-crimson hover:-translate-y-0.5"
          >
            Contact Us
          </button>
        </nav>

        <button
          className="lg:hidden text-navy"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container py-4 flex flex-col gap-3">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-left text-navy py-2 hover:text-crimson transition-smooth"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("contact")}
              className="bg-crimson text-white px-6 py-3 rounded-full text-sm font-medium mt-2"
            >
              Contact Us
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

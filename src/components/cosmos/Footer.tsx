import logo from "@/assets/cosmos-logo.png";
import { Facebook, Instagram, MapPin, Phone, Youtube } from "lucide-react";
import { SOCIALS } from "@/lib/contact";

const FOOTER_SOCIALS = [
  { href: SOCIALS.instagram, label: "Instagram", Icon: Instagram },
  { href: SOCIALS.youtube,   label: "YouTube",   Icon: Youtube   },
  { href: SOCIALS.facebook,  label: "Facebook",  Icon: Facebook  },
];

const Footer = () => {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="gradient-navy text-white pt-16 pb-8">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-12 pb-12 border-b border-white/10">
          <div>
            <div className="bg-white inline-flex p-3 rounded-xl mb-5">
              <img src={logo} alt="Cosmos Associates & Builders" className="h-16 w-auto" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">Cosmos Associates & Builders</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Karaikal's most trusted real estate name since 1985. Built on integrity, transparency and four decades of family commitment.
            </p>
            <div className="flex items-center gap-2.5 mt-5">
              {FOOTER_SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-crimson border border-white/15 hover:border-crimson flex items-center justify-center text-white/85 hover:text-white transition-smooth"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4 text-crimson-light">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/80">
              {["about", "projects", "why-us", "testimonials", "contact"].map((id) => (
                <li key={id}>
                  <button onClick={() => scrollTo(id)} className="hover:text-white transition-smooth capitalize">
                    {id.replace("-", " ")}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4 text-crimson-light">Reach Us</h4>
            <div className="space-y-3 text-sm text-white/80">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-crimson-light" />
                <span>No. 1, Royal Park, Thomas Arul St, Karaikal, Puducherry 609602</span>
              </div>
              <a href="tel:+919944348827" className="flex gap-3 hover:text-white transition-smooth">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-crimson-light" />
                <span>+91 99443 48827</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-crimson-light">© 2025 Cosmos Associates and Builders. All rights reserved.</p>
          <p className="text-white/50">Building trust since 1985 · Karaikal, India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

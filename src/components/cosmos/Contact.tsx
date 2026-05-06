import { Phone, MessageCircle, MapPin, ExternalLink } from "lucide-react";
import { PHONE, PHONE_DISPLAY, WHATSAPP, OFFICE_MAPS_URL as MAPS_URL } from "@/lib/contact";

const Contact = () => {
  return (
    <section id="contact" className="py-24 sm:py-32 bg-gradient-to-b from-navy-soft/40 to-background">
      <div className="container">
        <div className="reveal text-center max-w-3xl mx-auto mb-16">
          <div className="text-crimson text-xs tracking-[0.3em] uppercase mb-4 font-medium">Get In Touch</div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-navy font-semibold mb-6">
            Let's Find Your <em className="text-crimson font-medium">Next Property</em>
          </h2>
          <p className="text-muted-foreground text-lg">
            Reach out for site visits, project enquiries or a no-obligation consultation.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact card */}
          <div className="reveal bg-white border border-navy/10 rounded-2xl p-8 sm:p-10 shadow-card hover:shadow-lift transition-smooth">
            <div className="text-xs uppercase tracking-[0.3em] text-crimson font-medium mb-3">Call or WhatsApp</div>
            <a
              href={`tel:${PHONE}`}
              className="font-serif text-4xl sm:text-5xl text-navy font-bold hover:text-crimson transition-smooth inline-flex items-center gap-3 group"
            >
              <Phone className="w-8 h-8 text-crimson" />
              {PHONE_DISPLAY}
            </a>
            <p className="text-muted-foreground mt-3 mb-8">
              Tap to call directly. Available 9 AM – 8 PM, all days.
            </p>

            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-crimson hover:bg-crimson-light text-white px-7 py-3.5 rounded-full font-medium transition-smooth hover:shadow-crimson hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>

            <div className="border-t border-border mt-10 pt-8">
              <div className="text-xs uppercase tracking-[0.3em] text-crimson font-medium mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Visit Our Office
              </div>
              <p className="text-navy text-lg leading-relaxed">
                No. 1, Royal Park, Thomas Arul St,
                <br />
                Karaikal, Puducherry 609602
              </p>
            </div>
          </div>

          {/* Map */}
          <div className="reveal rounded-2xl overflow-hidden border border-navy/10 shadow-card hover:shadow-lift transition-smooth bg-white">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative group"
              aria-label="Open in Google Maps"
            >
              <iframe
                title="Cosmos Associates & Builders office location"
                src="https://www.google.com/maps?q=No.+1+Royal+Park,+Thomas+Arul+St,+Karaikal,+Puducherry+609602&output=embed"
                className="w-full h-[480px] border-0 pointer-events-none"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-full text-sm font-medium text-navy shadow-lift inline-flex items-center gap-2 group-hover:bg-crimson group-hover:text-white transition-smooth">
                Open in Maps <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

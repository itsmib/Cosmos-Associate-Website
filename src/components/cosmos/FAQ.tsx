import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do I verify property documents?",
    a: "Every Cosmos property comes with a complete verified documentation pack — title deed, parent documents, encumbrance certificate, DTCP / KPA / PPA approvals and tax receipts. Our team walks you through each document and you are welcome to engage your own legal advisor at any stage.",
  },
  {
    q: "What areas do you operate in?",
    a: "We are headquartered in Karaikal with active projects across Karaikal and select tier-2 cities. Our team can advise on suitable plots and developments based on your investment or residential goals.",
  },
  {
    q: "Are your plots DTCP / KPA / PPA approved?",
    a: "Yes. All Cosmos plotted developments are DTCP / KPA / PPA approved with clean titles. Approval certificates and layout plans are shared up-front before any commitment.",
  },
  {
    q: "How do I book a site visit?",
    a: "Simply call or WhatsApp us at +91 99443 48827. We arrange complimentary site visits at a time convenient to you, with full property documentation available on site.",
  },
  {
    q: "What makes Cosmos Associates different from other builders?",
    a: "Forty years of unbroken reputation, transparent dealings, legally verified properties, BNI India membership and a family-led commitment to integrity. We do not just sell plots — we earn trust that lasts generations.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 sm:py-32 bg-background">
      <div className="container max-w-3xl">
        <div className="reveal text-center mb-16">
          <div className="text-crimson text-xs tracking-[0.3em] uppercase mb-4 font-medium">FAQ</div>
          <h2 className="font-serif text-4xl sm:text-5xl text-navy font-semibold mb-4">
            Questions, <em className="text-crimson font-medium">Answered</em>
          </h2>
        </div>

        <div className="reveal">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-white border border-navy/10 rounded-xl px-6 hover:shadow-card transition-smooth [&_svg.faq-chev]:text-crimson"
              >
                <AccordionTrigger className="text-left font-serif text-lg text-navy font-semibold hover:no-underline py-5">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

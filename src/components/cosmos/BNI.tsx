import { Network } from "lucide-react";

const BNI = () => {
  return (
    <section id="bni" className="py-16 bg-background">
      <div className="container">
        <div className="reveal max-w-4xl mx-auto bg-white border border-navy/10 rounded-2xl p-8 sm:p-10 shadow-card flex flex-col sm:flex-row items-center gap-8 hover:shadow-lift transition-smooth">
          <div className="shrink-0 w-24 h-24 rounded-2xl bg-crimson/10 flex items-center justify-center text-crimson">
            <Network className="w-10 h-10" />
            <span className="sr-only">BNI India</span>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-xs tracking-[0.3em] text-crimson uppercase font-medium mb-2">
              Networking · Trust · Referrals
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-navy font-semibold mb-2">
              Proud Member of BNI India
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Mohamed Sharik is an active BNI India member — part of the world's largest business networking organization. A mark of credibility, ethics and accountability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BNI;

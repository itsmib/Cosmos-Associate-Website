import sharik from "@/assets/md-sharik.jpg";
import founder from "@/assets/founder-ismail-maricar.jpg";

const About = () => {
  return (
    <section id="about" className="relative py-24 sm:py-32 overflow-hidden bg-background">
      {/* watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
        <span className="font-serif text-[18vw] lg:text-[14rem] font-black text-navy/[0.035] tracking-tighter">
          EST. 1985
        </span>
      </div>

      <div className="container relative">
        <div className="reveal text-center max-w-3xl mx-auto mb-20">
          <div className="text-crimson text-xs tracking-[0.3em] uppercase mb-4 font-medium">Our Legacy</div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-navy mb-6 font-semibold">
            A Family Tradition of <em className="text-crimson font-medium">Trust</em>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Two generations. One commitment — to deliver real estate that families are proud to own.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 relative">
          {/* Vertical divider */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-crimson/40 to-transparent" />

          {/* Founder */}
          <div className="reveal">
            <div className="text-xs uppercase tracking-[0.3em] text-crimson font-medium mb-3">The Founder · Visionary Chairman</div>
            <h3 className="font-serif text-3xl sm:text-4xl text-navy font-semibold mb-2">
              Mr. Y. Ismail Maricar
            </h3>
            <div className="text-sm text-muted-foreground italic mb-6">Founder · Established Cosmos in 1985</div>

            <div className="text-foreground/80 leading-relaxed">
              <div className="relative shrink-0 float-none sm:float-left sm:mr-6 sm:mb-4 mb-6 w-max">
                <div className="absolute -inset-2 rounded-2xl border-2 border-crimson/40" />
                <div className="absolute -bottom-2 -right-2 w-full h-full rounded-2xl bg-navy/10" />
                <img
                  src={founder}
                  alt="Mr. Y. Ismail Maricar, Founder of Cosmos Associates & Builders"
                  className="relative w-44 h-44 sm:w-48 sm:h-48 object-cover rounded-2xl border-4 border-white shadow-lift"
                />
              </div>
              <p className="mb-4">
                In 1985, our visionary chairman established <strong className="text-navy">Cosmos</strong>, setting the stage for four decades of trusted real estate in Karaikal and beyond. What began as a modest practice rooted in integrity has grown into a name families across the region rely on when they think of home.
              </p>
              <p className="mb-4">
                His approach was simple and uncompromising — deliver every plot and every structure with the same care he would expect for his own family. That standard still defines how Cosmos works today.
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-crimson shrink-0" />
                  <span>During his presidential tenure, the iconic <strong className="text-navy">Chamber of Commerce building</strong> in Karaikal was constructed under his enormous effort</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-crimson shrink-0" />
                  <span>Member of the <strong className="text-navy">Karaikal Peace Committee</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-crimson shrink-0" />
                  <span>Chairman of the <strong className="text-navy">Pondicherry Hajj Committee</strong></span>
                </li>
              </ul>
              <p className="mt-4">
                Four decades on, his values — honesty, patience and a genuine regard for every customer — remain the foundation every Cosmos project is built on.
              </p>
              <div className="clear-both" />
            </div>
          </div>

          {/* MD */}
          <div className="reveal lg:pl-4">
            <div className="text-xs uppercase tracking-[0.3em] text-crimson font-medium mb-3">Managing Director</div>
            <h3 className="font-serif text-3xl sm:text-4xl text-navy font-semibold mb-2">
              Mohamed Sharik
            </h3>
            <div className="text-sm text-muted-foreground italic mb-6">MD · BNI India Member</div>

            <div className="text-foreground/80 leading-relaxed">
              <div className="relative shrink-0 float-none sm:float-left sm:mr-6 sm:mb-4 mb-6 w-max">
                <div className="absolute -inset-2 rounded-2xl border-2 border-crimson/40" />
                <div className="absolute -bottom-2 -right-2 w-full h-full rounded-2xl bg-navy/10" />
                <img
                  src={sharik}
                  alt="Mohamed Sharik, Managing Director"
                  className="relative w-44 h-44 sm:w-48 sm:h-48 object-cover rounded-2xl border-4 border-white shadow-lift"
                />
              </div>
              <p className="mb-4">
                Mohamed Sharik continues the family tradition as Managing Director, bringing modern practices, technology and an unwavering customer focus to every project. Under his stewardship, Cosmos has embraced digital documentation, transparent pricing and faster approvals — while keeping the personal relationships that have always defined the brand.
              </p>
              <p className="mb-4">
                As an active member of <strong className="text-navy">BNI India</strong>, he is part of the world's largest business networking organization — a testament to his commitment to ethical, referral-driven business. His membership keeps Cosmos connected to a trusted circle of architects, legal advisors and financial partners who support every buyer's journey.
              </p>
              <p>
                His vision for the next chapter is clear — to take the trust built over four decades and pair it with thoughtfully designed communities, sustainable construction and a buying experience that feels as reassuring as the Cosmos name has always been.
              </p>
              <div className="clear-both" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

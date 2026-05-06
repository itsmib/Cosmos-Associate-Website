import { Star, ExternalLink, PenLine } from "lucide-react";
import { GOOGLE_REVIEWS_URL } from "@/lib/contact";

// Aggregate snapshot card. The numbers below are display values — Google's
// embeddable review widgets need an API key + Place ID, so we show a static
// summary that links out to the live GBP listing. Update the rating/count
// fields when the Google profile changes.
const SUMMARY = {
  rating: 5.0,
  count: "20+",
};

const GoogleReviewsBoard = () => {
  return (
    <section
      id="google-reviews"
      className="py-20 sm:py-24 bg-background"
    >
      <div className="container max-w-5xl">
        <div className="reveal bg-white border border-navy/10 rounded-3xl shadow-card overflow-hidden">
          <div className="grid md:grid-cols-[1.1fr_1fr]">
            <div className="p-8 sm:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-crimson text-xs tracking-[0.3em] uppercase mb-4 font-medium">
                <GoogleGlyph className="w-4 h-4" />
                Google Reviews
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-navy font-semibold mb-4 leading-tight">
                Rated <em className="text-crimson font-medium not-italic">{SUMMARY.rating}★</em> on Google
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Read every verified review from Cosmos clients on our official
                Google Business profile — and share your own experience to
                help fellow buyers.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={GOOGLE_REVIEWS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-crimson hover:bg-crimson-light text-white px-6 py-3 rounded-full font-medium transition-smooth hover:shadow-crimson hover:-translate-y-0.5"
                >
                  See all reviews
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={GOOGLE_REVIEWS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-navy text-navy hover:bg-navy hover:text-white px-6 py-3 rounded-full font-medium transition-smooth"
                >
                  <PenLine className="w-4 h-4" />
                  Write a review
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-navy-soft/60 via-background to-crimson/5 p-8 sm:p-12 flex flex-col items-center justify-center text-center border-t md:border-t-0 md:border-l border-navy/10">
              <div className="flex items-center gap-2 mb-3">
                <GoogleGlyph className="w-7 h-7" />
                <span className="font-serif text-lg text-navy font-semibold">Google</span>
              </div>
              <div className="font-serif text-6xl sm:text-7xl text-navy font-bold leading-none mb-3">
                {SUMMARY.rating}
              </div>
              <div className="flex gap-1 mb-3" aria-label={`${SUMMARY.rating} out of 5 stars`}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Based on <span className="font-semibold text-navy">{SUMMARY.count}</span> verified Google reviews
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Inline brand glyph — avoids pulling in a logo asset just for one mark.
const GoogleGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

export default GoogleReviewsBoard;

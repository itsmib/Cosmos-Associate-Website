import { useRef, useState } from "react";
import { Play } from "lucide-react";

// Two hero ad videos. Drop the files at the paths below (and optionally the
// matching poster JPGs for the still frame). Paths are relative to the site
// root, so Vite serves them as-is from `public/`.
type Ad = { src: string; poster: string; title: string; tagline: string };

const ADS: Ad[] = [
  {
    src: "/cosmos-ad-1.mp4",
    poster: "/cosmos-ad-poster-1.jpg",
    title: "The Cosmos Story",
    tagline: "Forty years of building trust, told in a minute.",
  },
  {
    src: "/cosmos-ad-2.mp4",
    poster: "/cosmos-ad-poster-2.jpg",
    title: "Building Lifting & Shifting",
    tagline: "An exclusive Cosmos service — relocate or raise an existing structure without demolition.",
  },
];

const VideoCard = ({ ad }: { ad: Ad }) => {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const el = ref.current;
    if (!el) return;
    el.play();
    setPlaying(true);
  };

  return (
    <div className="reveal">
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lift bg-navy aspect-video">
        <video
          ref={ref}
          src={ad.src}
          poster={ad.poster}
          controls={playing}
          playsInline
          preload="metadata"
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          className="w-full h-full object-cover"
        />

        {!playing && (
          <button
            type="button"
            onClick={play}
            aria-label={`Play ${ad.title}`}
            className="absolute inset-0 group flex items-center justify-center bg-navy/40 hover:bg-navy/30 transition-smooth"
          >
            <span className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-crimson/95 text-white flex items-center justify-center shadow-crimson group-hover:scale-110 transition-smooth">
              <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1 fill-white" />
            </span>
          </button>
        )}
      </div>
      <div className="mt-3 sm:mt-4 text-center sm:text-left px-1">
        <h3 className="font-serif text-lg sm:text-xl text-navy font-semibold leading-snug">{ad.title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">{ad.tagline}</p>
      </div>
    </div>
  );
};

const VideoShowcase = () => {
  return (
    <section id="watch" className="py-16 sm:py-24 lg:py-32 bg-navy-soft/40">
      <div className="container max-w-6xl">
        <div className="reveal text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="text-crimson text-[11px] sm:text-xs tracking-[0.3em] uppercase mb-3 sm:mb-4 font-medium">
            Watch
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-navy font-semibold mb-3 sm:mb-4">
            The Cosmos <em className="text-crimson font-medium">Story</em>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
            Two short films — who we are, and what we build.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          {ADS.map((ad) => (
            <VideoCard key={ad.src} ad={ad} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;

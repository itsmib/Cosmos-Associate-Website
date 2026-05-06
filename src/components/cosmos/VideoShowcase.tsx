import { useRef, useState } from "react";
import { Play } from "lucide-react";

// Single hero ad video. Drop the file at `public/cosmos-ad.mp4` (and
// optionally `public/cosmos-ad-poster.jpg` for the still frame). The path
// is relative to the site root so Vite serves it as-is.
const VIDEO_SRC = "/cosmos-ad.mp4";
const VIDEO_POSTER = "/cosmos-ad-poster.jpg";

const VideoShowcase = () => {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const el = ref.current;
    if (!el) return;
    el.play();
    setPlaying(true);
  };

  return (
    <section
      id="watch"
      className="py-24 sm:py-32 bg-navy-soft/40"
    >
      <div className="container max-w-5xl">
        <div className="reveal text-center max-w-2xl mx-auto mb-12">
          <div className="text-crimson text-xs tracking-[0.3em] uppercase mb-4 font-medium">
            Watch
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl text-navy font-semibold mb-4">
            The Cosmos <em className="text-crimson font-medium">Story</em>
          </h2>
          <p className="text-muted-foreground text-lg">
            Forty years of building trust, told in a minute.
          </p>
        </div>

        <div className="reveal relative rounded-3xl overflow-hidden shadow-lift bg-navy aspect-video">
          <video
            ref={ref}
            src={VIDEO_SRC}
            poster={VIDEO_POSTER}
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
              aria-label="Play Cosmos Builders ad"
              className="absolute inset-0 group flex items-center justify-center bg-navy/40 hover:bg-navy/30 transition-smooth"
            >
              <span className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-crimson/95 text-white flex items-center justify-center shadow-crimson group-hover:scale-110 transition-smooth">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-white" />
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;

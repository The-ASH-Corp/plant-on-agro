"use client";

import { Counter } from "@/components/ui/Counter";

interface HeroProps {
  openPlant: () => void;
  goImpact: () => void;
}

export function Hero({ openPlant, goImpact }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* BG image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1568241640298-1adf2974314c?w=1920&h=1080&fit=crop&auto=format"
          alt="Aerial forest canopy"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(170deg, rgba(23,51,36,0.78) 0%, rgba(23,51,36,0.55) 50%, rgba(23,51,36,0.82) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8 tracking-widest uppercase"
          style={{
            background: "rgba(82,183,136,0.18)",
            color: "#95d5b2",
            border: "1px solid rgba(82,183,136,0.3)",
          }}
        >
          🌱 You Plant. We Grow.
        </div>

        <h1
          style={{ fontFamily: "var(--font-display)", lineHeight: 1.1 }}
          className="text-white text-5xl md:text-7xl mb-6"
        >
          Plant a Tree.
          <br />
          <em className="text-[#95d5b2] not-italic">Create a Future.</em>
        </h1>

        <p className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          Choose a tree, plant it through PlantOn Agrow, and watch your impact grow — with real photos, location tracking, and a certificate in your name.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <button
            onClick={openPlant}
            className="px-8 py-4 rounded-full font-semibold text-base text-white transition-all duration-200 hover:scale-105 hover:shadow-2xl"
            style={{
              background: "linear-gradient(135deg,#52b788,#1e4433)",
              boxShadow: "0 8px 32px rgba(82,183,136,0.35)",
            }}
          >
            Plant a Tree
          </button>
          <button
            onClick={goImpact}
            className="px-8 py-4 rounded-full font-semibold text-base transition-all duration-200 hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.12)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            Explore Our Impact
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { target: 25000, suffix: "+", label: "Trees Planted" },
            { target: 12500, suffix: "+", label: "People Participated" },
            { target: 150, suffix: "+", label: "Plantation Projects" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div
                style={{ fontFamily: "var(--font-display)", color: "#95d5b2" }}
                className="text-3xl md:text-4xl mb-1"
              >
                <Counter target={s.target} suffix={s.suffix} />
              </div>
              <div className="text-white/60 text-xs md:text-sm font-medium tracking-wide">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-xs">
        <span>Scroll</span>
        <div className="w-px h-8 bg-white/30 animate-pulse" />
      </div>
    </section>
  );
}

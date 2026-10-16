"use client";

import { Counter } from "@/components/ui/Counter";
import { useScroll, useTransform, motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { useHydratedStore } from "@/store/hooks/use-hydrated-store";

import { HeroSectionContent } from "@/services/landing-page/landing-page.service";

interface HeroProps {
  openPlant: () => void;
  goImpact: () => void;
  content?: HeroSectionContent;
}

export function Hero({ openPlant, goImpact, content }: HeroProps) {
  const user = useHydratedStore(useAuthStore, (s) => s.user);
  const isAuthenticated = useHydratedStore(useAuthStore, (s) => s.isAuthenticated);
  const { scrollY } = useScroll();

  const badgeText = content?.badge || "🌱 You Plant. We Grow.";
  const headline1 = content?.headlinePart1 || "Plant a Tree.";
  const headlineHighlight = content?.headlineHighlight || "Create a Future.";
  const description =
    content?.description ||
    "Choose a tree, plant it through PlantOn agro, and watch your impact grow — with real photos, location tracking, and a certificate in your name.";
  const primaryCta = content?.primaryCtaText || "Plant a Tree";
  const secondaryCta = content?.secondaryCtaText || "Explore Our Impact";
  const bgImg =
    content?.bgImageUrl ||
    "https://images.unsplash.com/photo-1568241640298-1adf2974314c?w=1920&h=1080&fit=crop&auto=format";
  const stats = content?.stats && content.stats.length > 0
    ? content.stats
    : [
        { target: 25000, suffix: "+", label: "Trees Planted" },
        { target: 12500, suffix: "+", label: "People Participated" },
        { target: 150, suffix: "+", label: "Plantation Projects" },
      ];

  const bgY = useTransform(scrollY, [0, 1000], [0, 300]);
  const textY = useTransform(scrollY, [0, 1000], [0, 100]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.25]);
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-between pt-28 pb-10 sm:pb-12 md:pt-36 md:pb-16 overflow-hidden">
      {/* BG image */}
      <motion.div className="absolute inset-0">
        <motion.img
          src={bgImg}
          alt="Aerial forest canopy"
          className="w-full h-full object-cover"
          style={{ y: bgY }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(170deg, rgba(23,51,36,0.78) 0%, rgba(23,51,36,0.55) 50%, rgba(23,51,36,0.82) 100%)",
            y: textY,
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center my-auto">
        {isAuthenticated && user ? (
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 sm:mb-8"
            style={{
              background: "rgba(82,183,136,0.22)",
              color: "#95d5b2",
              border: "1px solid rgba(82,183,136,0.45)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-[#52b788] animate-pulse"></span>
            <span>Welcome, {user.name}!</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-200 border border-emerald-400/40">
              {user.role === "admin" ? "Admin Mode" : "Buyer Mode • Logged In"}
            </span>
          </div>
        ) : (
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 sm:mb-8 tracking-widest uppercase"
            style={{
              background: "rgba(82,183,136,0.18)",
              color: "#95d5b2",
              border: "1px solid rgba(82,183,136,0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            {badgeText}
          </div>
        )}

        <h1
          style={{ fontFamily: "var(--font-display)", lineHeight: 1.1 }}
          className="text-white text-4xl sm:text-5xl md:text-7xl mb-6"
        >
          {headline1}
          <br />
          <em className="text-[#95d5b2] not-italic">{headlineHighlight}</em>
        </h1>

        <p className="text-white/75 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 font-light leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 sm:mb-16">
          <button
            id="hero-plant-btn"
            onClick={openPlant}
            className="px-8 py-4 rounded-full font-semibold text-base text-white transition-all duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer"
            style={{
              background: "linear-gradient(135deg,#52b788,#1e4433)",
              boxShadow: "0 8px 32px rgba(82,183,136,0.35)",
            }}
          >
            {primaryCta}
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
            {secondaryCta}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto mb-14 sm:mb-16 md:mb-20">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div
                style={{ fontFamily: "var(--font-display)", color: "#95d5b2" }}
                className="text-2xl sm:text-3xl md:text-4xl mb-1"
              >
                <Counter target={s.target} suffix={s.suffix} />
              </div>
              <div className="text-white/60 text-[11px] sm:text-xs md:text-sm font-medium tracking-wide">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="relative z-10 mt-6 sm:mt-8 mb-2 sm:mb-4 flex flex-col items-center gap-2 text-white/40 text-xs shrink-0">
        <span>Scroll</span>

        <div className="animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white/70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Counter } from "@/components/ui/Counter";

export function ImpactSection() {
  const stats = [
    { icon: "🌳", value: 25000, suffix: "+", label: "Trees Planted", color: "#52b788" },
    { icon: "🌍", value: 312, suffix: " MT", label: "CO₂ Impact Offset", color: "#95d5b2" },
    { icon: "🌱", value: 48, suffix: " acres", label: "Green Area Created", color: "#52b788" },
    { icon: "👥", value: 12500, suffix: "+", label: "People Participated", color: "#95d5b2" },
    { icon: "🏢", value: 87, suffix: "+", label: "Companies Onboard", color: "#52b788" },
  ];

  return (
    <section
      id="impact"
      className="py-28 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #173324 0%, #1e4433 60%, #0f2318 100%)" }}
    >
      {/* Decorative circles */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
        style={{
          background: "radial-gradient(circle, #52b788, transparent)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-5"
        style={{
          background: "radial-gradient(circle, #95d5b2, transparent)",
          transform: "translate(-30%, 30%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[#52b788] text-sm font-semibold tracking-widest uppercase mb-3">
            Collective Action
          </p>
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-white text-4xl md:text-6xl mb-4"
          >
            Your Impact Is Growing.
          </h2>
          <p className="text-white/60 max-w-lg mx-auto text-lg">
            Every tree planted creates a ripple — cleaner air, cooler ground, and a living legacy.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-20">
          {stats.map((s) => (
            <div
              key={s.label}
              className="text-center p-6 rounded-2xl transition-transform duration-300 hover:-translate-y-1"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(82,183,136,0.15)",
              }}
            >
              <div className="text-3xl mb-3">{s.icon}</div>
              <div
                style={{ fontFamily: "var(--font-display)", color: s.color }}
                className="text-3xl md:text-4xl mb-1"
              >
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-white/50 text-xs font-medium leading-snug mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Project highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              img: "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=600&h=400&fit=crop&auto=format",
              title: "Western Ghats Restoration",
              trees: "8,200 trees",
              region: "Maharashtra",
            },
            {
              img: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600&h=400&fit=crop&auto=format",
              title: "Urban School Forest",
              trees: "3,400 trees",
              region: "Pune",
            },
            {
              img: "https://images.unsplash.com/photo-1457530378978-8bac673b8062?w=600&h=400&fit=crop&auto=format",
              title: "Deccan Dry Forest Patch",
              trees: "5,600 trees",
              region: "Aurangabad",
            },
          ].map((p) => (
            <div
              key={p.title}
              className="rounded-2xl overflow-hidden group"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(82,183,136,0.1)",
              }}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 50%, rgba(23,51,36,0.85))",
                  }}
                />
              </div>
              <div className="p-5">
                <h3 className="text-white font-semibold mb-1">{p.title}</h3>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#52b788] font-medium">{p.trees}</span>
                  <span className="text-white/50">📍 {p.region}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

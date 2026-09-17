export function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: "🌳",
      title: "Choose Your Tree",
      desc: "Browse dozens of native, fruit, timber, and medicinal species. Find the tree that speaks to you.",
    },
    {
      num: "02",
      icon: "📋",
      title: "Choose Your Plan",
      desc: "Individual, student, family, occasion, or corporate — every milestone deserves roots.",
    },
    {
      num: "03",
      icon: "🤲",
      title: "We Plant It",
      desc: "Our expert plantation team handles the fieldwork at verified sites across India.",
    },
    {
      num: "04",
      icon: "📸",
      title: "Watch It Grow",
      desc: "Track your tree with geo-tagged photos, growth milestones, and a digital certificate.",
    },
  ];

  return (
    <section id="how-it-works" className="py-28" style={{ background: "#fff" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[#2d6a4f] text-sm font-semibold tracking-widest uppercase mb-3">
            Simple Process
          </p>
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-[#173324] text-4xl md:text-5xl"
          >
            How PlantOn Agrow Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connector line */}
          <div
            className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-px"
            style={{ background: "linear-gradient(90deg, #52b788, #95d5b2, #52b788)" }}
          />

          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center group">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-6 relative z-10 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: "linear-gradient(135deg,#f0faf4,#d8f3e8)",
                  border: "2px solid #52b788",
                  boxShadow: "0 4px 20px rgba(82,183,136,0.2)",
                }}
              >
                {step.icon}
              </div>
              <span className="text-xs font-bold tracking-widest text-[#52b788] mb-2">
                STEP {step.num}
              </span>
              <h3 className="text-[#173324] font-semibold text-lg mb-3">{step.title}</h3>
              <p className="text-[#4a6557] text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

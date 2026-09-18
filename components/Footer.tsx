import Image from "next/image";
import Logo from "../public/Screenshot_From_2026-09-17_15-39-39-removebg-preview.png";

interface FooterProps {
  openPlant: () => void;
}

export function Footer({ openPlant }: FooterProps) {
  return (
    <footer style={{ background: "#0f2318" }}>
      {/* CTA band */}
      <div
        className="py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg,#173324,#1e4433)" }}
      >
        <p className="text-[#52b788] text-sm font-semibold tracking-widest uppercase mb-3">
          Join the Movement
        </p>
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="text-white text-4xl md:text-5xl mb-6"
        >
          Plant Today.
          <br />
          <em className="not-italic text-[#95d5b2]">Grow Tomorrow.</em>
        </h2>
        <p className="text-white/60 max-w-lg mx-auto mb-10">
          Thousands of individuals, families, and companies have already started
          their green journey. Yours begins with one tree.
        </p>
        <button
          onClick={openPlant}
          className="px-10 py-4 rounded-full font-semibold text-base text-white transition-all duration-200 hover:scale-105"
          style={{
            background: "linear-gradient(135deg,#52b788,#2d6a4f)",
            boxShadow: "0 8px 32px rgba(82,183,136,0.3)",
          }}
        >
          Plant a Tree Today
        </button>
      </div>

      {/* Footer links */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src={Logo}
                alt="Logo"
                width={180}
                height={180}
                className="w-auto h-12 object-contain"
              />
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              You Plant. We Grow. Building a greener India, one tree at a time.
            </p>
          </div>
          {[
            {
              title: "Platform",
              links: [
                "Plant a Tree",
                "Our Trees",
                "How It Works",
                "Pricing",
                "Track My Tree",
              ],
            },
            {
              title: "Company",
              links: ["About Us", "Our Projects", "Impact", "Blog", "Careers"],
            },
            {
              title: "Connect",
              links: [
                "Contact Us",
                "Corporate / CSR",
                "Partner with Us",
                "Press",
                "FAQs",
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white/80 font-semibold text-sm mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-white/40 text-sm hover:text-white/70 transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-white/30 text-xs">
            © 2026 PlantOn Agrow. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            Made with 🌱 for a greener planet
          </p>
        </div>
      </div>
    </footer>
  );
}

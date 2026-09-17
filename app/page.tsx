"use client";

import { useState } from "react";
import { Section } from "@/types";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { ExploreTrees } from "@/components/ExploreTrees";
import { ImpactSection } from "@/components/ImpactSection";
import { CertificateSection } from "@/components/CertificateSection";
import { Footer } from "@/components/Footer";
import { PlantFlow } from "@/components/PlantFlow";

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [plantOpen, setPlantOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleNav = (s: Section) => {
    setActiveSection(s);
    if (s === "plant") {
      setPlantOpen(true);
      return;
    }
    const map: Partial<Record<Section, string>> = {
      "how-it-works": "how-it-works",
      trees: "trees",
      impact: "impact",
      home: "home",
    };
    const id = map[s];
    if (id) scrollTo(id);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--color-cream)" }}>
      <Nav
        active={activeSection}
        setActive={handleNav}
        openPlant={() => setPlantOpen(true)}
      />

      <main>
        <div id="home">
          <Hero
            openPlant={() => setPlantOpen(true)}
            goImpact={() => scrollTo("impact")}
          />
        </div>
        <HowItWorks />
        <ExploreTrees openPlant={() => setPlantOpen(true)} />
        <ImpactSection />
        <CertificateSection />
      </main>

      <Footer openPlant={() => setPlantOpen(true)} />

      {plantOpen && <PlantFlow onClose={() => setPlantOpen(false)} />}
    </div>
  );
}

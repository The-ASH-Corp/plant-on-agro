"use client";

import { useState, useEffect } from "react";
import { Section } from "@/types";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { ImpactSection } from "@/components/ImpactSection";
import { CertificateSection } from "@/components/CertificateSection";
import { Footer } from "@/components/Footer";
import { PlantFlow } from "@/components/PlantFlow";
import {
  landingPageService,
  LandingPageContent,
  DEFAULT_LANDING_PAGE_CONTENT,
} from "@/services/landing-page/landing-page.service";

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [plantOpen, setPlantOpen] = useState(false);
  const [cmsContent, setCmsContent] = useState<LandingPageContent>(DEFAULT_LANDING_PAGE_CONTENT);

  useEffect(() => {
    let isMounted = true;
    async function loadLandingPageContent() {
      try {
        const res = await landingPageService.get();
        if (isMounted && res.data) {
          setCmsContent(res.data);
        }
      } catch (err) {
        console.warn("Using fallback landing page data:", err);
      }
    }
    loadLandingPageContent();
    return () => {
      isMounted = false;
    };
  }, []);

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
        {cmsContent.hero?.isEnabled !== false && (
          <div id="home">
            <Hero
              openPlant={() => setPlantOpen(true)}
              goImpact={() => scrollTo("impact")}
              content={cmsContent.hero}
            />
          </div>
        )}

        {cmsContent.howItWorks?.isEnabled !== false && (
          <HowItWorks content={cmsContent.howItWorks} />
        )}

        {/* <ExploreTrees openPlant={() => setPlantOpen(true)} /> */}

        {cmsContent.impact?.isEnabled !== false && (
          <ImpactSection content={cmsContent.impact} />
        )}

        {cmsContent.certificate?.isEnabled !== false && (
          <CertificateSection content={cmsContent.certificate} />
        )}
      </main>

      <Footer
        openPlant={() => setPlantOpen(true)}
        content={cmsContent.footer}
      />

      {plantOpen && <PlantFlow onClose={() => setPlantOpen(false)} />}
    </div>
  );
}

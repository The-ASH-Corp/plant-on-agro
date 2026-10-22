"use client";

import { useState, useEffect } from "react";
import { Section } from "@/types";
import { Nav, Footer } from "@/components/layout";
import {
  Hero,
  HowItWorks,
  ExploreTrees,
  ExperienceSection,
  ImpactSection,
  CertificateSection,
} from "@/components/landing";

import { HeroLiveStats } from "@/components/landing/Hero";
import { ImpactLiveStats, ImpactProjectItem } from "@/components/landing/ImpactSection";
import { SampleTreeCertificate } from "@/components/landing/CertificateSection";
import { PlantFlow } from "@/components/plant-flow";
import {
  landingPageService,
  LandingPageContent,
  DEFAULT_LANDING_PAGE_CONTENT,
} from "@/services/landing-page/landing-page.service";
import { treeInstanceService, BackendTreeInstance } from "@/services/tree-instances/tree-instance.service";
import { treeVarietyService, BackendTreeVariety } from "@/services/tree-varieties/tree-variety.service";
import { adoptionPlanService } from "@/services/adoption-plans/adoption-plan.service";
import { useAuthStore } from "@/store/auth.store";
import { useHydratedStore } from "@/store/hooks/use-hydrated-store";

const RESERVE_METADATA: Record<string, { region: string; img: string }> = {
  "Western Ghats, Maharashtra": {
    region: "Maharashtra",
    img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
  },
  "Western Ghats Ecological Corridor, MH": {
    region: "Maharashtra",
    img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
  },
  "Nashik Valley, Maharashtra": {
    region: "Maharashtra",
    img: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&h=400&fit=crop&auto=format",
  },
  "Satara Plateau, Maharashtra": {
    region: "Maharashtra",
    img: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&h=400&fit=crop&auto=format",
  },
  "Nagpur Forest Zone": {
    region: "Vidarbha, MH",
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=400&fit=crop&auto=format",
  },
  "Aurangabad Green Belt": {
    region: "Marathwada, MH",
    img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&h=400&fit=crop&auto=format",
  },
  "Pune Hills, Maharashtra": {
    region: "Pune, MH",
    img: "https://images.unsplash.com/photo-1511497584788-87676104235f?w=600&h=400&fit=crop&auto=format",
  },
};

export default function App() {
  const user = useHydratedStore(useAuthStore, (s) => s.user);
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [plantOpen, setPlantOpen] = useState(false);
  const [cmsContent, setCmsContent] = useState<LandingPageContent>(DEFAULT_LANDING_PAGE_CONTENT);

  // Live DB states
  const [heroLiveStats, setHeroLiveStats] = useState<HeroLiveStats | undefined>();
  const [impactLiveStats, setImpactLiveStats] = useState<ImpactLiveStats | undefined>();
  const [liveProjects, setLiveProjects] = useState<ImpactProjectItem[]>([]);
  const [sampleCertificate, setSampleCertificate] = useState<SampleTreeCertificate | undefined>();

  useEffect(() => {
    let isMounted = true;

    async function loadAllData() {
      try {
        const [cmsRes, instancesRes, varietiesRes, plansRes] = await Promise.allSettled([
          landingPageService.get(),
          treeInstanceService.getAll({ limit: 100 }),
          treeVarietyService.getAll({ limit: 50 }),
          adoptionPlanService.getAll({ limit: 50 }),
        ]);

        if (!isMounted) return;

        // 1. CMS Content
        if (cmsRes.status === "fulfilled" && cmsRes.value.data) {
          setCmsContent(cmsRes.value.data);
        }

        // 2. Instances, Varieties & Plans
        const instances: BackendTreeInstance[] =
          instancesRes.status === "fulfilled" && instancesRes.value.data?.items
            ? instancesRes.value.data.items
            : [];
        const totalTrees =
          instancesRes.status === "fulfilled" && typeof instancesRes.value.data?.total === "number"
            ? instancesRes.value.data.total
            : instances.length;

        const varieties: BackendTreeVariety[] =
          varietiesRes.status === "fulfilled" && varietiesRes.value.data?.items
            ? varietiesRes.value.data.items
            : [];
        const totalVarieties =
          varietiesRes.status === "fulfilled" && typeof varietiesRes.value.data?.total === "number"
            ? varietiesRes.value.data.total
            : varieties.length;

        // Extract active bio-reserves
        const reservesSet = new Set<string>();
        instances.forEach((i) => i.assignedReserve && reservesSet.add(i.assignedReserve));
        varieties.forEach((v) => v.location && reservesSet.add(v.location));
        const totalReserves = reservesSet.size;

        // Compute unique verified adopters
        const adoptersSet = new Set<string>();
        instances.forEach((i) => {
          if (i.adopterEmail) adoptersSet.add(i.adopterEmail);
          else if (i.adopterName) adoptersSet.add(i.adopterName);
        });
        const peopleCount = adoptersSet.size;

        // Compute CO2 offset (based on real variety absorption or avg 28.5 kg / tree / yr)
        const totalCo2Kg = instances.reduce((sum, inst) => {
          const matchedVar = varieties.find((v) => v.commonName === inst.treeVarietyName);
          return sum + (matchedVar?.co2AbsorptionRateKgYear || 28.5);
        }, 0);
        const totalCo2Mt = totalTrees > 0 ? Number(((totalCo2Kg || totalTrees * 28.5) / 1000).toFixed(2)) : 0;

        // Compute canopy area
        const canopyAcres = totalTrees > 0 ? Number(((totalTrees * 450) / 43560).toFixed(1)) : 0;

        // Set Live Hero Stats
        setHeroLiveStats({
          totalTrees,
          totalVarieties,
          totalReserves,
        });

        // Set Live Impact Stats
        setImpactLiveStats({
          totalTrees,
          totalCo2Mt,
          canopyAcres,
          peopleCount,
          varietiesCount: totalVarieties,
        });

        // Compute Live Projects from database reserves
        const reserveCounts: Record<string, number> = {};
        instances.forEach((i) => {
          if (i.assignedReserve) {
            reserveCounts[i.assignedReserve] = (reserveCounts[i.assignedReserve] || 0) + 1;
          }
        });

        const projectsList: ImpactProjectItem[] = [];
        for (const resName of reservesSet) {
          const count = reserveCounts[resName] || 1;
          const meta = RESERVE_METADATA[resName] || {
            region: "Maharashtra",
            img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
          };
          projectsList.push({
            title: resName,
            trees: `${count} ${count === 1 ? "tree" : "trees"} planted`,
            region: meta.region,
            img: meta.img,
          });
        }
        if (projectsList.length > 0) {
          setLiveProjects(projectsList);
        }

        // Live Sample Certificate from DB tree
        const firstInstance = instances[0];
        if (firstInstance) {
          setSampleCertificate({
            recipientName: user?.name || firstInstance.adopterName || "Tree Adopter",
            treeName: firstInstance.treeVarietyName || "Sacred Banyan",
            treeId: firstInstance.treeTag || "POA-BY-1204",
            location: firstInstance.assignedReserve || "Satara Plateau, Maharashtra",
            date: firstInstance.datePlanted
              ? new Date(firstInstance.datePlanted).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "15 Apr 2026",
          });
        }
      } catch (err) {
        console.warn("Failed to derive live storefront data:", err);
      }
    }

    loadAllData();
    return () => {
      isMounted = false;
    };
  }, [user]);

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
      experiences: "experiences",
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
              liveStats={heroLiveStats}
            />
          </div>
        )}

        {cmsContent.howItWorks?.isEnabled !== false && (
          <HowItWorks content={cmsContent.howItWorks} />
        )}

        <ExploreTrees openPlant={() => setPlantOpen(true)} />

        <ExperienceSection onScheduleVisit={() => setPlantOpen(true)} />

        {cmsContent.impact?.isEnabled !== false && (
          <ImpactSection
            content={cmsContent.impact}
            liveStats={impactLiveStats}
            liveProjects={liveProjects}
          />
        )}


        {cmsContent.certificate?.isEnabled !== false && (
          <CertificateSection
            content={cmsContent.certificate}
            sampleTree={sampleCertificate}
          />
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

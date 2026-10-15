"use client";

import { useState, useEffect } from "react";
import {
  LandingPageContent,
  DEFAULT_LANDING_PAGE_CONTENT,
  landingPageService,
} from "@/services/landing-page/landing-page.service";
import {
  SectionKey,
  CmsHeaderActions,
  CmsSectionNav,
  SectionVisibilityMaster,
  HeroSectionEditor,
  HowItWorksEditor,
  ImpactEditor,
  CertificateEditor,
  FooterEditor,
  FloatingSaveBar,
  LivePreviewModal,
} from "./landing-page";

interface LandingPageTabProps {
  showToast: (msg: string) => void;
}

export function LandingPageTab({ showToast }: LandingPageTabProps) {
  const [content, setContent] = useState<LandingPageContent>(DEFAULT_LANDING_PAGE_CONTENT);
  const [initialContent, setInitialContent] = useState<LandingPageContent>(DEFAULT_LANDING_PAGE_CONTENT);
  const [activeSection, setActiveSection] = useState<SectionKey>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [resetting, setResetting] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  // Fetch landing page content on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const res = await landingPageService.get();
        if (isMounted && res.data) {
          setContent(res.data);
          setInitialContent(res.data);
        }
      } catch (err) {
        console.warn("Could not load landing page CMS from API, using fallback:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const hasUnsavedChanges = JSON.stringify(content) !== JSON.stringify(initialContent);

  // Save changes to backend API
  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await landingPageService.update(content);
      if (res.data) {
        setContent(res.data);
        setInitialContent(res.data);
        showToast("Landing page content published successfully! 🌱");
      }
    } catch (err) {
      console.error("Save error:", err);
      showToast("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Reset to default landing page data
  const handleReset = async () => {
    if (
      !window.confirm(
        "Are you sure you want to restore original default content for the landing page? Any unsaved edits will be lost."
      )
    ) {
      return;
    }
    try {
      setResetting(true);
      const res = await landingPageService.reset();
      if (res.data) {
        setContent(res.data);
        setInitialContent(res.data);
        showToast("Restored default landing page content.");
      }
    } catch (err) {
      console.error("Reset error:", err);
      showToast("Failed to reset content.");
    } finally {
      setResetting(false);
    }
  };

  // Discard local changes
  const handleDiscard = () => {
    setContent(initialContent);
    showToast("Discarded unsaved modifications.");
  };

  // Section visibility toggle helper
  const toggleSection = (section: "hero" | "howItWorks" | "impact" | "certificate" | "footer") => {
    if (section === "footer") {
      const current = content.footer.ctaBandEnabled !== false;
      setContent({ ...content, footer: { ...content.footer, ctaBandEnabled: !current } });
      showToast(`CTA Banner Band ${!current ? "Enabled" : "Disabled"}`);
    } else {
      const current = content[section].isEnabled !== false;
      setContent({ ...content, [section]: { ...content[section], isEnabled: !current } });
      showToast(`${section.toUpperCase()} section ${!current ? "Enabled" : "Disabled"}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-[#4a6557] font-medium">Loading Landing Page CMS configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner / Actions Bar */}
      <CmsHeaderActions
        hasUnsavedChanges={hasUnsavedChanges}
        saving={saving}
        resetting={resetting}
        onSave={handleSave}
        onReset={handleReset}
        onDiscard={handleDiscard}
        onOpenPreview={() => setShowPreviewModal(true)}
      />

      {/* Section Navigation Tabs */}
      <CmsSectionNav
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        content={content}
      />

      {/* Master Section Visibility Controls (Overview) */}
      {activeSection === "all" && (
        <SectionVisibilityMaster
          content={content}
          onToggleSection={toggleSection}
          onSelectSection={setActiveSection}
        />
      )}

      {/* 1. Hero Section Editor */}
      {(activeSection === "all" || activeSection === "hero") && (
        <HeroSectionEditor
          hero={content.hero}
          onChange={(updatedHero) => setContent({ ...content, hero: updatedHero })}
          onToggle={() => toggleSection("hero")}
        />
      )}

      {/* 2. How It Works Section Editor */}
      {(activeSection === "all" || activeSection === "howItWorks") && (
        <HowItWorksEditor
          howItWorks={content.howItWorks}
          onChange={(updatedHowItWorks) => setContent({ ...content, howItWorks: updatedHowItWorks })}
          onToggle={() => toggleSection("howItWorks")}
        />
      )}

      {/* 3. Collective Impact Section Editor */}
      {(activeSection === "all" || activeSection === "impact") && (
        <ImpactEditor
          impact={content.impact}
          onChange={(updatedImpact) => setContent({ ...content, impact: updatedImpact })}
          onToggle={() => toggleSection("impact")}
        />
      )}

      {/* 4. Certificate Section Editor */}
      {(activeSection === "all" || activeSection === "certificate") && (
        <CertificateEditor
          certificate={content.certificate}
          onChange={(updatedCert) => setContent({ ...content, certificate: updatedCert })}
          onToggle={() => toggleSection("certificate")}
        />
      )}

      {/* 5. Footer CTA & Brand Section Editor */}
      {(activeSection === "all" || activeSection === "footer") && (
        <FooterEditor
          footer={content.footer}
          onChange={(updatedFooter) => setContent({ ...content, footer: updatedFooter })}
          onToggle={() => toggleSection("footer")}
        />
      )}

      {/* Floating Save Pill */}
      <FloatingSaveBar
        hasUnsavedChanges={hasUnsavedChanges}
        saving={saving}
        onDiscard={handleDiscard}
        onSave={handleSave}
      />

      {/* Live Preview Modal */}
      <LivePreviewModal
        isOpen={showPreviewModal}
        content={content}
        hasUnsavedChanges={hasUnsavedChanges}
        onClose={() => setShowPreviewModal(false)}
        onSave={handleSave}
      />
    </div>
  );
}
export default LandingPageTab;

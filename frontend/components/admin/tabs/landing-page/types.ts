import {
  LandingPageContent,
  HeroSectionContent,
  HowItWorksSectionContent,
  ImpactSectionContent,
  CertificateSectionContent,
  FooterSectionContent,
} from "@/services/landing-page/landing-page.service";

export type SectionKey = "all" | "hero" | "howItWorks" | "impact" | "certificate" | "footer";

export interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (val: boolean) => void;
  label?: string;
}

export interface SectionEditorBaseProps {
  onToggle: () => void;
}

export interface HeroSectionEditorProps extends SectionEditorBaseProps {
  hero: HeroSectionContent;
  onChange: (updated: HeroSectionContent) => void;
}

export interface HowItWorksEditorProps extends SectionEditorBaseProps {
  howItWorks: HowItWorksSectionContent;
  onChange: (updated: HowItWorksSectionContent) => void;
}

export interface ImpactEditorProps extends SectionEditorBaseProps {
  impact: ImpactSectionContent;
  onChange: (updated: ImpactSectionContent) => void;
}

export interface CertificateEditorProps extends SectionEditorBaseProps {
  certificate: CertificateSectionContent;
  onChange: (updated: CertificateSectionContent) => void;
}

export interface FooterEditorProps extends SectionEditorBaseProps {
  footer: FooterSectionContent;
  onChange: (updated: FooterSectionContent) => void;
}

export interface SectionVisibilityMasterProps {
  content: LandingPageContent;
  onToggleSection: (section: "hero" | "howItWorks" | "impact" | "certificate" | "footer") => void;
  onSelectSection: (section: SectionKey) => void;
}

export interface CmsHeaderActionsProps {
  hasUnsavedChanges: boolean;
  saving: boolean;
  resetting: boolean;
  onSave: () => void;
  onReset: () => void;
  onDiscard: () => void;
  onOpenPreview: () => void;
}

export interface CmsSectionNavProps {
  activeSection: SectionKey;
  onSelectSection: (section: SectionKey) => void;
  content: LandingPageContent;
}

export interface LivePreviewModalProps {
  isOpen: boolean;
  content: LandingPageContent;
  hasUnsavedChanges: boolean;
  onClose: () => void;
  onSave: () => void;
}

export interface FloatingSaveBarProps {
  hasUnsavedChanges: boolean;
  saving: boolean;
  onDiscard: () => void;
  onSave: () => void;
}

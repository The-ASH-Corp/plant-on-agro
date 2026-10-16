export interface HeroStatItem {
  target: number;
  suffix: string;
  label: string;
}

export interface HeroSectionContent {
  isEnabled?: boolean;
  badge: string;
  headlinePart1: string;
  headlineHighlight: string;
  description: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  bgImageUrl: string;
  stats: HeroStatItem[];
}

export interface HowItWorksStepItem {
  num: string;
  icon: string;
  title: string;
  desc: string;
}

export interface HowItWorksSectionContent {
  isEnabled?: boolean;
  tagline: string;
  title: string;
  steps: HowItWorksStepItem[];
}

export interface ImpactStatItem {
  icon: string;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

export interface ImpactProjectItem {
  title: string;
  trees: string;
  region: string;
  img: string;
}

export interface ImpactSectionContent {
  isEnabled?: boolean;
  tagline: string;
  title: string;
  description: string;
  stats: ImpactStatItem[];
  projects: ImpactProjectItem[];
}

export interface CertificateSectionContent {
  isEnabled?: boolean;
  tagline: string;
  titlePart1: string;
  titleHighlight: string;
  description: string;
  features: string[];
  sampleRecipientName: string;
  sampleTreeName: string;
  sampleTreeId: string;
  sampleLocation: string;
  sampleDate: string;
  sampleQuote: string;
}

export interface FooterSectionContent {
  ctaBandEnabled?: boolean;
  ctaTagline: string;
  ctaTitlePart1: string;
  ctaTitleHighlight: string;
  ctaDescription: string;
  ctaButtonText: string;
  footerTagline: string;
  copyrightText: string;
}

export interface LandingPageProps {
  id?: string;
  slug?: string;
  hero: HeroSectionContent;
  howItWorks: HowItWorksSectionContent;
  impact: ImpactSectionContent;
  certificate: CertificateSectionContent;
  footer: FooterSectionContent;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const DEFAULT_LANDING_PAGE_DATA: Omit<LandingPageProps, 'id' | 'createdAt' | 'updatedAt'> = {
  slug: 'default',
  isActive: true,
  hero: {
    isEnabled: true,
    badge: '🌱 You Plant. We Grow.',
    headlinePart1: 'Plant a Tree.',
    headlineHighlight: 'Create a Future.',
    description:
      'Choose a tree, plant it through PlantOn agro, and watch your impact grow — with real photos, location tracking, and a certificate in your name.',
    primaryCtaText: 'Plant a Tree',
    secondaryCtaText: 'Explore Our Impact',
    bgImageUrl:
      'https://images.unsplash.com/photo-1568241640298-1adf2974314c?w=1920&h=1080&fit=crop&auto=format',
    stats: [
      { target: 0, suffix: "+", label: "Trees Planted & Geotagged" },
      { target: 0, suffix: "", label: "Native Tree Varieties" },
      { target: 0, suffix: "+", label: "Protected Bio-Reserves" },
    ],
  },
  howItWorks: {
    isEnabled: true,
    tagline: 'Simple Process',
    title: 'How PlantOn agro Works',
    steps: [
      {
        num: '01',
        icon: '📋',
        title: 'Choose Your Plan',
        desc: 'Individual, student, family, occasion, or corporate — every milestone deserves roots.',
      },
      {
        num: '02',
        icon: '🤲',
        title: 'We Plant It',
        desc: 'Our expert plantation team handles the fieldwork at verified sites across India.',
      },
      {
        num: '03',
        icon: '📸',
        title: 'Watch It Grow',
        desc: 'Track your tree with geo-tagged photos, growth milestones, and a digital certificate.',
      },
    ],
  },
  impact: {
    isEnabled: true,
    tagline: 'Collective Action',
    title: 'Your Impact Is Growing.',
    description:
      'Every tree planted creates a ripple — cleaner air, cooler ground, and a living legacy.',
    stats: [
      { icon: '🌳', value: 0, suffix: '+', label: 'Trees Planted & Geotagged', color: '#52b788' },
      { icon: '🌍', value: 0, suffix: ' MT', label: 'CO₂ Impact Offset / yr', color: '#95d5b2' },
      { icon: '🌱', value: 0, suffix: ' acres', label: 'Canopy Conserved', color: '#52b788' },
      { icon: '👥', value: 0, suffix: '+', label: 'Verified Adopters', color: '#95d5b2' },
      { icon: '🌿', value: 0, suffix: ' Species', label: 'Botanical Varieties', color: '#52b788' },
    ],
    projects: [],
  },
  certificate: {
    isEnabled: true,
    tagline: 'Your Legacy',
    titlePart1: 'A Certificate That',
    titleHighlight: 'Actually Grows',
    description:
      'Every tree you plant comes with a premium digital certificate — personalised, shareable, and backed by real plantation data.',
    features: [
      'Your name on every certificate',
      'GPS coordinates of your tree',
      'Linked to live growth tracking',
      'Shareable on LinkedIn & social',
    ],
    sampleRecipientName: 'Your Name Here',
    sampleTreeName: 'Botanical Species',
    sampleTreeId: 'POA-TR-0000',
    sampleLocation: 'Verified Bio-Reserve',
    sampleDate: 'Plantation Date',
    sampleQuote:
      'has planted a tree through PlantOn agro, contributing to a greener, healthier planet.',
  },
  footer: {
    ctaBandEnabled: true,
    ctaTagline: 'Join the Movement',
    ctaTitlePart1: 'Plant Today.',
    ctaTitleHighlight: 'Grow Tomorrow.',
    ctaDescription:
      'Thousands of individuals, families, and companies have already started their green journey. Yours begins with one tree.',
    ctaButtonText: 'Plant a Tree Today',
    footerTagline: 'You Plant. We Grow. Building a greener India, one tree at a time.',
    copyrightText: '© 2026 PlantOn agro. All rights reserved.',
  },
};

export class LandingPage {
  private readonly _id?: string;
  private _slug: string;
  private _hero: HeroSectionContent;
  private _howItWorks: HowItWorksSectionContent;
  private _impact: ImpactSectionContent;
  private _certificate: CertificateSectionContent;
  private _footer: FooterSectionContent;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: LandingPageProps) {
    this._id = props.id;
    this._slug = props.slug || 'default';
    this._hero = props.hero;
    this._howItWorks = props.howItWorks;
    this._impact = props.impact;
    this._certificate = props.certificate;
    this._footer = props.footer;
    this._isActive = props.isActive !== undefined ? props.isActive : true;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  public get id(): string | undefined {
    return this._id;
  }

  public get slug(): string {
    return this._slug;
  }

  public get hero(): HeroSectionContent {
    return this._hero;
  }

  public get howItWorks(): HowItWorksSectionContent {
    return this._howItWorks;
  }

  public get impact(): ImpactSectionContent {
    return this._impact;
  }

  public get certificate(): CertificateSectionContent {
    return this._certificate;
  }

  public get footer(): FooterSectionContent {
    return this._footer;
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public update(props: Partial<Omit<LandingPageProps, 'id' | 'createdAt' | 'updatedAt'>>): void {
    if (props.hero) this._hero = { ...this._hero, ...props.hero };
    if (props.howItWorks) this._howItWorks = { ...this._howItWorks, ...props.howItWorks };
    if (props.impact) this._impact = { ...this._impact, ...props.impact };
    if (props.certificate) this._certificate = { ...this._certificate, ...props.certificate };
    if (props.footer) this._footer = { ...this._footer, ...props.footer };
    if (props.isActive !== undefined) this._isActive = props.isActive;
    this._updatedAt = new Date();
  }

  public resetToDefaults(): void {
    this._hero = { ...DEFAULT_LANDING_PAGE_DATA.hero };
    this._howItWorks = { ...DEFAULT_LANDING_PAGE_DATA.howItWorks };
    this._impact = { ...DEFAULT_LANDING_PAGE_DATA.impact };
    this._certificate = { ...DEFAULT_LANDING_PAGE_DATA.certificate };
    this._footer = { ...DEFAULT_LANDING_PAGE_DATA.footer };
    this._updatedAt = new Date();
  }
}

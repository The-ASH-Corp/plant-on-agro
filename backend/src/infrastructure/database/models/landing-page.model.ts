import mongoose, { Schema, Document } from 'mongoose';
import {
  HeroSectionContent,
  HowItWorksSectionContent,
  ImpactSectionContent,
  CertificateSectionContent,
  FooterSectionContent,
} from '../../../core/entities/landing-page.entity';

export interface ILandingPageDocument extends Document {
  slug: string;
  hero: HeroSectionContent;
  howItWorks: HowItWorksSectionContent;
  impact: ImpactSectionContent;
  certificate: CertificateSectionContent;
  footer: FooterSectionContent;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroStatSchema = new Schema(
  {
    target: { type: Number, required: true, default: 0 },
    suffix: { type: String, default: '' },
    label: { type: String, required: true },
  },
  { _id: false }
);

const HowItWorksStepSchema = new Schema(
  {
    num: { type: String, required: true },
    icon: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
  },
  { _id: false }
);

const ImpactStatSchema = new Schema(
  {
    icon: { type: String, required: true, default: '🌱' },
    value: { type: Number, required: true, default: 0 },
    suffix: { type: String, default: '' },
    label: { type: String, required: true },
    color: { type: String, required: true, default: '#52b788' },
  },
  { _id: false }
);

const ImpactProjectSchema = new Schema(
  {
    img: { type: String, required: true },
    title: { type: String, required: true },
    trees: { type: String, required: true },
    region: { type: String, required: true },
  },
  { _id: false }
);

const LandingPageSchema = new Schema<ILandingPageDocument>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      default: 'default',
      trim: true,
      index: true,
    },
    hero: {
      isEnabled: { type: Boolean, default: true },
      badge: { type: String, required: true },
      headlinePart1: { type: String, required: true },
      headlineHighlight: { type: String, required: true },
      description: { type: String, required: true },
      primaryCtaText: { type: String, required: true },
      secondaryCtaText: { type: String, required: true },
      bgImageUrl: { type: String, required: true },
      stats: { type: [HeroStatSchema], default: [] },
    },
    howItWorks: {
      isEnabled: { type: Boolean, default: true },
      tagline: { type: String, required: true },
      title: { type: String, required: true },
      steps: { type: [HowItWorksStepSchema], default: [] },
    },
    impact: {
      isEnabled: { type: Boolean, default: true },
      tagline: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      stats: { type: [ImpactStatSchema], default: [] },
      projects: { type: [ImpactProjectSchema], default: [] },
    },
    certificate: {
      isEnabled: { type: Boolean, default: true },
      tagline: { type: String, required: true },
      titlePart1: { type: String, required: true },
      titleHighlight: { type: String, required: true },
      description: { type: String, required: true },
      features: { type: [String], default: [] },
      sampleRecipientName: { type: String, required: true },
      sampleTreeName: { type: String, required: true },
      sampleTreeId: { type: String, required: true },
      sampleLocation: { type: String, required: true },
      sampleDate: { type: String, required: true },
      sampleQuote: { type: String, required: true },
    },
    footer: {
      ctaBandEnabled: { type: Boolean, default: true },
      ctaTagline: { type: String, required: true },
      ctaTitlePart1: { type: String, required: true },
      ctaTitleHighlight: { type: String, required: true },
      ctaDescription: { type: String, required: true },
      ctaButtonText: { type: String, required: true },
      footerTagline: { type: String, required: true },
      copyrightText: { type: String, required: true },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const LandingPageModel = mongoose.model<ILandingPageDocument>(
  'LandingPage',
  LandingPageSchema
);

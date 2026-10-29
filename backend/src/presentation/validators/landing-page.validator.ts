import { z } from 'zod';

const heroStatSchema = z.object({
  target: z.coerce.number().min(0, 'Target must be positive'),
  suffix: z.string().trim().default(''),
  label: z.string().trim().min(1, 'Label cannot be empty'),
});

const heroSectionSchema = z.object({
  isEnabled: z.boolean().optional(),
  badge: z.string().trim().min(1, 'Badge cannot be empty').optional(),
  headlinePart1: z.string().trim().min(1, 'Headline cannot be empty').optional(),
  headlineHighlight: z.string().trim().min(1, 'Headline highlight cannot be empty').optional(),
  description: z.string().trim().min(1, 'Description cannot be empty').optional(),
  primaryCtaText: z.string().trim().min(1, 'Primary CTA cannot be empty').optional(),
  secondaryCtaText: z.string().trim().min(1, 'Secondary CTA cannot be empty').optional(),
  bgImageUrl: z.string().trim().min(1, 'Background image URL cannot be empty').optional(),
  stats: z.array(heroStatSchema).optional(),
});

const howItWorksStepSchema = z.object({
  num: z.string().trim(),
  icon: z.string().trim(),
  title: z.string().trim().min(1, 'Step title cannot be empty'),
  desc: z.string().trim().min(1, 'Step description cannot be empty'),
});

const howItWorksSectionSchema = z.object({
  isEnabled: z.boolean().optional(),
  tagline: z.string().trim().min(1, 'Tagline cannot be empty').optional(),
  title: z.string().trim().min(1, 'Title cannot be empty').optional(),
  steps: z.array(howItWorksStepSchema).optional(),
});

const impactStatSchema = z.object({
  icon: z.string().trim(),
  value: z.coerce.number().min(0),
  suffix: z.string().trim().default(''),
  label: z.string().trim().min(1, 'Stat label cannot be empty'),
  color: z.string().trim().default('#52b788'),
});

const impactProjectSchema = z.object({
  img: z.string().trim().min(1, 'Project image URL cannot be empty'),
  title: z.string().trim().min(1, 'Project title cannot be empty'),
  trees: z.string().trim().min(1, 'Trees count cannot be empty'),
  region: z.string().trim().min(1, 'Region cannot be empty'),
});

const impactSectionSchema = z.object({
  isEnabled: z.boolean().optional(),
  tagline: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  stats: z.array(impactStatSchema).optional(),
  projects: z.array(impactProjectSchema).optional(),
});

const certificateSectionSchema = z.object({
  isEnabled: z.boolean().optional(),
  tagline: z.string().trim().min(1).optional(),
  titlePart1: z.string().trim().min(1).optional(),
  titleHighlight: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  features: z.array(z.string().trim()).optional(),
  sampleRecipientName: z.string().trim().min(1).optional(),
  sampleTreeName: z.string().trim().min(1).optional(),
  sampleTreeId: z.string().trim().min(1).optional(),
  sampleLocation: z.string().trim().min(1).optional(),
  sampleDate: z.string().trim().min(1).optional(),
  sampleQuote: z.string().trim().min(1).optional(),
});

const footerSectionSchema = z.object({
  ctaBandEnabled: z.boolean().optional(),
  ctaTagline: z.string().trim().min(1).optional(),
  ctaTitlePart1: z.string().trim().min(1).optional(),
  ctaTitleHighlight: z.string().trim().min(1).optional(),
  ctaDescription: z.string().trim().min(1).optional(),
  ctaButtonText: z.string().trim().min(1).optional(),
  footerTagline: z.string().trim().min(1).optional(),
  copyrightText: z.string().trim().min(1).optional(),
});

export const updateLandingPageSchema = z.object({
  hero: heroSectionSchema.optional(),
  howItWorks: howItWorksSectionSchema.optional(),
  impact: impactSectionSchema.optional(),
  certificate: certificateSectionSchema.optional(),
  footer: footerSectionSchema.optional(),
  isActive: z.boolean().optional(),
});

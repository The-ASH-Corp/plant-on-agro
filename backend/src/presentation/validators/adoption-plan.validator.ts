import { z } from 'zod';

const occasionDedicationEnum = z.enum([
  'birthday',
  'memorial',
  'anniversary',
  'corporate',
  'general',
]);

export const createAdoptionPlanSchema = z.object({
  planLabel: z
    .string()
    .trim()
    .min(1, 'Plan label cannot be empty')
    .max(100, 'Plan label too long'),
  icon: z.string().trim().optional().default('🌱'),
  priceModifier: z.number().optional().default(0),
  description: z
    .string()
    .trim()
    .min(1, 'Description cannot be empty')
    .max(1000, 'Description too long'),
  features: z.array(z.string().trim().min(1)).optional().default([]),
  occasionDedications: z
    .array(occasionDedicationEnum)
    .min(1, 'At least one occasion dedication must be selected')
    .optional()
    .default(['general']),
  badge: z.string().trim().optional().default('Standard'),
  activeCount: z.number().min(0).optional().default(0),
});

export const updateAdoptionPlanSchema = z.object({
  planLabel: z.string().trim().min(1).max(100).optional(),
  icon: z.string().trim().min(1).optional(),
  priceModifier: z.number().optional(),
  description: z.string().trim().min(1).max(1000).optional(),
  features: z.array(z.string().trim().min(1)).optional(),
  occasionDedications: z.array(occasionDedicationEnum).min(1).optional(),
  badge: z.string().trim().optional(),
  activeCount: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const getAdoptionPlanByIdSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const queryAdoptionPlansSchema = z.object({
  occasion: z.string().optional(),
  search: z.string().optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  skip: z.coerce.number().min(0).optional().default(0),
});

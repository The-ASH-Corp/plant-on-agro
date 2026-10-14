import { z } from 'zod';

export const createTreeVarietySchema = z.object({
  commonName: z
    .string()
    .trim()
    .min(1, 'Common name cannot be empty')
    .max(100, 'Common name too long'),
  scientificName: z
    .string()
    .trim()
    .min(1, 'Scientific name cannot be empty')
    .max(120, 'Scientific name too long'),
  category: z.enum([
    'Fruit Trees',
    'Timber Trees',
    'Medicinal',
    'Native Trees',
    'Shade Trees',
    'Occasion',
  ]),
  price: z.number().min(0, 'Price must be 0 or greater'),
  co2AbsorptionRateKgYear: z
    .number()
    .min(0, 'CO2 absorption rate must be 0 or greater'),
  growthTimeline: z.string().trim().min(1, 'Growth timeline cannot be empty'),
  careRequirements: z.string().trim().min(1, 'Care requirements cannot be empty'),
  coverImages: z.array(z.string().url('Cover image must be a valid URL')).optional().default([]),
  location: z.string().trim().optional().default('Western Ghats, Maharashtra'),
  description: z.string().trim().optional().default(''),
});

export const updateTreeVarietySchema = z.object({
  commonName: z.string().trim().min(1).max(100).optional(),
  scientificName: z.string().trim().min(1).max(120).optional(),
  category: z
    .enum([
      'Fruit Trees',
      'Timber Trees',
      'Medicinal',
      'Native Trees',
      'Shade Trees',
      'Occasion',
    ])
    .optional(),
  price: z.number().min(0).optional(),
  co2AbsorptionRateKgYear: z.number().min(0).optional(),
  growthTimeline: z.string().trim().min(1).optional(),
  careRequirements: z.string().trim().min(1).optional(),
  coverImages: z.array(z.string().url()).optional(),
  location: z.string().trim().optional(),
  description: z.string().trim().optional(),
  isActive: z.boolean().optional(),
});

export const getTreeVarietyByIdSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const queryTreeVarietiesSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  skip: z.coerce.number().min(0).optional().default(0),
});

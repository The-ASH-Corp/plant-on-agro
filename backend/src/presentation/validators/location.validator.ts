import { z } from 'zod';

export const createLocationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Reserve name cannot be empty')
    .max(120, 'Reserve name too long'),
  region: z
    .string()
    .trim()
    .min(1, 'Region / State cannot be empty')
    .max(120, 'Region too long'),
  gps: z
    .string()
    .trim()
    .min(1, 'GPS coordinates cannot be empty')
    .max(100, 'GPS coordinates too long'),
  areaHectares: z.number().positive('Area in hectares must be greater than 0'),
  capacity: z.number().int().positive('Sapling capacity must be greater than 0'),
  treesPlanted: z.number().int().min(0, 'Trees planted cannot be negative').optional(),
  survivalRate: z.string().trim().optional().default('99.0%'),
  ndviScore: z.number().min(0).max(1).optional().default(0.88),
  soilHealth: z.string().trim().min(1).optional().default('Optimal Loam (pH 6.5, Moisture 35%)'),
  image: z.string().url('Cover image must be a valid URL').optional(),
  status: z.enum(['Active', 'Expanding', 'Full']).optional().default('Active'),
});

export const updateLocationSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  region: z.string().trim().min(1).max(120).optional(),
  gps: z.string().trim().min(1).max(100).optional(),
  areaHectares: z.number().positive().optional(),
  capacity: z.number().int().positive().optional(),
  treesPlanted: z.number().int().min(0).optional(),
  survivalRate: z.string().trim().optional(),
  ndviScore: z.number().min(0).max(1).optional(),
  soilHealth: z.string().trim().min(1).optional(),
  image: z.string().url().optional(),
  status: z.enum(['Active', 'Expanding', 'Full']).optional(),
  isActive: z.boolean().optional(),
});

export const getLocationByIdSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const queryLocationsSchema = z.object({
  status: z.string().optional(),
  search: z.string().optional(),
  isActive: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, 'Limit must be positive integer')
    .optional(),
  skip: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 0, 'Skip must be non-negative integer')
    .optional(),
});

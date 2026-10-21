import { z } from 'zod';

const healthStatusEnum = z.enum([
  'Healthy',
  'Thriving',
  'Needs Attention',
  'Critical',
  'Sapling Growing',
]);

const gpsCoordinatesSchema = z.object({
  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
});

export const createTreeInstanceSchema = z.object({
  treeTag: z
    .string()
    .trim()
    .min(1, 'Tree tag / serial cannot be empty')
    .max(50, 'Tree tag too long'),
  orderRef: z.string().trim().optional().default(''),
  assignedReserve: z
    .string()
    .trim()
    .min(1, 'Assigned reserve cannot be empty')
    .max(150, 'Reserve name too long'),
  gpsCoordinates: gpsCoordinatesSchema,
  datePlanted: z.coerce.date().optional(),
  healthStatus: healthStatusEnum.optional().default('Sapling Growing'),
  treeVarietyName: z.string().trim().optional().default(''),
  adopterName: z.string().trim().optional().default(''),
  adopterEmail: z.string().trim().email('Invalid adopter email').optional().or(z.literal('')),
  notes: z.string().trim().optional().default(''),
  imageUrl: z.string().trim().optional().default(''),
});

export const treeGrowthUpdateSchema = z.object({
  id: z.string().optional(),
  imageUrl: z.string().trim().min(1, 'Image URL is required'),
  stageName: z.string().trim().optional().default('Vegetative Growth'),
  notes: z.string().trim().optional().default(''),
  recordedAt: z.coerce.date().optional().default(() => new Date()),
  heightCm: z.coerce.number().min(0).optional(),
});

export const updateTreeInstanceSchema = z.object({
  treeTag: z.string().trim().min(1).max(50).optional(),
  orderRef: z.string().trim().optional(),
  assignedReserve: z.string().trim().min(1).max(150).optional(),
  gpsCoordinates: gpsCoordinatesSchema.optional(),
  datePlanted: z.coerce.date().optional(),
  healthStatus: healthStatusEnum.optional(),
  treeVarietyName: z.string().trim().optional(),
  adopterName: z.string().trim().optional(),
  adopterEmail: z.string().trim().email('Invalid adopter email').optional().or(z.literal('')),
  notes: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
  growthUpdates: z.array(treeGrowthUpdateSchema).optional(),
  lastInspectedAt: z.coerce.date().optional(),
  isActive: z.boolean().optional(),
});

export const getTreeInstanceByIdSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const getTreeInstanceByTagSchema = z.object({
  tag: z.string().min(1, 'Tree tag is required'),
});

export const queryTreeInstancesSchema = z.object({
  reserve: z.string().optional(),
  healthStatus: z.string().optional(),
  orderRef: z.string().optional(),
  search: z.string().optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  skip: z.coerce.number().min(0).optional().default(0),
});

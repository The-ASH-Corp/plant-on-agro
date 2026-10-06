import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().trim().min(2, 'Name must have at least 2 characters').max(50),
  email: z.string().trim().email('Invalid email address format'),
  role: z.enum(['admin', 'farmer', 'buyer']).optional(),
});

export const getUserByIdSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

export type CreateUserSchemaInput = z.infer<typeof createUserSchema>;

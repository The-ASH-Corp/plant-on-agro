import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().trim().min(2, 'Name must have at least 2 characters').max(50),
  email: z.string().trim().email('Invalid email address format'),
  role: z.enum(['admin', 'buyer']).optional(),
});

export const getUserByIdSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(2, 'Name must have at least 2 characters').max(50).optional(),
  email: z.string().trim().email('Invalid email address format').optional(),
  role: z.enum(['admin', 'buyer']).optional(),
  isActive: z.boolean().optional(),
});

export const queryUsersSchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  skip: z.coerce.number().min(0).optional().default(0),
});

export type CreateUserSchemaInput = z.infer<typeof createUserSchema>;
export type UpdateUserSchemaInput = z.infer<typeof updateUserSchema>;
export type QueryUsersSchemaInput = z.infer<typeof queryUsersSchema>;


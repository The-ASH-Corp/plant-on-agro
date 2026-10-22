import { z } from 'zod';

const adoptionOrderStatusEnum = z.enum([
  'New Request',
  'Verified & Tagged',
  'Planted',
  'Certificate Issued',
  'Completed',
]);

const paymentStatusEnum = z.enum(['Pending', 'Paid', 'Failed', 'Refunded']);

const orderItemSchema = z.object({
  treeVarietyId: z.string().trim().optional(),
  treeSpecies: z.string().trim().min(1, 'Tree species is required'),
  scientificName: z.string().trim().optional(),
  category: z.string().trim().optional(),
  planType: z.string().trim().min(1, 'Plan type is required'),
  reserveName: z.string().trim().min(1, 'Plantation reserve location is required'),
  gpsCoords: z.string().trim().optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price cannot be negative'),
  subtotal: z.number().min(0, 'Subtotal cannot be negative'),
});

const billingAddressSchema = z.object({
  street: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  country: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
});

export const createOrderSchema = z.object({
  orderNumber: z.string().trim().optional(),
  invoiceNumber: z.string().trim().optional(),
  adopterName: z.string().trim().min(1, 'Adopter name is required'),
  adopterEmail: z.string().trim().email('Invalid email address'),
  adopterPhone: z.string().trim().optional().default(''),
  billingAddress: billingAddressSchema.optional(),
  items: z.array(orderItemSchema).optional().default([]),
  treeSpecies: z.string().trim().min(1, 'Tree species is required'),
  scientificName: z.string().trim().optional().default(''),
  category: z.string().trim().optional().default('Fruit Trees'),
  reserveName: z.string().trim().min(1, 'Plantation reserve location is required'),
  gpsCoords: z.string().trim().optional().default(''),
  planType: z.string().trim().min(1, 'Plan type is required'),
  dedicationMessage: z.string().trim().optional().default(''),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  totalAmount: z.coerce.number().min(0, 'Total amount cannot be negative'),
  paymentMethod: z.string().trim().optional().default('razorpay'),
  paymentStatus: paymentStatusEnum.optional().default('Pending'),
  transactionRef: z.string().trim().optional().default(''),
  status: adoptionOrderStatusEnum.optional().default('New Request'),
  certificateId: z.string().trim().optional(),
  ndviScore: z.coerce.number().min(0).max(1).optional().default(0.91),
  isRead: z.boolean().optional().default(false),
  notes: z.string().trim().optional().default(''),
  datePlanted: z.coerce.date().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: adoptionOrderStatusEnum,
  notes: z.string().trim().optional(),
  gpsCoords: z.string().trim().optional(),
});

export const getOrderByIdSchema = z.object({
  id: z.string().trim().min(1, 'Order ID is required'),
});

export const getOrderByNumberSchema = z.object({
  orderNumber: z.string().trim().min(1, 'Order number is required'),
});

export const queryOrdersSchema = z.object({
  status: z.string().trim().optional(),
  paymentStatus: z.string().trim().optional(),
  search: z.string().trim().optional(),
  adopterEmail: z.string().trim().optional(),
  reserveName: z.string().trim().optional(),
  isRead: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  limit: z.coerce.number().int().min(1).max(200).optional().default(50),
  skip: z.coerce.number().int().min(0).optional().default(0),
});

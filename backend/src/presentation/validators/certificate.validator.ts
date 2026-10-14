import { z } from 'zod';

const certificateStatusEnum = z.enum(['Issued', 'Pending Generation', 'Revoked']);

export const createCertificateSchema = z.object({
  certificateNumber: z.string().trim().optional(),
  orderRef: z.string().trim().min(1, 'Order reference cannot be empty'),
  recipientName: z.string().trim().min(1, 'Recipient name cannot be empty'),
  dedicatedMessage: z.string().trim().min(1, 'Dedicated message cannot be empty'),
  issueDate: z.coerce.date().optional(),
  pdfUrl: z.string().trim().optional().default(''),
  qrCodeVerificationUrl: z.string().trim().optional().default(''),
  treeTag: z.string().trim().optional().default(''),
  treeSpecies: z.string().trim().optional().default(''),
  reserveName: z.string().trim().optional().default(''),
  adopterName: z.string().trim().optional().default(''),
  status: certificateStatusEnum.optional().default('Issued'),
});

export const updateCertificateSchema = z.object({
  certificateNumber: z.string().trim().min(1).optional(),
  recipientName: z.string().trim().min(1).optional(),
  dedicatedMessage: z.string().trim().min(1).optional(),
  issueDate: z.coerce.date().optional(),
  pdfUrl: z.string().trim().optional(),
  qrCodeVerificationUrl: z.string().trim().optional(),
  treeTag: z.string().trim().optional(),
  treeSpecies: z.string().trim().optional(),
  reserveName: z.string().trim().optional(),
  adopterName: z.string().trim().optional(),
  status: certificateStatusEnum.optional(),
  isActive: z.boolean().optional(),
});

export const getCertificateByIdSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const getCertificateByNumberSchema = z.object({
  number: z.string().min(1, 'Certificate number is required'),
});

export const verifyCertificateSchema = z.object({
  identifier: z.string().min(1, 'Verification hash or certificate number is required'),
});

export const queryCertificatesSchema = z.object({
  orderRef: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  skip: z.coerce.number().min(0).optional().default(0),
});

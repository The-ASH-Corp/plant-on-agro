import { z } from 'zod';


export const registerSchema = z
  .object({
    name: z
      .string({ error: 'Name is required' })
      .trim()
      .min(2, 'Name must contain at least 2 characters')
      .max(50, 'Name must not exceed 50 characters')
      .regex(/^[a-zA-Z\s\-'.]+$/, 'Name can only contain alphabetic characters, spaces, hyphens, and apostrophes'),

    email: z
      .string({ error: 'Email is required' })
      .trim()
      .toLowerCase()
      .email('Invalid email address format')
      .max(255, 'Email cannot exceed 255 characters'),

    password: z
      .string({ error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password cannot exceed 128 characters to prevent Hash-DoS attacks')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one numeric digit')
      .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/,
        'Password must contain at least one special character'
      ),

    role: z
      .enum(['buyer'], {
        error: "Role must be 'buyer'",
      })
      .optional()
      .default('buyer'),
  })
  .strict();

export type RegisterSchemaInput = z.infer<typeof registerSchema>;

export const loginSchema = z
  .object({
    email: z
      .string({ error: 'Email is required' })
      .trim()
      .toLowerCase()
      .email('Invalid email address format'),
    password: z
      .string({ error: 'Password is required' })
      .min(1, 'Password is required'),
  })
  .strict();

export type LoginSchemaInput = z.infer<typeof loginSchema>;

export const checkEmailSchema = z
  .object({
    email: z
      .string({ error: 'Email is required' })
      .trim()
      .toLowerCase()
      .email('Invalid email address format'),
  })
  .strict();

export type CheckEmailSchemaInput = z.infer<typeof checkEmailSchema>;

export const requestPasswordResetOtpSchema = z
  .object({
    email: z
      .string({ error: 'Email is required' })
      .trim()
      .toLowerCase()
      .email('Invalid email address format'),
  })
  .strict();

export type RequestPasswordResetOtpInput = z.infer<typeof requestPasswordResetOtpSchema>;

export const verifyPasswordResetOtpSchema = z
  .object({
    email: z
      .string({ error: 'Email is required' })
      .trim()
      .toLowerCase()
      .email('Invalid email address format'),
    otp: z
      .string({ error: 'OTP is required' })
      .trim()
      .length(6, 'Verification code must be exactly 6 digits')
      .regex(/^\d{6}$/, 'Verification code must contain only numbers'),
  })
  .strict();

export type VerifyPasswordResetOtpInput = z.infer<typeof verifyPasswordResetOtpSchema>;

export const resetPasswordWithOtpSchema = z
  .object({
    email: z
      .string({ error: 'Email is required' })
      .trim()
      .toLowerCase()
      .email('Invalid email address format'),
    otp: z
      .string({ error: 'OTP is required' })
      .trim()
      .length(6, 'Verification code must be exactly 6 digits')
      .regex(/^\d{6}$/, 'Verification code must contain only numbers'),
    password: z
      .string({ error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password cannot exceed 128 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one numeric digit')
      .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/,
        'Password must contain at least one special character'
      ),
  })
  .strict();

export type ResetPasswordWithOtpInput = z.infer<typeof resetPasswordWithOtpSchema>;


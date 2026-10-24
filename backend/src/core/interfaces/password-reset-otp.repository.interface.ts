import { PasswordResetOtp } from '../entities/password-reset-otp.entity';
import { Nullable } from '../../shared/types';

export interface IPasswordResetOtpRepository {
  /**
   * Invalidates any existing unused OTPs for an email and creates a fresh OTP record.
   */
  createOtp(email: string, otp: string, expiresAt: Date): Promise<PasswordResetOtp>;

  /**
   * Finds the latest active (unused) OTP record for a given email address.
   */
  findLatestActiveByEmail(email: string): Promise<Nullable<PasswordResetOtp>>;

  /**
   * Atomically increments the attempt counter for an OTP document.
   * Returns the updated attempt count.
   */
  incrementAttempts(id: string): Promise<number>;

  /**
   * Atomically marks the OTP as used so it cannot be replayed.
   * Returns true if successfully marked, false if already used or not found.
   */
  markAsUsed(id: string): Promise<boolean>;

  /**
   * Deletes an OTP record by ID (e.g., rollback if email dispatch fails).
   */
  deleteById(id: string): Promise<boolean>;

  /**
   * Invalidate/remove all OTPs for a given email address.
   */
  deleteByEmail(email: string): Promise<number>;
}

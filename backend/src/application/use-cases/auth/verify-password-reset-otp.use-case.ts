import { PasswordResetOtpModel } from '../../../infrastructure/database/models/password-reset-otp.model';
import { BadRequestError, NotFoundError } from '../../../core/errors/app-error';

export interface VerifyPasswordResetOtpDto {
  email: string;
  otp: string;
}

export class VerifyPasswordResetOtpUseCase {
  public async execute(dto: VerifyPasswordResetOtpDto): Promise<{ valid: boolean; message: string }> {
    const email = dto.email.trim().toLowerCase();
    const otp = dto.otp.trim();

    const record = await PasswordResetOtpModel.findOne({
      email,
      used: false,
    }).sort({ createdAt: -1 });

    if (!record) {
      throw new NotFoundError('No active verification code found for this email.');
    }

    if (new Date() > record.expiresAt) {
      throw new BadRequestError('Verification code has expired. Please request a new one.');
    }

    if (record.attempts >= 5) {
      throw new BadRequestError('Too many invalid attempts. Please request a new verification code.');
    }

    if (record.otp !== otp) {
      record.attempts += 1;
      await record.save();
      throw new BadRequestError('Invalid verification code. Please check and try again.');
    }

    return {
      valid: true,
      message: 'Verification code confirmed successfully.',
    };
  }
}

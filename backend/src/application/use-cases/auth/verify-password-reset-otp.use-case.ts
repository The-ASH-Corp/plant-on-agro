import { IPasswordResetOtpRepository } from '../../../core/interfaces/password-reset-otp.repository.interface';
import { IJwtService } from '../../../core/interfaces/jwt-service.interface';
import { BadRequestError, NotFoundError } from '../../../core/errors/app-error';
import { normalizeEmail } from '../../../shared/utils/string.util';
import { env } from '../../../config/env';

export interface VerifyPasswordResetOtpDto {
  email: string;
  otp: string;
}

export class VerifyPasswordResetOtpUseCase {
  constructor(
    private readonly otpRepository: IPasswordResetOtpRepository,
    private readonly jwtService: IJwtService
  ) {}

  public async execute(
    dto: VerifyPasswordResetOtpDto
  ): Promise<{ valid: boolean; resetToken: string; message: string }> {
    const email = normalizeEmail(dto.email);
    const otp = dto.otp.trim();

    const record = await this.otpRepository.findLatestActiveByEmail(email);

    if (!record) {
      throw new NotFoundError('No active verification code found for this email.');
    }

    if (record.isExpired()) {
      throw new BadRequestError('Verification code has expired. Please request a new one.');
    }

    if (record.isMaxAttemptsExceeded()) {
      throw new BadRequestError('Too many invalid attempts. Please request a new verification code.');
    }

    if (!record.matches(otp, env.JWT_SECRET)) {
      // Atomically increment attempt count in repository to prevent concurrent race-condition bypass
      const currentAttempts = await this.otpRepository.incrementAttempts(record.id!);
      const remaining = Math.max(0, 5 - currentAttempts);

      if (currentAttempts >= 5) {
        throw new BadRequestError('Too many invalid attempts. Please request a new verification code.');
      }

      throw new BadRequestError(
        `Invalid verification code. Please check and try again (${remaining} attempt${remaining === 1 ? '' : 's'} remaining).`
      );
    }

    // Generate cryptographic reset binding token
    const resetToken = this.jwtService.generateResetToken({
      email: record.email,
      otpId: record.id!,
      purpose: 'password_reset',
    });

    // Synchronize DB record expiry with the 15-minute binding token TTL
    const extendedExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await this.otpRepository.saveResetToken(record.id!, resetToken, extendedExpiry);

    return {
      valid: true,
      resetToken,
      message: 'Verification code confirmed successfully.',
    };
  }
}

import { IUserRepository } from '../../../core/interfaces/user.repository.interface';
import { IPasswordResetOtpRepository } from '../../../core/interfaces/password-reset-otp.repository.interface';
import { IPasswordHasher } from '../../../core/interfaces/password-hasher.interface';
import { IMailService } from '../../../core/interfaces/mail-service.interface';
import { IJwtService, ResetPasswordTokenPayload } from '../../../core/interfaces/jwt-service.interface';
import { Password, HashedPassword } from '../../../core/value-objects/password.vo';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../../core/errors/app-error';
import { normalizeEmail } from '../../../shared/utils/string.util';

export interface ResetPasswordWithOtpDto {
  email?: string;
  resetToken: string;
  password: string;
}

export class ResetPasswordWithOtpUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly otpRepository: IPasswordResetOtpRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly mailService: IMailService,
    private readonly jwtService: IJwtService
  ) {}

  public async execute(dto: ResetPasswordWithOtpDto): Promise<{ success: boolean; message: string }> {
    if (!dto.resetToken || typeof dto.resetToken !== 'string') {
      throw new BadRequestError('Verification reset token is required to reset password.');
    }

    const resetToken = dto.resetToken.trim();

    // 1. Verify cryptographic reset token
    let tokenPayload: ResetPasswordTokenPayload;
    try {
      tokenPayload = this.jwtService.verifyResetToken(resetToken);
    } catch {
      throw new UnauthorizedError('Invalid or expired password reset token.');
    }

    // 2. Cross-verify email binding with normalized case-insensitive comparison
    const targetEmail = normalizeEmail(tokenPayload.email);
    if (dto.email && normalizeEmail(dto.email) !== targetEmail) {
      throw new UnauthorizedError('Token is not valid for the provided email address.');
    }

    // 3. Verify OTP record in database
    const record = await this.otpRepository.findById(tokenPayload.otpId);
    if (!record || record.isUsed() || record.resetToken !== resetToken) {
      throw new BadRequestError('Password reset token is invalid or has already been used.');
    }

    if (record.isExpired()) {
      throw new BadRequestError('Password reset token has expired. Please request a new verification code.');
    }

    // 4. Validate user exists (case-insensitive lookup with password hash for comparison)
    const user = await this.userRepository.findByEmailWithPassword(targetEmail);
    if (!user) {
      throw new NotFoundError('Account not found.');
    }

    // 5. Prevent setting new password to existing password
    if (user.passwordHash) {
      const isSamePassword = await this.passwordHasher.verify(user.passwordHash.getValue(), dto.password);
      if (isSamePassword) {
        throw new BadRequestError('New password cannot be the same as your current password.');
      }
    }

    // 6. Atomically consume token FIRST as mutex lock to prevent concurrent replay race conditions
    const invalidated = await this.otpRepository.markAsUsed(record.id!);
    if (!invalidated) {
      throw new BadRequestError('Password reset token has already been used.');
    }

    // 7. Validate and hash new password
    const passwordVO = Password.create(dto.password);
    const rawHashed = await this.passwordHasher.hash(passwordVO.getValue());
    const passwordHashVO = HashedPassword.create(rawHashed);

    // 8. Update user
    user.updatePassword(passwordHashVO);
    await this.userRepository.update(user);

    // 9. Send confirmation email
    await this.mailService.sendPasswordResetSuccessEmail(targetEmail, user.name);

    return {
      success: true,
      message: 'Password has been reset successfully. You can now sign in with your new credentials.',
    };
  }
}

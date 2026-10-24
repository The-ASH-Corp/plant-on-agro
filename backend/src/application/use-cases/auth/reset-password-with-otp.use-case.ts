import { IUserRepository } from '../../../core/interfaces/user.repository.interface';
import { IPasswordResetOtpRepository } from '../../../core/interfaces/password-reset-otp.repository.interface';
import { IPasswordHasher } from '../../../core/interfaces/password-hasher.interface';
import { IMailService } from '../../../core/interfaces/mail-service.interface';
import { Password, HashedPassword } from '../../../core/value-objects/password.vo';
import { BadRequestError, NotFoundError } from '../../../core/errors/app-error';

export interface ResetPasswordWithOtpDto {
  email: string;
  otp: string;
  password: string;
}

export class ResetPasswordWithOtpUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly otpRepository: IPasswordResetOtpRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly mailService: IMailService
  ) {}

  public async execute(dto: ResetPasswordWithOtpDto): Promise<{ success: boolean; message: string }> {
    const email = dto.email.trim().toLowerCase();
    const otp = dto.otp.trim();

    // 1. Validate OTP
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

    if (!record.matches(otp)) {
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

    // 2. Validate user exists
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('Account not found.');
    }

    // 3. Validate and hash new password
    const passwordVO = Password.create(dto.password);
    const rawHashed = await this.passwordHasher.hash(passwordVO.getValue());
    const passwordHashVO = HashedPassword.create(rawHashed);

    // 4. Update user
    user.updatePassword(passwordHashVO);
    await this.userRepository.update(user);

    // 5. Invalidate OTP atomically to prevent replay attacks
    const invalidated = await this.otpRepository.markAsUsed(record.id!);
    if (!invalidated) {
      throw new BadRequestError('Verification code has already been used.');
    }

    // 6. Send confirmation email
    await this.mailService.sendPasswordResetSuccessEmail(email, user.name);

    return {
      success: true,
      message: 'Password has been reset successfully. You can now sign in with your new credentials.',
    };
  }
}

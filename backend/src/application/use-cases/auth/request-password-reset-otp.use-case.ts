import crypto from 'crypto';
import { IUserRepository } from '../../../core/interfaces/user.repository.interface';
import { IPasswordResetOtpRepository } from '../../../core/interfaces/password-reset-otp.repository.interface';
import { IMailService } from '../../../core/interfaces/mail-service.interface';
import { BadRequestError, NotFoundError } from '../../../core/errors/app-error';
import { normalizeEmail } from '../../../shared/utils/string.util';

export interface RequestPasswordResetOtpDto {
  email: string;
}

export class RequestPasswordResetOtpUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly otpRepository: IPasswordResetOtpRepository,
    private readonly mailService: IMailService
  ) {}

  public async execute(dto: RequestPasswordResetOtpDto): Promise<{ success: boolean; message: string }> {
    const email = normalizeEmail(dto.email);

    // 1. Check if email is locked out due to exceeding maximum failed verification attempts
    if (this.otpRepository.isEmailLockedOut && (await this.otpRepository.isEmailLockedOut(email))) {
      throw new BadRequestError(
        'Too many failed attempts. For your security, this account is temporarily locked for password resets. Please try again after 15 minutes.'
      );
    }

    // 2. Check active resend cooldown (60 seconds between OTP requests per email)
    if (this.otpRepository.getCooldownRemainingSeconds) {
      const remainingSec = await this.otpRepository.getCooldownRemainingSeconds(email);
      if (remainingSec > 0) {
        throw new BadRequestError(
          `Please wait ${remainingSec} second${remainingSec === 1 ? '' : 's'} before requesting another verification code.`
        );
      }
    }

    // 3. Check if user exists
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('No account found with this email address.');
    }

    // 4. Generate 6-digit cryptographic OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresInMinutes = 10;
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    // 5. Create fresh OTP record in Redis with exact TTL
    const otpRecord = await this.otpRepository.createOtp(email, otp, expiresAt);

    // 6. Dispatch email with OTP
    const dispatched = await this.mailService.sendOtpEmail(email, user.name, otp, expiresInMinutes);
    if (!dispatched) {
      if (otpRecord.id) {
        await this.otpRepository.deleteById(otpRecord.id);
      }
      if (this.otpRepository.clearCooldown) {
        await this.otpRepository.clearCooldown(email);
      }
      throw new BadRequestError('Failed to dispatch verification code email. Please check your email service or try again later.');
    }

    return {
      success: true,
      message: `A 6-digit verification code has been sent to ${email}.`,
    };
  }
}

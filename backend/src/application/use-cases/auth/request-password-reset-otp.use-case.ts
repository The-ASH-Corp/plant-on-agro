import crypto from 'crypto';
import { IUserRepository } from '../../../core/interfaces/user.repository.interface';
import { IMailService } from '../../../core/interfaces/mail-service.interface';
import { PasswordResetOtpModel } from '../../../infrastructure/database/models/password-reset-otp.model';
import { BadRequestError, NotFoundError } from '../../../core/errors/app-error';

export interface RequestPasswordResetOtpDto {
  email: string;
}

export class RequestPasswordResetOtpUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly mailService: IMailService
  ) {}

  public async execute(dto: RequestPasswordResetOtpDto): Promise<{ success: boolean; message: string }> {
    const email = dto.email.trim().toLowerCase();

    // Check if user exists
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // In accordance with security practices, avoid leaking whether the user exists,
      // but return an explicit user-friendly response or throw NotFound if explicit check preferred.
      throw new NotFoundError('No account found with this email address.');
    }

    // Generate 6-digit cryptographic OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresInMinutes = 10;
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    // Invalidate any existing unused OTPs for this email and save new one
    await PasswordResetOtpModel.deleteMany({ email });
    const otpRecord = await PasswordResetOtpModel.create({
      email,
      otp,
      expiresAt,
      used: false,
      attempts: 0,
    });

    // Dispatch email
    const dispatched = await this.mailService.sendOtpEmail(email, user.name, otp, expiresInMinutes);
    if (!dispatched) {
      // Rollback created OTP record so user is not stuck with an undelivered code
      await PasswordResetOtpModel.deleteOne({ _id: otpRecord._id });
      throw new BadRequestError('Failed to dispatch verification code email. Please check your email service or try again later.');
    }

    return {
      success: true,
      message: `A 6-digit verification code has been sent to ${email}.`,
    };
  }
}

import { IUserRepository } from '../../../core/interfaces/user.repository.interface';
import { IPasswordHasher } from '../../../core/interfaces/password-hasher.interface';
import { IMailService } from '../../../core/interfaces/mail-service.interface';
import { PasswordResetOtpModel } from '../../../infrastructure/database/models/password-reset-otp.model';
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
    private readonly passwordHasher: IPasswordHasher,
    private readonly mailService: IMailService
  ) {}

  public async execute(dto: ResetPasswordWithOtpDto): Promise<{ success: boolean; message: string }> {
    const email = dto.email.trim().toLowerCase();
    const otp = dto.otp.trim();

    // 1. Validate OTP
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
      throw new BadRequestError('Invalid verification code.');
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

    // 5. Invalidate OTP
    record.used = true;
    await record.save();

    // 6. Send confirmation email
    await this.mailService.sendPasswordResetSuccessEmail(email, user.name);

    return {
      success: true,
      message: 'Password has been reset successfully. You can now sign in with your new credentials.',
    };
  }
}

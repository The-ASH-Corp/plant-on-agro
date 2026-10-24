import { PasswordResetOtp } from '../../../core/entities/password-reset-otp.entity';
import { IPasswordResetOtpDocument } from '../models/password-reset-otp.model';

export class PasswordResetOtpMapper {
  public static toDomain(doc: IPasswordResetOtpDocument): PasswordResetOtp {
    return new PasswordResetOtp({
      id: doc._id ? String(doc._id) : undefined,
      email: doc.email,
      otp: doc.otp,
      expiresAt: doc.expiresAt,
      used: doc.used,
      attempts: doc.attempts,
      resetToken: doc.resetToken,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  public static toPersistence(entity: PasswordResetOtp): Partial<IPasswordResetOtpDocument> {
    return {
      email: entity.email,
      otp: entity.otp,
      expiresAt: entity.expiresAt,
      used: entity.used,
      attempts: entity.attempts,
      resetToken: entity.resetToken,
    };
  }
}

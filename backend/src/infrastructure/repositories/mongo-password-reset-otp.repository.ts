import { IPasswordResetOtpRepository } from '../../core/interfaces/password-reset-otp.repository.interface';
import { PasswordResetOtp } from '../../core/entities/password-reset-otp.entity';
import { PasswordResetOtpModel } from '../database/models/password-reset-otp.model';
import { PasswordResetOtpMapper } from '../database/mappers/password-reset-otp.mapper';
import { Nullable } from '../../shared/types';

export class MongoPasswordResetOtpRepository implements IPasswordResetOtpRepository {
  public async createOtp(email: string, otp: string, expiresAt: Date): Promise<PasswordResetOtp> {
    const normalizedEmail = email.trim().toLowerCase();

    // Invalidate any existing unused OTPs for this email address
    await PasswordResetOtpModel.deleteMany({ email: normalizedEmail }).exec();

    const doc = await PasswordResetOtpModel.create({
      email: normalizedEmail,
      otp: otp.trim(),
      expiresAt,
      used: false,
      attempts: 0,
    });

    return PasswordResetOtpMapper.toDomain(doc);
  }

  public async findLatestActiveByEmail(email: string): Promise<Nullable<PasswordResetOtp>> {
    const doc = await PasswordResetOtpModel.findOne({
      email: email.trim().toLowerCase(),
      used: false,
    })
      .sort({ createdAt: -1 })
      .exec();

    if (!doc) return null;
    return PasswordResetOtpMapper.toDomain(doc);
  }

  public async findById(id: string): Promise<Nullable<PasswordResetOtp>> {
    const doc = await PasswordResetOtpModel.findById(id).exec();
    if (!doc) return null;
    return PasswordResetOtpMapper.toDomain(doc);
  }

  public async findByResetToken(resetToken: string): Promise<Nullable<PasswordResetOtp>> {
    const doc = await PasswordResetOtpModel.findOne({
      resetToken,
      used: false,
    }).exec();

    if (!doc) return null;
    return PasswordResetOtpMapper.toDomain(doc);
  }

  public async saveResetToken(id: string, resetToken: string): Promise<boolean> {
    const result = await PasswordResetOtpModel.findByIdAndUpdate(
      id,
      { $set: { resetToken } }
    ).exec();

    return !!result;
  }

  public async incrementAttempts(id: string): Promise<number> {
    const updated = await PasswordResetOtpModel.findByIdAndUpdate(
      id,
      { $inc: { attempts: 1 } },
      { returnDocument: 'after' }
    ).exec();

    return updated?.attempts ?? 1;
  }

  public async markAsUsed(id: string): Promise<boolean> {
    const result = await PasswordResetOtpModel.findOneAndUpdate(
      { _id: id, used: false },
      { $set: { used: true } }
    ).exec();

    return !!result;
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await PasswordResetOtpModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  public async deleteByEmail(email: string): Promise<number> {
    const result = await PasswordResetOtpModel.deleteMany({
      email: email.trim().toLowerCase(),
    }).exec();

    return result.deletedCount || 0;
  }
}

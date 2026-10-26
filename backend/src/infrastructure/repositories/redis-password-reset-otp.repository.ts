import crypto from 'crypto';
import { IPasswordResetOtpRepository } from '../../core/interfaces/password-reset-otp.repository.interface';
import { PasswordResetOtp } from '../../core/entities/password-reset-otp.entity';
import { Nullable } from '../../shared/types';
import { normalizeEmail } from '../../shared/utils/string.util';
import { redisService } from '../redis/redis.client';
import { env } from '../../config/env';
import { PasswordResetOtpModel } from '../database/models/password-reset-otp.model';

interface RedisOtpPayload {
  id: string;
  email: string;
  otpHash: string;
  expiresAt: string;
  used: boolean;
  attempts: number;
  resetToken?: string;
  createdAt: string;
}

export class RedisPasswordResetOtpRepository implements IPasswordResetOtpRepository {
  private readonly client = redisService.getClient();
  private readonly prefix = 'poa:otp:';

  private emailKey(email: string): string {
    return `${this.prefix}email:${normalizeEmail(email)}`;
  }

  private idKey(id: string): string {
    return `${this.prefix}id:${id.trim()}`;
  }

  private tokenKey(token: string): string {
    return `${this.prefix}token:${token.trim()}`;
  }

  private cooldownKey(email: string): string {
    return `${this.prefix}cooldown:${normalizeEmail(email)}`;
  }

  private lockoutKey(email: string): string {
    return `${this.prefix}lockout:${normalizeEmail(email)}`;
  }

  private hashOtp(email: string, rawOtp: string): string {
    const salt = env.JWT_SECRET || 'poa_secure_otp_salt_2026';
    const hash = crypto
      .createHmac('sha256', salt)
      .update(`${normalizeEmail(email)}:${rawOtp.trim()}`)
      .digest('hex');
    return `sha256:${hash}`;
  }

  public async isEmailLockedOut(email: string): Promise<boolean> {
    const exists = await this.client.exists(this.lockoutKey(email));
    return exists === 1;
  }

  public async getCooldownRemainingSeconds(email: string): Promise<number> {
    const ttl = await this.client.ttl(this.cooldownKey(email));
    return ttl > 0 ? ttl : 0;
  }

  public async setCooldown(email: string, seconds = 60): Promise<void> {
    await this.client.set(this.cooldownKey(email), Date.now().toString(), 'EX', seconds);
  }

  public async clearCooldown(email: string): Promise<void> {
    await this.client.del(this.cooldownKey(email));
  }

  public async lockoutEmail(email: string, seconds = 900): Promise<void> {
    await this.client.set(this.lockoutKey(email), Date.now().toString(), 'EX', seconds);
  }

  public async createOtp(email: string, otp: string, expiresAt: Date): Promise<PasswordResetOtp> {
    const normalizedEmail = normalizeEmail(email);
    const id = `otp_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
    const ttlSeconds = Math.max(1, Math.ceil((expiresAt.getTime() - Date.now()) / 1000));
    const otpHash = this.hashOtp(normalizedEmail, otp);

    const payload: RedisOtpPayload = {
      id,
      email: normalizedEmail,
      otpHash,
      expiresAt: expiresAt.toISOString(),
      used: false,
      attempts: 0,
      createdAt: new Date().toISOString(),
    };

    // 1. Invalidate any existing OTP keys for this email
    await this.deleteByEmail(normalizedEmail);

    // 2. Atomically store OTP in Redis with exact TTL
    const pipeline = this.client.pipeline();
    pipeline.set(this.emailKey(normalizedEmail), JSON.stringify(payload), 'EX', ttlSeconds);
    pipeline.set(this.idKey(id), normalizedEmail, 'EX', ttlSeconds);
    // Set 60-second cooldown to prevent flooding
    pipeline.set(this.cooldownKey(normalizedEmail), Date.now().toString(), 'EX', 60);
    await pipeline.exec();

    // 3. Background audit log in MongoDB (non-blocking)
    PasswordResetOtpModel.deleteMany({ email: normalizedEmail })
      .then(() =>
        PasswordResetOtpModel.create({
          email: normalizedEmail,
          otp: otpHash,
          expiresAt,
          used: false,
          attempts: 0,
        })
      )
      .catch((err) => console.warn('⚠️ [MongoDB Audit Log] Failed to record OTP audit:', err.message));

    return new PasswordResetOtp({
      id,
      email: normalizedEmail,
      otp: otpHash,
      expiresAt,
      used: false,
      attempts: 0,
      createdAt: new Date(payload.createdAt),
      updatedAt: new Date(payload.createdAt),
    });
  }

  public async findLatestActiveByEmail(email: string): Promise<Nullable<PasswordResetOtp>> {
    const normalizedEmail = normalizeEmail(email);

    // If locked out, return null immediately
    if (await this.isEmailLockedOut(normalizedEmail)) {
      return null;
    }

    const raw = await this.client.get(this.emailKey(normalizedEmail));
    if (!raw) return null;

    try {
      const payload = JSON.parse(raw) as RedisOtpPayload;
      if (payload.used || new Date(payload.expiresAt).getTime() <= Date.now()) {
        return null;
      }

      return new PasswordResetOtp({
        id: payload.id,
        email: payload.email,
        otp: payload.otpHash,
        expiresAt: new Date(payload.expiresAt),
        used: payload.used,
        attempts: payload.attempts,
        resetToken: payload.resetToken,
        createdAt: new Date(payload.createdAt),
      });
    } catch {
      return null;
    }
  }

  public async findById(id: string): Promise<Nullable<PasswordResetOtp>> {
    const email = await this.client.get(this.idKey(id));
    if (!email) {
      // Check MongoDB as fallback
      const mongoDoc = await PasswordResetOtpModel.findById(id).exec().catch(() => null);
      if (mongoDoc) {
        return new PasswordResetOtp({
          id: mongoDoc._id.toString(),
          email: mongoDoc.email,
          otp: mongoDoc.otp,
          expiresAt: mongoDoc.expiresAt,
          used: mongoDoc.used,
          attempts: mongoDoc.attempts,
          resetToken: mongoDoc.resetToken,
          createdAt: mongoDoc.createdAt,
        });
      }
      return null;
    }

    // Try finding by active OTP
    const active = await this.findLatestActiveByEmail(email);
    if (active && active.id === id) return active;

    // Check if it exists as an active resetToken payload
    const tokenPayloadRaw = await this.client.get(`${this.prefix}token_by_id:${id}`);
    if (tokenPayloadRaw) {
      try {
        const p = JSON.parse(tokenPayloadRaw) as RedisOtpPayload;
        return new PasswordResetOtp({
          id: p.id,
          email: p.email,
          otp: p.otpHash,
          expiresAt: new Date(p.expiresAt),
          used: p.used,
          attempts: p.attempts,
          resetToken: p.resetToken,
          createdAt: new Date(p.createdAt),
        });
      } catch {
        return null;
      }
    }

    return null;
  }

  public async findByResetToken(resetToken: string): Promise<Nullable<PasswordResetOtp>> {
    const raw = await this.client.get(this.tokenKey(resetToken));
    if (!raw) return null;

    try {
      const payload = JSON.parse(raw) as RedisOtpPayload;
      if (payload.used || new Date(payload.expiresAt).getTime() <= Date.now()) {
        return null;
      }

      return new PasswordResetOtp({
        id: payload.id,
        email: payload.email,
        otp: payload.otpHash,
        expiresAt: new Date(payload.expiresAt),
        used: payload.used,
        attempts: payload.attempts,
        resetToken: payload.resetToken,
        createdAt: new Date(payload.createdAt),
      });
    } catch {
      return null;
    }
  }

  public async saveResetToken(id: string, resetToken: string, newExpiresAt?: Date): Promise<boolean> {
    const email = await this.client.get(this.idKey(id));
    if (!email) return false;

    const expiresAt = newExpiresAt || new Date(Date.now() + 15 * 60 * 1000);
    const ttlSeconds = Math.max(1, Math.ceil((expiresAt.getTime() - Date.now()) / 1000));

    const tokenPayload: RedisOtpPayload = {
      id,
      email,
      otpHash: 'CONSUMED',
      expiresAt: expiresAt.toISOString(),
      used: false,
      attempts: 0,
      resetToken,
      createdAt: new Date().toISOString(),
    };

    const pipeline = this.client.pipeline();
    // 1. Delete the raw OTP key so it can never be verified again
    pipeline.del(this.emailKey(email));
    // 2. Store the reset token with 15-minute binding TTL
    pipeline.set(this.tokenKey(resetToken), JSON.stringify(tokenPayload), 'EX', ttlSeconds);
    pipeline.set(`${this.prefix}token_by_id:${id}`, JSON.stringify(tokenPayload), 'EX', ttlSeconds);
    pipeline.set(this.idKey(id), email, 'EX', ttlSeconds);
    await pipeline.exec();

    // Async MongoDB update
    PasswordResetOtpModel.findOneAndUpdate(
      { email },
      { $set: { resetToken, expiresAt, used: false } }
    ).catch(() => {});

    return true;
  }

  public async incrementAttempts(id: string): Promise<number> {
    const email = await this.client.get(this.idKey(id));
    if (!email) return 5;

    const raw = await this.client.get(this.emailKey(email));
    if (!raw) return 5;

    let payload: RedisOtpPayload;
    try {
      payload = JSON.parse(raw);
    } catch {
      return 5;
    }

    payload.attempts = (payload.attempts || 0) + 1;
    const ttl = await this.client.ttl(this.emailKey(email));

    if (payload.attempts >= 5) {
      // Exceeded max attempts: delete OTP immediately and lock out email for 15 minutes
      const pipeline = this.client.pipeline();
      pipeline.del(this.emailKey(email));
      pipeline.del(this.idKey(id));
      pipeline.set(this.lockoutKey(email), Date.now().toString(), 'EX', 900); // 15 min lockout
      await pipeline.exec();

      // Async MongoDB update
      PasswordResetOtpModel.deleteMany({ email }).catch(() => {});

      return payload.attempts;
    }

    // Save incremented attempts with original remaining TTL
    if (ttl > 0) {
      await this.client.set(this.emailKey(email), JSON.stringify(payload), 'EX', ttl);
    }

    // Async MongoDB update
    PasswordResetOtpModel.findByIdAndUpdate(id, { $inc: { attempts: 1 } }).catch(() => {});

    return payload.attempts;
  }

  public async markAsUsed(id: string): Promise<boolean> {
    const tokenKeyById = `${this.prefix}token_by_id:${id}`;
    // Atomic GETDEL guarantees single-use consumption even under concurrent requests
    const tokenPayloadRaw = await this.client.getdel(tokenKeyById);
    if (!tokenPayloadRaw) {
      // Token was already consumed, expired, or does not exist
      return false;
    }

    let token: string | undefined;
    let email: string | undefined;

    try {
      const parsed = JSON.parse(tokenPayloadRaw);
      token = parsed.resetToken;
      email = parsed.email;
    } catch {}

    const pipeline = this.client.pipeline();
    if (token) {
      pipeline.del(this.tokenKey(token));
    }
    pipeline.del(this.idKey(id));
    if (email) {
      pipeline.del(this.emailKey(email));
      pipeline.del(this.cooldownKey(email));
    }
    await pipeline.exec();

    // Async MongoDB audit update
    PasswordResetOtpModel.findByIdAndUpdate(id, { $set: { used: true } }).catch(() => {});

    return true;
  }

  public async deleteById(id: string): Promise<boolean> {
    const email = await this.client.get(this.idKey(id));
    const pipeline = this.client.pipeline();
    pipeline.del(this.idKey(id));
    pipeline.del(`${this.prefix}token_by_id:${id}`);
    if (email) {
      pipeline.del(this.emailKey(email));
      pipeline.del(this.cooldownKey(email));
    }
    await pipeline.exec();

    // Async MongoDB cleanup
    PasswordResetOtpModel.findByIdAndDelete(id).catch(() => {});

    return true;
  }

  public async deleteByEmail(email: string): Promise<number> {
    const normalizedEmail = normalizeEmail(email);
    const raw = await this.client.get(this.emailKey(normalizedEmail));
    const pipeline = this.client.pipeline();

    pipeline.del(this.emailKey(normalizedEmail));
    pipeline.del(this.cooldownKey(normalizedEmail));

    if (raw) {
      try {
        const payload = JSON.parse(raw);
        if (payload.id) {
          pipeline.del(this.idKey(payload.id));
          pipeline.del(`${this.prefix}token_by_id:${payload.id}`);
        }
        if (payload.resetToken) {
          pipeline.del(this.tokenKey(payload.resetToken));
        }
      } catch {}
    }

    const results = await pipeline.exec();
    const deletedCount = results ? results.filter((r) => r[1] === 1).length : 0;

    // Async MongoDB cleanup
    PasswordResetOtpModel.deleteMany({ email: normalizedEmail }).catch(() => {});

    return deletedCount;
  }
}

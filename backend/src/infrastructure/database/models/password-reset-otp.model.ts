import mongoose, { Document, Schema } from 'mongoose';

export interface IPasswordResetOtpDocument extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  used: boolean;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const PasswordResetOtpSchema = new Schema<IPasswordResetOtpDocument>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'password_reset_otps',
  }
);

// TTL Index: Automatically remove documents after expiresAt has passed
PasswordResetOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordResetOtpModel = mongoose.model<IPasswordResetOtpDocument>(
  'PasswordResetOtp',
  PasswordResetOtpSchema
);

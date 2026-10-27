import mongoose, { Document, Schema } from 'mongoose';

export interface IPasswordResetOtpDocument extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  used: boolean;
  attempts: number;
  resetToken?: string;
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
    resetToken: {
      type: String,
      required: false,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'password_reset_otps',
  }
);

// Ensure email is always trimmed and lowercase on save
PasswordResetOtpSchema.pre('save', function () {
  if (this.email) {
    this.email = this.email.trim().toLowerCase();
  }
});

// Ensure email is always trimmed and lowercase on findOneAndUpdate
PasswordResetOtpSchema.pre('findOneAndUpdate', function () {
  const update = this.getUpdate() as Record<string, any>;
  if (!update) return;
  if (typeof update.email === 'string') {
    update.email = update.email.trim().toLowerCase();
  }
  if (update.$set && typeof update.$set.email === 'string') {
    update.$set.email = update.$set.email.trim().toLowerCase();
  }
});

// TTL Index: Automatically remove documents after expiresAt has passed
PasswordResetOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordResetOtpModel = mongoose.model<IPasswordResetOtpDocument>(
  'PasswordResetOtp',
  PasswordResetOtpSchema
);

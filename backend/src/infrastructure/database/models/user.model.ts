import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'buyer';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: false,
      select: false, 
    },
    role: {
      type: String,
      enum: ['admin', 'buyer'],
      default: 'buyer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Ensure email is always trimmed and lowercase on save
UserSchema.pre('save', function () {
  if (this.email) {
    this.email = this.email.trim().toLowerCase();
  }
});

// Ensure email is always trimmed and lowercase on findOneAndUpdate
UserSchema.pre('findOneAndUpdate', function () {
  const update = this.getUpdate() as Record<string, any>;
  if (!update) return;
  if (typeof update.email === 'string') {
    update.email = update.email.trim().toLowerCase();
  }
  if (update.$set && typeof update.$set.email === 'string') {
    update.$set.email = update.$set.email.trim().toLowerCase();
  }
});

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);

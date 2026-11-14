import mongoose, { Schema, Document } from 'mongoose';

export interface IWaitlistDocument extends Document {
  email: string;
  phoneNumber: string;
  name?: string;
  source: string;
  status: 'pending' | 'contacted' | 'admitted';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WaitlistSchema = new Schema<IWaitlistDocument>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    source: {
      type: String,
      default: 'adoption_packages_section',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'admitted'],
      default: 'pending',
      index: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

WaitlistSchema.index({ email: 1 });
WaitlistSchema.index({ createdAt: -1 });

export const WaitlistModel = mongoose.model<IWaitlistDocument>(
  'Waitlist',
  WaitlistSchema
);


import mongoose, { Schema, Document } from 'mongoose';

export interface IExperienceDocument extends Document {
  title: string;
  slug: string;
  category: string;
  tagline: string;
  description: string;
  location: string;
  duration: string;
  price: number;
  included: string[];
  galleryImages: string[];
  featuredImage: string;
  maxGroupSize: number;
  rating: number;
  reviewsCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperienceDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Forest Walk', 'Harvesting', 'Wellness', 'Heritage Stay', 'Farm Experience', 'Adventure'],
      default: 'Forest Walk',
      index: true,
    },
    tagline: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    duration: {
      type: String,
      required: true,
      default: '3 Hours',
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    included: {
      type: [String],
      default: [],
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    featuredImage: {
      type: String,
      default: '',
      trim: true,
    },
    maxGroupSize: {
      type: Number,
      default: 15,
      min: 1,
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 12,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'experiences',
  }
);

ExperienceSchema.index({ title: 'text', description: 'text', location: 'text', tagline: 'text' });

export const ExperienceModel = mongoose.model<IExperienceDocument>(
  'Experience',
  ExperienceSchema
);

import mongoose, { Schema, Document } from 'mongoose';
import { LocationStatus } from '../../../core/entities/location.entity';

export interface ILocationDocument extends Document {
  name: string;
  region: string;
  gps: string;
  areaHectares: number;
  capacity: number;
  treesPlanted: number;
  survivalRate: string;
  ndviScore: number;
  soilHealth: string;
  image: string;
  status: LocationStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocationDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },
    region: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    gps: {
      type: String,
      required: true,
      trim: true,
    },
    areaHectares: {
      type: Number,
      required: true,
      min: 0,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    treesPlanted: {
      type: Number,
      default: 0,
      min: 0,
    },
    survivalRate: {
      type: String,
      default: '99.0%',
      trim: true,
    },
    ndviScore: {
      type: Number,
      default: 0.88,
    },
    soilHealth: {
      type: String,
      default: 'Optimal Loam (pH 6.5, Moisture 35%)',
      trim: true,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Expanding', 'Full'],
      default: 'Active',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'locations',
  }
);

LocationSchema.index({ name: 'text', region: 'text', gps: 'text', soilHealth: 'text' });

export const LocationModel = mongoose.model<ILocationDocument>('Location', LocationSchema);

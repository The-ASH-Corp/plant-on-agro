import mongoose, { Schema, Document } from 'mongoose';
import { OccasionDedication } from '../../../core/entities/adoption-plan.entity';

export interface IAdoptionPlanDocument extends Document {
  planLabel: string;
  icon: string;
  priceModifier: number;
  description: string;
  features: string[];
  occasionDedications: OccasionDedication[];
  badge: string;
  activeCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdoptionPlanSchema = new Schema<IAdoptionPlanDocument>(
  {
    planLabel: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    icon: {
      type: String,
      required: true,
      trim: true,
      default: '🌱',
    },
    priceModifier: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    occasionDedications: {
      type: [String],
      enum: ['birthday', 'memorial', 'anniversary', 'corporate', 'general'],
      default: ['general'],
      index: true,
    },
    badge: {
      type: String,
      default: 'Standard',
      trim: true,
    },
    activeCount: {
      type: Number,
      default: 0,
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
  }
);

export const AdoptionPlanModel = mongoose.model<IAdoptionPlanDocument>(
  'AdoptionPlan',
  AdoptionPlanSchema
);

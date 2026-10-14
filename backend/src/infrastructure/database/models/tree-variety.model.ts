import mongoose, { Schema, Document } from 'mongoose';
import { TreeCategory } from '../../../core/entities/tree-variety.entity';

export interface ITreeVarietyDocument extends Document {
  commonName: string;
  scientificName: string;
  category: TreeCategory;
  price: number;
  co2AbsorptionRateKgYear: number;
  growthTimeline: string;
  careRequirements: string;
  coverImages: string[];
  location: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TreeVarietySchema = new Schema<ITreeVarietyDocument>(
  {
    commonName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    scientificName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: [
        'Fruit Trees',
        'Timber Trees',
        'Medicinal',
        'Native Trees',
        'Shade Trees',
        'Occasion',
      ],
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    co2AbsorptionRateKgYear: {
      type: Number,
      required: true,
      min: 0,
      default: 20,
    },
    growthTimeline: {
      type: String,
      required: true,
      trim: true,
      default: '10–15 m in 5 years',
    },
    careRequirements: {
      type: String,
      required: true,
      trim: true,
      default: 'Regular watering in early stages and adequate sunlight',
    },
    coverImages: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      default: 'Western Ghats, Maharashtra',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
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

export const TreeVarietyModel = mongoose.model<ITreeVarietyDocument>(
  'TreeVariety',
  TreeVarietySchema
);

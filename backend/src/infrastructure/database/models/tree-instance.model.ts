import mongoose, { Schema, Document } from 'mongoose';
import { TreeHealthStatus } from '../../../core/entities/tree-instance.entity';

export interface ITreeGrowthUpdateDocument {
  _id?: mongoose.Types.ObjectId;
  imageUrl: string;
  stageName: string;
  notes: string;
  recordedAt: Date;
  heightCm?: number | null;
}

export interface ITreeInstanceDocument extends Document {
  treeTag: string;
  orderRef: string;
  assignedReserve: string;
  gpsCoordinates: {
    latitude: number;
    longitude: number;
  };
  datePlanted: Date;
  healthStatus: TreeHealthStatus;
  treeVarietyName: string;
  adopterName: string;
  adopterEmail: string;
  notes: string;
  imageUrl: string;
  growthUpdates: ITreeGrowthUpdateDocument[];
  lastInspectedAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TreeInstanceSchema = new Schema<ITreeInstanceDocument>(
  {
    treeTag: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    orderRef: {
      type: String,
      default: '',
      trim: true,
      index: true,
    },
    assignedReserve: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    gpsCoordinates: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },
    },
    datePlanted: {
      type: Date,
      required: true,
    },
    healthStatus: {
      type: String,
      enum: ['Healthy', 'Thriving', 'Needs Attention', 'Critical', 'Sapling Growing'],
      default: 'Sapling Growing',
      index: true,
    },
    treeVarietyName: {
      type: String,
      default: '',
      trim: true,
    },
    adopterName: {
      type: String,
      default: '',
      trim: true,
    },
    adopterEmail: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    growthUpdates: [
      {
        imageUrl: {
          type: String,
          required: true,
          trim: true,
        },
        stageName: {
          type: String,
          default: 'Vegetative Growth',
          trim: true,
        },
        notes: {
          type: String,
          default: '',
          trim: true,
        },
        recordedAt: {
          type: Date,
          default: Date.now,
        },
        heightCm: {
          type: Number,
          default: null,
        },
      },
    ],
    lastInspectedAt: {
      type: Date,
      default: null,
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

export const TreeInstanceModel = mongoose.model<ITreeInstanceDocument>(
  'TreeInstance',
  TreeInstanceSchema
);

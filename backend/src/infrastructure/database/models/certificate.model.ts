import mongoose, { Schema, Document } from 'mongoose';
import { CertificateStatus } from '../../../core/entities/certificate.entity';

export interface ICertificateDocument extends Document {
  certificateNumber: string;
  certificateHash: string;
  orderRef: string;
  recipientName: string;
  dedicatedMessage: string;
  issueDate: Date;
  pdfUrl: string;
  qrCodeVerificationUrl: string;
  treeTag: string;
  treeSpecies: string;
  reserveName: string;
  adopterName: string;
  status: CertificateStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificateDocument>(
  {
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    certificateHash: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    orderRef: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    recipientName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    dedicatedMessage: {
      type: String,
      required: true,
      trim: true,
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    pdfUrl: {
      type: String,
      default: '',
      trim: true,
    },
    qrCodeVerificationUrl: {
      type: String,
      default: '',
      trim: true,
    },
    treeTag: {
      type: String,
      default: '',
      trim: true,
      uppercase: true,
    },
    treeSpecies: {
      type: String,
      default: '',
      trim: true,
    },
    reserveName: {
      type: String,
      default: '',
      trim: true,
    },
    adopterName: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Issued', 'Pending Generation', 'Revoked'],
      default: 'Issued',
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
    versionKey: false,
  }
);

export const CertificateModel = mongoose.model<ICertificateDocument>(
  'Certificate',
  CertificateSchema
);

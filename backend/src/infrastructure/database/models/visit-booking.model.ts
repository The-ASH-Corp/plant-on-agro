import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitMemoryDocument {
  imageUrl: string;
  caption: string;
  recordedAt: Date;
}

export interface IVisitBookingDocument extends Document {
  bookingReference: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone: string;
  experienceId?: string;
  experienceTitle: string;
  reserveName: string;
  visitDate: string;
  timeSlot: string;
  numberOfGuests: number;
  associatedTrees: string[];
  specialRequests: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  guestPassCode: string;
  guideName: string;
  notes: string;
  memories: IVisitMemoryDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const VisitMemorySchema = new Schema<IVisitMemoryDocument>(
  {
    imageUrl: { type: String, required: true, trim: true },
    caption: { type: String, default: '', trim: true },
    recordedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const VisitBookingSchema = new Schema<IVisitBookingDocument>(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    adopterName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    adopterEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    adopterPhone: {
      type: String,
      default: '',
      trim: true,
    },
    experienceId: {
      type: String,
      default: '',
      trim: true,
      index: true,
    },
    experienceTitle: {
      type: String,
      default: 'General Plantation Visit',
      trim: true,
    },
    reserveName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    visitDate: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    timeSlot: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfGuests: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    associatedTrees: {
      type: [String],
      default: [],
    },
    specialRequests: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Confirmed',
      index: true,
    },
    guestPassCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    guideName: {
      type: String,
      default: '',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    memories: {
      type: [VisitMemorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'visitbookings',
  }
);

VisitBookingSchema.index({ bookingReference: 'text', adopterName: 'text', adopterEmail: 'text', reserveName: 'text' });

export const VisitBookingModel = mongoose.model<IVisitBookingDocument>(
  'VisitBooking',
  VisitBookingSchema
);

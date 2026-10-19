import mongoose, { Schema, Document } from 'mongoose';
import {
  AdoptionOrderStatus,
  PaymentStatus,
  OrderItem,
  BillingAddress,
} from '../../../core/entities/order.entity';

export interface IOrderDocument extends Document {
  orderNumber: string;
  invoiceNumber: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone: string;
  billingAddress: BillingAddress;
  items: OrderItem[];
  treeSpecies: string;
  scientificName: string;
  category: string;
  reserveName: string;
  gpsCoords: string;
  planType: string;
  dedicationMessage: string;
  quantity: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  transactionRef: string;
  status: AdoptionOrderStatus;
  certificateId: string;
  ndviScore: number;
  isRead: boolean;
  notes: string;
  datePlanted: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    treeVarietyId: { type: String, default: '' },
    treeSpecies: { type: String, required: true, trim: true },
    scientificName: { type: String, default: '', trim: true },
    category: { type: String, default: 'Fruit Trees', trim: true },
    planType: { type: String, required: true, trim: true },
    reserveName: { type: String, required: true, trim: true },
    gpsCoords: { type: String, default: '', trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const BillingAddressSchema = new Schema<BillingAddress>(
  {
    street: { type: String, default: '', trim: true },
    city: { type: String, default: '', trim: true },
    state: { type: String, default: '', trim: true },
    country: { type: String, default: 'India', trim: true },
    postalCode: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    invoiceNumber: {
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
    billingAddress: {
      type: BillingAddressSchema,
      default: () => ({}),
    },
    items: {
      type: [OrderItemSchema],
      default: [],
    },
    treeSpecies: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    scientificName: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      default: 'Fruit Trees',
      trim: true,
      index: true,
    },
    reserveName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    gpsCoords: {
      type: String,
      default: '',
      trim: true,
    },
    planType: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    dedicationMessage: {
      type: String,
      default: '',
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      default: 'sandbox',
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid',
      index: true,
    },
    transactionRef: {
      type: String,
      default: '',
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        'New Request',
        'Verified & Tagged',
        'Planted',
        'Pending Drone Scan',
        'Certificate Issued',
        'Completed',
      ],
      default: 'New Request',
      index: true,
    },
    certificateId: {
      type: String,
      default: '',
      trim: true,
      index: true,
    },
    ndviScore: {
      type: Number,
      default: 0.91,
      min: 0,
      max: 1,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    datePlanted: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Explicitly register with collection name 'adoptionorders'
export const OrderModel = mongoose.model<IOrderDocument>(
  'AdoptionOrder',
  OrderSchema,
  'adoptionorders'
);

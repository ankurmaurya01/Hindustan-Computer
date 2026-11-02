import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

export interface IOrderStatusHistory {
  status: string;
  timestamp: Date;
  note?: string;
  updatedBy?: string;
}

export interface IOrder extends Document<string> {
  _id: string;
  orderNumber: string;
  customer: {
    userId?: string;
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    state: string;
    pinCode: string;
  };
  billingAddress?: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    state: string;
    pinCode: string;
    gstin?: string;
  };
  items: IOrderItem[];
  financials: {
    subtotal: number;
    discount: number;
    couponCode?: string;
    shipping: number;
    gst: number;
    total: number;
  };
  payment: {
    method: string;
    transactionId?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    status: string;
    paidAt?: Date;
  };
  status: string;
  tracking: {
    courier?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    shippedAt?: Date;
    deliveredAt?: Date;
  };
  statusHistory: IOrderStatusHistory[];
  internalNotes?: string;
  returnReason?: string;
  returnStatus?: 'none' | 'requested' | 'approved' | 'rejected' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    _id: { type: String, default: () => 'ord_' + Date.now() },
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      userId: { type: String },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String, default: '' },
      landmark: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
    },
    billingAddress: {
      fullName: { type: String },
      phone: { type: String },
      addressLine1: { type: String },
      addressLine2: { type: String, default: '' },
      landmark: { type: String, default: '' },
      city: { type: String },
      state: { type: String },
      pinCode: { type: String },
      gstin: { type: String, default: '' },
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        sku: { type: String, required: true },
        image: { type: String, default: '' },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    financials: {
      subtotal: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      couponCode: { type: String, default: '' },
      shipping: { type: Number, default: 0 },
      gst: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
    payment: {
      method: {
        type: String,
        default: 'Pay at Store',
      },
      transactionId: { type: String, default: '' },
      razorpayOrderId: { type: String, default: '' },
      razorpayPaymentId: { type: String, default: '' },
      razorpaySignature: { type: String, default: '' },
      status: {
        type: String,
        default: 'pending_pickup',
      },
      paidAt: { type: Date },
    },
    status: {
      type: String,
      default: 'Pickup Requested',
    },
    tracking: {
      courier: { type: String, default: '' },
      trackingNumber: { type: String, default: '' },
      trackingUrl: { type: String, default: '' },
      shippedAt: { type: Date },
      deliveredAt: { type: Date },
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String, default: '' },
        updatedBy: { type: String, default: 'System' },
      },
    ],
    internalNotes: { type: String, default: '' },
    returnReason: { type: String, default: '' },
    returnStatus: {
      type: String,
      enum: ['none', 'requested', 'approved', 'rejected', 'refunded'],
      default: 'none',
    },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;

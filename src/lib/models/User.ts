import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'customer' | 'superadmin' | 'admin' | 'product_manager' | 'order_manager' | 'inventory_manager' | 'support';
  avatar?: string;
  isActive: boolean;
  addresses: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    state: string;
    pinCode: string;
    isDefault?: boolean;
  }[];
  wishlist: string[];
  totalSpent: number;
  totalOrders: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    role: {
      type: String,
      enum: ['customer', 'superadmin', 'admin', 'product_manager', 'order_manager', 'inventory_manager', 'support'],
      default: 'customer',
    },
    avatar: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    addresses: [
      {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String, default: '' },
        landmark: { type: String, default: '' },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pinCode: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
    wishlist: [{ type: String }],
    totalSpent: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

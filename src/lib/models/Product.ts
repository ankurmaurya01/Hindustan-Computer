import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  barcode?: string;
  brand: string;
  category: string;
  subcategory?: string;
  shortDescription: string;
  description: string;
  images: string[];
  mrp: number;
  sellingPrice: number;
  purchasePrice: number;
  discountPercentage: number;
  gstPercentage: number;
  stock: number;
  lowStockThreshold: number;
  weight?: string;
  dimensions?: string;
  warranty: string;
  specifications: { group?: string; key: string; value: string }[];
  highlights: string[];
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  isTrending?: boolean;
  isActive: boolean;
  rating: number;
  numReviews: number;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    barcode: { type: String, default: '' },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, lowercase: true, trim: true },
    subcategory: { type: String, default: '' },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    mrp: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    purchasePrice: { type: Number, default: 0 },
    discountPercentage: { type: Number, default: 0 },
    gstPercentage: { type: Number, default: 18 },
    stock: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    weight: { type: String, default: '' },
    dimensions: { type: String, default: '' },
    warranty: { type: String, default: '1 Year Manufacturer Warranty' },
    specifications: [
      {
        group: { type: String, default: 'General' },
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    highlights: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 4.5 },
    numReviews: { type: Number, default: 0 },
    tags: [{ type: String }],
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;

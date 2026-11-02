import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBanner extends Document<string> {
  _id: string;
  title: string;
  subtitle: string;
  badge?: string;
  image: string;
  buttonText: string;
  link: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    _id: { type: String, default: () => 'ban_' + Date.now() },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    badge: { type: String, default: '' },
    image: { type: String, required: true },
    buttonText: { type: String, default: 'Shop Now' },
    link: { type: String, default: '/products' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Banner: Model<IBanner> =
  mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);

export default Banner;

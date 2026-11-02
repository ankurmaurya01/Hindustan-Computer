import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISetting extends Document<string> {
  _id: string;
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  salesEmail: string;
  gstin: string;
  panNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  shippingCharge: number;
  freeShippingThreshold: number;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  enableCod: boolean;
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    twitter: string;
    discord: string;
  };
  announcement: string;
  returnPolicy: string;
  privacyPolicy: string;
  terms: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    _id: { type: String, default: 'store_settings' },
    storeName: { type: String, default: 'Hindustan Computer' },
    tagline: { type: String, default: "India's Premier Gaming & IT Hardware Destination" },
    phone: { type: String, default: '+91 99359 08565' },
    whatsapp: { type: String, default: '+919935908565' },
    email: { type: String, default: 'contact@hindustancomputer.com' },
    salesEmail: { type: String, default: 'contact@hindustancomputer.com' },
    gstin: { type: String, default: '' },
    panNumber: { type: String, default: '' },
    address: { type: String, default: 'Dohrighat Road, Near Bus Stand, Dohrighat' },
    city: { type: String, default: 'Dohrighat' },
    state: { type: String, default: 'Uttar Pradesh' },
    pincode: { type: String, default: '275303' },
    shippingCharge: { type: Number, default: 99 },
    freeShippingThreshold: { type: Number, default: 1999 },
    razorpayKeyId: { type: String, default: 'rzp_test_hindustan_computer' },
    razorpayKeySecret: { type: String, default: 'test_secret_hc_secure_9876' },
    enableCod: { type: Boolean, default: true },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com/hindustancomputer' },
      instagram: { type: String, default: 'https://instagram.com/hindustancomputer' },
      youtube: { type: String, default: 'https://youtube.com/@hindustancomputer' },
      twitter: { type: String, default: 'https://twitter.com/hindustanpc' },
      discord: { type: String, default: 'https://discord.gg/hindustancomputer' },
    },
    announcement: {
      type: String,
      default: '📞 Computer repair, Windows installation, printer ink & accessories | WhatsApp: +91 99359 08565 | Dohrighat, UP',
    },
    returnPolicy: { type: String, default: '' },
    privacyPolicy: { type: String, default: '' },
    terms: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Setting: Model<ISetting> =
  mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);

export default Setting;

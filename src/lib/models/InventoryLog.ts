import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInventoryLog extends Document<string> {
  _id: string;
  productId: string;
  productName: string;
  sku: string;
  changeType: 'STOCK_IN' | 'STOCK_OUT' | 'ORDER_DEDUCT' | 'ORDER_RESTORE' | 'DAMAGE_WRITE_OFF' | 'MANUAL_ADJUST';
  quantityChanged: number; // positive or negative
  previousStock: number;
  newStock: number;
  reason: string;
  referenceId?: string; // Order ID or Invoice No
  supplierName?: string;
  performedBy: string;
  createdAt: Date;
}

const InventoryLogSchema = new Schema<IInventoryLog>(
  {
    _id: { type: String, default: () => 'inv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6) },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    changeType: {
      type: String,
      enum: ['STOCK_IN', 'STOCK_OUT', 'ORDER_DEDUCT', 'ORDER_RESTORE', 'DAMAGE_WRITE_OFF', 'MANUAL_ADJUST'],
      required: true,
    },
    quantityChanged: { type: Number, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    reason: { type: String, required: true },
    referenceId: { type: String, default: '' },
    supplierName: { type: String, default: '' },
    performedBy: { type: String, default: 'Admin' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const InventoryLog: Model<IInventoryLog> =
  mongoose.models.InventoryLog || mongoose.model<IInventoryLog>('InventoryLog', InventoryLogSchema);

export default InventoryLog;

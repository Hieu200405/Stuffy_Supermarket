import mongoose, { Document, Schema } from 'mongoose';

export interface IDiscountRule extends Document {
  name: string;
  tenantId: string;
  logic: any; // JSON Logic object
  discountType: 'percentage' | 'fixed' | 'free_item';
  discountValue: number;
  priority: number;
  isActive: boolean;
}

const ruleSchema = new Schema<IDiscountRule>({
  name: { type: String, required: true },
  tenantId: { type: String, required: true, default: 'default_store' },
  logic: { type: Object, required: true },
  discountType: { type: String, enum: ['percentage', 'fixed', 'free_item'], required: true },
  discountValue: { type: Number, required: true },
  priority: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IDiscountRule>('DiscountRule', ruleSchema);

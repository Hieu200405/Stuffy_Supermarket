import mongoose, { Document, Schema } from 'mongoose';

export interface IPaymentTrace extends Document {
  idempotencyKey: string;
  tenantId: string;
  status: 'pending' | 'completed' | 'failed';
  responseBody: any;
  createdAt: Date;
}

const traceSchema = new Schema<IPaymentTrace>({
  idempotencyKey: { type: String, required: true, unique: true },
  tenantId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  responseBody: { type: Object },
  createdAt: { type: Date, default: Date.now, expires: '24h' } // Cache traces for 24 hours
});

export default mongoose.model<IPaymentTrace>('PaymentTrace', traceSchema);

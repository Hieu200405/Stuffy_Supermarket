import mongoose from 'mongoose';

const mfeVersionSchema = new mongoose.Schema({
  version: { type: String, required: true },
  url: { type: String, required: true },
  deployedAt: { type: Date, default: Date.now },
  description: { type: String }
});

const mfeModuleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., 'product', 'marketing', 'store'
  activeUrl: { type: String, required: true }, // Current active remoteEntry.js URL
  versions: [mfeVersionSchema]
}, { timestamps: true });

const MfeModule = mongoose.model('MfeModule', mfeModuleSchema);

export default MfeModule;

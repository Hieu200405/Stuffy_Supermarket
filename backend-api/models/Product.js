const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: "A really great tech product." },
  image: { type: String, default: "https://via.placeholder.com/150/6366f1/ffffff?text=New+Item" },
  category: { type: String, required: true, default: "Uncategorized" },
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  reviews: [reviewSchema]
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: "A really great tech product." },
  image: { type: String, default: "https://via.placeholder.com/150/6366f1/ffffff?text=New+Item" }
});

module.exports = mongoose.model('Product', ProductSchema);

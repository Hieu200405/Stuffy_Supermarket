const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: "https://via.placeholder.com/150/6366f1/ffffff?text=Món+Mới" }
});

module.exports = mongoose.model('Product', ProductSchema);

const mongoose = require('mongoose');
const Product = require('./models/Product');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/stuffy_db';

const vipProducts = [
  { name: "MacBook Pro M3 Max", price: 3499, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80" },
  { name: "Kính Apple Vision Pro Cao Cấp", price: 3499, image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=500&q=80" },
  { name: "Tai nghe Sony WH-1000XM5", price: 398, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80" },
  { name: "Máy chơi game PlayStation 5", price: 499, image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80" },
  { name: "Bàn phím cơ Keychron Q1 Pro", price: 199, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80" },
  { name: "Chuột đồ họa Logitech MX Master 3S", price: 99, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80" },
  { name: "Cam hành trình GoPro Hero 12", price: 399, image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80" },
  { name: "Loa Bluetooth Marshall Stanmore III", price: 379, image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80" }
];

async function seedDB() {
  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed] Connected to MongoDB.');
    await Product.deleteMany({});
    console.log('[Seed] Existing products cleared.');
    await Product.insertMany(vipProducts);
    console.log('[Seed] Successfully inserted 8 products.');
    mongoose.connection.close();
  } catch (error) {
    console.error('[Seed] Failed to seed database:', error.message);
    process.exit(1);
  }
}

seedDB();

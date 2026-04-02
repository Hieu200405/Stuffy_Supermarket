const mongoose = require('mongoose');
const Product = require('./models/Product');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/stuffy_db';

const vipProducts = [
  { name: "MacBook Pro M3 Max",        price: 3499, description: "Ultimate workstation for programming, design, and heavyweight tasks.", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80" },
  { name: "Apple Vision Pro",          price: 3499, description: "Revolutionary spatial computer that seamlessly blends digital content with your physical space.", image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=500&q=80" },
  { name: "Sony WH-1000XM5",           price: 398,  description: "Industry-leading noise cancellation. Unrivalled high-quality sound.", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80" },
  { name: "PlayStation 5",             price: 499,  description: "Next-gen console gaming with lightning-fast SSD, haptic feedback, and breathtaking immersion.", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80" },
  { name: "Keychron Q1 Pro",           price: 199,  description: "A premium full-metal custom mechanical keyboard with QMK/VIA support.", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80" },
  { name: "Logitech MX Master 3S",     price: 99,   description: "Iconic ergonomic mouse, now with 8K DPI sensor and Quiet Clicks.", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80" },
  { name: "GoPro Hero 12",             price: 399,  description: "The ultimate action camera with incredible image quality and hyper-smooth video stabilization.", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80" },
  { name: "Marshall Stanmore III",     price: 379,  description: "Heavyweight bluetooth speaker offering the loud, detailed signature Marshall sound.", image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80" },
  { name: "iPhone 15 Pro Max",         price: 1199, description: "Forged in titanium. Featuring the groundbreaking A17 Pro chip and a stellar camera system.", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80" },
  { name: "Galaxy S24 Ultra",          price: 1299, description: "Galaxy AI is here. Welcome to the era of mobile AI, featuring epic cameras and S Pen experience.", image: "https://images.unsplash.com/photo-1707328224749-6f16ab74ca5d?w=500&q=80" },
  { name: "iPad Pro M4",               price: 999,  description: "Incredibly thin and light design, breakthrough Ultra Retina XDR display, and outrageously fast M4 chip.", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80" },
  { name: "Nintendo Switch OLED",      price: 349,  description: "Play at home or on the go with a vibrant 7-inch OLED screen.", image: "https://images.unsplash.com/photo-1617030514030-fceb2b354391?w=500&q=80" },
  { name: "DJI Mini 4 Pro",            price: 759,  description: "Sub-250g mini drone offering omnidirectional active obstacle sensing and 4K HDR video.", image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=500&q=80" },
  { name: "Anker Prime Power Bank",    price: 129,  description: "High-capacity, ultra-fast charging power bank to keep your devices powered all day.", image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80" },
  { name: "BenQ ScreenBar Halo",       price: 169,  description: "Asymmetrical optical design monitor light with wireless controller and back ambient light.", image: "https://images.unsplash.com/photo-1616428456073-222d4f20ec1b?w=500&q=80" }
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

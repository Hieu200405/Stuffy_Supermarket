const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // HTTP server
const { Server } = require('socket.io'); // Socket.io WebSocket thư viện siêu mạnh
const Product = require('./models/Product');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const { protect, admin } = require('./middleware/auth');

const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({ origin: true, credentials: true })); // Allow all origins for simplicity in this demo, but with credentials
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Nâng cấp App Express thành Server HTTP hỗ trợ đường truyền Socket liên tục 2 chiều
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Đài phát thanh xác nhận người nghe
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  // Nhận mã PIN từ Màn hình Desktop cắm tại siêu thị
  socket.on('JOIN_CART_SESSION', (sessionCode) => {
    socket.join(sessionCode);
    console.log(`[Socket.IO] Desktop joined cart session: ${sessionCode}`);
  });

  // Khi Điện thoại khách hàng Quét Món đồ và bắn sóng lên Server
  socket.on('MOBILE_SCAN_ITEM', ({ sessionCode, product }) => {
    console.log(`[Socket.IO] Mobile scanned "${product.name}" -> session ${sessionCode}`);
    // Dội sóng thẳng xuống đích danh Màn hình Desktop Đủ mã PIN
    io.to(sessionCode).emit('DESKTOP_RECEIVE_ITEM', product);
  });
});

// Flash Sale Real-time Sync
let flashSaleTimeLeft = 24 * 60 * 60; // 24 hours
setInterval(() => {
  flashSaleTimeLeft = flashSaleTimeLeft > 0 ? flashSaleTimeLeft - 1 : 24 * 60 * 60;
  io.emit('FLASH_SALE_TICK', flashSaleTimeLeft);
}, 1000);

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/stuffy_db';

mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log('[MongoDB] Connection established successfully.');
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany([
        { name: "MacBook Pro M3 Max", price: 3499, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80" },
        { name: "Apple Vision Pro", price: 3499, image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400&q=80" },
        { name: "Sony WH-1000XM5", price: 398, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80" },
        { name: "PlayStation 5", price: 499, image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80" },
        { name: "Keychron Q1 Pro", price: 199, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&q=80" },
        { name: "Logitech MX Master 3S", price: 99, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80" },
        { name: "GoPro Hero 12", price: 399, image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80" },
        { name: "Loa Marshall Stanmore", price: 379, image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&q=80" }
      ]);
    }
  })
  .catch(err => {
    console.error('[MongoDB] Connection failed. MONGO_URI may be missing or unreachable:', err.message);
  });

app.get('/api/products', async (req, res) => {
  try {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;
    
    // Tìm kiếm theo Category hoặc Tên hoặc Tất cả
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};
      
    const categoryQuery = req.query.category && req.query.category !== 'All' 
      ? { category: req.query.category } 
      : {};

    const count = await Product.countDocuments({ ...keyword, ...categoryQuery });
    const products = await Product.find({ ...keyword, ...categoryQuery })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products: products.map(p => ({ 
        id: p._id.toString(), 
        name: p.name, 
        price: p.price, 
        image: p.image, 
        description: p.description,
        category: p.category,
        rating: p.rating,
        numReviews: p.numReviews
      })),
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (e) { 
    console.error('[GET /api/products] Database query failed:', e.message);
    res.status(500).json({ error: 'Internal server error: failed to retrieve products' }); 
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ id: product._id.toString(), ...product._doc });
  } catch (e) {
    if (e.kind === 'ObjectId') return res.status(404).json({ error: 'Product not found' });
    console.error(`[GET /api/products/${req.params.id}] Failed:`, e.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/products', protect, admin, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    const formatted = { id: newProduct._id.toString(), ...newProduct._doc };
    io.emit('NEW_PRODUCT', formatted);
    res.json(formatted);
  } catch (e) { 
    console.error('[POST /api/products] Failed to create product:', e.message);
    res.status(500).json({ error: 'Internal server error: failed to create product' }); 
  }
});

app.put('/api/products/:id', protect, admin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const formatted = { id: updated._id.toString(), ...updated._doc };
    
    io.emit('PRICE_UPDATED', formatted);
    res.json(formatted);
  } catch (e) { 
    console.error(`[PUT /api/products/${req.params.id}] Failed to update product:`, e.message);
    res.status(500).json({ error: 'Internal server error: failed to update product' }); 
  }
});

app.post('/api/products/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400).json({ error: 'Product already reviewed' });
        return;
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error processing review' });
  }
});

app.delete('/api/products/:id', protect, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    io.emit('PRODUCT_DELETED', req.params.id);
    res.json({ success: true });
  } catch (e) { 
    console.error(`[DELETE /api/products/${'{req.params.id}'}] Failed to delete product:`, e.message);
    res.status(500).json({ error: 'Internal server error: failed to delete product' }); 
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`[Server] Express + Socket.IO listening on port ${PORT}`));

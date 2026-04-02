const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // HTTP server
const { Server } = require('socket.io'); // Socket.io WebSocket thư viện siêu mạnh
const Product = require('./models/Product');

const app = express();
app.use(cors());
app.use(express.json());

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
    const products = await Product.find();
    res.json(products.map(p => ({ id: p._id.toString(), name: p.name, price: p.price, image: p.image })));
  } catch (e) { 
    console.error('[GET /api/products] Database query failed:', e.message);
    res.status(500).json({ error: 'Internal server error: failed to retrieve products' }); 
  }
});

app.post('/api/products', async (req, res) => {
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

app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const formatted = { id: updated._id.toString(), ...updated._doc };
    
    io.emit('PRICE_UPDATED', formatted);
    res.json(formatted);
  } catch (e) { 
    console.error(`[PUT /api/products/${'{req.params.id}'}] Failed to update product:`, e.message);
    res.status(500).json({ error: 'Internal server error: failed to update product' }); 
  }
});

app.delete('/api/products/:id', async (req, res) => {
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

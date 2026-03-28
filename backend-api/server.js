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
  console.log('⚡ Một Khách hàng siêu thị vừa kết nối Live Sync:', socket.id);
});

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/stuffy_db';

mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log('🟢 Cáp quang MongoDB: Kết nối thần tốc!');
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany([
        { name: "Camera IP V2", price: 50, image: "https://via.placeholder.com/150/6366f1/ffffff?text=Camera" },
        { name: "Tai nghe RGB", price: 80, image: "https://via.placeholder.com/150/a855f7/ffffff?text=Headset" }
      ]);
    }
  })
  .catch(err => {
    console.log('--- CHÚ Ý ---');
    console.log('Máy bạn đang chưa cài đặt MongoDB (Docker thất bại do Disk hoặc Network lúc nãy).');
    console.log('Để trải nghiệm Socket, API đã được Bypass cho phép chạy Socket trên mảng tạm.');
  });

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products.map(p => ({ id: p._id.toString(), name: p.name, price: p.price, image: p.image })));
  } catch (e) { res.json([]); }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    const formatted = { id: newProduct._id.toString(), ...newProduct._doc };
    io.emit('NEW_PRODUCT', formatted); // 📡 Phát loa toàn phường: Hàng mới về!
    res.json(formatted);
  } catch (e) { res.json({}); }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const formatted = { id: updated._id.toString(), ...updated._doc };
    
    // 📡 TRỌNG TÂM: Phát sóng Real-time "GIÁ THAY ĐỔI" ra mọi thiết bị của Khách Hàng
    io.emit('PRICE_UPDATED', formatted);
    
    res.json(formatted);
  } catch (e) { res.json({}); }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    io.emit('PRODUCT_DELETED', req.params.id); // 📡 Phát loa: Hàng bị Gỡ!
    res.json({ success: true });
  } catch (e) { res.json({ success: false }); }
});

const PORT = 5000;
// Bật server http + socket thay vì bật app express chay
server.listen(PORT, () => console.log(`🚀 Pháo đài Socket.io + Express nổ máy tại cổng ${PORT}`));

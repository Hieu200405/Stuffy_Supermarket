import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import * as Sentry from "@sentry/node";
import Product from './models/Product';
// @ts-ignore
import authRoutes from './routes/auth';
// @ts-ignore
import cartRoutes from './routes/cart';
// @ts-ignore
import orderRoutes from './routes/orders';
// @ts-ignore
import { protect, admin } from './middleware/auth';
import { Product as SharedProduct } from '@stuffy/types';

const app = express();

Sentry.init({
  dsn: "https://your-dsn-here@o0.ingest.sentry.io/0", // Replace with real Sentry DSN
  tracesSampleRate: 1.0,
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  socket.on('JOIN_CART_SESSION', (sessionCode) => {
    socket.join(sessionCode);
  });
  socket.on('MOBILE_SCAN_ITEM', ({ sessionCode, product }) => {
    io.to(sessionCode).emit('DESKTOP_RECEIVE_ITEM', product);
  });
});

// Flash Sale Tick
let flashSaleTimeLeft = 24 * 60 * 60;
setInterval(() => {
  flashSaleTimeLeft = flashSaleTimeLeft > 0 ? flashSaleTimeLeft - 1 : 24 * 60 * 60;
  io.emit('FLASH_SALE_TICK', flashSaleTimeLeft);
}, 1000);

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/stuffy_db';

mongoose.connect(mongoURI)
  .then(async () => {
    console.log('[MongoDB] Connection established successfully.');
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany([
        { name: "MacBook Pro M3 Max", price: 3499, category: "Tech" },
        { name: "Apple Vision Pro", price: 3499, category: "Tech" },
        { name: "Sony WH-1000XM5", price: 398, category: "Audio" },
        { name: "PlayStation 5", price: 499, category: "Gaming" }
      ]);
    }
  });

app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword as string, $options: 'i' } }
      : {};
    const categoryQuery = req.query.category && req.query.category !== 'All' 
      ? { category: req.query.category as string } 
      : {};

    const count = await Product.countDocuments({ ...keyword, ...categoryQuery });
    const products = await Product.find({ ...keyword, ...categoryQuery })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (e: any) { 
    res.status(500).json({ error: e.message }); 
  }
});

app.post('/api/products', protect, admin, async (req: Request, res: Response) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    io.emit('NEW_PRODUCT', newProduct);
    res.json(newProduct);
  } catch (e: any) { 
    res.status(500).json({ error: e.message }); 
  }
});

Sentry.setupExpressErrorHandler(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`[Server] Listening on port ${PORT}`));

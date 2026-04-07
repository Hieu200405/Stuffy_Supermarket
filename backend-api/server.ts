import "./tracing";
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import * as Sentry from "@sentry/node";
import { schema } from './schema';
import Product from './models/Product';
import { clearCache } from './redis';
import { connectRabbitMQ, pubsub } from './rabbitmq';
import { aiContextSearch } from './ai-search';
import DiscountRule from './models/DiscountRule';
import { DiscountEngine } from './services/DiscountEngine';
import { PaymentService } from './services/PaymentService';
import { AiCopilot } from './services/AiCopilot';
import { ImageGenService } from './services/ImageGenService';
import { getResilientImage } from './services/ResilienceService';
import MfeModule from './models/MfeModule';
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

const apolloServer = new ApolloServer({
  schema,
});

async function startApollo() {
  await apolloServer.start();
  app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(apolloServer) as any);
}

startApollo().catch(err => console.error('Apollo Start Error:', err));

// RabbitMQ Connection & Internal Worker Simulation
connectRabbitMQ().then(() => {
  // Simulate a Heavy Worker: Sync inventory to legacy systems (ERP/WMS)
  pubsub.subscribe('INVENTORY_SYNC', (data) => {
    console.log(`[Worker] 🚀 Heavy Task Started: Syncing product ${data.name} to secondary systems...`);
    // Simulate complex calculation or slow API call (3s delay)
    setTimeout(() => {
        console.log(`[Worker] ✅ Task Completed: Product ${data.name} successfully synced.`);
    }, 3000);
  });
}).catch(console.error);

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

app.post('/api/cart/calculate', async (req: Request, res: Response) => {
  try {
    const tenantId = (req.headers['x-tenant-id'] as string) || 'default_store';
    const { items, total } = req.body;
    
    const result = await DiscountEngine.calculateBestDiscount(tenantId, {
      items,
      total
    });

    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/payments/pay', async (req: Request, res: Response) => {
  try {
    const tenantId = (req.headers['x-tenant-id'] as string) || 'default_store';
    const idempotencyKey = req.headers['x-idempotency-key'] as string;
    
    if (!idempotencyKey) {
        return res.status(400).json({ error: 'Idempotency Key (x-idempotency-key) is required for financial safety.' });
    }

    const { amount, currency = 'usd' } = req.body;
    
    const result = await PaymentService.createPaymentIntent(
      tenantId, 
      amount, 
      currency, 
      idempotencyKey
    );

    res.json(result);
  } catch (e: any) {
    Sentry.captureException(e);
    res.status(500).json({ error: e.message });
  }
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  socket.on('JOIN_TENANT', (tenantId) => {
    socket.join(tenantId);
    console.log(`[Socket.IO] Client ${socket.id} joined tenant: ${tenantId}`);
  });

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

// Dynamic Pricing Engine: Random Flash Sales every 10 seconds
setInterval(async () => {
  try {
    const products = await Product.find({});
    if (products.length === 0) return;
    
    // Pick random product
    const randomIndex = Math.floor(Math.random() * products.length);
    const targetProduct = products[randomIndex];
    
    // Calculate flash price (20-50% discount)
    const discount = 0.5 + Math.random() * 0.3; // 50% to 80% of original
    const newPrice = Math.round(targetProduct.price * discount);
    
    console.log(`[Dynamic Pricing] Flash sale on ${targetProduct.name}: ${targetProduct.price} -> ${newPrice}`);
    
    // Broadcast to specific tenant room (Isolation)
    io.to(targetProduct.tenantId).emit('DYNAMIC_PRICE_UPDATE', {
      productId: targetProduct._id,
      newPrice,
      originalPrice: targetProduct.price,
      message: `🔥 FLASH SALE: ${targetProduct.name} is now $${newPrice}!`
    });
  } catch (err) {
    console.error('[Dynamic Pricing] Error:', err);
  }
}, 10000);

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/stuffy_db';

mongoose.connect(mongoURI)
  .then(async () => {
    console.log('[MongoDB] Connection established successfully.');
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany([
        { name: "MacBook Pro M3 Max", price: 3499, category: "Tech", tenantId: 'default_store' },
        { name: "Apple Vision Pro", price: 3499, category: "Tech", tenantId: 'default_store' },
        { name: "Sony WH-1000XM5", price: 398, category: "Audio", tenantId: 'default_store' },
        { name: "PlayStation 5", price: 499, category: "Gaming", tenantId: 'default_store' }
      ]);
    }

    const ruleCount = await DiscountRule.countDocuments();
    if (ruleCount === 0) {
      await DiscountRule.insertMany([
        { 
          name: 'High Value Enterprise Order', 
          tenantId: 'default_store', 
          logic: { ">": [{ "var": "total" }, 1500] }, 
          discountType: 'percentage', 
          discountValue: 15,
          priority: 10
        },
        { 
          name: 'Tech Enthusiast Weekend', 
          tenantId: 'default_store', 
          logic: { 
            "and": [
              { "==": [{ "var": "dayOfWeek" }, 6] },
              { "var": "hasTech" }
            ]
          }, 
          discountType: 'fixed', 
          discountValue: 100,
          priority: 5
        }
      ]);
      console.log('[Seed] Advanced Discount Rules configured.');
    }

    const mfeCount = await MfeModule.countDocuments();
    if (mfeCount === 0) {
      await MfeModule.insertMany([
        { 
          name: 'store', 
          activeUrl: 'https://stuffy-store-app.onrender.com/remoteEntry.js',
          versions: [{ version: '1.0.0', url: 'https://stuffy-store-app.onrender.com/remoteEntry.js' }]
        },
        { 
          name: 'header', 
          activeUrl: 'https://stuffy-header-app.onrender.com/remoteEntry.js',
          versions: [{ version: '1.0.0', url: 'https://stuffy-header-app.onrender.com/remoteEntry.js' }]
        },
        { 
          name: 'product', 
          activeUrl: 'https://stuffy-product-app.onrender.com/remoteEntry.js',
          versions: [{ version: '1.0.0', url: 'https://stuffy-product-app.onrender.com/remoteEntry.js' }]
        }
      ]);
      console.log('[Seed] MFE Registry initialized.');
    }
  });

app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const tenantId = (req.headers['x-tenant-id'] as string) || 'default_store';
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword as string, $options: 'i' } }
      : {};
    const categoryQuery = req.query.category && req.query.category !== 'All' 
      ? { category: req.query.category as string } 
      : {};

    const query = { ...keyword, ...categoryQuery, tenantId };

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
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

app.get('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Track user behavior for Recommendations (Collaborative Filtering)
    const userId = (req.headers['x-user-id'] as string) || 'guest_' + req.ip;
    pubsub.publish('user_behavior_tracking', { userId, productId: product._id });

    res.json(product);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/ai/context-search', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    const result = await aiContextSearch(query);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/ai/copilot/chat', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    const tenantId = (req.headers['x-tenant-id'] as string) || 'default_store';
    
    const result = await AiCopilot.handleChat(query, tenantId);
    
    res.json(result);
  } catch (e: any) {
    Sentry.captureException(e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/marketing/dynamic-visual', async (req: Request, res: Response) => {
  try {
    const { productName, theme = 'bright' } = req.query;
    if (!productName) return res.status(400).json({ error: 'productName is required' });

    const imageUrl = await ImageGenService.generateThemedVisual(productName as string, theme as any);
    res.json({ imageUrl });
  } catch (e: any) {
    Sentry.captureException(e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/images/proxy', async (req: Request, res: Response) => {
  try {
    const { url, w = '800', q = '80' } = req.query;
    if (!url) return res.status(400).json({ error: 'url is required' });

    const result = await getResilientImage(url as string, parseInt(w as string), parseInt(q as string));
    
    if (typeof result === 'string') {
        // Circuit is OPEN or fallback triggered -> Serving Placeholder URL
        return res.redirect(result);
    }
    
    // Circuit is CLOSED -> Serving binary optimized data from Image-Service
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.send(result);
  } catch (e: any) {
    Sentry.captureException(e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/registry/manifest', async (req: Request, res: Response) => {
  try {
    const modules = await MfeModule.find({});
    const manifest: Record<string, string> = {};
    modules.forEach(m => {
      manifest[m.name] = m.activeUrl;
    });
    res.json(manifest);
  } catch (e: any) {
    Sentry.captureException(e);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/registry/switch-version', admin, async (req: Request, res: Response) => {
  try {
    const { name, version } = req.body;
    const mfe = await MfeModule.findOne({ name });
    if (!mfe) return res.status(404).json({ message: 'MFE not found' });

    const target = mfe.versions.find(v => v.version === version);
    if (!target) return res.status(400).json({ message: 'Version not found' });

    mfe.activeUrl = target.url;
    await mfe.save();
    
    // Invalidate manifest cache
    await clearCache('manifest');
    
    res.json({ message: `Successfully switched ${name} to ${version}`, activeUrl: mfe.activeUrl });
  } catch (e: any) {
    Sentry.captureException(e);
  }
});

app.post('/api/products', protect, admin, async (req: any, res: Response) => {
  try {
    const newProduct = new Product({
        ...req.body,
        tenantId: req.tenantId
    });
    await newProduct.save();
    await clearCache('products:*'); // Invalidate listed products
    
    // Async heavy tasks via Message Broker
    pubsub.publish('INVENTORY_SYNC', newProduct);
    pubsub.publish('EMAIL_NOTIFICATIONS', { to: 'admin@stuffy.com', body: `New Product Added: ${newProduct.name}` });

    io.emit('NEW_PRODUCT', newProduct);
    res.json(newProduct);
  } catch (e: any) { 
    res.status(500).json({ error: e.message }); 
  }
});

Sentry.setupExpressErrorHandler(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`[Server] Listening on port ${PORT}`));

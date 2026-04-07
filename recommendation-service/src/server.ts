import express from 'express';
import { createClient } from 'redis';
import amqp from 'amqplib';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const RABBIT_URL = process.env.RABBIT_URL || 'amqp://localhost';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stuffy_db';

const redis = createClient({ url: REDIS_URL });
redis.connect();

// 1. RECOMMENDATION ENGINE (Collaborative Filtering Logic)
async function trackInteraction(userId: string, productId: string) {
    console.log(`[Recom] 📈 Tracking click for User ${userId} on Product ${productId}`);
    
    // Simple Collaborative Filtering: 
    // If we view Product A, what else have OTHER users viewed alongside it?
    // We store the 'User -> [Products]' set in Redis.
    await redis.sAdd(`user_views:${userId}`, productId);
    
    // We also correlate the current product with any previously viewed by this user
    const userHistory = await redis.sMembers(`user_views:${userId}`);
    for (const historicId of userHistory) {
        if (historicId !== productId) {
            // "People who viewed P1 also viewed P2"
            await redis.zIncrBy(`correlations:${productId}`, 1, historicId);
            await redis.zIncrBy(`correlations:${historicId}`, 1, productId);
        }
    }
}

// 2. RABBITMQ CONSUMER (Real-time Event Processing)
async function startConsumer() {
    try {
        const conn = await amqp.connect(RABBIT_URL);
        const channel = await conn.createChannel();
        const queue = 'user_behavior_tracking';
        
        await channel.assertQueue(queue, { durable: true });
        console.log(`[Recom] 🐰 Listening for behaviors on: ${queue}`);

        channel.consume(queue, (msg) => {
            if (msg) {
                const { userId, productId } = JSON.parse(msg.content.toString());
                trackInteraction(userId, productId);
                channel.ack(msg);
            }
        });
    } catch (err) { console.error('[RabbitMQ] Error:', err); }
}

// 3. RECOMMENDATION API
app.get('/api/recommendations/:id', async (req, res) => {
    const productId = req.params.id;
    // Get Top 4 correlated products from Redis Sorted Set
    const recommendations = await redis.zRangeWithScores(`correlations:${productId}`, 0, 3, { REV: true });
    
    // In a real app, we'd fetch names/images from DB here or provide IDs
    res.json({
        productId,
        suggested: recommendations.map(r => ({ id: r.value, score: r.score }))
    });
});

const PORT = 3010;
app.listen(PORT, () => {
    console.log(`[Recom] 🚀 Recommendation Microservice is LIVE on port ${PORT}`);
    startConsumer();
});

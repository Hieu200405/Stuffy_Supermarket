import Redis from 'ioredis';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = Number(process.env.REDIS_PORT) || 6379;

const redis = new Redis({
  host: redisHost,
  port: redisPort,
  // Retry strategy for enterprise robustness
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => console.log(`[Redis] Connection to ${redisHost}:${redisPort} established.`));
redis.on('error', (err) => console.error('[Redis] Connection Error:', err));

export const cacheData = async (key: string, data: any, ttl: number = 3600) => {
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttl);
  } catch (err) {
    console.error(`[Redis] Error caching data for key ${key}:`, err);
  }
};

export const getCachedData = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error(`[Redis] Error getting cached data for key ${key}:`, err);
    return null;
  }
};

export const clearCache = async (pattern: string) => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[Redis] Cleared ${keys.length} keys matching pattern: ${pattern}`);
    }
  } catch (err) {
    console.error(`[Redis] Error clearing cache for pattern ${pattern}:`, err);
  }
};

export default redis;

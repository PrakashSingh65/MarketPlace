import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Redis from 'ioredis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

/**
 * Resilient In-Memory Fallback Cache
 * Used whenever Redis is offline, disconnected, or DNS lookup fails
 */
class MemoryCacheFallback {
  constructor() {
    this.cache = new Map();
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  set(key, value, ttlSeconds) {
    const expiresAt = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { value, expiresAt });
  }

  del(key) {
    this.cache.delete(key);
  }

  delPattern(pattern) {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
  }
}

const memoryFallback = new MemoryCacheFallback();
let redisClient = null;
let isConnected = false;

const host = process.env.REDIS_HOST;
const port = Number(process.env.REDIS_PORT) || 6379;
const password = process.env.REDIS_PASSWORD || undefined;
const username = process.env.REDIS_USER || undefined;

// Initialize ioredis safely if configuration exists
if (host || process.env.REDIS_URL || process.env.REDIS_URI) {
  try {
    const redisConfig = process.env.REDIS_URL || process.env.REDIS_URI || {
      host,
      port,
      username,
      password,
      connectTimeout: 4000,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      lazyConnect: true,
      retryStrategy: (times) => {
        if (times > 3) {
          // Stop aggressive retries to prevent connection spam if host is unreachable
          return null;
        }
        return Math.min(times * 1000, 3000);
      }
    };

    redisClient = new Redis(redisConfig);

    redisClient.on('connect', () => {
      console.log('⚡ [Redis] Connecting to Redis server...');
    });

    redisClient.on('ready', () => {
      isConnected = true;
      console.log('✅ [Redis] Connected and ready for caching!');
    });

    redisClient.on('error', (err) => {
      isConnected = false;
      console.warn('⚠️ [Redis Warning] Connection issue:', err.message, '-> Operating on in-memory TTL fallback.');
    });

    redisClient.on('close', () => {
      isConnected = false;
    });

    // Attempt non-blocking initial connection
    redisClient.connect().catch((err) => {
      isConnected = false;
      console.warn('⚠️ [Redis Init] Could not connect to remote Redis:', err.message, '-> Using memory cache fallback.');
    });
  } catch (err) {
    console.warn('⚠️ [Redis Config Error]:', err.message);
    redisClient = null;
    isConnected = false;
  }
} else {
  console.log('ℹ️ [Redis] No Redis host configured in .env. Running on in-memory TTL cache.');
}

/**
 * Check if active Redis connection exists
 */
export const isRedisConnected = () => isConnected;

/**
 * Get item from cache (Redis or Memory fallback)
 */
export const getCache = async (key) => {
  if (!key) return null;

  if (isConnected && redisClient) {
    try {
      const data = await redisClient.get(key);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch (err) {
      console.warn(`[Cache GET Error for ${key}]:`, err.message);
    }
  }

  // Fallback to in-memory cache
  return memoryFallback.get(key);
};

/**
 * Set item in cache with TTL in seconds
 */
export const setCache = async (key, value, ttlSeconds = 60) => {
  if (!key || value === undefined) return;

  const serialized = JSON.stringify(value);

  // Always write to memory fallback for maximum resilience
  memoryFallback.set(key, value, ttlSeconds);

  if (isConnected && redisClient) {
    try {
      await redisClient.set(key, serialized, 'EX', ttlSeconds);
    } catch (err) {
      console.warn(`[Cache SET Error for ${key}]:`, err.message);
    }
  }
};

/**
 * Delete a specific key from cache
 */
export const deleteCache = async (key) => {
  if (!key) return;

  memoryFallback.del(key);

  if (isConnected && redisClient) {
    try {
      await redisClient.del(key);
    } catch (err) {
      console.warn(`[Cache DEL Error for ${key}]:`, err.message);
    }
  }
};

/**
 * Delete keys matching a pattern (e.g. "products:*", "orders:user:123:*")
 */
export const deleteCachePattern = async (pattern) => {
  if (!pattern) return;

  memoryFallback.delPattern(pattern);

  if (isConnected && redisClient) {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys && keys.length > 0) {
        await redisClient.del(...keys);
      }
    } catch (err) {
      console.warn(`[Cache DEL Pattern Error for ${pattern}]:`, err.message);
    }
  }
};

export default {
  getCache,
  setCache,
  deleteCache,
  deleteCachePattern,
  isRedisConnected,
};

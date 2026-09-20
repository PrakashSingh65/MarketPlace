import { getCache, setCache, deleteCache, deleteCachePattern } from '../config/redis.js';

/**
 * Cache TTL Configuration (in seconds)
 * Different expiration times for each route group:
 * - Products: 10 minutes (600s) -> high read traffic, infrequent changes
 * - Orders: 3 minutes (180s) -> moderate updates, transactional
 * - Cart: 30 seconds (30s) -> frequent updates, user-scoped
 */
export const CACHE_TTL = {
  PRODUCTS: 600, // 10 minutes
  ORDERS: 180,   // 3 minutes
  CART: 30,      // 30 seconds
};

/**
 * Higher-order Cache Middleware
 * Intercepts GET requests, serves cached data if found, or caches the response
 */
export const createCacheMiddleware = ({ ttl, keyGenerator, prefix }) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    try {
      const cacheKey = keyGenerator ? keyGenerator(req) : `${prefix}:${req.originalUrl || req.url}`;

      if (!cacheKey) {
        return next();
      }

      const cachedData = await getCache(cacheKey);

      if (cachedData !== null && cachedData !== undefined) {
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Cache-TTL', ttl);
        return res.status(200).json(cachedData);
      }

      // Cache Miss: Hook res.json to capture response body
      res.setHeader('X-Cache', 'MISS');
      res.setHeader('X-Cache-TTL', ttl);

      const originalJson = res.json.bind(res);
      res.json = (body) => {
        // Only cache successful 200/201 responses
        if (res.statusCode >= 200 && res.statusCode < 300 && body) {
          setCache(cacheKey, body, ttl).catch((err) => {
            console.warn(`[Cache Middleware Error] failed to set ${cacheKey}:`, err.message);
          });
        }
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.warn('[Cache Middleware Error]:', err.message);
      next();
    }
  };
};

/**
 * 1. Product Cache Middleware
 * TTL: 600 seconds (10 Minutes)
 */
export const productCacheMiddleware = createCacheMiddleware({
  ttl: CACHE_TTL.PRODUCTS,
  prefix: 'products',
  keyGenerator: (req) => {
    // Single product by ID
    if (req.params?.id) {
      return `products:id:${req.params.id}`;
    }
    // Category products
    if (req.params?.categoryName) {
      const sub = req.query?.subCategory || '';
      return `products:category:${req.params.categoryName.toLowerCase()}:${sub.toLowerCase()}`;
    }
    // Catalog list with query filters
    const queryParams = new URLSearchParams(req.query || {}).toString();
    return `products:list:${queryParams || 'default'}`;
  },
});

/**
 * 2. Cart Cache Middleware
 * TTL: 30 seconds (30s)
 * Scoped specifically to authenticated user's ID
 */
export const cartCacheMiddleware = createCacheMiddleware({
  ttl: CACHE_TTL.CART,
  prefix: 'cart',
  keyGenerator: (req) => {
    const userId = req.user?._id?.toString() || req.userId;
    if (!userId) return null; // Do not cache unauthenticated cart requests
    return `cart:user:${userId}`;
  },
});

/**
 * 3. Order Cache Middleware
 * TTL: 180 seconds (3 Minutes)
 */
export const orderCacheMiddleware = createCacheMiddleware({
  ttl: CACHE_TTL.ORDERS,
  prefix: 'orders',
  keyGenerator: (req) => {
    // Single order by ID
    if (req.params?.id) {
      return `orders:id:${req.params.id}`;
    }
    // All orders (admin view)
    if (req.path.includes('/all')) {
      return 'orders:all';
    }
    // User orders
    const userId = req.user?._id?.toString() || req.params?.userId || req.query?.userId;
    if (userId) {
      return `orders:user:${userId}`;
    }
    return null;
  },
});

/**
 * Cache Invalidation Helpers
 */

/**
 * Invalidate Product Cache (called on add, edit, delete, review)
 */
export const invalidateProductCache = async (productId = null) => {
  try {
    await deleteCachePattern('products:*');
    if (productId) {
      await deleteCache(`products:id:${productId}`);
    }
  } catch (err) {
    console.warn('[Invalidate Product Cache Warning]:', err.message);
  }
};

/**
 * Invalidate Cart Cache (called on add, update, remove, clear)
 */
export const invalidateCartCache = async (userId) => {
  try {
    if (userId) {
      await deleteCache(`cart:user:${userId}`);
    }
  } catch (err) {
    console.warn('[Invalidate Cart Cache Warning]:', err.message);
  }
};

/**
 * Invalidate Order Cache (called on create, update status, cancel)
 */
export const invalidateOrderCache = async (userId = null, orderId = null) => {
  try {
    if (userId) {
      await deleteCache(`orders:user:${userId}`);
    }
    if (orderId) {
      await deleteCache(`orders:id:${orderId}`);
    }
    await deleteCache('orders:all');
  } catch (err) {
    console.warn('[Invalidate Order Cache Warning]:', err.message);
  }
};

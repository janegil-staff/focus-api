const store = new Map();

const rateLimit = (max, windowMs) => (req, res, next) => {
  const key = req.ip || 'unknown';
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return next();
  }
  entry.count++;
  if (entry.count > max) return res.status(429).json({ success: false, error: 'Too many requests' });
  next();
};

export const authLimiter = rateLimit(10, 60_000);
export const apiLimiter  = rateLimit(100, 60_000);

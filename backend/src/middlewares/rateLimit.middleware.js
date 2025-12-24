const rateLimit = require("express-rate-limit");
const env = require("../config/env");

const authLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
});

const messageLimiter = rateLimit({
  windowMs: env.rateLimit.messageWindowMs,
  max: env.rateLimit.messageMax,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, messageLimiter };

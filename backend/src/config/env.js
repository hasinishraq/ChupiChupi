const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return parsed;
};

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: toInt(process.env.PORT, 4000),
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:3000",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  db: {
    host: requireEnv("DB_HOST"),
    port: toInt(process.env.DB_PORT, 3306),
    user: requireEnv("DB_USER"),
    password: process.env.DB_PASSWORD || "",
    name: requireEnv("DB_NAME"),
    connectionLimit: toInt(process.env.DB_POOL_SIZE, 10),
  },
  jwt: {
    secret: requireEnv("JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  security: {
    bcryptSaltRounds: toInt(process.env.BCRYPT_SALT_ROUNDS, 12),
  },
  rateLimit: {
    windowMs: toInt(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    max: toInt(process.env.RATE_LIMIT_MAX, 100),
    messageWindowMs: toInt(process.env.MESSAGE_RATE_LIMIT_WINDOW_MS, 60 * 1000),
    messageMax: toInt(process.env.MESSAGE_RATE_LIMIT_MAX, 5),
  },
};

module.exports = env;

import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/promotions',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-this',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
    path: process.env.UPLOAD_PATH || './uploads',
  },
  integrations: {
    goHighLevel: {
      apiKey: process.env.GOHIGHLEVEL_API_KEY,
      locationId: process.env.GOHIGHLEVEL_LOCATION_ID,
    },
    rampwin: {
      apiKey: process.env.RAMPWIN_API_KEY,
      apiUrl: process.env.RAMPWIN_API_URL,
    },
  },
};

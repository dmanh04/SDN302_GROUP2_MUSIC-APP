const dotenv = require('dotenv');

dotenv.config()

const config = {
  env: process.env.NODE_ENV || "development",
  port: Number.parseInt(process.env.PORT || "3000", 10),
  apiVersion: process.env.API_VERSION || "v1",

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || "*",

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key-change-this",
    expiresIn: process.env.JWT_EXPIRE || "1d",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-change-this",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
  },

  database: {
    mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/zingmp5",
  },
}

module.exports = config;

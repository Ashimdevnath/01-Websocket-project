import { config as dotenvConfig } from "dotenv";

dotenvConfig();

export const PORT = process.env.PORT || 8080;
export const MONGODB_URI = process.env.MONGODB_URI || "";
export const MONGODB_DBNAME = process.env.MONGODB_DBNAME || "";
export const JWT_SECRET: string = process.env.JWT_SECRET || "your-secret-key";
export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "7d";
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];
export const NODE_ENV = process.env.NODE_ENV! || "development";
export const ACCESS_SECRET = process.env.ACCESS_SECRET! || "your-access-secret-key";
export const ACCESS_EXPIRES = process.env.ACCESS_EXPIRES! || "15m";
export const REFRESH_SECRET = process.env.REFRESH_SECRET! || "your-refresh-secret-key";
export const REFRESH_EXPIRES = process.env.REFRESH_EXPIRES! || "30d";


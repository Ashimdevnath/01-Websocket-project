import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { ACCESS_SECRET, ACCESS_EXPIRES, REFRESH_SECRET, REFRESH_EXPIRES } from "../config/env.config";
import { v4 as uuidv4 } from "uuid";
import ms from "ms";

// Define a type for the token payload
export interface RefreshTokenResult {
  token: string;
  jti: string;
}
export interface RefreshTokenPayload {
  userId: string;
  jti?: string;
}

// Helper function to ensure secret is defined
const getSecret = (secret: string | undefined, defaultSecret: string): string => {
  if (!secret || secret === '') {
    console.warn('Using default secret key. In production, please set a strong secret in your environment variables.');
    return defaultSecret;
  }
  return secret;
};

export const signAccessToken = (payload: object): string => {
  const secret = getSecret(ACCESS_SECRET, "your-access-secret-key");
  const options: SignOptions = {expiresIn: ACCESS_EXPIRES as ms.StringValue };
  return jwt.sign(payload, secret, options);
};


export const signRefreshToken = (
  payload: RefreshTokenPayload
): RefreshTokenResult => {
  const secret = getSecret(REFRESH_SECRET, "your-refresh-secret-key");
  const jti = payload.jti || uuidv4();
  const options: SignOptions = { expiresIn: REFRESH_EXPIRES as ms.StringValue };

  return {
    token: jwt.sign({ ...payload, jti }, secret, options),
    jti,
  };
};

export const verifyAccessToken = <T extends JwtPayload>(token: string): T => {
  const secret = getSecret(ACCESS_SECRET, 'your-access-secret-key');
  return jwt.verify(token, secret) as T;
};

export const verifyRefreshToken = <T extends JwtPayload>(token: string): T => {
  const secret = getSecret(REFRESH_SECRET, 'your-refresh-secret-key');
  return jwt.verify(token, secret) as T;
};
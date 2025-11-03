import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.config";

export const generateToken = (payload: object): string => {
  return jwt.sign(
    payload,
    JWT_SECRET as string,
    { expiresIn: JWT_EXPIRES_IN as string } as jwt.SignOptions
  );
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET as string);
};
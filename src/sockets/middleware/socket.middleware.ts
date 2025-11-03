// socket/auth.ts
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env.config";
import { IUser } from "../../types/auth.type";

export const registerSocketAuth = (io: Server) => {
    io.use(async (socket: Socket, next) => {
        try {
            // HandShake Token Check   
            const token =
                socket.handshake.auth?.token || socket.handshake.query?.token;

            if (!token) {
                return next(new Error("Unauthorized: Token missing"));
            }

            // Verify Token and Set User Data
            const payload = jwt.verify(token, JWT_SECRET) as IUser;
            socket.data.user = {
                id: payload.id,
                fullName: payload.fullName,
                email: payload.email,
            };

            // Carrue User Data to Next Middleware
            return next();
        } catch (err) {
            return next(new Error("Unauthorized"));
        }
    });
}

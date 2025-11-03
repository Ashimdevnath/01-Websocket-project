import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { registerSocketAuth } from "./middleware/socket.middleware";
import { registerChatEvents } from "./events/chat.events";
import { registerUserEvents } from "./events/user.events";
import { registerRoomEvents } from "./events/room.events";

export let io: Server | null = null;

export const setupSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            credentials: true,
        },
    });

    registerSocketAuth(io);

    io.on("connection", (socket) => {
        console.log(`🟢 ${socket.data.user?.fullName} connected`);

        // Register modular event handlers
        registerUserEvents(io!, socket);
        registerRoomEvents(io!, socket);
        registerChatEvents(io!, socket);

        socket.on("disconnect", () => {
            console.log(`🔴 ${socket.data.user?.fullName} disconnected`);
        });
    });
};

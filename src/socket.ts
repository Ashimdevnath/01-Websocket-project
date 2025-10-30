import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

let io: Server | null = null;

export const setupSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);
    io.emit("serverAnnouncement", {
      message: `${socket.id} joined!`,
    });

    socket.on("sendMessage", (data) => {
      console.log("Message received:", data);
      socket.broadcast.emit("userConnected", {
        message: data,
        from: socket.id,
      });
      socket.emit("receiveMessage", {
        message: data.message,
        status: "Delivered",
      });
    });


    socket.on("joinRoom", (roomName) => {
      socket.join(roomName);
      console.log(`User ${socket.id} joined room: ${roomName}`);
      socket.emit("roomJoined", { room: roomName });
    });

    socket.on("sendRoomMessage", ({ roomName, message }) => {
      console.log(`Message to room ${roomName}:`, message);
      io.to(roomName).emit("roomMessage", {
        from: socket.id,
        message,
      });
      
    });

    
    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
    });
  });
};

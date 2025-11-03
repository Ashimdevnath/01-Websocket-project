"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserEvents = void 0;
const onlineUsers = new Map();
const registerUserEvents = (io, socket) => {
    const user = socket.data.user;
    onlineUsers.set(user.id, socket.id);
    socket.broadcast.emit("userOnline", { userId: user.id });
    socket.on("disconnect", () => {
        onlineUsers.delete(user.id);
        socket.broadcast.emit("userOffline", { userId: user.id });
    });
};
exports.registerUserEvents = registerUserEvents;

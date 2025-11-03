"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoomEvents = void 0;
const registerRoomEvents = (io, socket) => {
    const user = socket.data.user;
    socket.on("join", (roomName) => {
        if (!roomName)
            return;
        socket.join(roomName);
        console.log(`🟢 ${user.fullName} joined ${roomName}`);
        socket.to(roomName).emit("userJoined", {
            userId: user.id,
            userName: user.fullName,
        });
        socket.emit("joinedRoom", {
            room: roomName,
            message: `You joined ${roomName}`,
        });
    });
    socket.on("leave", (roomName) => {
        socket.leave(roomName);
        socket.to(roomName).emit("userLeft", {
            userId: user.id,
            userName: user.fullName,
        });
        console.log(`🔴 ${user.fullName} left ${roomName}`);
    });
};
exports.registerRoomEvents = registerRoomEvents;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = exports.io = void 0;
const socket_io_1 = require("socket.io");
const socket_middleware_1 = require("./middleware/socket.middleware");
const chat_events_1 = require("./events/chat.events");
const user_events_1 = require("./events/user.events");
const room_events_1 = require("./events/room.events");
exports.io = null;
const setupSocket = (server) => {
    exports.io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            credentials: true,
        },
    });
    (0, socket_middleware_1.registerSocketAuth)(exports.io);
    exports.io.on("connection", (socket) => {
        var _a;
        console.log(`🟢 ${(_a = socket.data.user) === null || _a === void 0 ? void 0 : _a.fullName} connected`);
        // Register modular event handlers
        (0, user_events_1.registerUserEvents)(exports.io, socket);
        (0, room_events_1.registerRoomEvents)(exports.io, socket);
        (0, chat_events_1.registerChatEvents)(exports.io, socket);
        socket.on("disconnect", () => {
            var _a;
            console.log(`🔴 ${(_a = socket.data.user) === null || _a === void 0 ? void 0 : _a.fullName} disconnected`);
        });
    });
};
exports.setupSocket = setupSocket;

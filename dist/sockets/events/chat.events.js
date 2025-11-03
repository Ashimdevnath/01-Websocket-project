"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerChatEvents = void 0;
const chat_model_1 = require("../../models/chat.model");
const getRoomName_1 = require("../utils/getRoomName");
const registerChatEvents = (io, socket) => {
    const user = socket.data.user;
    socket.on("sendMessage", (_a) => __awaiter(void 0, [_a], void 0, function* ({ receiverId, message }) {
        try {
            if (!receiverId || !message)
                return socket.emit("errorMessage", { message: "Receiver and message required" });
            const roomName = (0, getRoomName_1.getRoomName)(user.id, receiverId);
            const chat = yield chat_model_1.ChatModel.create({
                senderId: user.id,
                receiverId,
                text: message,
                isRead: false,
                isDelivered: false,
            });
            io === null || io === void 0 ? void 0 : io.to(roomName).emit("receiveMessage", {
                _id: chat._id,
                text: chat.text,
                senderId: chat.senderId,
                receiverId: chat.receiverId,
                isRead: chat.isRead,
                isDelivered: chat.isDelivered,
            });
            console.log(`💬 ${user.fullName} → ${receiverId}`);
            socket.emit("messageSent", { _id: chat._id });
        }
        catch (err) {
            socket.emit("errorMessage", { message: "Failed to send message" });
        }
    }));
    socket.on("readMessage", (messageId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield chat_model_1.ChatModel.updateOne({ _id: messageId }, { $set: { isRead: true } });
            io.to((0, getRoomName_1.getRoomName)(user.id, receiverId)).emit("messageRead", { messageId });
            console.log(`✅ Message ${messageId} marked as read`);
        }
        catch (err) {
            socket.emit("errorMessage", { message: "Failed to mark message as read" });
        }
    }));
    socket.on("messageDelivered", (messageId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield chat_model_1.ChatModel.updateOne({ _id: messageId }, { $set: { isDelivered: true } });
            io.to((0, getRoomName_1.getRoomName)(user.id, receiverId)).emit("messageDeliveryUpdated", {
                _id: messageId,
                isDelivered: true,
            });
            console.log(`📬 Message ${messageId} marked as delivered`);
        }
        catch (err) {
            socket.emit("errorMessage", { message: "Failed to mark message as delivered" });
        }
    }));
    socket.on("typing", ({ roomName }) => {
        socket.to(roomName).emit("userTyping", { userId: user.id, userName: user.fullName });
    });
    socket.on("stopTyping", ({ roomName }) => {
        socket.to(roomName).emit("userStoppedTyping", { userId: user.id });
    });
    socket.on("getMessages", (receiverId, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const messages = yield chat_model_1.ChatModel.find({
                $or: [
                    { senderId: user.id, receiverId },
                    { senderId: receiverId, receiverId: user.id },
                ],
            }).sort({ createdAt: -1 }).skip(page * limit).limit(limit);
            socket.emit("chatHistory", messages);
        }
        catch (err) {
            socket.emit("errorMessage", { message: "Failed to load chat history" });
        }
    }));
};
exports.registerChatEvents = registerChatEvents;

import { ChatModel } from "../../models/chat.model";
import { getRoomName } from "../utils/getRoomName";
import { IUser } from "../../types/auth.type";
import { Server, Socket } from "socket.io";

export const registerChatEvents = (io: Server, socket: Socket) => {
  const user = socket.data.user as IUser;

  socket.on("sendMessage", async ({ receiverId, message }: { receiverId: string; message: string }) => {
    try {
      if (!receiverId || !message)
        return socket.emit("errorMessage", { message: "Receiver and message required" });

      const roomName = getRoomName(user.id, receiverId);

      const chat = await ChatModel.create({
        senderId: user.id,
        receiverId,
        text: message,
        isRead: false,
        isDelivered: false,
      });

      io?.to(roomName).emit("receiveMessage", {
        _id: chat._id,
        text: chat.text,
        senderId: chat.senderId,
        receiverId: chat.receiverId,
        isRead: chat.isRead,
        isDelivered: chat.isDelivered,
      });
      console.log(`💬 ${user.fullName} → ${receiverId}`);

      socket.emit("messageSent", { _id: chat._id });
    } catch (err) {
      socket.emit("errorMessage", { message: "Failed to send message" });
    }
  });

  socket.on("readMessage", async (messageId: string, receiverId: string) => {
    try {
      await ChatModel.updateOne({ _id: messageId }, { $set: { isRead: true } });
      io.to(getRoomName(user.id, receiverId)).emit("messageRead", { messageId });
      console.log(`✅ Message ${messageId} marked as read`);
    } catch (err) {
      socket.emit("errorMessage", { message: "Failed to mark message as read" });
    }
  });

  socket.on("messageDelivered", async (messageId: string, receiverId: string) => {
    try {
      await ChatModel.updateOne({ _id: messageId }, { $set: { isDelivered: true } });

      io.to(getRoomName(user.id, receiverId)).emit("messageDeliveryUpdated", {
        _id: messageId,
        isDelivered: true,
      });

      console.log(`📬 Message ${messageId} marked as delivered`);
    } catch (err) {
      socket.emit("errorMessage", { message: "Failed to mark message as delivered" });
    }
  });

  socket.on("typing", ({ roomName }) => {
    socket.to(roomName).emit("userTyping", { userId: user.id, userName: user.fullName });
  });

  socket.on("stopTyping", ({ roomName }) => {
    socket.to(roomName).emit("userStoppedTyping", { userId: user.id });
  });

  socket.on("getMessages", async (receiverId: string, page: number, limit: number) => {
    try {
      const messages = await ChatModel.find({
        $or: [
          { senderId: user.id, receiverId },
          { senderId: receiverId, receiverId: user.id },
        ],
      }).sort({ createdAt: -1 }).skip(page * limit).limit(limit);

      socket.emit("chatHistory", messages);
    } catch (err) {
      socket.emit("errorMessage", { message: "Failed to load chat history" });
    }
  });
};

import { Server, Socket } from "socket.io";
import { IUser } from "../../types/auth.type";

const onlineUsers = new Map<string, string>();

export const registerUserEvents = (io: Server, socket: Socket) => {
  const user = socket.data.user as IUser;

  onlineUsers.set(user.id, socket.id);
  socket.broadcast.emit("userOnline", { userId: user.id });

  socket.on("disconnect", () => {
    onlineUsers.delete(user.id);
    socket.broadcast.emit("userOffline", { userId: user.id });
  });
};

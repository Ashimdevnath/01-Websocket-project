import { Server, Socket } from "socket.io";
import { IUser } from "../../types/auth.type";

export const registerRoomEvents = (io: Server, socket: Socket) => {
  const user = socket.data.user as IUser;

  socket.on("join", (roomName: string) => {
    if (!roomName) return;

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

  socket.on("leave", (roomName: string) => {
    socket.leave(roomName);
    socket.to(roomName).emit("userLeft", {
      userId: user.id,
      userName: user.fullName,
    });
    console.log(`🔴 ${user.fullName} left ${roomName}`);
  });
};

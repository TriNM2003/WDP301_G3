const { Server } = require("socket.io");
const config = require("../configs/socket-io.config"); // Import file config

let io;

const setupSocket = (server) => {
  io = new Server(server, {
    cors: config.corsOptions
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Lắng nghe sự kiện join room
    socket.on("joinRoom", (userId) => {
      const roomKey = `${config.roomPrefix}${userId}`;
      socket.join(roomKey);
      console.log(`User ${userId} joined room: ${roomKey}`);

      // Gửi thông báo xác nhận đã join
      socket.emit("roomJoined", roomKey);
    });

    // Nhận tin nhắn và gửi đến room cụ thể
    socket.on("message", ({ userId, message }) => {
      const roomKey = `${config.roomPrefix}${userId}`;
      console.log(`Message from ${userId}: ${message}`);
      
      // Phát tin nhắn đến room của user
      io.to(roomKey).emit("message", { userId, message });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = { setupSocket, getIo: () => io };

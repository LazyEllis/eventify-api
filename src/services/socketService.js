const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const prisma = require("../config/database");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, firstName: true, lastName: true },
      });

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      next();
    } catch {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.id}`);

    socket.on("join-event", (eventId) => {
      socket.join(`event-${eventId}`);
    });

    socket.on("leave-event", (eventId) => {
      socket.leave(`event-${eventId}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { initializeSocket, getIO };

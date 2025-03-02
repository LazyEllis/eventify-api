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
        select: { id: true, firstName: true, lastName: true, role: true },
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

    socket.on("join-event", async (eventId) => {
      try {
        // Check if the user has permission to join this event room
        const event = await prisma.event.findUnique({
          where: { id: eventId },
        });

        if (!event) {
          socket.emit("error", { message: "Event not found" });
          return;
        }

        // Check if user has access to the event (has a valid ticket or is the organizer)
        const hasAccess = await prisma.ticket.findFirst({
          where: {
            eventId,
            userId: socket.user.id,
            status: "VALID",
          },
        });

        if (
          !hasAccess &&
          event.organizerId !== socket.user.id &&
          socket.user.role !== "ADMIN"
        ) {
          socket.emit("error", {
            message: "Not authorized to join this event room",
          });
          return;
        }

        socket.join(`event-${eventId}`);
        socket.emit("joined-event", { eventId });
      } catch {
        socket.emit("error", { message: "Failed to join event room" });
      }
    });

    socket.on("leave-event", (eventId) => {
      socket.leave(`event-${eventId}`);
    });

    // Handle typing events
    socket.on("typing", async ({ eventId, isTyping }) => {
      try {
        // Verify user has permission
        const event = await prisma.event.findUnique({
          where: { id: eventId },
        });

        if (!event) {
          socket.emit("error", { message: "Event not found" });
          return;
        }

        // Check if user has access to the event (has a valid ticket or is the organizer)
        const hasAccess = await prisma.ticket.findFirst({
          where: {
            eventId,
            userId: socket.user.id,
            status: "VALID",
          },
        });

        if (
          !hasAccess &&
          event.organizerId !== socket.user.id &&
          socket.user.role !== "ADMIN"
        ) {
          socket.emit("error", { message: "Not authorized for this event" });
          return;
        }

        // Broadcast to all other clients in the same room that this user is typing
        socket.to(`event-${eventId}`).emit("typing-update", {
          userId: socket.user.id,
          isTyping: isTyping,
          firstName: socket.user.firstName,
          lastName: socket.user.lastName,
        });
      } catch {
        socket.emit("error", { message: "Failed to process typing update" });
      }
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

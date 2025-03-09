const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const prisma = require("../config/database");

let io;

// Helper function to check event access (similar to the middleware)
const checkEventAccess = async (userId, eventId) => {
  // Check if event exists
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    return { access: false, error: "Event not found" };
  }

  // Check if user has access (valid ticket or is organizer)
  const hasAccess = await prisma.ticket.findFirst({
    where: {
      eventId,
      purchaserId: userId,
      status: "VALID",
    },
  });

  if (!hasAccess && event.organizerId !== userId) {
    return { access: false, error: "Not authorized to access this event" };
  }

  return { access: true, event };
};

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

    socket.on("join-event", async (eventId) => {
      try {
        // Use helper function to check access
        const { access, error } = await checkEventAccess(
          socket.user.id,
          eventId,
        );

        if (!access) {
          socket.emit("error", { message: error });
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
        // Use helper function to check access
        const { access, error } = await checkEventAccess(
          socket.user.id,
          eventId,
        );

        if (!access) {
          socket.emit("error", { message: error });
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

const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");
const { getIO } = require("../services/socketService");

const sendMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const eventId = req.event.id;

  // Create message
  const message = await prisma.message.create({
    data: {
      content,
      senderId: req.user.id,
      eventId,
    },
    include: {
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  // Emit the message to all users in the event room
  getIO().to(`event-${eventId}`).emit("new-message", message);

  res.status(201).json(message);
});

const getEventMessages = asyncHandler(async (req, res) => {
  const eventId = req.event.id;

  // Get messages
  const messages = await prisma.message.findMany({
    where: { eventId },
    include: {
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  res.json(messages);
});

module.exports = {
  sendMessage,
  getEventMessages,
};

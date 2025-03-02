const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");
const { NotFoundError, ForbiddenError } = require("../utils/errors");
const { getIO } = require("../services/socketService");

const sendMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const eventId = req.params.id;

  // Check if event exists
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  // Check if user has access to the event (has a valid ticket or is the organizer)
  const hasAccess = await prisma.ticket.findFirst({
    where: {
      eventId,
      userId: req.user.id,
      status: "VALID",
    },
  });

  if (
    !hasAccess &&
    event.organizerId !== req.user.id &&
    req.user.role !== "ADMIN"
  ) {
    throw new ForbiddenError("Not authorized to send messages in this event");
  }

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
  const eventId = req.params.id;

  // Check if event exists
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  // Check if user has access to the event (has a valid ticket or is the organizer)
  const hasAccess = await prisma.ticket.findFirst({
    where: {
      eventId,
      userId: req.user.id,
      status: "VALID",
    },
  });

  if (
    !hasAccess &&
    event.organizerId !== req.user.id &&
    req.user.role !== "ADMIN"
  ) {
    throw new ForbiddenError("Not authorized to view messages in this event");
  }

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

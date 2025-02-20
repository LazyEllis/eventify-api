const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");
const { NotFoundError } = require("../utils/errors");

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

  res.status(201).json(message);
});

const getEventMessages = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  // Check if event exists
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  // Get messages with pagination
  const [messages, total] = await Promise.all([
    prisma.message.findMany({
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
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.message.count({
      where: { eventId },
    }),
  ]);

  res.json({
    messages,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit,
    },
  });
});

module.exports = {
  sendMessage,
  getEventMessages,
};

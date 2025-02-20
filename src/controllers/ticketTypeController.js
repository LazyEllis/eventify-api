const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");
const { NotFoundError, ForbiddenError } = require("../utils/errors");

const createTicketType = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  if (event.organizerId !== req.user.id && req.user.role !== "ADMIN") {
    throw new ForbiddenError("Not authorized to create ticket type");
  }

  const ticketType = await prisma.ticketType.create({
    data: {
      ...req.body,
      eventId: req.params.id,
    },
  });

  res.status(201).json(ticketType);
});

const getTicketTypes = asyncHandler(async (req, res) => {
  const ticketTypes = await prisma.ticketType.findMany({
    where: {
      eventId: req.params.id,
    },
  });

  res.json(ticketTypes);
});

module.exports = {
  createTicketType,
  getTicketTypes,
};

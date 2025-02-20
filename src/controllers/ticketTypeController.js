const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");
const {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} = require("../utils/errors");

const getTicketTypes = asyncHandler(async (req, res) => {
  const ticketTypes = await prisma.ticketType.findMany({
    where: {
      eventId: req.params.id,
    },
  });

  res.json(ticketTypes);
});

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

  // Ensure sale dates are within event dates
  const saleEndDate = new Date(req.body.saleEndDate);
  const eventStartDate = new Date(event.startDate);

  if (saleEndDate > eventStartDate) {
    throw new BadRequestError("Ticket sales must end before event starts");
  }

  const ticketType = await prisma.ticketType.create({
    data: {
      ...req.body,
      eventId: req.params.id,
    },
  });

  res.status(201).json(ticketType);
});

const updateTicketType = asyncHandler(async (req, res) => {
  const ticketType = await prisma.ticketType.findUnique({
    where: { id: req.params.typeId },
    include: { event: true },
  });

  if (!ticketType) {
    throw new NotFoundError("Ticket type not found");
  }

  if (
    ticketType.event.organizerId !== req.user.id &&
    req.user.role !== "ADMIN"
  ) {
    throw new ForbiddenError("Not authorized to update ticket type");
  }

  // Ensure sale dates are within event dates
  const saleEndDate = new Date(req.body.saleEndDate);
  const eventStartDate = new Date(ticketType.event.startDate);

  if (saleEndDate > eventStartDate) {
    throw new BadRequestError("Ticket sales must end before event starts");
  }

  const updatedTicketType = await prisma.ticketType.update({
    where: { id: req.params.typeId },
    data: req.body,
  });

  res.json(updatedTicketType);
});

const deleteTicketType = asyncHandler(async (req, res) => {
  const ticketType = await prisma.ticketType.findUnique({
    where: { id: req.params.typeId },
    include: { event: true },
  });

  if (!ticketType) {
    throw new NotFoundError("Ticket type not found");
  }

  if (
    ticketType.event.organizerId !== req.user.id &&
    req.user.role !== "ADMIN"
  ) {
    throw new ForbiddenError("Not authorized to delete ticket type");
  }

  // Check if there are any tickets sold
  const soldTickets = await prisma.ticket.count({
    where: { ticketTypeId: req.params.typeId },
  });

  if (soldTickets > 0) {
    throw new BadRequestError("Cannot delete ticket type with sold tickets");
  }

  await prisma.ticketType.delete({
    where: { id: req.params.typeId },
  });

  res.status(204).send();
});

module.exports = {
  getTicketTypes,
  createTicketType,

  updateTicketType,
  deleteTicketType,
};

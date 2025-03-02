const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");
const { BadRequestError } = require("../utils/errors");

const getTicketTypes = asyncHandler(async (req, res) => {
  const ticketTypes = await prisma.ticketType.findMany({
    where: {
      eventId: req.params.id,
    },
  });

  res.json(ticketTypes);
});

const createTicketType = asyncHandler(async (req, res) => {
  const event = req.event;

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
  const event = req.event;

  // Ensure sale dates are within event dates
  const saleEndDate = new Date(req.body.saleEndDate);
  const eventStartDate = new Date(event.startDate);

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

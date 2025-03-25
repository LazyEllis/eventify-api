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

  // Get the total quantity of existing ticket types for this event
  const existingTickets = await prisma.ticketType.findMany({
    where: { eventId: req.params.id },
    select: { quantity: true },
  });

  const totalExistingQuantity = existingTickets.reduce(
    (sum, ticket) => sum + ticket.quantity,
    0,
  );

  // Get count of already sold tickets for this event
  const soldTickets = await prisma.ticket.count({
    where: {
      eventId: req.params.id,
      status: { in: ["VALID", "USED"] },
    },
  });

  // Calculate total capacity used (available tickets + sold tickets)
  const totalCapacityUsed = totalExistingQuantity + soldTickets;

  // Calculate if the new ticket type would exceed the event capacity
  const newQuantity = req.body.quantity;
  const totalCapacityAfterAdd = totalCapacityUsed + newQuantity;

  if (totalCapacityAfterAdd > event.capacity) {
    throw new BadRequestError(
      `Cannot exceed event capacity of ${event.capacity}. ` +
        `Currently ${totalExistingQuantity} tickets available, ${soldTickets} tickets sold. ` +
        `Adding ${newQuantity} more would exceed capacity.`,
    );
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
  if (req.body.saleEndDate) {
    const saleEndDate = new Date(req.body.saleEndDate);
    const eventStartDate = new Date(event.startDate);

    if (saleEndDate > eventStartDate) {
      throw new BadRequestError("Ticket sales must end before event starts");
    }
  }

  // If trying to update quantity, check against event capacity
  if (req.body.quantity !== undefined) {
    // Get all other ticket types for this event
    const otherTicketTypes = await prisma.ticketType.findMany({
      where: {
        eventId: req.params.id,
        id: { not: req.params.typeId },
      },
      select: { quantity: true },
    });

    const otherTicketsQuantity = otherTicketTypes.reduce(
      (sum, ticket) => sum + ticket.quantity,
      0,
    );

    // Get count of sold tickets for this event
    const soldTickets = await prisma.ticket.count({
      where: {
        eventId: req.params.id,
        status: { in: ["VALID", "USED"] },
      },
    });

    // Calculate total capacity used (other available tickets + sold tickets)
    const totalCapacityUsed = otherTicketsQuantity + soldTickets;

    // Calculate if the updated ticket type would exceed the event capacity
    const newQuantity = req.body.quantity;
    const totalCapacityAfterUpdate = totalCapacityUsed + newQuantity;

    if (totalCapacityAfterUpdate > event.capacity) {
      throw new BadRequestError(
        `Cannot exceed event capacity of ${event.capacity}. ` +
          `Currently ${otherTicketsQuantity} tickets available from other types, ${soldTickets} tickets sold. ` +
          `Setting this type to ${newQuantity} would exceed capacity.`,
      );
    }
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

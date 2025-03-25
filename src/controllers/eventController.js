const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");
const { NotFoundError, BadRequestError } = require("../utils/errors");

const createEvent = asyncHandler(async (req, res) => {
  const event = await prisma.event.create({
    data: {
      ...req.body,
      organizerId: req.user.id,
    },
  });
  res.status(201).json(event);
});

const getEvents = asyncHandler(async (req, res) => {
  const events = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      organizer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      ticketTypes: true,
    },
  });
  res.json(events);
});

const getUserEvents = asyncHandler(async (req, res) => {
  const events = await prisma.event.findMany({
    where: {
      organizerId: req.user.id,
    },
    include: {
      organizer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      _count: {
        select: {
          tickets: true,
          TicketAssignee: {
            where: {
              attendedAt: {
                not: null,
              },
            },
          },
        },
      },
      ticketTypes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(events);
});

const getEvent = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
    include: {
      organizer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      ticketTypes: true,
    },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  res.json(event);
});

const updateEvent = asyncHandler(async (req, res) => {
  // Check if capacity is being decreased
  if (req.body.capacity !== undefined) {
    const newCapacity = req.body.capacity;

    // Get the current event
    const currentEvent = await prisma.event.findUnique({
      where: { id: req.params.id },
      select: { capacity: true },
    });

    // If capacity is being decreased, we need to check if it would go below
    // the number of tickets already set up or sold
    if (newCapacity < currentEvent.capacity) {
      // Calculate tickets set up for sale
      const ticketTypes = await prisma.ticketType.findMany({
        where: { eventId: req.params.id },
        select: { quantity: true },
      });

      const totalTicketsSetup = ticketTypes.reduce(
        (sum, ticketType) => sum + ticketType.quantity,
        0,
      );

      // Count sold tickets
      const soldTickets = await prisma.ticket.count({
        where: {
          eventId: req.params.id,
          status: { in: ["VALID", "USED"] },
        },
      });

      // Calculate total capacity in use (available tickets + sold tickets)
      const totalCapacityInUse = totalTicketsSetup + soldTickets;

      if (newCapacity < totalCapacityInUse) {
        throw new BadRequestError(
          `Cannot reduce capacity below ${totalCapacityInUse}. ` +
            `You have ${totalTicketsSetup} tickets available and ${soldTickets} tickets sold.`,
        );
      }
    }
  }

  const updatedEvent = await prisma.event.update({
    where: { id: req.params.id },
    data: req.body,
  });

  res.json(updatedEvent);
});

const deleteEvent = asyncHandler(async (req, res) => {
  await prisma.event.delete({
    where: { id: req.params.id },
  });

  res.status(204).send();
});

module.exports = {
  createEvent,
  getEvents,
  getUserEvents,
  getEvent,
  updateEvent,
  deleteEvent,
};

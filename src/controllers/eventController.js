const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");
const { NotFoundError } = require("../utils/errors");

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
  getEvent,
  updateEvent,
  deleteEvent,
};

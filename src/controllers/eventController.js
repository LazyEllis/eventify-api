const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");

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
    return res.status(404).json({ message: "Event not found" });
  }

  res.json(event);
});

const updateEvent = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (event.organizerId !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Not authorized" });
  }

  const updatedEvent = await prisma.event.update({
    where: { id: req.params.id },
    data: req.body,
  });

  res.json(updatedEvent);
});

const deleteEvent = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (event.organizerId !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Not authorized" });
  }

  await prisma.event.delete({
    where: { id: req.params.id },
  });

  res.status(204).send();
});

const getEventCategories = asyncHandler(async (req, res) => {
  const events = await prisma.event.findMany({
    select: {
      category: true,
    },
    distinct: ["category"],
  });

  const categories = events.map((event) => event.category);
  res.json(categories);
});

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getEventCategories,
};

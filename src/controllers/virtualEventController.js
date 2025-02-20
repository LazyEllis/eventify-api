const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");
const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require("../utils/errors");

const getVirtualEventLink = asyncHandler(async (req, res) => {
  const eventId = req.params.id;

  // Check if event exists and is virtual
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  if (!event.isVirtual) {
    throw new BadRequestError("This is not a virtual event");
  }

  // Check if user has a valid ticket
  const hasValidTicket = await prisma.ticket.findFirst({
    where: {
      eventId,
      userId: req.user.id,
      status: "VALID",
    },
  });

  if (!hasValidTicket) {
    throw new ForbiddenError("No valid ticket found for this event");
  }

  res.json({ virtualLink: event.virtualLink });
});

const recordVirtualAttendance = asyncHandler(async (req, res) => {
  const eventId = req.params.id;

  // Check if event exists and is virtual
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  if (!event.isVirtual) {
    throw new BadRequestError("This is not a virtual event");
  }

  // Check if event is ongoing
  const now = new Date();
  if (now < event.startDate || now > event.endDate) {
    throw new BadRequestError("Event is not currently active");
  }

  // Record or update attendance
  const attendance = await prisma.eventAttendee.upsert({
    where: {
      eventId_userId: {
        eventId,
        userId: req.user.id,
      },
    },
    update: {
      attended: true,
      attendedAt: now,
    },
    create: {
      eventId,
      userId: req.user.id,
      attended: true,
      attendedAt: now,
    },
  });

  res.json(attendance);
});

module.exports = {
  getVirtualEventLink,
  recordVirtualAttendance,
};

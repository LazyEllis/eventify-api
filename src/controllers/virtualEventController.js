const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");
const { BadRequestError } = require("../utils/errors");

const getVirtualEventLink = asyncHandler(async (req, res) => {
  const event = req.event;

  if (!event.isVirtual) {
    throw new BadRequestError("This is not a virtual event");
  }

  res.json({ virtualLink: event.virtualLink });
});

const recordVirtualAttendance = asyncHandler(async (req, res) => {
  const event = req.event;

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
        eventId: event.id,
        userId: req.user.id,
      },
    },
    update: {
      attended: true,
      attendedAt: now,
    },
    create: {
      eventId: event.id,
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

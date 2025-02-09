const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");

const getVirtualEventLink = asyncHandler(async (req, res) => {
  const eventId = req.params.id;

  // Check if event exists and is virtual
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (!event.isVirtual) {
    return res.status(400).json({ message: "This is not a virtual event" });
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
    return res
      .status(403)
      .json({ message: "No valid ticket found for this event" });
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
    return res.status(404).json({ message: "Event not found" });
  }

  if (!event.isVirtual) {
    return res.status(400).json({ message: "This is not a virtual event" });
  }

  // Check if event is ongoing
  const now = new Date();
  if (now < event.startDate || now > event.endDate) {
    return res.status(400).json({ message: "Event is not currently active" });
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

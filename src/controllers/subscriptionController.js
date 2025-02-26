const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");
const { NotFoundError, ForbiddenError } = require("../utils/errors");

const subscribeToEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id;

  // Check if event exists
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  // Check if user has access to the event (has a valid ticket or is the organizer)
  const hasAccess = await prisma.ticket.findFirst({
    where: {
      eventId,
      userId: req.user.id,
      status: "VALID",
    },
  });

  if (!hasAccess && event.organizerId !== req.user.id) {
    throw new ForbiddenError("Not authorized to subscribe to this event");
  }

  res.json({ message: "Subscribed to event" });
});

module.exports = { subscribeToEvent };

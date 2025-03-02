const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");
const { NotFoundError, ForbiddenError } = require("../utils/errors");

const validateEventOwnership = asyncHandler(async (req, res, next) => {
  const eventId = req.params.id;

  // Check if event exists
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { organizer: true },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  // Store event in request for later use
  req.event = event;

  // Check if user is authorized (organizer or admin)
  if (event.organizerId !== req.user.id && req.user.role !== "ADMIN") {
    throw new ForbiddenError("Not authorized to manage this event");
  }

  next();
});

module.exports = { validateEventOwnership };

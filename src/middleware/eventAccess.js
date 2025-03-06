const asyncHandler = require("express-async-handler");
const prisma = require("../config/database");
const { NotFoundError, ForbiddenError } = require("../utils/errors");

const validateEventAccess = asyncHandler(async (req, res, next) => {
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

  // Check if user has access (valid ticket or is organizer)
  const hasAccess = await prisma.ticket.findFirst({
    where: {
      eventId,
      userId: req.user.id,
      status: "VALID",
    },
  });

  if (!hasAccess && event.organizerId !== req.user.id) {
    throw new ForbiddenError("Not authorized to access this event");
  }

  next();
});

module.exports = { validateEventAccess };

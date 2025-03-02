const prisma = require("../config/database");

/**
 * Checks and updates status of events that have ended but are still marked as published
 */
const updateCompletedEvents = async () => {
  const now = new Date();

  // Find all published events that have ended
  const endedEvents = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      endDate: {
        lt: now,
      },
    },
  });

  if (endedEvents.length === 0) {
    return { processed: 0 };
  }

  // Update events and tickets in a transaction
  const results = await prisma.$transaction(async (tx) => {
    // Update each event to COMPLETED
    for (const event of endedEvents) {
      await tx.event.update({
        where: { id: event.id },
        data: { status: "COMPLETED" },
      });

      // Expire unused tickets
      await tx.ticket.updateMany({
        where: {
          eventId: event.id,
          status: "VALID",
        },
        data: { status: "EXPIRED" },
      });
    }

    return { processed: endedEvents.length };
  });

  return results;
};

module.exports = { updateCompletedEvents };

const { updateCompletedEvents } = require("../utils/eventStatus");
const asyncHandler = require("express-async-handler");

// This middleware updates event statuses but doesn't block the request
const checkEventStatuses = asyncHandler(async (req, res, next) => {
  // Run status update in background, don't wait for it
  updateCompletedEvents().catch((err) =>
    console.error("Error updating event statuses:", err),
  );
  next();
});

module.exports = { checkEventStatuses };

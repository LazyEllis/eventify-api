const express = require("express");
const {
  getEventAttendees,
  inviteAttendees,
  recordManualAttendance,
  getAttendeeConnections,
} = require("../controllers/attendeeController");
const { protect } = require("../middleware/auth");
const { validateInvite } = require("../middleware/validate");
const { validateEventOwnership } = require("../middleware/eventPermission");

const router = express.Router();

router.get(
  "/events/:id/attendees",
  protect,
  validateEventOwnership,
  getEventAttendees,
);

router.post(
  "/events/:id/attendees/invite",
  protect,
  validateEventOwnership,
  validateInvite,
  inviteAttendees,
);

router.post(
  "/events/:id/record-attendance",
  protect,
  validateEventOwnership,
  recordManualAttendance,
);

router.get("/attendees/connections", protect, getAttendeeConnections);

module.exports = router;

const express = require("express");
const {
  getEventAttendees,
  inviteAttendees,
  getAttendeeConnections,
} = require("../controllers/attendeeController");
const { protect } = require("../middleware/auth");
const { validateInvite } = require("../middleware/validate");

const router = express.Router();

router.get("/events/:id/attendees", protect, getEventAttendees);
router.post(
  "/events/:id/attendees/invite",
  protect,
  validateInvite,
  inviteAttendees,
);
router.get("/attendees/connections", protect, getAttendeeConnections);

module.exports = router;

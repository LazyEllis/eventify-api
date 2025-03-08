const express = require("express");
const {
  getEventAttendees,
  checkInAttendee,
  inviteAttendees,
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
  "/events/:id/attendees/:assigneeId/check-in",
  protect,
  validateEventOwnership,
  checkInAttendee,
);

router.post(
  "/events/:id/attendees/invite",
  protect,
  validateEventOwnership,
  validateInvite,
  inviteAttendees,
);

module.exports = router;

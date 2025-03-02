const express = require("express");
const {
  createEvent,
  getEvents,
  getUserEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protect } = require("../middleware/auth");
const { validateEvent } = require("../middleware/validate");
const { validateEventOwnership } = require("../middleware/eventPermission");
const { checkEventStatuses } = require("../middleware/eventStatus");

const router = express.Router();

router.use(checkEventStatuses);

router.post("/", protect, validateEvent, createEvent);
router.get("/", protect, getEvents);
router.get("/my-events", protect, getUserEvents);
router.get("/:id", protect, getEvent);
router.put("/:id", protect, validateEventOwnership, validateEvent, updateEvent);
router.delete("/:id", protect, validateEventOwnership, deleteEvent);

module.exports = router;

const express = require("express");
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protect } = require("../middleware/auth");
const { validateEvent } = require("../middleware/validate");
const { validateEventOwnership } = require("../middleware/eventPermission");

const router = express.Router();

router.post("/", protect, validateEvent, createEvent);
router.get("/", protect, getEvents);
router.get("/:id", protect, getEvent);
router.put("/:id", protect, validateEventOwnership, validateEvent, updateEvent);
router.delete("/:id", protect, validateEventOwnership, deleteEvent);

module.exports = router;

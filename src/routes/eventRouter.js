const express = require("express");
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getEventCategories,
} = require("../controllers/eventController");
const { protect } = require("../middleware/auth");
const { validateEvent } = require("../middleware/validate");

const router = express.Router();

router.post("/", protect, validateEvent, createEvent);
router.get("/", getEvents);
router.get("/categories", getEventCategories);
router.get("/:id", getEvent);
router.put("/:id", protect, validateEvent, updateEvent);
router.delete("/:id", protect, deleteEvent);

module.exports = router;

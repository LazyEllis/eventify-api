const express = require("express");
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getEventCategories,
  searchEvents,
} = require("../controllers/eventController");
const { protect } = require("../middleware/auth");
const { validateEvent, validateSearch } = require("../middleware/validate");
const { validateEventOwnership } = require("../middleware/eventPermission");

const router = express.Router();

router.post("/", protect, validateEvent, createEvent);
router.get("/", getEvents);
router.get("/categories", getEventCategories);
router.get("/:id", getEvent);
router.put("/:id", protect, validateEventOwnership, validateEvent, updateEvent);
router.delete("/:id", protect, validateEventOwnership, deleteEvent);
router.get("/search", validateSearch, searchEvents);

module.exports = router;

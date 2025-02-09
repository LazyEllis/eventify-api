const express = require("express");
const {
  getVirtualEventLink,
  recordVirtualAttendance,
} = require("../controllers/virtualEventController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/events/:id/virtual-link", protect, getVirtualEventLink);
router.post("/events/:id/virtual-attendance", protect, recordVirtualAttendance);

module.exports = router;

const express = require("express");
const {
  getEventAnalytics,
  getSalesAnalytics,
  getAttendanceAnalytics,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/events/:id/analytics", protect, getEventAnalytics);
router.get("/analytics/sales", protect, getSalesAnalytics);
router.get("/analytics/attendance", protect, getAttendanceAnalytics);

module.exports = router;

const express = require("express");
const {
  getEventAnalytics,
  getSalesAnalytics,
  getAttendanceAnalytics,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/auth");
const { validateEventOwnership } = require("../middleware/eventPermission");

const router = express.Router();

router.get(
  "/events/:id/analytics",
  protect,
  validateEventOwnership,
  getEventAnalytics,
);
router.get("/analytics/sales", protect, getSalesAnalytics);
router.get("/analytics/attendance", protect, getAttendanceAnalytics);

module.exports = router;

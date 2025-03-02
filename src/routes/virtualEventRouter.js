const express = require("express");
const {
  getVirtualEventLink,
  recordVirtualAttendance,
} = require("../controllers/virtualEventController");
const { protect } = require("../middleware/auth");
const { validateEventAccess } = require("../middleware/eventAccess");

const router = express.Router();

router.get(
  "/events/:id/virtual-link",
  protect,
  validateEventAccess,
  getVirtualEventLink,
);
router.post(
  "/events/:id/virtual-attendance",
  protect,
  validateEventAccess,
  recordVirtualAttendance,
);

module.exports = router;

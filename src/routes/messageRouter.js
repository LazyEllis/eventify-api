const express = require("express");
const {
  sendMessage,
  getEventMessages,
} = require("../controllers/messageController");
const { protect } = require("../middleware/auth");
const { validateMessage } = require("../middleware/validate");
const { validateEventAccess } = require("../middleware/eventAccess");

const router = express.Router();

router.post(
  "/events/:id/messages",
  protect,
  validateEventAccess,
  validateMessage,
  sendMessage,
);
router.get(
  "/events/:id/messages",
  protect,
  validateEventAccess,
  getEventMessages,
);

module.exports = router;

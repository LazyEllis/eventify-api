const express = require("express");
const {
  sendMessage,
  getEventMessages,
} = require("../controllers/messageController");
const { protect } = require("../middleware/auth");
const { validateMessage } = require("../middleware/validate");

const router = express.Router();

router.post("/events/:id/messages", protect, validateMessage, sendMessage);
router.get("/events/:id/messages", protect, getEventMessages);

module.exports = router;

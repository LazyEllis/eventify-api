const express = require("express");
const { subscribeToEvent } = require("../controllers/subscriptionController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/events/:id/subscribe", protect, subscribeToEvent);

module.exports = router;

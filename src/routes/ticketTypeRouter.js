const express = require("express");
const {
  createTicketType,
  getTicketTypes,
} = require("../controllers/ticketTypeController");
const { protect } = require("../middleware/auth");
const { validateTicketType } = require("../middleware/validate");

const router = express.Router();

router.post(
  "/events/:id/ticket-types",
  protect,
  validateTicketType,
  createTicketType,
);
router.get("/events/:id/ticket-types", getTicketTypes);

module.exports = router;

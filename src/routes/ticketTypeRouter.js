const express = require("express");
const {
  createTicketType,
  getTicketTypes,
  updateTicketType,
  deleteTicketType,
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
router.put(
  "/events/:id/ticket-types/:typeId",
  protect,
  validateTicketType,
  updateTicketType,
);
router.delete("/events/:id/ticket-types/:typeId", protect, deleteTicketType);

module.exports = router;

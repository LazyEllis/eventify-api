const express = require("express");
const {
  createTicketType,
  getTicketTypes,
  updateTicketType,
  deleteTicketType,
} = require("../controllers/ticketTypeController");
const { protect } = require("../middleware/auth");
const { validateTicketType } = require("../middleware/validate");
const { validateEventOwnership } = require("../middleware/eventPermission");

const router = express.Router();

router.post(
  "/events/:id/ticket-types",
  protect,
  validateEventOwnership,
  validateTicketType,
  createTicketType,
);
router.get("/events/:id/ticket-types", getTicketTypes);
router.put(
  "/events/:id/ticket-types/:typeId",
  protect,
  validateEventOwnership,
  validateTicketType,
  updateTicketType,
);
router.delete(
  "/events/:id/ticket-types/:typeId",
  protect,
  validateEventOwnership,
  deleteTicketType,
);

module.exports = router;

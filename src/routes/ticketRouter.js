const express = require("express");
const {
  createTicketType,
  getTicketTypes,
  purchaseTicket,
  verifyPayment,
  getUserTickets,
  getTicketDetails,
} = require("../controllers/ticketController");
const { protect } = require("../middleware/auth");
const {
  validateTicketType,
  validateTicketPurchase,
} = require("../middleware/validate");

const router = express.Router();

router.post(
  "/events/:id/tickets",
  protect,
  validateTicketType,
  createTicketType,
);
router.get("/events/:id/tickets", getTicketTypes);
router.post("/purchase", protect, validateTicketPurchase, purchaseTicket);
router.get("/verify", protect, verifyPayment);
router.get("/user", protect, getUserTickets);
router.get("/:id", protect, getTicketDetails);

module.exports = router;

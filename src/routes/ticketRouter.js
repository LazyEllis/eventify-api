const express = require("express");
const {
  purchaseTicket,
  verifyPayment,
  getUserTickets,
  getTicketDetails,
} = require("../controllers/ticketController");
const { protect } = require("../middleware/auth");
const { validateTicketPurchase } = require("../middleware/validate");

const router = express.Router();

router.post("/purchase", protect, validateTicketPurchase, purchaseTicket);
router.get("/verify", protect, verifyPayment);
router.get("/user", protect, getUserTickets);
router.get("/:id", protect, getTicketDetails);

module.exports = router;

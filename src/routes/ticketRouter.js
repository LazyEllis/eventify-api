// src/routes/ticketRouter.js
const express = require("express");
const {
  purchaseTicket,
  verifyPayment,
  getUserTickets,
  getTicketDetails,
} = require("../controllers/ticketController");
const { protect } = require("../middleware/auth");
const { validateTicketPurchase } = require("../middleware/validate");
const {
  validatePaymentReference,
} = require("../middleware/transactionValidation");

const router = express.Router();

router.post("/purchase", protect, validateTicketPurchase, purchaseTicket);
router.get("/verify", protect, validatePaymentReference, verifyPayment);
router.get("/user", protect, getUserTickets);
router.get("/:id", protect, getTicketDetails);

module.exports = router;

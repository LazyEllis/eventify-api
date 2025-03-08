const express = require("express");
const {
  purchaseTicket,
  verifyPayment,
  getUserTickets,
  getTicketDetails,
  assignTicket,
  removeTicketAssignment,
} = require("../controllers/ticketController");
const { protect } = require("../middleware/auth");
const {
  validateTicketPurchase,
  validateTicketAssignment,
} = require("../middleware/validate");
const {
  validatePaymentReference,
} = require("../middleware/transactionValidation");

const router = express.Router();

router.post("/purchase", protect, validateTicketPurchase, purchaseTicket);
router.get("/verify", protect, validatePaymentReference, verifyPayment);
router.get("/user", protect, getUserTickets);
router.get("/:id", protect, getTicketDetails);
router.post(
  "/:ticketId/assign",
  protect,
  validateTicketAssignment,
  assignTicket,
);
router.delete("/:ticketId/assign", protect, removeTicketAssignment);

module.exports = router;
